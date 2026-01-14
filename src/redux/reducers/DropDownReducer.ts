// ** Redux Imports

import { createApi } from '@reduxjs/toolkit/query/react'
import { axiosBaseQuery } from '../../utility/http/Http'

interface RequestParams {
  page: number
  perPage: number
  jsonData?: any
}
interface ResponseParams {
  code: number
  message: any
  payload: any
  success: boolean
}
export const dropdownApi = createApi({
  reducerPath: 'dropdownApi',
  baseQuery: axiosBaseQuery(),
  endpoints: (builder) => ({
    loadStores: builder.query<ResponseParams, RequestParams>({
      query: ({ page, perPage, jsonData }) => ({
        jsonData,
        params: { page, per_page_record: perPage },
        method: 'post',
        path: 'administration/stores'
      })
    }),
    loadStoresGet: builder.mutation<ResponseParams, RequestParams>({
      query: ({ jsonData }) => ({
        jsonData,
        method: 'post',
        path: 'administration/store'
      })
    })
  })
})
export const { useLoadStoresQuery, useLoadStoresGetMutation } = dropdownApi
