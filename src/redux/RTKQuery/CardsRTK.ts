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
export interface CardsRequestParams {
  store_id?: any
  card_number?: any
  card_type?: any
  card_cvv?: any
  card_expiry?: any
  card_holder_name?: any
  is_default?: any
  status?: any
  updated_at?: any
  created_at?: any
  id?: any
}
type ListRequestParams = RequestParamsWithPagePerPage & extraParams
type ResponseParams = ResponseParamsTypeWithPagination<CardsRequestParams>

export const CardsManagement = createApi({
  reducerPath: 'CardsManagement',
  tagTypes: ['Cards'],
  baseQuery: axiosBaseQuery(),
  endpoints: (builder) => ({
    loadCards: builder.query<ResponseParams, ListRequestParams>({
      query: (a) => ({
        jsonData: a?.jsonData,
        params: { page: a?.page, per_page_record: a?.per_page_record },
        method: 'get',
        path: ApiEndpoints.card_list
      }),
      //   providesTags: ['Stores']
      providesTags: (result, error, arg) => {
        if (isValidArray(result?.payload?.data) && result) {
          const r = result.payload?.data?.map(({ id }: CardsRequestParams) => ({
            type: 'Cards' as const,
            id: id ?? 'LIST'
          }))
          return r ? r : ['Cards']
        } else {
          return ['Cards']
        }
      }
    }),
    createOrUpdateCards: builder.mutation<ResponseParams, CardsRequestParams>({
      query: (jsonData) => ({
        jsonData,
        method: isValid(jsonData?.id) ? 'patch' : 'post',
        path: isValid(jsonData?.id)
          ? ApiEndpoints?.card_update + jsonData?.id
          : ApiEndpoints.card_add
      })
      // invalidatesTags: ['Feedback']
    }),
    loadCardsById: builder.query<ResponseParams, ViewParams>({
      query: ({ id }) => ({
        method: 'get',
        path: ApiEndpoints.card_view + id
      })
    }),
    deleteCardsById: builder.mutation<ResponseParams, ViewParams>({
      invalidatesTags: ['Cards'],
      query: ({ id }) => ({
        method: 'delete',
        path: ApiEndpoints.card_delete + id
      })
    })
  })
})
export const {
  useCreateOrUpdateCardsMutation,
  useLoadCardsByIdQuery,
  useLoadCardsQuery,
  useDeleteCardsByIdMutation
} = CardsManagement
