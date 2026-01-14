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
type ResponseParams = ResponseParamsTypeWithPagination<CouponParamType>

export const CouponManagement = createApi({
  reducerPath: 'CouponManagement',
  tagTypes: ['Coupon'],
  baseQuery: axiosBaseQuery(),
  endpoints: (builder) => ({
    loadCoupon: builder.mutation<ResponseParams, ViewParams>({
      query: (a) => ({
        jsonData: a?.jsonData,
        params: { page: a?.page, per_page_record: a?.per_page_record, ...a?.jsonData },
        method: 'get',
        path: ApiEndpoints.coupon_list
      })
    }),
    usageCouponList: builder.mutation<ResponseParams, ViewParams>({
      query: (a) => ({
        jsonData: a?.jsonData,
        params: { page: a?.page, per_page_record: a?.per_page_record, ...a?.jsonData },
        method: 'post',
        path: ApiEndpoints.couponCodeUsage
      })
    }),
    createOrUpdateCoupon: builder.mutation<ResponseParams, CouponParamType>({
      query: (jsonData) => ({
        jsonData,
        method: isValid(jsonData?.id) ? 'patch' : 'post',
        path: isValid(jsonData?.id)
          ? ApiEndpoints?.coupon_edit + jsonData?.id
          : ApiEndpoints.coupon_add
      })
      // invalidatesTags: ['Employee']
    }),
    loadCouponById: builder.query<ResponseParams, ViewParams>({
      query: ({ id }) => ({
        method: 'get',
        path: ApiEndpoints.coupon_view + id
      })
    }),
    loadCouponDetailsById: builder.mutation<CouponParamType, ViewParams>({
      query: ({ id }) => ({
        method: 'get',
        path: ApiEndpoints.coupon_view + id
      })
    }),
    deleteCouponById: builder.mutation<ResponseParams, ViewParams>({
      invalidatesTags: ['Coupon'],
      query: ({ id }) => ({
        method: 'delete',
        path: ApiEndpoints.coupon_delete + id
      })
    }),
    actionCoupon: builder.mutation<ResponseParams, ViewParams>({
      query: ({ jsonData }) => ({
        jsonData,
        method: 'post',
        path: ApiEndpoints.coupon_action
      })
    }),
    storeOption: builder.mutation<ResponseParams, ViewParams>({
      query: ({ jsonData }) => ({
        jsonData,
        method: 'post',
        path: ApiEndpoints.store_option
      })
    })
  })
})
export const {
  useCreateOrUpdateCouponMutation,
  useLoadCouponMutation,
  useDeleteCouponByIdMutation,
  useLoadCouponByIdQuery,
  useLoadCouponDetailsByIdMutation,
  useUsageCouponListMutation,
  useActionCouponMutation,
  useStoreOptionMutation
} = CouponManagement
