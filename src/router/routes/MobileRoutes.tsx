import { lazy } from 'react'

const Authentication = lazy(() => import('../../viewMobile/auth/MobileLogin'))
const MobileRoutes = [
  {
    path: '/mobile/login',
    element: <Authentication />,
    name: 'mobile.auth.mobileLogin',
    meta: {
      layout: 'blank',
      publicRoute: true,
      restricted: true
    }
  }
] as const
export type MobileRouteName = typeof MobileRoutes[number]['name']

export default MobileRoutes
