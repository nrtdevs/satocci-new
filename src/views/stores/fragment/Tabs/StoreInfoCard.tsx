/* eslint-disable prettier/prettier */
// ** React Imports
// ** Custom Components

import { Fragment, useEffect, useReducer } from 'react'
// ** Reactstrap Imports
import { Badge, Card, CardBody, CardImg } from 'reactstrap'
import { subscriptionType } from '../../../../utility/Const'
import { decryptObject } from '../../../../utility/Utils'
import { FM, isValid, isValidArray, isValidUrl, log } from '../../../../utility/helpers/common'
import httpConfig from '../../../../utility/http/httpConfig'
import { stateReducer } from '../../../../utility/stateReducer'
import Shimmer from '../../../components/shimmers/Shimmer'
import { StoreParamsType } from '../AddUpdateForm'
interface States {
    category?: boolean
    subcategory?: boolean
    ip?: boolean
    patient?: boolean
    loading?: boolean
    text?: string
    loadingDetails?: boolean
    list?: any
    user?: any
}
interface StoreInfoType {
    details?: StoreParamsType
}
const StoreInfoCard = ({ details }: any) => {
    // const [user, setUser] = useState(null)
    // const [loadingDetails, setLoadingDetails] = useState(true)
    // const [addPatient, setAddPatient] = useState(false)
    // const [viewEdit, setViewEdit] = useState(visible)

    const initState: States = {
        category: false,
        subcategory: false,
        ip: false,
        patient: false,
        loading: false,
        text: '',
        list: [],
        user: {},
        loadingDetails: true
    }
    const reducers = stateReducer<States>
    const [state, setState] = useReducer(reducers, initState)

    const decryptField = {
        store_name: '',
        user_color: '',
        email_address: '',
        helpline_no: '',
        street_address: '',
        city: '',
        state: '',
        zipcode: '',
        subscription_type: '',
        openTime: '',
        closeTime: '',
        contact_person_name: '',
        logo: '',
        contact_person_number: '',
        contact_person_email: '',
        languages: '',

        store_qr_code_image: '',
        currency: ''
    }
    log('details', details)
    useEffect(() => {
        if (details !== null) {
            const data = {
                store_name: details?.store_setting?.store_name,
                user_color: details?.user_color,
                email_address: details?.store_setting?.store_email,
                helpline_no: details?.mobile_number,
                street_address: details?.store_setting?.address,
                city: details?.store_setting?.city,
                state: details?.store_setting?.state,
                zipcode: details?.zip_code,
                subscription_type: details?.store_subscription?.subscription_type,
                openTime: details?.store_setting?.opening_time,
                closeTime: details?.store_setting?.closing_time,
                contact_person_name: details?.name,
                logo: details?.store_setting?.logo,
                contact_person_number: details?.personal_number,
                contact_person_email: details?.email,
                languages: details?.languages,
                store_qr_code_image: details?.store_setting?.store_qr_code_image,
                currency: details?.store_setting?.currency
            }

            setState({
                user: decryptObject(decryptField, data),
                loadingDetails: false
            })
        }
    }, [details])

    const donwloadQr = () => {
        if (isValidUrl(state?.user?.store_qr_code_image)) {
            return window.open(state?.user?.store_qr_code_image, '_blank')
        } else {
            return window.open(httpConfig.baseUrl3 + state?.user?.store_qr_code_image, '_blank')
        }
        //window.open(httpConfig.baseUrl2 + state?.user?.store_qr_code_image, '_blank')
    }

    return (
        <Fragment>
            {isValid(details) ? (
                <Card className='mb-0 h-100'>
                    <CardImg
                        top
                        src={isValidUrl(state?.user?.store_qr_code_image)
                            ? state?.user?.store_qr_code_image
                            : `${httpConfig.baseUrl3 + state?.user?.store_qr_code_image}`}
                        style={{ objectFit: 'cover' }}
                        alt='card-top'
                        onClick={() => donwloadQr()}
                    />
                    <CardBody className='mb-0'>
                        <div className='info-container'>
                            {state?.user !== null ? (
                                <>
                                    <ul className='list-unstyled'>
                                        <li className='mb-75'>
                                            <span className='fw-bolder text-dark me-25'>
                                                <>{FM('name')}:</>
                                            </span>
                                            <span className='d-block'>
                                                <>{state?.user?.store_name ?? 'N/A'}</>
                                            </span>
                                        </li>
                                        <li className='mb-75'>
                                            <span className='fw-bolder text-dark me-25'>
                                                <>{FM('email-address')}:</>
                                            </span>
                                            <span className='d-block'>
                                                <>{state?.user?.email_address ?? 'N/A'}</>
                                            </span>
                                        </li>
                                        <li className='mb-75'>
                                            <span className='fw-bolder text-dark me-25'>
                                                <>{FM('helpline-number')} :</>
                                            </span>
                                            <span className='d-block'>{state?.user?.helpline_no ?? 'N/A'}</span>
                                        </li>
                                        <li className='mb-75'>
                                            <span className='fw-bolder text-dark me-25'>
                                                <>{FM('street-address')}:</>
                                            </span>
                                            <span className='d-block'>{state?.user?.street_address ?? 'N/A'}</span>
                                        </li>
                                        <li className='mb-75'>
                                            <span className='fw-bolder text-dark me-25'>
                                                <>{FM('city')}:</>
                                            </span>
                                            <span className='d-block'>{state?.user?.city ?? 'N/A'}</span>
                                        </li>
                                        <li className='mb-75'>
                                            <span className='fw-bolder text-dark me-25'>
                                                <>{FM('currency')}:</>
                                            </span>
                                            <span className='d-block'>{state?.user?.currency ?? 'N/A'}</span>
                                        </li>
                                        <li className='mb-75'>
                                            <span className='fw-bolder text-dark me-25'>
                                                <>{FM('open-time')} :</>
                                            </span>
                                            <span className='d-block'>{state?.user?.openTime ?? 'N/A'}</span>
                                        </li>
                                        <li className='mb-75'>
                                            <span className='fw-bolder text-dark me-25'>
                                                <>{FM('close-time')} :</>
                                            </span>
                                            <span className='d-block'>{state?.user?.closeTime ?? 'N/A'}</span>
                                        </li>
                                        <li>
                                            <span className='d-block fw-bolder text-dark me-25'>
                                                <>{FM('subscription-type')}:</>
                                            </span>
                                            <p className='mt-25'>
                                                <Badge className='me-1' color='light-primary'>
                                                    {`${state?.user?.subscription_type}` === subscriptionType?.Transaction
                                                        ? FM('transactions')
                                                        : `${state?.user?.subscription_type}` === subscriptionType?.Month
                                                            ? FM('monthly')
                                                            : `${state?.user?.subscription_type}` === subscriptionType?.Year
                                                                ? FM('both-(transaction-&-monthly)')
                                                                : 'N/A'}
                                                </Badge>
                                            </p>
                                        </li>
                                    </ul>
                                    <ul className='list-unstyled border-top mt-2'>
                                        <li className='mb-75'>
                                            <span className='fw-bolder text-dark me-25'>
                                                <>{FM('contact-person-name')}:</>
                                            </span>
                                            <span className='d-block'>{state?.user?.contact_person_name ?? 'N/A'}</span>
                                        </li>
                                        <li className='mb-75'>
                                            <span className='fw-bolder text-dark me-25'>
                                                <>{FM('contact-person-email')}:</>
                                            </span>
                                            <span className='d-block'>{state?.user?.contact_person_email ?? 'N/A'}</span>
                                        </li>

                                        <li className=' border-top mt-0'>
                                            <span className='d-block fw-bolder text-dark me-25'>
                                                <>{FM('languages')}:</>
                                            </span>

                                            {isValidArray(state?.user?.languages)
                                                ? state?.user?.languages?.map((d: any, i: number) => {
                                                    return (
                                                        <>
                                                            <span className='mt-25'>
                                                                <Badge className='me-1' color='light-primary'>
                                                                    {d?.title}
                                                                </Badge>
                                                            </span>
                                                        </>
                                                    )
                                                })
                                                : 'N/A'}
                                        </li>
                                    </ul>
                                </>
                            ) : null}
                        </div>
                    </CardBody>
                </Card>
            ) : (
                <Card className='mb-0 h-100'>
                    <Shimmer height={200} />
                    <CardBody className='mb-0'>
                        <div className='info-container'>
                            <>
                                <ul className='list-unstyled'>
                                    <li className='mb-75'>
                                        <Shimmer height={20} />
                                    </li>
                                    <li className='mb-75'>
                                        <Shimmer height={20} />
                                    </li>
                                    <li className='mb-75'>
                                        <Shimmer height={20} />
                                    </li>
                                    <li className='mb-75'>
                                        <Shimmer height={20} />
                                    </li>
                                    <li className='mb-75'>
                                        <Shimmer height={20} />
                                    </li>
                                    <li className='mb-75'>
                                        <Shimmer height={20} />
                                    </li>
                                    <li className='mb-75'>
                                        <Shimmer height={20} />
                                    </li>
                                    <li>
                                        <Shimmer height={20} />
                                    </li>
                                </ul>
                                <ul className='list-unstyled border-top mt-2'>
                                    <li className='mb-75'>
                                        <Shimmer height={20} />
                                    </li>
                                    <li className='mb-75'>
                                        <Shimmer height={20} />
                                    </li>

                                    <li className='mb-75'>
                                        <Shimmer height={20} />
                                    </li>

                                    <li className=' border-top mt-0'>
                                        <Shimmer height={20} />

                                        <span className='mt-25'>
                                            <Shimmer height={20} />
                                        </span>
                                    </li>
                                </ul>
                            </>
                        </div>
                    </CardBody>
                </Card>
            )}
        </Fragment>
    )
}

export default StoreInfoCard
