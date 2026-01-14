// ** React Imports
import { useEffect, useState } from 'react'

// ** Third Party Components
import axios from 'axios'
import Chart from 'react-apexcharts'

// ** Reactstrap Imports
import {
  Card,
  CardTitle,
  Col,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  Row,
  UncontrolledButtonDropdown
} from 'reactstrap'
import { generateArrayOfYears } from '../../../../../utility/Utils'

const revenueReports = {
  months: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'oct', 'nov', 'dec'],
  revenue: [{ name: 'earnings', data: [95, 177, 284, 256, 105, 63, 168, 218, 72, 6, 34, 79] }],
  cost: [{ name: 'cost', data: [95, 177, 284, 256, 105, 63, 168, 218, 72, 6, 34, 79] }]
}

const years = generateArrayOfYears(5)
const RevenueReport = (props) => {
  // ** State
  const [data, setData] = useState(null)
  const [year, selectedYear] = useState(new Date().getFullYear())

  useEffect(() => {
    axios.get('/card/card-analytics/revenue-report').then((res) => setData(res.data))
    return () => setData(null)
  }, [])

  const revenueOptions = {
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
          lines: { show: false }
        }
      },
      xaxis: {
        categories: revenueReports?.months,
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
        show: false
      },
      dataLabels: {
        enabled: false
      },
      colors: [props.primary, props.warning],
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
    },
    // revenueSeries = revenueReports
    revenueSeries = [
      {
        name: 'revenue',
        data: [95, 177, 284, 256, 105, 63, 168, 218, 120, 95, 177, 284]
      },
      {
        name: 'cost',
        data: [-145, -80, -60, -180, -100, -60, -85, -75, -100, -100, -145, -80, -60]
      }
    ]

  return data !== null ? (
    <Card className='card-revenue-budget'>
      <Row className='mx-0'>
        <Col className='revenue-report-wrapper' md='12' xs='12'>
          <div className='d-sm-flex justify-content-between align-items-center mb-3'>
            <CardTitle className='mb-50 mb-sm-0'>Revenue Report</CardTitle>
            <UncontrolledButtonDropdown>
              <DropdownToggle className='budget-dropdown' outline color='primary' size='sm' caret>
                {year}
              </DropdownToggle>
              <DropdownMenu>
                {years.map((item) => (
                  <DropdownItem
                    className='w-100'
                    key={item}
                    onClick={() => {
                      selectedYear(item)
                    }}
                  >
                    {item}
                  </DropdownItem>
                ))}
              </DropdownMenu>
            </UncontrolledButtonDropdown>
            <div className='d-flex align-items-center'>
              <div className='d-flex align-items-center me-2'>
                <span className='bullet bullet-primary me-50 cursor-pointer'></span>
                <span>Revenue</span>
              </div>
              <div className='d-flex align-items-center'>
                <span className='bullet bullet-warning me-50 cursor-pointer'></span>
                <span>Cost</span>
              </div>
            </div>
          </div>
          <Chart
            id='revenue-report-chart'
            type='bar'
            height='230'
            options={revenueOptions}
            series={revenueSeries}
          />
        </Col>
      </Row>
    </Card>
  ) : null
}

export default RevenueReport
