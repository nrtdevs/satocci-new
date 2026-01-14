import { Fragment, useEffect, useReducer } from 'react'
import { useForm } from 'react-hook-form'
import { useParams } from 'react-router-dom'
import { UserType } from '../../../../utility/Const'
import Show from '../../../../utility/Show'
import { isValid } from '../../../../utility/helpers/common'
import useUser from '../../../../utility/hooks/useUser'
import useUserType from '../../../../utility/hooks/useUserType'
import { stateReducer } from '../../../../utility/stateReducer'
import Activity from './Activity'
import GateKeeperLog from './GateKeeperLog'
// import { ProductParamType } from '../ProductForm'
// import BarcodesList from './BarcodesList'
// import ProductOffer from './ProductOffer'
// import TransactionsList from './TransactionsList'
type States = {
  active?: string
  loading?: boolean
  lastRefresh?: any
  addOffer?: boolean
  activityFilter?: any
}
const ProfileTab = () => {
  const initState: States = {
    active: '1',
    lastRefresh: null,
    loading: false,
    addOffer: false,
    activityFilter: null
  }
  const params = useParams()
  const reducers = stateReducer<States>
  const [state, setState] = useReducer(reducers, initState)
  const form = useForm<any>()
  const { handleSubmit, control, reset, setValue, watch, setError } = form
  //   const [state, setState] = useState(null)
  //   const toggleTab = (tab: any) => {
  //     if (state?.active !== tab) {
  //       setState({ active: tab })
  //     }
  //   }

  const toggleTab = (tab: any) => {
    if (state?.active !== tab) {
      setState({ active: tab })
    }
  }

  useEffect(() => {
    setState({
      activityFilter: {
        user_id: watch('user_id')?.value,
        date_from: watch('date_from'),
        date_to: watch('date_to')
      }
    })
  }, [watch('user_id'), watch('date_from'), watch('date_to')])

  const userType = useUserType()
  const user = useUser()
  return (
    <Fragment>
      <Show
        IF={
          (userType === UserType.Admin || user?.store_id === UserType.Admin) && !isValid(params.id)
        }
      >
        <Activity
          lastRefLoad={state.lastRefresh}
          setLoadingResp={(e) => setState({ loading: e })}
          filterData={state.activityFilter}
        />
      </Show>

      <Show IF={userType === UserType.Store && !isValid(params.id)}>
        <GateKeeperLog
          lastRefLoad={state.lastRefresh}
          setLoadingResp={(e) => setState({ loading: e })}
          filterData={state.activityFilter}
        />
      </Show>
    </Fragment>
  )
}

export default ProfileTab
