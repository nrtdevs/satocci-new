import { Fragment, useEffect, useReducer, useState } from 'react'
import { useForm } from 'react-hook-form'
import { Alert, Badge, CardBody, Col, InputGroupText, Row } from 'reactstrap'
import { useCreateOrUpdateProductOfferMutation } from '../../../../../redux/RTKQuery/ProductRTK'

import { useAppDispatch } from '../../../../../redux/store'
import { loadDropdown } from '../../../../../utility/apis/dropdowns'
import { CategoryOfferTypes, ProductOfferTypes } from '../../../../../utility/Const'

import { FM, isValid, log } from '../../../../../utility/helpers/common'
import Hide from '../../../../../utility/Hide'
import ApiEndpoints from '../../../../../utility/http/ApiEndpoints'
import Show from '../../../../../utility/Show'
import { stateReducer } from '../../../../../utility/stateReducer'
import {
  addDay,
  CF,
  createConstSelectOptions,
  fillObject,
  formatDate,
  getKeyByValue,
  getUserData,
  setValues,
  truncateText
} from '../../../../../utility/Utils'
import FormGroupCustom from '../../../../components/formGroupCustom/FormGroupCustom'
import CenteredModal from '../../../../components/modal/CenteredModal'
import SimpleImageUpload from '../../../../components/SimpleImageUpload'
import {
  ProductOfferType,
  ProductVariantsType
} from '../../../../ProductManagement/fragment/ProductForm'

export type CategoryParamsType = {
  id?: string
  name: string
  status?: string
  patent_id?: string
}
interface dataType {
  edit?: ProductOfferType & any
  response?: (e: boolean) => void
  variantData?: ProductVariantsType
  noView?: boolean
  showModal?: boolean
  setShowModal?: (e: boolean) => void
  Component?: any
  loading?: boolean
  children?: any

  // rest?: any
}
interface States {
  page?: any
  per_page_record?: any
  formData: ProductOfferType

  lastRefresh?: any
}

