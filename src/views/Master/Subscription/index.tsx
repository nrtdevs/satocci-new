import CalendarMonthIcon from '@mui/icons-material/CalendarMonth'
import PaidOutlinedIcon from '@mui/icons-material/Paid'
import { Fragment, useEffect, useReducer } from 'react'
import { Award, Download, RefreshCcw, Sliders, X } from 'react-feather'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import {
  Button,
  ButtonGroup,
  ButtonProps,
  Card,
  CardBody,
  CardHeader,
  Col,
  Nav,
  NavItem,
  NavLink,
  Row,
  TabContent,
  TabPane
} from 'reactstrap'
import StatsHorizontal from '../../../@core/components/widgets/stats/StatsHorizontal'
import { useCurrencyWiseReportsMutation } from '../../../redux/RTKQuery/StoreRTK'
import { CF, formatDate } from '../../../utility/Utils'
import { FM, isValidArray, log } from '../../../utility/helpers/common'
import { stateReducer } from '../../../utility/stateReducer'
import LoadingButton from '../../components/buttons/LoadingButton'
import FormGroupCustom from '../../components/formGroupCustom/FormGroupCustom'
import Header from '../../components/header'
import Shimmer from '../../components/shimmers/Shimmer'
import BsTooltip from '../../components/tooltip'
import Export from './Export'
import Both from './fragment/Both'
import Monthly from './fragment/Monthly'
import Transactional from './fragment/Transactional'

export type SubscriptionParamsType = {
  // other info
  id?: number | null
  category_id?: any | null
  languages?: any
  store_id?: any
  store_setting?: any | null
  // store info
  name?: string | null
  email?: string | null
  unique_id?: any | null
  password?: string | null
  mobile_number?: string | null
  description?: string | null
  website?: string | null
  logo?: string | null
  personal_number?: any | null
  store_qr_code_image?: any | null
  // Manager Info
  store_email?: string | null
  store_name?: string | null
  store_number?: string | null | number
  contact_person_number?: string | null
  contact_person_name?: string | null
  // Store Address
  address?: string | null
  state?: any | null
  city?: string | null
  currency?: string | null
  country?: string | null
  latitude?: string | null | number
  longitude?: string | null | number
  // Subscription Details
  subscription_type?: any // 1: Per transaction 2: Fixed (Monthly),
  amount?: number | null
  start_date?: any
  from_date?: any
  to_date?: any
  // Sub Store Limit
  sub_store_limit?: number | null
  // Status
  status?: any // 1: Active 2: Deleted 0: Inactive
  // Dates
  created_at?: string | null
  updated_at?: string | null
  deleted_at?: string | null
  store_subscription?: any
  subscription_terms_select_value?: any | null // for internal use only
  fakeLogo?: string | null // only for internal use,
  store_subscription_id?: null
}

export type SubscriptionLogType = {
  store_id?: string | null | number
  subscription_type?: string | null | number
  sub_store_limit?: string | null | number
  store_subscription_id?: string | null | number
  currency?: string | null | number
  amount_received_month?: string | null | number
  amount_received_date?: string | null | number
  amount_received?: string | null | number
  amount?: string | null | number
  store_name?: string | null | number
  store_setting?: any
  store_subscription?: any
  store_email?: any
}

export type ActionParams = {
  amount_received?: any
  currency?: string | null | number
  amount?: string | null | number
  amount_received_month?: string | null | number
  store_subscription_id?: string | null | number
  subscription_log_id?: string | null | number
  url?: number
}
type States = {
  active?: string
  lastRefresh?: any
  filterMonthly?: boolean
  filterTransaction?: boolean
  filterWeekly?: boolean
  filterExport?: boolean
  filterBoth?: boolean
}

