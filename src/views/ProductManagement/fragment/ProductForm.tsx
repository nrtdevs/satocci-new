/* eslint-disable prettier/prettier */
import '@styles/react/apps/app-users.scss'
import { Fragment, useEffect, useReducer, useState } from 'react'
import { Cpu, HelpCircle, Plus, Trash2, X } from 'react-feather'
import { useFieldArray, useForm } from 'react-hook-form'
import { useNavigate, useParams } from 'react-router-dom'
import { categoriesData } from './Tabs/categoryData'
import StickyBox from 'react-sticky-box'
import {
  Button,
  ButtonProps,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  CardTitle,
  Col,
  Container,
  Form,
  Input,
  InputGroupText,
  InputGroupTextProps,
  Label,
  Row
} from 'reactstrap'

import {
  useCreateOrUpdateProductMutation,
  useGetUnitsMutation,
  useLoadProductDetailsByIdMutation,
  useLoadProductVariantDetailsByIdMutation
} from '../../../redux/RTKQuery/ProductRTK'
import {
  ProductOffers,
  ProductOfferTypes,
  restrictions,
  units,
  vatType
} from '../../../utility/Const'
import { FM, isValid, isValidArray, log } from '../../../utility/helpers/common'
import Hide from '../../../utility/Hide'

import Show from '../../../utility/Show'
import { stateReducer } from '../../../utility/stateReducer'
import {
  addDay,
  createConstSelectOptions,
  fastLoop,
  fillObject,
  formatDate,
  getKeyByValue,
  getUserData,
  isValidBarcode,
  JsonParseValidate,
  loadLanguageId,
  setValues
} from '../../../utility/Utils'
import LoadingButton from '../../components/buttons/LoadingButton'
import FormGroupCustom from '../../components/formGroupCustom/FormGroupCustom'
import Header from '../../components/header'
import Shimmer from '../../components/shimmers/Shimmer'
import SimpleImageUpload from '../../components/SimpleImageUpload'
import BsTooltip from '../../components/tooltip'
import { CategoryParamsType } from '../../stores/category/CategoryAddForm'
import ApiEndpoints from '../../../utility/http/ApiEndpoints'
import { getLoadDropdown, loadDropdown } from '../../../utility/apis/dropdowns'

/**
* offer_types
1) amount (price_after_discount)
2) percent (price_after_discount)
3) same_quantity_on_quantity (buy_quantity, free_quantity)
4) same_quantity_on_percent (buy_quantity, free_percent) 
5) diff_quantity_on_quantity (buy_quantity, free_item_name)
*/
//dsfgjiyhuif8re
export type ProductOfferType = {
  id?: any
  store_id?: any
  store_setting?: any
  variant_id?: any
  product_name?: any
  product_variant_id?: any
  offered_product_id?: any
  category_id?: any
  offers_image?: any
  purchase_quantity?: number | null
  //   purchase_quantity_discount?: any
  offer_type?: any
  offer_value?: number | null
  offered_product_variant_id?: any | null
  offered_product_discount?: any | null
  status?: any
  product_id?: any
  offer_valid_from?: any
  offer_valid_to?: any
  offer_image?: any
  action?: any
  product_variant?: any
}
export type ProductBarCodeType = {
  bar_code_image?: string
  id?: any
  store_id?: any
  product_variant_id?: any
  bar_code?: any
  created_at?: any
  updated_at?: any
  value?: any
}
export type ProductVariantsType = {
  product_offer_count?: any
  active_offers_count?: any
  offered_product_variant_id?: any
  product_variant_id?: any
  id?: any
  store?: any
  vat_type?: any
  category?: any
  subcategory?: any
  quantity?: any
  is_unlimited?: any
  store_id?: any
  selling_price?: any
  product_id?: any
  name?: any
  product_image?: any
  sku?: any
  expiry?: any
  adjustment_type?: 'initial_stock' | 'increase_stock' | 'reduce_stock'
  restriction_type?: any
  restriction_value?: any
  purchase_price?: number
  max_retail_price?: number
  offer_type?: any
  offer_value?: any
  product_type?: '1' | '2'
  unit_type?: any
  status?: number
  entry_mode?: any
  created_at?: any
  updated_at?: any
  deleted_at?: any
  barcodes?: ProductBarCodeType[]
  product_bar_codes?: ProductBarCodeType[]
  vat?: number
  product_offers?: any
  // eslint-disable-next-line no-use-before-define
  product?: ProductParamsNew | any
  offer_expiry?: any
  offer_start?: any
  applied_offer?: {
    offer_type?: any
    offer_valid_from?: any
    offer_value?: any
    offer_valid_to?: any
  }
  year?: any
  varient_id?: any
  payment_method?: any
}
export type ProductParamsNew = {
  id?: any
  unique_id?: any
  product_id?: any
  store_id?: any
  category_id?: any
  selected_categories?: any
  selling_price?: any
  variantId?: any
  productId?: any
  categories?: any
  vat_type?: any
  name?: any
  description?: any
  product_image?: any
  created_at?: any
  updated_at?: any
  deleted_at?: any
  store?: any
  offer_type?: any
  offer_value?: any
  unit_type?: any
  product_offers?: ProductVariantsType[]
  barcodes?: ProductBarCodeType[]
  product_type?: any
  product_bar_codes?: ProductBarCodeType[]
  product_variants?: ProductVariantsType[]
  vat?: any
  restriction_type?: any
  quantity?: any
  is_unlimited?: any
  restriction_value?: any
  offer_expiry?: any
  applied_offer?: {
    offer_type?: any
    offer_valid_from?: any
    offer_value?: any
    offer_valid_to?: any
  }
}
export type ProductParamType = {
  product_offer_count?: any
  product_sku?: any
  selected_categories?: any
  // Other Info
  id?: any
  cat_subcat?: Array<any>
  unique_id?: any | null
  name?: string | null
  product_image?: any
  product_attributes?: any | null
  expiry_details?: string | null
  any_restrictions?: any
  barcode_info?: string | null
  description?: string | null
  product_languages?: any | null
  price?: number | null
  discount_type?: any | null // 1: Fixed 2: Percentage
  discount_value?: number | null
  discounted_price?: number | null
  product_variants?: Array<any>
  currency?: any | null
  in_stock?: '0' | '1' | null
  // quantity?: number | null
  in_stock_control?: '0' | '1'
  control_quantity?: number | null
  status?: '1' | '0' | '2' // 1: Active 2: Deleted 0: Inactive
  language_id?: any | null
  category_id?: any | null
  payload?: any
  store_id?: any
  quantity?: any
  created_at?: string | null | number
  updated_at?: string | null | number
  deleted_at?: string | null | number
  barcodes?: Array<any>
  bar_codes?: Array<any>
  product_offers?: Array<ProductOfferType>
  category?: CategoryParamsType
  subcategory?: CategoryParamsType
  restriction_type?: any | string
}
interface States {
  vat?: any
  subCategoryArr?: Array<any>
  categoryParent?: any
  subcatParent?: any
  categoryList?: Array<any>
  unitsData?: Array<any>
  categoryListFlat?: Array<any>
  ip?: boolean
  patient?: boolean
  languageList?: any
  language_id?: any
  loading?: boolean
  text?: string
  list?: any
  active?: string
  page?: any
  per_page_record?: any
  search?: any
  formData?: ProductParamsNew
}

