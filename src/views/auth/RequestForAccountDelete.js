// ** React Imports
import { useContext, useEffect, useState } from 'react'
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom'

// ** Custom Hooks
import { useSkin } from '@hooks/useSkin'

// ** Third Party Components
import { useForm } from 'react-hook-form'
import { useDispatch } from 'react-redux'

// ** Context
import { AbilityContext } from '@src/utility/context/Can'

// ** Custom Components

// ** Utils

// ** Reactstrap Imports
import { CardTitle, Col, Form, Row } from 'reactstrap'

// ** Styles
import '@styles/react/pages/page-authentication.scss'
import { useTranslation } from 'react-i18next'
import themeConfig from '../../configs/themeConfig'
import { getPath } from '../../router/RouteHelper'
import {
  login,
  requestDeleteAcc,
  resendOtp,
  verifyDeleteOtp,
  verifyOtp
} from '../../utility/apis/authentication'
import { FM, isValidArray, log } from '../../utility/helpers/common'
import { useRTL } from '../../utility/hooks/useRTL'
import LoadingButton from '../components/buttons/LoadingButton'
import FormGroupCustom from '../components/formGroupCustom'
import { max } from 'moment'
import Show from '../../utility/Show'
import { SuccessToast } from '../../utility/Utils'

// const ToastContent = ({ t, name, role }) => {
//     return (
//         <div className='d-flex'>
//             <div className='me-1'>
//                 <Avatar size='sm' color='success' icon={<Coffee size={12} />} />
//             </div>
//             <div className='d-flex flex-column'>
//                 <div className='d-flex justify-content-between'>
//                     <h6>{name}</h6>
//                     <X size={12} className='cursor-pointer' onClick={() => toast.dismiss(t.id)} />
//                 </div>
//                 <span>You have successfully logged in as an {role} user to Vuexy. Now you can start to explore. Enjoy!</span>
//             </div>
//         </div>
//     )
// }

const defaultValues = {
  password: 'admin',
  loginEmail: 'admin@demo.com'
}

const OTPTimer = ({ initialTime = 60, onTimeout }) => {
  const [timeLeft, setTimeLeft] = useState(initialTime)
  const params = useParams()
  const email = params.email
  useEffect(() => {
    if (timeLeft > 0) {
      const timerId = setInterval(() => {
        setTimeLeft((prevTime) => prevTime - 1)
      }, 1000)

      return () => clearInterval(timerId) // Cleanup the interval on component unmount
    } else {
      if (onTimeout) onTimeout()
    }
  }, [timeLeft, onTimeout])

  return (
    <div>
      {/* <p>Time left: {timeLeft} seconds</p>
      {timeLeft === 0 && (
        <p>
          <Link
            onClick={() => {
              setTimeLeft(initialTime)
              console.log('otp-send')
            }}
          >
            <small>{FM('resend-otp')}</small>
          </Link>
        </p>
      )} */}

      {timeLeft !== 0 ? (
        <p className='text-primary'>Time left: {timeLeft} seconds</p>
      ) : (
        <p
          className='text-primary cursor-pointer'
          onClick={() => {
            setTimeLeft(initialTime)
            resendOtp({
              formData: {
                email
              },
              //   error: () => {},
              //   loading: () => {},
              success: (e) => {
                log('OTP Resent', e)
              }
            })
          }}
        >
          {FM('resend-otp')}
        </p>
      )}
    </div>
  )
}

