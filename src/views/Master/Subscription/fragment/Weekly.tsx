import { useEffect, useReducer } from 'react'
import { TableColumn } from 'react-data-table-component'
import { useForm } from 'react-hook-form'
import { Col, Form, Row } from 'reactstrap'
import { useLoadSubscriptionsMutation } from '../../../../redux/RTKQuery/SubscriptionRTK'
import { FM, log } from '../../../../utility/helpers/common'
import Show from '../../../../utility/Show'
import { stateReducer } from '../../../../utility/stateReducer'
import { truncateText } from '../../../../utility/Utils'
import CustomDataTable, { TableFormData } from '../../../components/CustomDataTable/CustomDataTable'
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
  loading?: boolean
  filterTransaction?: boolean
  filterMonthly?: boolean
  filterWeekly?: boolean
  closeForm: () => void
}
const Weekly = (props: theProps) => {
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
        subscription_type: 3,
        store_name: watch('store_name'),
        store_email: watch('store_email'),
        city: watch('city')
      },
      page: state?.page,
      per_page_record: state?.per_page_record
    })
  }
  useEffect(() => {
    log(data, isLoading, isSuccess)
  }, [data, isLoading, isSuccess])
  useEffect(() => {
    load()
  }, [
    state?.page,
    state?.per_page_record,
    state?.lastRefresh,
    watch('store_email'),
    watch('store_name'),
    watch('city')
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
      name: <>{FM('name')}</>,
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
            <span className='d-block fw-bold text-truncate'>{truncateText(row?.name, 25)}</span>
            {/* </Link> */}
          </div>
        </div>
      )
    },
    {
      name: <>{FM('store-name')}</>,
      //   minWidth: '250px',
      minWidth: '120px',
      //sortable: row => row.full_name,
      cell: (row) => <span className=''>{truncateText(row?.store_name, 20)}</span>
    },
    {
      name: <>{FM('email')}</>,
      minWidth: '120px',
      //   minWidth: '250px',
      cell: (row) => <span className=''>{truncateText(row?.email, 20)}</span>
    },
    {
      name: <>{FM('sub-store-limit')}</>,
      minWidth: '120px',
      //   minWidth: '250px',
      cell: (row) => <span className=''>{row?.sub_store_limit}</span>
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
      <Show IF={props?.filterWeekly ?? false}>
        <div className='p-2'>
          <Form onSubmit={handleSubmit(onSubmit)}>
            <Row>
              <Col md='4'>
                <FormGroupCustom
                  placeholder={FM('store-name')}
                  label={FM('store-name')}
                  //   noLabel
                  name={'store_name'}
                  type={'text'}
                  //   datePickerOptions={{ minDate: formatDate(new Date()) }}
                  className='mb-0'
                  control={control}
                  rules={{ required: false }}
                />
              </Col>
              <Col md='4'>
                <FormGroupCustom
                  placeholder={FM('store-email')}
                  label={FM('store-email')}
                  //   noLabel
                  name={'store_email'}
                  type={'text'}
                  className='mb-0'
                  control={control}
                  rules={{ required: false }}
                />
              </Col>
              <Col md='4'>
                <FormGroupCustom
                  placeholder={FM('city')}
                  label={FM('city')}
                  //   noLabel
                  name={'city'}
                  type={'text'}
                  className='mb-0'
                  control={control}
                  rules={{ required: false }}
                />
              </Col>
            </Row>
          </Form>
        </div>
      </Show>
      <CustomDataTable<SubscriptionParamsType>
        initialPerPage={15}
        isLoading={isLoading}
        // options={options}
        selectableRows
        columns={columns}
        paginatedData={data}
        // tableData={details?.product_offers}
        handlePaginationAndSearch={handlePageChange}
      />
    </>
  )
}
export default Weekly
