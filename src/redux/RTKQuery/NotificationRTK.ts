/* eslint-disable no-confusing-arrow */
// ** Redux Imports
import { createApi } from '@reduxjs/toolkit/query/react'
import ApiEndpoints from '../../utility/http/ApiEndpoints'
import { axiosBaseQuery } from '../../utility/http/Http'
import {
  RequestParamsWithPagePerPage,
  ResponseParamsTypeWithPagination,
  ViewParams
} from '../../utility/http/httpConfig'
// import { EmailSmsParamsType } from '../../views/Settings/EmailAndSmsTemplate/EmailTemplateForm'

export interface NOtificationParams {
  created_at?: any
  data_id?: any
  device_id?: any
  device_platform?: any
  extra_info?: any
  id?: any
  message?: any
  notification_type?: any
  read_at?: any
  read_status?: any
  screen?: any
  sender_id?: any
  status_code?: any
  title?: any
  updated_at?: any
  user_id?: any
  user_type?: any
}
interface extraParams {
  jsonData?: any
}

type ListRequestParams = RequestParamsWithPagePerPage & extraParams
type ResponseParams = ResponseParamsTypeWithPagination<NOtificationParams>

export const NotificationManagement = createApi({
  reducerPath: 'NotificationManagement',

  baseQuery: axiosBaseQuery(),
  endpoints: (builder) => ({
    loadNotification: builder.mutation<ResponseParams, ListRequestParams>({
      query: (a) => ({
        jsonData: a?.jsonData,
        params: { page: a?.page, per_page_record: a?.per_page_record },
        method: 'post',
        path: ApiEndpoints.notifications
      })
    }),

    createOrUpdateNotification: builder.mutation<ResponseParams, NOtificationParams>({
      query: (jsonData) => ({
        jsonData,
        method: 'post',
        path: ApiEndpoints.createNotification
      })
    }),
    viewNotificationById: builder.query<ResponseParams, ViewParams>({
      query: ({ id }) => ({
        method: 'get',
        path: ApiEndpoints.notificationShow + id
      })
    }),
    userDeleteNotification: builder.mutation<NOtificationParams, ViewParams>({
      query: ({ id }) => ({
        method: 'get',
        path: ApiEndpoints.userNotificationDelete
      })
    }),
    notificationRead: builder.mutation<NOtificationParams, ViewParams>({
      query: ({ id }) => ({
        method: 'get',
        path: `${ApiEndpoints.statusRead}${id}/read`
      })
    }),
    notificationReadAll: builder.mutation<NOtificationParams, ViewParams>({
      query: ({ id }) => ({
        method: 'get',
        path: ApiEndpoints.readAllNotification
      })
    }),
    unreadNotification: builder.mutation<NOtificationParams, ViewParams>({
      query: () => ({
        method: 'get',
        path: ApiEndpoints.unreadNotificationCount
      })
    }),
    notificationTest: builder.mutation<NOtificationParams, ViewParams>({
      query: ({ id }) => ({
        jsonData: { device_token: id },
        method: 'post',
        path: ApiEndpoints.notificationTestSend
      })
    }),
    deleteNotificationById: builder.mutation<ResponseParams, ViewParams>({
      query: ({ id }) => ({
        method: 'delete',
        path: ApiEndpoints.notificationDelete + id
      })
    })
  })
})
export const {
  useLoadNotificationMutation,
  useCreateOrUpdateNotificationMutation,
  useDeleteNotificationByIdMutation,
  useUserDeleteNotificationMutation,
  useViewNotificationByIdQuery,
  useNotificationReadMutation,
  useNotificationReadAllMutation,
  useNotificationTestMutation,
  useUnreadNotificationMutation
} = NotificationManagement
