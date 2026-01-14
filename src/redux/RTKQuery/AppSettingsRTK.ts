/* eslint-disable no-confusing-arrow */
// ** Redux Imports
import { createApi } from '@reduxjs/toolkit/query/react'
import ApiEndpoints from '../../utility/http/ApiEndpoints'
import { axiosBaseQuery } from '../../utility/http/Http'
import {
  RequestParamsWithPagePerPage,
  ResponseParamsTypeWithPagination,
  ViewParams
} from '../../utility/http/httpConfig'

export interface AppSettingRequestParams {
  id?: any | null
  app_name?: any | null
  org_number?: any | null
  description?: any | null
  stripe_account_country?: any | null
  stripe_account_default_currency?: any | null
  logo_path?: any | null
  otp_enabled?: any | null
  customer_care_number?: any
  logo_thumb_path?: any | null
  copyright_text?: any | null
  fb_ur?: any | null
  twitter_url?: any | null
  insta_url?: any | null
  linked_url?: any | null
  payload?: any | null
  support_email?: any | null
  support_contact_number?: any | null
  address?: any | null
  meta_title?: any | null
  meta_keywords?: any | null
  meta_description?: any | null
  invite_url?: any | null
  play_store_url?: any | null
  app_store_url?: any | null
  allowed_app_version?: any | null
  stripe_key?: null | any
  stripe_secret?: null | any
}
interface extraParams {
  jsonData?: any
}
export interface PendingStore {
  admin_share?: any
  card_number?: any
  coupon?: any
  coupon_code?: any
  gateway_processing_charge?: any
  gateway_processing_fee?: any
  created_at?: any
  currency?: any
  currency_symbol?: any
  customer_rating?: any
  id?: any
  is_transferred_to_store?: any
  order_number?: any
  paid_amount?: any
  payment_method?: any
  payment_status?: any
  per_transaction_percentage?: any
  status?: any
  store?: any
  store_id?: any
  store_share?: any
  total_amount?: any
  total_cart_items?: any
  transaction_id?: any
  vat_amount?: any
}
export interface profileRequestParams {
  id?: null | any
  payload?: any
  unique_id?: null | any
  store_qr_code?: null | any
  user_type_id?: null | any
  store_id?: null | any
  parent_id: null
  name?: null | any
  email?: null | any
  email_verified_at?: null | any
  mobile_number?: null | any
  locale?: null | any
  address?: null | any
  city?: null | any
  country?: null | any
  currency?: null | any
  currency_symbol?: null | any
  postal_area?: null | any
  zip_code?: null | any
  personal_number?: null | any
  avatar?: null | any
  organization_number?: null | any
  stripe_customer_id?: null | any
  created_by?: null | any
  status?: null | any
  entry_mode?: null | any
  created_at?: null | any
  updated_at?: null | any
  deleted_at?: null | any
  store_setting?: any
}
type ListRequestParams = RequestParamsWithPagePerPage & extraParams
type ResponseParams = ResponseParamsTypeWithPagination<AppSettingRequestParams>
type PendingStoreParams = ResponseParamsTypeWithPagination<PendingStore>

export const AppSettingManagement = createApi({
  reducerPath: 'AppSettingManagement',
  tagTypes: ['AppSetting'],
  baseQuery: axiosBaseQuery(),
  endpoints: (builder) => ({
    loadAppSetting: builder.mutation<AppSettingRequestParams, ListRequestParams>({
      query: (a) => ({
        jsonData: a?.jsonData,
        params: { page: a?.page, per_page_record: a?.per_page_record },
        method: 'get',
        path: ApiEndpoints.app_setting_list
      })
    }),

    createOrUpdateAppSetting: builder.mutation<ResponseParams, AppSettingRequestParams>({
      query: (jsonData) => ({
        jsonData,
        method: 'post',
        path: ApiEndpoints.app_setting_add
      }),
      invalidatesTags: ['AppSetting']
    }),

    pendingStoreAmount: builder.mutation<PendingStoreParams, ListRequestParams>({
      query: (a) => ({
        jsonData: a?.jsonData,
        params: { page: a?.page, per_page_record: a?.per_page_record },
        method: 'post',
        path: ApiEndpoints.pending_store_amount
      })
    }),
    // loadAppSettingById: builder.query<ResponseParams, ViewParams>({
    //   query: ({ id }) => ({
    //     method: 'get',
    //     path: ApiEndpoints.app_setting_view + id
    //   })
    // }),
    loadAppSettingDetailsById: builder.mutation<AppSettingRequestParams, ViewParams>({
      query: () => ({
        method: 'get',
        path: ApiEndpoints.app_setting_list
      })
    }),
    profileDetails: builder.mutation<profileRequestParams, ViewParams>({
      query: () => ({
        method: 'get',
        path: ApiEndpoints.myProfile
      })
    }),
    connectStripe: builder.mutation<any, any>({
      query: () => ({
        method: 'get',
        path: ApiEndpoints.connect_stripe
      })
    }),
    changeOrderStatus: builder.mutation<any, any>({
      query: (a) => ({
        jsonData: { order_ids: a?.ids },
        method: 'post',
        path: ApiEndpoints.update_order_transfer
      })
    }),
    checkStripeCurrentStatus: builder.mutation<any, any>({
      query: ({ id }) => ({
        method: 'get',
        path: ApiEndpoints.check_stripe_current_status + id
      })
    }),

    loadAllUserData: builder.mutation<any, any>({
      query: (a) => ({
        jsonData: a?.jsonData,
        method: 'post',
        path: ApiEndpoints.allUserList
      })
    }),
    updatePasswordAnyUser: builder.mutation<any, any>({
      query: (a) => ({
        jsonData: a?.jsonData,
        method: 'post',
        path: ApiEndpoints.updatePasswordAnyUser
      })
    })

    // deleteAppSettingById: builder.mutation<ResponseParams, ViewParams>({
    //   invalidatesTags: ['AppSetting'],
    //   query: ({ id }) => ({
    //     method: 'delete',
    //     path: ApiEndpoints.app_setting_delete + id
    //   })
    // })
  })
})
export const {
  useLoadAppSettingMutation,
  useProfileDetailsMutation,
  useConnectStripeMutation,
  usePendingStoreAmountMutation,
  useChangeOrderStatusMutation,
  useCheckStripeCurrentStatusMutation,
  useCreateOrUpdateAppSettingMutation,
  useLoadAppSettingDetailsByIdMutation,
  useLoadAllUserDataMutation,
  useUpdatePasswordAnyUserMutation
} = AppSettingManagement
