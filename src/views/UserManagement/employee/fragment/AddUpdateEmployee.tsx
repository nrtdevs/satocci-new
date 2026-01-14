/* eslint-disable prettier/prettier */
import { useEffect, useReducer, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate, useParams } from 'react-router-dom'
import { Card, CardBody, Col, Form, Row } from 'reactstrap'
import {
  useCreateOrUpdateEmployeeMutation,
  useLoadEmployeeDetailsByIdMutation
} from '../../../../redux/RTKQuery/EmployeeRTK'
import { getPath } from '../../../../router/RouteHelper'
import { Patterns, UserType, epmType, forDecryption } from '../../../../utility/Const'
import Hide from '../../../../utility/Hide'
import RandomNames from '../../../../utility/RandomNames'
import {
  JsonParseValidate,
  createConstSelectOptions,
  decryptObject,
  fillObject,
  getAge,
  getKeyByValue,
  getRandomInRange,
  getUserData,
  setInputErrors,
  setValues
} from '../../../../utility/Utils'
import { loadDropdown } from '../../../../utility/apis/dropdowns'
import { FM, isValid, log } from '../../../../utility/helpers/common'
import useUserType from '../../../../utility/hooks/useUserType'
import ApiEndpoints from '../../../../utility/http/ApiEndpoints'
import { stateReducer } from '../../../../utility/stateReducer'
import LoadingButton from '../../../components/buttons/LoadingButton'
import FormGroupCustom from '../../../components/formGroupCustom/FormGroupCustom'
import Header from '../../../components/header'
import Shimmer from '../../../components/shimmers/Shimmer'
import Show from '../../../../utility/Show'
export type EmployeeParamType = {
  id?: any | null
  name?: string | null
  user_type?: any
  user_type_id?: any
  email?: string | null
  password?: any | null
  mobile_number?: any | null
  personal_number?: any | null
  store_id?: any | null
  parent_id?: any | null
  country?: any
  currency?: any
  category_id?: any | null
  address?: string | null
  role?: any
  city?: any
  postal_area?: any
  payload?: any
  status?: 1 | 0 | 2 | string | null // 1: Active 2: Deleted 0: Inactive
  created_at?: string | null
  updated_at?: string | null
  deleted_at?: string | null
  entry_mode?: any | null
  unique_id?: any | null
  zip_code?: any | null
  roles?: any | null
  key?: any | null
  allow_return_and_refunds?: boolean
  days_for_return?: any | null
}
interface States {
  category?: boolean
  subcategory?: boolean
  ip?: boolean
  patient?: boolean
  loading?: boolean
  text?: string
  list?: any
  formData?: EmployeeParamType
  employee_role_only?: any | null
}
const AddUpdateForm = () => {
  const user = getUserData()
  const userType = useUserType()
  const form = useForm<EmployeeParamType>()
  const navigate = useNavigate()
  const params = useParams()

  const id = params?.id
  const { handleSubmit, control, reset, setValue, watch, setError } = form
  const [loading, setLoading] = useState(false)
  const [createEmployee, result] = useCreateOrUpdateEmployeeMutation()
  const initState: States = {
    category: false,
    subcategory: false,
    ip: false,
    patient: false,
    loading: false,
    text: '',
    list: [],
    formData: {
      id: null,
      name: null,
      email: null,
      password: null,
      personal_number: null,
      mobile_number: null,
      store_id: null,
      parent_id: null,
      address: null,
      payload: null,
      status: null,
      created_at: null,
      updated_at: null,
      deleted_at: null,
      entry_mode: null,
      key: null,
      allow_return_and_refunds: false,
      days_for_return: null
    }
  }
  const options = { delimiters: ['-'], blocks: [8, 4], numericOnly: true }
  const reducers = stateReducer<States>
  const [state, setState] = useReducer(reducers, initState)
  const [loadEmployeeById, EmployeeData] = useLoadEmployeeDetailsByIdMutation()
  const employeeData = EmployeeData?.data?.payload

  log('empl', employeeData?.error)

  useEffect(() => {
    if (isValid(id)) {
      loadEmployeeById({ id })
    }
  }, [id])

  useEffect(() => {
    if (isValid(employeeData) && employeeData !== undefined) {
      const f = fillObject<EmployeeParamType>(state.formData, employeeData)
      const country = JsonParseValidate(employeeData?.country)
      const formData: EmployeeParamType = {
        ...decryptObject(forDecryption, f),
        postal_area: employeeData?.postal_area,
        zip_code: employeeData?.zip_code,
        city: employeeData?.city,
        country: {
          value: employeeData?.country?.id,
          label: employeeData?.country?.name
        },
        user_type: {
          value: Number(employeeData?.user_type_id),
          label: getKeyByValue(epmType, Number(employeeData?.user_type_id))
        },
        role: {
          label: employeeData?.roles[0]?.se_name,
          value: employeeData?.roles[0]?.id
        },
        allow_return_and_refunds: employeeData?.allow_return_and_refunds
        // days_for_return: employeeData?.days_for_return
      }
      setValues<EmployeeParamType>(formData, setValue)
    }
  }, [employeeData])

  const onSubmit = (e: EmployeeParamType) => {
    if (isValid(id)) {
      createEmployee({
        ...employeeData,
        ...e,
        parent_id: user?.store_id,
        currency: userType === UserType.Store ? user?.store_setting?.currency : user?.currency,
        status: '1',
        mobile_number: e?.mobile_number,
        user_type_id:
          employeeData?.user_type_id === UserType.Employee ? UserType.Employee : UserType.GateGuard,
        country: e?.country?.label,
        role: employeeData?.user_type_id === epmType.gateGuard ? epmType.gateGuard : e?.role?.value,
        personal_number: String(e?.personal_number).replaceAll('-', ''),
        allow_return_and_refunds: e?.allow_return_and_refunds

        // days_for_return: e?.days_for_return
      })
    } else {
      createEmployee({
        ...e,
        password: '12345678',
        currency: userType === UserType.Store ? user?.store_setting?.currency : user?.currency,
        parent_id: isValid(user?.store_id) ? user?.store_id : 'null',
        user_type_id: userType === UserType.Admin ? UserType.Employee : e?.user_type?.value,
        status: '1',
        country: e?.country?.label,
        mobile_number: e?.mobile_number,
        role: e?.user_type?.value === epmType.gateGuard ? epmType.gateGuard : e?.role?.value,
        personal_number: String(e?.personal_number).replaceAll('-', ''),
        allow_return_and_refunds: e?.allow_return_and_refunds

        // days_for_return: e?.days_for_return
      })
    }
  }
  useEffect(() => {
    if (result.isSuccess) {
      navigate(getPath('store.employee'), { state: { reload: true } })
    }
  }, [result])

  useEffect(() => {
    if (result?.isError) {
      const e: any = result?.error
      setInputErrors(e?.data?.payload, setError)
    }
  }, [result?.isError])

  useEffect(() => {
    setValue('user_type', {
      label: getKeyByValue(epmType, 3),
      value: 3
    })
  }, [])

  return (
    <>
      <Header
        onClickBack={() => navigate(-1)}
        goBackTo
        title={isValid(id) ? FM('update-employee') : <>{FM('create-employee')}</>}
      >
        {/* <Button onClick={generateRandomData}>Test</Button> */}
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
            <Row>
              <Col md='8' className='d-flex align-items-stretch'>
                <Card>
                  <CardBody>
                    {
                      <>
                        <Row className='border-bottom'>
                          <h4 className='mb-1 '>
                            <>{FM('employee-details')}</>
                          </h4>

                          <Col md='6'>
                            <FormGroupCustom
                              label={FM('full-name')}
                              name={'name'}
                              type={'text'}
                              className='mb-2'
                              control={control}
                              rules={{ required: true, maxLength: 50 }}
                            />
                          </Col>
                          <Col md='6'>
                            {/* <FormGroupCustom
                              label={FM('personal-number')}
                              name={'personal_number'}
                              type={'number'}
                              className='mb-2'
                              control={control}
                              rules={{ required: true, maxLength: 12, minLength: 9 }}
                            /> */}
                            <FormGroupCustom
                              name={'personal_number'}
                              type={'date'}
                              label={FM('date-of-birth')}
                              maskOptions={options}
                              feedback={FM('date-of-birth')}
                              className='mb-2'
                              placeholder={FM('date-of-birth')}
                              control={control}
                              rules={{
                                required: true
                                // minLength: 13,
                                // validate: (v) => {
                                //     //log('gjhfghfh')
                                //     log(v, 'v')
                                //     // return false
                                //     return (
                                //         getAge(v, FM, true) &&
                                //         String(v).replaceAll('-', '').length === 12
                                //     )
                                // }
                              }}
                            />
                          </Col>
                          <Col md='6'>
                            <FormGroupCustom
                              label={FM('mobile-number')}
                              name={'mobile_number'}
                              type={'number'}
                              className='mb-2'
                              control={control}
                              rules={{ required: true, minLength: 9, maxLength: 13, min: 0 }}
                            />
                          </Col>
                          <Col md='6'>
                            <FormGroupCustom
                              name={'email'}
                              type={'email'}
                              label={FM('email-address')}
                              className='mb-2'
                              control={control}
                              rules={{ required: true, pattern: Patterns.EmailOnly }}
                            />
                          </Col>
                        </Row>
                        <Row className='mt-1'>
                          <h4 className='mb-1'>
                            <>{FM('address')}</>
                          </h4>
                          <Col md='6'>
                            <FormGroupCustom
                              label={FM('country')}
                              placeholder={FM('country')}
                              //   noLabel
                              async
                              isClearable
                              path={ApiEndpoints.get_countries}
                              selectLabel='name'
                              selectValue={'id'}
                              defaultOptions
                              loadOptions={loadDropdown}
                              name={`country`}
                              type={'select'}
                              className='mb-0'
                              control={control}
                              rules={{ required: true }}
                              //   prepend={<InputGroupText>{FM('get')}</InputGroupText>}
                              //   append={<InputGroupText>{FM('item')}</InputGroupText>}
                            />
                          </Col>
                          <Col md='6'>
                            <FormGroupCustom
                              label={FM('city')}
                              name={'city'}
                              type={'text'}
                              className='mb-2'
                              control={control}
                              rules={{ required: false }}
                            />
                          </Col>
                          <Col md='6'>
                            <FormGroupCustom
                              name={'postal_area'}
                              label={FM('postal-area')}
                              type={'text'}
                              className='mb-2'
                              control={control}
                              rules={{ required: false }}
                            />
                          </Col>
                          <Col md='6'>
                            <FormGroupCustom
                              label={FM('zip-code')}
                              name={'zip_code'}
                              type={'number'}
                              className='mb-2'
                              control={control}
                              rules={{ required: false, min: 0, minLength: 4, maxLength: 7 }}
                            />
                          </Col>
                          <Col md='12'>
                            <FormGroupCustom
                              name={'address'}
                              type={'textarea'}
                              label={FM('street-address')}
                              className='mb-2'
                              control={control}
                              rules={{ required: true }}
                            />
                          </Col>
                        </Row>
                      </>
                    }
                  </CardBody>
                </Card>
              </Col>
              <Col md='4' className='d-flex align-items-stretch'>
                <Card>
                  <CardBody>
                    {
                      <Row>
                        <Hide IF={isValid(employeeData?.id) || userType === UserType.Admin}>
                          <Col md='12'>
                            <FormGroupCustom
                              name='user_type'
                              type={'select'}
                              label={FM('user-type')}
                              className='mb-1'
                              control={control}
                              // message={FM('select-discount-type-fixed-or-percentage')}
                              selectOptions={createConstSelectOptions(epmType, FM)}
                              rules={{ required: true }}
                            />
                          </Col>
                        </Hide>

                        <Hide
                          IF={
                            watch('user_type')?.value === epmType.gateGuard ||
                            employeeData?.user_type_id === epmType.gateGuard
                          }
                        >
                          <Col md='12'>
                            <FormGroupCustom
                              label={FM('employee-role')}
                              name={'role'}
                              type={'select'}
                              className='mb-1'
                              path={ApiEndpoints.role_list}
                              selectLabel='se_name'
                              selectValue={'id'}
                              async
                              jsonData={{
                                employee_role_only: 'yes'
                              }}
                              defaultOptions
                              loadOptions={loadDropdown}
                              // id='positionTop'
                              isClearable
                              control={control}
                              rules={{
                                required: true
                              }}
                            />
                          </Col>
                        </Hide>
                        <Col md='12'>
                          <FormGroupCustom
                            tooltip={FM('visible-allow-return')}
                            name={'allow_return_and_refunds'}
                            label={FM('visible-allow-return')}
                            type={'checkbox'}
                            className='mb-1'
                            control={control}
                            rules={{ required: false }}
                          />
                        </Col>

                        <Col sm='12' className='border-top'>
                          <LoadingButton
                            block
                            loading={result.isLoading}
                            className='mt-1'
                            color='primary'
                            type='submit'
                          >
                            {isValid(id) ? FM('update') : FM('save')}
                          </LoadingButton>
                        </Col>
                      </Row>
                    }
                  </CardBody>
                </Card>
              </Col>
            </Row>
          </Form>
        </>
      )}
    </>
  )
}

export default AddUpdateForm
