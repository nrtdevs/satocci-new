/* eslint-disable prettier/prettier */
import { Fragment, useEffect, useState } from 'react'
import Barcode from 'react-barcode'
import { Badge, Card, CardHeader, CardImg, Col, Row } from 'reactstrap'
import httpConfig from '../../../../utility/http/httpConfig'
import Shimmer from '../../../components/shimmers/Shimmer'
import { ProductVariantsType } from '../ProductForm'
import { FM, isValid, isValidUrl, log } from '../../../../utility/helpers/common'
import { CF, checkHttp, fastLoop, formatDate } from '../../../../utility/Utils'
import useUser from '../../../../utility/hooks/useUser'
type theProps = {
    details?: ProductVariantsType
    loading?: boolean
}
const BarcodesList = ({ details, loading = false }: theProps) => {
    const [ean, setEan] = useState(false)
    const user = useUser()
    const [selectedPrint, setSelectedPrint] = useState<any>()
    const handleDownload = () => {
        const el = document.getElementById("print-area-barcode")
        if (el) {
            const printWindow = window.open('', '', 'height=600,width=800');
            printWindow?.document.write('<html><head>');

            printWindow?.document.write('</head><body >');
            printWindow?.document.write(el.outerHTML);
            printWindow?.document.write('</body></html>');
            printWindow?.document.close();
            printWindow?.print();
        }


    };

    log(' barcode details', details)

    const singlePrint = () => {
        const el = document.getElementById("print-area")
        if (el) {
            const printWindow = window.open('', '', 'height=600,width=800');
            printWindow?.document.write('<html><head>');
            printWindow?.document.write(`
                <style>
                
                    #div-for-print,
                    #div-for-print * {
                      visibility: visible;
                    }
                    #div-for-print {
                      position: absolute;
                      left: 0;
                      top: 0;
                      width: 100%;
                      padding: 0;
                      margin: 0;
                    }
                    .card-body {
                      border: none;
                    }
                    .shadow-sm {
                      box-shadow: none !important;
                    }
                    .border {
                    margin: 0;
                      border: 1px solid #000 !important;
                    }
                    .rounded {
                      border-radius: 0 !important;
                    }
                    .fw-bolder {
                    margin: 10px;
                      font-weight: bold !important;
                    }
                    .text-small-12 {
                      font-size: 12px !important;
                    }
                    .p-75 {
                      padding: 0.75rem !important;
                    }
                    .border-bottom {
                      border-bottom: 1px solid #000 !important;
                    }
                    .text-primary {
                      color: #007bff !important;
                    }
                    .d-flex {
                      display: flex !important;
                    }
                    .justify-content-end {
                      justify-content: flex-end !important;
                    }
                    .col {
                      flex: 1;
                    }
                    .col-md-12 {
                      width: 100%;
                    }
                    .card-img-top {
                      display: block;
                      margin: auto;
                      height: 80px !important;
                      object-fit: contain !important;
                    }
                    .row {
                      display: flex;
                      flex-wrap: wrap;
                      margin-right: -15px;
                      margin-left: -15px;
                    }
                    .g-1 {
                      gap: 0.25rem;
                    }
                  }
                </style>
              `);
            printWindow?.document.write('</head><body >');
            printWindow?.document.write(el.outerHTML);
            printWindow?.document.write('</body></html>');
            printWindow?.document.close();
            setTimeout(() => {
                printWindow?.print();
            }, 500);
            //  printWindow?.print();
        }
    }

    useEffect(() => {
        if (isValid(selectedPrint)) {
            // handlePrint()
            singlePrint()
        }
    }, [selectedPrint])


    log(' barcode details', details)
    const renderRecentData = () => {

        const re: any = []
        fastLoop(details?.product_bar_codes, (d: any, i: any) => {

            re.push(
                <Col
                    //      {...componentRef}
                    xs='4'
                    id='print-area'
                    key={d?.id}
                    role='button'
                    className=''

                >
                    <div className={`shadow-sm border rounded`}>
                        <div className={`fw-bolder text-small-12 p-75 border-bottom`}>
                            <Row>
                                <Col> {details?.name}</Col>
                                <Col className='d-flex justify-content-end'>

                                    {formatDate(details?.created_at, 'YYYY-MM-DD, HH:MM')}
                                </Col>
                            </Row>
                        </div>
                        <div>
                            <CardImg
                                top
                                className='p-50 border-bottom'
                                src={(!checkHttp(d?.bar_code_image) ? httpConfig.baseUrl2 : '') + d?.bar_code_image}
                                style={{ height: 80, objectFit: 'contain' }}
                                alt='card-top'
                            />
                        </div>
                        <div className='p-75'>
                            <div className={`text-small-12 text-primary fw-bolder`}>
                                <Row>
                                    <Col>{CF({
                                        //money with selected?.product.vat
                                        // Number((watch('product_price') + (watch('product_price') * watch('weight') * selected?.product?.vat / 100)).toFixed(2))
                                        // eslint-disable-next-line no-mixed-operators
                                        money: Number(details?.max_retail_price),
                                        // money: Number((d?.product_variant.selling_price + d?.product_variant.selling_price * d?.quantity * d?.product_variant?.product?.vat / 100)?.toFixed(2)),
                                        currency: details?.product?.store?.currency
                                    })}</Col>

                                    <Col className='d-flex justify-content-end'>
                                        {/* {d?.quantity} {FM(details?.unit_type)} */}
                                        <Badge pill color='primary' className='ms-1' onClick={() => { setSelectedPrint(d) }}>{FM("print")}</Badge>
                                    </Col>
                                </Row>
                            </div>
                        </div>
                    </div>
                </Col>
            )
        })
        return re
    }
    return (
        <Fragment>
            {loading ? (
                <Row className='m-1 g-1 mt-0'>
                    <Col xs='3'>
                        <Card className='border mb-0'>
                            <CardHeader>
                                <Shimmer height={200} />
                            </CardHeader>
                            {/* <CardBody>{barcode?.bar_code}</CardBody> */}
                        </Card>
                    </Col>
                    <Col xs='3'>
                        <Card className='border mb-0'>
                            <CardHeader>
                                <Shimmer height={200} />
                            </CardHeader>
                            {/* <CardBody>{barcode?.bar_code}</CardBody> */}
                        </Card>
                    </Col>
                    <Col xs='3'>
                        <Card className='border mb-0'>
                            <CardHeader>
                                <Shimmer height={200} />
                            </CardHeader>
                            {/* <CardBody>{barcode?.bar_code}</CardBody> */}
                        </Card>
                    </Col>
                    <Col xs='3'>
                        <Card className='border mb-0'>
                            <CardHeader>
                                <Shimmer height={200} />
                            </CardHeader>
                            {/* <CardBody>{barcode?.bar_code}</CardBody> */}
                        </Card>
                    </Col>
                </Row>
            ) : (
                <Row
                    className='m-1 g-1 mt-0'
                // onClick={() => {
                //     setEan(!ean)
                // }}
                >
                    {/* {details?.product_bar_codes?.map((barcode, index) => {
                        return (
                            <Fragment key={barcode?.id}>
                                <Col xs='4'>
                                    <Card className='border mb-0' id='print-area-barcode'>
                                        <CardHeader>
                                            {ean ? (
                                                <Barcode format='EAN13' value={barcode?.bar_code} />
                                            ) : (
                                                <span

                                                    onClick={handleDownload}

                                                >
                                                    <img

                                                        className='img-fluid'
                                                        src={isValidUrl(`${barcode?.bar_code_image}`) ? barcode?.bar_code_image : `${httpConfig.baseUrl2}${String(
                                                            barcode?.bar_code_image ?? ''
                                                        ).replaceAll(/\\/g, '')}`}
                                                    />
                                                </span>
                                            )}

                                        </CardHeader>

                                    </Card>
                                </Col>
                            </Fragment>
                        )
                    })} */}

                    {renderRecentData()}

                </Row>
            )}
        </Fragment>
    )
}

export default BarcodesList
