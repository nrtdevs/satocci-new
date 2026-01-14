// import { useTranslation } from 'react-i18next'
import i18n from '../../configs/i18n'
import { FMKeys } from '../../configs/i18n/FMTypes'
// import i18next from 'i18next'

const isDebug = !process.env.NODE_ENV || process.env.NODE_ENV === 'development'
let ddebug = function (...e: any) {}

if (isDebug) {
  ddebug = console.log.bind(window.console)
}
export const log = ddebug

export const isValid = (val: any, extra: any = null) => {
  let r = true
  if (val === null) {
    r = false
  } else if (val === undefined) {
    r = false
  } else if (val === '') {
    r = false
    // eslint-disable-next-line eqeqeq
  } else if (val === extra) {
    r = false
  } else if (val === 'null') {
    r = false
  }
  return r
}

export const isValidArray = (val: any) => {
  if (isValid(val)) {
    if (typeof val === 'object') {
      return val?.length > 0
    }
  }
  return false
}

/**
 * Translate
 * @param {*} id
 * @param {*} values
 * @param {*} create
 * @returns
 */
// export const FM = (id, values) => {

//     if (values === null) values = {}
//     return i18n.t(id, { ...values })

// }

const capitalize = (str: string, lower = false) =>
  (lower ? str.toLowerCase() : str).replace(/(?:^|\s|["'([{])+\S/g, (match) => match.toUpperCase())

// export const getInitials = (name: string) => {
//   name = capitalize(name)
//   const rgx = new RegExp(/(\p{L}{1})\p{L}+/, 'gu')
//   const a: IterableIterator<RegExpMatchArray> = name.matchAll(rgx)
//   let initials = [...a] || []

//   initials = ((initials.shift()?.[1] || '') + (initials.pop()?.[1] || '')).toUpperCase()
//   return initials
// }

/**
 * Create Ability
 */
export const createAbility = (permissions = []) => {
  let abilities = [
    {
      subject: 'profile',
      action: 'profile-browse'
    },
    {
      subject: 'profile',
      action: 'profile-edit'
    }
  ]
  if (isValid(permissions)) {
    abilities = [...abilities, ...permissions]
  }
  // log(permissions, abilities)
  return abilities
}

export const FM = (id: FMKeys, values?: any) => {
  if (values === null) values = {}
  return String(i18n.t(id, { ...values }))
}

// export const FM = (id, values) => {
//     return id
// }

export const isValidUrl = (url: string) => {
  try {
    new URL(url)
    return true
  } catch (e) {
    return false
  }
}
