/* eslint-disable prettier/prettier */
import { Badge, ButtonGroup, Card, CardBody, Col, Row } from 'reactstrap'

import { useEffect } from 'react'
import { Edit, Settings } from 'react-feather'
import {
    AppSettingRequestParams,
    useLoadAppSettingMutation
} from '../../../redux/RTKQuery/AppSettingsRTK'
import { getPath } from '../../../router/RouteHelper'
import { FM, isValidUrl, log } from '../../../utility/helpers/common'
import httpConfig from '../../../utility/http/httpConfig'
import Header from '../../components/header'
import Shimmer from '../../components/shimmers/Shimmer'
import TooltipLink from '../../components/tooltip/TooltipLink'
import ReactCountryFlag from 'react-country-flag'

export default function AppSettingDetails() {
    const [loadAppSetting, { data: a, error, isLoading, isSuccess }] = useLoadAppSettingMutation()
    const details = a?.payload as AppSettingRequestParams
    useEffect(() => {
        loadAppSetting({
            page: 1,
            per_page_record: 15
        })
    }, [])

    log(details, 'appSetting')
    return (
        <>
            <div>
                {!isLoading ? (
                    <>
                        <Header icon={<Settings size='25' />} title={FM('app-setting')}>
                            <ButtonGroup>
                                <TooltipLink
                                    title={<>{FM('app-setting')}</>}
                                    to={getPath('settings.update.app-setting')}
                                    className='btn btn-primary btn-sm'
                                >
                                    <Edit size='14' />
                                </TooltipLink>
                            </ButtonGroup>
                        </Header>

                        <Card>
                            <CardBody className=''>
                                <Row>
                                    <Col md='4'>
                                        <div className='card' style={{ width: '18rem;' }}>
                                            <ul className='list-group list-group-flush'>
                                                <li>
                                                    <span>
                                                        <img
                                                            className='card-img-top'
                                                            height={'250px'}
                                                            src={isValidUrl(details?.logo_path)
                                                                ? details?.logo_path
                                                                : `${httpConfig.baseUrl2}${details?.logo_path}`}
                                                            alt='Card image cap'
                                                        />
                                                    </span>
                                                </li>
                                                <li className='list-group-item'>
                                                    <span className='fw-bolder text-dark me-25'>
                                                        <>{FM('app-name')}:</>
                                                    </span>
                                                    <span className='d-block mb-1'>
                                                        <>{details?.app_name ?? 'N/A'}</>
                                                    </span>
                                                </li>
                                                <li className='list-group-item'>
                                                    <span className='fw-bolder text-dark me-25'>
                                                        <>{FM('org-number')}:</>
                                                    </span>
                                                    <span className='d-block mb-1'>
                                                        <>{details?.org_number ?? 'N/A'}</>
                                                    </span>
                                                </li>
                                                <li className='list-group-item'>
                                                    <span className='fw-bolder text-dark me-25'>
                                                        <>{FM('allowed-app-version')}:</>
                                                    </span>
                                                    <h2 className='d-block mb-1'>
                                                        {/* <>{details?.allowed_app_version ?? 'N/A'}</> */}
                                                        <Badge color='light-danger'>
                                                            {`${details?.allowed_app_version}.0` ?? 'N/A'}
                                                        </Badge>
                                                    </h2>
                                                </li>
                                                <li className='list-group-item'>
                                                    <span className='fw-bolder text-dark me-25'>
                                                        <>{FM('currency')}:</>
                                                    </span>
                                                    <h2 className='d-block mb-1'>
                                                        <Badge color='light-primary'>
                                                            {details?.stripe_account_default_currency ?? 'N/A'}
                                                        </Badge>
                                                    </h2>
                                                </li>
                                                <li className='list-group-item'>
                                                    <span className='fw-bolder text-dark me-25'>
                                                        <>{FM('country')}:</>
                                                    </span>
                                                    <span className='d-block mb-1'>
                                                        {/* <>{details?.stripe_account_country ?? 'N/A'}</> */}
                                                        <ReactCountryFlag
                                                            style={{ width: '300px', height: '80px' }}
                                                            className='country-flag p-0'
                                                            countryCode={
                                                                `${details?.stripe_account_country}` === 'en'
                                                                    ? 'us'
                                                                    : `${details?.stripe_account_country}`
                                                            }
                                                            svg
                                                        />
                                                    </span>
                                                </li>
                                            </ul>
                                        </div>
                                    </Col>
                                    <Col md='4'>
                                        <div className='card' style={{ width: '18rem;' }}>
                                            <ul className='list-group list-group-flush'>
                                                <li className='list-group-item'>
                                                    <span className='fw-bolder text-dark me-25'>
                                                        <>{FM('stripe-key')}:</>
                                                    </span>
                                                    <span className='d-block mb-1'>
                                                        <>{details?.stripe_key ?? 'N/A'}</>
                                                    </span>
                                                </li>
                                                <li className='list-group-item'>
                                                    <span className='fw-bolder text-dark me-25'>
                                                        <>{FM('stripe-secret')}:</>
                                                    </span>
                                                    <span className='d-block mb-1'>
                                                        <>{details?.stripe_secret ?? 'N/A'}</>
                                                    </span>
                                                </li>

                                                <li className='list-group-item'>
                                                    <span className='fw-bolder text-dark me-25'>
                                                        <>{FM('description')}:</>
                                                    </span>
                                                    <span className='d-block mb-1'>
                                                        <>{details?.description ?? 'N/A'}</>
                                                    </span>
                                                </li>
                                                <li className='list-group-item'>
                                                    <span className='fw-bolder text-dark me-25'>
                                                        <>{FM('address')}:</>
                                                    </span>
                                                    <span className='d-block mb-1'>
                                                        <>{details?.address ?? 'N/A'}</>
                                                    </span>
                                                </li>
                                            </ul>
                                        </div>
                                    </Col>
                                    <Col md='4'>
                                        <div className='card' style={{ width: '18rem;' }}>
                                            <ul className='list-group list-group-flush'>
                                                <li className='list-group-item'>
                                                    <span className='fw-bolder text-dark me-25'>
                                                        <>{FM('support-email')}:</>
                                                    </span>
                                                    <span className='d-block mb-1'>
                                                        <>{details?.support_email ?? 'N/A'}</>
                                                    </span>
                                                </li>
                                                <li className='list-group-item'>
                                                    <span className='fw-bolder text-dark me-25'>
                                                        <>{FM('support-contact-number')}:</>
                                                    </span>
                                                    <span className='d-block mb-1'>
                                                        <>{details?.support_contact_number ?? 'N/A'}</>
                                                    </span>
                                                </li>

                                                <li className='list-group-item'>
                                                    <span className='fw-bolder text-dark me-25'>
                                                        <>{FM('meta-title')}:</>
                                                    </span>
                                                    <span className='d-block mb-1'>
                                                        <>{details?.meta_title ?? 'N/A'}</>
                                                    </span>
                                                </li>
                                                <li className='list-group-item'>
                                                    <span className='fw-bolder text-dark me-25'>
                                                        <>{FM('meta-keywords')}:</>
                                                    </span>
                                                    <span className='d-block mb-1'>
                                                        <>{details?.meta_keywords ?? 'N/A'}</>
                                                    </span>
                                                </li>
                                                <li className='list-group-item'>
                                                    <span className='fw-bolder text-dark me-25'>
                                                        <>{FM('meta-description')}:</>
                                                    </span>
                                                    <span className='d-block mb-1'>
                                                        <>{details?.meta_description ?? 'N/A'}</>
                                                    </span>
                                                </li>
                                                <li className='list-group-item'>
                                                    <span className='fw-bolder text-dark me-25'>
                                                        <>{FM('customer-care-number')}:</>
                                                    </span>
                                                    <span className='d-block mb-1'>
                                                        <>{details?.customer_care_number ?? 'N/A'}</>
                                                    </span>
                                                </li>
                                                <li className='list-group-item'>
                                                    <span className='fw-bolder text-dark me-25'>
                                                        <>{FM('copyright-text')}:</>
                                                    </span>
                                                    <span className='d-block mb-1'>
                                                        <>{details?.copyright_text ?? 'N/A'}</>
                                                    </span>
                                                </li>
                                            </ul>
                                        </div>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col></Col>
                                </Row>
                            </CardBody>
                        </Card>
                    </>
                ) : (
                    <>
                        <Card>
                            <CardBody className=''>
                                <Row className='align-items-start gy-2'>
                                    <Col md='4'>
                                        <div className='card' style={{ width: '18rem;' }}>
                                            <ul className='list-group list-group-flush'>
                                                <li className='list-group-item'>
                                                    <Shimmer height={200} width={350} />
                                                </li>
                                                <li className='list-group-item'>
                                                    <Shimmer height={50} />
                                                </li>
                                                <li className='list-group-item'>
                                                    <Shimmer height={50} />
                                                </li>

                                                <li className='list-group-item'>
                                                    <Shimmer height={50} />
                                                </li>
                                                <li className='list-group-item'>
                                                    <Shimmer height={50} />
                                                </li>
                                            </ul>
                                        </div>
                                    </Col>
                                    <Col md='4'>
                                        <div className='card' style={{ width: '18rem;' }}>
                                            <ul className='list-group list-group-flush'>
                                                <li className='list-group-item'>
                                                    <Shimmer height={50} />
                                                </li>
                                                <li className='list-group-item'>
                                                    <Shimmer height={50} />
                                                </li>

                                                <li className='list-group-item'>
                                                    <Shimmer height={50} />
                                                </li>
                                                <li className='list-group-item'>
                                                    <Shimmer height={30} />
                                                </li>
                                            </ul>
                                        </div>
                                    </Col>
                                    <Col md='4'>
                                        <div className='card' style={{ width: '18rem;' }}>
                                            <ul className='list-group list-group-flush'>
                                                <li className='list-group-item'>
                                                    <Shimmer height={50} />
                                                </li>
                                                <li className='list-group-item'>
                                                    <Shimmer height={50} />
                                                </li>

                                                <li className='list-group-item'>
                                                    <Shimmer height={50} />
                                                </li>
                                                <li className='list-group-item'>
                                                    <Shimmer height={50} />
                                                </li>
                                            </ul>
                                        </div>
                                    </Col>
                                </Row>
                            </CardBody>
                        </Card>
                    </>
                )}
            </div>
        </>
    )
}
