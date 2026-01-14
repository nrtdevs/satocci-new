import { QueryStatus } from '@reduxjs/toolkit/dist/query'
import { Fragment, useContext, useEffect, useReducer } from 'react'
import { TableColumn } from 'react-data-table-component'
import { CheckCircle, Edit, MoreVertical, Trash2, X } from 'react-feather'
import { useForm } from 'react-hook-form'
import {
  Alert,
  Badge,
  ButtonGroup,
  CardBody,
  Col,
  Form,
  InputGroupText,
  Label,
  Row
} from 'reactstrap'
import {
  useActionProductOfferMutation,
  useCreateOrUpdateProductOfferMutation,
  useLoadProductOffersMutation
} from '../../../../redux/RTKQuery/ProductRTK'
import { loadDropdown } from '../../../../utility/apis/dropdowns'
import {
  IconSizes,
  ProductOfferTypes,
  ProductOfferTypesDrops,
  UserType
} from '../../../../utility/Const'
import { ThemeColors } from '../../../../utility/context/ThemeColors'
import { FM, isValid, log } from '../../../../utility/helpers/common'
import ConfirmAlert from '../../../../utility/helpers/ConfirmAlert'
import Hide from '../../../../utility/Hide'
import useUser from '../../../../utility/hooks/useUser'
import useUserType from '../../../../utility/hooks/useUserType'
import ApiEndpoints from '../../../../utility/http/ApiEndpoints'
import Show from '../../../../utility/Show'
import { stateReducer } from '../../../../utility/stateReducer'
// import { createConstSelectOptions, formatDate } from '../../../../utility/Utils'
import {
  addDay,
  CF,
  createConstSelectOptions,
  emitAlertStatus,
  formatDate,
  truncateText
} from '../../../../utility/Utils'
import LoadingButton from '../../../components/buttons/LoadingButton'
import CustomDataTable, {
  TableDropDownOptions
} from '../../../components/CustomDataTable/CustomDataTable'
import DropDownMenu from '../../../components/dropdown'
import FormGroupCustom from '../../../components/formGroupCustom/FormGroupCustom'
import SimpleImageUpload from '../../../components/SimpleImageUpload'
import OffersActiveModal from '../../../stores/category/fragment/tabs/OffersActiveModal'
import { ProductOfferType, ProductParamType, ProductVariantsType } from '../ProductForm'

