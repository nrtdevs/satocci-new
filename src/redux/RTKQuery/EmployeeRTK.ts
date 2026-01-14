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

interface extraParams {
  jsonData?: any
}

type ListRequestParams = RequestParamsWithPagePerPage & extraParams
type ResponseParams = ResponseParamsTypeWithPagination<EmployeeParamType>

export const employeeManagement = createApi({
  reducerPath: 'EmployeeManagement',
  tagTypes: ['Employee'],
  baseQuery: axiosBaseQuery(),
  endpoints: (builder) => ({
    loadEmployee: builder.query<ResponseParams, ListRequestParams>({
      query: (a) => ({
        jsonData: a?.jsonData,
        params: { page: a?.page, per_page_record: a?.per_page_record },
        method: 'post',
        path: ApiEndpoints.employee_list
      }),
      //   providesTags: ['Stores']
      providesTags: (result, error, arg) => {
        if (isValidArray(result?.payload?.data) && result) {
          const r = result.payload?.data?.map(({ id }: EmployeeParamType) => ({
            type: 'Employee' as const,
            id: id ?? 'LIST'
          }))
          return r ? r : ['Employee']
        } else {
          return ['Employee']
        }
      }
    }),
    loadEmployeeData: builder.mutation<ResponseParams, ListRequestParams>({
      query: (a) => ({
        jsonData: a?.jsonData,
        params: { page: a?.page, per_page_record: a?.per_page_record },
        method: 'post',
        path: ApiEndpoints.employee_list
      })
      //   providesTags: ['Stores']
    }),

    createOrUpdateEmployee: builder.mutation<ResponseParams, EmployeeParamType>({
      query: (jsonData) => ({
        jsonData,
        method: isValid(jsonData?.id) ? 'patch' : 'post',
        path: isValid(jsonData?.id)
          ? ApiEndpoints?.employee_edit + jsonData?.id
          : ApiEndpoints.employee_add
      })
      // invalidatesTags: ['Employee']
    }),
    loadEmployeeById: builder.query<ResponseParams, ViewParams>({
      query: ({ id }) => ({
        method: 'get',
        path: ApiEndpoints.employee_view + id
      })
    }),
    loadEmployeeDetailsById: builder.mutation<EmployeeParamType, ViewParams>({
      query: ({ id }) => ({
        method: 'get',
        path: ApiEndpoints.employee_view + id
      })
    }),
    deleteEmployeeById: builder.mutation<ResponseParams, ViewParams>({
      invalidatesTags: ['Employee'],
      query: (a) => ({
        jsonData: a?.jsonData,
        method: isValid(a?.id) ? 'delete' : 'post',
        path: isValid(a?.id) ? ApiEndpoints.employee_delete + a?.id : ApiEndpoints.employee_action
      })
    })
  })
})
export const {
  useCreateOrUpdateEmployeeMutation,
  useLoadEmployeeQuery,
  useLoadEmployeeDataMutation,
  useDeleteEmployeeByIdMutation,
  useLoadEmployeeByIdQuery,
  useLoadEmployeeDetailsByIdMutation
} = employeeManagement
