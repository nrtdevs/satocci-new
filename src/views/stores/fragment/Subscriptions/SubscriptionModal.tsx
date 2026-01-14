/* eslint-disable prettier/prettier */
import { useContext, useEffect, useReducer, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useParams } from 'react-router-dom'
import { CardBody, Col, Form, InputGroupText, Row } from 'reactstrap'

import { QueryStatus } from '@reduxjs/toolkit/dist/query'
import { Trash2 } from 'react-feather'
import {
    useDeleteSUbscriptionMutation,
    useLoadSubscriptionLogMutation,
    useSubscriptionUpdateMutation
} from '../../../../redux/RTKQuery/SubscriptionRTK'
import { subscriptionStoreType } from '../../../../utility/Const'
import Hide from '../../../../utility/Hide'
import {
    addDay,
    CF,
    createConstSelectOptions,
    emitAlertStatus,
    formatDate,
    getKeyByValue,
    isNumbers,
    setValues,
    truncateText
} from '../../../../utility/Utils'
import { ThemeColors } from '../../../../utility/context/ThemeColors'
import ConfirmAlert from '../../../../utility/helpers/ConfirmAlert'
import { FM, isValid, isValidArray } from '../../../../utility/helpers/common'
import useUser from '../../../../utility/hooks/useUser'
import useUserType from '../../../../utility/hooks/useUserType'
import { stateReducer } from '../../../../utility/stateReducer'
import { TableFormData } from '../../../components/CustomDataTable/CustomDataTable'
import FormGroupCustom from '../../../components/formGroupCustom/FormGroupCustom'
import CenteredModal from '../../../components/modal/CenteredModal'
import Shimmer from '../../../components/shimmers/Shimmer'

interface States {
    lastRefresh?: any
    loading?: boolean
    text?: string
    list?: any
    search?: any
}
export type FormData = {
    id?: any
    subscription_type?: any
    amount?: string
    percentage?: string
    sub_store_limit?: number
    store_id?: any
    applied_date?: string
}
interface dataType {
    edit?: any
    noView?: boolean
    subCatStoreID?: any
    showModal?: boolean
    resData?: (e: boolean) => void
    setShowModal?: (e: boolean) => void
    Component?: any
    loading?: boolean
    children?: any
    // rest?: any
}

