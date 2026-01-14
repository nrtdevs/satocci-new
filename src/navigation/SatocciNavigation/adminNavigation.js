import {
  Activity,
  Anchor,
  ArrowUp,
  Bell,
  Bluetooth,
  Book,
  BookOpen,
  Briefcase,
  Calendar,
  Check,
  Circle,
  Clock,
  CloudLightning,
  Columns,
  Compass,
  Copy,
  Crosshair,
  DollarSign,
  File,
  FileText,
  Flag,
  FolderPlus,
  HelpCircle,
  Home,
  Key,
  Layers,
  List,
  Mail,
  MapPin,
  MessageCircle,
  MessageSquare,
  Moon,
  Package,
  Pocket,
  Send,
  Server,
  Settings,
  Slack,
  StopCircle,
  Target,
  Trello,
  TrendingUp,
  Twitch,
  User,
  UserCheck,
  UserPlus,
  Users
} from 'react-feather'
import { Permissions } from '../../utility/Permissions'
// import PermPhoneMsgIcon from '@material-ui/icons/PermPhoneMsg'
// import { Permissions } from "../../utility/Permissions"
// import { FM } from "../../utility/helpers/common"
// import { Modules } from "../../utility/Const"
// import Contacts from '@material-ui/icons/Contacts'
// import Block from '@material-ui/icons/Block'
import ContactPhoneIcon from '@mui/icons-material/ContactPhone'
import PermPhoneMsgIcon from '@mui/icons-material/PermPhoneMsg'
import AppBlockingIcon from '@mui/icons-material/AppBlocking'
import AccountBalanceWallet from '@mui/icons-material/AccountBalanceWallet'
import AddCard from '@mui/icons-material/AddCard'
import Campaign from '@mui/icons-material/Campaign'

export default [
  // {
  //     header: "dashboard-menu"
  // },
  {
    id: 'home',
    title: 'Dashboard',
    icon: <Activity size={12} />,
    navLink: '/dashboard',
    ...Permissions.dashboardView
  },
  {
    id: 'user',
    title: 'User Management',
    icon: <UserPlus size={12} />,
    navLink: '/users-list',
    ...Permissions.userList
  },
  {
    header: 'Routes'
  },
  {
    id: 'routes',
    title: 'Routes',
    icon: <MapPin size={20} />,
    children: [
      {
        id: 'primary-route',
        title: 'Primary Route',
        icon: <User size={12} />,
        navLink: '/primary-routes',

        ...Permissions.primaryList
      },
      {
        id: 'secondary-route',
        title: 'Secondary Route',
        icon: <User size={12} />,
        navLink: '/secondary-routes',

        ...Permissions.secondaryView
      },
      {
        id: 'dlr list',
        title: 'Dlr Code',
        icon: <User size={12} />,
        navLink: '/dlr-list',
        ...Permissions.dlrList
      }
    ]
  },
  {
    id: 'assign-route',
    title: 'Assign Route',
    icon: <User size={12} />,
    navLink: '/assign-route',
    ...Permissions.assignRouteUser
  },
  {
    id: 'messaging',
    title: 'Messaging',
    icon: <MessageSquare size={20} />,
    children: [
      {
        id: 'send-sms',
        title: 'Send Sms',
        icon: <MessageCircle size={12} />,
        navLink: '/admin-send-sms',

        ...Permissions.smsList
      },
      {
        id: 'dlt-template-list',
        title: 'DLT Template',
        icon: <MessageCircle size={12} />,
        navLink: '/dlt-template-list',

        ...Permissions.dltList
      },
      {
        id: 'sender-list',
        title: 'Sender ID',
        icon: <MessageCircle size={12} />,
        navLink: '/senderid-list',

        ...Permissions.senderList
      },
      {
        id: 'campaign-list',
        title: 'Campaign List',
        icon: <Campaign size={12} />,
        navLink: '/all-campaign',

        ...Permissions.smsList
      }
    ]
  },
  {
    id: 'phone-book',
    title: 'Phone Book',
    icon: <PermPhoneMsgIcon size={20} />,
    children: [
      {
        id: 'create-phone-book',
        title: 'Phone Book',
        icon: <ContactPhoneIcon size={15} />,
        navLink: '/group',

        ...Permissions.phoneList
      },
      {
        id: 'blacklist',
        title: 'BlackList',
        icon: <AppBlockingIcon size={15} />,
        navLink: '/blacklist',

        ...Permissions.blacklist
      }
    ]
  },
  {
    id: 'credit-request',
    title: 'Credit Request',
    icon: <AccountBalanceWallet size={20} />,
    navLink: '/credit-request',
    ...Permissions.creditRequest
  }
]
