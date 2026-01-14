/* eslint-disable eqeqeq */
import { useEffect, useState } from 'react'
import { Card, CardBody, Col, Row } from 'reactstrap'
import { sendType } from '../../../utility/Const'
import createDOMPurify from 'dompurify'
import { FM, log } from '../../../utility/helpers/common'
import { getKeyByValue } from '../../../utility/Utils'

import CenteredModal from '../../components/modal/CenteredModal'
import { PromotionParamsType } from './PromotionTemplateForm'

export type CategoryParamsType = {
  id?: string
  name: string
  status?: string
  patent_id?: string
}
interface dataType {
  edit?: PromotionParamsType
  response?: (e: boolean) => void
  noView?: boolean
  showModal?: boolean
  setShowModal?: (e: boolean) => void
  Component?: any
  loading?: boolean
  children?: any
  allData?: any
  isView?: boolean
}

export default function PromotionDetailModal<T>(props: T & dataType) {
  const {
    edit = null,
    noView = false,
    showModal = false,
    isView = false,
    allData,
    setShowModal = () => {},
    Component = 'span',
    response = () => {},
    children = null,
    ...rest
  } = props
  const DOMPurify = createDOMPurify(window)
  const [open, setOpen] = useState(false)

  const openModal = () => {
    setOpen(true)
  }
  const closeModal = (from = null) => {
    setOpen(false)
    setShowModal(false)
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
        hideSave
        disableFooter
        scrollControl={true}
        modalClass='modal-md'
        loading={false}
        open={open}
        handleModal={closeModal}
        title={
          allData
            ? FM(getKeyByValue(sendType, Number(allData?.map((a: any) => a?.type))))
            : FM(getKeyByValue(sendType, edit?.content_type))
        }
      >
        <Card className='p-0'>
          <CardBody>
            <Row>
              {allData ? (
                allData?.map((logData: any) => (
                  <>
                    <Col md='6'>
                      <span className='fw-bolder text-dark me-25'>
                        <>{FM('send-type')}:</>
                      </span>
                      <span className='d-block text-capitalize'>
                        <>{FM(getKeyByValue(sendType, Number(logData?.type)) ?? 'N/A')}</>
                      </span>
                    </Col>
                    <Col md='6' className='mb-2'>
                      <span className='fw-bolder text-dark me-25'>
                        <>{FM('content-header')}:</>
                      </span>
                      <span className='d-block'>
                        <>{logData?.title ?? 'N/A'}</>
                      </span>
                    </Col>
                    <Col md='12'>
                      <span className='fw-bolder text-dark me-25'>
                        <>{FM('content-body')}:</>
                      </span>
                      <span className='d-block'>
                        <div
                          dangerouslySetInnerHTML={{
                            __html: DOMPurify.sanitize(logData?.message)
                          }}
                        />
                      </span>
                    </Col>
                  </>
                ))
              ) : (
                <>
                  <Col md='6'>
                    <span className='fw-bolder text-dark me-25'>
                      <>{FM('send-type')}:</>
                    </span>
                    <span className='d-block text-capitalize'>
                      <>{FM(getKeyByValue(sendType, edit?.content_type) ?? 'N/A')}</>
                    </span>
                  </Col>
                  <Col md='6' className='mb-2'>
                    <span className='fw-bolder text-dark me-25'>
                      <>{FM('content-header')}:</>
                    </span>
                    <span className='d-block'>
                      <>{edit?.content_header ?? 'N/A'}</>
                    </span>
                  </Col>
                  <Col md='12'>
                    <span className='fw-bolder text-dark me-25'>
                      <>{FM('content-body')}:</>
                    </span>
                    <span className='d-block'>
                      <div
                        dangerouslySetInnerHTML={{
                          __html: DOMPurify.sanitize(edit?.content_body)
                        }}
                      />
                    </span>
                  </Col>
                </>
              )}
            </Row>
          </CardBody>
        </Card>
      </CenteredModal>
    </>
  )
}
