/* eslint-disable prettier/prettier */
import { useEffect, useReducer, useState } from 'react'
import { useForm } from 'react-hook-form'
import { CardBody, Col, Row } from 'reactstrap'
import { useCreateOrUpdateLabelsMutation } from '../../redux/RTKQuery/LabelsRTK'
import { useCreateOrUpdateLanguageMutation } from '../../redux/RTKQuery/LanguageRTK'
import { useAppDispatch } from '../../redux/store'
import Hide from '../../utility/Hide'
import { createConstSelectOptions, getUserData, setInputErrors } from '../../utility/Utils'
import { ExportOrders, ExportOrdersWithProduct } from '../../utility/apis/ExportLanguage'
import { loadDropdown } from '../../utility/apis/dropdowns'
import { FM, isValidUrl, log } from '../../utility/helpers/common'
import ApiEndpoints from '../../utility/http/ApiEndpoints'
import httpConfig from '../../utility/http/httpConfig'
import { stateReducer } from '../../utility/stateReducer'
import FormGroupCustom from '../components/formGroupCustom/FormGroupCustom'
import CenteredModal from '../components/modal/CenteredModal'
import { exportTypeOrder, UserType } from '../../utility/Const'
import Show from '../../utility/Show'
import { useExportStoreOrderReturnMutation, useExportStoreProductReportMutation, useExportStoreReportMutation } from '../../redux/RTKQuery/StoreRTK'
import useUserType from '../../utility/hooks/useUserType'


export type CategoryParamsType = {
    id?: string
    name: string
    status?: string
    patent_id?: string
}

interface dataType {
    edit?: any
    // exportType?: string
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
    formData?: any
}

