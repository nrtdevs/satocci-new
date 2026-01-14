/* eslint-disable no-confusing-arrow */
// ** Redux Imports
import { createApi } from '@reduxjs/toolkit/query/react'
import { isValid } from '../../utility/helpers/common'
import ApiEndpoints from '../../utility/http/ApiEndpoints'
import { axiosBaseQuery } from '../../utility/http/Http'
import {
  RequestParamsWithPagePerPage,
  ResponseParamsType,
  ResponseParamsTypeWithPagination,
  ViewParams
} from '../../utility/http/httpConfig'
import { ProductParamsNew } from '../../views/ProductManagement/fragment/ProductForm'

interface extraParams {
  jsonData?: any
  id?: any
  user_id?: any
  store_id?: any
}

export type OrdersParams = {
  order_rating?: any
  id?: any
  order_number?: any
  order_details_count?: any
  order_barcode_image?: any
  customer_rating?: any
  coupon_code?: any
  store_id?: any
  store?: any
  order_id?: any
  quantity?: any
  price?: any
  user_id?: any
  discount_value?: any
  transaction_id?: any
  discount_price?: any
  currency?: any
  total_amount?: any
  vat_percent?: any
  vat_amount?: any
  coupon?: any
  coupon_discount?: any
  paid_amount?: any
  payment_method?: any
  order_details?: any
  card_number?: any
  payment_status?: any
  status?: any
  entry_mode?: any
  created_at?: any
  user?: any
  updated_at?: any
  order?: any
  order_item_returns?: any
  total_return_amount?: any
  return_valid_till?: any
  return_initiated?: any
  refund_amount?: any

  // [
  //     {
  //       id: 1
  //       order_id: 1
  //       product_variant_id: 45
  //       product_info: '{"id":45,"unique_id":"4529115886","store_id":2,"category_id":1,"subcategory_id":3,"categories":"[1,2,3]","name":"product name","description":"description","product_image":"http:\\/\\/example.com\\/image_2.jpg","status":1,"created_at":"2022-12-07T13:09:57.000000Z","updated_at":"2022-12-07T13:09:57.000000Z","deleted_at":null}'
  //       variant_info: '{"id":45,"store_id":2,"product_id":45,"variant_token":"1557289168639090a6009db","name":"product name","product_image":null,"sku":"3892789213","expiry":null,"adjustment_type":null,"quantity":100,"purchase_price":25,"max_retail_price":40,"selling_price":35,"product_type":"2","unit_type":"kg","status":1,"entry_mode":"Web","created_at":"2022-12-07T13:09:58.000000Z","updated_at":"2022-12-07T13:09:58.000000Z","deleted_at":null,"product":{"id":45,"unique_id":"4529115886","store_id":2,"category_id":1,"subcategory_id":3,"categories":"[1,2,3]","name":"product name","description":"description","product_image":"http:\\/\\/example.com\\/image_2.jpg","status":1,"created_at":"2022-12-07T13:09:57.000000Z","updated_at":"2022-12-07T13:09:57.000000Z","deleted_at":null}}'
  //       barcode_info: '[]'
  //       offer_info: '[]'
  //       quantity: '1.00'
  //       price: 35
  //       offer_type: null
  //       offer_value: null
  //       offered_product_id: null
  //       discount_value: null
  //       discounted_price: 35
  //       created_at: '2022-12-08T06:55:26.000000Z'
  //       updated_at: '2022-12-08T06:55:26.000000Z'
  //     },
  //     {
  //       id: 2
  //       order_id: 1
  //       product_variant_id: 46
  //       product_info: '{"id":45,"unique_id":"4529115886","store_id":2,"category_id":1,"subcategory_id":3,"categories":"[1,2,3]","name":"product name","description":"description","product_image":"http:\\/\\/example.com\\/image_2.jpg","status":1,"created_at":"2022-12-07T13:09:57.000000Z","updated_at":"2022-12-07T13:09:57.000000Z","deleted_at":null}'
  //       variant_info: '{"id":46,"store_id":2,"product_id":45,"variant_token":"2146386940639090a6017f0","name":"product name","product_image":null,"sku":"132564879","expiry":"2022-12-21","adjustment_type":"initial_stock","quantity":45,"purchase_price":120,"max_retail_price":150,"selling_price":135,"product_type":"1","unit_type":"nos","status":1,"entry_mode":"Web","created_at":"2022-12-07T13:09:58.000000Z","updated_at":"2022-12-07T13:09:58.000000Z","deleted_at":null,"product":{"id":45,"unique_id":"4529115886","store_id":2,"category_id":1,"subcategory_id":3,"categories":"[1,2,3]","name":"product name","description":"description","product_image":"http:\\/\\/example.com\\/image_2.jpg","status":1,"created_at":"2022-12-07T13:09:57.000000Z","updated_at":"2022-12-07T13:09:57.000000Z","deleted_at":null}}'
  //       barcode_info: '[{"id":57,"store_id":2,"product_variant_id":46,"bar_code":"87915387879","bar_code_image":"uploads\\/barcode\\/87915387879.png","status":1,"created_at":"2022-12-07T13:09:58.000000Z","updated_at":"2022-12-07T13:09:58.000000Z","deleted_at":null},{"id":58,"store_id":2,"product_variant_id":46,"bar_code":"321546879153","bar_code_image":"uploads\\/barcode\\/321546879153.png","status":1,"created_at":"2022-12-07T13:09:58.000000Z","updated_at":"2022-12-07T13:09:58.000000Z","deleted_at":null}]'
  //       offer_info: '[{"id":3,"store_id":2,"product_variant_id":46,"category_id":null,"purchase_quantity":2,"offer_type":"1","offer_value":50,"offered_product_variant_id":null,"offered_product_discount":0,"offer_valid_from":"2022-06-01","offer_valid_to":"2023-06-01","offer_image":null,"status":1,"created_at":"2022-12-07T13:09:58.000000Z","updated_at":"2022-12-07T13:09:58.000000Z","deleted_at":null},{"id":4,"store_id":2,"product_variant_id":46,"category_id":null,"purchase_quantity":3,"offer_type":"2","offer_value":30,"offered_product_variant_id":null,"offered_product_discount":0,"offer_valid_from":"2022-06-01","offer_valid_to":"2023-06-01","offer_image":null,"status":1,"created_at":"2022-12-07T13:09:58.000000Z","updated_at":"2022-12-07T13:09:58.000000Z","deleted_at":null},{"id":5,"store_id":2,"product_variant_id":46,"category_id":null,"purchase_quantity":4,"offer_type":"3","offer_value":1,"offered_product_variant_id":45,"offered_product_discount":0,"offer_valid_from":"2022-06-01","offer_valid_to":"2023-06-01","offer_image":null,"status":1,"created_at":"2022-12-07T13:09:58.000000Z","updated_at":"2022-12-07T13:09:58.000000Z","deleted_at":null},{"id":6,"store_id":2,"product_variant_id":46,"category_id":null,"purchase_quantity":5,"offer_type":"3","offer_value":1,"offered_product_variant_id":1,"offered_product_discount":0,"offer_valid_from":"2022-06-01","offer_valid_to":"2023-06-01","offer_image":null,"status":1,"created_at":"2022-12-07T13:09:58.000000Z","updated_at":"2022-12-07T13:09:58.000000Z","deleted_at":null}]'
  //       quantity: '2.00'
  //       price: 270
  //       offer_type: null
  //       offer_value: null
  //       offered_product_id: null
  //       discount_value: null
  //       discounted_price: 270
  //       created_at: '2022-12-08T06:55:26.000000Z'
  //       updated_at: '2022-12-08T06:55:26.000000Z'
  //     }
  //   ]
}

