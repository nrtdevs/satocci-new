// ** Redux Imports
import { createApi } from '@reduxjs/toolkit/query/react'
import { UserType } from '../../utility/Const'
import { isValid, isValidArray } from '../../utility/helpers/common'
import ApiEndpoints from '../../utility/http/ApiEndpoints'
import { axiosBaseQuery } from '../../utility/http/Http'
import {
  RequestParamsWithPagePerPage,
  ResponseParamsType,
  ResponseParamsTypeWithPagination,
  ViewParams
} from '../../utility/http/httpConfig'
import { StoreParamsType } from '../../views/stores/fragment/AddUpdateForm'
import { use } from 'i18next'
import { ResponseParams } from './SubscriptionRTK'

interface extraParams {
  userType: number
  jsonData?: any
  id?: any
  least?: any
}

type actionParamsType = {
  ids?: any
  action?: any
  originArgs?: any
}
export type profileParams = {
  password?: any
  is_change_password?: any
  confirm_password?: any
  unique_id?: any
  name?: any
  city?: any
  email?: any
  postal_area?: any
  store_setting?: any
  closing_time?: any
  mobile_number?: any
  address?: any
  avatar?: any
  opening_time?: any
  store_email?: any
  organisation_address?: any
  organisation_number?: any
  registered_company_name?: any
  notify_guard_frequency?: any
  country?: any
  personal_number?: any
  longitude?: any
  latitude?: any
  zip_code?: any
  days_for_return?: any
}
export type activityParams = {
  causer?: any
  properties?: any
  log_name?: any
  name?: any
  id?: any
  event?: any
  description?: any
  created_at?: any
  causer_type?: any
  causer_id?: any
  batch_uuid?: any
  subject_id?: any
  subject_type?: any
  updated_at?: any
}
export type gateKeeperActivityParams = {
  properties?: any
  log_name?: any
  id?: any
  event?: any
  description?: any
  created_at?: any
  causer_type?: any
  causer_id?: any
  batch_uuid?: any
  subject_id?: any
  subject_type?: any
  updated_at?: any
  order_number?: number
  coupon_code?: any
  currency?: any
  paid_amount?: number
  total_cart_items?: number
  order?: any
  currency_symbol?: any
  customer_rating?: any
  name?: any
  gate_keeper?: any
}
export type storeReportParams = {
  no_of_products?: any
  no_of_transaction?: any
  total_earnings?: any
}
export type revenueReportParamType = {
  months?: any
  earnings?: any
  costs?: any
}

export type StoreListRequestParams = (RequestParamsWithPagePerPage & extraParams) | undefined
export type StoreResponseParams = ResponseParamsTypeWithPagination<StoreParamsType>
export type RevenueReportParams =
  | ResponseParamsTypeWithPagination<revenueReportParamType>
  | undefined
export type ActivityProfileParams = ResponseParamsTypeWithPagination<activityParams>
export type GateKeeperProfileParams = ResponseParamsTypeWithPagination<gateKeeperActivityParams>
export type updateProfileParams = ResponseParamsTypeWithPagination<profileParams>
export type StoreResponseParamsView = ResponseParamsType<StoreParamsType> | undefined
export type CountryResponseParams = {
  country_code?: any
  currency?: any
  currency_code?: any
  currency_symbol?: any
  dial_code?: any
  id?: any
  name?: any
}

