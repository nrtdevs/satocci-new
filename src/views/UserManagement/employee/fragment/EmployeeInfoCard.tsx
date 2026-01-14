// ** React Imports
// ** Custom Components

import { Fragment, useEffect, useReducer } from 'react'
// ** Reactstrap Imports
import { Card, CardBody } from 'reactstrap'
import { adminEmpReqParams } from '../../../../redux/RTKQuery/AdminEmployeeRTK'
import { forDecryption } from '../../../../utility/Const'
import { decryptObject } from '../../../../utility/Utils'
import { FM, log } from '../../../../utility/helpers/common'
import { stateReducer } from '../../../../utility/stateReducer'
import Shimmer from '../../../components/shimmers/Shimmer'
interface States {
  category?: boolean
  subcategory?: boolean
  ip?: boolean
  patient?: boolean
  loading?: boolean
  text?: string
  loadingDetails?: boolean
  list?: any
  user?: any
}
interface EmployeeInfoType {
  details?: adminEmpReqParams
  loading?: boolean
}
const EmployeeInfoCard = ({ details, loading = false }: EmployeeInfoType) => {
  const initState: States = {
    category: false,
    subcategory: false,
    ip: false,
    patient: false,
    loading: false,
    text: '',
    list: [],
    user: null,
    loadingDetails: true
  }
  const reducers = stateReducer<States>
  const [state, setState] = useReducer(reducers, initState)

  useEffect(() => {
    if (details !== null) {
      setState({
        user: decryptObject(forDecryption, details),
        loadingDetails: false
      })
    }
  }, [details])

  log('emp details', details)
  return (
    <Fragment>
      {!loading ? (
        <>
          <Card className='mb-0 h-70'>
            {/* <CardImg
              top
              src={'https://picsum.photos/200/300'}
              style={{ height: 200, objectFit: 'cover' }}
              alt='card-top'
            /> */}
            <CardBody>
              <div className='info-container'>
                {state?.user !== null ? (
                  <>
                    <ul className='list-unstyled'>
                      <li className='mb-75 mt-1'>
                        <span className='fw-bolder text-dark me-25'>
                          <>{FM('name')}:</>
                        </span>
                        <span className='d-block mb-1'>
                          <>{state?.user?.name ?? 'N/A'}</>
                        </span>
                        <span className='fw-bolder text-dark me-25 mt-1'>
                          <>{FM('email-address')}:</>
                        </span>
                        <span className='d-block'>
                          <>{state?.user?.email ?? 'N/A'}</>
                        </span>
                      </li>
                    </ul>
                  </>
                ) : null}
              </div>
            </CardBody>
          </Card>
        </>
      ) : (
        <>
          <Card className='mb-0 h-100'>
            {/* <Shimmer height={200} /> */}
            <CardBody>
              <div className='info-container'>
                <ul className='list-unstyled'>
                  <li className='mb-75'>
                    <span className='d-block'>
                      <Shimmer height={30} />
                    </span>
                    <span className='fw-bolder text-dark me-25'>
                      <Shimmer height={30} />
                    </span>
                    <span className='d-block'>
                      <Shimmer height={30} />
                    </span>
                  </li>
                </ul>
              </div>
            </CardBody>
          </Card>
        </>
      )}
    </Fragment>
  )
}

export default EmployeeInfoCard
