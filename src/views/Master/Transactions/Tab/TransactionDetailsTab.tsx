import { Fragment, useReducer } from 'react'
import { Printer } from 'react-feather'
import {
  Card,
  CardBody,
  CardHeader,
  Col,
  Nav,
  NavItem,
  NavLink,
  Row,
  TabContent,
  TabPane
} from 'reactstrap'
import { FM } from '../../../../utility/helpers/common'
import { stateReducer } from '../../../../utility/stateReducer'
import Invoice from './invoice'
type theProps = {
  details?: any
  step: string
  loadProduct?: () => void
  loading?: boolean
}
type States = {
  active?: string
  addOffer?: boolean
}
const TransactionDetails = ({ details, loadProduct = () => {}, loading = false }: theProps) => {
  const initState: States = {
    active: '1',
    addOffer: false
  }
  const reducers = stateReducer<States>
  const [state, setState] = useReducer(reducers, initState)

  const toggleTab = (tab: any) => {
    if (state?.active !== tab) {
      setState({ active: tab })
    }
  }

  const toggleOfferAdd = () => {
    setState({ addOffer: !state.addOffer })
  }
  return (
    <Fragment>
      <Invoice details={details} />
    </Fragment>
  )
}

export default TransactionDetails
