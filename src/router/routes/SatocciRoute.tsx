/* eslint-disable prettier/prettier */
import { lazy } from 'react'

import { Permissions } from '../../utility/Permissions'
import path from 'path'

const ReturnOrder = lazy(() => import('../../views/Master/Transactions/ReturnOrder'))

const CategoryDetails = lazy(() => import('../../views/stores/category/fragment/CategoryDetails'))
const Stores = lazy(() => import('../../views/stores'))
const StoreTrashed = lazy(() => import('../../views/stores/StoreTrashed'))
const StoresCreate = lazy(() => import('../../views/stores/fragment/AddUpdateForm'))
const StoreByParent = lazy(() => import('../../views/stores/StoresByParentId'))
const StoreDetails = lazy(() => import('../../views/stores/fragment/Tabs'))
const StoreReports = lazy(() => import('../../views/Reports/StoreReport'))
const StoreCustomers = lazy(() => import('../../views/stores/StoreCustomer'))
const Reports = lazy(() => import('../../views/Reports'))
const GroupReport = lazy(() => import('../../views/Reports'))
const Profile = lazy(() => import('../../views/Master/Profile'))
const ProfileUpdate = lazy(() => import('../../views/Master/Profile/UpdateForm'))
const ActivtyLog = lazy(() => import('../../views/Master/Profile/tabs/Activity'))
const GateKeeperLog = lazy(() => import('../../views/Master/Profile/tabs/GateKeeperLog'))
///user Management
//
const PaymentSetup = lazy(() => import('../../views/Master/PaymentSetup'))
const Customer = lazy(() => import('../../views/UserManagement/customer'))
const DeleteRequest = lazy(() => import('../../views/Master/RequestDelete'))
const StoreEmployee = lazy(() => import('../../views/UserManagement/employee/StoreEmployee'))

const EmployeeAdd = lazy(
  () => import('../../views/UserManagement/employee/fragment/AddUpdateEmployee')
)
const EmployeeTrash = lazy(() => import('../../views/Master/AdminEmployee/AdminEmployeeTrash'))

