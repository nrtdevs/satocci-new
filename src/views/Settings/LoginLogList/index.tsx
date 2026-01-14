/* eslint-disable prettier/prettier */
import { useEffect, useReducer } from 'react'
import { TableColumn } from 'react-data-table-component'
import { RefreshCcw } from 'react-feather'
import { useForm } from 'react-hook-form'
import { ButtonGroup } from 'reactstrap'
import { activityParams, useLoginLogMutation } from '../../../redux/RTKQuery/StoreRTK'
import { UserType } from '../../../utility/Const'
import { decrypt, formatDate, truncateText } from '../../../utility/Utils'
import { loadDropdown } from '../../../utility/apis/dropdowns'
import { FM, isValid } from '../../../utility/helpers/common'
import useUser from '../../../utility/hooks/useUser'
import useUserType from '../../../utility/hooks/useUserType'
import ApiEndpoints from '../../../utility/http/ApiEndpoints'
import { stateReducer } from '../../../utility/stateReducer'
import CustomDataTable, { TableFormData } from '../../components/CustomDataTable/CustomDataTable'
import LoadingButton from '../../components/buttons/LoadingButton'
import FormGroupCustom from '../../components/formGroupCustom/FormGroupCustom'
import Header from '../../components/header'
import { useNoViewModal } from '../../components/modal/HandleModal'
import ActivityDetail from '../../Master/Profile/tabs/ActivityDetail'
import LoginLogDetails from './LoginLogDetails'
import { get } from 'sortablejs'


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
    const [loadLoginLog, { data, isError, isLoading, isSuccess }] = useLoginLogMutation()

    const load = () => {
        // if (userType === UserType.Admin) {
        loadLoginLog({
            jsonData: {
                search: state?.search,
                user_id: watch('user_id')?.value,
                order_by: '1'
                // subscription_type: 2,
                // store_name: watch('store_name'),
                // store_email: watch('store_email'),
                // city: watch('city')
            },
            page: state?.page,
            per_page_record: state?.per_page_record
        })
        // }
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
        watch('user_id')

    ])

    const handlePageChange = (e: TableFormData) => {
        // log('state change', e)
        setState({ ...e })
    }
    const columns: TableColumn<any>[] = [
        {
            name: '#',
            maxWidth: '10px',
            cell: (row, index: any) => {
                // eslint-disable-next-line no-mixed-operators
                return parseInt(state?.per_page_record) * (state?.page - 1) + (index + 1)
            }
        },
        {
            name: <>{FM('ip-address')}</>,

            cell: (row) => (
                <span
                    className='cursor-pointer'
                    onClick={() => {
                        setState({
                            edit: row?.complete_info

                        })
                        handleModal()
                    }}
                >
                    <p className='text-primary'>{row?.complete_info?.ip}</p>
                </span>
            )
        },
        {
            name: <>{FM('user-name')}</>,

            minWidth: '120px',

            cell: (row) => <span className=''>{decrypt(row?.user?.name)}</span>
        },
        {
            name: <>{FM('user-email')}</>,

            minWidth: '120px',

            cell: (row) => <span className=''>{decrypt(row?.user?.email)}</span>
        },


        {
            name: <>{FM('date-and-time')}</>,

            minWidth: '120px',

            cell: (row) => <span className=''>{formatDate(row?.created_at, 'YYYY-MM-DD HH:mm:ss')}</span>
        },

        {
            name: <>{FM('city-name')}</>,

            cell: (row) => <span className=''>{row?.complete_info?.cityName}</span>
        },
        // {
        //   name: <>{FM('subject-type')}</>,

        //   minWidth: '120px',

        //   cell: (row) => <span className=''>{truncateText(row?.subject_type, 50)}</span>
        // },

        {
            name: <>{FM('latitude')}</>,

            cell: (row) => <span className=''>{row?.complete_info?.latitude}</span>
        },
        {
            name: <>{FM('longitude')}</>,

            cell: (row) => <span className=''>{row?.complete_info?.longitude}</span>
        }
    ]
    return (
        <>
            <LoginLogDetails
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
            <Header title={FM('login-log-list')} titleCol='4' childCol='8'>

                <FormGroupCustom
                    noLabel
                    tooltip={FM('user-list')}
                    key={`user_id`}
                    label={FM('user-list')}
                    isClearable
                    name={`user_id`}
                    type={'select'}
                    className='col-md-3 me-1'
                    path={userType === UserType.Admin ||
                        userType === UserType.AdminEmployee ? ApiEndpoints.load_stores : ApiEndpoints.subStore_list}
                    jsonData={{
                        get_all: "all"
                    }}
                    selectLabel='name'
                    selectValue={'id'}
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
