/* eslint-disable prettier/prettier */
/* eslint-disable eqeqeq */
import { useContext, useEffect, useReducer } from 'react'

import { CheckCircle, Edit, Gift, MoreVertical, RefreshCcw, Trash2, X } from 'react-feather'
import { Badge, ButtonGroup, Col, Row } from 'reactstrap'
import { ThemeColors } from '../../../utility/context/ThemeColors'

import { useLocation } from 'react-router-dom'

import { IconSizes, ProductOfferTypes, UserType } from '../../../utility/Const'
import { FM, log } from '../../../utility/helpers/common'
import { stateReducer } from '../../../utility/stateReducer'
import CustomDataTable, {
    TableDropDownOptions
} from '../../components/CustomDataTable/CustomDataTable'
import DropDownMenu from '../../components/dropdown'
import Header from '../../components/header'

import { QueryStatus } from '@reduxjs/toolkit/dist/query'
import { TableColumn } from 'react-data-table-component'
import { useDispatch } from 'react-redux'
import {
    useActionProductOfferMutation,
    useLoadProductByMutationMutation,
    useLoadProductOffersMutation
} from '../../../redux/RTKQuery/ProductRTK'
import FormGroupCustom from '../../components/formGroupCustom/FormGroupCustom'
import { emitAlertStatus, formatDate } from '../../../utility/Utils'
import ConfirmAlert from '../../../utility/helpers/ConfirmAlert'
import useUser from '../../../utility/hooks/useUser'
import useUserType from '../../../utility/hooks/useUserType'
import {
    ProductOfferType,
    ProductParamType,
    ProductVariantsType
} from '../../ProductManagement/fragment/ProductForm'
import LoadingButton from '../../components/buttons/LoadingButton'
import ApiEndpoints from '../../../utility/http/ApiEndpoints'
import { loadDropdown } from '../../../utility/apis/dropdowns'
import { useForm } from 'react-hook-form'
import OffersActiveModal from '../category/fragment/tabs/OffersActiveModal'
import { store } from '../../../redux/store'

type theProps = {
    addOffer?: boolean
    details?: ProductVariantsType
    loading?: boolean
}

