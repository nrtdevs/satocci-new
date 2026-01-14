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
export interface customerRequestParams {
  address?: any
  avatar?: any
  city?: any
  country?: any
  created_at?: any
  created_by?: any
  currency?: any
  currency_symbol?: any
  deleted_at?: any
  email?: any
  email_verified_at?: any
  entry_mode?: any
  id?: any
  locale?: any
  mobile_number?: any
  name: ' '
  organization_number?: any
  parent_id?: any
  personal_number?: any
  postal_area?: any
  status?: any
  store_id?: any
  store_qr_code?: any
  stripe_customer_id?: any
  unique_id?: any
  updated_at?: any
  user_type_id: 4
  zip_code?: any
  total_orders?: any
  last_activity?: any
}

type ListRequestParams = RequestParamsWithPagePerPage & extraParams
type ResponseParams = ResponseParamsTypeWithPagination<customerRequestParams>

export const CustomerManagement = createApi({
  reducerPath: 'CustomerManagement',
  tagTypes: ['Customer'],
  baseQuery: axiosBaseQuery(),
  endpoints: (builder) => ({
    loadCustomer: builder.query<ResponseParams, ListRequestParams>({
      query: ({ page, per_page_record, jsonData }) => ({
        jsonData,
        params: { page, per_page_record },
        method: 'post',
        path: ApiEndpoints.customer_list
      }),
      providesTags: ['Customer']
    }),

    loadCustomerList: builder.mutation<ResponseParams, ListRequestParams>({
      invalidatesTags: ['Customer'],
      query: (a) => ({
        jsonData: a?.jsonData,
        params: { page: a?.page, per_page_record: a?.per_page_record },
        method: 'post',
        path: ApiEndpoints.customer_list
      })
      // providesTags: ['Product']
    }),
    loadStoreFilterCustomerList: builder.mutation<ResponseParams, ListRequestParams>({
      invalidatesTags: ['Customer'],
      query: (a) => ({
        jsonData: a?.jsonData,
        params: { page: a?.page, per_page_record: a?.per_page_record },
        method: 'post',
        path: ApiEndpoints.store_customer_list_filter
      })
      // providesTags: ['Product']
    }),
    loadStoreCustomerList: builder.mutation<ResponseParams, ListRequestParams>({
      query: (a) => ({
        formData: { ...a?.jsonData },
        params: {
          page: a?.page,
          per_page_record: a?.per_page_record,
          search: a?.jsonData?.search,
          ...a?.jsonData
        },
        method: 'get',
        path: ApiEndpoints.storeCustomerList
      })
      // providesTags: ['Product']
    }),
    createOrUpdateCustomer: builder.mutation<ResponseParams, customerRequestParams>({
      query: (jsonData) => ({
        jsonData,
        method: isValid(jsonData?.id) ? 'patch' : 'post',
        path: isValid(jsonData?.id)
          ? ApiEndpoints?.customer_edit + jsonData?.id
          : ApiEndpoints.customer_add
      }),
      invalidatesTags: ['Customer']
    }),
    loadCustomerById: builder.query<ResponseParams, ViewParams>({
      query: ({ id }) => ({
        method: 'get',
        path: ApiEndpoints.customer_view + id
      })
    }),

    customerShoppingData: builder.mutation<any, any>({
      query: ({ id }) => ({
        method: 'get',
        path: ApiEndpoints.customer_shopping_data + id
      })
    }),
    actionCustomer: builder.mutation<ResponseParams, ViewParams>({
      query: ({ jsonData }) => ({
        jsonData,
        method: 'post',
        path: ApiEndpoints.customerAction
      })
    }),
    deleteCustomerById: builder.mutation<ResponseParams, ViewParams>({
      invalidatesTags: ['Customer'],
      query: ({ id }) => ({
        method: 'delete',
        path: ApiEndpoints.customer_delete + id
      })
    })
  })
})
export const {
  useCreateOrUpdateCustomerMutation,
  useLoadCustomerByIdQuery,
  useLoadStoreCustomerListMutation,
  useLoadCustomerQuery,
  useLoadCustomerListMutation,
  useDeleteCustomerByIdMutation,
  useCustomerShoppingDataMutation,
  useActionCustomerMutation,
  useLoadStoreFilterCustomerListMutation
} = CustomerManagement
