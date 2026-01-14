/* eslint-disable no-dupe-else-if */
/* eslint-disable no-mixed-operators */
import { useEffect, useReducer, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate, useParams } from 'react-router-dom'
import StickyBox from 'react-sticky-box'
import { Card, CardBody, CardHeader, CardTitle, Col, Form, Row } from 'reactstrap'
import {
  useCreateOrUpdateEmailTemplateMutation,
  useLoadEmailTemplateDetailsByIdMutation
} from '../../../redux/RTKQuery/EmailTemplateRTK'
import { useAppDispatch } from '../../../redux/store'
import { statusCode } from '../../../utility/Const'
import { FM, isValid } from '../../../utility/helpers/common'
import useUserType from '../../../utility/hooks/useUserType'
import RandomNames from '../../../utility/RandomNames'
import { stateReducer } from '../../../utility/stateReducer'
import { createConstSelectOptions, getUserData, SuccessToast } from '../../../utility/Utils'
import LoadingButton from '../../components/buttons/LoadingButton'
import FormGroupCustom from '../../components/formGroupCustom/FormGroupCustom'
import Header from '../../components/header'
import Shimmer from '../../components/shimmers/Shimmer'

export type EmailSmsParamsType = {
  id?: any | null
  payload?: any
  notification_for?: any | null //1
  status_code?: any | null //1
  mail_subject?: any | null ///1
  mail_body?: any | null ///1
  notification_body?: any | null //1
  notification_subject?: any | null //1
  custom_attributes?: any | null //1
  route_path?: any | null //1
  save_to_database?: any //1
}
interface States {
  lastRefresh?: any
  category?: boolean
  random?: any
  subcategory?: boolean
  ip?: boolean
  patient?: boolean
  loading?: boolean
  text?: string
  list?: any
  active?: string
  formData?: EmailSmsParamsType
}

