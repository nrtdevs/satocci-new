/* eslint-disable no-confusing-arrow */
// ** Redux Imports
import { createApi } from '@reduxjs/toolkit/query/react'
import { isValid, isValidArray } from '../../utility/helpers/common'
import ApiEndpoints from '../../utility/http/ApiEndpoints'
import { axiosBaseQuery } from '../../utility/http/Http'
import {
  RequestParamsWithPagePerPage,
  ResponseParamsType,
  ResponseParamsTypeWithPagination,
  ViewParams
} from '../../utility/http/httpConfig'
interface extraParams {
  jsonData?: any
}
export interface groupRequestParams {
  id?: any
  name?: any

  entry_mode?: any
}
type ListRequestParams = RequestParamsWithPagePerPage & extraParams
type ResponseParams = ResponseParamsTypeWithPagination<groupRequestParams>

export const GroupManagement = createApi({
  reducerPath: 'GroupManagement',
  tagTypes: ['Group'],
  baseQuery: axiosBaseQuery(),
  endpoints: (builder) => ({
    loadGroup: builder.query<ResponseParams, ListRequestParams>({
      query: ({ page, per_page_record, jsonData }) => ({
        jsonData,
        params: { page, per_page_record },
        method: 'post',
        path: ApiEndpoints.group_list
      }),
      providesTags: ['Group']
    }),
    createOrUpdateGroup: builder.mutation<ResponseParams, groupRequestParams>({
      query: (jsonData) => ({
        jsonData,
        method: isValid(jsonData?.id) ? 'patch' : 'post',
        path: isValid(jsonData?.id)
          ? ApiEndpoints?.group_edit + jsonData?.id
          : ApiEndpoints.group_add
      }),
      invalidatesTags: ['Group']
    }),
    loadGroupById: builder.mutation<ResponseParams, ViewParams>({
      query: ({ id }) => ({
        method: 'get',
        path: ApiEndpoints.group_view + id
      })
    }),
    deleteGroupById: builder.mutation<ResponseParams, ViewParams>({
      invalidatesTags: ['Group'],
      query: ({ id }) => ({
        method: 'delete',
        path: ApiEndpoints.group_delete + id
      })
    })
  })
})
export const {
  useCreateOrUpdateGroupMutation,
  useLoadGroupByIdMutation,
  useLoadGroupQuery,
  useDeleteGroupByIdMutation
} = GroupManagement
