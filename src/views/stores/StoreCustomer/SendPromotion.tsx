/* eslint-disable prettier/prettier */
/* eslint-disable eqeqeq */
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { Form, InputGroupText } from 'reactstrap'
import { useSendPromotionTemplateMutation } from '../../../redux/RTKQuery/PromotionTemplateRTK'
import { loadDropdown } from '../../../utility/apis/dropdowns'
import { sendType, UserType } from '../../../utility/Const'

import { FM, isValid, isValidArray, log } from '../../../utility/helpers/common'
import ApiEndpoints from '../../../utility/http/ApiEndpoints'
import { getKeyByValue } from '../../../utility/Utils'
import FormGroupCustom from '../../components/formGroupCustom/FormGroupCustom'

import CenteredModal from '../../components/modal/CenteredModal'

import BsTooltip from '../../components/tooltip'
import useUser from '../../../utility/hooks/useUser'
import useUserType from '../../../utility/hooks/useUserType'
import { truncate } from 'fs'

export type CategoryParamsType = {
    id?: string
    name: string
    status?: string
    patent_id?: string
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
}

export default function SendPromotion<T>(props: T & dataType) {

    const userType = useUserType()
    const form = useForm<any>()
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

    const onSubmit = (e: any) => {
        log(e, 'e', edit)
        if (isValidArray(edit)) {
            sendPromotion({
                content_id: e?.content_id?.value,
                user_ids: edit,
                is_send_to_all: 'no'
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
                            {/* {FM(getKeyByValue(sendType, edit?.content_type))}: {edit?.content_header} */}
                            {FM('send-promotion')}
                        </div>
                    </>
                }
            >
                <Form onSubmit={handleSubmit(onSubmit)}>
                    <FormGroupCustom
                        key={`user-${edit?.id}-${watch('is_send_to_all')}}`}
                        label={FM('promotions')}
                        //  isDisabled={watch('is_send_to_all')}
                        name={'content_id'}
                        type={'select'}
                        className='m-2'
                        path={ApiEndpoints.promotion_template_list}
                        selectLabel='content_header'
                        selectValue={'id'}
                        //   isMulti
                        async
                        defaultOptions
                        loadOptions={loadDropdown}
                        control={control}
                        rules={{
                            required: true
                        }}
                    // prepend={
                    //     <InputGroupText className='p-25'>
                    //         <BsTooltip title={FM('sent-to-all-customers')}>
                    //             <FormGroupCustom
                    //                 noLabel
                    //                 label={FM('select-all-store')}
                    //                 name={'is_send_to_all'}
                    //                 type={'checkbox'}
                    //                 control={control}
                    //                 className={'ms-1 me-25'}
                    //                 rules={{
                    //                     required: false
                    //                 }}
                    //             />
                    //         </BsTooltip>
                    //     </InputGroupText>
                    // }
                    />
                </Form>
            </CenteredModal>
        </>
    )
}
