import { useEffect, useReducer } from 'react'
import { TableColumn } from 'react-data-table-component'
import { useForm } from 'react-hook-form'
import { Badge, Col, Form, Row } from 'reactstrap'
import { useAllSubscriptionLogMutation } from '../../../../redux/RTKQuery/SubscriptionRTK'
import { subscriptionStoreType } from '../../../../utility/Const'
import Show from '../../../../utility/Show'
import { CF, decrypt, formatDate, getKeyByValue, truncateText } from '../../../../utility/Utils'
import { loadDropdown } from '../../../../utility/apis/dropdowns'
import { FM, log } from '../../../../utility/helpers/common'
import ApiEndpoints from '../../../../utility/http/ApiEndpoints'
import { stateReducer } from '../../../../utility/stateReducer'
import CustomDataTable, { TableFormData } from '../../../components/CustomDataTable/CustomDataTable'
import LoadingButton from '../../../components/buttons/LoadingButton'
import FormGroupCustom from '../../../components/formGroupCustom/FormGroupCustom'
import BsTooltip from '../../../components/tooltip'

interface States {
  page?: any
  per_page_record?: any
  changeObject?: any
  search?: any
  reload?: any
  isRemoving?: boolean
  isReloading?: boolean
  isAddingNewData?: boolean
  transactionFilter?: boolean
  filterData?: any
  lastRefresh?: any
}
type theProps = {
  loading?: boolean
  filterTransaction?: boolean
  filterMonthly?: boolean
  filterBoth?: boolean
  tabIndex?: any
  closeForm: () => void
}
const Both = (props: theProps) => {
  // Local States
  const initState: States = {
    page: 1,
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
    isRemoving: false,
    isReloading: false,
    isAddingNewData: false
  }
  const { tabIndex = null } = props
  const reducers = stateReducer<States>
  const [state, setState] = useReducer(reducers, initState)
  const form = useForm<any>()
  const { handleSubmit, control, reset, setValue, watch, clearErrors } = form
  // const [createOffer, result] = useCreateOrUpdateProductOfferMutation()
  // const [loadOffers, { data, isError, isLoading, isSuccess }] = useLoadProductOffersMutation()
  const [loadSubscription, { data, isError, isLoading, isSuccess }] =
    useAllSubscriptionLogMutation()
  const load = () => {
    loadSubscription({
      jsonData: {
        ...state?.filterData,
        store_id: state?.filterData?.store_id?.value,
        search: state?.search,
        subscription_type: 3
      },
      page: state?.page,
      per_page_record: state?.per_page_record
    })
  }

  const renderColor = [
    {
      when: (row: any) => row?.order?.is_admin_coupon === 1,
      style: {
        backgroundColor: '#632ca6',
        color: 'white'
      }
    }
  ]

  useEffect(() => {
    log(data, isLoading, isSuccess)
  }, [data, isLoading, isSuccess])
  useEffect(() => {
    if (tabIndex === '3') {
      load()
    }
  }, [
    state?.page,
    state?.per_page_record,
    state?.lastRefresh,
    state?.search,
    tabIndex,
    state.filterData
  ])
  useEffect(() => {
    setState({
      page: 1
    })
  }, [state.per_page_record])
  const handlePageChange = (e: TableFormData) => {
    // log('state change', e)
    setState({ ...e })
  }
  const onSubmit = (d: any) => {
    setState({
      filterData: {
        ...d
      }
    })
    // setTimeout(() => {
    //   setOpen(show)
    //   reset()
    // }, 1000)
  }
  const columns: TableColumn<any>[] = [
    {
      name: '#',
      maxWidth: '50px',
      cell: (row, index: any) => {
        // eslint-disable-next-line no-mixed-operators
        return parseInt(state?.per_page_record) * (state?.page - 1) + (index + 1)
      }
    },
    {
      name: <>{FM('order-number')}</>,

      minWidth: '120px',

      cell: (row) => <span className=''>{row?.order?.order_number}</span>
    },
    {
      name: <>{FM('store-name')}</>,

      minWidth: '120px',

      cell: (row) => <span className=''>{truncateText(row?.store_name, 25)}</span>
    },
    {
      name: <>{FM('amount')}</>,
      minWidth: '120px',
      //sortable: row => row.full_name,
      cell: (row) => (
        <BsTooltip
          role='button'
          title={
            row?.order?.is_admin_coupon === 1
              ? FM('admin-coupon-code-applied', { code: row?.order?.coupon_code })
              : null
          }
        >
          <div className='d-flex align-items-center'>
            <div className='user-info text-truncate'>
              <span className='d-block fw-bold text-truncate text-wrap'>
                {CF({ money: Number(row?.amount), currency: row?.currency })}
              </span>
            </div>
          </div>
        </BsTooltip>
      )
    },
    {
      name: <>{FM('percentage')}</>,
      minWidth: '120px',
      //sortable: row => row.full_name,
      cell: (row) => (
        <div className='d-flex align-items-center'>
          <div className='user-info text-truncate'>
            <span className='d-block fw-bold text-truncate text-wrap'>
              {`${row?.percentage} %`}
            </span>
          </div>
        </div>
      )
    },

    {
      name: <>{FM('subscription')}</>,
      minWidth: '120px',
      //   minWidth: '250px',
      cell: (row) => (
        <span className=''>
          {getKeyByValue(subscriptionStoreType, `${row?.subscription_type}`)}
        </span>
      )
    },
    {
      name: <>{FM('created-by')}</>,
      minWidth: '120px',
      //   minWidth: '250px',
      cell: (row) => (
        <span className=''>
          {row.is_monthly === 1 ? `${decrypt(row?.created_by?.name)}` : 'N/A'}
        </span>
      )
    },
    {
      name: <>{FM('amount-received-date')}</>,
      minWidth: '250px',
      //sortable: row => row.full_name,
      cell: (row) => (
        <div className='d-flex align-items-center'>
          <div className='user-info text-truncate'>
            {formatDate(row?.amount_received_date, 'DD-MM-YYYY HH:mm')}
          </div>
        </div>
      )
    },
    {
      name: <>{FM('amount-received')}</>,
      minWidth: '120px',
      //   minWidth: '250px',
      cell: (row) => (
        <Badge className='' color='light-success'>{`${
          row?.amount_received === 1 ? 'yes' : 'No'
        }`}</Badge>
      )
    }
  ]
  return (
    <>
      <Show IF={props?.filterBoth ?? false}>
        <div className='p-2'>
          <Form onSubmit={handleSubmit(onSubmit)}>
            <Row>
              <Col md='4'>
                <FormGroupCustom
                  label={FM('store')}
                  placeholder={FM('select-store')}
                  //   noLabel

                  async
                  searchItem={'search'}
                  path={ApiEndpoints.load_stores}
                  selectLabel='name'
                  selectValue={'id'}
                  modifyDropdownData={(d: any) => {
                    return {
                      ...d,
                      name: `${d?.name} / (${
                        d?.store_setting?.store_name ?? d?.store_setting?.store_name
                      })`
                    }
                  }}
                  defaultOptions
                  loadOptions={loadDropdown}
                  name={`store_id`}
                  type={'select'}
                  className='me-1 flex-1'
                  control={control}
                  rules={{ required: true }}
                  // prepend={<InputGroupText>{FM('get')}</InputGroupText>}
                  // append={<InputGroupText>{FM('item')}</InputGroupText>}
                />
              </Col>
              {/* "amount_received_month": null,
    "amount_received" */}
              <Col md='3'>
                <FormGroupCustom
                  placeholder={FM('amount-received-month')}
                  label={FM('amount-received-month')}
                  //   noLabel
                  name={'amount_received_month'}
                  type={'date'}
                  className='mb-0'
                  control={control}
                  rules={{ required: false }}
                />
              </Col>
              <Col md='3'>
                <FormGroupCustom
                  placeholder={FM('amount-received')}
                  label={FM('amount-received')}
                  //   noLabel
                  name={'amount_received'}
                  type={'number'}
                  className='mb-0'
                  control={control}
                  rules={{ required: false, min: 0 }}
                />
              </Col>
              <Col md='2' className='mt-25'>
                <LoadingButton className='btn btn-primary mt-2' type='submit' loading={false}>
                  {FM('filter')}
                </LoadingButton>
              </Col>
            </Row>
          </Form>
        </div>
      </Show>{' '}
      <CustomDataTable<any>
        initialPerPage={15}
        isLoading={isLoading}
        // options={options}
        // selectableRows
        columns={columns}
        paginatedData={data}
        // tableData={details?.product_offers}
        handlePaginationAndSearch={handlePageChange}
        conditionalRowStylesX={renderColor}
      />
    </>
  )
}
export default Both
