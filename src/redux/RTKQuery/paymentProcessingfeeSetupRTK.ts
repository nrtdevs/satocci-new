import { createApi } from '@reduxjs/toolkit/query/react'
import { isValid, isValidArray } from '../../utility/helpers/common'
import ApiEndpoints from '../../utility/http/ApiEndpoints'
import { axiosBaseQuery } from '../../utility/http/Http'
import {
  RequestParamsWithPagePerPage,
  RequestParamsWithParentId,
  ResponseParamsType,
  ResponseParamsTypeWithPagination,
  ViewParams
} from '../../utility/http/httpConfig'
import { ProductOfferType } from '../../views/ProductManagement/fragment/ProductForm'
import { CategoryParamsType } from '../../views/stores/category/CategoryAddForm'
import { paymentSetupParam } from '../../views/Master/PaymentSetup/PaymentSetupModal'

interface extraParams {
  jsonData?: any
  id?: any
}

type ListRequestParams = RequestParamsWithPagePerPage & extraParams
type ListParentParams = RequestParamsWithParentId & extraParams
type ResponseParams = ResponseParamsTypeWithPagination<paymentSetupParam>

type CatsParam = ResponseParamsType<paymentSetupParam>

export const ProcessingFee = createApi({
  reducerPath: 'ProcessingFee',
  tagTypes: ['ProcessingFee'],

  baseQuery: axiosBaseQuery(),
  endpoints: (builder) => ({
    loadProcessingFee: builder.mutation<ResponseParams, ListRequestParams>({
      query: ({ page, per_page_record, jsonData }) => ({
        jsonData,
        params: { page, per_page_record },
        method: 'post',
        path: ApiEndpoints.processing_fee_setup_list
      })
    }),

    createOrUpdateProcessingFee: builder.mutation<ResponseParams, CategoryParamsType>({
      query: (jsonData) => ({
        jsonData,
        method: isValid(jsonData?.id) ? 'patch' : 'post',
        path: isValid(jsonData?.id)
          ? ApiEndpoints?.processing_fee_setup_update + jsonData?.id
          : ApiEndpoints.processing_fee_setup_add
      })
    }),

    loadProcessingFeeById: builder.mutation<CatsParam, ViewParams>({
      query: ({ id }) => ({
        method: 'get',
        path: ApiEndpoints.processing_fee_setup_view + id
      })
    }),

    deleteProcessingFeeById: builder.mutation<ResponseParams, ViewParams>({
      query: ({ id, originalArgs, jsonData }) => ({
        jsonData,
        method: 'delete',
        path: ApiEndpoints.processing_fee_setup_delete + id
      })
    })
  })
})
export const {
  useLoadProcessingFeeMutation,
  useCreateOrUpdateProcessingFeeMutation,
  useLoadProcessingFeeByIdMutation,
  useDeleteProcessingFeeByIdMutation
} = ProcessingFee
