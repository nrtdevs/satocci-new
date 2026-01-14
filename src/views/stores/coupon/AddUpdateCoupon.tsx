/* eslint-disable prettier/prettier */
import '@styles/react/apps/app-users.scss'

import { useContext, useEffect, useReducer, useState } from 'react'
import { set, useForm } from 'react-hook-form'
import { useNavigate, useParams } from 'react-router-dom'
import { Card, CardBody, Col, Form, InputGroupText, Label, Row } from 'reactstrap'
import {
    useCreateOrUpdateCouponMutation,
    useLoadCouponDetailsByIdMutation
} from '../../../redux/RTKQuery/CouponRTK'
import { loadDropdown } from '../../../utility/apis/dropdowns'

import { CouponType, Patterns, UserType } from '../../../utility/Const'
import { FM, isValid, log } from '../../../utility/helpers/common'
import Hide from '../../../utility/Hide'
import useUser from '../../../utility/hooks/useUser'
import useUserType from '../../../utility/hooks/useUserType'
import { ThemeColors } from '../../../utility/context/ThemeColors'
import ApiEndpoints from '../../../utility/http/ApiEndpoints'
import Show from '../../../utility/Show'
import { stateReducer } from '../../../utility/stateReducer'
import {
    createConstSelectOptions,
    ErrorToast,
    fillObject,
    formatDate,
    getKeyByValue,
    setInputErrors,
    setValues,
    SpaceTrim
} from '../../../utility/Utils'
import LoadingButton from '../../components/buttons/LoadingButton'
import FormGroupCustom from '../../components/formGroupCustom/FormGroupCustom'
import Header from '../../components/header'
import Shimmer from '../../components/shimmers/Shimmer'
import SimpleImageUpload from '../../components/SimpleImageUpload'
import BsTooltip from '../../components/tooltip'
import CouponCard from './CouponCard'
import { use } from 'i18next'

export type CouponParamType = {
    status?: any
    id?: any | null
    select_all_store?: any | null
    coupon_code?: string | null
    total_coupon_discount?: any
    created_by?: any
    country?: any
    is_belongs_to_satocci?: any
    currency?: any
    total_coupon_usage?: any
    total_coupon?: any
    order_number?: any
    coupon?: any
    customer_id?: any
    store_id?: any
    only_satocci_coupon?: any
    coupon_discount?: any
    store?: any
    email?: any
    store_setting?: any
    discount_type?: any
    discount_value?: string | null
    description?: string | null
    min_applicable_amount?: string | null
    max_discount?: any | null
    product_ids?: any | null
    payload?: any
    is_unlimited?: any
    image?: any
    subscription?: any
    product_category_ids?: any | null
    usage_limit?: any | null
    usage_limit_per_user?: any | null
    limit_usage_to_x_items?: any | null
    used?: any
    expiry_date?: any
    action?: any | null
    isActiveReq?: any | null
}

interface States {
    search?: any
    page?: any
    per_page_record?: any
    loading?: boolean
    text?: string
    country?: any
    list?: any
    formData?: CouponParamType
    with_substore?: string | null
}

