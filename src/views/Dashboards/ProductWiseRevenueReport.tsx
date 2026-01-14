// ** Reactstrap Imports
import { useForm } from 'react-hook-form'
import { ButtonGroup, Col, Row, Table, Button } from 'reactstrap'
import Header from '../components/header'
import { FM, log } from '../../utility/helpers/common' // Removed log
import Show from '../../utility/Show'
import FormGroupCustom from '../components/formGroupCustom/FormGroupCustom'
import ApiEndpoints from '../../utility/http/ApiEndpoints'
import { UserType } from '../../utility/Const'
import useUserType from '../../utility/hooks/useUserType'
import { loadDropdown } from '../../utility/apis/dropdowns'
import LoadingButton from '../components/buttons/LoadingButton'
import { BarChart, DollarSign, List, RefreshCcw } from 'react-feather'
import {
  useProductWiseRevenueReportMutation,
  useSingleProductWiseRevenueReportMutation
  // Removed useStoreReportsMutation as it was unused
} from '../../redux/RTKQuery/StoreRTK'
import useUser from '../../utility/hooks/useUser'
import { formatDate } from '../../utility/Utils'
import { useEffect } from 'react' // Added useEffect
import StatsHorizontal from '../../@core/components/widgets/stats/StatsHorizontal'

interface ProductItem {
  variant_id: number
  variant: string
  quantity: number
  cost: number
  sale_amount: number
  earning: number
  store_name?: string
}

interface ProductWiseRevenuePayload {
  [date: string]: {
    [currency: string]: ProductItem[]
  }
}

interface ProductWiseRevenueReportResponse {
  success: boolean
  intime: string
  outtime: string
  message: string
  payload: ProductWiseRevenuePayload
  status: number
}
interface CurrencyTotals {
  total_quantity: number
  total_cost: number
  total_sale: number
  total_earning: number
}

interface Payload {
  summary: Record<string, CurrencyTotals>
}

interface Result {
  data: {
    payload: Payload
  }
}

// Assuming `result` is passed in as a prop
interface Props {
  result: Result
}

