/* eslint-disable no-confusing-arrow */
// ** Redux Imports
import { createApi } from '@reduxjs/toolkit/query/react'
import { isValid, isValidArray } from '../../utility/helpers/common'
import ApiEndpoints from '../../utility/http/ApiEndpoints'
import { axiosBaseQuery } from '../../utility/http/Http'
import {
  RequestParamsWithPagePerPage,
  ResponseParamsType,
  ViewParams
} from '../../utility/http/httpConfig'
import { CategoryParamsType } from '../../views/stores/category/CategoryAddForm'

interface extraParams {
  filterData?: any
}

type ListRequestParams = RequestParamsWithPagePerPage & extraParams
type ResponseParams = ResponseParamsType<Array<CategoryParamsType>>

export const TransactionManagement = createApi({
  reducerPath: 'TransactionManagement',
  tagTypes: ['Transactions'],
  baseQuery: axiosBaseQuery(),
  endpoints: (builder) => ({
    loadTransactions: builder.query<ResponseParams, ListRequestParams>({
      query: (a: any) => ({
        jsonData: a?.jsonData,
        params: { page: a?.page, per_page_record: a?.per_page_record },
        method: 'get',
        path: ApiEndpoints.transaction_list
      }),
      //   providesTags: ['Stores']
      providesTags: (result: any, error, arg) => {
        if (isValidArray(result?.payload?.data) && result) {
          const r = result.payload?.data?.map(({ id }: CategoryParamsType) => ({
            type: 'Transactions' as const,
            id: id ?? 'LIST'
          }))
          return r ? r : ['Transactions']
        } else {
          return ['Transactions']
        }
      }
    }),
    createOrUpdateTransactions: builder.mutation<ResponseParams, CategoryParamsType>({
      query: (jsonData) => ({
        jsonData,
        method: isValid(jsonData?.id) ? 'patch' : 'post',
        path: isValid(jsonData?.id)
          ? ApiEndpoints?.transaction_update + jsonData?.id
          : ApiEndpoints.transaction_add
      })
      // invalidatesTags: ['Categories']
    }),
    loadTransactionsById: builder.query<ResponseParams, ViewParams>({
      query: ({ id }) => ({
        method: 'get',
        path: ApiEndpoints.transaction_view + id
      })
    }),
    deleteTransactionsById: builder.mutation<ResponseParams, ViewParams>({
      invalidatesTags: ['Transactions'],
      query: ({ id }) => ({
        method: 'delete',
        path: ApiEndpoints.transaction_delete + id
      })
    })
  })
})
export const {
  useLoadTransactionsByIdQuery,
  useLoadTransactionsQuery,
  useCreateOrUpdateTransactionsMutation,
  useDeleteTransactionsByIdMutation
} = TransactionManagement
