/* eslint-disable prettier/prettier */
import { useEffect, useReducer, useState } from 'react'
import { useFieldArray, useForm } from 'react-hook-form'

import { CardBody, Col, InputGroupText, Label, ListGroup, ListGroupItem, Row } from 'reactstrap'
import { activityParams, useLoadActivityByIdMutation } from '../../../redux/RTKQuery/StoreRTK'
import { FM, isValid } from '../../../utility/helpers/common'
import Show from '../../../utility/Show'
import { stateReducer } from '../../../utility/stateReducer'
import { JsonToTable } from 'react-json-to-table'

import CenteredModal from '../../components/modal/CenteredModal'
import { truncateText } from '../../../utility/Utils'
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

export default function LoginLogDetails<T>(props: T & dataType) {
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
    const form = useForm<activityParams>()
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
    const reducers = stateReducer<States>
    const [state, setState] = useReducer(reducers, initState)
    const [open, setOpen] = useState(false)
    const {
        formState: { errors },
        handleSubmit,
        control,
        reset,
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
    const [loadByID, { data, isError, isLoading, isSuccess }] = useLoadActivityByIdMutation()
    const load = () => {
        loadByID({
            id: edit?.id,
            jsonData: { name: state?.search },
            page: state?.page,
            per_page_record: state?.per_page_record
        })
    }
    useEffect(() => {
        if (edit?.id) {
            load()
        }
    }, [state?.page, state?.per_page_record, edit])
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
                scrollControl={false}
                modalClass='modal-lg'
                loading={isLoading}
                open={open}
                hideSave
                handleModal={closeModal}
                // handleSave={handleSubmit(handleSave)}
                title={FM('login-log')}
            >
                <CardBody className='p-1'>
                    <Row>
                        <Col sm='12' md='6'>
                            <ListGroup className='ml-2 py-2'>
                                <ListGroupItem className='d-flex justify-content-between align-items-center'>
                                    {/* <p>{edit?.log_name}</p> */}
                                    <span className='fw-bolder'> {FM('city-name')} :</span>
                                    <span className='fw-bolder'>{truncateText(edit?.cityName, 30)}</span>
                                    {/* <p>{edit?.properties?.attributes}</p> */}
                                </ListGroupItem>
                                <ListGroupItem className='d-flex justify-content-between align-items-center'>
                                    {/* <p>{edit?.log_name}</p> */}
                                    <span className='fw-bolder'> {FM('country-code')} :</span>
                                    <span className='fw-bolder'>{edit?.countryCode}</span>
                                    {/* <p>{edit?.properties?.attributes}</p> */}
                                </ListGroupItem>
                                <ListGroupItem className='d-flex justify-content-between align-items-center'>
                                    <span className='fw-bolder'>{FM('country-name')}:</span>
                                    <span className='fw-bolder'>{edit?.countryName}</span>
                                </ListGroupItem>
                                <ListGroupItem className='d-flex justify-content-between align-items-center'>
                                    <span className='fw-bolder'>{FM('area-code')}:</span>
                                    <span className='fw-bolder'>{edit?.areaCode}</span>
                                </ListGroupItem>
                                <ListGroupItem className='d-flex justify-content-between align-items-center'>
                                    <span className='fw-bolder'>{FM('postal-code')}:</span>
                                    <span className='fw-bolder'>{edit?.postalCode}</span>
                                </ListGroupItem>
                                <ListGroupItem className='d-flex justify-content-between align-items-center'>
                                    <span className='fw-bolder'>{FM('region-code')}:</span>
                                    <span className='fw-bolder'>{edit?.regionCode}</span>
                                </ListGroupItem>
                                <ListGroupItem className='d-flex justify-content-between align-items-center'>
                                    <span className='fw-bolder'>{FM('zipcode')}:</span>
                                    <span className='fw-bolder'>{edit?.zipCode}</span>
                                </ListGroupItem>
                            </ListGroup>
                        </Col>
                        <Col sm='12' md='6'>
                            <ListGroup className='mr-2 py-2'>
                                <ListGroupItem className='d-flex justify-content-between align-items-center'>
                                    <span className='fw-bolder'>{FM('ip')} :</span>
                                    <span className='fw-bolder'>{edit?.ip}</span>
                                </ListGroupItem>
                                <ListGroupItem className='d-flex justify-content-between align-items-center'>
                                    <span className='fw-bolder'>{FM('iso-code')} :</span>
                                    <span className='fw-bolder'>{edit?.isoCode}</span>
                                </ListGroupItem>
                                <ListGroupItem className='d-flex justify-content-between align-items-center'>
                                    <span className='fw-bolder'>{FM('latitude')} :</span>
                                    <span className='fw-bolder'>{edit?.latitude}</span>
                                </ListGroupItem>
                                <ListGroupItem className='d-flex justify-content-between align-items-center'>
                                    <span className='fw-bolder'>{FM('longitude')} :</span>
                                    <span className='fw-bolder'>{edit?.longitude}</span>
                                </ListGroupItem>
                                <ListGroupItem className='d-flex justify-content-between align-items-center'>
                                    <span className='fw-bolder'>{FM('metro-code')} :</span>
                                    <span className='fw-bolder'>{edit?.metroCode}</span>
                                </ListGroupItem>
                                <ListGroupItem className='d-flex justify-content-between align-items-center'>
                                    <span className='fw-bolder'>{FM('region-name')} :</span>
                                    <span className='fw-bolder'>{edit?.regionName}</span>
                                </ListGroupItem>
                                <ListGroupItem className='d-flex justify-content-between align-items-center'>
                                    <span className='fw-bolder'>{FM('time-zone')} :</span>
                                    <span className='fw-bolder'>{edit?.timezone}</span>
                                </ListGroupItem>
                            </ListGroup>
                        </Col>
                    </Row>

                </CardBody>
            </CenteredModal>
        </>
    )
}
