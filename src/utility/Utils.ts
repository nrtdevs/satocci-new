import CryptoJS from 'crypto-js'
import moment from 'moment'
import toast from 'react-hot-toast'
import { GroupBase, OptionsOrGroups } from 'react-select'
import { FMKeys } from '../configs/i18n/FMTypes'
import { DefaultRoute } from '../router/routes/index'
import { Option } from '../views/components/formGroupCustom/FormGroupCustom'
import { Events, userProps } from './Const'
import Emitter from './Emitter'
import { isValid, isValidArray, log } from './helpers/common'
import httpConfig from './http/httpConfig'

export function getDescendantProp(obj: any, desc: any) {
  const arr = desc.split('.')
  while (arr.length && (obj = obj[arr.shift()]));
  return obj
}

// import { toast } from "react-toastify"
export const IsJsonString = (str: string) => {
  try {
    JSON?.parse(str)
  } catch (e) {
    return false
  }
  return true
}
export const JsonParseValidate = (data: any) => {
  if (data && IsJsonString(data)) {
    const json = JSON?.parse(data)
    if (typeof json === 'object') {
      return json
    } else {
      return null
    }
  } else {
    return null
  }
}
// ** Checks if an object is empty (returns boolean)
export const isObjEmpty = (obj: any) => Object.keys(obj).length === 0

// ** Returns K format from a number
export const kFormatter = (num: number) => (num > 999 ? `${(num / 1000).toFixed(1)}k` : num)

// ** Converts HTML to string
export const htmlToString = (html: any) => html.replace(/<\/?[^>]+(>|$)/g, '')

// ** Checks if the passed date is today
const isToday = (date: Date) => {
  const today = new Date()
  return (
    /* eslint-disable operator-linebreak */
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
    /* eslint-enable */
  )
}

/**
 ** Format and return date in Humanize format
 ** Intl docs: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat/format
 ** Intl Constructor: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat/DateTimeFormat
 * @param {String} value date to format
 * @param {Object} formatting Intl object to format with
 */
// export const formatDate = (value, formatting = { month: 'short', day: 'numeric', year: 'numeric' }) => {
//     if (!value) return value
//     return new Intl.DateTimeFormat('en-US', formatting).format(new Date(value))
// }
export const formatDate = (value: any, format = 'YYYY-MM-DD') => {
  const d = moment(value).format(format)
  if (d !== 'Invalid date') {
    return d
  } else {
    return ''
  }
}

export const emitAlertStatus = (
  e: 'success' | 'failed',
  payload: any | null = null,
  event: any = Events.confirmAlert
) => {
  log('event called', event, e)
  Emitter.emit(event, { type: e, payload: isValid(payload) ? payload : null })
}

let id = 0
export const getUniqId = (prefix: string) => {
  id++
  return `${prefix}-${id}`
}

/**
 ** Return if user is logged in
 ** This is completely up to you and how you want to store the token in your frontend application
 *  ? e.g. If you are using cookies to store the application please update this function
 */

export const isUserLoggedIn = () => localStorage.getItem('SatocciUserData')

export const getUserData = (): userProps =>
  JsonParseValidate(localStorage.getItem('SatocciUserData'))

export const loadLanguageId = () => {
  const la = localStorage.getItem('lang')
  const laa = JsonParseValidate(la)
  return laa
}
//export const getUserData = () => localStorage.getItem('SatocciUserData')
/**
 ** This function is used for demo purpose route navigation
 ** In real app you won't need this function because your app will navigate to same route for each users regardless of ability
 ** Please note role field is just for showing purpose it's not used by anything in frontend
 ** We are checking role just for ease
 * ? NOTE: If you have different pages to navigate based on user ability then this function can be useful. However, you need to update it.
 * @param {String} userRole Role of user
 */
export const getHomeRouteForLoggedInUser = (userRole: string) => {
  if (userRole === 'admin') return DefaultRoute
  if (userRole === 'client') return '/access-control'
  return '/authentication'
}

