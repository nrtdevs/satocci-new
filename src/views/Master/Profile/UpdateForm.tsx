/* eslint-disable prettier/prettier */
/* eslint-disable no-mixed-operators */
import '@styles/react/apps/app-users.scss'

import { useEffect, useReducer, useState } from 'react'
import { useForm } from 'react-hook-form'
import {
    Card,
    CardBody,
    CardHeader,
    CardTitle,
    Col,
    Form,
    Row,
    TabContent,
    TabPane
} from 'reactstrap'
import { profileParams, useUpdateProfileMutation } from '../../../redux/RTKQuery/StoreRTK'
import { FM, isValid, log } from '../../../utility/helpers/common'
import { stateReducer } from '../../../utility/stateReducer'
import LoadingButton from '../../components/buttons/LoadingButton'
import FormGroupCustom from '../../components/formGroupCustom/FormGroupCustom'

import GoogleMapReact from 'google-map-react'
import { MapPin } from 'react-feather'
import { useDispatch } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'
import StickyBox from 'react-sticky-box'
import { useProfileDetailsMutation } from '../../../redux/RTKQuery/AppSettingsRTK'
import { handleLogin } from '../../../redux/authentication'
import { UserType, forDecryption, mapApiKey } from '../../../utility/Const'
import Hide from '../../../utility/Hide'
import Show from '../../../utility/Show'
import {
    JsonParseValidate,
    decrypt,
    decryptObject,
    fillObject,
    getAge,
    getUserData,
    setValues
} from '../../../utility/Utils'
import GoogleMaps from '../../../utility/hooks/useMaps'
import useUserType from '../../../utility/hooks/useUserType'
import SimpleImageUpload from '../../components/SimpleImageUpload'
import Header from '../../components/header'
import Shimmer from '../../components/shimmers/Shimmer'
export type StoreParamsType = {
    id?: number | null
    country_code?: any
    category_id?: any | null
    languages?: any
    store_id?: string | null
    store_setting?: any | null
    name?: string | null
    email?: string | null
    unique_id?: any | null
    password?: string | null
    mobile_number?: string | null
    description?: string | null
    website?: string | null
    logo?: string | null
    personal_number?: any | null
    store_qr_code_image?: any | null
    store_email?: string | null
    store_name?: string | null
    store_number?: string | null | number
    contact_person_number?: string | null
    contact_person_name?: string | null
    address?: string | null
    state?: any | null
    city?: string | null
    currency?: string | null
    country?: string | null
    latitude?: string | null | number
    longitude?: string | null | number
    subscription_type?: any // 1: Per transaction 2: Fixed (Monthly),
    amount?: number | null
    sub_store_limit?: number | null
    status?: any // 1: Active 2: Deleted 0: Inactive
    created_at?: string | null
    updated_at?: string | null
    deleted_at?: string | null
    store_subscription?: any
    subscription_terms_select_value?: any | null // for internal use only
    fakeLogo?: string | null // only for internal use
    days_for_return?: any | null
}

