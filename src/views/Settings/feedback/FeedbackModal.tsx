import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useDispatch } from 'react-redux'
import { CardBody, Col, Row } from 'reactstrap'
import { useCreateOrUpdateFeedbackMutation } from '../../../redux/RTKQuery/FedbackRTK'
import { FM } from '../../../utility/helpers/common'
import { getUserData } from '../../../utility/Utils'
import FormGroupCustom from '../../components/formGroupCustom/FormGroupCustom'
import CenteredModal from '../../components/modal/CenteredModal'

export type CategoryParamsType = {
  id?: string
  name: string
  status?: string
  patent_id?: string
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
  // rest?: any
}

export default function FeedbackModal<T>(props: T & dataType) {
  const {
    edit = null,
    noView = false,
    showModal = false,
    setShowModal = () => {},
    Component = 'span',
    response = () => {},
    children = null,
    ...rest
  } = props

  const [open, setOpen] = useState(false)
  const [editData, setEditData] = useState(null)
  const [loading, setLoading] = useState(false)

  const dispatch = useDispatch()
  const form = useForm<CategoryParamsType>()
  const user = getUserData()
  const {
    formState: { errors },
    handleSubmit,
    control,
    reset
  } = form

  const openModal = () => {
    setOpen(true)
  }
  const closeModal = (from = null) => {
    setOpen(false)
    setShowModal(false)
  }

  // const { data, error, isLoading } = useLoadCategoryQuery({ page: 1, per_page_record: 15 })

  const [createFeedback, result] = useCreateOrUpdateFeedbackMutation()

  // log('data', data)

  const handleSave = (d: CategoryParamsType) => {
    if (edit?.id) {
      alert('edit')
    } else {
      createFeedback({ ...d, email: user?.email })
    }
  }

  useEffect(() => {
    closeModal()
    response(result.isSuccess)
    reset()
  }, [result.isSuccess])

  useEffect(() => {
    if (noView && showModal) {
      openModal()
    }
  }, [noView, showModal])

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
        open={open}
        handleModal={closeModal}
        handleSave={handleSubmit(handleSave)}
        title={FM('feedback')}
      >
        <form>
          <CardBody className='m-0 p-1'>
            <Row className='mb-0'>
              {/* <Col md='12' className='p-0 m-0 mb-1'>
                <FormGroupCustom
                  type={'text'}
                  noLabel
                  control={control}
                  name='qr_code'
                  className='mb-1'
                  label={FM('qr-no')}
                />
              </Col> */}
              <Col md='12'>
                <FormGroupCustom
                  type={'textarea'}
                  // noLabel
                  control={control}
                  name='message'
                  className='mb-0'
                  label={FM('message')}
                />
              </Col>
            </Row>
            {/* <p className='mb-0 p-1 border-bottom fw-bolder text-dark' style={{ backgroundColor: "#f4f4f496" }}>OR(Add Manually)</p> */}
          </CardBody>
        </form>
      </CenteredModal>
    </>
  )
}