export const ErrorToast = (message: any, settings = {}, comp: any | null = null) => {
  toast.error(comp ?? message, settings)
}
// ** React Select Theme Colors
export const selectThemeColors = (theme: any) => ({
  ...theme,
  colors: {
    ...theme.colors,
    primary25: '#7367f01a', // for option hover bg-color
    primary: '#7367f0', // for selected option bg-color
    neutral10: '#7367f0', // for tags bg-color
    neutral20: '#d8d6de', // for input border-color
    neutral30: '#d8d6de' // for input hover border-color
  }
})

export const SuccessToast = (message: any, settings = {}, comp: any | null = null) => {
  toast.success(comp ?? message, settings)
}

export const getSelectValues = (val: any[] = [], matchWith: any | null = null) => {
  if (matchWith) {
    return val?.map((a) => a.value[matchWith])
  } else return val?.map((a) => a.value)
}

export const matchValue = (value: any, selected: any, matchWith: any) => {
  if (typeof value === 'object') {
    return String(value[matchWith]) === String(selected)
  } else {
    return String(value) === String(selected)
  }
}

export const makeSelectValues = (
  option: any[] = [],
  value: any[] = [],
  multi = false,
  matchWith: any | null = null,
  grouped = false,
  setOption = null
) => {
  try {
    let re = []
    if (!multi) {
      re = isValidArray(option) ? option?.find((c) => matchValue(c?.value, value, matchWith)) : []
      // log('matchWith', matchWith)
      // log(option, value)
    } else {
      if (value?.length > 0) {
        value?.forEach((v, i) => {
          let x = []
          if (grouped) {
            option?.forEach((q) => {
              if (isValid(q?.options?.find((a: any) => matchValue(a?.value, v, matchWith)))) {
                x = q?.options?.find((a: any) => matchValue(a?.value, v, matchWith))
              }
            })
          } else {
            x = option?.find((a) => matchValue(a?.value, v, matchWith))
          }
          // log("x", x)
          // log("option", option)
          if (x) re.push(x)
        })
      }
    }

    return re
  } catch (error) {
    //  log('makeSelectValues', error)
    // log(option, value)
    // log(matchWith, multi)
  }
}

// export const createConstSelectOptions = (
//   object: any[],
//   hide = (e: any) => {
//     return false
//   }
// ) => {
//   const data = []
//   for (const [key, value] of Object.entries(object)) {
//     if (!hide(value)) {
//       data.push({
//         label: key,
//         value
//       })
//     }
//   }
//   return data
// }
export const createConstSelectOptions = (
  object: any,
  FM = (e: any) => {},
  hide = (e: any) => {
    return false
  }
): OptionsOrGroups<Option, GroupBase<Option>> => {
  const data = []
  for (const [key, value] of Object.entries(object)) {
    if (!hide(value)) {
      data.push({
        label: FM(key),
        value
      })
    }
  }
  return data
}
export const createSelectOptions = (
  array: any[],
  label: string,
  value: any | null = null,
  icon = (e: any) => {}
) => {
  const data: any[] = []
  array?.forEach((option) => {
    data.push({
      label: getDescendantProp(option, label) ?? option[label],
      value: value ? getDescendantProp(option, value) ?? option[value] : option,
      extra: option,
      icon: icon(option)
    })
  })
  return data
}

// export function createSelectOptionParam<T>(
//   array: any[],
//   label: string,
//   value: any | null = null,
//   icon = (e: any) => {}
// ) {
//   const data: any[] = []
//   array.forEach((option) => {
//     data.push({
//       label: option[label],
//       value: value ? option[value] : option,
//       icon: icon(option)
//     })
//   })
//   return data
// }

export const toggleArray = (
  value?: any,
  array?: Array<any>,
  state = (e: any) => {},
  match = (e: any) => {
    return e === value
  }
) => {
  const index: any = array?.findIndex((e) => match(e))
  const finalArray: any = array
  if (index === -1) {
    finalArray?.push(value)
  } else {
    finalArray?.splice(index, 1)
  }
  // log(finalArray)
  // if (finalArray?.length === 0) {
  //     state(null)
  // } else {
  state([...finalArray])
  // }
}

