import { Fragment } from 'react'
import { Badge, Card, CardBody, CardHeader, CardTitle } from 'reactstrap'
import { FM } from '../../../../utility/helpers/common'
import { CF, formatDate } from '../../../../utility/Utils'
import Shimmer from '../../../components/shimmers/Shimmer'

type theProps = {
  details?: any
  loading?: boolean
}
const TransactionInfo = ({ details, loading = false }: theProps) => {
  return (
    <Fragment>
      {!loading ? (
        <>
          <Card className=''>
            {/* <Show IF={isValid(details?.order_number ?? details?.transaction_id)}>
              <CardImg
                top
                className='border-bottom p-2'
                src={
                  (!checkHttp(details?.product_image ?? details?.product?.product_image)
                    ? httpConfig.baseUrl2
                    : '') + (details?.product_image ?? details?.product?.product_image)
                }
                style={{ height: 200, objectFit: 'contain' }}
                alt='card-top'
              />
            </Show> */}
            <CardHeader className='border-bottom'>
              <CardTitle>{FM('order-details')}</CardTitle>
            </CardHeader>
            <CardBody className='pt-1'>
              <div className='info-container'>
                {details !== null ? (
                  <>
                    <ul className='list-unstyled'>
                      <li className='mb-75'>
                        <span className='fw-bold text-dark me-25'>
                          <>{FM('order-number')}:</>
                        </span>
                        <span className='d-block'>
                          <>
                            <span>
                              <span className='me-1 fw-bolder'>
                                {' '}
                                {details?.order_number ?? 'N/A'}
                              </span>
                            </span>
                          </>
                        </span>
                      </li>
                      <li className='mb-75'>
                        <span className='fw-bold text-dark me-25'>
                          <>{FM('payment-method')}:</>
                        </span>
                        <span className='d-block'>
                          <span className='fw-bolder'>
                            {details?.payment_method === 1
                              ? FM('stripe')
                              : details?.payment_status === 2
                              ? FM('stripe')
                              : 'N/A'}
                          </span>
                        </span>
                      </li>
                      <li className='mb-75'>
                        <span className='fw-bold text-dark me-25'>
                          <>{FM('payment-status')}:</>
                        </span>
                        <span className='d-block'>
                          <span className='fw-bolder'>
                            {details?.payment_status === 1 ? (
                              <Badge color='success'>{FM('completed')}</Badge>
                            ) : details?.payment_status === 2 ? (
                              <Badge color='danger'>{FM('cancelled')}</Badge>
                            ) : (
                              'N/A'
                            )}
                          </span>
                        </span>
                      </li>
                      <li className='mb-75'>
                        <span className='fw-bold text-dark me-25'>
                          <>{FM('card-number')}:</>
                        </span>
                        <span className='d-block '>
                          <span className='fw-bolder'>{details?.card_number ?? 'N/A'}</span>
                        </span>
                      </li>
                      <li className='mb-75'>
                        <span className='fw-bold text-dark me-25'>
                          <>{FM('transaction-id')}:</>
                        </span>
                        <span className='d-block fw-bolder'>
                          <>{details?.transaction_id ?? 'N/A'}</>
                        </span>
                      </li>

                      <li className='mb-75'>
                        <span className='fw-bold text-dark me-25'>
                          <>{FM('order-date')}:</>
                        </span>
                        <span className='d-block fw-bolder'>
                          <>{formatDate(details?.created_at, 'YYYY-MM-DD hh:mm A') ?? 'N/A'}</>
                        </span>
                      </li>
                      {/* <li className='mb-75'>
                        <span className='fw-bolder text-dark me-25'>
                          <>{FM('quantity')}:</>
                        </span>
                        <span className='d-block'>
                          <>{details?.quantity ?? 'N/A'}</>
                        </span>
                      </li> */}
                      {/* <li className='mb-75'>
                        <span className='fw-bolder text-dark me-25'>
                          <>{FM('sub-total')}:</>
                        </span>
                        <span className='d-block'>
                          <>{CF(details?.paid_amount ?? 0) ?? 'N/A'}</>
                        </span>
                      </li>
                      <li className='mb-75'>
                        <span className='fw-bolder text-dark me-25'>
                          <>{FM('total')}:</>
                        </span>
                        <span className='d-block'>
                          <>{CF(details?.total_amount ?? 0) ?? 'N/A'}</>
                        </span>
                      </li> */}
                      {/* <li className='mb-75'>
                        <span className='fw-bolder text-dark me-25'>
                          <>{FM('currency')}:</>
                        </span>
                        <span className='d-block'>
                          <>{details?.currency ?? 'N/A'}</>
                        </span>
                      </li> */}
                    </ul>
                  </>
                ) : null}
              </div>
            </CardBody>
          </Card>
          <Card>
            <CardHeader className='border-bottom'>
              <CardTitle>{FM('customer')}</CardTitle>
            </CardHeader>
            <CardBody className='pt-1'>
              {details !== null ? (
                <>
                  <ul className='list-unstyled'>
                    <li className='mb-75'>
                      <span className='fw-bold text-dark me-25'>
                        <>{FM('name')}:</>
                      </span>
                      <span className='d-block'>
                        <>
                          <span>
                            <span className='me-1 fw-bolder'> {details?.user?.name ?? 'N/A'}</span>
                          </span>
                        </>
                      </span>
                    </li>
                    <li className='mb-75'>
                      <span className='fw-bold text-dark me-25'>
                        <>{FM('email')}:</>
                      </span>
                      <span className='d-block'>
                        <>
                          <span>
                            <span className='me-1 fw-bolder'> {details?.user?.email ?? 'N/A'}</span>
                          </span>
                        </>
                      </span>
                    </li>
                    <li className='mb-75'>
                      <span className='fw-bold text-dark me-25'>
                        <>{FM('phone')}:</>
                      </span>
                      <span className='d-block'>
                        <>
                          <span>
                            <span className='me-1 fw-bolder'> {details?.user?.phone ?? 'N/A'}</span>
                          </span>
                        </>
                      </span>
                    </li>
                  </ul>
                </>
              ) : null}
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

export default TransactionInfo
