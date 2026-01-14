// import { Routes } from '../../../router'
import classNames from 'classnames'
import { useEffect, useState } from 'react'
import { ArrowLeft } from 'react-feather'
import { useNavigate } from 'react-router-dom'
import { Col, Row } from 'reactstrap'
import {
  useCheckStripeCurrentStatusMutation,
  useConnectStripeMutation
} from '../../../redux/RTKQuery/AppSettingsRTK'
import Hide from '../../../utility/Hide'
import { FM, isValid, log } from '../../../utility/helpers/common'
import useUser from '../../../utility/hooks/useUser'
import LoadingButton from '../buttons/LoadingButton'
import CenteredModal from '../modal/CenteredModal'
import { useNoViewModal } from '../modal/HandleModal'

interface HeaderProps {
  title: string | any
  children?: JSX.Element | JSX.Element[] | null
  titleCol?: string
  childCol?: string
  subHeading?: any
  icon?: any
  loading?: boolean
  description?: string | null
  noHeader?: boolean
  goBackTo?: string | boolean
  onClickBack?: () => void
  rowClass?: string
}
const Header = ({
  title,
  goBackTo,
  loading = false,
  onClickBack = () => {},
  children = null,
  titleCol = '7',
  childCol = '5',
  subHeading = null,
  icon = null,
  rowClass = 'mb-2',
  description = null,
  noHeader = false
}: HeaderProps) => {
  const navigation = useNavigate()
  const user = useUser()
  const [loadingx, setLoadingx] = useState(false)
  const [modal, setModal] = useNoViewModal()
  const [connectStripe, connect] = useConnectStripeMutation()
  const [currentStatus, status] = useCheckStripeCurrentStatusMutation()

  // useEffect(() => {
  //   if (user?.top_most_store_id) {
  //     currentStatus({
  //       id: user?.top_most_store_id
  //     })
  //   }
  // }, [user?.top_most_store_id])

  useEffect(() => {
    if (user?.is_connected_to_stripe === false) {
      if (status?.data) {
        log(status?.data)
        if (status?.data?.payload?.current_status === '4') {
          setModal()
        }
      }
    }
  }, [status.data, user])

  // handle connect stripe response
  useEffect(() => {
    if (connect.data) {
      setLoadingx(false)
      setModal()
      window.open(connect?.data?.payload?.url, '_blank')
    }
  }, [connect.data])

  return (
    <>
      <CenteredModal
        scrollControl={false}
        modalClass='modal-sm'
        loading={false}
        open={modal}
        hideSave
        disableFooter
        handleModal={setModal}
        // handleSave={handleSubmit(handleSave)}
        title={FM('stripe-connect')}
      >
        <div className='p-2 text-center'>
          <p>{FM('stripe-connect-msg')}</p>
          <LoadingButton color='primary' onClick={connectStripe} loading={loadingx}>
            Connect
          </LoadingButton>
        </div>
      </CenteredModal>
      <Row className={`align-items-center ${rowClass}`}>
        <Hide IF={noHeader}>
          <Col md={titleCol} className='d-flex align-items-center'>
            <h2
              role={'button'}
              onClick={() => {
                goBackTo !== true
                  ? isValid(goBackTo)
                    ? navigation(String(goBackTo))
                    : onClickBack()
                  : onClickBack()
              }}
              className={classNames('content-header-title float-left mb-0 text-primary', {
                'border-end-0': !subHeading
              })}
            >
              {goBackTo ? <ArrowLeft size='25' /> : icon ? icon : null}{' '}
              <span className='align-middle text-capitalize'>{title}</span>
            </h2>
            <div className=' ms-1 p-0 mb-0'>{subHeading}</div>
          </Col>
        </Hide>
        <Col
          md={noHeader ? '12' : childCol}
          className={`py-1 py-md-0 d-flex ${
            noHeader ? '' : 'justify-content-md-end'
          } justify-content-start`}
        >
          {children}
        </Col>
        {description ? (
          <Col md='12' className='mt-1'>
            {description}
          </Col>
        ) : null}
      </Row>
    </>
  )
}

// Header.propTypes = {
//   title: PropTypes.string
// }

export default Header