const EmailTemplateForm = () => {
  const userType = useUserType()
  const user = getUserData()
  const dispatch = useAppDispatch()
  const nav = useNavigate()
  const params = useParams()
  const form = useForm<EmailSmsParamsType>()
  const { handleSubmit, control, reset, setValue, watch } = form
  const [loading, setLoading] = useState(false)
  //log('user settings', user)
  const initState: States = {
    lastRefresh: new Date().getTime(),
    category: false,
    random: null,
    subcategory: false,
    ip: false,
    patient: false,
    loading: false,
    text: '',
    list: [],
    active: '1',
    formData: {
      id: null,
      notification_for: null,
      mail_subject: null,
      mail_body: null,
      notification_subject: null,
      notification_body: null,
      custom_attributes: null,
      save_to_database: false,
      status_code: null,
      route_path: null
    }
  }

  const reducers = stateReducer<States>
  const [state, setState] = useReducer(reducers, initState)

  //   const { data: a, error, isLoading } = useLoadStoresQuery({ page: 1, per_page_record: 15 })

  //   log(a, error, isLoading)

  const [createMail, result] = useCreateOrUpdateEmailTemplateMutation()
  const [getNotification, { data, isSuccess, isLoading }] =
    useLoadEmailTemplateDetailsByIdMutation()
  // const [useCreateSubStore, result] = useCreateOrUpdateSubStoreMutation()
  const getData: any = data?.payload
  useEffect(() => {
    if (result.isSuccess) {
      // log('test')
      SuccessToast(FM('executed-successfully'))
      reset()
    }
  }, [result])
  useEffect(() => {
    if (isValid(params?.id)) {
      getNotification({ id: params?.id })
    }
  }, [params?.id])

  useEffect(() => {
    if (isSuccess) {
      const formData: EmailSmsParamsType = {
        ...getData,
        status_code: { value: getData?.status_code, label: getData?.status_code }
      }
      for (const key in formData) {
        type OnlyKeys = keyof typeof formData
        const k = key as OnlyKeys
        if (Object.prototype.hasOwnProperty.call(formData, key)) {
          // if (k !== 'subscription_terms') {
          const value = formData[k]
          setValue(k, value)
          // }
        }
      }
    }
  }, [isSuccess])
  // useEffect(() => {
  //   if (isValid(employeeData) && employeeData !== undefined) {
  //     const f = fillObject<EmployeeParamType>(state.formData, employeeData)
  //     const formData: EmployeeParamType = {
  //       ...f,
  //       postal_area: employeeData?.postal_area,
  //       zip_code: employeeData?.zip_code,
  //       city: employeeData?.city
  //     }
  //     setValues<EmployeeParamType>(formData, setValue)
  //   }
  // }, [isSuccess])

  const generateRandomData = () => {
    // let formData: EmailSmsParamsType = {}
    const name = RandomNames()
    const description = RandomNames(5, true)
    const noSpaceStoreName = String(name).replaceAll(' ', '_').toLowerCase()
    const AllformData: EmailSmsParamsType = {
      mail_subject: `${name}`,

      notification_for: ` please follow the  ${name}`,
      mail_body: `dear user ${name} your email is order number ${name}`,
      notification_subject: `regarding your ${name}`,
      notification_body: `dear ${description} your mail notification from ${name}`,
      custom_attributes: `${noSpaceStoreName}`
      // route_path: '{{url}}'
    }
    for (const key in AllformData) {
      type OnlyKeys = keyof typeof AllformData
      const k = key as OnlyKeys
      if (Object.prototype.hasOwnProperty.call(AllformData, key)) {
        // if (k !== 'subscription_terms') {
        const value = AllformData[k]
        setValue(k, value)
        // }
      }
    }
  }

  const onSubmit = (e: EmailSmsParamsType) => {
    if (isValid(params?.id)) {
      createMail({
        ...e,
        // ...getData,
        id: params?.id,
        save_to_database: `${e?.save_to_database}` === '1',
        status_code: e?.status_code?.value
      })
    } else {
      createMail({
        ...e,
        save_to_database: `${e?.save_to_database}` === '1',
        status_code: e?.status_code?.value
      })
    }
  }

  useEffect(() => {
    if (result?.isSuccess) {
      nav(-1)
    }
  }, [result?.isSuccess])

  const isEdit = !isSuccess
  return (
    <>
      <Header onClickBack={() => nav(-1)} goBackTo title={<>{FM('notification-template')}</>}>
        {/* <ButtonGroup>
          <Button onClick={generateRandomData}>Test</Button>
        </ButtonGroup> */}
      </Header>
      {loading ? (
        <>
          <Row>
            <Col md='8' className='d-flex align-items-stretch'>
              <Card>
                <CardBody>
                  <Row>
                    <Col md='6'>
                      <Shimmer style={{ height: 40 }} />
                    </Col>
                    <Col md='6'>
                      <Shimmer style={{ height: 40 }} />
                    </Col>
                    <Col md='12' className='mt-2'>
                      <Shimmer style={{ height: 320 }} />
                    </Col>
                  </Row>
                </CardBody>
              </Card>
            </Col>
            <Col md='4' className='d-flex align-items-stretch'>
              <Card>
                <CardBody>
                  <Row>
                    <Col md='12'>
                      <Shimmer style={{ height: 40 }} />
                    </Col>
                    <Col md='12' className='mt-2'>
                      <Shimmer style={{ height: 320 }} />
                    </Col>
                  </Row>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </>
      ) : (
        <>
          <Form onSubmit={handleSubmit(onSubmit)}>
            <Row style={{ display: 'flex', alignItems: 'flex-start' }}>
              <Col md='8' className=''>
                <Card>
                  <CardHeader className='border-bottom'>
                    <CardTitle>{FM('notification')}</CardTitle>
                  </CardHeader>
                  <CardBody className='pt-2'>
                    <Row>
                      <Col md='6'>
                        <FormGroupCustom
                          name={'notification_subject'}
                          label={FM('notification-subject')}
                          type={'textarea'}
                          className='mb-2'
                          control={control}
                          rules={{ required: isEdit }}
                        />
                      </Col>
                      <Col md='6'>
                        <FormGroupCustom
                          //   message={FM('powered-by-google')}
                          name={'notification_body'}
                          type={'textarea'}
                          label={FM('notification-body')}
                          className='mb-2'
                          control={control}
                          rules={{ required: isEdit }}
                        />
                      </Col>
                    </Row>
                  </CardBody>
                </Card>
                <Card>
                  <CardHeader className='border-bottom'>
                    <CardTitle>{FM('email')}</CardTitle>
                  </CardHeader>
                  <CardBody className='pt-2'>
                    <Row>
                      <Col md='6'>
                        <FormGroupCustom
                          name={'mail_subject'}
                          label={FM('mail-subject')}
                          type={'textarea'}
                          className='mb-2'
                          control={control}
                          rules={{ required: isEdit }}
                        />
                      </Col>
                      <Col md='6'>
                        <FormGroupCustom
                          name={'mail_body'}
                          type={'textarea'}
                          label={FM('mail-body')}
                          className='mb-2'
                          control={control}
                          rules={{ required: isEdit }}
                        />
                      </Col>
                    </Row>
                  </CardBody>
                </Card>
                <Card>
                  <CardHeader className='border-bottom'>
                    <CardTitle>{FM('attributes')}</CardTitle>
                  </CardHeader>
                  <CardBody className='pt-2'>
                    <Row>
                      <Col>
                        <FormGroupCustom
                          name={'custom_attributes'}
                          type={'textarea'}
                          label={FM('custom-attributes')}
                          className='mb-2'
                          control={control}
                          rules={{ required: isEdit }}
                        />
                      </Col>
                    </Row>
                  </CardBody>
                </Card>
              </Col>

              <StickyBox className='col-md-4' offsetBottom={50}>
                <Card>
                  <CardBody className='pt-2'>
                    <Row>
                      <Col md='12'>
                        <FormGroupCustom
                          name={'notification_for'}
                          label={FM('notification-for')}
                          type={'text'}
                          className='mb-2'
                          control={control}
                          rules={{ required: isEdit }}
                        />
                      </Col>

                      <Col md='12'>
                        <FormGroupCustom
                          name={'status_code'}
                          type={'select'}
                          isClearable
                          label={FM('status')}
                          className='mb-2'
                          selectOptions={createConstSelectOptions(statusCode, FM)}
                          control={control}
                          rules={{ required: isEdit }}
                        />
                      </Col>

                      <Col md='12'>
                        <FormGroupCustom
                          label={FM('route-path')}
                          name={'route_path'}
                          type={'text'}
                          // message={""}
                          className='mb-2'
                          control={control}
                          rules={{ required: false }}
                        />
                      </Col>
                      <Col md='12'>
                        <FormGroupCustom
                          label={FM('save-to-database')}
                          name={'save_to_database'}
                          type={'checkbox'}
                          className='mb-2'
                          control={control}
                          rules={{ required: false }}
                        />
                      </Col>
                    </Row>
                  </CardBody>
                </Card>

                <Col sm='12' className='border-top'>
                  <LoadingButton
                    block
                    loading={result.isLoading}
                    className='mt-2 mb-3'
                    color='primary'
                    type='submit'
                  >
                    <>{FM('save')}</>
                  </LoadingButton>
                </Col>
              </StickyBox>
              {/* </Col> */}
            </Row>
          </Form>
        </>
      )}
    </>
  )
}

export default EmailTemplateForm
