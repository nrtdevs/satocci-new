/* eslint-disable prettier/prettier */
import { useEffect, useReducer, useState } from 'react'
import { useForm } from 'react-hook-form'
import { Badge, CardBody, Col, Row, Spinner } from 'reactstrap'
import { languageLoad } from '../../../../redux/reducers/Language'
import {
    LanguageRequestParams
} from '../../../../redux/RTKQuery/LanguageRTK'

import { useAddLabelIfNotExistsMutation, useFindLabelNotAddedLangWiseMutation } from '../../../../redux/RTKQuery/LabelsRTK'
import { useAppDispatch } from '../../../../redux/store'
import { ExportSample, loadLanguageList } from '../../../../utility/apis/ExportLanguage'

import { FM, isValid, log } from '../../../../utility/helpers/common'

import { stateReducer } from '../../../../utility/stateReducer'
import { getUserData } from '../../../../utility/Utils'
import FormGroupCustom from '../../../components/formGroupCustom/FormGroupCustom'
import CenteredModal from '../../../components/modal/CenteredModal'


export type UnknownLabelParams = {
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
    languageId?: any
    loading?: boolean
    formData?: any
    children?: any

    // rest?: any
}
interface States {
    formData?: LanguageRequestParams,
    labelData?: any
}

export default function UnknownLabelModal<T>(props: T & dataType) {
    const {
        edit = null,
        noView = false,
        showModal = false,
        languageId = null,
        setShowModal = () => { },
        Component = 'span',
        response = () => { },
        children = null,
        ...rest
    } = props

    const initState: States = {
        labelData: {},
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
    const [FindLabel, res] = useFindLabelNotAddedLangWiseMutation()
    const [addMIssingLabel, resAdd] = useAddLabelIfNotExistsMutation()
    const dispatch = useAppDispatch()
    const form = useForm<any>()


    useEffect(() => {
        if (res.isSuccess) {
            // Check if initialData is null, then set an empty object as initial state
            if (!isValid(res?.data?.payload?.not_added_label_list)) {
                setState({
                    labelData: {}
                });
            } else {
                // If initialData is not null, then set the initialData to the state
                setState({
                    labelData: res?.data?.payload?.not_added_label_list
                })
            }
        }

    }, [res]);

    useEffect(() => {
        if (isValid(languageId)) {
            FindLabel({
                id: languageId
            })
        }

    }, [languageId, open])

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

    const handleSave = (d: any) => {
        const transformedData = d?.label?.map((e: any) => {
            const keys = Object.keys(e);
            const label_name = keys[1]; // Assuming the label name is always the second key
            const label_value = e[label_name];
            return {
                label_value,
                label_name,
                group_id: e.labelId
            };
        });
        const data = {
            language_id: languageId,
            labels: transformedData

        }

        addMIssingLabel({
            jsonData: {
                ...data
            }
        })
    }

    const loadLanguageListData = () => {
        loadLanguageList({
            success: (e) => {
                dispatch(languageLoad(e?.payload?.data))
            }
        })
    }
    log('Check all', watch('check_all'))
    const sampleBooking = () => {
        ExportSample({
            jsonData: {
                all: watch('check_all') === 1 ? 'yes' : null
            },

            loading: setLoadingSample,
            success: (e: any) => {
                window.open(e?.payload?.url, '_blank')
            }
        })
    }
    useEffect(() => {
        if (resAdd?.isSuccess) {
            closeModal()
            setFiles(null)
            response(resAdd?.isSuccess)

            loadLanguageListData()
        }
    }, [resAdd])

    useEffect(() => {
        if (noView && showModal) {
            openModal()
        }
    }, [noView, showModal])

    return (
        <>
            {!noView ? (
                <Component role='button' onClick={openModal} {...rest}>
                    {children}
                </Component>
            ) : null}
            <CenteredModal
                scrollControl={true}
                modalClass='modal-xl'
                //     disableSave={!isValidArray(files) || result.isLoading}
                loading={resAdd.isLoading}

                open={open}
                handleModal={closeModal}
                handleSave={handleSubmit(handleSave)}
                title={FM('add-missing-labels')}
            >
                <div>
                    {
                        res?.isLoading ? <>
                            <Row className='p-2'>
                                <Col md="4" className='ms-2' >

                                </Col>
                                <Col md="4" className='mb-2 ms-4 align-center'>
                                    <Spinner color="primary" />
                                </Col>
                                <Col md="4" >

                                </Col>

                            </Row>
                        </> : <form>
                            {
                                state.labelData && Object.keys(state.labelData).length === 0 ? <Row className='p-2'>

                                    <Col md="12" className='mb-2  align-center'>
                                        <Badge color='light-danger' className='d-block' >No Missing Labels Found</Badge>
                                    </Col>


                                </Row> :
                                    <CardBody className=''>
                                        <Row>

                                            {Object.keys(state.labelData)?.map((key, i) => (
                                                <Col md="6" key={key}>
                                                    <FormGroupCustom

                                                        placeholder={`${key}`}
                                                        //  label={`${key}`}
                                                        noLabel
                                                        noGroup
                                                        name={`label.${i}.labelId`}
                                                        type={'hidden'}
                                                        className='mb-50'
                                                        // prepend={<InputGroupText>#{bIndex + 1}</InputGroupText>}
                                                        defaultValue={state.labelData[key]}
                                                        control={form?.control}
                                                        rules={{ required: false }}
                                                    />
                                                    <FormGroupCustom
                                                        placeholder={`${key}`}
                                                        label={`${key}`}
                                                        name={`label.${i}.${key}`}
                                                        type={'text'}
                                                        className='mb-50'
                                                        // prepend={<InputGroupText>#{bIndex + 1}</InputGroupText>}

                                                        control={form?.control}
                                                        rules={{ required: true }}
                                                    />
                                                </Col>
                                            ))}

                                        </Row>
                                        {/* <p className='mb-0 p-1 border-bottom fw-bolder text-dark' style={{ backgroundColor: "#f4f4f496" }}>OR(Add Manually)</p> */}
                                    </CardBody>
                            }

                        </form>
                    }

                </div>
            </CenteredModal>
        </>
    )
}
