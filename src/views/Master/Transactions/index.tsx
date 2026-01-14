/* eslint-disable prettier/prettier */
/* eslint-disable no-mixed-operators */
import { useContext, useEffect, useReducer, useState } from 'react'

import '@styles/base/pages/dashboard-ecommerce.scss'
import {
    Activity,
    BarChart2,
    CheckCircle,
    CornerUpLeft,
    Download,
    Printer,
    RefreshCcw,
    Send,
    Sliders
} from 'react-feather'
import { Badge, Button, ButtonGroup, ButtonProps, DropdownItem } from 'reactstrap'
import { ThemeColors } from '../../../utility/context/ThemeColors'

import { Link } from 'react-router-dom'

import { QueryStatus } from '@reduxjs/toolkit/dist/query'
import { TableColumn } from 'react-data-table-component'
import { useDeleteStoreByIdMutation } from '../../../redux/RTKQuery/StoreRTK'

import { useForm } from 'react-hook-form'
import {
    OrdersParams,
    useLoadOrdersMutation,
    useResentInvoiceMutation
} from '../../../redux/RTKQuery/OrdersRTK'
import { getPath } from '../../../router/RouteHelper'
import { UserType } from '../../../utility/Const'
import Hide from '../../../utility/Hide'
import { Permissions } from '../../../utility/Permissions'
import Show, { Can } from '../../../utility/Show'
import {
    CF,
    JsonParseValidate,
    emitAlertStatus,
    formatDate,
    getUserData
} from '../../../utility/Utils'
import { downloadStoreInvoice } from '../../../utility/apis/ExportLanguage'
import { loadDropdown } from '../../../utility/apis/dropdowns'
import ConfirmAlert from '../../../utility/helpers/ConfirmAlert'
import { FM, isValid, isValidUrl } from '../../../utility/helpers/common'
import useUserType from '../../../utility/hooks/useUserType'
import ApiEndpoints from '../../../utility/http/ApiEndpoints'
import httpConfig from '../../../utility/http/httpConfig'
import { stateReducer } from '../../../utility/stateReducer'
import CustomDataTable, {
    TableDropDownOptions,
    TableFormData
} from '../../components/CustomDataTable/CustomDataTable'
import LoadingButton from '../../components/buttons/LoadingButton'
import FormGroupCustom from '../../components/formGroupCustom/FormGroupCustom'
import Header from '../../components/header'
import Ratings from '../../components/ratings'
import BsTooltip from '../../components/tooltip'
import { StoreParamsType } from '../../stores/fragment/AddUpdateForm'
import TransactionFilter from './transactionFilter'
import AcceptRejectOrderModal from './Tab/AcceptRejectOrderModal'
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
    transactionFilterCenter?: boolean
    transactionFilterData?: any
    filterData?: StoreParamsType | any
}

