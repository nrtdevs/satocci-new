/* eslint-disable prettier/prettier */
/* eslint-disable eqeqeq */
import { useContext, useEffect, useReducer } from 'react'

import {
    CheckCircle,
    Edit,
    Gift,
    MoreVertical,
    Plus,
    RefreshCcw,
    Sliders,
    StopCircle,
    XCircle
} from 'react-feather'
import { Badge, ButtonGroup } from 'reactstrap'
import { ThemeColors } from '../../../utility/context/ThemeColors'

import { useLocation } from 'react-router-dom'

import { getPath } from '../../../router/RouteHelper'
import { IconSizes, UserType } from '../../../utility/Const'
import { FM, isValid } from '../../../utility/helpers/common'
import { stateReducer } from '../../../utility/stateReducer'
import CustomDataTable, {
    TableDropDownOptions,
    TableFormData
} from '../../components/CustomDataTable/CustomDataTable'
import DropDownMenu from '../../components/dropdown'
import Header from '../../components/header'

import { QueryStatus } from '@reduxjs/toolkit/dist/query'
import { TableColumn } from 'react-data-table-component'
import { useDispatch } from 'react-redux'
import { useActionCouponMutation, useLoadCouponMutation } from '../../../redux/RTKQuery/CouponRTK'
import { Permissions } from '../../../utility/Permissions'
import Show, { Can } from '../../../utility/Show'
import { CF, decrypt, emitAlertStatus, formatDate, truncateText } from '../../../utility/Utils'
import ConfirmAlert from '../../../utility/helpers/ConfirmAlert'
import useUser from '../../../utility/hooks/useUser'
import useUserType from '../../../utility/hooks/useUserType'
import LoadingButton from '../../components/buttons/LoadingButton'
import TooltipLink from '../../components/tooltip/TooltipLink'
import { CouponParamType } from './AddUpdateCoupon'
import CouponFilter from './CouponFilter'
import ModalCouponDetails from './ModalCouponDetails'

