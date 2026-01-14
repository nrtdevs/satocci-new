import { useEffect, useReducer, useState } from 'react'
import { set, useFieldArray, useForm } from 'react-hook-form'

import { CardBody, Col, InputGroupText, Row } from 'reactstrap'

import CenteredModal from '../../components/modal/CenteredModal'
import useUserType from '../../../utility/hooks/useUserType'
import { useCreateOrUpdateCategoryMutation } from '../../../redux/RTKQuery/CategoryRTK'
import {
  createConstSelectOptions,
  createSelectOptions,
  getKeyByValue,
  getUserData
} from '../../../utility/Utils'
import { UserType, cardType, paymentMethod } from '../../../utility/Const'
import { FM, isValid, log } from '../../../utility/helpers/common'
import FormGroupCustom from '../../components/formGroupCustom/FormGroupCustom'
import { stateReducer } from '../../../utility/stateReducer'
import ApiEndpoints from '../../../utility/http/ApiEndpoints'
import { loadDropdown } from '../../../utility/apis/dropdowns'
import Show from '../../../utility/Show'
import ReactCountryFlag from 'react-country-flag'
import { useCreateOrUpdateProcessingFeeMutation } from '../../../redux/RTKQuery/paymentProcessingfeeSetupRTK'
import { useNoViewModal } from '../../components/modal/HandleModal'
import { Watch } from 'react-feather'

export type paymentSetupParam = {
  id?: string
  account_country_id?: any
  account_currency?: any
  account_country_code?: string
  card_type?: any
  card_percentage?: any
  payment_method?: any
  fixed_charge?: any
  currecncy_conversion_charge_percentage?: any
  updated_at?: any
  created_at?: any
}
interface States {
  languageList?: any
  editData?: any
  loading?: boolean
  text?: string
  list?: any
  page?: any
  per_page_record?: any
  search?: any
  formData?: any
}
interface dataType {
  edit?: any
  parentId?: any
  noView?: boolean
  showModal?: boolean
  setShowModal?: (e: boolean) => void
  Component?: any
  loading?: boolean
  children?: any
  response?: (e: boolean) => void
}

