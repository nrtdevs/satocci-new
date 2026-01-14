// ** React Imports
import { Link, useNavigate, useParams } from 'react-router-dom'

// ** Custom Hooks
import { useSkin } from '@hooks/useSkin'

// ** Icons Imports
import { ChevronLeft } from 'react-feather'

// ** Custom Components

// ** Reactstrap Imports
import { CardText, CardTitle, Col, Form, Row } from 'reactstrap'

// ** Styles
import '@styles/react/pages/page-authentication.scss'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import themeConfig from '../../configs/themeConfig'
import { resetPassword } from '../../utility/apis/authentication'
import { Patterns } from '../../utility/Const'
import { isObjEmpty } from '../../utility/Utils'
import LoadingButton from '../components/buttons/LoadingButton'
import FormGroupCustom from '../components/formGroupCustom'
import { FM, log } from '../../utility/helpers/common'

const ResetPasswordCover = () => {
  // ** Hooks
  const token = useParams()
  const {
    formState: { errors },
    handleSubmit,
    control,
    watch
  } = useForm()
  const { skin } = useSkin()
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const onSubmit = (formData) => {
    if (isObjEmpty(errors)) {
      resetPassword({
        formData: { ...formData, ...token },
        loading: setLoading,
        success: (e) => {
          log(e)

          navigate('/authentication')
        }
      })
    }
  }

  const illustration = skin === 'dark' ? 'reset-password-v2-dark.svg' : 'reset-password-v2.svg',
    source = require(`@src/assets/images/pages/${illustration}`).default

  return (
    <div className='auth-wrapper auth-cover'>
      <Row className='auth-inner m-0'>
        <Link className='brand-logo' to='/' onClick={(e) => e.preventDefault()}>
          <h2 className='brand-text text-primary ms-1'>
            <img
              style={{ height: 30 }}
              className='img-fluid'
              src={require('../../assets/images/logo/fullLogo.png').default}
            />{' '}
            {/* {themeConfig.app.appName} */}
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
              {FM('reset-password')} 🔒
            </CardTitle>
            <CardText className='mb-2'>
              {FM('your-new-password-must-be-different-from-previously-used-passwords')}
            </CardText>

            <Form className='auth-reset-password-form mt-2' onSubmit={handleSubmit(onSubmit)}>
              {/* <FormGroupCustom
                                type={"hidden"}
                                name={"email"}
                                errors={errors}
                                control={control}
                                feedback= 'please enter valid email'
                                className='mb-1'
                                rules={{ required: true }}
                            /> */}
              <FormGroupCustom
                type={'password'}
                name={'password'}
                errors={errors}
                label={FM('password')}
                control={control}
                message={FM('please-enter-password-more-than-6-character')}
                className='mb-1'
                rules={{ required: true, pattern: Patterns.Password }}
              />
              <FormGroupCustom
                type={'password'}
                name={'password_confirmation'}
                errors={errors}
                control={control}
                label={FM('confirm-password')}
                message={FM('please-enter-password-more-than-6-character')}
                className='mb-2'
                rules={{
                  required: true,
                  pattern: Patterns.Password,
                  validate: (value) => value === watch('password')
                }}
              />
              <LoadingButton loading={loading} color='primary' type='submit' block>
                {FM('set-new-password')}
              </LoadingButton>
            </Form>

            {/* <Form className='auth-res       et-password-form mt-2' onSubmit={e => e.preventDefault()}>
              <div className='mb-1'>
                <Label className='form-label' for='new-password'>
                  New Password
                </Label>
                <InputPassword className='input-group-merge' id='new-password' autoFocus />
              </div>
              <div className='mb-1'>
                <Label className='form-label' for='confirm-password'>
                  Confirm Password
                </Label>
                <InputPassword className='input-group-merge' id='confirm-password' />
              </div>
              <Button color='primary' block>
                Set New Password
              </Button>
            </Form> */}
            <p className='text-center mt-2'>
              <Link to='/authentication'>
                <ChevronLeft className='rotate-rtl me-25' size={14} />
                <span className='align-middle'>{FM('back-to-login')}</span>
              </Link>
            </p>
          </Col>
        </Col>
      </Row>
    </div>
  )
}

export default ResetPasswordCover
