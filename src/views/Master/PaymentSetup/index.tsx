import { QueryStatus } from '@reduxjs/toolkit/dist/query'
import { useContext, useEffect, useReducer } from 'react'
import { TableColumn } from 'react-data-table-component'
import {
  BarChart2,
  CheckCircle,
  Delete,
  Edit,
  MoreVertical,
  Plus,
  RefreshCcw,
  Trash,
  Trash2
} from 'react-feather'
import { useNavigate } from 'react-router-dom'
import { Badge, Button, ButtonGroup, ButtonProps } from 'reactstrap'
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
import PaymentSetupModal, { paymentSetupParam } from './PaymentSetupModal'
import {
  useDeleteProcessingFeeByIdMutation,
  useLoadProcessingFeeByIdMutation,
  useLoadProcessingFeeMutation
} from '../../../redux/RTKQuery/paymentProcessingfeeSetupRTK'
import ReactCountryFlag from 'react-country-flag'
import BsTooltip from '../../components/tooltip'
import { useNoViewModal } from '../../components/modal/HandleModal'

interface States {
  page?: any
  per_page_record?: any
  search?: any
  edit?: any
  reload?: any
  lastRefresh?: any
  isRemoving?: boolean
  isReloading?: boolean
  isAddingNewData?: boolean
}

function PaymentSetup() {
  const { colors } = useContext(ThemeColors)
  const navigate = useNavigate()
  const [loadList, { data, isLoading, isSuccess }] = useLoadProcessingFeeMutation()
  const [changeStatus, changeRes] = useDeleteProcessingFeeByIdMutation()
  // Local States
  const initState: States = {
    page: 1,
    per_page_record: 15,
    lastRefresh: new Date().getTime(),
    search: undefined,
    isRemoving: false,
    edit: undefined,
    isReloading: false,
    isAddingNewData: false
  }

  const reducers = stateReducer<States>
  const [state, setState] = useReducer(reducers, initState)
  // Load Store Data
  const [showModal, handleModal] = useNoViewModal()
  useEffect(() => {
    loadList({ page: state.page, per_page_record: state.per_page_record })
  }, [state.lastRefresh, state.page, state.per_page_record, changeRes?.isSuccess])
  const handlePageChange = (e: TableFormData) => {
    setState({ ...e })
  }

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
      id: ids[0],
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

  let columns: TableColumn<paymentSetupParam>[] = []

  columns = [
    {
      name: FM('country'),
      minWidth: '50px',
      cell: (row, index: any) => (
        <div className='d-flex align-items-center'>
          <div className='user-info text-truncate'>
            <span className='d-block fw-bold text-truncate'>
              <BsTooltip title={`${row?.account_country_code}`}>
                <ReactCountryFlag
                  style={{ width: '26px', height: '16px' }}
                  className='country-flag p-0'
                  countryCode={
                    `${row?.account_country_code}` === 'en' ? 'us' : `${row?.account_country_code}`
                  }
                  svg
                />
              </BsTooltip>
            </span>
          </div>
        </div>
      )
    },
    {
      name: FM('currency'),
      minWidth: '50px',
      cell: (row, index: any) => (
        <div className='d-flex align-items-center'>
          <div className='user-info text-truncate'>
            <span className='d-block fw-bold text-truncate'>{row?.account_currency}</span>
          </div>
        </div>
      )
    },
    {
      name: <>{FM('payment-method')}</>,
      cell: (row) => {
        return (
          <>
            {row?.payment_method === 'Stripe' ? (
              <Badge color={'light-success'} pill>
                <>{FM('stripe')}</>
              </Badge>
            ) : row?.payment_method === 'Tabby' ? (
              <Badge color={'light-danger'} pill>
                <>{FM('tabby')}</>
              </Badge>
            ) : row?.payment_method === 'Crypto Wallet' ? (
              <Badge color={'light-primary'} pill>
                <>{FM('crypto-wallet')}</>
              </Badge>
            ) : (
              <Badge color={'light-primary'} pill>
                <>{FM('enfuse')}</>
              </Badge>
            )}
          </>
        )
      }
    },
    {
      name: FM('card-type'),
      minWidth: '50px',
      cell: (row, index: any) => (
        <div className='d-flex align-items-center'>
          <div className='user-info text-truncate'>
            <span className='d-block fw-bold text-truncate'>{row?.card_type}</span>
          </div>
        </div>
      )
    },
    {
      name: FM('card-percentage'),
      minWidth: '50px',
      cell: (row, index: any) => (
        <div className='d-flex align-items-center'>
          <div className='user-info text-truncate'>
            <span className='d-block fw-bold text-truncate'>{row?.card_percentage}</span>
          </div>
        </div>
      )
    },
    {
      name: FM('fixed-charge'),
      minWidth: '50px',
      cell: (row, index: any) => (
        <div className='d-flex align-items-center'>
          <div className='user-info text-truncate'>
            <span className='d-block fw-bold text-truncate'>{row?.fixed_charge}</span>
          </div>
        </div>
      )
    },
    {
      name: FM('currency-conversion-charge-percentage'),
      minWidth: '50px',
      cell: (row, index: any) => (
        <div className='d-flex align-items-center'>
          <div className='user-info text-truncate'>
            <span className='d-block fw-bold text-truncate'>
              {row?.currecncy_conversion_charge_percentage}
            </span>
          </div>
        </div>
      )
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
                  icon: <Edit size={14} />,
                  onClick: () => {
                    handleModal()
                    setState({
                      edit: row
                    })
                  },
                  name: FM('edit')
                },
                {
                  noWrap: true,
                  name: (
                    <ConfirmAlert
                      menuIcon={<Trash2 size={14} />}
                      onDropdown
                      eventId={`delete-item-${row?.id}`}
                      item={row}
                      text={FM('are-you-sure-you-want-to-delete')}
                      title={FM('delete-item-name', { name: row?.card_type })}
                      color='text-warning'
                      onClickYes={() => {
                        handleActions([row?.id], `delete-item-${row?.id}`)
                      }}
                      onSuccessEvent={(e: any) => {}}
                      className=''
                      id={`cdelete-item-${row?.id}`}
                    >
                      {FM('delete')}
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
      <PaymentSetupModal
        edit={state?.edit}
        response={(e) => {
          setState({
            lastRefresh: new Date().getTime(),
            page: 1
          })
        }}
        showModal={showModal}
        setShowModal={(e) => handleModal()}
        noView
      />
      <Header
        // onClickBack={() => navigate(-1)}
        // goBackTo
        icon={<BarChart2 size='25' />}
        title={FM('payment-setup')}
      >
        <ButtonGroup color='dark'>
          {/* <BsTooltip<ButtonProps> Tag={Button} size='sm' color='secondary' title={FM('filter')}>
            <Sliders size='14' />
          </BsTooltip> */}
          <PaymentSetupModal<ButtonProps>
            Tag={Button}
            response={() => {
              setState({
                lastRefresh: new Date().getTime(),
                page: 1
              })
            }}
            className='btn btn-primary btn-sm d-flex align-items-center'
            size='sm'
            color='primary'
            title={FM('add-payment-setup')}
          >
            <div>
              <Plus size='14' />
              {/* <span className='align-middle ms-25'>{FM('import')}</span> */}
            </div>
          </PaymentSetupModal>
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
      <CustomDataTable<paymentSetupParam>
        initialPerPage={15}
        options={options}
        //  selectableRows
        hideSearch
        isLoading={isLoading}
        columns={columns}
        paginatedData={data}
        handlePaginationAndSearch={handlePageChange}
      />
    </>
  )
}

export default PaymentSetup
