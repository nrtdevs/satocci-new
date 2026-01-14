// ** React Imports
import classNames from 'classnames'
import { useEffect } from 'react'

// ** Third Party Components
import Chart from 'react-apexcharts'

// ** Reactstrap Imports
import { useForm } from 'react-hook-form'
import { Card, CardBody, CardHeader, CardTitle } from 'reactstrap'
import { useRevenueReportMutation } from '../../../redux/RTKQuery/StoreRTK'
import { FM } from '../../../utility/helpers/common'
import FormGroupCustom from '../../components/formGroupCustom/FormGroupCustom'
import Shimmer from '../../components/shimmers/Shimmer'

const TopCategories = () => {
  const form = useForm<any>()
  const { handleSubmit, control, reset, setValue, watch } = form
  const [topCategories, { data, isLoading, isSuccess }] = useRevenueReportMutation()
  const resData = data?.payload as any

  useEffect(() => {
    topCategories({
      eventId: 1,
      data_of: watch('request_for')?.value ?? 7
    })
  }, [watch('request_for')])

  // useEffect(() => {
  //   axios.get('/card/card-analytics/sessions-device').then((res: any) => setData(res.data))
  // }, [])

  const options: any = {
      chart: {
        toolbar: {
          show: false
        }
      },
      labels: resData?.category ?? [],
      dataLabels: {
        enabled: false
      },
      legend: { show: false },
      //   comparedResult: [2, -3, 8],
      stroke: { width: 0 }
      //   colors: [props.primary, props.warning, props.danger]
    },
    series = resData?.ordered_quantity?.map((d: any) => parseInt(d)) ?? []

  const renderChartInfo = () => {
    return (
      <div
        className={classNames('d-flex justify-content-between', {
          'mb-1': resData?.category?.length - 1
        })}
      >
        <div className='d-flex align-items-center'>
          <span className='fw-bolder ms-50 me-1'>
            {FM('for-total', { for: watch('request_for')?.label })}
          </span>
          :<span className='ms-1 fw-bolder'> {resData?.ordered_quantity?.length}</span>
        </div>
        <div>
          {/* <span>{item.upDown}%</span>
            {item.upDown > 0 ? (
              <Icon.ArrowUp size={14} className='ms-25 text-success' />
            ) : (
              <Icon.ArrowDown size={14} className='ms-25 text-danger' />
            )} */}
        </div>
      </div>
    )
  }

  return (
    <>
      {isLoading ? (
        <Card>
          <Shimmer height={'380px'} width={'580px'} />
        </Card>
      ) : (
        <Card>
          <CardHeader className='align-items-end'>
            <CardTitle tag='h4' className='mb-2'>
              {FM('top-categories')}
            </CardTitle>
            {/* <UncontrolledDropdown className='chart-dropdown'>
          <DropdownToggle color='' className='bg-transparent btn-sm border-0 p-50'>
            {FM('last-number-days', {
              Number: 7
            })}
          </DropdownToggle>
          <DropdownMenu end>
            {data.last_days.map((item) => (
              <DropdownItem className='w-100' key={item}>
                {item}
              </DropdownItem>
            ))}
          </DropdownMenu>
        </UncontrolledDropdown> */}
            <FormGroupCustom
              noLabel
              noGroup
              label={FM('select')}
              type={'select'}
              control={control}
              selectOptions={[
                {
                  label: FM('daily'),
                  value: 1
                },
                {
                  label: FM('weekly'),
                  value: 7
                },
                {
                  label: FM('monthly'),
                  value: 30
                }
              ]}
              name='request_for'
              className='mb-2'
              rules={{ required: true }}
            />
          </CardHeader>
          <CardBody>
            <Chart className='my-1' options={options} series={series} type='donut' height={300} />
            {renderChartInfo()}
          </CardBody>
        </Card>
      )}
    </>
  )
}
export default TopCategories
