// ** React Imports
import { useState } from 'react'
import { Link } from 'react-router-dom'

// ** Custom Components
import Avatar from '../../../components/avatar'

// ** Utils
import { decryptObject, getUserData, truncateText } from '../../../../utility/Utils'

// ** Store & Actions
import { useDispatch } from 'react-redux'

// ** Third Party Components
import { Link2, Power, Shield } from 'react-feather'

// ** Reactstrap Imports
import { DropdownItem, DropdownMenu, DropdownToggle, UncontrolledDropdown } from 'reactstrap'

// ** Default Avatar Image
// import defaultAvatar from '@src/assets/images/portrait/small/avatar-s-11.jpg'
import defaultAvatar from '../../../../assets/images/portrait/small/avatar-s-11.jpg'
import { handleLogout } from '../../../../redux/authentication'
import { getPath } from '../../../../router/RouteHelper'
import {
  checkStripeStatus,
  connectToStripe,
  loadStoreDetails,
  regenerateStripeConnectLink
} from '../../../../utility/apis/appSetting'
import { logout } from '../../../../utility/apis/authentication'
import { forDecryption, UserType } from '../../../../utility/Const'
import { FM, isValid } from '../../../../utility/helpers/common'
import httpConfig from '../../../../utility/http/httpConfig'
import Show from '../../../../utility/Show'
import Shimmer from '../../../../views/components/shimmers/Shimmer'

