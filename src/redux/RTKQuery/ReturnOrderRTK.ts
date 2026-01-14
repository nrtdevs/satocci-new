/* eslint-disable no-confusing-arrow */
// ** Redux Imports
import { createApi } from '@reduxjs/toolkit/query/react'
import ApiEndpoints from '../../utility/http/ApiEndpoints'
import { axiosBaseQuery } from '../../utility/http/Http'
import {
  RequestParamsWithPagePerPage,
  ResponseParamsType,
  ResponseParamsTypeWithPagination
} from '../../utility/http/httpConfig'
import { CategoryParamsType } from '../../views/stores/category/CategoryAddForm'

interface extraParams {
  filterData?: any
}

type ListRequestParams = RequestParamsWithPagePerPage & extraParams
type ResponseParams = ResponseParamsTypeWithPagination<CategoryParamsType>

export const ReturnOrderManagement = createApi({
  reducerPath: 'ReturnOrderManagement',
  tagTypes: ['ReturnOrders'],
  baseQuery: axiosBaseQuery(),
  endpoints: (builder) => ({
    loadReturnOrder: builder.mutation<ResponseParams, ListRequestParams>({
      query: (a: any) => ({
        jsonData: a?.jsonData,
        params: { page: a?.page, per_page_record: a?.per_page_record },
        method: 'post',
        path: ApiEndpoints.orderReturns
      })
    }),
    returnOrderDetails: builder.mutation<any, any>({
      query: (id) => ({
        method: 'get',
        path: ApiEndpoints.returnOrderDetails + id
      })
    }),
    requestDeleteAccountList: builder.mutation<any, any>({
      query: (a) => ({
        jsonData: a?.jsonData,
        params: { page: a?.page, per_page_record: a?.per_page_record },
        method: 'post',
        path: ApiEndpoints.deleteAccountReq
      })
    }),
    createOrUpdateReturn: builder.mutation<ResponseParams, CategoryParamsType>({
      query: (jsonData) => ({
        jsonData,
        method: 'post',
        path: ApiEndpoints.returnOrder
      })
    }),
    getAmountReturn: builder.mutation<ResponseParams, CategoryParamsType>({
      query: (jsonData) => ({
        jsonData,
        method: 'post',
        path: ApiEndpoints.getAmountReturn
      })
    }),
    actionReturn: builder.mutation<ResponseParams, CategoryParamsType>({
      query: (a) => ({
        jsonData: a?.jsonData,
        method: 'post',
        path: ApiEndpoints.returnOrderAction
      })
    }),
    returnRefund: builder.mutation<ResponseParams, CategoryParamsType>({
      query: (jsonData) => ({
        jsonData,
        method: 'post',
        path: ApiEndpoints.returnOrderRefund
      })
    }),
    getCurrencyList: builder.mutation<ResponseParams, CategoryParamsType>({
      query: (jsonData) => ({
        jsonData,
        method: 'get',
        path: ApiEndpoints.get_currency_list
      })
    })
  })
})
export const {
  useLoadReturnOrderMutation,
  useRequestDeleteAccountListMutation,
  useCreateOrUpdateReturnMutation,
  useGetAmountReturnMutation,
  useActionReturnMutation,
  useReturnRefundMutation,
  useGetCurrencyListMutation,
  useReturnOrderDetailsMutation
} = ReturnOrderManagement
