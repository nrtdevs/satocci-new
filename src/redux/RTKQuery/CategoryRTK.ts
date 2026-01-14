import { createApi } from '@reduxjs/toolkit/query/react'
import { isValid, isValidArray } from '../../utility/helpers/common'
import ApiEndpoints from '../../utility/http/ApiEndpoints'
import { axiosBaseQuery } from '../../utility/http/Http'
import {
  RequestParamsWithPagePerPage,
  RequestParamsWithParentId,
  ResponseParamsType,
  ResponseParamsTypeWithPagination,
  ViewParams
} from '../../utility/http/httpConfig'
import { ProductOfferType } from '../../views/ProductManagement/fragment/ProductForm'
import { CategoryParamsType } from '../../views/stores/category/CategoryAddForm'

interface extraParams {
  jsonData?: any
  id?: any
}

type ListRequestParams = RequestParamsWithPagePerPage & extraParams
type ListParentParams = RequestParamsWithParentId & extraParams
type ResponseParams = ResponseParamsTypeWithPagination<CategoryParamsType>
type ResponseOfferParams = ResponseParamsType<ProductOfferType>
type CatsParams = ResponseParamsType<Array<CategoryParamsType>>
type CatsParam = ResponseParamsType<CategoryParamsType>

export const CategoryManagement = createApi({
  reducerPath: 'CategoryManagement',
  tagTypes: ['Categories', 'SubCategory'],
  baseQuery: axiosBaseQuery(),
  endpoints: (builder) => ({
    loadCategory: builder.mutation<ResponseParams, ListRequestParams>({
      query: ({ page, per_page_record, jsonData }) => ({
        // jsonData,
        params: { page, per_page_record, name: jsonData?.name },
        method: 'get',
        path: ApiEndpoints.load_category
      })
    }),
    loadCategoryMutation: builder.mutation<ResponseParams, ViewParams>({
      query: (a: any) => ({
        jsonData: a?.jsonData,
        params: { page: a?.page, per_page_record: a?.per_page_record },
        method: 'get',
        path: ApiEndpoints.load_category
      })
    }),

    categoryImport: builder.mutation<any, any>({
      query: (formData) => ({
        formData,
        // params: { page: a?.page, per_page_record: a?.per_page_record },
        method: 'post',
        path: ApiEndpoints.categories_import
      })
    }),
    loadCategoryHierarchy: builder.mutation<CatsParams, ViewParams>({
      query: (a: any) => ({
        jsonData: a?.jsonData,
        // params: { page: a?.page, per_page_record: a?.per_page_record },
        method: 'post',
        path: ApiEndpoints.get_categories_subcategories
      })
    }),
    loadSubCategoryMutation: builder.mutation<ResponseParams, ListRequestParams>({
      query: (a: any) => ({
        jsonData: a?.jsonData,
        params: { page: a?.page, per_page_record: a?.per_page_record },
        method: 'post',
        path: ApiEndpoints.load_subcategory + a?.id
      })
    }),
    createOrUpdateCategory: builder.mutation<ResponseParams, CategoryParamsType>({
      query: (jsonData) => ({
        jsonData,
        method: isValid(jsonData?.id) ? 'patch' : 'post',
        path: isValid(jsonData?.id)
          ? ApiEndpoints?.edit_category + jsonData?.id
          : ApiEndpoints.add_category
      })
      // invalidatesTags: ['Categories']
    }),
    createOrUpdateCategoryOffer: builder.mutation<ResponseOfferParams, ProductOfferType>({
      query: (jsonData) => ({
        jsonData,
        method: isValid(jsonData?.id) ? 'patch' : 'post',
        path: isValid(jsonData?.id)
          ? ApiEndpoints?.editProductOffer + jsonData?.id
          : ApiEndpoints.addProductOffer
      })
      // invalidatesTags: ['Categories']
    }),
    loadCategoryById: builder.mutation<CatsParam, ViewParams>({
      query: ({ id }) => ({
        method: 'get',
        path: ApiEndpoints.view_category + id
      })
    }),
    loadSubcategoriesById: builder.query<ResponseParams, ListParentParams>({
      query: (a) => ({
        jsonData: a?.jsonData,
        params: { page: a?.page, per_page_record: a?.per_page_record },
        method: 'post',
        path: ApiEndpoints.load_subcategory + a?.id
      }),

      providesTags: (result) => {
        let next = 'LIST'
        if (result?.payload?.current_page !== '1') {
          next = 'NEXT-LIST'
        }
        if (isValidArray(result?.payload?.data) && result) {
          const r =
            result.payload?.data?.map(({ id }: CategoryParamsType) => ({
              type: 'SubCategory' as const,
              id: id ?? 'LIST'
            })) ?? []
          return [...r, { type: 'SubCategory', id: next }]
        } else {
          return [{ type: 'SubCategory', id: next }]
        }
      }
    }),
    deleteCategoryById: builder.mutation<ResponseParams, ViewParams>({
      invalidatesTags: ['Categories'],
      //   query: ({ id }) => ({
      //     method: 'delete',
      //     path: ApiEndpoints.delete_category + id
      //   })
      query: ({ id, originalArgs, jsonData }) => ({
        jsonData,
        method: !isValid(id) ? 'post' : 'delete',
        path: !isValid(id) ? ApiEndpoints.action_category : ApiEndpoints.delete_category + id
      })
    })
  })
})
export const {
  useCreateOrUpdateCategoryMutation,
  useLoadCategoryMutation,
  useDeleteCategoryByIdMutation,
  useLoadSubcategoriesByIdQuery,
  useLoadCategoryByIdMutation,
  useLoadCategoryMutationMutation,
  useLoadCategoryHierarchyMutation,
  useLoadSubCategoryMutationMutation,
  useCategoryImportMutation,
  useCreateOrUpdateCategoryOfferMutation
} = CategoryManagement
