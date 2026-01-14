/* eslint-disable no-confusing-arrow */
// ** Redux Imports
import { createApi } from '@reduxjs/toolkit/query/react'
import { isValid, isValidArray } from '../../utility/helpers/common'
import ApiEndpoints from '../../utility/http/ApiEndpoints'
import { axiosBaseQuery } from '../../utility/http/Http'
import {
  RequestParamsWithPagePerPage,
  ResponseParamsTypeWithPagination,
  ViewParams
} from '../../utility/http/httpConfig'

import { EmployeeParamType } from '../../views/UserManagement/employee/fragment/AddUpdateEmployee'

export interface adminEmpReqParams {
  name?: string | null
  id?: any | null
  email?: string | null
  zip_code?: any
  password?: any | null
  mobile_number?: number | string | null
  store_id?: string | number | null
  status?: string | number | null
  entry_mode?: any | null
  parent_id?: string | number | null
  address?: string | null
  personal_number?: string | number | null
  organization_number?: string | number | null
  postal_area?: string | number | null
  city?: string | number | null
  zipcode?: string | number | null
  country?: any
  created_at?: string | number | null
  roles?: any | null
}
interface extraParams {
  jsonData?: any
}

type ListRequestParams = RequestParamsWithPagePerPage & extraParams
type ResponseParams = ResponseParamsTypeWithPagination<adminEmpReqParams>

export const employeeAdminManagement = createApi({
  reducerPath: 'EmployeeAdminManagement',
  tagTypes: ['EmployeeAdmin', 'AdminEmpTrash'],
  baseQuery: axiosBaseQuery(),
  endpoints: (builder) => ({
    loadEmployeeAdmin: builder.query<ResponseParams, ListRequestParams>({
      query: (a) => ({
        jsonData: a?.jsonData,
        params: { page: a?.page, per_page_record: a?.per_page_record },
        method: 'post',
        path: ApiEndpoints.admin_emp_list
      }),
      //   providesTags: ['Stores']
      providesTags: (result) => {
        let next = 'LIST'
        if (result?.payload?.current_page !== '1') {
          next = 'NEXT-LIST'
        }
        if (isValidArray(result?.payload?.data) && result) {
          const r =
            result.payload?.data?.map(({ id }: adminEmpReqParams) => ({
              type: 'EmployeeAdmin' as const,
              id: id ?? 'LIST'
            })) ?? []
          return [...r, { type: 'EmployeeAdmin', id: next }]
        } else {
          return [{ type: 'EmployeeAdmin', id: next }]
        }
      }
    }),
    loadAdminEmployeeTrash: builder.mutation<ResponseParams, ListRequestParams>({
      query: (a) => ({
        jsonData: a?.jsonData,
        params: { page: a?.page, per_page_record: a?.per_page_record },
        method: 'post',
        path: ApiEndpoints.admin_emp_trash
      })
    }),
    restoreEmployee: builder.mutation<ResponseParams, ViewParams>({
      invalidatesTags: [{ type: 'AdminEmpTrash', id: 'NEXT-LIST' }],
      query: (jsonData) => ({
        method: 'post',
        path: isValid(jsonData?.id)
          ? ApiEndpoints.admin_emp_restore + jsonData?.id
          : ApiEndpoints.admin_emp_restore + jsonData?.id
      })
    }),
    createOrUpdateEmployeeAdmin: builder.mutation<ResponseParams, adminEmpReqParams>({
      query: (jsonData) => ({
        jsonData,
        method: isValid(jsonData?.id) ? 'patch' : 'post',
        path: isValid(jsonData?.id)
          ? ApiEndpoints?.admin_emp_edit + jsonData?.id
          : ApiEndpoints.admin_emp_add
      })
      //invalidatesTags: ['EmployeeAdmin']
    }),
    loadEmployeeAdminById: builder.query<ResponseParams, ViewParams>({
      query: ({ id }) => ({
        method: 'get',
        path: ApiEndpoints.admin_emp_view + id
      })
    }),
    autoUpdatePasswordAllAcccount: builder.mutation<any, any>({
      query: (a) => ({
        jsonData: { ...a },
        method: 'get',

        path: ApiEndpoints.auto_update_password_all_acccount
      })
    }),
    downloadPasswordFile: builder.mutation<any, any>({
      query: (a) => ({
        jsonData: { ...a },
        method: 'get',
        path: ApiEndpoints.download_password_file
      })
    }),
    loadAdminEmployeeDetailsById: builder.mutation<EmployeeParamType, ViewParams>({
      query: ({ id }) => ({
        method: 'get',
        path: ApiEndpoints.admin_emp_view + id
      })
    }),
    deleteEmployeeAdminById: builder.mutation<ResponseParams, ViewParams>({
      invalidatesTags: (result, error, arg) => [
        { type: 'AdminEmpTrash', id: 'NEXT-LIST' },
        { type: 'AdminEmpTrash', id: 'LIST' },
        { type: 'EmployeeAdmin', id: 'NEXT-LIST' },
        { type: 'EmployeeAdmin', id: 'LIST' }
        // { type: 'Stores', id: arg.id }
      ],
      query: ({ id, originalArgs, jsonData }) => ({
        jsonData,
        method: !isValid(id) ? 'post' : 'delete',
        path: !isValid(id) ? ApiEndpoints.admin_emp_action : ApiEndpoints.admin_emp_delete + id
      })
    })
  })
})
export const {
  useCreateOrUpdateEmployeeAdminMutation,
  useLoadEmployeeAdminQuery,
  useLoadEmployeeAdminByIdQuery,
  useDeleteEmployeeAdminByIdMutation,
  useLoadAdminEmployeeTrashMutation,
  useRestoreEmployeeMutation,
  useLoadAdminEmployeeDetailsByIdMutation,
  useAutoUpdatePasswordAllAcccountMutation,
  useDownloadPasswordFileMutation
} = employeeAdminManagement
