/* eslint-disable prettier/prettier */
import { useEffect, useReducer, useState } from 'react'
import { useForm } from 'react-hook-form'
import { CardBody, Col, Row } from 'reactstrap'

import { profileParams, useUpdateProfileMutation } from '../../../redux/RTKQuery/StoreRTK'

import { FM, isValid } from '../../../utility/helpers/common'
import { stateReducer } from '../../../utility/stateReducer'
import { fillObject, getUserData, setValues, SuccessToast } from '../../../utility/Utils'
import FormGroupCustom from '../../components/formGroupCustom/FormGroupCustom'
import CenteredModal from '../../components/modal/CenteredModal'
import ApiEndpoints from '../../../utility/http/ApiEndpoints'
import { loadDropdown } from '../../../utility/apis/dropdowns'
import { useUpdatePasswordAnyUserMutation } from '../../../redux/RTKQuery/AppSettingsRTK'

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

    // rest?: any
}
interface States {
    loading?: boolean
    text?: string
    formData?: profileParams
}

export default function UpdateUsersPassword<T>(props: T & dataType) {
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
        loading: false,

        formData: {
            password: null,
            city: null,
            address: null,
            name: null,
            country: null,
            mobile_number: null,
            personal_number: null,
            unique_id: null,
            is_change_password: null
        }
    }

    const reducers = stateReducer<States>
    const [state, setState] = useReducer(reducers, initState)
    const [open, setOpen] = useState(false)

    const form = useForm<profileParams>()
    const user = getUserData()
    const {
        watch,
        formState: { errors },
        handleSubmit,
        control,
        setValue,
        reset
    } = form

    const openModal = () => {
        setOpen(true)
    }
    const closeModal = (from = null) => {
        setOpen(false)
        setShowModal(false)
        reset()
    }
    const [updatePassword, result] = useUpdatePasswordAnyUserMutation()
    const handleSave = (d: any) => {
        updatePassword({
            jsonData: {
                ...d,
                user_id: d.user_id?.value,
                is_change_password: 1
            }
            // ...d,
            // is_change_password: 1
        })
    }

    useEffect(() => {
        if (result.isSuccess) {
            SuccessToast(result?.data?.message)
            closeModal()
            response(result.isSuccess)
            reset()
        }
    }, [result.isSuccess])

    useEffect(() => {
        if (noView && showModal) {
            openModal()
        }
    }, [noView, showModal])
    // useEffect(() => {
    //     if (isValid(user) && user !== undefined) {
    //         const f = fillObject<profileParams>(state?.formData, user)
    //         const formData: profileParams = {
    //             unique_id: user?.unique_id
    //         }
    //         // log(formData)
    //         setValues<profileParams>(formData, setValue)
    //     }
    // }, [user])

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
                disableSave={watch('confirm_password') !== watch('password')}
                loading={result.isLoading}
                open={open}
                handleModal={closeModal}
                handleSave={handleSubmit(handleSave)}
                title={FM('update-users-password')}
            >
                <form>
                    <CardBody className=''>
                        <Row>
                            <Col md="12">
                                <FormGroupCustom
                                    async
                                    isClearable
                                    label={FM('users')}
                                    name={`user_id`}
                                    type={'select'}
                                    className='mb-1'
                                    searchItem={"search"}
                                    path={ApiEndpoints.allUserList}
                                    selectLabel={'email'}
                                    selectValue={'id'} loadOptions={loadDropdown}
                                    control={control}
                                    rules={{ required: true }}
                                />
                            </Col>
                            <Col md='12' className=''>
                                <FormGroupCustom
                                    type={'password'}
                                    control={control}
                                    name='password'

                                    className='mb-1'
                                    label={FM('password')}
                                    rules={{ required: true }}
                                />
                            </Col>
                            <Col md='12' className=''>
                                <FormGroupCustom
                                    type={'password'}
                                    control={control}
                                    name='confirm_password'
                                    label={FM('confirm-password')}
                                    rules={{ required: true }}
                                />
                            </Col>
                        </Row>
                    </CardBody>
                </form>
            </CenteredModal>
        </>
    )
}
