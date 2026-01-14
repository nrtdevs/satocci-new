import { useContext, useEffect, useReducer } from 'react'

import { Activity, BarChart2, Edit, MoreVertical, Trash2 } from 'react-feather'
import { Badge, DropdownItem } from 'reactstrap'
import { ThemeColors } from '../../../utility/context/ThemeColors'

import { getPath } from '../../../router/RouteHelper'
import { IconSizes } from '../../../utility/Const'
import { FM } from '../../../utility/helpers/common'
import ConfirmAlert from '../../../utility/helpers/ConfirmAlert'
import { stateReducer } from '../../../utility/stateReducer'
import { emitAlertStatus } from '../../../utility/Utils'
import CustomDataTable, {
  TableDropDownOptions,
  TableFormData
} from '../../components/CustomDataTable/CustomDataTable'
import DropDownMenu from '../../components/dropdown'
import Header from '../../components/header'

import { TableColumn } from 'react-data-table-component'

import { CardsRequestParams, useLoadCardsQuery } from '../../../redux/RTKQuery/CardsRTK'

interface States {
  page?: any
  per_page_record?: any
  search?: any
  reload?: any
  isAddingNewData?: boolean
}
function CardDetails() {
  //const isAddingNewData = location?.state?.reload ?? false
  const { colors } = useContext(ThemeColors)
  // Local States
  const initState: States = {
    page: 1,
    per_page_record: 15,
    search: undefined,
    isAddingNewData: false
    // reload: reloadID
  }
  const reducers = stateReducer<States>
  const [state, setState] = useReducer(reducers, initState)
  // Load Store Data
  const { data, isLoading, isFetching, refetch } = useLoadCardsQuery({
    jsonData: { name: state?.search },
    page: state?.page,
    per_page_record: state?.per_page_record
  })
  // log('fdtierkg', data)
  useEffect(() => {
    setState({
      page: 1
    })
  }, [state.per_page_record])
  const handlePageChange = (e: TableFormData) => {
    // log('state change', e)
    setState({ ...e })
  }

  //   const reloadData = () => {
  //     refetch()
  //   }

  useEffect(() => {
    if (state.isAddingNewData) {
      refetch()
      window.history.replaceState({}, document.title)
    }
  }, [state.isAddingNewData])

  const columns: TableColumn<CardsRequestParams>[] = [
    {
      name: '#',
      maxWidth: '50px',
      cell: (row, index: any) => {
        // eslint-disable-next-line no-mixed-operators
        return parseInt(state?.per_page_record) * (state?.page - 1) + (index + 1)
      }
    },
    {
      name: FM('card-holder-name'),
      minWidth: '250px',
      //sortable: row => row.full_name,
      cell: (row) => (
        <div className='d-flex align-items-center'>
          <div className='user-info text-truncate'>
            {/* <Link
              state={{ row }}
              to={getPath('admin.stores.details', { id: row?.id })}
              className='d-block'
              id='create-button'
            > */}
            <span className='d-block fw-bold text-truncate'>{row?.card_holder_name}</span>
            {/* </Link> */}
          </div>
        </div>
      )
    },
    {
      name: FM('card-number'),
      //sortable: true,
      minWidth: '250px',
      //sortable: row => row.full_name,
      cell: (row) => (
        <div className='d-flex align-items-center'>
          <div className='user-info text-truncate ms-1'>
            <span className='d-block fw-bold text-truncate'>{row.card_number}</span>
            {/* <small className='status-text'>
              <>
                {FM('phone')} : {row.message}
              </>
            </small> */}
          </div>
        </div>
      )
    },
    {
      name: FM('card-expiry'),
      //sortable: true,
      minWidth: '250px',
      //sortable: row => row.full_name,
      cell: (row) => (
        <div className='d-flex align-items-center'>
          <div className='user-info text-truncate ms-1'>
            <span className='d-block fw-bold text-truncate'>{row.card_expiry}</span>
            {/* <small className='status-text'>
              <>
                {FM('phone')} : {row.message}
              </>
            </small> */}
          </div>
        </div>
      )
    },

    {
      name: <>{FM('card-cvv')}</>,
      minWidth: '150px',
      // sortable: row => row.subscription_type,
      cell: (row) => {
        return (
          <Badge color='primary' pill>
            {row?.card_cvv}
          </Badge>
        )
      }
    },

    {
      name: <>{FM('Status')}</>,
      minWidth: '150px',
      //   sortable: (row) => row.status,
      cell: (row) => {
        return (
          <>
            {row?.status === '1' ? (
              <Badge color={'success'} pill>
                <>{FM('active')}</>
              </Badge>
            ) : (
              <Badge color={'danger'} pill>
                <>{FM('inactive')}</>
              </Badge>
            )}
          </>
        )
      }
    },

    {
      name: <>{FM('actions')}</>,
      allowOverflow: true,
      maxWidth: '10px',
      cell: (row) => {
        return (
          <div className='d-flex '>
            <DropDownMenu
              direction='up'
              component={<MoreVertical color={colors.primary.main} size={IconSizes.MenuVertical} />}
              options={[
                {
                  icon: <Edit size={14} />,
                  state: row,
                  to: { pathname: getPath('admin.stores.update', { id: row?.id }) },
                  name: FM('edit')
                },
                {
                  icon: <Trash2 size={14} />,
                  name: (
                    <ConfirmAlert
                      item={row}
                      title={row?.card_holder_name}
                      color='text-warning'
                      onClickYes={() => emitAlertStatus('success')}
                      //   onSuccessEvent={(e: any) => dispatch(storesDelete([row?.id]))}
                      className=''
                      id={`grid-delete-${row?.id}`}
                    >
                      {FM('move-to-trash')}
                    </ConfirmAlert>
                  )
                }
              ]}
            />
          </div>
        )
      }
    }
  ]

  const options: TableDropDownOptions = (selectedRows) => [
    {
      noWrap: true,
      name: (
        <DropdownItem
          onClick={() => {
            // log(selectedRows?.ids)
          }}
          tag={'span'}
          className='dropdown-item d-flex align-items-center'
        >
          <>
            <Activity size={16} className='me-1' />
            {FM('delete')} ({selectedRows?.selectedCount})
          </>
        </DropdownItem>
      )
    }
  ]

  return (
    <>
      <Header icon={<BarChart2 size='25' />} title={FM('cards')}>
        {/* <ButtonGroup color='dark'>
          <FeedbackModal<ButtonProps>
            response={(e) => setState({ isAddingNewData: e })}
            Component={Button}
            size='sm'
            color='primary'
          >
            <Plus size='14' />
          </FeedbackModal>
          <BsTooltip<ButtonProps> Tag={Button} size='sm' color='dark' title={FM('filter')}>
            <Sliders size='14' />
          </BsTooltip>
          <BsTooltip<ButtonProps>
            Tag={Button}
            size='sm'
            color='primary'
            onClick={reloadData}
            title={FM('reload')}
          >
            <RefreshCcw size='14' />
          </BsTooltip>
        </ButtonGroup> */}
        {/* <ButtonGroup className='ms-1'>
          <TooltipLink
            title={FM('trashed-stores')}
            to={getPath('admin.stores.trashed')}
            className='btn btn-dark btn-sm'
            color='secondary'
          >
            <>
              <Trash size='14' />
              <span className='align-middle ms-25'>{FM('bin')}</span>
            </>
          </TooltipLink>
        </ButtonGroup> */}
      </Header>
      <CustomDataTable<CardsRequestParams>
        initialPerPage={15}
        isLoading={isLoading}
        isFetching={isFetching && !state.isAddingNewData}
        isAddingNewData={state.isAddingNewData && isFetching}
        options={options}
        selectableRows
        columns={columns}
        paginatedData={data}
        handlePaginationAndSearch={handlePageChange}
      />
    </>
  )
}
export default CardDetails
