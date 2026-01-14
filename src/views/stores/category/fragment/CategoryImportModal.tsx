/* eslint-disable prettier/prettier */
import { useEffect, useReducer, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useParams } from 'react-router-dom'
import { CardBody, Col, Input, Row, Spinner } from 'reactstrap'
import { useCategoryImportMutation, useLoadCategoryHierarchyMutation } from '../../../../redux/RTKQuery/CategoryRTK'
import { useImportProductMutation } from '../../../../redux/RTKQuery/ProductRTK'
import { UserType } from '../../../../utility/Const'
import { fastLoop, getUserData } from '../../../../utility/Utils'
import { categorySample, productSample } from '../../../../utility/apis/ExportLanguage'
import { FM, isValid, isValidUrl, log } from '../../../../utility/helpers/common'
import useUserType from '../../../../utility/hooks/useUserType'
import httpConfig from '../../../../utility/http/httpConfig'
import { stateReducer } from '../../../../utility/stateReducer'

import CenteredModal from '../../../components/modal/CenteredModal'
import Shimmer from '../../../components/shimmers/Shimmer'

interface States {
    lastRefresh?: any
    subCategoryArr?: Array<any>
    categoryParent?: any
    subcatParent?: any
    categoryList?: Array<any>
    categoryListFlat?: Array<any>
    ip?: boolean
    patient?: boolean
    languageList?: any
    language_id?: any
    loading?: boolean
    text?: string
    list?: any

    search?: any
}
type FormData = {
    qr_code: string
    email_address: string
    contact_person_name: string
    contact_person_number: number
    street_address: string
    city: string
    state: string
    zip_code: number
    latitude: string | number
    longitude: string | number
    subscription_type: any
    payment_type: any | null
    amount_per_transaction: number | null
    amount: number | null
}
interface dataType {
    edit?: any
    noView?: boolean
    subCatStoreID?: any
    showModal?: boolean
    active?: boolean
    responseData?: (e: boolean) => void
    setShowModal?: (e: boolean) => void
    Component?: any
    loading?: boolean
    children?: any
    // rest?: any
}

export default function CategoryImportModal<T>(props: T & dataType) {
    const {
        edit = null,
        noView = false,
        active = false,
        showModal = false,
        responseData = () => { },
        setShowModal = () => { },
        Component = 'span',
        children = null,
        ...rest
    } = props

    const initState: States = {
        lastRefresh: new Date().getTime(),
        languageList: [],
        categoryList: [],
        categoryListFlat: [],
        subCategoryArr: [],
        language_id: null,
        ip: false,
        patient: false,
        loading: false,
        search: undefined,
        text: '',
        list: []
    }
    const reducers = stateReducer<States>
    const [state, setState] = useReducer(reducers, initState)
    const [open, setOpen] = useState(false)
    const [files, setFiles] = useState<any>([])
    const [loadingSample, setLoadingSample] = useState(false)
    const userType = useUserType()
    const user = getUserData()
    const params: any = useParams()

    const storeId = params?.id
    const form = useForm()
    log('storeId', storeId)
    const {
        formState: { errors },
        handleSubmit,
        control,
        reset,
        setValue,
        watch,
        getValues
    } = form

    ///IMPORT Product
    const [importCategory, resultData] = useCategoryImportMutation()

    const openModal = () => {
        setOpen(true)
        setState({

        })
    }
    const closeModal = (from = null) => {
        setFiles([])
        setOpen(false)
        setShowModal(false)
    }


    const handleSave = () => {
        if (isValid(files)) {
            importCategory(
                {
                    file: files[0]
                }
            )
        }
    }
    ///////////////

    log("files", files[0])

    useEffect(() => {
        if (noView && showModal) {
            openModal()
        }
    }, [noView, showModal])

    //////
    useEffect(() => {
        if (resultData?.isSuccess) {
            responseData(true)
            closeModal()
            setFiles([])
        }
    }, [resultData])
    ///////////
    const sampleBooking = () => {
        categorySample({
            loading: setLoadingSample,
            success: (e: any) => {
                if (isValidUrl(e?.payload)) {
                    window.open(`${e?.payload}`, '_blank')
                } else {
                    window.open(`${httpConfig.baseUrl2}${e?.payload}`, '_blank')
                }

            }
        })
    }

    return (
        <>
            {!noView ? (
                <Component role='button' onClick={openModal} {...rest}>
                    {children}
                </Component>
            ) : null}
            <CenteredModal
                scrollControl={false}
                modalClass='modal-sm'
                loading={resultData?.isLoading}
                open={open}
                disableSave={!isValid(files[0]) || resultData?.isLoading}
                handleModal={closeModal}
                handleSave={handleSave}
                title={FM(`import-category`)}
            >
                <CardBody className=''>
                    <Row className='pt-1'>
                        <div className='text-center text-warning mb-1 text-bolder'>
                            {loadingSample ? (
                                <div className='loader-top me-2 '>
                                    <span className='spinner'>
                                        <Spinner color='primary' animation='border' size={'xl'}>
                                            <span className='visually-hidden'>Loading...</span>
                                        </Spinner>
                                    </span>
                                </div>
                            ) : (
                                <u onClick={sampleBooking} style={{ cursor: 'pointer' }}>
                                    {FM('download-sample-file')}{' '}
                                </u>
                            )}
                        </div>
                    </Row>

                    <Row className=''>
                        <Col md='12'>
                            <Input
                                type={'file'}
                                noLabel
                                name='file'
                                onChange={(e) => setFiles(e?.target?.files)}
                                // className='m-'
                                label={FM('qr-no')}
                            />
                        </Col>
                    </Row>
                </CardBody>
            </CenteredModal>
        </>
    )
}
