// import {
//   appSettingSave,
//   editProfiles,
//   settingForAdmin,
//   settingForClient
// } from '../../redux/reducers/appSettingsRedux'
import { log } from '../helpers/common'
import ApiEndpoints from '../http/ApiEndpoints'
import http from '../http/useHttp'
import { ErrorToast } from '../Utils'

// export const profileChangePassword = async ({
//   async = false,
//   jsonData,
//   loading,
//   page,
//   perPage,
//   dispatch = () => {},
//   success = () => {}
// }) => {
//   return http.request({
//     async,
//     method: 'post',
//     path: ApiEndpoints.profile_change_password,
//     jsonData,
//     loading,
//     params: { page, perPage },
//     // success: (e) => {
//     //     dispatch(dlrLoad(e?.data))
//     //     log(e)
//     //     success((e))
//     // },
//     success: (e) => {
//       success(e?.data)
//     },
//     error: () => {
//       /** ErrorToast("data-fetch-failed") **/
//     }
//   })
// }
// export const appSettingUpdate = async ({
//   async = false,
//   jsonData,
//   loading,
//   page,
//   perPage,
//   dispatch = () => {},
//   success = () => {}
// }) => {
//   return http.request({
//     async,
//     method: 'post',
//     path: ApiEndpoints.app_setting_update,
//     jsonData,
//     loading,
//     params: { page, perPage },
//     success: (e) => {
//       dispatch(appSettingSave(e?.data))
//       log(e)
//       success(e)
//     },
//     // success: (e) => { success(e?.data) },
//     error: () => {
//       /** ErrorToast("data-fetch-failed") **/
//     }
//   })
// }

// export const appSettingForAdmin = ({
//   async = false,
//   jsonData,
//   loading,
//   page,
//   perPage,
//   dispatch = () => {},
//   success = () => {}
// }) => {
//   http.request({
//     method: 'get',
//     path: ApiEndpoints.app_setting_admin,
//     loading,
//     // success: (e) => { success(e) },
//     success: (e) => {
//       dispatch(settingForAdmin(e?.data))
//       log('fsddggdf', e)
//       success(e)
//     },
//     error: () => {
//       /** ErrorToast("data-fetch-failed") **/
//     }
//   })
// }

// export const appSettingForClient = ({
//   async = false,
//   jsonData,
//   loading,
//   page,
//   perPage,
//   dispatch = () => {},
//   success = () => {}
// }) => {
//   http.request({
//     method: 'get',
//     path: ApiEndpoints.app_setting_client,
//     loading,
//     // success: (e) => { success(e) },
//     success: (e) => {
//       dispatch(settingForClient(e?.data))
//       log(e)
//       success(e)
//     },
//     error: () => {
//       /** ErrorToast("data-fetch-failed") **/
//     }
//   })
// }
// export const editProfile = ({
//   async = false,
//   jsonData,
//   loading,
//   page,
//   perPage,
//   dispatch = () => {},
//   success = () => {}
// }) => {
//   http.request({
//     method: 'POST',
//     jsonData,
//     async,
//     path: ApiEndpoints.edit_profile,
//     loading,
//     // success: (e) => { success(e) },
//     success: (e) => {
//       dispatch(editProfiles(e?.data))
//       log(e)
//       success(e)
//     },
//     error: () => {
//       /** ErrorToast("data-fetch-failed") **/
//     }
//   })
// }
// export const updateSelfPassword = ({
//   async = false,
//   jsonData,
//   loading,
//   page,
//   perPage,
//   dispatch = () => {},
//   success = () => {}
// }) => {
//   http.request({
//     method: 'POST',
//     jsonData,
//     async,
//     path: ApiEndpoints.update_self_password,
//     loading,
//     // success: (e) => { success(e) },
//     success: (e) => {
//       editProfiles(e?.data)
//       log(e)
//       success(e)
//     },
//     error: () => {
//       /** ErrorToast("data-fetch-failed") **/
//     }
//   })
// }
export const connectToStripe = ({
  async = false,
  jsonData,
  loading,
  page,
  perPage,
  dispatch = () => {},
  success = (e) => {}
}) => {
  http.request({
    method: 'GET',
    jsonData,
    async,
    path: ApiEndpoints.connect_stripe,
    loading,
    // success: (e) => { success(e) },
    success: (e) => {
      //   editProfiles(e?.data)
      // log('successs', e)
      success(e)
    },
    error: (e) => {
      ErrorToast(`${e?.data?.message}`)
      /** ErrorToast("data-fetch-failed") **/
    }
  })
}
export const loadStoreDetails = ({
  id,
  async = false,
  jsonData,
  loading,
  page,
  perPage,
  dispatch = () => {},
  success = () => {}
}) => {
  http.request({
    method: 'GET',
    id,
    jsonData,
    async,
    path: ApiEndpoints.subStore_view + id,
    loading,
    // success: (e) => { success(e) },
    success: (e) => {
      //   editProfiles(e?.data)
      log(e)
      success(e?.payload)
    },
    error: () => {
      // log('errorstripe', e)
      // ErrorToast('data-fetch-failed')
    }
  })
}
export const checkStripeStatus = ({
  async = false,
  jsonData,
  loading,
  page,
  perPage,
  dispatch = () => {},
  success = () => {},
  id
}) => {
  http.request({
    method: 'GET',
    id,
    jsonData,
    async,
    path: ApiEndpoints.check_stripe_status + id,
    loading,
    // success: (e) => { success(e) },
    success: (e) => {
      //   editProfiles(e?.data)
      log('success', e)
      success(e)
    },
    error: (e) => {
      ErrorToast(`${e?.data?.message}`)
    }
  })
}
export const regenerateStripeConnectLink = ({
  async = false,
  jsonData,
  loading,
  page,
  perPage,

  dispatch = () => {},
  success = () => {}
}) => {
  http.request({
    method: 'GET',
    jsonData,
    async,
    path: ApiEndpoints.regenerate_stripe_connect_link,
    loading,
    // success: (e) => { success(e) },
    success: (e) => {
      //   editProfiles(e?.data)
      log('success', e)
      success(e)
    },
    error: (e) => {
      ErrorToast(`${e?.data?.message}`)
    }
  })
}
