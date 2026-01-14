// ** Third Party Components
import { ApexOptions } from 'apexcharts'
import Chart from 'react-apexcharts'

// ** Reactstrap Imports
import { Card, CardBody, CardHeader, CardTitle } from 'reactstrap'
import { FM } from '../../../../utility/helpers/common'

const EarningPerTransaction = () => {
  const donutColors = {
    series1: '#ffe700',
    series2: '#826bf8',
    series3: '#650',
    series4: '#126bf8',
    series5: '#6bf8'
  }

  // ** Chart Options
  const options: ApexOptions = {
    chart: {
      toolbar: {
        show: false
      },
      parentHeightOffset: 0,
      dropShadow: {
        enabled: false,
        blur: 8,
        left: 1,
        top: 1,
        opacity: 0.2
      }
    },
    legend: {
      show: true,
      position: 'bottom'
    },
    yaxis: {
      show: true
    },
    //  colors: [donutColors.series1 donutColors.series2, donutColors.series3, donutColors.series4, donutColors.series5],
    xaxis: {
      categories: [
        'Bakery',
        'Dairy',
        'FastFood',
        'Garments',
        'Essentials',
        'Medicine',
        'HouseHolds',
        'Interior'
      ]
    },
    fill: {
      opacity: [1, 0.8]
    },
    stroke: {
      show: false,
      width: 0
    },
    markers: {
      size: 0
    },
    grid: {
      show: false,
      padding: {
        top: -20,
        bottom: -20
      }
    }
  }

  // ** Chart Series
  const series = [
    {
      name: 'store 1',
      data: [41, 13, 5, 60, 42, 42, 33, 23]
    },
    {
      name: 'store 2',
      data: [14, 46, 19, 25, 25, 9, 25, 23]
    },
    {
      name: 'store 3',
      data: [55, 46, 53, 25, 58, 4, 8, 43]
    },
    {
      name: 'store 4',
      data: [34, 46, 89, 25, 58, 63, 9, 43]
    },
    {
      name: 'store 5',
      data: [15, 46, 12, 25, 19, 63, 76, 43]
    }
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle tag='h4'>
          <>{FM('earning-per-transaction')}</>
        </CardTitle>
      </CardHeader>
      <CardBody>
        <Chart options={options} series={series} type='radar' height={400} />
      </CardBody>
    </Card>
  )
}

export default EarningPerTransaction
