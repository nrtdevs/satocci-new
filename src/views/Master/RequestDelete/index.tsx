/* eslint-disable prettier/prettier */
/* eslint-disable no-mixed-operators */
import { useContext, useEffect, useReducer } from 'react'

import '@styles/base/pages/dashboard-ecommerce.scss'
import {
    BarChart2,
    CheckCircle,
    CornerUpLeft,
    MoreVertical,
    RefreshCcw,
    Send,
    Users,
    X,
    XCircle
} from 'react-feather'
import { Badge, Button, ButtonGroup, ButtonProps } from 'reactstrap'
import { ThemeColors } from '../../../utility/context/ThemeColors'

import { Link } from 'react-router-dom'

import { TableColumn } from 'react-data-table-component'

import { useForm } from 'react-hook-form'
import { OrdersParams } from '../../../redux/RTKQuery/OrdersRTK'
import {
    useActionReturnMutation,
    useLoadReturnOrderMutation,
    useRequestDeleteAccountListMutation,
    useReturnRefundMutation
} from '../../../redux/RTKQuery/ReturnOrderRTK'
import { getPath } from '../../../router/RouteHelper'
import {
    CF,
    JsonParseValidate,
    SuccessToast,
    decrypt,
    emitAlertStatus,
    formatDate,
    getUserData
} from '../../../utility/Utils'
import { FM, isValid, log } from '../../../utility/helpers/common'
import { stateReducer } from '../../../utility/stateReducer'
import CustomDataTable, { TableFormData } from '../../components/CustomDataTable/CustomDataTable'
import LoadingButton from '../../components/buttons/LoadingButton'
import Header from '../../components/header'
import { StoreParamsType } from '../../stores/fragment/AddUpdateForm'
import ConfirmAlert from '../../../utility/helpers/ConfirmAlert'
import DropDownMenu from '../../components/dropdown'
import { IconSizes } from '../../../utility/Const'
import { QueryStatus } from '@reduxjs/toolkit/dist/query'

import BsTooltip from '../../components/tooltip'
import Show from '../../../utility/Show'

import { useNoViewModal } from '../../components/modal/HandleModal'

interface States {
    lastRefresh?: any
    page?: any
    filterType?: any
    loadingInvoice?: boolean
    per_page_record?: any
    search?: any
    reload?: any
    isRemoving?: boolean
    isIndex?: any
    isAddingNewData?: boolean
    transactionFilter?: boolean
    transactionFilterCenterAction?: boolean
    transactionFilterData?: any
    transactionFilterDataAction?: any
    filterData?: StoreParamsType | any
}

function RequestDelete() {
    const user = getUserData()
    const { colors } = useContext(ThemeColors)
    const form = useForm<any>()
    // Local States
    const initState: States = {
        page: 1,
        per_page_record: 15,
        lastRefresh: new Date().getTime(),
        transactionFilterCenterAction: false,
        search: undefined,
        isRemoving: false,
        isIndex: null,
        isAddingNewData: false
    }
    const { handleSubmit, control, reset, setValue, watch } = form
    const reducers = stateReducer<States>
    const [state, setState] = useReducer(reducers, initState)
    const la = localStorage.getItem('lang')
    const [showModal, handleModal] = useNoViewModal()
    const laa = JsonParseValidate(la)
    // Load Store Data
    const [loadReturn, { data, isLoading }] = useRequestDeleteAccountListMutation()
    const [returnAction, returnResult] = useActionReturnMutation()
    const [returnRefund, refundResult] = useReturnRefundMutation()

    log(data, 'data')

    useEffect(() => {
        setState({
            page: 1
        })
    }, [state.per_page_record])
    const handlePageChange = (e: TableFormData) => {
        setState({ ...e })
    }
    useEffect(() => {
        loadReturn({
            page: state?.per_page_record !== 15 ? 1 : state?.page,
            per_page_record: state?.per_page_record
        })
    }, [isValid(state?.search), state?.page, state?.per_page_record, state.lastRefresh])

    const actionReturn = (order_return_id: any, eventId?: any) => {
        returnRefund({
            eventId,
            order_return_id
        })
    }

    useEffect(() => {
        if ((refundResult.status = QueryStatus.fulfilled) && refundResult?.isLoading === false) {
            if (refundResult?.isSuccess) {
                emitAlertStatus('success', null, `${refundResult?.originalArgs?.eventId}`)
            } else if (refundResult?.error) {
                emitAlertStatus('failed', null, `${refundResult?.originalArgs?.eventId}`)
            }
        }
    }, [refundResult])

    useEffect(() => {
        if (refundResult.isSuccess) {
            SuccessToast(refundResult?.data?.message)
            loadReturn({
                page: state?.per_page_record !== 15 ? 1 : state?.page,
                per_page_record: state?.per_page_record
            })
        }
    }, [refundResult])

    let columns: TableColumn<any>[] = []

    columns = [
        {
            name: '#',
            cell: (row, index: any) => {
                // eslint-disable-next-line no-mixed-operators
                return parseInt(state?.per_page_record) * (state?.page - 1) + (index + 1)
            }
        },

        {
            name: <>{FM('customer-name')}</>,

            cell: (row) => (
                // <Link
                //   state={{ row }}
                //   to={getPath('admin.orders.detail', { id: row?.id })}
                //   className='d-block'
                //   id='create-button'
                // >
                <span className='d-block fw-bold text-primary'>{decrypt(row?.customer?.name)}</span>
                // </Link>
            )
        },

        {
            name: <>{FM('customer-email')}</>,

            cell: (row) => (
                <span className='d-block fw-bold text-primary'>{decrypt(row?.customer?.email)}</span>
            )
        }

    ]

    //   if (data?. === 3) {
    //     columns.splice(6, 1)
    //   }

    return (
        <>

            <Header icon={<XCircle size='25' />} title={FM('delete-request')}>
                <ButtonGroup color='dark'>
                    <LoadingButton
                        tooltip={FM('reload')}
                        loading={isLoading}
                        size='sm'
                        color='dark'
                        onClick={() =>
                            setState({
                                lastRefresh: new Date().getTime(),
                                page: 1,
                                filterData: null
                            })
                        }
                    >
                        <RefreshCcw size='14' />
                    </LoadingButton>
                </ButtonGroup>
            </Header>
            <CustomDataTable<any>
                key={state.lastRefresh}
                initialPerPage={15}
                isLoading={isLoading}
                columns={columns}
                paginatedData={data}
                handlePaginationAndSearch={handlePageChange}
            />
        </>
    )
}
export default RequestDelete
