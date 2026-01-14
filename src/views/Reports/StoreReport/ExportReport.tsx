/* eslint-disable prettier/prettier */
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { CardBody, Col, Row } from 'reactstrap'

import { useLoadCouponDetailsByIdMutation } from '../../../redux/RTKQuery/CouponRTK'
import { useExportStoreReportMutation } from '../../../redux/RTKQuery/StoreRTK'
import { UserType } from '../../../utility/Const'
import { formatDate } from '../../../utility/Utils'
import { loadDropdown } from '../../../utility/apis/dropdowns'
import { FM, isValidUrl } from '../../../utility/helpers/common'
import useUser from '../../../utility/hooks/useUser'
import useUserType from '../../../utility/hooks/useUserType'
import ApiEndpoints from '../../../utility/http/ApiEndpoints'
import httpConfig from '../../../utility/http/httpConfig'
import FormGroupCustom from '../../components/formGroupCustom/FormGroupCustom'
import CenteredModal from '../../components/modal/CenteredModal'

// export type SubscriptionLogType = {
//   store_id?: string | null | number
//   subscription_type?: string | null | number
//   sub_store_limit?: string | null | number
//   store_subscription_id?: string | null | number
//   currency?: string | null | number
//   amount_received_month?: string | null | number
//   amount_received_date?: string | null | number
//   amount_received?: string | null | number
//   amount?: string | null | number
// }

export type ExportParams = {
    store_id?: any
    from_date?: string | null | number
    to_date?: string | null | number
    subscription_type?: any
    url?: any
}

interface dataType {
    edit?: any
    response?: (e: boolean) => void
    noView?: boolean
    showModal?: boolean
    setShowModal?: (e: boolean) => void
    Component?: any
    loading?: boolean
    children?: any

    // rest?: any
}
export default function ExportReport<T>(props: T & dataType) {
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
    const [open, setOpen] = useState(false)
    const [loadCouponById, CouponData] = useLoadCouponDetailsByIdMutation()
    const couponData = CouponData?.data?.payload

    const {
        register,
        formState: { errors },
        handleSubmit,
        control,
        getValues,
        setValue,
        watch,
        reset
    } = useForm<any>()
    const userType = useUserType()
    const openModal = () => {
        setOpen(true)
        reset()
    }
    const closeModal = (from = null) => {
        setOpen(false)
        setShowModal(false)
    }
    const user = useUser()
    const [exports, result] = useExportStoreReportMutation()
    const resUrl = result?.data?.payload?.url
    const handleSave = (d: ExportParams) => {
        exports({
            store_id: d?.store_id?.value,
            from_date: d?.from_date,
            to_date: d?.to_date
        })
    }

    useEffect(() => {
        if (result?.isSuccess) {
            closeModal()
            response(result.isSuccess)
            if (isValidUrl(resUrl)) {
                window.open(resUrl, '_blank')
            } else {
                window.open(`${httpConfig.baseUrl3}${resUrl}`, '_blank')

            }
        }
    }, [result.isSuccess])

    // log('storeParams', watch('store_id')?.extra?.store_subscription?.subscription_type)
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
                loading={result.isLoading}
                done={FM('export')}
                open={open}
                handleModal={closeModal}
                handleSave={handleSubmit(handleSave)}
                title={FM('export')}
            >
                <form>
                    <CardBody className=''>
                        <Row className='border-bottom'>
                            <Col md='12'>
                                <FormGroupCustom
                                    // key={`user-${user?.store_id}`}
                                    label={FM('store')}
                                    name={'store_id'}
                                    type={'select'}
                                    // isDisabled={isValid(param?.id)}
                                    className='mb-2'
                                    path={
                                        userType === UserType.Store
                                            ? ApiEndpoints.store_substore_list + user?.store_id
                                            : ApiEndpoints.store_option
                                    }
                                    selectLabel='name'
                                    modifyDropdownData={(d: any) => {
                                        return {
                                            ...d,
                                            name: `${d?.name} / (${d?.store_setting?.store_name ?? d?.store_setting?.store_name
                                                })`
                                        }
                                    }}
                                    selectValue={'id'}
                                    async
                                    jsonData={{
                                        with_substore: 'no'
                                    }}
                                    defaultOptions
                                    searchItem='store_name'
                                    loadOptions={loadDropdown}
                                    // id='positionTop'
                                    control={control}
                                    rules={{
                                        required: false
                                    }}
                                />
                            </Col>
                            <Col md='12'>
                                {/* 434? */}
                                <FormGroupCustom
                                    placeholder={FM('from-date')}
                                    label={FM('from-date')}
                                    //   noLabel
                                    name={`from_date`}
                                    type={'date'}
                                    // datePickerOptions={{ minDate: formatDate(new Date()) }}
                                    className='mb-1'
                                    control={control}
                                    rules={{ required: false }}
                                />
                            </Col>
                            <Col md='12'>
                                <FormGroupCustom
                                    placeholder={FM('to-date')}
                                    label={FM('to-date')}
                                    //   noLabel
                                    name={`to_date`}
                                    type={'date'}
                                    datePickerOptions={{
                                        minDate: formatDate(watch('from_date'))
                                    }}
                                    className='mb-1'
                                    control={control}
                                    rules={{ required: false }}
                                />
                            </Col>
                            {/* <Col md='12'>
                <FormGroupCustom
                  placeholder={FM('subscription-type')}
                  type={'select'}
                  name='subscription_type'
                  label={FM('subscription-type')}
                  className='mb-1'
                  control={control}
                  selectOptions={createConstSelectOptions(subscriptionStoreType, FM)}
                  rules={{ required: true }}
                />
              </Col> */}
                        </Row>
                    </CardBody>
                </form>
            </CenteredModal>
        </>
    )
}
