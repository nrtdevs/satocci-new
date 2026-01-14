/* eslint-disable prettier/prettier */
import { useContext, useEffect, useReducer, useState } from 'react'
import { TableColumn } from 'react-data-table-component'
import {
  CheckCircle,
  Download,
  MoreVertical,
  RefreshCcw,
  Send,
  Sliders,
  Trash2,
  Users,
  XCircle
} from 'react-feather'
import { Badge, Button, ButtonGroup, ButtonProps, Col, Row } from 'reactstrap'
import {
  customerRequestParams,
  useActionCustomerMutation,
  useLoadCustomerListMutation
} from '../../../redux/RTKQuery/CustomerRTK'
import { getPath } from '../../../router/RouteHelper'
import { IconSizes, UserType } from '../../../utility/Const'
import { decrypt, emitAlertStatus, formatDate, truncateText } from '../../../utility/Utils'
import { ThemeColors } from '../../../utility/context/ThemeColors'
import { FM, isValid, isValidUrl, log } from '../../../utility/helpers/common'
import { stateReducer } from '../../../utility/stateReducer'
import CustomDataTable, {
  TableDropDownOptions,
  TableFormData
} from '../../components/CustomDataTable/CustomDataTable'
import LoadingButton from '../../components/buttons/LoadingButton'
import DropDownMenu from '../../components/dropdown'
import Header from '../../components/header'
import BsPopover from '../../components/popover'
import Ratings from '../../components/ratings'
import BsTooltip from '../../components/tooltip'
import httpConfig from '../../../utility/http/httpConfig'
import { ExportStoreCustomer } from '../../../utility/apis/ExportLanguage'
import CustomerViewModal from './CustomerViewModal'
import CustomerFilter from '../../stores/StoreCustomer/CutomerFilter'
import SendPromotion from '../../stores/StoreCustomer/SendPromotion'
import ConfirmAlert from '../../../utility/helpers/ConfirmAlert'
import { QueryStatus } from '@reduxjs/toolkit/dist/query'
import { Can } from '../../../utility/Show'
import { Permissions } from '../../../utility/Permissions'

interface States {
  page?: any
  per_page_record?: any
  search?: any
  showModal?: boolean
  customerFilter?: boolean
  sendPromotion?: boolean
  reload?: any
  loading?: boolean
  filterData?: any
  customerIds?: any
  customerData?: any
  isAddingNewData?: boolean
  lastRefresh?: any
}

