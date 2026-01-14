/* eslint-disable prefer-template */
/* eslint-disable prettier/prettier */
/* eslint-disable eqeqeq */
import { useContext, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { Badge, Card, CardBody, CardImg, Col, Row } from 'reactstrap'
import {
    useActionCouponMutation,
    useCreateOrUpdateCouponMutation
} from '../../../redux/RTKQuery/CouponRTK'

import { FM, isValid, isValidUrl } from '../../../utility/helpers/common'
import Hide from '../../../utility/Hide'
import useUser from '../../../utility/hooks/useUser'
import httpConfig from '../../../utility/http/httpConfig'
import Show from '../../../utility/Show'
import { CF, decrypt, formatDate } from '../../../utility/Utils'
import FormGroupCustom from '../../components/formGroupCustom/FormGroupCustom'

import CenteredModal from '../../components/modal/CenteredModal'
import { CouponParamType } from './AddUpdateCoupon'
import CouponCard from './CouponCard'
import { colors } from 'unique-names-generator'
import { ThemeColors } from '../../../utility/context/ThemeColors'
export type CategoryParamsType = {
    id?: string
    name: string
    status?: string
    patent_id?: string
}
interface dataType {
    edit?: CouponParamType
    response?: (e: any) => void
    noView?: boolean
    showModal?: boolean
    setShowModal?: (e: boolean) => void
    Component?: any
    loading?: boolean
    children?: any

    // rest?: any
}

export default function ModalCouponDetails<T>(props: T & dataType) {
    const {
        edit = null,
        noView = false,
        showModal = false,

        setShowModal = () => { },
        Component = 'span',
        response = () => { },
        children = null,
        ...rest
    } = props

    const [open, setOpen] = useState(false)
    const form = useForm<CouponParamType>()
    const user = useUser()

    const { handleSubmit, control, reset, setValue, watch } = form
    const [createCoupon, result] = useCreateOrUpdateCouponMutation()
    const [actionCoupon, couponResult] = useActionCouponMutation()
    const [couponColor, setCouponColor] = useState<string[]>([])

    useEffect(() => {

        const randomColor = Math.floor(Math.random() * 16777215).toString(16)
        setCouponColor([`#${randomColor}`, `#${randomColor}`])


    }, [])

    const openModal = () => {
        setOpen(true)
        reset()
    }
    const closeModal = (from = null) => {
        setOpen(false)
        setShowModal(false)
    }

    const handleSave = (d: CouponParamType) => {
        if (edit?.id) {
            createCoupon({
                ...edit,
                expiry_date: watch('expiry_date'),
                status: 1
            })
        }
    }

    useEffect(() => { })

    useEffect(() => {
        if (noView && showModal) {
            openModal()
        }
    }, [noView, showModal])

    const donwloadQr = () => {
        if (isValidUrl(edit?.image)) {
            window.open(edit?.image, '_blank')
        } else {
            window.open(httpConfig.baseUrl2 + edit?.image, '_blank')
        }
        // window.open(httpConfig.baseUrl2 + edit?.image, '_blank')
    }

    useEffect(() => {
        if (result?.isSuccess) {
            actionCoupon({
                ids: [edit?.id],
                // eventId,
                originalArgs: couponResult?.originalArgs,
                jsonData: {
                    ids: [edit?.id],
                    action: 'active'
                }
            })
        }
    }, [result.isSuccess])

    useEffect(() => {
        if (couponResult.isSuccess) {
            response(edit?.coupon_code)
            closeModal()
        }
    }, [couponResult?.isSuccess])

    return (
        <>
            {!noView ? (
                <Component role='button' onClick={openModal} {...rest}>
                    {children}
                </Component>
            ) : null}
            <CenteredModal
                hideSave={!edit?.isActiveReq}
                disableFooter={!edit?.isActiveReq}
                scrollControl={false}
                modalClass='modal-sm'
                loading={result?.isLoading}
                open={open}
                handleModal={closeModal}
                handleSave={handleSubmit(handleSave)}
                title={edit?.coupon_code}
            >
                <Hide IF={edit?.isActiveReq}>
                    <Card className='p-0'>
                        <Show IF={isValid(edit?.image)}>
                            <CardImg
                                top
                                alt={FM('image')}
                                style={{ height: 200, objectFit: 'fill' }}
                                src={isValidUrl(edit?.image)
                                    ? edit?.image
                                    : `${httpConfig.baseUrl2}${edit?.image}`}
                                onClick={() => donwloadQr()}
                            />
                        </Show>
                        <Hide IF={isValid(edit?.image)}>
                            <CouponCard expiry={formatDate(edit?.expiry_date)}
                                discount={edit?.discount_value}
                                currency={edit?.store_setting?.currency}
                                colors={[couponColor]} level={""} discount_type={edit?.discount_type} title={edit?.coupon_code} />
                        </Hide>
                        <CardBody>
                            <Row>
                                <Col md='6'>
                                    <div className='info-container'>
                                        <>
                                            <ul>
                                                <li className='mb-75'>
                                                    <span className='fw-bolder text-dark me-25'>
                                                        <>{FM('store')}:</>
                                                    </span>
                                                    <span className='d-block'>
                                                        <>{edit?.store_setting?.store_name ?? 'N/A'}</>
                                                    </span>
                                                </li>
                                                <li className='mb-75'>
                                                    <span className='fw-bolder text-dark me-25'>
                                                        <>{FM('coupon-code')}:</>
                                                    </span>
                                                    <span className='d-block'>
                                                        <>{edit?.coupon_code ?? 'N/A'}</>
                                                    </span>
                                                </li>

                                                <li className='mb-75'>
                                                    <span className='fw-bolder text-dark me-25'>
                                                        <>{FM('discount-type')}:</>
                                                    </span>
                                                    <span className='d-block'>
                                                        {edit?.discount_type == 1 ? FM('fixed') : FM('percent')}
                                                    </span>
                                                </li>
                                                <li className='mb-75'>
                                                    <span className='fw-bolder text-dark me-25'>
                                                        <>{FM('discount-value')}:</>
                                                    </span>
                                                    <span className='d-block'>
                                                        <>
                                                            {edit?.discount_type == 1
                                                                ? `${CF({
                                                                    money: Number(edit?.discount_value),
                                                                    currency: user?.currency
                                                                })}`
                                                                : `${edit?.discount_value}%` }
                                                        </>
                                                    </span>
                                                </li>
                                            </ul>
                                        </>
                                    </div>
                                </Col>
                                <Col md='6'>
                                    <div className='info-container'>
                                        <>
                                            <ul>
                                                <li className='mb-75'>
                                                    <span className='fw-bolder text-dark me-25'>
                                                        <>{FM('max-discount')}:</>
                                                    </span>
                                                    <span className='d-block'>
                                                        <>{edit?.max_discount === '9999999999' ? FM('no-restriction') : CF({ money: edit?.max_discount, currency: user?.currency })}</>
                                                    </span>
                                                </li>
                                                <li className='mb-75'>
                                                    <span className='fw-bolder text-dark me-25'>
                                                        <>{FM('min-applicable-amount')}:</>
                                                    </span>
                                                    <span className='d-block'>
                                                        <>
                                                            {CF({
                                                                money: Number(edit?.min_applicable_amount),
                                                                currency: user?.currency
                                                            })}
                                                        </>
                                                    </span>
                                                </li>
                                                <li className='mb-75'>
                                                    <span className='fw-bolder text-dark me-25'>
                                                        <>{FM('created-by')}:</>
                                                    </span>
                                                    <span className='d-block'>
                                                        <>{decrypt(edit?.created_by?.name)}</>
                                                    </span>
                                                </li>
                                            </ul>
                                        </>
                                    </div>
                                </Col>

                                <Col md='6'>
                                    <div className='info-container'>
                                        <>
                                            <ul>
                                                <li className='mb-75'>
                                                    <span className='fw-bolder text-dark me-25'>
                                                        <>{FM('usage-limit')}:</>
                                                    </span>
                                                    <span className='d-block'>
                                                        <>{edit?.usage_limit}</>
                                                    </span>
                                                </li>
                                                <li className='mb-75'>
                                                    <span className='fw-bolder text-dark me-25'>
                                                        <>{FM('usage-limit-per-user')}:</>
                                                    </span>
                                                    <span className='d-block'>
                                                        <>{edit?.usage_limit_per_user}</>
                                                    </span>
                                                </li>


                                            </ul>
                                        </>
                                    </div>
                                </Col>
                                <Col md='6'>
                                    <div className='info-container'>
                                        <>
                                            <ul>
                                                <li className='mb-75'>
                                                    <span className='fw-bolder text-dark me-25'>
                                                        <>{FM('expiry-date')}:</>
                                                    </span>
                                                    <span className='d-block'>
                                                        {new Date(edit?.expiry_date) < new Date() ? (
                                                            <Badge color='light-danger'>{formatDate(edit?.expiry_date)}</Badge>
                                                        ) : (
                                                            <Badge color='light-success'>{formatDate(edit?.expiry_date)}</Badge>
                                                        )}
                                                    </span>
                                                </li>
                                                <li className='mb-75'>
                                                    <span className='fw-bolder text-dark me-25'>
                                                        <>{FM('used')}:</>
                                                    </span>
                                                    <span className='d-block'>
                                                        <>{edit?.used}</>
                                                    </span>
                                                </li>
                                                {/* <li className='mb-75'>
                                                    <span className='fw-bolder text-dark me-25'>
                                                        <>{FM('description')}:</>
                                                    </span>
                                                    <span className='d-block'>
                                                        <>{edit?.description}</>
                                                    </span>
                                                </li> */}

                                            </ul>
                                        </>
                                    </div>
                                </Col>
                                <Col md='12'>
                                    <span className='fw-bolder text-dark me-25'>
                                        <>{FM('description')}:</>
                                    </span>
                                    <span className='d-block'>
                                        <>{edit?.description}</>
                                    </span>
                                </Col>
                            </Row>
                        </CardBody>
                    </Card>
                </Hide>
                <Show IF={edit?.isActiveReq}>
                    <FormGroupCustom
                        name={'expiry_date'}
                        type={'date'}
                        label={FM('expiry-date')}
                        datePickerOptions={{ minDate: formatDate(new Date()) }}
                        className='p-1'
                        control={control}
                        rules={{ required: true }}
                    />
                </Show>
            </CenteredModal>
        </>
    )
}
