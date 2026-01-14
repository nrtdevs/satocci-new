import { ApexOptions } from 'apexcharts'
import moment from 'moment'
import { Fragment, useEffect, useReducer, useState } from 'react'
import Chart from 'react-apexcharts'
import { Scrollbars } from 'react-custom-scrollbars'
import { useForm } from 'react-hook-form'
import { Button, ButtonGroup, Card, CardBody, CardHeader, CardTitle, Col, Row } from 'reactstrap'
import {
  useProductSaleStatsMonthlyMutation,
  useProductSaleStatsMutation
} from '../../../../redux/RTKQuery/ProductRTK'
import { FM, isValid, log } from '../../../../utility/helpers/common'
import { stateReducer } from '../../../../utility/stateReducer'
import { endOfMonths, formatDate, generateArrayOfYears } from '../../../../utility/Utils'
import FormGroupCustom from '../../../components/formGroupCustom/FormGroupCustom'
import { ProductVariantsType } from '../ProductForm'

interface States {
  lastRefresh?: any
  storeId?: any
  page?: any
  per_page_record?: any
  search?: any
  name?: any
  reload?: any
  edit?: any
  isRemoving?: boolean
  isReloading?: boolean
  isAddingNewData?: boolean
  filterData?: ProductVariantsType
  year?: any
  varient_id?: any
}

type theProps = {
  details?: ProductVariantsType
  loading?: boolean
}

