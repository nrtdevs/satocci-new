/* eslint-disable prettier/prettier */
// ** React Imports

// ** Reactstrap Imports
import { Card, CardImg, Col, Row, Table } from 'reactstrap'

// ** Styles
import '@styles/base/pages/app-invoice-print.scss'
import { useEffect, useReducer } from 'react'
import { useParams } from 'react-router-dom'
import { OrdersParams, useOrderDetailsWithIdMutation } from '../../../../redux/RTKQuery/OrdersRTK'
import { FM, isValid, isValidUrl, log } from '../../../../utility/helpers/common'
import useUser from '../../../../utility/hooks/useUser'
import httpConfig from '../../../../utility/http/httpConfig'
import { stateReducer } from '../../../../utility/stateReducer'
import { CF, decrypt, fastLoop, formatDate } from '../../../../utility/Utils'

interface States {
    details?: OrdersParams
    orderDetails?: any
    lastRefresh?: any
    page?: any
    per_page_record?: any
    search?: any
    reload?: any
    isRemoving?: boolean
    isReloading?: boolean
    isAddingNewData?: boolean
    transactionFilter?: boolean
}
const Print = () => {
    const params = useParams()
    const initState: States = {
        page: 1,
        per_page_record: 15,
        lastRefresh: new Date().getTime(),
        details: {
            id: null,
            order_number: null,
            order_barcode_image: null,
            store_id: null,
            order_id: null,
            quantity: null,
            price: null,
            user_id: null,
            discount_value: null,
            transaction_id: null,
            discount_price: null,
            currency: null,
            total_amount: null,
            vat_percent: null,
            vat_amount: null,
            coupon: null,
            coupon_discount: null,
            paid_amount: null,
            payment_method: null,
            order_details: null,
            card_number: null,
            payment_status: null,
            status: null,
            entry_mode: null,
            created_at: null,
            updated_at: null
        },
        orderDetails: []
    }
    const reducers = stateReducer<States>
    const [state, setState] = useReducer(reducers, initState)
    // ** Print on mount
    const user = useUser()
    // const [loadDetails, { data, isSuccess, isLoading, isError }] = useStoreInvoiceWithIdMutation()
    const [loadDetails, { data, isSuccess, isLoading, isError }] = useOrderDetailsWithIdMutation()

    useEffect(() => {
        if (isValid(params?.orderId)) {
            loadDetails({
                id: params?.orderId
            })
        }
    }, [params?.orderId])

    useEffect(() => {
        if (isSuccess) {
            setState({
                details: data?.payload,
                orderDetails: data?.payload?.order_details
            })
        }
    }, [isSuccess])
    useEffect(() => {
        if (isSuccess) {
            setTimeout(() => window.print(), 1000)
        }
    }, [isSuccess])
    const renderData = () => {
        return state.orderDetails?.map((item: any, i: any) => {
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
                        <u className='text-primary' role={'button'}>
                            {item?.variant_info?.sku}
                        </u>
                        {/* </Link> */}
                    </td>
                    <td>{item?.variant_info?.name}</td>

                    <td>
                        <div className=''>{item?.quantity}</div>
                    </td>
                    <td>
                        <div className=''>{item?.variant_info?.unit_type}</div>
                    </td>
                    {/* <td className='text-nowrap'>
            <div className='d-flex flex-column'>
              <span className='fw-bolder mb-25'> {Math.floor(10 + Math.random() * 90)}</span>
              <span className='font-small-2 text-muted'>in {col.time}</span>
            </div>
          </td> */}
                    {/* <td>{CF(col.revenue)}</td> */}
                    <td>{CF({ money: item?.variant_info?.selling_price, currency: user?.currency })}</td>
                    <td>{CF({ money: 0, currency: user?.currency })}</td>
                    <td>
                        {CF({
                            money: Number(item?.quantity) * item?.variant_info?.selling_price,
                            currency: user?.currency
                        })}
                    </td>
                </tr>
            )
        })
    }
    function sumSumPrice(array: Array<any>) {
        let re = 0
        fastLoop(array, (a: any, index: number) => {
            re += Number(a?.quantity) * a?.variant_info?.selling_price
        })
        return re
    }

    log('params', state?.orderDetails)
    return (
        <div className='invoice-print p-3'>
            <div className='d-flex justify-content-between flex-md-row flex-column pb-2'>
                <div>
                    <div className='d-flex mb-1'>
                        <CardImg
                            className='border-bottom p-2'
                            top
                            src={isValidUrl(state.details?.order_barcode_image)
                                ? state.details?.order_barcode_image
                                : `${httpConfig.baseUrl2}${state.details?.order_barcode_image}`}
                        />
                        {/* <h3 className='text-primary fw-bold ms-1'>Vuexy</h3> */}
                    </div>
                    {/* <p className='mb-25'>Office 149, 450 South Brand Brooklyn</p>
          <p className='mb-25'>San Diego County, CA 91905, USA</p>
          <p className='mb-0'>+1 (123) 456 7891, +44 (876) 543 2198</p> */}
                </div>
                <div className='mt-md-0 mt-2'>
                    <div className='invoice-date-wrapper'>
                        <span className='invoice-date-title me-1'>{FM('order-number')}:</span>
                        <span className='fw-bolder'>{state.details?.order_number}</span>
                    </div>
                    <div className='invoice-date-wrapper mb-50'>
                        <span className='invoice-date-title me-1'>{FM('transaction-id')}:</span>
                        <span className='fw-bolder'> {state.details?.transaction_id}</span>
                    </div>
                    <div className='invoice-date-wrapper mb-50'>
                        <span className='invoice-date-title me-1'>{FM('coupon-code')}:</span>
                        <span className='fw-bolder'>{state.details?.coupon_code ?? 'N/A'}</span>
                    </div>
                    <div className='invoice-date-wrapper mb-50'>
                        <span className='invoice-date-title me-1'>{FM('order-date')}:</span>
                        <span className='fw-bolder'>{formatDate(state.details?.created_at)}</span>
                    </div>
                    <div className='invoice-date-wrapper mb-50'>
                        <span className='invoice-date-title me-1'>{FM('status')}:</span>
                        <span className='fw-bolder '>
                            {state.details?.payment_status === 1
                                ? FM('paid')
                                : state.details?.payment_status === 2
                                    ? FM('failed')
                                    : FM('pending')}
                        </span>
                    </div>
                </div>
                <div className='mt-md-0 mt-2'>
                    <div className='invoice-date-wrapper'>
                        <span className='invoice-date-title me-1'>{FM('card-number')}:</span>
                        <span className='fw-bolder'>{state.details?.card_number}</span>
                    </div>
                    <div className='invoice-date-wrapper mb-50'>
                        <span className='invoice-date-title me-1'>{FM('currency')}:</span>
                        <span className='fw-bolder'> {state.details?.currency}</span>
                    </div>
                    <div className='invoice-date-wrapper mb-50'>
                        <span className='invoice-date-title me-1'>{FM('payment-method')}:</span>
                        <span className='fw-bolder'>
                            {state.details?.payment_method === 1 ? FM('card') : 'N/A'}
                        </span>
                    </div>
                    <div className='invoice-date-wrapper mb-50'>
                        <span className='invoice-date-title me-1'>{FM('transaction-id')}:</span>
                        <span className='fw-bolder'>{state.details?.transaction_id}</span>
                    </div>
                    {/* {/* <div className='invoice-date-wrapper mb-50'>
            <span className='invoice-date-title me-1'>{FM('coupon-discount')}:</span>
            <span className='fw-bolder '>{state.details?.coupon_discount}</span>
          </div> */}
                </div>
            </div>

            <hr className='my-2' />

            <Row className='pb-2'>
                <Col sm='6'>
                    <h6 className='mb-1'>{FM('invoice-to')}:</h6>
                    <p className='mb-25'>{state?.details?.store?.city}</p>
                    <p className='mb-25'>{state?.details?.store?.country}</p>
                    <p className='mb-25'>{decrypt(state?.details?.store?.address)}</p>
                    <p className='mb-25'>{state?.details?.store?.zip_code}</p>
                </Col>
                <Col className='mt-sm-0 mt-2' sm='6'>
                    <h6 className='mb-1'>{FM('payment-details')}:</h6>
                    <table>
                        <tbody>
                            <tr>
                                <td className='pe-1'>{FM('vat')}:</td>
                                <td>
                                    <strong>{state.details?.vat_amount ?? 'N/A'}</strong>
                                </td>
                            </tr>
                            <tr>
                                <td className='pe-1'>{FM('coupon-discount')}:</td>
                                <td>{state.details?.coupon_discount}</td>
                            </tr>
                            <tr>
                                <td className='pe-1'>{FM('paid-amount')}:</td>
                                <td>{CF({ money: state.details?.paid_amount, currency: user?.currency })}</td>
                            </tr>
                            <tr>
                                <td className='pe-1'>{FM('total')}:</td>
                                <td>{CF({ money: state.details?.total_amount, currency: user?.currency })}</td>
                            </tr>
                            {/* <tr>
                <td className='pe-1'>{FM('out-time')}:</td>
                <td>{state.details.out_time}</td>
              </tr> */}
                        </tbody>
                    </table>
                </Col>
            </Row>

            <Card className='p-0'>
                <Table>
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>{FM('sku')}</th>
                            <th>{FM('product-name')}</th>
                            <th>{FM('quantity')}</th>
                            <th>{FM('unit')}</th>
                            <th>{FM('price')}</th>
                            <th>{FM('tax')}</th>
                            <th>{FM('total')}</th>
                        </tr>
                    </thead>
                    <tbody>{renderData()}</tbody>
                    <tfoot className=''>
                        <tr className='border-top'>
                            <td colSpan={5}></td>
                            <td colSpan={3} className='p-1'>
                                <table className='table'>
                                    <tr>
                                        <td className=''>
                                            <span className='fw-bold'>{FM('sub-total')}</span>
                                        </td>
                                        <td style={{ width: '1%' }}>:</td>

                                        <td className='text-end' style={{ width: '50%' }}>
                                            <span className='fw-bolder'>
                                                {CF({
                                                    money: sumSumPrice(state.details?.order_details),
                                                    currency: user?.currency
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
                                                {CF({ money: 0, currency: user?.currency })}
                                            </span>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className=''>
                                            <span className='fw-bold'>
                                                {FM('tax')} ({state.details?.vat_percent}%)
                                            </span>
                                        </td>
                                        <td>:</td>

                                        <td className='text-end'>
                                            <span className='fw-bolder'>
                                                {CF({ money: state.details?.vat_amount, currency: user?.currency })}
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
                                                {CF({ money: state.details?.paid_amount, currency: user?.currency })}
                                            </span>
                                        </td>
                                    </tr>
                                </table>
                            </td>
                        </tr>
                    </tfoot>
                </Table>
            </Card>

            <hr className='my-2' />
        </div>
    )
}

export default Print
