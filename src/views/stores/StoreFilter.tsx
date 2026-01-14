import { useEffect, useReducer, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useParams } from 'react-router-dom'

import { useLanguageListMutation } from '../../redux/RTKQuery/LanguageRTK'
import { FM, isValid, isValidArray, log } from '../../utility/helpers/common'
import Hide from '../../utility/Hide'
import Show from '../../utility/Show'
import { stateReducer } from '../../utility/stateReducer'
import { getUserData } from '../../utility/Utils'
import FormGroupCustom from '../components/formGroupCustom/FormGroupCustom'
import SideModal from '../components/sideModal/sideModal'
import { StoreParamsType } from './fragment/AddUpdateForm'

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
  subscription_type?: any
}

interface propsType {
  userType?: any
  show?: boolean
  handleFilterModal?: any

  setFilterData?: any
  filterData?: any
}
const StoreFilter = ({
  userType = null,

  show = false,
  handleFilterModal = () => {},
  setFilterData = () => {},
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
  } = useForm<StoreParamsType>()
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
  const params = useParams()
  const parentId = params?.id
  const user = getUserData()

  log(parentId, 'paremrte')
  /////lANGUAGE
  const [loadLanguage, languageResult] = useLanguageListMutation()

  useEffect(() => {
    if (userType === 1) {
      loadLanguage({ jsonData: { name: state?.search } })
    }
  }, [userType === 1])
  useEffect(() => {
    if (languageResult?.isSuccess && userType === 1) {
      setState({
        languageList: languageResult?.data?.payload
      })
    }
    if (user?.user_type_id === 2) {
      setState({
        languageList: user?.languages
      })
    }
  }, [languageResult?.data, isValidArray(user?.languages)])
  /////lANGUAGE

  const submitFilter = (d: any) => {
    log(d, 'd')
    setFilterData({
      ...d,
      language_id: d?.language_id?.value,
      subscription_type: d?.subscription_type?.value
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

  return (
    <SideModal
      loading={state?.loading}
      handleSave={handleSubmit(submitFilter)}
      open={open}
      handleModal={() => {
        setOpen(false)
        handleFilterModal(false)
      }}
      title={FM('store-filter')}
      done='filter'
    >
      {/* <Form> */}
      {/* <FormGroupCustom
        key={`name`}
        type={'select'}
        control={control}
        name={`language_id`}
        selectOptions={createSelectOptions(state?.languageList, 'title', 'id')}
        className='mb-1'
        label={FM('language')}
      /> */}

      {/* <FormGroupCustom
        placeholder={FM('name')}
        type='text'
        name='name'
        label={FM('name')}
        className='mb-1'
        control={control}
        rules={{ required: false }}
      /> */}
      <Show IF={isValid(parentId)}>
        <FormGroupCustom
          placeholder={FM('store-name')}
          type='text'
          name='store_name'
          label={FM('store-name')}
          className='mb-1'
          control={control}
          rules={{ required: false }}
        />
        <FormGroupCustom
          placeholder={FM('store-email')}
          type='email'
          name='store_email'
          label={FM('store-email')}
          className='mb-1'
          control={control}
          rules={{ required: false }}
        />
      </Show>
      <Hide IF={isValid(parentId)}>
        <FormGroupCustom
          placeholder={FM('admin-name')}
          type='text'
          name='name'
          label={FM('admin-name')}
          className='mb-1'
          control={control}
          rules={{ required: false }}
        />
        {/* <FormGroupCustom
          placeholder={FM('mobile-number')}
          type='number'
          name='mobile_number'
          label={FM('mobile-number')}
          className='mb-1'
          control={control}
          rules={{ required: false }}
        /> */}
        {/* <FormGroupCustom
          placeholder={FM('subscription-type')}
          type={'select'}
          name='subscription_type'
          label={FM('subscription-type')}
          className='mb-1'
          control={control}
          selectOptions={createConstSelectOptions(subscriptionStoreType, FM)}
          rules={{ required: false }}
        /> */}
      </Hide>
      <FormGroupCustom
        placeholder={FM('admin-email')}
        type='email'
        name='email'
        label={FM('admin-email')}
        className='mb-1'
        control={control}
        rules={{ required: false }}
      />

      <FormGroupCustom
        placeholder={FM('city')}
        type='text'
        name='city'
        label={FM('city')}
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

export default StoreFilter
