import { Fragment, useEffect, useReducer, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useParams } from 'react-router-dom'
import { Alert, CardBody, Col, InputGroupText, Row } from 'reactstrap'
import { useCreateOrUpdateCategoryOfferMutation } from '../../../redux/RTKQuery/CategoryRTK'
import { loadDropdown } from '../../../utility/apis/dropdowns'
import { CategoryOfferTypes, ProductOfferTypes } from '../../../utility/Const'
import { FM, isValid } from '../../../utility/helpers/common'
import Hide from '../../../utility/Hide'
import useUser from '../../../utility/hooks/useUser'
import ApiEndpoints from '../../../utility/http/ApiEndpoints'
import Show from '../../../utility/Show'
import { stateReducer } from '../../../utility/stateReducer'
import { CF, createConstSelectOptions, formatDate, truncateText } from '../../../utility/Utils'
import FormGroupCustom from '../../components/formGroupCustom/FormGroupCustom'
import CenteredModal from '../../components/modal/CenteredModal'
import { ProductOfferType } from '../../ProductManagement/fragment/ProductForm'

interface States {
  loading?: boolean
}
interface dataType {
  ids?: any
  noView?: boolean
  showModal?: boolean
  setShowModal?: (e: boolean) => void
  Component?: any
  children?: any
  response?: (e: boolean) => void
}

export default function CategoryOffer<T>(props: T & dataType) {
  const {
    ids = null,
    noView = false,
    showModal = false,
    setShowModal = () => {},
    Component = 'span',
    children = null,
    response = () => {},
    ...rest
  } = props
  const params = useParams()
  const user = useUser()
  const form = useForm<ProductOfferType>()
  const initState: States = {}
  const reducers = stateReducer<States>
  const [state, setState] = useReducer(reducers, initState)
  const [open, setOpen] = useState(false)

  const {
    formState: { errors },
    handleSubmit,
    control,
    reset,
    setValue,
    watch
  } = form

  const openModal = () => {
    setOpen(true)
  }
  const closeModal = (from = null) => {
    setOpen(false)
    setShowModal(false)
    reset()
  }

  const [createOffer, result] = useCreateOrUpdateCategoryOfferMutation()

  const handleSave = (d: ProductOfferType) => {
    createOffer({
      ...d,
      store_id: user?.store_id,
      offer_type: d?.offer_type?.value,
      purchase_quantity: d?.purchase_quantity ?? 1,
      category_id: ids,
      status: 1
    })
  }
  useEffect(() => {
    if (isValid(watch('offer_valid_from')) && isValid(watch('offer_valid_to'))) {
      if (new Date(watch('offer_valid_from')) > new Date(watch('offer_valid_to'))) {
        setValue('offer_valid_to', '')
      }
    }
  }, [watch('offer_valid_from'), watch('offer_valid_to')])

  useEffect(() => {
    if (result.isSuccess) {
      closeModal()
      response(result.isSuccess)
      reset()
    }
  }, [result?.isSuccess])

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
                  price: CF({ money: Number(watch('offer_value')), currency: user?.currency }) ?? 0
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
        modalClass='modal-md'
        loading={result.isLoading}
        open={open}
        handleModal={closeModal}
        handleSave={handleSubmit(handleSave)}
        title={FM('add-offer')}
      >
        {/* <Form> */}
        <CardBody className=''>
          <Row className='g-1'>
            <Col md='12'>
              <FormGroupCustom
                label={FM('discount-type')}
                placeholder={FM('discount-type')}
                //   noLabel
                name={`offer_type`}
                type={'select'}
                selectOptions={createConstSelectOptions(CategoryOfferTypes, FM)}
                className='mb-0'
                control={control}
                rules={{ required: true }}
              />
            </Col>
            <Show
              IF={
                watch(`offer_type`)?.value === ProductOfferTypes?.same_quantity_on_quantity ||
                watch(`offer_type`)?.value === ProductOfferTypes?.diff_quantity_on_quantity ||
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
                    type={'number'}
                    className='mb-0'
                    control={control}
                    rules={{ required: true }}
                    prepend={<InputGroupText>{FM('buy')}</InputGroupText>}
                  />
                </Col>
              </Fragment>
            </Show>
            <Show IF={watch(`offer_type`)?.value === ProductOfferTypes?.diff_quantity_on_quantity}>
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
                    //   prepend={<InputGroupText>{FM('get')}</InputGroupText>}
                    //   append={<InputGroupText>{FM('item')}</InputGroupText>}
                  />
                </Col>
              </Fragment>
            </Show>
            <Hide IF={watch(`offer_type`)?.value === ProductOfferTypes?.diff_quantity_on_quantity}>
              <Col
                md={
                  watch(`offer_type`)?.value === ProductOfferTypes?.amount ||
                  watch(`offer_type`)?.value === ProductOfferTypes?.percent
                    ? '12'
                    : '6'
                }
              >
                <FormGroupCustom
                  placeholder={FM('discount-value')}
                  label={FM('discount-value')}
                  // noLabel
                  name={`offer_value`}
                  type={'number'}
                  className='mb-0'
                  control={control}
                  rules={{ required: true }}
                  prepend={
                    watch(`offer_type`)?.value === ProductOfferTypes?.same_quantity_on_quantity ||
                    watch(`offer_type`)?.value === ProductOfferTypes?.same_quantity_on_percent ? (
                      <InputGroupText>{FM('get')}</InputGroupText>
                    ) : null
                  }
                  append={
                    watch(`offer_type`)?.value === ProductOfferTypes?.percent ||
                    watch(`offer_type`)?.value === ProductOfferTypes?.same_quantity_on_percent ? (
                      <InputGroupText>% {FM('off')}</InputGroupText>
                    ) : null
                  }
                />
              </Col>
            </Hide>
            {/* <Show
                IF={watch(`offer_type`)?.value === ProductOfferTypes?.same_quantity_on_quantity}
              >
                <Col md='12'>
                  <FormGroupCustom
                    message={FM('insert-zero-for-free')}
                    placeholder={FM('discount-on-price')}
                    label={FM('discount-on-price')}
                    name={`purchase_quantity_discount`}
                    type={'number'}
                    className='mb-0'
                    control={control}
                    rules={{ required: true }}
                  />
                </Col>
              </Show> */}
            <Show IF={watch(`offer_type`)?.value === ProductOfferTypes?.diff_quantity_on_quantity}>
              <Col md='12'>
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
          </Row>
          <Row className='mt-2'>
            <Col md='6'>
              <FormGroupCustom
                placeholder={FM('offer-valid-from')}
                label={FM('offer-valid-from')}
                //   noLabel
                name={`offer_valid_from`}
                type={'date'}
                datePickerOptions={{ minDate: formatDate(new Date()) }}
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
                  minDate: formatDate(watch(`offer_valid_from`))
                }}
                className='mb-0'
                control={control}
                rules={{
                  required: true
                }}
              />
            </Col>
          </Row>
          {renderOfferText()}
        </CardBody>
        {/* </Form> */}
      </CenteredModal>
    </>
  )
}
