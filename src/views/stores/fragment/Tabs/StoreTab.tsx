// ** React Imports
// ** Icons Imports
import { Info, Plus, RefreshCcw, Upload } from 'react-feather'
// ** Reactstrap Imports
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

import { Fragment, useReducer, useRef, useState } from 'react'
import { useParams } from 'react-router-dom'
import { getPath } from '../../../../router/RouteHelper'
import Emitter from '../../../../utility/Emitter'
import { FM, log } from '../../../../utility/helpers/common'
import Show from '../../../../utility/Show'
import { stateReducer } from '../../../../utility/stateReducer'
import BsTooltip from '../../../components/tooltip'
import TooltipLink from '../../../components/tooltip/TooltipLink'
import Products, { forRefType } from '../../../ProductManagement'
import { ProductParamType } from '../../../ProductManagement/fragment/ProductForm'
import ProductImportModal from '../../../ProductManagement/fragment/ProductImportModal'
import TransactionChart from '../../../Reports/SingleReport/Charts/TransactionChart'
import { StoreParamsType } from '../AddUpdateForm'
//import TransactionChart from '../../../Reports/SingleReport/Charts/TransactionChart'

type StoreTabProps = {
  details?: StoreParamsType
  step: string
  vertical?: boolean
}
interface States {
  lastRefresh?: any
  page?: any
  productFilter?: boolean
  per_page_record?: any
  search?: any
  reload?: any
  isRemoving?: boolean
  isReloading?: boolean
  isAddingNewData?: boolean

  filterData?: ProductParamType
}
const StoreTab = ({ vertical = false, details, step = '1' }: StoreTabProps) => {
  const [active, setActive] = useState(step)
  const ref = useRef<forRefType>()
  const Params = useParams()

  const storeId = Params?.id
  const initState: States = {
    lastRefresh: null,
    page: 1,
    per_page_record: 100,
    search: undefined
  }
  const reducers = stateReducer<States>
  const [state, setState] = useReducer(reducers, initState)
  const toggleTab = (tab: any) => {
    if (active !== tab) {
      setActive(tab)
    }
  }
  // const reloadData = () => {
  //   setState({ isAddingNewData: false })
  //   dispatch(
  //     ProductManagement.util.invalidateTags([
  //       { type: 'Product', id: 'LIST' },
  //       { type: 'Product', id: 'NEXT-LIST' }
  //     ])
  //   )
  // }
  log('DTSLS', details?.store_id)
  return (
    <Fragment>
      <Card className=''>
        <CardHeader className='p-1 border-bottom'>
          <div className='flex-1'>
            <Row className='d-flex justify-content-between aligned-items-center'>
              <Col md='6' className=''>
                <Nav pills className={`mb-0 ${vertical ? 'nav-left' : 'flex-column flex-sm-row '}`}>
                  <NavItem>
                    <NavLink active={active === '1'} onClick={() => toggleTab('1')}>
                      <Info className='font-medium-3  me-50' />
                      <span className='fw-bold'>
                        <>{FM('products')}</>
                      </span>
                    </NavLink>
                  </NavItem>
                  {/* <NavItem>
                    <NavLink active={active === '2'} onClick={() => toggleTab('2')}>
                      <TrendingUp className='font-medium-3  me-50' />
                      <span className='fw-bold'>
                        <>{FM('transactions')}</>
                      </span>
                    </NavLink>
                  </NavItem> */}
                  <NavItem>
                    <NavLink active={active === '3'} onClick={() => toggleTab('3')}>
                      <Info className='font-medium-3  me-50' />
                      <span className='fw-bold'>
                        <>{FM('stats')}</>
                      </span>
                    </NavLink>
                  </NavItem>
                </Nav>
              </Col>

              <Col md='6' className='d-flex align-items-start pt-50 justify-content-end'>
                <Show IF={active === '1'}>
                  <ButtonGroup className='me-1'>
                    <ProductImportModal<ButtonProps>
                      active={active === '1'}
                      Tag={Button}
                      className='btn btn-primary btn-sm'
                      size='sm'
                      color='primary'
                      // title={FM('import')}
                    >
                      <BsTooltip title={FM('import')}>
                        <>
                          <Upload size='14' />
                          <span className='align-middle ms-25'>{FM('import')}</span>
                        </>
                      </BsTooltip>
                    </ProductImportModal>
                  </ButtonGroup>
                </Show>
                <ButtonGroup color='dark'>
                  <Show IF={active === '1'}>
                    <TooltipLink
                      title={<>{FM('create-new')}</>}
                      to={getPath('product.create.parent', { parentId: storeId })}
                      className='btn btn-primary btn-sm'
                    >
                      <Plus size='14' />
                    </TooltipLink>
                  </Show>
                  <BsTooltip<ButtonProps>
                    Tag={Button}
                    onClick={() => {
                      // ref.current?.reloadData()
                      // ref.current?.filterData({})
                      if (active === '1') {
                        Emitter.emit('testingEmitter', { testing: 'emit' })
                      }

                      if (active === '3') {
                        setState({
                          lastRefresh: new Date().getTime()
                        })
                      }
                    }}
                    size='sm'
                    color='dark'
                    title={FM('reload')}
                  >
                    <RefreshCcw size='14' />
                  </BsTooltip>
                </ButtonGroup>
              </Col>
            </Row>
          </div>
        </CardHeader>

        <CardBody className='p-0'>
          <TabContent activeTab={active}>
            <TabPane tabId='1'>
              <Products
                ref={(e: forRefType) => (ref.current = e)}
                hideHeader
                subCatStoreID={storeId}
              />
            </TabPane>
            {/* <TabPane tabId='2'>
              <TransactrionDetails details={null} />
            </TabPane> */}
            <TabPane tabId='3'>
              <TransactionChart
                lastRefresh={state.lastRefresh}
                storeId={details?.id}
                details={details}
              />
            </TabPane>
          </TabContent>
        </CardBody>
      </Card>
    </Fragment>
  )
}
export default StoreTab
