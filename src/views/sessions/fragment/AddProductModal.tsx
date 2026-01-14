import InputNumber from 'rc-input-number'
import { Fragment, useEffect, useReducer, useState } from 'react'
import { Minus, Plus } from 'react-feather'
import { useForm } from 'react-hook-form'
import { Alert, Badge, Button, ButtonGroup, CardBody, Input, Label } from 'reactstrap'
import {
  sessionUpdate,
  setOffer,
  setSelectedOffer,
  updateTimestamp
} from '../../../redux/reducers/sessionRducer'
import { useRedux } from '../../../redux/useRedux'
import { CMD, ProductOfferTypes } from '../../../utility/Const'
import { FM, isValid, isValidArray, log } from '../../../utility/helpers/common'
import Hide from '../../../utility/Hide'
import useWebSockets from '../../../utility/hooks/useSocket'
import useUser from '../../../utility/hooks/useUser'
import httpConfig from '../../../utility/http/httpConfig'
import Show from '../../../utility/Show'
import { stateReducer } from '../../../utility/stateReducer'
import {
  CF,
  checkHttp,
  ErrorToast,
  getVatValue,
  SuccessToast,
  truncateText
} from '../../../utility/Utils'
import CenteredModal from '../../components/modal/CenteredModal'
import { ScanResultProps } from './ScanBarcode'
import http from '../../../utility/http/useHttp'
import ApiEndpoints from '../../../utility/http/ApiEndpoints'
import Shimmer from '../../components/shimmers/Shimmer'

interface dataType {
  edit?: any
  noView?: boolean
  showModal?: boolean
  setShowModal?: (e: boolean) => void
  Component?: any
  children?: any
  loadBarcode?: any
}

interface States {
  scanResult?: any
  cartItem?: any
  offered_product?: any
  quantity?: number
  searchResult?: any[]
  activeTab?: string
}

