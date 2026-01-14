import { useEffect, useReducer } from 'react'
import { TableColumn } from 'react-data-table-component'
import { RefreshCcw } from 'react-feather'
import { useForm } from 'react-hook-form'
import { ButtonGroup } from 'reactstrap'
import {
  gateKeeperActivityParams,
  useLoadGateKeeperActivityMutation
} from '../../../../redux/RTKQuery/StoreRTK'
import { decrypt, formatDate, truncateText } from '../../../../utility/Utils'
import { loadDropdown } from '../../../../utility/apis/dropdowns'
import { FM } from '../../../../utility/helpers/common'
import useUser from '../../../../utility/hooks/useUser'
import useUserType from '../../../../utility/hooks/useUserType'
import ApiEndpoints from '../../../../utility/http/ApiEndpoints'
import { stateReducer } from '../../../../utility/stateReducer'
import CustomDataTable, { TableFormData } from '../../../components/CustomDataTable/CustomDataTable'
import LoadingButton from '../../../components/buttons/LoadingButton'
import FormGroupCustom from '../../../components/formGroupCustom/FormGroupCustom'
import Header from '../../../components/header'
import { useNoViewModal } from '../../../components/modal/HandleModal'
import BsPopover from '../../../components/popover'
import Ratings from '../../../components/ratings'

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

