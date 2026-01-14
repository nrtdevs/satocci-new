import { useEffect, useReducer } from 'react'
import { TableColumn } from 'react-data-table-component'
import { useForm } from 'react-hook-form'
import { Link } from 'react-router-dom'
import { Col, Form, Row } from 'reactstrap'
import { useLoadSubscriptionsMutation } from '../../../../redux/RTKQuery/SubscriptionRTK'
import { getPath } from '../../../../router/RouteHelper'
import { subscriptionStoreType } from '../../../../utility/Const'
import Show from '../../../../utility/Show'
import { CF, getKeyByValue, truncateText } from '../../../../utility/Utils'
import { loadDropdown } from '../../../../utility/apis/dropdowns'
import { FM, log } from '../../../../utility/helpers/common'
import ApiEndpoints from '../../../../utility/http/ApiEndpoints'
import { stateReducer } from '../../../../utility/stateReducer'
import CustomDataTable, { TableFormData } from '../../../components/CustomDataTable/CustomDataTable'
import LoadingButton from '../../../components/buttons/LoadingButton'
import FormGroupCustom from '../../../components/formGroupCustom/FormGroupCustom'
import { SubscriptionParamsType } from '../index'

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
  loading?: any
  filterTransaction?: boolean
  filterMonthly?: boolean
  tabIndex?: any
  tabId?: any
  closeForm: () => void
}
const Transactional = ({
  loading = null,
  tabId = null,
  filterTransaction = false,
  filterMonthly = false,
  tabIndex = null,
  closeForm = () => {}
}: theProps) => {
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
      status: null,
      store_name: null
    },
    search: undefined,
    isRemoving: false,
    isReloading: false,
    isAddingNewData: false
  }

  const reducers = stateReducer<States>
  const [state, setState] = useReducer(reducers, initState)
  const form = useForm<SubscriptionParamsType>()
  const { handleSubmit, control, reset, setValue, watch, clearErrors } = form
  // const [createOffer, result] = useCreateOrUpdateProductOfferMutation()
  // const [loadOffers, { data, isError, isLoading, isSuccess }] = useLoadProductOffersMutation()
  const [loadSubscription, { data, isError, isLoading, isSuccess }] = useLoadSubscriptionsMutation()
  const load = () => {
    loadSubscription({
      jsonData: {
        ...state?.filterData,
        store_name: state.filterData.store_id?.label,
        search: state?.search,
        subscription_type: 1
        // store_name: watch('store_name'),
        // store_email: watch('store_email'),
        // city: watch('city')
      },
      page: state?.page,
      per_page_record: state?.per_page_record
    })
  }
  useEffect(() => {
    log(data, isLoading, isSuccess)
  }, [data, isLoading, isSuccess])
  useEffect(() => {
    if (tabIndex === '2') {
      load()
    }
  }, [
    loading,
    state?.page,
    tabIndex,
    state?.per_page_record,
    state?.lastRefresh,
    state?.search,
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
  const columns: TableColumn<SubscriptionParamsType>[] = [
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
      //   minWidth: '250px',
      minWidth: '120px',

      cell: (row) => (
        <Link
          state={{ ...row }}
          to={getPath('admin.subscriptions.log', {
            id: row?.store_subscription_id,
            typeID: row?.subscription_type,
            currency: row?.currency,
            logType: 2
          })}
          className='d-block'
          id='create-button'
        >
          {' '}
          <span className=''>{truncateText(row?.store_name, 25)}</span>
        </Link>
      )
    },
    {
      name: <>{FM('store-email')}</>,
      minWidth: '120px',
      //   minWidth: '250px',
      cell: (row) => <span className=''>{row?.store_email}</span>
    },
    {
      name: <>{FM('name')}</>,
      minWidth: '120px',
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
            <span className='d-block fw-bold text-truncate'>{row?.name}</span>
            {/* </Link> */}
          </div>
        </div>
      )
    },
    {
      name: <>{FM('amount')}</>,
      minWidth: '50px',
      //   minWidth: '250px',
      cell: (row) => (
        <span className='text-wrap'>
          {CF({ money: Number(row?.amount), currency: row?.currency })}
        </span>
      )
    },

    {
      name: <>{FM('subscription')}</>,
      minWidth: '50px',
      //   minWidth: '250px',
      cell: (row) => (
        <span className=''>
          {getKeyByValue(subscriptionStoreType, `${row?.subscription_type}`)}
        </span>
      )
    }

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

    // {
    //   name: <>{FM('action')}</>,
    //   allowOverflow: true,
    //   minWidth: '50px',
    //   cell: (row) => {
    //     return (
    //       <>
    //         {row?.status === 0 ? (
    //           <LoadingButton
    //             loading={result?.isLoading && state?.changeObject?.id === row?.id}
    //             size='sm'
    //             onClick={() =>
    //               setState({
    //                 changeObject: { ...row, status: '1' }
    //               })
    //             }
    //             color='primary'
    //           >
    //             {FM('activate')}
    //           </LoadingButton>
    //         ) : (
    //           <LoadingButton
    //             loading={result?.isLoading && state?.changeObject?.id === row?.id}
    //             size='sm'
    //             onClick={() =>
    //               setState({
    //                 changeObject: { ...row, status: '0' }
    //               })
    //             }
    //             color='danger'
    //           >
    //             {FM('expire')}
    //           </LoadingButton>
    //         )}
    //       </>
    //     )
    //   }
    // }
  ]
  return (
    <>
      <Show IF={filterTransaction ?? false}>
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
                  selectLabel='store_setting.store_name'
                  selectValue={'id'}
                  defaultOptions
                  loadOptions={loadDropdown}
                  name={`store_id`}
                  type={'select'}
                  className='mb-25'
                  control={control}
                  rules={{ required: true }}
                  // prepend={<InputGroupText>{FM('get')}</InputGroupText>}
                  // append={<InputGroupText>{FM('item')}</InputGroupText>}
                />
              </Col>
              <Col md='3'>
                <FormGroupCustom
                  placeholder={FM('store-email')}
                  label={FM('store-email')}
                  //   noLabel
                  name={'store_email'}
                  type={'text'}
                  className='mb-25'
                  control={control}
                  rules={{ required: false }}
                />
              </Col>
              <Col md='3'>
                <FormGroupCustom
                  placeholder={FM('city')}
                  label={FM('city')}
                  //   noLabel
                  name={'city'}
                  type={'text'}
                  className='mb-25'
                  control={control}
                  rules={{ required: false }}
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
      </Show>
      <CustomDataTable<SubscriptionParamsType>
        initialPerPage={15}
        isLoading={isLoading}
        // options={options}
        // selectableRows
        columns={columns}
        paginatedData={data}
        // tableData={details?.product_offers}
        handlePaginationAndSearch={handlePageChange}
      />
    </>
  )
}
export default Transactional
