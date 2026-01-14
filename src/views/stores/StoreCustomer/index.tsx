/* eslint-disable prettier/prettier */
import { useContext, useEffect, useReducer, useState } from 'react'
import { TableColumn } from 'react-data-table-component'
import { Download, RefreshCcw, Send, Sliders, Trash2, Users } from 'react-feather'
import { Badge, Button, ButtonGroup, ButtonProps, Col, Row } from 'reactstrap'
import {
  customerRequestParams,
  useLoadStoreCustomerListMutation,
  useLoadStoreFilterCustomerListMutation
} from '../../../redux/RTKQuery/CustomerRTK'
import { decrypt, formatDate, truncateText } from '../../../utility/Utils'
import { ExportStoreCustomer } from '../../../utility/apis/ExportLanguage'
import { ThemeColors } from '../../../utility/context/ThemeColors'
import { FM, isValid, isValidUrl, log } from '../../../utility/helpers/common'
import useUserType from '../../../utility/hooks/useUserType'
import httpConfig from '../../../utility/http/httpConfig'
import { stateReducer } from '../../../utility/stateReducer'
import CustomDataTable, {
  TableDropDownOptions,
  TableFormData
} from '../../components/CustomDataTable/CustomDataTable'
import LoadingButton from '../../components/buttons/LoadingButton'
import Header from '../../components/header'
import BsPopover from '../../components/popover'
import Ratings from '../../components/ratings'
import BsTooltip from '../../components/tooltip'
import CustomerViewModal from '../../UserManagement/customer/CustomerViewModal'

import CustomerFilter from './CutomerFilter'
import SendPromotion from './SendPromotion'
import { Can } from '../../../utility/Show'
import { Permissions } from '../../../utility/Permissions'

interface States {
  showModal?: boolean
  sendPromotion?: boolean
  page?: any
  per_page_record?: any
  search?: any
  reload?: any
  isAddingNewData?: boolean
  customerFilter?: boolean
  filterData?: any
  lastRefresh?: any
  customerData?: any
  customerIds?: any
}

