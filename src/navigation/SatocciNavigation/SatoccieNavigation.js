/* eslint-disable prettier/prettier */
import PaidIcon from '@mui/icons-material/Paid'
import {
  Activity,
  Award,
  BarChart,
  BookOpen,
  CloudOff,
  Codepen,
  CornerUpLeft,
  CreditCard,
  Database,
  Dribbble,
  File,
  Framer,
  Gift,
  Globe,
  HardDrive,
  Hexagon,
  Italic,
  List,
  Mail,
  MapPin,
  PieChart,
  Rss,
  Settings,
  Star,
  Truck,
  User,
  Users,
  XCircle,
  XOctagon
} from 'react-feather'
import { UserType } from '../../utility/Const'
import { Permissions } from '../../utility/Permissions'
import { FM } from '../../utility/helpers/common'
import LockOpen from '@mui/icons-material/LockOpen'

export default [
  {
    id: 'home',
    title: FM('dashboard'),
    icon: <Activity size={12} />,
    navLink: '/dashboard',
    ...Permissions.dashboardBrowse
  },
  {
    id: 'homes',
    title: FM('product-revenue'),
    icon: <File size={12} />,
    navLink: '/product-revenue-report',
    name: 'product-revenue-report',
    ...Permissions.dashboardBrowse
  },
    {
    id: 'homes',
    title: FM('product-wise-revenue'),
    icon: <List size={12} />,
    navLink: '/product-wise-revenue-report',
    name: 'product-wise-revenue-report',
    ...Permissions.dashboardBrowse
  },
  {
    id: 'session',
    title: FM('session'),
    icon: <Codepen size={12} />,
    navLink: '/store/active-session',
    name: 'store.active-session',
    user_type_id: UserType.Store,
    ...Permissions.sessionBrowse
  },
  {
    id: 'transactions',
    title: FM('orders'),
    icon: <Database size={12} />,
    navLink: '/admin/orders',
    name: 'admin.transactions',
    ...Permissions.transactionBrowse
  },
  {
    id: 'returns',
    title: FM('returns'),
    icon: <CornerUpLeft size={12} />,
    navLink: '/admin/returns',
    name: 'admin.returns',
    ...Permissions.returnRefundBrowse
  },
  {
    id: 'subscriptions',
    title: FM('subscriptions'),
    icon: <PaidIcon size={12} />,
    navLink: '/admin/subscriptions',
    name: 'admin.subscriptions',
    ...Permissions.subscriptionBrowse
  },
  {
    id: 'customer',
    title: FM('customers'),
    icon: <User size={12} />,
    navLink: '/admin/customer',
    name: 'admin.customer',
    user_type_id: UserType.Admin,
    ...Permissions.customerBrowse
  },
  {
    id: 'pendingAmount',
    title: FM('transfer-store-pending-amount'),
    icon: <CloudOff size={12} />,
    navLink: '/admin/store/pending/amount',
    user_type_id: UserType.Admin,
    ...Permissions.returnRefundBrowse
  },

  {
    id: 'products',
    title: FM('product-management'),
    icon: <Gift size={20} />,
    user_type_id: UserType.Store,
    children: [
      {
        id: 'product',
        title: FM('products'),
        icon: <Hexagon size={12} />,
        navLink: '/products',
        name: 'product.list',
        ...Permissions.productBrowse
      },
      {
        id: 'category',
        title: FM('category'),
        icon: <Framer size={12} />,
        navLink: '/admin/category',
        name: 'admin.category',
        ...Permissions.categoryBrowse
      }
    ]
  },
  {
    id: 'stores',
    title: FM('store-management'),
    icon: <MapPin size={20} />,
    children: [
      {
        id: 'stores',
        title: FM('stores'),
        icon: <HardDrive size={12} />,
        navLink: '/admin/stores',
        name: 'admin.stores',
        ...Permissions.storeBrowse
      },
      {
        id: 'offers',
        title: FM('offers'),
        icon: <HardDrive size={12} />,
        navLink: '/store/offers',
        name: 'store.offers',
        ...Permissions.couponBrowse
      },
      {
        id: 'coupon',
        title: FM('coupon'),
        icon: <Gift size={12} />,
        navLink: '/store/coupon',
        name: 'store.coupon',
        ...Permissions.couponBrowse
      },
      {
        id: 'usescoupon',
        title: FM('used-coupon'),
        icon: <XOctagon size={12} />,
        navLink: '/store/uses/coupon',
        name: 'store.uses.coupon',
        ...Permissions.couponBrowse
      },
      {
        id: 'customers',
        title: FM('customers'),
        icon: <Truck size={12} />,
        navLink: '/store/customers',
        name: 'store.customers',
        ...Permissions.storeCustomerBrowse
      },

      {
        id: 'reports',
        title: FM('store-reports'),
        icon: <BarChart size={12} />,
        navLink: '/store/report',
        name: 'store.report',
        ...Permissions.reportsBrowse
      }
    ]
  },

  {
    id: 'user-management',
    title: FM('user-management'),
    icon: <Users size={20} />,
    children: [
      {
        id: 'employee',
        title: FM('employee'),
        icon: <User size={12} />,
        navLink: '/store/employee',
        name: 'store.employee',
        ...Permissions.employeeBrowse
      },
      {
        id: 'roless',
        title: FM('roles'),
        icon: <XOctagon size={12} />,
        navLink: 'settings/roles',
        name: 'settings.roles',
        ...Permissions.rolesBrowse
      }
    ]
  },
  {
    id: 'feedback',
    title: FM('feedback'),
    icon: <PieChart size={12} />,
    navLink: '/admin/settings/feedback',
    name: 'admin.settings.feedback',
    ...Permissions.feedbackBrowse
  },
  {
    id: 'delete_request',
    title: FM('delete-request'),
    icon: <XCircle size={12} />,
    navLink: '/admin/delete-requests',
    name: 'admin.delete.requests',
    ...Permissions.customerBrowse
  },
  {
    id: 'order_rating',
    title: FM('order-rating'),
    icon: <Star size={12} />,
    navLink: '/stores/order/rating',
    name: 'stores.order.rating',
    ...Permissions.feedbackBrowse
  },
  {
    id: 'gatekeeper-rating',
    title: FM('gatekeeper-rating'),
    icon: <Star size={12} />,
    navLink: '/store/gatekeeper/log',
    name: 'store.gatekeeper.log',

    ...Permissions.feedbackBrowse
  },

  //   {
  //     id: 'payment',
  //     title: FM('payment-gateway'),
  //     icon: <CreditCard size={12} />,
  //     navLink: '/admin/settings/payment-gateway',
  //     name: 'admin.settings.paymentgateway',
  //     ...Permissions.dashboardView
  //   },
  {
    id: 'settings',
    title: FM('settings'),
    icon: <Settings size={20} />,
    children: [
      {
        id: 'app-setting',
        title: FM('app-setting'),
        icon: <PieChart size={12} />,
        navLink: '/admin/settings/app-setting',
        name: 'admin.settings.app-setting',
        ...Permissions.appSettingsBrowse
      },
      {
        id: 'country',
        title: FM('country'),
        icon: <Globe size={12} />,
        navLink: '/admin/country',
        name: 'admin.country',
        ...Permissions.appSettingsBrowse
      },
      {
        id: 'loginSetting',
        title: FM('login-and-payment-setting'),
        icon: <LockOpen fontSize='small' />,
        navLink: '/admin/login/setting',
        name: 'login.setting',
        ...Permissions.appSettingsBrowse
      },
      {
        id: 'email-sms',
        title: FM('notification-template'),
        icon: <Mail size={12} />,
        navLink: '/admin/settings/notifications',
        name: 'admin.settings.notifications',
        ...Permissions.notificationTemplateBrowse
      },
      {
        id: 'payment-setup',
        title: FM('payment-setup'),
        icon: <CreditCard size={12} />,
        navLink: '/admin/settings/payment-setup',
        name: 'admin.settings.payment-setup',
        ...Permissions.appSettingsBrowse
      },
      {
        id: 'language',
        title: FM('languages'),
        icon: <Dribbble size={12} />,
        navLink: '/admin/settings/languages',
        name: 'admin.settings.languages',
        ...Permissions.languageBrowse
      },
      {
        id: 'labels',
        title: FM('labels'),
        icon: <Italic size={12} />,
        navLink: '/admin/settings/labels',
        name: 'settings.labels',
        ...Permissions.languageBrowse
      }
    ]
  },
  {
    id: 'promotions',
    title: FM('promotion'),
    icon: <Rss size={12} />,
    navLink: '/admin/promotions',
    name: 'admin.promotions',
    ...Permissions.contentBrowse
  },

  {
    id: 'referrals',
    title: FM('referrals'),
    icon: <Award size={20} />,
    children: [
      {
        id: 'bulk_referral',
        title: FM('bulk-referral'),
        icon: <Gift size={12} />,
        navLink: '/bulk-referrals',
        name: 'bulk-referrals',
        ...Permissions.referralsBrowse
      },
      {
        id: 'referral_family_friend',
        title: FM('referral-family-friend'),
        icon: <Gift size={12} />,
        navLink: '/admin/referrals/family-referrals',
        name: 'admin.referrals',
        ...Permissions.referralsBrowse
      },
      {
        id: 'referral_store',
        title: FM('referral-store'),
        icon: <Gift size={12} />,
        navLink: '/admin/referrals/store-referrals',
        name: 'admin.store.referrals',
        ...Permissions.referralsBrowse
      }
    ]
  },
  {
    id: 'logs',
    title: FM('logs'),
    icon: <Activity size={20} />,
    children: [
      {
        id: 'login_log',
        title: FM('login-log'),
        icon: <BookOpen size={12} />,
        navLink: 'login-log',
        name: 'login.log',
        ...Permissions.dashboardBrowse
      },
      {
        id: 'activitylog',
        title: FM('activity-log'),
        icon: <Activity size={12} />,
        navLink: '/admin/activity/log',
        name: 'admin.activity.log',
        ...Permissions.couponBrowse
      }
    ]
  }
]
