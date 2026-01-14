/* Action = Permission, Resource = Group-Group */
// export interface PermissionType {

// do not remove
export type PermissionType = {
  action: string
  resource: string
  belongs_to?: any
}
export const Permissions = Object.freeze({
  // Dashboard
  //   {
  //     action: "dashboard-browse",
  //     resource: "all",
  //     belongs_to: "3",
  //   },
  dashboardBrowse: {
    action: 'dashboard-browse',
    resource: 'all',
    belongs_to: 3
  },
  ////Stores
  //   {
  //     action: "store-browse",
  //     resource: "store",
  //     belongs_to: "1",
  //   },

  storeBrowse: {
    action: 'store-browse',
    resource: 'store',
    belongs_to: 3
  },
  //   {
  //     action: "store-edit",
  //     resource: "store",
  //     belongs_to: "1",
  //   },
  storeEdit: {
    action: 'store-edit',
    resource: 'store',
    belongs_to: 3
  },
  //   {
  //     action: "store-add",
  //     resource: "store",
  //     belongs_to: "1",
  //   },
  storeAdd: {
    action: 'store-add',
    resource: 'store',
    belongs_to: 3
  },
  //   {
  //     action: "store-delete",
  //     resource: "store",
  //     belongs_to: "1",
  //   },
  storeDelete: {
    action: 'store-delete',
    resource: 'store',
    belongs_to: 3
  },
  //   {
  //     action: "store-read",
  //     resource: "store",
  //     belongs_to: "1",
  //   },
  storeRead: {
    action: 'store-read',
    resource: 'store',
    belongs_to: 3
  },

  //coupon
  //   {
  //     action: "coupon-browse",
  //     resource: "coupon",
  //     belongs_to: "3",
  //   },

  couponBrowse: {
    action: 'coupon-browse',
    resource: 'coupon',
    belongs_to: 3
  },
  //   {
  //     action: "coupon-add",
  //     resource: "coupon",
  //     belongs_to: "3",
  //   },
  couponAdd: {
    action: 'coupon-add',
    resource: 'coupon',
    belongs_to: 3
  },
  //   {
  //     action: "coupon-read",
  //     resource: "coupon",
  //     belongs_to: "3",
  //   },
  couponRead: {
    action: 'coupon-read',
    resource: 'coupon',
    belongs_to: 3
  },
  //   {
  //     action: "coupon-edit",
  //     resource: "coupon",
  //     belongs_to: "3",
  //   },
  couponEdit: {
    action: 'coupon-edit',
    resource: 'coupon',
    belongs_to: 3
  },

  ///Products

  //   {
  //     action: "product-browse",
  //     resource: "product",
  //     belongs_to: "3",
  //   },
  productBrowse: {
    action: 'product-browse',
    resource: 'product',
    belongs_to: 3
  },
  //   {
  //     action: "product-read",
  //     resource: "product",
  //     belongs_to: "3",
  //   },
  productRead: {
    action: 'product-read',
    resource: 'product',
    belongs_to: 3
  },
  //   {
  //     action: "product-edit",
  //     resource: "product",
  //     belongs_to: "3",
  //   },
  productEdit: {
    action: 'product-edit',
    resource: 'product',
    belongs_to: 3
  },
  //   {
  //     action: "product-add",
  //     resource: "product",
  //     belongs_to: "3",
  //   },
  productAdd: {
    action: 'product-add',
    resource: 'product',
    belongs_to: 3
  },
  //   {
  //     action: "product-delete",
  //     resource: "product",
  //     belongs_to: "3",
  //   },
  productDelete: {
    action: 'product-delete',
    resource: 'product',
    belongs_to: 3
  },

  /////Store Employee
  //   {
  //     action: "employee-browse",
  //     resource: "employee",
  //     belongs_to: "3",
  //   },

  employeeBrowse: {
    action: 'employee-browse',
    resource: 'employee',
    belongs_to: 3
  },
  //   {
  //     action: "employee-edit",
  //     resource: "employee",
  //     belongs_to: "3",
  //   },
  employeeEdit: {
    action: 'employee-edit',
    resource: 'employee',
    belongs_to: 3
  },
  //   {
  //     action: "employee-add",
  //     resource: "employee",
  //     belongs_to: "3",
  //   },
  employeeAdd: {
    action: 'employee-add',
    resource: 'employee',
    belongs_to: 3
  },
  //   {
  //     action: "employee-delete",
  //     resource: "employee",
  //     belongs_to: "3",
  //   },
  employeeDelete: {
    action: 'employee-delete',
    resource: 'employee',
    belongs_to: 3
  },
  //   {
  //     action: "employee-read",
  //     resource: "employee",
  //     belongs_to: "3",
  //   },
  employeeRead: {
    action: 'employee-read',
    resource: 'employee',
    belongs_to: 3
  },
  ////Employee Admin
  //   {
  //     action: "employeeAdmin-browse",
  //     resource: "employeeAdmin",
  //     belongs_to: "1",
  //   },

  employeeAdminBrowse: {
    action: 'employeeAdmin-browse',
    resource: 'employeeAdmin',
    belongs_to: 1
  },
  //   {
  //     action: "employeeAdmin-edit",
  //     resource: "employeeAdmin",
  //     belongs_to: "1",
  //   },
  employeeAdminEdit: {
    action: 'employeeAdmin-edit',
    resource: 'employeeAdmin',
    belongs_to: 1
  },
  //   {
  //     action: "employeeAdmin-add",
  //     resource: "employeeAdmin",
  //     belongs_to: "1",
  //   },
  employeeAdminAdd: {
    action: 'employeeAdmin-add',
    resource: 'employeeAdmin',
    belongs_to: 1
  },
  //   {
  //     action: "employeeAdmin-delete",
  //     resource: "employeeAdmin",
  //     belongs_to: "1",
  //   },
  employeeAdminDelete: {
    action: 'employeeAdmin-delete',
    resource: 'employeeAdmin',
    belongs_to: 1
  },
  //   {
  //     action: "employeeAdmin-read",
  //     resource: "employeeAdmin",
  //     belongs_to: "1",
  //   },
  employeeAdminRead: {
    action: 'employeeAdmin-read',
    resource: 'employeeAdmin',
    belongs_to: 1
  },
  /////////////Session
  // {
  //     action: "session-browse",
  //     resource: "session",
  //     belongs_to: "3",
  //   },

  sessionBrowse: {
    action: 'session-browse',
    resource: 'session',
    belongs_to: 2
  },
  //   {
  //     action: "session-edit",
  //     resource: "session",
  //     belongs_to: "3",
  //   },
  sessionEdit: {
    action: 'session-edit',
    resource: 'session',
    belongs_to: 2
  },
  //   {
  //     action: "session-add",
  //     resource: "session",
  //     belongs_to: "3",
  //   },
  sessionAdd: {
    action: 'session-add',
    resource: 'session',
    belongs_to: 2
  },
  //   {
  //     action: "session-delete",
  //     resource: "session",
  //     belongs_to: "3",
  //   },
  sessionDelete: {
    action: 'session-delete',
    resource: 'session',
    belongs_to: 2
  },
  //   {
  //     action: "session-read",
  //     resource: "session",
  //     belongs_to: "3",
  //   },
  sessionRead: {
    action: 'session-read',
    resource: 'session',
    belongs_to: 2
  },
  ////Categories
  //   {
  //     action: "category-browse",
  //     resource: "category",
  //     belongs_to: "2",
  //   },

  categoryBrowse: {
    action: 'category-browse',
    resource: 'category',
    belongs_to: 3
  },
  //   {
  //     action: "category-edit",
  //     resource: "category",
  //     belongs_to: "2",
  //   },
  categoryEdit: {
    action: 'category-edit',
    resource: 'category',
    belongs_to: 3
  },
  //   {
  //     action: "category-add",
  //     resource: "category",
  //     belongs_to: "2",
  //   },
  categoryAdd: {
    action: 'category-add',
    resource: 'category',
    belongs_to: 3
  },
  //   {
  //     action: "category-delete",
  //     resource: "category",
  //     belongs_to: "2",
  //   },
  categoryDelete: {
    action: 'category-delete',
    resource: 'category',
    belongs_to: 3
  },
  //   {
  //     action: "category-read",
  //     resource: "category",
  //     belongs_to: "2",
  //   },
  categoryRead: {
    action: 'category-read',
    resource: 'category',
    belongs_to: 3
  },
  ///Language
  //   {
  //     action: "language-browse",
  //     resource: "language",
  //     belongs_to: "3",
  //   },

  languageBrowse: {
    action: 'language-browse',
    resource: 'language',
    belongs_to: 1
  },
  //   {
  //     action: "language-edit",
  //     resource: "language",
  //     belongs_to: "1",
  //   },
  languageEdit: {
    action: 'language-edit',
    resource: 'language',
    belongs_to: 1
  },
  //   {
  //     action: "language-add",
  //     resource: "language",
  //     belongs_to: "1",
  //   },
  languageAdd: {
    action: 'language-add',
    resource: 'language',
    belongs_to: 1
  },
  //   {
  //     action: "language-delete",
  //     resource: "language",
  //     belongs_to: "1",
  //   },
  languageDelete: {
    action: 'language-delete',
    resource: 'language',
    belongs_to: 1
  },
  //   {
  //     action: "language-read",
  //     resource: "language",
  //     belongs_to: "3",
  //   },
  languageRead: {
    action: 'language-read',
    resource: 'language',
    belongs_to: 1
  },
  ///Feedback
  //   {
  //     action: "feedback-browse",
  //     resource: "feedback",
  //     belongs_to: "1",
  //   },

  feedbackBrowse: {
    action: 'feedback-browse',
    resource: 'feedback',
    belongs_to: 3
  },
  //   {
  //     action: "feedback-edit",
  //     resource: "feedback",
  //     belongs_to: "3",
  //   },
  feedbackEdit: {
    action: 'feedback-edit',
    resource: 'feedback',
    belongs_to: 3
  },
  //   {
  //     action: "feedback-add",
  //     resource: "feedback",
  //     belongs_to: "3",
  //   },
  feedbackAdd: {
    action: 'feedback-add',
    resource: 'feedback',
    belongs_to: 3
  },
  //   {
  //     action: "feedback-delete",
  //     resource: "feedback",
  //     belongs_to: "3",
  //   },
  feedbackDelete: {
    action: 'feedback-delete',
    resource: 'feedback',
    belongs_to: 3
  },
  //   {
  //     action: "feedback-read",
  //     resource: "feedback",
  //     belongs_to: "1",
  //   },
  feedbackRead: {
    action: 'feedback-read',
    resource: 'feedback',
    belongs_to: 3
  },

  ///notification tempalate
  //   {
  //     action: "notification-template-browse",
  //     resource: "notification-template",
  //     belongs_to: "1",
  //   },

  notificationTemplateBrowse: {
    action: 'notification-template-browse',
    resource: 'notification-template',
    belongs_to: 1
  },
  //   {
  //     action: "notification-template-edit",
  //     resource: "notification-template",
  //     belongs_to: "1",
  //   },
  notificationTemplateEdit: {
    action: 'notification-template-edit',
    resource: 'notification-template',
    belongs_to: 1
  },
  //   {
  //     action: "notification-template-add",
  //     resource: "notification-template",
  //     belongs_to: "1",
  //   },
  notificationTemplateAdd: {
    action: 'notification-template-add',
    resource: 'notification-template',
    belongs_to: 1
  },

  //   {
  //     action: "notification-template-read",
  //     resource: "notification-template",
  //     belongs_to: "1",
  //   },
  notificationTemplateRead: {
    action: 'notification-template-read',
    resource: 'notification-template',
    belongs_to: 1
  },
  ///App Settings
  //   {
  //     action: "appSettings-browse",
  //     resource: "appSettings",
  //     belongs_to: "1",
  //   },

  appSettingsBrowse: {
    action: 'appSettings-browse',
    resource: 'appSettings',
    belongs_to: 1
  },
  //   {
  //     action: "appSettings-edit",
  //     resource: "appSettings",
  //     belongs_to: "1",
  //   },
  appSettingsEdit: {
    action: 'appSettings-edit',
    resource: 'appSettings',
    belongs_to: 1
  },

  //   {
  //     action: "appSettings-add",
  //     resource: "appSettings",
  //     belongs_to: "1",
  //   },

  appSettingsAdd: {
    action: 'appSettings-add',
    resource: 'appSettings',
    belongs_to: 1
  },
  //   {
  //     action: "appSettings-delete",
  //     resource: "appSettings",
  //     belongs_to: "1",
  //   },
  appSettingsDelete: {
    action: 'appSettings-delete',
    resource: 'appSettings',
    belongs_to: 1
  },
  //   {
  //     action: "appSettings-read",
  //     resource: "appSettings",
  //     belongs_to: "1",
  //   },
  appSettingsRead: {
    action: 'appSettings-read',
    resource: 'appSettings',
    belongs_to: 1
  },
  ////Roles
  //   {
  //     action: "roles-browse",
  //     resource: "roles",
  //     belongs_to: "1",
  //   },
  rolesBrowse: {
    action: 'roles-browse',
    resource: 'roles',
    belongs_to: 3
  },
  //   {
  //     action: "roles-edit",
  //     resource: "roles",
  //     belongs_to: "3",
  //   },
  rolesEdit: {
    action: 'roles-edit',
    resource: 'roles',
    belongs_to: 3
  },
  //   {
  //     action: "roles-add",
  //     resource: "roles",
  //     belongs_to: "3",
  //   },
  rolesAdd: {
    action: 'roles-add',
    resource: 'roles',
    belongs_to: 3
  },
  //   {
  //     action: "roles-delete",
  //     resource: "roles",
  //     belongs_to: "3",
  //   },
  rolesDelete: {
    action: 'roles-delete',
    resource: 'roles',
    belongs_to: 3
  },
  //   {
  //     action: "roles-read",
  //     se_name: "roles-read",
  //     resource: "roles",
  //     belongs_to: "3",
  //   },
  rolesRead: {
    action: 'roles-read',
    resource: 'roles',
    belongs_to: 3
  },

  ////Customer
  //   {
  //     action: "customer-browse",
  //     resource: "customer",
  //     belongs_to: "3",
  //   },
  customerBrowse: {
    action: 'customer-browse',
    resource: 'customer',
    belongs_to: 2
  },

  ////Reports
  //   {
  //     action: "report-browse",
  //     resource: "report",
  //     belongs_to: "3",
  //   },

  reportsBrowse: {
    action: 'report-browse',
    resource: 'report',
    belongs_to: 3
  },
  //   {
  //     action: "report-edit",
  //     resource: "report",
  //     belongs_to: "1",
  //   },
  reportsEdit: {
    action: 'report-edit',
    resource: 'report',
    belongs_to: 3
  },
  //   {
  //     action: "report-add",
  //     resource: "report",
  //     belongs_to: "3",
  //   },
  reportsAdd: {
    action: 'report-add',
    resource: 'report',
    belongs_to: 3
  },
  //   {
  //     action: "report-delete",
  //     resource: "report",
  //     belongs_to: "1",
  //   },
  reportsDelete: {
    action: 'report-delete',
    resource: 'report',
    belongs_to: 3
  },
  //   {
  //     action: "report-read",
  //     resource: "report",
  //     belongs_to: "1",
  //   },
  reportsRead: {
    action: 'report-read',
    resource: 'report',
    belongs_to: 3
  },
  ///Transaction
  //   {
  //     action: "transaction-browse",
  //     resource: "transaction",
  //     belongs_to: "3",
  //   },
  transactionBrowse: {
    action: 'transaction-browse',
    resource: 'transaction',
    belongs_to: 3
  },

  ///Labels

  //   {

  //   {
  //     action: "label-browse",
  //     resource: "label",
  //     belongs_to: "1",
  //   },
  labelBrowse: {
    action: 'label-browse',
    resource: 'label',
    belongs_to: 1
  },
  //   {
  //     action: "label-edit",
  //     resource: "label",
  //     belongs_to: "1",
  //   },
  labelEdit: {
    action: 'label-edit',
    resource: 'label',
    belongs_to: 1
  },
  //   {
  //     action: "label-add",
  //     resource: "label",
  //     belongs_to: "1",
  //   },
  labelAdd: {
    action: 'label-add',
    resource: 'label',
    belongs_to: 1
  },
  //     action: "label-delete",
  //     resource: "label",
  //     belongs_to: "1",
  //   },
  labelDelete: {
    action: 'label-delete',
    resource: 'label',
    belongs_to: 1
  },

  ///Subscription
  //   {
  //     action: "subscription-browse",
  //     resource: "subscription",
  //     belongs_to: "1",
  //   },

  subscriptionBrowse: {
    action: 'subscription-browse',
    resource: 'subscription',
    belongs_to: 1
  },
  //   {
  //     action: "subscription-edit",
  //     resource: "subscription",
  //     belongs_to: "1",
  //   },
  subscriptionEdit: {
    action: 'subscription-edit',
    resource: 'subscription',
    belongs_to: 1
  },

  //StoreCustomer
  //   {
  //     action: "storeCustomer-browse",
  //     resource: "storeCustomer",
  //     belongs_to: "3",
  //   },
  storeCustomerBrowse: {
    action: 'storeCustomer-browse',
    resource: 'storeCustomer',
    belongs_to: 3
  },

  // Content & promotion

  //   {
  //     action: "content-browse",
  //     resource: "content",
  //     belongs_to: "3",
  //   },
  contentBrowse: {
    action: 'content-browse',
    resource: 'content',
    belongs_to: 1
  },
  //   {
  //     action: "content-add",
  //     resource: "content",
  //     belongs_to: "3",
  //   },
  contentAdd: {
    action: 'content-add',
    resource: 'content',
    belongs_to: 1
  },
  //   {
  //     action: "content-edit",
  //     resource: "content",
  //     belongs_to: "3",
  //   },
  contentEdit: {
    action: 'content-edit',
    resource: 'content',
    belongs_to: 1
  },
  //   {
  //     action: "content-read",
  //     resource: "content",
  //     belongs_to: "3",
  //   },
  contentRead: {
    action: 'content-read',
    resource: 'content',
    belongs_to: 1
  },
  //   {
  //     action: "content-delete",
  //     resource: "content",
  //     belongs_to: "3",
  //   },
  contentDelete: {
    action: 'content-delete',
    resource: 'content',
    belongs_to: 1
  },
  //   {F
  //     action: "content-log",
  //     resource: "content",
  //     belongs_to: "3",
  //   },
  contentLog: {
    action: 'content-log',
    resource: 'content',
    belongs_to: 1
  },
  //   {
  //     action: "content-send",
  //     resource: "content",
  //     belongs_to: "3",
  //   },
  contentSend: {
    action: 'content-send',
    resource: 'content',
    belongs_to: 1
  },

  //referral
  //   {
  //     action: "referral",
  //     resource: "referral",
  //     belongs_to: "1",
  //   },
  referralsBrowse: {
    action: 'referral',
    resource: 'referral',
    belongs_to: 1
  },

  //generate barcode
  //   {
  //     action: "generate",
  //     resource: "barcode",
  //     belongs_to: "3",
  //   },

  generateBarcode: {
    action: 'generate',
    resource: 'barcode',
    belongs_to: 2
  },
  ///return object
  //   {
  //     action: "list-return-and-refund-order",
  //     resource: "return & refund",
  //     belongs_to: "2",
  //   },

  returnRefundBrowse: {
    action: 'list-return-and-refund-order',
    resource: 'return & refund',
    belongs_to: 2
  },
  //   {
  //     action: "approve-reject-return",
  //     resource: "return & refund",
  //     belongs_to: "2",
  //   },
  approveReject: {
    action: 'approve-reject-return',
    resource: 'return & refund',
    belongs_to: 2
  },
  //   {
  //     action: "create-return-and-refund-order",
  //     resource: "return & refund",
  //     belongs_to: "2",
  //   },
  returnRefundAdd: {
    action: 'create-return-and-refund-order',
    resource: 'return & refund',
    belongs_to: 2
  },
  //   {
  //     action: "refund-return",
  //     resource: "return & refund",
  //     belongs_to: "2",
  //   },
  refundInitiated: {
    action: 'refund-return',
    resource: 'return & refund',
    belongs_to: 2
  },
  //////sub store

  //   {
  //     action: "sub-store-browse",
  //     resource: "sub-store",
  //     belongs_to: "2",
  //   },

  subStoreBrowse: {
    action: 'sub-store-browse',
    resource: 'sub-store',
    belongs_to: '2'
  },
  //   {
  //     action: "sub-store-add",
  //     resource: "sub-store",
  //     belongs_to: "2",
  //   },
  subStoreAdd: {
    action: 'sub-store-add',
    resource: 'sub-store',
    belongs_to: '2'
  },
  //   {
  //     action: "sub-store-read",
  //     resource: "sub-store",
  //     belongs_to: "2",
  //   },
  subStoreRead: {
    action: 'sub-store-read',
    resource: 'sub-store',
    belongs_to: '2'
  },
  //   {
  //     action: "sub-store-edit",
  //     resource: "sub-store",
  //     belongs_to: "2",
  //   },
  subStoreEdit: {
    action: 'sub-store-edit',
    resource: 'sub-store',
    belongs_to: '2'
  },
  //   {
  //     action: "sub-store-delete",
  //     resource: "sub-store",
  //     belongs_to: "2",
  //   },
  subStoreDelete: {
    action: 'sub-store-delete',
    resource: 'sub-store',
    belongs_to: '2'
  },

  ///UserType
  //   {
  //     action: "userType-browse",
  //     resource: "userType",
  //     belongs_to: "1",
  //   },

  userTypesBrowse: {
    action: 'userType-browse',
    resource: 'userType',
    belongs_to: '1'
  },
  //   {
  //     action: "userType-add",
  //     resource: "userType",
  //     belongs_to: "1",
  //   },
  userTypesAdd: {
    action: 'userType-add',
    resource: 'userType',
    belongs_to: '1'
  },
  //   {
  //     action: "userType-read",
  //     resource: "userType",
  //     belongs_to: "1",
  //   },
  userTypesRead: {
    action: 'userType-read',
    resource: 'userType',
    belongs_to: '1'
  },
  //   {
  //     action: "userType-edit",
  //     resource: "userType",
  //     belongs_to: "1",
  //   },
  userTypesEdit: {
    action: 'userType-edit',
    resource: 'userType',
    belongs_to: '1'
  },
  //   {
  //     action: "userType-delete",
  //     resource: "userType",
  //     belongs_to: "1",
  //   },
  userTypesDelete: {
    action: 'userType-delete',
    resource: 'userType',
    belongs_to: '1'
  }
})