export default function OrderExport<T>(props: T & dataType) {
    const {
        edit = null,
        noView = false,
        showModal = false,
        // exportType = '1',
        setShowModal = () => { },
        Component = 'span',
        response = () => { },
        children = null,
        ...rest
    } = props

    const initState: States = {
        formData: {
            country: '',
            file: {},
            title: '',
            id: ''
        }
    }
    const [open, setOpen] = useState(false)
    const [editData, setEditData] = useState(null)
    const [files, setFiles] = useState<any>([])
    const [loading, setLoading] = useState(false)
    const [loadingSample, setLoadingSample] = useState(false)
    const reducers = stateReducer<States>
    const [state, setState] = useReducer(reducers, initState)
    const dispatch = useAppDispatch()
    const form = useForm<any>()
    const userType = useUserType()
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

    const [exportSummaryReport, result] = useExportStoreReportMutation()
    const [exportSummaryReportData, resultData] = useExportStoreOrderReturnMutation()

    const [exportProductReportData, resultProduct] = useExportStoreProductReportMutation()

    const handleSave = (d: any) => {

        if (watch("report_type")?.value === 1) {
            ExportOrdersWithProduct({
                jsonData: {
                    store_id: d?.store_id?.value,
                    product_id: d?.product_id?.value,
                    from_date: d?.from_date,
                    to_date: d?.to_date
                },
                loading: setLoadingSample,
                success: (e: any) => {
                    if (isValidUrl(e?.payload?.url)) {
                        window.open(e?.payload?.url, '_blank')
                    } else {
                        window.open(`${httpConfig.baseUrl2}${e?.payload?.url}`, '_blank')
                    }

                }
            })
        } else if (watch("report_type")?.value === 2) {

            ExportOrders({
                jsonData: {
                    store_id: d?.store_id?.value,
                    from_date: d?.from_date,
                    to_date: d?.to_date
                },
                loading: setLoadingSample,
                success: (e: any) => {
                    if (isValidUrl(e?.payload?.url)) {
                        window.open(e?.payload?.url, '_blank')
                    } else {
                        window.open(`${httpConfig.baseUrl2}${e?.payload?.url}`, '_blank')
                    }

                }
            })
        } else if (watch("report_type")?.value === 3) {

            exportSummaryReport({
                store_id: d?.store_id?.value,
                from_date: d?.from_date,
                to_date: d?.to_date
            })
        } else if (watch("report_type")?.value === 4) {
            exportSummaryReportData({
                store_id: d?.store_id?.value,
                order_number: d?.order_number,
                from_date: d?.from_date,
                to_date: d?.to_date
            })
        } else if (watch("report_type")?.value === 5) {
            exportProductReportData({
                store_id: d?.store_id?.value,
                name: d?.name?.map((e: any) => e?.label),
                stock_report: true
            })
        }
    }


    useEffect(() => {
        if (result?.isSuccess) {
            closeModal()
            response(result.isSuccess)
            if (isValidUrl(result?.data?.payload?.url)) {
                window.open(result?.data?.payload?.url, '_blank')
            } else {
                window.open(`${httpConfig.baseUrl3}${result?.data?.payload?.url}`, '_blank')

            }
        }
    }, [result.isSuccess])

    useEffect(() => {
        if (resultData?.isSuccess) {
            closeModal()
            response(resultData.isSuccess)
            if (isValidUrl(resultData?.data?.payload?.url)) {
                window.open(resultData?.data?.payload?.url, '_blank')
            } else {
                window.open(`${httpConfig.baseUrl3}${resultData?.data?.payload?.url}`, '_blank')

            }
        }
    }, [resultData.isSuccess])

    useEffect(() => {
        if (resultProduct?.isSuccess) {
            closeModal()
            response(resultProduct.isSuccess)
            if (isValidUrl(resultProduct?.data?.payload?.url)) {
                window.open(resultProduct?.data?.payload?.url, '_blank')
            } else {
                window.open(`${httpConfig.baseUrl3}${resultProduct?.data?.payload?.url}`, '_blank')

            }
        }
    }, [resultProduct.isSuccess])

    useEffect(() => {
        if (noView && showModal) {
            openModal()
        }
    }, [noView, showModal])

    log("reportType", watch('report_type'))

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
                loading={loadingSample}
                done={FM('export')}
                open={open}
                handleModal={closeModal}
                handleSave={handleSubmit(handleSave)}
                title={FM('export')}
            >
                <form>
                    <CardBody className=''>
                        <Row className='border-bottom'>
                            <Col md='12' className=''>
                                <FormGroupCustom
                                    name={`report_type`}
                                    type={'select'}
                                    label={FM('report-type')}
                                    className='mb-1'
                                    control={control}
                                    // message={FM('select-discount-type-fixed-or-percentage')}
                                    selectOptions={createConstSelectOptions(exportTypeOrder, FM)}
                                    rules={{ required: true }}
                                />
                            </Col>
                            <Col md='12' className=''>
                                <FormGroupCustom
                                    label={FM('store')}
                                    placeholder={FM('select-store')}
                                    async
                                    isClearable
                                    path={
                                        userType === UserType.Admin ||
                                            (user?.store_id === UserType.Admin && userType !== UserType.Admin)
                                            ? ApiEndpoints.load_stores
                                            : ApiEndpoints.store_substore_list + user.store_id
                                    }
                                    selectLabel='name'
                                    selectValue={'id'}
                                    defaultOptions
                                    loadOptions={loadDropdown}
                                    name={'store_id'}
                                    jsonData={{ with_substore: 'yes' }}
                                    type={'select'}
                                    className='mb-1'
                                    control={control}
                                    rules={{ required: false }}
                                // prepend={<InputGroupText>{FM('get')}</InputGroupText>}
                                />
                            </Col>
                            <Show IF={watch("report_type")?.value === 1}>
                                <Col md='12' className=''>
                                    <FormGroupCustom
                                        key={watch('store_id')?.value}
                                        label={FM('products')}

                                        placeholder={FM('select-products')}
                                        async
                                        isClearable
                                        path={ApiEndpoints.load_product}
                                        isDisabled={!watch('store_id')}
                                        selectLabel='name'
                                        selectValue={'id'}
                                        defaultOptions
                                        loadOptions={loadDropdown}
                                        name={'product_id'}
                                        jsonData={{ store_id: watch('store_id')?.value }}
                                        type={'select'}
                                        className='mb-1'
                                        control={control}
                                        rules={{ required: false }}
                                    />
                                </Col>
                            </Show>
                            <Show IF={watch("report_type")?.value === 5}>
                                <Col md='12' className=''>
                                    <FormGroupCustom
                                        key={watch('store_id')?.value}
                                        label={FM('products')}
                                        isMulti
                                        placeholder={FM('select-products')}
                                        async
                                        isClearable
                                        path={ApiEndpoints.load_product}
                                        isDisabled={!watch('store_id')}
                                        selectLabel='name'
                                        selectValue={'id'}
                                        defaultOptions
                                        loadOptions={loadDropdown}
                                        name={'name'}
                                        jsonData={{ store_id: watch('store_id')?.value }}
                                        type={'select'}
                                        className='mb-1'
                                        control={control}
                                        rules={{ required: false }}
                                    />
                                </Col>
                            </Show>
                            <Show IF={watch("report_type")?.value === 4}>
                                <FormGroupCustom
                                    placeholder={FM('order-number')}
                                    type='text'
                                    name='order_number'
                                    label={FM('order-number')}
                                    className='mb-1'
                                    control={control}
                                    rules={{ required: false }}
                                />
                            </Show>

                            <Hide IF={watch("report_type")?.value === 5}>
                                <Col md='12' className=''>
                                    <FormGroupCustom
                                        placeholder={FM('start-date')}
                                        label={FM('start-date')}
                                        //   noLabel
                                        name={`from_date`}
                                        type={'date'}
                                        // datePickerOptions={{ minDate: formatDate(new Date()) }}
                                        className='mb-1'
                                        control={control}
                                        rules={{ required: false }}
                                    />
                                </Col>
                                <Col md='12' className=''>
                                    <FormGroupCustom
                                        placeholder={FM('end-date')}
                                        label={FM('end-date')}
                                        //   noLabel
                                        name={`to_date`}
                                        type={'date'}
                                        // datePickerOptions={{
                                        //   minDate: formatDate(watch('start_date'))
                                        // }}
                                        className='mb-0'
                                        control={control}
                                        rules={{ required: false }}
                                    />
                                </Col>
                            </Hide>
                        </Row>
                    </CardBody>
                </form>
            </CenteredModal>
        </>
    )
}