export default function OffersActiveModal<T>(props: T & dataType) {
  const {
    edit = null,
    noView = false,
    showModal = false,

    variantData = {},
    setShowModal = () => {},
    Component = 'span',
    response = () => {},
    children = null,
    ...rest
  } = props

  const initState: States = {
    page: 1,
    formData: {
      id: null,
      product_name: null,
      product_variant_id: null,
      category_id: null,
      offers_image: null,
      purchase_quantity: null,
      //   purchase_quantity_discount?: any
      offer_type: null,
      offer_value: null,
      offered_product_variant_id: null,
      offered_product_discount: null,
      status: null,
      product_id: null,
      offer_valid_from: null,
      offer_valid_to: null,
      offer_image: null
    },
    per_page_record: 15
  }
  const reducers = stateReducer<States>
  const [state, setState] = useReducer(reducers, initState)
  const [open, setOpen] = useState(false)
  const [editData, setEditData] = useState(null)
  const [countryCode, setCountryCode] = useState(null)
  const [loading, setLoading] = useState(false)
  const [loadingSample, setLoadingSample] = useState(false)
  const dispatch = useAppDispatch()
  const form = useForm<ProductOfferType>()
  const user = getUserData()
  const {
    watch,
    formState: { errors },
    handleSubmit,
    setValue,
    control,
    reset,
    clearErrors,
    resetField
  } = form

  const openModal = () => {
    setOpen(true)
  }

  useEffect(() => {
    if (isValid(watch('offer_valid_from')) && isValid(watch('offer_valid_to'))) {
      if (new Date(watch('offer_valid_from')) > new Date(watch('offer_valid_to'))) {
        setValue('offer_valid_to', '')
      }
    }
  }, [watch('offer_valid_from'), watch('offer_valid_to')])

  const closeModal = (from = null) => {
    setOpen(false)
    setShowModal(false)
    reset()
  }

  const [updateOffers, result] = useCreateOrUpdateProductOfferMutation()

  const handleSave = (d: ProductOfferType) => {
    if (edit?.id) {
      updateOffers({
        ...edit,
        ...d,
        offer_type: d?.offer_type?.value,
        offered_product_id: d?.offered_product_id?.value,
        status: edit?.isActiveReq ? 1 : d?.status
      })
    }
  }

  useEffect(() => {
    if (result.isSuccess) {
      closeModal()
      response(result.isSuccess)
      reset()
    }
  }, [result.isSuccess])

  log(edit)

  //   useEffect(() => {
  //     clearErrors()
  //     resetField('purchase_quantity')
  //     resetField('offered_product_discount')
  //     resetField('offer_valid_from')
  //     resetField('offer_valid_to')
  //     resetField('offer_value')
  //     setValue('offer_value', 0)
  //     resetField('offered_product_discount')
  //   }, [watch('offer_type')])

  useEffect(() => {
    if (isValid(edit)) {
      const f = fillObject<ProductOfferType>(state?.formData, edit)
      let offer_valid_from = null
      let offer_valid_to = null
      if (
        new Date(formatDate(f?.offer_valid_to, 'YYYY-MM-DD 00:00:00')) >=
        new Date(formatDate(new Date(), 'YYYY-MM-DD 00:00:00'))
      ) {
        offer_valid_to = f?.offer_valid_to
      }
      if (
        new Date(formatDate(f?.offer_valid_from, 'YYYY-MM-DD 00:00:00')) >=
        new Date(formatDate(new Date(), 'YYYY-MM-DD 00:00:00'))
      ) {
        offer_valid_from = f?.offer_valid_from
      }
      const formData: ProductOfferType = {
        ...f,
        offer_type: {
          label: FM(getKeyByValue(ProductOfferTypes, Number(edit?.offer_type))),
          value: Number(edit?.offer_type)
        },
        offer_valid_from,
        offer_valid_to
      }

      setValues<ProductOfferType>(formData, setValue)
    }
  }, [edit])

  useEffect(() => {
    if (noView && showModal) {
      openModal()
    }
  }, [noView, showModal])

  const renderOfferText = () => {
    switch (watch('offer_type')?.value) {
      case ProductOfferTypes.amount:
        return (
          <Fragment>
            <Alert color='danger' className='mt-1'>
              <div className='alert-body'>
                {FM('offer-type-amount-description', {
                  discount: CF({ money: watch('offer_value') ?? 0, currency: user?.currency })
                })}
              </div>
            </Alert>
            <Alert color='danger' className='mt-1'>
              <div className='alert-body'>
                {FM('this-offer-activate-only-if-no-existing-offers-available')}
              </div>
            </Alert>
            <Alert color='danger' className='mt-1'>
              <div className='alert-body'>{FM('offer-applied-every-00.001')}</div>
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
            <Alert color='danger' className='mt-1'>
              <div className='alert-body'>
                {FM('this-offer-activate-only-if-no-existing-offers-available')}
              </div>
            </Alert>
            <Alert color='danger' className='mt-1'>
              <div className='alert-body'>{FM('offer-applied-every-00.001')}</div>
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
                    CF({ money: watch('offered_product_discount'), currency: user?.currency }) ?? 0,
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

  return (
    <>
      {!noView ? (
        <Component role='button' onClick={openModal} {...rest}>
          {children}
        </Component>
      ) : null}
      <CenteredModal
        scrollControl={false}
        modalClass={edit?.isActiveReq === true ? 'modal-sm' : 'modal-lg'}
        loading={result.isLoading}
        open={open}
        disableSave={result?.isLoading}
        handleModal={closeModal}
        handleSave={handleSubmit(handleSave)}
        title={FM('offer')}
      >
        <form>
          <CardBody className=''>
            <Row className='g-0 mb-50'>
              <Col md={edit?.isActiveReq === true ? '7' : '8'}>
                <Row className='g-1'>
                  <Hide IF={edit?.isActiveReq === true}>
                    <Col md='6'>
                      <FormGroupCustom
                        label={FM('discount-type')}
                        placeholder={FM('discount-type')}
                        //   noLabel
                        name={`offer_type`}
                        type={'select'}
                        isDisabled
                        selectOptions={
                          edit?.isProductOffer === true
                            ? createConstSelectOptions(ProductOfferTypes, FM)
                            : createConstSelectOptions(CategoryOfferTypes, FM)
                        }
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
                        watch(`offer_type`)?.value === ProductOfferTypes?.same_quantity_on_percent
                      }
                    >
                      <Fragment>
                        <Col md='6'>
                          <FormGroupCustom
                            placeholder={FM('purchase-quantity')}
                            label={FM('purchase-quantity')}
                            //   noLabel
                            name={`purchase_quantity`}
                            type={'text'}
                            className='mb-0'
                            control={control}
                            rules={{ required: true }}
                            prepend={<InputGroupText>{FM('buy')}</InputGroupText>}
                          />
                        </Col>
                      </Fragment>
                    </Show>
                    <Show
                      IF={
                        watch(`offer_type`)?.value === ProductOfferTypes?.diff_quantity_on_quantity
                      }
                    >
                      <Fragment>
                        <Col md='6'>
                          <FormGroupCustom
                            label={FM('product')}
                            placeholder={FM('product')}
                            //   noLabel
                            async
                            path={ApiEndpoints.load_product}
                            selectLabel='name'
                            selectValue={'id'}
                            defaultOptions
                            loadOptions={loadDropdown}
                            name={`offered_product_id`}
                            type={'select'}
                            className='mb-0'
                            control={control}
                            rules={{ required: true }}
                          />
                        </Col>
                      </Fragment>
                    </Show>
                    <Hide
                      IF={
                        watch(`offer_type`)?.value === ProductOfferTypes?.diff_quantity_on_quantity
                      }
                    >
                      <Col md='6'>
                        <FormGroupCustom
                          placeholder={FM('discount-value')}
                          label={FM('discount-value')}
                          // noLabel
                          name={`offer_value`}
                          type={'number'}
                          className='mb-0'
                          control={control}
                          rules={{
                            required: false,
                            min: 0,
                            max:
                              watch(`offer_type`)?.value === ProductOfferTypes?.percent
                                ? 100
                                : variantData?.max_retail_price,
                            maxLength:
                              watch(`offer_type`)?.value === ProductOfferTypes?.percent
                                ? 5
                                : `${variantData?.max_retail_price}`.length
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
                        watch(`offer_type`)?.value === ProductOfferTypes?.diff_quantity_on_quantity
                      }
                    >
                      <Col md='6'>
                        <FormGroupCustom
                          placeholder={FM('price-of-the-product')}
                          label={FM('price-of-the-product')}
                          name={`offered_product_discount`}
                          type={'number'}
                          className='mb-0'
                          control={control}
                          rules={{ required: false }}
                        />
                      </Col>
                    </Show>
                    <Col md='6'>
                      <FormGroupCustom
                        placeholder={FM('offer-valid-from')}
                        label={FM('offer-valid-from')}
                        //   noLabel
                        name={`offer_valid_from`}
                        type={'date'}
                        // datePickerOptions={{ minDate: formatDate(new Date(addDay(new Date()))) }}
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
                      <Show
                        IF={
                          (watch('offer_type')?.value === ProductOfferTypes.amount ||
                            watch('offer_type')?.value === ProductOfferTypes.percent) &&
                          formatDate(new Date()) === formatDate(edit?.offer_valid_from)
                        }
                      >
                        <Badge color='light-danger' className='light-danger mt-25'>
                          <small className='text-small'>
                            {FM('offer-applicable-after-date', {
                              date: formatDate(new Date())
                            })}
                          </small>
                        </Badge>
                      </Show>
                    </Col>
                    <Col md='6'>
                      <FormGroupCustom
                        placeholder={FM('offer-valid-till')}
                        label={FM('offer-valid-till')}
                        //   noLabel
                        name={`offer_valid_to`}
                        type={'date'}
                        // datePickerOptions={{
                        //   minDate: formatDate(watch(`offer_valid_from`))
                        // }}
                        datePickerOptions={{
                          minDate: watch(`offer_valid_from`)
                            ? formatDate(watch(`offer_valid_from`))
                            : new Date()
                        }}
                        className='mb-0'
                        control={control}
                        rules={{ required: true }}
                      />
                    </Col>
                  </Hide>
                  <Show IF={edit?.isActiveReq === true}>
                    <Col md='12'>
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
                      <Show
                        IF={
                          (watch('offer_type')?.value === ProductOfferTypes.amount ||
                            watch('offer_type')?.value === ProductOfferTypes.percent) &&
                          formatDate(new Date()) === formatDate(edit?.offer_valid_from)
                        }
                      >
                        <Badge color='light-danger' className='text-danger mt-25'>
                          <small className='text-small'>
                            {FM('offer-applicable-after-date', {
                              date: formatDate(new Date())
                            })}
                          </small>
                        </Badge>
                      </Show>
                    </Col>

                    <Col md='12'>
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
                        rules={{ required: true }}
                      />
                    </Col>
                  </Show>
                </Row>
              </Col>

              <Col
                md={edit?.isActiveReq === true ? '4' : '3'}
                className='d-flex align-item-center justify-content-end ms-1 '
              >
                <Row>
                  <Col md='12' className='mt-2'>
                    {/* <Label>{FM('offer-image')}</Label> */}
                    <SimpleImageUpload
                      params={{ for: 'offer' }}
                      className='me-0'
                      value={watch('offer_image')}
                      name={`offer_image`}
                      setValue={setValue}
                    />
                  </Col>
                </Row>
              </Col>
            </Row>

            {renderOfferText()}

            {/* <ButtonGroup className='mt-1'>
              <LoadingButton type='submit' color='primary' loading={result?.isLoading}>
                {FM('save')}
              </LoadingButton>
            </ButtonGroup> */}
          </CardBody>
        </form>
      </CenteredModal>
    </>
  )
}
