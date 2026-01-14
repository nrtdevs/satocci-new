// ** React Imports
import { useContext, useState } from 'react'
import { Link, useNavigate, useNavigation } from 'react-router-dom'

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
import { login } from '../../utility/apis/authentication'
import { FM, isValidArray } from '../../utility/helpers/common'
import { useRTL } from '../../utility/hooks/useRTL'
import LoadingButton from '../components/buttons/LoadingButton'
import FormGroupCustom from '../components/formGroupCustom'

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

const Login = () => {
  // ** Hooks
  const { skin } = useSkin()
  const [isRtl, setValue] = useRTL()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { i18n } = useTranslation()

  const [data, setData] = useState(null)
  const ability = useContext(AbilityContext)
  const [loading, setLoading] = useState(false)
  const {
    control,
    handleSubmit,
    formState: { errors },
    register,
    setError
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
    // if (isObjEmpty(errors)) {
    login({
      formData: {
        ...d
      },
      redirect: true,
      error: (e) => {},
      loading: setLoading,
      success: (user) => {
        if (isValidArray(user?.payload?.languages)) {
          const lang = user?.payload?.languages[0]
          if (lang.mode === '2') {
            setValue(true)
          } else {
            setValue(false)
          }
          i18n.changeLanguage(String(lang?.id))
        }
      },
      dispatch,
      ability,
      navigate
    })
    // }
  }

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
            {/* <CardText className='mb-2'>Please sign-in to your account and start the adventure</CardText>
            <Alert color='primary'>
              <div className='alert-body font-small-2'>
                <p>
                  <small className='me-50'>
                    <span className='fw-bold'>Admin:</span> admin@demo.com | admin
                  </small>
                </p>
                <p>
                  <small className='me-50'>
                    <span className='fw-bold'>Client:</span> client@demo.com | client
                  </small>
                </p>
              </div>
              <HelpCircle
                id='login-tip'
                className='position-absolute'
                size={18}
                style={{ top: '10px', right: '10px' }}
              />
              <UncontrolledTooltip target='login-tip' placement='left'>
                This is just for ACL demo purpose.
              </UncontrolledTooltip> 
            </Alert> */}
            <Form className='auth-login-form mt-2' onSubmit={handleSubmit(onSubmit)}>
              <FormGroupCustom
                autoFocus
                type='email'
                name='email'
                label={FM('email')}
                feedback={FM('please-enter-a-valid-email')}
                // className='mb-1'
                errors={errors}
                control={control}
                rules={{
                  required: true
                }}
              />
              <div className='d-flex justify-content-end'>
                {/* <Label className='form-label' for='login-password'>
                  Password
                </Label> */}

                <Link to={getPath('auth.forgotPassword')}>
                  <small>{FM('forgot-password')}</small>
                </Link>
              </div>

              <FormGroupCustom
                // noLabel
                // autoFocus
                type='password'
                name='password'
                label={FM('password')}
                feedback={FM('please-enter-a-valid-password')}
                className='mb-1'
                errors={errors}
                control={control}
                rules={{ required: true }}
              />

              <LoadingButton loading={loading} type='submit' color='primary' block>
                {FM('sign-in')}
              </LoadingButton>
            </Form>
            {/* <Form className='auth-login-form mt-2' onSubmit={handleSubmit(onSubmit)}>
                            <div className='mb-1'>
                                <Label className='form-label' for='login-email'>
                                    Email
                                </Label>
                                <Controller
                                    id='loginEmail'
                                    name='loginEmail'
                                    control={control}
                                    render={({ field }) => (
                                        <Input
                                            autoFocus
                                            type='email'
                                            placeholder='john@example.com'
                                            invalid={errors.loginEmail && true}
                                            {...field}
                                        />
                                    )}
                                />
                            </div>
                            <div className='mb-1'>
                                <div className='d-flex justify-content-between'>
                                    <Label className='form-label' for='login-password'>
                                        Password
                                    </Label>
                                    <Link to={getPath("forgotPassword")}>
                                        <small>Forgot Password?</small>
                                    </Link>
                                </div>
                                <Controller
                                    id='password'
                                    name='password'
                                    control={control}
                                    render={({ field }) => (
                                        <InputPasswordToggle className='input-group-merge' invalid={errors.password && true} {...field} />
                                    )}
                                />
                            </div>
                            <div className='form-check'>
                                
                            </div>
                            <Button type='submit' color='primary' block>
                                Sign in
                            </Button>
                        </Form> */}
            {/* <p className='text-center mt-2'>
              <span className='me-25'>New on our platform?</span>
              <Link to='/register'>
                <span>Create an account</span>
              </Link>
            </p>
            <div className='divider my-2'>
              <div className='divider-text'>or</div>
            </div> */}
            {/* <div className='auth-footer-btn d-flex justify-content-center'>
              <Button color='facebook'>
                <Facebook size={14} />
              </Button>
              <Button color='twitter'>
                <Twitter size={14} />
              </Button>
              <Button color='google'>
                <Mail size={14} />
              </Button>
              <Button className='me-0' color='github'>
                <GitHub size={14} />
              </Button>
            </div> */}
          </Col>
        </Col>
      </Row>
    </div>
  )
}

export default Login
