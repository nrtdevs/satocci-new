// ** Dropdowns Imports
import IntlDropdownTs from './IntlDropdown'
import UserDropdown from './UserDropdown'

// ** Third Party Components
import { Moon, Sun } from 'react-feather'

// ** Reactstrap Imports
import QrCodeIcon from '@mui/icons-material/QrCode'
import { Link } from 'react-router-dom'
import { NavItem, NavLink } from 'reactstrap'
import { getPath } from '../../../../router/RouteHelper'
import { FM } from '../../../../utility/helpers/common'
import { Permissions } from '../../../../utility/Permissions'
import Show from '../../../../utility/Show'
import NotificationDropdown from '../../../../views/components/Notification/NotificationDropdown'
import BsTooltip from '../../../../views/components/tooltip'
// import NotificationDropdown from './NotificationDropdown'
const NavbarUserTs = (props: any) => {
  // ** Props

  const { skin, setSkin } = props

  // useEffect(() => {
  //   setState({
  //     languageArr: data?.payload?.data
  //   })
  // }, [])
  // ** Function to toggle Theme (Light/Dark)

  const ThemeToggler = () => {
    if (skin === 'dark') {
      return <Sun className='ficon' onClick={() => setSkin('light')} />
    } else {
      return <Moon className='ficon' onClick={() => setSkin('dark')} />
    }
  }

  return (
    <ul className='nav navbar-nav align-items-center ms-auto'>
      <Show IF={Permissions.generateBarcode}>
        <NavItem>
          <NavLink>
            <Link to={getPath('barcodes.generate')}>
              <BsTooltip title={FM('generate-barcodes')}>
                <QrCodeIcon />
              </BsTooltip>
            </Link>
          </NavLink>
        </NavItem>
      </Show>
      {/* <NavItem className='d-none d-lg-block'>
        <NavLink className='nav-link-style'>
          <ThemeToggler />
        </NavLink>
      </NavItem> */}

      {/* <NavbarSearch /> */}
      {/* <CartDropdown /> */}
      <IntlDropdownTs />
      <NotificationDropdown />
      <UserDropdown />
    </ul>
  )
}
export default NavbarUserTs
