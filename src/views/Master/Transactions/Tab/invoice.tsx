/* eslint-disable prettier/prettier */
// ** React Imports

// ** Reactstrap Imports
import { Badge, Card, CardBody, CardHeader, CardImg, CardTitle, Col, Row, Table } from 'reactstrap'

// ** Styles
import '@styles/base/pages/app-invoice-print.scss'
import { CF, decrypt, fastLoop, formatDate } from '../../../../utility/Utils'
import { FM, isValid, isValidUrl } from '../../../../utility/helpers/common'
import useUser from '../../../../utility/hooks/useUser'
import httpConfig from '../../../../utility/http/httpConfig'
import Ratings from '../../../components/ratings'
import BsTooltip from '../../../components/tooltip'

interface detailsInfoType {
    details?: any
}
const Invoice = ({ details }: detailsInfoType) => {
    // ** Print on mount
    const user = useUser()

    const renderquantityWIthunit = (qty: any, operPr: any, unitType: any) => {
        const qtt = isValid(qty) ? qty : ''
        const prCount = isValid(operPr) ? operPr : ''
        const untype = isValid(unitType) ? unitType : ''
        return (
            <p>
                <span>{qtt}</span>
                {/* {isValid(prCount) ? ` (${prCount}  ${untype})` : ` (${untype})`} */}
            </p>
        )
    }

    const renderData = () => {
        return details?.order_details?.map((item: any, i: any) => {
            return (
                <tr key={item?.order_id}>
                    <td className=''>#{i + 1}</td>
                    <td>
                        {/* <Link
              state={{ ...item?.variant_info }}
              to={getPath('product.details', { id: item?.variant_info?.id })}
              className='d-block'
              id='create-button'
            > */}
                        <span className='' role={''}>
                            {item?.variant_info?.sku}
                        </span>
                        {/* </Link> */}
                    </td>
                    <td>{item?.variant_info?.name}</td>

                    <td>
                        <div className=''>
                            {renderquantityWIthunit(
                                item?.quantity,
                                item?.open_pr_wt_pc,
                                item?.variant_info?.unit_type
                            )}
                            {/* {`${item?.quantity} ( ${item?.open_pr_wt_pc} ${item?.variant_info?.unit_type})`} */}
                        </div>
                    </td>
                    {/* <td>
            <div className=''>
              <span className='me-25'> {item?.open_pr_wt_pc ?? ''}</span>
              {item?.variant_info?.unit_type}
            </div>
          </td> */}
                    {/* <td className='text-nowrap'>
            <div className='d-flex flex-column'>
              <span className='fw-bolder mb-25'> {Math.floor(10 + Math.random() * 90)}</span>
              <span className='font-small-2 text-muted'>in {col.time}</span>
            </div>
          </td> */}
                    {/* <td>{CF(col.revenue)}</td> */}
                    <td>
                        {CF({
                            money: item?.price,
                            currency: isValid(user?.currency) ? user?.currency : 'SEK'
                        })}
                    </td>
                    {/* <td>
            {CF({
              money: item?.discount_value,
              currency: isValid(user?.currency) ? user?.currency : 'SEK'
            })}
          </td> */}
                    <td>
                        {CF({
                            money: item?.max_retail_price,
                            currency: isValid(user?.currency) ? user?.currency : 'SEK'
                        })}
                    </td>

                    <td>
                        <span className='fw-bolder'>{
                            CF({
                                money: item?.vat_amount,
                                currency: isValid(user?.currency) ? user?.currency : 'SEK'
                            })

                        }</span>
                        <p color='light-primary'>{`(${item?.vat_percent}%)`}</p>
                    </td>
                    <td>
                        {CF({
                            money: item?.subtotal,
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
                    <CardTitle>{FM('order-details')}</CardTitle>
                </CardHeader>
                <CardBody className='pt-2'>
                    <Row>
                        <Col>
                            <div className='mb-50'>
                                <p className='invoice-date-title mb-25'>{FM('order-number')}:</p>
                                <p className='fw-bolder'>{details?.order_number}</p>
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
                        <Col>
                            <div className=' mb-50'>
                                <p className='invoice-date-title mb-25'>{FM('order-date')}:</p>
                                <p className='fw-bolder'>{formatDate(details?.created_at)}</p>
                            </div>
                        </Col>
                        <Col>
                            <div className=' mb-50'>
                                <p className='invoice-date-title mb-25'>{FM('status')}:</p>
                                <p className='fw-bolder '>
                                    {details?.payment_status === 1
                                        ? FM('paid')
                                        : details?.payment_status === 2
                                            ? FM('failed')
                                            : FM('pending')}
                                </p>
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

                                    {`${details?.payment_method}` === `${1}` ? (
                                        <Badge color={'light-success'} pill>
                                            <>{`${FM('card')} (${details?.card_number} )`}</>
                                        </Badge>
                                    ) : `${details?.payment_method}` === `${2}` ? (
                                        <Badge color={'light-danger'} pill>
                                            <>{FM('stripe')}</>
                                        </Badge>
                                    ) : `${details?.payment_method}` === `${3}` ? (
                                        <Badge color={'light-primary'} pill>
                                            <>{FM('tabby')}</>
                                        </Badge>
                                    ) : (
                                        <Badge color={'light-primary'} pill>
                                            <>{FM('crypto-wallet')}</>
                                        </Badge>
                                    )}
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
                        <Col>
                            <div className=' mb-50'>
                                <p className='invoice-date-title mb-25'>{FM('transaction-id')}:</p>
                                <p className='fw-bolder'>{`${details?.transaction_id}`}</p>
                            </div>
                        </Col>
                    </Row>
                </CardBody>
            </Card>
            <Card>
                <CardHeader className='border-bottom'>
                    <CardTitle>{FM('order-rating')}</CardTitle>
                    {Number(details?.order_rating?.rating) > 0 ? (
                        <Ratings rating={Number(details?.order_rating?.rating)} max={5} />
                    ) : (
                        <span className='text-danger'>{FM('no-rating-available')}</span>
                    )}
                </CardHeader>
                <CardBody className='pt-2'>
                    <Row>
                        <Col>
                            <div className=' mb-50'>
                                <p className='invoice-date-title mb-25'>{FM('comment')}:</p>
                                <p className='fw-bolder'>{details?.order_rating?.comment}</p>
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
                        <Col md='3'>
                            <div className=''>
                                <p className='invoice-date-title mb-25'>{FM('customer-name')}:</p>
                                <p className='fw-bolder'>{decrypt(details?.user?.name)}</p>
                            </div>
                        </Col>

                        <Col md='3'>
                            <div className=' mb-50'>
                                <p className='invoice-date-title mb-25'>{FM('address')}:</p>
                                <p className='fw-bolder'>{isValid(details?.user?.address) ? decrypt(`${details?.user?.address}`) : FM("n/a")}</p>
                            </div>
                        </Col>
                        <Col md='3'>
                            <div className=''>
                                <p className='invoice-date-title mb-25'>{FM('mobile-number')}:</p>
                                <p className='fw-bolder'>{decrypt(details?.user?.mobile_number)}</p>
                            </div>

                        </Col>
                        <Col md='3'>
                            <div className=''>
                                <p className='invoice-date-title mb-25'>{FM('customer-rating')}:</p>
                                <div className='user-info text-truncate'>
                                    {details?.order_rating?.rating > 0 ? (
                                        <Ratings rating={details?.customer_rating} max={5} />
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
                            <div className=' mb-50'>
                                <p className='invoice-date-title mb-25'>{FM('total-amount-paid')}:</p>
                                <p className='fw-bolder '>
                                    {CF({ money: details?.total_amount, currency: details?.currency })}
                                </p>
                            </div>
                        </Col>
                        <Col>
                            <div className='mb-50'>
                                <p className='invoice-date-title mb-25'>{FM('satocci-processing-fee')}:</p>
                                <p className='fw-bolder'>
                                    {CF({ money: details?.admin_share, currency: details?.currency })}
                                </p>
                            </div>
                        </Col>
                        <Col>
                            <div className=' mb-50'>
                                <p className='invoice-date-title mb-25'>{FM('total-profit')}:</p>
                                <span className='fw-bolder'>
                                    {`${CF({
                                        money: Number(details?.gateway_processing_fee) + Number(details?.store_share),
                                        currency: details?.currency
                                    })}   `}

                                    {/* {isValid(details?.gateway_processing_charge) ? (
                                        <BsTooltip title={FM('gateway-processing-charge')}>
                                            <Badge color='light-primary'>{details?.gateway_processing_charge}</Badge>
                                        </BsTooltip>
                                    ) : null} */}
                                </span>
                            </div>
                        </Col>
                        {/* <Col>
                            <div className=' mb-50'>
                                <p className='invoice-date-title mb-25'>{FM('store-share')}:</p>
                                <p className='fw-bolder'>
                                    {CF({ money: details?.store_share, currency: details?.currency })}
                                </p>
                            </div>
                        </Col>
                        <Col>
                            <div className=' mb-50'>
                                <p className='invoice-date-title mb-25'>{FM('paid-amount')}:</p>
                                <p className='fw-bolder '>
                                    {CF({ money: details?.paid_amount, currency: details?.currency })}
                                </p>
                            </div>
                        </Col> */}

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
                            <th>{FM('sku')}</th>
                            <th>{FM('product-name')}</th>
                            <th>{FM('quantity')}</th>
                            <th>{FM('price')}</th>
                            <th>{FM('max-retail-price')}</th>
                            <th>{FM('tax')}</th>
                            <th>{FM('sub-total')}</th>
                        </tr>
                    </thead>
                    <tbody>{renderData()}</tbody>
                    <tfoot className=''>
                        <tr className='border-top'>
                            <td colSpan={5}>
                                {details?.order_barcode_image ? (
                                    <CardImg
                                        className=' p-2'
                                        top
                                        style={{ width: 250 }}
                                        src={isValidUrl(details?.order_barcode_image)
                                            ? details?.order_barcode_image
                                            : `${httpConfig.baseUrl2}${details?.order_barcode_image}`}
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
                    </tfoot>
                </Table>
            </Card>

            {/* <Row className='invoice-sales-total-wrapper mt-1'>
        <Col md='2'>
          <TooltipLink
            title={<>{FM('print')}</>}
            to={getPath('print.invoice', { orderId: details?.id })}
            className='btn btn-dark btn-sm  d-block align-items-center'
          >
            <span className=''>{FM('print')}</span>
          </TooltipLink>
        </Col>
      </Row> */}

            <hr className='my-2' />
        </div>
    )
}

export default Invoice
