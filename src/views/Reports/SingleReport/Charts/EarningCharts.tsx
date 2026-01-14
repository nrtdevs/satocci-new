// ** Third Party Components

import { ApexOptions } from 'apexcharts'
import { useContext, useState } from 'react'
import Chart from 'react-apexcharts'
import { ChevronDown } from 'react-feather'
import Flatpickr from 'react-flatpickr'
import { useForm } from 'react-hook-form'

// ** Reactstrap Imports
import StorefrontIcon from '@mui/icons-material/Storefront'
import { Card, CardBody, CardHeader, CardSubtitle, CardTitle, Col, Row } from 'reactstrap'
import { IconSizes } from '../../../../utility/Const'
import { ThemeColors } from '../../../../utility/context/ThemeColors'
import { FM } from '../../../../utility/helpers/common'
import useUser from '../../../../utility/hooks/useUser'
import { CF, minusDay, toggleArray } from '../../../../utility/Utils'
import DropDownMenu from '../../../components/dropdown'
import { StoreParamsType } from '../../../stores/fragment/AddUpdateForm'
const areaColors = {
  series3: '#a4f8cd',
  series2: '#60f2ca',
  series1: '#2bdac7'
}

interface propsType {
  direction?: any
  details?: StoreParamsType
}

const EarningCharts = ({ direction, details }: any) => {
  const { control } = useForm<any>()
  const { colors } = useContext(ThemeColors)
  const user = useUser()
  const [selectedStores, setSelectedStores] = useState([])

  const options: ApexOptions = {
    chart: {
      height: 350,
      type: 'line',
      toolbar: {
        show: false
      },
      zoom: {
        enabled: true
      }
    },
    dataLabels: {
      enabled: false
    },
    stroke: {
      width: 3,
      curve: 'smooth',
      dashArray: 0
    },
    title: {
      //   text: FM('daily-transaction-report'),
      align: 'left'
    },
    legend: {
      //   containerMargin: { top: 30 },
      tooltipHoverFormatter(val: any, opts: any) {
        // return `${val} - ${opts.w.globals.series[opts.seriesIndex][opts.dataPointIndex]}`
        return `${val}`
      }
    },
    // colors: [areaColors.series3, areaColors.series2, areaColors.series1],

    markers: {
      size: 0,
      hover: {
        sizeOffset: 6
      }
    },
    xaxis: {
      categories: [
        '01 Jan',
        '02 Jan',
        '03 Jan',
        '04 Jan',
        '05 Jan',
        '06 Jan',
        '07 Jan',
        '08 Jan',
        '09 Jan',
        '10 Jan',
        '11 Jan',
        '12 Jan'
      ]
    },
    tooltip: {
      y: {
        title: {
          formatter(val: any) {
            return `${val}:`
          }
        },
        formatter(val, opts) {
          return String(CF({ money: val, currency: user?.currency }))
        }
      }
    },
    grid: {
      borderColor: '#f1f1f1'
    }
  }
  // ** Chart Series
  const series = [
    {
      name: 'Store 1',
      data: [459, 529, 382, 242, 332, 262, 212, 220, 621, 822, 152, 190]
    },
    {
      name: 'Store 2',
      data: [352, 412, 622, 422, 125, 182, 292, 742, 623, 512, 223, 523]
    },
    {
      name: 'Store 3',
      data: [876, 763, 746, 996, 76, 386, 626, 476, 826, 663, 426, 476]
    },
    {
      name: 'Store 4',
      data: [561, 753, 257, 715, 825, 255, 578, 758, 336, 555, 877, 785]
    },
    {
      name: 'Store 5',
      data: [202, 424, 223, 593, 759, 865, 188, 926, 590, 414, 491, 259]
    }
  ]
  return (
    <Card>
      <CardHeader className='border-bottom d-flex flex-md-row flex-column justify-content-md-between justify-content-start align-items-md-center align-items-start'>
        <Row className='flex-1'>
          <Col xs='6'>
            <CardTitle className='mb-75' tag='h4'>
              <>{FM('earnings')}</>
            </CardTitle>
            <CardSubtitle className='text-secondary'>
              <DropDownMenu
                toggle={false}
                direction='down'
                component={
                  <>
                    {selectedStores?.length === 0
                      ? FM('select-store')
                      : selectedStores?.map(
                          (a: any, i: number) =>
                            `${a.name}${
                              selectedStores?.length > 1 && selectedStores?.length !== i + 1
                                ? ', '
                                : ''
                            }`
                        )}
                    <ChevronDown size={IconSizes.MenuVertical} />
                  </>
                }
                options={[
                  {
                    active: selectedStores?.find((a: any) => a.id === 1),
                    icon: <StorefrontIcon fontSize={'medium'} />,
                    onClick: () => {
                      toggleArray(
                        {
                          id: 1,
                          name: 'Store 1'
                        },
                        selectedStores,
                        setSelectedStores,
                        (e) => e?.id === 1
                      )
                    },
                    name: 'Store 1'
                  },
                  {
                    active: selectedStores?.find((a: any) => a.id === 2),

                    icon: <StorefrontIcon fontSize={'medium'} />,
                    onClick: () => {
                      toggleArray(
                        {
                          id: 2,
                          name: 'Store 2'
                        },
                        selectedStores,
                        setSelectedStores,
                        (e) => e?.id === 2
                      )
                    },
                    name: 'Store 2'
                  },
                  {
                    active: selectedStores?.find((a: any) => a.id === 3),

                    icon: <StorefrontIcon fontSize={'medium'} />,
                    onClick: () => {
                      toggleArray(
                        {
                          id: 3,
                          name: 'Store 3'
                        },
                        selectedStores,
                        setSelectedStores,
                        (e) => e?.id === 3
                      )
                    },
                    name: 'Store 3'
                  },
                  {
                    active: selectedStores?.find((a: any) => a.id === 4),

                    icon: <StorefrontIcon fontSize={'medium'} />,
                    onClick: () => {
                      toggleArray(
                        {
                          id: 4,
                          name: 'Store 4'
                        },
                        selectedStores,
                        setSelectedStores,
                        (e) => e?.id === 4
                      )
                    },
                    name: 'Store 4'
                  },
                  {
                    active: selectedStores?.find((a: any) => a.id === 5),

                    icon: <StorefrontIcon fontSize={'medium'} />,
                    onClick: () => {
                      toggleArray(
                        {
                          id: 5,
                          name: 'Store 5'
                        },
                        selectedStores,
                        setSelectedStores,
                        (e) => e?.id === 5
                      )
                    },
                    name: 'Store 5'
                  }
                ]}
              />
              {/* <>{FM('daily-transaction-report')}</> */}
            </CardSubtitle>
          </Col>
          <Col xs='3'>
            {/* <DropDownMenu
              direction='down'
              component={
                <>
                  {FM('stores')}
                  <ChevronDown color={colors.primary.main} size={IconSizes.MenuVertical} />
                </>
              }
              options={[
                {
                  icon: <StorefrontIcon fontSize={'medium'} />,
                  onClick: () => {},
                  name: 'Store 1'
                }
              ]}
            /> */}
          </Col>
          <Col xs='3' className='d-flex justify-content-end flex-row align-items-center'>
            {/* <FormGroupCustom
              control={control}
              noLabel
              type='date'
              name={'dates'}
              datePickerOptions={{
                mode: 'range',
                // eslint-disable-next-line no-mixed-operators
                defaultDate: [minusDay(new Date(), 6), new Date()]
              }}
            />*/}
            <Flatpickr
              className='form-control text-end flat-picker me-50 fw-bold bg-transparent border-0 shadow-none  p-0'
              options={{
                mode: 'range',
                // eslint-disable-next-line no-mixed-operators
                defaultDate: [minusDay(new Date(), 6), new Date()]
              }}
            />
            <ChevronDown size={17} />
          </Col>
        </Row>
      </CardHeader>
      <CardBody className='p-1'>
        <Chart options={options} series={series} type='bar' height={400} />
      </CardBody>
    </Card>
  )
}
export default EarningCharts
