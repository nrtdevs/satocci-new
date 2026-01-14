/* eslint-disable eqeqeq */
/* eslint-disable no-unneeded-ternary */
/* eslint-disable prettier/prettier */
/* eslint-disable no-mixed-operators */
import '@styles/react/apps/app-users.scss'

import { useContext, useEffect, useReducer, useState } from 'react'
import { useForm } from 'react-hook-form'
import {
  ButtonProps,
  Card,
  CardBody,
  CardHeader,
  CardTitle,
  Col,
  Form,
  InputGroupText,
  Label,
  Row,
  TabContent,
  TabPane
} from 'reactstrap'
import {
  useCreateOrUpdateStoreMutation,
  useLoadStoreDetailsByIdMutation
} from '../../../redux/RTKQuery/StoreRTK'
import { getPath } from '../../../router/RouteHelper'
import { FM, isValid, isValidArray, log } from '../../../utility/helpers/common'
import { stateReducer } from '../../../utility/stateReducer'
import LoadingButton from '../../components/buttons/LoadingButton'
import FormGroupCustom from '../../components/formGroupCustom/FormGroupCustom'
// import FormGroupCustom from '../../components/formGroupCustom'
import GoogleMapReact from 'google-map-react'
import { Edit } from 'react-feather'
import { useNavigate, useParams } from 'react-router-dom'
import StickyBox from 'react-sticky-box'
import { useLanguageListMutation } from '../../../redux/RTKQuery/LanguageRTK'
import {
  SubStoreRequestParams,
  useCreateOrUpdateSubStoreMutation,
  useLoadSubStoreIdMutation
} from '../../../redux/RTKQuery/SubStoreRTK'
import { store, useAppSelector } from '../../../redux/store'
import {
  Patterns,
  UserType,
  forDecryption,
  mapApiKey,
  subscriptionStoreType
} from '../../../utility/Const'
import Hide from '../../../utility/Hide'
import { Permissions } from '../../../utility/Permissions'
import Show, { Can } from '../../../utility/Show'
import {
  createConstSelectOptions,
  createSelectOptions,
  decrypt,
  decryptObject,
  fillObject,
  formatDate,
  getKeyByValue,
  isNumbers,
  setInputErrors,
  setValues
} from '../../../utility/Utils'
import { loadDropdown } from '../../../utility/apis/dropdowns'
import { ThemeColors } from '../../../utility/context/ThemeColors'
import GoogleMaps from '../../../utility/hooks/useMaps'
import useUser from '../../../utility/hooks/useUser'
import useUserType from '../../../utility/hooks/useUserType'
import ApiEndpoints from '../../../utility/http/ApiEndpoints'
import SimpleImageUpload from '../../components/SimpleImageUpload'
import Header from '../../components/header'
import Shimmer from '../../components/shimmers/Shimmer'
import BsTooltip from '../../components/tooltip'
import SubscriptionModal from './Subscriptions/SubscriptionModal'
export type StoreParamsType = {
  // other info
  id?: number | null
  currency?: any
  created_by?: any
  registered_company_name?: any

  organisation_number?: any
  organisation_address?: any
  allow_bulk_referral?: any
  allow_promotion?: any
  country_code?: any
  parent?: any
  display_loose_product?: any
  parent_id?: any
  percentage?: any
  category_id?: any | null
  languages?: any
  store_id?: string | null
  store_setting?: any | null
  // store info
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
  // Manager Info
  store_email?: string | null
  store_name?: string | null
  store_number?: string | null | number
  contact_person_number?: string | null
  contact_person_name?: string | null
  // Store Address
  address?: string | null
  state?: any | null
  city?: string | null

  country?: string | null
  latitude?: string
  longitude?: string
  // Subscription Details
  subscription_type?: any // 1: Per transaction 2: Fixed (Monthly),
  amount?: number | null
  // Sub Store Limit
  sub_store_limit?: number | null
  // Status
  status?: any // 1: Active 2: Deleted 0: Inactive
  // Dates
  created_at?: string | null
  updated_at?: string | null
  deleted_at?: string | null
  store_subscription?: any
  fakeLogo?: string | null // only for internal use
  start_date?: any | null
  opening_time?: any
  closing_time?: any
  end_date?: any | null
  store_ids?: any | null
  allow_return_and_refunds?: any | null
  days_for_return?: any | null
  reason_for_return?: any | null
  return_quantity?: any | null
  order?: any | null
  action?: any | null
  xbd_public_key?: any
  xbd_secret_key?: any
  xbd_merchant_id?: any
  xbd_client_id?: any
  xbd_client_secret?: any
  xbd_callback_url?: any
}