export const StoreManagement = createApi({
  reducerPath: 'StoreManagement',
  tagTypes: ['Stores', 'TrashStore'],
  baseQuery: axiosBaseQuery(),
  endpoints: (builder) => ({
    loadStores: builder.query<StoreResponseParams, StoreListRequestParams>({
      query: (a) => ({
        jsonData: a?.jsonData,
        params: { page: a?.page, per_page_record: a?.per_page_record },
        method: 'post',
        path: ApiEndpoints.load_stores
      }),
      //   providesTags: ['Stores']
      providesTags: (result) => {
        let next = 'LIST'
        if (result?.payload?.current_page !== '1') {
          next = 'NEXT-LIST'
        }
        if (isValidArray(result?.payload?.data) && result) {
          const r =
            result.payload?.data?.map(({ id }: StoreParamsType) => ({
              type: 'Stores' as const,
              id: id ?? 'LIST'
            })) ?? []
          return [...r, { type: 'Stores', id: next }]
        } else {
          return [{ type: 'Stores', id: next }]
        }
      }
    }),
    loadParentStores: builder.mutation<StoreResponseParams, StoreListRequestParams>({
      query: (a) => ({
        jsonData: a?.jsonData,
        params: { page: a?.page, per_page_record: a?.per_page_record },
        method: 'post',
        path: ApiEndpoints.load_stores
      })
    }),
    loadActivity: builder.mutation<ActivityProfileParams, ViewParams>({
      query: (a) => ({
        jsonData: a?.jsonData,
        params: { page: a?.page, per_page_record: a?.per_page_record },
        method: 'post',
        path: a?.jsonData?.userType === 1 ? ApiEndpoints.load_activity : ApiEndpoints.store_activity
      })
    }),
    loadGateKeeperActivity: builder.mutation<GateKeeperProfileParams, ViewParams>({
      query: (a) => ({
        jsonData: a?.jsonData,
        params: { page: a?.page, per_page_record: a?.per_page_record },
        method: 'post',
        path: ApiEndpoints.load_gatekeeper_activity
      })
    }),
    loadActivityById: builder.mutation<ActivityProfileParams, ViewParams>({
      query: ({ id }) => ({
        method: 'get',
        path: ApiEndpoints.load_activity_id + id
      })
    }),
    loginLog: builder.mutation<ActivityProfileParams, ViewParams>({
      query: (a) => ({
        jsonData: a?.jsonData,
        params: { page: a?.page, per_page_record: a?.per_page_record },
        method: 'post',
        path: ApiEndpoints.loginLog
      })
    }),
    downloadZipFile: builder.mutation<ActivityProfileParams, ViewParams>({
      query: ({ id }) => ({
        method: 'get',
        path: ApiEndpoints.download_zip_file + id,
        showErrorToast: false
      })
    }),
    // loadTopStores: builder.mutation<StoreResponseParams, StoreListRequestParams>({
    //   query: (a) => ({
    //     jsonData: a?.jsonData,
    //     params: { page: a?.page, per_page_record: a?.per_page_record },
    //     method: 'post',
    //     path: ApiEndpoints.load_top_stores
    //   })
    // }),
    topAndLeastStores: builder.mutation<StoreResponseParams, StoreListRequestParams>({
      query: (a) => ({
        jsonData: a?.jsonData,
        params: { page: a?.page, per_page_record: a?.per_page_record },
        method: 'post',
        path: a?.least === 1 ? ApiEndpoints.least_selling_stores : ApiEndpoints.load_top_stores
      })
    }),
    loadTrashedStore: builder.mutation<StoreResponseParams, StoreListRequestParams>({
      query: (a) => ({
        jsonData: a?.jsonData,
        params: { page: a?.page, per_page_record: a?.per_page_record },
        method: 'post',
        path: ApiEndpoints.trashed_stores
      })
    }),
    restoreStore: builder.mutation<StoreResponseParams, ViewParams>({
      invalidatesTags: [{ type: 'Stores', id: 'NEXT-LIST' }],
      query: (jsonData) => ({
        method: 'post',
        path: isValid(jsonData?.id)
          ? ApiEndpoints.restore_store + jsonData?.id
          : ApiEndpoints.restore_store + jsonData?.id
      })
    }),
    revenueReport: builder.mutation<RevenueReportParams, ViewParams>({
      query: (jsonData) => ({
        jsonData,
        method: 'post',
        path: jsonData?.eventId !== 1 ? ApiEndpoints.revenueReport : ApiEndpoints.topCategories
      })
    }),
    storeReports: builder.mutation<StoreResponseParams, ViewParams>({
      invalidatesTags: [{ type: 'Stores', id: 'NEXT-LIST' }],
      query: (a) => ({
        jsonData: a?.jsonData,
        method: 'post',
        path: a?.userType === UserType.Admin ? ApiEndpoints.adminReports : ApiEndpoints.storeReports
      })
    }),
    currencyWiseReports: builder.mutation<any, ViewParams>({
      query: (a) => ({
        jsonData: a?.jsonData,
        method: 'post',
        path: ApiEndpoints.currency_wise_report
      })
    }),
    createOrUpdateStore: builder.mutation<StoreResponseParams, StoreParamsType>({
      invalidatesTags: [{ type: 'Stores', id: 'NEXT-LIST' }],
      query: (jsonData) => ({
        jsonData,
        method: isValid(jsonData?.id) ? 'patch' : 'post',
        path: isValid(jsonData?.id)
          ? ApiEndpoints?.edit_stores + jsonData?.id
          : ApiEndpoints.add_stores
      })
    }),

    updateProfile: builder.mutation<updateProfileParams, profileParams>({
      invalidatesTags: [{ type: 'Stores', id: 'NEXT-LIST' }],
      query: (jsonData) => ({
        jsonData,
        method: 'post',
        path: ApiEndpoints?.updateProfile
      })
    }),
    loadStoreDetailsById: builder.mutation<StoreResponseParamsView, ViewParams>({
      query: ({ id }) => ({
        method: 'get',
        path: ApiEndpoints.view_stores + id
      })
    }),
    loadCountryDetails: builder.mutation<CountryResponseParams, ViewParams>({
      query: (jsonData) => ({
        jsonData,
        method: 'post',
        path: ApiEndpoints.get_countries
      })
    }),
    loadStoreSubStoreDetailsByParentId: builder.mutation<StoreResponseParams, ViewParams>({
      query: (a: any) => ({
        jsonData: a?.jsonData,
        params: { page: a?.page, per_page_record: a?.per_page_record },
        method: 'post',
        path: ApiEndpoints.store_substore_list + a?.id
      })
    }),
    deleteStoreById: builder.mutation<StoreResponseParams, ViewParams>({
      query: ({ id, originalArgs, jsonData }) => ({
        jsonData,
        method: !isValid(id) ? 'post' : 'delete',
        path: !isValid(id) ? ApiEndpoints.action_store : ApiEndpoints.delete_stores + id
      })
    }),
    storeProductSaleStats: builder.mutation<StoreResponseParams, ViewParams>({
      query: (a) => ({
        jsonData: a?.jsonData,
        method: 'post',
        path: ApiEndpoints.store_product_sales_stats
      })
    }),
    exportStoreReport: builder.mutation<any, any>({
      query: (jsonData) => ({
        jsonData,
        method: 'post',
        path: ApiEndpoints.download_summary_report
      })
    }),
    exportStoreOrderReturn: builder.mutation<any, any>({
      query: (jsonData) => ({
        jsonData,
        method: 'post',
        path: ApiEndpoints.exportReturnOrderDetails
      })
    }),
    exportStoreProductReport: builder.mutation<any, any>({
      query: (jsonData) => ({
        jsonData,
        method: 'post',
        path: ApiEndpoints.exportProducts
      })
    }),
    importStore: builder.mutation<any, any>({
      invalidatesTags: [{ type: 'Stores', id: 'NEXT-LIST' }],
      query: (formData) => ({
        formData,
        method: 'post',
        path: ApiEndpoints?.storesImport
      })
    }),
    orderReports: builder.mutation<any, any>({
      query: (a) => ({
        jsonData: a?.jsonData,
        method: 'post',
        path: ApiEndpoints.monthlyOrderGraph
      })
    }),
    productWiseRevenueReport: builder.mutation<any, any>({
      invalidatesTags: [{ type: 'Stores', id: 'NEXT-LIST' }],
      query: (a) => ({
        jsonData: a?.jsonData,
        method: 'post',
        path: ApiEndpoints.product_wise_revenue_report
      })
    }),
    singleProductWiseRevenueReport: builder.mutation<any, any>({
      invalidatesTags: [{ type: 'Stores', id: 'NEXT-LIST' }],
      query: (a) => ({
        jsonData: a?.jsonData,
        method: 'post',
        path: ApiEndpoints.single_product_revenue_report
      })
    })
  })
})
export const {
  useLoadParentStoresMutation,
  useLoadStoresQuery,
  useLoadActivityByIdMutation,
  useLoadActivityMutation,
  useLoginLogMutation,
  useCreateOrUpdateStoreMutation,
  useDeleteStoreByIdMutation,
  useLoadTrashedStoreMutation,
  useLoadStoreDetailsByIdMutation,
  useRestoreStoreMutation,
  useLoadCountryDetailsMutation,
  useStoreReportsMutation,
  useLoadStoreSubStoreDetailsByParentIdMutation,
  useUpdateProfileMutation,
  useRevenueReportMutation,
  useCurrencyWiseReportsMutation,
  useTopAndLeastStoresMutation,
  useStoreProductSaleStatsMutation,
  useLoadGateKeeperActivityMutation,
  useDownloadZipFileMutation,
  useExportStoreReportMutation,
  useExportStoreOrderReturnMutation,
  useExportStoreProductReportMutation,
  useImportStoreMutation,
  useOrderReportsMutation,
  useProductWiseRevenueReportMutation,
  useSingleProductWiseRevenueReportMutation
} = StoreManagement
