// // ** Api Endpoints

// //const domainSocket = '3.75.64.173'
// //below comment for stagging
// // const domainSocket = 'stagingapi.satoccifinance.se/wss2/'
// // const domain = 'stagingapi.satoccifinance.se'
// //below comment for production
// const domainSocket = 'api.satoccifinance.se/wss2/'
// const domain = 'api.satoccifinance.se'

// export default {
//   // ** This will be prefixed in authorization header with token
//   // ? e.g. Authorization: Bearer <token>
//   tokenType: 'Bearer',
//   entryPoint: 'web',

//   // ** Value of this property will be used as key to store JWT token in storage
//   storageTokenKeyName: 'satocci_access_token',
//   storageRefreshTokenKeyName: 'satocci_access_token',

//   // base api urls
//   //https replace to http  with last commit
//   baseUrl: `https://${domain}/api/`,
//   baseUrl2: `https://${domain}/`,
//   baseUrl3: `https://${domain}`,

//   enableSocket: true,
//   //below comment for production
//   socketChatUrl: `wss://${domainSocket}:8090`,
//   //below comment for stagging
//   //   socketChatUrl: `wss://${domainSocket}:8091`,

//   //socketNotificationUrl: '3.75.64.173',
//   socketNotificationUrl: `${domain}`,
//   //below comment for stagging
//   socketNotificationPort: 6002,

//   //below comment for production
//   //   socketNotificationPort: 6001,
//   //below comment for stagging
//   encryptKey: 'C&E)H@McQfTjWnZr4u7x!A%D*G-JaNdR',
//   //   enableAES: true

//   //below comment for production
//   //   encryptKey: 'C&E)H@McQfTjWnZr4u7x!A%D*G-JaNdR',
//   enableAES: true
// }

// Set the environment mode: 'production' or 'staging'
const mode = 'production' // or 'staging'  production

// Configurations for both environments
const environments = {
  staging: {
    domain: 'stagingapi.satoccifinance.se',
    domainSocket: 'stagingapi.satoccifinance.se/wss2/',
    socketChatPort: 8091,
    socketNotificationPort: 6002,
    encryptKey: 'C&E)H@McQfTjWnZr4u7x!A%D*G-JaNdR',
    enableAES: true
  },
  production: {
    domain: 'api.satoccifinance.se',
    domainSocket: 'api.satoccifinance.se/wss2/',
    socketChatPort: 8090,
    socketNotificationPort: 6001,
    encryptKey: 'C&E)H@McQfTjWnZr4u7x!A%D*G-JaNdR',
    enableAES: true
  }
}

// Select environment config based on the mode
const env = environments[mode]

export default {
  // Token Config
  tokenType: 'Bearer',
  entryPoint: 'web',
  storageTokenKeyName: 'satocci_access_token',
  storageRefreshTokenKeyName: 'satocci_access_token',

  // API URLs
  baseUrl: `https://${env.domain}/api/`,
  baseUrl2: `https://${env.domain}/`,
  baseUrl3: `https://${env.domain}`,

  // WebSocket Config
  enableSocket: true,
  socketChatUrl: `wss://${env.domainSocket}:${env.socketChatPort}`,
  socketNotificationUrl: env.domain,
  socketNotificationPort: env.socketNotificationPort,

  // Encryption
  encryptKey: env.encryptKey,
  enableAES: env.enableAES
}

export interface ResponseWithPagination<T> {
  current_page: string
  last_page: number
  per_page: string
  total: number
  promotions?: any
  data?: Array<T>
}

export interface ResponseParamsType<T> {
  code: number
  message: any
  payload: T
  success: boolean
  data?: any
}

export interface ResponseParamsTypeWithPagination<T> {
  code: number
  message: any
  error?: ResponseParamsType<T>
  data?: any
  payload: ResponseWithPagination<T>
  success: boolean
  year?: any
}

export interface ViewParams {
  userType?: any
  id?: number | string
  originalArgs?: any
  eventId?: any
  store_id?: any
  ids?: any
  currency?: any

  page?: any
  least?: any
  jsonData?: any
  request_for?: any
  data_of?: any
  year?: any
  per_page_record?: any
}

export interface RequestParamsWithPagePerPage {
  page?: number | string
  per_page_record?: number
}

export interface RequestParamsWithParentId {
  id?: any
  page?: number
  per_page_record?: number
}
