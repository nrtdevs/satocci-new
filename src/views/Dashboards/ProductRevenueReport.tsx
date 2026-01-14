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
import { useEffect, useState } from 'react' // Added useEffect
import StatsHorizontal from '../../@core/components/widgets/stats/StatsHorizontal'

interface ProductDetails {
  quantity: number
  cost: number
  sale_amount: number
  earning: number
}

interface RawProductData {
  variant_id: number
  variant: string
  store_name: string
  [key: string]: ProductDetails | number | string // Allow string keys to be ProductDetails, number, or string
}

interface FlattenedProductItem {
  variant_id: number
  variant: string
  store_name: string
  currency_code: string
  quantity: number
  cost: number
  sale_amount: number
  earning: number
}

interface CurrencyTotals {
  total_quantity: number
  total_cost: number
  total_sale: number
  total_earning: number
  total_orders: number
}

interface ProductWiseRevenuePayload {
  data: RawProductData[]
  summary: Record<string, CurrencyTotals>
  total_quantity_all: number
}

interface ProductWiseRevenueReportResponse {
  success: boolean
  intime: string
  outtime: string
  message: string
  payload: ProductWiseRevenuePayload
  status: number
}

const transformAndGroupData = (rawData: RawProductData[] | undefined) => {
  if (!rawData) return {}

  const groupedByCurrency: Record<string, FlattenedProductItem[]> = {}

  rawData.forEach((rawItem) => {
    const { variant_id, variant, store_name, ...currencyObjects } = rawItem

    Object.entries(currencyObjects).forEach(([currencyCode, details]) => {
      // Ensure 'details' is of type ProductDetails before casting
      if (
        typeof details === 'object' &&
        details !== null &&
        'quantity' in details &&
        'cost' in details &&
        'sale_amount' in details &&
        'earning' in details
      ) {
        const productDetails = details as ProductDetails

        const flattenedItem: FlattenedProductItem = {
          variant_id,
          variant,
          store_name,
          currency_code: currencyCode,
          quantity: productDetails.quantity,
          cost: productDetails.cost,
          sale_amount: productDetails.sale_amount,
          earning: productDetails.earning
        }

        if (!groupedByCurrency[currencyCode]) {
          groupedByCurrency[currencyCode] = []
        }
        groupedByCurrency[currencyCode].push(flattenedItem)
      }
    })
  })
  return groupedByCurrency
}