type ListRequestParams = RequestParamsWithPagePerPage & extraParams
type ResponseParams = ResponseParamsTypeWithPagination<OrdersParams>
type ResDetails = ResponseParamsType<OrdersParams>

export const OrderManagement = createApi({
  reducerPath: 'OrderManagement',
  tagTypes: ['Orders'],
  baseQuery: axiosBaseQuery(),
  endpoints: (builder) => ({
    loadOrders: builder.mutation<ResponseParams, ListRequestParams>({
      query: (a) => ({
        jsonData: a?.jsonData,
        params: { page: a?.page, per_page_record: a?.per_page_record },
        method: 'post',
        path: ApiEndpoints.listOrders
      })
    }),

    loadOrdersRating: builder.mutation<ResponseParams, ListRequestParams>({
      query: (a) => ({
        jsonData: a?.jsonData,
        params: { page: a?.page, per_page_record: a?.per_page_record },
        method: 'post',
        path: ApiEndpoints.orderRating
      })
    }),
    orderDetailsWithId: builder.mutation<ResDetails, ViewParams>({
      query: (a) => ({
        jsonData: a?.jsonData,
        params: { page: a?.page, per_page_record: a?.per_page_record },
        method: 'get',
        path: ApiEndpoints.detailsOrder + a?.id
      })
    }),
    adminOrderDetailsWithId: builder.mutation<ResDetails, ViewParams>({
      query: (a) => ({
        jsonData: a?.jsonData,
        params: { page: a?.page, per_page_record: a?.per_page_record },
        method: 'get',
        path: ApiEndpoints.adminGetOrderInfo + a?.id
      })
    }),

    storeInvoiceWithId: builder.mutation<ResDetails, ViewParams>({
      query: (a) => ({
        jsonData: a?.jsonData,
        params: { page: a?.page, per_page_record: a?.per_page_record },
        method: 'get',
        path: ApiEndpoints.generateInvoiceStore + a?.id
      })
    }),
    createOrUpdateOrders: builder.mutation<ResponseParams, ProductParamsNew>({
      query: (jsonData) => ({
        jsonData,
        method: 'post',
        path: isValid(jsonData?.id)
          ? ApiEndpoints?.orderPaymentStatusUpdate + jsonData?.id
          : ApiEndpoints?.createOrder
      }),
      invalidatesTags: ['Orders']
    }),
    resentInvoice: builder.mutation<ResponseParams, ViewParams>({
      query: ({ id, originalArgs, jsonData }) => ({
        jsonData,
        method: 'get',
        path: ApiEndpoints.resentInvoice + id
      })
    }),

    createStripeIntent: builder.mutation<ResponseParams, ProductParamsNew>({
      query: (jsonData) => ({
        jsonData,
        method: 'post',
        path: ApiEndpoints?.createStripeIntent
      }),
      invalidatesTags: ['Orders']
    })

    ///ProductOffers
  })
})
export const {
  useLoadOrdersMutation,
  useCreateOrUpdateOrdersMutation,
  useStoreInvoiceWithIdMutation,
  useResentInvoiceMutation,
  useAdminOrderDetailsWithIdMutation,
  useLoadOrdersRatingMutation,
  useCreateStripeIntentMutation,
  useOrderDetailsWithIdMutation
} = OrderManagement
