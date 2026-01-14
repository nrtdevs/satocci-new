/* eslint-disable prettier/prettier */
import { Fragment, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Card, CardBody, CardImg } from 'reactstrap'
import { useLoadProductDetailsByIdMutation } from '../../../../redux/RTKQuery/ProductRTK'
import { getPath } from '../../../../router/RouteHelper'
import { FM, isValid, log } from '../../../../utility/helpers/common'
import httpConfig from '../../../../utility/http/httpConfig'
import Show from '../../../../utility/Show'
import { CF, checkHttp, formatDate, truncateText } from '../../../../utility/Utils'
import Shimmer from '../../../components/shimmers/Shimmer'
import { ProductVariantsType } from '../ProductForm'

type theProps = {
    details?: ProductVariantsType
    loading?: boolean
}
const ProductInfoCard = ({ details, loading = false }: theProps) => {
    // const user = useUser()
    const currency = details?.product?.store?.currency

    const [ProductDetails, resp] = useLoadProductDetailsByIdMutation()
    const prodData = resp?.data?.payload as any
    useEffect(() => {
        if (isValid(details?.product_id)) {
            ProductDetails({
                id: details?.product_id
            })
        }
    }, [details])
    log('productInfoCard', prodData)
    return (
        <Fragment>
            {!loading ? (
                <>
                    <Card className='mb-0 h-100'>
                        <Show IF={isValid(details?.product_image ?? prodData?.product_image)}>
                            <CardImg
                                top
                                className='border-bottom p-2'
                                src={
                                    (!checkHttp(details?.product_image ?? prodData?.product_image)
                                        ? httpConfig.baseUrl2
                                        : '') + (details?.product_image ?? prodData?.product_image)
                                }
                                style={{ height: 200, objectFit: 'contain' }}
                                alt='card-top'
                            />
                        </Show>
                        <CardBody>
                            <div className='info-container'>
                                {details !== null ? (
                                    <>
                                        <ul className='list-unstyled'>
                                            <li className='mb-75'>
                                                <span className='fw-bolder text-dark me-25'>
                                                    <>{FM('name')}:</>
                                                </span>
                                                <span className='d-block'>
                                                    <>{prodData?.name ?? 'N/A'}</>
                                                </span>
                                            </li>
                                            <li className='mb-75'>
                                                <span className='fw-bolder text-dark me-25'>
                                                    <>{FM('description')}:</>
                                                </span>
                                                <span className='d-block'>
                                                    <>{truncateText(prodData?.description, 150) ?? 'N/A'}</>
                                                </span>
                                            </li>
                                            <li className='mb-75'>
                                                <span className='fw-bolder text-dark me-25'>
                                                    <>{FM('variant-name')}:</>
                                                </span>
                                                <span className='d-block'>
                                                    <>{details?.name ?? 'N/A'}</>
                                                </span>
                                            </li>
                                            <li className='mb-75'>
                                                <span className='fw-bolder text-dark me-25'>
                                                    <>{FM('vat')}:</>
                                                </span>
                                                <span className='d-block'>
                                                    <>{`${details?.product?.vat}  %` ?? 'N/A'}</>
                                                </span>
                                            </li>

                                            <li className='mb-75'>
                                                <span className='fw-bolder text-dark me-25'>
                                                    <>{FM('sku')}:</>
                                                </span>
                                                <span className='d-block'>
                                                    <>{details?.sku ?? 'N/A'}</>
                                                </span>
                                            </li>
                                            <li className='mb-75'>
                                                <span className='fw-bolder text-dark me-25'>
                                                    <>{FM('selling-price')}:</>
                                                </span>
                                                <span className='d-block'>
                                                    <>{CF({ money: details?.selling_price, currency })}</>
                                                </span>
                                            </li>
                                            <li className='mb-75'>
                                                <span className='fw-bolder text-dark me-25'>
                                                    <>{FM('max-retail-price')}:</>
                                                </span>
                                                <span className='d-block'>
                                                    <>
                                                        {CF({
                                                            money: details?.max_retail_price ?? 0,
                                                            currency
                                                        }) ?? 'N/A'}
                                                    </>
                                                </span>
                                            </li>
                                            <li className='mb-75'>
                                                <span className='fw-bolder text-dark me-25'>
                                                    <>{FM('purchase-price')}:</>
                                                </span>
                                                <span className='d-block'>
                                                    <>
                                                        {CF({
                                                            money: details?.purchase_price ?? 0,
                                                            currency
                                                        }) ?? 'N/A'}
                                                    </>
                                                </span>
                                            </li>
                                            <li className='mb-75'>
                                                <span className='fw-bolder text-dark me-25'>
                                                    <>{FM('unit')}:</>
                                                </span>
                                                <span className='d-block'>
                                                    <>{details?.unit_type ?? 'N/A'}</>
                                                </span>
                                            </li>
                                            <li className='mb-75'>
                                                <span className='fw-bolder text-dark me-25'>
                                                    <>{FM('quantity')}:</>
                                                </span>
                                                <span className='d-block'>
                                                    <>{details?.quantity ?? 'N/A'}</>
                                                </span>
                                            </li>
                                            <li className='mb-75'>
                                                <span className='fw-bolder text-dark me-25'>
                                                    <>{FM('categories')}:</>
                                                </span>
                                                <span className='d-block text-capitalize text-primary'>
                                                    <>
                                                        {prodData?.category?.id ? (
                                                            <Link
                                                                state={{ ...prodData?.category }}
                                                                to={getPath('admin.category.view', {
                                                                    id: prodData?.category?.id
                                                                })}
                                                            >
                                                                {prodData?.category?.name}
                                                            </Link>
                                                        ) : (
                                                            'N/A'
                                                        )}
                                                        {prodData?.subcategory?.id ? (
                                                            <Link
                                                                state={{ ...prodData?.subcategory }}
                                                                to={getPath('admin.category.view', {
                                                                    id: prodData?.subcategory?.id
                                                                })}
                                                            >
                                                                {prodData?.subcategory?.name
                                                                    ? ` / ${prodData?.subcategory?.name}`
                                                                    : ''}
                                                            </Link>
                                                        ) : (
                                                            ''
                                                        )}
                                                    </>
                                                </span>
                                            </li>
                                            <li className='mb-75'>
                                                <span className='fw-bolder text-dark me-25'>
                                                    <>{FM('expiry-date')}:</>
                                                </span>
                                                <span className='d-block'>
                                                    <>{details?.expiry ?? 'N/A'}</>
                                                </span>
                                            </li>

                                            <li className='mb-75'>
                                                <span className='fw-bolder text-dark me-25'>
                                                    <>{FM('updated-at')}:</>
                                                </span>
                                                <span className='d-block'>
                                                    <>{formatDate(details?.updated_at, 'YYYY-MM-DD HH:MM') ?? 'N/A'}</>
                                                </span>
                                            </li>
                                            <li className='mb-75'>
                                                <span className='fw-bolder text-dark me-25'>
                                                    <>{FM('created-at')}:</>
                                                </span>
                                                <span className='d-block'>
                                                    <>{formatDate(details?.created_at, 'YYYY-MM-DD HH:MM') ?? 'N/A'}</>
                                                </span>
                                            </li>
                                        </ul>
                                    </>
                                ) : null}
                            </div>
                        </CardBody>
                    </Card>
                </>
            ) : (
                <>
                    <Card className='mb-0 h-100'>
                        <Shimmer height={200} />
                        <CardBody>
                            <div className='info-container'>
                                <ul className='list-unstyled'>
                                    <li className='mb-75'>
                                        <Shimmer height={50} />
                                    </li>
                                    <li className='mb-75'>
                                        <Shimmer height={100} />
                                    </li>
                                    <li className='mb-75'>
                                        <Shimmer height={50} />
                                    </li>
                                    <li className='mb-75'>
                                        <Shimmer height={50} />
                                    </li>
                                    <li className='mb-75'>
                                        <Shimmer height={50} />
                                    </li>
                                    <li className='mb-75'>
                                        <Shimmer height={50} />
                                    </li>
                                    <li className='mb-75'>
                                        <Shimmer height={50} />
                                    </li>
                                    <li className='mb-75'>
                                        <Shimmer height={50} />
                                    </li>
                                    <li className='mb-75'>
                                        <Shimmer height={50} />
                                    </li>
                                </ul>
                            </div>
                        </CardBody>
                    </Card>
                </>
            )}
        </Fragment>
    )
}

export default ProductInfoCard
