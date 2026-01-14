import { useSelector } from 'react-redux'
import { Card, CardBody, CardHeader, CardTitle, Col, Row } from 'reactstrap'
import Hide from '../../../utility/Hide'
import Show from '../../../utility/Show'

const Info = ({ info }) => {
  const user = useSelector((state) => state.auth.userData)
  // const [info, setInfo] = useState(null)
  // const [loading, setLoading] = useState(false)

  // const getInfo = () => {
  //     appSettingForAdmin({
  //         // perPage: 1000,
  //         loading: setLoading,
  //         // dispatch,
  //         success: (e) => {
  //             setInfo(e?.data)
  //         }
  //     })
  // }

  // useEffect(() => {
  //     getInfo()
  // }, [])

  // log(info)

  return (
    <>
      <Card>
        <CardHeader className='border-bottom'>
          <CardTitle tag='h4'>Profile Details</CardTitle>
        </CardHeader>
        <Show IF={user?.userType === 0}>
          <CardBody className='py-2 my-25'>
            <Row className='align-items-start gy-2'>
              <Col md='3'>
                <p className='mb-0 text-dark fw-bolder'>App Name</p>
                <p className='mb-0 fw-bold text-secondary'>{info?.app_name}</p>
              </Col>
              <Col md='3'>
                <p className='mb-0 text-dark fw-bolder'>Contact Number</p>
                <p className='mb-0 fw-bold text-secondary'>{info?.contact_number}</p>
              </Col>
              <Col md='3'>
                <p className='mb-0 text-dark fw-bolder'>Contact Email</p>
                <p className='mb-0 fw-bold text-secondary'>{info?.contact_email}</p>
              </Col>
              <Col md='3'>
                <p className='mb-0 text-dark fw-bolder'>Contact Address</p>
                <p className='mb-0 fw-bold text-secondary'>{info?.contact_address}</p>
              </Col>
            </Row>
            <Row className='border-top pt-2 mt-2 gy-2'>
              <Col md='3'>
                <p className='mb-0 text-dark fw-bolder'>File Generation</p>
                <p className='mb-0 fw-bold text-secondary'>{info?.file_gen_if_exceed}</p>
              </Col>
              <Col md='3'>
                <p className='mb-0 text-dark fw-bolder'>Order Start</p>
                <p className='mb-0 fw-bold text-secondary'>{info?.order_no_start}</p>
              </Col>
              <Col md='3'>
                <p className='mb-0 text-dark fw-bolder'>Tax Percentage</p>
                <p className='mb-0 fw-bold text-secondary'>{info?.tax_percentage}</p>
              </Col>
            </Row>
          </CardBody>
        </Show>
        <Hide IF={user?.userType === 0}>
          <CardBody className='py-2 my-25'>
            <Row className='align-items-start gy-2'>
              <Col md='3'>
                <p className='mb-0 text-dark fw-bolder'>Name</p>
                <p className='mb-0 fw-bold text-secondary'>{user?.name}</p>
              </Col>
              <Col md='3'>
                <p className='mb-0 text-dark fw-bolder'>Contact Number</p>
                <p className='mb-0 fw-bold text-secondary'>{user?.mobile}</p>
              </Col>
              <Col md='3'>
                <p className='mb-0 text-dark fw-bolder'>Company Name</p>
                <p className='mb-0 fw-bold text-secondary'>{user?.companyName}</p>
              </Col>
              <Col md='3'>
                <p className='mb-0 text-dark fw-bolder'>Contact Address</p>
                <p className='mb-0 fw-bold text-secondary'>{user?.address}</p>
              </Col>
            </Row>
            <Row className='border-top pt-2 mt-2 gy-2'>
              <Col md='3'>
                <p className='mb-0 text-dark fw-bolder'>Website Url</p>
                <p className='mb-0 fw-bold text-secondary'>{user?.websiteUrl}</p>
              </Col>
              <Col md='3'>
                <p className='mb-0 text-dark fw-bolder'>City</p>
                <p className='mb-0 fw-bold text-secondary'>
                  {user?.city}, {user?.zipCode}
                </p>
              </Col>
              <Col md='3'>
                <p className='mb-0 text-dark fw-bolder'>Designation</p>
                <p className='mb-0 fw-bold text-secondary'>{user?.designation}</p>
              </Col>
              <Col md='3'>
                <p className='mb-0 text-dark fw-bolder'>Locktimeout</p>
                <p className='mb-0 fw-bold text-secondary'>{user?.locktimeout}</p>
              </Col>
            </Row>
          </CardBody>
        </Hide>
      </Card>
    </>
  )
}

export default Info
