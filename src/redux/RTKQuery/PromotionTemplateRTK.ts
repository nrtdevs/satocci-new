/* eslint-disable no-confusing-arrow */
// ** Redux Imports
import { createApi } from '@reduxjs/toolkit/query/react'
import { isValid } from '../../utility/helpers/common'
import ApiEndpoints from '../../utility/http/ApiEndpoints'
import { axiosBaseQuery } from '../../utility/http/Http'
import {
  RequestParamsWithPagePerPage,
  ResponseParamsType,
  ResponseParamsTypeWithPagination,
  ViewParams
} from '../../utility/http/httpConfig'
import { PromotionParamsType } from '../../views/Settings/PromotionTemplate/PromotionTemplateForm'
import { BulkReferralsParam } from '../../views/Settings/BulkReferals/BulkReferralsModal'

export interface PromotionTemplateReqParam {
  id?: any | null
  store_id?: any | null
  content_type?: any | null
  content_header?: any | null
  content_body?: any | null
  status?: any | null
}
interface extraParams {
  id?: any
  jsonData?: any
  promotions?: any
}

type ListRequestParams = RequestParamsWithPagePerPage & extraParams
type ResponseParams = ResponseParamsTypeWithPagination<PromotionParamsType> & extraParams
type ResponseParamsDetails = ResponseParamsType<PromotionParamsType>

export const PromotionTemplateManagement = createApi({
  reducerPath: 'PromotionTemplateManagement',
  tagTypes: ['PromotionTemplate'],
  baseQuery: axiosBaseQuery(),
  endpoints: (builder) => ({
    loadPromotionTemplate: builder.mutation<ResponseParams, ListRequestParams>({
      query: (a) => ({
        jsonData: a?.jsonData,
        params: { page: a?.page, per_page_record: a?.per_page_record },
        method: 'post',
        path: ApiEndpoints.promotion_template_list
      })
      // providesTags: ['Product']
    }),
    createOrUpdatePromotionTemplate: builder.mutation<ResponseParams, PromotionParamsType>({
      query: (jsonData) => ({
        jsonData,
        method: isValid(jsonData?.id) ? 'patch' : 'post',
        path: isValid(jsonData?.id)
          ? ApiEndpoints?.promotion_template_update + jsonData?.id
          : ApiEndpoints.promotion_template_add
      }),
      invalidatesTags: ['PromotionTemplate']
    }),
    loadPromotionTemplateById: builder.query<ResponseParams, ViewParams>({
      query: ({ id }) => ({
        method: 'get',
        path: ApiEndpoints.promotion_template_view + id
      })
    }),
    loadPromotionTemplateDetailsById: builder.mutation<ResponseParams, ViewParams>({
      query: (a) => ({
        jsonData: a?.jsonData,
        method: 'get',
        params: { page: a?.page, per_page_record: a?.per_page_record },
        path: ApiEndpoints.promotion_template_view + a?.id
      })
    }),
    deletePromotionTemplateById: builder.mutation<ResponseParams, ViewParams>({
      invalidatesTags: ['PromotionTemplate'],
      query: ({ id }) => ({
        method: 'delete',
        path: ApiEndpoints.promotion_template_delete + id
      })
    }),
    sendPromotionTemplate: builder.mutation<ResponseParamsDetails, PromotionParamsType>({
      query: (jsonData) => ({
        jsonData,
        showSuccessToast: true,
        method: 'post',
        path: ApiEndpoints.promotion_template_send
      })
    }),
    promotionTemplateLog: builder.mutation<ResponseParams, ListRequestParams>({
      query: (a) => ({
        jsonData: a?.jsonData,
        params: { page: a?.page, per_page_record: a?.per_page_record },
        method: 'post',
        path: ApiEndpoints.promotion_template_log
      })
    }),
    createBulkReferrals: builder.mutation<ResponseParams, BulkReferralsParam>({
      query: (a) => ({
        // jsonData: a?.jsonData,
        formData: a,
        method: 'post',
        path: ApiEndpoints.bulk_referral
      })
    }),
    listBulkReferrals: builder.mutation<any, any>({
      query: (a) => ({
        jsonData: a?.jsonData,
        params: { page: a?.page, per_page_record: a?.per_page_record },
        method: 'post',
        path: ApiEndpoints.list_bulk_referral
      })
    })
  })
})
export const {
  useLoadPromotionTemplateByIdQuery,
  useLoadPromotionTemplateMutation,
  useCreateOrUpdatePromotionTemplateMutation,
  useDeletePromotionTemplateByIdMutation,
  useLoadPromotionTemplateDetailsByIdMutation,
  useSendPromotionTemplateMutation,
  usePromotionTemplateLogMutation,
  useCreateBulkReferralsMutation,
  useListBulkReferralsMutation
} = PromotionTemplateManagement