export const createAsyncSelectOptions = (
  res: any,
  page: any,
  label: any,
  value: any,
  setOptions = (e: any) => {},
  icon = (e: any) => {}
) => {
  const response = res?.data?.payload
  let results: any = {}
  if (response?.data?.length > 0) {
    results = {
      ...response,
      data: createSelectOptions(response?.data, label, value, icon)
    }
    setOptions(results?.data)

    return {
      options: results?.data ?? [],
      hasMore: parseInt(results?.last_page) !== parseInt(results?.current_page),
      additional: {
        page: page + 1
      }
    }
  } else {
    return {
      options: [],
      hasMore: false
    }
  }
}

export const humanFileSize = (bytes: any, si = false, dp = 1) => {
  const thresh = si ? 1000 : 1024
  if (Math.abs(bytes) < thresh) {
    return `${bytes} B`
  }
  const units = si
    ? ['Kb', 'Mb', 'Gb', 'Tb', 'Pb', 'Eb', 'Zb', 'Yb']
    : ['KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
  let u = -1
  const r = 10 ** dp
  do {
    bytes /= thresh
    ++u
  } while (Math.round(Math.abs(bytes) * r) / r >= thresh && u < units.length - 1)
  return `${bytes.toFixed(dp)} ${units[u]}`
}

export const getFIleBinaries = (files = {}) => {
  const re: any = {}
  for (const [key, val] of Object.entries(files)) {
    re[`file[${key}]`] = val
  }
  return re
}

export function fastLoop<T = any>(array: T[] | undefined | null, change = (e: T, i: number) => {}) {
  if (isValidArray(array)) {
    const theArray = array ?? []
    const arrayLength = theArray.length
    let x = 0
    while (x < arrayLength) {
      const arr = theArray[x]
      change(arr, x)
      x++
    }
  }
}

export function getRandomInRange(from: any, to: any, fixed: any) {
  // eslint-disable-next-line no-mixed-operators
  return (Math.random() * (to - from) + from).toFixed(fixed)
  // .toFixed() returns string, so ' * 1' is a trick to convert to number
}

export function fillObject<T = any>(formData: T | undefined, data: T) {
  const re: any = {}
  for (const key in formData) {
    type OnlyKeys = keyof typeof data
    const k = key as OnlyKeys
    if (Object.prototype.hasOwnProperty.call(data, key)) {
      // if (k !== 'subscription_terms') {
      const value = data[k]
      re[k] = value
      // }
    }
  }
  return re as T
}

export function setValues<T = any>(
  formData: T | undefined,
  setValue = (name: any, value: any) => {}
) {
  for (const key in formData) {
    type OnlyKeys = keyof typeof formData
    const k = key as OnlyKeys
    if (Object.prototype.hasOwnProperty.call(formData, key)) {
      // if (k !== 'subscription_terms') {
      const value = formData[k]
      setValue(k, value)
      // }
    }
  }
}
export const truncateText = (text: any, char = 10) => {
  if (isValid(text)) {
    return String(text).substring(0, char) + (String(text)?.length > char ? '...' : '')
  } else {
    return null
  }
}
export const isFloat = (n: any = '') => {
  // return Number(n) === n && n % 1 !== 0;
  return String(n).includes('.')
}

export const isNumbers = (n: any = '') => {
  // const p = new RegExp(/^[0-9]+([.][0-9]+)?$/)
  const p = new RegExp(/^[0-9]+([.][0-9]+)?$/)
  return n === 0 || p.test(n)
}
/**
 * Currency Format
 * @param money
 * @param languageCode
 * @param countryCode
 * @param currency
 * @returns
 */
export const CF = ({
  money = 0,
  // languageCode = 'en',
  countryCode = 'us',
  currency = 'SEK'
}: {
  money: number | null
  languageCode?: string
  countryCode?: string
  currency: any
}) => {
  const la = localStorage.getItem('lang')
  const laa = JsonParseValidate(la)
  //   log('llaCurr', laa)
  if (money) {
    return new Intl.NumberFormat(
      `${laa?.value ?? 'en'}-${currency === 'SEK' ? 'se' : countryCode}`,
      {
        currency: isValid(currency) ? currency : 'SEK',
        style: 'currency',
        // minimumFractionDigits: isFloat(money) ? 2 : 0,
        maximumFractionDigits: isFloat(money) ? 2 : 0
      }
    ).format(money)
  } else {
    return 0
  }
}

export const amtFormat = (amount: any) => {
  if (isValid(amount)) {
    const amt = `${amount}`.replace(',', '.')
    return amt
  } else {
    return 0
  }
}

export const jsonDecodeAll = (fields: any, object: any, all = true) => {
  const re: any = {}
  for (const [key, value] of Object.entries(object)) {
    if (fields?.hasOwnProperty(key)) {
      if (fields[key] === 'json') {
        re[key] = JsonParseValidate(value)
      } else {
        re[key] = value
      }
    }
  }
  if (all) {
    return { ...object, ...re }
  } else {
    return re
  }
}

export function rand(min: number, max: number) {
  // min and max included
  return Math.floor(Math.random() * (max - min + 1 + min))
}

export const formatAndSetData = (address: any) => {
  let country = ''
  let city = ''
  let state = ''
  let full_address = ''

  let zip_code = ''
  if (address.address_components?.length > 0) {
    full_address = address.formatted_address
    address.address_components.map((obj: any) => {
      obj.types.map((string: any) => {
        if (string === 'country') country = obj.long_name
        // if(string === "country_code") country_code = obj.
        else if (string === 'locality' || string === 'postal_town') city = obj.long_name
        else if (string === 'administrative_area_level_1') state = obj.long_name
        else if (string === 'postal_code') zip_code = obj.long_name
      })
    })
  }
  return {
    state,
    country,
    city,
    zip_code,
    full_address
  }
}

export const decrypt = (text: string) => {
  if (isValid(text) && httpConfig?.enableAES) {
    let originalText = text
    try {
      // Decrypt
      const bytes = CryptoJS.AES.decrypt(text.toString(), `${httpConfig?.encryptKey}`)
      originalText = bytes.toString(CryptoJS.enc.Utf8)
    } catch (e) {
      //   log('unable to decrypt', originalText)
    }
    return originalText
  } else {
    return text
  }
}

//encrypt Method for encrypting the data
export const encrypt = (text: string) => {
  if (isValid(text) && httpConfig?.enableAES) {
    // Encrypt
    const ciphertext = CryptoJS.AES.encrypt(text, `${httpConfig?.encryptKey}`).toString()
    return ciphertext
  } else {
    return text
  }
}

export const decryptObject = (
  fields: any,
  object: any,
  modify = (k: any, v: any) => {
    return v
  }
) => {
  const state: any = {}
  if (isValid(object)) {
    for (const [key, value] of Object.entries(object)) {
      if (fields?.hasOwnProperty(key)) {
        const x = modify(key, value)
        if (isValid(value)) {
          try {
            state[key] = isValid(decrypt(x)) ? decrypt(x) : x
          } catch (error) {
            log(error, key, value)
          }
        } else {
          state[key] = x
        }
      } else {
        const x = modify(key, value)
        state[key] = x
      }
    }
  }
  return {
    ...object,
    ...state
  }
}
export const isArray = (obj: any) => {
  return Array.isArray(obj)
}
export const decryptAnythingArray = (array: Array<any>) => {
  const state: Array<any> = []
  if (isValidArray(array)) {
    fastLoop(array, (x, i) => {
      //   log('array index', i)
      if (isArray(x)) {
        // array (recursive)
        state[i] = decryptAnythingArray(x)
      } else if (typeof x !== 'object') {
        // object
        if (isValid(x)) {
          try {
            log('array index', i, 'string', state[i])
            state[i] = isValid(decrypt(x)) ? decrypt(x) : x
          } catch (error) {
            log(error, i, x)
          }
        } else {
          log('array index', i, 'n/a', state[i])

          state[i] = x
        }
      } else {
        // object
        // eslint-disable-next-line no-use-before-define
        state[i] = decryptAnythingObject(x)
      }
    })
  }
  return state
}
export const decryptAnythingObject = (object: any) => {
  const state: any = {}
  if (isValid(object)) {
    for (const [key, value] of Object.entries(object)) {
      const x: any = value
      if (isArray(x)) {
        // array
        log(key, 'array', value)
        state[key] = decryptAnythingArray(x)
      } else if (typeof x !== 'object') {
        // object
        if (isValid(x)) {
          try {
            // log(key, 'string', value)
            state[key] = isValid(decrypt(x)) ? decrypt(x) : x
          } catch (error) {
            log(error, key, value)
          }
        } else {
          log(key, 'string', 'n/a', value)
          state[key] = x
        }
      } else {
        // object (recursive)
        // log(key, 'object', 'n/a', value)
        state[key] = decryptAnythingObject(x)
      }
    }
  }
  return {
    ...object,
    ...state
  }
}

export const decryptAnything = (data: Array<any> | any) => {
  log('working', data)
  //check if data is object or array
  if (isArray(data)) {
    const re: Array<any> = []
    // array
    log('array')
    fastLoop(data, (d, i) => {
      log('array index', i)
      re.push(decryptAnythingObject(data))
    })
    return re
  } else {
    let re: any = {}
    // object
    log('object')
    re = decryptAnythingObject(data)

    return re
  }
}

// const getProductPrice = (product: ProductParamType) => {
//     if(product?.discounted_price > )
// }
export function getKeyByValue(object: any, value: any): FMKeys {
  return Object.keys(object).find((key) => object[key] === value) as FMKeys
}
export const addDay = (d: any, day: number) => {
  const someDate = new Date(d)
  const numberOfDaysToAdd = day
  const result = someDate.setDate(someDate.getDate() + numberOfDaysToAdd)
  return result
}
export const minusDay = (d: any, day: number) => {
  const someDate = new Date(d)
  const numberOfDaysToAdd = day
  const result = someDate.setDate(someDate.getDate() - numberOfDaysToAdd)
  return result
}

export const checkHttp = (urlString: string) => {
  try {
    return Boolean(new URL(urlString))
  } catch (e) {
    return false
  }
}

export function getMonday(d: Date) {
  const day = d.getDay(),
    diff = d.getDate() - day + (day === 0 ? -6 : 1)
  return new Date(d.setDate(diff))
}
export function getWeekStartEnd(d: Date) {
  const firstDay = getMonday(d)
  const lastDay = new Date(addDay(firstDay, 6))

  return { firstDay, lastDay }
}
export function getStartAndEndOfMonth() {
  const startOfMonth = moment().startOf('month').toDate()
  const endOfMonth = moment().endOf('month').toDate()
  return { startOfMonth, endOfMonth }
}

export function abbreviateNumber(value: any) {
  const res = Intl.NumberFormat('en-US', {
    notation: 'compact',
    maximumFractionDigits: 1
  }).format(value)
  return res !== 'NaN' ? res : '0'
}
export function sumSum(array: Array<any>, sum = 'quantity') {
  let re = 0
  fastLoop(array, (a: any, index: number) => {
    re += Number(a[sum])
  })
  return re
}

export const personalNumberToDob = (p = '') => {
  if (isValid(p)) {
    const str = p
    const onlyNumbers = str.replace(/\D/g, '')
    const flat = String(onlyNumbers).substring(0, 8)
    const date: any = `${flat.slice(0, 4)}-${flat.slice(4, 6)}-${flat.slice(6, 8)}`
    const getMonth = `${flat.slice(4, 6)}`
    const getDays = `${flat.slice(6, 8)}`

    // log('personal', getMonth, 'days', getDays)
    if (getDays > '29' && getMonth === '02') {
      // return date
    } else {
      return date
    }
  }
}

export function getAge(dateString: any, FM: any, bool = false) {
  const now = new Date()
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())

  const yearNow = now.getFullYear()
  const monthNow = now.getMonth()
  const dateNow = now.getDate()
  const getDob = personalNumberToDob(dateString)
  const dob = new Date(getDob)

  const yearDob = dob.getFullYear()
  const monthDob = dob.getMonth()
  const dateDob = dob.getDate()

  let age: any = {}
  let ageString: any = 'Invalid Age'
  let yearString: any = ''
  let monthString: any = ''
  let dayString: any = ''

  let yearAge = yearNow - yearDob
  let monthAge: any = ''
  let dateAge: any = ''

  if (monthNow >= monthDob) {
    monthAge = monthNow - monthDob
  } else {
    yearAge--
    monthAge = 12 + monthNow - monthDob
  }

  if (dateNow >= dateDob) {
    dateAge = dateNow - dateDob
  } else {
    monthAge--
    dateAge = 31 + dateNow - dateDob

    if (monthAge < 0) {
      monthAge = 11
      yearAge--
    }
  }

  age = {
    years: yearAge,
    months: monthAge,
    days: dateAge
  }

  if (age.years > 1) yearString = FM('years-old')
  else yearString = FM('year-old')
  if (age.months > 1) monthString = FM('months-old')
  else monthString = FM('month-old')
  if (age.days > 1) dayString = FM('days-old')
  else dayString = FM('day-old')

  if (age.years > 0) {
    ageString = `${age.years} ${yearString}`
  } else if (age.months > 0) {
    ageString = `${age.months} ${monthString}`
  } else if (age.days > 0) {
    ageString = `${age.days} ${dayString}`
  }
  // log('age', age)

  return bool ? (age.years > 0 || age.months > 0 || age.days > 0) && age?.years < 125 : ageString
}

