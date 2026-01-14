// ** Redux Imports
import { createSlice } from '@reduxjs/toolkit'

// ** UseJWT import to get config
import useJwt from '@src/auth/jwt/useJwt'
import { isValidArray } from '../utility/helpers/common'

const config = useJwt.jwtConfig

const initialUser = () => {
  const item = window.localStorage.getItem('SatocciUserData')
  //** Parse stored json or if none return initialValue
  return item ? JSON?.parse(item) : {}
}

export const authSlice = createSlice({
  name: 'authentication',
  initialState: {
    userData: initialUser(),
    userLicense: null,
    userLicenseStatus: null,
    access_token: initialUser()?.access_token
  },
  reducers: {
    handleLogin: (state, action) => {
      //  log('action', action)
      state.userData = action.payload
      state.access_token = action?.payload?.access_token
      state[config.storageTokenKeyName] = action.payload[config.storageTokenKeyName]
      state[config.storageRefreshTokenKeyName] = action.payload[config.storageRefreshTokenKeyName]
      localStorage.setItem('SatocciUserData', JSON.stringify(action.payload))
      if (isValidArray(action.payload?.languages)) {
        localStorage.setItem('lang', JSON.stringify(action.payload?.languages[0]))
      }
      localStorage.setItem(config.storageTokenKeyName, JSON.stringify(action.payload.access_token))
      localStorage.setItem(
        config.storageRefreshTokenKeyName,
        JSON.stringify(action.payload.access_token)
      )
    },
    handleLogout: (state, action) => {
      state.userData = {}
      state[config.storageTokenKeyName] = null
      state[config.storageRefreshTokenKeyName] = null
      // ** Remove user, accessToken & refreshToken from localStorage
      localStorage.removeItem('SatocciUserData')
      localStorage.removeItem(config.storageTokenKeyName)
      localStorage.removeItem(config.storageRefreshTokenKeyName)
      action.payload.go('/authentication')
    }
  }
})

export const { handleLogin, handleLogout } = authSlice.actions

export default authSlice.reducer

//  // ** Redux Imports
// import { createSlice } from '@reduxjs/toolkit'

// // ** UseJWT import to get config
// import useJwt from '@src/auth/jwt/useJwt'

// const config = useJwt.jwtConfig

// const initialUser = () => {
//   const item = window.localStorage.getItem('SatocciUserData')
//   //** Parse stored json or if none return initialValue
//   return item ? JSON.parse(item) : {}
// }

// export const authSlice = createSlice({
//   name: 'authentication',
//   initialState: {
//     userData: initialUser()
//   },
//   reducers: {
//     handleLogin: (state, action) => {
//       state.userData = action.payload
//       state[config.storageTokenKeyName] = action.payload[config.storageTokenKeyName]
//       state[config.storageRefreshTokenKeyName] = action.payload[config.storageRefreshTokenKeyName]
//       localStorage.setItem('userData', JSON.stringify(action.payload))
//       localStorage.setItem(config.storageTokenKeyName, JSON.stringify(action.payload.accessToken))
//       localStorage.setItem(config.storageRefreshTokenKeyName, JSON.stringify(action.payload.refreshToken))
//     },
//     handleLogout: state => {
//       state.userData = {}
//       state[config.storageTokenKeyName] = null
//       state[config.storageRefreshTokenKeyName] = null
//       // ** Remove user, accessToken & refreshToken from localStorage
//       localStorage.removeItem('userData')
//       localStorage.removeItem(config.storageTokenKeyName)
//       localStorage.removeItem(config.storageRefreshTokenKeyName)
//     //   action.payload.go("/authentication")
//     }
//   }
// })

// export const { handleLogin, handleLogout } = authSlice.actions

// export default authSlice.reducer
