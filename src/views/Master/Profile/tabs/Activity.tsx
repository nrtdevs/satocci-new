/* eslint-disable prettier/prettier */
import { useEffect, useReducer } from 'react'
import { TableColumn } from 'react-data-table-component'
import { RefreshCcw } from 'react-feather'
import { useForm } from 'react-hook-form'
import { ButtonGroup } from 'reactstrap'
import { activityParams, useLoadActivityMutation } from '../../../../redux/RTKQuery/StoreRTK'
import { UserType } from '../../../../utility/Const'
import { formatDate, truncateText } from '../../../../utility/Utils'
import { loadDropdown } from '../../../../utility/apis/dropdowns'
import { FM, isValid } from '../../../../utility/helpers/common'
import useUser from '../../../../utility/hooks/useUser'
import useUserType from '../../../../utility/hooks/useUserType'
import ApiEndpoints from '../../../../utility/http/ApiEndpoints'
import { stateReducer } from '../../../../utility/stateReducer'
import CustomDataTable, { TableFormData } from '../../../components/CustomDataTable/CustomDataTable'
import LoadingButton from '../../../components/buttons/LoadingButton'
import FormGroupCustom from '../../../components/formGroupCustom/FormGroupCustom'
import Header from '../../../components/header'
import { useNoViewModal } from '../../../components/modal/HandleModal'
import ActivityDetail from './ActivityDetail'

interface States {
    page?: any
    per_page_record?: any
    changeObject?: any
    search?: any
    reload?: any
    logFilter?: boolean
    isRemoving?: boolean
    isReloading?: boolean
    isAddingNewData?: boolean
    transactionFilter?: boolean
    filterData?: any
    lastRefresh?: any
    edit?: any
}

