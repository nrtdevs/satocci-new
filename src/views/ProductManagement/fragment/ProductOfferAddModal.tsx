import { Fragment, useEffect, useReducer, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useParams } from 'react-router-dom'
import {
  Alert,
  CardBody,
  Col,
  Form,
  InputGroupText,
  Label,
  Nav,
  NavItem,
  NavLink,
  Row
} from 'reactstrap'
import {
  useCreateOrUpdateProductOfferMutation,
  useCreateProductOfferMutation
} from '../../../redux/RTKQuery/ProductRTK'
import { loadDropdown } from '../../../utility/apis/dropdowns'
import { ProductOfferTypes, ProductOfferTypesDrops, UserType } from '../../../utility/Const'
import { FM, isValid, log } from '../../../utility/helpers/common'
import Hide from '../../../utility/Hide'
import useUser from '../../../utility/hooks/useUser'
import useUserType from '../../../utility/hooks/useUserType'
import ApiEndpoints from '../../../utility/http/ApiEndpoints'
import Show from '../../../utility/Show'
import { stateReducer } from '../../../utility/stateReducer'
import {
  addDay,
  CF,
  createConstSelectOptions,
  formatDate,
  truncateText
} from '../../../utility/Utils'
import FormGroupCustom from '../../components/formGroupCustom/FormGroupCustom'

import classnames from 'classnames'
import CenteredModal from '../../components/modal/CenteredModal'
import SimpleImageUpload from '../../components/SimpleImageUpload'
import { ProductOfferType } from './ProductForm'
interface States {
  lastRefresh?: any
  loading?: boolean
  text?: string
  list?: any

  search?: any
}
type FormData = {
  product_id?: any
  variant_id?: any
  store_id?: any
  files?: any
}
interface dataType {
  edit?: any
  noView?: boolean
  subCatStoreID?: any
  showModal?: boolean
  resData?: (e: boolean) => void
  setShowModal?: (e: boolean) => void
  Component?: any
  loading?: boolean
  children?: any
  // rest?: any
}

