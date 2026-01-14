// ** Redux Imports
import { createApi } from '@reduxjs/toolkit/query/react'
import ApiEndpoints from '../../utility/http/ApiEndpoints'
import { axiosBaseQuery } from '../../utility/http/Http'
import {
  RequestParamsWithPagePerPage,
  ResponseParamsType,
  ResponseParamsTypeWithPagination,
  ViewParams
} from '../../utility/http/httpConfig'
import {
  ActionParams,
  SubscriptionLogType,
  SubscriptionParamsType
} from '../../views/Master/Subscription'
import { ExportParams } from '../../views/Master/Subscription/Export'

interface extraParams {
  userType: number
  jsonData?: any
  id?: any
}

type actionParamsType = {
  ids?: any
  action?: any
  originArgs?: any
}
export type SubscriptionListRequestParams = (RequestParamsWithPagePerPage & extraParams) | undefined
export type SubscriptionResponseParams = ResponseParamsTypeWithPagination<SubscriptionParamsType>
export type SubscriptionResponseParamsView = ResponseParamsType<SubscriptionParamsType> | undefined
export type SubscriptionResponseParamsLog = ResponseParamsTypeWithPagination<SubscriptionLogType>
export type ResponseParams = ResponseParamsTypeWithPagination<ActionParams>
export type ExportResponseParams = ResponseParamsTypeWithPagination<ExportParams>
export type SubscriptionLogDeleteParams = ResponseParamsTypeWithPagination<FormData>
export const SubscriptionManagement = createApi({
  reducerPath: 'SubscriptionManagement',
  tagTypes: ['Subscriptions'],
  baseQuery: axiosBaseQuery(),
  endpoints: (builder) => ({
    loadSubscriptions: builder.mutation<SubscriptionResponseParams, ViewParams>({
      query: (a) => ({
        jsonData: a?.jsonData,
        params: { page: a?.page, per_page_record: a?.per_page_record },
        method: 'post',
        path: ApiEndpoints.load_subscription
      })
      //   providesTags: ['Stores']
    }),

    //Applied Subscription List
    loadSubscriptionLog: builder.mutation<SubscriptionResponseParams, ViewParams>({
      query: (a) => ({
        jsonData: a?.jsonData,
        params: { page: a?.page, per_page_record: a?.per_page_record },
        method: 'get',
        path: ApiEndpoints.subscription_applied_list + a?.jsonData?.store_id
      })
      //   providesTags: ['Stores']
    }),
    ///Update Subscription
    subscriptionUpdate: builder.mutation<ResponseParams, any>({
      query: (jsonData) => ({
        jsonData,
        method: 'post',
        path: ApiEndpoints.apply_subscription
      })
    }),
    //Delete Subscription

    deleteSUbscription: builder.mutation<SubscriptionLogDeleteParams, ViewParams>({
      query: ({ id, originalArgs, jsonData, eventId }) => ({
        jsonData,
        method: 'get',
        path: ApiEndpoints.delete_applied_subscription + id
      })
    }),
    ///subscription log
    subscriptionLog: builder.mutation<SubscriptionResponseParamsLog, ViewParams>({
      query: (a) => ({
        jsonData: a?.jsonData,
        params: { page: a?.page, per_page_record: a?.per_page_record },
        method: 'post',
        path: ApiEndpoints.subscription_logs
      })
      //   invalidatesTags: ['Offer']
    }),
    allSubscriptionLog: builder.mutation<SubscriptionResponseParamsLog, any>({
      query: (a) => ({
        jsonData: a?.jsonData,
        params: { page: a?.page, per_page_record: a?.per_page_record },
        method: 'post',
        path: ApiEndpoints.all_store_subscription_log
      })
      //   invalidatesTags: ['Offer']
    }),
    loadSubscriptionDetailsById: builder.mutation<SubscriptionResponseParamsView, ViewParams>({
      query: ({ id }) => ({
        method: 'get',
        path: ApiEndpoints.view_subscription + id
      })
    }),
    subsLogAction: builder.mutation<ResponseParams, ActionParams>({
      query: (jsonData) => ({
        jsonData,
        method: 'post',
        path: ApiEndpoints.subs_log_action
      })
    }),
    exportSubscriptionLog: builder.mutation<any, ExportParams>({
      query: (jsonData) => ({
        jsonData,
        method: 'post',
        path: ApiEndpoints.export_subscription_log
      })
    })
  })
})
export const {
  useLoadSubscriptionDetailsByIdMutation,
  useLoadSubscriptionsMutation,
  useSubscriptionLogMutation,
  useSubsLogActionMutation,
  useDeleteSUbscriptionMutation,
  useAllSubscriptionLogMutation,
  useSubscriptionUpdateMutation,
  useLoadSubscriptionLogMutation,
  useExportSubscriptionLogMutation
} = SubscriptionManagement