function Stores() {
    const user = getUserData()
    const userType = useUserType()
    const { colors } = useContext(ThemeColors)
    const [showModal, handleModal] = useNoViewModal()
    const form = useForm<any>()
    // Local States
    const initState: States = {
        page: 1,
        per_page_record: 15,
        filterType: 'filter',
        lastRefresh: new Date().getTime(),
        transactionFilter: false,
        transactionFilterCenter: false,
        transactionFilterData: undefined,
        filterData: {
            name: null,
            email: null,
            subscription_terms_select_value: null,
            status: null
        },
        search: undefined,
        isRemoving: false,
        isIndex: null,
        isAddingNewData: false
    }
    const { handleSubmit, control, reset, setValue, watch } = form
    const reducers = stateReducer<States>
    const [state, setState] = useReducer(reducers, initState)
    const [loadInvoice, setLOadInvoice] = useState<boolean>(false)
    const la = localStorage.getItem('lang')

    const laa = JsonParseValidate(la)
    // Load Store Data
    const [loadOrders, { data, isLoading, isError, isSuccess }] = useLoadOrdersMutation()
    const [resentInvoice, resp] = useResentInvoiceMutation()

    useEffect(() => {
        loadOrders({
            jsonData: {
                ...state?.filterData,
                search: isValid(state?.search) ? state?.search : state?.filterData?.order_number,
                store_id: userType === UserType.Employee ? user?.store_id : watch('store_id')?.value
            },
            page: isValid(state?.search) ? 1 : state.page,
            per_page_record: state.per_page_record
        })
    }, [
        state.page,
        state.per_page_record,
        state.lastRefresh,
        watch('store_id'),
        state?.search,
        state?.filterData
    ])
    // delete store
    const [deleteStore, resultDelete] = useDeleteStoreByIdMutation()
    useEffect(() => {
        setState({
            page: 1
        })
    }, [state.per_page_record, watch('store_id')])
    const handlePageChange = (e: TableFormData) => {
        setState({ ...e })
    }

    const handleSingleDelete = (id: any) => {
        deleteStore({ id })
    }

    useEffect(() => {
        if ((resultDelete.status = QueryStatus.fulfilled) && resultDelete?.isLoading === false) {
            if (resultDelete?.isSuccess) {
                setState({ isRemoving: true })

                emitAlertStatus('success', null, `delete-item-${resultDelete?.originalArgs?.id}`)
            } else if (resultDelete?.error) {
                emitAlertStatus('failed', null, `delete-item-${resultDelete?.originalArgs?.id}`)
            }
        }
    }, [resultDelete])

    const downloadInvoice = (d?: any) => {
        setState({
            isIndex: d?.index
        })
        downloadStoreInvoice({
            jsonData: {
                lang: laa?.id
            },

            id: d?.id,
            loading: setLOadInvoice,
            success: (e: any) => {
                if (isValidUrl(e?.payload)) {
                    window.open(`${e?.payload}`, '_blank')
                } else {
                    window.open(`${httpConfig.baseUrl2}${e?.payload}`, '_blank')

                }
            }
        })
    }

    const handleActions = (id?: any, ids?: any, action?: any, eventId?: any) => {
        if (isValid(id)) {
            // delete single
            resentInvoice({
                eventId,
                id,
                originalArgs: resp?.originalArgs
            })
        }
    }

    useEffect(() => {
        if ((resp.status = QueryStatus.fulfilled) && resp?.isLoading === false) {
            if (resp?.isSuccess) {
                emitAlertStatus('success', null, resp?.originalArgs?.eventId)
            } else if (resp?.error) {
                emitAlertStatus('failed', null, resp?.originalArgs?.eventId)
            }
        }
    }, [resp])

    const allowsReturn = user?.allow_return_and_refunds === 1

    const isVisibleReturn = (row: any) => {
        let re = false
        if (allowsReturn && row?.order_details_count > 0) {
            if (row?.payment_status === 1 && row?.return_initiated === 2) {
                re = true
            }
        }
        return re
    }

    let columns: TableColumn<OrdersParams>[] = []

    columns = [
        {
            name: '#',
            maxWidth: '40px',
            cell: (row, index: any) => {
                // eslint-disable-next-line no-mixed-operators
                return parseInt(state?.per_page_record) * (state?.page - 1) + (index + 1)
            }
        },

        {
            name: <>{FM('order-number')}</>,
            maxWidth: '150px',

            cell: (row) => (
                <Link
                    state={{ row }}
                    to={getPath('admin.orders.detail', { id: row?.id })}
                    className='d-block'
                    id='create-button'
                >
                    <span className='d-block fw-bold text-truncate'>
                        <u>{row?.order_number}</u>
                    </span>
                </Link>
            )
        },

        {
            name: <>{FM('item-count')}</>,
            cell: (row) => (
                <span className='d-block fw-bold'>
                    {row?.order_details_count} {FM('items')}
                </span>
            )
        },
        {
            name: <>{FM('paid-amount')}</>,
            cell: (row) => (
                <div className='d-flex align-items-center'>
                    <div className='user-info text-truncate ms-1'>
                        <span className='d-block fw-bold'>
                            {CF({
                                money: row?.paid_amount,
                                currency: isValid(user?.currency) ? user?.currency : 'SEK'
                            })}
                        </span>
                    </div>
                </div>
            )
        },
        {
            name: <>{FM('order-date')}</>,
            cell: (row) => (
                <div className='d-flex align-items-center'>
                    <div className='user-info text-truncate ms-1'>
                        <span className='d-block fw-bold text-truncate'>{formatDate(row?.created_at)}</span>
                    </div>
                </div>
            )
        },
        {
            name: <>{FM('order-rating')}</>,
            cell: (row) => (
                <div className='d-flex align-items-center'>
                    <div className='user-info text-truncate'>
                        {Number(row?.order_rating?.rating) > 0 ? (
                            <Ratings rating={row?.order_rating?.rating} max={5} />
                        ) : (
                            <span className='text-danger'>{'N/A'}</span>
                        )}
                    </div>
                </div>
            )
        },
        {
            name: <>{FM('payment-method')}</>,
            cell: (row) => {
                return (
                    <>
                        {`${row?.payment_method}` === `${1}` ? (
                            <Badge color={'light-success'} pill>
                                <>{FM('enfuse')}</>
                            </Badge>
                        ) : `${row?.payment_method}` === `${2}` ? (
                            <Badge color={'light-danger'} pill>
                                <>{FM('stripe')}</>
                            </Badge>
                        ) : `${row?.payment_method}` === `${3}` ? (
                            <Badge color={'light-primary'} pill>
                                <>{FM('tabby')}</>
                            </Badge>
                        ) : (
                            <Badge color={'light-primary'} pill>
                                <>{FM('crypto-wallet')}</>
                            </Badge>
                        )}
                    </>
                )
            }
        },
        {
            name: <>{FM('Status')}</>,
            cell: (row) => {
                return (
                    <>
                        {row?.status === 1 ? (
                            <Badge color={'light-success'} pill>
                                <>{FM('completed')}</>
                            </Badge>
                        ) : row?.status === 2 ? (
                            <Badge color={'light-danger'} pill>
                                <>{FM('cancelled')}</>
                            </Badge>
                        ) : (
                            <Badge color={'light-primary'} pill>
                                <>{FM('pending')}</>
                            </Badge>
                        )}
                    </>
                )
            }
        },
        {
            minWidth: '250px',
            name: <>{FM('action')}</>,
            cell: (row, i) => (
                <ButtonGroup>
                    <Show IF={row?.payment_status === 1}>
                        <LoadingButton
                            loading={state.isIndex === i ? loadInvoice : false}
                            tooltip={FM('print')}
                            onClick={() => downloadInvoice({ id: row?.id, index: i })}
                            className='btn btn-primary btn-sm d-flex align-items-center'
                        >
                            <Printer size='14' />
                        </LoadingButton>
                    </Show>
                    <Show IF={isValid(row?.user_id) && row?.payment_status === 1}>
                        <BsTooltip<ButtonProps>
                            className='btn btn-primary btn-sm d-flex align-items-center'
                            title={FM('send-invoice')}
                        >
                            <ConfirmAlert
                                eventId={`delete-item-${row?.id}`}
                                item={row}
                                text={FM('send-invoice')}
                                title={row?.order_id}
                                color='text-warning'
                                onClickYes={(e: any) => {
                                    handleActions(row?.id, null, null, `delete-item-${row?.id}`)
                                }}
                                onSuccessEvent={(e: any) => { }}
                                id={`grid-delete-${row?.id}`}
                            >
                                <Send size={14} />
                            </ConfirmAlert>
                        </BsTooltip>
                    </Show>
                    {/* <Show
                        IF={isVisibleReturn(row)}
                    >
                        <BsTooltip<ButtonProps>
                            Tag={Button}
                            size='sm'
                            color='success'
                            onClick={(e) => {
                                handleModal()
                                setState({
                                    // transactionFilterCenter: true,
                                    filterType: 'approve',
                                    transactionFilterData: row
                                })
                            }
                            }
                            title={FM('approve')}
                        >
                            <CheckCircle size='14' />
                        </BsTooltip>
                        <BsTooltip<ButtonProps>
                            Tag={Button}
                            size='sm'
                            color='warning'
                            onClick={(e) => {
                                handleModal()
                                setState({
                                    //  transactionFilterCenter: true,
                                    filterType: 'reject',
                                    transactionFilterData: row
                                })
                            }
                            }
                            title={FM('reject')}
                        >
                            <CornerUpLeft size='14' />
                        </BsTooltip>
                    </Show> */}

                </ButtonGroup>
            )
        }
    ]

    const options: TableDropDownOptions = (selectedRows) => [
        {
            noWrap: true,
            name: (
                <DropdownItem
                    onClick={() => { }}
                    tag={'span'}
                    className='dropdown-item d-flex align-items-center'
                >
                    <>
                        <Activity size={16} className='me-1' />
                        {FM('delete')} ({selectedRows?.selectedCount})
                    </>
                </DropdownItem>
            )
        }
    ]

    const colorsArr = {
        Technology: 'light-primary',
        Grocery: 'light-success',
        Fashion: 'light-warning'
    }

    return (
        <>
            <TransactionFilter
                exportType={state.filterType}
                orderData={state.transactionFilterData}
                show={state?.transactionFilter}
                showCenter={state?.transactionFilterCenter}
                filterData={state.filterData}
                setFilterData={(e: any) => setState({ filterData: e, page: 1 })}
                handleFilterModal={(e: boolean) => {
                    setState({
                        transactionFilter: e
                    })
                }}
                handleFilterModalCenter={(e: boolean) => {
                    setState({
                        transactionFilterCenter: false,
                        lastRefresh: e ? new Date().getTime() : state?.lastRefresh
                    })
                }}
            />
            <AcceptRejectOrderModal
                edit={state?.transactionFilterData}
                exportType={state.filterType}
                response={(e: boolean) => {
                    // reloadData()
                }}
                showModal={showModal}
                setShowModal={(e) => handleModal()}
                noView
            />
            <Header icon={<BarChart2 size='25' />} title={FM('orders')}>
                <Hide
                    IF={
                        userType === UserType.Employee ||
                        (isValid(user?.parent_id) && userType === UserType.Store)
                    }
                >
                    <FormGroupCustom
                        noGroup
                        noLabel
                        label={FM('store')}
                        placeholder={FM('select-store')}
                        async
                        isClearable
                        path={
                            userType === 1
                                ? ApiEndpoints.load_stores
                                : ApiEndpoints.store_substore_list + user?.store_id
                        }
                        selectLabel='name'
                        selectValue={'id'}
                        defaultOptions
                        modifyDropdownData={(d: any) => {
                            return {
                                ...d,
                                name: `${d?.name} / (${d?.store_setting?.store_name ?? d?.store_setting?.store_name
                                    })`
                            }
                        }}
                        loadOptions={loadDropdown}
                        name={`store_id`}
                        type={'select'}
                        className='flex-grow-1 me-1'
                        control={control}
                        rules={{ required: true }}
                    />
                </Hide>

                <ButtonGroup color='dark'>
                    <BsTooltip<ButtonProps>
                        Tag={Button}
                        size='sm'
                        color='info'
                        onClick={() =>
                            setState({
                                transactionFilter: true,
                                filterType: 'onlyOrders'
                            })
                        }
                        title={FM('export-orders')}
                    >
                        <Download size='14' />
                    </BsTooltip>
                    <Show IF={Can(Permissions.productBrowse)}>
                        <BsTooltip<ButtonProps>
                            Tag={Button}
                            size='sm'
                            color='primary'
                            onClick={() =>
                                setState({
                                    transactionFilter: true,
                                    filterType: 'ordersDetails'
                                })
                            }
                            title={FM('export-with-products')}
                        >
                            <Download size='14' />
                        </BsTooltip>
                    </Show>

                    <BsTooltip<ButtonProps>
                        Tag={Button}
                        size='sm'
                        color='secondary'
                        onClick={() =>
                            setState({
                                transactionFilter: true,
                                filterType: 'filter'
                            })
                        }
                        title={FM('filter')}
                    >
                        <Sliders size='14' />
                    </BsTooltip>
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
            <CustomDataTable<OrdersParams>
                key={state.lastRefresh}
                initialPerPage={15}
                isLoading={isLoading}
                options={options}
                columns={columns}
                paginatedData={data}
                handlePaginationAndSearch={handlePageChange}
            />
        </>
    )
}
export default Stores
