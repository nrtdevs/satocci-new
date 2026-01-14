/* eslint-disable prettier/prettier */
import { useEffect, useReducer, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useParams } from 'react-router-dom'
import { CardBody, Col, Input, Row, Spinner } from 'reactstrap'
import { useImportMultipleBarcodeMutation } from '../../../redux/RTKQuery/ProductRTK'
import { loadDropdown } from '../../../utility/apis/dropdowns'
import { bacodeSampleDownload } from '../../../utility/apis/ExportLanguage'
import { UserType } from '../../../utility/Const'
import { FM, isValid, isValidUrl } from '../../../utility/helpers/common'
import useUser from '../../../utility/hooks/useUser'
import useUserType from '../../../utility/hooks/useUserType'
import ApiEndpoints from '../../../utility/http/ApiEndpoints'
import httpConfig from '../../../utility/http/httpConfig'
import { stateReducer } from '../../../utility/stateReducer'
import FormGroupCustom from '../../components/formGroupCustom/FormGroupCustom'
import CenteredModal from '../../components/modal/CenteredModal'

interface States {
    lastRefresh?: any
    loading?: boolean
    text?: string
    list?: any

    search?: any
}
type FormData = {
    product_id?: any
    variant_id?: any
    store_id?: any
    files?: any
}
interface dataType {
    edit?: any
    noView?: boolean
    subCatStoreID?: any
    showModal?: boolean
    resData?: (e: boolean) => void
    setShowModal?: (e: boolean) => void
    Component?: any
    loading?: boolean
    children?: any
    // rest?: any
}

export default function BarcodeImportModal<T>(props: T & dataType) {
    const {
        edit = null,
        noView = false,
        showModal = false,
        resData = () => { },
        setShowModal = () => { },
        Component = 'span',
        children = null,
        ...rest
    } = props

    const initState: States = {
        lastRefresh: new Date().getTime(),
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
    const user = useUser()
    const params = useParams()
    const userType = useUserType()
    const store_id = params?.id
    const isAdmin = !!(userType === UserType.Admin || user?.store_id === UserType.Admin)
    const form = useForm<FormData>()

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
    const [importBarcode, resultData] = useImportMultipleBarcodeMutation()

    const openModal = () => {
        setOpen(true)
    }
    const closeModal = (from = null) => {
        setFiles([])
        reset()
        setOpen(false)
        setShowModal(false)
    }

    const handleSave = (e: FormData) => {
        if (isValid(files)) {
            importBarcode({
                file: files[0],
                store_id: isAdmin ? store_id : user?.store_id,
                product_variant_id: watch('variant_id')?.value,
                product_id: watch('product_id')?.value
            })
        }
    }
    ///////////////

    useEffect(() => {
        if (noView && showModal) {
            openModal()
        }
    }, [noView, showModal])

    //////
    useEffect(() => {
        if (resultData?.isSuccess) {
            setFiles([])
            resData(true)
            closeModal()
            reset()
        }
    }, [resultData])
    ///////////
    const sampleBooking = () => {
        bacodeSampleDownload({
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

    const disableSaveButton = () => {
        if (isValid(watch('product_id')?.value) && isValid(watch('variant_id')?.value) && files[0]) {
            return false
        } else {
            return true
        }

    }

    useEffect(() => {
        if (watch('product_id')?.value !== watch('variant_id')?.extra?.product_id) {
            setValue('variant_id', null)
        }
    }, [watch('product_id'), watch('variant_id')])
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
                loading={false}
                open={open}
                disableSave={resultData?.isLoading || disableSaveButton()}
                handleModal={closeModal}
                handleSave={handleSave}
                title={FM(`import-barcode`)}
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
                            <FormGroupCustom
                                label={FM('product')}
                                placeholder={FM('product')}
                                //   noLabel
                                async
                                isClearable
                                path={ApiEndpoints.load_product}
                                selectLabel='name'
                                selectValue={'id'}
                                defaultOptions
                                jsonData={{
                                    store_id: isAdmin ? store_id : user?.store_id
                                }}
                                loadOptions={loadDropdown}
                                name={`product_id`}
                                type={'select'}
                                className='mb-1'
                                control={control}
                                rules={{ required: true }}
                            />
                        </Col>
                        <Col md='12'>
                            <FormGroupCustom
                                key={`${watch('product_id')?.value}-fjffj-${isAdmin ? store_id : user?.store_id}`}
                                label={FM('product-variant')}
                                placeholder={FM('product-variant')}
                                //   noLabel
                                async
                                isDisabled={!isValid(watch('product_id'))}
                                isClearable
                                path={`${ApiEndpoints.load_product_variant}${watch('product_id')?.value}`}
                                selectLabel='name'
                                selectValue={'id'}
                                jsonData={{
                                    store_id: isAdmin ? store_id : user?.store_id,
                                    product_type: 1
                                }}
                                defaultOptions
                                loadOptions={loadDropdown}
                                name={`variant_id`}
                                type={'select'}
                                className='mb-2'
                                control={control}
                                rules={{ required: true }}
                            //   prepend={<InputGroupText>{FM('get')}</InputGroupText>}
                            //   append={<InputGroupText>{FM('item')}</InputGroupText>}
                            />
                        </Col>
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
