/* eslint-disable prettier/prettier */
// ** React Imports
import { Fragment, useEffect, useReducer, useState } from 'react'

import { Button, ButtonGroup, ButtonProps, Col, Row } from 'reactstrap'
// ** Styles
import '@styles/base/pages/dashboard-ecommerce.scss'
import '@styles/react/libs/charts/apex-charts.scss'
import { Database, DollarSign, Download, Gift, RefreshCcw, Truck } from 'react-feather'
import { useForm } from 'react-hook-form'
import StatsHorizontal from '../../../@core/components/widgets/stats/StatsHorizontal'
import { useStoreReportsMutation } from '../../../redux/RTKQuery/StoreRTK'
import Hide from '../../../utility/Hide'
import { CF, abbreviateNumber, getUserData, truncateText } from '../../../utility/Utils'
import { loadDropdown } from '../../../utility/apis/dropdowns'
import { FM, isValid, isValidArray, log } from '../../../utility/helpers/common'
import useUserType from '../../../utility/hooks/useUserType'
import ApiEndpoints from '../../../utility/http/ApiEndpoints'
import { stateReducer } from '../../../utility/stateReducer'
import LoadingButton from '../../components/buttons/LoadingButton'
import FormGroupCustom from '../../components/formGroupCustom/FormGroupCustom'
import Header from '../../components/header'
import RevenueReport from './RevenueReport'

import { UserType } from '../../../utility/Const'

import Ratings from '../../components/ratings'
import Shimmer from '../../components/shimmers/Shimmer'
import ExportReport from './ExportReport'
import TopCategories from './TopCategories'
import TopProductList from './TopProductList'
import OrderExport from '../../Dashboards/OrderExportModal'
import StripeAllPayouts from './StripeAllPayouts'
import Show from '../../../utility/Show'
import TransactionReportTab from './TransactionReportTab'

interface States {
    lastRefresh?: any
    storeData?: any
    page?: any
    per_page_record?: any
    rating?: any
    search?: any
    reports?: any
    filterData?: any

}

