/* eslint-disable no-confusing-arrow */
// ** Redux Imports
import { createApi } from '@reduxjs/toolkit/query/react'
import { isValid } from '../../utility/helpers/common'
import ApiEndpoints from '../../utility/http/ApiEndpoints'
import { axiosBaseQuery } from '../../utility/http/Http'
import {
  RequestParamsWithPagePerPage,
  ResponseParamsType,
  ViewParams
} from '../../utility/http/httpConfig'

import { EmployeeParamType } from '../../views/UserManagement/employee/fragment/AddUpdateEmployee'

export interface PermissionsReqParams {
  guard_name?: any | null
  group_name?: any | null
  name?: any | null
  se_name?: any | null
  userType?: any
  belongs_to?: any | null
  entry_mode?: any | null
  updated_at?: any | null
  created_at?: any | null
  id?: any | null
  jsonData?: any | null
  page?: any | null
  per_page_record?: any | null
  paginatedData?: any | null
  tableData?: any | null
}
interface extraParams {
  jsonData?: any
}

type ListRequestParams = RequestParamsWithPagePerPage & extraParams
type ResponseParams = ResponseParamsType<PermissionsReqParams>

export const PermissionManagement = createApi({
  reducerPath: 'PermissionManagement',
  tagTypes: ['Permission'],
  baseQuery: axiosBaseQuery(),
  endpoints: (builder) => ({
    loadPermission: builder.mutation<ResponseParams, PermissionsReqParams>({
      query: (a) => ({
        jsonData: a?.jsonData,
        // params: { page: a?.page, per_page_record: a?.per_page_record },
        method: 'post',
        path: ApiEndpoints.store_permissionList
      })
    }),

    createOrUpdatePermission: builder.mutation<ResponseParams, PermissionsReqParams>({
      query: (jsonData) => ({
        jsonData,
        method: isValid(jsonData?.id) ? 'patch' : 'post',
        path: isValid(jsonData?.id)
          ? ApiEndpoints?.permissions_update + jsonData?.id
          : ApiEndpoints.permissions_add
      })
      //invalidatesTags: ['EmployeeAdmin']
    }),
    loadPermissionById: builder.query<ResponseParams, ViewParams>({
      query: ({ id }) => ({
        method: 'get',
        path: ApiEndpoints.permissions_view + id
      })
    }),
    loadPermissionDetailsById: builder.mutation<EmployeeParamType, ViewParams>({
      query: ({ id }) => ({
        method: 'get',
        path: ApiEndpoints.permissions_view + id
      })
    }),
    deletePermissionById: builder.mutation<ResponseParams, ViewParams>({
      invalidatesTags: (result, error, arg) => [
        { type: 'Permission', id: 'NEXT-LIST' },
        { type: 'Permission', id: 'LIST' }

        // { type: 'Stores', id: arg.id }
      ],
      query: ({ id, originalArgs, jsonData }) => ({
        jsonData,
        method: 'delete',
        path: ApiEndpoints.permissions_delete + id
      })
      // async onQueryStarted({ id, originalArgs, ...patch }, { dispatch, queryFulfilled, getState }) {
      //   try {
      //     const { data: updatedPost } = await queryFulfilled

      //     const {
      //       PermissionManagement: { queries }
      //     } = getState()

      //     const patchResult = dispatch(
      //       PermissionManagement.util.updateQueryData(
      //         'loadPermission',
      //         {
      //           ...originalArgs
      //         },
      //         (draft) => {
      //           const orgData = draft
      //           const index = orgData.payload.data?.findIndex((a) => a.id === id) as number
      //           if (id !== -1) {
      //             orgData.payload.data?.splice(index, 1)
      //           }

      //           return orgData
      //         }
      //       )
      //     )
      //   } catch (e) {
      //     log('failed', e)
      //   }
      // }
    })
  })
})
export const {
  useLoadPermissionByIdQuery,
  useLoadPermissionMutation,
  useCreateOrUpdatePermissionMutation,
  useDeletePermissionByIdMutation
} = PermissionManagement