const SubscriptionList = () => {
  const initState: States = {
    active: '1',
    lastRefresh: new Date().getTime(),
    filterTransaction: false,
    filterMonthly: false,
    filterWeekly: false,
    filterExport: false,
    filterBoth: false
  }
  //   const [active, setActive] = useState(step)
  const reducers = stateReducer<States>
  const form = useForm<any>()
  const {
    formState: { errors },
    handleSubmit,
    control,
    reset,
    watch,
    setValue
  } = form
  const [state, setState] = useReducer(reducers, initState)
  const nav = useNavigate()
  const [currencyReport, res] = useCurrencyWiseReportsMutation()
  //   const toggleTab = (tab: any) => {
  //     if (active !== tab) {
  //       setActive(tab)
  //     }
  //   }

  useEffect(() => {
    currencyReport({
      jsonData: {
        start_date: isValidArray(watch('dates')) ? formatDate(watch('dates')[0]) : '',
        end_date: isValidArray(watch('dates')) ? formatDate(watch('dates')[1]) : ''
      }
    })
  }, [watch('dates'), state.lastRefresh])

  const toggleTab = (tab: any) => {
    if (state?.active !== tab) {
      setState({ active: tab })
    }
  }
  const toggleMonthly = () => {
    setState({ filterMonthly: !state.filterMonthly })
  }
  const toggleTransaction = () => {
    setState({ filterTransaction: !state.filterTransaction })
  }
  const toggleExport = () => {
    setState({ filterExport: !state.filterExport })
  }
  const toggleBoth = () => {
    setState({ filterBoth: !state.filterBoth })
  }

  return (
    <Fragment>
      <Header title={FM('subscription')} icon={<PaidOutlinedIcon />}>
        <FormGroupCustom
          name={`dates`}
          noLabel
          noGroup
          label={FM(`date`)}
          datePickerOptions={{
            mode: 'range'
          }}
          type={'date'}
          className='d-flex me-1'
          control={control}
          rules={{ required: false }}
        />

        <ButtonGroup color='dark'>
          <Export<ButtonProps> Component={Button} title={FM('export')} size='sm' color='primary'>
            <Download size={14} /> {FM('export')}
          </Export>
          <LoadingButton
            tooltip={FM('reload')}
            loading={res?.isLoading}
            size='sm'
            color='dark'
            onClick={() =>
              setState({
                lastRefresh: new Date().getTime()
              })
            }
          >
            <RefreshCcw size='14' />
          </LoadingButton>
        </ButtonGroup>
      </Header>
      <Row className='mb-2 g-1'>
        {res?.isLoading ? (
          <>
            <Col md='3' className='mb-1'>
              <Shimmer height={'100px'} />
            </Col>
            <Col md='3' className='mb-1'>
              <Shimmer height={'100px'} />
            </Col>
            <Col md='3' className='mb-1'>
              <Shimmer height={'100px'} />
            </Col>
            <Col md='3' className='mb-1'>
              <Shimmer height={'100px'} />
            </Col>
          </>
        ) : (
          <>
            {res?.data?.payload?.map((d: any, i: any) => {
              return (
                <Col key={i} md='3' className='m-0'>
                  <StatsHorizontal
                    isEnableFooter={true}
                    title1={`${CF({ money: d.admin_share, currency: d.currency })}`}
                    title2={`${CF({ money: d.store_share, currency: d.currency })}`}
                    data={d}
                    icon={<Award />}
                    color='success'
                    stats={`${CF({
                      money: d?.revenue,
                      currency: d?.currency
                    })}`}
                    statTitle={FM('total-earnings-kr', {
                      kr: d?.currency
                    })}
                  />
                </Col>
              )
            })}
          </>
        )}
      </Row>

      <Card>
        <CardHeader className='p-1 border-bottom'>
          <div className='flex-1'>
            <Row className='d-flex justify-content-between aligned-items-center'>
              <Col md='8' className=''>
                <Nav pills className={`mb-0 flex-column flex-sm-row`}>
                  <NavItem>
                    <NavLink active={state.active === '1'} onClick={() => toggleTab('1')}>
                      <CalendarMonthIcon className='font-medium-3  me-50' />
                      <span className='fw-bold'>
                        <>{FM('monthly')}</>
                      </span>
                    </NavLink>
                  </NavItem>
                  <NavItem>
                    <NavLink active={state.active === '2'} onClick={() => toggleTab('2')}>
                      <PaidOutlinedIcon className='font-medium-3  me-50' />
                      <span className='fw-bold'>
                        <>{FM('daily')}</>
                      </span>
                    </NavLink>
                  </NavItem>
                  <NavItem>
                    <NavLink active={state.active === '3'} onClick={() => toggleTab('3')}>
                      <PaidOutlinedIcon className='font-medium-3  me-50' />
                      <span className='fw-bold'>
                        <>{FM('all-transaction')}</>
                      </span>
                    </NavLink>
                  </NavItem>
                </Nav>
              </Col>

              <Col md='1' className='d-flex align-items-start justify-content-end'>
                <ButtonGroup color='dark'>
                  <BsTooltip<ButtonProps>
                    Tag={Button}
                    color={state?.filterTransaction ? 'danger' : 'primary'}
                    className='btn-icon btn-secondary'
                    title={FM('filter')}
                    onClick={toggleTransaction}
                  >
                    {state?.filterTransaction ? <X size={16} /> : <Sliders size={16} />}
                  </BsTooltip>
                </ButtonGroup>
              </Col>
            </Row>
          </div>
        </CardHeader>
        <CardBody className='p-0'>
          <TabContent activeTab={state.active}>
            <TabPane tabId='1'>
              <Monthly
                tabIndex={state.active}
                filterMonthly={state?.filterTransaction}
                loading={state?.lastRefresh}
                closeForm={() => {
                  toggleTransaction()
                }}
              />
            </TabPane>
            <TabPane tabId='2'>
              <Transactional
                tabIndex={state.active}
                filterTransaction={state?.filterTransaction}
                loading={state?.lastRefresh}
                closeForm={() => {
                  toggleTransaction()
                }}
              />
            </TabPane>
            <TabPane tabId='3'>
              <Both
                tabIndex={state.active}
                filterBoth={state?.filterTransaction}
                closeForm={() => {
                  toggleTransaction()
                }}
              />
            </TabPane>
          </TabContent>
        </CardBody>
      </Card>
    </Fragment>
  )
}

export default SubscriptionList
