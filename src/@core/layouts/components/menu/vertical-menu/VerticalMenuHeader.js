// ** React Imports
import { useEffect } from 'react'
import { NavLink } from 'react-router-dom'

// ** Icons Imports
import { Disc, X, Circle } from 'react-feather'

// ** Config
import themeConfig from '@configs/themeConfig'

// ** Utils
import { getUserData, getHomeRouteForLoggedInUser } from '../../../../../utility/Utils'
import Hide from '../../../../../utility/Hide'
import { useSkin } from '../../../../../utility/hooks/useSkin'

const VerticalMenuHeader = (props) => {
  const theme = useSkin()
  // ** Props
  const { menuCollapsed, setMenuCollapsed, setMenuVisibility, setGroupOpen, menuHover } = props

  // ** Vars
  const user = getUserData()

  // ** Reset open group
  useEffect(() => {
    if (!menuHover && menuCollapsed) setGroupOpen([])
  }, [menuHover, menuCollapsed])

  // ** Menu toggler component
  const Toggler = () => {
    if (!menuCollapsed) {
      return (
        <Disc
          size={20}
          data-tour='toggle-icon'
          className='text-primary toggle-icon d-none d-xl-block'
          onClick={() => setMenuCollapsed(true)}
        />
      )
    } else {
      return (
        <Circle
          size={20}
          data-tour='toggle-icon'
          className='text-primary toggle-icon d-none d-xl-block'
          onClick={() => setMenuCollapsed(false)}
        />
      )
    }
  }
  // user ? getHomeRouteForLoggedInUser(user.role) :
  return (
    <div className='navbar-header'>
      <ul className='nav navbar-nav flex-row'>
        <li className='nav-item me-auto'>
          <NavLink
            to={'/dashboard'}
            className='navbar-brand '
            style={{
              marginTop: 19
            }}
          >
            <span className='brand-logo'>
              <img src={themeConfig.app.appLogoImage} style={{ height: 24 }} alt='logo' />
            </span>
            {/* <h2 className='brand-text mb-0'> */}
            <Hide IF={menuCollapsed && !menuHover}>
              <img
                className='ms-1'
                style={{
                  height: '20px',
                  filter: theme.skin !== 'light' ? 'brightness(50) invert(1)' : ''
                }}
                src={themeConfig.app.appLogoLong}
                alt='logo'
              />
            </Hide>
            {/* </h2> */}
          </NavLink>
        </li>
        <li className='nav-item nav-toggle'>
          <div className='nav-link modern-nav-toggle cursor-pointer'>
            <Toggler />
            <X
              onClick={() => setMenuVisibility(false)}
              className='toggle-icon icon-x d-block d-xl-none'
              size={20}
            />
          </div>
        </li>
      </ul>
    </div>
  )
}

export default VerticalMenuHeader
