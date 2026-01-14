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
import { EmailSmsParamsType } from '../../views/Settings/EmailAndSmsTemplate/EmailTemplateForm'
import { getUserData } from '../../utility/Utils'

export interface EmailTemplateReqParam {
  id?: any | null
  mail_sms_for?: any | null
  mail_subject?: any | null
  mail_body?: any | null
  sms_body?: any | null
  notify_body?: any | null
  custom_attributes?: any | null
  module?: any | null
  type?: any | null
  event?: any | null
  screen?: any | null
  save_to_database?: any | null
}
interface extraParams {
  jsonData?: any
}

type ListRequestParams = RequestParamsWithPagePerPage & extraParams
type ResponseParams = ResponseParamsTypeWithPagination<EmailSmsParamsType>
const user = getUserData()
export const EmailTemplateManagement = createApi({
  reducerPath: 'EmailTemplateManagement',
  tagTypes: ['EmailTemplate'],
  baseQuery: axiosBaseQuery(),
  endpoints: (builder) => ({
    loadEmailTemplate: builder.mutation<ResponseParams, ListRequestParams>({
      query: (a) => ({
        jsonData: a?.jsonData,
        params: { page: a?.page, per_page_record: a?.per_page_record },
        method: 'post',
        path: ApiEndpoints.email_template_list
      })
    }),

    stripeAllPayouts: builder.mutation<ResponseParams, ListRequestParams>({
      query: (a) => ({
        jsonData: a?.jsonData,
        params: { page: a?.page, per_page_record: a?.per_page_record },
        method: 'post',
        path: ApiEndpoints.stripeAllPayouts
      })
    }),

    allAppFees: builder.mutation<ResponseParams, ListRequestParams>({
      query: (a) => ({
        jsonData: a?.jsonData,
        params: { page: a?.page, per_page_record: a?.per_page_record },
        method: 'post',
        path: ApiEndpoints.allAppFees
      })
    }),

    allTransfer: builder.mutation<ResponseParams, ListRequestParams>({
      query: (a) => ({
        jsonData: a?.jsonData,
        params: { page: a?.page, per_page_record: a?.per_page_record },
        method: 'post',
        path: user?.user_type_id !== 1 ? ApiEndpoints.allTransferStore : ApiEndpoints.allTransfer
      })
    }),
    allStoreTransfer: builder.mutation<ResponseParams, ListRequestParams>({
      query: (a) => ({
        jsonData: a?.jsonData,
        params: { page: a?.page, per_page_record: a?.per_page_record },
        method: 'post',
        path: ApiEndpoints.allTransferStore
      })
    }),

    createOrUpdateEmailTemplate: builder.mutation<ResponseParams, EmailSmsParamsType>({
      query: (jsonData) => ({
        jsonData,
        method: isValid(jsonData?.id) ? 'patch' : 'post',
        path: isValid(jsonData?.id)
          ? ApiEndpoints?.email_template_update + jsonData?.id
          : ApiEndpoints.email_template_add
      }),
      invalidatesTags: ['EmailTemplate']
    }),
    loadEmailTemplateById: builder.query<ResponseParams, ViewParams>({
      query: ({ id }) => ({
        method: 'get',
        path: ApiEndpoints.email_template_view + id
      })
    }),
    loadEmailTemplateDetailsById: builder.mutation<EmailSmsParamsType, ViewParams>({
      query: ({ id }) => ({
        method: 'get',
        path: ApiEndpoints.email_template_view + id
      })
    }),

    deleteEmailTemplateById: builder.mutation<ResponseParams, ViewParams>({
      invalidatesTags: ['EmailTemplate'],
      query: ({ id }) => ({
        method: 'delete',
        path: ApiEndpoints.delete_product + id
      })
    })
  })
})
export const {
  useAllAppFeesMutation,
  useAllTransferMutation,
  useStripeAllPayoutsMutation,
  useLoadEmailTemplateByIdQuery,
  useLoadEmailTemplateMutation,
  useCreateOrUpdateEmailTemplateMutation,
  useDeleteEmailTemplateByIdMutation,
  useLoadEmailTemplateDetailsByIdMutation,
  useAllStoreTransferMutation
} = EmailTemplateManagement
