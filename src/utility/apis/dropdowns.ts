import http from '../http/useHttp'

export interface dataTypes {
  async?: boolean
  jsonData?: any
  path?: any
  id?: string | number
  method?: string
  page?: string | number
  perPage?: string | number
  formData?: any
  dispatch?: (e: any) => void
  success?: (e: any) => void
  loading?: (e: boolean) => void
  modifyDropdownData?: (e: any) => void
}
export const loadDropdown = async ({
  async = false,
  jsonData,
  formData,
  loading,
  page,
  perPage,
  path,
  method = 'post',
  success = () => {},
  modifyDropdownData = () => {}
}: dataTypes) => {
  return http.request({
    async,
    method,
    path,
    jsonData,
    loading,
    params: { ...formData, page, per_page_record: perPage },
    success: (e: any) => {
      success(modifyDropdownData(e))
    },
    error: () => {}
  })
}

export const getLoadDropdown = async ({
  async = false,
  jsonData,
  formData,
  loading,
  page,
  perPage,
  path,
  method = 'get',
  success = () => {},
  modifyDropdownData = () => {}
}: dataTypes) => {
  return http.request({
    async,
    method,
    path,
    jsonData,
    loading,
    params: { ...formData, page, per_page_record: perPage },
    success: (e: any) => {
      success(modifyDropdownData(e))
    },
    error: () => {}
  })
}