const StoreReport = () => {
    // ** Context

    const userType = useUserType()
    const user = getUserData()
    // ** vars
    const form = useForm<any>()
    const { handleSubmit, control, reset, setValue, watch } = form
    const trackBgColor = '#e9ecef'
    const initState: States = {
        storeData: [],
        page: 1,
        rating: 0,
        reports: [],
        per_page_record: 30,
        lastRefresh: new Date().getTime()
    }
    const reducers = stateReducer<States>
    const [state, setState] = useReducer(reducers, initState)
    const [loadReport, { data, originalArgs, isLoading, isSuccess }] = useStoreReportsMutation()
    const [defaultStore, setDefaultStore] = useState<any>(null)

    useEffect(() => {
        if (isSuccess && isValidArray(data?.payload)) {
            setState({
                reports: data?.payload
            })
        }
    }, [data, isSuccess, watch('store_id')?.value])
    useEffect(() => {
        if (isValidArray(state.storeData)) {
            setValue('store_id', {
                label: `${state?.storeData[0]?.name} / (${state?.storeData[0]?.store_setting?.store_name ??
                    state?.storeData[0]?.store_setting?.store_name
                    })`,
                value: state?.storeData[0]?.store_setting?.store_id
            })
        }
    }, [state.storeData, state.lastRefresh])

    useEffect(() => {
        if (isValid(watch('store_id')?.value)) {
            loadReport({
                jsonData: { store_id: watch('store_id')?.value }
            })
        }
    }, [watch('store_id'), state.lastRefresh])

    const renderRating = (rating: any) => {
        return (
            <>
                <Ratings key={`rating-${rating}`} rating={rating} max={5} />
            </>
        )
    }

    // admin
    return (
        <Fragment>
            <Header
                title={
                    <>
                        {FM('reports-name', {
                            name: truncateText(state.reports[0]?.name, 50)
                        })}
                    </>
                }
                subHeading={<>{renderRating(state?.reports[0]?.store_rating)}</>}
            >
                <FormGroupCustom
                    noLabel
                    noGroup
                    label={FM('store')}
                    placeholder={FM('store')}
                    //   noLabel
                    async
                    isClearable
                    path={
                        userType === UserType.Admin ||
                            (user?.store_id === UserType.Admin && userType !== UserType.Admin)
                            ? ApiEndpoints.load_stores
                            : ApiEndpoints.store_substore_list + user.store_id
                    }
                    selectLabel={'name'}
                    modifyDropdownData={(d: any) => {
                        log('d', d, defaultStore)

                        return {
                            ...d,
                            name: `${d?.name} / (${d?.store_setting?.store_name ?? d?.store_setting?.store_name})`
                        }
                    }}
                    selectValue={'id'}
                    onOptionData={(e) => {
                        setState({
                            storeData: e
                        })
                    }}
                    defaultOptions
                    loadOptions={loadDropdown}
                    name={`store_id`}
                    type={'select'}
                    className='flex-grow-1'
                    control={control}
                    rules={{ required: true }}
                // prepend={<InputGroupText>{FM('get')}</InputGroupText>}
                // append={<InputGroupText>{FM('item')}</InputGroupText>}
                />
                <ButtonGroup className='ms-1'>
                    <OrderExport<ButtonProps>
                        Component={Button}

                        title={FM('export')}
                        size='sm'
                        color='info'
                    >
                        <Download size='14' />
                    </OrderExport>
                    {/* <OrderExport<ButtonProps>
                        Component={Button}
                        exportType='2'
                        title={FM('export-orders')}
                        size='sm'
                        color='primary'
                    >
                        <Download size='14' />
                    </OrderExport>

                    <ExportReport<ButtonProps>
                        Component={Button}
                        title={FM('export-summary-report')}
                        size='sm'
                        color='secondary'

                    >
                        <Download size={14} />
                    </ExportReport> */}
                    <LoadingButton
                        loading={isLoading}
                        // onClick={reloadData}
                        size='sm'
                        color='dark'
                        className='btn btn-sm '
                        // color='dark'
                        onClick={() => {
                            setState({
                                lastRefresh: new Date().getTime()
                            })
                            reset()
                        }}
                        title={FM('reload')}
                    >
                        <RefreshCcw size='14' />
                    </LoadingButton>
                </ButtonGroup>
            </Header>
            <div id='dashboard-ecommerce'>
                {isLoading ? (
                    <Row className='match-height mb-2'>
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
                            <Col md='3'>
                                <StatsHorizontal
                                    icon={<Database />}
                                    color='info'
                                    stats={abbreviateNumber(state.reports[0]?.total_orders)}
                                    statTitle={FM('total-orders')}
                                />
                            </Col>
                            <Col md='3'>
                                <StatsHorizontal
                                    icon={<DollarSign />}
                                    color='success'
                                    stats={`${CF({
                                        money: isValid(state.reports[0]?.total_earnings)
                                            ? state.reports[0]?.total_earnings
                                            : 0,
                                        currency: state.reports[0]?.currency
                                    })}`}
                                    statTitle={FM('total-earnings-kr', {
                                        kr: isValid(state.reports[0]?.currency) ? state.reports[0]?.currency : 'SEK'
                                    })}
                                />
                            </Col>
                            <Col md='3'>
                                <StatsHorizontal
                                    icon={<DollarSign />}
                                    color='warning'
                                    stats={`${CF({
                                        money: isValid(state.reports[0]?.total_admin_shares)
                                            ? state.reports[0]?.total_admin_shares
                                            : 0,
                                        currency: state.reports[0]?.currency
                                    })}`}
                                    statTitle={FM('admin-share')}
                                />
                            </Col>

                            <Col md='3'>
                                <StatsHorizontal
                                    icon={<DollarSign />}
                                    color='primary'
                                    stats={`${CF({
                                        money: isValid(state.reports[0]?.total_store_shares)
                                            ? state.reports[0]?.total_store_shares
                                            : 0,
                                        currency: state.reports[0]?.currency
                                    })}`}
                                    statTitle={FM('total-store-share')}
                                />
                            </Col>
                            <Col md='3'>
                                <StatsHorizontal
                                    icon={<DollarSign />}
                                    color='warning'
                                    stats={`${CF({
                                        money: isValid(state.reports[0]?.total_returns)
                                            ? state.reports[0]?.total_returns
                                            : 0,
                                        currency: state.reports[0]?.currency
                                    })}`}
                                    statTitle={FM('total-returns-amount')}
                                />
                            </Col>
                            <hr />
                            <Col md='3'>
                                <StatsHorizontal
                                    icon={<Database />}
                                    color='info'
                                    stats={abbreviateNumber(state.reports[0]?.todays_order)}
                                    statTitle={FM('today-orders')}
                                />
                            </Col>
                            <Col md='3'>
                                <StatsHorizontal
                                    icon={<DollarSign />}
                                    color='success'
                                    stats={`${CF({
                                        money: isValid(state.reports[0]?.todays_earning)
                                            ? state.reports[0]?.todays_earning
                                            : 0,
                                        currency: state.reports[0]?.currency
                                    })}`}
                                    statTitle={FM('today-earnings')}
                                />
                            </Col>
                            <Col md='3'>
                                <StatsHorizontal
                                    icon={<DollarSign />}
                                    color='warning'
                                    stats={`${CF({
                                        money: isValid(state.reports[0]?.todays_admin_share)
                                            ? state.reports[0]?.todays_admin_share
                                            : 0,
                                        currency: state.reports[0]?.currency
                                    })}`}
                                    statTitle={FM('today-admin-share')}
                                />
                            </Col>

                            <Col md='3'>
                                <StatsHorizontal
                                    icon={<DollarSign />}
                                    color='primary'
                                    stats={`${CF({
                                        money: isValid(state.reports[0]?.todays_store_share)
                                            ? state.reports[0]?.todays_store_share
                                            : 0,
                                        currency: state.reports[0]?.currency
                                    })}`}
                                    statTitle={FM('today-store-share')}
                                />
                            </Col>
                            <Col md='3'>
                                <StatsHorizontal
                                    icon={<Truck />}
                                    color='success'
                                    stats={abbreviateNumber(state.reports[0]?.todays_total_items_return)}
                                    statTitle={FM('today-total-items-return')}
                                />
                            </Col>
                            <Col md='3'>
                                <StatsHorizontal
                                    icon={<Gift />}
                                    color='warning'
                                    stats={abbreviateNumber(state.reports[0]?.todays_total_items_return_amount)}
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
                                    stats={abbreviateNumber(state.reports[0]?.total_customers)}
                                    statTitle={FM('total-customers')}
                                />
                            </Col>
                            <Col md='3'>
                                <StatsHorizontal
                                    icon={<Gift />}
                                    color='warning'
                                    stats={abbreviateNumber(state.reports[0]?.total_products)}
                                    statTitle={FM('total-products')}
                                />
                            </Col>

                        </Row>
                        <Row>
                            <Col md='12'>
                                <RevenueReport storeId={watch('store_id')?.value} />
                            </Col>

                            <Hide IF={userType === UserType.Admin}>
                                <Col md='8'>
                                    <Row>
                                        <Col md='12'>
                                            <TopProductList
                                                loading={state.lastRefresh}
                                                storeId={watch('store_id')?.value}
                                                least={0}
                                            />
                                        </Col>
                                        <Col md='12'>
                                            <TopProductList
                                                loading={state.lastRefresh}
                                                storeId={watch('store_id')?.value}
                                                least={1}
                                            />
                                        </Col>
                                    </Row>
                                </Col>
                                <Col md='4'>
                                    <TopCategories />
                                </Col>

                            </Hide>


                        </Row>
                        <Show IF={userType === UserType.Admin || userType === UserType.AdminEmployee || userType === UserType.Store}>
                            <Row>
                                <Col md="12">
                                    <TransactionReportTab
                                    // loading={state.lastRefresh}
                                    />
                                </Col>
                            </Row>
                        </Show>
                    </>
                )}
            </div>


        </Fragment >
    )
}

export default StoreReport