const GateKeeperLog = ({
  filterData = null,
  setLoadingResp = () => {},
  lastRefLoad = ''
}: {
  filterData?: any
  lastRefLoad?: any
  setLoadingResp?: (e: boolean) => void
}) => {
  const initState: States = {
    page: 1,
    lastRefresh: new Date().getTime(),
    per_page_record: 5,
    changeObject: null,
    transactionFilter: false,
    filterData: {
      properties: null
    },
    search: undefined,
    isRemoving: false,
    isReloading: false,
    isAddingNewData: false
  }

  const reducers = stateReducer<States>
  const [state, setState] = useReducer(reducers, initState)
  const form = useForm<any>()
  const [showModal, handleModal] = useNoViewModal()
  const userType = useUserType()
  const user = useUser()
  const { handleSubmit, control, reset, setValue, watch, clearErrors } = form
  const [loadActivity, { data, isError, isLoading, isSuccess }] =
    useLoadGateKeeperActivityMutation()
  const load = () => {
    loadActivity({
      jsonData: {
        search: state?.search,
        user_id: watch('user_id')?.value,
        date_from: watch('date_from'),
        date_to: watch('date_to'),
        order_by: '1'
        // subscription_type: 2,
        // store_name: watch('store_name'),
        // store_email: watch('store_email'),
        // city: watch('city')
      },
      page: state?.page,
      per_page_record: state?.per_page_record
    })
  }

  useEffect(() => {
    // log(data, isLoading, isSuccess)
    setLoadingResp(isLoading)
  }, [isLoading])
  useEffect(() => {
    load()
  }, [
    state?.page,
    state?.per_page_record,
    state?.lastRefresh,
    state?.search,
    watch('user_id'),
    watch('date_from'),
    watch('date_to')
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
  const columns: TableColumn<gateKeeperActivityParams>[] = [
    {
      name: <>{FM('order-number')}</>,

      cell: (row) => (
        // <span
        //   className=''
        //   onClick={() => {
        //     setState({
        //       edit: row
        //     })
        //     handleModal()
        //   }}
        // >
        <span className=' fw-bolder'>{truncateText(row?.order?.order_number, 25)}</span>
        // </span>
      )
    },

    {
      name: <>{FM('cart-items')}</>,

      cell: (row) => <span className=''>{truncateText(row?.order?.total_cart_items, 50)}</span>
    },
    // {
    //   name: <>{FM('paid-amount')}</>,

    //   cell: (row) => (
    //     <span className=''>
    //       {/* {row?.order?.currency_symbol}
    //       {truncateText(row?.order?.paid_amount, 50)} */}
    //       {CF({ money: row?.order?.paid_amount, currency: row?.order?.currency })}
    //     </span>
    //   )
    // },
    {
      name: <>{FM('scan-by')}</>,

      cell: (row) => (
        <span className=''>{truncateText(decrypt(`${row?.gate_keeper?.name}`) ?? 'N/A', 25)}</span>
      )
    },
    {
      name: <>{FM('average-rating')}</>,

      cell: (row) => (
        // <span className=''>{truncateText(row?.gate_keeper?.customer_rating ?? 'N/A', 25)}</span>
        <div className='d-flex align-items-center'>
          <span className='d-flex text-wrap'>
            {row?.order?.customer_rating > 0 ? (
              <Ratings
                key={`rating-${row?.order?.customer_rating}`}
                rating={Number(row?.order?.customer_rating)}
              />
            ) : (
              <span className='text-danger'>{'N/A'}</span>
            )}
          </span>
        </div>
      )
    },
    {
      name: <>{FM('current-rating')}</>,

      cell: (row) => (
        // <span className=''>{truncateText(row?.gate_keeper?.customer_rating ?? 'N/A', 25)}</span>
        <div className='d-flex align-items-center'>
          <span className='d-flex text-wrap'>
            {row?.order?.customer_rating_list?.rating > 0 ? (
              <Ratings
                key={`rating-${row?.order?.customer_rating_list?.rating}`}
                rating={row?.order?.customer_rating_list?.rating}
              />
            ) : (
              <span className='text-danger'>{'N/A'}</span>
            )}
          </span>
        </div>
      )
    },
    {
      name: <>{FM('comment')}</>,

      cell: (row) => (
        // <span className=''>{truncateText(row?.gate_keeper?.customer_rating ?? 'N/A', 25)}</span>
        <BsPopover
          Tag={'p'}
          title={FM('comment')}
          content={
            <div className='d-flex align-items-center'>
              <span className='d-flex text-wrap'>{row?.order?.customer_rating_list?.note}</span>
            </div>
          }
        >
          <span className='d-flex text-wrap'>
            {truncateText(row?.order?.customer_rating_list?.note, 30)}
          </span>
        </BsPopover>
      )
    },
    {
      name: <>{FM('scan-at')}</>,

      cell: (row) => <span className=''>{formatDate(row?.created_at, 'YYYY-MM-DD HH:mm:ss')}</span>
    }
  ]
  return (
    <>
      <Header title={FM('gatekeeper-rating')} titleCol='4' childCol='8'>
        <FormGroupCustom
          noLabel
          tooltip={FM('store')}
          key={`user_id-${userType}-${user?.store_id}`}
          label={FM('gate-guard')}
          isClearable
          name={`user_id`}
          // modifyDropdownData={(d: any) => {
          //   return {
          //     ...d,
          //     name: `${d?.name} / (${d?.store_setting?.store_name ?? d?.store_setting?.store_name})`
          //   }
          // }}
          type={'select'}
          className='me-1 flex-1'
          path={ApiEndpoints.employee_list}
          jsonData={{
            user_type_id: 5
          }}
          selectLabel='name'
          selectValue={'id'}
          async
          method='post'
          defaultOptions
          loadOptions={loadDropdown}
          control={control}
          rules={{ required: true }}
        />
        <FormGroupCustom
          noLabel
          tooltip={FM('from-date')}
          label={FM('from-date')}
          //   noLabel
          type={'date'}
          name={'date_from'}
          className='me-1 '
          control={control}
          rules={{ required: false }}
        />

        <FormGroupCustom
          noLabel
          tooltip={FM('to-date')}
          label={FM('to-date')}
          //   noLabel
          type={'date'}
          name={'date_to'}
          className='me-1'
          control={control}
          rules={{ required: false }}
        />

        <ButtonGroup>
          <LoadingButton
            loading={isLoading}
            onClick={() => {
              setState({
                lastRefresh: new Date().getTime()
              })
              reset()
            }}
            className='btn btn-dark btn-sm'
            size='sm'
          >
            <RefreshCcw size={14} />
          </LoadingButton>
        </ButtonGroup>
      </Header>
      <CustomDataTable<gateKeeperActivityParams>
        initialPerPage={5}
        isLoading={isLoading}
        // options={options}
        //selectableRows
        hideHeader
        HidePerPage
        columns={columns}
        paginatedData={data}
        // tableData={details?.product_offers}
        handlePaginationAndSearch={handlePageChange}
      />
    </>
  )
}
export default GateKeeperLog
