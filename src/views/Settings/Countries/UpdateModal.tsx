/* eslint-disable prettier/prettier */
import { useEffect, useReducer, useState } from 'react'
import { ArrowLeftCircle, ArrowRightCircle, Star } from 'react-feather'
import { useForm } from 'react-hook-form'
import { CardBody, Col, Input, InputGroupText, Row, Spinner } from 'reactstrap'

import {
    LanguageRequestParams,
    useCreateOrUpdateLanguageMutation
} from '../../../redux/RTKQuery/LanguageRTK'
import { loadDropdown } from '../../../utility/apis/dropdowns'

import { useCreateOrUpdateLabelsMutation } from '../../../redux/RTKQuery/LabelsRTK'
import { useAppDispatch } from '../../../redux/store'


import { FM, isValid, isValidArray, log } from '../../../utility/helpers/common'
import ApiEndpoints from '../../../utility/http/ApiEndpoints'

import { stateReducer } from '../../../utility/stateReducer'
import { getUserData, setInputErrors } from '../../../utility/Utils'
import FormGroupCustom from '../../components/formGroupCustom/FormGroupCustom'
import CenteredModal from '../../components/modal/CenteredModal'
import { useFetcher } from 'react-router-dom'
import { useUpdateCountryMutation } from '../../../redux/RTKQuery/CountryRTK'

export type countryParams = {
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
    formData?: any
    children?: any

    // rest?: any
}
interface States {
    formData?: any
}

export default function UpdateModal<T>(props: T & dataType) {
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

    const [updateCountry, result] = useUpdateCountryMutation()

    const [createLabel, resultLabel] = useCreateOrUpdateLabelsMutation()

    const handleSave = (d: any) => {
        // Compare this snippet from src/views/Settings/Countries/UpdateModal.tsx:
        updateCountry({

            id: edit?.id,
            country_id: d?.country_id?.value,
            min_cart_value: d?.min_cart_value

        })
    }


    useEffect(() => {
        if (result?.isSuccess) {
            closeModal()
            setFiles(null)
            response(result?.isSuccess)
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


    useEffect(() => {
        if (isValid(edit)) {
            setEditData(edit)
            setValue('country_id', {
                label: edit?.name,
                value: edit?.id
            })
            setValue('min_cart_value', edit?.min_cart_value)
        }
    }, [edit])

    log('editData', edit)
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
                //disableSave={!isValidArray(files) || result.isLoading}
                loading={result.isLoading}
                open={open}
                handleModal={closeModal}
                handleSave={handleSubmit(handleSave)}
                title={FM('update-min-cart-value')}
            >
                <form>
                    <CardBody className=''>
                        <Row>
                            <FormGroupCustom
                                label={FM('country')}
                                placeholder={FM('country')}
                                //   noLabel
                                async
                                isDisabled
                                isClearable
                                path={ApiEndpoints.get_countries}
                                selectLabel='name'
                                selectValue={'id'}
                                defaultOptions
                                loadOptions={loadDropdown}
                                name={'country_id'}
                                type={'select'}
                                className='mb-1'
                                control={control}
                                rules={{ required: true }}

                            />

                            <Col md='12' className=''>
                                <FormGroupCustom
                                    // noLabel
                                    type={'number'}
                                    control={control}
                                    name='min_cart_value'
                                    className='mt-1'
                                    tooltip={FM('minimum-cart-value')}
                                    label={FM('minimum-cart-value')}
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
