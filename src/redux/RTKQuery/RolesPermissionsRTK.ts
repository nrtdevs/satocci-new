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
export type RolePermissionReqParams = {
  id?: any | null
  name?: any | null
  guard_name?: any | null
  group_name?: any | null
  se_name?: any | null
  belongs_to?: any | null
  created_at?: any | null
  updated_at?: any | null
  entry_mode?: any | null
  pivot?: any | null
  permissions?: any
  store_id?: any
  user_type_id?: any
  is_default?: any
}

type ListRequestParams = RequestParamsWithPagePerPage & extraParams
type ResponseParams = ResponseParamsTypeWithPagination<RolePermissionReqParams>

export const PerRolesManagement = createApi({
  reducerPath: 'PerRolesManagement',
  tagTypes: ['PerRoles'],
  baseQuery: axiosBaseQuery(),
  endpoints: (builder) => ({
    loadPerRole: builder.mutation<ResponseParams, ListRequestParams>({
      query: (a) => ({
        jsonData: a?.jsonData,
        params: { page: a?.page, per_page_record: a?.per_page_record },
        method: 'post',
        path: ApiEndpoints.role_list
      })
    }),
    createOrUpdatePerRole: builder.mutation<ResponseParams, RolePermissionReqParams>({
      query: (jsonData) => ({
        jsonData,
        method: isValid(jsonData?.id) ? 'patch' : 'post',
        path: isValid(jsonData?.id) ? ApiEndpoints?.role_edit + jsonData?.id : ApiEndpoints.role_add
      }),
      invalidatesTags: ['PerRoles']
    }),
    loadPerRoleById: builder.query<ResponseParams, ViewParams>({
      query: ({ id }) => ({
        method: 'get',
        path: ApiEndpoints.role_view + id
      })
    }),
    deletePerRoleById: builder.mutation<ResponseParams, ViewParams>({
      invalidatesTags: ['PerRoles'],
      query: ({ id }) => ({
        method: 'delete',
        path: ApiEndpoints.role_delete + id
      })
    })
  })
})
export const {
  useCreateOrUpdatePerRoleMutation,
  useLoadPerRoleByIdQuery,

  useLoadPerRoleMutation,
  useDeletePerRoleByIdMutation
} = PerRolesManagement
