// ** React Imports
import { Fragment } from 'react'
// ** Routes Imports
import SatocciRoute, { RouteProps } from './SatocciRoute'
// ** Layouts
import BlankLayout from '../..//@core/layouts/BlankLayout'
import LayoutWrapper from '../../@core/layouts/components/layout-wrapper'
import HorizontalLayout from '../../layouts/HorizontalLayout'
import VerticalLayout from '../../layouts/VerticalLayout'
// ** Route Components
import PrivateRoute from '../../@core/components/routes/PrivateRoute'
import PublicRoute from '../../@core/components/routes/PublicRoute'
// ** Utils
import { isObjEmpty } from '../../utility/Utils'
import MobileRoutes from './MobileRoutes'
type Layouts = 'vertical' | 'horizontal' | 'blank'
const getLayout = {
  blank: <BlankLayout />,
  vertical: <VerticalLayout />,
  horizontal: <HorizontalLayout />
}
// ** Document title
const TemplateTitle = '%s - Satocci Admin'

// ** Default Route
// const DefaultRoute = '/dashboard/ecommerce'
const DefaultRoute = '/dashboard'
// ** Merge Routes
const Routes: RouteProps[] = [...SatocciRoute, ...MobileRoutes]

const getRouteMeta = (route: any) => {
  if (isObjEmpty(route.element.props)) {
    if (route.meta) {
      return { routeMeta: route.meta }
    } else {
      return {}
    }
  }
}
// ** Return Filtered Array of Routes & Paths
const MergeLayoutRoutes = (layout: any, defaultLayout: any) => {
  const LayoutRoutes: any[] = []
  if (Routes) {
    Routes.filter((route) => {
      let isBlank = false
      // ** Checks if Route layout or Default layout matches current layout
      if (
        (route.meta && route.meta.layout && route.meta.layout === layout) ||
        ((route.meta === undefined || route.meta.layout === undefined) && defaultLayout === layout)
      ) {
        let RouteTag = PrivateRoute

        // ** Check for public or private route
        if (route.meta) {
          route.meta.layout === 'blank' ? (isBlank = true) : (isBlank = false)
          RouteTag = route.meta.publicRoute ? PublicRoute : PrivateRoute
        }
        if (route.element) {
          const Wrapper =
            // eslint-disable-next-line multiline-ternary
            isObjEmpty(route.element.props) && isBlank === false
              ? // eslint-disable-next-line multiline-ternary
                LayoutWrapper
              : Fragment

          route.element = (
            <Wrapper {...(isBlank === false ? getRouteMeta(route) : {})}>
              <RouteTag route={route}>{route.element}</RouteTag>
            </Wrapper>
          )
        }

        // Push route to LayoutRoutes
        LayoutRoutes.push(route)
      }
      return LayoutRoutes
    })
  }
  return LayoutRoutes
}
const getRoutes = (layout: Layouts) => {
  const defaultLayout = layout || 'vertical'
  const layouts = ['vertical', 'horizontal', 'blank']

  const AllRoutes: any[] = []

  layouts.forEach((layoutItem) => {
    const LayoutRoutes = MergeLayoutRoutes(layoutItem, defaultLayout)
    const a: Layouts = layoutItem as Layouts
    AllRoutes.push({
      path: '/',
      element: getLayout[a] || getLayout[defaultLayout],
      children: LayoutRoutes
    })
  })
  return AllRoutes
}

export { DefaultRoute, TemplateTitle, Routes, getRoutes }