function Customer() {
  const initState: States = {
    page: 1,
    loading: false,
    showModal: false,
    customerFilter: false,
    sendPromotion: false,
    filterData: null,
    customerIds: null,
    customerData: null,
    per_page_record: 15,
    search: '',
    lastRefresh: new Date().getTime()
  }
  const reducers = stateReducer<States>
  // eslint-disable-next-line @typescript-eslint/no-shadow
  const [state, setState] = useReducer(reducers, initState)
  const { colors } = useContext(ThemeColors)
  const canLoadCUstomer = Can(Permissions.customerBrowse)
  const [loading, setLoading] = useState<boolean>(false)
  const [loadCustomer, { data, isLoading, isSuccess }] = useLoadCustomerListMutation()
  const [actionCustomer, resAction] = useActionCustomerMutation()
  useEffect(() => {
    setState({
      page: 1
    })
  }, [state.per_page_record])
  const handlePageChange = (e: TableFormData) => {
    setState({ ...e })
  }

  useEffect(() => {
    if (canLoadCUstomer) {
      loadCustomer({
        jsonData: { ...state.filterData, name: state?.search ?? state?.filterData?.name },
        page: isValid(state.search) ? 1 : state?.page,
        per_page_record: state?.per_page_record
      })
    }
  }, [state?.search, state?.page, state?.per_page_record, state.lastRefresh, state.filterData])

  const reloadData = () => {
    setState({
      lastRefresh: new Date().getTime(),
      filterData: null
    })
  }


  //get login status
  function getStatus(startDate: any, endDate: any) {
    const start: any = new Date(startDate)
    const end: any = new Date(endDate)

    const diffTime = Math.abs(end - start)
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))

    // Return Badge based on difference
    if (diffDays <= 7) {
      return (
        <Badge color='light-success' className='badge-soft-success'>
          {FM('active')}
        </Badge>
      )
    } else {
      return (
        <Badge color='light-danger' className='badge-soft-danger'>
          {FM('inactive')}
        </Badge>
      )
    }
  }

  // ✅ Example:
  // getStatus('2025-11-03', '2025-11-08') // 🟢 Green (5 days)
  // getStatus('2025-11-03', '2025-11-15') // 🔴 Red (12 days)

  const exportCustomer = () => {
    ExportStoreCustomer({
      loading: setLoading,
      success: (e: any) => {
        if (isValidUrl(e?.payload?.url)) {
          window.open(e?.payload?.url, '_blank')
        } else {
          window.open(`${httpConfig.baseUrl2}${e?.payload?.url}`, '_blank')
        }
      }
    })
  }

  const handleActions = (ids: any, action: any, eventId: any) => {
    actionCustomer({
      jsonData: {
        ids,
        action
      },
      eventId
    })
  }
  const columns: TableColumn<customerRequestParams>[] = [
    {
      name: '#',
      maxWidth: '50px',
      cell: (row, index: any) => {
        // eslint-disable-next-line no-mixed-operators
        return parseInt(state?.per_page_record) * (state?.page - 1) + (index + 1)
      }
    },
    {
      name: FM('customer-name'),

      //sortable: row => row.full_name,
      cell: (row: any) => (
        <BsTooltip
          title={FM('customer-details')}
          className='d-flex align-items-center cursor-pointer text-primary'
          onClick={() => {
            setState({
              showModal: true,
              customerData: row
            })
          }}
        >
          <div className='user-info text-truncate ms-1'>
            <span className='d-block fw-bold text-wrap'>
              {truncateText(decrypt(row?.name), 25)}
            </span>
          </div>
        </BsTooltip>
      )
    },
    {
      name: FM('email'),
      //sortable: true,

      //sortable: row => row.full_name,
      cell: (row: any) => (
        <BsPopover
          title={FM('details')}
          content={
            <>
              <Row className='align-items-start gy-2'>
                <Col md='12'>
                  <span className='mb-0 text-dark fw-bolder'>{FM('name')} :</span>
                  <p className='mb-0 fw-bold text-secondary'>{decrypt(row?.name) ?? 'N/A'}</p>
                </Col>
                <Col md='12'>
                  <span className='h5 text-dark fw-bolder'>{FM('email')} :</span>
                  <p className='mb-0 fw-bold text-secondary'>{decrypt(row?.email) ?? 'N/A'}</p>
                </Col>
              </Row>
              {/* <span>{row?.name}</span>
              <span>{row?.email}</span> */}
            </>
          }
          // role='button'
          Tag={'p'}
        // className='mb-0 fw-bold text-secondary text-truncate mt-3px'
        >
          <span className='d-block fw-bold text-wrap'>{truncateText(decrypt(row?.email), 20)}</span>
          {/* <span className='d-block fw-bold text-wrap'>{row.message}</span> */}
        </BsPopover>
      )
    },
    {
      name: FM('mobile-number'),
      //sortable: true,

      //sortable: row => row.full_name,
      cell: (row: any) => (
        <span className='d-block fw-bold text-wrap'>{decrypt(row?.mobile_number)}</span>
      )
    },
    {
      name: FM('total-orders'),
      //sortable: true,

      //sortable: row => row.full_name,
      cell: (row: any) => <span className='d-block fw-bold text-wrap'>{row?.total_orders}</span>
    },
    {
      // <Ratings rating={row?.rating ?? 0} />
      name: FM('rating'),
      //sortable: true,

      //sortable: row => row.full_name,
      cell: (row: any) => (
        <div className='d-flex align-items-center'>
          <span className='d-flex text-wrap'>
            {row?.customer_rating > 0 ? (
              <Ratings rating={row?.customer_rating} />
            ) : (
              FM('no-rating-available')
            )}
          </span>
        </div>
      )
    },
    {
      name: FM('address'),
      //sortable: true,

      //sortable: row => row.full_name,
      cell: (row: any) => (
        <span className='text-wrap'>{truncateText(decrypt(row?.address), 30)}</span>
      )
    },
    {
      name: FM('last-login'),
      //sortable: true,

      //sortable: row => row.full_name,
      cell: (row: any) => (
        <span className='text-wrap'>
          {getStatus(
            formatDate(row?.last_login, 'YYYY-MM-DD'),
            formatDate(new Date(), 'YYYY-MM-DD')
          )}
        </span>
      )
    },
    {
      name: FM('status'),
      //sortable: true,

      //sortable: row => row.full_name,
      cell: (row: any) => (
        <span className='text-wrap'>
          <Badge
            color={row?.status === 1 ? 'light-success' : 'light-danger'}
            className='badge-soft-success'
          >
            {row?.status === 1 ? FM('active') : FM('inactive')}
          </Badge>
        </span>
      )
    },

    {
      name: <>{FM('action')}</>,

      allowOverflow: true,
      maxWidth: '10px',

      cell: (row) => {
        return (
          <div className='d-flex '>
            <DropDownMenu
              direction='down'
              component={<MoreVertical color={colors.primary.main} size={IconSizes.MenuVertical} />}
              options={[
                {
                  // IF : isValid(Permissions?.coupon)
                  icon: <Send size={14} />,
                  state: row,
                  to: { pathname: getPath('admin.send.coupon', { customerId: row?.id }) },
                  name: FM('send-coupon')
                },
                {
                  IF: row?.status !== 1,
                  noWrap: true,
                  name: (
                    <ConfirmAlert
                      menuIcon={<CheckCircle size={14} />}
                      onDropdown
                      eventId={`item-active`}
                      text={FM('are-you-sure')}
                      title={FM('active-selected-count', { count: decrypt(row?.name) })}
                      color='text-warning'
                      // onClickYes={() => log('selectedROws', selectedRows)}
                      onClickYes={() => handleActions([row?.id], 'active', 'item-active')}
                      onSuccessEvent={(e: any) => {
                        reloadData()
                      }}
                      className=''
                      id={`grid-active-selected`}
                    >
                      {FM('active')}
                    </ConfirmAlert>
                  )
                },
                {
                  IF: row?.status === 1,
                  noWrap: true,
                  name: (
                    <ConfirmAlert
                      menuIcon={<XCircle size={14} />}
                      onDropdown
                      eventId={`item-inactive`}
                      text={FM('are-you-sure')}
                      title={FM('inactive-selected-count', { count: decrypt(row?.name) })}
                      color='text-warning'
                      // onClickYes={() => log('selectedROws', selectedRows)}
                      onClickYes={() => handleActions([row?.id], 'inactive', 'item-inactive')}
                      onSuccessEvent={(e: any) => {
                        reloadData()
                      }}
                      className=''
                      id={`grid-inactive-selected`}
                    >
                      {FM('inactive')}
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

  useEffect(() => {
    if ((resAction.status = QueryStatus.fulfilled) && resAction?.isLoading === false) {
      if (resAction?.isSuccess) {
        emitAlertStatus('success', null, resAction?.originalArgs?.eventId)
      } else if (resAction?.error) {
        emitAlertStatus('failed', null, resAction?.originalArgs?.eventId)
      }
    }
  }, [resAction])

  const options: TableDropDownOptions = (selectedRows) => [
    {
      noWrap: true,
      name: (
        <ConfirmAlert
          menuIcon={<CheckCircle size={14} />}
          onDropdown
          eventId={`item-active`}
          text={FM('are-you-sure')}
          title={FM('active-selected-count', { count: selectedRows?.selectedCount })}
          color='text-warning'
          // onClickYes={() => log('selectedROws', selectedRows)}
          onClickYes={() => handleActions(selectedRows?.ids, 'active', 'item-active')}
          onSuccessEvent={(e: any) => {
            reloadData()
          }}
          className=''
          id={`grid-active-selected`}
        >
          {FM('active')}
        </ConfirmAlert>
      )
    },
    {
      noWrap: true,
      name: (
        <ConfirmAlert
          menuIcon={<XCircle size={14} />}
          onDropdown
          eventId={`item-inactive`}
          text={FM('are-you-sure')}
          title={FM('inactive-selected-count', { count: selectedRows?.selectedCount })}
          color='text-warning'
          // onClickYes={() => log('selectedROws', selectedRows)}
          onClickYes={() => handleActions(selectedRows?.ids, 'inactive', 'item-inactive')}
          onSuccessEvent={(e: any) => {
            reloadData()
          }}
          className=''
          id={`grid-inactive-selected`}
        >
          {FM('inactive')}
        </ConfirmAlert>
      )
    },
    {
      icon: <Send size={14} />,
      // state: selectedRows?.ids,
      onClick: () => {
        // log('selectedRows', selectedRows)
        setState({
          sendPromotion: true,
          customerIds: selectedRows?.ids
        })
      },
      // to: { pathname: getPath('admin.stores.update', { id: row?.id }) },
      name: FM('send-promotion')
    }
  ]

  return (
    <>
      <CustomerFilter
        userType={UserType}
        show={state?.customerFilter}
        filterData={state.filterData}
        setFilterData={(e: any) => {
          setState({ filterData: e, page: 1 })
          log(state.filterData, 'filter')
        }}
        handleFilterModal={(e: boolean) => {
          // setPatientFilter(false)
          setState({
            customerFilter: e
          })
        }}
      />
      <SendPromotion
        showModal={state.sendPromotion}
        setShowModal={(e) =>
          setState({
            sendPromotion: e
          })
        }
        response={(e) => {
          reloadData()
        }}
        edit={state.customerIds}
        noView
      />
      <CustomerViewModal
        showModal={state.showModal}
        setShowModal={(e) =>
          setState({
            showModal: e
          })
        }
        edit={state.customerData}
        noView
      />
      <Header icon={<Users size='25' />} title={FM('customer')}>
        <ButtonGroup color='dark'>
          {/* <UncontrolledTooltip target='filter'>
            <>{FM('filter')}</>
          </UncontrolledTooltip>
          <Button size='sm' color='secondary' id='filter'>
            <Sliders size='14' />
          </Button> */}
          <BsTooltip<ButtonProps>
            onClick={exportCustomer}
            loading={loading}
            className='btn btn-primary btn-sm'
            color='primary'
            title={FM('export')}
            Tag={Button}
          >
            <Download size='14' />
          </BsTooltip>
          <BsTooltip<ButtonProps>
            Tag={Button}
            onClick={() =>
              setState({
                customerFilter: true
              })
            }
            size='sm'
            color='secondary'
            title={FM('filter')}
          >
            <Sliders size='14' />
          </BsTooltip>
          <LoadingButton loading={isLoading} size='sm' color='dark' onClick={reloadData}>
            <RefreshCcw size='14' />
          </LoadingButton>
        </ButtonGroup>
      </Header>
      <CustomDataTable<customerRequestParams>
        initialPerPage={15}
        isLoading={isLoading}
        // hideHeader
        selectableRows
        options={options}
        columns={columns}
        paginatedData={data}
        handlePaginationAndSearch={handlePageChange}
      />
    </>
  )
}

export default Customer
