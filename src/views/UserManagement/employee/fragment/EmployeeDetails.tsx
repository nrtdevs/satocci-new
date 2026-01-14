import { useEffect, useReducer } from 'react'
import { useParams } from 'react-router-dom'
import { Col, Row } from 'reactstrap'
import {
  adminEmpReqParams,
  useLoadAdminEmployeeDetailsByIdMutation
} from '../../../../redux/RTKQuery/AdminEmployeeRTK'
import { forDecryption } from '../../../../utility/Const'
import { decrypt, decryptObject } from '../../../../utility/Utils'
import { stateReducer } from '../../../../utility/stateReducer'
import Header from '../../../components/header'
import EmployeeDetailsCard from './EmployeeDetailsCard'
import EmployeeInfoCard from './EmployeeInfoCard'

interface States {
  admEmpData?: adminEmpReqParams
}

const EmployeeDetails = () => {
  const params = useParams()
  const initState: States = {
    admEmpData: undefined
  }

  const reducers = stateReducer<States>
  const [state, setState] = useReducer(reducers, initState)
  const [loadAdmEmpDetailsById, { data, isError, isLoading, isSuccess }] =
    useLoadAdminEmployeeDetailsByIdMutation()
  const admEmpData = state?.admEmpData

  const loadData = () => {
    loadAdmEmpDetailsById({
      id: params?.id
    })
  }
  const reloadData = () => {
    loadData()
  }

  useEffect(() => {
    loadData()
  }, [])

  useEffect(() => {
    if (isSuccess) {
      setState({
        admEmpData: data?.payload
      })
    }
  }, [data])

  return (
    <div className='app-user-view'>
      <Header goBackTo onClickBack={() => history.go(-1)} title={decrypt(`${admEmpData?.name}`)}>
        {/* <ButtonGroup color='dark'>
          <LoadingButton
            tooltip={FM('reload')}
            size='sm'
            color='dark'
            onClick={reloadData}
            loading={isLoading}
          >
            <RefreshCcw size='14' />
          </LoadingButton>
        </ButtonGroup> */}
      </Header>
      <Row className='g-1'>
        <Col xl='3' lg='3' xs={{ order: 0 }} md={{ order: 1, size: 4 }}>
          <EmployeeInfoCard
            loading={isLoading}
            details={decryptObject(forDecryption, admEmpData)}
          />
        </Col>
        <Col xl='9' lg='9' xs={{ order: 1 }} md={{ order: 0, size: 7 }}>
          <EmployeeDetailsCard
            loading={isLoading}
            details={decryptObject(forDecryption, admEmpData)}
          />
        </Col>
      </Row>
    </div>
  )
}

export default EmployeeDetails
