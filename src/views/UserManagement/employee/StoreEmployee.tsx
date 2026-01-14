/* eslint-disable prettier/prettier */
import { useContext, useEffect, useReducer } from 'react'

import { Edit, MoreVertical, Plus, RefreshCcw, Shield, Sliders, Trash2, Users } from 'react-feather'
import { Badge, Button, ButtonGroup, ButtonProps } from 'reactstrap'
import { ThemeColors } from '../../../utility/context/ThemeColors'

import { Link } from 'react-router-dom'

import { getPath } from '../../../router/RouteHelper'
import { IconSizes, UserType } from '../../../utility/Const'
import { FM, isValid } from '../../../utility/helpers/common'
import ConfirmAlert from '../../../utility/helpers/ConfirmAlert'
import CustomDataTable, {
    TableDropDownOptions,
    TableFormData
} from '../../components/CustomDataTable/CustomDataTable'
import DropDownMenu from '../../components/dropdown'
import Header from '../../components/header'

import { stateReducer } from '../../../utility/stateReducer'

import { TableColumn } from 'react-data-table-component'
import BsTooltip from '../../components/tooltip'
import TooltipLink from '../../components/tooltip/TooltipLink'

import { QueryStatus } from '@reduxjs/toolkit/dist/query'
import { useDispatch } from 'react-redux'
import {
    useDeleteEmployeeByIdMutation,
    useLoadEmployeeDataMutation
} from '../../../redux/RTKQuery/EmployeeRTK'
import Hide from '../../../utility/Hide'
import useUser from '../../../utility/hooks/useUser'
import useUserType from '../../../utility/hooks/useUserType'
import { Permissions } from '../../../utility/Permissions'
import Show, { Can } from '../../../utility/Show'
import { decrypt, emitAlertStatus, getUserData, truncateText } from '../../../utility/Utils'
import LoadingButton from '../../components/buttons/LoadingButton'
import EmployeeFilter from './EmployeeFilter'
import { EmployeeParamType } from './fragment/AddUpdateEmployee'
interface States {
    lastRefresh?: any
    page?: any
    per_page_record?: any
    employeeFilter?: boolean
    filterData?: EmployeeParamType | any
    search?: any
    reload?: any
    userTypeId?: any
}
function StoreEmployee() {
    const dispatch = useDispatch()
    const user = getUserData()
    const userType = useUserType()
    const users = useUser()
    const canEmployeeList = Can(Permissions.employeeBrowse)

    const { colors } = useContext(ThemeColors)
    // Local States
    const initState: States = {
        lastRefresh: new Date().getTime(),
        userTypeId: UserType.Employee,
        page: 1,
        per_page_record: 15,
        employeeFilter: false,
        // filterData?: any,
        search: undefined
    }

    const reducers = stateReducer<States>
    const [state, setState] = useReducer(reducers, initState)
    // Load Store Data
    const [deleteEmployee, resultDelete] = useDeleteEmployeeByIdMutation()
    const [loadEmployee, { data, originalArgs, isLoading }] = useLoadEmployeeDataMutation()

    useEffect(() => {
        if (canEmployeeList) {


            if (userType === UserType.Admin) {
                loadEmployee({
                    jsonData: {
                        name: isValid(state.search) ? state.search : state?.filterData?.name,
                        user_type_id: UserType.Employee,
                        ...state.filterData
                    },
                    page: isValid(state.search) ? 1 : state?.page,
                    per_page_record: state?.per_page_record
                })
            } else {
                loadEmployee({
                    jsonData: {
                        name: isValid(state.search) ? state.search : state?.filterData?.name,
                        user_type_id: state.userTypeId,
                        ...state.filterData
                    },
                    page: isValid(state.search) ? 1 : state?.page,
                    per_page_record: state?.per_page_record
                })
            }
        }
    }, [
        state?.lastRefresh,
        resultDelete,
        state?.search,
        state.page,
        state.per_page_record,
        state.userTypeId,
        state.filterData
    ])

    useEffect(() => {
        setState({
            page: 1
        })
    }, [state.per_page_record])
    const handlePageChange = (e: TableFormData) => {
        setState({ ...e })
    }

    const reloadData = () => {
        setState({
            page: 1,
            search: '',
            filterData: '',
            lastRefresh: new Date().getTime()
        })
    }

    const handleActions = (id?: any, ids?: any, action?: any, eventId?: any) => {
        // log('id', id)
        if (isValid(id)) {
            // delete single
            deleteEmployee({
                eventId,
                id,
                originalArgs: resultDelete?.originalArgs
            })
        } else {
            deleteEmployee({
                ids,
                eventId,
                originalArgs: resultDelete?.originalArgs,
                jsonData: {
                    ids,
                    action
                }
            })
        }
    }
    useEffect(() => {
        if ((resultDelete.status = QueryStatus.fulfilled) && resultDelete?.isLoading === false) {
            if (resultDelete?.isSuccess) {
                emitAlertStatus('success', null, resultDelete?.originalArgs?.eventId)
            } else if (resultDelete?.error) {
                emitAlertStatus('failed', null, resultDelete?.originalArgs?.eventId)
            }
        }
    }, [resultDelete])

    const columns: TableColumn<EmployeeParamType>[] = [
        {
            name: <>{FM('employee-name')}</>,
            cell: (row) => (
                <div className='d-flex align-items-center'>
                    <div className='user-info text-truncate'>
                        <Show IF={Permissions?.employeeRead || Permissions?.employeeAdminRead}>
                            <Link
                                state={{ row }}
                                to={getPath('store.employee.details', { id: row?.id })}
                                className='d-block'
                                id='create-button'
                            >
                                <span className='d-block fw-bold text-wrap'>
                                    {truncateText(decrypt(`${row?.name}`), 25)}
                                </span>
                            </Link>
                        </Show>
                        <Hide IF={Permissions?.employeeRead || Permissions?.employeeAdminRead}>
                            <span className='d-block fw-bold text-wrap'>
                                {truncateText(decrypt(`${row?.name}`), 25)}
                            </span>
                        </Hide>
                    </div>
                </div>
            )
        },
        {
            name: <>{FM('mobile-number')}</>,
            cell: (row) => (
                <span className='d-block fw-bold text-wrap'>{decrypt(row?.mobile_number)}</span>
            )
        },
        {
            name: <>{FM('email')}</>,
            cell: (row) => (
                <span className='d-flex fw-bold text-wrap'>
                    {truncateText(decrypt(`${row?.email}`), 15)}
                </span>
            )
        },
        {
            name: <>{FM('Status')}</>,

            //   sortable: (row) => row.status,
            cell: (row) => {
                return (
                    <>
                        {`${row?.status}` === `${1}` ? (
                            <Badge color={'light-success'} pill>
                                <>{FM('working')}</>
                            </Badge>
                        ) : (
                            <Badge color={'light-danger'} pill>
                                <>{FM('inactive')}</>
                            </Badge>
                        )}
                    </>
                )
            }
        },
        {
            name: <>{FM('action')}</>,
            allowOverflow: true,
            maxWidth: '10px',
            cell: (row) => {
                return (
                    <div className='d-flex '>
                        <Hide IF={row?.id === users?.id}>
                            <DropDownMenu
                                direction='down'
                                component={
                                    <MoreVertical color={colors.primary.main} size={IconSizes.MenuVertical} />
                                }
                                options={[
                                    {
                                        IF: Permissions?.employeeEdit || Permissions?.employeeAdminEdit,

                                        icon: <Edit size={14} />,
                                        state: row,
                                        to: { pathname: getPath('store.employee.update', { id: row?.id }) },
                                        name: FM('edit')
                                    },
                                    {
                                        IF: Permissions?.employeeDelete || Permissions?.employeeAdminDelete,

                                        noWrap: true,
                                        name: (
                                            <ConfirmAlert
                                                menuIcon={<Trash2 size={14} />}
                                                onDropdown
                                                eventId={`delete-item-${row?.id}`}
                                                item={row}
                                                text={FM("are-you-sure")}
                                                title={FM('delete-item-name', { name: decrypt(`${row?.name}`) })}
                                                color='text-warning'
                                                onClickYes={() =>
                                                    handleActions(row?.id, null, null, `delete-item-${row?.id}`)
                                                }
                                                onSuccessEvent={() =>
                                                    setState({
                                                        search: '',
                                                        page: 1
                                                    })
                                                }
                                                className=''
                                                id={`grid-delete-${row?.id}`}
                                            >
                                                {FM('delete')}
                                            </ConfirmAlert>
                                        )
                                    }
                                ]}
                            />
                        </Hide>
                    </div>
                )
            }
        }
    ]

    const options: TableDropDownOptions = (selectedRows) => [
        {
            IF: Permissions?.employeeDelete || Permissions?.employeeAdminDelete,
            noWrap: true,
            name: (
                <ConfirmAlert
                    menuIcon={<Trash2 size={14} />}
                    onDropdown
                    eventId={`item-delete`}
                    text={FM('are-you-sure')}
                    title={FM('delete-selected-count', { count: selectedRows?.selectedCount })}
                    color='text-warning'
                    onClickYes={() => handleActions(null, selectedRows?.ids, 'delete', 'item-delete')}
                    onSuccessEvent={(e: any) => {
                        reloadData()
                    }}
                    className=''
                    id={`grid-delete-selected`}
                >
                    {FM('delete')}
                </ConfirmAlert>
            )
        }
    ]

    return (
        <>
            <EmployeeFilter
                show={state?.employeeFilter}
                filterData={state?.filterData}
                setFilterData={(e: any) => setState({ filterData: e, page: 1 })}
                handleFilterModal={() => {
                    // setPatientFilter(false)
                    setState({
                        employeeFilter: false,
                        search: ''
                    })
                }}
            />
            <Header
                icon={state.userTypeId === UserType.Employee ? <Users size='25' /> : <Shield size='25' />}
                title={
                    user?.user_type_id === UserType.Admin
                        ? FM('admin-employee')
                        : state.userTypeId === UserType.Employee
                            ? FM('store-employee')
                            : FM('gate-guard')
                }
            >
                <Hide IF={userType === UserType.Admin}>
                    <ButtonGroup>
                        <LoadingButton
                            Tag={Button}
                            loading={isLoading}
                            onClick={() => {
                                // log('clickgastr', e)
                                state.userTypeId === UserType.Employee
                                    ? setState({
                                        userTypeId: UserType.GateGuard,
                                        page: 1
                                    })
                                    : state.userTypeId === UserType.GateGuard
                                        ? setState({
                                            userTypeId: UserType.Employee,
                                            page: 1
                                        })
                                        : setState({
                                            userTypeId: ''
                                        })
                            }}
                            size='sm'
                            // color='primary'
                            color={state.userTypeId === UserType.Employee ? 'primary' : 'success'}
                            className=' me-1'
                            tooltip={state.userTypeId === UserType.Employee ? FM('gate-guard') : FM('employee')}
                        >
                            {state.userTypeId === UserType.Employee ? <Users size='14' /> : <Shield size='14' />}
                        </LoadingButton>
                    </ButtonGroup>
                </Hide>

                <ButtonGroup color='dark'>
                    <Show IF={Permissions?.employeeAdd || Permissions?.employeeAdminAdd}>
                        <TooltipLink
                            title={<>{FM('create-new')}</>}
                            to={getPath('store.employee.create')}
                            className='btn btn-primary btn-sm'
                        >
                            <Plus size='14' />
                        </TooltipLink>
                    </Show>
                    <BsTooltip<ButtonProps>
                        Tag={Button}
                        onClick={() =>
                            setState({
                                employeeFilter: true
                            })
                        }
                        size='sm'
                        color='secondary'
                        title={FM('filter')}
                    >
                        <Sliders size='14' />
                    </BsTooltip>

                    <LoadingButton
                        loading={isLoading}
                        onClick={reloadData}
                        size='sm'
                        color='dark'
                        tooltip={FM('reload')}
                    >
                        <RefreshCcw size='14' />
                    </LoadingButton>
                </ButtonGroup>
            </Header>
            <CustomDataTable<EmployeeParamType>
                key={state.lastRefresh}
                initialPerPage={15}
                isLoading={isLoading}
                options={options}
                selectableRowDisabled={(row) => {
                    if (row?.id === users?.id) {
                        return true
                    } else {
                        return false
                    }
                }}
                selectableRows
                columns={columns}
                paginatedData={data}
                handlePaginationAndSearch={handlePageChange}
            />
        </>
    )
}

export default StoreEmployee
