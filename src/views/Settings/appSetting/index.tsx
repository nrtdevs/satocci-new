/* eslint-disable prettier/prettier */
/* eslint-disable no-mixed-operators */
import '@styles/react/apps/app-users.scss'

import { useEffect, useReducer } from 'react'
import { useForm } from 'react-hook-form'
import {
    Card,
    CardBody,
    CardHeader,
    CardTitle,
    Col,
    Form,
    InputGroupText,
    Nav,
    NavItem,
    NavLink,
    Row,
    TabContent,
    TabPane
} from 'reactstrap'
import { FM, isValid, log } from '../../../utility/helpers/common'
import { stateReducer } from '../../../utility/stateReducer'
import LoadingButton from '../../components/buttons/LoadingButton'
import FormGroupCustom from '../../components/formGroupCustom/FormGroupCustom'
// import FormGroupCustom from '../../components/formGroupCustom'
import { useNavigate } from 'react-router-dom'
import StickyBox from 'react-sticky-box'
import {
    AppSettingRequestParams,
    useCreateOrUpdateAppSettingMutation,
    useLoadAppSettingMutation
} from '../../../redux/RTKQuery/AppSettingsRTK'
import { useAppDispatch } from '../../../redux/store'
import { getPath } from '../../../router/RouteHelper'
import { Patterns } from '../../../utility/Const'
import { SuccessToast, fillObject, getUserData, setValues } from '../../../utility/Utils'
import useUserType from '../../../utility/hooks/useUserType'
import SimpleImageUpload from '../../components/SimpleImageUpload'
import Header from '../../components/header'
import Shimmer from '../../components/shimmers/Shimmer'
import Show from '../../../utility/Show'
import ApiEndpoints from '../../../utility/http/ApiEndpoints'
import { loadDropdown } from '../../../utility/apis/dropdowns'
import ReactCountryFlag from 'react-country-flag'

interface States {
    category?: boolean
    subcategory?: boolean
    lastRefresh?: any
    ip?: boolean
    patient?: boolean
    loading?: boolean
    text?: string
    list?: any
    active?: string
    formData?: AppSettingRequestParams
}