export default function PaymentSetupModal<T>(props: T & dataType) {
  const {
    edit = undefined,
    parentId = null,
    noView = false,
    showModal = false,
    setShowModal = () => {},
    Component = 'span',
    children = null,
    response = () => {},
    ...rest
  } = props
  const form = useForm<paymentSetupParam>()

  const initState: States = {
    languageList: [],
    loading: false,
    page: 1,
    per_page_record: 100,
    search: undefined,
    text: '',
    list: [],
    formData: {
      id: null,
      name: null,
      status: null,
      patent_id: null,
      category_details: [],
      updated_at: null
    }
  }

  const userType = useUserType()
  const reducers = stateReducer<States>
  const [state, setState] = useReducer(reducers, initState)
  const [open, setOpen] = useState(false)
  const {
    formState: { errors },
    handleSubmit,
    control,
    reset,
    watch,
    setValue
  } = form

  const openModal = () => {
    setOpen(true)
  }
  const closeModal = (from = null) => {
    setOpen(false)
    setShowModal(false)
    reset()
  }
  const user = getUserData()

  const [createProcessingFee, result] = useCreateOrUpdateProcessingFeeMutation()

  const handleSave = (d: paymentSetupParam) => {
    log('processignfee', d)
    const submitData = {
      ...d,
      account_country_id: d?.account_country_id?.value,
      card_type: d?.card_type?.value,
      account_country_code: d?.account_country_id?.extra?.country_code,
      payment_method: d?.payment_method?.value,
      account_currency: d?.account_currency?.value
    }

    if (edit?.id) {
      createProcessingFee({
        ...edit,
        ...submitData,
        account_country_id: watch('account_country_id')?.value,
        account_country_code: isValid(submitData?.account_country_code)
          ? submitData?.account_country_code
          : edit?.account_country_code,
        account_currency: watch('account_currency')?.value
      })
    } else {
      createProcessingFee({
        ...submitData
      })
    }
  }

  useEffect(() => {
    if (result?.isSuccess) {
      response(result.isSuccess)
      closeModal()
    }
  }, [result?.isSuccess])

  useEffect(() => {
    if (noView && showModal) {
      openModal()
    }
  }, [noView, showModal])

  useEffect(() => {
    if (isValid(edit?.id)) {
      setValue('account_country_id', {
        value: edit?.account_country_id,
        label: edit?.account_country_code
      })

      setValue('account_currency', {
        value: edit?.account_currency,
        label: edit?.account_currency
      })
      setValue('card_type', {
        value: edit?.card_type,
        label: getKeyByValue(cardType, `${edit?.card_type}`)
      })
      setValue('account_country_code', edit?.account_country_code)
      setValue('card_percentage', edit?.card_percentage)
      setValue('fixed_charge', edit?.fixed_charge)
      setValue(
        'currecncy_conversion_charge_percentage',
        edit?.currecncy_conversion_charge_percentage
      )
      setValue('payment_method', {
        value: edit?.payment_method,
        label: getKeyByValue(paymentMethod, `${edit?.payment_method}`)
      })
    }
  }, [edit])

  //   useEffect(() => {
  //     setValue('payment_method', {
  //       value: 'stripe',
  //       label: 'stripe'
  //     })
  //   }, [])
  log('account_country_code', watch('account_country_code'))
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
        disableSave={!isValid(watch('account_country_id')) || result?.isLoading}
        loading={false}
        open={open}
        handleModal={closeModal}
        handleSave={handleSubmit(handleSave)}
        title={isValid(edit) ? FM('update-category') : FM('add-category')}
      >
        {/* <Form> */}
        <CardBody className=''>
          <Row>
            <Col md='6'>
              <FormGroupCustom
                key={`${edit?.country_code}-tfdjgfdfd-${edit?.account_country_id}`}
                tooltip={FM('country')}
                label={FM('country')}
                placeholder={FM('country')}
                //   noLabel
                async
                isClearable
                path={ApiEndpoints.get_countries}
                selectLabel='name'
                selectValue={'id'}
                defaultOptions
                loadOptions={loadDropdown}
                modifyDropdownData={(d: any) => {
                  return {
                    ...d,
                    country: `${d?.name}`
                  }
                }}
                jsonData={{ view_all: 'yes' }}
                formData={{ view_all: 'yes' }}
                name={'account_country_id'}
                type={'select'}
                className='mb-1'
                control={control}
                rules={{ required: true }}
                // prepend={<InputGroupText>{FM('get')}</InputGroupText>}
              />
              <FormGroupCustom
                tooltip={FM('currency')}
                label={FM('currency')}
                placeholder={FM('currency')}
                async
                isClearable
                path={ApiEndpoints.get_countries}
                selectLabel='currency'
                selectValue={'currency_code'}
                defaultOptions
                loadOptions={loadDropdown}
                modifyDropdownData={(d: any) => {
                  return {
                    ...d,
                    currency: `${d?.name} / (${d?.currency_code ?? d?.currency_symbol})`
                  }
                }}
                jsonData={{ view_all: 'no' }}
                formData={{ view_all: 'no' }}
                name={'account_currency'}
                type={'select'}
                className='mb-1'
                control={control}
                rules={{ required: true }}
                // prepend={
                //   <Show IF={watch('account_currency')?.extra?.currency_symbol}>
                //     <InputGroupText className=''>
                //       {watch('account_currency')?.extra?.currency_symbol ? (
                //         watch('account_currency')?.extra?.currency_symbol
                //       ) : (
                //         <span>&#36;</span>
                //       )}
                //       {/* </span> */}
                //     </InputGroupText>
                //   </Show>
                // }
              />
              <FormGroupCustom
                tooltip={FM('card-type')}
                key={`card-type-${edit?.id}`}
                type={'select'}
                control={control}
                name={`card_type`}
                selectOptions={createConstSelectOptions(cardType, FM)}
                className='mb-1'
                label={FM('card-type')}
                rules={{ required: true }}
              />
              <FormGroupCustom
                tooltip={FM('payment-method')}
                key={`card-type-${edit?.id}`}
                type={'select'}
                control={control}
                name={`payment_method`}
                selectOptions={createConstSelectOptions(paymentMethod, FM)}
                className='mb-1'
                label={FM('payment-method')}
                rules={{ required: true }}
              />
            </Col>
            <Col md='6'>
              <FormGroupCustom
                type={'number'}
                // noLabel
                control={control}
                rules={{ required: true, min: 0 }}
                name={`fixed_charge`}
                className='mb-1'
                label={FM('fixed-charge')}
                // append={<InputGroupText>%</InputGroupText>}
              />
              <FormGroupCustom
                type={'number'}
                // noLabel
                control={control}
                rules={{ required: false, min: 0, maxLength: 5, max: 100 }}
                name={`card_percentage`}
                className='mb-1'
                label={FM('card-percentage')}
                append={<InputGroupText>%</InputGroupText>}
              />
              <FormGroupCustom
                type={'number'}
                // noLabel
                control={control}
                rules={{ required: false, min: 0, maxLength: 5, max: 100 }}
                name={`currecncy_conversion_charge_percentage`}
                className='mb-1'
                label={FM('currency-conversion-charge-percentage')}
                append={<InputGroupText>%</InputGroupText>}
              />
            </Col>
          </Row>
        </CardBody>
        {/* </Form> */}
      </CenteredModal>
    </>
  )
}
