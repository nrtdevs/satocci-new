/* eslint-disable prettier/prettier */
import { useEffect, useReducer, useState } from 'react'
import { set, useFieldArray, useForm } from 'react-hook-form'
import { Col, InputGroupText, Row } from 'reactstrap'
import {
    useActionReturnMutation,
    useCreateOrUpdateReturnMutation,
    useGetAmountReturnMutation
} from '../../../redux/RTKQuery/ReturnOrderRTK'
import { Permissions } from '../../../utility/Permissions'
import Show, { Can } from '../../../utility/Show'
import { SuccessToast, amtFormat, fillObject, setValues } from '../../../utility/Utils'
import { ExportOrders, ExportOrdersWithProduct } from '../../../utility/apis/ExportLanguage'
import { loadDropdown } from '../../../utility/apis/dropdowns'
import { FM, isValid, isValidArray, isValidUrl, log } from '../../../utility/helpers/common'
import useUser from '../../../utility/hooks/useUser'
import ApiEndpoints from '../../../utility/http/ApiEndpoints'
import httpConfig from '../../../utility/http/httpConfig'
import { stateReducer } from '../../../utility/stateReducer'
import FormGroupCustom from '../../components/formGroupCustom/FormGroupCustom'
import CenteredModal from '../../components/modal/CenteredModal'
import SideModal from '../../components/sideModal/sideModal'
import BsTooltip from '../../components/tooltip'
import { StoreParamsType } from '../../stores/fragment/AddUpdateForm'
import Hide from '../../../utility/Hide'

interface States {
    lastRefresh?: any
    category?: any
    subcategory?: any
    language?: any
    loading?: boolean
    languageList?: any
    active?: any
    page?: any
    per_page_record?: any
    search?: any
}