export default function SubscriptionModal<T>(props: T & dataType) {
    const {
        edit = null,
        noView = false,
        showModal = false,
        resData = () => { },
        setShowModal = () => { },
        Component = 'span',
        children = null,
        ...rest
    } = props

    const initState: States = {
        lastRefresh: new Date().getTime(),
        loading: false,
        search: undefined,
        text: '',
        list: []
    }
    const reducers = stateReducer<States>
    const [state, setState] = useReducer(reducers, initState)
    const [open, setOpen] = useState(false)

    const [loadingSample, setLoadingSample] = useState(false)
    const user = useUser()
    const params = useParams()
    const userType = useUserType()
    const [updateSubscription, res] = useSubscriptionUpdateMutation()
    const [logData, { data, isSuccess, isLoading, originalArgs }] = useLoadSubscriptionLogMutation()
    const [deleteSubscription, resultDelete] = useDeleteSUbscriptionMutation()
    const resDatas = data?.payload as any
    const resDataa = isValidArray(resDatas) ? [...resDatas]?.reverse() : []
    const form = useForm<FormData>()
    const { colors } = useContext(ThemeColors)
    const {
        formState: { errors },
        handleSubmit,
        control,
        reset,
        setValue,
        watch,
        getValues
    } = form

    const openModal = () => {
        setOpen(true)
    }
    const closeModal = (from = null) => {
        reset()
        setOpen(false)
        setShowModal(false)
    }

    useEffect(() => {
        if (isValid(edit?.store_id)) {
            logData({
                jsonData: { store_id: edit?.store_id }
            })
        }
    }, [edit, open, res.isSuccess, resultDelete?.isSuccess])

    useEffect(() => {
        if (isValid(resDataa[0]?.id && isSuccess)) {
            const formData: FormData = {
                amount: resDataa[0]?.amount,
                percentage: resDataa[0]?.percentage,
                sub_store_limit: resDataa[0]?.sub_store_limit,
                applied_date: resDataa[0]?.applied_date,
                subscription_type: {
                    label: getKeyByValue(subscriptionStoreType, `${resDataa[0]?.subscription_type}`),
                    value: `${resDataa[0]?.subscription_type}`
                }
            }

            setValues<FormData>(formData, setValue)
        }
    }, [isSuccess])

    const handleActions = (id?: any, ids?: any, action?: any, eventId?: any) => {
        // // log('id', id)
        if (isValid(id)) {
            deleteSubscription({
                id,
                originalArgs,
                eventId
            })
        }
    }

    // delete item success
    useEffect(() => {
        if ((resultDelete.status = QueryStatus.fulfilled) && resultDelete?.isLoading === false) {
            if (resultDelete?.isSuccess) {
                emitAlertStatus('success', null, resultDelete?.originalArgs?.eventId)
            } else if (resultDelete?.error) {
                emitAlertStatus('failed', null, resultDelete?.originalArgs?.eventId)
            }
        }
    }, [resultDelete])

    const handleSave = (e: FormData) => {
        updateSubscription({
            ...e,
            subscription_type: e?.subscription_type?.value,
            store_id: edit?.store_id
        })
    }
    ///////////////
    useEffect(() => {
        if (res?.isSuccess) {
            //ffokdlfdskds'pk
        }
    }, [res])

    useEffect(() => {
        if (noView && showModal) {
            openModal()
        }
    }, [noView, showModal])
    const handlePageChange = (e: TableFormData) => {
        // log('state change', e)
        // setState({ ...e, search: e?.search, filterData: { ...state?.filterData } })
    }

    // log('applieddate', watch('applied_date'))

    return (
        <>
            {!noView ? (
                <Component role='button' onClick={openModal} {...rest}>
                    {children}
                </Component>
            ) : null}
            <CenteredModal
                scrollControl={false}
                modalClass='modal-xl'
                loading={false}
                disableSave={res?.isLoading === true}
                open={open}
                handleModal={closeModal}
                handleSave={handleSubmit(handleSave)}
                title={FM('subscription-log')}
            >
                <Form>
                    <CardBody className=''>
                        <Row>
                            <Col md='4'>
                                <Col md='12'>
                                    <FormGroupCustom
                                        tooltip={FM('store-subscription')}
                                        name='subscription_type'
                                        type={'select'}
                                        label={FM('subscription-terms')}
                                        className='mb-2'
                                        control={control}
                                        // message={FM('select-discount-type-fixed-or-percentage')}
                                        selectOptions={createConstSelectOptions(subscriptionStoreType, FM)}
                                        rules={{ required: true }}
                                    />
                                </Col>

                                <Hide
                                    IF={watch('subscription_type')?.value === subscriptionStoreType?.perTransaction}
                                >
                                    <Col md='12'>
                                        <FormGroupCustom
                                            tooltip={FM('satoccie-amount')}
                                            name={'amount'}
                                            //   label={
                                            //     watch('subscription_terms_select_value')?.value === '1'
                                            //       ? FM('percent-to-deduct-per-transaction')
                                            //       : FM('price-per-month')
                                            //   }
                                            label={FM('price-per-month')}
                                            type={'text'}
                                            className='mb-2'
                                            control={control}
                                            rules={{
                                                required: true,
                                                min: 0,
                                                max: 10000000,
                                                validate: (v: string) => {
                                                    return isNumbers(v)
                                                }
                                            }}
                                        />
                                    </Col>
                                </Hide>
                                <Hide IF={watch('subscription_type')?.value === subscriptionStoreType?.perMonth}>
                                    <Col md='12'>
                                        <FormGroupCustom
                                            name={'percentage'}
                                            //   label={
                                            //     watch('subscription_terms_select_value')?.value === '1'
                                            //       ? FM('percent-to-deduct-per-transaction')
                                            //       : FM('price-per-month')
                                            //   }
                                            label={FM('percent-to-deduct-per-transaction')}
                                            type={'text'}
                                            className='mb-2'
                                            control={control}
                                            rules={{
                                                required: true,
                                                min: 0.01,
                                                max: 100,
                                                maxLength: 5,
                                                validate: (v: string) => {
                                                    return isNumbers(v)
                                                }
                                            }}
                                            append={<InputGroupText>%</InputGroupText>}
                                        />
                                    </Col>
                                </Hide>
                                <Col md='12'>
                                    <FormGroupCustom
                                        tooltip={FM('applied-date')}
                                        label={FM('applied-date')}
                                        //   noLabel
                                        type={'date'}
                                        name={'applied_date'}
                                        datePickerOptions={{
                                            minDate: formatDate(addDay(new Date(), 1))
                                        }}
                                        className='mb-1'
                                        control={control}
                                        rules={{ required: false }}
                                    />
                                </Col>
                                <Col md='12'>
                                    <FormGroupCustom
                                        // isDisabled={isValid(params?.id)}
                                        tooltip={FM('this-is-no-of-substore-that-can-assign-by-admin')}
                                        name={'sub_store_limit'}
                                        label={FM('store-limit')}
                                        type={'number'}
                                        className='mb-2'
                                        control={control}
                                        rules={{ required: true, min: resDataa[0]?.sub_store_limit ?? 0 }}
                                    />
                                </Col>
                            </Col>

                            <Col md='8'>
                                <table className='table table-sm'>
                                    <thead>
                                        <tr>
                                            <th scope='col'>{FM('amount')}</th>
                                            <th scope='col'>{FM('percent')}</th>
                                            <th scope='col'>{FM('applied-date')}</th>
                                            <th scope='col'>{FM('sub-store-limit')}</th>
                                            <th scope='col'>{FM('subscription')}</th>
                                            <th>{FM('action')}</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {!isLoading ? (
                                            resDataa?.map((d: FormData, i: any) => {
                                                return (
                                                    <tr key={i}>
                                                        <th scope='row'>{isValid(d?.amount) ? CF({
                                                            money: Number(d?.amount),
                                                            currency: user?.currency
                                                        }) : FM("n/a")}</th>
                                                        <td>{isValid(d?.percentage) ? `${d?.percentage} %` : FM("n/a")}</td>
                                                        <td><span className='fw-bolder'>{d?.applied_date}</span></td>
                                                        <td>{`${d?.sub_store_limit} (${FM('sub-store')})`}</td>
                                                        <td>
                                                            {getKeyByValue(subscriptionStoreType, `${d?.subscription_type}`)}
                                                        </td>

                                                        <td title={FM('delete-subscription')}>
                                                            {formatDate(d?.applied_date) > formatDate(addDay(new Date(), 0)) ? (
                                                                <>
                                                                    <ConfirmAlert
                                                                        menuIcon={<Trash2 color={colors.danger.main} size={14} />}
                                                                        onDropdown
                                                                        eventId={`delete-item-${d?.id}`}
                                                                        item={d}
                                                                        title={truncateText(`${d?.applied_date}`, 50)}
                                                                        text={FM("are-you-sure")}
                                                                        color='text-warning'
                                                                        onClickYes={() =>
                                                                            handleActions(d?.id, null, null, `delete-item-${d?.id}`)
                                                                        }
                                                                        onSuccessEvent={(e: any) => {
                                                                            // reloadData()
                                                                        }}
                                                                        className=''
                                                                        id={`grid-delete-${d?.id}`}
                                                                    />
                                                                </>
                                                            ) : (
                                                                ''
                                                            )}

                                                            {/* {FM('delete')} */}
                                                            {/* </ConfirmAlert> */}
                                                        </td>
                                                    </tr>
                                                )
                                            })
                                        ) : (
                                            <>
                                                <tr>
                                                    <th scope='row'>
                                                        <Shimmer height={50} />
                                                    </th>
                                                    <td>
                                                        <Shimmer height={50} />
                                                    </td>
                                                    <td>
                                                        <Shimmer height={50} />
                                                    </td>
                                                    <td>
                                                        <Shimmer height={50} />
                                                    </td>
                                                    <td>
                                                        <Shimmer height={50} />
                                                    </td>
                                                    <td>
                                                        <Shimmer height={50} />
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <th scope='row'>
                                                        <Shimmer height={50} />
                                                    </th>
                                                    <td>
                                                        <Shimmer height={50} />
                                                    </td>
                                                    <td>
                                                        <Shimmer height={50} />
                                                    </td>
                                                    <td>
                                                        <Shimmer height={50} />
                                                    </td>
                                                    <td>
                                                        <Shimmer height={50} />
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <th scope='row'>
                                                        <Shimmer height={50} />
                                                    </th>
                                                    <td>
                                                        <Shimmer height={50} />
                                                    </td>
                                                    <td>
                                                        <Shimmer height={50} />
                                                    </td>
                                                    <td>
                                                        <Shimmer height={50} />
                                                    </td>
                                                    <td>
                                                        <Shimmer height={50} />
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <th scope='row'>
                                                        <Shimmer height={50} />
                                                    </th>
                                                    <td>
                                                        <Shimmer height={50} />
                                                    </td>
                                                    <td>
                                                        <Shimmer height={50} />
                                                    </td>
                                                    <td>
                                                        <Shimmer height={50} />
                                                    </td>
                                                    <td>
                                                        <Shimmer height={50} />
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <th scope='row'>
                                                        <Shimmer height={50} />
                                                    </th>
                                                    <td>
                                                        <Shimmer height={50} />
                                                    </td>
                                                    <td>
                                                        <Shimmer height={50} />
                                                    </td>
                                                    <td>
                                                        <Shimmer height={50} />
                                                    </td>
                                                    <td>
                                                        <Shimmer height={50} />
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <th scope='row'>
                                                        <Shimmer height={50} />
                                                    </th>
                                                    <td>
                                                        <Shimmer height={50} />
                                                    </td>
                                                    <td>
                                                        <Shimmer height={50} />
                                                    </td>
                                                    <td>
                                                        <Shimmer height={50} />
                                                    </td>
                                                    <td>
                                                        <Shimmer height={50} />
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <th scope='row'>
                                                        <Shimmer height={50} />
                                                    </th>
                                                    <td>
                                                        <Shimmer height={50} />
                                                    </td>
                                                    <td>
                                                        <Shimmer height={50} />
                                                    </td>
                                                    <td>
                                                        <Shimmer height={50} />
                                                    </td>
                                                    <td>
                                                        <Shimmer height={50} />
                                                    </td>
                                                </tr>
                                            </>
                                        )}

                                    </tbody>
                                </table>
                            </Col>
                        </Row>
                    </CardBody>
                </Form>
            </CenteredModal>
        </>
    )
}