export default function ProductOfferAddModal<T>(props: T & dataType) {
  const {
    edit = null,
    noView = false,
    showModal = false,
    resData = () => {},
    setShowModal = () => {},
    Component = 'span',
    children = null,
    ...rest
  } = props

  const initState: States = {
    lastRefresh: new Date().getTime(),
    loading: false,
    search: undefined,
    text: '',
    list: []
  }
  const reducers = stateReducer<States>
  const [state, setState] = useReducer(reducers, initState)
  const [open, setOpen] = useState(false)
  const [files, setFiles] = useState<any>([])
  const [loadingSample, setLoadingSample] = useState(false)
  const user = useUser()
  const params = useParams()
  const userType = useUserType()
  const store_id = params?.id
  const form = useForm<ProductOfferType>()
  const { handleSubmit, control, reset, setValue, watch, clearErrors, resetField } = form
  const [createOffer, result] = useCreateOrUpdateProductOfferMutation()
  const [create, results] = useCreateProductOfferMutation()
  const [activeTab, setActiveTab] = useState<'single' | 'multiple'>('single')

  const toggleTab = (tab: 'single' | 'multiple') => {
    if (activeTab !== tab) {
      setActiveTab(tab)
      reset() // tab change par form reset
    }
  }

  log(results?.isSuccess, 'results')

  const currency = watch('product_id')?.extra?.store?.currency
  //   const isAdmin = userType === UserType.Admin || user?.store_id === UserType.Admin ? true : false
  const isAdmin = !!(userType === UserType.Admin || user?.store_id === UserType.Admin)
  const openModal = () => {
    setOpen(true)
  }
  const closeModal = (from = null) => {
    reset()
    setOpen(false)
    setShowModal(false)
  }

  const renderOfferText = () => {
    switch (watch('offer_type')?.value) {
      case ProductOfferTypes.amount:
        return (
          <Fragment>
            <Alert color='danger' className='mt-1'>
              <div className='alert-body'>
                {FM('offer-type-amount-description', {
                  discount: CF({
                    money: watch('offer_value') ?? 0,
                    currency
                  })
                })}
              </div>
            </Alert>
          </Fragment>
        )
      case ProductOfferTypes.percent:
        return (
          <Fragment>
            <Alert color='danger' className='mt-1'>
              <div className='alert-body'>
                {FM('offer-type-percentage-description', { discount: watch('offer_value') ?? 0 })}
              </div>
            </Alert>
          </Fragment>
        )
      case ProductOfferTypes.same_quantity_on_quantity:
        return (
          <Fragment>
            <Alert color='danger' className='mt-1'>
              <div className='alert-body'>
                {FM('offer-type-buy-x-get-x-free-description', {
                  buy: watch('purchase_quantity'),
                  price: '',
                  get: watch('offer_value') ?? 0
                })}
              </div>
            </Alert>
          </Fragment>
        )
      case ProductOfferTypes.same_quantity_on_percent:
        return (
          <Fragment>
            <Alert color='danger' className='mt-1'>
              <div className='alert-body'>
                {FM('offer-type-buy-x-get-x-description', {
                  buy: watch('purchase_quantity'),
                  price: watch('offer_value') ?? 0
                })}
              </div>
            </Alert>
          </Fragment>
        )
      case ProductOfferTypes.diff_quantity_on_quantity:
        return (
          <Fragment>
            <Alert color='danger' className='mt-1'>
              <div className='alert-body'>
                {FM('offer-type-buy-x-get-item-description', {
                  buy: watch('purchase_quantity'),
                  price:
                    CF({
                      money: watch('offered_product_discount'),
                      currency
                    }) ?? 0,
                  item: truncateText(watch('offered_product_variant_id')?.extra?.name, 30)
                })}
              </div>
            </Alert>
          </Fragment>
        )
      default:
        return null
    }
  }

  useEffect(() => {
    if (isValid(watch('product_id')?.value)) {
      setValue('offered_product_variant_id', null)
      setValue('offered_product_discount', null)
    } else {
      setValue('variant_id', null)
    }
  }, [watch('product_id')])

  const handleSave = (d: ProductOfferType) => {
    if (activeTab === 'single') {
      createOffer({
        // ...details,
        action: false,
        store_id: watch('product_id')?.extra?.store_id,
        product_variant_id: watch('variant_id')?.value,
        offer_type: d?.offer_type?.value,
        offer_value: d?.offer_value,
        offered_product_discount: d?.offered_product_discount,
        offer_valid_from: d?.offer_valid_from,
        offer_valid_to: d?.offer_valid_to,
        offered_product_variant_id: watch('offered_product_variant_id')?.value,
        purchase_quantity: d?.purchase_quantity ?? 1,
        status: d?.status ?? 1
      })
    }
    if (activeTab === 'multiple') {
      create({
        // ...details,
        action: false,
        store_id: isAdmin ? Number(store_id) : Number(store_id),

        offer_type: d?.offer_type?.value,
        offer_value: d?.offer_value,
        offer_valid_from: d?.offer_valid_from,
        offer_valid_to: d?.offer_valid_to,

        purchase_quantity: d?.purchase_quantity ?? 1,
        status: d?.status ?? 1
      })
    }
  }
  ///////////////

  useEffect(() => {
    clearErrors()
    resetField('purchase_quantity')
    resetField('offered_product_discount')
    resetField('offer_valid_from')
    resetField('offer_valid_to')
    resetField('offer_value')
    setValue('offer_value', 0)
    resetField('offered_product_discount')
  }, [watch('offer_type')])
  useEffect(() => {
    if (noView && showModal) {
      openModal()
    }
  }, [noView, showModal])

  //////
  useEffect(() => {
    if (result?.isSuccess || results?.isSuccess) {
      resData(true)
      reset()
      closeModal()
    }
  }, [result, results])

  useEffect(() => {
    if (watch('product_id')?.value !== watch('variant_id')?.extra?.product_id) {
      setValue('variant_id', null)
    }
  }, [watch('product_id'), watch('variant_id')])

  log('product', watch('product_id'), 'variant', watch('variant_id'))

  return (
    <>
      {!noView ? (
        <Component role='button' onClick={openModal} {...rest}>
          {children}
        </Component>
      ) : null}
      <CenteredModal
        scrollControl={false}
        modalClass='modal-lg'
        loading={result?.isLoading}
        open={open}
        disableSave={result?.isLoading}
        handleModal={closeModal}
        handleSave={handleSubmit(handleSave)}
        title={FM(`offer`)}
      >
        <CardBody className=''>
          <Nav tabs className='mb-2'>
            <NavItem>
              <NavLink
                className={classnames({ active: activeTab === 'single' })}
                onClick={() => toggleTab('single')}
                role='button'
              >
                {FM('single-product-offer')}
              </NavLink>
            </NavItem>

            <NavItem>
              <NavLink
                className={classnames({ active: activeTab === 'multiple' })}
                onClick={() => toggleTab('multiple')}
                role='button'
              >
                {FM('multiple-product-offer')}
              </NavLink>
            </NavItem>
          </Nav>

          <Row className=''>
            <Form>
              <CardBody>
                {activeTab === 'single' && (
                  <>
                    <>
                      <Row>
                        <Col md='10'>
                          <Row>
                            <Col md='12'>
                              <FormGroupCustom
                                label={FM('product')}
                                placeholder={FM('product')}
                                //   noLabel
                                async
                                isClearable
                                path={ApiEndpoints.load_product}
                                selectLabel='name'
                                selectValue={'id'}
                                defaultOptions
                                jsonData={{
                                  store_id: isAdmin ? Number(store_id) : Number(user?.store_id)
                                }}
                                loadOptions={loadDropdown}
                                name={`product_id`}
                                type={'select'}
                                className='mb-1'
                                control={control}
                                rules={{
                                  required: true
                                }}
                              />
                            </Col>
                            <Col md='12'>
                              <FormGroupCustom
                                key={`${watch('product_id')?.value}-fjffj-${user?.store_id}`}
                                label={FM('product-variant')}
                                placeholder={FM('product-variant')}
                                //   noLabel
                                async
                                isDisabled={!isValid(watch('product_id'))}
                                isClearable
                                path={`${ApiEndpoints.load_product_variant}${
                                  watch('product_id')?.value
                                }`}
                                selectLabel='name'
                                selectValue={'id'}
                                jsonData={{
                                  store_id: isAdmin ? Number(store_id) : Number(user?.store_id)
                                }}
                                defaultOptions
                                loadOptions={loadDropdown}
                                name={`variant_id`}
                                type={'select'}
                                className='mb-2'
                                control={control}
                                rules={{ required: true }}
                                //   prepend={<InputGroupText>{FM('get')}</InputGroupText>}
                                //   append={<InputGroupText>{FM('item')}</InputGroupText>}
                              />
                            </Col>
                          </Row>
                        </Col>
                        <Col md='2' className='mt-1'>
                          <Label>{FM('offer-image')}</Label>
                          <SimpleImageUpload
                            params={{ for: 'offer' }}
                            value={watch('offer_image')}
                            name={`offer_image`}
                            setValue={setValue}
                          />
                        </Col>
                      </Row>
                      <Row className='g-1 mb-50'>
                        <Col md='4'>
                          <FormGroupCustom
                            label={FM('discount-type')}
                            placeholder={FM('discount-type')}
                            //   noLabel
                            name={`offer_type`}
                            type={'select'}
                            selectOptions={createConstSelectOptions(ProductOfferTypesDrops, FM)}
                            className='mb-0'
                            control={control}
                            rules={{ required: true }}
                          />
                        </Col>
                        <Show
                          IF={
                            watch(`offer_type`)?.value ===
                              ProductOfferTypes?.same_quantity_on_quantity ||
                            watch(`offer_type`)?.value ===
                              ProductOfferTypes?.diff_quantity_on_quantity ||
                            watch(`offer_type`)?.value ===
                              ProductOfferTypes?.same_quantity_on_percent
                          }
                        >
                          <Fragment>
                            <Col md='4'>
                              <FormGroupCustom
                                placeholder={FM('purchase-quantity')}
                                label={FM('purchase-quantity')}
                                //   noLabel
                                name={`purchase_quantity`}
                                type={'number'}
                                className='mb-0'
                                control={control}
                                rules={{ required: true, min: 1 }}
                                prepend={<InputGroupText>{FM('buy')}</InputGroupText>}
                              />
                            </Col>
                          </Fragment>
                        </Show>
                        <Show
                          IF={
                            watch(`offer_type`)?.value ===
                              ProductOfferTypes?.diff_quantity_on_quantity ||
                            watch(`offer_type`)?.value ===
                              ProductOfferTypes?.same_quantity_on_quantity
                          }
                        >
                          <Fragment>
                            <Col md='4'>
                              <FormGroupCustom
                                label={FM('offered-product')}
                                placeholder={FM('offered-product')}
                                async
                                isClearable
                                path={ApiEndpoints.load_product}
                                selectLabel='name'
                                selectValue={'id'}
                                defaultOptions
                                loadOptions={loadDropdown}
                                jsonData={{
                                  product_type: '1',
                                  store_id: isAdmin ? Number(store_id) : Number(user?.store_id)
                                }}
                                name={`offered_product_id`}
                                type={'select'}
                                className='mb-0'
                                control={control}
                                rules={{ required: true }}
                                //   prepend={<InputGroupText>{FM('get')}</InputGroupText>}
                                //   append={<InputGroupText>{FM('item')}</InputGroupText>}
                              />
                            </Col>
                            <Col md='4'>
                              <FormGroupCustom
                                key={`${watch('offered_product_id')?.value}`}
                                label={FM('offered-product-variant')}
                                isClearable
                                isDisabled={!isValid(watch('offered_product_id')?.value)}
                                placeholder={FM('offered-product-variant')}
                                //   noLabel
                                async
                                path={`${ApiEndpoints.load_product_variant}${
                                  watch('offered_product_id')?.value
                                }`}
                                selectLabel='name'
                                selectValue={'id'}
                                jsonData={{
                                  product_type: '1'
                                }}
                                defaultOptions
                                loadOptions={loadDropdown}
                                name={`offered_product_variant_id`}
                                type={'select'}
                                className='mb-0'
                                control={control}
                                rules={{ required: true }}
                                //   prepend={<InputGroupText>{FM('get')}</InputGroupText>}
                                //   append={<InputGroupText>{FM('item')}</InputGroupText>}
                              />
                            </Col>
                          </Fragment>
                        </Show>
                        <Hide
                          IF={
                            watch(`offer_type`)?.value ===
                            ProductOfferTypes?.diff_quantity_on_quantity
                          }
                        >
                          <Col md='4'>
                            <FormGroupCustom
                              placeholder={FM('discount-value')}
                              label={FM('discount-value')}
                              // noLabel
                              name={`offer_value`}
                              type={'number'}
                              className='mb-0'
                              control={control}
                              rules={{
                                required:
                                  watch(`offer_type`)?.value === ProductOfferTypes?.percent ||
                                  watch(`offer_type`)?.value === ProductOfferTypes?.amount,
                                min: 0.001,
                                max:
                                  watch(`offer_type`)?.value === ProductOfferTypes?.percent
                                    ? 100
                                    : watch('product_variant_id')?.extra?.max_retail_price,
                                maxLength:
                                  watch(`offer_type`)?.value === ProductOfferTypes?.percent
                                    ? 5
                                    : `${watch('product_variant_id')?.extra?.max_retail_price}`
                                        .length
                              }}
                              prepend={
                                watch(`offer_type`)?.value ===
                                  ProductOfferTypes?.same_quantity_on_quantity ||
                                watch(`offer_type`)?.value ===
                                  ProductOfferTypes?.same_quantity_on_percent ? (
                                  <InputGroupText>{FM('get')}</InputGroupText>
                                ) : null
                              }
                              append={
                                watch(`offer_type`)?.value === ProductOfferTypes?.percent ||
                                watch(`offer_type`)?.value ===
                                  ProductOfferTypes?.same_quantity_on_percent ? (
                                  <InputGroupText>%</InputGroupText>
                                ) : watch(`offer_type`)?.value ===
                                  ProductOfferTypes?.same_quantity_on_quantity ? (
                                  <InputGroupText>{FM('free')}</InputGroupText>
                                ) : null
                              }
                            />
                          </Col>
                        </Hide>
                        <Show
                          IF={
                            watch(`offer_type`)?.value ===
                            ProductOfferTypes?.diff_quantity_on_quantity
                          }
                        >
                          <Col md='4'>
                            <FormGroupCustom
                              key={`dis-${watch('offered_product_variant_id')?.value}`}
                              placeholder={FM('price-of-the-product')}
                              label={FM('price-of-the-product')}
                              name={`offered_product_discount`}
                              type={'number'}
                              className='mb-0'
                              control={control}
                              rules={{ required: true }}
                            />
                          </Col>
                        </Show>
                        <Col md='4'>
                          <FormGroupCustom
                            placeholder={FM('offer-valid-from')}
                            label={FM('offer-valid-from')}
                            //   noLabel
                            name={`offer_valid_from`}
                            type={'date'}
                            datePickerOptions={{
                              minDate: formatDate(
                                new Date(
                                  addDay(
                                    new Date(),
                                    watch('offer_type')?.value === ProductOfferTypes.amount ||
                                      watch('offer_type')?.value === ProductOfferTypes.percent
                                      ? 0
                                      : 0
                                  )
                                )
                              )
                            }}
                            className='mb-0'
                            control={control}
                            rules={{ required: true }}
                          />
                        </Col>
                        <Col md='4'>
                          <FormGroupCustom
                            placeholder={FM('offer-valid-till')}
                            label={FM('offer-valid-till')}
                            //   noLabel
                            name={`offer_valid_to`}
                            type={'date'}
                            datePickerOptions={{
                              minDate: watch(`offer_valid_from`)
                                ? formatDate(watch(`offer_valid_from`))
                                : new Date()
                            }}
                            className='mb-0'
                            control={control}
                            rules={{
                              required: true
                            }}
                          />
                        </Col>
                      </Row>
                    </>
                  </>
                )}

                {activeTab === 'multiple' && (
                  <>
                    <Row>
                      <Col md='10'>
                        <Row>
                          <Col md='6'>
                            <FormGroupCustom
                              label={FM('discount-type')}
                              placeholder={FM('discount-type')}
                              //   noLabel
                              name={`offer_type`}
                              defaultValue={{
                                value: 2,
                                label: 'percent'
                              }}
                              type={'select'}
                              selectOptions={createConstSelectOptions(ProductOfferTypesDrops, FM)}
                              className='mb-0 pointer-events-none'
                              control={control}
                              rules={{ required: true }}
                            />
                          </Col>
                          <Hide
                            IF={
                              watch(`offer_type`)?.value ===
                              ProductOfferTypes?.diff_quantity_on_quantity
                            }
                          >
                            <Col md='6'>
                              <FormGroupCustom
                                placeholder={FM('discount-value')}
                                label={FM('discount-value')}
                                // noLabel
                                name={`offer_value`}
                                type={'number'}
                                className='mb-0 '
                                control={control}
                                rules={{
                                  required:
                                    watch(`offer_type`)?.value === ProductOfferTypes?.percent ||
                                    watch(`offer_type`)?.value === ProductOfferTypes?.amount,
                                  min: 0.001,
                                  max:
                                    watch(`offer_type`)?.value === ProductOfferTypes?.percent
                                      ? 100
                                      : watch('product_variant_id')?.extra?.max_retail_price,
                                  maxLength:
                                    watch(`offer_type`)?.value === ProductOfferTypes?.percent
                                      ? 5
                                      : `${watch('product_variant_id')?.extra?.max_retail_price}`
                                          .length
                                }}
                                prepend={
                                  watch(`offer_type`)?.value ===
                                    ProductOfferTypes?.same_quantity_on_quantity ||
                                  watch(`offer_type`)?.value ===
                                    ProductOfferTypes?.same_quantity_on_percent ? (
                                    <InputGroupText>{FM('get')}</InputGroupText>
                                  ) : null
                                }
                                append={
                                  watch(`offer_type`)?.value === ProductOfferTypes?.percent ||
                                  watch(`offer_type`)?.value ===
                                    ProductOfferTypes?.same_quantity_on_percent ? (
                                    <InputGroupText>%</InputGroupText>
                                  ) : watch(`offer_type`)?.value ===
                                    ProductOfferTypes?.same_quantity_on_quantity ? (
                                    <InputGroupText>{FM('free')}</InputGroupText>
                                  ) : null
                                }
                              />
                            </Col>
                          </Hide>
                          <Col md='6'>
                            <FormGroupCustom
                              placeholder={FM('offer-valid-from')}
                              label={FM('offer-valid-from')}
                              //   noLabel
                              name={`offer_valid_from`}
                              type={'date'}
                              datePickerOptions={{
                                minDate: formatDate(
                                  new Date(
                                    addDay(
                                      new Date(),
                                      watch('offer_type')?.value === ProductOfferTypes.amount ||
                                        watch('offer_type')?.value === ProductOfferTypes.percent
                                        ? 0
                                        : 0
                                    )
                                  )
                                )
                              }}
                              className='mb-0'
                              control={control}
                              rules={{ required: true }}
                            />
                          </Col>
                          <Col md='6'>
                            <FormGroupCustom
                              placeholder={FM('offer-valid-till')}
                              label={FM('offer-valid-till')}
                              //   noLabel
                              name={`offer_valid_to`}
                              type={'date'}
                              datePickerOptions={{
                                minDate: watch(`offer_valid_from`)
                                  ? formatDate(watch(`offer_valid_from`))
                                  : new Date()
                              }}
                              className='mb-0'
                              control={control}
                              rules={{
                                required: true
                              }}
                            />
                          </Col>
                        </Row>
                      </Col>
                      <Col md='2' className='mt-1'>
                        <Label>{FM('offer-image')}</Label>
                        <SimpleImageUpload
                          params={{ for: 'offer' }}
                          value={watch('offer_image')}
                          name={`offer_image`}
                          setValue={setValue}
                        />
                      </Col>
                    </Row>
                  </>
                )}
                {renderOfferText()}
              </CardBody>
            </Form>
          </Row>
        </CardBody>
      </CenteredModal>
    </>
  )
}