export default function AddProductModal<T>(props: T & dataType) {
  //Props
  const {
    edit = null,
    noView = false,
    showModal = false,
    setShowModal = () => {},
    Component = 'span',
    children = null,
    ...rest
  } = props

  const [open, setOpen] = useState(false)
  const initState: States = {
    scanResult: undefined,
    cartItem: undefined,
    offered_product: null,
    quantity: 0,
    searchResult: undefined,
    activeTab: 'barcode'
  }
  const user = useUser()
  const reducers = stateReducer<States>
  const {
    dispatch,
    state: {
      session: { lastMessageTimeStamp, addOffer, selectedOffer }
    }
  } = useRedux()
  const [state, setState] = useReducer(reducers, initState)
  const [loadingSearch, setLoadingSearch] = useState(false)
  const [searchText, setSearchText] = useState('')

  // socket
  const { lastMessage, sendMessage, lastMessageOriginal, readyState } = useWebSockets()

  // form
  const form = useForm<any>()
  const { control, handleSubmit, reset, watch } = form

  const openModal = () => {
    setOpen(true)
    setState({
      scanResult: null
    })
    reset()
  }

  const findProduct = (search: any) => {
    if (isValid(search)) {
      http.request({
        path: ApiEndpoints.productSearch,
        method: 'POST',
        loading: setLoadingSearch,
        jsonData: {
          search
        },
        success: (data: any) => {
          log('data', data)
          setState({
            searchResult: data?.payload?.filter((a: any) => a.barcode !== null)
          })
        }
      })
    }
  }

  const closeModal = (from = null) => {
    // alert('called')
    setState({
      scanResult: null,
      activeTab: 'barcode',
      searchResult: undefined,
      cartItem: null
    })
    setOpen(false)
    setShowModal(false)
    reset()
    setSearchText('')

    // dispatch(setProductSelected(null))
  }

  useEffect(() => {
    if (noView && showModal) {
      openModal()
    }
  }, [noView, showModal])

  const handleScanResult = (barcodeText: any, result: ScanResultProps) => {
    log('result', result)
    // get product details
    sendMessage({
      command: CMD.ProductInfo,
      bar_code: barcodeText
    })
  }

  // handle manual barcode
  const handleForm = (e: any) => {
    // get product details
    if (isValid(e)) {
      // CHECK IF PRODUCT ADDED
      //   const c = edit?.carts?.find(a => a.product_variant_id)
      sendMessage({
        command: CMD.ProductInfo,
        bar_code: e
      })
    }
  }

  //. remove product
  const handleRemoveProduct = (id: any, customer: any, session: any) => {
    sendMessage({
      command: CMD.RemoveCartItem,
      cart_id: id,
      customer_id: customer,
      session_id: session
    })
  }

  const handleAddToCart = (qty: any, type: any, addOff = false, index = selectedOffer?.index) => {
    log('called me at', new Date())
    log('index', index)
    // get product details
    if (isValid(qty)) {
      if (qty > 0) {
        // update cart
        if (type === 'up') {
          // check offer
          const offer = isValid(index)
            ? state?.scanResult?.data?.product_variant?.product_offers.length > 0
              ? state?.scanResult?.data?.product_variant?.product_offers[index]
              : null
            : null

          let offeredProduct = null
          if (isValid(offer) && addOff) {
            if (qty >= offer?.purchase_quantity) {
              if (Number(offer?.offer_type) === ProductOfferTypes.same_quantity_on_quantity) {
                offeredProduct = {
                  // ...offer
                  offer_id: offer?.id,
                  currency: user?.currency,
                  price: 0,
                  product_variant_id: offer?.offered_product_variant_id,
                  qty: offer?.purchase_quantity,
                  variant_token: offer?.offered_product_variant?.variant_token
                }
              } else if (
                Number(offer?.offer_type) === ProductOfferTypes.diff_quantity_on_quantity
              ) {
                offeredProduct = {
                  // ...offer
                  offer_id: offer?.id,
                  currency: user?.currency,
                  price: offer?.offered_product_discount,
                  product_variant_id: offer?.offered_product_variant_id,
                  qty: 1,
                  variant_token: offer?.offered_product_variant?.variant_token
                }
              }
            } else {
              dispatch(setSelectedOffer(null))
              dispatch(setOffer(false))
            }
          }

          // add to cart
          sendMessage({
            ...state?.scanResult?.command,
            original_price:
              state?.scanResult?.data?.type === 2
                ? state?.scanResult?.data?.price
                : state?.scanResult?.data?.product_variant?.selling_price,
            vat_percentage: state?.scanResult?.data?.product_variant?.product?.vat,
            price:
              getVatValue(
                state?.scanResult?.data?.product_variant?.product?.vat,
                state?.scanResult?.data?.type === 2
                  ? state?.scanResult?.data?.price
                  : state?.scanResult?.data?.product_variant?.selling_price
              ) +
              ((state?.scanResult?.data?.type === 2
                ? state?.scanResult?.data?.price
                : state?.scanResult?.data?.product_variant?.selling_price) * qty ?? 0),
            vat_amount: Number(
              qty *
                getVatValue(
                  state?.scanResult?.data?.product_variant?.product?.vat,
                  state?.scanResult?.data?.type === 2
                    ? state?.scanResult?.data?.price
                    : state?.scanResult?.data?.product_variant?.selling_price
                )
            ).toFixed(2),
            dir: type,
            addToCart: true,
            addOff,
            offered_product: offeredProduct
          })
        } else {
          // check offer
          const offer = isValid(index)
            ? state?.scanResult?.data?.product_variant?.product_offers.length > 0
              ? state?.scanResult?.data?.product_variant?.product_offers[index]
              : null
            : null
          log('offer', offer)
          let offeredProduct = null
          if (isValid(offer) && addOff) {
            log('checked offer', addOff, offer)
            if (qty >= offer?.purchase_quantity) {
              if (Number(offer?.offer_type) === ProductOfferTypes.same_quantity_on_quantity) {
                offeredProduct = {
                  // ...offer
                  cart_id: isValid(state?.cartItem?.in_offer_cart)
                    ? state?.cartItem?.in_offer_cart?.id
                    : null,
                  offer_id: offer?.id,
                  currency: user?.currency,
                  price: 0,
                  product_variant_id: offer?.offered_product_variant_id,
                  qty: offer?.purchase_quantity,
                  variant_token: offer?.offered_product_variant?.variant_token,
                  vat_amount: 0
                }
                log('same_quantity_on_quantity', offeredProduct)
              } else if (
                Number(offer?.offer_type) === ProductOfferTypes.diff_quantity_on_quantity
              ) {
                offeredProduct = {
                  // ...offer
                  offer_id: offer?.id,
                  cart_id: isValid(state?.cartItem?.in_offer_cart)
                    ? state?.cartItem?.in_offer_cart?.id
                    : null,
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
                      1 ?? 0,
                  vat_amount: Number(
                    1 *
                      getVatValue(
                        offer?.offered_product_variant?.product?.vat,
                        offer?.offered_product_discount
                      )
                  ).toFixed(2),
                  variant_token: offer?.offered_product_variant?.variant_token
                }
                log('diff_quantity_on_quantity', offeredProduct)
              }
            } else {
              dispatch(setSelectedOffer(null))
              dispatch(setOffer(false))
            }
          }
          // update cart
          if (isValid(state?.cartItem?.id)) {
            log('offeredProduct', offeredProduct)
            sendMessage({
              addOff,
              dir: type,
              updateCart: 'yes',
              command: CMD.UpdateCartItem,
              cart_id: state?.cartItem?.id,
              customer_id: edit?.customer?.id,
              session_id: edit?.id,
              product_variant_id: state?.scanResult?.data?.product_variant?.id,
              variant_token: state?.scanResult?.data?.product_variant?.variant_token,
              qty,
              currency: state?.scanResult?.data?.product_variant?.currency ?? user?.currency,
              original_price: state?.scanResult?.data?.product_variant?.selling_price,
              vat_percentage: state?.scanResult?.data?.product_variant?.product?.vat,
              offered_product: offeredProduct,
              price:
                (getVatValue(
                  state?.scanResult?.data?.product_variant?.product?.vat,
                  state?.scanResult?.data?.product_variant?.selling_price
                ) +
                  state?.scanResult?.data?.product_variant?.selling_price) *
                  qty ?? 0,
              vat_amount: Number(
                qty *
                  getVatValue(
                    state?.scanResult?.data?.product_variant?.product?.vat,
                    state?.scanResult?.data?.product_variant?.selling_price
                  )
              ).toFixed(2)
            })
          }
        }
      } else {
        // delete from cart
        if (isValid(state?.cartItem?.id)) {
          dispatch(setOffer(false))
          handleRemoveProduct(state?.cartItem?.id, edit?.customer?.id, edit?.id)
        }
      }
    }
  }
  // receive messages
  useEffect(() => {
    if (lastMessageTimeStamp !== lastMessageOriginal?.timeStamp) {
      dispatch(updateTimestamp(lastMessageOriginal?.timeStamp))
      const data = lastMessage?.data
      log(lastMessageTimeStamp)
      switch (lastMessage?.command) {
        case CMD.ProductInfo:
          log('ProductInfo', lastMessage)
          if (lastMessage?.success) {
            const cartItems = edit?.carts?.find(
              (a: any) => a.product_variant_id === data?.product_variant?.id
            )
            const isAdded = edit?.carts?.find(
              (a: any) => a.product_variant_id === data?.product_variant?.id
            )?.qty

            if (isAdded > data?.product_variant?.quantity) {
              // update cart
              handleAddToCart(data?.product_variant?.quantity, 'down', addOffer)
            } else {
              setState({
                quantity: isAdded,
                cartItem: cartItems,
                scanResult: {
                  quantity: isAdded,
                  command: {
                    product_bar_code: data?.bar_code,
                    command: CMD.AddCartItem,
                    customer_id: edit?.customer?.id,
                    session_id: edit?.id,
                    product_variant_id: data?.product_variant?.id,
                    variant_token: data?.product_variant?.variant_token,
                    qty: 1,
                    currency: data?.product_variant?.currency ?? user?.currency,
                    original_price:
                      data?.type === 2 ? data?.price : data?.product_variant?.selling_price,
                    vat_percentage: data?.product_variant?.product?.vat,
                    price:
                      (getVatValue(
                        data?.product_variant?.product?.vat,
                        data?.type === 2 ? data?.price : data?.product_variant?.selling_price
                      ) +
                        data?.type ===
                      2
                        ? data?.price
                        : data?.product_variant?.selling_price) * 1 ?? 0,
                    vat_amount: Number(
                      1 *
                        getVatValue(
                          data?.product_variant?.product?.vat,
                          data?.type === 2 ? data?.price : data?.product_variant?.selling_price
                        )
                    ).toFixed(2)
                  },
                  data
                }
              })
            }
          } else {
            setState({
              scanResult: null
            })
          }
          //   if (lastMessage?.success) {
          //     sendMessage({
          //       command: CMD.AddCartItem,
          //       customer_id: edit?.customer?.id,
          //       session_id: edit?.id,
          //       product_variant_id: data?.product_variant?.id,
          //       variant_token: data?.product_variant?.variant_token,
          //       qty: 1,
          //       currency: data?.product_variant?.currency ?? 'kr',
          //       price: data?.product_variant?.selling_price
          //     })
          //   } else {
          //     ErrorToast(FM('cannot-add-product-to-cart'))
          //   }
          break
        case CMD.AddCartItem:
          log('AddCartItem', lastMessage)
          if (lastMessage?.success) {
            setState({
              cartItem: data
            })
            sendMessage({
              command: CMD.GetCustomerSession,
              customer_id: edit?.customer?.id,
              session_id: edit?.id
            })
            SuccessToast(FM('added-to-cart-successfully'), {
              id: 'clipboard',
              position: 'bottom-center'
            })
          } else {
            ErrorToast(FM('cannot-add-product-to-cart'), {
              id: 'clipboard',
              position: 'bottom-center'
            })
          }
          break
        case CMD.GetCustomerSession:
          log('GetCustomerSession', lastMessageOriginal)
          if (lastMessage?.success) {
            const cartItems = data?.carts?.find(
              (a: any) => a.product_variant_id === state?.scanResult?.data?.product_variant?.id
            )
            setState({
              cartItem: cartItems
            })
            dispatch(sessionUpdate({ ...data }))
          }
          break
        default:
          break
      }
    }
  }, [lastMessageOriginal, lastMessage, dispatch])

  //   useEffect(() => {
  //     handleAddToCart(state?.quantity, 'down')
  //   }, [addOffer])

  const add = (e: any, index: any) => {
    if (index === selectedOffer?.index) {
      // remove
      dispatch(setSelectedOffer(null))
      dispatch(setOffer(false))
      setTimeout(() => {
        handleAddToCart(state?.quantity, 'down', false, index)
      }, 1000)
    } else {
      dispatch(setSelectedOffer({ ...e, index }))
      dispatch(setOffer(isValid(e)))
      setTimeout(() => {
        handleAddToCart(state?.quantity, 'down', isValid(e), index)
      }, 1000)
    }
  }

  const renderOfferText = (
    type = 1,
    offer_value = 0,
    purchase_quantity = 0,
    offered_product_discount = 0,
    offered_product_variant = '',
    quantity = 0,
    thisOffer: any,
    index: number
  ) => {
    switch (type) {
      case ProductOfferTypes.amount:
        return (
          <Fragment>
            <Alert color='primary' className='mt-0'>
              <div className='alert-body'>
                {FM('offer-type-amount-description', {
                  discount: CF({ money: offer_value, currency: user?.currency })
                })}
              </div>
            </Alert>
          </Fragment>
        )
      case ProductOfferTypes.percent:
        return (
          <Fragment>
            <Alert color='primary' className='mt-0'>
              <div className='alert-body'>
                {FM('offer-type-percentage-description', { discount: offer_value })}
              </div>
            </Alert>
          </Fragment>
        )
      case ProductOfferTypes.same_quantity_on_quantity:
        return (
          <Fragment>
            <Alert color={quantity >= purchase_quantity ? 'success' : 'primary'} className='mt-0'>
              <div className='alert-body'>
                {FM('offer-type-buy-x-get-x-free-description', {
                  buy: purchase_quantity,
                  price: '',
                  get: offer_value
                })}
                {/* <div className='fw-bolder text-small-12 text-dark'>
                  {quantity === purchase_quantity ? FM('offer-applied') : ''}
                </div> */}
                <Show IF={quantity >= purchase_quantity}>
                  <span role={'button'}>
                    <Label>
                      <Input
                        checked={selectedOffer?.id === thisOffer?.id}
                        type='checkbox'
                        onChange={(e) => add(thisOffer, index)}
                      />{' '}
                      {FM('apply-offer')}
                    </Label>
                  </span>
                </Show>
              </div>
            </Alert>
          </Fragment>
        )
      //   case ProductOfferTypes.same_quantity_on_percent:
      //     return (
      //       <Fragment>
      //         <Alert color='primary' className='mt-0'>
      //           <div className='alert-body'>
      //             {FM('offer-type-buy-x-get-x-description', {
      //               buy: purchase_quantity,
      //               price: offer_value
      //             })}
      //           </div>
      //         </Alert>
      //       </Fragment>
      //     )
      case ProductOfferTypes.diff_quantity_on_quantity:
        return (
          <Fragment>
            <Alert color={quantity >= purchase_quantity ? 'success' : 'primary'} className='mt-0'>
              <div className='alert-body'>
                {FM('offer-type-buy-x-get-item-description', {
                  buy: purchase_quantity,
                  price: CF({ money: offered_product_discount ?? 0, currency: user?.currency }),

                  item: truncateText(offered_product_variant, 30)
                })}
                <Show IF={quantity >= purchase_quantity}>
                  <span role={'button'}>
                    <Label>
                      <Input
                        checked={selectedOffer?.id === thisOffer?.id}
                        type='checkbox'
                        onChange={(e) => add(thisOffer, index)}
                      />{' '}
                      {FM('apply-offer')}
                    </Label>
                  </span>
                </Show>
              </div>
            </Alert>
          </Fragment>
        )
      default:
        return null
    }
  }

  useEffect(() => {
    if (isValid(props.loadBarcode)) {
      handleForm(props?.loadBarcode?.product_bar_code)
      setState({
        cartItem: props?.loadBarcode
      })
    }
  }, [props?.loadBarcode])

  useEffect(() => {
    let getData: any = undefined
    if (isValid(searchText)) {
      setLoadingSearch(true)
      getData = setTimeout(() => {
        findProduct(searchText)
      }, 500)
    }
    return () => clearTimeout(getData)
  }, [searchText])

  return (
    <>
      {!noView ? (
        <Component role='button' onClick={openModal} {...rest}>
          {children}
        </Component>
      ) : null}
      <CenteredModal
        scrollControl={false}
        modalClass='modal-sm'
        open={open}
        disableFooter
        handleModal={closeModal}
        hideSave
        title={FM('scan-barcode')}
      >
        <CardBody className='p-1'>
          <ButtonGroup className='mb-1'>
            <Button
              color='primary'
              onClick={() => {
                setState({ activeTab: 'barcode' })
              }}
              outline={state.activeTab !== 'barcode'}
            >
              {FM('search-barcode')}
            </Button>
            <Button
              color='primary'
              onClick={() => {
                setState({ activeTab: 'product' })
              }}
              outline={state.activeTab !== 'product'}
            >
              {FM('search-product')}
            </Button>
          </ButtonGroup>
          {/* <ScanBarcode onSuccess={handleScanResult} /> */}
          {/* <Form onSubmit={handleSubmit(handleForm)}> */}
          <Show IF={state.activeTab === 'barcode'}>
            <Input
              value={props.loadBarcode?.product_bar_code}
              name='barcode'
              disabled={
                isValid(props.loadBarcode?.product_bar_code) || isValid(state?.scanResult?.data?.id)
              }
              onChange={(e) => {
                handleForm(e?.target?.value)
              }}
              type='text'
              placeholder={FM('enter-barcode')}
            />
          </Show>
          <Show IF={state.activeTab === 'product'}>
            <Input
              name='searchText'
              value={searchText}
              onChange={(e) => {
                setState({ searchResult: undefined })
                setSearchText(e?.target?.value)
              }}
              disabled={
                isValid(props.loadBarcode?.product_bar_code) || isValid(state?.scanResult?.data?.id)
              }
              className='mb-1'
              type='text'
              placeholder={FM('search')}
            />
          </Show>
          <Show IF={loadingSearch}>
            <Shimmer style={{ height: 30, marginBlock: 5 }} />
            <Shimmer style={{ height: 30, marginBlock: 5 }} />
            <Shimmer style={{ height: 30, marginBlock: 5 }} />
          </Show>
          <Show IF={!loadingSearch && isValidArray(state?.searchResult)}>
            <>
              {state?.searchResult?.map((product, index) => {
                return (
                  <div
                    key={product?.id}
                    className='p-50 shadow-sm'
                    role='button'
                    onClick={() => {
                      setState({ searchResult: [], quantity: 0, scanResult: undefined })
                      setSearchText('')
                      handleForm(product?.barcode)
                    }}
                  >
                    {product?.product_name} : {product?.product_variant_name} : <br />
                    <Badge color='primary' className='mt-25'>
                      {product?.quantity <= 0 ? 'Out of stock' : 'In stock'}
                    </Badge>
                  </div>
                )
              })}
            </>
          </Show>
          <Show IF={isValid(state?.scanResult)}>
            <div className='mt-2' style={{ minHeight: 150 }}>
              {/* <h6 className='fw-bolder text-small-12 mb-1 '>{FM('product-details')}</h6> */}
              <div className='d-flex shadow p-1'>
                <Show
                  IF={isValid(state?.scanResult?.data?.product_variant?.product?.product_image)}
                >
                  <img
                    className='d-block rounded me-1'
                    src={
                      (!checkHttp(
                        state?.scanResult?.data?.product_variant?.product_image ??
                          state?.scanResult?.data?.product_variant?.product?.product_image
                      )
                        ? httpConfig.baseUrl2
                        : '') +
                      (state?.scanResult?.data?.product_variant?.product_image ??
                        state?.scanResult?.data?.product_variant?.product?.product_image)
                    }
                    alt={state?.scanResult?.data?.product_variant?.name}
                    width='50'
                  />
                </Show>
                <div>
                  <p className='mb-25 fw-bolder text-dark'>
                    {state?.scanResult?.data?.product_variant?.name}
                  </p>
                  <p className='mb-25 fw-bolder'>
                    <span className='text-success '>
                      {state?.scanResult?.data?.type === 2
                        ? CF({
                            money: state?.scanResult?.data?.price,
                            currency: user?.currency
                          })
                        : CF({
                            money: state?.scanResult?.data?.product_variant?.selling_price,
                            currency: user?.currency
                          })}
                    </span>{' '}
                    <Hide
                      IF={
                        `${state?.scanResult?.data?.product_variant?.selling_price}` ===
                          `${state?.scanResult?.data?.product_variant?.max_retail_price}` ||
                        state?.scanResult?.data?.type === 2
                      }
                    >
                      <s>
                        {CF({
                          money: state?.scanResult?.data?.product_variant?.max_retail_price,
                          currency: user?.currency
                        })}
                      </s>
                    </Hide>
                  </p>
                  <p className='mb-25 fw-bolder text-dark'>
                    <Show IF={state?.scanResult?.data?.type === 2}>
                      <>
                        {state?.scanResult?.data?.quantity}{' '}
                        {FM(state?.scanResult?.data?.product_variant?.unit_type)}
                      </>
                    </Show>
                  </p>
                </div>
              </div>
              <Show
                IF={
                  isValidArray(state?.scanResult?.data?.product_variant?.product_offers) &&
                  isValid(state?.cartItem)
                }
              >
                <h6 className='fw-bolder text-small-12 mt-1 mb-75 text-center'>
                  {FM('available-offers')}
                </h6>
                <p className='text-center fw-bolder'>
                  {state?.scanResult?.data?.product_variant?.product_offers?.map(
                    (d: any, i: number) =>
                      renderOfferText(
                        Number(d?.offer_type),
                        d?.offer_value,
                        d?.purchase_quantity,
                        d?.offered_product_discount,
                        d?.offered_product_variant?.name,
                        state?.quantity,
                        d,
                        i
                      )
                  )}
                </p>
              </Show>

              <InputNumber
                min={0}
                max={state?.scanResult?.data?.type === 2 ? 1 : null}
                defaultValue={state?.scanResult?.quantity ?? 0}
                onStep={(e, { type }) => {
                  setState({ quantity: e })
                  handleAddToCart(e, type, addOffer)
                }}
                className='input-lg mt-2 m-auto'
                upHandler={<Plus />}
                id='lg-number-input'
                downHandler={<Minus />}
              />
            </div>
          </Show>
          <Show
            IF={
              isValid(props.loadBarcode?.product_bar_code) || isValid(state?.scanResult?.data?.id)
            }
          >
            <Button
              className='mt-2'
              color='danger'
              outline
              block
              onClick={() => {
                setState({
                  scanResult: null,
                  cartItem: null,
                  searchResult: undefined,
                  quantity: 0,
                  offered_product: null
                })
                setSearchText('')
              }}
            >
              {FM('clear-field')}
            </Button>
          </Show>
          {/* <Button className='mt-1' size='sm' color='primary' type='submit'>
            {FM('add')}
          </Button> */}
          {/* </Form> */}
        </CardBody>
      </CenteredModal>
    </>
  )
}