function Customers() {
  const initState: States = {
    showModal: false,
    customerData: null,
    customerFilter: false,
    page: 1,
    sendPromotion: false,
    per_page_record: 15,
    search: '',
    lastRefresh: new Date().getTime()
  }
  const reducers = stateReducer<States>
  const userType = useUserType()
  // eslint-disable-next-line @typescript-eslint/no-shadow
  const [state, setState] = useReducer(reducers, initState)
  const { colors } = useContext(ThemeColors)
  const canCustomerList = Can(Permissions.storeCustomerBrowse)
  const [loadingSample, setLoadingSample] = useState<boolean>(false)
  const [loadCustomer, { data, isLoading, isSuccess }] = useLoadStoreFilterCustomerListMutation()
  useEffect(() => {
    setState({
      page: 1
    })
  }, [state.per_page_record])
  const handlePageChange = (e: TableFormData) => {
    setState({ ...e })
  }

  useEffect(() => {
    if (canCustomerList) {
      loadCustomer({
        jsonData: {
          ...state.filterData,
          search: state?.search
        },
        page: isValid(state.search) ? 1 : state?.page,
        per_page_record: state?.per_page_record
      })
    }
  }, [
    isValid(state?.search),
    state?.page,
    state?.per_page_record,
    state.lastRefresh,
    state.filterData
  ])

  //get login activity
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

  const reloadData = () => {
    setState({
      lastRefresh: new Date().getTime(),
      filterData: null
    })
  }

  const exportCustomer = () => {
    ExportStoreCustomer({
      loading: setLoadingSample,
      success: (e: any) => {
        if (isValidUrl(e?.payload?.url)) {
          window.open(e?.payload?.url, '_blank')
        } else {
          window.open(`${httpConfig.baseUrl2}${e?.payload?.url}`, '_blank')
        }
      }
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
      name: FM('address'),
      //sortable: true,

      //sortable: row => row.full_name,
      cell: (row: any) => (
        <span className='text-wrap'>{truncateText(decrypt(row?.address), 30)}</span>
      )
    },
    {
      // <Ratings rating={row?.rating ?? 0} />
      name: FM('rating'),
      //sortable: true,

      //sortable: row => row.full_name,
      cell: (row: any) => (
        <div className='d-flex align-items-center'>
          <span className='d-flex text-wrap'>
            {Number(row?.customer_rating) > 0 ? (
              <Ratings rating={Number(row?.customer_rating)} max={5} />
            ) : (
              FM('no-rating-available')
            )}
          </span>
        </div>
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
    }

    // {
    //   name: <>{FM('action')}</>,

    //   allowOverflow: true,
    //   minWidth: '80px',

    //   cell: (row) => {
    //     return (
    //       <div className='d-flex '>
    //         <DropDownMenu
    //           direction='down'
    //           component={<MoreVertical color={colors.primary.main} size={IconSizes.MenuVertical} />}
    //           options={[
    //             {
    //               // IF : isValid(Permissions?.coupon)
    //               icon: <Send size={14} />,
    //               state: row,
    //               to: { pathname: getPath('admin.send.coupon', { customerId: row?.id }) },
    //               name: FM('send-coupon')
    //             }
    //             // {
    //             //   noWrap: true,
    //             //   name: (
    //             //     <ConfirmAlert
    //             //       menuIcon={<Trash2 size={14} />}
    //             //       onDropdown
    //             //       eventId={`delete-item-${row?.id}`}
    //             //       item={row}
    //             //       title={FM('delete-item-name', { name: row?.name })}
    //             //       color='text-warning'
    //             //       onClickYes={() =>
    //             //         handleActions(row?.id, null, null, `delete-item-${row?.id}`)
    //             //       }
    //             //       onSuccessEvent={() =>
    //             //         setState({
    //             //           search: '',
    //             //           page: 1
    //             //         })
    //             //       }
    //             //       className=''
    //             //       id={`grid-delete-${row?.id}`}
    //             //     >
    //             //       {FM('delete')}
    //             //     </ConfirmAlert>
    //             //   )
    //             // }
    //           ]}
    //         />
    //       </div>
    //     )
    //   }
    // }
  ]

  const options: TableDropDownOptions = (selectedRows) => [
    // {

    //     noWrap: true,
    //     name: (
    //         <ConfirmAlert
    //             menuIcon={<Trash2 size={14} />}
    //             onDropdown
    //             eventId={`item-delete`}
    //             text={FM('are-you-sure')}
    //             title={FM('delete-selected-count', { count: selectedRows?.selectedCount })}
    //             color='text-warning'
    //             // onClickYes={() => log('selectedROws', selectedRows)}
    //             // onClickYes={() => handleActions(selectedRows?.ids, 'permanent_delete', 'item-delete')}
    //             onSuccessEvent={(e: any) => {
    //                 reloadData()
    //             }}
    //             className=''
    //             id={`grid-delete-selected`}
    //         >
    //             {FM('delete')}
    //         </ConfirmAlert>
    //     )
    // },
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
        userType={userType}
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
      <Header icon={<Users size='25' />} title={FM('customers')}>
        <ButtonGroup color='dark'>
          {/* <UncontrolledTooltip target='filter'>
            <>{FM('filter')}</>
          </UncontrolledTooltip>
          <Button size='sm' color='secondary' id='filter'>
            <Sliders size='14' />
          </Button> */}
          <BsTooltip<ButtonProps>
            onClick={exportCustomer}
            loading={loadingSample}
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
        // hideFooter={userType === UserType.Store}
        // hideHeader={userType === UserType.Store}
        selectableRows
        options={options}
        columns={columns}
        paginatedData={data}
        handlePaginationAndSearch={handlePageChange}
      />
    </>
  )
}

export default Customers
