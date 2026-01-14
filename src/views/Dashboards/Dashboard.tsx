/* eslint-disable prettier/prettier */
// ** React Imports
import { Fragment, useContext, useEffect, useReducer } from 'react'

// ** Reactstrap Imports
import {
  Badge,
  Button,
  ButtonGroup,
  ButtonProps,
  Card,
  CardHeader,
  CardTitle,
  Col,
  Row
} from 'reactstrap'

// ** Context
// import { ThemeColors } from '@src/utility/context/ThemeColors'
import { ThemeColors } from '../../utility/context/ThemeColors'
// ** Demo Components
// import Earnings from '@src/views/examples/ui-elements/cards/analytics/Earnings'
// import CardMedal from '@src/views/examples/ui-elements/cards/advance/CardMedal'
// import GoalOverview from '@src/views/examples/ui-elements/cards/analytics/GoalOverview'
// import RevenueReport from '@src/views/examples/ui-elements/cards/analytics/RevenueReport'
// import RevenueReport from '../../views/examples/ui-elements/cards/analytics/RevenueReport'
// import OrdersBarChart from '@src/views/examples/ui-elements/cards/statistics/OrdersBarChart'
// import ProfitLineChart from '@src/views/examples/ui-elements/cards/statistics/ProfitLineChart'
// import StatsCard from '@src/views/examples/ui-elements/cards/statistics/StatsCard'
import StorefrontIcon from '@mui/icons-material/Storefront'
// ** Styles
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong'
import '@styles/base/pages/dashboard-ecommerce.scss'
import '@styles/react/libs/charts/apex-charts.scss'
import { TableColumn } from 'react-data-table-component'
import { Database, DollarSign, Download, Gift, RefreshCcw, Truck, Users } from 'react-feather'
import { Link } from 'react-router-dom'
import StatsHorizontal from '../../@core/components/widgets/stats/StatsHorizontal'
import {
  useStoreReportsMutation,
  useTopAndLeastStoresMutation
} from '../../redux/RTKQuery/StoreRTK'
import { getPath } from '../../router/RouteHelper'
import { UserType } from '../../utility/Const'
import Hide from '../../utility/Hide'
import Show, { Can } from '../../utility/Show'
import { CF, abbreviateNumber, decrypt, formatDate, truncateText } from '../../utility/Utils'
import { FM, isValid, log } from '../../utility/helpers/common'
import useUser from '../../utility/hooks/useUser'
import useUserType from '../../utility/hooks/useUserType'
import { stateReducer } from '../../utility/stateReducer'
import CustomDataTable, { TableFormData } from '../components/CustomDataTable/CustomDataTable'
import LoadingButton from '../components/buttons/LoadingButton'
import Header from '../components/header'
import Ratings from '../components/ratings'
import Shimmer from '../components/shimmers/Shimmer'
import OrderExport from './OrderExportModal'
import RevenueReport from './RevenueReports'
import TransactionTable from './TransactionTable'
import Last30ReturnOrders from './Last30ReturnOrders'
import { Permissions } from '../../utility/Permissions'
import { useForm } from 'react-hook-form'
import FormGroupCustom from '../components/formGroupCustom/FormGroupCustom'
import ApiEndpoints from '../../utility/http/ApiEndpoints'
import { loadDropdown } from '../../utility/apis/dropdowns'
import OrderReport from './OrderReport'
interface States {
  lastStoreRefresh?: any
  lastRefresh?: any
  yearClick?: any
  reportData?: any
  page?: any
  per_page_record?: any
  search?: any
  filterData?: any
}

