import { Badge, Card, CardBody, Col, Row } from 'reactstrap'
import { adminEmpReqParams } from '../../../../redux/RTKQuery/AdminEmployeeRTK'
import { JsonParseValidate, formatDate, maskNumber } from '../../../../utility/Utils'
import { FM } from '../../../../utility/helpers/common'
import Shimmer from '../../../components/shimmers/Shimmer'
interface EmployeeInfoType {
  details?: adminEmpReqParams
  loading?: boolean
  slice?: any
}
export default function EmployeeDetailsCard({ details, loading = false }: EmployeeInfoType) {
  const country = JsonParseValidate(details?.country)
  const str = `${details?.personal_number}`
  const res = maskNumber({ str, len: -8 })

  return (
    <>
      <div>
        {!loading ? (
          <>
            <Card>
              <CardBody className=''>
                <h4 className='border-bottom  pb-1'>{FM('contact-details')}</h4>
                <Row className='align-items-start gy-2'>
                  <Col md='4'>
                    <span className='mb-0 text-dark fw-bolder'>{FM('mobile-number')}</span>
                    <p className='mb-0 fw-bold text-secondary'>
                      {`${details?.mobile_number}` ?? 'N/A'}
                    </p>
                  </Col>
                  <Col md='4'>
                    <span className='h5 text-dark fw-bolder'>{FM('personal-number')}</span>
                    <p className='mb-0 fw-bold text-secondary'>
                      {maskNumber({ str, len: -8 }) ?? 'N/A'}
                    </p>
                  </Col>
                  <Col md='4'>
                    <span className='mb-0 text-dark fw-bolder'>{FM('role')}</span>
                    <p className='mb-0 fw-bold text-secondary'>
                      {details?.roles?.map((d: any, i: any) => {
                        return <>{d?.se_name}</>
                      })}
                    </p>
                  </Col>
                </Row>
              </CardBody>

              <CardBody>
                <h4 className='border-bottom pb-1'>{FM('full-address-details')}</h4>
                <Row className='align-items-start gy-2'>
                  <Col md='4'>
                    <span className='mb-0 text-dark fw-bolder'>{FM('address')}</span>
                    <p className='mb-0 fw-bold text-secondary'>{`${details?.address}` ?? 'N/A'}</p>
                  </Col>
                  <Col md='4'>
                    <span className='h5 text-dark fw-bolder'>{FM('postal-area')}</span>
                    <p className='mb-0 fw-bold text-secondary'>{details?.postal_area ?? 'N/A'}</p>
                  </Col>
                  <Col md='4'>
                    <span className='mb-0 text-dark fw-bolder'>{FM('zip-code')}</span>
                    <p className='mb-0 fw-bold text-secondary'>{details?.zip_code ?? 'N/A'}</p>
                  </Col>
                  <Col md='4'>
                    <span className='mb-0 text-dark fw-bolder'>{FM('city')}</span>
                    <p className='mb-0 fw-bold text-secondary'>{details?.city ?? 'N/A'}</p>
                  </Col>
                  <Col md='4'>
                    <span className='mb-0 text-dark fw-bolder'>{FM('country')}</span>
                    <p className='mb-0 fw-bold text-secondary'>{details?.country?.name}</p>
                  </Col>
                  <Col md='4'>
                    <span className='mb-0 text-dark fw-bolder'>{FM('created-date')}</span>
                    <p className='mb-0 fw-bold text-secondary'>
                      <Badge color='primary'>{formatDate(details?.created_at) ?? 'N/A'}</Badge>
                    </p>
                  </Col>
                </Row>
              </CardBody>
            </Card>
          </>
        ) : (
          <>
            <Card>
              <CardBody className=''>
                <Row className='align-items-start gy-2'>
                  <Col md='4'>
                    <Shimmer height={30} />
                  </Col>
                  <Col md='4'>
                    <Shimmer height={30} />
                  </Col>
                  <Col md='4'>
                    <Shimmer height={30} />
                  </Col>
                </Row>
              </CardBody>

              <CardBody>
                <Row className='align-items-start gy-2'>
                  <Col md='4'>
                    <Shimmer height={30} />
                  </Col>
                  <Col md='4'>
                    <Shimmer height={30} />
                  </Col>
                  <Col md='4'>
                    <Shimmer height={30} />
                  </Col>
                  <Col md='4'>
                    <Shimmer height={30} />
                  </Col>
                  <Col md='4'>
                    <Shimmer height={30} />
                  </Col>
                  <Col md='4'>
                    <Shimmer height={30} />
                  </Col>
                </Row>
              </CardBody>
            </Card>
          </>
        )}
      </div>
    </>
  )
}