const CreatePermissions = lazy(
  () => import('../../views/Settings/RolesPermissions/CreatePermissions')
)
///Admin Employee
const AdminEmployee = lazy(() => import('../../views/Master/AdminEmployee'))
const AdminTrashEmployee = lazy(() => import('../../views/Master/AdminEmployee/AdminEmployeeTrash'))
const PendingAmount = lazy(() => import('../../views/Master/PendingAmount'))
const AdminEmployeeAddUpdate = lazy(
  () => import('../../views/Master/AdminEmployee/AdminEmployeeForm')
)
const UnitLabels = lazy(() => import('../../views/Settings/UnitLabels'))
const LoginLogList = lazy(() => import('../../views/Settings/LoginLogList'))
const AdminEmployeeDetails = lazy(
  () => import('../../views/UserManagement/employee/fragment/EmployeeDetails')
)
////
///Product management
const ProductList = lazy(() => import('../../views/ProductManagement'))
const BarcodeGenerate = lazy(() => import('../../views/ProductManagement/BarcodeGenerate'))
const ProductVariantList = lazy(() => import('../../views/ProductManagement/ProductVariants'))
const ProductCreate = lazy(() => import('../../views/ProductManagement/fragment/ProductForm'))
const ProductDetails = lazy(() => import('../../views/ProductManagement/fragment/ProductDetails'))
const ProductTrashed = lazy(() => import('../../views/ProductManagement/ProductTrashed'))
///ActiveSession
const Sessions = lazy(() => import('../../views/sessions'))
const ActiveSessionDetails = lazy(
  () => import('../../views/sessions/fragment/ActiveSessionDetails')
)
//settings
const RoleAndPermissions = lazy(() => import('../../views/Settings/RolesPermissions'))
const RoleCreateUpdate = lazy(
  () => import('../../views/Settings/RolesPermissions/RolesPermissionForm')
)
const SmsEmail = lazy(() => import('../../views/Settings/EmailAndSmsTemplate'))
const SmsEmailCreate = lazy(
  () => import('../../views/Settings/EmailAndSmsTemplate/EmailTemplateForm')
)
const Promotions = lazy(() => import('../../views/Settings/PromotionTemplate'))
const PromotionCreate = lazy(
  () => import('../../views/Settings/PromotionTemplate/PromotionTemplateForm')
)
const PromotionLog = lazy(() => import('../../views/Settings/PromotionTemplate/PromotionLogTable'))
const OrderList = lazy(() => import('../../views/Master/Orders'))
const AppSettings = lazy(() => import('../../views/Settings/appSetting/AppSettingDetails'))
const AppSettingsForm = lazy(() => import('../../views/Settings/appSetting'))
const FeedbackList = lazy(() => import('../../views/Settings/feedback'))
const CardsList = lazy(() => import('../../views/Settings/cardDetails'))
const LanguageSetting = lazy(() => import('../../views/Settings/Languages'))
const Labelss = lazy(() => import('../../views/Settings/Languages/labels'))
const PaymentGatewaySetting = lazy(() => import('../../views/Settings/PaymentGateway'))
//subscription
const SubscriptionList = lazy(() => import('../../views/Master/Transactions'))
//subscription
const Dashboard = lazy(() => import('../../views/Dashboards/Dashboard'))
const PermissionsList = lazy(() => import('../../views/Master/Permissions'))
// const DashboardEcommerce = lazy(() => import('../../views/examples/dashboard/ecommerce'))
const Category = lazy(() => import('../../views/stores/category'))
const SubCategory = lazy(() => import('../../views/stores/category/SubcategoryList'))
const Login = lazy(() => import('../../views/examples/pages/authentication/Login'))
const Authentication = lazy(() => import('../../views/auth/Login'))
const ForgotPassword1 = lazy(() => import('../../views/auth/ForgetPassword'))
const UpdatePassword = lazy(() => import('../../views/auth/UpdatePassword'))
const Coupon = lazy(() => import('../../views/stores/coupon/index'))
const UsesCoupon = lazy(() => import('../../views/stores/coupon/UsageCoupon'))
const SubscriptionListss = lazy(() => import('../../views/Master/Subscription'))
const CouponAddorUpdate = lazy(() => import('../../views/stores/coupon/AddUpdateCoupon'))
const SubLogs = lazy(() => import('../../views/Master/Subscription/fragment/SubscriptionLogs'))
const PrintInvoice = lazy(() => import('../../views/Master/Transactions/Tab/Print'))
const TransactionDetailPage = lazy(
  () => import('../../views/Master/Transactions/TransactionDetailPage')
)
const AdminOrderDetailPage = lazy(
  () => import('../../views/Master/Transactions/AdminOrderDetailPage')
)
const Notifications = lazy(() => import('../../views/Master/Notification'))
const StripeSuccess = lazy(() => import('../../views/Stripe/Success'))
const StripeExpired = lazy(() => import('../../views/Stripe/Expired'))
const OrderRating = lazy(() => import('../../views/Settings/OrderRating'))
const Referrals = lazy(() => import('../../views/Master/Referrals/Index'))
const StoreReferrals = lazy(() => import('../../views/Master/StoreReferrals'))
const LoginSetting = lazy(() => import('../../views/CustomerLogin/CustomerLogin'))
const BulkReferals = lazy(() => import('../../views/Settings/BulkReferals'))
const AllOffers = lazy(() => import('../../views/stores/offers'))
const ReturnOrderDetails = lazy(() => import('../../views/Master/Transactions/ReturnOrderDetails'))
const CountryList = lazy(() => import('../../views/Settings/Countries'))
const PaymentSuccess = lazy(() => import('../../views/Master/payment/PaymentSuccess'))
const PaymentFail = lazy(() => import('../../views/Master/payment/PaymentFail'))
const RevenueTable = lazy(() => import('../../views/Dashboards/ProductWiseRevenueReport'))
const ProductRevenueTable = lazy(() => import('../../views/Dashboards/ProductRevenueReport'))

