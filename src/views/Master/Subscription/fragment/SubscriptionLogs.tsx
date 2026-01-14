import { useContext, useEffect, useReducer } from 'react'
import { TableColumn } from 'react-data-table-component'
import { Edit, MoreVertical, Plus, RefreshCcw, Sliders } from 'react-feather'
import { useParams } from 'react-router-dom'
import { Button, ButtonGroup, ButtonProps } from 'reactstrap'
import { SubscriptionLogType } from '..'
import { useSubscriptionLogMutation } from '../../../../redux/RTKQuery/SubscriptionRTK'
import { IconSizes } from '../../../../utility/Const'
import Show from '../../../../utility/Show'
import { CF, truncateText } from '../../../../utility/Utils'
import { ThemeColors } from '../../../../utility/context/ThemeColors'
import { FM, log } from '../../../../utility/helpers/common'
import useUser from '../../../../utility/hooks/useUser'
import { stateReducer } from '../../../../utility/stateReducer'
import CustomDataTable, { TableFormData } from '../../../components/CustomDataTable/CustomDataTable'
import LoadingButton from '../../../components/buttons/LoadingButton'
import DropDownMenu from '../../../components/dropdown'
import Header from '../../../components/header'
import { useNoViewModal } from '../../../components/modal/HandleModal'
import Shimmer from '../../../components/shimmers/Shimmer'
import BsTooltip from '../../../components/tooltip'
import FilterSubscriptionLog from './FilterSubscriptionLog'
import AddSubscriptionLog from './SubscriptioinAction'

