import { QueryStatus } from '@reduxjs/toolkit/dist/query'
import { useContext, useEffect, useReducer } from 'react'
import { TableColumn } from 'react-data-table-component'
import { BarChart2, CheckCircle, MoreVertical, RefreshCcw } from 'react-feather'
import { useNavigate } from 'react-router-dom'
import { Badge, ButtonGroup } from 'reactstrap'
import {
  PendingStore,
  useChangeOrderStatusMutation,
  usePendingStoreAmountMutation
} from '../../../redux/RTKQuery/AppSettingsRTK'
import { IconSizes } from '../../../utility/Const'
import { Permissions } from '../../../utility/Permissions'
import { CF, emitAlertStatus } from '../../../utility/Utils'
import { ThemeColors } from '../../../utility/context/ThemeColors'
import ConfirmAlert from '../../../utility/helpers/ConfirmAlert'
import { FM, log } from '../../../utility/helpers/common'
import { stateReducer } from '../../../utility/stateReducer'
import CustomDataTable, {
  TableDropDownOptions,
  TableFormData
} from '../../components/CustomDataTable/CustomDataTable'
import LoadingButton from '../../components/buttons/LoadingButton'
import DropDownMenu from '../../components/dropdown'
import Header from '../../components/header'

interface States {
  page?: any
  per_page_record?: any
  search?: any
  reload?: any
  lastRefresh?: any
  isRemoving?: boolean
  isReloading?: boolean
  isAddingNewData?: boolean
}

