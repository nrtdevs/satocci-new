import '@styles/react/apps/app-users.scss'

import { useEffect, useReducer } from 'react'
import { useForm } from 'react-hook-form'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { Button, Card, CardBody, CardHeader, Col, Form, Input, Label, Row } from 'reactstrap'

import {
  PermissionsReqParams,
  useLoadPermissionMutation
} from '../../../redux/RTKQuery/PermissionRTK'
import {
  RolePermissionReqParams,
  useCreateOrUpdatePerRoleMutation
} from '../../../redux/RTKQuery/RolesPermissionsRTK'
import { getPath } from '../../../router/RouteHelper'
import { FM, isValid, log } from '../../../utility/helpers/common'
import useUserType from '../../../utility/hooks/useUserType'
import { stateReducer } from '../../../utility/stateReducer'
import { fastLoop } from '../../../utility/Utils'
import LoadingButton from '../../components/buttons/LoadingButton'
import FormGroupCustom from '../../components/formGroupCustom/FormGroupCustom'
import Header from '../../components/header'
import Shimmer from '../../components/shimmers/Shimmer'

interface States {
  loading?: boolean | null
  text?: string | null
  list?: any | null
  active?: string | null
  permissions?: PermissionsReqParams | null
  allPermissions?: any | null
  selectedPermissions?: any | null
  formData?: any | null
  checkedAll?: boolean | null
}

const RolesPermissionForm = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const params = useParams()
  const userType = useUserType()
  const editData: any = location.state

  const form = useForm<RolePermissionReqParams>()
  const { handleSubmit, control, reset, setValue, watch } = form

  const [loadPermission, { data, error, isLoading }] = useLoadPermissionMutation()

  useEffect(() => {
    loadPermission({})
  }, [])

  const initState: States = {
    loading: false,
    active: '1',
    text: '',
    list: [],
    selectedPermissions: []
  }

  const reducers = stateReducer<States>
  const [state, setState] = useReducer(reducers, initState)
  const [createRole, result] = useCreateOrUpdatePerRoleMutation()

  const fetchPermissions = (type: any) => {
    if (isValid(type)) {
      setState({ permissions: null })

      const selected: any = []
      const permission: any = {}
      const resp: any = data?.payload

      fastLoop(resp, (per, i) => {
        if (permission[per?.group_name] === undefined) {
          permission[per?.group_name] = []
        }
        if (per?.entry_mode === 'required') {
          selected.push(per?.id)
        } else {
          if (editData?.permissions) {
            editData?.permissions?.map((p: any) => {
              if (p?.id === per?.id) {
                selected.push(p?.id)
              }
            })
          }
        }
        permission[per?.group_name].push(per)
      })

      setState({ allPermissions: data?.payload, permissions: permission })

      if (editData?.permissions) {
        // setSelectedPermissions([...editData?.permissions?.map((per) => { return per?.id }), ...sel])
        setState({ selectedPermissions: selected })
      }
    }
  }

  useEffect(() => {
    if (data?.payload) {
      fetchPermissions(userType)
    }
  }, [data])

  const onSubmit = (e: RolePermissionReqParams) => {
    if (isValid(editData)) {
      createRole({
        ...editData,
        ...e,
        permissions: state.selectedPermissions,
        user_type_id: userType
      })
    } else {
      createRole({ ...e, permissions: state.selectedPermissions, user_type_id: userType })
    }
  }

  useEffect(() => {
    if (result.isSuccess) {
      navigate(getPath('settings.roles'))
    }
  }, [result])
  useEffect(() => {
    if (editData?.se_name) {
      setValue('se_name', editData?.se_name)
    }
  }, [editData])
  const toggleAllPermission = () => {
    const getIds = state.allPermissions?.map((d: any) => d?.id)
    // log(getIds)
    if (state?.checkedAll) {
      setState({ selectedPermissions: [] })
      setState({ checkedAll: false })
    } else {
      setState({ selectedPermissions: getIds })
      setState({ checkedAll: true })
    }
  }

  const togglePermission = (permission: any) => {
    const i = state.selectedPermissions?.findIndex((p: any) => p === permission?.id)
    if (i === -1) {
      if (permission) {
        setState({ selectedPermissions: [...state.selectedPermissions, permission?.id] })
      }
    } else {
      const per = state.selectedPermissions ?? []
      per.splice(i, 1)

      setState({ selectedPermissions: [...per] })
    }
  }

  const isChecked = (permission: any) => {
    const i = state?.selectedPermissions?.findIndex((p: any) => p === permission?.id)

    if (i !== undefined && i > -1) {
      return true
    } else {
      return false
    }
  }
  const renderPermissions = (per = []) => {
    const re: any = []
    log('per', per)
    if (per) {
      per.forEach((permission: any, index) => {
        re.push(
          <>
            <div className='form-check form-check-inline'>
              <Input
                // disabled={permission?.entry_mode === "required"}
                checked={isChecked(permission)}
                id={permission?.se_name}
                type={'checkbox'}
                onChange={(e) => {
                  togglePermission(permission)
                  log(e)
                }}
              />
              <Label for={permission?.se_name}>{permission?.se_name}</Label>
            </div>
          </>
        )
      })
    }
    return re
  }
  log('permission', state.selectedPermissions)
  const renderGroups = () => {
    const re = []
    if (state.permissions) {
      for (const [key, value] of Object.entries(state.permissions)) {
        re.push(
          <>
            <div className='mb-2'>
              <h5 className='border-bottom pb-1 pt-1 mb-1 text-capitalize'>{key}</h5>
              {renderPermissions(value)}
            </div>
          </>
        )
      }
    }
    return re
  }
  return (
    <>
      <Header
        onClickBack={() => navigate(-1)}
        goBackTo
        title={params?.id ? FM('update-role') : FM('create-role')}
      ></Header>
      {isLoading ? (
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
            <Row className='animate__animated animate__fadeIn'>
              <Col md='8' className='d-flex align-items-stretch'>
                <Card>
                  <CardHeader tag={'h4'}>
                    <h4 className='card-title'>{FM('add-role')}</h4>
                    <Button color='primary' className='round' onClick={toggleAllPermission}>
                      {state.checkedAll ? FM('uncheck-all') : FM('check-all')}
                    </Button>
                  </CardHeader>
                  <CardBody>
                    <h6>{FM('assign-permissions')}</h6>
                    {renderGroups()}
                  </CardBody>
                </Card>
              </Col>
              <Col md='4' className='d-flex align-items-stretch'>
                <Card>
                  <CardHeader tag={'h4'}>{FM('role-name')}</CardHeader>
                  <CardBody>
                    <Row>
                      <Col md='12'>
                        <FormGroupCustom
                          control={control}
                          type={'text'}
                          noLabel
                          placeholder={FM('role-name')}
                          name={'se_name'}
                          rules={{
                            required: true,

                            maxLength: 50
                          }}
                        />
                      </Col>
                    </Row>

                    <LoadingButton
                      block
                      type='submit'
                      className='mt-1'
                      loading={result.isLoading}
                      color='primary'
                    >
                      {FM('save')}
                    </LoadingButton>
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

export default RolesPermissionForm
