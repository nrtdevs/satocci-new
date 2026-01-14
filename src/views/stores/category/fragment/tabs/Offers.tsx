/* eslint-disable prettier/prettier */
import { QueryStatus } from '@reduxjs/toolkit/dist/query'
import { Fragment, useContext, useEffect, useReducer } from 'react'
import { TableColumn } from 'react-data-table-component'
import { Activity, CheckCircle, Edit, MoreVertical, X } from 'react-feather'
import { useForm } from 'react-hook-form'
import {
    Alert,
    Badge,
    ButtonGroup,
    CardBody,
    Col,
    DropdownItem,
    Form,
    InputGroupText,
    Label,
    Row
} from 'reactstrap'
import {
    useActionProductOfferMutation,
    useCreateOrUpdateProductOfferMutation,
    useLoadProductOffersMutation
} from '../../../../../redux/RTKQuery/ProductRTK'
import {
    CategoryOfferTypes,
    IconSizes,
    ProductOfferTypes,
    UserType
} from '../../../../../utility/Const'
import Hide from '../../../../../utility/Hide'
import Show from '../../../../../utility/Show'
import {
    CF,
    addDay,
    createConstSelectOptions,
    emitAlertStatus,
    formatDate,
    truncateText
} from '../../../../../utility/Utils'
import { loadDropdown } from '../../../../../utility/apis/dropdowns'
import { ThemeColors } from '../../../../../utility/context/ThemeColors'
import ConfirmAlert from '../../../../../utility/helpers/ConfirmAlert'
import { FM, isValid, log } from '../../../../../utility/helpers/common'
import useUser from '../../../../../utility/hooks/useUser'
import useUserType from '../../../../../utility/hooks/useUserType'
import ApiEndpoints from '../../../../../utility/http/ApiEndpoints'
import { stateReducer } from '../../../../../utility/stateReducer'
import { ProductOfferType } from '../../../../ProductManagement/fragment/ProductForm'
import CustomDataTable, {
    TableDropDownOptions,
    TableFormData
} from '../../../../components/CustomDataTable/CustomDataTable'
import SimpleImageUpload from '../../../../components/SimpleImageUpload'
import LoadingButton from '../../../../components/buttons/LoadingButton'
import DropDownMenu from '../../../../components/dropdown'
import FormGroupCustom from '../../../../components/formGroupCustom/FormGroupCustom'
import { CategoryParamsType } from '../../CategoryAddForm'
import OffersActiveModal from './OffersActiveModal'
import { Permissions } from '../../../../../utility/Permissions'
type theProps = {
    addOffer?: boolean
    details?: CategoryParamsType
    closeForm: () => void

    loading?: boolean
}
interface States {
    page?: any
    offersActive?: boolean
    offerData?: any
    per_page_record?: any
    changeObject?: any
    search?: any
    reload?: any
    isRemoving?: boolean
    isReloading?: boolean
    isAddingNewData?: boolean
    transactionFilter?: boolean
    filterData?: CategoryParamsType | any
    lastRefresh?: any
}
const Offer = (props: theProps) => {
    const details = props?.details
    const { colors } = useContext(ThemeColors)

    // Local States
    const initState: States = {
        offerData: null,
        offersActive: false,
        page: 1,
        lastRefresh: new Date().getTime(),
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
    const reducers = stateReducer<States>
    const [state, setState] = useReducer(reducers, initState)
    const [createOffer, result] = useCreateOrUpdateProductOfferMutation()
    const [loadOffers, { data, isError, isLoading, isSuccess }] = useLoadProductOffersMutation()
    const [offerAction, offerResult] = useActionProductOfferMutation()
    // const canAddOffer = Can(Permissions.o)
    const userType = useUserType()
    const user = useUser()
    const loadOff = () => {
        loadOffers({
            jsonData: { category_id: details?.id },
            page: state?.page,
            per_page_record: state?.per_page_record
        })
    }

    useEffect(() => {
        if (details?.id) {
            loadOff()
        }
    }, [details?.id, state?.page, state?.per_page_record, state?.lastRefresh])

    const actionOffers = (action: string, ids: any, eventId?: any) => {
        offerAction({
            eventId,
            jsonData: { action, ids }
        })
    }

    useEffect(() => {
        if ((offerResult.status = QueryStatus.fulfilled) && offerResult?.isLoading === false) {
            if (offerResult?.isSuccess) {
                emitAlertStatus('success', null, `${offerResult?.originalArgs?.eventId}`)
            } else if (offerResult?.error) {
                emitAlertStatus('failed', null, `${offerResult?.originalArgs?.eventId}`)
            }
        }
    }, [offerResult])

    useEffect(() => {
        setState({
            page: 1
        })
    }, [state.per_page_record])
    const handlePageChange = (e: TableFormData) => {
        // log('state change', e)
        setState({ ...e })
    }
    const options: TableDropDownOptions = (selectedRows) => [
        {
            noWrap: true,
            name: (
                <DropdownItem
                    onClick={() => {
                        // handleSingleDelete(selectedRows?.ids)
                    }}
                    tag={'span'}
                    className='dropdown-item d-flex align-items-center'
                >
                    <>
                        <Activity size={16} className='me-1' />
                        {FM('expire')} ({selectedRows?.selectedCount})
                    </>
                </DropdownItem>
            )
        }
    ]

    const renderOffers = (type: any = null, value: any, currency: any) => {
        if (type !== null) {
            switch (type) {
                case ProductOfferTypes.percent:
                    return (
                        <>
                            {FM('x-percent-discount', {
                                percent: value?.offer_value,
                                price: '',
                                currency
                            })}
                        </>
                    )
                case ProductOfferTypes.amount:
                    return (
                        <>
                            {FM('x-flat-discount', {
                                flat: value?.offer_value,
                                price: ``,
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
                    return (
                        <>
                            {FM('buy-x-get-x-item', {
                                buy: value?.purchase_quantity,
                                get: value?.offered_product_id
                            })}{' '}
                        </>
                    )
                default:
                    return <>{''}</>
            }
        }
    }

    //is visible edit 

    //     const isVisibleEdit = (row: any) => {
    // let re = false
    // if(){

    // }
    //     }

    //is visible active

    //is visible inactive 

    const columns: TableColumn<ProductOfferType>[] = [
        {
            name: '#',
            maxWidth: '50px',
            cell: (row, index: any) => {
                // eslint-disable-next-line no-mixed-operators
                return parseInt(state?.per_page_record) * (state?.page - 1) + (index + 1)
            }
        },
        {
            name: <>{FM('offer')}</>,
            minWidth: '250px',
            //sortable: row => row.full_name,
            cell: (row) => (
                <div className='d-flex align-items-center'>
                    <div className='user-info text-truncate'>
                        {/* <Link
              state={{ row }}
              to={getPath('admin.stores.details', { id: row?.id })}
              className='d-block'
              id='create-button'
            > */}
                        <span className='d-block fw-bold text-truncate'>
                            {renderOffers(Number(row?.offer_type), row, row?.store_setting?.currency)}
                        </span>
                        {userType !== UserType?.Admin ? (
                            <small className='text-danger status-text'>
                                {row?.store_id === UserType.Admin ? `${FM('from-admin')}` : ''}
                            </small>
                        ) : (
                            ''
                        )}

                        {/* </Link> */}
                    </div>
                </div>
            )
        },
        {
            name: <>{FM('offer-valid-from')}</>,
            minWidth: '120px',
            cell: (row) => <span className=''>{formatDate(row?.offer_valid_from)}</span>
        },
        {
            name: <>{FM('offer-valid-till')}</>,
            minWidth: '120px',
            //   minWidth: '250px',
            cell: (row) => <span className=''>{formatDate(row?.offer_valid_to)}</span>
        },
        {
            name: <>{FM('Status')}</>,
            minWidth: '100px',
            cell: (row) => {
                return (
                    <>
                        {row?.status === 1 ? (
                            <Badge color={'light-success'} pill>
                                <>{FM('active')}</>
                            </Badge>
                        ) : (
                            <Badge color={'light-danger'} pill>
                                <>{FM('expired')}</>
                            </Badge>
                        )}
                    </>
                )
            }
        },

        // {
        //   name: <>{FM('action')}</>,
        //   allowOverflow: true,
        //   minWidth: '50px',
        //   cell: (row) => {
        //     return (
        //       <>
        //         {row?.status === 0 ? (
        //           <LoadingButton
        //             loading={result?.isLoading && state?.changeObject?.id === row?.id}
        //             size='sm'
        //             onClick={() =>
        //               setState({
        //                 // changeObject: { ...row, status: '1' }
        //                 offersActive: true,
        //                 offerData: { ...row, isActiveReq: true }
        //               })
        //             }
        //             color='primary'
        //           >
        //             {FM('activate')}
        //           </LoadingButton>
        //         ) : (
        //           <LoadingButton
        //             loading={result?.isLoading && state?.changeObject?.id === row?.id}
        //             size='sm'
        //             onClick={() =>
        //               setState({
        //                 changeObject: { ...row, status: '0' }
        //               })
        //             }
        //             color='danger'
        //           >
        //             {FM('expire')}
        //           </LoadingButton>
        //         )}
        //       </>
        //     )
        //   }
        // },
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
                                        userType === UserType.Store ||
                                        row?.store_id === UserType.Admin ||
                                        userType === UserType.Admin,
                                    icon: <Edit size={14} />,
                                    onClick: () => {
                                        setState({
                                            offersActive: true,
                                            offerData: { ...row, isProductOffer: false }
                                        })
                                    },
                                    name: FM('edit')
                                },
                                {
                                    IF:
                                        (row?.status === 4 && userType === UserType.Store) ||
                                        (row?.status === 4 && userType === UserType.Admin) ||
                                        (row?.status === 4 && userType === UserType.AdminEmployee),
                                    icon: <CheckCircle size={14} />,
                                    onClick: () => {
                                        setState({
                                            offersActive: true,
                                            offerData: { ...row, isActiveReq: true }
                                        })
                                    },
                                    name: FM('activate')
                                },
                                // {
                                //   IF:
                                //     row?.status === 1 &&
                                //     ((row?.store_id !== UserType.Admin && userType === UserType.Store) ||
                                //       (row?.store_id === UserType.Admin &&
                                //         (userType === UserType.Admin || user?.store_id === UserType.Admin))),
                                //   icon: <StopCircle size={14} />,

                                //   onClick: () =>
                                //     setState({
                                //       changeObject: { ...row, status: '0' }
                                //     }),
                                //   name: FM('expire')
                                // },
                                {
                                    IF:
                                        (row?.status === 1 && userType === UserType.Admin) ||
                                        (row?.status === 1 && userType === UserType.AdminEmployee) ||
                                        (row?.status === 1 && userType === UserType.Store),
                                    noWrap: true,
                                    name: (
                                        <ConfirmAlert
                                            menuIcon={<X size={14} />}
                                            onDropdown
                                            eventId={`item-expire-${row?.id}`}
                                            text={FM('are-you-sure')}
                                            title={FM('expire-selected-count', {
                                                count: row?.id
                                            })}
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
                                // {
                                //   noWrap: true,
                                //   name: (
                                //     <ConfirmAlert
                                //       menuIcon={<Trash2 size={14} />}
                                //       onDropdown
                                //       eventId={`delete-item-${row?.id}`}
                                //       item={row}
                                //       title={row?.name}
                                //       color='text-warning'
                                //       text={FM('are-you-sure')}
                                //       onClickYes={() => handleDelete(row?.id, null)}
                                //       onSuccessEvent={(e: any) => {
                                //         loadProducts()
                                //       }}
                                //       className=''
                                //       id={`grid-delete-${row?.id}`}
                                //     >
                                //       {FM('move-to-trash')}
                                //     </ConfirmAlert>
                                //   )
                                // }
                            ]}
                        />
                    </div>
                )
            }
        }
    ]
    const form = useForm<ProductOfferType>()
    const { handleSubmit, control, reset, setValue, watch } = form

    log('details', details)
    const onSubmit = (d: ProductOfferType) => {
        // log('offers', d)
        if (details?.id) {
            createOffer({
                // ...details,
                ...d,
                store_id: userType === UserType.Store ? user?.store_id : d?.store_id?.value,
                offer_type: d?.offer_type?.value,
                purchase_quantity: d?.purchase_quantity ?? 1,
                category_id: [details?.id],
                status: 1
            })
        }
    }

    useEffect(() => {
        if (state?.changeObject) {
            createOffer({
                ...state?.changeObject
            })
        }
    }, [state?.changeObject])

    useEffect(() => {
        if (result.isSuccess) {
            props?.closeForm()

            reset()
            setState({ page: 1, lastRefresh: new Date().getTime() })
        }
    }, [result])
    useEffect(() => {
        if (isValid(watch('offer_valid_from')) && isValid(watch('offer_valid_to'))) {
            if (new Date(watch('offer_valid_from')) > new Date(watch('offer_valid_to'))) {
                setValue('offer_valid_to', null)
            }
        }
    }, [watch('offer_valid_from'), watch('offer_valid_to')])

    const renderOfferText = () => {
        switch (watch('offer_type')?.value) {
            case ProductOfferTypes.amount:
                return (
                    <Fragment>
                        <Alert color='danger' className='mt-1'>
                            <div className='alert-body'>
                                {FM('offer-type-amount-description', {
                                    discount: CF({
                                        money: watch('offer_value') ?? 0,
                                        currency:
                                            userType === UserType.Store
                                                ? user?.currency
                                                : watch('store_id')?.extra?.currency
                                    })
                                })}
                            </div>
                        </Alert>
                        <Alert color='danger' className='mt-1'>
                            <div className='alert-body'>
                                {FM('this-offer-activate-only-if-no-existing-offers-available')}
                            </div>
                        </Alert>
                        <Alert color='danger' className='mt-1'>
                            <div className='alert-body'>{FM('offer-applied-every-00.001')}</div>
                        </Alert>
                    </Fragment>
                )
            case ProductOfferTypes.percent:
                return (
                    <Fragment>
                        <Alert color='danger' className='mt-1'>
                            <div className='alert-body'>
                                {FM('offer-type-percentage-description', { discount: watch('offer_value') ?? 0 })}
                            </div>
                        </Alert>
                        <Alert color='danger' className='mt-1'>
                            <div className='alert-body'>
                                {FM('this-offer-activate-only-if-no-existing-offers-available')}
                            </div>
                        </Alert>
                        <Alert color='danger' className='mt-1'>
                            <div className='alert-body'>{FM('offer-applied-every-00.001')}</div>
                        </Alert>
                    </Fragment>
                )
            case ProductOfferTypes.same_quantity_on_quantity:
                return (
                    <Fragment>
                        <Alert color='danger' className='mt-1'>
                            <div className='alert-body'>
                                {FM('offer-type-buy-x-get-x-free-description', {
                                    buy: watch('purchase_quantity'),
                                    price: '',
                                    get: watch('offer_value') ?? 0
                                })}
                            </div>
                        </Alert>
                    </Fragment>
                )
            case ProductOfferTypes.same_quantity_on_percent:
                return (
                    <Fragment>
                        <Alert color='danger' className='mt-1'>
                            <div className='alert-body'>
                                {FM('offer-type-buy-x-get-x-description', {
                                    buy: watch('purchase_quantity'),
                                    price: watch('offer_value') ?? 0
                                })}
                            </div>
                        </Alert>
                    </Fragment>
                )
            case ProductOfferTypes.diff_quantity_on_quantity:
                return (
                    <Fragment>
                        <Alert color='danger' className='mt-1'>
                            <div className='alert-body'>
                                {FM('offer-type-buy-x-get-item-description', {
                                    buy: watch('purchase_quantity'),
                                    price:
                                        CF({
                                            money: watch('offered_product_discount'),
                                            currency:
                                                userType === UserType.Store
                                                    ? user?.currency
                                                    : watch('store_id')?.extra?.currency
                                        }) ?? 0,
                                    item: truncateText(watch('offered_product_variant_id')?.extra?.name, 30)
                                })}
                            </div>
                        </Alert>
                    </Fragment>
                )
            default:
                return null
        }
    }

    useEffect(() => {
        if (props?.addOffer === false) {
            reset()
        }
    }, [props?.addOffer])
    return (
        <Fragment>
            <OffersActiveModal
                showModal={state?.offersActive}
                response={() => {
                    setState({
                        lastRefresh: new Date().getTime()
                    })
                }}
                setShowModal={(e: boolean) => {
                    setState({
                        offersActive: e
                        // lastRefresh: new Date().getTime()
                    })
                }}
                noView
                edit={state?.offerData}
            />
            <Show IF={props?.addOffer ?? false}>
                <>
                    <div className='shadow rounded m-1'>
                        <Form onSubmit={handleSubmit(onSubmit)}>
                            <CardBody>
                                <Row className='g-0 mb-50'>
                                    <Col md='2'>
                                        <Row>
                                            <Col md='12' className=''>
                                                <Label>{FM('offer-image')}</Label>
                                                <SimpleImageUpload
                                                    params={{ for: 'offer' }}
                                                    value={watch('offer_image')}
                                                    name={`offer_image`}
                                                    setValue={setValue}
                                                />
                                            </Col>
                                        </Row>
                                    </Col>
                                    <Col md='8' className='d-flex align-item-center justify-content-end ms-1'>
                                        <Row className='g-1'>
                                            <Show IF={userType === UserType.Admin || user?.store_id === UserType.Admin}>
                                                <Col md='6'>
                                                    <FormGroupCustom
                                                        label={FM('store')}
                                                        placeholder={FM('select-store')}
                                                        async
                                                        searchItem={'search'}
                                                        path={ApiEndpoints.load_stores}
                                                        selectLabel='name'
                                                        selectValue={'id'}
                                                        modifyDropdownData={(d: any) => {
                                                            return {
                                                                ...d,
                                                                name: `${d?.name} / (${d?.store_setting?.store_name ?? d?.store_setting?.store_name
                                                                    })`
                                                            }
                                                        }}
                                                        defaultOptions
                                                        loadOptions={loadDropdown}
                                                        name={`store_id`}
                                                        type={'select'}
                                                        className=''
                                                        control={control}
                                                        rules={{ required: true }}
                                                    // prepend={<InputGroupText>{FM('get')}</InputGroupText>}
                                                    // append={<InputGroupText>{FM('item')}</InputGroupText>}
                                                    />
                                                </Col>
                                            </Show>

                                            <Col md='6'>
                                                <FormGroupCustom
                                                    label={FM('discount-type')}
                                                    placeholder={FM('discount-type')}
                                                    //   noLabel
                                                    name={`offer_type`}
                                                    type={'select'}
                                                    selectOptions={createConstSelectOptions(CategoryOfferTypes, FM)}
                                                    className='mb-0'
                                                    control={control}
                                                    rules={{ required: true }}
                                                />
                                            </Col>
                                            <Show
                                                IF={
                                                    watch(`offer_type`)?.value ===
                                                    ProductOfferTypes?.same_quantity_on_quantity ||
                                                    watch(`offer_type`)?.value ===
                                                    ProductOfferTypes?.diff_quantity_on_quantity ||
                                                    watch(`offer_type`)?.value === ProductOfferTypes?.same_quantity_on_percent
                                                }
                                            >
                                                <Fragment>
                                                    <Col md='6'>
                                                        <FormGroupCustom
                                                            placeholder={FM('purchase-quantity')}
                                                            label={FM('purchase-quantity')}
                                                            //   noLabel
                                                            name={`purchase_quantity`}
                                                            type={'number'}
                                                            className='mb-0'
                                                            control={control}
                                                            rules={{ required: true }}
                                                            prepend={<InputGroupText>{FM('buy')}</InputGroupText>}
                                                        />
                                                    </Col>
                                                </Fragment>
                                            </Show>
                                            <Show
                                                IF={
                                                    watch(`offer_type`)?.value ===
                                                    ProductOfferTypes?.diff_quantity_on_quantity
                                                }
                                            >
                                                <Fragment>
                                                    <Col md='6'>
                                                        <FormGroupCustom
                                                            label={FM('product')}
                                                            placeholder={FM('product')}
                                                            //   noLabel
                                                            async
                                                            path={ApiEndpoints.load_product}
                                                            selectLabel='name'
                                                            selectValue={'id'}
                                                            defaultOptions
                                                            loadOptions={loadDropdown}
                                                            name={`offered_product_id`}
                                                            type={'select'}
                                                            className='mb-0'
                                                            control={control}
                                                            rules={{ required: true }}
                                                        //   prepend={<InputGroupText>{FM('get')}</InputGroupText>}
                                                        //   append={<InputGroupText>{FM('item')}</InputGroupText>}
                                                        />
                                                    </Col>
                                                </Fragment>
                                            </Show>
                                            <Hide
                                                IF={
                                                    watch(`offer_type`)?.value ===
                                                    ProductOfferTypes?.diff_quantity_on_quantity
                                                }
                                            >
                                                <Col md='6'>
                                                    <FormGroupCustom
                                                        placeholder={FM('discount-value')}
                                                        label={FM('discount-value')}
                                                        // noLabel
                                                        name={`offer_value`}
                                                        type={'number'}
                                                        className='mb-0'
                                                        control={control}
                                                        rules={{ required: true }}
                                                        prepend={
                                                            watch(`offer_type`)?.value ===
                                                                ProductOfferTypes?.same_quantity_on_quantity ||
                                                                watch(`offer_type`)?.value ===
                                                                ProductOfferTypes?.same_quantity_on_percent ? (
                                                                <InputGroupText>{FM('get')}</InputGroupText>
                                                            ) : null
                                                        }
                                                        append={
                                                            watch(`offer_type`)?.value === ProductOfferTypes?.percent ||
                                                                watch(`offer_type`)?.value ===
                                                                ProductOfferTypes?.same_quantity_on_percent ? (
                                                                <InputGroupText>%</InputGroupText>
                                                            ) : watch(`offer_type`)?.value ===
                                                                ProductOfferTypes?.same_quantity_on_quantity ? (
                                                                <InputGroupText>{FM('free')}</InputGroupText>
                                                            ) : null
                                                        }
                                                    />
                                                </Col>
                                            </Hide>
                                            <Show
                                                IF={
                                                    watch(`offer_type`)?.value ===
                                                    ProductOfferTypes?.diff_quantity_on_quantity
                                                }
                                            >
                                                <Col md='6'>
                                                    <FormGroupCustom
                                                        placeholder={FM('price-of-the-product')}
                                                        label={FM('price-of-the-product')}
                                                        name={`offered_product_discount`}
                                                        type={'number'}
                                                        className='mb-0'
                                                        control={control}
                                                        rules={{ required: false }}
                                                    />
                                                </Col>
                                            </Show>
                                            <Col md='6'>
                                                <FormGroupCustom
                                                    placeholder={FM('offer-valid-from')}
                                                    label={FM('offer-valid-from')}
                                                    //   noLabel
                                                    name={`offer_valid_from`}
                                                    type={'date'}
                                                    datePickerOptions={{
                                                        minDate: formatDate(new Date(addDay(new Date(), 1)))
                                                    }}
                                                    className='mb-0'
                                                    control={control}
                                                    rules={{ required: true }}
                                                />
                                            </Col>
                                            <Col md='6'>
                                                <FormGroupCustom
                                                    placeholder={FM('offer-valid-till')}
                                                    label={FM('offer-valid-till')}
                                                    //   noLabel
                                                    name={`offer_valid_to`}
                                                    type={'date'}
                                                    datePickerOptions={{
                                                        minDate: formatDate(watch(`offer_valid_from`))
                                                    }}
                                                    className='mb-0'
                                                    control={control}
                                                    rules={{ required: true }}
                                                />
                                            </Col>
                                        </Row>
                                    </Col>
                                </Row>
                                {renderOfferText()}
                                <ButtonGroup className=''>
                                    <LoadingButton type='submit' color='primary' loading={result?.isLoading}>
                                        {FM('save')}
                                    </LoadingButton>
                                </ButtonGroup>
                            </CardBody>
                        </Form>
                    </div>
                </>
            </Show>
            <CustomDataTable<ProductOfferType>
                key={state.lastRefresh}
                initialPerPage={15}
                isLoading={props?.loading}
                isFetching={isLoading}
                options={options}
                hideHeader
                // selectableRows
                columns={columns}
                paginatedData={data}
                // tableData={details?.product_offers}
                handlePaginationAndSearch={handlePageChange}
            />
        </Fragment>
    )
}

export default Offer
