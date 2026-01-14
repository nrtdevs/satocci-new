/* eslint-disable no-confusing-arrow */
// ** Redux Imports
import { createApi } from '@reduxjs/toolkit/query/react'
import { isValid, isValidArray, log } from '../../utility/helpers/common'
import ApiEndpoints from '../../utility/http/ApiEndpoints'
import { axiosBaseQuery } from '../../utility/http/Http'
import {
  RequestParamsWithPagePerPage,
  ResponseParamsType,
  ResponseParamsTypeWithPagination,
  ViewParams
} from '../../utility/http/httpConfig'
import { OpenBarcode } from '../../views/ProductManagement/BarcodeGenerate'
import {
  ProductOfferType,
  ProductParamsNew,
  ProductVariantsType
} from '../../views/ProductManagement/fragment/ProductForm'
import { TransactionProps } from '../../views/ProductManagement/fragment/Tabs/TransactionsList'

interface extraParams {
  jsonData?: any
  id?: any
  least?: any
}
type ListRequestParams = (RequestParamsWithPagePerPage & extraParams) | undefined
type ResponseParams = ResponseParamsTypeWithPagination<ProductParamsNew>
type ResponseParamsVariants = ResponseParamsTypeWithPagination<ProductVariantsType>
type ResponseParamsTrans = ResponseParamsTypeWithPagination<TransactionProps>
type ResponseParamsOffer = ResponseParamsTypeWithPagination<ProductOfferType>
type ResponseParamsDetails = ResponseParamsType<ProductParamsNew>
type ResponseParamsVariantDetails = ResponseParamsType<ProductVariantsType>
type ResponseParamsVariantOpen = ResponseParamsType<ProductVariantsType[]>
type ResponseParamsVariantOpenBarcode = ResponseParamsType<OpenBarcode[]>
type Open = {
  product_variant_id: string | number
  quantity: string | number
  weight_unit: string | number
  vat: string | number
  vat_type: string | number
  product_price: string | number
}