function PendingAmount() {
  const { colors } = useContext(ThemeColors)
  const navigate = useNavigate()
  const [loadList, { data, isLoading, isSuccess }] = usePendingStoreAmountMutation()
  const [changeStatus, changeRes] = useChangeOrderStatusMutation()
  // Local States
  const initState: States = {
    page: 1,
    per_page_record: 15,
    lastRefresh: new Date().getTime(),
    search: undefined,
    isRemoving: false,
    isReloading: false,
    isAddingNewData: false
  }

  const reducers = stateReducer<States>
  const [state, setState] = useReducer(reducers, initState)
  // Load Store Data

  useEffect(() => {
    loadList({ page: state.page, per_page_record: state.per_page_record })
  }, [state.lastRefresh, state.page, state.per_page_record, changeRes?.isSuccess])
  const handlePageChange = (e: TableFormData) => {
    setState({ ...e })
  }

  const reloadData = () => {}

  const handleActions = (ids?: any, eventId?: any) => {
    // log('id', id)
    // if (isValid(id)) {
    //   // delete single
    //   deleteStore({
    //     eventId,
    //     id
    //     // originalArgs: resultDelete?.originalArgs
    //   })
    // } else {
    changeStatus({
      ids,
      eventId
    })
    // }
  }
  useEffect(() => {
    if ((changeRes.status = QueryStatus.fulfilled) && changeRes?.isLoading === false) {
      if (changeRes?.isSuccess) {
        emitAlertStatus('success', null, changeRes?.originalArgs?.eventId)
      } else if (changeRes?.error) {
        emitAlertStatus('failed', null, changeRes?.originalArgs?.eventId)
      }
    }
  }, [changeRes])

  let columns: TableColumn<PendingStore>[] = []

  columns = [
    {
      name: FM('order-number'),
      minWidth: '50px',
      cell: (row, index: any) => (
        <div className='d-flex align-items-center'>
          <div className='user-info text-truncate'>
            <span className='d-block fw-bold text-truncate'>{row?.order_number}</span>
          </div>
        </div>
      )
    },
    {
      name: <>{FM('cart-items')}</>,
      minWidth: '50px',
      //sortable: row => row.full_name,
      cell: (row) => (
        <div className='d-flex align-items-center'>
          <div className='user-info text-truncate'>
            <span className='d-block fw-bold text-truncate'>{row?.total_cart_items}</span>
          </div>
        </div>
      )
    },

    {
      name: <>{FM('admin-share')}</>,
      minWidth: '50px',
      // sortable: row => row.subscription_type,
      cell: (row) => {
        return (
          <div className='d-flex align-items-center'>
            <div className='user-info text-truncate'>
              <span className='d-block fw-bold text-truncate'>
                {CF({ money: row?.admin_share, currency: row?.currency })}
              </span>
            </div>
          </div>
        )
      }
    },

    {
      name: <>{FM('store-share')}</>,
      minWidth: '50px',
      // sortable: row => row.subscription_type,
      cell: (row) => {
        return (
          <div className='d-flex align-items-center'>
            <div className='user-info text-truncate'>
              <span className='d-block fw-bold text-truncate'>
                {' '}
                {CF({ money: row?.store_share, currency: row?.currency })}
              </span>
            </div>
          </div>
        )
      }
    },
    {
      name: <>{FM('gateway-charge-Fee')}</>,
      //sortable: true,
      minWidth: '50px',
      //sortable: row => row.full_name,
      cell: (row) => (
        <div className=' align-items-start'>
          <div className='user-info text-truncate me-2'>
            <span className='d-block fw-bold text-truncate'>{row?.gateway_processing_charge}</span>
            <small className='status-text text-dark'>
              <>
                {FM('processing-fee')} :
                {CF({ money: row?.gateway_processing_fee, currency: row?.currency })}
              </>
            </small>
          </div>
        </div>
      )
    },
    {
      name: <>{FM('total')}</>,
      //sortable: true,
      minWidth: '50px',
      //sortable: row => row.full_name,
      cell: (row) => (
        <div className=' align-items-start'>
          <div className='user-info text-truncate me-2'>
            <span className='d-block fw-bold text-truncate'>
              {CF({ money: row?.total_amount, currency: row?.currency })}
            </span>
            <small className='status-text text-dark '>
              <>
                {FM('paid-amount')} : {CF({ money: row?.paid_amount, currency: row?.currency })}
              </>
            </small>
          </div>
        </div>
      )
    },
    {
      name: <>{FM('payment-method')}</>,
      cell: (row) => {
        return (
          <>
            {row?.payment_method === 1 ? (
              <Badge color={'light-success'} pill>
                <>{FM('enfuse')}</>
              </Badge>
            ) : row?.payment_method === 2 ? (
              <Badge color={'light-danger'} pill>
                <>{FM('stripe')}</>
              </Badge>
            ) : row?.payment_method === 3 ? (
              <Badge color={'light-primary'} pill>
                <>{FM('tabby')}</>
              </Badge>
            ) : (
              <Badge color={'light-primary'} pill>
                <>{FM('crypto-wallet')}</>
              </Badge>
            )}
          </>
        )
      }
    },
    {
      name: <>{FM('transfered')}</>,
      minWidth: '50px',
      // sortable: row => row.subscription_type,
      cell: (row) => {
        return (
          <div className='d-flex align-items-center'>
            <div className='user-info text-truncate'>
              <span className='d-block fw-bold text-truncate'>
                {' '}
                {`${row?.is_transferred_to_store}` === '2' ? (
                  <Badge pill color='light-danger'>
                    {FM('no')}
                  </Badge>
                ) : (
                  <Badge pill color='light-success'>
                    {FM('yes')}
                  </Badge>
                )}
              </span>
            </div>
          </div>
        )
      }
    },
    {
      name: FM('action'),
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
                  noWrap: true,
                  name: (
                    <ConfirmAlert
                      menuIcon={<CheckCircle size={14} />}
                      onDropdown
                      eventId={`transfer-item-${row?.id}`}
                      item={row}
                      text={FM('are-you-sure-you-want-to-mark-as-paid')}
                      title={FM('mark-as-paid-selected-count', { count: row?.order_number })}
                      color='text-warning'
                      onClickYes={() => {
                        handleActions([row?.id], `transfer-item-${row?.id}`)
                      }}
                      onSuccessEvent={(e: any) => {}}
                      className=''
                      id={`change-status-${row?.id}`}
                    >
                      {FM('transfered-to-store')}
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
      IF: Permissions?.subscriptionBrowse,
      noWrap: true,
      name: (
        <ConfirmAlert
          menuIcon={<CheckCircle size={14} />}
          onDropdown
          eventId={`change-status`}
          text={FM('are-you-sure-you-want-to-mark-as-paid')}
          title={FM('mark-as-paid-selected-count', { count: selectedRows?.selectedCount })}
          color='text-warning'
          onClickYes={() => handleActions(selectedRows?.ids, 'change-status')}
          onSuccessEvent={(e: any) => {
            log('selectedROws', selectedRows)
            setState({ lastRefresh: new Date().getTime() })
          }}
          className=''
          id={`grid-active-selected`}
        >
          {FM('transfered-to-store')}
        </ConfirmAlert>
      )
    }
  ]

  return (
    <>
      <Header
        onClickBack={() => navigate(-1)}
        goBackTo
        icon={<BarChart2 size='25' />}
        title={FM('transfer-store-pending-amount')}
      >
        <ButtonGroup color='dark'>
          {/* <BsTooltip<ButtonProps> Tag={Button} size='sm' color='secondary' title={FM('filter')}>
            <Sliders size='14' />
          </BsTooltip> */}
          <LoadingButton
            loading={isLoading}
            onClick={() => {
              setState({ lastRefresh: new Date().getTime() })
            }}
            size='sm'
            color='dark'
            tooltip={FM('reload')}
          >
            <RefreshCcw size='14' />
          </LoadingButton>
        </ButtonGroup>
      </Header>
      <CustomDataTable<PendingStore>
        initialPerPage={15}
        options={options}
        selectableRows
        hideSearch
        isLoading={isLoading}
        columns={columns}
        paginatedData={data}
        handlePaginationAndSearch={handlePageChange}
      />
    </>
  )
}

export default PendingAmount