const AppSettings = () => {
    const userType = useUserType()
    const user = getUserData()
    const dispatch = useAppDispatch()
    const nav = useNavigate()
    const form = useForm<AppSettingRequestParams>()
    const { handleSubmit, control, reset, setValue, watch } = form

    // log('user settings', user)
    const initState: States = {
        category: false,
        subcategory: false,
        ip: false,
        lastRefresh: new Date().getTime(),
        patient: false,
        loading: false,
        text: '',
        list: [],
        active: '1',
        formData: {
            id: null,
            app_name: null,
            org_number: null,
            description: null,
            customer_care_number: null,
            logo_path: null,
            logo_thumb_path: null,
            copyright_text: null,
            fb_ur: null,
            twitter_url: null,
            insta_url: null,
            linked_url: null,
            support_email: null,
            support_contact_number: null,
            address: null,
            meta_title: null,
            meta_keywords: null,
            meta_description: null,
            invite_url: null,
            payload: null,
            play_store_url: null,
            app_store_url: null,
            allowed_app_version: null,
            stripe_key: null,
            stripe_secret: null
        }
    }

    const reducers = stateReducer<States>
    const [state, setState] = useReducer(reducers, initState)

    const [loadAppSetting, { data: a, error, isLoading, isSuccess }] = useLoadAppSettingMutation()
    const appData = a?.payload as any

    useEffect(() => {
        loadAppSetting({
            page: 1,
            per_page_record: 15
        })
    }, [state.lastRefresh])

    const [createSetting, result] = useCreateOrUpdateAppSettingMutation()
    // const [useCreateSubStore, result] = useCreateOrUpdateSubStoreMutation()

    const onSubmit = (e: AppSettingRequestParams) => {
        createSetting({
            ...e,
            otp_enabled: e.otp_enabled ? 1 : 0,
            stripe_account_country: e.stripe_account_country?.value,
            stripe_account_default_currency: e.stripe_account_default_currency?.value
        })
    }

    useEffect(() => {
        if (isSuccess && appData !== undefined) {
            const f = fillObject<AppSettingRequestParams>(state.formData, appData)
            const formData: AppSettingRequestParams = {
                ...f,
                otp_enabled: appData?.otp_enabled === 1 ? 1 : 0,
                stripe_account_country: {
                    label: appData?.stripe_account_country,
                    value: appData?.stripe_account_country
                },
                stripe_account_default_currency: {
                    label: appData?.stripe_account_default_currency,
                    value: appData?.stripe_account_default_currency
                }
            }
            //  log(formData)
            setValues<AppSettingRequestParams>(formData, setValue)
        }
    }, [isSuccess])

    log('fdf', watch('stripe_account_country')?.value)
    useEffect(() => {
        if (result?.isSuccess) {
            SuccessToast(FM('setting-updated'))
            nav(getPath('settings.app_settings'))
        }
    }, [result])

    return (
        <>
            <Header
                title={userType === 1 ? <>{FM('app-setting')}</> : <>{FM('store-setting')}</>}
            ></Header>
            {isLoading ? (
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
                                        <CardTitle>{FM('app-details')}</CardTitle>
                                    </CardHeader>
                                    <CardBody className='pt-2'>
                                        <Row>
                                            <Col md='6'>
                                                <FormGroupCustom
                                                    label={FM('app-name')}
                                                    name={'app_name'}
                                                    type={'text'}
                                                    className='mb-2'
                                                    control={control}
                                                    rules={{ required: true }}
                                                />
                                            </Col>
                                            <Col md='6'>
                                                <FormGroupCustom
                                                    name={'org_number'}
                                                    type={'text'}
                                                    label={FM('org-number')}
                                                    className='mb-2'
                                                    control={control}
                                                    rules={{ required: true }}
                                                />
                                            </Col>

                                            {/* <Col md='6'>
                        <FormGroupCustom
                          name={'logo_thumb_path'}
                          label={FM('logo-thumb-path')}
                          type={'text'}
                          className='mb-2'
                          control={control}
                          rules={{ required: false }}
                        />
                      </Col> */}

                                            {/* <Col md='6'>
                        <Label>{FM('logo')}</Label>
                        <SimpleImageUpload
                          value={watch('logo_path')}
                          name='logo_path'
                          setValue={setValue}
                        />
                      </Col> */}
                                            <Col md='6'>
                                                <FormGroupCustom
                                                    label={FM('allowed-app-version')}
                                                    name={'allowed_app_version'}
                                                    type={'text'}
                                                    className='mb-2'
                                                    control={control}
                                                    rules={{ required: true }}
                                                />
                                            </Col>

                                            <Col md='6'>
                                                <FormGroupCustom
                                                    name={'support_email'}
                                                    label={FM('support-email')}
                                                    type={'email'}
                                                    className='mb-1'
                                                    control={control}
                                                    rules={{ required: true, pattern: Patterns.EmailOnly }}
                                                />
                                            </Col>
                                            <Col md='6'>
                                                <FormGroupCustom
                                                    name={'support_contact_number'}
                                                    label={FM('support-contact-number')}
                                                    type={'number'}
                                                    className='mb-0'
                                                    control={control}
                                                    rules={{ required: false, minLength: 8, maxLength: 13 }}
                                                />
                                            </Col>

                                            <Col md='6'>
                                                <FormGroupCustom
                                                    name={'copyright_text'}
                                                    label={FM('copyright-text')}
                                                    type={'text'}
                                                    className='mb-1'
                                                    control={control}
                                                    rules={{ required: false }}
                                                />
                                            </Col>
                                            <Col md='6'>
                                                <FormGroupCustom
                                                    key={`${appData?.stripe_account_country}`}
                                                    tooltip={FM('country')}
                                                    label={FM('country')}
                                                    placeholder={FM('country')}
                                                    //   noLabel
                                                    async
                                                    isClearable
                                                    path={ApiEndpoints.get_countries}
                                                    selectLabel='name'
                                                    selectValue={'country_code'}
                                                    defaultOptions
                                                    loadOptions={loadDropdown}
                                                    modifyDropdownData={(d: any) => {
                                                        return {
                                                            ...d,
                                                            currency: `${d?.name}`
                                                        }
                                                    }}
                                                    jsonData={{ view_all: 'yes' }}
                                                    formData={{ view_all: 'yes' }}
                                                    name={'stripe_account_country'}
                                                    type={'select'}
                                                    className='mb-0'
                                                    control={control}
                                                    rules={{ required: true }}
                                                    // prepend={<InputGroupText>{FM('get')}</InputGroupText>}
                                                    prepend={
                                                        <Show IF={isValid(watch('stripe_account_country')?.value)}>
                                                            <InputGroupText className=''>
                                                                <ReactCountryFlag
                                                                    style={{ width: '26px', height: '16px' }}
                                                                    className='country-flag p-0'
                                                                    countryCode={
                                                                        `${watch('stripe_account_country')?.value}` === 'en'
                                                                            ? 'us'
                                                                            : `${watch('stripe_account_country')?.value}`
                                                                    }
                                                                    svg
                                                                />
                                                            </InputGroupText>
                                                        </Show>
                                                    }
                                                />
                                            </Col>
                                            <Col md='6'>
                                                <FormGroupCustom
                                                    key={`${appData?.stripe_account_default_currency}`}
                                                    tooltip={FM('store-currency')}
                                                    label={FM('currency')}
                                                    placeholder={FM('currency')}
                                                    //   noLabel
                                                    async
                                                    isClearable
                                                    path={ApiEndpoints.get_countries}
                                                    selectLabel='currency'
                                                    selectValue={'currency_code'}
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
                                                    name={'stripe_account_default_currency'}
                                                    type={'select'}
                                                    className='mb-0'
                                                    control={control}
                                                    rules={{ required: true }}
                                                    // prepend={<InputGroupText>{FM('get')}</InputGroupText>}
                                                    prepend={
                                                        <Show IF={isValid(watch('stripe_account_default_currency')?.value)}>
                                                            <InputGroupText className=''>
                                                                {/* <ReactCountryFlag
                                  style={{ width: '25px', height: '25px' }}
                                  className='country-flag p-0'
                                  countryCode={
                                    `${watch('currency')?.extra?.country_code}` === 'en'
                                      ? 'us'
                                      : `${watch('currency')?.extra?.country_code}`
                                  }
                                  svg
                                /> */}
                                                                {/* <span
                                    style={{ width: '25px', height: '25px' }}
                                    className='text-primary'
                                  > */}
                                                                {isValid(watch('stripe_account_default_currency')?.value) ? (
                                                                    watch('stripe_account_default_currency')?.value
                                                                ) : (
                                                                    <span>&#36;</span>
                                                                )}
                                                                {/* </span> */}
                                                            </InputGroupText>
                                                        </Show>
                                                    }
                                                />
                                            </Col>
                                        </Row>
                                    </CardBody>
                                </Card>
                                <Card>
                                    <CardHeader className='border-bottom'>
                                        <CardTitle>{FM('stripe-settings')}</CardTitle>
                                    </CardHeader>
                                    <CardBody className='pt-1'>
                                        <Row className=''>
                                            <Col md='6'>
                                                <FormGroupCustom
                                                    label={FM('stripe-key')}
                                                    name={'stripe_key'}
                                                    type={'text'}
                                                    className='mb-2'
                                                    control={control}
                                                    rules={{ required: true }}
                                                />
                                            </Col>
                                            <Col md='6'>
                                                <FormGroupCustom
                                                    label={FM('stripe-secret')}
                                                    name={'stripe_secret'}
                                                    type={'text'}
                                                    className='mb-2'
                                                    control={control}
                                                    rules={{ required: true }}
                                                />
                                            </Col>
                                        </Row>
                                    </CardBody>
                                </Card>

                                <Card>
                                    <CardHeader className='border-bottom'>
                                        <CardTitle>
                                            <>{FM('address-description-links')}</>
                                        </CardTitle>
                                        <Nav pills className='m-0 p-0'>
                                            <NavItem>
                                                <NavLink
                                                    active={state.active === '1'}
                                                    onClick={() => {
                                                        setState({ active: '1' })
                                                    }}
                                                >
                                                    {FM('description')}
                                                </NavLink>
                                            </NavItem>
                                            <NavItem>
                                                <NavLink
                                                    active={state.active === '2'}
                                                    onClick={() => {
                                                        setState({ active: '2' })
                                                    }}
                                                >
                                                    {FM('url-links')}
                                                </NavLink>
                                            </NavItem>
                                        </Nav>
                                    </CardHeader>
                                    <CardBody className='pt-2'>
                                        <TabContent className='py-50' activeTab={state?.active}>
                                            <TabPane tabId='1'>
                                                <Row>
                                                    <Col md='12'>
                                                        <FormGroupCustom
                                                            //   message={FM('powered-by-google')}
                                                            name={'description'}
                                                            type={'textarea'}
                                                            label={FM('description')}
                                                            className='mb-1'
                                                            control={control}
                                                            rules={{ required: false }}
                                                        />
                                                    </Col>
                                                    <Col md='12'>
                                                        <FormGroupCustom
                                                            name={'address'}
                                                            type={'textarea'}
                                                            label={FM('full-address')}
                                                            className='mb-1'
                                                            control={control}
                                                            rules={{ required: true }}
                                                        />
                                                    </Col>
                                                    {/* <Col md='12'>
                            <Label>{FM('or-find-on-map')}</Label>
                            <div className='border' style={{ height: 300 }}></div>
                          </Col> */}
                                                </Row>
                                            </TabPane>
                                            <TabPane tabId='2'>
                                                <Row>
                                                    <Col md='6'>
                                                        <FormGroupCustom
                                                            name={'fb_ur'}
                                                            label={FM('fb-ur')}
                                                            type={'text'}
                                                            className='mb-1'
                                                            control={control}
                                                            rules={{ required: false }}
                                                        />
                                                    </Col>
                                                    <Col md='6'>
                                                        <FormGroupCustom
                                                            name={'twitter_url'}
                                                            label={FM('twitter-url')}
                                                            type={'text'}
                                                            className='mb-1'
                                                            control={control}
                                                            rules={{ required: false }}
                                                        />
                                                    </Col>
                                                    <Col md='6'>
                                                        <FormGroupCustom
                                                            name={'insta_url'}
                                                            label={FM('insta-url')}
                                                            type={'text'}
                                                            className='mb-1'
                                                            control={control}
                                                            rules={{ required: false }}
                                                        />
                                                    </Col>
                                                    <Col md='6'>
                                                        <FormGroupCustom
                                                            label={FM('play-store-url')}
                                                            name={'play_store_url'}
                                                            type={'text'}
                                                            className='mb-1'
                                                            control={control}
                                                            rules={{ required: true }}
                                                        />
                                                    </Col>
                                                    <Col md='6'>
                                                        <FormGroupCustom
                                                            label={FM('app-store-url')}
                                                            name={'app_store_url'}
                                                            type={'text'}
                                                            className='mb-1'
                                                            control={control}
                                                            rules={{ required: true }}
                                                        />
                                                    </Col>

                                                    <Col md='6'>
                                                        <FormGroupCustom
                                                            label={FM('invite-url')}
                                                            name={'invite_url'}
                                                            type={'text'}
                                                            className='mb-1'
                                                            control={control}
                                                            rules={{ required: true }}
                                                        />
                                                    </Col>

                                                    {/* <Col md='12'>
                            <Label>{FM('or-find-on-map')}</Label>
                            <div className='border' style={{ height: 300 }}></div>
                          </Col> */}
                                                </Row>
                                            </TabPane>
                                        </TabContent>
                                    </CardBody>
                                </Card>
                            </Col>
                            {/* <Col md='4' className=''> */}
                            <StickyBox className='col-md-4' offsetBottom={50}>
                                <Card>
                                    <CardHeader className='border-bottom'>
                                        <CardTitle>
                                            <>{FM('support-details')}</>
                                        </CardTitle>
                                    </CardHeader>
                                    <CardBody className='pt-2'>
                                        <Row>
                                            <Col md='12'>
                                                <Row className=''>
                                                    <Col md='5'>
                                                        <SimpleImageUpload
                                                            params={{ for: 'AppSetting' }}
                                                            className='mb-0'
                                                            value={watch('logo_path')}
                                                            name='logo_path'
                                                            setValue={setValue}
                                                        />
                                                    </Col>
                                                    <Col md='7'>
                                                        <div className='info-container'>
                                                            <ul className='list-unstyled'>
                                                                <li className='mb-75'>
                                                                    <span className='fw-bolder text-dark me-25'>
                                                                        <>{FM('app-name')}:</>
                                                                    </span>
                                                                    <span className='d-block'>
                                                                        <>{appData?.app_name ?? 'N/A'}</>
                                                                    </span>
                                                                    <span className='fw-bolder text-dark me-25'>
                                                                        <>{FM('email-address')}:</>
                                                                    </span>
                                                                    <span className='d-block'>
                                                                        <>{appData?.support_email ?? 'N/A'}</>
                                                                    </span>
                                                                    {/* <span className='fw-bolder text-dark me-25'>
                                    <>{FM('allowed-app-version')}:</>
                                  </span>
                                  <span className='d-block'>
                                    <>{appData?.allowed_app_version ?? 'N/A'}</>
                                  </span> */}
                                                                </li>
                                                            </ul>
                                                        </div>
                                                    </Col>
                                                </Row>
                                            </Col>
                                        </Row>
                                    </CardBody>

                                    <CardBody className='pt-0'>
                                        <Row>
                                            <Col md='12'>
                                                <FormGroupCustom
                                                    label={FM('meta-title')}
                                                    name={'meta_title'}
                                                    type={'text'}
                                                    className='mb-1'
                                                    control={control}
                                                    rules={{ required: true }}
                                                />
                                            </Col>
                                            <Col md='12'>
                                                <FormGroupCustom
                                                    label={FM('meta-keywords')}
                                                    name={'meta_keywords'}
                                                    type={'text'}
                                                    className='mb-1'
                                                    control={control}
                                                    rules={{ required: true }}
                                                />
                                            </Col>
                                            <Col md='12'>
                                                <FormGroupCustom
                                                    label={FM('meta-description')}
                                                    name={'meta_description'}
                                                    type={'text'}
                                                    className='mb-1'
                                                    control={control}
                                                    rules={{ required: true }}
                                                />
                                            </Col>
                                            <Col md='12'>
                                                <FormGroupCustom
                                                    name={'customer_care_number'}
                                                    label={FM('customer-care-number')}
                                                    type={'number'}
                                                    className='mb-1'
                                                    control={control}
                                                    rules={{ required: false, minLength: 8, maxLength: 13 }}
                                                />
                                            </Col>
                                            <Col md='12'>
                                                <FormGroupCustom
                                                    name={'otp_enabled'}
                                                    label={FM('otp-enabled')}
                                                    type={'checkbox'}
                                                    className='mb-1'
                                                    control={control}
                                                    rules={{ required: false }}
                                                />
                                            </Col>
                                        </Row>
                                    </CardBody>
                                </Card>
                                <Col sm='12' className='border-top'>
                                    <LoadingButton
                                        // disabled={user?.user_type_id === 1}
                                        block
                                        loading={result?.isLoading}
                                        className='mt-1 mb-3'
                                        color='primary'
                                        type='submit'
                                    >
                                        {/* <>{user?.user_type_id === 1 ? FM('no-need-to-setting') : FM('save')}</> */}
                                        {FM('save')}
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

export default AppSettings
