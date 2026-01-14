// ** React Imports
import { ApexOptions } from 'apexcharts'
import { useContext, useEffect, useState } from 'react'

// ** Third Party Components
import Chart from 'react-apexcharts'

// ** Reactstrap Imports
import { useForm } from 'react-hook-form'
import { Card, CardTitle, Col, Row } from 'reactstrap'
import { useRevenueReportMutation } from '../../../redux/RTKQuery/StoreRTK'
import { UserType } from '../../../utility/Const'
import { abbreviateNumber, generateArrayOfYears, getUserData } from '../../../utility/Utils'
import { ThemeColors } from '../../../utility/context/ThemeColors'
import { FM, isValid, log } from '../../../utility/helpers/common'
import useUserType from '../../../utility/hooks/useUserType'
import FormGroupCustom from '../../components/formGroupCustom/FormGroupCustom'
import Shimmer from '../../components/shimmers/Shimmer'
interface ReportData {
  eventId: number
  year: string
  store_id: string | undefined
}
const years = generateArrayOfYears(50)
const RevenueReport = ({ storeId = null }: { storeId?: any }) => {
  // ** State
  const user = getUserData()
  const { colors } = useContext(ThemeColors)
  // const [data, setData] = useState(null)
  const { control, watch } = useForm<any>()
  const userType = useUserType()
  const [year] = useState(new Date().getFullYear())
  const [revenueReport, { data, isLoading, isSuccess }] = useRevenueReportMutation()
  const resData = data?.payload as any

  useEffect(() => {
    if (isValid(watch('year')?.value) && isValid(storeId)) {
      if (userType === UserType.Admin) {
        revenueReport({
          eventId: 0,
          year: watch('year').value,
          store_id: storeId
        })
      } else {
        revenueReport({
          eventId: 0,
          year: watch('year').value,
          store_id: isValid(storeId) ? storeId : user?.store_id
        })
      }
    } else {
      revenueReport({
        eventId: 0,
        year: new Date().getFullYear(),
        store_id: isValid(storeId) ? storeId : user?.store_id
      })
    }
  }, [watch('year')?.value, storeId])

  const revenueOptions: any = {
    chart: {
      stacked: true,
      type: 'bar',
      toolbar: { show: false }
    },
    grid: {
      padding: {
        top: -20,
        bottom: -10
      },
      yaxis: {
        lines: { show: true }
      }
    },
    xaxis: {
      categories: resData?.months,
      labels: {
        style: {
          colors: '#b9b9c3',
          fontSize: '0.86rem'
        }
      },
      axisTicks: {
        show: false
      },
      axisBorder: {
        show: false
      }
    },
    legend: {
      show: true
    },
    dataLabels: {
      enabled: false
    },
    colors: [`${colors?.warning?.main}`, `${colors?.danger?.main}`, `${colors?.success?.main}`],
    plotOptions: {
      bar: {
        columnWidth: '17%',
        borderRadius: [5]
      },
      distributed: true
    },
    yaxis: {
      labels: {
        style: {
          colors: '#b9b9c3',
          fontSize: '0.86rem'
        }
      }
    }
  }
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
    colors: [`${colors?.warning?.main}`, `${colors?.danger?.main}`, `${colors?.success?.main}`],
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
      colors: [`${colors?.warning?.main}`, `${colors?.danger?.main}`, `${colors?.success?.main}`]
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
      data: resData?.earnings
    },
    {
      name: FM('cost'),
      data: resData?.costs
    },
    {
      name: FM('profit'),
      data: resData?.revenue
    }
  ]

  return isLoading ? (
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
              {/* <div className='d-flex align-items-center me-2'>
                <span className='bullet bullet-primary me-50 cursor-pointer'></span>
                <span>{FM('revenue')}</span>
              </div>
              <div className='d-flex align-items-center'>
                <span className='bullet bullet-warning me-50 cursor-pointer'></span>
                <span>{FM('cost')}</span>
              </div> */}
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
          <Chart
            id='revenue-report-chart'
            type='bar'
            height='230'
            options={columnChartOptionsMonthly}
            series={revenueSeries}
          />
        </Col>
      </Row>
    </Card>
  )
}

export default RevenueReport