interface States {
  page?: any
  per_page_record?: any
  changeObject?: any
  search?: any
  reload?: any
  logFilter?: boolean
  isRemoving?: boolean
  isReloading?: boolean
  isAddingNewData?: boolean
  transactionFilter?: boolean
  filterData?: any
  lastRefresh?: any
  edit?: any
}
const SubscriptionLogs = () => {
  const params = useParams()
  const subType = params?.typeID
  const currencySymbol = params?.currency
  const logType = params?.logType
  const user = useUser()
  log(params, 'dsf')
  const initState: States = {
    page: 1,
    logFilter: false,
    lastRefresh: new Date().getTime(),
    per_page_record: 15,
    changeObject: null,
    transactionFilter: false,
    filterData: {
      name: null,
      email: null,
      subscription_terms_select_value: null,
      status: null
    },
    search: undefined,
    edit: null,
    isRemoving: false,
    isReloading: false,
    isAddingNewData: false
  }
  const reducers = stateReducer<States>
  const { colors } = useContext(ThemeColors)
  const [showModal, handleModal] = useNoViewModal()

  const [state, setState] = useReducer(reducers, initState)
  const [loadSubscriptionLogs, { data, isError, isLoading, isSuccess }] =
    useSubscriptionLogMutation()

  const load = () => {
    loadSubscriptionLogs({
      jsonData: {
        ...state?.filterData,
        name: state?.search,
        store_subscription_id: params?.id,
        is_monthly: logType
      },
      page: state?.page,
      per_page_record: state?.per_page_record
    })
  }
  useEffect(() => {
    load()
  }, [
    state?.page,
    state?.per_page_record,
    state?.lastRefresh,
    params?.id,
    state?.search,
    state?.filterData
  ])
  log(subType, 'subn')
  useEffect(() => {
    setState({
      page: 1
    })
  }, [state.per_page_record])
  const handlePageChange = (e: TableFormData) => {
    // log('state change', e)
    setState({ ...e })
  }

  const columns: TableColumn<SubscriptionLogType>[] = [
    {
      name: '#',
      maxWidth: '50px',
      cell: (row, index: any) => {
        // eslint-disable-next-line no-mixed-operators
        return parseInt(state?.per_page_record) * (state?.page - 1) + (index + 1)
      }
    },
    {
      name: <>{FM('store-name')}</>,
      minWidth: '250px',
      //sortable: row => row.full_name,
      cell: (row) => (
        <div className='d-flex align-items-center'>
          <div className='user-info text-truncate'>
            {/* <Link
              state={{ row }}
              to={getPath('admin.subscriptions.log', { id: row?.id })}
              className='d-block'
              id='create-button'
            > */}
            <span className='d-block fw-bold text-truncate'>
              {truncateText(row?.store_subscription?.store_setting?.store_name, 25)}
            </span>
            {/* </Link> */}
          </div>
        </div>
      )
    },

    // {
    //   name: <>{FM('store-email')}</>,
    //   //   minWidth: '250px',
    //   minWidth: '120px',
    //   //sortable: row => row.full_name,
    //   cell: (row) => <span className=''>{row?.store_subscription?.store_setting?.store_email}</span>
    // },
    {
      name: <>{FM('amount')}</>,
      //   minWidth: '250px',
      minWidth: '120px',
      //sortable: row => row.full_name,
      cell: (row) => (
        <span className=''>{CF({ money: Number(row?.amount), currency: row?.currency })}</span>
      )
    },
    {
      name: <>{FM('currency')}</>,
      //   minWidth: '250px',
      minWidth: '120px',
      //sortable: row => row.full_name,
      cell: (row) => <span className=''>{row?.currency}</span>
    },
    {
      name: <>{FM('date')}</>,
      //   minWidth: '250px',
      minWidth: '120px',
      //sortable: row => row.full_name,
      cell: (row) => <span className=''>{row?.amount_received_month}</span>
    },
    {
      name: <>{FM('amount-received')}</>,
      //   minWidth: '250px',
      minWidth: '120px',
      //sortable: row => row.full_name,
      cell: (row) => <span className=''>{row?.amount_received === 1 ? FM('yes') : FM('no')}</span>
    },
    // {
    //   name: <>{FM('email')}</>,
    //   minWidth: '120px',
    //   //   minWidth: '250px',
    //   cell: (row) => <span className=''>{row?.email}</span>
    // },
    // {
    //   name: <>{FM('sub-store-limit')}</>,
    //   minWidth: '120px',
    //   //   minWidth: '250px',
    //   cell: (row) => <span className=''>{row?.sub_store_limit}</span>
    // }
    // {
    //   name: <>{FM('Status')}</>,
    //   minWidth: '100px',
    //   //   sortable: (row) => row.status,
    //   cell: (row) => {
    //     return (
    //       <>
    //         {row?.status === 1 ? (
    //           <Badge color={'light-success'} pill>
    //             <>{FM('active')}</>
    //           </Badge>
    //         ) : (
    //           <Badge color={'light-danger'} pill>
    //             <>{FM('expired')}</>
    //           </Badge>
    //         )}
    //       </>
    //     )
    //   }
    // },

    {
      name: <>{FM('action')}</>,
      allowOverflow: true,
      maxWidth: '10px',
      cell: (row: any) => {
        return (
          <div className='d-flex '>
            <DropDownMenu
              direction='down'
              component={<MoreVertical color={colors.primary.main} size={IconSizes.MenuVertical} />}
              options={[
                {
                  icon: <Edit size={14} />,
                  onClick: () => {
                    handleModal()
                    setState({
                      edit: row
                    })
                  },
                  name: FM('edit')
                }
              ]}
            />
          </div>
        )
      }
    }
  ]
  return (
    <>
      <AddSubscriptionLog
        edit={state?.edit}
        response={(e) => setState({ page: 1, lastRefresh: new Date().getTime() })}
        showModal={showModal}
        storeCurrency={currencySymbol}
        setShowModal={(e) => handleModal()}
        noView
      />
      <FilterSubscriptionLog
        // userType={userType}
        show={state?.logFilter}
        filterData={state.logFilter}
        setFilterData={(e: any) => setState({ filterData: e })}
        handleFilterModal={() => {
          // setPatientFilter(false)
          setState({
            logFilter: false
          })
        }}
      />
      <Header
        goBackTo
        onClickBack={() => history.go(-1)}
        title={
          <>
            {isLoading ? (
              <span style={{ display: 'inline-block' }}>
                <Shimmer style={{ width: 500, height: 24 }} />
              </span>
            ) : (
              truncateText(FM('subscription-log'), 50)
            )}
          </>
        }
      >
        <ButtonGroup color='dark'>
          <Show IF={subType !== '1'}>
            <AddSubscriptionLog<ButtonProps>
              storeCurrency={currencySymbol}
              response={(e) => setState({ page: 1, lastRefresh: new Date().getTime() })}
              Component={Button}
              size='sm'
              color='primary'
            >
              <Plus size='14' />
              <span className='align-middle ms-25'>{FM('add')}</span>
            </AddSubscriptionLog>
          </Show>
          <BsTooltip<ButtonProps>
            Tag={Button}
            onClick={() =>
              setState({
                logFilter: true
              })
            }
            size='sm'
            color='secondary'
            title={FM('filter')}
          >
            <Sliders size='14' />
          </BsTooltip>
          <LoadingButton
            size='sm'
            loading={isLoading}
            color='dark'
            onClick={load}
            title={FM('reload')}
          >
            <RefreshCcw size='14' />
          </LoadingButton>
        </ButtonGroup>
      </Header>
      <>
        {' '}
        <CustomDataTable<SubscriptionLogType>
          initialPerPage={15}
          isLoading={isLoading}
          // options={options}
          //   selectableRows
          columns={columns}
          paginatedData={data}
          // tableData={details?.product_offers}
          handlePaginationAndSearch={handlePageChange}
        />
      </>
    </>
  )
}

export default SubscriptionLogs
