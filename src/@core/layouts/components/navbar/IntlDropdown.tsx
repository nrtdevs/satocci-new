/* eslint-disable no-dupe-else-if */
// ** Third Party Components
import { useEffect, useState } from 'react'
import ReactCountryFlag from 'react-country-flag'
import { useTranslation } from 'react-i18next'

// ** Reactstrap Imports
import { DropdownItem, DropdownMenu, DropdownToggle, UncontrolledDropdown } from 'reactstrap'
import { useAppSelector } from '../../../../redux/store'
import { useRTL } from '../../../../utility/hooks/useRTL'
import { stateReducer } from '../../../../utility/stateReducer'
import { JsonParseValidate } from '../../../../utility/Utils'
// ** Styles
import 'react-perfect-scrollbar/dist/css/styles.css'

interface States {
  page?: any
  per_page_record?: any
  toggle?: boolean
  languageArr?: any
}

const IntlDropdownTs = () => {
  const store = useAppSelector((a: any) => a?.language)
  const [langData, setLangData] = useState<any>({})
  const [isRtl, setValue] = useRTL()

  // ** Hooks
  const { i18n } = useTranslation()
  const reducers = stateReducer<States>

  // ** Vars
  const langObj: any = {
    en: 'English',
    de: 'German',
    fr: 'French',
    pt: 'Portuguese'
  }

  const la = localStorage.getItem('lang')

  const laa = JsonParseValidate(la)

  // ** Function to switch Language
  const handleLangUpdate = (e?: any, lang?: any) => {
    e.preventDefault()
    localStorage.setItem('lang', JSON.stringify(lang))
    i18n.changeLanguage(String(lang?.id))
    if (lang?.mode === '2') {
      setValue(true)
    } else {
      setValue(false)
    }
  }

  useEffect(() => {
    if (i18n?.language !== laa?.id) {
      i18n.changeLanguage(String(laa?.id))
    }
  }, [])

  return (
    <UncontrolledDropdown href='/' tag='li' className='dropdown-language nav-item'>
      <DropdownToggle
        href='/'
        tag='a'
        className='nav-link'
        onClick={(e) =>
          // loadLanguage({
          //   page: 1,
          //   per_page_record: 200
          // })
          e.preventDefault()
        }
      >
        <ReactCountryFlag
          svg
          className='country-flag flag-icon'
          countryCode={laa?.value === 'eng' ? 'us' : laa?.value ?? 'us'}
        />
        <span className='selected-language text-capitalize'>{laa?.title ?? 'English'}</span>
      </DropdownToggle>
      <DropdownMenu className='mt-0' style={{ height: '200px', overflow: 'scroll' }}>
        {store?.data?.map((lan: any, i: any) => {
          return (
            <>
              <DropdownItem
                href='/'
                tag='a'
                onClick={(e) => {
                  setLangData(lan)
                  handleLangUpdate(e, lan)
                }}
              >
                <ReactCountryFlag
                  className='country-flag'
                  countryCode={lan?.value === 'eng' ? 'us' : lan?.value}
                  svg
                />
                <span className='ms-1 text-capitalize'>{lan?.title}</span>
              </DropdownItem>
            </>
          )
        })}

        {/* <DropdownItem href='/' tag='a' onClick={(e) => handleLangUpdate(e, 'en')}>
          <ReactCountryFlag className='country-flag' countryCode='us' svg />
          <span className='ms-1'>English</span>
        </DropdownItem>
        <DropdownItem href='/' tag='a' onClick={(e) => handleLangUpdate(e, 'se')}>
          <span className='ms-1'> Swedish</span>
        </DropdownItem>
        <DropdownItem href='/' tag='a' onClick={(e) => handleLangUpdate(e, 'ae')}>
          <ReactCountryFlag className='country-flag' countryCode='ae' svg />
          <span className='ms-1'>UAE</span>
        </DropdownItem>
        <DropdownItem href='/' tag='a' onClick={(e) => handleLangUpdate(e, 'in')}>
          <ReactCountryFlag className='country-flag' countryCode='in' svg />
          <span className='ms-1'>India</span>
        </DropdownItem> */}
        {/* <DropdownItem href='/' tag='a' onClick={(e) => handleLangUpdate(e, 'fr')}>
          <ReactCountryFlag className='country-flag' countryCode='fr' svg />
          <span className='ms-1'>French</span>
        </DropdownItem>
        <DropdownItem href='/' tag='a' onClick={(e) => handleLangUpdate(e, 'de')}>
          <ReactCountryFlag className='country-flag' countryCode='de' svg />
          <span className='ms-1'>German</span>
        </DropdownItem>
        <DropdownItem href='/' tag='a' onClick={(e) => handleLangUpdate(e, 'pt')}>
          <ReactCountryFlag className='country-flag' countryCode='pt' svg />
          <span className='ms-1'>Portuguese</span>
        </DropdownItem> */}
      </DropdownMenu>
    </UncontrolledDropdown>
  )
}

export default IntlDropdownTs
