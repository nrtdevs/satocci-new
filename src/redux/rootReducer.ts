// ** Reducers Imports
import auth from './authentication'
import layout from './layout'
import navbar from './navbar'
import { dropdownApi } from './reducers/DropDownReducer'
import employee from './reducers/employeeReducer'
import language from './reducers/Language'
import message from './reducers/messageReducer'
import session from './reducers/sessionRducer'
import stores from './reducers/storeReducer'
import subscription from './reducers/subscriptionReducer'
import { employeeAdminManagement } from './RTKQuery/AdminEmployeeRTK'
import { AppSettingManagement } from './RTKQuery/AppSettingsRTK'
import { CardsManagement } from './RTKQuery/CardsRTK'
import { CategoryManagement } from './RTKQuery/CategoryRTK'
import { CouponManagement } from './RTKQuery/CouponRTK'
import { CustomerManagement } from './RTKQuery/CustomerRTK'
import { EmailTemplateManagement } from './RTKQuery/EmailTemplateRTK'
import { employeeManagement } from './RTKQuery/EmployeeRTK'
import { FeedbackManagement } from './RTKQuery/FedbackRTK'
import { GroupManagement } from './RTKQuery/GroupRTK'
import { LabelManagement } from './RTKQuery/LabelsRTK'
import { LanguageManagement } from './RTKQuery/LanguageRTK'
import { ProcessingFee } from './RTKQuery/paymentProcessingfeeSetupRTK'
import { NotificationManagement } from './RTKQuery/NotificationRTK'
import { OrderManagement } from './RTKQuery/OrdersRTK'
import { PermissionManagement } from './RTKQuery/PermissionRTK'
import { ProductManagement } from './RTKQuery/ProductRTK'
import { PromotionTemplateManagement } from './RTKQuery/PromotionTemplateRTK'
import { PerRolesManagement } from './RTKQuery/RolesPermissionsRTK'
import { StoreManagement } from './RTKQuery/StoreRTK'
import { SubscriptionManagement } from './RTKQuery/SubscriptionRTK'
import { SubStoreManagement } from './RTKQuery/SubStoreRTK'
import { TransactionManagement } from './RTKQuery/TransactionsRTK'
import { CountryListRTK } from './RTKQuery/countryListRTK'
import { ReturnOrderManagement } from './RTKQuery/ReturnOrderRTK'
import { CountryManagement } from './RTKQuery/CountryRTK'
const rootReducer = {
  [LanguageManagement.reducerPath]: LanguageManagement.reducer,
  [NotificationManagement.reducerPath]: NotificationManagement.reducer,
  [ProcessingFee.reducerPath]: ProcessingFee.reducer,
  [dropdownApi.reducerPath]: dropdownApi.reducer,
  [StoreManagement.reducerPath]: StoreManagement.reducer,
  [CategoryManagement.reducerPath]: CategoryManagement.reducer,
  [employeeManagement.reducerPath]: employeeManagement.reducer,
  [ProductManagement.reducerPath]: ProductManagement.reducer,
  [LabelManagement.reducerPath]: LabelManagement.reducer,
  [CustomerManagement.reducerPath]: CustomerManagement.reducer,
  [SubStoreManagement.reducerPath]: SubStoreManagement.reducer,
  [GroupManagement.reducerPath]: GroupManagement.reducer,
  [employeeAdminManagement.reducerPath]: employeeAdminManagement.reducer,
  [FeedbackManagement.reducerPath]: FeedbackManagement.reducer,
  [CardsManagement.reducerPath]: CardsManagement.reducer,
  [PerRolesManagement.reducerPath]: PerRolesManagement.reducer,
  [AppSettingManagement.reducerPath]: AppSettingManagement.reducer,
  [EmailTemplateManagement.reducerPath]: EmailTemplateManagement.reducer,
  [PermissionManagement.reducerPath]: PermissionManagement.reducer,
  [CouponManagement.reducerPath]: CouponManagement.reducer,
  [OrderManagement.reducerPath]: OrderManagement.reducer,
  [SubscriptionManagement.reducerPath]: SubscriptionManagement.reducer,
  [TransactionManagement.reducerPath]: TransactionManagement.reducer,
  [PromotionTemplateManagement.reducerPath]: PromotionTemplateManagement.reducer,
  [CountryListRTK.reducerPath]: CountryListRTK.reducer,
  [ReturnOrderManagement.reducerPath]: ReturnOrderManagement.reducer,
  [CountryManagement.reducerPath]: CountryManagement.reducer,
  message,
  subscription,
  session,
  employee,
  stores,
  auth,
  navbar,
  layout,
  language
}
export const middleware = [
  OrderManagement.middleware,
  CountryManagement.middleware,
  NotificationManagement.middleware,
  LanguageManagement.middleware,
  ProcessingFee.middleware,
  dropdownApi.middleware,
  StoreManagement.middleware,
  CategoryManagement.middleware,
  ProductManagement.middleware,
  employeeManagement.middleware,
  employeeAdminManagement.middleware,
  GroupManagement.middleware,
  SubStoreManagement.middleware,
  CustomerManagement.middleware,
  LabelManagement.middleware,
  FeedbackManagement.middleware,
  CardsManagement.middleware,
  PerRolesManagement.middleware,
  AppSettingManagement.middleware,
  EmailTemplateManagement.middleware,
  PermissionManagement.middleware,
  CouponManagement.middleware,
  SubscriptionManagement.middleware,
  TransactionManagement.middleware,
  PromotionTemplateManagement.middleware,
  ReturnOrderManagement.middleware
]
export default rootReducer