interface States {
    offersActive?: boolean
    offerData?: any
    page?: any
    per_page_record?: any
    changeObject?: any
    lastRefresh?: any
    search?: any
    reload?: any
    isRemoving?: boolean
    isReloading?: boolean
    isAddingNewData?: boolean
    transactionFilter?: boolean
    filterData?: ProductParamType | any
}
const Offers = (props: theProps) => {
    const dispatch = useDispatch()

    const { colors } = useContext(ThemeColors)
    // Local States
    const initState: States = {
        lastRefresh: new Date().getTime(),
        offersActive: false,
        offerData: null,
        page: 1,
        per_page_record: 15,
        changeObject: null,
        transactionFilter: false,
        filterData: {
            name: null,
            email: null,
            subscription_terms_select_value: null,
            status: null
        },
        search: undefined,
        isRemoving: false,
        isReloading: false,
        isAddingNewData: false
    }

    const location: any = useLocation()
    const user = useUser()
    const userType = useUserType()
    const reducers = stateReducer<States>
    const [state, setState] = useReducer(reducers, initState)

    const [offerAction, offerResult] = useActionProductOfferMutation()
    const [loadOffers, { data, isError, isLoading, isSuccess }] = useLoadProductOffersMutation()
    const form = useForm<any>()
    const { handleSubmit, control, reset, setValue, watch, clearErrors, resetField } = form

    const details = form?.watch('product_variant_id')?.extra
    const currency = details?.product?.store?.currency

    const renderLoadOffer = data?.payload?.data as any

    // log('renderLoadOffer', renderLoadOffer)

    const loadOffer = () => {
        loadOffers({
            jsonData: { product_variant_id: form?.watch('product_variant_id')?.value },
            page: state?.page,
            per_page_record: state?.per_page_record
        })
    }

    // log('Details', form?.watch('product_variant_id'))

    const actionOffers = (action: string, ids: any, eventId?: any) => {
        offerAction({
            eventId,
            jsonData: { action, ids }
        })
    }

    useEffect(() => {
        loadOffer()
    }, [
        details?.id,
        state?.page,
        state?.per_page_record,
        state.lastRefresh,
        form?.watch('product_variant_id')
    ])

    useEffect(() => {
        setState({
            page: 1
        })
    }, [state.per_page_record])

    useEffect(() => {
        if ((offerResult.status = QueryStatus.fulfilled) && offerResult?.isLoading === false) {
            if (offerResult?.isSuccess) {
                emitAlertStatus('success', null, `${offerResult?.originalArgs?.eventId}`)
            } else if (offerResult?.error) {
                emitAlertStatus('failed', null, `${offerResult?.originalArgs?.eventId}`)
            }
        }
    }, [offerResult])

    const handlePageChange = (e: any) => {
        setState({ ...e })
    }

    const reloadData = () => {
        setState({
            lastRefresh: new Date().getTime(),
            page: 1
        })
    }

    const options: TableDropDownOptions = (selectedRows) => [
        {
            noWrap: true,
            name: (
                <ConfirmAlert
                    menuIcon={<Trash2 size={14} />}
                    onDropdown
                    eventId={`expire-item-selected`}
                    title={FM('expire-selected-count', { count: selectedRows?.selectedCount })}
                    color='text-warning'
                    text={FM('are-you-sure')}
                    onClickYes={() => actionOffers('expire', selectedRows?.ids, `expire-item-selected`)}
                    onSuccessEvent={(e: any) => {
                        setState({ page: 1, lastRefresh: new Date()?.getTime() })
                    }}
                    className=''
                    id={`grid-delete`}
                >
                    {FM('expire')}
                </ConfirmAlert>
            )
        }
    ]

    const renderOffers = (type: any = null, value: any) => {
        if (type !== null) {
            switch (type) {
                case ProductOfferTypes.percent:
                    return (
                        <>
                            {FM('x-percent-discount', {
                                percent: value?.offer_value,
                                price: `${details?.selling_price}kr`,
                                currency
                            })}
                        </>
                    )
                case ProductOfferTypes.amount:
                    return (
                        <>
                            {FM('x-flat-discount', {
                                flat: value?.offer_value,
                                price: `${details?.selling_price}${currency}`,
                                currency
                            })}
                        </>
                    )
                case ProductOfferTypes.same_quantity_on_percent:
                    return (
                        <>
                            {FM('buy-x-get-x-discount', {
                                buy: value?.purchase_quantity,
                                get: value?.offer_value
                            })}
                        </>
                    )
                case ProductOfferTypes.same_quantity_on_quantity:
                    return (
                        <>
                            {FM('buy-x-get-x-free', {
                                buy: value?.purchase_quantity,
                                get: value?.offer_value
                            })}{' '}
                        </>
                    )
                case ProductOfferTypes.diff_quantity_on_quantity:
                    if (value?.offered_product_discount <= 0) {
                        return (
                            <>
                                {FM('buy-x-get-x-item-free', {
                                    buy: value?.purchase_quantity,
                                    get: value?.offered_product_variant?.name
                                })}{' '}
                            </>
                        )
                    } else {
                        return (
                            <>
                                {FM('buy-x-get-x-item', {
                                    buy: value?.purchase_quantity,
                                    get: value?.offered_product_variant?.name,
                                    price: value?.offered_product_discount
                                })}{' '}
                            </>
                        )
                    }
                default:
                    return <>{''}</>
            }
        }
    }

    const renderOffersDirect = (type: any = null, value: any) => {
        if (type !== null) {
            switch (type) {
                case ProductOfferTypes.percent:
                    return (
                        <>
                            {FM('x-percent-discount', {
                                percent: value?.offer_value,
                                price: `${value?.product_variant?.selling_price ?? 0}kr`,
                                currency: value?.store_setting?.currency
                            })}
                        </>
                    )
                case ProductOfferTypes.amount:
                    return (
                        <>
                            {FM('x-flat-discount', {
                                flat: value?.offer_value,
                                price: `${value?.product_variant?.selling_price ?? 0}${value?.store_setting?.currency
                                    }`,
                                currency: value?.store_setting?.currency
                            })}
                        </>
                    )
                case ProductOfferTypes.same_quantity_on_percent:
                    return (
                        <>
                            {FM('buy-x-get-x-discount', {
                                buy: value?.purchase_quantity,
                                get: value?.offer_value
                            })}
                        </>
                    )
                case ProductOfferTypes.same_quantity_on_quantity:
                    return (
                        <>
                            {FM('buy-x-get-x-free', {
                                buy: value?.purchase_quantity,
                                get: value?.offer_value
                            })}{' '}
                        </>
                    )
                case ProductOfferTypes.diff_quantity_on_quantity:
                    if (value?.offered_product_discount <= 0) {
                        return (
                            <>
                                {FM('buy-x-get-x-item-free', {
                                    buy: value?.purchase_quantity,
                                    get: value?.offered_product_variant?.name
                                })}{' '}
                            </>
                        )
                    } else {
                        return (
                            <>
                                {FM('buy-x-get-x-item', {
                                    buy: value?.purchase_quantity,
                                    get: value?.offered_product_variant?.name,
                                    price: value?.offered_product_discount
                                })}{' '}
                            </>
                        )
                    }
                default:
                    return <>{''}</>
            }
        }
    }

    const columns: TableColumn<ProductOfferType>[] = [
        {
            name: '#',
            maxWidth: '70px',
            minWidth: '30px',
            cell: (row, index: any) => {
                // eslint-disable-next-line no-mixed-operators
                return parseInt(state?.per_page_record) * (state?.page - 1) + (index + 1)
            }
        },
        {
            name: <>{FM('offer')}</>,
            minWidth: '300px',
            //sortable: row => row.full_name,
            cell: (row) => (
                <div className='d-flex align-items-center'>
                    <div className='user-info'>
                        <span className='d-block fw-bold'>
                            {details
                                ? renderOffers(Number(row?.offer_type), row)
                                : renderOffersDirect(Number(row?.offer_type), row)}
                        </span>
                    </div>
                </div>
            )
        },
        {
            name: <>{FM('product')}</>,
            minWidth: '150px',
            //sortable: row => row.full_name,
            cell: (row) => <span className=''>{row?.product_variant?.product?.name}</span>
        },
        {
            name: <>{FM('product-variant')}</>,
            minWidth: '150px',
            //sortable: row => row.full_name,
            cell: (row) => <span className=''>{row?.product_variant?.name}</span>
        },
        {
            name: <>{FM('offer-valid-from')}</>,
            minWidth: '120px',
            //sortable: row => row.full_name,
            cell: (row) => <span className=''>{formatDate(row?.offer_valid_from)}</span>
        },
        {
            name: <>{FM('offer-valid-till')}</>,
            minWidth: '120px',

            cell: (row) => <span className=''>{formatDate(row?.offer_valid_to)}</span>
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
                        <DropDownMenu
                            direction='down'
                            component={<MoreVertical color={colors.primary.main} size={IconSizes.MenuVertical} />}
                            options={[
                                {
                                    IF:
                                        row?.store_id === user?.store_id ||
                                        userType === UserType.Admin ||
                                        user?.store_id === UserType.Admin,
                                    icon: <Edit size={14} />,
                                    onClick: () => {
                                        setState({
                                            offersActive: true,
                                            offerData: { ...row, isProductOffer: true }
                                        })
                                    },
                                    name: FM('edit')
                                },
                                {
                                    IF: row?.status === 0 || row?.status === 4,
                                    icon: <CheckCircle size={14} />,
                                    onClick: () => {
                                        setState({
                                            offersActive: true,
                                            offerData: { ...row, isActiveReq: true }
                                        })
                                    },
                                    name: FM('activate')
                                },

                                {
                                    IF: row?.status === 1,
                                    noWrap: true,
                                    name: (
                                        <ConfirmAlert
                                            menuIcon={<X size={14} />}
                                            onDropdown
                                            eventId={`item-expire-${row?.id}`}
                                            text={FM('are-you-sure')}
                                            color='text-warning'
                                            onClickYes={
                                                () => actionOffers('expire', [row?.id], `item-expire-${row?.id}`)
                                                // handleActions(null, [row?.id], 'inactive', `item-inactive-${row?.id}`)
                                            }
                                            onSuccessEvent={(e: any) => {
                                                // reloadData()
                                                setState({
                                                    lastRefresh: new Date().getTime()
                                                })
                                            }}
                                            className=''
                                            id={`item-expire-${row?.id}`}
                                        >
                                            {FM('expire')}
                                        </ConfirmAlert>
                                    )
                                }
                            ]}
                        />
                    </div>
                )
            }
        }
    ]

    return (
        <>
            <OffersActiveModal
                edit={state?.offerData}
                variantData={details}
                showModal={state.offersActive}
                setShowModal={(e: boolean) =>
                    setState({ offersActive: e, lastRefresh: new Date().getTime() })
                }
                noView
            />
            <Header icon={<Gift size='25' />} title={FM('offers')}>
                <FormGroupCustom
                    label={FM('product')}
                    placeholder={FM('product')}
                    noLabel
                    noGroup
                    async
                    path={ApiEndpoints.load_product}
                    selectLabel='name'
                    selectValue={'id'}
                    defaultOptions
                    loadOptions={loadDropdown}
                    jsonData={{
                        product_type: '1'
                    }}
                    name={`product_id`}
                    type={'select'}
                    className='flex-grow-1 me-1'
                    control={control}
                    rules={{ required: true }}
                />

                <FormGroupCustom
                    key={watch('product_id')?.value ?? details?.id}
                    label={FM('product-variant')}
                    placeholder={FM('product-variant')}
                    noLabel
                    noGroup
                    isDisabled={!watch('product_id')?.value}
                    async
                    path={`${ApiEndpoints.load_product_variant}${watch('product_id')?.value ?? details?.product_id
                        }`}
                    selectLabel='name'
                    selectValue={'id'}
                    jsonData={{
                        // store_id: user?.store_id
                        product_type: '1'
                    }}
                    defaultOptions
                    loadOptions={loadDropdown}
                    name={`product_variant_id`}
                    type={'select'}
                    className='flex-grow-1 me-1'
                    control={control}
                    rules={{ required: true }}
                />

                <ButtonGroup color='dark'>
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
            <CustomDataTable<ProductOfferType>
                key={state.lastRefresh}
                initialPerPage={15}
                isLoading={isLoading ?? props?.loading}
                selectableRowDisabled={(row) => {
                    if (row?.status === 0 || row?.status === 4) {
                        return true
                    } else {
                        return false
                    }
                }}
                options={options}
                selectableRows
                hideSearch
                columns={columns}
                paginatedData={data}
                // tableData={details?.product_offers}
                handlePaginationAndSearch={handlePageChange}
            />
        </>
    )
}

export default Offers
