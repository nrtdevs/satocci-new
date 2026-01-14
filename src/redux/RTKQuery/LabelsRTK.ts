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
  filterData?: any
  jsonData?: any
}
export type LabelsParams = {
  id?: any
  group_id?: any
  language_id?: any
  label_name?: any
  label_value?: any
  status?: any
  entry_mode?: any
  created_at?: any
  updated_at?: any
}

type ListRequestParams = RequestParamsWithPagePerPage & extraParams
type ResponseParams = ResponseParamsTypeWithPagination<LabelsParams>
export const LabelManagement = createApi({
  reducerPath: 'LabelsManagement',
  tagTypes: ['Labels'],
  baseQuery: axiosBaseQuery(),
  endpoints: (builder) => ({
    // loadLabels: builder.query<ResponseParams, ListRequestParams>({
    //   query: ({ page, per_page_record, filterData }) => ({
    //     params: { page, per_page_record, ...filterData },
    //     method: 'get',
    //     path: ApiEndpoints.load_labels
    //   }),
    //   providesTags: ['Labels']
    // }),
    loadLabels: builder.mutation<ResponseParams, ListRequestParams>({
      query: ({ page, per_page_record, jsonData }) => ({
        jsonData,
        params: { page, per_page_record, ...jsonData },
        method: 'post',
        path: ApiEndpoints.load_labels
      })
    }),
    createOrUpdateLabels: builder.mutation<ResponseParams, LabelsParams>({
      query: (jsonData) => ({
        jsonData,
        method: isValid(jsonData?.id) ? 'patch' : 'post',
        path: isValid(jsonData?.id)
          ? ApiEndpoints?.edit_labels + jsonData?.id
          : ApiEndpoints.add_labels
      }),
      invalidatesTags: ['Labels']
    }),
    loadLabelsById: builder.query<ResponseParams, ViewParams>({
      query: ({ id }) => ({
        method: 'get',
        path: ApiEndpoints.view_labels + id
      })
    }),
    findLabelNotAddedLangWise: builder.mutation<any, any>({
      query: ({ id }) => ({
        method: 'get',
        path: ApiEndpoints.find_label_not_added_lang_wise + id
      })
    }),
    addLabelIfNotExists: builder.mutation<any, any>({
      query: ({ jsonData }) => ({
        jsonData,
        method: 'post',
        path: ApiEndpoints.add_labels_if_not_found
      })
    }),
    deleteLabelsById: builder.mutation<ResponseParams, ViewParams>({
      invalidatesTags: ['Labels'],
      query: ({ id }) => ({
        method: 'delete',
        path: ApiEndpoints.delete_labels + id
      })
    })
  })
})
export const {
  useCreateOrUpdateLabelsMutation,
  useLoadLabelsByIdQuery,
  useLoadLabelsMutation,
  useDeleteLabelsByIdMutation,
  useFindLabelNotAddedLangWiseMutation,
  useAddLabelIfNotExistsMutation
} = LabelManagement
