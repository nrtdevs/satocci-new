/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable no-mixed-operators */
import '@styles/react/libs/input-number/input-number.scss'
import moment from 'moment'
import InputNumber from 'rc-input-number'
import { Fragment, useCallback, useEffect, useReducer, useRef, useState } from 'react'
import { Minus, Plus, Trash2 } from 'react-feather'
import { useForm } from 'react-hook-form'
import PerfectScrollbar from 'react-perfect-scrollbar'
import { Link, useNavigate } from 'react-router-dom'
import StickyBox from 'react-sticky-box'
import {
  Badge,
  Button,
  ButtonProps,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Col,
  Row
} from 'reactstrap'
import {
  SessionDataType,
  sessionUpdate,
  setOffer,
  setProductSelected,
  setSelectedOffer,
  setSessionSelected,
  updateTimestamp
} from '../../redux/reducers/sessionRducer'
import { useAppSelector } from '../../redux/store'
import { useRedux } from '../../redux/useRedux'
import { getPath } from '../../router/RouteHelper'
import { CMD, ProductOfferTypes } from '../../utility/Const'
import Hide from '../../utility/Hide'
import Show from '../../utility/Show'
import {
  CF,
  ErrorToast,
  SuccessToast,
  decrypt,
  getVatValue,
  maskNumber,
  toFixed,
  truncateText
} from '../../utility/Utils'
import { FM, isValid, isValidArray, log } from '../../utility/helpers/common'
import useWebSockets from '../../utility/hooks/useSocket'
import useUser from '../../utility/hooks/useUser'
import { stateReducer } from '../../utility/stateReducer'
import LoadingButton from '../components/buttons/LoadingButton'
import FormGroupCustom from '../components/formGroupCustom/FormGroupCustom'
import Header from '../components/header'
import Ratings from '../components/ratings'
import BsTooltip from '../components/tooltip'
import AddProductModal from './fragment/AddProductModal'
interface cartType {
  id?: any
  name?: any
  price?: any
  image?: any
}
interface States {
  view?: string
  scrollPos?: any
  sidebarHeight?: any
}
const Sessions = () => {
  const nav = useNavigate()
  const user = useUser()
  const refEl = useRef<HTMLElement | any>(null)
  const refEl2 = useRef<HTMLElement | any>(null)
  const { control, watch } = useForm<any>()
  const initState: States = {
    view: 'list',
    scrollPos: undefined,
    sidebarHeight: undefined
  }
  const reducers = stateReducer<States>
  const [state, setState] = useReducer(reducers, initState)
  const [storesData, setStoreData] = useState<any>(null)
  const {
    dispatch,
    state: {
      session: { selectedProduct, selected, sessionSelected, lastMessageTimeStamp, addOffer }
    }
  } = useRedux()
  // socket
  const { lastMessage, sendMessage, lastMessageOriginal, readyState } = useWebSockets()

  const reduxData = useAppSelector((s) => s?.session?.data)
  useEffect(() => {
    if (isValid(watch('search'))) {
      setStoreData(
        reduxData?.filter((d: any) => String(d?.unique_id).toLowerCase().includes(watch('search')))
      )
    } else {
      setStoreData(reduxData)
    }
  }, [reduxData, watch('search')])

  // ** ComponentDidMount
  useEffect(() => {
    if (isValidArray(storesData)) {
      let index = undefined
      if (isValid(sessionSelected)) {
        const ind = storesData.findIndex((a: any) => a.id === sessionSelected?.id)
        if (ind !== -1) {
          index = ind
        } else {
          index = selected ? selected - 1 : 0
        }
      }
      dispatch(setSessionSelected({ index: index || 0, session: storesData[index || 0] }))
    } else {
      dispatch(setSessionSelected({ index: 0, session: null }))
    }
  }, [storesData])

  log('storesData', storesData)

  const escFunction = useCallback((event: any) => {
    if (event.keyCode === 27) {
      nav(getPath('dashboard'))
    }
  }, [])

  useEffect(() => {
    document.addEventListener('keydown', escFunction, false)
    return () => {
      document.removeEventListener('keydown', escFunction, false)
    }
  }, [])

  //. remove product
  const handleRemoveProduct = (id: any, customer: any, session: any) => {
    sendMessage({
      command: CMD.RemoveCartItem,
      cart_id: id,
      customer_id: customer,
      session_id: session
    })
  }

  ////Update Cart Items
  const handleUpdateProduct = (
    id: any,
    customer: any,
    session: any,
    qty: any,
    item: any,
    type: any,
    addOff = false
  ) => {
    const prodOffer = isValidArray(item?.product_variant?.product_offers)
      ? item?.product_variant?.product_offers
      : []
    const offer = prodOffer.length > 0 ? prodOffer[0] || null : null
    let offeredProduct = null
    if (isValid(offer) && addOff) {
      if (qty >= offer?.purchase_quantity) {
        if (Number(offer?.offer_type) === ProductOfferTypes.same_quantity_on_quantity) {
          offeredProduct = {
            // ...offer
            offer_id: offer?.id,
            currency: item?.product_variant?.currency ?? user?.currency,
            price: 0,
            product_variant_id: offer?.offered_product_variant_id,
            qty: offer?.purchase_quantity,
            variant_token: offer?.offered_product_variant?.variant_token,
            vat_amount: 0
          }
        } else if (Number(offer?.offer_type) === ProductOfferTypes.diff_quantity_on_quantity) {
          offeredProduct = {
            // ...offer
            offer_id: offer?.id,
            currency: user?.currency,
            original_price: offer?.offered_product_discount,
            vat_percentage: offer?.offered_product_variant?.product?.vat,
            product_variant_id: offer?.offered_product_variant_id,
            qty: 1,
            price:
              (getVatValue(
                offer?.offered_product_variant?.product?.vat,
                offer?.offered_product_discount
              ) +
                offer?.offered_product_discount) *
                1 || 0,
            vat_amount: Number(
              1 *
                getVatValue(
                  offer?.offered_product_variant?.product?.vat,
                  offer?.offered_product_discount
                )
            ).toFixed(2),
            variant_token: offer?.offered_product_variant?.variant_token
          }
        }
      } else {
        dispatch(setOffer(false))
      }
    }

    sendMessage({
      addOff,
      dir: type,
      updateCart: 'yes',
      command: CMD.UpdateCartItem,
      cart_id: id,
      customer_id: customer,
      session_id: session,
      product_variant_id: item?.product_variant?.id,
      variant_token: item?.product_variant?.variant_token,
      qty,
      currency: item?.product_variant?.currency ?? user?.currency,
      original_price: item?.product_variant?.selling_price,
      vat_percentage: item.product_variant?.product?.vat,
      offered_product: offeredProduct,
      price:
        (getVatValue(item.product_variant?.product?.vat, item.product_variant?.selling_price) +
          item.product_variant?.selling_price) *
        qty,
      vat_amount: Number(
        qty * getVatValue(item.product_variant?.product?.vat, item.product_variant?.selling_price)
      ).toFixed(2)
    })
  }

  // remove session
  const handleRemoveSession = (customer: any, session: any) => {
    sendMessage({
      command: CMD.RemoveCustomerSession,
      customer_id: customer,
      session_id: session
    })
  }
  // receive messages
  useEffect(() => {
    if (lastMessageTimeStamp !== lastMessageOriginal?.timeStamp) {
      dispatch(updateTimestamp(lastMessageOriginal?.timeStamp))
      const data = lastMessage?.data
      log(lastMessageTimeStamp)
      switch (lastMessage?.command) {
        case CMD.RemoveCartItem:
          log('RemoveCartItem', lastMessage)
          if (lastMessage?.success) {
            sendMessage({
              command: CMD.GetCustomerSession,
              customer_id: sessionSelected?.customer?.id,
              session_id: sessionSelected?.id
            })
            SuccessToast(FM('removed-from-cart-successfully'), {
              id: 'clipboard',
              position: 'bottom-center'
            })
          }
          break
        case CMD.UpdateCartItem:
          log('RemoveCartItem', lastMessage)
          if (lastMessage?.success) {
            sendMessage({
              command: CMD.GetCustomerSession,
              customer_id: sessionSelected?.customer?.id,
              session_id: sessionSelected?.id
            })
            SuccessToast(FM('update-quantity-successfully'), {
              id: 'clipboard',
              position: 'bottom-center'
            })
          } else {
            ErrorToast(FM('cannot-update-cart'), {
              id: 'clipboard',
              position: 'bottom-center'
            })
          }
          break
        case CMD.RemoveCustomerSession:
          log('RemoveCustomerSession', lastMessage)
          if (lastMessage?.success) {
            sendMessage({
              command: CMD.GetAllSessions
            })
          }
          break
        case CMD.GetCustomerSession:
          log('GetCustomerSession', lastMessage)
          if (lastMessage?.success) {
            dispatch(sessionUpdate({ ...data }))
          }
          break
        default:
          break
      }
    }
  }, [lastMessageOriginal, lastMessage, dispatch])

  const renderCartItems = (data: SessionDataType, status: any, index = 0) => {
    if (data) {
      const cartArr: Array<any> = data?.carts ?? []
      let total = 0
      let vat_amount = 0
      let total_with_vat = 0

      return (
        <Fragment>
          <Card
            id='pos-sidebar'
            className={status}
            // style={{ height: 'calc(100vh - 119px)', background: '#f8f3ff' }}
            style={{ height: 'calc(100vh - 62px)', background: '#fff' }}
          >
            <CardHeader className='border  p-1'>
              <div className='flex-1'>
                <Row className='g-0 flex-1'>
                  <Col md='6'>
                    <h6 className='text-dark fw-bolder text-small-12'>{FM('customer-name')}</h6>
                    <p className='mb-0 text-small-12'>
                      {truncateText(String(`${decrypt(data?.customer?.name)}`).trim(), 20) ?? 'N/A'}
                    </p>
                  </Col>
                  <Col md='6'>
                    <h6 className='text-dark fw-bolder text-small-12'>{FM('personal-number')}</h6>
                    <p className='mb-0 text-small-12'>
                      {maskNumber({ str: `${decrypt(data?.customer?.personal_number)}`, len: -8 })}
                    </p>
                  </Col>
                </Row>
                <Row className='g-0  mt-1 flex-1'>
                  <Col md='6'>
                    <h6 className='text-dark fw-bolder text-small-12'>{FM('mobile-no')}</h6>
                    <p className='mb-0 text-small-12'>
                      {`${decrypt(data?.customer?.mobile_number)}`}
                    </p>
                  </Col>
                  <Col md='6'>
                    <h6 className='text-dark text-small-12 fw-bolder'>{FM('email')}</h6>
                    <p className='mb-0 text-small-12'>{`${decrypt(data?.customer?.email)}`}</p>
                  </Col>
                </Row>
              </div>
            </CardHeader>
            <CardBody
              ref={refEl2}
              className='p-0 border-bottom'
              style={{ height: 'calc(100vh - 500px)' }}
              id={'sidebarcard'}
            >
              <p className='mb-0 p-1 bg-light-secondary fw-bolder text-dark'>
                <Row>
                  <Col className='text-small-12'>{FM('product')}</Col>
                  <Col className='d-flex text-small-12 justify-content-end'>
                    {cartArr?.length} {FM('items')}
                  </Col>
                </Row>
              </p>
              {/* <Hide IF={isValidArray(cartArr)}>
                <div
                  className='d-flex justify-content-center'
                  style={{ height: '100%', flexFlow: 'column nowrap', alignItems: 'stretch' }}
                >
                  <div className='text-center'>
                    <Spinner color='secondary' animation='border' size={'sm'}>
                      <span className='visually-hidden'>Loading...</span>
                    </Spinner>
                    <p className='text-muted mt-2'>
                      {FM('waiting-for-the-customer-to-add-products')}
                    </p>
                  </div>
                </div>
              </Hide>
              <Show IF={isValidArray(cartArr)}> */}
              <PerfectScrollbar
                key={state?.sidebarHeight - 42}
                style={{ height: state?.sidebarHeight - 42 }}
                className=''
                options={{
                  wheelPropagation: false
                }}
              >
                {cartArr.map((item: any, i: number) => {
                  const qty = item?.open_pr_wt_pc ?? item.qty
                  if (isValid(item?.open_pr_wt_pc)) {
                    total += item?.price - item?.vat_amount
                    vat_amount += item?.vat_amount
                    total_with_vat = total + vat_amount
                  } else {
                    total += item?.product_variant?.selling_price * qty

                    vat_amount +=
                      getVatValue(
                        item?.product_variant?.product?.vat,
                        item?.product_variant?.selling_price
                      ) * qty

                    if (isValid(item?.in_offer_cart)) {
                      total +=
                        item?.in_offer_cart?.qty *
                        item?.in_offer_cart?.product_offer?.offered_product_discount
                      vat_amount +=
                        getVatValue(
                          item?.in_offer_cart?.product_variant?.product?.vat,
                          item?.in_offer_cart?.product_offer?.offered_product_discount
                        ) * item?.in_offer_cart?.qty
                    }
                    total_with_vat = total + vat_amount
                  }
                  return (
                    <>
                      <Row
                        key={item.id}
                        className={`session-cart m-0 p-1 g-0 ${
                          isValid(item?.in_offer_cart) ? 'pb-0' : 'border-bottom'
                        } align-items-start `}
                      >
                        <Col md='12'>
                          <div>
                            <h6
                              role={'button'}
                              className='fw-bolder text-primary mb-0'
                              onClick={() => {
                                dispatch(setOffer(isValid(item?.in_offer_cart)))
                                dispatch(setProductSelected({ product: item }))
                              }}
                            >
                              {truncateText(item?.product_variant?.product?.name, 45)} {' : '}
                              {truncateText(item?.product_variant?.name, 45)}
                            </h6>
                            {/* <p className='text-small-12 text-secondary mb-50 mt-25'>
                              {item?.product_variant?.product?.category?.name}
                            </p> */}
                          </div>
                          <Row className='g-0 mb-50 pt-50'>
                            <Col>
                              <p className='mb-0 text-small-12'>{FM('price')}</p>
                              <p className='mb-0 text-small-12 fw-bolder'>
                                {CF({
                                  money: isValid(item?.open_pr_wt_pc)
                                    ? item?.price - item?.vat_amount
                                    : item?.product_variant?.selling_price,
                                  currency: user?.currency
                                })}
                              </p>
                            </Col>
                            <Col>
                              <p className='mb-0 text-small-12 text-capitalize'>
                                {isValid(item?.open_pr_wt_pc)
                                  ? truncateText(FM(item?.product_variant?.unit_type), 4)
                                  : FM('Quantity')}
                              </p>
                              <Hide IF={isValid(item?.open_pr_wt_pc)}>
                                <InputNumber
                                  min={`1`}
                                  max={Number(item?.product_variant?.product_type) === 2 ? `1` : ``}
                                  value={toFixed(item.qty)}
                                  onStep={(e, { type }) => {
                                    // setState({ quantity: e })
                                    // handleAddToCart(e, type, addOffer)
                                    handleUpdateProduct(
                                      item?.id,
                                      data?.customer?.id,
                                      data?.id,
                                      e,
                                      item,
                                      type,
                                      addOffer
                                    )
                                  }}
                                  className='input-sm me-2'
                                  upHandler={<Plus />}
                                  id='lg-number-input'
                                  downHandler={<Minus />}
                                />
                              </Hide>

                              {/* <Hide IF={isValid(item?.open_pr_wt_pc)}>
                                <p className='mb-0 text-small-12 fw-bolder'>{toFixed(item.qty)}</p>
                              </Hide>
                              */}
                              <Show IF={isValid(item?.open_pr_wt_pc)}>
                                <p className='mb-0 text-small-12 fw-bolder'>
                                  {toFixed(item.open_pr_wt_pc)}{' '}
                                </p>
                              </Show>
                            </Col>
                            <Col>
                              <p className='mb-0 text-small-12'>
                                {FM('vat')}{' '}
                                <span className=''>@ {item?.product_variant?.product?.vat}%</span>
                              </p>
                              <p className='mb-0 text-small-12 fw-bolder'>
                                {CF({
                                  money: isValid(item?.open_pr_wt_pc)
                                    ? item?.vat_amount
                                    : qty *
                                      getVatValue(
                                        item?.product_variant?.product?.vat,
                                        item?.product_variant?.selling_price
                                      ),
                                  currency: user?.currency
                                })}
                              </p>
                            </Col>
                            <Col>
                              <p className='mb-0 text-small-12'>{FM('total')}</p>
                              <p className='mb-0 text-small-12 fw-bolder'>
                                {CF({
                                  money: isValid(item?.open_pr_wt_pc)
                                    ? item?.price
                                    : (item?.product_variant?.selling_price +
                                        getVatValue(
                                          item?.product_variant?.product?.vat,
                                          item?.product_variant?.selling_price
                                        )) *
                                      qty,
                                  currency: user?.currency
                                })}
                              </p>
                            </Col>
                            <Col xs='1'>
                              <p className='mb-0 text-small-12 fw-bolder'>
                                <Trash2
                                  role={'button'}
                                  onClick={(e) =>
                                    handleRemoveProduct(item?.id, data?.customer?.id, data?.id)
                                  }
                                  className='mt-50 text-danger'
                                  size={18}
                                />
                              </p>
                            </Col>
                          </Row>
                        </Col>
                      </Row>
                      <Show IF={isValid(item?.in_offer_cart)}>
                        <>
                          <Row
                            key={item.id}
                            className='session-cart border-bottom align-items-start m-0 p-1 pt-50 g-0'
                          >
                            <Col md='12' className='text-danger fw-bolder text-small-12 pb-50'>
                              {FM('offer-applied')}
                              <hr className='p-0 m-0 mt-50' />
                            </Col>
                            <Col md='12'>
                              <div>
                                <h6 role={'none'} className='fw-bolder text-primary mb-0'>
                                  {truncateText(
                                    item?.in_offer_cart?.product_variant?.product?.name,
                                    45
                                  )}{' '}
                                  {' : '}
                                  {truncateText(item?.in_offer_cart?.product_variant?.name, 45)}
                                </h6>
                                {/* <p className='text-small-12 text-secondary mb-50 mt-25'>
                                  {item?.in_offer_cart?.product_variant?.product?.category?.name}
                                </p> */}
                              </div>
                              <Row className='g-0 mb-50  pt-50'>
                                <Col>
                                  <p className='mb-0 text-small-12'>{FM('price')}</p>
                                  <p className='mb-0 text-small-12 fw-bolder'>
                                    {CF({
                                      money:
                                        item?.in_offer_cart?.product_offer
                                          ?.offered_product_discount,
                                      currency: user?.currency
                                    })}
                                  </p>
                                </Col>
                                <Col>
                                  <p className='mb-0 text-small-12'>{FM('Quantity')}</p>
                                  <p className='mb-0 text-small-12 fw-bolder'>
                                    {toFixed(item?.in_offer_cart?.qty)}
                                  </p>
                                </Col>
                                {/* <Show
                                  IF={
                                    item?.in_offer_cart?.product_offer?.offered_product_discount > 0
                                  }
                                > */}
                                <Col>
                                  <p className='mb-0 text-small-12'>
                                    {FM('vat')}{' '}
                                    <Show
                                      IF={
                                        item?.in_offer_cart?.product_offer
                                          ?.offered_product_discount > 0
                                      }
                                    >
                                      <span className=''>
                                        @ {item?.in_offer_cart?.product_variant?.product?.vat}%
                                      </span>
                                    </Show>
                                  </p>
                                  <p className='mb-0 text-small-12 fw-bolder'>
                                    {CF({
                                      money: getVatValue(
                                        item?.in_offer_cart?.product_variant?.product?.vat,
                                        item?.in_offer_cart?.product_offer?.offered_product_discount
                                      ),
                                      currency: user?.currency
                                    })}
                                  </p>
                                </Col>
                                {/* </Show> */}

                                <Col>
                                  <p className='mb-0 text-small-12'>{FM('total')}</p>
                                  <p className='mb-0 text-small-12 fw-bolder'>
                                    {CF({
                                      money:
                                        (item?.in_offer_cart?.product_offer
                                          ?.offered_product_discount +
                                          getVatValue(
                                            item?.in_offer_cart?.product_variant?.product?.vat,
                                            item?.in_offer_cart?.product_offer
                                              ?.offered_product_discount
                                          )) *
                                        item?.in_offer_cart?.qty,
                                      currency: user?.currency
                                    })}
                                  </p>
                                </Col>
                                <Col xs='1'>
                                  <p className='mb-0 text-small-12 fw-bolder'>
                                    <Trash2 role={'none'} className='mt-50 text-muted' size={18} />
                                  </p>
                                </Col>
                              </Row>
                            </Col>
                          </Row>
                        </>
                      </Show>
                    </>
                  )
                })}
              </PerfectScrollbar>
              {/* </Show> */}
            </CardBody>
            <CardFooter className='mb-0 p-1'>
              <Row className=''>
                <Col xs='12' className='mb-1 pb-1 border-bottom'>
                  <Row className='g-0'>
                    <Col>
                      <p className='mb-0 text-dark  fw-bolder'>{FM('subtotal')}</p>
                    </Col>
                    <Col xs='4' className='d-flex justify-content-end'>
                      <p className='mb-0 text-dark  fw-bolder'>
                        {CF({ money: total, currency: user?.currency })}
                      </p>
                    </Col>
                  </Row>
                  <Row className='g-0 mt-25'>
                    <Col>
                      <p className='mb-0 fw-bolder text-dark'>{FM('tax')} (+)</p>
                    </Col>
                    <Col xs='4' className='d-flex fw-bolder justify-content-end'>
                      {/* <p className='mb-0 text-dark '>{CF((total * 18) / 100)}</p> */}
                      <p className='mb-0 text-dark '>
                        {CF({ money: vat_amount, currency: user?.currency })}
                      </p>
                    </Col>
                  </Row>
                  <Row className='g-0 mt-25'>
                    <Col>
                      <p className='mb-0 text-dark  fw-bolder'>{FM('discount')} (-)</p>
                    </Col>
                    <Col xs='4' className='d-flex justify-content-end'>
                      <p className='mb-0 text-dark  fw-bolder'>
                        {CF({ money: data?.coupon_amount ?? 0, currency: user?.currency })}
                      </p>
                    </Col>
                  </Row>
                  <Row className='g-0 mt-25'>
                    <Col>
                      <p className='mb-0 text-primary fw-bolder'>{FM('total')}</p>
                    </Col>
                    <Col xs='4' className='d-flex justify-content-end'>
                      {/* <p className='mb-0 text-dark fw-bolder'>{total + (total * 18) / 100)}</p> */}
                      <p className='mb-0 text-primary fw-bolder'>
                        {CF({
                          money: total_with_vat - (data?.coupon_amount ?? 0),
                          currency: user?.currency
                        })}
                      </p>
                    </Col>
                  </Row>
                </Col>
                <Col xs='10'>
                  <BsTooltip title={FM('add-product')}>
                    <AddProductModal<ButtonProps>
                      className='btn-icon'
                      size='sm'
                      Component={Button}
                      loadBarcode={selectedProduct?.bar_code}
                      edit={data}
                      setShowModal={() => {
                        dispatch(setOffer(false))
                        dispatch(setSelectedOffer(null))
                      }}
                      color='primary'
                    >
                      <Plus size={16} />
                    </AddProductModal>
                  </BsTooltip>
                </Col>

                <Col xs='2'>
                  <LoadingButton
                    loading={false}
                    className='btn-icon'
                    tooltip={FM('end-session')}
                    color='danger'
                    size='sm'
                    onClick={() => {
                      handleRemoveSession(data?.customer?.id, data?.id)
                    }}
                  >
                    <Trash2 size={16} />
                  </LoadingButton>
                </Col>
              </Row>
            </CardFooter>
          </Card>
          {/* <li className='dropdown-menu-footer'>
                        <div className='d-flex justify-content-between mb-1'>
                            <h6 className='fw-bolder mb-0'>Total:</h6>
                            <h6 className='text-primary fw-bolder mb-0'>${Number(total.toFixed(2))}</h6>
                        </div>
                        <Button tag={Link} to='/apps/ecommerce/checkout' color='primary' block onClick={toggle}>
                            Checkout
                        </Button>
                    </li> */}
        </Fragment>
      )
    } else {
      return <p className='m-0 p-1 text-center'>{FM('your-cart-is-empty')}</p>
    }
  }

  useEffect(() => {
    if (document.getElementById('scrolling')) {
      const w = window.screen.height
      document.getElementById('scrolling')?.addEventListener('scroll', function (event) {
        const s = document.getElementById('active')?.getBoundingClientRect() ?? { top: 0 }
        if (s?.top > w - 400) {
          setState({ scrollPos: 'bottom' })
        } else {
          setState({ scrollPos: 'top' })
        }
      })
    }
    setTimeout(() => {
      if (document.getElementById('sidebarcard')) {
        const s = document.getElementById('sidebarcard')?.offsetHeight
        setState({ sidebarHeight: s })
        // log('s', s)
      }
    }, 100)
    setTimeout(() => {
      window.addEventListener('resize', function (event) {
        if (document.getElementById('sidebarcard')) {
          const a = document.getElementById('sidebarcard')?.offsetHeight
          setState({ sidebarHeight: a })
          //   log('a', a)
        }
      })
    }, 100)
  }, [])

  useEffect(() => {
    document.body.style.overflow = state?.view === 'list' ? 'hidden' : 'visible'
    return () => {
      document.body.style.overflow = 'visible'
    }
  }, [state?.view])

  return (
    <>
      <AddProductModal<ButtonProps>
        className='btn-icon'
        size='sm'
        noView
        showModal={isValid(selectedProduct)}
        Component={Button}
        setShowModal={() => {
          dispatch(setOffer(false))
          dispatch(setProductSelected({ product: null }))
        }}
        loadBarcode={selectedProduct}
        edit={sessionSelected}
        color='primary'
      />
      <div className='p-1 all-black-font'>
        <Header
          goBackTo
          onClickBack={() => nav(-1)}
          childCol='4'
          titleCol='8'
          rowClass='mb-0'
          //   icon={<Codepen size='25' />}
          title={FM('sessions')}
          subHeading={
            <>
              <FormGroupCustom
                placeholder={FM('search')}
                name='search'
                noLabel
                type={'text'}
                className={'d-flex me-1'}
                control={control}
              />
            </>
          }
        >
          <div className='d-flex'>
            <Card className='m-0 me-1 shadow'>
              <CardBody className='p-50 fw-bolder text-primary'>
                {FM('active-sessions', { count: storesData?.length })}
              </CardBody>
            </Card>

            {/* <Card className='m-0 me-1 shadow'>
              <CardBody className='p-50 text-success fw-bolder'>Paid Customers: 45</CardBody>
            </Card>
            <Card className='m-0 me-1 shadow'>
              <CardBody className='p-50 text-danger fw-bolder'>Action Required: 45</CardBody>
            </Card>
            <Card className='m-0 me-1 shadow'>
              <CardBody className='p-50 text-danger fw-bolder'>Low Rating: 12</CardBody>
            </Card> */}
            {/* <Button
              className='mb-0'
              size='sm'
              color='primary'
              onClick={() => {
                setState({ view: state?.view === 'list' ? 'card' : 'list' })
              }}
            >
              {state?.view === 'list' ? <List size={18} /> : <Grid size={18} />}
            </Button> */}
          </div>
        </Header>
      </div>
      {state?.view === 'list' ? (
        <div
          id='scrolling'
          ref={refEl}
          style={{ height: '99vh', position: 'relative', overflow: 'auto' }}
        >
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, minHeight: '100%' }}>
            <Row className='g-0' style={{ display: 'flex', alignItems: 'flex-start' }}>
              <Col md='9'>
                <StickyBox style={{ zIndex: 11 }} offsetBottom={0} offsetTop={0}>
                  <Row className='g-0'>
                    <Col md='12'>
                      <Card className={`mb-0 shadow-none session-list`}>
                        <CardBody>
                          <Row className='g-0'>
                            <Col xs='2'>{FM('session-id')}</Col>
                            <Col>{FM('customer-rating')}</Col>
                            <Col xs='3'>{FM('cart-items')}</Col>
                            <Col>{FM('cart-value')}</Col>
                            <Col xs='2'>{FM('last-updated')}</Col>
                            {/* <Col xs='1'></Col> */}
                          </Row>
                        </CardBody>
                      </Card>
                    </Col>
                    {/* <Col md='3' className='bg-white ' style={{ padding: 11 }}>
                    <Input placeholder='Search Session ID' />
                  </Col> */}
                  </Row>
                </StickyBox>
                {storesData?.map((session: any, i: any) => {
                  const Comp = selected === i ? StickyBox : 'div'
                  return (
                    <>
                      <Comp
                        key={`is-bottom-${state?.scrollPos}`}
                        style={{ zIndex: 13 }}
                        bottom={state?.scrollPos === 'bottom' ? true : undefined}
                        offsetBottom={50}
                        offsetTop={62}
                      >
                        <Card
                          id={selected === i ? 'active' : ''}
                          onClick={() => {
                            dispatch(setSessionSelected({ session, index: i }))
                          }}
                          className={`mb-0 shadow-none  border ${
                            selected === i ? 'border-dark session-list active' : 'session-list'
                          }`}
                        >
                          <CardBody>
                            <Row className='g-0 align-items-center'>
                              <Col xs='2'>
                                <Link to={'#'}>{session?.unique_id}</Link>
                              </Col>
                              <Col>
                                {Number(session?.customer?.rating) > 0 ? (
                                  <Ratings rating={Number(session?.customer?.rating)} max={5} />
                                ) : (
                                  <span className='text-muted'>{FM('no-rating-available')}</span>
                                )}
                              </Col>
                              <Col xs='3'>
                                <div className='d-flex align-items-center'>
                                  {/* <div
                                    className='avatar rounded me-50'
                                    style={{ backgroundColor: 'inherit' }}
                                  >
                                    <div className='avatar-content'>
                                      <YourSvg color='primary' style={{ height: 41 }} />
                                    </div>
                                  </div> */}
                                  <div>
                                    <div className='fw-bolder'>
                                      {session?.carts?.length === 0 ? (
                                        FM('no-products-yet')
                                      ) : (
                                        <Fragment>
                                          {/* {truncateText(
                                            session?.carts &&
                                              session?.carts[0]?.product_variant?.product?.name,
                                            25
                                          )}{' '}
                                          <br /> */}
                                          <Badge pill color='light-primary' role={'button'}>
                                            {`${session?.total_quantity} ${FM('items')}`}
                                          </Badge>
                                          {/* <div className='font-small-2 text-muted'>{col.email}</div> */}
                                        </Fragment>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              </Col>
                              <Col>
                                {CF({
                                  money:
                                    session?.carts
                                      ?.map((a: any) => {
                                        let t = a?.price
                                        if (isValid(a?.in_offer_cart)) {
                                          t += a?.in_offer_cart?.price
                                        }
                                        return t
                                      })
                                      .reduce((a: any, b: any) => a + b, 0) ?? 0,
                                  currency: user?.currency
                                })}
                              </Col>
                              <Col xs='2'>{moment(new Date(session?.updated_at)).fromNow()}</Col>
                              {/* <Col xs='1'>
                                {state.selected === i ? (
                                  <BsTooltip title={FM('action-required')}>
                                    <AlertTriangle className='text-danger' />
                                  </BsTooltip>
                                ) : (
                                  <Check className='text-success' />
                                )}
                              </Col> */}
                            </Row>
                          </CardBody>
                        </Card>
                      </Comp>
                    </>
                  )
                })}
              </Col>
              <StickyBox
                className='col-md-3'
                style={{ zIndex: 12 }}
                offsetBottom={0}
                offsetTop={62}
              >
                <Show IF={isValid(sessionSelected)}>
                  {renderCartItems(sessionSelected!, ' border-dark br-0', 0)}
                </Show>
              </StickyBox>
            </Row>
          </div>
        </div>
      ) : (
        <Row className='mt-2'>
          {storesData?.map((d: any, i: any) => {
            return (
              <>
                <Col md={4}>
                  {d?.payment_status === 1
                    ? renderCartItems(d, 'border-success', i)
                    : renderCartItems(d, 'border-none', i)}
                </Col>
              </>
            )
          })}
        </Row>
      )}
    </>
  )
}

export default Sessions