const RevenueTable = () => {
  const [loadReport, result] = useProductWiseRevenueReportMutation()
  // const [loadReports, resultdata] = useSingleProductWiseRevenueReportMutation()
  const userType = useUserType()
  const user = useUser()
  const form = useForm<any>({
    defaultValues: {
      store_id: null,
      from_date: null,
      to_date: null
    }
  })
  const { control, watch, setValue, reset } = form

  const handleFilter = () => {
    loadReport({
      jsonData: {
        store_id: watch('store_id')
          ? watch('store_id')?.value
          : userType === UserType.Admin || userType === UserType.AdminEmployee
          ? undefined
          : user?.store_id,
        start_date: watch('from_date') ? formatDate(watch('from_date'), 'YYYY-MM-DD') : undefined,
        end_date: watch('to_date') ? formatDate(watch('to_date'), 'YYYY-MM-DD') : undefined
      }
    })
  }

  // useEffect(() => {
  //   loadReports({
  //     jsonData: {
  //       store_id: watch('store_id')
  //         ? watch('store_id')?.value
  //         : userType === UserType.Admin || userType === UserType.AdminEmployee
  //         ? undefined
  //         : user?.store_id,
  //       start_date: watch('from_date') ? formatDate(watch('from_date'), 'YYYY-MM-DD') : undefined,
  //       end_date: watch('to_date') ? formatDate(watch('to_date'), 'YYYY-MM-DD') : undefined
  //     }
  //   })
  // }, [])
  // console.log(resultdata, 'resultdata')

  const handleReset = () => {
    reset({
      store_id: null,
      from_date: null,
      to_date: null
    })
  }

  useEffect(() => {
    handleFilter() // Load report on initial mount
  }, [])

  // Check if the data exists and has entries
  const summary = result?.data?.payload?.summary
  const totalSale: any = result?.data?.payload?.total_orders_all
    ? result?.data?.payload?.total_orders_all
    : 0

  return (
    <>
      <Row className='g-2 align-items-center mb-2'>
        {/* Title */}
        <Col md={3}>
          <h2 className='mb-0 text-primary text-capitalize'>{FM('product-revenue')}</h2>
        </Col>

        {/* Store Select */}
        <Col md={3}>
          <Show IF={userType === UserType.Admin || userType === UserType.AdminEmployee}>
            <FormGroupCustom
              noLabel
              noGroup
              placeholder={FM('select-store')}
              async
              isClearable
              searchItem={'search'}
              path={ApiEndpoints.load_stores}
              selectLabel='name'
              selectValue='id'
              modifyDropdownData={(d: any) => ({
                ...d,
                name: `${d?.name} / (${d?.store_setting?.store_name})`
              })}
              jsonData={{
                with_substore: 'yes',
                status: '1'
              }}
              defaultOptions
              loadOptions={loadDropdown}
              name='store_id'
              type='select'
              className='form-control-sm'
              control={control}
            />
          </Show>
        </Col>

        {/* From Date */}
        <Col md={2}>
          <FormGroupCustom
            noLabel
            noGroup
            placeholder={FM('from-date')}
            type='date'
            name='from_date'
            control={control}
            rules={{ required: false }}
            className='form-control-sm'
          />
        </Col>

        {/* To Date */}
        <Col md={2}>
          <FormGroupCustom
            noLabel
            noGroup
            placeholder={FM('to-date')}
            type='date'
            name='to_date'
            control={control}
            rules={{ required: false }}
            className='form-control-sm'
          />
        </Col>

        {/* Buttons */}
        <Col md={2} className='d-flex'>
          <ButtonGroup className='w-80'>
            <LoadingButton
              loading={result?.isLoading}
              onClick={handleFilter}
              size='sm'
              color='primary'
              className='flex-fill'
            >
              {FM('filter')}
            </LoadingButton>
            <Button
              color='secondary'
              size='sm'
              onClick={() => {
                handleReset()
                handleFilter()
              }}
              className='flex-fill'
            >
              <RefreshCcw size={18} />
            </Button>
          </ButtonGroup>
        </Col>
      </Row>

      <div>
        {(() => {
          if (!summary || Object.keys(summary).length === 0) return null
          const grand: any = Object.values(summary).reduce(
            (acc: any, val: any) => {
              acc.total_quantity += val.total_quantity || 0
              acc.total_cost += val.total_cost || 0
              acc.total_sale += val.total_sale || 0
              acc.total_earning += val.total_earning || 0
              return acc
            },
            { total_quantity: 0, total_cost: 0, total_sale: 0, total_earning: 0 }
          )

          return (
            <>
              {/* Grand Total Row for the Table */}
              {/* <tr className='table-primary fw-bold'>
                  <td colSpan={2} className='text-end'>
                    Grand Total
                  </td>
                  <td className='text-end'>{grand.total_quantity}</td>
                  <td className='text-end'>{grand.total_cost.toFixed(2)}</td>
                  <td className='text-end'>{grand.total_sale.toFixed(2)}</td>
                  <td className='text-end'>{grand.total_earning.toFixed(2)}</td>
                </tr> */}

              {/* Grand Total Stats Outside the Table */}

              <h5 className='fw-bolder'>Grand Total</h5>

              <Row>
                <Col md='3'>
                  <StatsHorizontal
                    icon={<BarChart />}
                    color='info'
                    stats={`${totalSale}`}
                    statTitle={FM('total-orders')}
                  />
                </Col>
                <Col md='3'>
                  <StatsHorizontal
                    icon={<List />}
                    color='secondary'
                    stats={`${grand.total_quantity}`}
                    statTitle={FM('total-quantity-(All)')}
                  />
                </Col>
                {/* <Col md='3'>
                  <StatsHorizontal
                    icon={<DollarSign />}
                    color='info'
                    stats={`${grand.total_cost.toFixed(2)}`}
                    statTitle={FM('total-purchase-cost-(All)')}
                  />
                </Col>
                <Col md='3'>
                  <StatsHorizontal
                    icon={<DollarSign />}
                    color='success'
                    stats={`${grand.total_sale.toFixed(2)}`}
                    statTitle={FM('total-sale-cost-(all)')}
                  />
                </Col>

                <Col md='3'>
                  <StatsHorizontal
                    icon={<DollarSign />}
                    color='warning'
                    stats={`${grand.total_earning.toFixed(2)}`}
                    statTitle={FM('total-earning-(All)')}
                  />
                </Col> */}
              </Row>
            </>
          )
        })()}

        <h4 className='fw-bolder'>Currency Wise Report</h4>
        {/* 💰 Currency-wise Breakdown */}
        {summary && Object.keys(summary).length > 0 && (
          <>
            {Object.entries(summary).map(([currency, totals]: any, index) => (
              <Col md='12' key={currency} className=''>
                {/* <h6 className='fw-bold text-dark mb-2'>{currency}</h6> */}
                <Row className=''>
                  <Col md='3' sm='6'>
                    {/* 🪙 Total Quantity */}
                    <StatsHorizontal
                      icon={<List />}
                      color='secondary'
                      stats={`${totals.total_quantity}`}
                      statTitle={`${FM('total-quantity')}(${currency})`}
                    />
                  </Col>
                  <Col md='3' sm='6'>
                    {/* 💵 Purchase Cost */}
                    <StatsHorizontal
                      icon={<DollarSign />}
                      color='info'
                      stats={`${totals.total_cost.toFixed(2)} ${currency}`}
                      statTitle={`${FM('purchase-cost')} (${currency})`}
                    />
                  </Col>
                  <Col md='3' sm='6'>
                    {/* 💰 Sale Cost */}
                    <StatsHorizontal
                      icon={<DollarSign />}
                      color='success'
                      stats={`${totals.total_sale.toFixed(2)} ${currency}`}
                      statTitle={`${FM('sold-amount')} (${currency})`}
                    />
                  </Col>
                  <Col md='3' sm='6'>
                    {/* 📈 Earnings */}
                    <StatsHorizontal
                      icon={<DollarSign />}
                      color={totals.total_earning >= 0 ? 'warning' : 'danger'}
                      stats={`${totals.total_earning.toFixed(2)} ${currency}`}
                      statTitle={`${FM('earning')} (${currency})`}
                    />
                  </Col>
                </Row>
              </Col>
            ))}
          </>
        )}

        {/* 🧮 Grand Total Row */}
      </div>

      <Table bordered striped responsive>
        <thead>
          <tr>
            <th className='text-start'>{FM('date')}</th>
            <th className='text-start'>{FM('product')}</th>
            <th className='text-start'>{FM('store-name')}</th>
            <th className='text-start'>{FM('purchase-quantity')}</th>

            <th className='text-start'>{FM('currency')}</th>
            <th className='text-start'>{FM('purchase-cost')}</th>
            <th className='text-start'>{FM('sold-amount')}</th>
            <th className='text-start'>{FM('earning')}</th>
          </tr>
        </thead>
        <tbody>
          {/* {result?.data?.payload && Object.keys(result?.data?.payload).length > 0 ? (
            Object?.entries(result?.data?.payload as ProductWiseRevenuePayload)?.map(
              ([date, currencies]) =>
                Object?.entries(currencies)?.map(([currency, products]: [string, ProductItem[]]) =>
                  products?.map((item: ProductItem, idx: number) => (
                    <tr key={`${date}-${currency}-${item?.variant_id}-${idx}`}>
                      {Object?.keys(currencies)[0] === currency && idx === 0 ? (
                        <td
                          className='text-start  text-black'
                          rowSpan={Object?.values(currencies).flat().length}
                        >
                          {date}
                        </td>
                      ) : null}

                      <td className='text-start '>{item?.variant}</td>
                      <td className='text-start'>{item?.quantity}</td>
                      <td className='text-start'>{item?.store_name}</td>
                      {idx === 0 ? (
                        <td className='text-start' rowSpan={products?.length}>
                          {currency}
                        </td>
                      ) : null}
                      <td className='text-end'>{(item?.cost || 0).toFixed(2)}</td>
                      <td className='text-end'>{(item?.sale_amount || 0).toFixed(2)}</td>
                      <td className='text-end'>{(item?.earning || 0).toFixed(2)}</td>
                    </tr>
                  ))
                )
            )
          ) : (
            <tr>
              <td colSpan={8} className='text-center'>
                {result?.isLoading ? FM('loading-data') : FM('no-data-found')}
              </td>
            </tr>
          )} */}
          {result?.data?.payload?.data && Object.keys(result?.data?.payload?.data).length > 0 ? (
            Object.entries(result?.data?.payload?.data as ProductWiseRevenuePayload).map(
              ([date, currencies], dateIndex) =>
                Object.entries(currencies).map(([currency, products]: [string, ProductItem[]]) =>
                  products.map((item: ProductItem, idx: number) => {
                    const isFirstRowOfDate = Object.keys(currencies)[0] === currency && idx === 0
                    const dateTextColorClass = dateIndex % 2 === 0 ? 'text-primary' : 'text-info'

                    return (
                      <tr key={`${date}-${currency}-${item?.variant_id}-${idx}`}>
                        {/* Date column with rowSpan and text color */}
                        {isFirstRowOfDate && (
                          <td
                            className={`text-start px-2 py-1 fs-6 fw-bolder ${dateTextColorClass}`}
                            rowSpan={Object.values(currencies).flat().length}
                          >
                            {date}
                          </td>
                        )}

                        {/* Product info */}
                        <td className='text-start'>{item?.variant}</td>
                        <td className='text-start'>{item?.store_name}</td>
                        <td className='text-start'>{item?.quantity}</td>

                        {/* Currency column */}
                        {idx === 0 && (
                          <td className='text-start' rowSpan={products.length}>
                            {currency}
                          </td>
                        )}

                        {/* Numbers */}
                        <td className='text-end'>{(item?.cost || 0).toFixed(2)}</td>
                        <td className='text-end'>{(item?.sale_amount || 0).toFixed(2)}</td>
                        <td className='text-end'>{(item?.earning || 0).toFixed(2)}</td>
                      </tr>
                    )
                  })
                )
            )
          ) : result?.isLoading ? (
            <tr>
              <td colSpan={8} className='text-center'>
                {FM('loading-data')}
              </td>
            </tr>
          ) : (
            <tr>
              <td colSpan={8} className='text-center'>
                {FM('no-data-found')}
              </td>
            </tr>
          )}
        </tbody>
      </Table>
    </>
  )
}

export default RevenueTable
