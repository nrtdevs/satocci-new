/* eslint-disable prettier/prettier */
/* eslint-disable no-mixed-operators */
import { useContext, useEffect, useReducer } from 'react'

import '@styles/base/pages/dashboard-ecommerce.scss'
import {
  BarChart2,
  CheckCircle,
  CornerUpLeft,
  MessageSquare,
  MoreVertical,
  RefreshCcw,
  Send,
  X
} from 'react-feather'
import { Badge, Button, ButtonGroup, ButtonProps } from 'reactstrap'
import { ThemeColors } from '../../../utility/context/ThemeColors'

import { Link } from 'react-router-dom'

import { TableColumn } from 'react-data-table-component'

import { useForm } from 'react-hook-form'
import { OrdersParams } from '../../../redux/RTKQuery/OrdersRTK'
import {
  useActionReturnMutation,
  useLoadReturnOrderMutation,
  useReturnRefundMutation
} from '../../../redux/RTKQuery/ReturnOrderRTK'
import { getPath } from '../../../router/RouteHelper'
import {
  CF,
  JsonParseValidate,
  SuccessToast,
  emitAlertStatus,
  formatDate,
  getUserData
} from '../../../utility/Utils'
import { FM, isValid, isValidArray, log } from '../../../utility/helpers/common'
import { stateReducer } from '../../../utility/stateReducer'
import CustomDataTable, { TableFormData } from '../../components/CustomDataTable/CustomDataTable'
import LoadingButton from '../../components/buttons/LoadingButton'
import Header from '../../components/header'
import { StoreParamsType } from '../../stores/fragment/AddUpdateForm'
import ConfirmAlert from '../../../utility/helpers/ConfirmAlert'
import DropDownMenu from '../../components/dropdown'
import { IconSizes } from '../../../utility/Const'
import { QueryStatus } from '@reduxjs/toolkit/dist/query'
import TransactionFilter from './transactionFilter'
import BsTooltip from '../../components/tooltip'
import Show from '../../../utility/Show'
import AcceptRejectOrderModal from './Tab/AcceptRejectOrderModal'
import { useNoViewModal } from '../../components/modal/HandleModal'
import BsPopover from '../../components/popover'

interface States {
  lastRefresh?: any
  page?: any
  filterType?: any
  loadingInvoice?: boolean
  per_page_record?: any
  search?: any
  reload?: any
  isRemoving?: boolean
  isIndex?: any
  isAddingNewData?: boolean
  transactionFilter?: boolean
  transactionFilterCenterAction?: boolean
  transactionFilterData?: any
  transactionFilterDataAction?: any
  filterData?: StoreParamsType | any
}