type theProps = {
  addOffer?: boolean
  details?: ProductVariantsType
  closeForm: () => void
  loading?: boolean
}
interface States {
  offersActive?: boolean
  offerData?: any
  page?: any
  per_page_record?: any
  changeObject?: any
  lastRefresh?: any
  search?: any
  reload?: any
  isRemoving?: boolean
  isReloading?: boolean
  isAddingNewData?: boolean
  transactionFilter?: boolean
  filterData?: ProductParamType | any
}
const ProductOffer = (props: theProps) => {
  const details = props?.details
  const { colors } = useContext(ThemeColors)

  // Local States
  const initState: States = {
    lastRefresh: new Date().getTime(),
    offersActive: false,

    offerData: null,
    page: 1,
    per_page_record: 15,
    changeObject: null,
    transactionFilter: false,
    filterData: {
      name: null,
      email: null,
      subscription_terms_select_value: null,
      status: null
    },
    search: undefined,
    isRemoving: false,
    isReloading: false,
    isAddingNewData: false
  }
  // const user = useUser()
  const reducers = stateReducer<States>
  const user = useUser()
  const userType = useUserType()
  const [state, setState] = useReducer(reducers, initState)
  const [createOffer, result] = useCreateOrUpdateProductOfferMutation()
  const [offerAction, offerResult] = useActionProductOfferMutation()
  const [loadOffers, { data, isError, isLoading, isSuccess }] = useLoadProductOffersMutation()
  const form = useForm<ProductOfferType>()
  const { handleSubmit, control, reset, setValue, watch, clearErrors, resetField } = form
  const currency = details?.product?.store?.currency
  const loadOffer = () => {
    loadOffers({
      jsonData: { product_variant_id: details?.id },
      page: state?.page,
      per_page_record: state?.per_page_record
    })
  }

  const actionOffers = (action: string, ids: any, eventId?: any) => {
    offerAction({
      eventId,
      jsonData: { action, ids }
    })
  }

  useEffect(() => {
    if (details?.id) {
      loadOffer()
    }
  }, [details?.id, state?.page, state?.per_page_record, state.lastRefresh])

  useEffect(() => {
    setState({
      page: 1
    })
  }, [state.per_page_record])

  useEffect(() => {
    if ((offerResult.status = QueryStatus.fulfilled) && offerResult?.isLoading === false) {
      if (offerResult?.isSuccess) {
        emitAlertStatus('success', null, `${offerResult?.originalArgs?.eventId}`)
      } else if (offerResult?.error) {
        emitAlertStatus('failed', null, `${offerResult?.originalArgs?.eventId}`)
      }
    }
  }, [offerResult])

  const handlePageChange = (e: any) => {
    setState({ ...e })
  }

  const options: TableDropDownOptions = (selectedRows) => [
    {
      noWrap: true,
      name: (
        <ConfirmAlert
          menuIcon={<Trash2 size={14} />}
          onDropdown
          eventId={`expire-item-selected`}
          title={FM('expire-selected-count', { count: selectedRows?.selectedCount })}
          color='text-warning'
          text={FM('are-you-sure')}
          onClickYes={() => actionOffers('expire', selectedRows?.ids, `expire-item-selected`)}
          onSuccessEvent={(e: any) => {
            setState({ page: 1, lastRefresh: new Date()?.getTime() })
          }}
          className=''
          id={`grid-delete`}
        >
          {FM('expire')}
        </ConfirmAlert>
      )
    }
  ]

  const renderOffers = (type: any = null, value: any) => {
    if (type !== null) {
      switch (type) {
        case ProductOfferTypes.percent:
          return (
            <>
              {FM('x-percent-discount', {
                percent: value?.offer_value,
                price: `${details?.selling_price}kr`,
                currency
              })}
            </>
          )
        case ProductOfferTypes.amount:
          return (
            <>
              {FM('x-flat-discount', {
                flat: value?.offer_value,
                price: `${details?.selling_price}${currency}`,
                currency
              })}
            </>
          )
        case ProductOfferTypes.same_quantity_on_percent:
          return (
            <>
              {FM('buy-x-get-x-discount', {
                buy: value?.purchase_quantity,
                get: value?.offer_value
              })}
            </>
          )
        case ProductOfferTypes.same_quantity_on_quantity:
          return (
            <>
              {FM('buy-x-get-x-free', {
                buy: value?.purchase_quantity,
                get: value?.offer_value
              })}{' '}
            </>
          )
        case ProductOfferTypes.diff_quantity_on_quantity:
          if (value?.offered_product_discount <= 0) {
            return (
              <>
                {FM('buy-x-get-x-item-free', {
                  buy: value?.purchase_quantity,
                  get: value?.offered_product_variant?.name
                })}{' '}
              </>
            )
          } else {
            return (
              <>
                {FM('buy-x-get-x-item', {
                  buy: value?.purchase_quantity,
                  get: value?.offered_product_variant?.name,
                  price: value?.offered_product_discount
                })}{' '}
              </>
            )
          }
        default:
          return <>{''}</>
      }
    }
  }
  const columns: TableColumn<ProductOfferType>[] = [
    {
      name: '#',
      maxWidth: '70px',
      minWidth: '30px',
      cell: (row, index: any) => {
        // eslint-disable-next-line no-mixed-operators
        return parseInt(state?.per_page_record) * (state?.page - 1) + (index + 1)
      }
    },
    {
      name: <>{FM('offer')}</>,
      minWidth: '300px',
      //sortable: row => row.full_name,
      cell: (row) => (
        <div className='d-flex align-items-center'>
          <div className='user-info'>
            {/* <Link
              state={{ row }}
              to={getPath('admin.stores.details', { id: row?.id })}
              className='d-block'
              id='create-button'
            > */}
            <span className='d-block fw-bold'>{renderOffers(Number(row?.offer_type), row)}</span>
            {/* </Link> */}
          </div>
        </div>
      )
    },
    {
      name: <>{FM('offer-valid-from')}</>,
      minWidth: '120px',
      //sortable: row => row.full_name,
      cell: (row) => <span className=''>{formatDate(row?.offer_valid_from)}</span>
    },
    {
      name: <>{FM('offer-valid-till')}</>,
      minWidth: '120px',

      cell: (row) => <span className=''>{formatDate(row?.offer_valid_to)}</span>
    },
    {
      name: <>{FM('Status')}</>,
      //   minWidth: '150px',
      maxWidth: '100px',
      //   sortable: (row) => row.status,
      cell: (row) => {
        return (
          <>
            {row?.status === 1 ? (
              <Badge color={'light-success'} pill>
                <>{FM('active')}</>
              </Badge>
            ) : (
              <Badge color={'light-danger'} pill>
                <>{FM('expired')}</>
              </Badge>
            )}
          </>
        )
      }
    },
    {
      name: <>{FM('action')}</>,
      allowOverflow: true,
      maxWidth: '10px',
      cell: (row: any) => {
        return (
          <div className='d-flex '>
            <DropDownMenu
              direction='down'
              component={<MoreVertical color={colors.primary.main} size={IconSizes.MenuVertical} />}
              options={[
                {
                  IF:
                    row?.store_id === user?.store_id ||
                    userType === UserType.Admin ||
                    user?.store_id === UserType.Admin,
                  icon: <Edit size={14} />,
                  onClick: () => {
                    setState({
                      offersActive: true,
                      offerData: { ...row, isProductOffer: true }
                    })
                  },
                  name: FM('edit')
                },
                {
                  IF: row?.status === 0 || row?.status === 4,
                  icon: <CheckCircle size={14} />,
                  onClick: () => {
                    setState({
                      offersActive: true,
                      offerData: { ...row, isActiveReq: true }
                    })
                  },
                  name: FM('activate')
                },
                // {
                //   IF: row?.status === 1,
                //   icon: <StopCircle size={14} />,

                //   onClick: () =>
                //     setState({
                //       changeObject: { ...row, status: '4' }
                //     }),
                //   name: FM('expire')
                // },
                {
                  IF: row?.status === 1,
                  noWrap: true,
                  name: (
                    <ConfirmAlert
                      menuIcon={<X size={14} />}
                      onDropdown
                      eventId={`item-expire-${row?.id}`}
                      text={FM('are-you-sure')}
                      color='text-warning'
                      onClickYes={
                        () => actionOffers('expire', [row?.id], `item-expire-${row?.id}`)
                        // handleActions(null, [row?.id], 'inactive', `item-inactive-${row?.id}`)
                      }
                      onSuccessEvent={(e: any) => {
                        // reloadData()
                        setState({
                          lastRefresh: new Date().getTime()
                        })
                      }}
                      className=''
                      id={`item-expire-${row?.id}`}
                    >
                      {FM('expire')}
                    </ConfirmAlert>
                  )
                }
                // {
                //   noWrap: true,
                //   name: (
                //     <ConfirmAlert
                //       menuIcon={<Trash2 size={14} />}
                //       onDropdown
                //       eventId={`delete-item-${row?.id}`}
                //       item={row}
                //       title={row?.name}
                //       color='text-warning'
                //       text={FM('are-you-sure')}
                //       onClickYes={() => handleDelete(row?.id, null)}
                //       onSuccessEvent={(e: any) => {
                //         loadProducts()
                //       }}
                //       className=''
                //       id={`grid-delete-${row?.id}`}
                //     >
                //       {FM('move-to-trash')}
                //     </ConfirmAlert>
                //   )
                // }
              ]}
            />
          </div>
        )
      }
    }
  ]

  const onSubmit = (d: ProductOfferType) => {
    log('offers', d)
    if (details?.id) {
      createOffer({
        // ...details,
        action: false,
        store_id: details?.store_id,
        product_variant_id: details?.id,
        offer_type: d?.offer_type?.value,
        offer_value: d?.offer_value,
        offered_product_discount: d?.offered_product_discount,
        offer_valid_from: d?.offer_valid_from,
        offer_valid_to: d?.offer_valid_to,
        offered_product_variant_id: d?.offered_product_variant_id?.value,
        purchase_quantity: d?.purchase_quantity ?? 1,
        status: d?.status ?? 1
      })
    }
  }

  useEffect(() => {
    if (state?.changeObject) {
      createOffer({
        ...state?.changeObject,
        status: state?.changeObject?.status,
        action: true
      })
    }
  }, [state?.changeObject])

  useEffect(() => {
    if (result.isSuccess) {
      if (result?.originalArgs?.action === false) {
        props?.closeForm()
      }

      reset()
      setState({ page: 1, lastRefresh: new Date().getTime() })
    }
  }, [result])

  // useEffect(() => {
  //   if (result.isError) {
  //     reset()
  //     setState({ page: 1, lastRefresh: new Date().getTime() })
  //   }
  // }, [result])

  const renderOfferText = () => {
    switch (watch('offer_type')?.value) {
      case ProductOfferTypes.amount:
        return (
          <Fragment>
            <Alert color='danger' className='mt-1'>
              <div className='alert-body'>
                {FM('offer-type-amount-description', {
                  discount: CF({ money: watch('offer_value') ?? 0, currency })
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
                  price: CF({ money: watch('offered_product_discount'), currency }) ?? 0,
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
    setValue('offered_product_variant_id', null)
    setValue('offered_product_discount', null)
  }, [watch('product_id')])

  useEffect(() => {
    if (details?.id) {
      setValue('product_id', {
        value: details?.product?.id,
        label: details?.product?.name
      })
      setTimeout(() => {
        setValue('offered_product_variant_id', {
          value: details?.id,
          label: details?.name
        })
      }, 1000)
    }
  }, [details])

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
    if (props?.addOffer === false) {
      reset()
    }
  }, [props?.addOffer])

  useEffect(() => {
    if (isValid(watch('offer_valid_from')) && isValid(watch('offer_valid_to'))) {
      if (new Date(watch('offer_valid_from')) > new Date(watch('offer_valid_to'))) {
        setValue('offer_valid_to', null)
      }
    }
  }, [watch('offer_valid_from'), watch('offer_valid_to')])

  return (
    <Fragment>
      <OffersActiveModal
        edit={state?.offerData}
        variantData={details}
        showModal={state.offersActive}
        setShowModal={(e: boolean) =>
          setState({ offersActive: e, lastRefresh: new Date().getTime() })
        }
        noView
      />
      <Show IF={props?.addOffer ?? false}>
        <>
          <div className='shadow rounded m-1'>
            <Form onSubmit={handleSubmit(onSubmit)}>
              <CardBody>
                <Row className='g-0 mb-50'>
                  <Col md='2' className=''>
                    <Label>{FM('offer-image')}</Label>
                    <SimpleImageUpload
                      params={{ for: 'offer' }}
                      value={watch('offer_image')}
                      name={`offer_image`}
                      setValue={setValue}
                    />
                  </Col>

                  <Col md='10' className='d-flex align-item-center justify-content-end'>
                    <Row className='g-1'>
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
                          watch(`offer_type`)?.value === ProductOfferTypes?.same_quantity_on_percent
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
                              label={FM('product')}
                              placeholder={FM('product')}
                              //   noLabel
                              async
                              path={ApiEndpoints.load_product}
                              selectLabel='name'
                              selectValue={'id'}
                              defaultOptions
                              loadOptions={loadDropdown}
                              jsonData={{
                                product_type: '1'
                              }}
                              name={`product_id`}
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
                              key={watch('product_id')?.value ?? details?.id}
                              label={FM('product-variant')}
                              placeholder={FM('product-variant')}
                              //   noLabel
                              async
                              path={`${ApiEndpoints.load_product_variant}${
                                watch('product_id')?.value ?? details?.product_id
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
                                  : details?.max_retail_price,
                              maxLength:
                                watch(`offer_type`)?.value === ProductOfferTypes?.percent
                                  ? 5
                                  : `${details?.max_retail_price}`.length
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
                    {/* <Row>
                      <Col md='4'>
                        <SimpleImageUpload
                          value={watch('offers_image')}
                          name={`offers_image`}
                          setValue={setValue}
                        />
                      </Col>
                    </Row> */}
                  </Col>
                  {/* <Col md='1' className='d-flex align-item-center justify-content-end'>
                    <Button
                      disabled={index === 0}
                      size='sm'
                      outline
                      className='btn-icon me-25'
                      color='danger'
                      onClick={() => {
                        remove(index)
                      }}
                    >
                      <Trash2 size={14} />
                    </Button>
                    <Hide IF={index + 1 !== fields?.length}>
                      <Button
                        size='sm'
                        outline
                        className='btn-icon'
                        color='primary'
                        onClick={() => {
                          append({
                            offer_type: null,
                            offer_value: null,
                            offered_product_id: null,
                            purchase_quantity: null,
                            status: 1
                          })
                        }}
                      >
                        <Plus size={14} />
                      </Button>
                    </Hide>
                  </Col> */}
                </Row>
                {renderOfferText()}
                <ButtonGroup className='mt-1'>
                  <LoadingButton type='submit' color='primary' loading={result?.isLoading}>
                    {FM('save')}
                  </LoadingButton>
                </ButtonGroup>
              </CardBody>
            </Form>
          </div>
        </>
      </Show>
      <CustomDataTable<ProductOfferType>
        key={state.lastRefresh}
        initialPerPage={15}
        isLoading={isLoading ?? props?.loading}
        selectableRowDisabled={(row) => {
          if (row?.status === 0 || row?.status === 4) {
            return true
          } else {
            return false
          }
        }}
        options={options}
        selectableRows
        hideSearch
        columns={columns}
        paginatedData={data}
        // tableData={details?.product_offers}
        handlePaginationAndSearch={handlePageChange}
      />
    </Fragment>
  )
}

export default ProductOffer
