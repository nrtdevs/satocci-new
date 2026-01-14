import { useEffect, useReducer, useState } from 'react'
import { useForm } from 'react-hook-form'

import { useLanguageListMutation } from '../../../redux/RTKQuery/LanguageRTK'
import { CouponType } from '../../../utility/Const'
import { FM } from '../../../utility/helpers/common'
import { stateReducer } from '../../../utility/stateReducer'
import { createConstSelectOptions } from '../../../utility/Utils'
import FormGroupCustom from '../../components/formGroupCustom/FormGroupCustom'
import SideModal from '../../components/sideModal/sideModal'
import { CouponParamType } from './AddUpdateCoupon'

interface States {
  category?: any
  couponFilter?: boolean
  filterData?: any
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
  setFilterData?: any
  filterData?: any
}
const CouponFilter = ({
  userType = null,

  show = false,
  handleFilterModal = () => {},
  setFilterData = null,
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
  } = useForm<CouponParamType>()
  const initState: States = {
    category: [],
    subcategory: [],
    couponFilter: false,
    filterData: {},
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

  /////lANGUAGE
  const [loadLanguage, languageResult] = useLanguageListMutation()

  useEffect(() => {
    loadLanguage({ jsonData: { name: state?.search } })
  }, [])
  useEffect(() => {
    if (languageResult?.isSuccess) {
      setState({
        languageList: languageResult?.data?.payload
      })
    }
  }, [languageResult?.data])
  /////lANGUAGE

  const submitFilter = (d: any) => {
    setFilterData({
      ...d,
      discount_type: d?.discount_type?.value,
      only_satocci_coupon: d?.only_satocci_coupon ? 'yes' : 'no'
    })
  }

  // Show/Hide Modal
  useEffect(() => {
    if (show) setOpen(true)
    if (!show) reset()
  }, [show])

  return (
    <SideModal
      loading={state?.loading}
      handleSave={handleSubmit(submitFilter)}
      open={open}
      handleModal={() => {
        setOpen(false)
        handleFilterModal(false)
      }}
      title={FM('coupon-filter')}
      done='filter'
    >
      {/* <Form> */}

      <FormGroupCustom
        placeholder={FM('coupon-code')}
        type='text'
        name='coupon_code'
        label={FM('coupon-code')}
        className='mb-1'
        control={control}
        rules={{ required: false }}
      />

      <FormGroupCustom
        placeholder={FM('discount-value')}
        type='text'
        name='discount_value'
        label={FM('discount-value')}
        className='mb-1'
        control={control}
        rules={{ required: false }}
      />

      <FormGroupCustom
        name={`discount_type`}
        type={'select'}
        label={FM('discount-type')}
        className='mb-1'
        control={control}
        selectOptions={createConstSelectOptions(CouponType, FM)}
        rules={{ required: false }}
      />

      <FormGroupCustom
        placeholder={FM('usage-limit')}
        type='number'
        name='usage_limit'
        label={FM('usage-limit')}
        className='mb-1'
        control={control}
        rules={{ required: false }}
      />

      <FormGroupCustom
        placeholder={FM('expiry-date')}
        type='date'
        name='expiry_date'
        label={FM('expiry-date')}
        className='mb-1'
        control={control}
        rules={{ required: false }}
      />

      <FormGroupCustom
        placeholder={FM('satocci-coupon')}
        type='checkbox'
        name='only_satocci_coupon'
        label={FM('satocci-coupon')}
        className='mb-1'
        control={control}
        rules={{ required: false }}
      />

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

export default CouponFilter
