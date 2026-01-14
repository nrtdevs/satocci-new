/* eslint-disable prettier/prettier */
import { useEffect, useReducer, useState } from 'react'
import { useFieldArray, useForm } from 'react-hook-form'

import { CardBody, Col, InputGroupText, Row } from 'reactstrap'
import { useCreateOrUpdateCategoryMutation } from '../../../redux/RTKQuery/CategoryRTK'
import { UserType } from '../../../utility/Const'
import { FM, isValid } from '../../../utility/helpers/common'
import useUserType from '../../../utility/hooks/useUserType'
import { stateReducer } from '../../../utility/stateReducer'
import { getUserData } from '../../../utility/Utils'

import FormGroupCustom from '../../components/formGroupCustom/FormGroupCustom'
import CenteredModal from '../../components/modal/CenteredModal'

export type CategoryParamsType = {
    id?: string
    name?: string
    status?: string
    parent_id?: any
    payload?: any
    parent?: any
    data?: any
    store_id?: any
    category_code?: any
    vat_tax?: any
    category_details?: any
    updated_at?: any
    created_at?: any
    eventId?: any
    originalArgs?: any
    jsonData?: any
    order_return_id?: any
}
interface States {
    languageList?: any
    editData?: any
    loading?: boolean
    text?: string
    list?: any
    page?: any
    per_page_record?: any
    search?: any
    formData?: any
}
interface dataType {
    edit?: any
    parentId?: any
    noView?: boolean
    showModal?: boolean
    setShowModal?: (e: boolean) => void
    Component?: any
    loading?: boolean
    children?: any
    response?: (e: boolean) => void
}

export default function CategoryAddForm<T>(props: T & dataType) {
    const {
        edit = null,
        parentId = null,
        noView = false,
        showModal = false,
        setShowModal = () => { },
        Component = 'span',
        children = null,
        response = () => { },
        ...rest
    } = props
    const form = useForm<CategoryParamsType>()
    const { fields, append, prepend, remove, swap, move, insert } = useFieldArray<CategoryParamsType>(
        {
            control: form?.control, // control props comes from useForm (optional: if you are using FormContext)
            name: 'category_details' // unique name for your Field Array
        }
    )
    const initState: States = {
        languageList: [],
        loading: false,
        page: 1,
        per_page_record: 100,
        search: undefined,
        text: '',
        list: [],
        formData: {
            id: null,
            name: null,
            status: null,
            patent_id: null,
            category_details: [],
            updated_at: null
        }
    }
    const userType = useUserType()
    const reducers = stateReducer<States>
    const [state, setState] = useReducer(reducers, initState)
    const [open, setOpen] = useState(false)
    const {
        formState: { errors },
        handleSubmit,
        control,
        reset,
        watch,
        setValue
    } = form

    const openModal = () => {
        setOpen(true)
    }
    const closeModal = (from = null) => {
        setOpen(false)
        setShowModal(false)
        reset()
    }
    const user = getUserData()
    // const [loadLanguage, languageResult] = useLanguageListMutation()
    const [createCategory, result] = useCreateOrUpdateCategoryMutation()

    // useEffect(() => {
    //   if (isValidArray(user?.languages)) {
    //     setState({
    //       languageList: user?.languages
    //     })
    //   }
    // }, [])

    // useEffect(() => {
    //   if (open) loadLanguage({ jsonData: { name: state?.search } })
    // }, [open])

    const handleSave = (d: CategoryParamsType) => {
        if (edit?.id) {
            createCategory({ ...edit, ...d })
        } else {
            createCategory({
                ...d,
                store_id:
                    userType === UserType.Admin || user?.store_id === UserType.Admin ? 1 : user?.store_id,
                status: '1',
                parent_id: parentId
            })
        }
    }

    useEffect(() => {
        if (result?.isSuccess) {
            closeModal()
            response(result.isSuccess)
        }
    }, [result?.isSuccess])

    useEffect(() => {
        if (noView && showModal) {
            openModal()
        }
    }, [noView, showModal])

    useEffect(() => {
        if (isValid(edit?.id)) {
            setValue('name', edit?.name)
            setValue('category_code', edit?.category_code)
            setValue('vat_tax', edit?.vat_tax)
        }
    }, [edit])

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
                disableSave={!isValid(watch('name')) || result?.isLoading}
                loading={false}
                open={open}
                handleModal={closeModal}
                handleSave={handleSubmit(handleSave)}
                title={isValid(edit) ? FM('update-category') : FM('add-category')}
            >
                {/* <Form> */}
                <CardBody className=''>
                    <Row>
                        <FormGroupCustom
                            type={'number'}
                            // noLabel
                            control={control}
                            rules={{ required: false, min: 0, maxLength: 100 }}
                            name={`category_code`}
                            className='mb-1'
                            label={FM('category-code')}

                        />
                        <Col md='12'>
                            <FormGroupCustom
                                type={'text'}
                                // noLabel
                                control={control}
                                rules={{ required: true, maxLength: 40 }}
                                name={`name`}
                                className='mb-1'
                                label={FM('category-name')}
                            />
                            <FormGroupCustom
                                type={'number'}
                                // noLabel
                                control={control}
                                rules={{ required: false, min: 0, maxLength: 5, max: 100 }}
                                name={`vat_tax`}
                                className='mb-1'
                                label={FM('vat-optional')}
                                append={<InputGroupText>%</InputGroupText>}
                            />
                        </Col>
                    </Row>
                </CardBody>
                {/* </Form> */}
            </CenteredModal>
        </>
    )
}
