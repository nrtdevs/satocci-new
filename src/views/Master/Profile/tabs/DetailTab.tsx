/* eslint-disable prettier/prettier */
import GoogleMapReact from 'google-map-react'
import { useEffect, useReducer } from 'react'
import { useForm } from 'react-hook-form'
import { Card, CardBody, CardHeader, CardTitle, Col, Row } from 'reactstrap'
import { profileParams } from '../../../../redux/RTKQuery/StoreRTK'
import { useLoadCommonStoreDetailsMutation } from '../../../../redux/RTKQuery/SubStoreRTK'
import { UserType, forDecryption, mapApiKey } from '../../../../utility/Const'
import Show from '../../../../utility/Show'
import { decryptObject } from '../../../../utility/Utils'
import { FM, isValid, log } from '../../../../utility/helpers/common'
import useUser from '../../../../utility/hooks/useUser'
import useUserType from '../../../../utility/hooks/useUserType'
import { stateReducer } from '../../../../utility/stateReducer'
import Shimmer from '../../../components/shimmers/Shimmer'

type centerProps = {
    lat: number
    lng: number
}
type addressProps = {
    lat: number
    lng: number
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
    list?: any
    active?: string
    formData?: profileParams
}
const ProfileCard = ({ user = {}, loading = false }: { user: any; loading: boolean }) => {
    const userType = useUserType()
    const userr = useUser()
    const userAdmin = decryptObject(forDecryption, user)
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
            unique_id: null,
            is_change_password: null
        }
    }
    const { handleSubmit, control, reset, setValue, watch } = useForm<any>()

    const reducers = stateReducer<States>
    const [state, setState] = useReducer(reducers, initState)
    const [storeLoad, res] = useLoadCommonStoreDetailsMutation()
    const storeData = res?.data?.payload
    useEffect(() => {
        if (isValid(userr?.store_id)) {
            storeLoad({
                id: userr?.store_id
            })
        }
    }, [userr])

    log('userTab', storeData)
    const loginDetails = () => {
        let re = ''
        if (userType === UserType.Store) {
            re = FM('store-details')
        } else if (userType === UserType.Employee || userType === UserType.AdminEmployee) {
            re = FM('employee-details')
        } else if (userType === UserType.Admin) {
            re = FM('details')
        } else {
            re = FM('details')
        }
        return re
    }
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

    //   useEffect(() => {
    //     getCurrentPositionLoacation()
    //   }, [])
    useEffect(() => {
        if (isValid(user?.store_setting?.latitude) && isValid(user?.store_setting?.latitude)) {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                    (position) => {
                        const lat = Number(user?.store_setting?.latitude)
                        const lng = Number(user?.store_setting?.longitude)
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
    }, [user])
    const AnyReactComponent = ({ lat, lng, text }: { text: any; lng?: number; lat?: number }) => (
        <>
            <div className='pin'></div>
            <div className='pulse'></div>
        </>
    )
    return (
        <>
            {!loading ? (
                <>
                    {/* <Hide IF={userType === UserType.Store}> */}
                    <Show IF={userType === UserType.Admin || userType === UserType.AdminEmployee}>
                        <Card>
                            <CardBody className=''>
                                <h4 className='border-bottom  pb-1'>{FM('details')}</h4>
                                <Row className='align-items-start gy-2'>
                                    <Col md='4'>
                                        <span className='mb-0 text-dark fw-bolder'>{FM('address')}</span>
                                        <p className='mb-0 fw-bold text-secondary'>{userAdmin?.address ?? 'N/A'}</p>
                                    </Col>
                                    <Col md='4'>
                                        <span className='h5 text-dark fw-bolder'>{FM('country')}</span>
                                        <p className='mb-0 fw-bold text-secondary'>{userAdmin?.country ?? 'N/A'}</p>
                                    </Col>
                                    <Col md='4'>
                                        <span className='mb-0 text-dark fw-bolder'>{FM('city')}</span>
                                        <p className='mb-0 fw-bold text-secondary'>{userAdmin?.city ?? 'N/A'}</p>
                                    </Col>
                                    <Col md='4'>
                                        <span className='mb-0 text-dark fw-bolder'>{FM('postal-area')}</span>
                                        <p className='mb-0 fw-bold text-secondary'>{userAdmin?.postal_area ?? 'N/A'}</p>
                                    </Col>
                                    <Col md='4'>
                                        <span className='mb-0 text-dark fw-bolder'>{FM('zip-code')}</span>
                                        <p className='mb-0 fw-bold text-secondary'>{userAdmin?.zip_code ?? 'N/A'}</p>
                                    </Col>
                                    <Col md='4'>
                                        <span className='mb-0 text-dark fw-bolder'>{FM('personal-number')}</span>
                                        <p className='mb-0 fw-bold text-secondary'>
                                            {userAdmin?.personal_number ?? 'N/A'}
                                        </p>
                                    </Col>
                                </Row>
                            </CardBody>
                        </Card>
                    </Show>
                    <Show IF={userType === UserType.Employee || userType === UserType.Store}>
                        <Card>
                            <CardBody className=''>
                                <h4 className='border-bottom  pb-1'>{loginDetails()}</h4>
                                <Row className='align-items-start gy-2'>
                                    <Col md='4'>
                                        <span className='mb-0 text-dark fw-bolder'>{FM('store-name')}</span>
                                        <p className='mb-0 fw-bold text-secondary'>{storeData?.store_name ?? 'N/A'}</p>
                                    </Col>
                                    <Col md='4'>
                                        <span className='h5 text-dark fw-bolder'>{FM('store-email')}</span>
                                        <p className='mb-0 fw-bold text-secondary'>{storeData?.store_email ?? 'N/A'}</p>
                                    </Col>
                                    <Col md='4'>
                                        <span className='mb-0 text-dark fw-bolder'>{FM('website')}</span>
                                        <p className='mb-0 fw-bold text-secondary'>{storeData?.website ?? 'N/A'}</p>
                                    </Col>
                                </Row>
                            </CardBody>

                            <CardBody className=''>
                                <Row className='align-items-start gy-2'>
                                    <Col md='4'>
                                        <span className='mb-0 text-dark fw-bolder'>{FM('open-time')}</span>
                                        <p className='mb-0 fw-bold text-secondary'>
                                            {storeData?.opening_time ?? 'N/A'}
                                        </p>
                                    </Col>
                                    <Col md='4'>
                                        <span className='h5 text-dark fw-bolder'>{FM('close-time')}</span>
                                        <p className='mb-0 fw-bold text-secondary'>
                                            {storeData?.closing_time ?? 'N/A'}
                                        </p>
                                    </Col>
                                    <Col md='4'>
                                        <span className='mb-0 text-dark fw-bolder'>{FM('city')}</span>
                                        <p className='mb-0 fw-bold text-secondary'>{storeData?.city ?? 'N/A'}</p>
                                    </Col>
                                    <Col md='4'>
                                        <span className='mb-0 text-dark fw-bolder'>{FM('currency')}</span>

                                        <p className='mb-0 fw-bold text-secondary'>{storeData?.currency ?? 'N/A'}</p>
                                    </Col>
                                    <Col md='4'>
                                        <span className='mb-0 text-dark fw-bolder'>{FM('days-for-return')}</span>

                                        <p className='mb-0 fw-bold text-secondary'>
                                            {storeData?.days_for_return ?? 'N/A'}
                                        </p>
                                    </Col>
                                </Row>
                            </CardBody>
                            <CardBody className=''>
                                {/* <h4 className='border-bottom  pb-1'>{FM('full-address-details')}</h4> */}
                                <Row className='align-items-start gy-2'>
                                    <Col md='12'>
                                        <span className='mb-0 text-dark fw-bolder'>{FM('description')}</span>
                                        <p className='mb-0 fw-bold text-secondary'>{storeData?.description ?? 'N/A'}</p>
                                    </Col>
                                </Row>
                            </CardBody>
                        </Card>
                    </Show>

                    {/* </Hide> */}

                    <Row className=''>
                        {/* <Col md='6'>
              <GoogleMaps
                center={state?.center}
                handleAddress={(e: any) => {
                  setState({ address: e, center: { lat: e.lat, lng: e.lng } })
                  setValue('country', e?.country)
                  setValue('city', e?.city)
                  log(e)
                }}
              />
            </Col> */}
                        <Show IF={userType === UserType.Store}>
                            <Col md='12'>
                                <Card>
                                    <CardHeader className='border-bottom'>
                                        <CardTitle>
                                            <>{FM('address')}</>
                                        </CardTitle>
                                    </CardHeader>
                                    <CardBody className='pt-2'>
                                        <div className='' style={{ height: '350px', width: '100%' }}>
                                            <Show IF={isValid(state?.center?.lat) && isValid(state?.center?.lng)}>
                                                <GoogleMapReact
                                                    onClick={(ev) => {
                                                        //   setState({ center: { lat: ev.lat, lng: ev.lng } })

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
                                                    center={state?.center}
                                                    defaultZoom={state?.zoom}
                                                >
                                                    <AnyReactComponent
                                                        lat={state.center?.lat}
                                                        lng={state.center?.lng}
                                                        text='My Marker'
                                                    />
                                                </GoogleMapReact>
                                            </Show>
                                        </div>
                                    </CardBody>
                                </Card>
                            </Col>
                        </Show>
                    </Row>
                </>
            ) : (
                <>
                    <Card>
                        <CardBody className=''>
                            <Row className='align-items-start gy-2'>
                                <Col md='4'>
                                    <Shimmer height={30} />
                                </Col>
                                <Col md='4'>
                                    <Shimmer height={30} />
                                </Col>
                                <Col md='4'>
                                    <Shimmer height={30} />
                                </Col>
                            </Row>
                        </CardBody>

                        <CardBody>
                            <Row className='align-items-start gy-2'>
                                <Col md='4'>
                                    <Shimmer height={30} />
                                </Col>
                                <Col md='4'>
                                    <Shimmer height={30} />
                                </Col>
                                <Col md='4'>
                                    <Shimmer height={30} />
                                </Col>
                                <Col md='4'>
                                    <Shimmer height={30} />
                                </Col>
                                <Col md='4'>
                                    <Shimmer height={30} />
                                </Col>
                                <Col md='4'>
                                    <Shimmer height={30} />
                                </Col>
                            </Row>
                        </CardBody>
                    </Card>
                </>
            )}
        </>
    )
}
export default ProfileCard
