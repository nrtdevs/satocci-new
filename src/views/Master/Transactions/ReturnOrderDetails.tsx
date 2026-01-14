/* eslint-disable prettier/prettier */
// ** React Imports

// ** Reactstrap Imports
import { Badge, Card, CardBody, CardHeader, CardImg, CardTitle, Col, Row, Table } from 'reactstrap'

// ** Styles
import '@styles/base/pages/app-invoice-print.scss'
import { CF, decrypt, fastLoop, formatDate } from '../../../utility/Utils'
import { FM, isValid, log } from '../../../utility/helpers/common'
import useUser from '../../../utility/hooks/useUser'
import httpConfig from '../../../utility/http/httpConfig'
import Ratings from '../../components/ratings'
import BsTooltip from '../../components/tooltip'
import { useOrderDetailsWithIdMutation } from '../../../redux/RTKQuery/OrdersRTK'
import { use } from 'i18next'
import { useReturnOrderDetailsMutation } from '../../../redux/RTKQuery/ReturnOrderRTK'
import { useEffect } from 'react'
import { useParams } from 'react-router-dom'

const ReturnOrderDetails = () => {
  // ** Print on mount
  const user = useUser()
  const params = useParams()
  const [loadDetails, { data, isSuccess, isLoading, isError }] = useReturnOrderDetailsMutation()
  const details = data?.payload

  useEffect(() => {
    if (isValid(params?.id)) {
      loadDetails(params?.id)
    }
  }, [params])

  const renderData = () => {
    return details?.order_item_returns?.map((item: any, i: any) => {
      return (
        <tr key={item?.order_id}>
          <td className=''>#{i + 1}</td>

          <td>{item?.product_variant?.name}</td>
          <td>{item?.verified_quantity}</td>
          <td>{item?.rejected_quantity}</td>

          <td>{item?.reason_for_return}</td>
          <td>{item?.reason_for_return_rejection}</td>

          <td>
            {CF({
              money: item?.return_subtotal,
              currency: isValid(user?.currency) ? user?.currency : 'SEK'
            })}
          </td>
        </tr>
      )
    })
  }

  return (
    <div className=''>
      <Card>
        <CardHeader className='border-bottom'>
          <CardTitle>{FM('order-return-details')}</CardTitle>
        </CardHeader>
        <CardBody className='pt-2'>
          <Row>
            <Col>
              <div className='mb-50'>
                <p className='invoice-date-title mb-25'>{FM('order-number')}:</p>
                <p className='fw-bolder'>{details?.order.order_number}</p>
              </div>
            </Col>
            <Col>
              <div className='mb-50'>
                <p className='invoice-date-title mb-25'>{FM('return-reference_number')}:</p>
                <p className='fw-bolder'>{details?.return_reference_number}</p>
              </div>
            </Col>
            <Col>
              <div className='mb-50'>
                <p className='invoice-date-title mb-25'>{FM('seller-id')}:</p>
                <p className='fw-bolder'>Satocci</p>
              </div>
            </Col>
            <Col>
              <div className='mb-50'>
                <p className='invoice-date-title mb-25'>{FM('cashier-id')}:</p>
                <p className='fw-bolder'>Satocci</p>
              </div>
            </Col>
          </Row>
          <Row>
            <Col>
              <div className=''>
                <p className='invoice-date-title mb-25'>{FM('currency')}:</p>
                <p className='fw-bolder'> {details?.currency}</p>
              </div>
            </Col>
            <Col>
              <div className=''>
                <p className='invoice-date-title mb-25'>{FM('payment-method')}:</p>
                <p className='fw-bolder'>
                  {details?.payment_method === 1
                    ? `${FM('card')} (${details?.card_number} )`
                    : FM('tabby')}
                </p>
              </div>
            </Col>
            <Col>
              <div className=' '>
                <p className='invoice-date-title mb-25'>{FM('coupon-applied')}:</p>
                <p className='fw-bolder '>
                  {isValid(details?.coupon?.id) ? (
                    <Badge pill color='light-success'>
                      {FM('yes')}
                    </Badge>
                  ) : (
                    <Badge pill color='light-danger'>
                      {FM('no')}
                    </Badge>
                  )}
                </p>
              </div>
            </Col>

            <Col>
              <div className=''>
                <p className='invoice-date-title mb-25'>{FM('coupon-code')}:</p>
                <p className='fw-bolder'>
                  {isValid(details?.coupon_code) ? (
                    <>
                      <Badge pill color='light-success'>
                        {details?.coupon_code}{' '}
                      </Badge>
                      {details?.is_admin_coupon === 1 ? FM('by-admin') : null}
                    </>
                  ) : (
                    <>{FM('no-coupon-applied')}</>
                  )}
                </p>
              </div>
            </Col>
          </Row>
          <Row>
            <Col>
              <div className=' mb-50'>
                <p className='invoice-date-title mb-25'>{FM('transaction-id')}:</p>
                <p className='fw-bolder'>{`${details?.refund_transaction_id}`}</p>
              </div>
            </Col>
            <Col>
              <div className=' mb-50'>
                <p className='invoice-date-title mb-25'>{FM('status')}:</p>
                <p className='fw-bolder '>
                  {details?.status === 1 ? (
                    <Badge color={'light-warning'} pill>
                      <>{FM('pending')}</>
                    </Badge>
                  ) : details?.status === 2 ? (
                    <Badge color={'light-primary'} pill>
                      <>{FM('verified')}</>
                    </Badge>
                  ) : details?.status === 3 ? (
                    <Badge color={'light-danger'} pill>
                      <>{FM('rejected')}</>
                    </Badge>
                  ) : (
                    <Badge color={'light-success'} pill>
                      <>{FM('completed')}</>
                    </Badge>
                  )}
                </p>
              </div>
            </Col>
            <Col>
              <div className=' mb-50'>
                <p className='invoice-date-title mb-25'>{FM('order-date')}:</p>
                <p className='fw-bolder'>{formatDate(details?.created_at)}</p>
              </div>
            </Col>
            {/* <Col >
                            <div className=''>
                                <p className='invoice-date-title mb-25'>{FM('order-rating')}:</p>
                                <div className='user-info text-truncate'>
                                    {details?.order.customer_rating > 0 ? (
                                        <Ratings rating={details?.order?.order_rating} max={5} />
                                    ) : (
                                        <span className='text-danger'>{FM('no-rating-available')}</span>
                                    )}
                                </div>
                            </div>
                        </Col> */}
          </Row>
        </CardBody>
      </Card>
      <Card>
        <CardHeader className='border-bottom'>
          <CardTitle>{FM('useful-return-dates')}</CardTitle>
        </CardHeader>
        <CardBody className='pt-2'>
          <Row>
            <Col>
              <div className=' mb-50'>
                <p className='invoice-date-title mb-25'>{FM('initiated')}:</p>
                <Badge pill color='light-primary' className='fw-bolder'>
                  {formatDate(details?.return_initiated)}
                </Badge>
              </div>
            </Col>
            <Col>
              <div className=' mb-50'>
                <p className='invoice-date-title mb-25'>{FM('approve')}:</p>
                <Badge pill color='light-info' className='fw-bolder'>
                  {formatDate(details?.return_approved)}
                </Badge>
              </div>
            </Col>

            <Col>
              <div className=' mb-50'>
                <p className='invoice-date-title mb-25'>{FM('completed')}:</p>
                <Badge pill color='light-success' className='fw-bolder'>
                  {formatDate(details?.return_completed)}
                </Badge>
              </div>
            </Col>
            <Col>
              <div className=' mb-50'>
                <p className='invoice-date-title mb-25'>{FM('reject')}:</p>
                <Badge pill color='light-danger' className='fw-bolder'>
                  {formatDate(details?.return_rejected)}
                </Badge>
              </div>
            </Col>
          </Row>
        </CardBody>
      </Card>
      <Card>
        <CardHeader className='border-bottom'>
          <CardTitle>{FM('customer-details')}</CardTitle>
        </CardHeader>
        <CardBody className='pt-2'>
          <Row>
            <Col md='4'>
              <div className=''>
                <p className='invoice-date-title mb-25'>{FM('customer-name')}:</p>
                <p className='fw-bolder'>{decrypt(details?.user?.name)}</p>
              </div>
            </Col>
            <Col md='4'>
              <div className=' mb-50'>
                <p className='invoice-date-title mb-25'>{FM('address')}:</p>
                <p className='fw-bolder'>{decrypt(`${details?.user?.email}`)}</p>
              </div>
            </Col>

            <Col md='4'>
              <div className=''>
                <p className='invoice-date-title mb-25'>{FM('customer-rating')}:</p>
                <div className='user-info text-truncate'>
                  {details?.order.customer_rating > 0 ? (
                    <Ratings rating={details?.order?.customer_rating} max={5} />
                  ) : (
                    <span className='text-danger'>{FM('no-rating-available')}</span>
                  )}
                </div>
              </div>
            </Col>
          </Row>
        </CardBody>
      </Card>
      <Card>
        <CardHeader className='border-bottom'>
          <CardTitle>{FM('distributed-amount')}</CardTitle>
        </CardHeader>
        <CardBody className='pt-2'>
          <Row>
            <Col>
              <div className='mb-50'>
                <p className='invoice-date-title mb-25'>{FM('admin-share')}:</p>
                <p className='fw-bolder'>
                  {CF({ money: details?.admin_share_return, currency: details?.currency })}
                </p>
              </div>
            </Col>
            <Col>
              <div className=' mb-50'>
                <p className='invoice-date-title mb-25'>{FM('gateway-processing-fee')}:</p>
                <span className='fw-bolder'>
                  {`${CF({
                    money: details?.processing_fee_return,
                    currency: details?.currency
                  })}   `}

                  {isValid(details?.gateway_processing_charge) ? (
                    <BsTooltip title={FM('gateway-processing-charge')}>
                      <Badge color='light-primary'>{details?.gateway_processing_charge}</Badge>
                    </BsTooltip>
                  ) : null}
                </span>
              </div>
            </Col>
            <Col>
              <div className=' mb-50'>
                <p className='invoice-date-title mb-25'>{FM('store-share')}:</p>
                <p className='fw-bolder'>
                  {CF({ money: details?.store_share_return, currency: details?.currency })}
                </p>
              </div>
            </Col>
            <Col>
              <div className=' mb-50'>
                <p className='invoice-date-title mb-25'>{FM('total')}:</p>
                <p className='fw-bolder '>
                  {CF({ money: details?.total_return_amount, currency: details?.currency })}
                </p>
              </div>
            </Col>
            <Col>
              <div className=' mb-50'>
                <p className='invoice-date-title mb-25'>{FM('refund-amount')}:</p>
                <p className='fw-bolder '>
                  {CF({ money: details?.refund_amount, currency: details?.currency })}
                </p>
              </div>
            </Col>
          </Row>
        </CardBody>
      </Card>
      <Card className='p-0'>
        <CardHeader className='border-bottom'>
          <CardTitle>{FM('product-details')}</CardTitle>
        </CardHeader>
        <Table>
          <thead>
            <tr>
              <th>#</th>

              <th>{FM('product-name')}</th>
              <th>{FM('verified-quantity')}</th>
              <th>{FM('rejected-quantity')}</th>
              <th>{FM('reason-for-return')}</th>
              <th>{FM('reason-for-rejection')}</th>

              <th>{FM('sub-total')}</th>
            </tr>
          </thead>
          <tbody>{renderData()}</tbody>
          {/* <tfoot className=''>
                        <tr className='border-top'>
                            <td colSpan={5}>
                                {details?.order_barcode_image ? (
                                    <CardImg
                                        className=' p-2'
                                        top
                                        style={{ width: 250 }}
                                        src={`${httpConfig.baseUrl2}${details?.order_barcode_image}`}
                                    />
                                ) : null}
                            </td>
                            <td colSpan={3} className='p-1'>
                                <table className='table'>
                                    <tr>
                                        <td className=''>
                                            <span className='fw-bold'>
                                                {FM('tax')} ({details?.vat_percent}%)
                                            </span>
                                        </td>
                                        <td>:</td>

                                        <td className='text-end'>
                                            <span className='fw-bolder'>
                                                +{' '}
                                                {CF({
                                                    money: details?.vat_amount,
                                                    currency: isValid(user?.currency) ? user?.currency : 'SEK'
                                                })}
                                            </span>
                                        </td>
                                    </tr>
                                    <tr className=''>
                                        <td className=''>
                                            <span className='fw-bold'>{FM('discount')}</span>
                                        </td>
                                        <td>:</td>

                                        <td className='text-end'>
                                            <span className='fw-bolder'>
                                                -{' '}
                                                {CF({
                                                    money: details?.coupon_discount,
                                                    currency: isValid(user?.currency) ? user?.currency : 'SEK'
                                                })}
                                            </span>
                                        </td>
                                    </tr>
                                    <tr className=''>
                                        <td className=''>
                                            <span className='fw-bolder'>{FM('total')}</span>
                                        </td>
                                        <td>:</td>

                                        <td className='text-end'>
                                            <span className='fw-bolder'>
                                                {CF({
                                                    money: details?.paid_amount,
                                                    currency: isValid(user?.currency) ? user?.currency : 'SEK'
                                                })}
                                            </span>
                                        </td>
                                    </tr>
                                </table>
                            </td>
                        </tr>
                    </tfoot> */}
        </Table>
      </Card>
      <hr className='my-2' />
    </div>
  )
}

export default ReturnOrderDetails
