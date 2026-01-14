/* eslint-disable prettier/prettier */
/* eslint-disable no-confusing-arrow */
// ** Redux Imports
import { createApi } from '@reduxjs/toolkit/query/react'
import { isValid, isValidArray, log } from '../../utility/helpers/common'
import ApiEndpoints from '../../utility/http/ApiEndpoints'
import { axiosBaseQuery } from '../../utility/http/Http'
import {
  RequestParamsWithPagePerPage,
  ResponseParamsType,
  ResponseParamsTypeWithPagination,
  ViewParams
} from '../../utility/http/httpConfig'
import { CustomerLoginParams } from '../../views/CustomerLogin/CustomerLogin'

interface extraParams {
  jsonData?: any
  id?: any
}

type actionParamsType = {
  ids?: any
  action?: any
  originArgs?: any
}

type ListRequestParams = RequestParamsWithPagePerPage & extraParams
type ResponseParams = ResponseParamsTypeWithPagination<CustomerLoginParams>

export const CountryListRTK = createApi({
  reducerPath: 'CountryListRTK',
  tagTypes: ['CountryList'],
  baseQuery: axiosBaseQuery(),
  endpoints: (builder) => ({
    getDisplayLoginSettings: builder.mutation<ResponseParams, ViewParams>({
      query: (a: any) => ({
        jsonData: a?.jsonData,
        params: { page: a?.page, per_page_record: a?.per_page_record, ...a?.jsonData },
        method: 'get',
        path: ApiEndpoints.get_login_settings
      })
    }),
    // create customer Login
    disPlayLoginSettings: builder.mutation<ResponseParamsType<any>, ViewParams>({
      query: (jsonData) => ({
        jsonData,
        method: 'post',
        path: ApiEndpoints.display_login_settings
      })
    })
  })
})

export const { useDisPlayLoginSettingsMutation, useGetDisplayLoginSettingsMutation } =
  CountryListRTK
