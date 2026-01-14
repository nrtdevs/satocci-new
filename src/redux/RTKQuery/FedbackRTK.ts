/* eslint-disable no-confusing-arrow */
// ** Redux Imports
import { createApi } from '@reduxjs/toolkit/query/react'
import { isValid } from '../../utility/helpers/common'
import ApiEndpoints from '../../utility/http/ApiEndpoints'
import { axiosBaseQuery } from '../../utility/http/Http'
import {
  RequestParamsWithPagePerPage,
  ResponseParamsTypeWithPagination,
  ViewParams
} from '../../utility/http/httpConfig'
interface extraParams {
  jsonData?: any
}
export interface feedbackRequestParams {
  id?: any
  email?: string | null
  message?: string
  rating?: any
  entry_mode?: any
  created_at?: any
}
export interface ReferralsRequestParams {
  customer_id?: any
  id?: any
  store_address?: string
  customer?: any
  store_contact_email?: string
  store_contact_number?: string | number
  store_name?: string
  updated_at?: any
  url_address?: string
  url_web?: string
  created_at?: any
}

export interface ReferralsFamilyRequestParams {
  customer_id?: any
  id?: any
  store_address?: string
  customer?: any
  name?: string
  email?: string
  mobile?: string
  updated_at?: any

  created_at?: any
}

type ListRequestParams = RequestParamsWithPagePerPage & extraParams

type ResponseParams = ResponseParamsTypeWithPagination<feedbackRequestParams>
type ReferralsResponseParams = ResponseParamsTypeWithPagination<ReferralsRequestParams>
type ReferralsFamilyResponseParams = ResponseParamsTypeWithPagination<ReferralsFamilyRequestParams>

export const FeedbackManagement = createApi({
  reducerPath: 'FeedbackManagement',
  tagTypes: ['Feedback'],
  baseQuery: axiosBaseQuery(),
  endpoints: (builder) => ({
    loadFeedBack: builder.mutation<ResponseParams, ListRequestParams>({
      query: ({ page, per_page_record, jsonData }) => ({
        jsonData,
        params: { page, per_page_record, ...jsonData },
        method: 'get',
        path: ApiEndpoints.service_feedback_list
      })
    }),
    loadReferrals: builder.mutation<ReferralsResponseParams, ListRequestParams>({
      query: ({ page, per_page_record, jsonData }) => ({
        jsonData,
        params: { page, per_page_record },
        method: 'post',
        path: ApiEndpoints.referrals
      })
    }),
    loadFamilyReferrals: builder.mutation<ReferralsFamilyResponseParams, ListRequestParams>({
      query: ({ page, per_page_record, jsonData }) => ({
        jsonData,
        params: { page, per_page_record },
        method: 'post',
        path: ApiEndpoints.refer_family_friends
      })
    }),
    createOrUpdateFeedback: builder.mutation<ResponseParams, feedbackRequestParams>({
      query: (jsonData) => ({
        jsonData,
        method: isValid(jsonData?.id) ? 'patch' : 'post',
        path: isValid(jsonData?.id)
          ? ApiEndpoints?.service_feedback_edit + jsonData?.id
          : ApiEndpoints.service_feedback_add
      })
      // invalidatesTags: ['Feedback']
    }),
    loadFeedbackById: builder.query<ResponseParams, ViewParams>({
      query: ({ id }) => ({
        method: 'get',
        path: ApiEndpoints.service_feedback_view + id
      })
    }),
    deleteFeedbackById: builder.mutation<ResponseParams, ViewParams>({
      invalidatesTags: ['Feedback'],
      query: ({ id }) => ({
        method: 'delete',
        path: ApiEndpoints.service_feedback_delete + id
      })
    })
  })
})
export const {
  useLoadFeedbackByIdQuery,
  //   useLoadFeedbackQuery,
  useLoadReferralsMutation,
  useLoadFamilyReferralsMutation,
  useCreateOrUpdateFeedbackMutation,
  useDeleteFeedbackByIdMutation,
  useLoadFeedBackMutation
} = FeedbackManagement
