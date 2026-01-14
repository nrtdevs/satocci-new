import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { Col, Row } from 'reactstrap'
import { FM } from '../../../utility/helpers/common'
import Header from '../../components/header'

const TransactionDetail = () => {
  const params = useParams()
  const nav = useNavigate()
  const location = useLocation()
  return (
    <>
      {' '}
      <Header
        onClickBack={() => nav(-1)}
        goBackTo
        titleCol='10'
        childCol='2'
        // goBackTo={getPath('product.list')}
        title={<>{FM('transaction-detail')}</>}
      />
      <div>
        <Row>
          <Col xl={9} md={8} sm={12}></Col>
          <Col xl={3} md={8} sm={12}></Col>
        </Row>
      </div>
    </>
  )
}

export default TransactionDetail
