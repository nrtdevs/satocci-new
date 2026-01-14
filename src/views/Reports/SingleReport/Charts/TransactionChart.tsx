// ** Third Party Components

import { ApexOptions } from 'apexcharts'
import { useContext, useEffect, useState } from 'react'
import Chart from 'react-apexcharts'
import { useForm } from 'react-hook-form'

// ** Reactstrap Imports
import { Card, CardBody, CardHeader, CardSubtitle, Col, Row } from 'reactstrap'
import { useStoreProductSaleStatsMutation } from '../../../../redux/RTKQuery/StoreRTK'
import { UserType } from '../../../../utility/Const'
import { abbreviateNumber, formatDate } from '../../../../utility/Utils'
import { loadDropdown } from '../../../../utility/apis/dropdowns'
import { ThemeColors } from '../../../../utility/context/ThemeColors'
import { FM, isValid, isValidArray } from '../../../../utility/helpers/common'
import useUser from '../../../../utility/hooks/useUser'
import useUserType from '../../../../utility/hooks/useUserType'
import ApiEndpoints from '../../../../utility/http/ApiEndpoints'
import FormGroupCustom from '../../../components/formGroupCustom/FormGroupCustom'
import { StoreParamsType } from '../../../stores/fragment/AddUpdateForm'
const areaColors = {
  series3: '#a4f8cd',
  series2: '#60f2ca',
  series1: '#2bdac7'
}

interface propsType {
  direction?: any
  details?: StoreParamsType | any
  storeId?: any
  lastRefresh?: any
}

const TransactionChart = ({
  direction,
  details = {},
  storeId = null,
  lastRefresh = null
}: propsType) => {
  const form = useForm<any>()
  const { handleSubmit, control, reset, setValue, watch, setError } = form
  const user = useUser()
  const userType = useUserType()
  const { colors } = useContext(ThemeColors)
  const [storeStats, resultStats] = useStoreProductSaleStatsMutation()
  const [storeData, setStoreData] = useState<StoreParamsType>({})

  const resultDataRecord: any = resultStats?.data?.payload

  const StoreProductStats = () => {
    if (isValid(details?.id)) {
      const date = watch('dates')?.map((a: any) => formatDate(a)) ?? []
      if (isValidArray(date) && isValidArray(watch('store_id'))) {
        storeStats({
          jsonData: {
            start_date: date[0] ?? null,
            end_date: date[1] ?? null,
            store_ids: watch('store_id')?.map((a: any) => a.value)
          }
        })
      }
    }
  }

  useEffect(() => {
    if (isValid(details?.id)) {
      StoreProductStats()
      setStoreData({
        ...details,
        id: details?.id
      })
    }
  }, [watch('store_id'), watch('dates'), details, lastRefresh])

  const options: ApexOptions = {
    chart: {
      height: 350,
      type: 'line',
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
      align: 'left'
    },
    legend: {
      tooltipHoverFormatter(val: any, opts: any) {
        return `${val}`
      }
    },

    markers: {
      size: 0,
      hover: {
        sizeOffset: 6
      }
    },
    yaxis: {
      labels: {
        formatter(val: any) {
          return abbreviateNumber(val)
        }
      }
    },
    xaxis: {
      categories: resultDataRecord?.label
    },
    tooltip: {
      y: {
        title: {
          formatter(val: any) {
            return `${val}:`
          }
        }
      }
    },
    grid: {
      borderColor: '#f1f1f1'
    }
  }
  // ** Chart Series
  const series = resultDataRecord?.data ?? []

  return (
    <Card>
      <CardHeader className='border-bottom d-flex flex-md-row flex-column justify-content-md-between justify-content-start align-items-md-center align-items-start'>
        <Row className='flex-1'>
          <Col xs='8'>
            <CardSubtitle className='text-secondary'>
              <FormGroupCustom
                noLabel
                key={`user-${storeData?.id}-${user?.store_id}`}
                label={FM('store')}
                name={'store_id'}
                type={'select'}
                isMulti
                className='mt-75'
                path={
                  userType === UserType.Admin
                    ? ApiEndpoints.store_substore_list + storeData?.id
                    : ApiEndpoints.store_substore_list + user?.store_id
                }
                isOptionDisabled={() => watch('store_id')?.length >= 5}
                selectLabel='name'
                modifyDropdownData={(d: any) => {
                  return {
                    ...d,
                    name: `${d?.name} / (${
                      d?.store_setting?.store_name ?? d?.store_setting?.store_name
                    })`
                  }
                }}
                selectValue={'id'}
                async
                jsonData={{
                  with_substore: 'yes'
                }}
                searchItem='store_name'
                defaultOptions
                loadOptions={details?.id ? loadDropdown : undefined}
                control={control}
                rules={{
                  required: false
                }}
              />
            </CardSubtitle>
          </Col>
          <Col xs='4' className='d-flex justify-content-end flex-row align-items-end'>
            <FormGroupCustom
              noLabel
              type={'date'}
              datePickerOptions={{
                mode: 'range',
                maxDate: new Date()
              }}
              control={control}
              name={'dates'}
              className='flex-1'
              label={FM('select-date-range')}
              rules={{ required: false }}
            />
          </Col>
        </Row>
      </CardHeader>
      <CardBody className='p-1'>
        <Chart options={options} series={series} type='line' height={400} />
      </CardBody>
    </Card>
  )
}
export default TransactionChart
