/* eslint-disable prettier/prettier */
import { useEffect, useReducer, useState } from 'react'
import { CustomerLoginParams } from './CustomerLogin'
import { useForm } from 'react-hook-form'
import { stateReducer } from '../../utility/stateReducer'
import { useDisPlayLoginSettingsMutation } from '../../redux/RTKQuery/countryListRTK'
import { FM, isValid, log } from '../../utility/helpers/common'
import { CardBody, Col, Row } from 'reactstrap'
import CenteredModal from '../components/modal/CenteredModal'
import FormGroupCustom from '../components/formGroupCustom/FormGroupCustom'
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
export default function AddCustomerLogin<T>(props: T & dataType) {
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
  const form = useForm<CustomerLoginParams>()

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

  const [editCustomerLogin, result] = useDisPlayLoginSettingsMutation()

  const handleSave = (d: CustomerLoginParams) => {
    editCustomerLogin({
      ...edit,
      country_id: edit?.country_id,
      show_login_bankid: watch('show_login_bankid'),
      show_login_otp: watch('show_login_otp'),
      show_login_freja: watch('show_login_freja'),
      show_crypto_wallet: watch('show_crypto_wallet'),
      show_stripe: watch('show_stripe'),
      show_tabby: watch('show_tabby')
    })
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

  log(parseInt(edit?.show_login_otp))

  useEffect(() => {
    if (isValid(edit?.id)) {
      setValue('country_name', edit?.country_name)
      setValue('country_id', edit?.country_id)
      setValue('show_login_bankid', parseInt(edit?.show_login_bankid))
      setValue('show_login_freja', parseInt(edit?.show_login_freja))
      setValue('show_login_otp', parseInt(edit?.show_login_otp))
      setValue('show_crypto_wallet', parseInt(edit?.show_crypto_wallet))
      setValue('show_stripe', parseInt(edit?.show_stripe))
      setValue('show_tabby', parseInt(edit?.show_tabby))
    }
  }, [edit])

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
        disableSave={result?.isLoading}
        loading={false}
        open={open}
        handleModal={closeModal}
        handleSave={handleSubmit(handleSave)}
        title={FM('edit-login-setting')}
      >
        {/* <Form> */}
        <CardBody className=''>
          <Row>
            <Col md='4'>
              <FormGroupCustom
                type={'text'}
                // noLabel
                control={control}
                rules={{ required: false }}
                name={`country_name`}
                className='mb-1 pe-none'
                label={FM('country')}
              />
            </Col>
          </Row>
          <Row>
            <p className='fw-bolder'>{FM('login-setting')}</p>
            <Col md='4'>
              <FormGroupCustom
                type={'checkbox'}
                // noLabel
                control={control}
                rules={{ required: false }}
                name={`show_login_otp`}
                className='mb-1'
                label={FM('show-login-otp')}
              />
            </Col>
            <Col md='4'>
              <FormGroupCustom
                type={'checkbox'}
                // noLabel
                control={control}
                rules={{ required: false }}
                name={`show_login_freja`}
                className='mb-1'
                label={FM('show-login-freja')}
              />
            </Col>
            <Col md='4'>
              <FormGroupCustom
                type={'checkbox'}
                // noLabel
                control={control}
                rules={{ required: false }}
                name={`show_login_bankid`}
                className='mb-1'
                label={FM('show-login-bankid')}
              />
            </Col>
            <Row>
              <p className='fw-bolder'>{FM('payment-setting')}</p>
              <Col md='4'>
                <FormGroupCustom
                  type={'checkbox'}
                  // noLabel
                  control={control}
                  rules={{ required: false }}
                  name={`show_stripe`}
                  className='mb-1'
                  label={FM('show_stripe')}
                />
              </Col>
              <Col md='4'>
                <FormGroupCustom
                  type={'checkbox'}
                  // noLabel
                  control={control}
                  rules={{ required: false }}
                  name={`show_crypto_wallet`}
                  className='mb-1'
                  label={FM('show_crypto_wallet')}
                />
              </Col>
              <Col md='4'>
                <FormGroupCustom
                  type={'checkbox'}
                  // noLabel
                  control={control}
                  rules={{ required: false }}
                  name={`show_tabby`}
                  className='mb-1'
                  label={FM('show_tabby')}
                />
              </Col>
            </Row>
          </Row>
        </CardBody>
        {/* </Form> */}
      </CenteredModal>
    </>
  )
}
