/* eslint-disable no-confusing-arrow */
// ** Redux Imports
import { createApi } from '@reduxjs/toolkit/query/react'
import { isValid, isValidArray, log } from '../../utility/helpers/common'
import ApiEndpoints from '../../utility/http/ApiEndpoints'
import { axiosBaseQuery } from '../../utility/http/Http'
import {
  RequestParamsWithPagePerPage,
  ResponseParamsTypeWithPagination,
  ViewParams
} from '../../utility/http/httpConfig'
import { StoreResponseParamsView } from './StoreRTK'
interface extraParams {
  userType: number
  jsonData?: any
}
export interface SubStoreRequestParams {
  // other info
  id?: number | null
  created_by?: any
  allow_bulk_referral?: any
  allow_promotion?: any

  languages?: any
  country_code?: any
  registered_company_name?: any
  organisation_number?: any
  organisation_address?: any
  percentage?: any
  currency?: any
  store_id?: string | null
  display_loose_product?: any
  // store info
  parent_id?: any
  name?: string | null
  email?: string | null
  password?: string | null
  mobile_number?: string | null
  personal_number?: any | null
  description?: string | null
  store_qr_code_image?: any | null
  website?: string | null
  logo?: string | null
  // Manager Info
  store_email?: string | null
  store_name?: string | null
  store_number?: string | number | null
  contact_person_number?: string | null
  contact_person_name?: string | null

  // Store Address
  address?: string | null
  state?: any | null
  city?: string | null
  latitude?: string | null | number
  store_setting?: any | null
  longitude?: string | null | number

  country?: string | null
  // Subscription Details
  subscription_type?: any // 1: Per transaction 2: Fixed (Monthly),
  amount?: number | null
  // Sub Store Limit
  sub_store_limit?: number | null
  // Status
  status?: any // 1: Active 2: Deleted 0: Inactive
  // Dates
  created_at?: string | null
  updated_at?: string | null
  deleted_at?: string | null
  opening_time?: any
  closing_time?: any
  xbd_public_key?: any
  xbd_secret_key?: any
  xbd_merchant_id?: any
  xbd_client_id?: any
  xbd_client_secret?: any
  xbd_callback_url?: any
  store_subscription?: any
  subscription_terms_select_value?: any | null // for internal use only
  fakeLogo?: string | null // only for internal use
}
type ListRequestParams = RequestParamsWithPagePerPage & extraParams
type ResponseParams = ResponseParamsTypeWithPagination<SubStoreRequestParams>

export const SubStoreManagement = createApi({
  reducerPath: 'SubStoreManagement',
  tagTypes: ['SubStore', 'TrashStore'],
  baseQuery: axiosBaseQuery(),
  endpoints: (builder) => ({
    loadSubStore: builder.query<ResponseParams, ListRequestParams>({
      query: (a) => ({
        jsonData: a?.jsonData,
        params: { page: a?.page, per_page_record: a?.per_page_record },
        method: 'post',
        path: ApiEndpoints.subStore_list
      }),
      //   providesTags: ['Stores']
      providesTags: (result) => {
        let next = 'LIST'
        if (result?.payload?.current_page !== '1') {
          next = 'NEXT-LIST'
        }
        if (isValidArray(result?.payload?.data) && result) {
          const r =
            result.payload?.data?.map(({ id }: SubStoreRequestParams) => ({
              type: 'SubStore' as const,
              id: id ?? 'LIST'
            })) ?? []
          return [...r, { type: 'SubStore', id: next }]
        } else {
          return [{ type: 'SubStore', id: next }]
        }
      }
    }),
    loadSubStoreTrashed: builder.mutation<ResponseParams, ListRequestParams>({
      query: (a) => ({
        jsonData: a?.jsonData,
        params: { page: a?.page, per_page_record: a?.per_page_record },
        method: 'post',
        path: ApiEndpoints.subStore_trashed_list
      })
      //   providesTags: ['Stores']
    }),
    restoreSubStore: builder.mutation<ResponseParams, ViewParams>({
      invalidatesTags: (result, error, arg) => [
        { type: 'SubStore', id: 'NEXT-LIST' },
        { type: 'SubStore', id: 'LIST' }
        // { type: 'Stores', id: arg.id }
      ],
      query: (jsonData) => ({
        method: 'post',
        path: isValid(jsonData?.id)
          ? ApiEndpoints.subStore_restore + jsonData?.id
          : ApiEndpoints.subStore_restore + jsonData?.id
      })
    }),

    createOrUpdateSubStore: builder.mutation<ResponseParams, SubStoreRequestParams>({
      query: (jsonData) => ({
        jsonData,
        method: isValid(jsonData?.id) ? 'patch' : 'post',
        path: isValid(jsonData?.id)
          ? ApiEndpoints?.subStore_edit + jsonData?.id
          : ApiEndpoints.subStore_add
      })
      // invalidatesTags: ['SubStore']
    }),

    loadSubStoreById: builder.query<ResponseParams, ViewParams>({
      query: ({ id }) => ({
        method: 'get',
        path: ApiEndpoints.subStore_view + id
      })
    }),
    loadSubStoreId: builder.mutation<StoreResponseParamsView, ViewParams>({
      query: ({ id }) => ({
        method: 'get',
        path: ApiEndpoints.subStore_view + id
      })
    }),
    loadCommonStoreDetails: builder.mutation<StoreResponseParamsView, ViewParams>({
      query: ({ id }) => ({
        method: 'get',
        path: ApiEndpoints.load_common_store + id
      })
    }),
    deleteSubStoreById: builder.mutation<ResponseParams, ViewParams>({
      invalidatesTags: (result, error, arg) => [
        { type: 'SubStore', id: 'NEXT-LIST' },
        { type: 'SubStore', id: 'LIST' }
        // { type: 'Stores', id: arg.id }
      ],
      query: ({ id, originalArgs, jsonData }) => ({
        jsonData,
        method: !isValid(id) ? 'post' : 'delete',
        path: !isValid(id) ? ApiEndpoints.subStore_action : ApiEndpoints.subStore_delete + id
      }),
      async onQueryStarted({ id, originalArgs, ...patch }, { dispatch, queryFulfilled, getState }) {
        try {
          const { data: updatedPost } = await queryFulfilled

          const {
            SubStoreManagement: { queries }
          } = getState()

          const patchResult = dispatch(
            SubStoreManagement.util.updateQueryData(
              'loadSubStore',
              {
                ...originalArgs
              },
              (draft) => {
                const orgData = draft
                const index = orgData.payload.data?.findIndex((a) => a.id === id) as number
                if (id !== -1) {
                  orgData.payload.data?.splice(index, 1)
                }

                return orgData
              }
            )
          )
        } catch (e) {
          log('failed', e)
        }
      }
    })
  })
})
export const {
  useCreateOrUpdateSubStoreMutation,
  //   useLoadSubStoreByIdQuery,
  useLoadSubStoreQuery,
  useDeleteSubStoreByIdMutation,
  useLoadSubStoreTrashedMutation,
  useRestoreSubStoreMutation,
  useLoadCommonStoreDetailsMutation,
  useLoadSubStoreIdMutation
} = SubStoreManagement
