import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { CardBody, Col, Row } from 'reactstrap'
import {
  PermissionsReqParams,
  useCreateOrUpdatePermissionMutation
} from '../../../redux/RTKQuery/PermissionRTK'
import { groupNameSelect } from '../../../utility/Const'
import { FM } from '../../../utility/helpers/common'
import FormGroupCustom from '../../components/formGroupCustom/FormGroupCustom'
import CenteredModal from '../../components/modal/CenteredModal'

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

export default function PermissionFormModal<T>(props: T & dataType) {
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
  const form = useForm<PermissionsReqParams>()
  const {
    formState: { errors },
    handleSubmit,
    control
  } = form

  const openModal = () => {
    setOpen(true)
  }
  const closeModal = (from = null) => {
    setOpen(false)
    setShowModal(false)
  }

  // const { data, error, isLoading } = useLoadCategoryQuery({ page: 1, per_page_record: 15 })

  const [createFeedback, result] = useCreateOrUpdatePermissionMutation()

  // log('data', data)

  const handleSave = (d: PermissionsReqParams) => {
    if (edit?.id) {
      alert('edit')
    } else {
      createFeedback({ ...d, group_name: d?.group_name?.value })
    }
  }

  useEffect(() => {
    closeModal()
    response(result.isSuccess)
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
        loading={result?.isLoading}
        open={open}
        handleModal={closeModal}
        handleSave={handleSubmit(handleSave)}
        title={FM('permissions')}
      >
        <form>
          <CardBody className=''>
            <Row className='mb-0'>
              <Col md='12'>
                <FormGroupCustom
                  label={FM('group-name')}
                  type={'select'}
                  control={control}
                  selectOptions={groupNameSelect}
                  name='group_name'
                  className='mb-0'
                  rules={{ required: true }}
                />
              </Col>

              <Col md='12'>
                <FormGroupCustom
                  type={'text'}
                  control={control}
                  name='name'
                  className='mb-1'
                  label={FM('name')}
                />
              </Col>
              <Col md='12'>
                <FormGroupCustom
                  type={'text'}
                  // noLabel
                  control={control}
                  name='se_name'
                  className='mb-1'
                  label={FM('se-name')}
                />
              </Col>

              {/* <Col md='12'>
                <FormGroupCustom
                  label={FM('belongs-to')}
                  type={'select'}
                  control={control}
                  selectOptions={userTypeSelect}
                  name='belongs_to'
                  className='mb-2'
                  rules={{ required: true }}
                />
              </Col> */}
            </Row>
          </CardBody>
        </form>
      </CenteredModal>
    </>
  )
}
