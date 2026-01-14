/* eslint-disable eqeqeq */
import { useEffect, useState } from 'react'
import { Badge, Card, CardBody, Col, Row } from 'reactstrap'

import { LanguageRequestParams } from '../../../redux/RTKQuery/LanguageRTK'
import { statusCode } from '../../../utility/Const'
import { FM } from '../../../utility/helpers/common'
import { truncateText } from '../../../utility/Utils'

import CenteredModal from '../../components/modal/CenteredModal'
import { EmailSmsParamsType } from './EmailTemplateForm'

export type CategoryParamsType = {
  id?: string
  name: string
  status?: string
  patent_id?: string
}
interface dataType {
  edit?: EmailSmsParamsType
  response?: (e: boolean) => void
  noView?: boolean
  showModal?: boolean
  setShowModal?: (e: boolean) => void
  Component?: any
  loading?: boolean
  children?: any

  // rest?: any
}

export default function NotificationDetailModal<T>(props: T & dataType) {
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

  const openModal = () => {
    setOpen(true)
  }
  const closeModal = (from = null) => {
    setOpen(false)
    setShowModal(false)
  }

  const handleSave = (d: LanguageRequestParams) => {}

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
        hideSave
        disableFooter
        scrollControl={true}
        modalClass='modal-sm'
        loading={false}
        open={open}
        handleModal={closeModal}
        // handleSave={h
        title={truncateText(edit?.notification_for, 30)}
      >
        <Card className='p-0'>
          {/* <CardImg
            top
            alt={FM('image')}
            style={{ height: 200, objectFit: 'fill' }}
            src={`${httpConfig.baseUrl2}${edit?.image}`}
            onClick={() => donwloadQr()}
          /> */}
          <CardBody>
            <Row>
              <Col md='12'>
                <div className='info-container'>
                  <>
                    <ul>
                      <li className='mb-75'>
                        <span className='fw-bolder text-dark me-25'>
                          <>{FM('notification-for')}:</>
                        </span>
                        <span className='d-block  text-wrap'>
                          <>{edit?.notification_for ?? 'N/A'}</>
                        </span>
                      </li>

                      <li className='mb-75'>
                        <span className='fw-bolder text-dark me-25'>
                          <>{FM('notification-subject')}:</>
                        </span>
                        <span className='d-block text-wrap'>
                          <>{edit?.notification_subject ?? 'N/A'}</>
                        </span>
                      </li>
                      <li className='mb-75'>
                        <span className='fw-bolder text-dark me-25'>
                          <>{FM('notification-body')}:</>
                        </span>
                        <span className='d-block  text-wrap'>
                          <>{edit?.notification_body ?? 'N/A'}</>
                        </span>
                      </li>
                    </ul>
                  </>
                </div>
              </Col>
              <Col md='12'>
                <div className='info-container'>
                  <>
                    <ul>
                      <li className='mb-75'>
                        <span className='fw-bolder text-dark me-25'>
                          <>{FM('mail-subject')}:</>
                        </span>
                        <span className='d-block  text-wrap'>
                          <>{edit?.mail_subject ?? 'N/A'}</>
                        </span>
                      </li>
                      <li className='mb-75'>
                        <span className='fw-bolder text-dark me-25'>
                          <>{FM('mail-body')}:</>
                        </span>
                        <span className='d-block  text-wrap'>
                          <>{edit?.mail_body ?? 'N/A'}</>
                        </span>
                      </li>
                      <li className='mb-75'>
                        <span className='fw-bolder text-dark me-25'>
                          <>{FM('route-path')}:</>
                        </span>
                        <span className='d-block  text-wrap'>
                          <a target={'_blank'} href={edit?.route_path} rel='noreferrer'>
                            {edit?.route_path ?? 'N/A'}
                          </a>
                        </span>
                      </li>
                    </ul>
                  </>
                </div>
              </Col>

              {/* <Col md='12'>
                <div className='info-container'>
                  <>
                    <ul>
                      <li className='mb-75'>
                        <span className='fw-bolder text-dark me-25'>
                          <>{FM('usage-limit')}:</>
                        </span>
                        <span className='d-block'>
                          <>{edit?.usage_limit}</>
                        </span>
                      </li>
                      <li className='mb-75'>
                        <span className='fw-bolder text-dark me-25'>
                          <>{FM('usage-limit-per-user')}:</>
                        </span>
                        <span className='d-block'>
                          <>{edit?.usage_limit_per_user}</>
                        </span>
                      </li>
                      <li className='mb-75'>
                        <span className='fw-bolder text-dark me-25'>
                          <>{FM('used')}:</>
                        </span>
                        <span className='d-block'>
                          <>{edit?.used}</>
                        </span>
                      </li>
                    </ul>
                  </>
                </div>
              </Col> */}
              <Col md='12'>
                <div className='info-container'>
                  <>
                    <ul>
                      <li className='mb-75'>
                        <span className='fw-bolder text-dark me-25'>
                          <>{FM('status')}:</>
                        </span>
                        <span className='d-block  text-wrap'>
                          {edit?.status_code === statusCode.success ? (
                            <Badge color={statusCode.success} pill>
                              <>{FM('success')}</>
                            </Badge>
                          ) : edit?.status_code === statusCode.danger ? (
                            <Badge color={statusCode.danger} pill>
                              <>{FM('danger')}</>
                            </Badge>
                          ) : edit?.status_code === statusCode.info ? (
                            <Badge color={statusCode.info} pill>
                              <>{FM('info')}</>
                            </Badge>
                          ) : edit?.status_code === statusCode.warning ? (
                            <Badge color={statusCode.warning} pill>
                              <>{FM('warning')}</>
                            </Badge>
                          ) : (
                            <Badge color={'secondary'} pill>
                              <>{FM('error')}</>
                            </Badge>
                          )}
                        </span>
                      </li>
                      <li className='mb-75'>
                        <span className='fw-bolder text-dark me-25'>
                          <>{FM('custom-attributes')}:</>
                        </span>
                        <span className='d-block  text-wrap'>
                          <>{edit?.custom_attributes}</>
                        </span>
                      </li>
                    </ul>
                  </>
                </div>
              </Col>
            </Row>
          </CardBody>
        </Card>
      </CenteredModal>
    </>
  )
}
