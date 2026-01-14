// ** Reactstrap Imports
import { Nav, NavItem, NavLink } from 'reactstrap'

// ** Icons Imports
import { Lock, User } from 'react-feather'

const Tabs = ({ activeTab, toggleTab }) => {
  return (
    <Nav pills className='mb-2'>
      <NavItem>
        <NavLink active={activeTab === '1'} onClick={() => toggleTab('1')}>
          <User size={18} className='me-50' />
          <span className='fw-bold'>Info</span>
        </NavLink>
      </NavItem>
      <NavItem>
        <NavLink active={activeTab === '2'} onClick={() => toggleTab('2')}>
          <Lock size={18} className='me-50' />
          <span className='fw-bold'>Account</span>
        </NavLink>
      </NavItem>
      <NavItem>
        <NavLink active={activeTab === '3'} onClick={() => toggleTab('3')}>
          <Lock size={18} className='me-50' />
          <span className='fw-bold'>Security</span>
        </NavLink>
      </NavItem>
      <NavItem>
        <NavLink active={activeTab === '4'} onClick={() => toggleTab('4')}>
          <Lock size={18} className='me-50' />
          <span className='fw-bold'>App Info</span>
        </NavLink>
      </NavItem>
      <NavItem>
        <NavLink active={activeTab === '5'} onClick={() => toggleTab('5')}>
          <Lock size={18} className='me-50' />
          <span className='fw-bold'>Credit Info</span>
        </NavLink>
      </NavItem>
    </Nav>
  )
}

export default Tabs