export const CategoryDropdown = ({
  edit = null,
  form = {},
  parentId = null,
  level = 0,
  onSelect = (e) => {},
  hasChild,
  maxLevel = 5
}: {
  edit: any
  form: any
  parentId?: any
  level: any
  onSelect: (e: any) => void
  hasChild: any
  maxLevel: any
}) => {
  const renderLabel = () => {
    if (level === 0) {
      return FM('segment')
    } else if (level === 1) {
      return FM('family')
    } else if (level === 2) {
      return FM('class')
    } else if (level === 3) {
      return FM('brick')
    } else if (level === 4) {
      return FM('attribute')
    } else {
      return FM('attribute-value')
    }
  }

  useEffect(() => {
    if (isValid(edit)) {
      if (edit?.vat) {
        form.setValue(`vat`, edit?.vat)
      } else {
        form.setValue(`vat`, form.watch(`categories.0`)?.extra?.vat_tax)
      }
      // if (form.watch(`categories.0`)?.extra?.vat_tax) {
      //     form.setValue(`vat`, form.watch(`categories.0`)?.extra?.vat_tax)
      // } else {
      //     form.setValue(`vat`, edit?.vat)
      // }
    } else if (form.watch(`categories.${level}`)) {
      const vatTaxValue: any = form.watch(`categories.${level}`)?.extra?.vat_tax

      if (typeof vatTaxValue === 'number') {
        form.setValue(`vat`, form.watch(`categories.${level}`)?.extra?.vat_tax)
      } else if (typeof vatTaxValue === 'object' && vatTaxValue !== null) {
        if (Object.keys(vatTaxValue).length === 0) {
          form.setValue(`vat`, 0)
        }
      }
    }
  }, [form.watch(`categories.${level}`), edit])

  // log('00000 categories', form.watch(`categories`).length)

  //I WANT TO ADD BUTTON TO REMOVE LAST CATEGORY

  return (
    // <div style={{ marginLeft: level * 10 }}>
    <div>
      <FormGroupCustom
        key={`${form.watch(`categories.${level}`)}-fgdhgf-${level}-${parentId}`}
        label={renderLabel()}
        name={`categories.${level}`}
        type={'select'}
        isClearable
        className='mb-2'
        path={
          isValid(parentId) ? ApiEndpoints.load_subcategory + parentId : ApiEndpoints.load_category
        }
        selectLabel='name'
        selectValue={'id'}
        onChangeValue={(e) => {
          //fd
        }}
        searchItem={'name'}
        jsonData={{ parent_id: parentId }}
        formData={{
          parent_id: parentId
        }}
        async
        defaultOptions
        loadOptions={isValid(parentId) ? loadDropdown : getLoadDropdown}
        control={form.control}
        rules={{ required: false }}
      />

      <div>
        {isValid(form.watch(`categories.${level}`)) &&
          form.watch(`categories.${level}`)?.extra?.has_child === 'yes' && (
            <CategoryDropdown
              edit={null}
              form={form}
              maxLevel={maxLevel}
              hasChild={form.watch(`categories.${level}`)?.extra?.has_child}
              parentId={
                form.watch(`categories.${level}`)?.extra?.has_child === 'yes'
                  ? form.watch(`categories.${level}`)?.value
                  : null
              }
              level={level + 1}
              onSelect={onSelect}
            />
          )}
      </div>
    </div>
  )
}

