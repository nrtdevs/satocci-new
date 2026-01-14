import ApiEndpoints from '../http/ApiEndpoints'
import http from '../http/useHttp'
import { dataTypes } from './dropdowns'

export const uploadFiles = async ({
  controller = new AbortController(),
  progress = (e: any) => {},
  async = false,
  formData,
  loading = () => {},
  success = () => {},
  error = () => {},
  params
}: {
  controller?: any
  progress?: (e: any) => void
  formData?: any
  loading?: (e: boolean) => void
  async?: boolean
  params?: any
  success?: (e: any) => void
  error?: (e: any) => void
}) => {
  return http.request({
    async,
    method: 'POST',
    path: ApiEndpoints.uploadFiles,
    formData,
    params,
    loading,
    showErrorToast: true,
    // showSuccessToast: true,
    success: (data) => {
      success(data)
    },
    error: () => {
      error(true)
    },
    onUploadProgress: (progressEvent) => {
      progress((progressEvent.loaded / progressEvent.total) * 100)
    },
    signal: controller.signal
  })
}

export const loadNotification = async ({
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
    path: ApiEndpoints.notifications,
    jsonData,
    loading,
    params: { page, per_page_record: perPage },
    success: (e: any) => {
      success(e)
    },
    error: (e) => {
      success(e)

      /** ErrorToast("data-fetch-failed") **/
    }
  })
}

export const readAllNotification = async ({
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
    method: 'get',
    path: ApiEndpoints.readAllNotification,
    jsonData,
    loading,
    params: { page, per_page_record: perPage },
    success: (e: any) => {
      success(e)
    },
    error: (e) => {
      success(e)

      /** ErrorToast("data-fetch-failed") **/
    }
  })
}

export const loadUnreadCount = async ({
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
    method: 'get',
    path: ApiEndpoints.unreadNotificationCount,
    jsonData,
    loading,
    params: { page, per_page_record: perPage },
    success: (e: any) => {
      success(e)
    },
    error: (e) => {
      success(e)

      /** ErrorToast("data-fetch-failed") **/
    }
  })
}
