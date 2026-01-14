// ** Router imports
import { lazy } from 'react'

// ** Router imports
import { useRoutes, Navigate } from 'react-router-dom'

// ** Layouts
import BlankLayout from '@layouts/BlankLayout'

// ** Hooks Imports
import { useLayout } from '@hooks/useLayout'

// ** Utils
import { getUserData, getHomeRouteForLoggedInUser } from '../utility/Utils'

// ** GetRoutes
import { getRoutes } from './routes/index'
import { isValid, log } from '../utility/helpers/common'

// ** Components
const Error = lazy(() => import('../views/examples/pages/misc/Error'))
const Login = lazy(() => import('../views/auth/Login'))
const VerifyOtp = lazy(() => import('../views/auth/VerifyOtp'))
const NotAuthorized = lazy(() => import('../views/examples/pages/misc/NotAuthorized'))
const RequestForAccountDelete = lazy(() => import('../views/auth/RequestForAccountDelete'))

const Router = () => {
  // ** Hooks
  const { layout } = useLayout()

  const allRoutes = getRoutes(layout)
  const getHomeRoute = () => {
    const user = getUserData()

    if (user) {
      return getHomeRouteForLoggedInUser(user?.role)
    } else {
      return '/authentication'
      //   return '/mobile/login'
    }
  }

  const routes = useRoutes([
    {
      path: '/',
      index: true,
      element: <Navigate replace to={getHomeRoute()} />
    },
    // {
    //     path: '/login',
    //     element: <BlankLayout />,
    //     children: [{ path: '/login', element: <Login /> }]
    // },
    {
      path: '/authentication',
      element: <BlankLayout />,
      children: [{ path: '/authentication', element: <Login /> }]
    },
    {
      path: '/verify-otp',
      element: <BlankLayout />,
      children: [{ path: '/verify-otp', element: <VerifyOtp /> }]
    },
    {
      path: '/request-for-account-delete',
      element: <BlankLayout />,
      children: [{ path: '/request-for-account-delete', element: <RequestForAccountDelete /> }]
    },
    {
      path: '/auth/not-auth',
      element: <BlankLayout />,
      children: [{ path: '/auth/not-auth', element: <NotAuthorized /> }]
    },
    {
      path: '*',
      element: <BlankLayout />,
      children: [{ path: '*', element: <Error /> }]
    },
    ...allRoutes
  ])

  return routes
}

export default Router