const RequestForAccountDelete = () => {
  // ** Hooks
  const { skin } = useSkin()

  const location = useLocation()
  const [loading, setLoading] = useState(false)
  const [successEmail, setSuccessEmail] = useState(false)
  const {
    control,
    handleSubmit,
    formState: { errors },
    register,
    setError,
    reset
  } = useForm()

  const illustration = skin === 'dark' ? 'login-v2-dark.svg' : 'login-v2.svg',
    source = require(`@src/assets/images/pages/${illustration}`).default

  // const onSubmit = data => {
  //     if (Object.values(data).every(field => field.length > 0)) {
  //         useJwt
  //             .login({ email: data.loginEmail, password: data.password })
  //             .then(res => {
  //                 const data = { ...res.data.userData, accessToken: res.data.accessToken, refreshToken: res.data.refreshToken }
  //                 dispatch(handleLogin(data))
  //                 ability.update(res.data.userData.ability)
  //                 navigate(getHomeRouteForLoggedInUser(data.role))
  //                 toast(t => (
  //                     <ToastContent t={t} role={data.role || 'admin'} name={data.fullName || data.username || 'John Doe'} />
  //                 ))
  //             })
  //             .catch(err => console.log(err))
  //     } else {
  //         for (const key in data) {
  //             if (data[key].length === 0) {
  //                 setError(key, {
  //                     type: 'manual'
  //                 })
  //             }
  //         }
  //     }
  // }

  const onSubmit = (d) => {
    if (successEmail) {
      verifyDeleteOtp({
        formData: {
          email: d?.email,
          otp: d?.otp
        },

        error: (e) => {},
        loading: setLoading,
        success: (data) => {
          log('Account delete request', data)
          if (data?.status === 200) {
            SuccessToast(data?.message)
          }
        }
      })
    } else {
      requestDeleteAcc({
        formData: {
          email: d?.email
        },
        error: (e) => {},
        loading: setLoading,
        success: (data) => {
          //     log('Account delete request', data)
          if (data?.status === 200) {
            setSuccessEmail(true)
          }
        }
      })
    }
  }

  //   const handleVerifyOtp = (d) => {
  //     verifyOtp({
  //       formData: {
  //         email: d?.email,
  //         otp: d?.otp
  //       },
  //       error: (e) => {},
  //       loading: setLoading,
  //       success: (data) => {
  //         log('Account delete request', data)
  //         if (data?.status === 200) {
  //           setSuccessEmail(true)
  //         }
  //       }
  //     })
  //   }

  const handleTimeout = () => {
    //  alert('OTP expired')
    // Handle OTP expiration (e.g., reset OTP input, resend OTP, etc.)
  }

  console.log('location', location)

  return (
    <div className='auth-wrapper auth-cover'>
      <Row className='auth-inner m-0'>
        <Link className='brand-logo' to='/' onClick={(e) => e.preventDefault()}>
          <h2 className='brand-text text-primary ms-1 d-flex align-items-center'>
            <img
              style={{ height: 30 }}
              className='img-fluid'
              src={require('../../assets/images/logo/fullLogo.png').default}
            />{' '}
            {/* <h2 className='text-dark ms-1 mt-25'>{themeConfig.app.appName}</h2> */}
          </h2>
        </Link>
        <Col className='d-none d-lg-flex align-items-center p-5' lg='8' sm='12'>
          <div className='w-100 d-lg-flex align-items-center justify-content-center px-5'>
            <img className='img-fluid' src={source} alt='Login Cover' />
          </div>
        </Col>
        <Col className='d-flex align-items-center auth-bg px-2 p-lg-5' lg='4' sm='12'>
          <Col className='px-xl-2 mx-auto' sm='8' md='6' lg='12'>
            <CardTitle tag='h2' className='fw-bold mb-1'>
              {FM('welcome-to')} {themeConfig.app.appName}! 👋
            </CardTitle>
            <Form className='auth-login-form mt-2' onSubmit={handleSubmit(onSubmit)}>
              <Show IF={successEmail}>
                <FormGroupCustom
                  autoFocus
                  type='number'
                  name='otp'
                  label={FM('enter-otp')}
                  feedback={FM('please-enter-a-valid-otp')}
                  className='mb-1'
                  errors={errors}
                  control={control}
                  rules={{
                    required: true,
                    maxLength: 6
                  }}
                />
                <LoadingButton loading={loading} type='submit' color='primary' block>
                  {FM('verify-otp')}
                </LoadingButton>
              </Show>
              <Show IF={!successEmail}>
                <FormGroupCustom
                  autoFocus
                  type='email'
                  name='email'
                  label={FM('email')}
                  feedback={FM('please-enter-a-valid-email-address')}
                  className='mb-1'
                  errors={errors}
                  control={control}
                  rules={{
                    required: true
                    //   maxLength: 6
                  }}
                />
                <LoadingButton loading={loading} type='submit' color='primary' block>
                  {FM('send-otp')}
                </LoadingButton>
              </Show>
            </Form>
          </Col>
        </Col>
      </Row>
    </div>
  )
}

export default RequestForAccountDelete
