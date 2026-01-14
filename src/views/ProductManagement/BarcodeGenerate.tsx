/* eslint-disable prettier/prettier */
/* eslint-disable no-use-before-define */
import { forwardRef, ReactInstance, useEffect, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { useReactToPrint } from 'react-to-print'
import {
  Badge,
  Button,
  Card,
  CardBody,
  CardHeader,
  CardImg,
  CardTitle,
  Col,
  InputGroupText,
  Row
} from 'reactstrap'
import {
  useAddOpenProductBarcodeMutation,
  useLoadOpenProductsMutation,
  useLoadOpenProductsRecentMutation
} from '../../redux/RTKQuery/ProductRTK'
import { FM, isValid, log } from '../../utility/helpers/common'
import useUser from '../../utility/hooks/useUser'
import httpConfig from '../../utility/http/httpConfig'
import Show from '../../utility/Show'
import { CF, checkHttp, fastLoop, formatDate, getKeyByValue } from '../../utility/Utils'
import LoadingButton from '../components/buttons/LoadingButton'
import FormGroupCustom from '../components/formGroupCustom/FormGroupCustom'
import Shimmer from '../components/shimmers/Shimmer'
import { ProductVariantsType } from './fragment/ProductForm'
import { vatType } from '../../utility/Const'

export type OpenBarcode = {
  id: number
  store_id: number
  product_id: number
  product_variant_id: number
  quantity: number
  weight_unit: string
  price: number
  bar_code: string
  bar_code_image: string
  created_at: string
  updated_at: string
  product_variant: ProductVariantsType
}
const BarcodeGenerate = () => {
  const printRef = useRef<HTMLDivElement>(null)
  const [loadProducts, product] = useLoadOpenProductsMutation()
  const [loadRecent, recent] = useLoadOpenProductsRecentMutation()
  const [addBarcodes, barcode] = useAddOpenProductBarcodeMutation()
  const { control, setValue, watch, setFocus } = useForm<any>()
  const [selected, setSelected] = useState<any>()
  const [selectedPrint, setSelectedPrint] = useState<any>()
  const user = useUser()
  const data = product?.data?.payload
  const componentRef = useRef<ReactInstance | null>(null)

  useEffect(() => {
    // loadProducts({})
    loadRecent({})
  }, [])

  const wet = Number(watch('weight'))

  const showToast = () => {
    toast.error("weight-can't-be-negative")
  }
  const vatCalculate = (price: number, vat: number, quantity: number, vat_type: number) => {
    if (`${vat_type}` === `${vatType.inclusive}`) {
      return Number((price * quantity).toFixed(2)) ?? 0
    } else {
      const vatPrice = (price * vat) / 100
      return Number(((price + vatPrice) * quantity).toFixed(2)) ?? 0
    }
    // const vatPrice = price * vat / 100
    // return Number(((price + vatPrice) * quantity).toFixed(2))
  }

  const vatCalculate2 = (price: number, vat: number, vat_type: number) => {
    if (`${vat_type}` === `${vatType.inclusive}`) {
      return Number(price.toFixed(2)) ?? 0
    } else {
      const vatPrice = (price * vat) / 100
      return Number(((price + vatPrice) * 1).toFixed(2)) ?? 0
    }
    // const vatPrice = price * vat / 100
    // return Number(((price + vatPrice) * quantity).toFixed(2))
  }
  const createBarcode = () => {
    if (wet < 0.001) {
      toast.error("weight-can't-be-negative")
    } else {
      const vatPer = Number(selected?.product?.vat) ?? 0
      if (isValid(selected) && isValid(watch('weight'))) {
        addBarcodes({
          product_variant_id: selected?.id,
          quantity: Number(watch('weight')),
          weight_unit: selected?.unit_type,
          vat: vatPer,
          vat_type: selected?.product?.vat_type,
          // eslint-disable-next-line no-mixed-operators
          product_price: Number(watch('product_price'))
          // product_price: vatCalculate2(Number(watch('product_price')), Number(selected?.product?.vat), Number(selected?.product?.vat_type))
        })
      }
    }
  }
  log('selected', selected)
  useEffect(() => {
    loadProducts({ jsonData: { name: watch('name') } })
  }, [watch('name')])

  useEffect(() => {
    if (barcode?.isSuccess) {
      setSelectedPrint(barcode?.data?.payload)
      setValue('weight', '')
      loadRecent({})
    }
  }, [barcode.isSuccess])

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    onAfterPrint: () => {
      setSelectedPrint(null)
    }
  })
  const singlePrint = () => {
    const el = document.getElementById('print-area')
    if (el) {
      const printWindow = window.open('', '', 'height=600,width=800')
      printWindow?.document.write('<html><head>')
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
              `)
      printWindow?.document.write('</head><body >')
      printWindow?.document.write(el.outerHTML)
      printWindow?.document.write('</body></html>')
      printWindow?.document.close()
      setTimeout(() => {
        printWindow?.print()
      }, 500)
      //  printWindow?.print();
    }
  }

  useEffect(() => {
    if (isValid(selectedPrint)) {
      // handlePrint()
      singlePrint()
    }
  }, [selectedPrint])

  const renderData = () => {
    const re: any = []
    fastLoop(data, (d, i) => {
      re.push(
        <Col
          md='3'
          key={d?.id}
          role='button'
          className=''
          onClick={() => {
            setSelected(d)
            setValue('product_price', d?.selling_price)
            setFocus('weight', { shouldSelect: true })
          }}
        >
          <div
            className={`shadow-sm border rounded ${
              selected?.id === d?.id ? 'bg-light-primary' : ''
            }`}
          >
            <div id='single-barcode'>
              <CardImg
                top
                className=''
                src={
                  isValid(d?.product_image ?? d?.product?.product_image)
                    ? (!checkHttp(d?.product_image ?? d?.product?.product_image)
                        ? httpConfig.baseUrl2
                        : '') + (d?.product_image ?? d?.product?.product_image)
                    : 'assets/product-placeholder.png'
                }
                style={{ height: 80, objectFit: 'cover' }}
                alt='card-top'
              />
            </div>
            <div className='p-75'>
              <div
                className={`fw-bolder text-small-12 text-center mb-50 ${
                  selected?.id === d?.id ? 'text-dark' : ''
                }`}
              >
                {d?.name}
              </div>
              <div
                className={`text-small-12 text-primary fw-bolder ${
                  selected?.id === d?.id ? '' : ''
                }`}
              >
                <Row>
                  <Col className='d-flex justify-content-center'>
                    {CF({ money: d?.selling_price, currency: user?.currency })}/{FM(d?.unit_type)}
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

  const renderRecentData = () => {
    log('recent', recent)
    const re: any = []
    fastLoop(recent?.data?.payload, (d, i) => {
      re.push(
        <Col
          {...componentRef}
          md='12'
          id='print-area'
          key={d?.id}
          role='button'
          className=''
          // onClick={() => {
          //     setSelected(d)

          // }}
        >
          <div className={`shadow-sm border rounded`}>
            <div className={`fw-bolder text-small-12 p-75 border-bottom`}>
              <Row>
                <Col> {d?.product_variant?.name}</Col>
                <Col className='d-flex justify-content-end'>
                  {formatDate(d?.created_at, 'YYYY-MM-DD, HH:MM')}
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
                  <Col>
                    {CF({
                      //money with selected?.product.vat
                      // Number((watch('product_price') + (watch('product_price') * watch('weight') * selected?.product?.vat / 100)).toFixed(2))
                      // eslint-disable-next-line no-mixed-operators
                      money: Number(d?.price),
                      // money: Number((d?.product_variant.selling_price + d?.product_variant.selling_price * d?.quantity * d?.product_variant?.product?.vat / 100)?.toFixed(2)),
                      currency: user?.currency
                    })}
                  </Col>
                  <Col className='d-flex justify-content-end'>
                    {d?.quantity} {FM(d?.product_variant?.unit_type)}
                    <Badge
                      pill
                      color='primary'
                      className='ms-1'
                      onClick={() => {
                        setSelectedPrint(d)
                      }}
                    >
                      {FM('print')}
                    </Badge>
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
  const handlePrintAll = () => {
    const elemet = document.getElementById('div-for-print')
    if (elemet) {
      const printWindow = window.open('dsfgds', 'sada', 'height=600,width=800')
      printWindow?.document.write('<html><head>')
      printWindow?.document.write(`
                <style>
                  @media print {
                    body * {
                      visibility: hidden;
                    }
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
              `)
      printWindow?.document.write('</head><body >')
      printWindow?.document.write(elemet.outerHTML)

      printWindow?.document.write('</body></html>')
      printWindow?.document.close()
      setTimeout(() => {
        printWindow?.print()
      }, 500)
    }
  }

  return (
    <div>
      <Row>
        <Col md='8'>
          <Card>
            <CardHeader className='border-bottom '>
              <Row className='flex-1 d-flex align-items-center'>
                <Col md='8'>
                  <CardTitle>{FM('select-product')}</CardTitle>
                </Col>
                <Col md='4'>
                  <FormGroupCustom
                    noLabel
                    noGroup
                    name={`name`}
                    type={'text'}
                    label={FM('search')}
                    className='mb-0'
                    control={control}
                    rules={{ required: false }}
                  />
                </Col>
              </Row>
            </CardHeader>
            <CardBody className='p-2'>
              <Show IF={product.isLoading}>
                <Row className='g-1'>
                  <Col md='3'>
                    <Shimmer style={{ height: 155 }} />
                  </Col>
                  <Col md='3'>
                    <Shimmer style={{ height: 155 }} />
                  </Col>
                  <Col md='3'>
                    <Shimmer style={{ height: 155 }} />
                  </Col>
                  <Col md='3'>
                    <Shimmer style={{ height: 155 }} />
                  </Col>
                  <Col md='3'>
                    <Shimmer style={{ height: 155 }} />
                  </Col>{' '}
                  <Col md='3'>
                    <Shimmer style={{ height: 155 }} />
                  </Col>
                  <Col md='3'>
                    <Shimmer style={{ height: 155 }} />
                  </Col>
                  <Col md='3'>
                    <Shimmer style={{ height: 155 }} />
                  </Col>
                </Row>
              </Show>
              <Row className='g-1'>{renderData()}</Row>
            </CardBody>
          </Card>
        </Col>
        <Col md='4'>
          <Card>
            <CardHeader className='border-bottom'>
              <CardTitle>{FM('create-barcode')}</CardTitle>
            </CardHeader>
            <CardBody className='p-2'>
              <Row>
                <Col md='12'>
                  <FormGroupCustom
                    name={`weight`}
                    type={'number'}
                    label={FM('quantity')}
                    className='mb-1'
                    control={control}
                    rules={{ required: true, min: 0, maxLength: 6 }}
                    append={<InputGroupText>{FM(selected?.unit_type)}</InputGroupText>}
                  />
                </Col>
                <Col md='12'>
                  <FormGroupCustom
                    name={`product_price`}
                    type={'number'}
                    label={FM('price')}
                    className='mb-1'
                    control={control}
                    rules={{ required: true, min: 0, maxLength: 10 }}
                    prepend={<InputGroupText>{user?.currency}</InputGroupText>}
                    append={<InputGroupText> / {FM(selected?.unit_type)}</InputGroupText>}
                  />
                </Col>
                <Show IF={isValid(selected)}>
                  <Col md='12' className='mb-75'>
                    <Row>
                      <Col>
                        <p className='mb-50 text-dark fw-bolder'>{selected?.name}</p>
                        {/* <p className='mb-50 fw-bold text-dark text-small-12 text-uppercase'>
                                                    {FM('vat')}: {`${selected?.product?.vat}%`}
                                                </p> */}
                      </Col>
                      <Col className='d-flex text-dark fw-bolder justify-content-end'>
                        {CF({ money: watch('product_price'), currency: user?.currency })}/
                        {FM(selected?.unit_type)}
                      </Col>
                    </Row>
                    <Row>
                      <Col>
                        <p className='mb-50 text-dark '>
                          <span className='fw-bolder'>{FM('vat')}</span>{' '}
                          <span className=''>{`(${FM(
                            getKeyByValue(vatType, Number(selected?.product?.vat_type))
                          )})`}</span>
                        </p>
                      </Col>
                      {/*   (Number(watch(`product_variants.${index}.selling_price`)) * Number(vat / 100) + Number(watch(`product_variants.${index}.selling_price`))).toFixed(2)  */}
                      <Col className='d-flex text-dark fw-bolder justify-content-end'>
                        {`${selected?.product?.vat}%`}
                      </Col>
                    </Row>

                    <Row>
                      <Col>
                        <p className='mb-50 text-dark fw-bolder'>{FM('total')}</p>
                      </Col>
                      {/*   (Number(watch(`product_variants.${index}.selling_price`)) * Number(vat / 100) + Number(watch(`product_variants.${index}.selling_price`))).toFixed(2)  */}
                      <Col className='d-flex text-dark fw-bolder justify-content-end'>
                        {CF({
                          //money with selected?.product.vat
                          // eslint-disable-next-line no-mixed-operators
                          money: vatCalculate(
                            Number(watch('product_price')),
                            selected?.product?.vat,
                            Number(watch('weight')),
                            selected?.product?.vat_type
                          ),
                          // money: Number((watch("product_price") + watch("product_price") * Number(watch('weight')) * selected?.product?.vat / 100)?.toFixed(2)),
                          currency: user?.currency
                        })}
                      </Col>
                    </Row>
                  </Col>
                </Show>
                <Col md='12'>
                  <LoadingButton
                    block
                    color='primary'
                    disabled={!isValid(selected) || `${watch('weight')}`.length > 6}
                    loading={barcode.isLoading}
                    onClick={createBarcode}
                  >
                    {FM('create')}
                  </LoadingButton>
                </Col>
              </Row>
            </CardBody>
          </Card>
          <span style={{ display: 'none' }}>
            <PrintLayout ref={componentRef} data={selectedPrint} />
          </span>
          <Card>
            <CardHeader className='border-bottom'>
              <CardTitle>{FM('recent-barcode')}</CardTitle>
              <Button color='primary' size='sm' onClick={handlePrintAll}>
                {FM('print-all')}
              </Button>
            </CardHeader>
            <CardBody className='p-2'>
              <Show IF={recent.isLoading}>
                <Shimmer style={{ height: 155, marginBlock: 15 }} />
                <Shimmer style={{ height: 155, marginBlock: 15 }} />
                <Shimmer style={{ height: 155, marginBlock: 15 }} />
                <Shimmer style={{ height: 155, marginBlock: 15 }} />
              </Show>
              <Row id='div-for-print' {...printRef} className='g-1'>
                {renderRecentData()}
              </Row>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </div>
  )
}

export default BarcodeGenerate

export const PrintLayout = forwardRef<any, any>(({ data }: { data: OpenBarcode }, ref) => {
  const user = useUser()
  return (
    <div ref={ref}>
      <>
        <div className={`border rounded m-2 p-1`}>
          <div className={`fw-bolder text-small-12 p-75 border-bottom`}>
            <Row>
              <Col> {data?.product_variant?.name ?? data?.product_variant?.product?.name}</Col>
              <Col className='d-flex justify-content-end'>
                {formatDate(data?.created_at, 'YYYY-MM-DD, hh:mm A')}
              </Col>
            </Row>
          </div>
          <div>
            <CardImg
              top
              className='p-2 border-bottom m-1'
              src={
                (!checkHttp(data?.bar_code_image) ? httpConfig.baseUrl2 : '') + data?.bar_code_image
              }
              style={{ height: 190, objectFit: 'fill' }}
              alt='card-top'
            />
          </div>
          <div className='p-75'>
            <div className={`text-small-12 text-dark fw-bolder`}>
              <Row>
                <Col>{CF({ money: data?.price, currency: user?.currency })}</Col>
                <Col className='d-flex justify-content-end'>
                  {data?.quantity} {FM(data?.product_variant?.unit_type)}
                </Col>
              </Row>
            </div>
          </div>
        </div>
        <div style={{ pageBreakAfter: 'always' }} />
      </>
    </div>
  )
})
