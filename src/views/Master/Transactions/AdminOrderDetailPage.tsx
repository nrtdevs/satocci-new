/* eslint-disable prettier/prettier */
import '@styles/base/pages/app-invoice.scss'
import { useEffect, useReducer } from 'react'
import { RefreshCcw } from 'react-feather'
import { useNavigate, useParams } from 'react-router-dom'
import { ButtonGroup, Col, Row } from 'reactstrap'
import { useAdminOrderDetailsWithIdMutation, useOrderDetailsWithIdMutation } from '../../../redux/RTKQuery/OrdersRTK'
import { FM, isValid } from '../../../utility/helpers/common'
import { stateReducer } from '../../../utility/stateReducer'
import LoadingButton from '../../components/buttons/LoadingButton'
import Header from '../../components/header'
import Shimmer from '../../components/shimmers/Shimmer'
import TransactionDetails from './Tab/TransactionDetailsTab'

interface States {
    lastRefresh?: any
}

const AdminOrderDetailPage = () => {
    const params = useParams()
    const nav = useNavigate()
    const initState: States = {
        lastRefresh: new Date().getTime()
    }

    const reducers = stateReducer<States>
    const [state, setState] = useReducer(reducers, initState)
    const [loadDetails, { data, isSuccess, isLoading, isError }] = useAdminOrderDetailsWithIdMutation()

    useEffect(() => {
        if (isValid(params?.id)) {
            loadDetails({
                id: params?.id
            })
        }
    }, [params?.id, state.lastRefresh])

    const reloadData = () => {
        setState({
            lastRefresh: new Date().getTime()
        })
    }

    return (
        <div className='app-user-view'>
            {/* <Header goBackTo={getPath('admin.stores')} title={storeData?.name}> */}

            <>
                <Header
                    goBackTo
                    onClickBack={() => nav(-1)}
                    title={
                        <>
                            {isLoading ? (
                                <span style={{ display: 'inline-block' }}>
                                    <Shimmer style={{ width: 500, height: 24 }} />
                                </span>
                            ) : (
                                data?.payload?.order_number
                            )}
                        </>
                    }
                >
                    <ButtonGroup color='dark'>
                        <LoadingButton
                            size='sm'
                            loading={isLoading}
                            color='dark'
                            onClick={reloadData}
                            title={FM('reload')}
                        >
                            <RefreshCcw size='14' />
                        </LoadingButton>
                    </ButtonGroup>
                </Header>
                <Row className=' g-1'>
                    {/* <Col xl='3' lg='3' xs={{ order: 0 }} md={{ order: 1, size: 4 }}>
            <TransactionInfo loading={isLoading} details={data?.payload} />
          </Col> */}
                    <Col xl='12' lg='12' xs={{ order: 1 }} md={{ order: 0, size: 7 }}>
                        <TransactionDetails loading={isLoading} details={data?.payload} step={'1'} />
                    </Col>
                </Row>
            </>
        </div>
    )
}

export default AdminOrderDetailPage