type StoreType = StoreParamsType | SubStoreRequestParams
type centerProps = {
  lat: number
  lng: number
}
type addressProps = {
  lat?: number
  lng?: number
  state?: string | null
  country?: string | null
  city?: string | null
  zip_code?: string | null
  full_address?: string | null
}
interface States {
  category?: boolean
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
  country_code?: string
  list?: any
  active?: string
  formData?: StoreType
}
const AddUpdateForm = () => {
  const userType = useUserType()
  const user = useUser()
  const params = useParams()
  const options = { delimiters: ['-'], blocks: [8, 4] }
  const { colors } = useContext(ThemeColors)
  const id = params?.id
  const canSubscriptionEdit = Can(Permissions.subscriptionEdit)
  const nav = useNavigate()
  const form = useForm<StoreParamsType>()
  const { handleSubmit, control, reset, setValue, watch, setError } = form
  const [loading, setLoading] = useState(false)
  const storeLang = useAppSelector((a: any) => a?.language)
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
      id: null,
      store_id: null,
      name: null,
      email: null,
      password: null,
      mobile_number: null,
      description: null,
      website: null,
      organisation_number: null,
      organisation_address: null,
      registered_company_name: null,
      logo: null,
      store_email: null,
      store_name: null,
      contact_person_number: null,
      address: null,
      city: null,
      latitude: null,
      state: null,
      longitude: null,
      subscription_type: null,
      amount: null,
      sub_store_limit: null,
      status: null,
      created_at: null,
      updated_at: null,
      deleted_at: null,

      fakeLogo: null,
      start_date: null,
      allow_return_and_refunds: null,
      days_for_return: null
    }
  }

  const reducers = stateReducer<States>
  const [state, setState] = useReducer(reducers, initState)

  const [loadStoreDetailsById, StoreData] =
    userType === UserType.Store ? useLoadSubStoreIdMutation() : useLoadStoreDetailsByIdMutation()
  const storeData = StoreData?.data?.payload

  const [loadStoreLanguage, lang] = useLanguageListMutation()

  useEffect(() => {
    if (userType === UserType.Store && isValid(user?.store_id)) {
      loadStoreLanguage({
        id: user?.store_id
      })
    }
  }, [userType])

  useEffect(() => {
    const langArr = lang?.data?.payload ?? []
    setState({
      language: langArr ?? []
    })
  }, [lang])

  log('check', userType === UserType.Admin)

  const [createStore, result] =
    userType === UserType.Admin || user?.store_id === UserType.Admin
      ? useCreateOrUpdateStoreMutation()
      : useCreateOrUpdateSubStoreMutation()

  const onSubmit = (e: StoreType) => {
    // log('StoreParamsType', e)
    // log('storeData', e)

    const languageArr = isValidArray(e?.languages) ? e?.languages?.map((d: any) => d?.value) : []
    const formData = {
      ...e,
      password: '12345678',
      amount:
        e?.subscription_type?.value === subscriptionStoreType.perTransaction
          ? 0
          : Number(e?.amount),
      percentage:
        e?.subscription_type?.value === subscriptionStoreType.perMonth ? 0 : e?.percentage,
      allow_bulk_referral: e?.allow_bulk_referral,
      allow_promotion: e?.allow_promotion,

      latitude: String(state?.address?.lat),
      // country: removeSpecialChar(state?.address?.country),
      longitude: String(state?.address?.lng),
      address: state?.address?.full_address,
      country_code: state?.country_code,
      logo: isValid(e?.fakeLogo) ? e?.fakeLogo : e?.logo,
      languages: languageArr,
      currency: userType === UserType.Store ? user?.store_setting?.currency : e?.currency?.label,
      currency_id: userType === UserType.Store ? user?.store_setting?.currency : e?.currency?.value,
      subscription_type: e?.subscription_type?.value,
      display_loose_product: e?.display_loose_product ? true : false,
      xbd_callback_url: e?.xbd_callback_url,
      xbd_public_key: e?.xbd_public_key,
      xbd_secret_key: e?.xbd_secret_key,
      xbd_merchant_id: e?.xbd_merchant_id,
      xbd_client_id: e?.xbd_client_id,
      xbd_client_secret: e?.xbd_client_secret
      //   personal_number: String(e?.personal_number).replaceAll('-', '')
    }
    // Delete not used data
    // delete formData?.subscription_type
    // delete formData?.fakeLogo
    createStore(formData)
  }

  useEffect(() => {
    if (params?.id) {
      loadStoreDetailsById({ id: params?.id })
    }
  }, [userType])

  useEffect(() => {
    if (!isValid(id)) {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const lat = position.coords.latitude
            const lng = position.coords.longitude
            setState({ center: { lat, lng } })
          },
          () => {}
        )
      } else {
        log(
          'It seems like Geolocation, which is required for this page, is not enabled in your browser. Please use a browser which supports it.'
        )
      }
    }

    // log('livegeolocation', navigator)
  }, [id])

  //   log(watch('display_loose_product'), 'watch')

  useEffect(() => {
    if (result.isSuccess) {
      //  log('test')
      nav(getPath('admin.stores'), { state: { reload: true } })
    }
  }, [result])
  const data = storeData?.parent?.store_subscription?.subscription_type
  const data1 = storeData?.store_subscription?.subscription_type

  //   log(decrypt(storeData?.store_setting?.xbd_merchant_id))

  // a = n?
  useEffect(() => {
    if (isValid(storeData) && storeData !== undefined) {
      const f = fillObject<StoreType>(state?.formData, storeData)
      const formData: StoreType = {
        ...decryptObject(forDecryption, f),
        store_qr_code_image: storeData?.store_setting?.store_qr_code_image,
        amount: storeData?.store_subscription?.amount
          ? storeData?.store_subscription?.amount
          : storeData?.parent?.store_subscription?.amount,
        percentage: storeData?.store_subscription?.percentage
          ? storeData?.store_subscription?.percentage
          : storeData?.parent?.store_subscription?.percentage,
        logo: storeData?.store_setting?.logo,
        contact_person_number: decrypt(storeData?.personal_number),

        description: storeData?.store_setting?.description,
        display_loose_product: storeData?.store_setting?.display_loose_product == true ? 1 : false,
        website: storeData?.store_setting?.website,
        store_email: storeData?.store_setting?.store_email,
        xbd_public_key: storeData?.store_setting?.xbd_public_key,

        xbd_callback_url: storeData?.store_setting?.xbd_callback_url,

        xbd_secret_key: storeData?.store_setting?.xbd_secret_key,
        xbd_merchant_id: storeData?.store_setting?.xbd_merchant_id,
        xbd_client_id: storeData?.store_setting?.xbd_client_id,
        xbd_client_secret: storeData?.store_setting?.xbd_client_secret,
        store_name: storeData?.store_setting?.store_name,
        sub_store_limit: storeData?.store_subscription?.sub_store_limit
          ? storeData?.store_subscription?.sub_store_limit
          : storeData?.parent?.store_subscription?.sub_store_limit,
        address: decrypt(`${storeData?.address}`),
        registered_company_name: storeData?.store_setting?.registered_company_name,
        organisation_number: storeData?.store_setting?.organisation_number,
        organisation_address: storeData?.store_setting?.organisation_address,
        // personal_number: storeData?.personal_number,
        latitude: storeData?.latitude,
        allow_bulk_referral: storeData?.allow_bulk_referral == '1' ? 1 : 0,
        allow_promotion: storeData?.allow_promotion == '1' ? 1 : 0,
        opening_time: storeData?.store_setting?.opening_time,
        closing_time: storeData?.store_setting?.closing_time,
        country: storeData?.country,
        country_code: state?.country_code,
        fixed_amount: storeData?.store_subscription?.fixed_amount
          ? storeData?.store_subscription?.fixed_amount
          : storeData?.parent?.store_subscription?.fixed_amount,
        free_trial_days: storeData?.store_setting?.free_trial_days
          ? formatDate(storeData?.store_setting?.free_trial_days)
          : '',
        // allow_return_and_refunds: storeData?.store_setting?.allow_return_and_refunds,
        days_for_return: storeData?.store_setting?.days_for_return,

        subscription_type: {
          label: getKeyByValue(
            subscriptionStoreType,
            data1 === undefined ? data : `${storeData?.store_subscription?.subscription_type}`
          ),
          value: data1 === undefined ? data : `${storeData?.store_subscription?.subscription_type}`
        },
        // currency: storeData?.currency,
        languages: storeData?.languages
          ?.filter((s: any) => isValid(s?.id))
          ?.map((d: any, i: any) => {
            return { value: d?.id, label: d?.title }
          })
      }
      // log(formData)
      setState({
        center: {
          lat: Number(storeData?.store_setting?.latitude),
          lng: Number(storeData?.store_setting?.longitude)
        }
      })

      setValues<StoreType>(formData, setValue)
    }
  }, [storeData])

  useEffect(() => {
    if (result?.isError) {
      const e: any = result?.error
      setInputErrors(e?.data?.payload, setError)
    }
  }, [result?.isError])

  const AnyReactComponent = ({ lat, lng, text }: { text: any; lng?: number; lat?: number }) => (
    <>
      <div className='pin'></div>
      <div className='pulse'></div>
    </>
    // <RoomIcon
    //   className='text-danger'
    //   fontSize={'large'}
    //   style={{ position: 'absolute', top: '-25px', left: '-10px' }}
    //>
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
    log(Geocoder)
  }

  const isVisibleSubscription = () => {
    let re = false
    if (canSubscriptionEdit) {
      if (!isValid(storeData?.parent_id)) {
        re = true
      }
    }
    return re
  }
  return (
    <>
      <Header
        // goBackTo={getPath('admin.stores')}
        goBackTo
        onClickBack={() => nav(-1)}
        title={isValid(storeData?.id) ? FM('update-store') : <>{FM('create-store')}</>}
      >
        {/* <Button onClick={generateRandomData}>Test</Button> */}
      </Header>
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
                <Card>
                  <CardHeader className='border-bottom'>
                    <CardTitle>
                      <>{FM('store-details')}</>
                    </CardTitle>
                  </CardHeader>
                  <CardBody className='pt-2'>
                    <Row>
                      <Col md='12'>
                        <FormGroupCustom
                          tooltip={FM('this-is-store-name')}
                          label={FM('store-name')}
                          name={'store_name'}
                          type={'text'}
                          className='mb-2'
                          control={control}
                          rules={{ required: true, maxLength: 50 }}
                        />
                      </Col>

                      <Col md='6'>
                        <Show IF={userType === UserType.Store}>
                          <FormGroupCustom
                            tooltip={FM('store-language')}
                            key={`languages-${user?.id}`}
                            type={'select'}
                            isMulti
                            control={control}
                            name={`languages`}
                            selectOptions={createSelectOptions(storeLang?.data, 'title', 'id')}
                            className='mb-1'
                            label={FM('language')}
                            rules={{ required: true }}
                          />
                        </Show>

                        <Hide IF={userType === UserType.Store}>
                          <FormGroupCustom
                            tooltip={FM('store-language')}
                            key={`languages-${userType}-${user?.store_id}`}
                            label={FM('language')}
                            name={`languages`}
                            type={'select'}
                            className='mb-2'
                            isMulti
                            path={ApiEndpoints.postLanguages}
                            selectLabel='title'
                            selectValue={'id'}
                            async
                            defaultOptions
                            loadOptions={loadDropdown}
                            // id='positionTop'
                            control={control}
                            rules={{ required: true }}
                          />
                        </Hide>
                      </Col>

                      <Hide IF={isValid(storeData?.id) || userType === UserType.Store}>
                        <Col md='6'>
                          <FormGroupCustom
                            tooltip={FM('store-currency')}
                            label={FM('currency')}
                            placeholder={FM('currency')}
                            //   noLabel
                            async
                            isClearable
                            path={ApiEndpoints.get_countries}
                            selectLabel='currency'
                            selectValue={'id'}
                            defaultOptions
                            loadOptions={loadDropdown}
                            modifyDropdownData={(d: any) => {
                              return {
                                ...d,
                                currency: `${d?.name} / (${d?.currency_code ?? d?.currency_symbol})`
                              }
                            }}
                            jsonData={{ view_all: 'no' }}
                            formData={{ view_all: 'no' }}
                            name={'currency'}
                            type={'select'}
                            className='mb-0'
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

                      <Col md='6'>
                        <FormGroupCustom
                          tooltip={FM('contact-email')}
                          name={'store_email'}
                          type={'email'}
                          label={FM('contact-email')}
                          className='mb-2'
                          control={control}
                          rules={{ required: true, pattern: Patterns.EmailOnly }}
                        />
                      </Col>
                      <Col md='6'>
                        <FormGroupCustom
                          tooltip={FM('mobile-number')}
                          name={'mobile_number'}
                          type={'number'}
                          label={FM('mobile-number')}
                          className='mb-2'
                          control={control}
                          rules={{ required: true, min: 0, minLength: 9, maxLength: 13 }}
                        />
                      </Col>

                      <Col md='6'>
                        <FormGroupCustom
                          tooltip={FM('website')}
                          name={'website'}
                          label={FM('website')}
                          type={'text'}
                          className='mb-2'
                          control={control}
                          rules={{ required: false }}
                        />
                      </Col>
                      <Col md='6'>
                        <FormGroupCustom
                          tooltip={FM('country')}
                          isDisabled={true}
                          name={'country'}
                          label={FM('country')}
                          type={'text'}
                          className='mb-2'
                          control={control}
                          rules={{ required: true }}
                        />
                      </Col>

                      <Col md='6'>
                        <FormGroupCustom
                          tooltip={FM('city')}
                          isDisabled={true}
                          name={'city'}
                          label={FM('city')}
                          type={'text'}
                          className='mb-2'
                          control={control}
                          rules={{ required: false }}
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

                      {/* <Col md='6'>
                        <FormGroupCustom
                          tooltip={FM('allows-return')}
                          name={'allow_return_and_refunds'}
                          label={FM('allows-return')}
                          type={'checkbox'}
                          className='mt-2'
                          control={control}
                          rules={{ required: false }}
                        />
                      </Col> */}
                      {/* <Show IF={allowsReturn}> */}
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
                      {/* </Show> */}
                      <Col md='12'>
                        <FormGroupCustom
                          key={`display_loose_product-${storeData?.display_loose_product}`}
                          type={'checkbox'}
                          control={control}
                          name='display_loose_product'
                          className='mb-2'
                          tooltip={FM('display_loose_product')}
                          label={FM('display_loose_product')}
                          rules={{ required: false }}
                        />
                      </Col>
                      <Col md='10'>
                        <FormGroupCustom
                          tooltip={FM('description')}
                          name={'description'}
                          label={FM('description')}
                          type={'textarea'}
                          className='mb-2'
                          control={control}
                          rules={{ required: false }}
                        />
                      </Col>
                      <Col md='2'>
                        <BsTooltip title={FM('store-logo')}>
                          <>
                            <Label>{FM('logo')}</Label>
                            <SimpleImageUpload
                              params={{ for: 'store' }}
                              value={watch('logo')}
                              name='logo'
                              setValue={setValue}
                            />
                          </>
                        </BsTooltip>
                      </Col>

                      <Col md='6'>
                        <FormGroupCustom
                          name={'xbd_public_key'}
                          label={FM('xbd_public_key')}
                          type={'text'}
                          className='mb-1'
                          control={control}
                          rules={{ required: false }}
                        />
                      </Col>
                      <Col md='6'>
                        <FormGroupCustom
                          name={'xbd_secret_key'}
                          label={FM('xbd_secret_key')}
                          type={'text'}
                          className='mb-1'
                          control={control}
                          rules={{ required: false }}
                        />
                      </Col>
                      <Col md='6'>
                        <FormGroupCustom
                          name={'xbd_merchant_id'}
                          label={FM('xbd_merchant_id')}
                          type={'text'}
                          className='mb-1'
                          control={control}
                          rules={{ required: false }}
                        />
                      </Col>
                      <Col md='6'>
                        <FormGroupCustom
                          name={'xbd_client_id'}
                          label={FM('xbd_client_id')}
                          type={'text'}
                          className='mb-1'
                          control={control}
                          rules={{ required: false }}
                        />
                      </Col>

                      <Col md='6'>
                        <FormGroupCustom
                          name={'xbd_client_secret'}
                          label={FM('xbd_client_secret')}
                          type={'text'}
                          className='mb-1'
                          control={control}
                          rules={{ required: false }}
                        />
                      </Col>
                      <Col md='6'>
                        <FormGroupCustom
                          name={'xbd_callback_url'}
                          label={FM('xbd_callback_url')}
                          type={'text'}
                          className='mb-1'
                          control={control}
                          rules={{ required: false }}
                        />
                      </Col>
                    </Row>
                  </CardBody>
                </Card>
                <Card>
                  <CardHeader className='border-bottom'>
                    <CardTitle>
                      <>{FM('store-address')}</>
                    </CardTitle>
                  </CardHeader>
                  <CardBody className='pt-1'>
                    <TabContent className='' activeTab={state?.active}>
                      <TabPane tabId='1'>
                        <Row>
                          <Col md='12'>
                            <BsTooltip title={FM('store-address-map')}>
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
                                  log(e, 'objects')
                                }}
                              />
                            </BsTooltip>
                          </Col>
                          <Col md='12'>
                            <div style={{ height: '350px', width: '100%' }}>
                              <Show IF={isValid(state?.center?.lat) && isValid(state?.center?.lng)}>
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
                                    libraries: ['places'],
                                    language: 'in',
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
              {/* <Col md='4' className=''> */}
              <StickyBox className='col-md-4' offsetBottom={50}>
                {/* <DropZone
                  title='upload-store-image'
                  maxFileSize={5.1}
                  onSuccess={(e) => {
                    setValue('logo', e[0]?.file_name)
                  }}
                /> */}
                <Card>
                  <CardHeader className='border-bottom'>
                    <CardTitle>
                      <>{FM('admin-details')}</>
                    </CardTitle>
                  </CardHeader>
                  <CardBody className='pt-2'>
                    <Row>
                      <Col md='12'>
                        <FormGroupCustom
                          tooltip={FM('admin-name')}
                          label={FM('name')}
                          name={'name'}
                          type={'text'}
                          className='mb-2'
                          control={control}
                          rules={{ required: true, maxLength: 50 }}
                        />
                      </Col>
                      <Col md='12'>
                        <FormGroupCustom
                          tooltip={FM('admin-email')}
                          label={FM('login-email')}
                          name={'email'}
                          //   pattern='[a-zA-Z]{3,}@[a-zA-Z]{3,}[.]{1}[a-zA-Z]{2,}[.]{1}[a-zA-Z]{2,}'
                          isDisabled={StoreData.isSuccess}
                          type={'email'}
                          className='mb-2'
                          control={control}
                          rules={
                            StoreData.isSuccess
                              ? { required: false }
                              : { required: true, pattern: Patterns.EmailOnly }
                          }
                        />
                      </Col>
                      <Col md='12'>
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
                      <Col md='12'>
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
                  </CardBody>
                </Card>
                <Show IF={userType === UserType.Admin || userType === UserType.AdminEmployee}>
                  <Card>
                    <CardHeader className='d-block border-bottom  '>
                      <Row className=''>
                        <Col md='10'>
                          <CardTitle className='m-0'>
                            <h3>{FM('subscription-details')}</h3>
                          </CardTitle>
                        </Col>

                        <Col md='2'>
                          <Show IF={isVisibleSubscription()}>
                            <BsTooltip title={FM('subscription-log')}>
                              <SubscriptionModal<ButtonProps> edit={storeData}>
                                <Edit color={colors?.primary?.main} size='20' />
                              </SubscriptionModal>
                            </BsTooltip>
                          </Show>
                        </Col>
                      </Row>
                    </CardHeader>
                    <CardBody className='pt-2'>
                      <Row>
                        <Col md='12'>
                          <FormGroupCustom
                            isDisabled={isValid(params?.id)}
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
                          IF={
                            watch('subscription_type')?.value ===
                            subscriptionStoreType?.perTransaction
                          }
                        >
                          <Col md='12'>
                            <FormGroupCustom
                              isDisabled={isValid(params?.id)}
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
                                validate: (v) => {
                                  return isNumbers(v)
                                }
                              }}
                            />
                          </Col>
                        </Hide>
                        <Show
                          IF={
                            watch('subscription_type')?.value ==
                              subscriptionStoreType?.perTransaction ||
                            watch('subscription_type')?.value == subscriptionStoreType?.both
                          }
                        >
                          <Col md='12'>
                            <FormGroupCustom
                              isDisabled={isValid(params?.id)}
                              tooltip={FM('satoccie-percentage')}
                              name={'percentage'}
                              label={FM('percent-to-deduct-per-transaction')}
                              type={'text'}
                              className='mb-2'
                              control={control}
                              rules={{
                                required: true,
                                min: 0.01,
                                max: 100,
                                maxLength: 5,
                                validate: (v) => {
                                  return isNumbers(v)
                                }
                              }}
                              append={<InputGroupText>%</InputGroupText>}
                            />
                          </Col>
                        </Show>
                        <Show
                          IF={
                            watch('subscription_type')?.value ==
                              subscriptionStoreType?.perTransaction ||
                            watch('subscription_type')?.value == subscriptionStoreType?.both
                          }
                        >
                          <Col md={'12'}>
                            <FormGroupCustom
                              isDisabled={isValid(params?.id)}
                              tooltip={FM('fixed-amount')}
                              name={'fixed_amount'}
                              label={FM('fixed-amount')}
                              type={'number'}
                              className='mb-2'
                              control={control}
                              rules={{ required: true, min: 0, maxLength: 10 }}
                            />
                          </Col>
                        </Show>
                        <Col md='12'>
                          <FormGroupCustom
                            isDisabled={isValid(params?.id)}
                            tooltip={FM('free-trail-days')}
                            name={'free_trial_days'}
                            label={FM('free-trail-days')}
                            datePickerOptions={{
                              minDate: new Date()
                            }}
                            type={'date'}
                            className='mb-2'
                            control={control}
                            rules={{ required: true, min: 0 }}
                          />
                        </Col>
                        <Col md='12'>
                          <FormGroupCustom
                            isDisabled={isValid(params?.id)}
                            tooltip={FM('this-is-no-of-substore-that-can-assign-by-admin')}
                            name={'sub_store_limit'}
                            label={FM('store-limit')}
                            type={'number'}
                            className='mb-2'
                            control={control}
                            rules={{ required: true, min: 0, max: 10 }}
                          />
                        </Col>
                        <Col md='6'>
                          <FormGroupCustom
                            key={`allow_bulk_referral-${storeData?.allow_bulk_referral}`}
                            type={'checkbox'}
                            control={control}
                            name='allow_bulk_referral'
                            className=''
                            tooltip={FM('bulk-referral')}
                            label={FM('bulk-referral')}
                            rules={{ required: false }}
                          />
                        </Col>
                        <Col md='6'>
                          <FormGroupCustom
                            key={`allow_promotion-${storeData?.allow_promotion}`}
                            type={'checkbox'}
                            control={control}
                            name='allow_promotion'
                            className=''
                            tooltip={FM('allow-promotion')}
                            label={FM('allow-promotion')}
                            rules={{ required: false }}
                          />
                        </Col>
                      </Row>
                    </CardBody>
                  </Card>
                </Show>
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
              {/* </Col> */}
            </Row>
          </Form>
        </>
      )}
    </>
  )
}

export default AddUpdateForm
