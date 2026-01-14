import {
  userEnableApiSecurity,
  userLoad,
  userSave,
  userUpdate
} from '../../redux/reducers/userManagement'
import { log } from '../helpers/common'
import ApiEndpoints from '../http/ApiEndpoints'
import http from '../http/useHttp'

export const loadUser = async ({
  async = false,
  jsonData,
  loading,
  page,
  perPage,
  dispatch = () => {},
  success = () => {}
}) => {
  return http.request({
    async,
    method: 'post',
    path: ApiEndpoints.load_user,
    jsonData,
    loading,
    params: { page, per_page_record: perPage },
    success: (e) => {
      dispatch(userLoad(e?.data))
      //   log(e)
      success(e)
    },
    error: () => {
      /** ErrorToast("data-fetch-failed") **/
    }
  })
}

export const addUser = async ({
  async = false,
  jsonData,
  loading,
  page,
  perPage,
  dispatch = () => {},
  success = () => {}
}) => {
  return http.request({
    async,
    method: 'post',
    path: ApiEndpoints.add_user,
    jsonData,
    loading,
    success: (e) => {
      dispatch(userSave([e?.data]))
      //log(e)
      success(e)
    },
    error: () => {
      /** ErrorToast("data-fetch-failed") **/
    }
  })
}

export const editUser = async ({
  id,
  async = false,
  jsonData,
  loading,
  page,
  perPage,
  dispatch = () => {},
  success = () => {}
}) => {
  return http.request({
    async,
    method: 'PUT',
    path: ApiEndpoints.edit_user + id,
    jsonData,
    loading,
    success: (e) => {
      dispatch(userUpdate(e?.data))
      log(e)
      success(e)
    },
    error: () => {
      /** ErrorToast("data-fetch-failed") **/
    }
  })
}

export const deleteUser = async ({
  id,
  async = false,
  jsonData,
  loading,
  page,
  perPage,
  dispatch = () => {},
  success = () => {}
}) => {
  return http.request({
    async,
    method: 'DELETE',
    path: ApiEndpoints.delete_user + id,
    jsonData,
    loading,
    success: (e) => {
      // dispatch(primaryDelete(e?.data))
      //log(e)
      success(e)
    },
    error: () => {
      /** ErrorToast("data-fetch-failed") **/
    }
  })
}

export const readUser = ({ id, loading, success = () => {} }) => {
  http.request({
    method: 'get',
    path: ApiEndpoints.read_user + id,
    loading,
    success: (data) => {
      success(data?.payload)
    },
    error: () => {
      /** ErrorToast("data-fetch-failed") **/
    }
  })
}

export const userAction = async ({
  async = false,
  jsonData,
  loading,
  page,
  perPage,
  dispatch = () => {},
  success = () => {}
}) => {
  return http.request({
    async,
    method: 'post',
    path: ApiEndpoints.user_action,
    jsonData,
    loading,
    success: (e) => {
      dispatch(userSave(e?.data))
      //log(e)
      success(e)
    },
    error: () => {
      /** ErrorToast("data-fetch-failed") **/
    }
  })
}

export const resetPasswordByUser = async ({
  async = false,
  jsonData,
  loading,
  page,
  perPage,
  dispatch = () => {},
  success = () => {}
}) => {
  return http.request({
    async,
    method: 'post',
    path: ApiEndpoints.reset_password_by_user,
    jsonData,
    loading,
    success: (e) => {
      dispatch(userSave(e?.data))
      // log(e)
      success(e)
    },
    error: () => {
      /** ErrorToast("data-fetch-failed") **/
    }
  })
}

export const userChangeApi = ({ id, loading, success = () => {} }) => {
  http.request({
    method: 'get',
    path: ApiEndpoints.user_change_api,
    loading,
    success: (e) => {
      success(e?.data)
    },
    error: () => {
      /** ErrorToast("data-fetch-failed") **/
    }
  })
}

export const enableApiSecurity = async ({
  async = false,
  jsonData,
  loading,
  page,
  perPage,
  dispatch = () => {},
  success = () => {}
}) => {
  return http.request({
    async,
    method: 'post',
    path: ApiEndpoints.enable_api_security,
    jsonData,
    loading,
    success: (e) => {
      dispatch(userEnableApiSecurity([e?.data]))
      //log(e)
      success(e)
    },
    error: () => {
      /** ErrorToast("data-fetch-failed") **/
    }
  })
}