const AddUpdateCoupon = () => {
    const form = useForm<CouponParamType>()
    const { colors } = useContext(ThemeColors)
    const navigate = useNavigate()
    const param = useParams()
    const customerId = param?.customerId
    const id = param?.id
    const userType = useUserType()
    const user = useUser()
    const { handleSubmit, control, reset, setValue, watch, setError } = form
    const [loading, setLoading] = useState(false)
    const [couponColor, setCouponColor] = useState([colors])
    const [createCoupon, { data, isError, error, isSuccess, isLoading }] =
        useCreateOrUpdateCouponMutation()

    const finalError = error as any
    const initState: States = {
        loading: false,
        text: '',
        list: [],
        country: null,
        formData: {
            store_id: null,
            email: null,
            image: null,
            coupon_code: null,
            discount_type: null,
            discount_value: null,
            expiry_date: null,
            description: null,
            min_applicable_amount: null,
            max_discount: null,
            subscription: null,
            payload: null,
            product_ids: null,
            product_category_ids: null,
            usage_limit: null,
            usage_limit_per_user: null,
            limit_usage_to_x_items: null,
            status: null,
            action: null
        }
    }

    const reducers = stateReducer<States>
    const [state, setState] = useReducer(reducers, initState)
    const [loadCouponById, CouponData] = useLoadCouponDetailsByIdMutation()

    const couponData = CouponData?.data?.payload

    useEffect(() => {
        if (isValid(id)) {
            loadCouponById({ id })
        }
    }, [id])


    useEffect(() => {

        const setRandomColor = () => {
            const randomColor = Math.floor(Math.random() * 16777215).toString(16)
            setCouponColor([`#${randomColor}`, `#${randomColor}`])
        }
        // if (isValid(watch("discount_value"))) {
        setRandomColor()
        // }
    }, [watch("coupon_code"), watch("discount_value")])

    useEffect(() => {
        if (isValid(couponData) && couponData !== undefined) {
            log(couponData, 'coupondata')
            const f = fillObject<CouponParamType>(state.formData, couponData)
            const formData: CouponParamType = {
                ...f,
                discount_type: {
                    label: getKeyByValue(CouponType, f?.discount_type),
                    value: f?.discount_type
                },
                max_discount: couponData?.max_discount === '9999999999' ? '' : couponData?.max_discount,
                is_unlimited: couponData?.max_discount === '9999999999' ? 1 : 0,
                store_id: [
                    {
                        label: couponData?.store_setting?.store_name,
                        value: f?.store_id
                    }
                ]
            }
            setValues<CouponParamType>(formData, setValue)
        }
    }, [couponData])

    useEffect(() => {
        if (isValid(customerId) && watch('usage_limit')) {
            setValue('usage_limit_per_user', watch('usage_limit'))
        }
    }, [customerId, watch('usage_limit')])

    useEffect(() => {
        setState({
            country: watch('country')?.label
        })
    }, [watch('country')])

    const onSubmit = (e: CouponParamType) => {
        log('e', e)
        if (isValid(id)) {

            createCoupon({
                ...e,
                max_discount: watch('discount_type').value === CouponType.fixed ? '' : e?.is_unlimited === 1 ? '9999999999' : e?.max_discount,
                id: couponData?.id,
                select_all_store: watch('select_all_store') === 1 ? "yes" : "",
                image: watch('image'),
                country: watch('country')?.label,
                store_id: e?.store_id?.map((d: any) => d?.value) ?? [],
                discount_type: e?.discount_type?.value
            })

        } else if (isValid(customerId)) {

            createCoupon({
                ...e,
                customer_id: customerId,
                max_discount: watch('discount_type').value === CouponType.fixed ? '' : e?.is_unlimited === 1 ? '9999999999' : e?.max_discount,
                id: couponData?.id,
                image: watch('image'),
                //  country: watch('country')?.label,
                // store_id: e?.store_id?.value,
                discount_type: e?.discount_type?.value
            })

        } else {

            createCoupon({
                ...e,
                store_id: e?.store_id?.map((d: any) => d?.value) ?? [],
                discount_type: e?.discount_type?.value,
                country: watch('country')?.label,
                select_all_store: watch('select_all_store') === 1 ? "yes" : "",
                image: watch('image')
                //coupon image

            })

        }
    }


    const isEnableImage = () => {
        let re = true
        if (isValid(id) && isValid(couponData?.image)) {
            re = true
        } else if (isValid(id) && !isValid(couponData?.image)) {
            re = false
        }

        return re
    }

    useEffect(() => {
        if (isError) {
            ErrorToast(finalError?.data?.message)
        }
    }, [isError, finalError])

    useEffect(() => {
        if (isSuccess) {
            navigate(-1)
        }
    }, [isSuccess])

    useEffect(() => {
        if (isError) {
            const e: any = finalError
            log('eeeeeee', e)
            setInputErrors(e?.data?.payload, setError)
        }
    }, [isError, finalError])

    useEffect(() => {
        if (isValid(customerId) && watch('usage_limit')) {
            setValue('usage_limit_per_user', watch('usage_limit'))
        }
    }, [customerId, watch('usage_limit')])

    //Clear store_id fiels when select_all_store is checked
    useEffect(() => {
        if (watch('select_all_store') === 1) {
            setValue('store_id', [])
        }
    }, [watch('select_all_store')])

    // log('couponData', couponData?.image)

    const isEnableRequired = () => {
        let re = false
        if (userType === UserType.Admin || userType === UserType.AdminEmployee) {
            if (watch('select_all_store') === 1) {
                re = false
            } else {
                re = true
            }
        } else if (isValid(id) && !isValid(couponData?.image)) {
            re = true
        }

        return re
    }
    return (
        <>
            <Header
                onClickBack={() => navigate(-1)}
                goBackTo
                title={isValid(id) ? FM('update-coupon') : <>{FM('create-coupon')}</>}
            />
            {loading ? (
                <>
                    <Row>
                        <Col md='8' className='d-flex align-items-stretch'>
                            <Card>
                                <CardBody>
                                    <Row>
                                        <Col md='6'>
                                            <Shimmer style={{ height: 40 }} />
                                        </Col>
                                        <Col md='6'>
                                            <Shimmer style={{ height: 40 }} />
                                        </Col>
                                        <Col md='12' className='mt-2'>
                                            <Shimmer style={{ height: 320 }} />
                                        </Col>
                                    </Row>
                                </CardBody>
                            </Card>
                        </Col>
                        <Col md='4' className='d-flex align-items-stretch'>
                            <Card>
                                <CardBody>
                                    <Row>
                                        <Col md='12'>
                                            <Shimmer style={{ height: 40 }} />
                                        </Col>
                                        <Col md='12' className='mt-2'>
                                            <Shimmer style={{ height: 320 }} />
                                        </Col>
                                    </Row>
                                </CardBody>
                            </Card>
                        </Col>
                    </Row>
                </>
            ) : (
                <>
                    <Form onSubmit={handleSubmit(onSubmit)}>
                        <Row>
                            <Col md='8' className='d-flex align-items-stretch'>
                                <Card>
                                    <CardBody>
                                        {
                                            <>
                                                <Row>
                                                    <Hide IF={isValid(customerId)}>
                                                        <>
                                                            <Hide IF={isValid(couponData?.id)}>
                                                                <Col md='4'>
                                                                    <FormGroupCustom
                                                                        tooltip={FM('country')}
                                                                        label={FM('country')}
                                                                        placeholder={FM('country')}
                                                                        //   noLabel
                                                                        async
                                                                        isClearable
                                                                        path={ApiEndpoints.get_countries}
                                                                        selectLabel='name'
                                                                        selectValue={'id'}
                                                                        defaultOptions
                                                                        loadOptions={loadDropdown}
                                                                        // modifyDropdownData={(d: any) => {
                                                                        //     return {
                                                                        //         ...d,
                                                                        //         currency: `${d?.name} / (${d?.currency_code ?? d?.currency_symbol})`
                                                                        //     }
                                                                        // }}
                                                                        jsonData={{ view_all: 'yes' }}
                                                                        formData={{ view_all: 'yes' }}
                                                                        name={'country'}
                                                                        type={'select'}
                                                                        className='mb-1'
                                                                        control={control}
                                                                        rules={{ required: true }}
                                                                        prepend={
                                                                            <Show IF={isValid(watch('currency')?.extra?.currency_symbol)}>
                                                                                <InputGroupText className=''>
                                                                                    {isValid(watch('currency')?.extra?.currency_symbol) ? (
                                                                                        watch('currency')?.extra?.currency_symbol
                                                                                    ) : (
                                                                                        <span>&#36;</span>
                                                                                    )}
                                                                                    {/* </span> */}
                                                                                </InputGroupText>
                                                                            </Show>
                                                                        }
                                                                    />
                                                                </Col>
                                                            </Hide>

                                                            <Col md='8'>
                                                                <BsTooltip
                                                                    title={FM('select-the-store-where-you-want-to-add-coupon')}
                                                                >
                                                                    <>
                                                                        <FormGroupCustom
                                                                            key={`user-${user?.store_id}-${watch('select_all_store')}-${state.country}`}
                                                                            label={FM('store')}
                                                                            name={'store_id'}

                                                                            type={'select'}
                                                                            isMulti
                                                                            isDisabled={
                                                                                isValid(param?.id) || watch('select_all_store') === 1 || !isValid(state.country)
                                                                            }
                                                                            className='mb-1'
                                                                            path={
                                                                                userType === UserType.Store ||
                                                                                    userType === UserType?.Employee ||
                                                                                    userType === UserType.GateGuard
                                                                                    ? ApiEndpoints.store_substore_list + user?.store_id
                                                                                    : ApiEndpoints.store_option
                                                                            }

                                                                            modifyDropdownData={(d: any) => {
                                                                                return {
                                                                                    ...d,
                                                                                    name: `${d?.name} / (${d?.store_setting?.store_name ??
                                                                                        d?.store_setting?.store_name
                                                                                        })`
                                                                                }
                                                                            }}
                                                                            selectLabel='name'
                                                                            selectValue={'id'}
                                                                            async
                                                                            jsonData={{
                                                                                with_substore: 'yes',
                                                                                country: state.country
                                                                            }}
                                                                            prepend={
                                                                                <InputGroupText className='p-25'>
                                                                                    <BsTooltip title={FM('select-all-store')}>
                                                                                        <FormGroupCustom
                                                                                            noLabel
                                                                                            label={FM('select-all-store')}
                                                                                            name={'select_all_store'}
                                                                                            isDisabled={isValid(param?.id)}
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
                                                                            searchItem='search'
                                                                            defaultOptions
                                                                            loadOptions={loadDropdown}
                                                                            control={control}
                                                                            rules={{
                                                                                required: isEnableRequired()

                                                                            }}
                                                                        />
                                                                    </>
                                                                </BsTooltip>
                                                            </Col>
                                                        </>
                                                    </Hide>
                                                    <Col md='4'>
                                                        <BsTooltip title={FM('enter-coupon-name-for-example-discount10')}>
                                                            <FormGroupCustom
                                                                label={FM('coupon-code')}
                                                                name={'coupon_code'}
                                                                type={'text'}
                                                                isDisabled={isValid(param?.id)}
                                                                className='mb-2'
                                                                inputClassName={'text-uppercase'}
                                                                // message={FM('enter-coupon-name-for-example-discount10')}
                                                                errorMessage={FM('coupon-validation-message')}
                                                                control={control}
                                                                rules={{
                                                                    required: true,
                                                                    pattern: Patterns.AlphaOnly,
                                                                    minLength: 4,
                                                                    maxLength: 10
                                                                }}
                                                            />
                                                        </BsTooltip>
                                                    </Col>
                                                    <Col md='4'>
                                                        <BsTooltip title={FM('select-discount-type-fixed-or-percentage')}>
                                                            <FormGroupCustom
                                                                name={`discount_type`}
                                                                type={'select'}
                                                                label={FM('discount-type')}
                                                                className='mb-1'
                                                                control={control}
                                                                selectOptions={createConstSelectOptions(CouponType, FM)}
                                                                onChangeValue={(e) => {
                                                                    if (e?.value === 1) {
                                                                        setValue('is_unlimited', 0)
                                                                    }
                                                                }}
                                                                rules={{ required: true }}
                                                            />
                                                        </BsTooltip>
                                                    </Col>

                                                    <Col md='4'>
                                                        <BsTooltip
                                                            title={FM(
                                                                'if-discount-type-is-fixed-then-enter-discounted-amount-and-if-discount-type-is-percent-then-enter-discount-percentage'
                                                            )}
                                                        >
                                                            <FormGroupCustom
                                                                label={FM('discount-amount')}
                                                                name={'discount_value'}
                                                                type={'number'}
                                                                className='mb-2'
                                                                control={control}
                                                                rules={{
                                                                    required: true,
                                                                    pattern: Patterns.NumberOnly,
                                                                    min: 0,
                                                                    max: watch('discount_type')?.value === 2 ? 100 : undefined
                                                                }}
                                                                append={
                                                                    watch(`discount_type`)?.value === 2 ? (
                                                                        <InputGroupText>%</InputGroupText>
                                                                    ) : null
                                                                }
                                                            />
                                                        </BsTooltip>
                                                    </Col>
                                                    <Col md='4'>
                                                        <BsTooltip title={FM('enter-description-of-the-coupon-code')}>
                                                            <FormGroupCustom
                                                                label={FM('description')}
                                                                name={'description'}
                                                                type={'text'}
                                                                className='mb-2'
                                                                control={control}
                                                                rules={{
                                                                    required: true,
                                                                    validate: (v) => {
                                                                        return isValid(v) ? !SpaceTrim(v) : true
                                                                    }
                                                                }}
                                                            />
                                                        </BsTooltip>
                                                    </Col>
                                                    <Col md='4'>
                                                        <BsTooltip
                                                            title={FM('enter-minimum-purchase-amount-to-apply-this-coupon-code')}
                                                        >
                                                            <FormGroupCustom
                                                                label={FM('min-applicable-amount')}
                                                                name={'min_applicable_amount'}
                                                                type={'number'}
                                                                className='mb-2'
                                                                step='any'
                                                                control={control}
                                                                rules={{
                                                                    required: true,
                                                                    pattern: Patterns.NumberOnly,
                                                                    min:
                                                                        watch('discount_type')?.value === CouponType.fixed
                                                                            ? Number(watch('discount_value'))
                                                                            : 0.1
                                                                }}
                                                            />
                                                        </BsTooltip>
                                                    </Col>
                                                    <Show IF={watch('discount_type')?.value === 2}>
                                                        <Col md='4'>
                                                            <BsTooltip
                                                                title={FM(
                                                                    'enter-maximum-discount-amount-applicable-in-this-coupon-code'
                                                                )}
                                                            >
                                                                <FormGroupCustom
                                                                    key={`${watch('is_unlimited')}`}
                                                                    name={'max_discount'}
                                                                    type={'number'}
                                                                    label={FM('max-discount')}
                                                                    isDisabled={watch(`is_unlimited`) === 1}
                                                                    className='mb-2'
                                                                    control={control}
                                                                    rules={{
                                                                        required: false,
                                                                        pattern: Patterns.NumberOnly
                                                                    }}
                                                                    prepend={
                                                                        <InputGroupText className='p-25'>
                                                                            <BsTooltip title={FM('no-restriction')}>
                                                                                <FormGroupCustom
                                                                                    key={`${watch('max_discount')}`}
                                                                                    noLabel
                                                                                    label={FM('unlimited')}
                                                                                    //   defaultValue={
                                                                                    //     watch(`product_variants.${index}.quantity`) >=
                                                                                    //     Number(9999999999)
                                                                                    //       ? 1
                                                                                    //       : 0
                                                                                    //   }
                                                                                    name={`is_unlimited`}
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
                                                            </BsTooltip>
                                                        </Col>
                                                    </Show>
                                                    <Col md='4'>
                                                        <BsTooltip title={FM('enter-usage-limit-in-this-coupon-code')}>
                                                            <FormGroupCustom
                                                                name={'usage_limit'}
                                                                type={'number'}
                                                                label={FM('usage-limit')}
                                                                className='mb-2'
                                                                control={control}
                                                                feedback={
                                                                    "usage-limit-can't-be-greater-then-the-per-person-usage-limit"
                                                                }
                                                                rules={{
                                                                    required: true,
                                                                    pattern: Patterns.NumberOnly,
                                                                    min: 0
                                                                    //   validate: (value) => value > watch('usage_limit_per_user')
                                                                }}
                                                            />
                                                        </BsTooltip>
                                                    </Col>
                                                    <Col md='4'>
                                                        <BsTooltip
                                                            title={FM('enter-maximum-per-person-usage-limit-of-this-coupon-code')}
                                                        >
                                                            <FormGroupCustom
                                                                key={`${customerId}- ${watch('usage_limit')}}`}
                                                                name={'usage_limit_per_user'}
                                                                type={'number'}
                                                                isDisabled={isValid(customerId)}
                                                                label={FM('usage-limit-per-user')}
                                                                className='mb-2'
                                                                control={control}
                                                                rules={{
                                                                    required: true,
                                                                    pattern: Patterns.NumberOnly,
                                                                    min: 0,
                                                                    max: watch('usage_limit')
                                                                }}
                                                            />
                                                        </BsTooltip>
                                                    </Col>

                                                    <Col md='4'>
                                                        <BsTooltip title={FM('enter-expiry-date-of-coupon-code')}>
                                                            <FormGroupCustom
                                                                name={'expiry_date'}
                                                                type={'date'}
                                                                label={FM('expiry-date')}
                                                                datePickerOptions={{ minDate: formatDate(new Date()) }}
                                                                className='mb-2'
                                                                control={control}
                                                                rules={{ required: true }}
                                                            />
                                                        </BsTooltip>
                                                    </Col>
                                                </Row>
                                            </>
                                        }
                                    </CardBody>
                                </Card>
                            </Col>
                            <Col md='4' className='d-flex align-items-stretch'>
                                <Card>
                                    <CardBody>

                                        <Row>
                                            <Show IF={isEnableImage()}>
                                                <Col>
                                                    <Label>
                                                        {FM('coupon-image')}
                                                    </Label>
                                                </Col>
                                                <Col md="12">
                                                    <div
                                                        className="card text-center mb-0 "
                                                        style={{
                                                            borderRadius: "15px"
                                                            // background: `linear-gradient(${colorsD.join(", ")})`

                                                        }}
                                                    >
                                                        <BsTooltip title={FM('upload-the-image-of-your-coupon')}>
                                                            <SimpleImageUpload
                                                                width={400}
                                                                height={150}
                                                                className=''
                                                                params={{
                                                                    for: 'coupon'
                                                                }}
                                                                value={watch('image')}
                                                                name={`image`}
                                                                setValue={setValue}
                                                            />
                                                        </BsTooltip>
                                                    </div>
                                                </Col>
                                            </Show>
                                            <Hide IF={isValid(watch('image'))}>
                                                <Col md='12'>
                                                    <hr />
                                                    <CouponCard expiry={watch("expiry_date")} discount={watch('discount_value')}
                                                        level={watch('description')}
                                                        colors={[couponColor]}
                                                        title={watch("coupon_code")}
                                                        currency={isValid(couponData?.id) ? couponData?.store_setting?.currency : watch('country')?.extra?.currency_code}
                                                        discount_type={watch('discount_type')?.value} />
                                                </Col>
                                            </Hide>

                                            <Col sm='12' className='border-top'>
                                                <LoadingButton
                                                    block
                                                    loading={isLoading}
                                                    disabled={!isValid(watch('coupon_code'))}
                                                    className='mt-2'
                                                    color='primary'
                                                    type='submit'
                                                >
                                                    {isValid(id)
                                                        ? FM('update')
                                                        : isValid(customerId)
                                                            ? FM('send')
                                                            : FM('save')}
                                                </LoadingButton>
                                            </Col>
                                        </Row>
                                    </CardBody>
                                </Card>
                            </Col>
                        </Row>
                    </Form>
                </>
            )}
        </>
    )
}
export default AddUpdateCoupon
