import { useEffect, useReducer, useState } from 'react'
import { useForm } from 'react-hook-form'

import { FM } from '../../../utility/helpers/common'
import { stateReducer } from '../../../utility/stateReducer'
import FormGroupCustom from '../../components/formGroupCustom/FormGroupCustom'
import SideModal from '../../components/sideModal/sideModal'
import { EmployeeParamType } from './fragment/AddUpdateEmployee'

interface States {
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
const EmployeeFilter = ({
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
  } = useForm<EmployeeParamType>()
  const initState: States = {
    loading: false,
    active: '1',
    page: 1,
    per_page_record: 100,
    search: undefined
  }
  const reducers = stateReducer<States>
  const [state, setState] = useReducer(reducers, initState)
  const [open, setOpen] = useState(show)

  const submitFilter = (d: any) => {
    setFilterData(d)
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
      title={FM('employee-filter')}
      done='filter'
    >
      {/* <Form> */}
      <FormGroupCustom
        placeholder={FM('name')}
        type='text'
        name='name'
        label={FM('name')}
        className='mb-1'
        control={control}
        rules={{ required: false }}
      />
      <FormGroupCustom
        placeholder={FM('mobile-number')}
        type='number'
        name='mobile_number'
        label={FM('mobile-number')}
        className='mb-1'
        control={control}
        rules={{ required: false }}
      />
      <FormGroupCustom
        placeholder={FM('email')}
        type='email'
        name='email'
        label={FM('email')}
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

export default EmployeeFilter
