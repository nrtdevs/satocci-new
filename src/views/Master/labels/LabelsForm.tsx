import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useDispatch } from 'react-redux'
import { CardBody, Col, Row } from 'reactstrap'
import { FM } from '../../../utility/helpers/common'
import FormGroupCustom from '../../components/formGroupCustom/FormGroupCustom'

import CenteredModal from '../../components/modal/CenteredModal'

export type LabelFormData = {
  id: any
  group_id: any
  language_id: any
  label_id: any
  label_value: any | null
  status: any
  title: any
  country_code?: any | null
  country?: any | null
  file?: any | null
}
interface dataType {
  edit?: any
  noView?: boolean
  showModal?: boolean
  setShowModal?: (e: boolean) => void
  Component?: any
  loading?: boolean
  children?: any
  // rest?: any
}

export default function AddProductModal<T>(props: T & dataType) {
  const {
    edit = null,
    noView = false,
    showModal = false,
    setShowModal = () => {},
    Component = 'span',
    children = null,
    ...rest
  } = props

  const [open, setOpen] = useState(false)
  const [editData, setEditData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [user, setUser] = useState([])
  const dispatch = useDispatch()
  const form = useForm<LabelFormData>()

  const {
    formState: { errors },
    handleSubmit,
    control,
    reset,
    setValue,
    watch,
    getValues
  } = form

  const openModal = () => {
    setOpen(true)
  }
  const closeModal = (from = null) => {
    setOpen(false)
    setShowModal(false)
  }
  const handleSave = (data: any) => {
    if (edit?.id) {
      alert('edit')
    } else {
      alert('save')
    }
  }

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
        loading={loading}
        open={open}
        handleModal={closeModal}
        handleSave={handleSubmit(handleSave)}
        title={`${edit?.session_id}: Add Product`}
      >
        <form>
          <CardBody className=''>
            <Row className='mb-0'>
              <Col md='12' className='p-0 m-0 mb-1'>
                {/* <Button.Ripple className=" m-0 p-1" color={"primary"}>
                                    Scan Barcode
                                </Button.Ripple> */}

                <img
                  className='img-fluid cursor-pointer'
                  src={
                    'https://www.nicepng.com/png/detail/504-5048494_scan-qr-code-svg-scan-icon-png.png'
                  }
                />
              </Col>
              <Col md='12'>
                <FormGroupCustom
                  type={'text'}
                  noLabel
                  control={control}
                  name='qr_code'
                  className='mb-1'
                  label={FM('qr-no')}
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
