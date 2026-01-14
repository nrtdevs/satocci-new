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

import { CouponParamType } from '../../views/stores/coupon/AddUpdateCoupon'

interface extraParams {
  jsonData?: any
}

type ListRequestParams = RequestParamsWithPagePerPage & extraParams
type ResponseParams = ResponseParamsTypeWithPagination<any>

export const CountryManagement = createApi({
  reducerPath: 'CountryManagement',
  tagTypes: ['Coupon'],
  baseQuery: axiosBaseQuery(),
  endpoints: (builder) => ({
    loadCountry: builder.mutation<any, any>({
      query: (a) => ({
        jsonData: a?.jsonData,
        params: { page: a?.page, per_page_record: a?.per_page_record, ...a?.jsonData },
        method: 'post',
        path: ApiEndpoints.get_countries
      })
    }),

    updateCountry: builder.mutation<any, any>({
      query: (jsonData) => ({
        jsonData,
        method: 'post',
        path: ApiEndpoints.updateMinCartValueCountryWise
      })
      // invalidatesTags: ['Employee']
    })
  })
})
export const { useLoadCountryMutation, useUpdateCountryMutation } = CountryManagement
