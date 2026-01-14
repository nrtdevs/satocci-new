/* eslint-disable eqeqeq */
/* eslint-disable prettier/prettier */
/* eslint-disable no-dupe-else-if */
/* eslint-disable no-mixed-operators */
import { useEffect, useReducer, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate, useParams } from 'react-router-dom'
import StickyBox from 'react-sticky-box'
import {
    Button,
    ButtonGroup,
    Card,
    CardBody,
    CardHeader,
    CardTitle,
    Col,
    Form,
    Label,
    Row
} from 'reactstrap'
import {
    useCreateOrUpdatePromotionTemplateMutation,
    useLoadPromotionTemplateDetailsByIdMutation
} from '../../../redux/RTKQuery/PromotionTemplateRTK'
import { useAppDispatch } from '../../../redux/store'
import { sendType, sendTypeSelect } from '../../../utility/Const'
import { FM, isValid, log } from '../../../utility/helpers/common'
import useUserType from '../../../utility/hooks/useUserType'
import RandomNames from '../../../utility/RandomNames'
import Show from '../../../utility/Show'
import { stateReducer } from '../../../utility/stateReducer'
import {
    createConstSelectOptions,
    fillObject,
    getKeyByValue,
    getUserData,
    setValues,
    SuccessToast
} from '../../../utility/Utils'
import LoadingButton from '../../components/buttons/LoadingButton'
import FormGroupCustom from '../../components/formGroupCustom/FormGroupCustom'
import Header from '../../components/header'
import Shimmer from '../../components/shimmers/Shimmer'
import SimpleImageUpload from '../../components/SimpleImageUpload'
import ApiEndpoints from '../../../utility/http/ApiEndpoints'
import { loadDropdown } from '../../../utility/apis/dropdowns'
import { get } from 'sortablejs'
import Hide from '../../../utility/Hide'

export type PromotionParamsType = {
    id?: any | null
    customer?: any | null
    image_path?: any | null
    promotion_type?: any | null
    coupon_code?: any | null
    content_id?: any
    user_ids?: any
    is_send_to_all?: any | null
    name?: any | null
    payload?: any | null
    store_id?: any | null
    content_type?: any | null
    content_header?: any | null
    content_body?: any | null
    created_at?: any | null
    user_id?: any | null
    title?: any | null
    message?: any | null
    status_code?: any | null
    type?: any | null
    user?: any | null
    promotions?: any | null
}
interface States {
    lastRefresh?: any
    random?: any
    loading?: boolean
    text?: string
    list?: any
    active?: string
    formData?: PromotionParamsType
}

