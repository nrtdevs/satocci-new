/* eslint-disable prettier/prettier */
import { useContext, useEffect, useReducer } from 'react'

import { Dribbble, Globe, RefreshCcw, Save } from 'react-feather'
import { Button, ButtonGroup, ButtonProps, InputGroupText, Spinner } from 'reactstrap'
import { ThemeColors } from '../../../../utility/context/ThemeColors'

import { FM, isValidArray } from '../../../../utility/helpers/common'
import { stateReducer } from '../../../../utility/stateReducer'
import { truncateText } from '../../../../utility/Utils'
import Header from '../../../components/header'

import { TableColumn } from 'react-data-table-component'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useNavigate, useParams } from 'react-router-dom'
import {
    LabelsParams,
    useCreateOrUpdateLabelsMutation,
    useLoadLabelsMutation
} from '../../../../redux/RTKQuery/LabelsRTK'
import LoadingButton from '../../../components/buttons/LoadingButton'
import CustomDataTable, { TableFormData } from '../../../components/CustomDataTable/CustomDataTable'
import FormGroupCustom from '../../../components/formGroupCustom/FormGroupCustom'
import BsTooltip from '../../../components/tooltip'
import UnknownLabelModal from './UnknownLabelsModal'

interface States {
    page?: any
    labelsArr?: any
    arrIndex?: any
    per_page_record?: any
    search?: any
    reload?: any
    editData?: any
    formData?: any
    showModal?: any
    isAddingNewData?: boolean
    isReloading?: boolean
    isRemoving?: boolean
    lastRefresh?: any
}
function LabelsLanguage() {
    const { colors } = useContext(ThemeColors)
    // Local States
    const { i18n } = useTranslation()
    const initState: States = {
        formData: {},
        labelsArr: [],
        per_page_record: 15,
        search: undefined,
        page: 1,

        lastRefresh: new Date().getTime()
    }
    const reducers = stateReducer<States>
    const [state, setState] = useReducer(reducers, initState)
    // const dispatch = useAppDispatch()
    const nav = useNavigate()
    const params = useParams()
    const form = useForm<any>()

    const {
        watch,
        formState: { errors },
        handleSubmit,
        control,
        setValue,
        setError,
        reset
    } = form
    // Load Store Data
    const [loadLabels, { data, isLoading }] = useLoadLabelsMutation()
    const arrLabels = data?.payload
    const [updateLabels, res] = useCreateOrUpdateLabelsMutation()
    useEffect(() => {
        loadLabels({
            jsonData: { name: state?.search, status: 1, language_id: params?.languageId },
            page: state?.page,
            per_page_record: state?.per_page_record
        })
    }, [params, state.page, state.per_page_record, state.search, state.lastRefresh, res])

    useEffect(() => {
        setState({
            labelsArr: data?.payload?.data
        })
    }, [data])

    const updateLanguageLabels = (obj: any, index: any) => {
        const matchObj: any = isValidArray(state?.labelsArr)
            ? state?.labelsArr?.filter((d: any) => d?.id === obj?.id)
            : {}
        setState({
            arrIndex: index
        })
        updateLabels({
            ...matchObj[0],
            label_value: watch(`${index}.label_value`) ?? matchObj[0]?.label_value
        })
    }

    useEffect(() => {
        setState({
            page: 1
        })
    }, [state.per_page_record])
    const handlePageChange = (e: TableFormData) => {
        //log('state change', e)
        setState({ ...e })
    }

    useEffect(() => {
        reset()
    }, [state?.page, state.per_page_record, state?.search])
    const setObjectForm = (obj: any, index: any) => {
        const objectSet = isValidArray(state?.labelsArr)
            ? state?.labelsArr?.filter((d: any) => d?.id === obj?.id)
            : {}
        return (
            <>
                {obj?.id === objectSet[0]?.id ? (
                    <FormGroupCustom
                        // noLabel

                        noLabel
                        key={`${obj?.label_value}`}
                        type={'text'}
                        control={control}
                        name={`${index}.label_value`}
                        defaultValue={obj?.label_value}
                        className='me-2 flex-1'
                        label={truncateText(objectSet[0]?.label_value, 30)}
                        rules={{ required: true }}
                        append={
                            <BsTooltip
                                key={`${objectSet[0]?.id}`}
                                onClick={() => updateLanguageLabels(obj, index)}
                                Tag={InputGroupText}
                                title={FM('save')}
                                role='button'
                            >
                                {res?.isLoading && state?.arrIndex === index ? (
                                    <Spinner key={`${objectSet[0]?.id}`} animation='border' size={'sm'}>
                                        <span className='visually-hidden'>Loading...</span>
                                    </Spinner>
                                ) : (
                                    <Save key={`${objectSet[0]?.id}`} size={14} className='text-primary' />
                                )}
                            </BsTooltip>
                        }
                    />
                ) : (
                    ''
                )}
            </>
        )
    }

    const columns: TableColumn<LabelsParams>[] = [
        {
            name: FM('name'),
            maxWidth: '250px',
            //sortable: row => row.full_name,
            cell: (row) => (
                <>
                    <span className='text-capitalize'>{row?.label_name}</span>
                </>
            )
        },
        {
            name: <span className='ms-3'>{FM('label-value')}</span>,

            //sortable: row => row.full_name,
            cell: (row, i) => (
                <span key={row?.id} className='flex-1'>
                    {setObjectForm(row, i)}
                </span>
            )
        }
    ]

    const reloadData = () => {
        setState({
            page: 1,
            lastRefresh: new Date().getTime(),
            search: ''
        })
    }

    return (
        <>
            <Header goBackTo onClickBack={() => nav(-1)} icon={<Globe size='25' />} title={FM('labels')}>
                <ButtonGroup color='dark'>
                    <UnknownLabelModal<ButtonProps>
                        response={(e) =>
                            setState({ isAddingNewData: e, lastRefresh: new Date().getTime(), page: 1 })
                        }
                        languageId={params?.languageId}
                        Component={Button}
                        title={FM('add-missing-labels')}
                        size='sm'
                        color='primary'
                    >
                        <Dribbble size='14' />
                    </UnknownLabelModal>
                    <LoadingButton
                        loading={isLoading}
                        size='sm'
                        color='dark'
                        onClick={reloadData}
                        tooltip={FM('reload')}
                    >
                        <RefreshCcw size='14' />
                    </LoadingButton>
                </ButtonGroup>
            </Header>

            <CustomDataTable<LabelsParams>
                key={state.lastRefresh}
                initialPerPage={15}
                isLoading={isLoading}
                columns={columns}
                paginatedData={data}
                handlePaginationAndSearch={handlePageChange}
            />
        </>
    )
}
export default LabelsLanguage
