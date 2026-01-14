/* eslint-disable no-confusing-arrow */
// ** Redux Imports
import { createApi } from '@reduxjs/toolkit/query/react'
import { isValid, isValidArray } from '../../utility/helpers/common'
import ApiEndpoints from '../../utility/http/ApiEndpoints'
import { axiosBaseQuery } from '../../utility/http/Http'
import {
  RequestParamsWithPagePerPage,
  RequestParamsWithParentId,
  ResponseParamsTypeWithPagination,
  ViewParams
} from '../../utility/http/httpConfig'
import { CategoryParamsType } from '../../views/stores/category/CategoryAddForm'

interface extraParams {
  jsonData?: any
}

type RequestParamTypes = (RequestParamsWithPagePerPage & extraParams) | undefined
type ResponseParamsType = ResponseParamsTypeWithPagination<CategoryParamsType>

export const CouponManagement = createApi({
  reducerPath: 'CouponManagement',
  baseQuery: axiosBaseQuery(),
  endpoints: (builder) => ({
    loadCategory: builder.query<ResponseParamsType, RequestParamTypes>({
      query: (a) => ({
        jsonData: a?.jsonData,
        params: { page: a?.page, per_page_record: a?.per_page_record },
        method: 'get',
        path: ApiEndpoints.load_category
      })
    }),
    createOrUpdateCategory: builder.mutation<ResponseParamsType, CategoryParamsType>({
      query: (jsonData) => ({
        jsonData,
        method: isValid(jsonData?.id) ? 'patch' : 'post',
        path: isValid(jsonData?.id)
          ? ApiEndpoints?.edit_category + jsonData?.id
          : ApiEndpoints.add_category
      })
    }),
    loadCategoryById: builder.query<ResponseParamsType, ViewParams>({
      query: ({ id }) => ({
        method: 'get',
        path: ApiEndpoints.view_category + id
      })
    }),
    deleteCategoryById: builder.mutation<ResponseParamsType, ViewParams>({
      query: ({ id }) => ({
        method: 'delete',
        path: ApiEndpoints.delete_category + id
      })
    })
  })
})
export const {
  useCreateOrUpdateCategoryMutation,
  useLoadCategoryQuery,
  useDeleteCategoryByIdMutation,
  useLoadCategoryByIdQuery
} = CouponManagement
