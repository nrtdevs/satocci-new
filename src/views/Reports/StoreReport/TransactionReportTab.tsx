/* eslint-disable prettier/prettier */
import BarChartIcon from '@mui/icons-material/BarChart'
import ListAltIcon from '@mui/icons-material/ListAlt'
import LocalOfferIcon from '@mui/icons-material/LocalOffer'
import QrCodeIcon from '@mui/icons-material/QrCode'
import { Fragment, useEffect, useReducer } from 'react'
import { Plus, RefreshCcw, Sliders, X } from 'react-feather'
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
import { stateReducer } from '../../../utility/stateReducer'
import useUserType from '../../../utility/hooks/useUserType'
import useUser from '../../../utility/hooks/useUser'
import { FM } from '../../../utility/helpers/common'
import Hide from '../../../utility/Hide'
import AllTransfers from './AllTransfers'
import AppAppFees from './AppAppFees'
import StripeAllPayouts from './StripeAllPayouts'
import BsTooltip from '../../components/tooltip'
import LoadingButton from '../../components/buttons/LoadingButton'
import { UserType } from '../../../utility/Const'
type theProps = {

    step?: string


}
type States = {
    active?: string
    addOffer?: boolean
    allPayoutsFilter?: boolean
    allAppFeesFilter?: boolean
    lastRefresh?: any
    allTransfersFilter?: boolean
}
const TransactionReportTab = () => {
    const initState: States = {
        active: '1',
        addOffer: false,
        lastRefresh: new Date().getTime(),
        allPayoutsFilter: false,
        allAppFeesFilter: false,
        allTransfersFilter: false
    }
    const reducers = stateReducer<States>
    const [state, setState] = useReducer(reducers, initState)
    const userType = useUserType()

    const toggleTab = (tab: any) => {
        if (state?.active !== tab) {
            setState({ active: tab })
        }
    }

    const user = useUser()

    const toggleOfferAdd = () => {
        setState({ addOffer: !state.addOffer })
    }
    const toggleTransaction = () => {
        if (state.active === '1') {
            setState({ allPayoutsFilter: !state.allPayoutsFilter })
        } else if (state.active === '2') {
            setState({ allAppFeesFilter: !state.allAppFeesFilter })
        } else if (state.active === '3') {
            setState({ allTransfersFilter: !state.allTransfersFilter })
        }
    }


    const changer = () => {
        if (state.active === '1') {
            return state.allPayoutsFilter
        } else if (state.active === '2') {
            return state.allAppFeesFilter
        } else if (state.active === '3') {
            return state.allTransfersFilter
        }
    }

    useEffect(() => {
        if (userType === UserType.Store) {
            setState({ active: '3' })
        }
    }, [userType])
    return (
        <Fragment>
            <Card>
                <CardHeader className='p-1 border-bottom'>
                    <div className='flex-1'>
                        <Row className='d-flex justify-content-between aligned-items-center'>
                            <Col md='11' className=''>
                                <Nav pills className={`mb-0 flex-column flex-sm-row`}>
                                    <Hide IF={userType === UserType.Store}>
                                        <NavItem>
                                            <NavLink active={state.active === '1'} onClick={() => toggleTab('1')}>
                                                <QrCodeIcon className='font-medium-3  me-50' />
                                                <span className='fw-bold'>
                                                    <>{FM('stripe-all-payouts')}</>
                                                </span>
                                            </NavLink>
                                        </NavItem>

                                        <NavItem>
                                            <NavLink active={state.active === '2'} onClick={() => toggleTab('2')}>
                                                <ListAltIcon className='font-medium-3  me-50' />
                                                <span className='fw-bold'>
                                                    <>{FM('app-fees')}</>
                                                </span>
                                            </NavLink>
                                        </NavItem>
                                    </Hide>

                                    <NavItem>
                                        <NavLink active={state.active === '3'} onClick={() => toggleTab('3')}>
                                            <LocalOfferIcon className='font-medium-3  me-50' />
                                            <span className='fw-bold'>
                                                <>{FM('all-transaction')}</>
                                            </span>
                                        </NavLink>
                                    </NavItem>

                                </Nav>
                            </Col>
                            {/* <Show IF={state.active === '2'}> */}
                            <Col md='1' className='d-flex align-items-start justify-content-end'>
                                <ButtonGroup color='dark'>
                                    {/* <LoadingButton
                                        tooltip={FM('reload')}
                                        size='sm'
                                        color='dark'
                                        onClick={() => {
                                            setState({ lastRefresh: new Date().getTime() })
                                        }}
                                        loading={false}
                                    >
                                        <RefreshCcw size='14' />
                                    </LoadingButton> */}
                                    <BsTooltip<ButtonProps>
                                        Tag={Button}
                                        color={changer() ? 'danger' : 'primary'}
                                        className='btn-icon'
                                        title={FM('filter')}
                                        onClick={toggleTransaction}
                                    >
                                        {changer() ? <X size={16} /> : <Sliders size={16} />}
                                    </BsTooltip>
                                </ButtonGroup>
                            </Col>
                            {/* </Show> */}
                            {/* <Show IF={state.active === '3'}>
                                <Col md='1' className='d-flex align-items-start justify-content-end'>
                                    <ButtonGroup color='dark'>
                                        <BsTooltip<ButtonProps>
                                            Tag={Button}
                                            color={state?.addOffer ? 'danger' : 'primary'}
                                            className='btn-icon'
                                            title={FM('add-offer')}
                                            onClick={toggleOfferAdd}
                                        >
                                            {state?.addOffer ? <X size={16} /> : <Plus size={16} />}
                                        </BsTooltip>
                                    </ButtonGroup>
                                </Col>
                            </Show> */}
                        </Row>
                    </div>
                </CardHeader>
                <CardBody className='p-0'>
                    <TabContent activeTab={state.active}>

                        <TabPane tabId='2'>
                            <AppAppFees loading={false} filterBoth={state?.allAppFeesFilter} />


                        </TabPane>

                        <TabPane tabId='1'>
                            <StripeAllPayouts loading={false} filterBoth={state.allPayoutsFilter} />
                        </TabPane>

                        <TabPane tabId='3'>
                            <AllTransfers
                                loading={false}
                                storeId={user?.store_id}

                                filterBoth={state?.allTransfersFilter}
                            />
                        </TabPane>
                    </TabContent>
                </CardBody>
            </Card>
        </Fragment>
    )
}

export default TransactionReportTab
