/* eslint-disable prettier/prettier */
import { Fragment } from 'react'
import { Card, CardBody, CardHeader, CardImg } from 'reactstrap'
import { UserType } from '../../../../utility/Const'
import Hide from '../../../../utility/Hide'
import Show from '../../../../utility/Show'
import { JsonParseValidate } from '../../../../utility/Utils'
import { FM, isValidUrl, log } from '../../../../utility/helpers/common'
import useUserType from '../../../../utility/hooks/useUserType'
import httpConfig from '../../../../utility/http/httpConfig'
import Shimmer from '../../../components/shimmers/Shimmer'

const ProfileCard = ({ user = {}, loading = false }: { user: any; loading: boolean }) => {
    const userType = useUserType()

    const parseCountry = JsonParseValidate(user?.country)

    log(parseCountry)
    return (
        <Fragment>
            {loading ? (
                <>
                    <Card className='mb-0 mt-2 h-100'>
                        <CardHeader>
                            <Shimmer width={'280px'} height={'100px'} />
                        </CardHeader>

                        <CardBody>
                            <div className='info-container'>
                                <>
                                    <ul className='list-unstyled'>
                                        <li className='mb-75'>
                                            <Shimmer height={'60px'} />
                                        </li>
                                        <li className='mb-75'>
                                            <Shimmer height={'60px'} />
                                        </li>
                                        <li className='mb-75'>
                                            <Shimmer height={'60px'} />
                                        </li>
                                        <li className='mb-75'>
                                            <Shimmer height={'60px'} />
                                        </li>
                                        {/* <li className='mb-75'>
                        <span className='fw-bolder text-dark me-25'>
                          <>{FM('categories')}:</>
                        </span>
                        <span className='d-block text-capitalize text-primary'>
                          <>
                            {details?.category?.id ? (
                              <Link
                                state={{ ...details?.category }}
                                to={getPath('admin.category', { id: details?.category?.id })}
                              >
                                {details?.category?.name}
                              </Link>
                            ) : (
                              'N/A'
                            )}
                            {details?.subcategory?.id ? (
                              <Link
                                state={{ ...details?.subcategory }}
                                to={getPath('admin.category.subcategory', {
                                  parentId: details?.subcategory?.parent_id
                                })}
                              >
                                {details?.subcategory?.name
                                  ? ` / ${details?.subcategory?.name}`
                                  : ''}
                              </Link>
                            ) : (
                              ''
                            )}
                          </>
                        </span>
                      </li> */}
                                        <li className='mb-75'>
                                            <Shimmer height={'60px'} />
                                        </li>
                                        <li className='mb-75'>
                                            <Shimmer height={'60px'} />
                                        </li>
                                        <li className='mb-75'>
                                            <Shimmer height={'60px'} />
                                        </li>
                                        {/* <li className='mb-75'>
                    <span className='fw-bolder text-dark me-25'>
                      <>{FM('created-at')}:</>
                    </span>
                    <span className='d-block'>
                      <>{formatDate(details?.created_at, 'YYYY-MM-DD hh:mm A') ?? 'N/A'}</>
                    </span>
                  </li>
                  <li className='mb-75'>
                    <span className='fw-bolder text-dark me-25'>
                      <>{FM('updated-at')}:</>
                    </span>
                    <span className='d-block'>
                      <>{formatDate(details?.updated_at, 'YYYY-MM-DD hh:mm A') ?? 'N/A'}</>
                    </span>
                  </li>
                  <li className='mb-75'>
                    <span className='fw-bolder text-dark me-25'>
                      <>{FM('last-updated-by')}:</>
                    </span>
                    <span className='d-block'>
                      <>N/A</>
                    </span>
                  </li> */}
                                    </ul>
                                </>
                            </div>
                        </CardBody>
                    </Card>
                </>
            ) : (
                <>
                    <Card className='mb-0 mt-2 h-100'>
                        <Show IF={user?.user_type_id === UserType.Store}>
                            <CardImg
                                top
                                className='border-bottom p-2'
                                src={isValidUrl(user?.store_setting?.store_qr_code_image) ? user?.store_setting?.store_qr_code_image : httpConfig.baseUrl3 + user?.store_setting?.store_qr_code_image}
                                // style={{ height: 200, objectFit: 'cover' }}
                                alt='card-top'
                            />
                        </Show>
                        <Hide IF={user?.user_type_id === UserType.Store}>
                            <CardImg
                                top
                                className='border-bottom p-2'
                                src={isValidUrl(user?.store_setting?.store_qr_code_image) ? user?.store_setting?.store_qr_code_image : httpConfig.baseUrl2 + user?.avatar}
                                // style={{ height: 200, objectFit: 'cover' }}
                                alt='card-top'
                            />
                        </Hide>
                        {/* <Hide IF={userType === UserType.Store}> */}
                        <CardBody>
                            <div className='info-container'>
                                <>
                                    <ul className='list-unstyled'>
                                        <li className='mb-75'>
                                            <span className='fw-bolder text-dark me-25'>
                                                <>{FM('name')}:</>
                                            </span>
                                            <span className='d-block'>
                                                <>{user?.name ?? 'N/A'}</>
                                            </span>
                                        </li>
                                        <li className='mb-75'>
                                            <span className='fw-bolder text-dark me-25'>
                                                <>{FM('email')}:</>
                                            </span>
                                            <span className='d-block'>
                                                <>{user?.email ?? 'N/A'}</>
                                            </span>
                                        </li>
                                        <li className='mb-75'>
                                            <span className='fw-bolder text-dark me-25'>
                                                <>{FM('mobile-number')}:</>
                                            </span>
                                            <span className='d-block'>
                                                <>{user?.mobile_number ?? 'N/A'}</>
                                            </span>
                                        </li>
                                        <li className='mb-75'>
                                            <span className='fw-bolder text-dark me-25'>
                                                <>{FM('country')}:</>
                                            </span>
                                            <span className='d-block'>
                                                <>{user?.country ?? 'N/A'}</>
                                            </span>
                                        </li>
                                        {/* <li className='mb-75'>
                        <span className='fw-bolder text-dark me-25'>
                          <>{FM('categories')}:</>
                        </span>
                        <span className='d-block text-capitalize text-primary'>
                          <>
                            {details?.category?.id ? (
                              <Link
                                state={{ ...details?.category }}
                                to={getPath('admin.category', { id: details?.category?.id })}
                              >
                                {details?.category?.name}
                              </Link>
                            ) : (
                              'N/A'
                            )}
                            {details?.subcategory?.id ? (
                              <Link
                                state={{ ...details?.subcategory }}
                                to={getPath('admin.category.subcategory', {
                                  parentId: details?.subcategory?.parent_id
                                })}
                              >
                                {details?.subcategory?.name
                                  ? ` / ${details?.subcategory?.name}`
                                  : ''}
                              </Link>
                            ) : (
                              ''
                            )}
                          </>
                        </span>
                      </li> */}
                                        <Show IF={userType === UserType.Store || userType === UserType.Admin}>
                                            <li className='mb-75'>
                                                <span className='fw-bolder text-dark me-25'>
                                                    <>{FM('currency')}:</>
                                                </span>

                                                <span className='d-block'>
                                                    <>{user?.currency ?? 'N/A'}</>
                                                </span>
                                            </li>
                                        </Show>

                                        <li className='mb-75'>
                                            <span className='fw-bolder text-dark me-25'>
                                                <>{FM('city')}:</>
                                            </span>
                                            <span className='d-block'>
                                                <>{user?.city ?? 'N/A'}</>
                                            </span>
                                        </li>
                                        <li className='mb-75'>
                                            <span className='fw-bolder text-dark me-25'>
                                                <>{FM('address')}:</>
                                            </span>
                                            <span className='d-block'>
                                                <>
                                                    {userType === UserType.Store
                                                        ? user?.store_setting?.address
                                                        : user?.address ?? 'N/A'}
                                                </>
                                            </span>
                                        </li>
                                        {/* <li className='mb-75'>
                    <span className='fw-bolder text-dark me-25'>
                      <>{FM('created-at')}:</>
                    </span>
                    <span className='d-block'>
                      <>{formatDate(details?.created_at, 'YYYY-MM-DD hh:mm A') ?? 'N/A'}</>
                    </span>
                  </li>
                  <li className='mb-75'>
                    <span className='fw-bolder text-dark me-25'>
                      <>{FM('updated-at')}:</>
                    </span>
                    <span className='d-block'>
                      <>{formatDate(details?.updated_at, 'YYYY-MM-DD hh:mm A') ?? 'N/A'}</>
                    </span>
                  </li>
                  <li className='mb-75'>
                    <span className='fw-bolder text-dark me-25'>
                      <>{FM('last-updated-by')}:</>
                    </span>
                    <span className='d-block'>
                      <>N/A</>
                    </span>
                  </li> */}
                                    </ul>
                                </>
                            </div>
                        </CardBody>

                        {/* </Hide> */}
                    </Card>
                </>
            )}
        </Fragment>
    )
}

export default ProfileCard