const ProductRevenueReport = () => {
  const [loadReports, resultdata] = useSingleProductWiseRevenueReportMutation()
  const userType = useUserType()
  const [productData, setProductData] = useState<any>(false)
  const user = useUser()
  const isAdmin: any = !!(userType === UserType.Admin || user?.store_id === UserType.Admin)
  const form = useForm<any>({
    defaultValues: {
      store_id: null,
      from_date: null,
      to_date: null
    }
  })
  const { control, watch, setValue, reset, formState } = form

  const handleFilter = () => {
    loadReports({
      jsonData: {
        store_id: watch('store_id')
          ? watch('store_id')?.value
          : userType === UserType.Admin || userType === UserType.AdminEmployee
          ? undefined
          : user?.store_id,
        start_date: watch('from_date') ? formatDate(watch('from_date'), 'YYYY-MM-DD') : undefined,
        end_date: watch('to_date') ? formatDate(watch('to_date'), 'YYYY-MM-DD') : undefined,
        product_variant_ids: watch('variant_id') ? [watch('variant_id')?.value] : undefined
      }
    })
  }

  useEffect(() => {
    handleFilter() // Load report on initial mount
  }, [])

  const handleReset = () => {
    reset({
      store_id: null,
      from_date: null,
      to_date: null
    })
    setProductData(false)
    handleFilter() // Reload report after reset
  }

  const handleProductData = () => {
    setProductData((prev: boolean) => !prev)
  }

  // console.log(productData, 'productDAta')
  // Check if the data exists and has entries
  const summary = resultdata?.data?.payload?.summary
  const groupedProducts = transformAndGroupData(resultdata?.data?.payload?.data)
  const totalSale: any = resultdata?.data?.payload?.total_orders_all

  // console.log(totalSale, 'totalsale')

  return (
    <>
      <Row className='g-2 align-items-center mb-2'>
        {/* Title */}
        <Col md={3} sm={3}>
          <h2 className='mb-0 text-primary text-capitalize'>{FM('product-wise-revenue')}</h2>
        </Col>

        {/* Store Select */}
        <Col md={3} sm={3}>
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
        {productData === true ? (
          <>
            <Col md='3' sm={3}>
              <FormGroupCustom
                key={`${watch('store_id')}`}
                label={FM('product')}
                placeholder={FM('product')}
                noLabel
                async
                isClearable
                path={ApiEndpoints.load_product}
                selectLabel='name'
                selectValue={'id'}
                defaultOptions
                jsonData={{
                  store_id: isAdmin ? Number(watch('store_id')?.value) : Number(user?.store_id)
                }}
                loadOptions={loadDropdown}
                name={`product_id`}
                type={'select'}
                className='mb-1'
                control={control}
                rules={{
                  required: false
                }}
              />
            </Col>
            <Col md='3' sm={3}>
              <FormGroupCustom
                key={`${watch('product_id')?.value}-fjffj-${user?.store_id}`}
                label={FM('product-variant')}
                placeholder={FM('product-variant')}
                noLabel
                async
                isDisabled={!formState.isValid || !watch('product_id')}
                isClearable
                path={`${ApiEndpoints.load_product_variant}${watch('product_id')?.value}`}
                selectLabel='name'
                selectValue={'id'}
                jsonData={{
                  store_id: isAdmin ? Number(watch('store_id')?.value) : Number(user?.store_id)
                }}
                defaultOptions
                loadOptions={loadDropdown}
                name={`variant_id`}
                type={'select'}
                className='mb-2'
                control={control}
                rules={{ required: false }}
                //   prepend={<InputGroupText>{FM('get')}</InputGroupText>}
                //   append={<InputGroupText>{FM('item')}</InputGroupText>}
              />
            </Col>
          </>
        ) : (
          ''
        )}

        {/* From Date */}
        <Col md={2} sm={2}>
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
        <Col md={2} sm={2}>
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
        <Col md={2} sm={2} className='d-flex'>
          <ButtonGroup className='w-100'>
            <LoadingButton
              loading={resultdata?.isLoading}
              onClick={handleFilter}
              size='sm'
              color='primary'
              className='flex-fill'
            >
              {FM('filter')}
            </LoadingButton>

            <Button color='secondary' size='sm' onClick={handleReset} className='flex-fill'>
              <RefreshCcw size={18} />
            </Button>
            {productData === false && (
              <>
                {
                  <Button color='info' size='sm' onClick={handleProductData} className='flex-fill '>
                    {FM('product-filter')}
                  </Button>
                }
              </>
            )}
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
              acc.total_orders += val.total_orders || 0
              return acc
            },
            { total_quantity: 0, total_cost: 0, total_sale: 0, total_earning: 0 }
          )

          return (
            <>
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
        {summary && Object.keys(summary).length > 0 && (
          <>
            {Object.entries(summary).map(([currency, totals]: any) => (
              <Col md='12' key={currency} className=''>
                <Row className=''>
                  <Col md='3' sm='6'>
                    <StatsHorizontal
                      icon={<List />}
                      color='secondary'
                      stats={`${totals.total_quantity}`}
                      statTitle={`${FM('total-quantity')}(${currency})`}
                    />
                  </Col>
                  <Col md='3' sm='6'>
                    <StatsHorizontal
                      icon={<DollarSign />}
                      color='info'
                      stats={`${totals.total_cost.toFixed(2)} ${currency}`}
                      statTitle={`${FM('purchase-cost')} (${currency})`}
                    />
                  </Col>
                  <Col md='3' sm='6'>
                    <StatsHorizontal
                      icon={<DollarSign />}
                      color='success'
                      stats={`${totals.total_sale.toFixed(2)} ${currency}`}
                      statTitle={`${FM('sold-amount')} (${currency})`}
                    />
                  </Col>
                  <Col md='3' sm='6'>
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
      </div>

      <Table bordered striped responsive>
        <thead>
          <tr>
            {/* <th className='text-start'>{FM('currency')}</th> */}
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
          {Object.keys(groupedProducts).length > 0 ? (
            Object.entries(groupedProducts).map(
              ([currency, products]: [string, FlattenedProductItem[]]) =>
                products.map((item: FlattenedProductItem, idx: number) => (
                  <tr key={`${currency}-${item?.variant_id}-${idx}`}>
                    {/* {idx === 0 && (
                      <td className='text-start px-2 py-1 fs-6 fw-bolder' rowSpan={products.length}>
                        {currency}
                      </td>
                    )} */}
                    <td className='text-start'>{item?.variant}</td>
                    <td className='text-start'>{item?.store_name}</td>
                    <td className='text-start'>{item?.quantity}</td>

                    <td className='text-start'>{item?.currency_code}</td>
                    <td className='text-end'>{(item?.cost || 0).toFixed(2)}</td>
                    <td className='text-end'>{(item?.sale_amount || 0).toFixed(2)}</td>
                    <td className='text-end'>{(item?.earning || 0).toFixed(2)}</td>
                  </tr>
                ))
            )
          ) : resultdata?.isLoading ? (
            <tr>
              <td colSpan={7} className='text-center'>
                {FM('loading-data')}
              </td>
            </tr>
          ) : (
            <tr>
              <td colSpan={7} className='text-center'>
                {FM('no-data-found')}
              </td>
            </tr>
          )}
        </tbody>
      </Table>
    </>
  )
}

export default ProductRevenueReport