const years = generateArrayOfYears(50)
const ProductStats = ({ details, loading = false }: theProps) => {
  const initState: States = {
    page: 1,
    per_page_record: 15,
    edit: null,
    storeId: null,
    lastRefresh: new Date().getTime(),
    filterData: {
      year: null,
      varient_id: null
    },
    search: undefined,
    isRemoving: false,
    isReloading: false,
    isAddingNewData: false
  }
  const reducers = stateReducer<States>
  const [state, setState] = useReducer(reducers, initState)
  const [productStat, resultStats] = useProductSaleStatsMutation()
  const [productStatMonthly, resultStatsMonthly] = useProductSaleStatsMonthlyMutation()
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
    getValues,
    setError
  } = useForm()
  const month = moment().month() + 1 < 10 ? `0${moment().month() + 1}` : moment().month() + 1
  const [rSelected, setRSelected] = useState(String(month))
  const [year] = useState(new Date().getFullYear())

  const resultDataSeries: any = resultStats?.data?.payload
  const resultDataSeriesMonthly: any = resultStatsMonthly?.data?.payload

  const productStats = () => {
    if (isValid(details?.id) && isValid(watch('year-1').value)) {
      productStat({
        jsonData: {
          year: watch('year-1').value,
          variant_id: details?.id
        }
      })
    }
  }

  const productStatsMonthly = () => {
    if (isValid(details?.id) && isValid(watch('year').value)) {
      productStatMonthly({
        jsonData: {
          start_date: formatDate(new Date(`${watch('year').value}-${rSelected}-01`)) ?? null,
          end_date:
            formatDate(endOfMonths(new Date(`${watch('year').value}-${rSelected}-01`))) ?? null,
          variant_id: details?.id
        }
      })
    }
  }

  useEffect(() => {
    log('called', new Date())
    log('called', details, watch('year-1'))
    productStats()
  }, [watch('year-1')?.value, details?.id])

  useEffect(() => {
    productStatsMonthly()
  }, [watch('year')?.value, details?.id, rSelected])

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
    xaxis: {
      categories: resultDataSeriesMonthly?.dates
    },
    fill: {
      opacity: 1
    },
    tooltip: {
      y: {
        formatter(val: any) {
          return `${val}`
        }
      }
    }
  }

  // ** Chart Series
  const series: ApexOptions['series'] = [
    {
      name: resultDataSeriesMonthly?.variant_name,
      data: resultDataSeriesMonthly?.data
    }
  ]

  const columnChartSeries: ApexOptions['series'] = [
    {
      name: resultDataSeries?.variant_name,
      data: resultDataSeries?.data
    }
  ]

  const columnChartOptions: ApexOptions = {
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
    xaxis: {
      categories: [
        'Jan',
        'Feb',
        'Mar',
        'Apr',
        'May',
        'Jun',
        'Jul',
        'Aug',
        'Sep',
        'Oct',
        'Nov',
        'Dec'
      ]
    },
    fill: {
      opacity: 1
    },
    tooltip: {
      y: {
        formatter(val: any) {
          return `${val}`
        }
      }
    }
  }
  return (
    <Fragment>
      <Card>
        <CardHeader className='justify-content-between'>
          <CardTitle tag='h4' className='fw-bold'>
            {FM('yearly-sales-data')}
          </CardTitle>
          <Col md='2'>
            <FormGroupCustom
              noGroup
              noLabel
              control={control}
              defaultValue={{ label: year, value: year }}
              type='select'
              name='year-1'
              selectOptions={years.map((item) => ({ label: item, value: item }))}
            />
          </Col>
        </CardHeader>
        <CardBody className='apex-charts-heatmap'>
          <Chart options={columnChartOptions} series={columnChartSeries} type='bar' height={350} />
        </CardBody>
      </Card>
      <Card>
        <CardHeader className='justify-content-center'>
          <CardTitle tag='h4' className='fw-bold'>
            {FM('monthly-sales-data')}
          </CardTitle>
        </CardHeader>
        <CardBody className='apex-charts-heatmap'>
          <Row className='d-flex justify-content-between g-1 p-1'>
            <Col md='2'>
              <FormGroupCustom
                noGroup
                noLabel
                control={control}
                defaultValue={{ label: year, value: year }}
                type='select'
                name='year'
                selectOptions={years.map((item) => ({ label: item, value: item }))}
              />
            </Col>
            <Col md='10' style={{ minHeight: 50 }}>
              <Scrollbars>
                <ButtonGroup className='mb-0'>
                  <Button
                    color='primary'
                    onClick={() => setRSelected('01')}
                    outline={!(rSelected === '01')}
                  >
                    {FM('jan')}
                  </Button>
                  <Button
                    color='primary'
                    onClick={() => setRSelected('02')}
                    outline={!(rSelected === '02')}
                  >
                    {FM('feb')}
                  </Button>
                  <Button
                    color='primary'
                    onClick={() => setRSelected('03')}
                    outline={!(rSelected === '03')}
                  >
                    {FM('mar')}
                  </Button>
                  <Button
                    color='primary'
                    onClick={() => setRSelected('04')}
                    outline={!(rSelected === '04')}
                  >
                    {FM('apr')}
                  </Button>
                  <Button
                    color='primary'
                    onClick={() => setRSelected('05')}
                    outline={!(rSelected === '05')}
                  >
                    {FM('may')}
                  </Button>
                  <Button
                    color='primary'
                    onClick={() => setRSelected('06')}
                    outline={!(rSelected === '06')}
                  >
                    {FM('jun')}
                  </Button>
                  <Button
                    color='primary'
                    onClick={() => setRSelected('07')}
                    outline={!(rSelected === '07')}
                  >
                    {FM('jul')}
                  </Button>
                  <Button
                    color='primary'
                    onClick={() => setRSelected('08')}
                    outline={!(rSelected === '08')}
                  >
                    {FM('aug')}
                  </Button>
                  <Button
                    color='primary'
                    onClick={() => setRSelected('09')}
                    outline={!(rSelected === '09')}
                  >
                    {FM('sept')}
                  </Button>
                  <Button
                    color='primary'
                    onClick={() => setRSelected('10')}
                    outline={!(rSelected === '10')}
                  >
                    {FM('oct')}
                  </Button>
                  <Button
                    color='primary'
                    onClick={() => setRSelected('11')}
                    outline={!(rSelected === '11')}
                  >
                    {FM('nov')}
                  </Button>
                  <Button
                    color='primary'
                    onClick={() => setRSelected('12')}
                    outline={!(rSelected === '12')}
                  >
                    {FM('dec')}
                  </Button>
                </ButtonGroup>
              </Scrollbars>
            </Col>
          </Row>
          <Chart options={columnChartOptionsMonthly} series={series} type='bar' height={350} />
        </CardBody>
      </Card>
    </Fragment>
  )
}
export default ProductStats