interface propsType {
    userType?: any
    show?: boolean
    showCenter?: boolean
    showCenterAction?: boolean
    handleFilterModal?: any
    handleFilterModalCenter?: any
    handleFilterModalCenterAction?: any
    handleFilterModalCenterActionClose?: any
    exportType?: string
    setFilterData?: any
    filterData?: any
    orderData?: any
    refreshData?: any
    returnData?: any
}
const TransactionFilter = ({
    userType = null,
    exportType = 'filter',
    show = false,
    showCenter = false,
    showCenterAction = false,
    handleFilterModal = () => { },
    handleFilterModalCenter = () => { },
    handleFilterModalCenterAction = () => { },
    handleFilterModalCenterActionClose = () => { },
    setFilterData = {},
    filterData = {},
    orderData = null,
    returnData = null
}: propsType) => {
    const {
        register,
        formState: { errors },
        handleSubmit,
        setValue,
        control,
        getValues,
        watch,
        reset
    } = useForm<StoreParamsType>()

    const initState: States = {
        lastRefresh: new Date().getTime(),
        category: [],
        subcategory: [],
        language: null,
        loading: false,
        languageList: [],
        active: '1',
        page: 1,
        per_page_record: 100,
        search: undefined
    }
    const reducers = stateReducer<States>
    const [state, setState] = useReducer(reducers, initState)
    const [open, setOpen] = useState(show)
    const [openCenter, setOpenCenter] = useState(showCenter)
    const [openCenterAction, setOpenCenterAction] = useState(showCenterAction)
    const [loadingSample, setLoadingSample] = useState(false)
    const [orderDataRes, setOrderDataRes] = useState<any>()
    const user = useUser()

    const [createReturn, result] = useCreateOrUpdateReturnMutation()
    const [getAmount, res] = useGetAmountReturnMutation()
    const [returnAction, returnResult] = useActionReturnMutation()

    console.log('returnData', returnData)

    const [formData, setFormData] = useState({
        order_id: '',
        reason_for_return: '',
        return_items: [] as any[]
    })

    const submitReturn = (d: any) => {
        const returnItems: any[] = []

        d?.order?.map((item: any) => {
            if (!item?.allows_return) return null
            returnItems.push({
                order_detail_id: item?.id,
                return_quantity: item?.return_quantity
            })
        })

        const returnPayload: any = {
            order_id: orderDataRes?.id,
            reason_for_return: d?.reason_for_return,
            return_items: returnItems
        }

        // **3. Call createReturn mutation:**
        createReturn(returnPayload)
    }

    const submitReturnAction = (d: any) => {
        log('d', d)
        const returnItems: any[] = []

        d?.order?.map((item: any) => {
            log('itemSSSSSSS', item)
            returnItems.push({
                order_detail_id: item?.id,
                return_quantity: item?.return_quantity
            })
        })

        let returnPayload = {}
        if (isValid(d?.action)) {
            returnPayload = {
                order_return_id: returnData?.id,
                action: '2',
                return_items: returnItems
            }
        } else {
            returnPayload = {
                order_return_id: returnData?.id,
                reason_for_return_rejection: d?.reason_for_return_rejection,
                action: '3'
            }
        }

        // **3. Call createReturn mutation:**
        returnAction(returnPayload)
    }

    useEffect(() => {
        setOrderDataRes(orderData)
    }, [orderData, watch('order')])

    const submitFilter = (d: any) => {
        const ExpData = {
            order_number: d?.order_number ? d?.order_number : null,

            from_date: d?.start_date ? d?.start_date : null,
            to_date: d?.end_date ? d?.end_date : null
        }

        if (exportType === 'ordersDetails') {
            ExportOrdersWithProduct({
                jsonData: {
                    ...ExpData,
                    product_id: d?.product_id?.value ? d?.product_id?.value : null
                },
                loading: setLoadingSample,
                success: (e: any) => {
                    setFilterData({
                        ...d,
                        product_id: d?.product_id?.value ? d?.product_id?.value : null,
                        order_number: d?.order_number,
                        status: d?.status?.value,
                        start_date: d?.start_date,
                        end_date: d?.end_date,
                        paid_amount: amtFormat(d?.paid_amount)
                    })
                    if (isValidUrl(e?.payload?.url)) {
                        window.open(e?.payload?.url, '_blank')
                    } else {
                        window.open(`${httpConfig.baseUrl2}${e?.payload?.url}`, '_blank')
                    }
                    //  window.open(`${httpConfig.baseUrl2}${e?.payload?.url}`, '_blank')
                }
            })
        } else if (exportType === 'onlyOrders') {
            ExportOrders({
                jsonData: ExpData,
                loading: setLoadingSample,
                success: (e: any) => {
                    setFilterData({
                        ...d,
                        order_number: d?.order_number,
                        status: d?.status?.value,
                        start_date: d?.start_date,
                        end_date: d?.end_date,
                        paid_amount: amtFormat(d?.paid_amount)
                    })
                    if (isValidUrl(e?.payload?.url)) {
                        window.open(e?.payload?.url, '_blank')

                    } else {
                        window.open(`${httpConfig.baseUrl2}${e?.payload?.url}`, '_blank')
                    }
                    //window.open(`${httpConfig.baseUrl2}${e?.payload?.url}`, '_blank')
                }
            })
        } else {
            setFilterData({
                ...d,
                order_number: d?.order_number,
                status: d?.status?.value,
                start_date: d?.start_date,
                end_date: d?.end_date,
                paid_amount: amtFormat(d?.paid_amount)
            })
        }
    }

    // Show/Hide Modal
    useEffect(() => {
        if (show) setOpen(true)
        if (!show) reset()
    }, [show])

    // Show/Hide Modal
    useEffect(() => {
        if (showCenter) {
            setOpenCenter(true) // Ensure openCenter is set to true when showCenter is true
        } else {
            setOpenCenter(false) // Ensure openCenter is set to false when showCenter is false
            reset() // Reset form when modal closes
        }
    }, [showCenter])

    // Show/Hide Modal
    useEffect(() => {
        if (showCenterAction) {
            setOpenCenterAction(true) // Ensure openCenter is set to true when showCenter is true
        } else {
            setOpenCenterAction(false) // Ensure openCenter is set to false when showCenter is false
            reset() // Reset form when modal closes
        }
    }, [showCenterAction])

    useEffect(() => {
        if (result.isSuccess) {
            SuccessToast(result?.data?.message)
            handleFilterModalCenter(true) // Close the modal after successful submission
            setOpenCenter(false) // Ensure openCenter is set to false after modal is closed
            reset() // Reset form
        }
    }, [result])

    useEffect(() => {
        if (returnResult.isSuccess) {
            SuccessToast(result?.data?.message)
            handleFilterModalCenterAction(true) // Close the modal after successful submission
            setOpenCenterAction(false) // Ensure openCenter is set to false after modal is closed
            reset() // Reset form
        }
    }, [returnResult])

    useEffect(() => {
        orderDataRes?.order_details?.forEach((item: any) => {
            if (isValid(item?.parent_id)) {
                const childIndex = orderDataRes?.order_details?.findIndex((od: any) => od.id === item.id);
                const parentIndex = orderDataRes?.order_details?.findIndex((od: any) => od.id === item.parent_id);
                const parentAllowsReturn = watch(`order.${parentIndex}.allows_return`);
                log(watch(`order.${parentIndex}.allows_return`), 'parentAllowsReturn')
                if (watch(`order.${parentIndex}.allows_return`)) {
                    setValue(`order.${childIndex}.allows_return`, parentAllowsReturn);
                    // setValue(`order.${childIndex}.return_quantity`, item?.quantity);
                }
            }
        });
    }, [orderDataRes, watch("order"), setValue]);

    const renderData = () => {
        return orderDataRes?.order_details?.map((item: any, i: any) => {
            // State variables for subtotal, VAT amount, and returned amount
            const subtotal = Number(item?.max_retail_price)
            // Original total price
            const quantity = item?.quantity // Quantity of the item

            // Function to calculate final returned price
            const calculateFinalReturnedPrice = () => {
                const unitPrice = subtotal / quantity // Price per unit
                let finalReturnedPrice = 0
                if (isValid(watch(`order.${i}.allows_return`), 0)) {
                    finalReturnedPrice = subtotal * Number(watch(`order.${i}.return_quantity`)) // Final returned price
                }
                return finalReturnedPrice.toFixed(2) // Rounding to 2 decimal places
            }

            // Call the calculateFinalReturnedPrice function to get the calculated value
            const finalReturnedPrice: any = calculateFinalReturnedPrice()
            const isDisableTrue = () => {
                let re = false
                if (isValid(item?.parent_id)) {
                    re = true
                } else if (orderDataRes?.order_details?.some((od: any) => od.parent_id === item.id)) {
                    re = true;
                } else if (!isValid(watch(`order.${i}.allows_return`), 0) && finalReturnedPrice === 0.0) {
                    re = true
                }
                return re
            }

            // const isParentChecked = () => {
            //     if (!isValid(item?.parent_id)) {
            //         return 0;
            //     }
            //     const parentItem = orderData?.order_details?.find((od: any) => od.id === item.parent_id);
            //     if (!parentItem) {
            //         return 0;
            //     }
            //     const parentIndex = orderData?.order_details?.findIndex((od: any) => od.id === item.parent_id);


            //     // Check parent's allows_return value
            //     return watch(`order.${parentIndex}.allows_return`)
            // };


            //  setValue(`order.${i}.return_quantity`, Number(finalReturnedPrice))

            // Function to check how much quantity can be returned
            const itemQuantity = Number(item?.quantity) ?? 0 // Quantity of the item
            const returnQuantity = Number(item?.returned_quantity) ?? 0
            const retQuantity = () => {
                if (itemQuantity === returnQuantity) {
                    return 0
                } else if (itemQuantity > returnQuantity) {
                    return itemQuantity - returnQuantity
                } else {
                    return returnQuantity
                }
            }
            log("finalReturnedPrice", finalReturnedPrice, watch(`order.${i}.allows_return`))
            const childIndex = orderDataRes?.order_details?.findIndex((od: any) => od.id === item.id);
            const parentIndex = orderDataRes?.order_details?.findIndex((od: any) => od.id === item.parent_id);
            return (
                <div key={i}>
                    <FormGroupCustom
                        noLabel
                        noGroup
                        key={`allows_return-${i}`}
                        tooltip={FM('allows-return')}
                        name={`order.${i}.id`}
                        label={FM('allows-return')}
                        type={'hidden'}
                        defaultValue={item?.id}
                        control={control}
                        rules={{ required: false }}
                    />
                    <Row>
                        <Col md='8'>
                            <FormGroupCustom
                                label={FM('return-item-with-name', {
                                    name: item?.product_info?.name
                                })}
                                defaultValue={
                                    //   item?.quantity === item?.return_quantity
                                    //     ? item?.quantity
                                    //     : item?.quantity - item?.return_quantity
                                    retQuantity()
                                }
                                key={`order.${i}.return_quantity`}
                                name={`order.${i}.return_quantity`}
                                isDisabled={
                                    isDisableTrue()
                                }
                                type={'number'}
                                placeholder={FM('return-quantity')}
                                className='mb-1'
                                control={control}
                                rules={{
                                    required: watch(`order.${i}.allows_return`) === 1
                                }}
                                prepend={
                                    <InputGroupText className='p-25'>
                                        <BsTooltip title={FM('allows-return')}>
                                            <FormGroupCustom
                                                key={`order.${i}.allows_return-${watch(`order.${parentIndex}.allows_return`)}`}
                                                noLabel
                                                label={FM('return-item-with-name', {
                                                    name: item?.product_info?.name
                                                })}

                                                // defaultValue={isParentChecked()}

                                                isDisabled={isValid(item?.parent_id)}
                                                name={`order.${i}.allows_return`}
                                                type={'checkbox'}
                                                control={control}
                                                className={'ms-1 me-25'}
                                                rules={{
                                                    required: false
                                                }}
                                            />
                                        </BsTooltip>
                                    </InputGroupText>
                                }
                            />
                            <p className='fw-bold'>
                                {FM('max-return-with-quantity', {
                                    quantity: retQuantity()
                                })}
                            </p>
                        </Col>
                        <Col md='4'>
                            <Show IF={isValid(watch(`order.${i}.allows_return`), 0)}>
                                <p className='fw-bold'>{FM('purchased-price')} </p>
                                <code className='fw-bolder'>{finalReturnedPrice}</code>
                            </Show>
                        </Col>
                        <hr />
                    </Row>
                </div>
            )
        })
    }

    const renderActionData = () => {
        return returnData?.order_item_returns?.map((item: any, i: any) => {
            log('itemReturn', item)
            // State variables for subtotal, VAT amount, and returned amount
            const subtotal = Number(item?.return_subtotal)
            // Original total price
            const quantity = Number(item?.return_quantity) // Quantity of the item

            // Function to calculate final returned price
            const calculateFinalReturnedPrice = () => {
                const finalReturnedPrice = subtotal * Number(watch(`order.${i}.return_quantity`)) // Final returned price
                return finalReturnedPrice.toFixed(2) // Rounding to 2 decimal places
            }

            // Call the calculateFinalReturnedPrice function to get the calculated value
            const finalReturnedPrice: any = calculateFinalReturnedPrice()

            log('finalReturnedPrice', finalReturnedPrice)

            //  setValue(`order.${i}.return_quantity`, Number(finalReturnedPrice))\

            // Function to check how much quantity can be returned
            const returnQuantity = Number(item?.return_quantity) ?? 0
            const retQuantity = () => {
                return returnQuantity
            }

            return (
                <div key={i}>
                    <FormGroupCustom
                        noLabel
                        noGroup
                        key={`allows_return-${i}`}
                        tooltip={FM('allows-return')}
                        name={`order.${i}.id`}
                        label={FM('allows-return')}
                        type={'hidden'}
                        defaultValue={item?.order_detail_id}
                        control={control}
                        rules={{ required: false }}
                    />
                    <Row>
                        <Col md='8'>
                            <FormGroupCustom
                                label={FM('return-item-with-name', {
                                    name: item?.product_variant?.name
                                })}
                                defaultValue={retQuantity()}
                                key={`order.${i}.return_quantity`}
                                name={`order.${i}.return_quantity`}

                                type={'number'}
                                placeholder={FM('return-quantity')}
                                className='mb-1'
                                control={control}
                                rules={{
                                    required: false
                                }}
                                prepend={
                                    <InputGroupText className='p-25'>
                                        <BsTooltip title={FM('allows-return')}>
                                            <FormGroupCustom
                                                key={`order.${i}.allows_return`}
                                                noLabel
                                                label={FM('return-item-with-name', {
                                                    name: item?.product_info?.name
                                                })}
                                                isDisabled={isValid(item?.parent_id)}
                                                name={`order.${i}.allows_return`}
                                                type={'checkbox'}
                                                control={control}
                                                className={'ms-1 me-25'}
                                                rules={{
                                                    required: false
                                                }}
                                            />
                                        </BsTooltip>
                                    </InputGroupText>
                                }
                            />
                        </Col>
                        <Col md='4'>
                            <Show IF={isValid(watch(`order.${i}.allows_return`), 0)}>
                                <p className='fw-bold'>{FM('refund-amount')} </p>
                                <code className='fw-bolder'>{finalReturnedPrice}</code>
                            </Show>
                        </Col>
                        <hr />
                    </Row>
                </div>
            )
        })
    }

    const handleActions = (id?: any, ids?: any, action?: any, eventId?: any) => {
        // log('id', id)
        if (isValid(id)) {
            // delete single
            getAmount({
                eventId,
                id,
                originalArgs: res?.originalArgs
            })
        }
    }

    return (
        <>
            <SideModal
                loading={state?.loading}
                handleSave={handleSubmit(submitFilter)}
                open={open}
                handleModal={() => {
                    setOpen(false)
                    handleFilterModal(false)
                }}
                title={
                    exportType === 'ordersDetails'
                        ? FM('export-orders-with-product')
                        : exportType === 'onlyOrders'
                            ? FM('export-orders')
                            : FM('transaction-filter')
                }
                done={
                    exportType === 'ordersDetails' || exportType === 'onlyOrders' ? FM('export') : 'filter'
                }
            >
                {/* <Form> */}
                <Show
                    IF={
                        (exportType === 'ordersDetails' || exportType === 'filter') &&
                        Can(Permissions.productBrowse)
                    }
                >
                    <FormGroupCustom
                        label={FM('product')}
                        placeholder={FM('product')}
                        //   noLabel
                        async
                        isClearable
                        path={ApiEndpoints.load_product}
                        selectLabel='name'
                        selectValue={'id'}
                        defaultOptions
                        jsonData={{
                            store_id: user?.store_id
                        }}
                        loadOptions={loadDropdown}
                        name={`product_id`}
                        type={'select'}
                        className='mb-1'
                        control={control}
                        rules={{ required: false }}
                    />
                </Show>
                {/* <Hide IF={exportType === 'returnOrder'}> */}
                <FormGroupCustom
                    placeholder={FM('order-number')}
                    type='text'
                    name='order_number'
                    label={FM('order-number')}
                    className='mb-1'
                    control={control}
                    rules={{ required: false }}
                />
                {/* </Hide> */}
                <Show IF={exportType === 'filter'}>
                    <FormGroupCustom
                        placeholder={FM('paid-amount')}
                        type='text'
                        name='paid_amount'
                        label={FM('paid-amount')}
                        className='mb-1'
                        control={control}
                        rules={{ required: false }}
                    />
                    <FormGroupCustom
                        placeholder={FM('status')}
                        type={'select'}
                        name='status'
                        label={FM('status')}
                        className='mb-1'
                        control={control}
                        selectOptions={[
                            {
                                value: '1',
                                label: FM('completed')
                            },
                            {
                                value: '2',
                                label: FM('cancelled')
                            },
                            {
                                value: '3',
                                label: FM('pending')
                            }
                        ]}
                        rules={{ required: false }}
                    />
                </Show>

                {/* <Hide IF={exportType === 'returnOrder'}> */}
                <FormGroupCustom
                    placeholder={FM('start-date')}
                    label={FM('start-date')}
                    //   noLabel
                    name={`start_date`}
                    type={'date'}
                    className='mb-1'
                    control={control}
                    rules={{ required: false }}
                />
                <FormGroupCustom
                    placeholder={FM('end-date')}
                    label={FM('end-date')}
                    name={`end_date`}
                    type={'date'}
                    className='mb-0'
                    control={control}
                    rules={{ required: false }}
                />
                {/* </Hide> */}
            </SideModal>

            <CenteredModal
                loading={state?.loading}
                handleSave={handleSubmit(submitReturn)}
                open={openCenter}
                disableSave={result?.isLoading}
                scrollControl
                modalClass={'modal-lg'}
                handleModal={() => {
                    setOpenCenter(false)
                    handleFilterModalCenter(false)
                }}
                title={exportType === 'returnOrder' ? FM('return-order') : ''}
                done={exportType === 'returnOrder' ? FM('return-order') : ''}
            >
                <div className='p-2'>
                    <Show IF={exportType === 'returnOrder'}>
                        <>
                            <FormGroupCustom
                                placeholder={FM('reason-for-return')}
                                type='text'
                                name='reason_for_return'
                                label={FM('reason-for-return')}
                                className='mb-2'
                                control={control}
                                rules={{ required: true }}
                            />
                            <hr />
                            {renderData()}
                        </>
                    </Show>
                </div>
            </CenteredModal>

            <CenteredModal
                loading={state?.loading}
                handleSave={handleSubmit(submitReturnAction)}
                open={openCenterAction}
                scrollControl
                modalClass={'modal-lg'}
                handleModal={() => {
                    setOpenCenterAction(false)
                    handleFilterModalCenterAction(false)
                }}
                btnColor={watch(`action`) !== 1 ? "danger" : "primary"}

                title={exportType === 'returnOrderAction' ? FM('approve-reject-return') : ''}
                done={watch(`action`) !== 1 ? FM('reject') : FM('approve')}
            >
                <div className='p-2'>
                    <Show IF={exportType === 'returnOrderAction'}>
                        <>
                            <FormGroupCustom
                                key={`action`}
                                tooltip={FM('actionInfo')}
                                name={`action`}
                                label={FM('action')}
                                type={'checkbox'}
                                className='mb-1'
                                control={control}
                                rules={{ required: false }}
                            />
                            <Show IF={watch(`action`) !== 1}>
                                <FormGroupCustom
                                    placeholder={FM('reason-for-rejection')}
                                    type='text'
                                    name='reason_for_return_rejection'
                                    label={FM('reason-for-rejection')}
                                    className='mb-2'
                                    control={control}
                                    rules={{ required: true }}
                                />
                            </Show>

                            <hr />
                            <Show IF={watch(`action`) === 1}>{renderActionData()}</Show>
                        </>
                    </Show>
                </div>
            </CenteredModal>
        </>
    )
}

export default TransactionFilter
