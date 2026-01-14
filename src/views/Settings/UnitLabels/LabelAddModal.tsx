/* eslint-disable prettier/prettier */
import { Fragment, useEffect, useReducer, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useParams } from 'react-router-dom'
import { Alert, CardBody, Col, Form, InputGroupText, Label, Row } from 'reactstrap'
import { useCreateOrUpdateProductOfferMutation } from '../../../redux/RTKQuery/ProductRTK'
import { loadDropdown } from '../../../utility/apis/dropdowns'
import { ProductOfferTypes, ProductOfferTypesDrops, UserType } from '../../../utility/Const'
import { FM, isValid, log } from '../../../utility/helpers/common'
import Hide from '../../../utility/Hide'
import useUser from '../../../utility/hooks/useUser'
import useUserType from '../../../utility/hooks/useUserType'
import ApiEndpoints from '../../../utility/http/ApiEndpoints'
import Show from '../../../utility/Show'
import { stateReducer } from '../../../utility/stateReducer'
import {
    addDay,
    CF,
    createConstSelectOptions,
    formatDate,
    truncateText
} from '../../../utility/Utils'
import FormGroupCustom from '../../components/formGroupCustom/FormGroupCustom'

import CenteredModal from '../../components/modal/CenteredModal'
import SimpleImageUpload from '../../components/SimpleImageUpload'
import { useCreateOrUpdateLabelsMutation } from '../../../redux/RTKQuery/LabelsRTK'
import { group } from 'console'
import { useLoadGroupByIdMutation } from '../../../redux/RTKQuery/GroupRTK'


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
    language_id: any
    showModal?: boolean
    resData?: (e: boolean) => void
    setShowModal?: (e: boolean) => void
    Component?: any
    loading?: boolean
    children?: any
    // rest?: any
}

export default function LabelAddModal<T>(props: T & dataType) {
    const {
        edit = null,
        noView = false,
        language_id = null,
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
    const form = useForm<any>()
    const { handleSubmit, control, reset, setValue, watch, clearErrors, resetField } = form
    const [createLabel, result] = useCreateOrUpdateLabelsMutation()
    const [viewGroup, resGroup] = useLoadGroupByIdMutation()
    const groupData: any = resGroup?.data
    const isAdmin = !!(userType === UserType.Admin || user?.store_id === UserType.Admin)
    const openModal = () => {
        setOpen(true)
    }
    const closeModal = (from = null) => {
        reset()
        setOpen(false)
        setShowModal(false)
    }

    useEffect(() => {
        if (isValid(edit?.group_id)) {
            viewGroup({ id: edit?.group_id })
        }
    }, [edit])

    const handleSave = (d: any) => {
        createLabel({
            ...d,
            group_id: d?.group_id?.value,
            language_id

        })
    }
    ///////////////

    useEffect(() => {
        clearErrors()

    }, [open])
    useEffect(() => {
        if (noView && showModal) {
            openModal()
        }
    }, [noView, showModal])

    //////
    useEffect(() => {
        if (result?.isSuccess) {
            resData(true)
            reset()
            closeModal()
        }
    }, [result])

    useEffect(() => {
        if (isValid(edit?.id) && resGroup.isSuccess) {
            const gData: any = resGroup?.data?.payload
            const data = {
                ...edit,
                language_id,
                label_value: edit?.label_value,
                label_name: edit?.label_name,
                group_id: {
                    label: gData?.name,
                    value: gData?.id
                }
            }
            Object.keys(data).forEach((key) => {
                setValue(key, data[key])
            })
            //    openModal()
        }
    }, [edit, resGroup])

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
                loading={result?.isLoading}
                open={open}
                disableSave={result?.isLoading}
                handleModal={closeModal}
                handleSave={handleSubmit(handleSave)}
                title={!isValid(edit) ? FM(`create-label`) : FM(`update-label`)}
            >
                <form>
                    <CardBody>
                        <Row>
                            <Col md={12}>
                                <FormGroupCustom
                                    key={`${edit?.id}-${groupData?.id}`}
                                    label={FM('groups')}
                                    isClearable
                                    async
                                    searchItem={'search'}
                                    path={ApiEndpoints.load_group}
                                    selectLabel='name'
                                    selectValue={'id'}

                                    defaultOptions
                                    loadOptions={loadDropdown}
                                    name={`group_id`}
                                    type={'select'}
                                    className='mb-1'
                                    control={control}
                                    rules={{ required: true }}

                                />
                            </Col>

                            {/* label_name */}
                            <Col md={12}>
                                <FormGroupCustom
                                    key={`${edit?.id}-${groupData?.id}`}
                                    label={FM('label-name')}
                                    placeholder={FM('label-name')}
                                    type='text'
                                    name='label_name'
                                    className={"mb-1"}
                                    control={control}
                                    rules={{ required: true }}
                                />
                            </Col>
                            {/* label_value */}
                            <Col md={12}>
                                <FormGroupCustom
                                    key={`${edit?.id}-${groupData?.id}`}
                                    label={FM('label-value')}
                                    placeholder={FM('label-value')}
                                    type='text'
                                    name='label_value'
                                    control={control}
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
