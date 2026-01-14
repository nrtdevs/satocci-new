// ** React Imports
import { Fragment, memo, useEffect } from 'react'

// ** Third Party Components
import classnames from 'classnames'

// ** Store & Actions
import { handleContentWidth, handleMenuCollapsed, handleMenuHidden } from '@store/layout'
import { useDispatch, useSelector } from 'react-redux'

// ** ThemeConfig
import themeConfig from '@configs/themeConfig'

// ** Styles
import 'animate.css/animate.css'
import { useTranslation } from 'react-i18next'

const LayoutWrapper = (props) => {
  // ** Props
  const { children, routeMeta } = props
  const { i18n, t } = useTranslation()
  // ** Store Vars
  const dispatch = useDispatch()
  const store = useSelector((state) => state)

  const navbarStore = store.navbar
  const layoutStored = store.layout.layout
  const contentWidth = store.layout.contentWidth
  //** Vars
  const appLayoutCondition =
    (layoutStored.layout === 'horizontal' && !routeMeta) ||
    (layoutStored.layout === 'horizontal' && routeMeta && !routeMeta.appLayout)
  const Tag = appLayoutCondition ? 'div' : Fragment

  // ** Clean Up Function
  const cleanUp = () => {
    if (routeMeta) {
      if (routeMeta.contentWidth && routeMeta.contentWidth === store.layout.contentWidth) {
        dispatch(handleContentWidth(themeConfig.layout.contentWidth))
      }
      if (routeMeta.menuCollapsed && routeMeta.menuCollapsed === store.layout.menuCollapsed) {
        dispatch(handleMenuCollapsed(!store.layout.menuCollapsed))
      }
      if (routeMeta.menuHidden && routeMeta.menuHidden === store.layout.menuHidden) {
        dispatch(handleMenuHidden(!store.layout.menuHidden))
      }
    }
  }
  useEffect(() => {
    window.scroll({ top: 0, behavior: 'instant' })
  }, [])
  // ** ComponentDidMount
  useEffect(() => {
    if (routeMeta) {
      if (routeMeta.contentWidth) {
        dispatch(handleContentWidth(routeMeta.contentWidth))
      }
      if (routeMeta.menuCollapsed) {
        dispatch(handleMenuCollapsed(routeMeta.menuCollapsed))
      }
      if (routeMeta.menuHidden) {
        dispatch(handleMenuHidden(routeMeta.menuHidden))
      }
    }
    return () => cleanUp()
  }, [routeMeta])

  useEffect(() => {
    document.querySelector('.dropdown').addEventListener('show.bs.dropdown', function () {
      document.querySelector('body').insertAdjacentHTML(
        'beforeend',
        document
          .querySelector('.dropdown')
          .css({
            position: 'absolute',
            left: document.querySelector('.dropdown').offset().left,
            top: document.querySelector('.dropdown').offset().top
          })
          .detach()
      )
    })

    document.querySelector('.dropdown').addEventListener('hidden.bs.dropdown', function () {
      document.querySelector('.bs-example').insertAdjacentHTML(
        'beforeend',
        document
          .querySelector('.dropdown')
          .css({
            position: false,
            left: false,
            top: false
          })
          .detach()
      )
    })
  }, [])

  return (
    <div
      className={classnames('app-content content overflow-hidden-non', {
        [routeMeta ? routeMeta.className : '']: routeMeta && routeMeta.className,
        'show-overlay': navbarStore.query.length
      })}
    >
      <div className='content-overlay'></div>
      <div className='header-navbar-shadow' />
      <div
        className={classnames({
          'content-wrapper': routeMeta && !routeMeta.appLayout,
          'content-area-wrapper': routeMeta && routeMeta.appLayout,
          'container-xxl p-0': contentWidth === 'boxed'
        })}
      >
        <Tag
          {...(appLayoutCondition
            ? { className: 'content-body', key: i18n?.language }
            : { key: i18n?.language })}
        >
          {children}
        </Tag>
      </div>
    </div>
  )
}

export default memo(LayoutWrapper)
