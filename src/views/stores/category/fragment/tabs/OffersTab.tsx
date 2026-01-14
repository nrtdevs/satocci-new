import ListAltIcon from '@mui/icons-material/ListAlt'
import { Fragment, useReducer } from 'react'
import { Plus, X } from 'react-feather'
import {
  Button,
  ButtonGroup,
  ButtonProps,
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
import { FM } from '../../../../../utility/helpers/common'
import Hide from '../../../../../utility/Hide'
import useUser from '../../../../../utility/hooks/useUser'
import Show from '../../../../../utility/Show'
import { stateReducer } from '../../../../../utility/stateReducer'
import Shimmer from '../../../../components/shimmers/Shimmer'
import BsTooltip from '../../../../components/tooltip'
import { CategoryParamsType } from '../../CategoryAddForm'
import Offers from './Offers'

type States = {
  active?: string
  addOffer?: boolean
  cat?: CategoryParamsType
}
const OffersTab = ({
  cat,
  loading = false,
  loadRes
}: {
  cat: CategoryParamsType
  loading: boolean

  loadRes: () => void
}) => {
  const initState: States = {
    active: '1',
    addOffer: false
  }
  const user = useUser()
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
      <Card>
        <CardHeader className='p-1 border-bottom'>
          <div className='flex-1'>
            <Row className='d-flex justify-content-between aligned-items-center'>
              <Col md='11' className=''>
                <Nav pills className={`mb-0 flex-column flex-sm-row`}>
                  <NavItem>
                    <NavLink active={state.active === '1'} onClick={() => toggleTab('1')}>
                      <ListAltIcon className='font-medium-3  me-50' />
                      <span className='fw-bold'>
                        <>{FM('offers')}</>
                      </span>
                    </NavLink>
                  </NavItem>
                </Nav>
              </Col>
              <Show IF={state.active === '1' && cat?.store_id === user?.store_id}>
                <Col md='1' className='d-flex align-items-start justify-content-end'>
                  <ButtonGroup color='dark'>
                    <BsTooltip<ButtonProps>
                      Tag={Button}
                      color={state?.addOffer ? 'danger' : 'primary'}
                      className='btn-icon'
                      title={FM('add-offer')}
                      onClick={toggleOfferAdd}
                    >
                      {state?.addOffer ? <X size={16} /> : <Plus size={16} />}
                    </BsTooltip>
                  </ButtonGroup>
                </Col>
              </Show>
            </Row>
          </div>
        </CardHeader>
        <CardBody className='p-0'>
          <TabContent activeTab={state.active}>
            <TabPane tabId='1'>
              <Show IF={loading}>
                <Shimmer />
              </Show>
              <Hide IF={loading}>
                <Offers
                  closeForm={() => {
                    setState({ addOffer: false })
                    loadRes()
                  }}
                  details={cat}
                  addOffer={state?.addOffer}
                />
              </Hide>
            </TabPane>
          </TabContent>
        </CardBody>
      </Card>
    </Fragment>
  )
}

export default OffersTab