const Dashboard = () => {
  // ** Context
  const { colors } = useContext(ThemeColors)
  const userType = useUserType()
  const user = useUser()

  const initState: States = {
    page: 1,
    reportData: [],
    per_page_record: 30,
    lastStoreRefresh: new Date().getTime(),
    lastRefresh: new Date().getTime()
  }
  const reducers = stateReducer<States>
  const [state, setState] = useReducer(reducers, initState)
  const [loadStores, { data, originalArgs, isLoading, isSuccess }] = useTopAndLeastStoresMutation()
  const [loadReport, result] = useStoreReportsMutation()
  const form = useForm<any>({
    defaultValues: {}
  })
  const { control, watch, setValue } = form

  const [
    loadStoresLease,
    { data: dataLease, originalArgs: originalArgsLeast, isLoading: isLoadingLeast }
  ] = useTopAndLeastStoresMutation()
  // const session = useAppSelector((a) => a.session?.data)

  const handlePageChange = (e: TableFormData) => {
    log(e)
    setState({ ...e })
  }
  const trialEndDate: any = new Date(user?.store_setting?.free_trial_days)
  const currentDate: any = new Date()
  const diffInDays = Math.floor((currentDate - trialEndDate) / (1000 * 60 * 60 * 24))

  useEffect(() => {
    const storeId = form.watch('store_id')
      ? form.watch('store_id')?.value
      : userType === UserType.Admin || userType === UserType.AdminEmployee
      ? undefined
      : user?.store_id
    const fromDate = form.watch('from_date')
    const toDate = form.watch('to_date')
    if (userType) {
      if (storeId && fromDate && toDate) {
        loadReport({
          userType:
            userType === UserType.Admin || userType === UserType.AdminEmployee
              ? UserType.Admin
              : UserType.Store,
          jsonData: {
            store_id: storeId,
            start_date:
              form.watch('from_date') && form.watch('to_date')
                ? formatDate(form.watch('from_date'), 'YYYY-MM-DD')
                : undefined,
            end_date: form.watch('to_date')
              ? formatDate(form.watch('to_date'), 'YYYY-MM-DD')
              : undefined
          }
        })
      } else {
        loadReport({
          userType:
            userType === UserType.Admin || userType === UserType.AdminEmployee
              ? UserType.Admin
              : UserType.Store,
          jsonData: {
            store_id: storeId,
            start_date:
              form.watch('from_date') && form.watch('to_date')
                ? formatDate(form.watch('from_date'), 'YYYY-MM-DD')
                : undefined,
            end_date: form.watch('to_date')
              ? formatDate(form.watch('to_date'), 'YYYY-MM-DD')
              : undefined
          }
        })
      }
    }
  }, [
    state.lastStoreRefresh,
    state?.lastRefresh,
    userType,
    user,
    form.watch('store_id'),
    form.watch('from_date'),
    form.watch('to_date')
  ])

  useEffect(() => {
    loadStoresLease({
      userType,
      least: 1,
      jsonData: {},
      page: state?.page,
      per_page_record: state?.per_page_record
    })
  }, [state?.lastRefresh])

  useEffect(() => {
    loadStores({
      userType,
      jsonData: {},
      page: state?.page,
      per_page_record: state?.per_page_record
    })
  }, [state?.lastRefresh])

  useEffect(() => {
    if (result?.isSuccess) {
      setState({
        reportData: result?.data?.payload
      })
    }
  }, [result, state?.lastRefresh])

  // log('user', formatDate(new Date()) <= formatDate(user?.store_setting?.free_trial_days))
  if (userType === UserType.Admin || userType === UserType.AdminEmployee) {
    const columns: TableColumn<any>[] = [
      {
        name: '#',
        maxWidth: '20px',
        cell: (row, index: any) => {
          // eslint-disable-next-line no-mixed-operators
          return parseInt(state?.per_page_record) * (state?.page - 1) + (index + 1)
        }
      },
      {
        name: FM('store'),

        // sortable: true,
        cell: (row, index: any) => {
          return (
            <Link to={getPath('admin.stores.details', { id: row?.store_id })}>
              <span className='d-flex align-items-center'>
                <div className='mb-0 fw-bolder mb-50'>
                  {truncateText(decrypt(`${row?.store?.store_setting?.store_name}`), 15) ??
                    truncateText(decrypt(row?.store?.name), 15)}
                </div>
              </span>
            </Link>
          )
        }
      },
      {
        name: FM('email'),

        // sortable: true,
        cell: (row, index: any) => {
          return (
            <span className='d-flex align-items-center'>
              <div className='mb-0 fw-bolder text-secondary'>
                {truncateText(row?.store?.store_setting?.store_email, 15) ??
                  truncateText(decrypt(`${row?.store?.email}`), 15)}
              </div>
            </span>
          )
        }
      },
      {
        name: FM('orders'),
        // maxWidth: '200px',
        cell: (row, index: any) => {
          return (
            <span className='d-flex align-items-center'>
              <span className='fw-bolder mb-50'>{abbreviateNumber(row?.store_orders)}</span>
              {/* <div className='mb-0 font-small-2 text-secondary'>{FM('in-30-day')}</div> */}
            </span>
          )
        }
      }
    ]

    // log(form.watch('store_id'), 'store_id')
    // admin
    return (
      <Fragment>
        <Row className='align-items-center mb-2'>
          {/* Title */}
          <Col md={3}>
            <h2 className='mb-0 text-primary text-capitalize'>{FM('dashboard')}</h2>
          </Col>

          {/* Store Select */}
          <Col md={3} className=''>
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

          {/* From Date */}
          <Col md={2} className='text-end'>
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
          <Col md={2} className='text-end'>
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
          <Col md={2} className='text-end'>
            <ButtonGroup>
              <OrderExport<ButtonProps>
                Component={Button}
                exportType='1'
                title={FM('export-orders-with-product')}
                size='sm'
                color='info'
              >
                <Download size='14' />
              </OrderExport>
              <OrderExport<ButtonProps>
                Component={Button}
                exportType='2'
                title={FM('export-orders')}
                size='sm'
                color='primary'
              >
                <Download size='14' />
              </OrderExport>

              <LoadingButton
                loading={isLoading || isLoadingLeast}
                onClick={() => {
                  setState({
                    lastRefresh: new Date().getTime()
                  })
                  form.reset()
                }}
                size='sm'
                color='dark'
                title={FM('reload')}
              >
                <RefreshCcw size='14' />
              </LoadingButton>
            </ButtonGroup>
          </Col>

          {/* Buttons */}
        </Row>

        {result?.isLoading ? (
          <div id='dashboard-ecommerce'>
            <Row className='match-height'>
              <Col md='4'>
                <Shimmer height={'100px'} />
              </Col>
              <Col md='4'>
                <Shimmer height={'100px'} />
              </Col>
              <Col md='4'>
                <Shimmer height={'100px'} />
              </Col>
            </Row>
            {/* <Row>
              <Col md='12'>
                <Shimmer height={'100px'} />
              </Col>
            </Row> */}
          </div>
        ) : (
          <div id='dashboard-ecommerce'>
            <Row className='match-height'>
              <Col md='4'>
                <StatsHorizontal
                  icon={<StorefrontIcon />}
                  color='primary'
                  stats={abbreviateNumber(state?.reportData?.total_stores)}
                  statTitle={FM('total-stores')}
                />
              </Col>
              <Col md='4'>
                <StatsHorizontal
                  icon={<Users />}
                  color='success'
                  stats={abbreviateNumber(state?.reportData?.total_customers)}
                  statTitle={FM('total-customers')}
                />
              </Col>
              <Col md='4'>
                <StatsHorizontal
                  icon={<ReceiptLongIcon />}
                  color='warning'
                  stats={abbreviateNumber(state?.reportData?.total_orders)}
                  statTitle={FM('total-orders')}
                />
              </Col>
              <hr />
            </Row>

            <Row>
              <span>
                <Badge
                  color='light-danger'
                  tag={'h4'}
                  className='fw-bolder mb-1 mt-0  d-block'
                  pill
                >
                  {FM('pending-amount-to-transfer-to-store')}
                </Badge>
              </span>

              {state?.reportData?.total_amount_send_to_store?.map((d: any, i: any) => {
                return (
                  <>
                    <Col md='4'>
                      <StatsHorizontal
                        icon={<DollarSign />}
                        color='primary'
                        stats={`${CF({ money: d?.total_store_share, currency: d?.currency })}`}
                        statTitle={FM('total-store-share')}
                      />
                    </Col>
                  </>
                )
              })}
            </Row>
            <Row>
              <Col md='12'>
                <Show IF={userType === UserType.Admin || user?.store_id === UserType.Admin}>
                  <RevenueReport
                    yearClicked={(e: any) => setState({ yearClick: e })}
                    store={form.watch('store_id') ? form.watch('store_id') : null}
                  />
                </Show>
              </Col>
              <Col md='12'>
                <Show IF={userType === UserType.Admin || user?.store_id === UserType.Admin}>
                  <OrderReport
                    yearClicked={(e: any) => setState({ yearClick: e })}
                    store={form.watch('store_id') ? form.watch('store_id') : null}
                  />
                </Show>
              </Col>
              <Col md='6'>
                <Card>
                  <CardHeader className='border-bottom'>
                    <CardTitle>{FM('top-performing-stores')}</CardTitle>
                  </CardHeader>
                  <CustomDataTable<any>
                    hideFooter
                    HidePerPage
                    hideHeader
                    cardClass='mb-0'
                    key={state?.lastRefresh}
                    initialPerPage={30}
                    isLoading={isLoading}
                    columns={columns}
                    modifyData={(e) => {
                      if (isValid(e?.store)) {
                        return true
                      } else {
                        return false
                      }
                    }}
                    paginatedData={data}
                    handlePaginationAndSearch={handlePageChange}
                  />
                  {/* <CompanyTable /> */}
                </Card>
              </Col>
              <Col md='6'>
                <Card>
                  <CardHeader className='border-bottom'>
                    <CardTitle>{FM('least-performing-stores')}</CardTitle>
                  </CardHeader>
                  <CustomDataTable<any>
                    hideFooter
                    HidePerPage
                    hideHeader
                    cardClass='mb-0'
                    key={state?.lastRefresh}
                    initialPerPage={30}
                    isLoading={isLoadingLeast}
                    modifyData={(e) => {
                      if (isValid(e?.store)) {
                        return true
                      } else {
                        return false
                      }
                    }}
                    columns={columns}
                    paginatedData={dataLease}
                    handlePaginationAndSearch={handlePageChange}
                  />
                  {/* <CompanyTable /> */}
                </Card>
              </Col>
            </Row>
          </div>
        )}
      </Fragment>
    )
  } else {
    // store

    return (
      <div id='dashboard-ecommerce'>
        <Header
          title={<>{FM('dashboard')}</>}
          subHeading={
            <>
              {isValid(state.reportData[0]?.store_rating) ? (
                <>
                  <Ratings rating={Number(state?.reportData[0]?.store_rating)} max={5} />
                </>
              ) : (
                ''
              )}
            </>
          }
        >
          <LoadingButton
            loading={result?.isLoading}
            onClick={() => {
              setState({
                lastStoreRefresh: new Date().getTime(),
                lastRefresh: new Date().getTime()
              })
            }}
            size='sm'
            color='dark'
            title={FM('reload')}
          >
            <RefreshCcw size='14' />
          </LoadingButton>
        </Header>

        {result?.isLoading && userType !== UserType.Admin ? (
          <>
            <Row className='match-height mb-2'>
              <Col md='3'>
                <Shimmer height={'80px'} />
              </Col>
              <Col md='3'>
                <Shimmer height={'80px'} />
              </Col>
              <Col md='3'>
                <Shimmer height={'80px'} />
              </Col>
              <Col md='3'>
                <Shimmer height={'80px'} />
              </Col>
            </Row>
            <Row className='match-height mb-2'>
              <Col md='3'>
                <Shimmer height={'80px'} />
              </Col>
              <Col md='3'>
                <Shimmer height={'80px'} />
              </Col>
              <Col md='3'>
                <Shimmer height={'80px'} />
              </Col>
              <Col md='3'>
                <Shimmer height={'80px'} />
              </Col>
            </Row>
          </>
        ) : (
          <>
            <Row className='match-height'>
              {/* <Col md='3'>
                <TooltipLink
                  title={FM('view-all-sessions')}
                  to={getPath('store.active-session')}
                  className={classNames('', {
                    'pe-none': session?.length === 0
                  })}
                  color='primary'
                >
                  <StatsHorizontal
                    className={''}
                    cardProp={{ role: 'button' }}
                    statClass={`${session?.length > 0 ? 'text-primary fw-bolder' : ''}  `}
                    icon={<ShoppingCartCheckoutIcon />}
                    color={session?.length > 0 ? 'primary' : 'secondary'}
                    stats={abbreviateNumber(session?.length)}
                    statTitle={FM('active-session')}
                  />
                </TooltipLink>
              </Col> */}
              <Col md='12'>
                {user?.store_setting?.free_trial_days === null ? (
                  <></>
                ) : (
                  <>
                    {formatDate(user?.store_setting?.free_trial_days) < formatDate(new Date()) ? (
                      <div className=' fw-bolder alert alert-danger p-1 m-1' role='alert'>
                        {FM('free-trial-expired-at', {
                          days: formatDate(user?.store_setting?.free_trial_days)
                        })}
                      </div>
                    ) : (
                      <div className='fw-bolder alert alert-success p-1 mb-1' role='alert'>
                        {FM('free-trial-expired', {
                          days: formatDate(user?.store_setting?.free_trial_days)
                        })}
                      </div>
                    )}
                  </>
                )}
              </Col>
              <Col md='3'>
                <StatsHorizontal
                  icon={<Database />}
                  color='info'
                  stats={abbreviateNumber(state?.reportData[0]?.total_orders)}
                  statTitle={FM('total-orders')}
                />
              </Col>
              <Col md='3'>
                <StatsHorizontal
                  icon={<DollarSign />}
                  color='success'
                  stats={`${CF({
                    money: isValid(state?.reportData[0]?.total_earnings)
                      ? state?.reportData[0]?.total_earnings
                      : 0,
                    currency:
                      userType === UserType.Store ? user?.store_setting?.currency : user?.currency
                  })}`}
                  statTitle={FM('total-earnings-kr', {
                    kr: isValid(user?.currency) ? user?.currency : 'SEK'
                  })}
                />
              </Col>
              <Col md='3'>
                <StatsHorizontal
                  icon={<DollarSign />}
                  color='warning'
                  stats={`${CF({
                    money: isValid(state?.reportData[0]?.total_admin_shares)
                      ? state?.reportData[0]?.total_admin_shares
                      : 0,
                    currency:
                      userType === UserType.Store ? user?.store_setting?.currency : user?.currency
                  })}`}
                  statTitle={FM('admin-share')}
                />
              </Col>

              <Col md='3'>
                <StatsHorizontal
                  icon={<DollarSign />}
                  color='primary'
                  stats={`${CF({
                    money: isValid(state?.reportData[0]?.total_store_shares)
                      ? state?.reportData[0]?.total_store_shares
                      : 0,
                    currency:
                      userType === UserType.Store ? user?.store_setting?.currency : user?.currency
                  })}`}
                  statTitle={FM('total-store-share')}
                />
              </Col>
              <Col md='3'>
                <StatsHorizontal
                  icon={<DollarSign />}
                  color='warning'
                  stats={`${CF({
                    money: isValid(state?.reportData[0]?.total_returns)
                      ? state?.reportData[0]?.total_returns
                      : 0,
                    currency:
                      userType === UserType.Store ? user?.store_setting?.currency : user?.currency
                  })}`}
                  statTitle={FM('total-returns-amount')}
                />
              </Col>
              <hr />
              <Col md='3'>
                <StatsHorizontal
                  icon={<Database />}
                  color='info'
                  stats={abbreviateNumber(state?.reportData[0]?.todays_order)}
                  statTitle={FM('today-orders')}
                />
              </Col>
              <Col md='3'>
                <StatsHorizontal
                  icon={<DollarSign />}
                  color='success'
                  stats={`${CF({
                    money: isValid(state?.reportData[0]?.todays_earning)
                      ? state?.reportData[0]?.todays_earning
                      : 0,
                    currency:
                      userType === UserType.Store ? user?.store_setting?.currency : user?.currency
                  })}`}
                  statTitle={FM('today-earnings')}
                />
              </Col>
              <Col md='3'>
                <StatsHorizontal
                  icon={<DollarSign />}
                  color='warning'
                  stats={`${CF({
                    money: isValid(state?.reportData[0]?.todays_admin_share)
                      ? state?.reportData[0]?.todays_admin_share
                      : 0,
                    currency:
                      userType === UserType.Store ? user?.store_setting?.currency : user?.currency
                  })}`}
                  statTitle={FM('today-admin-share')}
                />
              </Col>

              <Col md='3'>
                <StatsHorizontal
                  icon={<DollarSign />}
                  color='primary'
                  stats={`${CF({
                    money: isValid(state?.reportData[0]?.todays_store_share)
                      ? state?.reportData[0]?.todays_store_share
                      : 0,
                    currency:
                      userType === UserType.Store ? user?.store_setting?.currency : user?.currency
                  })}`}
                  statTitle={FM('today-store-share')}
                />
              </Col>
              <Col md='3'>
                <StatsHorizontal
                  icon={<Truck />}
                  color='success'
                  stats={abbreviateNumber(state?.reportData[0]?.todays_total_items_return)}
                  statTitle={FM('today-total-items-return')}
                />
              </Col>
              <Col md='3'>
                <StatsHorizontal
                  icon={<Gift />}
                  color='warning'
                  stats={`${CF({
                    money: isValid(state?.reportData[0]?.todays_total_items_return_amount)
                      ? state?.reportData[0]?.todays_total_items_return_amount
                      : 0,
                    currency:
                      userType === UserType.Store ? user?.store_setting?.currency : user?.currency
                  })}`}
                  statTitle={FM('today-total-items-return-amount')}
                />
              </Col>
            </Row>
            <Row>
              <hr />
              <Col md='3'>
                <StatsHorizontal
                  icon={<Truck />}
                  color='success'
                  stats={abbreviateNumber(state?.reportData[0]?.total_customers)}
                  statTitle={FM('total-customers')}
                />
              </Col>
              <Col md='3'>
                <StatsHorizontal
                  icon={<Gift />}
                  color='warning'
                  stats={abbreviateNumber(state?.reportData[0]?.total_products)}
                  statTitle={FM('total-products')}
                />
              </Col>
            </Row>
          </>
        )}

        <Row className='match-height'>
          <Col lg='12' md='12'>
            <Show IF={userType === UserType.Store || userType === UserType.Employee}>
              <RevenueReport yearClicked={(e: any) => setState({ yearClick: e })} />
            </Show>
          </Col>
        </Row>

        <Hide IF={userType === UserType.Admin || userType === UserType.AdminEmployee}>
          <Row className='match-height'>
            <Col lg='6' xs='12'>
              <TransactionTable loading={state.lastRefresh} />
            </Col>
            <Show IF={Can(Permissions.returnRefundBrowse)}>
              <Col lg='6' xs='12'>
                <Last30ReturnOrders loading={state.lastRefresh} />
              </Col>
            </Show>
          </Row>
        </Hide>
      </div>
    )
  }
}

export default Dashboard
