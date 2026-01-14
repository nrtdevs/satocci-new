import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useParams } from 'react-router-dom'
import { CardBody, Col, Row } from 'reactstrap'
import { ActionParams } from '..'
import { useSubsLogActionMutation } from '../../../../redux/RTKQuery/SubscriptionRTK'
import { amountReceived } from '../../../../utility/Const'
import { FM, isValid, log } from '../../../../utility/helpers/common'
import {
  createConstSelectOptions,
  fillObject,
  getKeyByValue,
  setValues
} from '../../../../utility/Utils'
import FormGroupCustom from '../../../components/formGroupCustom/FormGroupCustom'
import CenteredModal from '../../../components/modal/CenteredModal'

export type SubscriptionLogType = {
  store_id?: string | null | number
  subscription_type?: string | null | number
  sub_store_limit?: string | null | number
  store_subscription_id?: string | null | number
  currency?: string
  amount_received_month?: string | null | number
  amount_received_date?: string | null | number
  amount_received?: string | null | number
  amount?: string | null | number
}
interface dataType {
  edit?: any
  response?: (e: boolean) => void
  noView?: boolean
  showModal?: boolean
  setShowModal?: (e: boolean) => void
  Component?: any
  loading?: boolean
  children?: any
  storeCurrency?: any

  // rest?: any
}

function AddSubscriptionLog<T>(props: dataType & T) {
  const {
    edit = null,
    noView = false,
    showModal = false,
    storeCurrency = null,
    setShowModal = () => {},
    Component = 'span',
    response = () => {},
    children = null,
    ...rest
  } = props
  const params = useParams()
  const symbol = params?.currency
  const [open, setOpen] = useState(false)
  const [editData, setEditData] = useState(null)
  const [countryCode, setCountryCode] = useState(null)
  const [loading, setLoading] = useState(false)
  const form = useForm<ActionParams>()
  const {
    watch,
    formState: { errors },
    handleSubmit,
    control,
    setValue,
    reset
  } = form

  const openModal = () => {
    setOpen(true)
    reset()
  }
  const closeModal = (from = null) => {
    setOpen(false)
    setShowModal(false)
  }

  const [action, result] = useSubsLogActionMutation()

  const handleSave = (d: ActionParams) => {
    if (edit?.id) {
      action({
        ...edit,
        subscription_log_id: edit?.id,
        store_subscription_id: d?.store_subscription_id,
        amount_received_month: d?.amount_received_month,
        amount: d?.amount,
        currency: symbol,
        amount_received: d?.amount_received?.value
      })
    } else {
      action({
        // subscription_log_id: d?.title,
        store_subscription_id: params?.id,
        amount_received_month: d?.amount_received_month,
        amount: d?.amount,
        currency: storeCurrency,
        amount_received: d?.amount_received?.value
      })
    }
  }
  useEffect(() => {
    if (result?.isSuccess) {
      closeModal()
      response(result.isSuccess)
    }
  }, [result.isSuccess])

  useEffect(() => {
    if (noView && showModal) {
      openModal()
    }
  }, [noView, showModal])

  log('currency', symbol)
  // set form data
  useEffect(() => {
    if ((isValid(edit) && edit !== undefined) || storeCurrency) {
      const f = fillObject<ActionParams>(
        {
          amount_received: '',
          currency: storeCurrency,
          amount: '',
          amount_received_month: '',
          store_subscription_id: '',
          subscription_log_id: ''
        },
        { ...edit, currency: storeCurrency }
      )

      const formData: ActionParams = {
        ...f,
        currency: storeCurrency,
        amount_received: {
          label: getKeyByValue(amountReceived, `${edit?.amount_received}`),
          value: `${edit?.amount_received}`
        }
      }
      setValues<ActionParams>(formData, setValue)
    }
  }, [edit, storeCurrency])

  log(storeCurrency, 'sdf')
  return (
    <>
      {!noView ? (
        <Component role='button' onClick={openModal} {...rest}>
          {children}
        </Component>
      ) : null}
      <CenteredModal
        scrollControl={false}
        modalClass='modal-sm'
        loading={result.isLoading}
        disableSave={watch('amount_received')?.value === amountReceived?.no}
        open={open}
        handleModal={closeModal}
        handleSave={handleSubmit(handleSave)}
        title={FM('log')}
      >
        <form>
          <CardBody className=''>
            <Row className=''>
              <Col md='12' className=''>
                <FormGroupCustom
                  type={'date'}
                  control={control}
                  name='amount_received_month'
                  isDisabled={isValid(edit)}
                  className={`mt-0 ${isValid(edit) ? 'pe-none' : ''}`}
                  label={FM('amount-received-month')}
                  rules={{ required: true }}
                />
              </Col>
              <Col md='12' className=''>
                <FormGroupCustom
                  type={'number'}
                  control={control}
                  name='amount'
                  className={`mt-1`}
                  // isDisabled={isValid(edit?.amount)}
                  label={FM('amount')}
                  rules={{ required: true, min: 0, minLength: 1, maxLength: 10 }}
                />
              </Col>
              <Col md='12' className=''>
                <FormGroupCustom
                  key={`${storeCurrency}-sdfsfredstdf`}
                  type={'text'}
                  isDisabled={isValid(storeCurrency)}
                  control={control}
                  defaultValue={storeCurrency}
                  name='currency'
                  //   className={`mt-1 ${isValid(edit) ? 'pe-none' : ''}`}
                  className='mt-1'
                  //   isDisabled={isValid(edit)}
                  label={FM('currency')}
                  rules={{ required: true }}
                />
              </Col>
              <Col md='12' className=''></Col>

              <FormGroupCustom
                name={'amount_received'}
                type={'select'}
                label={FM('amount-received')}
                className='mt-1 mb-1'
                control={control}
                selectOptions={createConstSelectOptions(amountReceived, FM)}
                rules={{ required: true }}
              />
            </Row>
            {/* <p className='mb-0 p-1 border-bottom fw-bolder text-dark' style={{ backgroundColor: "#f4f4f496" }}>OR(Add Manually)</p> */}
          </CardBody>
        </form>
      </CenteredModal>
    </>
  )
}

export default AddSubscriptionLog
