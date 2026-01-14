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
export interface LanguageRequestParams {
  id?: any | null
  check_all?: any | null
  title?: any | null
  value?: any | null
  lang_code?: string
  mode?: any
  status?: any | null
  country?: any | null
  file?: any | null
  country_code?: any | null
  entry_mode?: any | null
  created_at?: any | null
  updated_at?: any | null
  originalArgs?: any | null
  payload?: any | null
}
type ListRequestParams = RequestParamsWithPagePerPage & extraParams
type ResponseParams = ResponseParamsTypeWithPagination<LanguageRequestParams>

export const LanguageManagement = createApi({
  baseQuery: axiosBaseQuery(),
  reducerPath: 'LanguageManagement',
  tagTypes: ['Language'],

  endpoints: (builder) => ({
    loadLanguage: builder?.mutation<ResponseParams, ListRequestParams>({
      query: ({ page, per_page_record, jsonData }) => ({
        jsonData,
        params: { page, per_page_record, ...jsonData },
        method: 'get',
        path: ApiEndpoints.language_list
      })
    }),
    createOrUpdateLanguage: builder?.mutation<ResponseParams, LanguageRequestParams>({
      query: (jsonData) => ({
        formData: jsonData,
        method: isValid(jsonData?.id) ? 'patch' : 'post',
        path: isValid(jsonData?.id)
          ? ApiEndpoints?.language_edit + jsonData?.id
          : ApiEndpoints.language_add
      }),
      invalidatesTags: ['Language']
    }),
    loadLanguageById: builder?.query<ResponseParams, ViewParams>({
      query: ({ id }) => ({
        method: 'get',
        path: ApiEndpoints.language_view + id
      })
    }),
    languageList: builder?.mutation<LanguageRequestParams, ViewParams>({
      query: (a) => ({
        jsonData: a?.jsonData,
        params: { page: a?.page, per_page_record: a?.per_page_record },
        method: 'get',
        path: isValid(a?.id) ? ApiEndpoints.language_list_store + a?.id : ApiEndpoints.language_list
      })
    }),
    getLanguageSample: builder.query({
      query: () => ({
        method: 'post',
        path: ApiEndpoints.label_export
      })
    }),
    deleteLanguageById: builder.mutation<LanguageRequestParams, ViewParams>({
      invalidatesTags: (result, error, arg) => [
        { type: 'Language', id: 'NEXT-LIST' },
        { type: 'Language', id: 'LIST' }
        // { type: 'Stores', id: arg.id }
      ],
      query: ({ id, originalArgs }) => ({
        method: 'delete',
        path: ApiEndpoints.language_delete + id
      })
    })
  })
})
export const {
  useCreateOrUpdateLanguageMutation,
  useLoadLanguageByIdQuery,
  useLoadLanguageMutation,
  useLanguageListMutation,
  useDeleteLanguageByIdMutation
} = LanguageManagement
