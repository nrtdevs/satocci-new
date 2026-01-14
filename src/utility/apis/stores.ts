import {
  storesDelete,
  storesLoad,
  storesSave,
  storesUpdate
} from '../../redux/reducers/storeReducer'
import ApiEndpoints from '../http/ApiEndpoints'
import http from '../http/useHttp'

interface dataTypes {
  async?: boolean
  jsonData?: any
  id?: string | number
  page?: string | number
  perPage?: string | number
  dispatch?: (e: any) => void
  success?: (e: any) => void
  loading?: (e: boolean) => void
}
export const loadStores = async ({
  async = false,
  jsonData,
  loading,
  page,
  perPage,
  dispatch = () => {},
  success = () => {}
}: dataTypes) => {
  return http.request({
    async,
    method: 'post',
    path: ApiEndpoints.load_stores,
    jsonData,
    loading,
    params: { page, per_page_record: perPage },
    success: (e: any) => {
      dispatch(storesLoad(e?.data))
      // log(e)
      success(e)
    },
    error: () => {
      /** ErrorToast("data-fetch-failed") **/
    }
  })
}

export const addStore = async ({
  async = false,
  jsonData,
  loading,
  page,
  perPage,
  dispatch = () => {},
  success = () => {}
}: dataTypes) => {
  return http.request({
    async,
    method: 'post',
    path: ApiEndpoints.add_stores,
    jsonData,
    loading,
    params: { page, per_page_record: perPage },
    success: (e: any) => {
      dispatch(storesSave([e?.data]))

      success(e)
    },
    error: () => {
      /** ErrorToast("data-fetch-failed") **/
    }
  })
}

export const editStores = async ({
  id,
  async = false,
  jsonData,
  loading,
  page,
  perPage,
  dispatch = () => {},
  success = () => {}
}: dataTypes) => {
  return http.request({
    async,
    method: 'put',
    path: ApiEndpoints.edit_stores + id,
    jsonData,
    params: { page, per_page_record: perPage },
    loading,
    success: (e: any) => {
      dispatch(storesUpdate(e?.data))

      success(e)
    },
    error: () => {
      /** ErrorToast("data-fetch-failed") **/
    }
  })
}

export const deleteStores = async ({
  id,
  async = false,
  jsonData,
  loading,
  page,
  perPage,
  dispatch = () => {},
  success = () => {}
}: dataTypes) => {
  return http.request({
    async,
    method: 'delete',
    path: ApiEndpoints.delete_stores + id,
    jsonData,
    loading,
    params: { page, per_page_record: perPage },
    success: (e: any) => {
      dispatch(storesDelete(e?.data))

      success(e)
    },
    error: () => {
      /** ErrorToast("data-fetch-failed") **/
    }
  })
}

// export const actionSenderIds = async ({
//   async = false,
//   jsonData,
//   loading,
//   page,
//   perPage,
//   dispatch = () => {},
//   success = () => {}
// }: dataTypes) => {
//   return http.request({
//     async,
//     method: 'post',
//     path: ApiEndpoints.action_senderIds,
//     jsonData,
//     loading,
//     success: (e) => {
//       dispatch(senderIdsSave(e?.data))
//       log(e)
//       success(e)
//     },
//     error: () => {
//       /** ErrorToast("data-fetch-failed") **/
//     }
//   })
// }

export const viewStores = async ({ id, async = false, loading, success = () => {} }: dataTypes) => {
  return http.request({
    async,
    method: 'GET',
    path: ApiEndpoints.view_stores + id,
    loading,
    success: (e: any) => {
      success(e?.payload)
    },
    error: () => {
      /** ErrorToast("data-fetch-failed") **/
    }
  })
}