type StoreType = any
type centerProps = {
    lat: number
    lng: number
}
type addressProps = {
    lat: number
    lng: number
    state?: string | null
    country?: string | null
    country_code?: string
    city?: string | null
    zip_code?: string | null
    full_address?: string | null
}
interface States {
    category?: boolean
    country_code?: string
    subcategory?: boolean
    language?: any
    search?: any
    ip?: boolean
    patient?: boolean
    loading?: boolean
    text?: string
    zoom?: number
    center?: centerProps
    address?: addressProps
    list?: any
    active?: string
    formData?: profileParams
}
const AddUpdateForm = () => {
    const user = getUserData()
    const params = useParams()
    const nav = useNavigate()
    const userType = useUserType()
    const form = useForm<profileParams>({
        defaultValues: {
            notify_guard_frequency: 1
        }
    })
    const { handleSubmit, control, reset, setValue, watch } = form
    const [loading, setLoading] = useState(false)
    const options: any = { delimiters: ['-'], blocks: [8, 4] }
    const initState: States = {
        category: false,
        subcategory: false,
        ip: false,
        patient: false,
        loading: false,
        search: '',
        language: [],
        text: '',
        list: [],

        active: '1',
        zoom: 20,
        center: undefined,
        formData: {
            password: null,
            city: null,
            address: null,
            name: null,
            latitude: null,
            longitude: null,
            country: null,
            mobile_number: null,
            personal_number: null,
            // unique_id: null,
            is_change_password: null,
            days_for_return: null
        }
    }
    const reducers = stateReducer<States>
    const dispatch = useDispatch()
    const [state, setState] = useReducer(reducers, initState)
    // const options: any = { delimiters: ['-'], blocks: [8, 4] }
    const [updateProfile, result] = useUpdateProfileMutation()
    const [loadProfile, { data, isSuccess, isLoading, isError }] = useProfileDetailsMutation()
    const datas = data?.payload

    useEffect(() => {
        if (isSuccess && userType === UserType.Store) {
            setState({
                center: {
                    lat: Number(datas?.store_setting?.latitude),
                    lng: Number(datas?.store_setting?.longitude)
                },
                address: {
                    lat: Number(datas?.store_setting?.latitude),
                    lng: Number(datas?.store_setting?.longitude),
                    city: datas?.store_setting?.city,
                    state: datas?.store_setting?.state,
                    country_code: state?.country_code,
                    country: datas?.store_setting?.country,
                    zip_code: datas?.store_setting?.zip_code,
                    full_address: datas?.store_setting?.address
                }
            })
        }
    }, [data, isSuccess])
    const onSubmit = (e: profileParams) => {
        const forStore: profileParams = {
            ...datas?.store_setting,
            ...e,
            unique_id: datas?.unique_id,
            organisation_address: e?.organisation_address,
            organisation_number: e?.organisation_number,
            registered_company_name: e?.registered_company_name,
            city: state?.address?.city,
            latitude: String(state?.center?.lat),
            longitude: String(state?.center?.lng),
            country_code: state?.country_code,

            country: state?.address?.country,
            address: state?.address?.full_address,
            is_change_password: 0
        }
        const forAdmin: profileParams = {
            ...e,
            city: datas?.city,
            unique_id: datas?.unique_id,
            country: datas?.country,
            address: decrypt(datas?.address),
            is_change_password: 0
        }

        if (userType === UserType.Store) {
            updateProfile(forStore)
        } else if (userType === UserType.Employee) {
            updateProfile({
                ...e,
                unique_id: datas?.unique_id,
                address: decrypt(datas?.address),

                country: JsonParseValidate(datas?.country),
                is_change_password: 0
            })
        } else {
            updateProfile(forAdmin)
        }
    }

    useEffect(() => {
        log('dkldsbjfkldsjfbkldsjf', result)
        if (result?.isSuccess) {
            const re = result?.data?.payload as any
            dispatch(
                handleLogin({
                    ...user,
                    avatar: re?.avatar,
                    city: re.city,
                    country: re?.country,
                    latitude: String(re?.address?.lat),
                    longitude: String(re?.address?.lng),
                    address: re?.full_address,
                    name: isValid(re?.name) ? re?.name : user?.name,
                    mobile_number: re?.mobile_number,
                    personal_number: re?.personal_number
                })
            )
        }
    }, [result])

    //   const onSubmit = (e: profileParams) => {
    //     updateProfile({
    //       formData: {}
    //     })
    //   }

    const getCurrentPositionLoacation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const lat = position.coords.latitude
                    const lng = position.coords.longitude
                    setState({ center: { lat, lng } })
                },
                () => { }
            )
        } else {
            log(
                'It seems like Geolocation, which is required for this page, is not enabled in your browser. Please use a browser which supports it.'
            )
        }
    }
    ///////////////////////////////
    useEffect(() => {
        if (isValid(state.address)) {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                    (position) => {
                        const lat = Number(state?.address?.lat)
                        const lng = Number(state?.address?.lng)
                        setState({ center: { lat, lng } })
                    },
                    () => { }
                )
            } else {
                log(
                    'It seems like Geolocation, which is required for this page, is not enabled in your browser. Please use a browser which supports it.'
                )
            }
        }
    }, [state.address])

    useEffect(() => {
        if (result.isSuccess) {
            nav(-1)
        }
    }, [result])

    useEffect(() => {
        if (isValid(params?.id)) {
            loadProfile({})
        }
    }, [params?.id])

    log('user', user, 'profile', datas)
    useEffect(() => {
        if (isSuccess) {
            if (userType === UserType.Store) {
                const f = fillObject<profileParams>(state?.formData, datas)
                const formData: profileParams = {
                    ...f,
                    avatar: datas?.avatar,
                    address: datas?.address,
                    store_email: datas?.store_setting?.store_email,
                    opening_time: datas?.store_setting?.opening_time,
                    closing_time: datas?.store_setting?.closing_time,
                    notify_guard_frequency: datas?.store_setting?.notify_guard_frequency,
                    organisation_address: datas?.store_setting?.organisation_address,
                    organisation_number: datas?.store_setting?.organisation_number,
                    registered_company_name: datas?.store_setting?.registered_company_name,
                    name: datas?.name,
                    city: state?.address?.city,
                    days_for_return: datas?.store_setting?.days_for_return
                }
                // log(formData)

                setValues<profileParams>(decryptObject(forDecryption, formData), setValue)
            } else if (userType === UserType.Employee || userType === UserType.GateGuard || userType === UserType.AdminEmployee) {
                // const countryParse = JsonParseValidate(data?.payload?.country)
                const f = fillObject<profileParams>(state?.formData, data?.payload)
                const formData: profileParams = {
                    ...f,
                    avatar: data?.payload?.avatar,
                    address: data?.payload?.address,
                    country: data?.payload?.country,
                    city: data?.payload?.city,
                    zip_code: data?.payload?.zip_code,
                    email: data?.payload?.email,
                    postal_area: data?.payload?.postal_area,
                    name: data?.payload?.name
                }
                // log(formData)

                setValues<profileParams>(decryptObject(forDecryption, formData), setValue)
            } else if (userType === UserType.Admin) {
                const f = fillObject<profileParams>(state?.formData, data?.payload)
                const formData: profileParams = {
                    ...f,
                    // logo: user?.avatar,\
                    address: data?.payload?.address,
                    personal_number: data?.payload?.personal_number,
                    avatar: data?.payload?.avatar,
                    organisation_address: data?.payload?.organisation_address,
                    organisation_number: data?.payload?.organisation_number,
                    registered_company_name: data?.payload?.registered_company_name,
                    country: data?.payload?.country,
                    city: data?.payload?.city,
                    zip_code: data?.payload?.zip_code,
                    email: data?.payload?.email,
                    postal_area: data?.payload?.postal_area,
                    name: data?.payload?.name
                }
                setValues<profileParams>(decryptObject(forDecryption, formData), setValue)
            }
        }
    }, [data])

    const AnyReactComponent = ({ lat, lng, text }: { text: any; lng?: number; lat?: number }) => (
        <>
            <div className='pin'></div>
            <div className='pulse'></div>
        </>
    )
    const handleApiLoaded = (m: any, f: any) => {
        // use map and maps objects
        // cLog(map)
        const Geocoder = new m.maps.Geocoder()
        // const addresses = Geocoder.getFromLocation(form.latitude, form.longitude, 1);
        Geocoder.geocode({ location: { lat: f.lat, lng: f.lng } }, (results: any, status: any) => {
            log(results)
            if (status !== m.maps.GeocoderStatus.OK) {
                alert(status)
            }
            // This is checking to see if the Geoeode Status is OK before proceeding
            if (status === m.maps.GeocoderStatus.OK) {
                // cLog(results);
                const address = results[0].formatted_address
                log(address)
                //   formatAndSetData({ results: results })
            }
        })
        // log(Geocoder)
    }
    return (
        <>
            <Header
                // goBackTo={getPath('admin.stores')}
                onClickBack={() => nav(-1)}
                goBackTo
                title={FM('update-profile')}
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
                            <Show IF={userType === UserType.Store}>
                                <Col md='8' className=''>
                                    <Card>
                                        <CardHeader className='border-bottom'>
                                            <CardTitle>
                                                <>{FM('address')}</>
                                            </CardTitle>

                                            <LoadingButton
                                                type='button'
                                                loading={false}
                                                className={'btn btn-primary btn-icon'}
                                                size='sm'
                                                onClick={getCurrentPositionLoacation}
                                                color='primary'
                                                tooltip={FM('get-current-location')}
                                            >
                                                <MapPin size={14} />
                                            </LoadingButton>
                                        </CardHeader>
                                        <CardBody className='pt-1'>
                                            <TabContent className='' activeTab={state?.active}>
                                                <TabPane tabId='1'>
                                                    <Row>
                                                        <Col md='12'>
                                                            <Row>
                                                                <Col md='6'>
                                                                    <FormGroupCustom
                                                                        tooltip={FM('registered-company-name')}
                                                                        label={FM('registered-company-name')}
                                                                        name={'registered_company_name'}
                                                                        type={'text'}
                                                                        className='mb-2'
                                                                        control={control}
                                                                        rules={{ required: true, maxLength: 50 }}
                                                                        
                                                                    />
                                                                </Col>
                                                                <Col md='6'>
                                                                    <FormGroupCustom
                                                                        tooltip={FM('store-email')}
                                                                        label={FM('store-email')}
                                                                        name={'store_email'}
                                                                        type={'email'}
                                                                        className='mb-2'
                                                                        control={control}
                                                                        rules={{ required: true, maxLength: 50 }}
                                                                    />
                                                                </Col>
                                                                <Col md='6'>
                                                                    <FormGroupCustom
                                                                        tooltip={FM('organisation-number')}
                                                                        label={FM('organisation-number')}
                                                                        name={'organisation_number'}
                                                                        type={'number'}
                                                                        className='mb-2'
                                                                        control={control}
                                                                        rules={{ required: true, maxLength: 50 }}
                                                                    />
                                                                </Col>
                                                                <Col md='6'>
                                                                    <FormGroupCustom
                                                                        tooltip={FM('guard-frequency')}
                                                                        label={FM('guard-frequency')}
                                                                        name={'notify_guard_frequency'}
                                                                        type={'number'}
                                                                        className='mb-2'
                                                                        control={control}
                                                                        rules={{ required: true, min: 1, max: 10 }}
                                                                    />
                                                                </Col>

                                                                <Col md='6'>
                                                                    <FormGroupCustom
                                                                        tooltip={FM('open-time')}
                                                                        label={FM('open-time')}
                                                                        type={'time'}
                                                                        control={control}
                                                                        name='opening_time'
                                                                        className='mb-2'
                                                                        rules={{ required: true }}
                                                                    />
                                                                </Col>

                                                                <Col md='6'>
                                                                    <FormGroupCustom
                                                                        tooltip={FM('close-time')}
                                                                        name={'closing_time'}
                                                                        label={FM('close-time')}
                                                                        type={'time'}
                                                                        className='mb-2'
                                                                        control={control}
                                                                        rules={{ required: true }}
                                                                    />
                                                                </Col>
                                                                <Col md='6'>
                                                                    <FormGroupCustom
                                                                        tooltip={FM('days-for-return')}
                                                                        name={'days_for_return'}
                                                                        label={FM('days-for-return')}
                                                                        type={'text'}
                                                                        className='mb-2'
                                                                        control={control}
                                                                        rules={{ required: false }}
                                                                    />
                                                                </Col>
                                                                <Col md='12'>
                                                                    <FormGroupCustom
                                                                        tooltip={FM('organisation-address')}
                                                                        label={FM('organisation-address')}
                                                                        name={'organisation_address'}
                                                                        type={'textarea'}
                                                                        className='mb-2'
                                                                        control={control}
                                                                        rules={{ required: true }}
                                                                    />
                                                                </Col>
                                                            </Row>
                                                        </Col>
                                                        <Col md='12'>
                                                            <GoogleMaps
                                                                center={state?.center}
                                                                countryCode={(e: any) => {
                                                                    setState({
                                                                        country_code: e
                                                                    })
                                                                }}
                                                                handleAddress={(e: any) => {
                                                                    setState({ address: e, center: { lat: e.lat, lng: e.lng } })
                                                                    setValue('country', e?.country)
                                                                    setValue('city', e?.city)
                                                                    log(e)
                                                                }}
                                                            />
                                                        </Col>
                                                        <Col md='12'>
                                                            <div style={{ height: '350px', width: '100%' }}>
                                                                <Show
                                                                    IF={isValid(state?.center?.lat) && isValid(state?.center?.lng)}
                                                                >
                                                                    <GoogleMapReact
                                                                        onClick={(ev) => {
                                                                            setState({ center: { lat: ev.lat, lng: ev.lng } })

                                                                            console.log('latitide = ', ev)
                                                                        }}
                                                                        options={{
                                                                            styles: [
                                                                                {
                                                                                    featureType: 'poi.business',
                                                                                    elementType: 'labels',
                                                                                    stylers: [
                                                                                        {
                                                                                            visibility: 'on'
                                                                                        }
                                                                                    ]
                                                                                }
                                                                            ]
                                                                        }}
                                                                        bootstrapURLKeys={{
                                                                            key: mapApiKey,
                                                                            language: 'en',
                                                                            region: 'in'
                                                                        }}
                                                                        yesIWantToUseGoogleMapApiInternals
                                                                        center={state.center}
                                                                        defaultZoom={state.zoom}
                                                                    >
                                                                        <AnyReactComponent
                                                                            lat={state.center?.lat}
                                                                            lng={state.center?.lng}
                                                                            text='My Marker'
                                                                        />
                                                                    </GoogleMapReact>
                                                                </Show>
                                                            </div>
                                                        </Col>
                                                    </Row>
                                                </TabPane>
                                            </TabContent>
                                        </CardBody>
                                    </Card>
                                </Col>
                            </Show>
                            <Hide IF={userType === UserType.Store}>
                                <Col md='8' className=''>
                                    <Card>
                                        <CardHeader className='border-bottom'>
                                            <CardTitle>
                                                <>{FM('address')}</>
                                            </CardTitle>
                                        </CardHeader>
                                        <CardBody className='pt-1'>
                                            <TabContent className='' activeTab={state?.active}>
                                                <TabPane tabId='1'>
                                                    <Row>
                                                        <Col md='6'>
                                                            <FormGroupCustom
                                                                label={FM('email')}
                                                                // isDisabled={userType !== UserType.Store}
                                                                name={'email'}
                                                                type={'email'}
                                                                className='mb-2'
                                                                control={control}
                                                                rules={{ required: true }}
                                                            />
                                                        </Col>

                                                        <Col md='6'>
                                                            <FormGroupCustom
                                                                label={FM('postal-area')}
                                                                isDisabled={userType !== UserType.Store}
                                                                name={'postal_area'}
                                                                type={'text'}
                                                                className='mb-2'
                                                                control={control}
                                                                rules={{ required: false }}
                                                            />
                                                        </Col>
                                                        <Show IF={userType === UserType.Employee}>
                                                            <Col md='6'>
                                                                <FormGroupCustom
                                                                    label={FM('city')}
                                                                    name={'city'}
                                                                    type={'text'}
                                                                    className='mb-2'
                                                                    control={control}
                                                                    rules={{ required: true }}
                                                                />
                                                            </Col>
                                                        </Show>

                                                        <Col md='6'>
                                                            <FormGroupCustom
                                                                label={FM('country')}
                                                                isDisabled={userType !== UserType.Store}
                                                                name={'country'}
                                                                type={'text'}
                                                                className='mb-2'
                                                                control={control}
                                                                rules={{ required: false }}
                                                            />
                                                        </Col>
                                                        <Col md='6'>
                                                            <FormGroupCustom
                                                                label={FM('zip-code')}
                                                                isDisabled={userType !== UserType.Store}
                                                                name={'zip_code'}
                                                                type={'text'}
                                                                className='mb-2'
                                                                control={control}
                                                                rules={{ required: false, min: 0, minLength: 4, maxLength: 7 }}
                                                            />
                                                        </Col>
                                                        <Col md='12'>
                                                            <FormGroupCustom
                                                                label={FM('address')}
                                                                isDisabled={userType !== UserType.Store}
                                                                name={'address'}
                                                                type={'textarea'}
                                                                className='mb-2'
                                                                control={control}
                                                                rules={{ required: false }}
                                                            />
                                                        </Col>
                                                    </Row>
                                                </TabPane>
                                            </TabContent>
                                        </CardBody>
                                    </Card>
                                </Col>
                            </Hide>

                            <StickyBox className='col-md-4' offsetBottom={50}>
                                <Row>
                                    <Col md='12'>
                                        <Card>
                                            <CardHeader className='border-bottom'>
                                                <CardTitle>
                                                    <>{FM('personal-details')}</>
                                                </CardTitle>
                                            </CardHeader>
                                            <CardBody className='pt-2'>
                                                <Row>
                                                    <Col md='12'>
                                                        <SimpleImageUpload
                                                            params={{ for: 'profile' }}
                                                            value={watch('avatar') ?? user?.avatar}
                                                            name={`avatar`}
                                                            setValue={setValue}
                                                        />
                                                    </Col>
                                                    <Col md='12'>
                                                        <Row>
                                                            <Col>
                                                                <FormGroupCustom
                                                                    label={FM('name')}
                                                                    name={'name'}
                                                                    type={'text'}
                                                                    className='mb-2'
                                                                    control={control}
                                                                    rules={{ required: true, maxLength: 50 }}
                                                                />
                                                            </Col>
                                                        </Row>
                                                    </Col>

                                                    <Col md='12'>
                                                        <FormGroupCustom
                                                            name={'mobile_number'}
                                                            type={'number'}
                                                            label={FM('mobile-number')}
                                                            className='mb-2'
                                                            control={control}
                                                            rules={{ required: true, min: 0, minLength: 9, maxLength: 13 }}
                                                        />
                                                    </Col>
                                                    {/* <Show IF={userType === UserType.AdminEmployee || userType === UserType.Employee || userType === UserType.GateGuard}> */}

                                                    <Col md='12'>
                                                        <FormGroupCustom
                                                            name={'personal_number'}
                                                            label={FM('date-of-birth')}
                                                            type={'date'}
                                                            // maskOptions={options}
                                                            //   feedback={FM('invalid-personal-number')}
                                                            className='mb-2'
                                                            placeholder='YYYYMMDD'
                                                            control={control}
                                                            rules={{
                                                                required: true

                                                            }}
                                                        />
                                                    </Col>
                                                    {/* </Show> */}
                                                    {/* <Hide IF={userType === UserType.AdminEmployee
                                                        || userType === UserType.Employee
                                                        || userType === UserType.GateGuard}>


                                                        <Col md='12'>
                                                            <FormGroupCustom
                                                                name={'personal_number'}
                                                                label={FM('personal-number')}
                                                                type={'mask'}
                                                                maskOptions={options}
                                                                //   feedback={FM('invalid-personal-number')}
                                                                className='mb-2'
                                                                placeholder='YYYYMMDD-XXXX'
                                                                control={control}
                                                                rules={{
                                                                    required: true,
                                                                    // minLength: 13,
                                                                    validate: (v) => {
                                                                        return (
                                                                            getAge(v, FM, true) &&
                                                                            String(v).replaceAll('-', '').length === 12
                                                                        )
                                                                    }
                                                                }}
                                                            />
                                                        </Col>
                                                    </Hide> */}
                                                </Row>
                                            </CardBody>
                                        </Card>
                                    </Col>
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
                                </Row>
                            </StickyBox>
                        </Row>
                    </Form>
                </>
            )}
        </>
    )
}

export default AddUpdateForm