const PromotionTemplateForm = () => {
    const dispatch = useAppDispatch()
    const nav = useNavigate()
    const params = useParams()
    const form = useForm<PromotionParamsType>()
    const { handleSubmit, control, reset, setValue, watch } = form
    const [loading, setLoading] = useState(false)

    const initState: States = {
        lastRefresh: new Date().getTime(),
        random: null,
        loading: false,
        text: '',
        list: [],
        active: '1',
        formData: {
            id: null,
            store_id: null,
            content_type: null,
            promotion_type: null,
            coupon_code: null,
            image_path: null,
            content_header: null,
            content_body: null
        }
    }

    const reducers = stateReducer<States>
    const [state, setState] = useReducer(reducers, initState)

    const [createPromotion, result] = useCreateOrUpdatePromotionTemplateMutation()
    const [getNotification, { data, isSuccess, isLoading }] =
        useLoadPromotionTemplateDetailsByIdMutation()

    const getData: any = data?.payload

    useEffect(() => {
        if (result.isSuccess) {
            SuccessToast(FM('executed-successfully'))
            reset()
        }
    }, [result])
    useEffect(() => {
        if (isValid(params?.id)) {
            getNotification({ id: params?.id })
        }
    }, [params?.id])

    useEffect(() => {
        if (isValid(getData) && getData !== undefined) {
            const f = fillObject<PromotionParamsType>(state.formData, getData)
            const formData: PromotionParamsType = {
                ...f,
                promotion_type: {
                    value: `${getData?.promotion_type}`,
                    label: FM(getKeyByValue(sendTypeSelect, `${getData?.promotion_type}`))
                },
                coupon_code: {
                    value: getData?.coupon?.id,
                    label: getData?.coupon_code
                },
                image_path: getData?.image_path,
                content_type: {
                    value: getData?.content_type,
                    label: FM(getKeyByValue(sendType, getData?.content_type))
                }
            }
            setValues<PromotionParamsType>(formData, setValue)
        }
    }, [getData])

    const onSubmit = (e: PromotionParamsType) => {
        if (isValid(params?.id)) {
            createPromotion({
                id: params?.id,
                ...e,
                coupon_code: e?.coupon_code?.label ?? null,
                image_path: e?.image_path ?? '',
                content_type: e?.content_type?.value
            })
        } else {
            createPromotion({
                ...e,
                coupon_code: e?.coupon_code?.label ?? null,
                image_path: e?.image_path ?? '',
                content_type: e?.content_type?.value
            })
        }
    }

    useEffect(() => {
        if (result?.isSuccess) {
            nav(-1)
        }
    }, [result?.isSuccess])

    useEffect(() => {
        if (!isValid(params?.id)) {
            setValue('content_body', '')
        }
    }, [watch('content_type')])

    useEffect(() => {
        if (!isValid(getData?.id)) {
            setValue('image_path', watch('coupon_code')?.extra?.image)
        }
    }, [watch('coupon_code')?.value])

    log('getData', watch('coupon_code'))
    return (
        <>
            <Header
                onClickBack={() => nav(-1)}
                goBackTo
                title={
                    isValid(params?.id) ? (
                        FM('promotion-template-update')
                    ) : (
                        <>{FM('promotion-template-create')}</>
                    )
                }
            ></Header>
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
                        <Row style={{ display: 'flex', alignItems: 'flex-start' }}>
                            <Col md='8' className=''>
                                <Show IF={watch('content_type')?.value === 1 || watch('content_type')?.value === 2}>
                                    <Card>
                                        <CardHeader className='border-bottom'>
                                            <CardTitle>
                                                {watch('content_type')?.value === 1 ? FM('push') : FM('email')}
                                            </CardTitle>
                                        </CardHeader>
                                        <CardBody className='pt-2'>
                                            <Row>
                                                <Col md='12'>
                                                    <FormGroupCustom
                                                        name={'content_header'}
                                                        label={FM('content-header')}
                                                        type={'text'}
                                                        className='mb-2'
                                                        control={control}
                                                        rules={{ required: true }}
                                                    />
                                                </Col>
                                                <Col md='12'>
                                                    <FormGroupCustom
                                                        key={
                                                            watch('content_type')?.value === 2
                                                                ? `${getData}`
                                                                : getData?.content_body
                                                        }
                                                        noGroup={watch('content_type')?.value === 2}
                                                        name={'content_body'}
                                                        type={watch('content_type')?.value === 1 ? 'textarea' : 'editor'}
                                                        label={FM('content-body')}
                                                        defaultValue={
                                                            watch('content_type')?.value === 2
                                                                ? isValid(getData)
                                                                : getData?.content_body
                                                        }
                                                        className='mb-2'
                                                        control={control}
                                                        rules={{ required: false }}
                                                    />
                                                </Col>

                                                {/* Coupon code  */}
                                                {/* promotion Type : 1 = text , 2 = image & */}
                                            </Row>
                                            <Row>
                                                <Col md='4'>
                                                    {/* <Label>{FM('product-image')}</Label> */}

                                                    <SimpleImageUpload
                                                        params={{ for: 'promotion' }}
                                                        value={watch('image_path')}
                                                        name='image_path'
                                                        height={100}
                                                        width={250}
                                                        setValue={setValue}
                                                    />
                                                </Col>
                                                <Hide IF={watch('content_type')?.value === sendType.push}>
                                                    <Col md='8'>
                                                        <FormGroupCustom
                                                            label={FM('coupon-code')}
                                                            placeholder={FM('coupon-code')}
                                                            async
                                                            isClearable
                                                            path={ApiEndpoints?.coupon_list}
                                                            selectLabel='coupon_code'
                                                            selectValue={'id'}
                                                            defaultOptions
                                                            loadOptions={loadDropdown}
                                                            jsonData={{
                                                                status: '1'
                                                            }}
                                                            formData={{
                                                                status: '1'
                                                            }}
                                                            name={`coupon_code`}
                                                            method='get'
                                                            type={'select'}
                                                            className='mb-1'
                                                            control={control}
                                                            rules={{ required: false }}
                                                        />
                                                    </Col>
                                                </Hide>
                                            </Row>
                                        </CardBody>
                                    </Card>
                                </Show>
                                <Show IF={watch('content_type')?.value === undefined}>
                                    <Card>
                                        <CardHeader className='border-bottom'>
                                            <CardTitle>{FM('content-note')}</CardTitle>
                                        </CardHeader>
                                        <CardBody className='pt-2'>{FM('please-select-send-type')}</CardBody>
                                    </Card>
                                </Show>
                            </Col>

                            <StickyBox className='col-md-4' offsetBottom={50}>
                                <Card>
                                    <CardBody className='pt-2'>
                                        <Row>
                                            <Col md='12'>
                                                <FormGroupCustom
                                                    name={'content_type'}
                                                    type={'select'}
                                                    isDisabled={isValid(params?.id)}
                                                    isClearable
                                                    label={FM('send-type')}
                                                    className='mb-2'
                                                    selectOptions={createConstSelectOptions(sendType, FM)}
                                                    control={control}
                                                    rules={{ required: true }}
                                                />
                                            </Col>
                                        </Row>
                                    </CardBody>
                                </Card>

                                <Col sm='12' className='border-top'>
                                    <LoadingButton
                                        block
                                        loading={result.isLoading}
                                        className='mt-2 mb-3'
                                        color='primary'
                                        type='submit'
                                    >
                                        <>{FM('save')}</>
                                    </LoadingButton>
                                </Col>
                            </StickyBox>
                        </Row>
                    </Form>
                </>
            )}
        </>
    )
}

export default PromotionTemplateForm
