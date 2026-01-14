import { Fragment, useState } from 'react'
// import { useForm } from 'react-hook-form'
import InputPasswordToggle from '@components/input-password-toggle'
import { yupResolver } from '@hookform/resolvers/yup'
import { Controller, useForm } from 'react-hook-form'
import { useSelector } from 'react-redux'
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  CardTitle,
  Col,
  Form,
  FormFeedback,
  FormGroup,
  Row
} from 'reactstrap'
import * as yup from 'yup'
import { profileChangePassword, updateSelfPassword } from '../../../utility/apis/appSetting'

const showErrors = (field, valueLen, min) => {
  if (valueLen === 0) {
    return `${field} field is required`
  } else if (valueLen > 0 && valueLen < min) {
    return `${field} must be at least ${min} characters`
  } else {
    return ''
  }
}

const defaultValues = {
  newPassword: '',
  currentPassword: '',
  password_confirmation: ''
}

const Password = () => {
  const [loading, setLoading] = useState(false)
  // const user = useSelector(state => state.auth.userData)
  const user = useSelector((state) => state.auth.userData)

  const SignupSchema = yup.object().shape({
    old_password: yup
      .string()
      .min(6, (obj) => showErrors('Current Password', obj.value.length, obj.min))
      .required(),
    password: yup
      .string()
      .min(6, (obj) => showErrors('New Password', obj.value.length, obj.min))
      .required(),
    password_confirmation: yup
      .string()
      .min(6, (obj) => showErrors('Retype New Password', obj.value.length, obj.min))
      .required()
      .oneOf([yup.ref(`password_confirmation`), null], 'Passwords must match')
  })

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm({
    defaultValues,
    resolver: yupResolver(SignupSchema)
  })

  const onSubmit = (data) => {
    if (user?.userType === 0) {
      profileChangePassword({
        jsonData: {
          ...data
        },
        loading: setLoading,
        success: (d) => {
          // reset()
        }
      })
    } else {
      updateSelfPassword({
        jsonData: {
          ...data
        },
        loading: setLoading,
        success: (d) => {
          // reset()
        }
      })
    }
  }

  return (
    <Fragment>
      <Card>
        <CardHeader className='border-bottom'>
          <CardTitle tag='h4'>Change Password</CardTitle>
        </CardHeader>
        <CardBody className='pt-1'>
          <Form onSubmit={handleSubmit(onSubmit)}>
            <FormGroup>
              <Row>
                <Col md='4'>
                  <Controller
                    control={control}
                    id='old_password'
                    name='old_password'
                    render={({ field }) => (
                      <InputPasswordToggle
                        label='Current Password'
                        htmlFor='old_password'
                        className='input-group-merge'
                        invalid={errors.old_password && true}
                        {...field}
                      />
                    )}
                  />
                  {errors.old_password && (
                    <FormFeedback className='d-block'>{errors.old_password.message}</FormFeedback>
                  )}
                </Col>

                <Col md='4'>
                  <Controller
                    control={control}
                    id='password'
                    name='password'
                    render={({ field }) => (
                      <InputPasswordToggle
                        label='New Password'
                        htmlFor='password'
                        className='input-group-merge'
                        invalid={errors.password && true}
                        {...field}
                      />
                    )}
                  />
                  {errors.password && (
                    <FormFeedback className='d-block'>{errors.password.message}</FormFeedback>
                  )}
                </Col>
                <Col md='4'>
                  <Controller
                    control={control}
                    id='password_confirmation'
                    name='password_confirmation'
                    render={({ field }) => (
                      <InputPasswordToggle
                        label='Retype New Password'
                        htmlFor='password_confirmation'
                        className='input-group-merge'
                        invalid={errors.password_confirmation && true}
                        {...field}
                      />
                    )}
                  />
                  {errors.password_confirmation && (
                    <FormFeedback className='d-block'>
                      {errors.password_confirmation.message}
                    </FormFeedback>
                  )}
                </Col>
                <Col xs={12} className='mt-2'>
                  <p className='fw-bolder'>Password requirements:</p>
                  <ul className='ps-1 ms-25'>
                    <li className='mb-50'>Minimum 6 characters long - the more, the better</li>
                    <li className='mb-50'>Please don't use space</li>
                    {/* <li>At least one number, symbol, or whitespace character</li> */}
                  </ul>
                </Col>
                <Col className='mt-1' sm='12'>
                  <Button type='submit' className='me-1' color='primary'>
                    Save changes
                  </Button>
                </Col>
              </Row>
            </FormGroup>
          </Form>
        </CardBody>
      </Card>
    </Fragment>
  )
}

export default Password