const Activity = ({
    filterData = null,
    setLoadingResp = () => { },
    lastRefLoad = ''
}: {
    filterData?: any
    lastRefLoad?: any
    setLoadingResp?: (e: boolean) => void
}) => {
    const initState: States = {
        page: 1,
        lastRefresh: new Date().getTime(),
        per_page_record: 5,
        changeObject: null,
        transactionFilter: false,
        filterData: {
            properties: null
        },
        search: undefined,
        isRemoving: false,
        isReloading: false,
        isAddingNewData: false
    }

    const reducers = stateReducer<States>
    const [state, setState] = useReducer(reducers, initState)
    const form = useForm<any>()
    const [showModal, handleModal] = useNoViewModal()
    const userType = useUserType()
    const user = useUser()
    const { handleSubmit, control, reset, setValue, watch, clearErrors } = form
    const [loadActivity, { data, isError, isLoading, isSuccess }] = useLoadActivityMutation()

    const load = () => {
        if (userType === UserType.Admin) {
            loadActivity({
                jsonData: {
                    userType,

                    search: state?.search,
                    user_id: watch('user_id')?.value,
                    date_from: watch('date_from'),
                    date_to: watch('date_to'),
                    order_by: '1'
                    // subscription_type: 2,
                    // store_name: watch('store_name'),
                    // store_email: watch('store_email'),
                    // city: watch('city')
                },
                page: state?.page,
                per_page_record: state?.per_page_record
            })
        } else {
            loadActivity({
                jsonData: {
                    userType,
                    store_id: user?.store_id,
                    search: state?.search,
                    user_id: watch('user_id')?.value,
                    date_from: watch('date_from'),
                    date_to: watch('date_to'),
                    order_by: '1'
                    // subscription_type: 2,
                    // store_name: watch('store_name'),
                    // store_email: watch('store_email'),
                    // city: watch('city')
                },
                page: state?.page,
                per_page_record: state?.per_page_record
            })
        }
    }

    useEffect(() => {
        // log(data, isLoading, isSuccess)
        setLoadingResp(isLoading)
    }, [isLoading])
    useEffect(() => {
        setState({
            page: 1
        })
    }, [state.per_page_record])

    useEffect(() => {
        if (isValid(user?.store_id)) {
            load()
        }
    }, [
        isValid(user?.store_id),
        state?.page,
        state?.per_page_record,
        state?.lastRefresh,
        state?.search,
        watch('user_id'),
        watch('date_from'),
        watch('date_to')
    ])

    const handlePageChange = (e: TableFormData) => {
        // log('state change', e)
        setState({ ...e })
    }
    const columns: TableColumn<activityParams>[] = [
        {
            name: '#',
            maxWidth: '10px',
            cell: (row, index: any) => {
                // eslint-disable-next-line no-mixed-operators
                return parseInt(state?.per_page_record) * (state?.page - 1) + (index + 1)
            }
        },
        {
            name: <>{FM('log-name')}</>,

            cell: (row) => (
                <span
                    className='cursor-pointer'
                    onClick={() => {
                        setState({
                            edit: row
                        })
                        handleModal()
                    }}
                >
                    <u className='text-primary'>{truncateText(row?.log_name, 25)}</u>
                </span>
            )
        },
        {
            name: <>{FM('causer')}</>,

            minWidth: '120px',

            cell: (row) => <span className=''>{truncateText(row?.name, 50)}</span>
        },

        {
            name: <>{FM('description')}</>,

            cell: (row) => <span className=''>{truncateText(row?.description, 25)}</span>
        },
        // {
        //   name: <>{FM('subject-type')}</>,

        //   minWidth: '120px',

        //   cell: (row) => <span className=''>{truncateText(row?.subject_type, 50)}</span>
        // },

        {
            name: <>{FM('created-at')}</>,

            cell: (row) => <span className=''>{formatDate(row?.created_at, 'YYYY-MM-DD HH:mm:ss')}</span>
        }
    ]
    return (
        <>
            <ActivityDetail
                edit={state?.edit}
                showModal={showModal}
                setShowModal={(e) => {
                    setState({
                        edit: null
                    })
                    handleModal()
                }}
                noView
            />
            <Header title={FM('activity-log')} titleCol='4' childCol='8'>
                <FormGroupCustom
                    noLabel
                    tooltip={FM('user-list')}
                    key={`user_id`}
                    label={FM('user-list')}
                    isClearable
                    name={`user_id`}
                    type={'select'}
                    className='me-1 flex-1'
                    path={userType === UserType.Admin || userType === UserType.AdminEmployee ? ApiEndpoints.load_stores : ApiEndpoints.subStore_list}
                    selectLabel='name'
                    selectValue={'id'}
                    jsonData={{
                        get_all: "all"
                    }}
                    modifyDropdownData={(d: any) => {
                        return {
                            ...d,

                            name: `${d?.name} / (${d?.store_setting?.store_name ?? d?.store_setting?.store_name})`
                        }
                    }}
                    async
                    method='post'
                    defaultOptions
                    loadOptions={loadDropdown}
                    control={control}
                    rules={{ required: true }}
                />
                <FormGroupCustom
                    noLabel
                    tooltip={FM('from-date')}
                    label={FM('from-date')}
                    //   noLabel
                    type={'date'}
                    name={'date_from'}
                    className='me-1'
                    control={control}
                    rules={{ required: false }}
                />

                <FormGroupCustom
                    noLabel
                    tooltip={FM('to-date')}
                    label={FM('to-date')}
                    //   noLabel
                    type={'date'}
                    name={'date_to'}
                    className='me-1'
                    control={control}
                    rules={{ required: false }}
                />

                <ButtonGroup>
                    <LoadingButton
                        loading={false}
                        onClick={() => {
                            setState({
                                lastRefresh: new Date().getTime()
                            })
                            reset()
                        }}
                        className='btn btn-dark btn-sm'
                        size='sm'
                    >
                        <RefreshCcw size={15} />
                    </LoadingButton>
                </ButtonGroup>
            </Header>
            <CustomDataTable<activityParams>
                initialPerPage={5}
                isLoading={isLoading}
                // options={options}
                // selectableRows
                // hideHeader
                columns={columns}
                HidePerPage
                paginatedData={data}
                // tableData={details?.product_offers}
                handlePaginationAndSearch={handlePageChange}
            />
        </>
    )
}
export default Activity