export const ProductManagement = createApi({
  reducerPath: 'ProductManagement',
  tagTypes: ['Product', 'Offer'],
  baseQuery: axiosBaseQuery(),
  endpoints: (builder) => ({
    loadProduct: builder.query<ResponseParams, ListRequestParams>({
      query: (a) => ({
        jsonData: a?.jsonData,
        params: { page: a?.page, per_page_record: a?.per_page_record },
        method: 'post',
        path: ApiEndpoints.load_product
      }),
      //   providesTags: ['Stores']
      providesTags: (result) => {
        let next = 'LIST'
        if (result?.payload?.current_page !== '1') {
          next = 'NEXT-LIST'
        }
        if (isValidArray(result?.payload?.data) && result) {
          const r =
            result.payload?.data?.map(({ id }: ProductParamsNew) => ({
              type: 'Product' as const,
              id: id ?? 'LIST'
            })) ?? []
          return [...r, { type: 'Product', id: next }]
        } else {
          return [{ type: 'Product', id: next }]
        }
      }
    }),

    loadProductByMutation: builder.mutation<ResponseParams, ListRequestParams>({
      query: (a) => ({
        jsonData: a?.jsonData,
        params: { page: a?.page, per_page_record: a?.per_page_record },
        method: 'post',
        path: ApiEndpoints.load_product
      })
    }),
    loadProductTransactionByMutation: builder.mutation<ResponseParams, ListRequestParams>({
      query: (a) => ({
        jsonData: a?.jsonData,
        params: { page: a?.page, per_page_record: a?.per_page_record },
        method: 'post',
        path: ApiEndpoints.transaction_by_product
      })
    }),
    loadProductVariants: builder.mutation<ResponseParamsVariants, ListRequestParams>({
      query: (a) => ({
        jsonData: a?.jsonData,
        params: { page: a?.page, per_page_record: a?.per_page_record },
        method: 'post',
        path: ApiEndpoints.load_product_variant + a?.id
      })
    }),
    loadProductTransactions: builder.mutation<ResponseParamsTrans, ListRequestParams>({
      query: (a) => ({
        jsonData: a?.jsonData,
        params: { page: a?.page, per_page_record: a?.per_page_record },
        method: 'post',
        path: ApiEndpoints.transaction_by_product
      })
    }),
    loadProductTrashed: builder.query<ResponseParams, ListRequestParams>({
      query: (a) => ({
        jsonData: a?.jsonData,
        params: { page: a?.page, per_page_record: a?.per_page_record },
        method: 'post',
        path: ApiEndpoints.trashed_product_list
      }),
      //   providesTags: ['Stores']
      providesTags: (result) => {
        let next = 'LIST'
        if (result?.payload?.current_page !== '1') {
          next = 'NEXT-LIST'
        }
        if (isValidArray(result?.payload?.data) && result) {
          const r =
            result.payload?.data?.map(({ id }: ProductParamsNew) => ({
              type: 'Product' as const,
              id: id ?? 'LIST'
            })) ?? []
          return [...r, { type: 'Product', id: next }]
        } else {
          return [{ type: 'Product', id: next }]
        }
      }
    }),
    restoreProduct: builder.mutation<ResponseParams, ProductParamsNew>({
      invalidatesTags: [{ type: 'Product', id: 'NEXT-LIST' }],
      query: (jsonData) => ({
        method: 'post',
        path: isValid(jsonData?.id) ? ApiEndpoints.restore_product + jsonData?.id : 'id not found'
      })
    }),
    importProduct: builder.mutation<any, any>({
      invalidatesTags: [{ type: 'Product', id: 'NEXT-LIST' }],
      query: (formData) => ({
        formData,
        method: 'post',
        path: ApiEndpoints?.import_product
      })
    }),
    importMultipleBarcode: builder.mutation<any, any>({
      invalidatesTags: [{ type: 'Product', id: 'NEXT-LIST' }],
      query: (formData) => ({
        formData,
        method: 'post',
        // params: formData?.params,
        path: ApiEndpoints?.import_multiple_barcode
      })
    }),
    createOrUpdateProduct: builder.mutation<ResponseParams, ProductParamsNew>({
      query: (jsonData) => ({
        jsonData,
        showErrorToast: true,
        showSuccessToast: true,
        method: isValid(jsonData?.id) ? (isValid(jsonData?.variantId) ? 'put' : 'patch') : 'post',
        path: isValid(jsonData?.id)
          ? isValid(jsonData?.variantId)
            ? ApiEndpoints?.update_product_variant + jsonData?.id
            : ApiEndpoints?.edit_product + jsonData?.id
          : isValid(jsonData?.productId)
          ? ApiEndpoints.add_variant
          : ApiEndpoints.add_product
      }),
      invalidatesTags: ['Product']
    }),

    loadProductById: builder.query<ResponseParams, ViewParams>({
      query: ({ id }) => ({
        method: 'get',
        path: ApiEndpoints.view_product + id
      })
    }),
    loadProductDetailsById: builder.mutation<ResponseParamsDetails, ViewParams>({
      query: ({ id }) => ({
        method: 'get',
        path: ApiEndpoints.view_product + id
      })
    }),
    loadProductVariantDetailsById: builder.mutation<ResponseParamsVariantDetails, ViewParams>({
      query: (a) => ({
        params: { store_id: a?.store_id },
        method: 'get',
        path: ApiEndpoints.load_product_variant_view + a?.id
      })
    }),
    deleteProductById: builder.mutation<ResponseParams, ViewParams>({
      query: ({ id, originalArgs, jsonData }) => ({
        jsonData,
        method: !isValid(id) ? 'post' : 'delete',
        path: !isValid(id) ? ApiEndpoints.action_product : ApiEndpoints.delete_product + id
      }),
      async onQueryStarted({ id, originalArgs, ...patch }, { dispatch, queryFulfilled, getState }) {
        try {
          const { data: updatedPost } = await queryFulfilled

          const {
            ProductManagement: { queries }
          } = getState()
        } catch (e) {
          log('failed', e)
        }
      }
    }),
    deleteProductVariantById: builder.mutation<ResponseParams, ViewParams>({
      query: ({ id, originalArgs, jsonData }) => ({
        jsonData,
        method: !isValid(id) ? 'post' : 'delete',
        path: !isValid(id) ? ApiEndpoints.action_variant : ApiEndpoints.delete_product_variant + id
      })
    }),
    ///Product Offers
    createOrUpdateProductOffer: builder.mutation<ResponseParamsOffer, ProductOfferType>({
      query: (jsonData) => ({
        jsonData,
        method: isValid(jsonData?.id) ? 'patch' : 'post',
        path: isValid(jsonData?.id)
          ? ApiEndpoints?.editProductOffer + jsonData?.id
          : ApiEndpoints.addProductOffer
      }),
      invalidatesTags: ['Offer']
    }),
    actionProductOffer: builder.mutation<ResponseParamsOffer, ViewParams>({
      query: ({ jsonData }) => ({
        jsonData,
        method: 'post',
        path: ApiEndpoints.action_offer
      })
    }),
    loadProductOffers: builder.mutation<ResponseParamsOffer, ViewParams>({
      query: (a) => ({
        jsonData: a?.jsonData,
        params: { page: a?.page, per_page_record: a?.per_page_record },
        method: 'post',
        path: ApiEndpoints.listProductOffer
      }),
      invalidatesTags: ['Offer']
    }),

    ////product reports
    topAndLeastSellingProducts: builder.mutation<ResponseParamsOffer, ListRequestParams>({
      query: (a) => ({
        jsonData: a?.jsonData,
        params: { page: a?.page, per_page_record: a?.per_page_record },
        method: 'post',
        path:
          a?.least === 1 ? ApiEndpoints.least_selling_products : ApiEndpoints.top_selling_products
      }),
      invalidatesTags: ['Offer']
    }),
    ///ProductOffers
    loadOpenProducts: builder.mutation<ResponseParamsVariantOpen, any>({
      query: (a) => ({
        jsonData: a?.jsonData,
        params: { page: a?.page, per_page_record: a?.per_page_record },
        method: 'post',
        path: ApiEndpoints.openVar
      })
    }),
    loadOpenProductsRecent: builder.mutation<ResponseParamsVariantOpenBarcode, any>({
      query: (a) => ({
        jsonData: a?.jsonData,
        params: { page: a?.page, per_page_record: a?.per_page_record },
        method: 'post',
        path: ApiEndpoints.openVarBar
      })
    }),
    addOpenProductBarcode: builder.mutation<ResponseParamsVariantOpen, Open>({
      query: (a) => ({
        jsonData: a,
        method: 'post',
        path: ApiEndpoints.addOpenBarcodes
      })
    }),
    /// Product Stats
    productSaleStats: builder.mutation<ResponseParamsOffer, ListRequestParams>({
      query: (a) => ({
        jsonData: a?.jsonData,
        method: 'post',
        path: ApiEndpoints.product_sale_stats
      }),
      invalidatesTags: ['Offer']
    }),

    productSaleStatsMonthly: builder.mutation<ResponseParamsOffer, ListRequestParams>({
      query: (a) => ({
        jsonData: a?.jsonData,
        method: 'post',
        path: ApiEndpoints.product_sale_stats_month
      }),
      invalidatesTags: ['Offer']
    }),
    transactionWiseReport: builder.mutation<ResponseParamsOffer, ListRequestParams>({
      query: (a) => ({
        jsonData: a?.jsonData,
        params: { page: a?.page, per_page_record: a?.per_page_record },
        method: 'post',
        path: ApiEndpoints.transaction_wise_report
      }),
      invalidatesTags: ['Offer']
    }),
    productWiseTransaction: builder.mutation<ResponseParamsOffer, ListRequestParams>({
      query: (a) => ({
        jsonData: a?.jsonData,
        params: { page: a?.page, per_page_record: a?.per_page_record },
        method: 'post',
        path: ApiEndpoints.product_wise_transaction
      })
    }),
    getUnits: builder.mutation<any, any>({
      query: (a) => ({
        jsonData: a?.jsonData,
        params: { language_id: a, page: a?.page, per_page_record: a?.per_page_record },
        method: 'get',
        path: ApiEndpoints.get_units
      })
    }),

    exportProducts: builder.mutation<any, any>({
      query: (a) => ({
        jsonData: a?.jsonData,
        params: { page: a?.page, per_page_record: a?.per_page_record },
        method: 'post',
        path: ApiEndpoints.export_products
      })
    }),
    printProductBarcodeWithDetails: builder.mutation<any, any>({
      query: (a) => ({
        jsonData: a?.jsonData,
        params: {
          page: a?.page,
          per_page_record: a?.per_page_record
        },
        method: 'post',
        path: ApiEndpoints.print_product_barcode_with_details
      })
    }),
    createProductOffer: builder.mutation<ResponseParamsOffer, ProductOfferType>({
      query: (jsonData) => ({
        jsonData,
        method: isValid(jsonData?.id) ? 'patch' : 'post',
        path: isValid(jsonData?.id)
          ? ApiEndpoints?.editProductOffer + jsonData?.id
          : ApiEndpoints.product_offer_bulk
      }),
      invalidatesTags: ['Offer']
    })
  })
})
export const {
  useCreateOrUpdateProductMutation,
  useLoadProductByIdQuery,
  useLoadProductQuery,
  useLoadProductByMutationMutation,
  useDeleteProductByIdMutation,
  useLoadProductDetailsByIdMutation,
  useLoadProductTrashedQuery,
  useRestoreProductMutation,
  useImportProductMutation,
  useImportMultipleBarcodeMutation,
  useLoadProductTransactionsMutation,
  useCreateOrUpdateProductOfferMutation,
  useLoadProductOffersMutation,
  useLoadProductVariantsMutation,
  useLoadProductVariantDetailsByIdMutation,
  useDeleteProductVariantByIdMutation,
  useActionProductOfferMutation,
  useLoadProductTransactionByMutationMutation,
  useTopAndLeastSellingProductsMutation,
  useLoadOpenProductsMutation,
  useProductSaleStatsMutation,
  useProductSaleStatsMonthlyMutation,
  useAddOpenProductBarcodeMutation,
  useProductWiseTransactionMutation,
  useTransactionWiseReportMutation,
  useLoadOpenProductsRecentMutation,
  useGetUnitsMutation,
  usePrintProductBarcodeWithDetailsMutation,
  useExportProductsMutation,
  useCreateProductOfferMutation
} = ProductManagement
