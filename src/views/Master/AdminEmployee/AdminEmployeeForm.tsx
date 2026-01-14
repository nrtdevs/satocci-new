/* eslint-disable prettier/prettier */
import '@styles/react/apps/app-users.scss'
import { useEffect, useReducer, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useDispatch } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'
import { Card, CardBody, Col, Form, Row } from 'reactstrap'
import {
    adminEmpReqParams,
    useCreateOrUpdateEmployeeAdminMutation,
    useLoadAdminEmployeeDetailsByIdMutation
} from '../../../redux/RTKQuery/AdminEmployeeRTK'
import { getPath } from '../../../router/RouteHelper'
import { FM, isValid } from '../../../utility/helpers/common'
import { stateReducer } from '../../../utility/stateReducer'
import { fillObject, getUserData, setValues } from '../../../utility/Utils'
import LoadingButton from '../../components/buttons/LoadingButton'
import FormGroupCustom from '../../components/formGroupCustom/FormGroupCustom'
import Header from '../../components/header'
import Shimmer from '../../components/shimmers/Shimmer'

interface States {
    category?: boolean
    subcategory?: boolean
    ip?: boolean
    patient?: boolean
    loading?: boolean
    text?: string
    list?: any
    formData?: any
}

const AdminEmployeeForm = () => {
    const dispatch = useDispatch()

    const user = getUserData()
    const form = useForm<adminEmpReqParams>()
    const params = useParams()
    const id = params?.id
    const navigate = useNavigate()
    const { handleSubmit, control, reset, setValue, watch } = form
    const [loading, setLoading] = useState(false)
    const [createEmployeeAdmin, result] = useCreateOrUpdateEmployeeAdminMutation()

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
            mobile_number: null,
            store_id: null,
            parent_id: null,
            address: null,
            payload: null,
            status: null, // 1: Active 2: Deleted 0: Inactive
            created_at: null,
            updated_at: null,
            deleted_at: null,
            entry_mode: null
        }
    }
    const reducers = stateReducer<States>
    const [state, setState] = useReducer(reducers, initState)
    const [loadAdminEmployeeById, AdminEmployeeData] = useLoadAdminEmployeeDetailsByIdMutation()
    const employeeData = AdminEmployeeData?.data?.payload
    useEffect(() => {
        if (isValid(id)) {
            loadAdminEmployeeById({ id })
        }
    }, [id])

    useEffect(() => {
        if (isValid(employeeData) && employeeData !== undefined) {
            const f = fillObject<adminEmpReqParams>(state.formData, employeeData)
            const formData: adminEmpReqParams = {
                ...f
                // subscription_terms_select_value: {
                //   value: String(storeData.subscription_type),
                //   label:
                //     String(productData) === '1' ? FM('per-transaction') : FM('per-month')
                // }
            }
            //  log(formData)
            setValues<adminEmpReqParams>(formData, setValue)
        }
    }, [employeeData])
    const onSubmit = (e: adminEmpReqParams) => {
        if (isValid(id)) {
            createEmployeeAdmin({ ...employeeData, ...e })
        } else {
            createEmployeeAdmin({
                ...e,
                password: '12345678',
                status: '1',
                store_id: null,
                parent_id: user?.id
            })
        }
    }
    useEffect(() => {
        if (result.isSuccess) {
            //  log('test')
            navigate(getPath('admin.employee'), { state: { reload: true } })
        }
    }, [result])

    return (
        <>
            <Header
                onClickBack={() => navigate(-1)}
                goBackTo
                title={isValid(id) ? FM('update-employee') : <>{FM('create-employee')}</>}
            />
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
                                                <Row>
                                                    <h4 className='mb-1'>
                                                        <>{FM('employee-details')}</>
                                                    </h4>
                                                    <Col md='6'>
                                                        <FormGroupCustom
                                                            label={FM('full-name')}
                                                            name={'name'}
                                                            type={'text'}
                                                            className='mb-2'
                                                            control={control}
                                                            rules={{ required: true }}
                                                        />
                                                    </Col>
                                                    {/* <Col md='6'>
                            <FormGroupCustom
                              label={FM('personal-number')}
                              name={'personal_number'}
                              type={'number'}
                              className='mb-2'
                              control={control}
                              rules={{ required: true, maxLength: 12, minLength: 9 }}
                            />
                          </Col> */}
                                                    <Col md='6'>
                                                        <FormGroupCustom
                                                            label={FM('mobile-number')}
                                                            name={'mobile_number'}
                                                            type={'number'}
                                                            className='mb-2'
                                                            control={control}
                                                            rules={{ required: true, maxLength: 12, minLength: 9 }}
                                                        />
                                                    </Col>

                                                    <Col md='6'>
                                                        <FormGroupCustom
                                                            name={'email'}
                                                            type={'email'}
                                                            label={FM('email-address')}
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
                                                {/* <Col md='12'>
                          <FormGroupCustom
                            label={FM('employee-role')}
                            type={'select'}
                            control={control}
                            selectOptions={[
                              {
                                value: 1,
                                label: FM('manager')
                              },
                              {
                                value: 2,
                                label: FM('accountant')
                              }
                            ]}
                            name='role_id'
                            className='mb-1'
                            rules={{ required: true }}
                          />
                        </Col> */}
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
                                                <Col sm='12' className='border-top'>
                                                    <LoadingButton
                                                        block
                                                        loading={result.isLoading}
                                                        className='mt-2'
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

export default AdminEmployeeForm