export interface MetaProps {
  title?: string
  layout?: string
  publicRoute?: boolean
  restricted?: boolean
  action?: string
  resource?: string
}
export interface RouteProps {
  path: string
  element: JSX.Element
  name: string
  meta?: MetaProps
  children?: RouteProps[]
}
const SatocciRoute = [
  {
    path: '/payment-success',
    element: <PaymentSuccess />,
    name: 'payment-success',
    meta: {
      ...Permissions.dashboardBrowse
      //   restricted: true
    }
  },
  {
    path: '/product-revenue-report',
    element: <RevenueTable />,
    name: 'product-revenue-report',
    meta: {
      ...Permissions.dashboardBrowse
      //   restricted: true
    }
  },
   {
    path: '/product-wise-revenue-report',
    element: <ProductRevenueTable/>,
    name: 'product-wise-revenue-report',
    meta: {
      ...Permissions.dashboardBrowse
      //   restricted: true
    }
  },
  {
    path: '/payment-fail',
    element: <PaymentFail />,
    name: 'payment-fail',
    meta: {
      ...Permissions.dashboardBrowse
      //   restricted: true
    }
  },
  {
    path: '/authentication',
    element: <Authentication />,
    name: 'auth.login',
    meta: {
      layout: 'blank',
      publicRoute: true,
      restricted: true
    }
  },
  {
    path: '/reset-password/:token',
    element: <UpdatePassword />,
    name: 'auth.reset_password',
    meta: {
      layout: 'blank',
      publicRoute: true,
      restricted: true
    }
  },
  {
    path: '/forgot/password',
    element: <ForgotPassword1 />,
    name: 'auth.forgotPassword',
    meta: {
      layout: 'blank',
      publicRoute: true,
      restricted: false
    }
  },
  {
    path: '/dashboard',
    element: <Dashboard />,
    name: 'dashboard',
    meta: {
      ...Permissions.dashboardBrowse
      //   restricted: true
    }
  },
  {
    path: '/notifications',
    element: <Notifications />,
    name: 'notifications',
    meta: {
      ...Permissions.dashboardBrowse
      //   restricted: true
    }
  },

  {
    path: '/admin/profile/:id',
    name: 'admin.profile',
    element: <Profile />,
    meta: {
      ...Permissions.dashboardBrowse
    }
  },
  {
    path: '/admin/profile/update/:id',
    name: 'admin.profile.update',
    element: <ProfileUpdate />,
    meta: {
      ...Permissions.dashboardBrowse
    }
  },
  {
    path: '/login-log',
    name: 'login.log',
    element: <LoginLogList />,
    meta: {
      ...Permissions.dashboardBrowse
    }
  },
  {
    path: '/permissions',
    element: <PermissionsList />,
    name: 'permissions',
    meta: {
      ...Permissions.rolesBrowse
      //   restricted: true
    }
  },
  ////////// stripe
  {
    path: '/stripe-success',
    name: 'stripe.success',
    element: <StripeSuccess />,
    meta: {
      layout: 'blank',
      publicRoute: true,
      restricted: false
    }
  },
  {
    path: '/stripe-expired',
    name: 'stripe.expired',
    element: <StripeExpired />,
    meta: {
      layout: 'blank',
      publicRoute: true,
      restricted: false
    }
  },
  ///////// Coupons
  {
    path: '/store/coupon',
    name: 'store.coupon',
    element: <Coupon />,
    meta: {
      ...Permissions.couponBrowse
    }
  },
  {
    path: '/store/offers',
    name: 'store.offers',
    element: <AllOffers />,
    meta: {
      ...Permissions.couponBrowse
    }
  },
  {
    path: '/store/uses/coupon',
    name: 'store.uses.coupon',
    element: <UsesCoupon />,
    meta: {
      ...Permissions.couponBrowse
    }
  },
  {
    path: '/store/edit/:id',
    element: <CouponAddorUpdate />,
    name: 'store.edit',
    meta: {
      ...Permissions.couponEdit
    }
  },
  {
    path: '/store/coupon/create',
    element: <CouponAddorUpdate />,
    name: 'store.coupon.create',
    meta: {
      ...Permissions.couponAdd
    }
  },
  {
    path: '/store/customers',
    element: <StoreCustomers />,
    name: 'store.customers',
    meta: {
      ...Permissions.storeCustomerBrowse
    }
  },
  //   {
  //     path: '/store/coupon/:id',
  //     element: <ProductDetails />,
  //     name: 'product.details',
  //     meta: {
  //       ...Permissions.productRead
  //     }
  //   },

  ////Store Mangement
  {
    path: '/admin/stores',
    name: 'admin.stores',
    element: <Stores />,
    meta: {
      ...Permissions.storeBrowse
    }
  },

  {
    path: '/admin/stores/trashed',
    name: 'admin.stores.trashed',
    element: <StoreTrashed />,
    meta: {
      ...Permissions.storeBrowse
    }
  },
  ///Ordeer Rating
  {
    path: '/stores/order/rating',
    name: 'stores.order.rating',
    element: <OrderRating />,
    meta: {
      ...Permissions.feedbackBrowse
    }
  },
  {
    path: '/store/sub-store/trashed/:store_id',
    name: 'store.sub-store.trashed',
    element: <StoreTrashed />,
    meta: {
      ...Permissions.storeBrowse
    }
  },
  {
    path: '/store/report',
    name: 'store.report',
    element: <StoreReports />,
    meta: {
      ...Permissions.reportsBrowse
    }
  },
  {
    path: '/admin/stores/create',
    name: 'admin.stores.create',
    element: <StoresCreate />,
    meta: {
      ...Permissions.storeAdd
    }
  },
  {
    path: '/admin/stores/update/:id',
    name: 'admin.stores.update',
    element: <StoresCreate />,
    meta: {
      ...Permissions.storeEdit
    }
  },
  {
    path: '/admin/store/pending/amount',
    name: 'admin.store.pending.amount',
    element: <PendingAmount />,
    meta: {
      ...Permissions.returnRefundBrowse
    }
  },
  {
    path: '/admin/stores/parent/:id',
    name: 'admin.stores.parent',
    element: <StoreByParent />,
    meta: {
      ...Permissions.storeBrowse
    }
  },
  {
    path: '/admin/stores/details/:id',
    name: 'admin.stores.details',
    element: <StoreDetails />,
    meta: {
      ...Permissions.storeRead
    }
  },
  {
    path: '/admin/orders',
    name: 'admin.orders',
    element: <SubscriptionList />,
    meta: {
      ...Permissions.transactionBrowse
    }
  },
  {
    path: '/admin/orders/detail/:id',
    name: 'admin.orders.detail',
    element: <TransactionDetailPage />,
    meta: {
      ...Permissions.transactionBrowse
    }
  },
  {
    path: '/admin/report/order/detail/:id',
    name: 'admin.report.order.detail',
    element: <AdminOrderDetailPage />,
    meta: {
      ...Permissions.reportsBrowse
    }
  },
  {
    path: '/admin/return/orders/detail/:id',
    name: 'admin.return.orders.detail',
    element: <ReturnOrderDetails />,
    meta: {
      ...Permissions.returnRefundBrowse
    }
  },
  {
    path: '/admin/returns',
    name: 'admin.returns',
    element: <ReturnOrder />,
    meta: {
      ...Permissions.returnRefundBrowse
    }
  },
  {
    path: '/admin/subscriptions',
    name: 'admin.subscriptions',
    element: <SubscriptionListss />,
    meta: {
      ...Permissions.subscriptionBrowse
    }
  },
  {
    path: '/admin/subscriptions-log/:id/:typeID/:currency/:logType',
    name: 'admin.subscriptions.log',
    element: <SubLogs />,
    meta: {
      ...Permissions.subscriptionBrowse
    }
  },
  {
    path: '/admin/subscriptions/detail/:id',
    name: 'admin.subscriptions.detail',
    element: <TransactionDetailPage />,
    meta: {
      ...Permissions.subscriptionBrowse
    }
  },
  {
    path: '/admin/category',
    name: 'admin.category',
    element: <Category />,
    meta: {
      ...Permissions.categoryBrowse
    }
  },
  {
    path: '/admin/category/subcategory/:parentId',
    name: 'admin.category.subcategory',
    element: <SubCategory />,
    meta: {
      ...Permissions.categoryBrowse
    }
  },
  {
    path: '/admin/category/:id',
    name: 'admin.category.view',
    element: <CategoryDetails />,
    meta: {
      ...Permissions.categoryRead
    }
  },
  // {
  //     path: '/primary-routes/view/:id',
  //     element: <ViewPrimaryRoute />,
  //     name: "privateRoutes",
  //     meta: {
  //         ...Permissions.privateView
  //     }
  // },

  ///////////////////////////////////  Subscription /////////////////////////////
  // {
  //     path: '/admin/subscription',
  //     name: 'admin.subscription',
  //     element: <CategoryDetails />,
  //     meta: {
  //         ...Permissions.categoryRead
  //     }
  // },

  /////////////////////////////////// DLR   CODE /////////////////////////////
  {
    path: '/admin/reports',
    element: <Reports />,
    name: 'admin.reports',
    meta: {
      ...Permissions.reportsBrowse
    }
  },
  {
    path: '/admin/group/reports',
    element: <GroupReport />,
    name: 'reports.company.group',
    meta: {
      ...Permissions.reportsBrowse
    }
  },
  /////Product Management

  {
    path: '/products',
    element: <ProductList />,
    name: 'product.list',
    meta: {
      ...Permissions.productBrowse
    }
  },
  {
    path: '/generate-barcodes',
    element: <BarcodeGenerate />,
    name: 'barcodes.generate',
    meta: {
      ...Permissions.generateBarcode
    }
  },
  {
    path: '/products/store/:id',
    element: <ProductList />,
    name: 'product.store.list',
    meta: {
      ...Permissions.productBrowse
    }
  },
  {
    path: '/products/:id/variants',
    element: <ProductVariantList />,
    name: 'product.list.variants',
    meta: {
      ...Permissions.productBrowse
    }
  },
  {
    path: '/products/trashed/lists',
    element: <ProductTrashed />,
    name: 'product.trashed.list',
    meta: {
      ...Permissions.productBrowse
    }
  },

  {
    path: '/products/create/:parentId',
    element: <ProductCreate />,
    name: 'product.create.parent',
    meta: {
      ...Permissions.productAdd
    }
  },
  {
    path: '/products/create',
    element: <ProductCreate />,
    name: 'product.create',
    meta: {
      ...Permissions.productAdd
    }
  },
  {
    path: '/products/create/:storeId',
    element: <ProductCreate />,
    name: 'admin.product.create',
    meta: {
      ...Permissions.productAdd
    }
  },
  {
    path: '/products/create/variant/:productId',
    element: <ProductCreate />,
    name: 'product.create.variant',
    meta: {
      ...Permissions.productAdd
    }
  },
  {
    path: '/products/details/:id',
    element: <ProductDetails />,
    name: 'product.details',
    meta: {
      ...Permissions.productRead
    }
  },
  {
    path: '/products/variant/edit/:id',
    element: <ProductCreate />,
    name: 'product.edit',
    meta: {
      ...Permissions.productEdit
    }
  },

  ///ActiveSessionEmployee
  {
    path: '/store/active-session',
    element: <Sessions />,
    name: 'store.active-session',
    meta: {
      layout: 'blank',
      menuHidden: true,
      className: 'schat-application',
      ...Permissions.sessionBrowse
    }
  },

  {
    path: '/store/active-session/details/:id',
    element: <ActiveSessionDetails />,
    name: 'store.active-session.details',
    meta: {
      ...Permissions.sessionRead
    }
  },
  ////settings

  {
    path: '/admin/settings/app-setting',
    element: <AppSettings />,
    name: 'settings.app_settings',
    meta: {
      ...Permissions.appSettingsBrowse
    }
  },
  {
    path: '/admin/settings/labels',
    element: <UnitLabels />,
    name: 'settings.labels',
    meta: {
      ...Permissions.languageBrowse
    }
  },
  {
    path: '/admin/settings/update/app-setting',
    element: <AppSettingsForm />,
    name: 'settings.update.app-setting',
    meta: {
      ...Permissions.appSettingsBrowse
    }
  },
  {
    path: '/admin/settings/payment-setup',
    element: <PaymentSetup />,
    name: 'admin.settings.payment_setup',
    meta: {
      ...Permissions.appSettingsBrowse
    }
  },
  {
    path: '/admin/settings/notification/create',
    element: <SmsEmailCreate />,
    name: 'admin.settings.notification.create',
    meta: {
      ...Permissions.notificationTemplateAdd
    }
  },
  {
    path: '/admin/settings/notification/update/:id',
    element: <SmsEmailCreate />,
    name: 'admin.settings.notification.update',
    meta: {
      ...Permissions.notificationTemplateEdit
    }
  },
  {
    path: '/admin/settings/notifications',
    element: <SmsEmail />,
    name: 'admin.settings.notifications',
    meta: {
      ...Permissions.notificationTemplateBrowse
    }
  },
  {
    path: '/admin/settings/feedback',
    element: <FeedbackList />,
    name: 'admin.settings.feedback',
    meta: {
      ...Permissions.feedbackBrowse
    }
  },
  // {
  //     path: '/admin/settings/cards',
  //     element: <CardsList />,
  //     name: 'admin.settings.cards',
  //     meta: {
  //         ...Permissions.dashboardBrowse
  //     }
  // },
  {
    path: '/admin/settings/languages',
    element: <LanguageSetting />,
    name: 'settings.languages',
    meta: {
      ...Permissions.languageBrowse
    }
  },
  {
    path: '/admin/:name/labels/:languageId',
    element: <Labelss />,
    name: 'admin.language.labels',
    meta: {
      ...Permissions.labelBrowse
    }
  },
  // {
  //     path: '/admin/settings/payment-gateway',
  //     element: <PaymentGatewaySetting />,
  //     name: 'settings.payment_gateway',
  //     meta: {
  //         ...Permissions.dashboardBrowse
  //     }
  // },
  {
    path: '/settings/roles',
    element: <RoleAndPermissions />,
    name: 'settings.roles',
    meta: {
      ...Permissions.rolesBrowse
    }
  },
  {
    path: '/settings/roles/create',
    element: <RoleCreateUpdate />,
    name: 'settings.roles.create',
    meta: {
      ...Permissions.rolesAdd
    }
  },
  {
    path: '/settings/roles/update/:id',
    element: <RoleCreateUpdate />,
    name: 'settings.roles.update',
    meta: {
      ...Permissions.rolesAdd
    }
  },
  {
    path: '/admin/promotion/create',
    element: <PromotionCreate />,
    name: 'admin.promotion.create',
    meta: {
      ...Permissions.contentAdd
    }
  },
  {
    path: '/admin/promotion/update/:id',
    element: <PromotionCreate />,
    name: 'admin.promotion.update',
    meta: {
      ...Permissions.contentEdit
    }
  },
  {
    path: '/admin/promotions',
    element: <Promotions />,
    name: 'admin.promotions',
    meta: {
      ...Permissions.contentBrowse
    }
  },
  {
    path: '/admin/promotion/log/:id',
    element: <PromotionLog />,
    name: 'admin.promotion.log',
    meta: {
      ...Permissions.contentLog
    }
  },

  //// Admin Employee ///
  {
    path: '/admin/employee',
    element: <AdminEmployee />,
    name: 'admin.employee',
    meta: {
      ...Permissions.employeeAdminBrowse
    }
  },
  {
    path: '/admin/employee/trash',
    element: <AdminTrashEmployee />,
    name: 'admin.employee.trash',
    meta: {
      ...Permissions.employeeAdminBrowse
    }
  },
  {
    path: '/admin/employee/create',
    element: <AdminEmployeeAddUpdate />,
    name: 'admin.employee.create',
    meta: {
      ...Permissions.employeeAdminAdd
    }
  },
  {
    path: '/admin/employee/update/:id',
    element: <AdminEmployeeAddUpdate />,
    name: 'admin.employee.update',
    meta: {
      ...Permissions.employeeAdminEdit
    }
  },
  {
    path: '/admin/employee/details/:id',
    element: <AdminEmployeeDetails />,
    name: 'admin.employee.details',
    meta: {
      ...Permissions.employeeAdminRead
    }
  },
  /////Store Employee
  {
    path: '/store/employee',
    element: <StoreEmployee />,
    name: 'store.employee',
    meta: {
      ...Permissions.employeeBrowse
    }
  },
  {
    path: '/store/employee/trash',
    element: <EmployeeTrash />,
    name: 'store.employee.trash',
    meta: {
      ...Permissions.employeeBrowse
    }
  },
  {
    path: '/store/employee/create',
    element: <EmployeeAdd />,
    name: 'store.employee.create',
    meta: {
      ...Permissions.employeeAdd
    }
  },
  {
    path: '/store/employee/update/:id',
    element: <EmployeeAdd />,
    name: 'store.employee.update',
    meta: {
      ...Permissions.employeeEdit
    }
  },
  {
    path: '/store/employee/details/:id',
    element: <AdminEmployeeDetails />,
    name: 'store.employee.details',
    meta: {
      ...Permissions.employeeBrowse
    }
  },
  {
    path: '/admin/customer',
    element: <Customer />,
    name: 'admin.customer',
    meta: {
      ...Permissions.customerBrowse
    }
  },
  {
    path: '/admin/delete-requests',
    element: <DeleteRequest />,
    name: 'admin.delete.requests',
    meta: {
      ...Permissions.customerBrowse
    }
  },
  {
    path: '/admin/send/coupon/:customerId',
    element: <CouponAddorUpdate />,
    name: 'admin.send.coupon',
    meta: {
      ...Permissions.couponAdd
    }
  },
  ////Order List
  {
    path: '/store/orders',
    element: <OrderList />,
    name: 'store.order.list',
    meta: {
      ...Permissions.customerBrowse
    }
  },
  {
    path: '/store/customers/rating',
    element: <OrderList />,
    name: 'store.customers.rating',
    meta: {
      ...Permissions.customerBrowse
    }
  },
  {
    path: '/store/gatekeeper/rating',
    element: <OrderList />,
    name: 'store.gatekeeper.rating',
    meta: {
      ...Permissions.customerBrowse
    }
  },
  // {
  //     path: '/create-permissions-php',
  //     element: <CreatePermissions />,
  //     name: 'create.permissions',
  //     meta: {
  //         ...Permissions.dashboardBrowse
  //     }
  // },
  // {
  //     path: '/print/invoice/:orderId',
  //     element: <PrintInvoice />,
  //     // layout: 'BlankLayout',
  //     name: 'print.invoice',
  //     meta: {
  //         layout: 'blank',
  //         ...Permissions.dashboardBrowse
  //     }
  // },

  {
    path: '/admin/activity/log',
    element: <ActivtyLog />,
    // layout: 'BlankLayout',
    name: 'admin.activity.log',
    meta: {
      ...Permissions.couponBrowse
    }
  },
  //referrals
  {
    path: '/admin/referrals/family-referrals',
    element: <Referrals />,
    // layout: 'BlankLayout',
    name: 'admin.referrals',
    meta: {
      ...Permissions.referralsBrowse
    }
  },
  {
    name: 'bulk-referrals',
    path: '/bulk-referrals',
    element: <BulkReferals />,
    meta: {
      ...Permissions.referralsBrowse
    }
  },
  {
    path: '/admin/referrals/store-referrals',
    element: <StoreReferrals />,
    // layout: 'BlankLayout',
    name: 'admin.store.referrals',
    meta: {
      ...Permissions.referralsBrowse
    }
  },

  {
    path: '/store/gatekeeper/log',
    element: <GateKeeperLog />,
    // layout: 'BlankLayout',
    name: 'store.gatekeeper.log',
    meta: {
      ...Permissions.feedbackBrowse
    }
  },
  {
    path: '/admin/country',
    element: <CountryList />,
    // layout: 'BlankLayout',
    name: 'admin.country',
    meta: {
      ...Permissions.appSettingsBrowse
    }
  },
  {
    path: '/admin/login/setting',
    element: <LoginSetting />,
    // layout: 'BlankLayout',
    name: 'login.setting',
    meta: {
      ...Permissions.appSettingsBrowse
    }
  }
] as const

export type RouteName = typeof SatocciRoute[number]['name']

export default SatocciRoute
