import { useContext, useEffect, useReducer } from 'react'

import { Activity, RefreshCcw, Star } from 'react-feather'
import { Button, ButtonGroup, ButtonProps, DropdownItem } from 'reactstrap'
import { ThemeColors } from '../../../utility/context/ThemeColors'

import { useLocation } from 'react-router-dom'

import { FM } from '../../../utility/helpers/common'
import { stateReducer } from '../../../utility/stateReducer'
import CustomDataTable, {
  TableDropDownOptions,
  TableFormData
} from '../../components/CustomDataTable/CustomDataTable'
import Header from '../../components/header'

import { TableColumn } from 'react-data-table-component'
import { useLoadOrdersRatingMutation } from '../../../redux/RTKQuery/OrdersRTK'
import { decrypt, truncateText } from '../../../utility/Utils'
import Ratings from '../../components/ratings'
import BsTooltip from '../../components/tooltip'
interface States {
  page?: any
  per_page_record?: any
  search?: any
  reload?: any
  isAddingNewData?: boolean
  lastRefresh?: any
}

export interface orderRatingParams {
  id?: any
  comment?: string | any
  created_at?: string | any
  customer?: any
  order?: any
  order_id?: any
  rating?: any
  store?: any
  store_id?: any
  updated_at?: any
  user_id?: any
}
function OrderRating() {
  const reloadID = new Date().getTime()
  const location: any = useLocation()
  //const isAddingNewData = location?.state?.reload ?? false
  const { colors } = useContext(ThemeColors)
  // Local States
  const initState: States = {
    page: 1,
    per_page_record: 15,
    search: undefined,
    lastRefresh: new Date().getTime(),
    isAddingNewData: false
    // reload: reloadID
  }

  const reducers = stateReducer<States>
  const [state, setState] = useReducer(reducers, initState)
  // Load Store Data
  const [loadFeedback, { data, isLoading }] = useLoadOrdersRatingMutation()

  useEffect(() => {
    loadFeedback({
      jsonData: { email: state?.search },
      page: state?.page,
      per_page_record: state?.per_page_record
    })
  }, [state.page, state.per_page_record, state.search, state.lastRefresh])
  //   const { data, isLoading, isFetching, refetch } = useLoadFeedbackQuery({
  //     jsonData: { email: state?.search },
  //     page: state?.page,
  //     per_page_record: state?.per_page_record
  //   })
  //log('fdtierkg', data)
  useEffect(() => {
    setState({
      page: 1
    })
  }, [state.per_page_record])
  const handlePageChange = (e: TableFormData) => {
    //  log('state change', e)
    setState({ ...e })
  }

  //   const reloadData = () => {
  //     refetch()
  //   }

  useEffect(() => {
    if (state.isAddingNewData) {
      //   refetch()
      window.history.replaceState({}, document.title)
    }
  }, [state.isAddingNewData])

  const columns: TableColumn<orderRatingParams>[] = [
    // {
    //   name: '#',
    //   maxWidth: '0px',
    //   cell: (row, index: any) => {
    //     // eslint-disable-next-line no-mixed-operators
    //     return parseInt(state?.per_page_record) * (state?.page - 1) + (index + 1)
    //   }
    // },
    {
      name: FM('order-number'),
      minWidth: '10px',
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
            <span className='d-block fw-bold text-truncate'>#{row?.order?.order_number}</span>
            {/* </Link> */}
          </div>
        </div>
      )
    },
    {
      name: FM('customer'),
      minWidth: '50px',
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
            <span className='d-block fw-bold text-truncate'>{decrypt(row?.customer?.name)}</span>
            {/* </Link> */}
          </div>
        </div>
      )
    },

    // <Ratings rating={session?.customer?.rating ?? 0} />
    {
      name: FM('store'),
      //sortable: true,
      minWidth: '100px',
      //sortable: row => row.full_name,
      cell: (row) => (
        <>
          <span className='d-block fw-bold text-wrap'>
            {truncateText(row?.store?.store_setting?.store_name, 40)}
          </span>
        </>
      )
    },

    {
      name: FM('rating'),
      minWidth: '100px',
      //sortable: row => row.full_name,
      cell: (row) => (
        <div className='d-flex align-items-center'>
          <div className='user-info text-truncate'>
            {Number(row?.rating) > 0 ? (
              <Ratings rating={Number(row?.rating)} max={5} />
            ) : (
              <span className='d-block fw-bold text-truncate'>{FM('no-rating-available')}</span>
            )}
          </div>
        </div>
      )
    },
    {
      name: FM('comment'),
      //sortable: true,
      minWidth: '100px',
      //sortable: row => row.full_name,
      cell: (row) => (
        <>
          <div className='d-flex align-items-center'>
            <div className='user-info text-truncate text-wrap'>
              <span className='d-block fw-bold text-wrap'>{row.comment}</span>
            </div>
          </div>
        </>
      )
    }
    // {
    //   name: <>{FM('send-coupon')}</>,
    //   minWidth: '150px',
    //   // sortable: row => row.subscription_type,
    //   cell: (row) => {
    //     return (
    //       // <Badge color='primary' pill>
    //       //   {row?.subscription_type}
    //       // </Badge>
    //       <LoadingButton loading={false}>Send</LoadingButton>
    //     )
    //   }
    // }

    // {
    //   name: <>{FM('Status')}</>,
    //   minWidth: '150px',
    //   //   sortable: (row) => row.status,
    //   cell: (row) => {
    //     return (
    //       <>
    //         {row?.status === '1' ? (
    //           <Badge color={'success'} pill>
    //             <>{FM('active')}</>
    //           </Badge>
    //         ) : (
    //           <Badge color={'danger'} pill>
    //             <>{FM('inactive')}</>
    //           </Badge>
    //         )}
    //       </>
    //     )
    //   }
    // },

    // {
    //   name: <>{FM('Actions')}</>,
    //   allowOverflow: true,
    //   maxWidth: '10px',
    //   cell: (row) => {
    //     return (
    //       <div className='d-flex '>
    //         <DropDownMenu
    //           direction='up'
    //           component={<MoreVertical color={colors.primary.main} size={IconSizes.MenuVertical} />}
    //           options={[
    //             {
    //               icon: <Edit size={14} />,
    //               state: row,
    //               to: { pathname: getPath('admin.stores.update', { id: row?.id }) },
    //               name: FM('edit')
    //             },
    //             {
    //               icon: <Trash2 size={14} />,
    //               name: (
    //                 <ConfirmAlert
    //                   item={row}
    //                   title={row?.email}
    //                   color='text-warning'
    //                   onClickYes={() => emitAlertStatus('success')}
    //                   //   onSuccessEvent={(e: any) => dispatch(storesDelete([row?.id]))}
    //                   className=''
    //                   id={`grid-delete-${row?.id}`}
    //                 >
    //                   {FM('move-to-trash')}
    //                 </ConfirmAlert>
    //               )
    //             }
    //           ]}
    //         />
    //       </div>
    //     )
    //   }
    // }
  ]

  const options: TableDropDownOptions = (selectedRows) => [
    {
      noWrap: true,
      name: (
        <DropdownItem
          onClick={() => {
            //   log(selectedRows?.ids)
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
      <Header icon={<Star size='25' />} title={FM('order-rating')}>
        <ButtonGroup color='dark'>
          {/* <FeedbackModal<ButtonProps>
            response={(e) => setState({ isAddingNewData: e })}
            Component={Button}
            size='sm'
            color='primary'
          >
            <Plus size='14' />
          </FeedbackModal> */}
          {/* <BsTooltip<ButtonProps> Tag={Button} size='sm' color='dark' title={FM('filter')}>
            <Sliders size='14' />
          </BsTooltip> */}
          <BsTooltip<ButtonProps>
            Tag={Button}
            size='sm'
            color='dark'
            // onClick={reloadData}
            onClick={() =>
              setState({
                lastRefresh: new Date().getTime(),
                page: 1,
                search: ''
              })
            }
            title={FM('reload')}
          >
            <RefreshCcw size='14' />
          </BsTooltip>
        </ButtonGroup>
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
      <CustomDataTable<orderRatingParams>
        initialPerPage={15}
        isLoading={isLoading}
        // isFetching={isFetching && !state.isAddingNewData}
        // isAddingNewData={state.isAddingNewData && isFetching}
        options={options}
        // selectableRows
        columns={columns}
        paginatedData={data}
        handlePaginationAndSearch={handlePageChange}
      />
    </>
  )
}
export default OrderRating