function ReturnOrder() {
  const user = getUserData()
  const { colors } = useContext(ThemeColors)
  const form = useForm<any>()
  // Local States
  const initState: States = {
    page: 1,
    per_page_record: 15,
    lastRefresh: new Date().getTime(),
    transactionFilterCenterAction: false,
    search: undefined,
    isRemoving: false,
    isIndex: null,
    isAddingNewData: false
  }
  const { handleSubmit, control, reset, setValue, watch } = form
  const reducers = stateReducer<States>
  const [state, setState] = useReducer(reducers, initState)
  const la = localStorage.getItem('lang')
  const [showModal, handleModal] = useNoViewModal()
  const laa = JsonParseValidate(la)
  // Load Store Data
  const [loadReturn, { data, isLoading }] = useLoadReturnOrderMutation()
  const [returnAction, returnResult] = useActionReturnMutation()
  const [returnRefund, refundResult] = useReturnRefundMutation()

  log(data, 'data')

  useEffect(() => {
    setState({
      page: 1
    })
  }, [state.per_page_record])
  const handlePageChange = (e: TableFormData) => {
    setState({ ...e })
  }
  useEffect(() => {
    loadReturn({
      page: state?.per_page_record !== 15 ? 1 : state?.page,
      per_page_record: state?.per_page_record
    })
  }, [isValid(state?.search), state?.page, state?.per_page_record, state.lastRefresh])

  const actionReturn = (order_return_id: any, eventId?: any) => {
    returnRefund({
      eventId,
      order_return_id
    })
  }

  useEffect(() => {
    if ((refundResult.status = QueryStatus.fulfilled) && refundResult?.isLoading === false) {
      if (refundResult?.isSuccess) {
        emitAlertStatus('success', null, `${refundResult?.originalArgs?.eventId}`)
      } else if (refundResult?.error) {
        emitAlertStatus('failed', null, `${refundResult?.originalArgs?.eventId}`)
      }
    }
  }, [refundResult])

  useEffect(() => {
    if (refundResult.isSuccess) {
      SuccessToast(refundResult?.data?.message)
      loadReturn({
        page: state?.per_page_record !== 15 ? 1 : state?.page,
        per_page_record: state?.per_page_record
      })
    }
  }, [refundResult])

  let columns: TableColumn<OrdersParams>[] = []

  columns = [
    {
      name: '#',
      maxWidth: '40px',
      cell: (row, index: any) => {
        // eslint-disable-next-line no-mixed-operators
        return parseInt(state?.per_page_record) * (state?.page - 1) + (index + 1)
      }
    },

    {
      name: <>{FM('order-number')}</>,
      maxWidth: '150px',
      cell: (row) => (
        <Link
          state={{ row }}
          to={getPath('admin.return.orders.detail', { id: row?.id })}
          className='d-block'
          id='create-button'
        >
          <span className='d-block fw-bold text-truncate'>{row?.order?.order_number}</span>
        </Link>
      )
    },

    {
      name: <>{FM('return-quantity')}</>,
      cell: (row) => (
        <span className='d-block fw-bold'>
          {row?.order_item_returns?.map((a: any, i: any) => {
            return (
              <Badge color='light-primary' className='me-25 p-25' key={i}>
                {Number(a?.return_quantity).toFixed(1)}
              </Badge>
            )
          })}
        </span>
      )
    },
    {
      name: <>{FM('return-amount')}</>,
      cell: (row) => (
        <div className='d-flex align-items-center'>
          <div className='user-info text-truncate ms-1'>
            <span className='d-block fw-bold'>
              {CF({
                money: row?.total_return_amount,
                currency: isValid(user?.currency) ? user?.currency : 'SEK'
              })}
            </span>
          </div>
        </div>
      )
    },
    {
      name: <>{FM('refund-amount')}</>,
      cell: (row) => (
        <div className='d-flex align-items-center'>
          <div className='user-info text-truncate ms-1'>
            <span className='d-block fw-bold'>
              {CF({
                money: row?.refund_amount,
                currency: isValid(user?.currency) ? user?.currency : 'SEK'
              })}
            </span>
          </div>
        </div>
      )
    },

    {
      name: <>{FM('return-date')}</>,
      cell: (row) => (
        <div className='d-flex align-items-center'>
          <div className='user-info text-truncate ms-1'>
            <span className='d-block fw-bold text-truncate'>{formatDate(row?.created_at)}</span>
          </div>
        </div>
      )
    },
    {
      name: <>{FM('Status')}</>,
      cell: (row) => {
        return (
          <>
            {row?.status === 1 ? (
              <Badge color={'light-warning'} pill>
                <>{FM('pending')}</>
              </Badge>
            ) : row?.status === 2 ? (
              <Badge color={'light-primary'} pill>
                <>{FM('verified')}</>
              </Badge>
            ) : row?.status === 3 ? (
              <Badge color={'light-danger'} pill>
                <>{FM('rejected')}</>
              </Badge>
            ) : (
              <Badge color={'light-success'} pill>
                <>{FM('completed')}</>
              </Badge>
            )}
          </>
        )
      }
    },
    {
      name: <>{FM('reason-for-return')}</>,
      cell: (row) => (
        <div className='d-flex align-items-center'>
          {isValidArray(row?.order_item_returns) ? (
            <BsPopover
              // trigger='hover'
              title={FM('reason-for-return')}
              content={
                <>
                  {row?.order_item_returns?.map((a: any, i: any) => {
                    //delete a?.reason_for_return  if null or undefined
                    if (!a?.reason_for_return) {
                      return (
                        <Badge key={i} color='light-danger' className='d-block mb-1'>
                          {`${i + 1} :  ${FM('n/a')}`}
                        </Badge>
                      )
                    }
                    return (
                      <Badge key={i} color='light-danger' className='d-block mb-1'>
                        {`${i + 1} :  ${a?.reason_for_return}`}
                      </Badge>
                    )
                  })}
                </>
              }
            >
              <MessageSquare className='text-primary' />
            </BsPopover>
          ) : null}
        </div>
      )
    },
    {
      name: <>{FM('action')}</>,
      cell: (row, i) => (
        <>
          <ButtonGroup>
            <Show IF={row?.status === 1}>
              <BsTooltip<ButtonProps>
                Tag={Button}
                size='sm'
                color='success'
                onClick={() => {
                  handleModal()
                  setState({
                    // transactionFilterCenterAction: true,
                    filterType: 'returnApprove',
                    transactionFilterDataAction: row
                  })
                }}
                title={FM('approve')}
              >
                <CheckCircle size='14' />
              </BsTooltip>
              <BsTooltip<ButtonProps>
                Tag={Button}
                size='sm'
                color='warning'
                onClick={() => {
                  handleModal()
                  setState({
                    // transactionFilterCenterAction: true,
                    filterType: 'returnReject',
                    transactionFilterDataAction: row
                  })
                }}
                title={FM('reject')}
              >
                <CornerUpLeft size='14' />
              </BsTooltip>
            </Show>
            <Show IF={row?.status === 2}>
              <BsTooltip<ButtonProps>
                className='btn btn-primary btn-sm d-flex align-items-center'
                title={FM('initiate-refund')}
              >
                <ConfirmAlert
                  // menuIcon={<Mail size={14} />}
                  //  onDropdown
                  eventId={`delete-item-${row?.id}`}
                  item={row}
                  text={FM('initiate-refund')}
                  title={row?.order?.order_number}
                  color='text-warning'
                  onClickYes={(e: any) => {
                    actionReturn(row?.id, `delete-item-${row?.id}`)
                  }}
                  onSuccessEvent={(e: any) => {
                    // refetch()
                    // reloadData()
                  }}
                  // className='btn btn-primary btn-sm d-flex align-items-center'
                  id={`grid-delete-${row?.id}`}
                >
                  <Send size={14} />
                </ConfirmAlert>
              </BsTooltip>
            </Show>
          </ButtonGroup>
        </>
      )
    }
  ]

  //   if (data?. === 3) {
  //     columns.splice(6, 1)
  //   }

  return (
    <>
      <AcceptRejectOrderModal
        edit={state?.transactionFilterDataAction}
        exportType={state.filterType}
        response={(e: boolean) => {
          loadReturn({
            page: state?.per_page_record !== 15 ? 1 : state?.page,
            per_page_record: state?.per_page_record
          })
        }}
        showModal={showModal}
        setShowModal={(e) => handleModal()}
        noView
      />
      <Header icon={<BarChart2 size='25' />} title={FM('returns')}>
        <ButtonGroup color='dark'>
          <LoadingButton
            tooltip={FM('reload')}
            loading={isLoading}
            size='sm'
            color='dark'
            onClick={() =>
              setState({
                lastRefresh: new Date().getTime(),
                page: 1,
                filterData: null
              })
            }
          >
            <RefreshCcw size='14' />
          </LoadingButton>
        </ButtonGroup>
      </Header>
      <CustomDataTable<OrdersParams>
        key={state.lastRefresh}
        initialPerPage={15}
        isLoading={isLoading}
        columns={columns}
        paginatedData={data}
        handlePaginationAndSearch={handlePageChange}
      />
    </>
  )
}
export default ReturnOrder
