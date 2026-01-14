import BarChartIcon from '@mui/icons-material/BarChart'
import ListAltIcon from '@mui/icons-material/ListAlt'
import LocalOfferIcon from '@mui/icons-material/LocalOffer'
import QrCodeIcon from '@mui/icons-material/QrCode'
import { Fragment, useReducer } from 'react'
import { Plus, RefreshCcw, Sliders, X } from 'react-feather'
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
import { UserType } from '../../../../utility/Const'
import { FM } from '../../../../utility/helpers/common'
import Hide from '../../../../utility/Hide'
import useUser from '../../../../utility/hooks/useUser'
import useUserType from '../../../../utility/hooks/useUserType'
import Show from '../../../../utility/Show'
import { stateReducer } from '../../../../utility/stateReducer'
import LoadingButton from '../../../components/buttons/LoadingButton'
import BsTooltip from '../../../components/tooltip'
import { ProductParamType, ProductVariantsType } from '../ProductForm'
import BarcodesList from './BarcodesList'
import ProductOffer from './ProductOffer'
import ProductStats from './ProductStats'
import TransactionsList from './TransactionsList'
type theProps = {
  details?: ProductVariantsType
  step: string
  loadProduct?: () => void
  loading?: boolean
}
type States = {
  active?: string
  addOffer?: boolean
  filterTransaction?: boolean
}
const ProductDetailsTab = ({ details, loadProduct = () => {}, loading = false }: theProps) => {
  const initState: States = {
    active: '1',
    addOffer: false,
    filterTransaction: false
  }
  const reducers = stateReducer<States>
  const [state, setState] = useReducer(reducers, initState)
  const userType = useUserType()

  const toggleTab = (tab: any) => {
    if (state?.active !== tab) {
      setState({ active: tab })
    }
  }

  const user = useUser()

  const toggleOfferAdd = () => {
    setState({ addOffer: !state.addOffer })
  }
  const toggleTransaction = () => {
    setState({ filterTransaction: !state.filterTransaction })
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
                      <QrCodeIcon className='font-medium-3  me-50' />
                      <span className='fw-bold'>
                        <>{FM('barcode')}</>
                      </span>
                    </NavLink>
                  </NavItem>
                  <Hide IF={userType === UserType.Admin || user?.store_id === UserType.Admin}>
                    <NavItem>
                      <NavLink active={state.active === '2'} onClick={() => toggleTab('2')}>
                        <ListAltIcon className='font-medium-3  me-50' />
                        <span className='fw-bold'>
                          <>{FM('transactions')}</>
                        </span>
                      </NavLink>
                    </NavItem>
                  </Hide>
                  <NavItem>
                    <NavLink active={state.active === '3'} onClick={() => toggleTab('3')}>
                      <LocalOfferIcon className='font-medium-3  me-50' />
                      <span className='fw-bold'>
                        <>{FM('offer')}</>
                      </span>
                    </NavLink>
                  </NavItem>
                  <Hide IF={userType === UserType.Admin || user?.store_id === UserType.Admin}>
                    <NavItem>
                      <NavLink active={state.active === '4'} onClick={() => toggleTab('4')}>
                        <BarChartIcon className='font-medium-3  me-50' />
                        <span className='fw-bold'>
                          <>{FM('stats')}</>
                        </span>
                      </NavLink>
                    </NavItem>
                  </Hide>
                </Nav>
              </Col>
              <Show IF={state.active === '2'}>
                <Col md='1' className='d-flex align-items-start justify-content-end'>
                  <ButtonGroup color='dark'>
                    <LoadingButton
                      tooltip={FM('reload')}
                      size='sm'
                      color='dark'
                      onClick={loadProduct}
                      loading={loading}
                    >
                      <RefreshCcw size='14' />
                    </LoadingButton>
                    <BsTooltip<ButtonProps>
                      Tag={Button}
                      color={state?.filterTransaction ? 'danger' : 'primary'}
                      className='btn-icon'
                      title={FM('filter')}
                      onClick={toggleTransaction}
                    >
                      {state?.filterTransaction ? <X size={16} /> : <Sliders size={16} />}
                    </BsTooltip>
                  </ButtonGroup>
                </Col>
              </Show>
              <Show IF={state.active === '3'}>
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
            <Hide IF={userType === UserType.Admin || user?.store_id === UserType.Admin}>
              <TabPane tabId='2'>
                <TransactionsList
                  loading={loading}
                  details={details}
                  filterTransaction={state?.filterTransaction}
                  closeForm={() => {
                    toggleTransaction()
                  }}
                />
              </TabPane>
            </Hide>
            <TabPane tabId='1'>
              <BarcodesList loading={loading} details={details} />
            </TabPane>
            <Hide IF={userType === UserType.Admin || user?.store_id === UserType.Admin}>
              <TabPane tabId='4'>
                <ProductStats loading={loading} details={details} />
              </TabPane>
            </Hide>
            <TabPane tabId='3'>
              <ProductOffer
                loading={loading}
                closeForm={() => {
                  //   loadProduct()
                  toggleOfferAdd()
                }}
                addOffer={state?.addOffer}
                details={details}
              />
            </TabPane>
          </TabContent>
        </CardBody>
      </Card>
    </Fragment>
  )
}

export default ProductDetailsTab
