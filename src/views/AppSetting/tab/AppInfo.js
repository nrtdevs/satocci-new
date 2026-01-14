import ContentCopyIcon from '@mui/icons-material/ContentCopy'
import { useEffect, useRef, useState } from 'react'
import { Plus, Trash2 } from 'react-feather'
import { useForm } from 'react-hook-form'
import { useDispatch } from 'react-redux'
import { Card, CardHeader, Col, Form, Row, Table } from 'reactstrap'
import { ipDelete } from '../../../redux/reducers/ip'
import { addIp, deleteIp, loadIp } from '../../../utility/apis/IpList'
import { enableApiSecurity, userChangeApi } from '../../../utility/apis/userManagement'
import ConfirmAlert from '../../../utility/helpers/ConfirmAlert'
import { formatDate } from '../../../utility/Utils'
import LoadingButton from '../../components/buttons/LoadingButton'
import FormGroupCustom from '../../components/formGroupCustom'
import Shimmer from '../../components/shimmers/Shimmer'
import BsTooltip from '../../components/tooltip'

const AppInfo = () => {
  const [loading, setLoading] = useState(false)
  const [api, setApi] = useState(null)
  const form = useForm()
  const [ip, setIp] = useState(null)
  const [loadingSet, setLoadingSet] = useState(false)
  const [deleted, setDeleted] = useState(false)
  const [failed, setFailed] = useState(false)
  const {
    formState: { errors },
    handleSubmit,
    control,
    reset,
    setValue,
    watch,
    getValues
  } = form
  const [deletedId, setDeletedId] = useState(null)

  const dispatch = useDispatch()
  const [count, setCount] = useState(1)

  const increaseCount = () => {
    setCount(count + 1)
  }

  // const deleteForm = (e) => {
  //   e.preventDefault()
  //   const slideDownWrapper = e.target.closest('.react-slidedown'),
  //     form = e.target.closest('form')
  //   if (slideDownWrapper) {
  //     slideDownWrapper.remove()
  //   } else {
  //     form.remove()
  //   }
  // }

  const userApi = () => {
    userChangeApi({
      success: (d) => {
        setApi(d)
      }
    })
  }
  useEffect(() => {
    userApi()
  }, [watch('change_api')])

  const [copySuccess, setCopySuccess] = useState('')
  const textAreaRef = useRef(null)

  const copyToClipboard = (e) => {
    textAreaRef.current.select()
    document.execCommand('copy')
    // This is just personal preference.
    // I prefer to not show the whole text area selected.
    e?.target?.focus()
    setCopySuccess('Copied!')
  }

  const enableSecurity = (data) => {
    enableApiSecurity({
      jsonData: {
        ...data,
        is_enabled_api_ip_security: watch('is_enabled_api_ip_security') ? 1 : 0
      },
      success: (d) => {}
    })
  }
  const getAllIp = () => {
    loadIp({
      success: (d) => {
        setIp(d)
      }
    })
  }
  useEffect(() => {
    getAllIp()
  }, [loading])

  const onSubmit = (dataa) => {
    addIp({
      jsonData: {
        ip_address: dataa?.ip_address
      },
      loading: setLoading,
      success: () => {
        ///  getAllIp()
      }
    })
  }

  useEffect(() => {
    enableSecurity()
  }, [watch('is_enabled_api_ip_security')])

  // const removeIp = (d, item) => {
  //     deleteIp({
  //         id: item?.id,
  //         jsonData: {
  //             ...d
  //         },
  //         loading : setLoadingSet,
  //         success: () => {
  //             getAllIp()
  //         }
  //     })
  // }

  useEffect(() => {
    getAllIp()
  }, [loadingSet])

  return (
    <>
      <Card className='p-2'>
        <Row>
          <CardHeader className='border-bottom'>
            <h4 className='h2 text-dark fw-bolder'>Api Keys</h4>
            <BsTooltip title={'Click here to change the APIs'}>
              <div className='d-flex justify-content-end'>
                <FormGroupCustom
                  noLabel
                  noGroup
                  type={'checkbox'}
                  control={control}
                  name='change_api'
                  // value={edit?.userType}
                  isClearable
                  // label="User Type"
                  errors={errors}
                  // label={FM("vacation-trip")}
                  // options={createConstSelectOptions(UserType)}
                />
              </div>
            </BsTooltip>
          </CardHeader>
          {/* {(watch("is_enabled_api_ip_security") === 1 */}
          {/* {(watch("change_api") === 1 ? {userApi} : "")} */}
          <div className='d-flex justify-content-between border'>
            <div className='mt-1 mb-1 h5 text-dark fw-bolder'>App key</div>
            <div className='mt-1 mb-1 h5 text-dark fw-bolder'>
              {/* <p  ref={textAreaRef}>{api?.app_key}</p> <ContentCopyIcon className='text-success'  onClick={copyToClipboard} /> */}
              {api?.app_key} <ContentCopyIcon className='text-success' />
            </div>
          </div>
          <div className='d-flex justify-content-between border-top border bottom'>
            <div className='mt-1 mb-1 h5 text-dark fw-bolder '>App Secret</div>
            <div className='mt-1 mb-1 h5 text-dark fw-bolder'>
              {api?.app_secret} <ContentCopyIcon className='text-success' />
            </div>
          </div>

          <Card className='border mt-2 col-6'>
            <CardHeader className='p-0 pt-1 mb-2'>
              <Row className='flex-1 g-2 align-item-center'>
                <Col md='9'>
                  <h4 className='h2 mb-0 pb-0 text-dark fw-bolder'>Enable additional security</h4>
                </Col>
                <Col md='3' className='d-flex justify-content-end'>
                  <FormGroupCustom
                    noLabel
                    noGroup
                    tooltip='Enable Api IP Security'
                    type={'checkbox'}
                    control={control}
                    name='is_enabled_api_ip_security'
                    // value={edit?.userType}
                    // isClearable
                    // label="User Type"
                    errors={errors}
                    // label={FM("vacation-trip")}
                    // options={createConstSelectOptions(UserType)}
                  />
                </Col>
              </Row>
            </CardHeader>

            <p className='col-12 fw-bold'>
              System will accepts requests only from allowed IPs, and all other requests from any
              random IPs will be discarded
            </p>

            {watch('is_enabled_api_ip_security') === 1 ? (
              <Row className='mb-2'>
                {/* <Col md="12">
                            <FormGroupCustom

                                type={"text"}
                                control={control}
                                name="ip"
                                // value={edit?.userType}
                                isClearable
                                label="IP Address"
                                placeholder="Enter Your IP Address"
                                errors={errors}
                           
                            />
                        </Col> */}
                {/* <Label className='form-label'>
                            IP Address
                        </Label>
                        <Repeater count={count}>
                            {i => {
                                const Tag = i === 0 ? 'div' : SlideDown
                                return (
                                    <Tag key={i}>
                                        <Form>
                                            <Row className='justify-content-between align-items-center'>
                                                <Col md={12} className='mb-md-0 mb-1'>

                                                    <InputGroup>

                                                        <Input type='text' name="ip" id={`animation-item-name-${i}`} placeholder='IP Address' />
                                                       
                                                        <Button color='primary' outline onClick={deleteForm}>
                                                            <X size={14} />
                                                        </Button>
                                                    </InputGroup>

                                                </Col>

                                                <Col sm={12}>
                                                    <hr />
                                                </Col>
                                            </Row>
                                        </Form>
                                    </Tag>
                                )
                            }}
                        </Repeater>
                        <Button className='btn-icon' color='primary' onClick={increaseCount}>
                            <Plus size={14} />
                            <span className='align-middle ms-25'>Add New</span>
                        </Button> */}
                <Form onSubmit={handleSubmit(onSubmit)}>
                  <Col md='12'>
                    <FormGroupCustom
                      type={'text'}
                      control={control}
                      name='ip_address'
                      // value={edit?.userType}
                      isClearable
                      label='IP Address'
                      placeholder='Enter Your IP Address'
                      errors={errors}
                    />
                  </Col>
                  {/* <Button type='submit' className='btn-icon mt-2 round' color='primary' >
                                    <Plus size={14} />
                                    <span className='align-middle ms-25'>Add New IP</span>
                                </Button> */}
                  <LoadingButton
                    loading={loading}
                    type='submit'
                    className='btn-icon mt-2 round'
                    color='primary'
                    block
                  >
                    <Plus size={14} />
                    <span className='align-middle ms-25'>Add New IP</span>
                  </LoadingButton>
                </Form>
              </Row>
            ) : (
              ''
            )}
          </Card>
          {watch('is_enabled_api_ip_security') === 1 ? (
            <Card className='border mt-2 col-6 p-1'>
              <CardHeader>
                <h4 className='h2 text-dark fw-bolder'>Enable additional security</h4>
              </CardHeader>
              {loading ? (
                <>
                  {' '}
                  <Shimmer style={{ height: 25, marginBottom: 4, borderRadius: 2 }} />
                  <Shimmer style={{ height: 20, width: '90%', marginBottom: 4, borderRadius: 2 }} />
                  <Shimmer
                    style={{ height: 20, width: '50%', marginBottom: 25, borderRadius: 2 }}
                  />
                  <Shimmer style={{ height: 25, marginBottom: 4, borderRadius: 2 }} />
                  <Shimmer style={{ height: 20, width: '90%', marginBottom: 4, borderRadius: 2 }} />
                  <Shimmer
                    style={{ height: 20, width: '50%', marginBottom: 25, borderRadius: 2 }}
                  />
                  <Shimmer style={{ height: 25, marginBottom: 4, borderRadius: 2 }} />
                  <Shimmer style={{ height: 20, width: '90%', marginBottom: 4, borderRadius: 2 }} />
                  <Shimmer
                    style={{ height: 20, width: '50%', marginBottom: 25, borderRadius: 2 }}
                  />
                  <Shimmer style={{ height: 25, marginBottom: 4, borderRadius: 2 }} />
                  <Shimmer style={{ height: 20, width: '90%', marginBottom: 4, borderRadius: 2 }} />
                  <Shimmer
                    style={{ height: 20, width: '50%', marginBottom: 25, borderRadius: 2 }}
                  />
                </>
              ) : (
                <>
                  {' '}
                  <Table responsive>
                    <thead>
                      <tr>
                        <th scope='col' className='text-nowrap'>
                          #
                        </th>
                        <th scope='col' className='text-nowrap'>
                          IP Address
                        </th>
                        <th scope='col' className='text-nowrap'>
                          Created At
                        </th>
                        <th scope='col' className='text-nowrap'>
                          Action
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {ip?.data?.map((item, i) => {
                        return (
                          <tr key={`list-item-${i}`}>
                            <td className='text-nowrap'> {i + 1}</td>
                            <td className='text-nowrap'> {item?.ip_address} </td>
                            <td className='text-nowrap'>
                              {' '}
                              {formatDate(item?.created_at, 'DD-MM-YYYY')}
                            </td>
                            <td className='text-nowrap'>
                              <ConfirmAlert
                                title={`Delete ${item?.ip_address} ?`}
                                color='text-warning'
                                onClickYes={() =>
                                  deleteIp({
                                    id: item?.id,
                                    loading: setLoadingSet,
                                    success: (e) => {
                                      setDeletedId(item?.id)
                                      setDeleted(e)
                                    },
                                    error: setFailed
                                  })
                                }
                                // onClickYes={() => deletePrimaryRoute({ id: row?.id, loading: setLoading, success: setDeleted, error: setFailed })}
                                onSuccess={deleted}
                                onFailed={failed}
                                onClose={(e) => {
                                  if (e) {
                                    dispatch(ipDelete(deletedId))
                                  }
                                  setDeleted(null)
                                  setFailed(null)
                                }}
                                className='waves-effect btn btn-danger btn-sm'
                                id={`grid-delete-${item?.id}`}
                              >
                                <Trash2 size={15} />
                              </ConfirmAlert>
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </Table>{' '}
                </>
              )}
            </Card>
          ) : (
            ''
          )}
        </Row>
      </Card>
    </>
  )
}

export default AppInfo
