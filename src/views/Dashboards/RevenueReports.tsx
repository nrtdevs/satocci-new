// ** React Imports
import { ApexOptions } from 'apexcharts'
import { useContext, useEffect, useState } from 'react'

// ** Third Party Components
import Chart from 'react-apexcharts'

// ** Reactstrap Imports
import { useForm } from 'react-hook-form'
import { Card, CardTitle, Col, Row } from 'reactstrap'
import { useRevenueReportMutation } from '../../redux/RTKQuery/StoreRTK'
import { UserType } from '../../utility/Const'
import Show from '../../utility/Show'
import { abbreviateNumber, generateArrayOfYears } from '../../utility/Utils'
import { getLoadDropdown } from '../../utility/apis/dropdowns'
import { ThemeColors } from '../../utility/context/ThemeColors'
import { FM, isValid, log } from '../../utility/helpers/common'
import useUser from '../../utility/hooks/useUser'
import useUserType from '../../utility/hooks/useUserType'
import ApiEndpoints from '../../utility/http/ApiEndpoints'
import FormGroupCustom from '../components/formGroupCustom/FormGroupCustom'
import Shimmer from '../components/shimmers/Shimmer'

const years = generateArrayOfYears(50)
const RevenueReport = ({
  yearClicked = (e: any) => {},
  store
}: {
  yearClicked?: (e: any) => any
  store?: any
}) => {
  // ** State
  const userType = useUserType()
  const user = useUser()
  const defaultCurrency = user?.currency as string
  const [currency, setCurrency] = useState(
    userType === UserType.Admin ? store?.extra?.currency : ''
  )
  const [storeData, setStoreData] = useState<any>()
  const { colors } = useContext(ThemeColors)

  const form = useForm<any>({
    defaultValues: {
      currency: {
        label: store?.extra?.currency,
        value: store?.extra?.currency,
        extra: {
          // eslint-disable-next-line object-shorthand
          currency: store?.extra?.currency
        }
      }
    }
  })

  const { control, watch, setValue } = form
  const [revenueReport, { data, isLoading, isSuccess }] = useRevenueReportMutation()
  const resData = data?.payload as any
  const [year] = useState(new Date().getFullYear())

  useEffect(() => {
    // log(store?.extra?.currency, 'store?.extra?.currency')
    // setStoreData(store)

    setValue('currency.label', store?.extra?.currency)
    setValue('currency.value', store?.extra?.currency)
    setValue('currency.extra.currency', store?.extra?.currency)
  }, [store])

  useEffect(() => {
    if (userType === UserType.Admin) {
      const newCurrency = store?.extra?.currency
      log(form.watch('currency'), 'form')

      // setValue('currency.label', newCurrency)
      // setValue('currency.value', newCurrency)
      // setValue('currency.extra.currency', newCurrency)
    } else {
      const timer = setTimeout(() => {
        const newCurrency = defaultCurrency
        setCurrency(newCurrency)
        // Update the form values after the delay
        setValue('currency.label', newCurrency)
        setValue('currency.value', newCurrency)
        setValue('currency.extra.currency', newCurrency)
      }, 3000) // 3000 milliseconds delay (3 seconds)

      return () => clearTimeout(timer)
    }
  }, [userType, defaultCurrency, setValue])

  useEffect(() => {
    const selectedYear = watch('year')?.value
    const selectedCurrency = form.watch('currency')?.value
    if (isValid(watch('year')?.value)) {
      revenueReport({
        eventId: 0,
        year: selectedYear,
        currency: selectedCurrency,
        store_id: userType === UserType.Admin ? store?.value : undefined
      })
    } else {
      revenueReport({
        eventId: 0,
        year: new Date().getFullYear(),
        currency: selectedCurrency,
        store_id: userType === UserType.Admin ? store?.value : undefined
      })
    }
  }, [watch('year')?.value, form.watch('currency')?.value, store])

  const columnChartOptionsMonthly: ApexOptions = {
    chart: {
      type: 'bar',
      height: 350,
      toolbar: {
        show: false
      }
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: '70%'
        // endingShape: 'rounded'
      }
    },
    dataLabels: {
      enabled: false
    },
    stroke: {
      show: true,
      width: 2,
      colors: ['transparent']
    },
    colors: [
      `${colors?.warning?.main}`,
      `${colors?.danger?.main}`,
      `${colors?.success?.main}`,
      `${colors?.primary?.main}`
    ],

    yaxis: {
      labels: {
        formatter(val: any) {
          return abbreviateNumber(val)
        }
      }
    },
    xaxis: {
      categories: resData?.months
    },
    fill: {
      opacity: 1,
      colors: [
        `${colors?.warning?.main}`,
        `${colors?.danger?.main}`,
        `${colors?.success?.main}`,
        `${colors?.primary?.main}`
      ]
    },
    tooltip: {
      y: {
        formatter(val: any) {
          return `${val}`
        }
      }
    }
  }

  const revenueSeries = [
    {
      name: FM('revenue'),
      data: resData?.earnings?.map((d: any) => Math.floor(d).toFixed(2))
    },
    {
      name: FM('cost'),
      data: resData?.costs?.map((d: any) => Math.floor(d).toFixed(2))
    },
    {
      name: FM('profit'),
      data: resData?.revenue?.map((d: any) => Math.floor(d).toFixed(2))
    },
    {
      name: FM('refund'),
      data: resData?.refund_amount?.map((d: any) => Math.floor(d).toFixed(2))
    }
  ]

  return (
    <>
      {isLoading ? (
        <Card className='card-revenue-budget'>
          <Row className='mx-0'>
            <Col className='revenue-report-wrapper' md='12' xs='12'>
              <Shimmer height={'300px'} width={'100%'} />
            </Col>
          </Row>
        </Card>
      ) : (
        <Card className='card-revenue-budget'>
          <Row className='mx-0'>
            <Col className='revenue-report-wrapper' md='12' xs='12'>
              <div className='d-sm-flex justify-content-between align-items-center mb-3'>
                <CardTitle className='mb-50 mb-sm-0'>{FM('revenue-report')}</CardTitle>

                <div className='d-flex align-items-center'>
                  <div className='d-flex align-items-center border-start ps-2 ms-2'>
                    <span>{FM('currency')}: </span>
                  </div>
                  <div className='d-flex align-items-center ms-2'>
                    <FormGroupCustom
                      placeholder={FM('currency')}
                      key={form.watch('currency')?.value}
                      noLabel
                      noGroup
                      async
                      path={ApiEndpoints.get_currency_list}
                      selectLabel={'currency'}
                      selectValue={'currency'}
                      defaultOptions
                      loadOptions={getLoadDropdown}
                      modifyDropdownData={(e) => {
                        if (typeof e.currency === 'object') {
                          return {
                            currency: ''
                          }
                        } else {
                          return {
                            currency: e.currency
                          }
                        }
                      }}
                      name={`currency`}
                      type={'select'}
                      className='flex-grow-1 me-1'
                      control={control}
                      rules={{ required: false }}
                    />
                  </div>

                  <div className='d-flex align-items-center border-start ps-2 ms-2'>
                    <span>{FM('year')}: </span>
                  </div>
                  <div className='d-flex align-items-center ms-2'>
                    <FormGroupCustom
                      noGroup
                      noLabel
                      control={control}
                      type='select'
                      name='year'
                      selectOptions={years.map((item) => ({ label: item, value: item }))}
                    />
                  </div>
                </div>
              </div>
              <Show IF={isValid(resData)}>
                <Chart
                  id='revenue-report-chart'
                  type='bar'
                  height='230'
                  options={columnChartOptionsMonthly}
                  series={revenueSeries}
                />
              </Show>
            </Col>
          </Row>
        </Card>
      )}
    </>
  )
}

export default RevenueReport
