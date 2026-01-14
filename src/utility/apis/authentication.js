/* eslint-disable array-bracket-newline */
import { handleLogin } from '../../redux/authentication'
import { FM, log } from '../helpers/common'
// import { createAbility } from "../helpers/common"
import ApiEndpoints from '../http/ApiEndpoints'
import http from '../http/useHttp'
import { SuccessToast } from '../Utils'
import { useHistory } from 'react-router-dom'
const extraPermissions = [
  //   {
  //     action: 'manage',
  //     subject: 'all'
  //   }
]

export const login = ({
  formData,
  loading = () => {},
  success = () => {},
  errorMessage = 'login-failed',
  successMessage,
  dispatch = () => {},
  ability,
  redirect = true,
  navigate = () => {},
  error = () => {}
}) => {
  http.request({
    jsonData: formData,
    method: 'post',
    path: ApiEndpoints.login,
    loading,
    showErrorToast: true,
    error: (e) => {
      error(e)
      // console.log(e)
      // ErrorToast(errorMessage)
    },
    success: (data) => {
      if (data?.payload?.otp_enabled === true) {
        navigate(`/verify-otp`, { state: { email: data?.payload?.email } })
      } else {
        const p =
          data?.payload?.permissions?.map((a) => ({
            action: a.name,
            subject: a?.group_name
          })) ?? []
        const m = {
          ...data?.payload,
          // role: data.payload.roles,
          ability: p?.concat(extraPermissions)
        }

        dispatch(handleLogin(m))
        SuccessToast(successMessage)
        // if (data?.data?.permissions) ability.update([
        //     {
        //         action: 'manage',
        //         subject: 'all'
        //     }
        // ])
        //   if (data?.payload?.permissions)
        ability.update(m?.ability)

        if (redirect) window.location.href = '/dashboard'
      }

      log('loginData', data)
      success(data)
    }
  })
}

export const verifyOtp = ({
  formData,
  loading = () => {},
  success = () => {},
  errorMessage = 'login-failed',
  successMessage,
  dispatch = () => {},
  ability,
  redirect = true,
  navigate = () => {},
  error = () => {}
}) => {
  http.request({
    jsonData: formData,
    method: 'post',
    path: ApiEndpoints.otpVerify,
    loading,
    showErrorToast: true,
    error: (e) => {
      error(e)
      // console.log(e)
      // ErrorToast(errorMessage)
    },
    success: (data) => {
      const p =
        data?.payload?.permissions?.map((a) => ({
          action: a.name,
          subject: a?.group_name
        })) ?? []
      const m = {
        ...data?.payload,
        // role: data.payload.roles,
        ability: p?.concat(extraPermissions)
      }

      dispatch(handleLogin(m))
      SuccessToast(successMessage)
      // if (data?.data?.permissions) ability.update([
      //     {
      //         action: 'manage',
      //         subject: 'all'
      //     }
      // ])
      //   if (data?.payload?.permissions)
      ability.update(m?.ability)

      if (redirect) window.location.href = '/dashboard'

      // log('loginData', data)
      success(data)
    }
  })
}

////////////////////forgot password ////////////////////
export const forgotPassword = ({
  formData,
  loading = () => {},
  // successMessage = "link send successfully",
  error = () => {}
}) => {
  http.request({
    jsonData: formData,
    method: 'post',
    path: ApiEndpoints.forgotPassword,
    loading,
    showErrorToast: true,
    showSuccessToast: true,
    error: (e) => {
      error(e)
    },
    success: () => {
      // SuccessToast(successMessage)
    }
  })
}

/////////////////////////Reset Password ////////////////////////////
export const resetPassword = ({
  formData,
  loading = () => {},
  successMessage = 'password-changed',
  error = () => {},
  success = () => {}
}) => {
  http.request({
    jsonData: formData,
    method: 'post',
    path: ApiEndpoints.resetPassword,
    loading,
    showErrorToast: true,
    error: (e) => {
      error(e)
      //   console.log(e)
      // ErrorToast(errorMessage)
    },
    success: (e) => {
      SuccessToast(successMessage)
      success(e)
    }
  })
}

/////LOGOUT//////
export const logout = ({ loading = () => {}, success = () => {}, error = () => {} }) => {
  http.request({
    method: 'post',
    path: ApiEndpoints.logout,
    loading,
    showErrorToast: true,
    error: (e) => {
      error(e)
      // console.log(e)
      // ErrorToast(errorMessage)
    },
    success: (data) => {
      success(data)
    }
  })
}

export const resendOtp = ({
  formData,
  loading = () => {},
  success = () => {},
  error = () => {}
}) => {
  http.request({
    jsonData: formData,
    method: 'post',
    path: ApiEndpoints.resendOtp,
    loading,
    showErrorToast: true,
    error: (e) => {
      error(e)
      // console.log(e)
      // ErrorToast(errorMessage)
    },
    success: (data) => {
      success(data)
    }
  })
}
/////////////////////////Request for Account Delete ////////////////////////////
export const requestDeleteAcc = ({
  formData,
  loading = () => {},
  success = () => {},
  error = () => {}
}) => {
  http.request({
    jsonData: formData,
    method: 'post',
    path: ApiEndpoints.requestAccountDelete,
    loading,
    showErrorToast: true,
    showSuccessToast: true,
    error: (e) => {
      error(e)
      // console.log(e)
      // ErrorToast(errorMessage)
    },
    success: (data) => {
      success(data)
    }
  })
}

export const verifyDeleteOtp = ({
  formData,
  loading = () => {},
  success = () => {},
  error = () => {}
}) => {
  http.request({
    jsonData: formData,
    method: 'post',
    path: ApiEndpoints.verifyDeleteOtp,
    loading,
    showErrorToast: true,
    error: (e) => {
      error(e)
    },
    success: (data) => {
      success(data)
    }
  })
}
