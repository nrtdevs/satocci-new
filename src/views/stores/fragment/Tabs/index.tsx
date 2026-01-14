/* eslint-disable prettier/prettier */
// ** React Imports
// ** Styles
import '@styles/react/apps/app-users.scss'
import { useEffect, useReducer } from 'react'
import { Edit2, RefreshCcw, Trash2 } from 'react-feather'
import { useParams } from 'react-router-dom'
// ** Reactstrap Imports
import { ButtonGroup, Col, Row } from 'reactstrap'
import {
    useDeleteStoreByIdMutation,
    useLoadStoreDetailsByIdMutation
} from '../../../../redux/RTKQuery/StoreRTK'
import {
    useDeleteSubStoreByIdMutation,
    useLoadSubStoreIdMutation
} from '../../../../redux/RTKQuery/SubStoreRTK'
import { getPath } from '../../../../router/RouteHelper'
import { UserType } from '../../../../utility/Const'
import { FM, isValid } from '../../../../utility/helpers/common'
import ConfirmAlert from '../../../../utility/helpers/ConfirmAlert'
import Hide from '../../../../utility/Hide'
import useUserType from '../../../../utility/hooks/useUserType'
import { Permissions } from '../../../../utility/Permissions'
import Show from '../../../../utility/Show'

import { stateReducer } from '../../../../utility/stateReducer'
import { getUserData, truncateText } from '../../../../utility/Utils'
import LoadingButton from '../../../components/buttons/LoadingButton'
import Header from '../../../components/header'
import Shimmer from '../../../components/shimmers/Shimmer'
import BsTooltip from '../../../components/tooltip'
import TooltipLink from '../../../components/tooltip/TooltipLink'
import { StoreParamsType } from '../AddUpdateForm'
import StoreInfoCard from './StoreInfoCard'
import StoreTab from './StoreTab'

// ** User View Components
interface States {
    storeData?: StoreParamsType
    reloadData?: boolean
}
const DetailsView = () => {
    const params = useParams()
    const initState: States = {
        storeData: undefined,
        reloadData: false
    }
    const user = getUserData()
    const userTypes = useUserType()
    const reducers = stateReducer<States>
    const [state, setState] = useReducer(reducers, initState)
    const [loadData, { isLoading, isSuccess, isError, data, originalArgs }] =
        userTypes === UserType.Admin || userTypes === UserType.AdminEmployee
            ? useLoadStoreDetailsByIdMutation()
            : useLoadSubStoreIdMutation()
    const [deleteStore, resultDelete] =
        userTypes === UserType.Admin ? useDeleteStoreByIdMutation() : useDeleteSubStoreByIdMutation()
    const loadStore = () => {
        loadData({ id: params?.id })
    }
    useEffect(() => {
        if (params?.id && userTypes) {
            loadStore()
        }
    }, [params?.id, userTypes])

    const handleDelete = (id?: any, ids?: any, action?: any) => {
        // log('id', id)
        if (isValid(id)) {
            deleteStore({ id, originalArgs })
        } else {
            deleteStore({
                ids,
                originalArgs,
                jsonData: {
                    ids,
                    action
                }
            })
        }
    }
    return (
        <div className='app-user-view'>
            {/* <Header goBackTo={getPath('admin.stores')} title={storeData?.name}> */}
            <>
                <Header
                    goBackTo
                    onClickBack={() => history.go(-1)}
                    title={
                        <>
                            {isLoading ? (
                                <span style={{ display: 'inline-block' }}>
                                    <Shimmer style={{ width: 500, height: 24 }} />
                                </span>
                            ) : (
                                truncateText(data?.payload?.store_setting?.store_name, 50)
                            )}
                        </>
                    }
                >
                    <ButtonGroup color='dark'>
                        {/* <Hide IF={`${user?.id}` === `${params?.id}`}> */}
                        <Hide IF={true}>
                            <Hide IF={isValid(user?.parent_id)}>
                                <TooltipLink
                                    state={{ ...data?.payload }}
                                    title={<>{FM('edit')}</>}
                                    to={getPath('admin.stores.update', { id: params?.id })}
                                    className='btn btn-primary btn-sm'
                                >
                                    <>
                                        <Edit2 size='14' />
                                    </>
                                </TooltipLink>
                            </Hide>
                            <Show IF={Permissions.storeDelete}>
                                <ConfirmAlert
                                    eventId={`delete-item-${params?.id}`}
                                    item={data?.payload}
                                    title={data?.payload?.name}
                                    text={FM("are-you-sure")}
                                    color='text-warning'
                                    onClickYes={() => handleDelete(params?.id, null)}
                                    className='btn btn-danger btn-sm'
                                    id={`grid-delete-${params?.id}`}
                                >
                                    <BsTooltip title={FM('delete')}>
                                        <Trash2 size='14' />
                                    </BsTooltip>
                                </ConfirmAlert>
                            </Show>
                        </Hide>

                        <LoadingButton
                            size='sm'
                            loading={isLoading}
                            color='dark'
                            onClick={loadStore}
                            title={FM('reload')}
                        >
                            <RefreshCcw size='14' />
                        </LoadingButton>
                    </ButtonGroup>
                </Header>
                <Row className=' g-1'>
                    <Col xl='3' lg='3' xs={{ order: 0 }} md={{ order: 1, size: 4 }}>
                        <StoreInfoCard details={data?.payload} />
                    </Col>
                    <Col xl='9' lg='9' xs={{ order: 1 }} md={{ order: 0, size: 7 }}>
                        <StoreTab details={data?.payload} step={'1'} />
                    </Col>
                </Row>
            </>
        </div>
    )
}
export default DetailsView