const Barcodes = ({ nestIndex = 0, form }: { nestIndex: number; form: any }) => {
  const {
    fields: barcodeFields,
    append: barcodeAppend,
    remove: barcodeRemove
  } = useFieldArray<ProductParamsNew>({
    control: form?.control,

    name: `product_variants.${nestIndex}.barcodes`
  })

  const { reset, setFocus, setValue } = form
  //create function random barcode generate at least 10 digit number
  const generateRandomData = (aIndex?: any, bIndex?: any) => {
    // eslint-disable-next-line no-mixed-operators
    const randomBarcode = Math.floor(1000000000 + Math.random() * 9000000000)
    setValue(`product_variants.${aIndex}.barcodes.${bIndex}.value`, randomBarcode)
  }
  useEffect(() => {
    if (barcodeFields?.length === 0) {
      barcodeAppend({})
    }
  }, [nestIndex])

  return (
    <Fragment>
      {barcodeFields.map((bcf, bIndex) => (
        <Col md='12' key={bcf?.id}>
          <FormGroupCustom
            placeholder={FM('barcode')}
            noLabel
            name={`product_variants.${nestIndex}.barcodes.${bIndex}.value`}
            type={'text'}
            className='mb-50'
            prepend={<InputGroupText>#{bIndex + 1}</InputGroupText>}
            append={
              <>
                <BsTooltip<InputGroupTextProps>
                  Tag={InputGroupText}
                  title={FM('generate-barcodes')}
                  role={'button'}
                  onClick={() => {
                    generateRandomData(nestIndex, bIndex)
                  }}
                >
                  <Cpu size={16} className='text-primary' />
                </BsTooltip>

                <Show IF={bIndex > 0}>
                  <BsTooltip<InputGroupTextProps>
                    Tag={InputGroupText}
                    role={'button'}
                    className='btn-icon'
                    title={FM('remove')}
                    onClick={() => {
                      barcodeRemove(bIndex)
                    }}
                  >
                    <Trash2 size={16} className='text-danger' />
                  </BsTooltip>
                </Show>
                <Show IF={bIndex === barcodeFields?.length - 1}>
                  <BsTooltip<InputGroupTextProps>
                    Tag={InputGroupText}
                    title={FM('add-more')}
                    role={'button'}
                    className='btn-icon'
                    onClick={() => {
                      barcodeAppend({})
                    }}
                  >
                    <Plus size={16} className='text-primary' />
                  </BsTooltip>
                </Show>
              </>
            }
            control={form?.control}
            rules={{ required: false }}
          />
        </Col>
      ))}
    </Fragment>
  )
}

const ProductForm = (props: {
  edit?: ProductParamsNew
  noView?: boolean
  response?: (e: boolean) => void
}) => {
  const { edit, noView, response = () => {} } = props
  const user = getUserData()
  const lang = loadLanguageId()
  const language = lang?.id
  const navigate = useNavigate()
  const params = useParams()
  const variantId = `${edit?.store_id}` === `${params?.id}` ? '' : params?.id
  const productId = `${edit?.store_id}` === `${variantId}` ? '' : params?.productId
  const storeId = isValid(params.storeId) ? params.storeId : params?.parentId

  // form
  const form = useForm<ProductParamsNew>()
  const { fields, append, remove } = useFieldArray({
    control: form?.control,
    name: 'product_variants'
  })

  const { handleSubmit, control, reset, setFocus, setValue, watch } = form

  // state
  const initState: States = {
    languageList: [],
    categoryList: [],
    categoryListFlat: [],
    subCategoryArr: [],
    unitsData: [],
    subcatParent: [],
    language_id: null,
    ip: false,
    patient: false,
    loading: false,
    active: '0',
    page: 1,
    per_page_record: 100,
    search: undefined,
    text: '',
    list: [],
    formData: {
      vat: undefined,
      id: null,
      unique_id: null,
      store_id: null,
      categories: null,
      name: null,
      description: null,
      product_image: null,
      created_at: null,
      updated_at: null,
      deleted_at: null,
      store: null,
      product_variants: []
    }
  }
  const reducers = stateReducer<States>
  const [state, setState] = useReducer(reducers, initState)

  const [loadVariant, ProductData] = useLoadProductVariantDetailsByIdMutation()
  const [loadProductData, productDetails] = useLoadProductDetailsByIdMutation()
  const [loadUnits, resUnitData] = useGetUnitsMutation()
  let product = ProductData?.data?.payload ?? edit

  if (ProductData?.isSuccess) {
    product = ProductData?.data?.payload
  } else if (`${edit?.store_id}` === `${variantId}`) {
    product = edit
  } else {
    product = edit
  }

  const subStoreId = productDetails?.data?.payload?.store_id
  useEffect(() => {
    if (isValid(productId)) {
      loadProductData({
        id: productId
      })
    }
  }, [productId])
  useEffect(() => {
    if (isValid(variantId)) {
      loadVariant({ id: variantId })
    }
  }, [variantId])

  // load categories
  useEffect(() => {
    // loadHierarchies({})
    if (isValid(language)) {
      loadUnits(language)
    }
  }, [language])

  useEffect(() => {
    if (resUnitData.isSuccess) {
      setState({
        unitsData: resUnitData?.data?.payload?.map((a: any) => {
          return {
            label: a?.label_value,
            value: a?.label_name
          }
        })
      })
    }
  }, [resUnitData])

  useEffect(() => {
    setTimeout(() => {
      setFocus('name')
    }, 50)
  }, [setFocus])

  useEffect(() => {
    if (isValidArray(form.getValues(`categories`))) {
      //dsf
    } else {
      form.setValue(`categories`, [])
    }
  }, [isValidArray(form.watch(`categories`))])

  // create product RTK mutation
  const [createProduct, result] = useCreateOrUpdateProductMutation()
  log('editDataa', edit)
  const onSubmit = (e: ProductParamsNew) => {
    const array: any = form.getValues(`categories`)
    // eslint-disable-next-line no-confusing-arrow
    const filteredArray: any = array
      ?.map((d: any) => (isValid(d?.value) ? d?.value : null))
      .filter((a: any) => a !== null)
    if (isValid(product) || isValid(edit) || isValid(productId)) {
      let data: ProductParamsNew = {}
      if (isValid(edit)) {
        data = {
          // ...edit,
          category_id: filteredArray[0]?.value,
          id: edit?.id,
          store_id: edit?.store_id,
          name: e?.name,
          vat_type: e?.vat_type?.value ?? null,
          description: e?.description,
          product_image: e?.product_image,
          categories: filteredArray ?? [],
          restriction_type: e?.restriction_type?.value ?? null,
          restriction_value: e?.restriction_value ?? null,
          vat: e?.vat ?? edit?.vat
        }
        createProduct({ ...data })
        // for modal (edit product)
      } else {
        // for variant (update product)
        log('variantUpdate', e)
        const x = e?.product_variants ? e?.product_variants[0] : {}
        const bar =
          x?.barcodes?.filter(function (element) {
            return isValid(element?.value)
          }) ?? []
        data = {
          variantId,
          productId,
          store_id: isValid(subStoreId) ? subStoreId : product?.store_id,
          product_id: isValid(productId) ? productId : product?.product_id,
          ...x,
          //   selling_price: x?.selling_price,
          barcodes: bar?.map((b) => b.value),
          //Quantity validation
          quantity: x?.is_unlimited ? '9999999999' : x?.quantity ?? 0,
          unit_type: x?.unit_type?.value ?? null,
          // vat_type: x?.vat_type?.value ?? null,
          product_type: bar?.length > 0 ? '1' : '2',
          restriction_type: x?.restriction_type?.value ?? null,
          restriction_value: x?.restriction_value ?? null,
          offer_type: x?.offer_type?.value ?? null
        }
        log('updateVariant', data)
        createProduct({
          ...data
        })
      }
    } else {
      log('create', e)
      createProduct({
        ...e,
        store_id: isValid(storeId) ? storeId : user?.store_id,
        category_id: isValidArray(filteredArray) ? filteredArray[0] : null,
        // bar_codes: e?.bar_codes?.map((a: any) => a.value),
        // any_restrictions: 'no',
        vat: e?.vat ?? 0,
        vat_type: e?.vat_type?.value ?? null,
        product_image: e?.product_image ?? null,
        categories: filteredArray ?? [],
        product_variants: e?.product_variants?.map((a) => {
          const bar =
            a?.barcodes?.filter(function (element) {
              return isValid(element?.value)
            }) ?? []
          return {
            ...a,
            adjustment_type: 'initial_stock',
            vat_type: a?.vat_type?.value ?? null,
            restriction_type: a?.restriction_type?.value ?? null,
            restriction_value: a?.restriction_value ?? null,
            expiry: a?.expiry ?? null,
            product_image: a?.product_image ?? null,
            product_type: isValidBarcode(bar) ? '1' : '2',
            barcodes: bar?.map((b) => b.value),
            unit_type: a?.unit_type?.value ?? null,
            quantity: a?.is_unlimited ? '9999999999' : a?.quantity ?? 0,
            offer_type: a?.offer_type?.value ?? null
          }
        })
      })
    }
  }

  // navigate back if success
  useEffect(() => {
    if (result.isSuccess) {
      if (noView !== true) {
        navigate(-1)
      }
      response(true)
    }
  }, [result, noView])

  // append field

  useEffect(() => {
    if (fields?.length === 0 && !isValid(variantId)) {
      append({})
    }
  }, [variantId, fields])

  // find category parent
  const findParentIdR = (cat: any) => {
    const re: Array<any> = []
    if (cat !== undefined) {
      const cats = state.categoryListFlat
      re.push(cat?.id)
      if (cat?.parent_id !== null) {
        const parent = cats?.find((a) => a.id === cat?.parent_id)
        re.push(...findParentIdR(parent))
      }
    }
    // log('re', re)
    return re
  }

  // set form data
  const pro = product as any

  // eslint-disable-next-line @typescript-eslint/no-inferrable-types
  let vat: number = 0
  if (productDetails?.isSuccess) {
    vat = productDetails?.data?.payload?.vat
  } else if (ProductData?.isSuccess) {
    vat = pro?.product?.vat
  } else if (isValid(watch('vat'))) {
    vat = Number(watch('vat'))
  }

  useEffect(() => {
    // edit at your own risk.
    if (isValid(product) && product !== undefined) {
      const f = fillObject<ProductParamsNew>(state.formData, product)
      const formData: ProductParamsNew = {
        ...f,
        vat: Number(product?.vat),
        vat_type: {
          label: FM(getKeyByValue(vatType, Number(product?.vat_type))),
          value: Number(product?.vat_type)
        },
        categories: pro?.selected_categories?.map((a: any) => {
          return { label: a?.name, value: a?.id, extra: { ...a, has_child: 'yes' } }
        }),
        product_variants: isValid(variantId)
          ? [
              {
                ...product,
                selling_price: product?.selling_price,
                offer_expiry: product?.applied_offer?.offer_valid_to ?? null,
                offer_start: product?.applied_offer?.offer_valid_from ?? null,
                offer_value: product?.applied_offer?.offer_value,
                offer_type: product?.applied_offer
                  ? {
                      label: FM(
                        getKeyByValue(ProductOffers, Number(product?.applied_offer?.offer_type))
                      ),
                      value: Number(product?.applied_offer?.offer_type)
                    }
                  : null,
                unit_type: {
                  label: product?.unit_type,
                  value: product?.unit_type
                },

                restriction_type: {
                  label: FM(getKeyByValue(restrictions, product?.restriction_type)),
                  value: product?.restriction_type
                },
                is_unlimited: product?.quantity === '9999999999' ? 1 : '0',
                barcodes: product?.product_bar_codes?.map((e: any) => ({
                  value: e?.bar_code
                }))
              }
            ]
          : f?.product_variants?.map((a, i) => ({
              ...a,
              offer_value: a?.product_offers?.offer_value,
              unit_type: { label: FM(getKeyByValue(units, a?.unit_type)), value: a?.unit_type },
              restriction_type: {
                label: FM(getKeyByValue(restrictions, a?.restriction_type)),
                value: a?.restriction_type
              },
              offer_type: {
                label: FM(getKeyByValue(ProductOffers, Number(a?.offer_type))),
                value: Number(a?.offer_type)
              },
              is_unlimited: a?.quantity === '9999999999' ? 1 : '0',
              barcodes: a?.product_bar_codes?.map((e) => ({
                value: e.bar_code
              }))
            }))
      }
      setValues<ProductParamsNew>(formData, setValue)
    }
  }, [ProductData?.isSuccess])

  return (
    <>
      <Hide IF={isValid(edit)}>
        <Header
          onClickBack={() => navigate(-1)}
          subHeading={FM('star-marked-filed-are-required')}
          goBackTo
          title={
            isValid(variantId)
              ? FM('update-variant')
              : productId
              ? FM('add-variant')
              : FM('create-product')
          }
        >
          {/* <Button onClick={generateRandomData}>Test</Button> */}
        </Header>
      </Hide>
      {state.loading || ProductData?.isLoading ? (
        <>
          <Row>
            <Col md='8' className='d-flex align-items-stretch'>
              <Card>
                <CardBody>
                  <Row>
                    <Col md='6'>
                      <Shimmer style={{ height: 40 }} />
                    </Col>
                    <Col md='6'>
                      <Shimmer style={{ height: 40 }} />
                    </Col>
                    <Col md='12' className='mt-2'>
                      <Shimmer style={{ height: 320 }} />
                    </Col>
                  </Row>
                </CardBody>
              </Card>
            </Col>
            <Col md='4' className='d-flex align-items-stretch'>
              <Card>
                <CardBody>
                  <Row>
                    <Col md='12'>
                      <Shimmer style={{ height: 40 }} />
                    </Col>
                    <Col md='12' className='mt-2'>
                      <Shimmer style={{ height: 320 }} />
                    </Col>
                  </Row>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </>
      ) : (
        <>
          <Form onSubmit={handleSubmit(onSubmit)}>
            <Row style={{ display: 'flex', alignItems: 'flex-start' }}>
              <Col
                md={isValid(edit) ? 7 : isValid(variantId) || isValid(productId) ? 12 : 8}
                className=''
              >
                <Hide IF={isValid(variantId) || isValid(productId)}>
                  <Card>
                    <CardHeader className='border-bottom'>
                      <CardTitle>
                        <>{FM('product-details')}</>
                      </CardTitle>
                    </CardHeader>
                    <CardBody className='pt-2'>
                      <Row>
                        <Col md='6'>
                          <FormGroupCustom
                            autoFocus
                            label={<>{FM('product-name')}</>}
                            placeholder={FM('product-name')}
                            name={`name`}
                            type={'text'}
                            className='mb-2'
                            control={control}
                            rules={{ required: true, maxLength: 50 }}
                          />
                        </Col>

                        <Col md='3'>
                          <FormGroupCustom
                            name={`vat_type`}
                            type={'select'}
                            label={FM('vat-type')}
                            isClearable
                            selectOptions={createConstSelectOptions(vatType, FM)}
                            className='mb-1'
                            control={control}
                            rules={{ required: true }}
                          />
                        </Col>

                        <Col md='3'>
                          <FormGroupCustom
                            // key={`${last?.value}-w3425342`}
                            label={FM('vat')}
                            placeholder={FM('vat')}
                            name={`vat`}
                            type={'number'}
                            defaultValue={0}
                            className='mb-2'
                            control={control}
                            rules={{ required: true, max: 100, min: 0, maxLength: 5 }}
                          />
                        </Col>

                        <Col md={isValid(edit) ? 12 : 10}>
                          <FormGroupCustom
                            name={`description`}
                            type={'textarea'}
                            placeholder={FM('description')}
                            label={<>{FM('description')}</>}
                            className='mb-2'
                            control={control}
                            rules={{ required: true }}
                          />
                        </Col>
                        <Col md={isValid(edit) ? 4 : 2}>
                          <Label>{FM('product-image')}</Label>
                          <SimpleImageUpload
                            params={{ for: 'product' }}
                            value={watch('product_image')}
                            name='product_image'
                            setValue={setValue}
                          />
                        </Col>
                      </Row>
                    </CardBody>
                  </Card>
                </Hide>
                <Hide IF={isValid(edit)}>
                  {fields.map((field, index) => (
                    <Card key={field?.id}>
                      {/* <UpdateSellingPrice index={index} /> */}
                      <CardHeader className='border-bottom'>
                        <CardTitle>
                          <>
                            {FM('product-variant')} {index > 0 ? index + 1 : ''}
                            {/* <span className='text-danger fw-bolder'>*</span>{' '} */}
                          </>
                        </CardTitle>
                      </CardHeader>
                      <CardBody className='pt-1'>
                        <Row className='g'>
                          <Col md='10'>
                            <Row className='g'>
                              <Col md='6'>
                                <FormGroupCustom
                                  autoFocus={false}
                                  label={<>{FM('variant-name')}</>}
                                  placeholder={FM('variant-name')}
                                  name={`product_variants.${index}.name`}
                                  type={'text'}
                                  className='mb-1'
                                  control={control}
                                  rules={{ required: true, maxLength: 50 }}
                                />
                              </Col>
                              <Col md='6'>
                                <FormGroupCustom
                                  label={<>{FM('sku')}</>}
                                  placeholder={FM('sku')}
                                  name={`product_variants.${index}.sku`}
                                  type={'text'}
                                  className='mb-1'
                                  control={control}
                                  rules={{ required: false, maxLength: 13 }}
                                />
                              </Col>
                              <Col md='6'>
                                <FormGroupCustom
                                  key={watch(`product_variants.${index}.is_unlimited`)}
                                  defaultValue={
                                    watch(`product_variants.${index}.is_unlimited`) === 1
                                      ? 9999999999
                                      : 0
                                  }
                                  name={`product_variants.${index}.quantity`}
                                  isDisabled={watch(`product_variants.${index}.is_unlimited`) === 1}
                                  type={'number'}
                                  label={FM('quantity')}
                                  className='mb-1'
                                  control={control}
                                  rules={
                                    watch(`product_variants.${index}.is_unlimited`) === 1
                                      ? { required: false }
                                      : { required: true, min: 0, max: 9999999999 }
                                  }
                                  prepend={
                                    <InputGroupText className='p-25'>
                                      <BsTooltip title={FM('unlimited')}>
                                        <FormGroupCustom
                                          key={`${variantId}-${product?.quantity}`}
                                          noLabel
                                          label={FM('unlimited')}
                                          defaultValue={
                                            watch(`product_variants.${index}.quantity`) >=
                                            Number(9999999999)
                                              ? 1
                                              : 0
                                          }
                                          name={`product_variants.${index}.is_unlimited`}
                                          type={'checkbox'}
                                          control={control}
                                          className={'ms-1 me-25'}
                                          rules={{
                                            required: false
                                          }}
                                        />
                                      </BsTooltip>
                                    </InputGroupText>
                                  }
                                />
                              </Col>
                              <Col md='6'>
                                <FormGroupCustom
                                  name={`product_variants.${index}.expiry`}
                                  label={FM('expiry-date')}
                                  datePickerOptions={{
                                    minDate: formatDate(new Date(), 'YYYY-MM-DD 00:00:00')
                                  }}
                                  type={'date'}
                                  className='mb-1'
                                  control={control}
                                  rules={{ required: false }}
                                />
                              </Col>
                            </Row>
                          </Col>
                          <Col md='2'>
                            <Label>{FM('variant-image')}</Label>
                            <br />
                            <SimpleImageUpload
                              params={{ for: 'variant' }}
                              value={watch(`product_variants.${index}.product_image`)}
                              name={`product_variants.${index}.product_image`}
                              setValue={setValue}
                            />
                          </Col>
                          <Label className='mt-1'>
                            {FM('apply-restrictions')}{' '}
                            {/* <span className='text-danger fw-bolder'>*</span> */}
                          </Label>
                          <hr className='' />
                          <Col md='6'>
                            <FormGroupCustom
                              key={`${variantId}`}
                              // isClearable

                              placeholder={FM('select-restriction')}
                              name={`product_variants.${index}.restriction_type`}
                              type={'select'}
                              label={FM('restriction-type')}
                              className='mb-1'
                              control={control}
                              selectOptions={createConstSelectOptions(restrictions, FM)}
                              rules={{ required: false }}
                            />
                          </Col>
                          {/* <Show IF = {watch("restriction_type")} */}
                          <Hide
                            IF={
                              watch(`product_variants.${index}.restriction_type`)?.value ===
                                restrictions?.id_required ||
                              watch(`product_variants.${index}.restriction_type`)?.value ===
                                restrictions?.prescription_required ||
                              watch(`product_variants.${index}.restriction_type`)?.value ===
                                restrictions?.none
                            }
                          >
                            <Col md='6'>
                              <FormGroupCustom
                                name={`product_variants.${index}.restriction_value`}
                                label={FM('enter-details')}
                                type={'number'}
                                className='mb-1'
                                tooltip={FM('enter-restriction-details')}
                                control={control}
                                rules={{ required: true, min: 0.001, max: 100 }}
                              />
                            </Col>
                          </Hide>

                          <Label className='mt-2'>{FM('price-details')}</Label>
                          <hr className='' />
                          <Container>
                            <Row className=''>
                              <Col md='4'>
                                <FormGroupCustom
                                  name={`product_variants.${index}.purchase_price`}
                                  type={'number'}
                                  label={FM('purchase-price')}
                                  className='mb-1'
                                  control={control}
                                  rules={{ required: true, min: 0, max: '50000' }}
                                />
                              </Col>
                              <Col md='4'>
                                <FormGroupCustom
                                  name={`product_variants.${index}.max_retail_price`}
                                  type={'number'}
                                  label={FM('max-retail-price')}
                                  className='mb-1'
                                  control={control}
                                  rules={{ required: true, min: 0, max: '50000' }}
                                  onChangeValue={(e) => {
                                    const mrp = e ?? 0
                                    const discount =
                                      watch(`product_variants.${index}.offer_value`) ?? 0
                                    let sellingPrice = '0'

                                    if (
                                      watch(`product_variants.${index}.offer_type`)?.value ===
                                      ProductOffers?.amount
                                    ) {
                                      sellingPrice = parseFloat(String(mrp - discount)).toFixed(2)
                                    } else if (
                                      watch(`product_variants.${index}.offer_type`)?.value ===
                                      ProductOffers?.percent
                                    ) {
                                      const test = Number(mrp)
                                      const test2 = test * Number(discount / 100)
                                      const test3 = test - test2

                                      sellingPrice = parseFloat(String(test3)).toFixed(2)
                                    } else {
                                      sellingPrice = parseFloat(String(mrp)).toFixed(2)
                                    }
                                    console.log('sellingPrice', sellingPrice)

                                    setValue(
                                      `product_variants.${index}.selling_price`,
                                      sellingPrice
                                    )
                                  }}
                                />
                              </Col>
                              <Col md='4'>
                                <FormGroupCustom
                                  name={`product_variants.${index}.offer_type`}
                                  type={'select'}
                                  label={FM('offer-type')}
                                  isClearable
                                  selectOptions={createConstSelectOptions(ProductOffers, FM)}
                                  className='mb-1'
                                  control={control}
                                  onChangeValue={() => {
                                    const mrp =
                                      watch(`product_variants.${index}.max_retail_price`) ?? 0
                                    const discount =
                                      watch(`product_variants.${index}.offer_value`) ?? 0
                                    let sellingPrice = '0'

                                    if (
                                      watch(`product_variants.${index}.offer_type`)?.value ===
                                      ProductOffers?.amount
                                    ) {
                                      sellingPrice = parseFloat(String(mrp - discount)).toFixed(2)
                                    } else if (
                                      watch(`product_variants.${index}.offer_type`)?.value ===
                                      ProductOffers?.percent
                                    ) {
                                      const test = Number(mrp)
                                      const test2 = test * Number(discount / 100)
                                      const test3 = test - test2

                                      sellingPrice = parseFloat(String(test3)).toFixed(2)
                                    } else {
                                      sellingPrice = parseFloat(String(mrp)).toFixed(2)
                                    }
                                    console.log('sellingPrice', sellingPrice)

                                    setValue(
                                      `product_variants.${index}.selling_price`,
                                      sellingPrice
                                    )
                                  }}
                                  rules={{ required: false }}
                                />
                              </Col>
                              <Show IF={isValid(watch(`product_variants.${index}.offer_type`))}>
                                <Col md='4'>
                                  <FormGroupCustom
                                    defaultValue={0}
                                    name={`product_variants.${index}.offer_value`}
                                    append={
                                      watch(`product_variants.${index}.offer_type`)?.value ===
                                        ProductOfferTypes?.percent ||
                                      watch(`product_variants.${index}.offer_type`)?.value ===
                                        ProductOfferTypes?.same_quantity_on_percent ? (
                                        <InputGroupText>%</InputGroupText>
                                      ) : watch(`product_variants.${index}.offer_type`)?.value ===
                                        ProductOfferTypes?.same_quantity_on_quantity ? (
                                        <InputGroupText>{FM('free')}</InputGroupText>
                                      ) : null
                                    }
                                    type={'number'}
                                    label={FM('offer-value')}
                                    className='mb-1'
                                    control={control}
                                    onChangeValue={(e) => {
                                      const mrp =
                                        watch(`product_variants.${index}.max_retail_price`) ?? 0
                                      const discount = e ?? 0
                                      let sellingPrice = '0'

                                      if (
                                        watch(`product_variants.${index}.offer_type`)?.value ===
                                        ProductOffers?.amount
                                      ) {
                                        sellingPrice = parseFloat(String(mrp - discount)).toFixed(2)
                                      } else if (
                                        watch(`product_variants.${index}.offer_type`)?.value ===
                                        ProductOffers?.percent
                                      ) {
                                        const test = Number(mrp)
                                        const test2 = test * Number(discount / 100)
                                        const test3 = test - test2

                                        sellingPrice = parseFloat(String(test3)).toFixed(2)
                                      } else {
                                        sellingPrice = parseFloat(String(mrp)).toFixed(2)
                                      }
                                      console.log('sellingPrice', sellingPrice)

                                      setValue(
                                        `product_variants.${index}.selling_price`,
                                        sellingPrice
                                      )
                                    }}
                                    rules={{
                                      required: false,
                                      min: 0,
                                      max:
                                        watch(`product_variants.${index}.offer_type`)?.value ===
                                        ProductOfferTypes?.percent
                                          ? 100
                                          : watch(`product_variants.${index}.max_retail_price`),
                                      maxLength:
                                        watch(`product_variants.${index}.offer_type`)?.value ===
                                        ProductOfferTypes?.percent
                                          ? 5
                                          : `${watch(`product_variants.${index}.max_retail_price`)}`
                                              .length
                                    }}
                                  />
                                </Col>
                              </Show>

                              <Col md='4'>
                                <FormGroupCustom
                                  name={`product_variants.${index}.selling_price`}
                                  type={'number'}
                                  //   isDisabled
                                  inputClassName={'pe-none'}
                                  label={FM('selling-price')}
                                  className='mb-1'
                                  control={control}
                                  rules={{ required: true, min: 0, max: '50000' }}
                                />
                              </Col>
                              <Show IF={watch(`vat_type`)?.value === 1}>
                                <Col md='4'>
                                  <p className='fw-bolder'>
                                    {watch(`vat_type`)?.value === 1
                                      ? `${FM('price-with-VAT', {
                                          name: !isNaN(vat) ? vat : 0
                                        })} %`
                                      : ''}
                                  </p>
                                  {/* <code className='fw-bolder'>{finalReturnedPrice}</code> */}
                                  <code>
                                    {
                                      // eslint-disable-next-line no-mixed-operators
                                      watch(`vat_type`)?.value === 1
                                        ? (
                                            Number(
                                              watch(`product_variants.${index}.selling_price`)
                                            ) *
                                            (Number(vat / 100) +
                                              Number(
                                                watch(`product_variants.${index}.selling_price`)
                                              ))
                                          ).toFixed(2)
                                        : Number(
                                            watch(`product_variants.${index}.selling_price`)
                                          ).toFixed(2)
                                    }
                                  </code>
                                </Col>
                              </Show>
                              <Col md='4'>
                                <FormGroupCustom
                                  name={`product_variants.${index}.offer_expiry`}
                                  label={FM('Offer-Expiry-Date')}
                                  type={'date'}
                                  className='mb-1'
                                  // datePickerOptions={{
                                  //   minDate: formatDate(new Date(), 'YYYY-MM-DD 00:00:00')
                                  // }}
                                  //   datePickerOptions={{
                                  //     minDate: watch(`product_variants.${index}.offer_start`)
                                  //       ? formatDate(watch(`product_variants.${index}.offer_start`))
                                  //       : new Date()
                                  //   }}
                                  datePickerOptions={{
                                    minDate: formatDate(new Date(addDay(new Date(), 1)))
                                  }}
                                  control={control}
                                  rules={{
                                    required: isValid(watch(`product_variants.${index}.offer_type`))
                                  }}
                                />
                              </Col>
                              <Col md='4'>
                                <FormGroupCustom
                                  name={`product_variants.${index}.unit_type`}
                                  type={'select'}
                                  label={FM('unit')}
                                  className='mb-1'
                                  control={control}
                                  selectOptions={state.unitsData}
                                  rules={{ required: false }}
                                />
                              </Col>
                            </Row>
                          </Container>
                          <>
                            {/* <Hide IF={`${product?.product_type}` === '1'}> */}
                            <Label className='mt-1'>
                              {FM('product-barcodes')}{' '}
                              {/* <span className='text-danger fw-bolder'>*</span> */}
                              <BsTooltip
                                title={FM('you-can-leave-barcode-blank-to-create-open-products')}
                              >
                                <HelpCircle
                                  style={{ marginTop: '-2px' }}
                                  size={13}
                                  className='text-dark'
                                />
                              </BsTooltip>
                            </Label>
                            <hr className='' />
                            <Barcodes nestIndex={index} form={form} />
                            {/* </Hide> */}
                          </>
                        </Row>
                      </CardBody>
                      <Show IF={index > 0 || index === fields?.length - 1}>
                        <CardFooter className='pt-1 pb-1'>
                          <Show IF={index > 0}>
                            <BsTooltip<ButtonProps>
                              Tag={Button}
                              role={'button'}
                              color='danger'
                              size='sm'
                              className='btn-icon me-1'
                              title={FM('remove')}
                              onClick={() => {
                                remove(index)
                              }}
                            >
                              <>
                                <Trash2 size={16} /> {FM('remove')}
                              </>
                            </BsTooltip>
                          </Show>
                          <Hide IF={isValid(variantId) || isValid(productId)}>
                            <Show IF={index === fields?.length - 1}>
                              <BsTooltip<ButtonProps>
                                Tag={Button}
                                color='primary'
                                size='sm'
                                title={FM('add-more')}
                                role={'button'}
                                className='btn-icon'
                                onClick={() => {
                                  append({})
                                }}
                              >
                                <>
                                  <Plus size={16} /> {FM('add-variant')}
                                </>
                              </BsTooltip>
                            </Show>
                          </Hide>
                          <Show IF={isValid(variantId) || isValid(productId)}>
                            <LoadingButton
                              loading={result?.isLoading}
                              color='primary'
                              type='submit'
                            >
                              {isValid(productId)
                                ? FM(
                                    isValidBarcode(watch('product_variants.0.barcodes'))
                                      ? 'add-variant'
                                      : 'add-open-product'
                                  )
                                : FM('update')}
                            </LoadingButton>
                          </Show>
                        </CardFooter>
                      </Show>
                    </Card>
                  ))}
                </Hide>
              </Col>
              <Hide IF={isValid(variantId) || isValid(productId)}>
                <StickyBox
                  className={isValid(edit) ? 'col-md-5' : 'col-md-4'}
                  offsetTop={90}
                  offsetBottom={50}
                >
                  <Card className='mt-0'>
                    <CardHeader className='border-bottom'>
                      <CardTitle>
                        <>
                          {FM('categories')}
                          <span className='text-danger fw-bolder'>*</span>
                        </>
                      </CardTitle>
                    </CardHeader>
                    <CardBody className='p-0'>
                      <Row>
                        <Col md='12' className='mb-0'>
                          {/* <PerfectScrollbar> */}
                          <div
                            className='border'
                            style={{
                              height: 800,
                              overflowY: 'scroll',
                              overflowX: 'auto',
                              whiteSpace: 'nowrap'
                            }}
                          >
                            {/* <div className='list-unstyled p-1'>{renderCategory()}</div> */}
                            <div className='list-unstyled p-1'>
                              {' '}
                              {isValid(variantId) || isValid(productId)
                                ? ''
                                : CategoryDropdown({
                                    edit,
                                    form,
                                    level: 0,
                                    onSelect: (e) => {
                                      log('selected', e)
                                    },
                                    hasChild: null,
                                    maxLevel: 0
                                  })}
                            </div>
                          </div>
                        </Col>
                      </Row>
                    </CardBody>
                  </Card>
                  <Col sm='12' className='border-top'>
                    <LoadingButton
                      block
                      loading={result?.isLoading}
                      className='mt-2 mb-3'
                      color='primary'
                      type='submit'
                    >
                      {isValid(variantId) ? FM('update') : FM('save')}
                    </LoadingButton>
                  </Col>
                </StickyBox>
              </Hide>
            </Row>
            <Row>
              {/* <Col md="6">
                                {CategoryDropdown({ form, level: 0, onSelect: (e) => { log('selected', e) } })}
                            </Col> */}
            </Row>
          </Form>
        </>
      )}
    </>
  )
}
export default ProductForm
