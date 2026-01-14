/* eslint-disable prettier/prettier */
import { useEffect, useReducer, useState } from 'react'
import { Star } from 'react-feather'
import { useForm } from 'react-hook-form'
import { CardBody, Col, Input, Row, Spinner } from 'reactstrap'

import { languageLoad } from '../../../redux/reducers/Language'

import { useCreateOrUpdateLabelsMutation } from '../../../redux/RTKQuery/LabelsRTK'
import { useCreateBulkReferralsMutation } from '../../../redux/RTKQuery/PromotionTemplateRTK'
import { useAppDispatch } from '../../../redux/store'
import { bulkReferralSampleFile, loadLanguageList } from '../../../utility/apis/ExportLanguage'
import { FM, isValidArray, isValidUrl } from '../../../utility/helpers/common'
import httpConfig from '../../../utility/http/httpConfig'
import { stateReducer } from '../../../utility/stateReducer'
import { getUserData, setInputErrors } from '../../../utility/Utils'
import FormGroupCustom from '../../components/formGroupCustom/FormGroupCustom'
import CenteredModal from '../../components/modal/CenteredModal'
import SimpleImageUpload from '../../components/SimpleImageUpload'

export type BulkReferralsParam = {
    id?: string

    random_group_id?: string
    sender_id?: string | number
    first_name?: string
    file?: any
    mail_subject?: string
    mail_body?: string
    last_name?: string
    email?: string
    mobile?: string | number
    created_at?: string | any
    updated_at?: string | any
    image_path?: string | any
}

interface dataType {
    edit?: any
    response?: (e: boolean) => void
    noView?: boolean
    showModal?: boolean
    setShowModal?: (e: boolean) => void
    Component?: any
    loading?: boolean
    formData?: any
    children?: any

    // rest?: any
}
interface States {
    formData?: BulkReferralsParam
}

