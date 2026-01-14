// ** I18n Imports
import i18n from 'i18next'
import LanguageDetector from 'i18next-browser-languagedetector'
import Backend from 'i18next-xhr-backend'
import { initReactI18next } from 'react-i18next'
import httpConfig from '../../utility/http/httpConfig'

const id = JSON?.parse(localStorage.getItem('SatocciUserData'))?.id
i18n

  // Enables the i18next backend
  .use(Backend)

  // Enable automatic language detection
  .use(LanguageDetector)

  // Enables the hook initialization module
  .use(initReactI18next)
  .init({
    lng: '1',
    fallbackLng: '1',
    backend: {
      /* translation file path */
      loadPath: () => {
        const host = window.location.host

        return `${httpConfig.baseUrl}get-label-by-language-id/{{lng}}?group_id=1&update_lang=yes&id=${id}`

        // return `/assets/data/locales/{{lng}}.json`
      }

      // loadPath: `/assets/data/locales/{{lng}}.json`
    },
    // fallbackLng: (code) => {
    //   //   if (!code || code === 'en') return ['en-US']
    //   //   const fallbacks = [code]

    //   //   // We maintain en-US and en-AU. Some regions will prefer en-AU.
    //   //   if (code.startsWith('en-') && !['en-US', 'en-AU'].includes(code)) {
    //   //     if (['en-GB', 'en-NZ', 'en-IR'].includes(code)) fallbacks.push('en-AU')
    //   //     else fallbacks.push('en-US')
    //   //     return fallbacks
    //   //   }

    //   //   // add pure lang
    //   //   const langPart = code.split('-')[0]
    //   //   if (langPart !== code) fallbacks.push(langPart)

    //   //   // finally, developer language
    //   //   fallbacks.push('dev')
    //   //   return fallbacks
    //   return null
    // },
    debug: false,
    keySeparator: false,
    react: {
      useSuspense: false
    },

    interpolation: {
      escapeValue: false,
      formatSeparator: ','
    }
  })

export default i18n
