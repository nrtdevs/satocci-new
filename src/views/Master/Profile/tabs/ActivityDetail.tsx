import { useEffect, useReducer, useState } from 'react'
import { useFieldArray, useForm } from 'react-hook-form'

import { CardBody, Col, InputGroupText, Label, ListGroup, ListGroupItem, Row } from 'reactstrap'
import { activityParams, useLoadActivityByIdMutation } from '../../../../redux/RTKQuery/StoreRTK'
import { FM, isValid } from '../../../../utility/helpers/common'
import Show from '../../../../utility/Show'
import { stateReducer } from '../../../../utility/stateReducer'
import { JsonToTable } from 'react-json-to-table'

import CenteredModal from '../../../components/modal/CenteredModal'
import { truncateText } from '../../../../utility/Utils'
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

export default function ActivityDetail<T>(props: T & dataType) {
  const {
    edit = null,
    parentId = null,
    noView = false,
    showModal = false,
    setShowModal = () => {},
    Component = 'span',
    children = null,
    response = () => {},
    ...rest
  } = props
  const form = useForm<activityParams>()
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
  const [loadByID, { data, isError, isLoading, isSuccess }] = useLoadActivityByIdMutation()
  const load = () => {
    loadByID({
      id: edit?.id,
      jsonData: { name: state?.search },
      page: state?.page,
      per_page_record: state?.per_page_record
    })
  }
  useEffect(() => {
    if (edit?.id) {
      load()
    }
  }, [state?.page, state?.per_page_record, edit])
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
        modalClass='modal-lg'
        loading={isLoading}
        open={open}
        hideSave
        handleModal={closeModal}
        // handleSave={handleSubmit(handleSave)}
        title={FM('activity-log')}
      >
        <CardBody className='p-1'>
          <Row>
            <Col sm='12' md='6'>
              <ListGroup className='ml-2 py-2'>
                <ListGroupItem className='d-flex justify-content-between align-items-center'>
                  {/* <p>{edit?.log_name}</p> */}
                  <span className='fw-bolder'> {FM('name')} :</span>
                  <span className='fw-bolder'>{truncateText(edit?.name, 30)}</span>
                  {/* <p>{edit?.properties?.attributes}</p> */}
                </ListGroupItem>
                <ListGroupItem className='d-flex justify-content-between align-items-center'>
                  {/* <p>{edit?.log_name}</p> */}
                  <span className='fw-bolder'> {FM('log-name')} :</span>
                  <span className='fw-bolder'>{edit?.log_name}</span>
                  {/* <p>{edit?.properties?.attributes}</p> */}
                </ListGroupItem>
                <ListGroupItem className='d-flex justify-content-between align-items-center'>
                  <span className='fw-bolder'>{FM('description')}:</span>
                  <span className='fw-bolder'>{edit?.description}</span>
                </ListGroupItem>
              </ListGroup>
            </Col>
            <Col sm='12' md='6'>
              <ListGroup className='mr-2 py-2'>
                <ListGroupItem className='d-flex justify-content-between align-items-center'>
                  <span className='fw-bolder'>{FM('subject-id')} :</span>
                  <span className='fw-bolder'>{edit?.subject_id}</span>
                </ListGroupItem>
                <ListGroupItem className='d-flex justify-content-between align-items-center'>
                  <span className='fw-bolder'>{FM('subject-type')} :</span>
                  <span className='fw-bolder'>{edit?.subject_type}</span>
                </ListGroupItem>
                <ListGroupItem className='d-flex justify-content-between align-items-center'>
                  <span className='fw-bolder'>{FM('causer-type')} :</span>
                  <span className='fw-bolder'>{edit?.causer_type}</span>
                </ListGroupItem>
              </ListGroup>
            </Col>
          </Row>
          <Col md='12' className='p-0'>
            <Show IF={isValid(edit?.properties?.attributes)}>
              <div>
                <Label> {FM('attributes')} </Label>
              </div>
              <div>
                <JsonToTable json={edit?.properties?.attributes} />
              </div>
            </Show>
            <Show IF={isValid(edit?.properties?.old)}>
              <div className='mt-2'>
                <Label> {FM('old')} </Label>
              </div>
              <JsonToTable json={edit?.properties?.old} />
            </Show>
          </Col>
        </CardBody>
      </CenteredModal>
    </>
  )
}