export function removeSpecialChar(str: any = '') {
  if (isValid(str)) {
    const newStr = `${str?.replace(/[^\w\s]/gi, '')}`
    return newStr
  }
}
export function generateArrayOfYears(m = 9) {
  const max = new Date().getFullYear()
  const min = max - m
  const years = []

  for (let i = max; i >= min; i--) {
    years.push(i)
  }
  return years
}
export const setInputErrors = (fields: any, setError: (e: any, a: any) => void) => {
  for (const key in fields) {
    if (Object.hasOwnProperty.call(fields, key)) {
      if (isValidArray(fields[key])) {
        const message = fields[key].join(', ')
        setError(key, { message, type: 'validate' })
      }
    }
  }
}

export const SpaceTrim = (str: string) => {
  return /^\s*$/.test(str)
}

export const maskNumber = ({ str = '', len = 0 }: { str: string; len: number }) => {
  if (isValid(str)) {
    const res = `${str?.slice(0, -8)}XXXXXXXX`
    return res
  } else {
    return str
  }
}
export function endOfMonths(date: any) {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0)
}

export const enableFutureDates = (date: any) => {
  if (date >= new Date()) {
    return true
  } else {
    return false
  }
}

export const getVatValue = (vat = 0, amount = 0) => {
  return Number(((vat / 100) * amount).toFixed(2))
}

export const toFixed = (amount = 0, fixed = 2) => {
  return Number(amount).toFixed(fixed)
}

export const countPlus = ({ number = 0, max = number }: { number?: any; max?: number }) => {
  return parseInt(number) > max ? `${max}+` : number
}
export const isValidBarcode = (barcode?: any) => {
  const re: any[] = []
  if (isValidArray(barcode)) {
    fastLoop(barcode, (d: any) => {
      if (isValid(d?.value)) {
        re.push(d)
      }
    })
  }

  return re.length
}
