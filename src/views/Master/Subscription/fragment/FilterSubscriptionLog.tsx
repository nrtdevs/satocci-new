import { AnyTxtRecord } from 'dns'
import { useEffect, useReducer, useState } from 'react'
import { useForm } from 'react-hook-form'

import { Form } from 'reactstrap'
import { SubscriptionLogType } from '..'
import { amountReceived } from '../../../../utility/Const'
import { FM } from '../../../../utility/helpers/common'
import { stateReducer } from '../../../../utility/stateReducer'
import { createConstSelectOptions } from '../../../../utility/Utils'
import FormGroupCustom from '../../../components/formGroupCustom/FormGroupCustom'
import SideModal from '../../../components/sideModal/sideModal'

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
  name?: any
  store_email?: any
  amount?: any
  from?: any
  to?: any
}

interface propsType {
  userType?: any
  show?: boolean
  handleFilterModal?: any

  setFilterData?: any
  filterData?: any
}
const FilterSubscriptionLog = ({
  userType = null,

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
  } = useForm<SubscriptionLogType>()
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

  const submitFilter = (d: any) => {
    setFilterData({ ...d, amount_received: d?.amount_received?.value })
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
      title={FM('log-filter')}
      done='filter'
    >
      {/* <Form> */}

      {/* <FormGroupCustom
        placeholder={FM('name')}
        type='text'
        name='name'
        label={FM('name')}
        className='mb-1'
        control={control}
        rules={{ required: false }}
      />
      <FormGroupCustom
        placeholder={FM('amount')}
        type='text'
        name='amount'
        label={FM('amount')}
        className='mb-1'
        control={control}
        rules={{ required: false }}
      /> */}
      {/* <FormGroupCustom
        placeholder={FM('from-date')}
        type='date'
        name='from'
        label={FM('from-date')}
        className='mb-1'
        control={control}
        rules={{ required: false }}
      /> */}
      <FormGroupCustom
        placeholder={FM('amount-received-month')}
        type='date'
        name='amount_received_month'
        label={FM('amount-received-month')}
        className='mb-1'
        control={control}
        rules={{ required: false }}
      />
      <FormGroupCustom
        name={'amount_received'}
        type={'select'}
        label={FM('amount-received')}
        className='mt-1'
        control={control}
        selectOptions={createConstSelectOptions(amountReceived, FM)}
        rules={{ required: false }}
      />
      {/* <FormGroupCustom
        placeholder={FM('store-email')}
        type='email'
        name='store_email'
        label={FM('store-email')}
        className='mb-1'
        control={control}
        rules={{ required: false }}
      /> */}
      {/* <FormGroupCustom
        placeholder={FM('mobile-number')}
        type='number'
        name='mobile_number'
        label={FM('mobile-number')}
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
      <FormGroupCustom
        placeholder={FM('address')}
        type='textarea'
        name='address'
        label={FM('address')}
        className='mb-1'
        control={control}
        rules={{ required: false }}
      /> */}
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

export default FilterSubscriptionLog
