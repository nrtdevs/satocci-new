import { useEffect, useReducer, useState } from 'react'
import { useForm } from 'react-hook-form'

import { Badge } from 'reactstrap'
import Hide from '../../utility/Hide'
import Show from '../../utility/Show'
import { getUserData } from '../../utility/Utils'
import { loadDropdown } from '../../utility/apis/dropdowns'
import { FM, isValid, isValidArray, log } from '../../utility/helpers/common'
import ApiEndpoints from '../../utility/http/ApiEndpoints'
import { stateReducer } from '../../utility/stateReducer'
import FormGroupCustom from '../components/formGroupCustom/FormGroupCustom'
import SideModal from '../components/sideModal/sideModal'
import { ProductParamType } from './fragment/ProductForm'

interface States {
  category?: any
  subcategory?: any
  language?: any
  loading?: boolean
  languageList?: any
  active?: any
  page?: any

  per_page_record?: any
  search?: any
}

interface propsType {
  userType?: any
  show?: boolean
  handleFilterModal?: any
  forVariant?: boolean
  setFilterData?: any
  filterData?: any
}
const ProductFilter = ({
  userType = null,
  forVariant = false,
  show = false,
  handleFilterModal = () => {},
  setFilterData = {},
  filterData = {}
}: propsType) => {
  const {
    register,
    formState: { errors },
    handleSubmit,
    control,
    getValues,
    watch,
    reset
  } = useForm<ProductParamType>()
  const initState: States = {
    category: [],
    subcategory: [],
    language: null,
    loading: false,
    languageList: [],
    active: '1',
    page: 1,
    per_page_record: 100,
    search: undefined
  }
  const reducers = stateReducer<States>
  const [state, setState] = useReducer(reducers, initState)
  const [open, setOpen] = useState(show)
  const user = getUserData()

  /////lANGUAGE
  // const [loadLanguage, languageResult] = useLanguageListMutation()

  useEffect(() => {
    if (isValidArray(user?.languages)) {
      setState({
        languageList: user?.languages
      })
    }
  }, [isValidArray(user?.languages)])
  /////lANGUAGE

  useEffect(() => {
    if (watch('category_id')?.extra?.subcategories) {
      setState({
        subcategory: watch('category_id')?.extra?.subcategories
      })
    }
  }, [watch('category_id')])

  // useEffect(() => {
  //   const select: any = watch('category_id')
  //   if (select?.value) {
  //     loadSubCat({
  //       jsonData: { name: state?.search },
  //       id: select?.value
  //       // page: state?.page,
  //       // per_page_record: state?.per_page_record
  //     })
  //   }
  // }, [watch('category_id')])

  const submitFilter = (d: any) => {
    setFilterData({
      ...d,
      categories: d?.category_id?.value
    })
    // setTimeout(() => {
    //   setOpen(show)
    //   reset()
    // }, 1000)
  }

  // Show/Hide Modal
  useEffect(() => {
    if (show) setOpen(true)
    if (!show) reset()
  }, [show])

  log('categoryId', watch('category_id'))

  return (
    <SideModal
      loading={state?.loading}
      handleSave={handleSubmit(submitFilter)}
      open={open}
      handleModal={() => {
        setOpen(false)
        handleFilterModal(false)
      }}
      title={forVariant === true ? FM('variant-filter') : FM('product-filter')}
      done='filter'
    >
      {/* <Form> */}
      <Hide IF={forVariant}>
        <FormGroupCustom
          label={FM('category')}
          //   noLabel
          async
          isClearable
          path={ApiEndpoints.get_categories_subcategories}
          selectLabel='name'
          selectValue={'id'}
          jsonData={{
            with_child: 'yes'
          }}
          defaultOptions
          loadOptions={loadDropdown}
          name={'category_id'}
          type={'select'}
          className='mb-0'
          control={control}
          rules={{ required: false }}
        />

        <Badge className='' color='light-danger'>
          {isValid(watch('category_id')?.extra?.parent_id) ? 'Subcategory' : ''}
        </Badge>
        {/* <FormGroupCustom
          label={FM('subcategory')}
          isDisabled={!isValid(watch('category_id'))}
          placeholder={FM('subcategory')}
          isClearable={true}
          name={'subcategory_id'}
          type={'select'}
          selectOptions={createSelectOptions(state?.subcategory, 'name', 'id')}
          className='mb-1'
          control={control}
          rules={{ required: false }}
        /> */}
        <FormGroupCustom
          placeholder={FM('product-name')}
          type='text'
          name='name'
          label={FM('product-name')}
          className='mb-1'
          control={control}
          rules={{ required: false }}
        />
        <FormGroupCustom
          placeholder={FM('variant-name')}
          type='text'
          name='variant_name'
          label={FM('variant-name')}
          className='mb-1'
          control={control}
          rules={{ required: false }}
        />
      </Hide>
      <Show IF={forVariant}>
        <FormGroupCustom
          placeholder={FM('variant-name')}
          type='text'
          name='name'
          label={FM('variant-name')}
          className='mb-1'
          control={control}
          rules={{ required: false }}
        />
        <FormGroupCustom
          placeholder={FM('max-retail-price')}
          type='text'
          name='max_retail_price'
          label={FM('max-retail-price')}
          className='mb-1'
          control={control}
          rules={{ required: false }}
        />

        <FormGroupCustom
          placeholder={FM('purchase-price')}
          type='text'
          name='purchase_price'
          label={FM('purchase-price')}
          className='mb-1'
          control={control}
          rules={{ required: false }}
        />
        <FormGroupCustom
          placeholder={FM('selling-price')}
          type='text'
          name='selling_price'
          label={FM('selling-price')}
          className='mb-1'
          control={control}
          rules={{ required: false }}
        />
        <FormGroupCustom
          placeholder={FM('quantity')}
          type='number'
          name='quantity'
          label={FM('quantity')}
          className='mb-1'
          control={control}
          rules={{ required: false }}
        />
      </Show>

      {/* <FormGroupCustom
          placeholder={FM('unique-id')}
          type='number'
          name='unique_id'
          label={FM('unique-id')}
          className='mb-1'
          control={control}
          rules={{ required: false }}
        /> */}
      {/* </Form> */}
    </SideModal>
  )
}

export default ProductFilter