const UserDropdown = () => {
  // ** Store Vars
  const dispatch = useDispatch()

  // ** State
  const [userData, setUserData] = useState(null)
  const [loading, setLoading] = useState(false)
  //** ComponentDidMount

  //** Vars
  const users = getUserData()
  const user = decryptObject(forDecryption, users)
  const userAvatar = isValid(user?.avatar) ? `${httpConfig.baseUrl2}${user?.avatar}` : defaultAvatar
  //   const [loadStoreDetailsById, StoreData] = useLoadStoreDetailsByIdMutation()
  //   const storeData = StoreData?.data?.payload

  const getUserType = (userLocal) => {
    if (userLocal?.user_type_id === 1) {
      return <div>{FM('admin')}</div>
    } else if (userLocal?.user_type_id === 2) {
      return <div>{FM('store')}</div>
    } else {
      return <div>{FM('employee')}</div>
    }
  }

  const loadU = () => {
    loadStoreDetails({
      id: user?.store_id,
      loading: setLoading,
      success: (e) => {
        setUserData(e)
      }
    })
  }

  const connect = (e, data) => {
    e.preventDefault()
    connectToStripe({
      jsonData: {
        ...data
      },
      loading: setLoading,
      success: (d) => {
        window.open(d?.payload?.url, '_blank')
      }
    })
  }
  const checkStatus = (e, data) => {
    e.preventDefault()
    checkStripeStatus({
      id: user?.store_setting?.id,
      jsonData: {
        ...data
      },
      loading: setLoading,
      success: (d) => {
        window.open(d?.payload?.url, '_blank')
      }
    })
  }
  const reGenerate = (e, data) => {
    e.preventDefault()
    regenerateStripeConnectLink({
      //   id: user?.store_setting?.id,
      jsonData: {
        ...data
      },
      loading: setLoading,

      success: (d) => {
        window.open(d?.payload?.url, '_blank')
      }
    })
  }

  // call logout api and clear local storage
  const handleLogoutUser = (e) => {
    // e?.preventDefault()
    logout({
      success: () => {
        dispatch(handleLogout())
      }
    })
  }
  return (
    <UncontrolledDropdown tag='li' className='dropdown-user nav-item'>
      <DropdownToggle
        href='/'
        tag='a'
        className='nav-link dropdown-user-link'
        onClick={(e) => {
          e.preventDefault()
          /// call store setting api
          loadU()
        }}
      >
        <div className='user-nav d-sm-flex d-none'>
          <span className='user-name fw-bold'>{truncateText(user && user?.name, 30)}</span>
          {/* <span className='user-status'>{(userData && userData.role) || 'Admin'}</span> */}
          <span className='user-status'>{getUserType(user)}</span>
        </div>
        <Avatar img={`${userAvatar}`} imgHeight='40' imgWidth='40' status='online' />
      </DropdownToggle>
      <DropdownMenu end>
        {/* <DropdownItem tag={Link} to='/app-settings'>
          <Settings size={14} className='me-75' />
          <span className='align-middle'>Setting</span>
        </DropdownItem> */}

        {/* <DropdownItem tag={Link} to='/apps/email'>
                    <Mail size={14} className='me-75' />
                    <span className='align-middle'>Inbox</span>
                </DropdownItem>
                <DropdownItem tag={Link} to='/apps/todo'>
                    <CheckSquare size={14} className='me-75' />
                    <span className='align-middle'>Tasks</span>
                </DropdownItem>
                <DropdownItem tag={Link} to='/apps/chat'>
                    <MessageSquare size={14} className='me-75' />
                    <span className='align-middle'>Chats</span>
                </DropdownItem>
                <DropdownItem divider />
                <DropdownItem tag={Link} to='/pages/account-settings'>
                    <Settings size={14} className='me-75' />
                    <span className='align-middle'>Settings</span>
                </DropdownItem>
                <DropdownItem tag={Link} to='/pages/pricing'>
                    <CreditCard size={14} className='me-75' />
                    <span className='align-middle'>Pricing</span>
                </DropdownItem>
                <DropdownItem tag={Link} to='/pages/faq'>
                    <HelpCircle size={14} className='me-75' />
                    <span className='align-middle'>FAQ</span>
                </DropdownItem> */}

        {loading && isValid(user) ? (
          <>
            <DropdownItem tag={Link}>
              <Shimmer height={15} className='align-middle' />
            </DropdownItem>
            <DropdownItem tag={Link}>
              <Shimmer height={15} className='align-middle' />
            </DropdownItem>
            <DropdownItem tag={Link}>
              <Shimmer height={15} className='align-middle' />
            </DropdownItem>
          </>
        ) : (
          <>
            <DropdownItem tag={Link} to={getPath('admin.profile', { id: user?.id })}>
              <Shield size={14} className='me-75' />
              <span className='align-middle'>{FM('profile')}</span>
            </DropdownItem>
            <Show
              IF={
                user?.user_type_id === 2 &&
                !isValid(user?.parent_id) &&
                (userData?.store_setting?.stripe_connect_account_status === null ||
                  userData?.store_setting?.stripe_connect_account_status === '1')
              }
            >
              <DropdownItem
                tag={Link}
                // to='/'
                onClick={connect}
              >
                <Link2 size={14} className='me-75' />
                <span className='align-middle'>{FM('connect-to-stripe')}</span>
              </DropdownItem>
            </Show>
            <Show
              IF={
                user?.user_type_id === UserType.Store &&
                !isValid(user?.parent_id) &&
                userData?.store_setting?.stripe_connect_account_status === '3'
              }
            >
              <DropdownItem
                tag={Link}
                // to='/'
                // onClick={checkStatus}
              >
                <Link2 size={14} className='me-75' />
                <span className='align-middle text-success'>{FM('stripe-connect-activated')}</span>
              </DropdownItem>
            </Show>
            <Show
              IF={
                user?.user_type_id === UserType.Store &&
                !isValid(user?.parent_id) &&
                (userData?.store_setting?.stripe_connect_account_status === '2' ||
                  userData?.store_setting?.stripe_connect_account_status === '4')
              }
            >
              <DropdownItem
                tag={Link}
                // to='/'
                onClick={reGenerate}
              >
                <Link2 size={14} className='me-75' />
                <span className='align-middle text-warning'>{FM('regenerate-stripe-connect')}</span>
              </DropdownItem>
            </Show>
            <DropdownItem tag={Link} to='/authentication' onClick={handleLogoutUser}>
              <Power size={14} className='me-75' />
              <span className='align-middle'>{FM('logout')}</span>
            </DropdownItem>
          </>
        )}
      </DropdownMenu>
    </UncontrolledDropdown>
  )
}

export default UserDropdown
