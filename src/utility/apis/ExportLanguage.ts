import { languageLoad } from '../../redux/reducers/Language'
import ApiEndpoints from '../http/ApiEndpoints'
import http from '../http/useHttp'
interface dataTypes {
  async?: boolean
  jsonData?: any

  id?: string | number | null
  page?: string | number
  perPage?: string | number
  dispatch?: (e: any) => void
  success?: (e: any) => void
  loading?: (e: boolean) => void
}
export const ExportSample = async ({
  async = false,
  jsonData,
  loading,
  page,
  perPage,
  dispatch = () => {},
  success = () => {}
}: dataTypes) => {
  return http.request({
    async,
    method: 'post',
    path: ApiEndpoints.label_export,
    jsonData,
    loading,
    params: { page, per_page_record: perPage },
    success: (e: any) => {
      success(e)
    },
    error: () => {
      /** ErrorToast("data-fetch-failed") **/
    }
  })
}

export const bulkReferralSampleFile = async ({
  async = false,
  jsonData,
  loading,
  page,
  perPage,
  dispatch = () => {},
  success = () => {}
}: dataTypes) => {
  return http.request({
    async,
    method: 'get',
    path: ApiEndpoints.bulk_referral_sample_file,
    jsonData,
    loading,
    params: { page, per_page_record: perPage },
    success: (e: any) => {
      success(e)
    },
    error: () => {
      /** ErrorToast("data-fetch-failed") **/
    }
  })
}

export const ExportOrders = async ({
  async = false,
  jsonData,
  loading,
  page,
  perPage,
  dispatch = () => {},
  success = () => {}
}: dataTypes) => {
  return http.request({
    async,
    method: 'post',
    path: ApiEndpoints.exportOrders,
    jsonData,
    loading,
    params: { page, per_page_record: perPage },
    success: (e: any) => {
      success(e)
    },
    error: () => {
      /** ErrorToast("data-fetch-failed") **/
    }
  })
}

export const ExportOrdersWithProduct = async ({
  async = false,
  jsonData,
  loading,
  page,
  perPage,
  dispatch = () => {},
  success = () => {}
}: dataTypes) => {
  return http.request({
    async,
    method: 'post',
    path: ApiEndpoints.exportOrdersWithProducts,
    loading,
    jsonData,
    params: { page, per_page_record: perPage },
    success: (e: any) => {
      success(e)
    },
    error: () => {
      /** ErrorToast("data-fetch-failed") **/
    }
  })
}

export const ExportStoreCustomer = async ({
  async = false,
  jsonData,
  loading,
  page,
  perPage,
  dispatch = () => {},
  success = () => {}
}: dataTypes) => {
  return http.request({
    async,
    method: 'get',
    path: ApiEndpoints.exportStoreCustomer,
    jsonData,
    loading,
    params: { page, per_page_record: perPage },
    success: (e: any) => {
      success(e)
    },
    error: () => {
      /** ErrorToast("data-fetch-failed") **/
    }
  })
}
export const downloadStoreInvoice = async ({
  async = false,
  id = null,
  jsonData,
  loading,

  page,
  perPage,
  dispatch = () => {},
  success = () => {}
}: dataTypes) => {
  return http.request({
    async,
    method: 'get',
    path: ApiEndpoints.storeOrderInvoice + id,
    // jsonData,
    loading,
    params: { lang: jsonData?.lang },
    success: (e: any) => {
      success(e)
    },
    error: () => {
      /** ErrorToast("data-fetch-failed") **/
    }
  })
}
export const categorySample = async ({
  async = false,
  jsonData,
  loading,
  page,
  perPage,
  dispatch = () => {},
  success = () => {}
}: dataTypes) => {
  return http.request({
    async,
    method: 'get',
    path: ApiEndpoints.category_sample_file,
    jsonData,
    loading,
    params: { page, per_page_record: perPage },
    success: (e: any) => {
      success(e)
    },
    error: () => {
      /** ErrorToast("data-fetch-failed") **/
    }
  })
}

export const productSample = async ({
  async = false,
  jsonData,
  loading,
  page,
  perPage,
  dispatch = () => {},
  success = () => {}
}: dataTypes) => {
  return http.request({
    async,
    method: 'get',
    path: ApiEndpoints.sampleFileExport,
    jsonData,
    loading,
    params: { page, per_page_record: perPage },
    success: (e: any) => {
      success(e)
    },
    error: () => {
      /** ErrorToast("data-fetch-failed") **/
    }
  })
}

export const storeSample = async ({
  async = false,
  jsonData,
  loading,
  page,
  perPage,
  dispatch = () => {},
  success = () => {}
}: dataTypes) => {
  return http.request({
    async,
    method: 'get',
    path: ApiEndpoints.storeSampleExport,
    jsonData,
    loading,
    params: { page, per_page_record: perPage },
    success: (e: any) => {
      success(e)
    },
    error: () => {
      /** ErrorToast("data-fetch-failed") **/
    }
  })
}

export const bacodeSampleDownload = async ({
  async = false,
  jsonData,
  loading,
  page,
  perPage,
  dispatch = () => {},
  success = () => {}
}: dataTypes) => {
  return http.request({
    async,
    method: 'get',
    path: ApiEndpoints.import_multiple_barcode_sample,
    jsonData,
    loading,
    params: { page, per_page_record: perPage },
    success: (e: any) => {
      success(e)
    },
    error: () => {
      /** ErrorToast("data-fetch-failed") **/
    }
  })
}

export const ImportLabel = async ({
  async = false,
  jsonData,
  loading,
  page,
  perPage,
  dispatch = () => {},
  success = () => {}
}: dataTypes) => {
  return http.request({
    async,
    method: 'post',
    path: ApiEndpoints.label_import,
    jsonData,
    loading,
    params: { page, per_page_record: perPage },
    success: (e: any) => {
      success(e)
    },
    error: () => {
      /** ErrorToast("data-fetch-failed") **/
    }
  })
}

export const LoadDataAEs = async ({
  async = false,
  jsonData,
  loading,
  page,
  perPage,
  dispatch = () => {},
  success = () => {}
}: dataTypes) => {
  return http.request({
    async,
    method: 'get',
    path: ApiEndpoints.test,
    jsonData,
    loading,
    params: { page, per_page_record: perPage },
    success: (e: any) => {
      success(e)
    },
    error: (e) => {
      success(e)

      /** ErrorToast("data-fetch-failed") **/
    }
  })
}

export const loadLanguageList = async ({
  id = '',
  async = false,
  jsonData,
  loading,
  page = 1,
  perPage = 200,
  dispatch = () => {},
  success = () => {}
}: dataTypes) => {
  return http.request({
    async,
    method: 'get',
    path:
      jsonData?.store === true ? ApiEndpoints.language_list_store + id : ApiEndpoints.language_list,
    jsonData,
    loading,
    params: { page: 1, per_page_record: 200 },
    success: (e: any) => {
      success(e)
    },
    error: (e) => {
      success(e)
      dispatch(languageLoad(e?.payload?.data))
      /** ErrorToast("data-fetch-failed") **/
    }
  })
}