interface States {
    couponData?: any
    lastRefresh?: any
    status?: any
    page?: any
    per_page_record?: any
    couponFilter?: boolean
    filterData?: any
    search?: any
    reload?: any
    isRemoving?: boolean
    isReloading?: boolean
    isAddingNewData?: boolean
    changeObject?: any
    show?: boolean
}
const Coupon = () => {
    const dispatch = useDispatch()
    const { colors } = useContext(ThemeColors)
    // Local States
    const initState: States = {
        lastRefresh: new Date().getTime(),
        page: 1,
        status: '1',
        per_page_record: 15,
        couponFilter: false,
        changeObject: null,
        filterData: null,
        couponData: {},
        search: undefined,
        isRemoving: false,
        isReloading: false,
        isAddingNewData: false,
        show: false
    }

    const location: any = useLocation()
    const user = useUser()
    const userType = useUserType()
    const reducers = stateReducer<States>
    const [state, setState] = useReducer(reducers, initState)

    const [loadCoupon, { data, isLoading, isSuccess }] = useLoadCouponMutation()
    const canLoadCoupon = Can(Permissions.couponBrowse)
    const [actionCoupon, couponResult] = useActionCouponMutation()

    useEffect(() => {
        if (canLoadCoupon) {
            loadCoupon({
                jsonData: {
                    ...state?.filterData,
                    coupon_code: state?.search ? state.search : state?.filterData?.coupon_code,
                    status: state?.status
                },

                page: isValid(state.search) ? 1 : state.page,
                per_page_record: state?.per_page_record
            })
        }
    }, [
        state?.per_page_record,
        state?.page,
        state?.lastRefresh,
        state?.search,
        state?.filterData
    ])

    // const handlePageChange = (e: TableFormData) => {
    //   setState({ ...e })
    // }
    useEffect(() => {
        setState({
            page: 1
        })
    }, [state.per_page_record])
    const handlePageChange = (e: TableFormData) => {
        setState({
            ...e,
            search: e?.search
        })
    }


    console.log('data', state.search)
    const handleActions = (id?: any, ids?: any, action?: any, eventId?: any) => {
        if (isValid(id)) {
            // delete single
            // deleteStore({
            //   eventId,
            //   id,
            //   originalArgs: couponResult?.originalArgs
            // })
        } else {
            actionCoupon({
                ids,
                eventId,
                originalArgs: couponResult?.originalArgs,
                jsonData: {
                    ids,
                    action
                }
            })
        }
    }

    useEffect(() => {
        if ((couponResult.status = QueryStatus.fulfilled) && couponResult?.isLoading === false) {
            if (couponResult?.isSuccess) {
                emitAlertStatus('success', null, couponResult?.originalArgs?.eventId)
            } else if (couponResult?.error) {
                emitAlertStatus('failed', null, couponResult?.originalArgs?.eventId)
            }
        }
    }, [couponResult])

    const reloadData = () => {
        setState({
            lastRefresh: new Date().getTime(),
            page: 1
        })
    }

    const columns: TableColumn<CouponParamType>[] = [
        {
            name: '#',
            maxWidth: '10px',
            cell: (row, index: any) => {
                // eslint-disable-next-line no-mixed-operators
                return parseInt(state?.per_page_record) * (state?.page - 1) + (index + 1)
            }
        },
        {
            name: <>{FM('coupon-code')}</>,
            minWidth: '250px',
            cell: (row) => (
                <ModalCouponDetails edit={row}>
                    <div className='d-flex align-items-center'>
                        <div className='user-info text-truncate'>
                            {isValid(row?.created_by) && row?.is_belongs_to_satocci === 1 ? (
                                <>
                                    <Badge color='light-info' className='d-block fw-bold text-truncate'>
                                        <u>{`${row?.coupon_code}`}</u>
                                    </Badge>
                                    <small className='text-primary status-text'>
                                        {FM('created_by')} : {truncateText(decrypt(row?.created_by?.name), 30)}
                                    </small>
                                </>
                            ) : (
                                <>
                                    <Badge color='light-primary' className='d-block fw-bold text-truncate'>
                                        <u>{`${row?.coupon_code}`}</u>
                                    </Badge>
                                    <small className='text-dark status-text'>
                                        {' '}
                                        {FM('created_by')} :{truncateText(decrypt(row?.created_by?.name), 30)}
                                    </small>
                                </>
                            )}
                        </div>
                    </div>
                </ModalCouponDetails>
            )
        },
        {
            name: <>{FM('store')}</>,
            minWidth: '250px',
            cell: (row) => (
                <div className='d-flex align-items-center'>
                    <div>
                        <div className='fw-bold'>{row?.store_setting?.store_name}</div>
                    </div>
                </div>
            )
        },
        {
            name: <>{FM('discount-value')}</>,

            cell: (row) => (
                <div className='d-flex align-items-center'>
                    <div className='user-info text-truncate ms-1'>
                        <span className='d-block fw-bold text-truncate'>
                            {/* {row.discount_type == 1 ? FM('fixed') : FM('percentage')} */}
                            {row.discount_type == 1
                                ? `${CF({
                                    money: Number(row.discount_value),
                                    currency: row?.store_setting?.currency ?? user?.currency
                                })}`
                                : `${row.discount_value}%`}
                        </span>
                    </div>
                </div>
            )
        },

        {
            name: <>{FM('max-discount')}</>,

            cell: (row) => (
                <div className='d-flex align-items-center'>
                    <div>
                        <div className='fw-bold'>
                            {/* {CF({
                                money: row.max_discount,
                                currency: row?.store_setting?.currency ?? user?.currency
                            })} */}
                            <span> {`${row?.max_discount === '9999999999' ? '' : row?.store_setting?.currency}   `}{row?.max_discount === '9999999999' ? FM('no-restriction') : row?.max_discount}</span>
                        </div>
                    </div>
                </div>
            )
        },
        {
            name: <>{FM('expiry-date')}</>,

            cell: (row) => (
                <div className='d-flex align-items-center'>
                    {row?.status === 1 ? (
                        <Badge color='light-success'>{formatDate(row?.expiry_date)}</Badge>
                    ) : (
                        <Badge color='light-danger'>{formatDate(row?.expiry_date)}</Badge>
                    )}
                </div>
            )
        },
        {
            name: <>{FM('status')}</>,

            cell: (row) => (
                <div className='d-flex align-items-center'>
                    <div className='d-block user-info'>
                        {`${row?.status}` === `${1}` ? (
                            <Badge color='light-success'>
                                <>{FM('active')}</>
                            </Badge>
                        ) : (
                            <Badge color='light-danger'>
                                <> {FM('expired')}</>
                            </Badge>
                        )}
                    </div>
                </div>
            )
        },
        {
            name: <>{FM('action')}</>,
            allowOverflow: true,
            maxWidth: '10px',
            cell: (row: any) => {
                return (
                    <div className='d-flex '>
                        <Show IF={Can(Permissions.couponEdit)}>
                            <DropDownMenu
                                direction='down'
                                component={
                                    <MoreVertical color={colors.primary.main} size={IconSizes.MenuVertical} />
                                }
                                options={[
                                    {
                                        IF:
                                            (Can(Permissions.couponEdit) &&
                                                row?.is_belongs_to_satocci === 1 &&
                                                userType === UserType.Admin) ||
                                            (Can(Permissions.couponEdit) &&
                                                row?.is_belongs_to_satocci === 0 &&
                                                userType === UserType.Store),
                                        icon: <Edit size={14} />,
                                        state: row,
                                        to: {
                                            pathname: getPath('store.edit', {
                                                id: row?.id
                                            })
                                        },
                                        name: FM('edit')
                                    },

                                    {
                                        IF: row?.status === 3 && Can(Permissions.couponEdit),
                                        icon: <CheckCircle size={14} />,
                                        onClick: () => {
                                            setState({
                                                show: true,
                                                couponData: { ...row, isActiveReq: true }
                                            })
                                        },
                                        name: FM('activate')
                                    },
                                    {
                                        IF: row?.status === 1 && Can(Permissions.couponEdit),
                                        noWrap: true,
                                        name: (
                                            <ConfirmAlert
                                                menuIcon={<StopCircle size={14} />}
                                                onDropdown
                                                eventId={`expire-item-${row?.id}`}
                                                item={row}
                                                title={truncateText(`${row?.coupon_code}`, 50)}
                                                text={FM("are-you-sure")}
                                                color='text-warning'
                                                onClickYes={() =>
                                                    handleActions(null, [row?.id], 'expire', `expire-item-${row?.id}`)
                                                }
                                                onSuccessEvent={(e: any) => {
                                                    reloadData()
                                                }}
                                                className=''
                                                id={`grid-expire-${row?.id}`}
                                            >
                                                {FM('expire')}
                                            </ConfirmAlert>
                                        )
                                    }
                                ]}
                            />
                        </Show>
                    </div>
                )
            }
        }
    ]

    const options: TableDropDownOptions = (selectedRows) => [
        {
            IF: Permissions.couponEdit,
            noWrap: true,
            name: (
                <ConfirmAlert
                    menuIcon={<StopCircle size={14} />}
                    onDropdown
                    eventId={`item-expire`}
                    text={FM('are-you-sure')}
                    title={FM('expire-selected-count', { count: selectedRows?.selectedCount })}
                    color='text-warning'
                    onClickYes={() => handleActions(null, selectedRows?.ids, 'expire', 'item-expire')}
                    onSuccessEvent={(e: any) => {
                        reloadData()
                    }}
                    className=''
                    id={`grid-expire-selected`}
                >
                    {FM('expire')} ({selectedRows?.selectedCount})
                </ConfirmAlert>
            )
        }
    ]

    return (
        <>
            <CouponFilter
                show={state?.couponFilter}
                filterData={state.filterData}
                setFilterData={(e: any) => setState({ filterData: e, page: 1 })}
                handleFilterModal={(e: boolean) => {
                    setState({
                        couponFilter: e,
                        search: null
                    })
                }}
            />
            <ModalCouponDetails
                edit={state.couponData}
                response={(e) => {
                    setState({
                        status: '1',
                        search: e
                    })
                }}
                showModal={state.show}
                setShowModal={(e: boolean) =>
                    setState({
                        show: e
                    })
                }
                noView
            />
            <Header icon={<Gift size='25' />} title={FM('coupons')}>
                <ButtonGroup>
                    <LoadingButton
                        loading={isLoading}
                        onClick={() =>
                            setState({
                                status: state?.status === '1' ? '3' : '1',
                                lastRefresh: new Date().getTime()
                            })
                        }
                        size='sm'
                        className='me-1'
                        color={state?.status === '1' ? 'danger' : 'success'}
                        tooltip={state?.status === '1' ? FM('expired-coupon') : FM('active-coupon')}
                    >
                        {state?.status === '1' ? <XCircle size='14' /> : <CheckCircle size='14' />}
                    </LoadingButton>
                </ButtonGroup>
                <ButtonGroup color='dark'>
                    <Show IF={Can(Permissions.couponAdd)}>
                        <TooltipLink
                            title={<>{FM('create-new')}</>}
                            to={getPath('store.coupon.create')}
                            className='btn btn-primary btn-sm'
                        >
                            <Plus size='14' />
                        </TooltipLink>
                    </Show>
                    <LoadingButton
                        loading={false}
                        onClick={() =>
                            setState({
                                couponFilter: true
                            })
                        }
                        size='sm'
                        color='secondary'
                        tooltip={FM('filter')}
                    >
                        <Sliders size='14' />
                    </LoadingButton>
                    <LoadingButton
                        loading={isLoading}
                        tooltip={FM('reload')}
                        size='sm'
                        color='dark'
                        onClick={() =>
                            setState({
                                lastRefresh: new Date().getTime(),
                                page: 1,
                                search: '',
                                filterData: null
                            })
                        }
                    >
                        <RefreshCcw size='14' />
                    </LoadingButton>
                </ButtonGroup>
            </Header>
            <CustomDataTable<CouponParamType>
                key={state.lastRefresh}
                initialPerPage={15}
                isLoading={isLoading}
                options={options}
                selectableRows={state?.status === '1'}
                columns={columns}
                paginatedData={data}
                handlePaginationAndSearch={handlePageChange}
            />
        </>
    )
}

export default Coupon
