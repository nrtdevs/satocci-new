/* eslint-disable prettier/prettier */
/* eslint-disable eqeqeq */
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { Form, InputGroupText } from 'reactstrap'
import { useSendPromotionTemplateMutation } from '../../../redux/RTKQuery/PromotionTemplateRTK'
import { loadDropdown } from '../../../utility/apis/dropdowns'
import { sendType, UserType } from '../../../utility/Const'

import { FM, isValid, log } from '../../../utility/helpers/common'
import ApiEndpoints from '../../../utility/http/ApiEndpoints'
import { getKeyByValue } from '../../../utility/Utils'
import FormGroupCustom from '../../components/formGroupCustom/FormGroupCustom'

import CenteredModal from '../../components/modal/CenteredModal'
import { PromotionParamsType } from './PromotionTemplateForm'
import BsTooltip from '../../components/tooltip'
import useUser from '../../../utility/hooks/useUser'
import useUserType from '../../../utility/hooks/useUserType'

export type CategoryParamsType = {
    id?: string
    name: string
    status?: string
    patent_id?: string
}
interface dataType {
    edit?: PromotionParamsType
    response?: (e: boolean) => void
    noView?: boolean
    showModal?: boolean
    setShowModal?: (e: boolean) => void
    Component?: any
    loading?: boolean
    children?: any
}

export default function PromotionSendModal<T>(props: T & dataType) {

    const userType = useUserType()
    const form = useForm<PromotionParamsType>()
    const { handleSubmit, control, reset, setValue, watch } = form
    const [sendPromotion, result] = useSendPromotionTemplateMutation()
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

    const openModal = () => {
        setOpen(true)
        reset()
    }
    const closeModal = (from = null) => {
        setOpen(false)
        setShowModal(false)
    }

    useEffect(() => {
        if (noView && showModal) {
            openModal()
        }
    }, [noView, showModal])

    useEffect(() => {
        if (result.isSuccess) {
            response(result.isSuccess)
            reset()
            closeModal()
        }
    }, [result.isSuccess])

    const onSubmit = (e: PromotionParamsType) => {
        const customer_ids = e?.customer?.map((d: any, i: any) => d?.value)
        if (isValid(edit?.id)) {
            sendPromotion({
                content_id: edit?.id,
                user_ids: customer_ids,
                is_send_to_all: e?.is_send_to_all === 1 ? 'yes' : 'no'
            })
        }
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
                modalClass='modal-md'
                disableSave={result.isLoading}
                loading={result.isLoading}
                open={open}
                handleModal={closeModal}
                handleSave={handleSubmit(onSubmit)}
                title={
                    <>
                        <div style={{ overflowWrap: 'anywhere' }}>
                            {FM(getKeyByValue(sendType, edit?.content_type))}: {edit?.content_header}
                        </div>
                    </>
                }
            >
                <Form onSubmit={handleSubmit(onSubmit)}>
                    <FormGroupCustom
                        key={`user-${edit?.id}-${watch('is_send_to_all')}}`}
                        label={FM('customer')}
                        isDisabled={watch('is_send_to_all')}
                        name={'customer'}
                        type={'select'}
                        className='m-2'
                        path={userType === UserType.Admin ? ApiEndpoints.customer_list : ApiEndpoints.customer_store_wise}
                        selectLabel='email'
                        selectValue={'id'}
                        isMulti
                        async
                        defaultOptions
                        loadOptions={loadDropdown}
                        control={control}
                        rules={{
                            required: watch('is_send_to_all') !== 1
                        }}
                        prepend={
                            <InputGroupText className='p-25'>
                                <BsTooltip title={FM('sent-to-all-customers')}>
                                    <FormGroupCustom
                                        noLabel
                                        label={FM('select-all-store')}
                                        name={'is_send_to_all'}
                                        type={'checkbox'}
                                        control={control}
                                        className={'ms-1 me-25'}
                                        rules={{
                                            required: false
                                        }}
                                    />
                                </BsTooltip>
                            </InputGroupText>
                        }
                    />
                </Form>
            </CenteredModal>
        </>
    )
}