export default function BulkReferralsModal<T>(props: T & dataType) {
    const {
        edit = null,
        noView = false,
        showModal = false,

        setShowModal = () => { },
        Component = 'span',
        response = () => { },
        children = null,
        ...rest
    } = props

    const initState: States = {
        formData: {
            file: {},
            mail_body: '',
            mail_subject: '',

            id: ''
        }
    }
    const [open, setOpen] = useState(false)

    const [files, setFiles] = useState<any>([])

    const [loadingSample, setLoadingSample] = useState(false)
    const reducers = stateReducer<States>
    const [state, setState] = useReducer(reducers, initState)
    const dispatch = useAppDispatch()
    const form = useForm<BulkReferralsParam>()
    const user = getUserData()
    const {
        watch,
        formState: { errors },
        handleSubmit,
        control,
        setValue,
        setError,
        reset
    } = form
    const openModal = () => {
        setOpen(true)
        reset()
    }
    const closeModal = (from = null) => {
        setOpen(false)
        setFiles(null)
        setShowModal(false)
    }

    const [createBulkReferrals, result] = useCreateBulkReferralsMutation()

    const [createLabel, resultLabel] = useCreateOrUpdateLabelsMutation()

    const handleSave = (d: BulkReferralsParam) => {
        createBulkReferrals({
            ...d,
            file: files[0],
            image_path: d?.image_path ?? ''
        })
    }

    const loadLanguageListData = () => {
        loadLanguageList({
            success: (e) => {
                dispatch(languageLoad(e?.payload?.data))
            }
        })
    }

    const sampleBooking = () => {
        bulkReferralSampleFile({
            loading: setLoadingSample,
            success: (e: any) => {
                if (isValidUrl(e?.payload)) {
                    window.open(e?.payload, '_blank')
                } else {
                    window.open(`${httpConfig.baseUrl2}${e?.payload}`, '_blank')
                }
                //  window.open(`${httpConfig.baseUrl2}${e?.payload}`, '_blank')
            }
        })
    }
    useEffect(() => {
        if (result?.isSuccess) {
            closeModal()
            setFiles(null)
            response(result?.isSuccess)
            loadLanguageListData()
        }
    }, [result])

    useEffect(() => {
        if (result?.isError) {
            const e: any = result?.error
            setInputErrors(e?.data?.payload, setError)
        }
    }, [result?.isError])

    useEffect(() => {
        if (noView && showModal) {
            openModal()
        }
    }, [noView, showModal])

    return (
        <>
            {!noView ? (
                <Component role='button' onClick={openModal} {...rest}>
                    {children}
                </Component>
            ) : null}
            <CenteredModal
                scrollControl={false}
                modalClass='modal-lg'
                disableSave={!isValidArray(files) || result.isLoading}
                loading={result.isLoading}
                open={open}
                handleModal={closeModal}
                handleSave={handleSubmit(handleSave)}
                title={FM('bulk-referrals')}
            >
                <form>
                    <CardBody className=''>
                        <Row className=''>
                            <div className='text-center mt-1'>
                                <Star size={20} />
                                <p className='mt-1 text-small-12'>
                                    {FM(
                                        'Please-download-this-csv-file-and-fill-all-the-details-accordingly.-After-that-you-can-upload-the-file-to-import-your-items.'
                                    )}
                                </p>
                            </div>
                            <div className='text-center text-warning mb-1 text-bolder'>
                                {loadingSample ? (
                                    <div className='loader-top me-2 '>
                                        <span className='spinner'>
                                            <Spinner color='primary' animation='border' size={'xl'}>
                                                <span className='visually-hidden'>
                                                    {FM('loading-dot', {
                                                        dot: '...'
                                                    })}
                                                </span>
                                            </Spinner>
                                        </span>
                                    </div>
                                ) : (
                                    <>
                                        <Row>
                                            {/* <Col md='6'>
                        <FormGroupCustom
                          // noLabel
                          type={'checkbox'}
                          control={control}
                          name='check_all'
                          className=''
                          tooltip={FM('all-language')}
                          label={FM('all-language')}
                          rules={{ required: false }}
                        />
                      </Col> */}
                                            <Col md='12'>
                                                <u onClick={sampleBooking} style={{ cursor: 'pointer' }}>
                                                    {FM('download-sample-file')}{' '}
                                                </u>
                                            </Col>
                                            <hr className='mt-1' />
                                        </Row>
                                    </>
                                )}
                            </div>
                        </Row>
                        <Row>
                            <Col md='12' className='mt-2'>
                                <Input
                                    type={'file'}
                                    name='file'
                                    accept='.csv,.xlsx'
                                    placeholder={FM('choose-language-file')}
                                    title={FM('choose-language-file')}
                                    onChange={(e) => setFiles(e?.target?.files)}
                                    label={FM('choose-language-file')}
                                />
                            </Col>

                            <Col md='12' className=''>
                                <FormGroupCustom
                                    // noLabel
                                    type={'text'}
                                    control={control}
                                    name='mail_subject'
                                    className='mt-1 mb-1'
                                    label={FM('mail-subject')}
                                    rules={{ required: true, maxLength: 20 }}
                                />
                            </Col>
                            {/* <Col md='12' className=''>
                <FormGroupCustom
                  // noLabel
                  type={'textarea'}
                  control={control}
                  name='mail_body'
                  className='mt-1'
                  tooltip={FM('mail-body')}
                  label={FM('mail-body')}
                  rules={{ required: true }}
                />
              </Col> */}
                            <Col md='12'>
                                <FormGroupCustom
                                    noGroup
                                    name='mail_body'
                                    type={'editor'}
                                    label={FM('mail-body')}
                                    className='mb-2'
                                    control={control}
                                    rules={{ required: true }}
                                />
                            </Col>
                            <Col md='12'>
                                <SimpleImageUpload
                                    params={{ for: 'bulkreferrals' }}
                                    value={watch('image_path')}
                                    name='image_path'
                                    height={100}
                                    width={760}
                                    setValue={setValue}
                                />
                            </Col>
                        </Row>
                    </CardBody>
                </form>
            </CenteredModal>
        </>
    )
}
