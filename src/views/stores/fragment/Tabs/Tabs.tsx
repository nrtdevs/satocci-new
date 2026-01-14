// ** React Imports
// ** Icons Imports
import { Info, Rewind, TrendingUp } from 'react-feather'
// ** Reactstrap Imports
import { Nav, NavItem, NavLink, TabContent, TabPane } from 'reactstrap'

import { Fragment, useState } from 'react'
import { Link } from 'react-router-dom'
import { getPath } from '../../../../router/RouteHelper'
import { FM } from '../../../../utility/helpers/common'
import TransactionChart from '../../../Reports/SingleReport/Charts/TransactionChart'
import TransactrionDetails from './Steps/TransactrionDetails'

const Tabs = ({ vertical = false, user = null, step = '1', cashier = null }) => {
  const [active, setActive] = useState(step)

  const toggleTab = (tab: any) => {
    if (active !== tab) {
      setActive(tab)
    }
  }

  // className={` p-25  ${vertical ? 'nav-vertical' : ''}`}
  return (
    <Fragment>
      <>
        <Nav pills className={`mb-2 ${vertical ? 'nav-left' : 'flex-column flex-sm-row '}`}>
          <NavItem>
            <NavLink active={active === '1'} onClick={() => toggleTab('1')}>
              <Info className='font-medium-3  me-50' />
              <span className='fw-bold'>
                <>{FM('products')}</>
              </span>
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink active={active === '2'} onClick={() => toggleTab('2')}>
              <TrendingUp className='font-medium-3  me-50' />
              <span className='fw-bold'>
                <>{FM('transactions')}</>
              </span>
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink active={active === '3'} onClick={() => toggleTab('3')}>
              <Info className='font-medium-3  me-50' />
              <span className='fw-bold'>
                <>{FM('stats')}</>
              </span>
            </NavLink>
          </NavItem>
        </Nav>
        <TabContent activeTab={active}>
          <TabPane tabId='1'>
            <Link to={getPath('product.list')}>
              <Rewind />
            </Link>
            {/* <Product user={user} hours={user} /> */}
          </TabPane>
          <TabPane tabId='2'>
            <TransactrionDetails details={user} />
          </TabPane>
          <TabPane tabId='3'>
            <TransactionChart details={user} />
          </TabPane>
        </TabContent>
      </>
    </Fragment>
  )
}
export default Tabs
