/* eslint-disable prettier/prettier */
import { QueryStatus } from '@reduxjs/toolkit/dist/query'
import { useContext, useEffect, useReducer } from 'react'
import { TableColumn } from 'react-data-table-component'
import {
    Activity,
    CheckCircle,
    Edit,
    Framer,
    List,
    MoreVertical,
    Plus,
    RefreshCcw,
    Trash2,
    Upload,
    X
} from 'react-feather'
import { useDispatch } from 'react-redux'
import { Link } from 'react-router-dom'
import {
    Badge,
    Button,
    ButtonGroup,
    ButtonProps,
    DropdownItem,
    UncontrolledTooltip
} from 'reactstrap'
import {
    useDeleteCategoryByIdMutation,
    useLoadCategoryMutation
} from '../../../redux/RTKQuery/CategoryRTK'
import { getPath } from '../../../router/RouteHelper'
import { IconSizes, UserType } from '../../../utility/Const'
import { Permissions } from '../../../utility/Permissions'
import Show, { Can } from '../../../utility/Show'
import { emitAlertStatus, truncateText } from '../../../utility/Utils'
import { ThemeColors } from '../../../utility/context/ThemeColors'
import ConfirmAlert from '../../../utility/helpers/ConfirmAlert'
import { FM, isValid, log } from '../../../utility/helpers/common'
import useUser from '../../../utility/hooks/useUser'
import useUserType from '../../../utility/hooks/useUserType'
import { stateReducer } from '../../../utility/stateReducer'
import CustomDataTable, {
    TableDropDownOptions,
    TableFormData
} from '../../components/CustomDataTable/CustomDataTable'
import DropDownMenu from '../../components/dropdown'
import Header from '../../components/header'
import { useNoViewModal } from '../../components/modal/HandleModal'
import CategoryAddForm, { CategoryParamsType } from './CategoryAddForm'
import CategoryOffer from './CategoryOffer'
import CategoryImportModal from './fragment/CategoryImportModal'

interface States {
    page?: any
    per_page_record?: any
    search?: any
    edit?: any
    ids?: any
    name?: any
    filterData?: any
    isAddingNewData?: boolean
    selectedRowsChange?: any
    lastRefresh?: any
}

function Category() {
    const { colors } = useContext(ThemeColors)
    const dispatch = useDispatch()
    const [showModal, handleModal] = useNoViewModal()
    const userInfo = useUser()
    const userType = useUserType()
    const [showOfferModal, handleOfferModal] = useNoViewModal()
    // Local state
    const initState: States = {
        page: 1,
        per_page_record: 15,
        search: '',
        name: '',
        ids: null,
        edit: null,

        lastRefresh: new Date().getTime(),
        filterData: undefined,
        selectedRowsChange: {
            selectedCount: 0
        }
    }
    const reducers = stateReducer<States>
    const [state, setState] = useReducer(reducers, initState)

    // Load Category Data
    const [loadCategory, resultCategory] = useLoadCategoryMutation()

    const [deleteStore, resultDelete] = useDeleteCategoryByIdMutation()

    useEffect(() => {
        loadCategory({
            jsonData: { name: state?.search },
            page: state?.page,
            per_page_record: state?.per_page_record
        })
    }, [
        state?.page,
        state?.per_page_record,
        state.lastRefresh,
        state?.search
        // resultDelete,
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
            lastRefresh: new Date().getTime(),
            page: 1
        })
    }
    const handleActions = (id?: any, ids?: any, action?: any, eventId?: any) => {
        // log('id', id)
        if (isValid(id)) {
            // delete single
            deleteStore({
                eventId,
                id
                // originalArgs: resultDelete?.originalArgs
            })
        } else {
            deleteStore({
                ids,
                eventId,
                // originalArgs: resultDelete?.originalArgs,
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

    log('userType', userType === UserType.Store)

    const isUserDeleteStore = (d: any) => {
        if (d?.status === 0 && Can(Permissions.categoryDelete)) {
            if (userType === UserType.Store && d?.store_id !== UserType.Admin) {
                return true
            } else if (userType === UserType.Admin && d?.store_id === UserType.Admin) {
                return true
            } else if (
                userType === UserType.Employee &&
                userInfo?.store_id === UserType.Admin &&
                d?.store_id === UserType.Admin
            ) {
                return true
            } else {
                return false
            }
        } else {
            return false
        }
    }

    const isVisibleInactiove = (d: any) => {
        let re = false

        if (d?.status === 1 && Can(Permissions.categoryDelete)) {
            if (userType === UserType.Admin) {
                re = true
            } else if (userType === UserType.AdminEmployee) {
                re = true
            } else if (userType === UserType.Store) {
                re = true
            } else if (userType === UserType.Employee) {
                re = true
            }
        }
        return re
    }

    const isVisibleActive = (d: any) => {
        //     ((row?.status === 0 && userType === UserType.Admin) ||
        //     (row?.status === 0 &&
        //         row?.store_id === UserType.Admin &&
        //         userType === UserType.Employee) ||
        //     (userType === UserType.Store &&
        //         row?.store_id !== UserType.Admin &&
        //         row?.status === 0)) &&
        // Can(Permissions.categoryDelete),
        let re = false

        if (d?.status === 0 && Can(Permissions.categoryDelete)) {
            if (userType === UserType.Admin) {
                re = true
            } else if (userType === UserType.AdminEmployee) {
                re = true
            } else if (userType === UserType.Store) {
                re = true
            } else if (userType === UserType.Employee) {
                re = true
            }
        }
        return re
    }

    const columns: TableColumn<CategoryParamsType>[] = [
        {
            name: <>{FM('category-code')}</>,
            //sortable: true,
            // minWidth: '250px',
            //sortable: row => row.full_name,
            cell: (row) => <span className='text-wrap'>{row?.category_code}</span>
        },
        {
            name: FM('category-name'),
            //   minWidth: '350px',
            cell: (row: any) => (
                <div className='d-flex align-items-center'>
                    {/* <Hide IF={userType === UserType.Admin}> */}
                    <div className='user-info text-truncate'>
                        <Link
                            state={row}
                            to={getPath('admin.category.view', { id: row?.id })}
                            className='d-block'
                            id='create-button'
                        >
                            <span className='d-block fw-bold text-truncate'>{truncateText(row?.name, 20)}</span>
                        </Link>
                        {userType !== UserType?.Admin ? (
                            <small className='text-danger status-text'>
                                {userType === UserType.AdminEmployee ? `${FM('from-admin')}` : ''}
                            </small>
                        ) : (
                            ''
                        )}
                    </div>
                    {/* </Hide> */}

                    {/* <Show IF={userType === UserType.Admin}>
            <div className='user-info text-truncate'>
              <span className='d-block fw-bold text-truncate'>{truncateText(row?.name, 20)}</span>
            </div>
          </Show> */}
                </div>
            )
        },
        {
            name: <>{FM('vat')}</>,
            //sortable: true,
            // minWidth: '250px',
            //sortable: row => row.full_name,
            cell: (row) => <span className='text-wrap'>{`${row?.vat_tax} %`}</span>
        },

        {
            name: FM('subcategory'),
            //   minWidth: '350px',
            cell: (row: any) => (
                <div className='d-flex align-items-center'>
                    <div className='user-info text-truncate'>
                        <Link
                            state={row}
                            to={getPath('admin.category.subcategory', { parentId: row?.id })}
                            className='d-block'
                            id='create-button'
                        >
                            <span className='d-block fw-bold text-truncate'>
                                <Badge color={'primary'} className='fw-bolder'>
                                    {row?.subcategories_count}

                                    <span className='ms-1'>{`${FM('sub-category')}`}</span>
                                </Badge>
                            </span>
                        </Link>
                        {/* <small className='status-text'>
                  {FM('location')} : {row.city} {row?.state}
                </small> */}
                    </div>
                </div>
            )
        },
        {
            name: FM('Status'),
            //   minWidth: '50px',

            //   sortable: (row: any) => row.status,
            cell: (row: any) => {
                return (
                    <>
                        {row?.status === 1 ? (
                            <Badge color={'light-success'} pill>
                                <>{FM('active')}</>
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
            name: FM('action'),
            allowOverflow: true,
            maxWidth: '10px',
            cell: (row: any) => {
                return (
                    <div className='d-flex '>
                        <DropDownMenu
                            direction='down'
                            component={<MoreVertical color={colors.primary.main} size={IconSizes.MenuVertical} />}
                            options={[
                                {
                                    icon: <List size={14} />,
                                    state: row,
                                    to: { pathname: getPath('admin.category.subcategory', { parentId: row?.id }) },

                                    name: FM('subcategory-list')
                                },

                                {
                                    IF: userInfo?.store_id === row?.store_id && Can(Permissions.categoryEdit),
                                    icon: <Edit size={14} />,
                                    onClick: () => {
                                        handleModal()
                                        setState({
                                            edit: row
                                        })
                                    },
                                    name: FM('edit')
                                },
                                {
                                    // IF:
                                    //   ((row?.status === 0 &&
                                    //     userType === UserType.Admin &&
                                    //     row?.store_id === UserType.Admin) ||
                                    //     (userType === UserType.Store &&
                                    //       row?.store_id !== UserType.Admin &&
                                    //       row?.status === 0)) &&
                                    //   Permissions.categoryDelete,

                                    IF: isUserDeleteStore(row),

                                    noWrap: true,
                                    name: (
                                        <ConfirmAlert
                                            menuIcon={<Trash2 size={14} />}
                                            onDropdown
                                            eventId={`delete-item-${row?.id}`}
                                            item={row}
                                            title={FM('delete-item-name', { name: row?.name })}
                                            color='text-warning'
                                            onClickYes={() =>
                                                handleActions(row?.id, null, null, `delete-item-${row?.id}`)
                                            }
                                            onSuccessEvent={(e: any) => {
                                                setState({
                                                    search: '',
                                                    page: 1
                                                })
                                            }}
                                            className=''
                                            id={`grid-delete-${row?.id}`}
                                        >
                                            {FM('move-to-trash')}
                                        </ConfirmAlert>
                                    )
                                },
                                {
                                    IF: isVisibleInactiove(row),

                                    noWrap: true,
                                    name: (
                                        <ConfirmAlert
                                            menuIcon={<X size={14} />}
                                            onDropdown
                                            eventId={`item-inactive-${row?.id}`}
                                            text={FM('are-you-sure')}
                                            title={FM('inactive-item-name', { name: row?.name })}
                                            color='text-warning'
                                            onClickYes={() =>
                                                handleActions(null, [row?.id], 'inactive', `item-inactive-${row?.id}`)
                                            }
                                            onSuccessEvent={(e: any) => {
                                                reloadData()
                                            }}
                                            className=''
                                            id={`grid-inactive-selected`}
                                        >
                                            {FM('inactive')}
                                        </ConfirmAlert>
                                    )
                                },
                                {
                                    IF: isVisibleActive(row),

                                    noWrap: true,
                                    name: (
                                        <ConfirmAlert
                                            menuIcon={<CheckCircle size={14} />}
                                            onDropdown
                                            eventId={`item-active-${row?.id}`}
                                            text={FM('are-you-sure')}
                                            title={FM('active-selected-count', { count: 1 })}
                                            color='text-warning'
                                            onClickYes={() =>
                                                handleActions(null, [row?.id], 'active', `item-active-${row?.id}`)
                                            }
                                            onSuccessEvent={(e: any) => {
                                                reloadData()
                                            }}
                                            className=''
                                            id={`grid-active-selected`}
                                        >
                                            {FM('active')}
                                        </ConfirmAlert>
                                    )
                                }
                            ]}
                        />
                    </div>
                )
            }
        }
    ]

    const options: TableDropDownOptions = (selectedRows) => [
        {
            IF: Can(Permissions.categoryDelete) && userType === UserType.Store,
            noWrap: true,
            name: (
                <DropdownItem
                    onClick={() => {
                        handleOfferModal()
                        setState({
                            ids: selectedRows?.ids
                        })
                    }}
                    tag={'span'}
                    className='dropdown-item d-flex align-items-center'
                >
                    <>
                        <Activity size={16} className='me-1' />
                        {FM('add-offer')} ({selectedRows?.selectedCount})
                    </>
                </DropdownItem>
            )
        }
    ]

    return (
        <>
            <CategoryOffer
                ids={state?.ids}
                response={(e: boolean) => {
                    setState({
                        page: 1,
                        name: ''
                    })
                    reloadData()
                }}
                showModal={showOfferModal}
                setShowModal={(e) => {
                    handleOfferModal()
                }}
                noView
            />
            <CategoryAddForm
                edit={state?.edit}
                response={(e: boolean) => {
                    setState({
                        edit: null
                    })
                    reloadData()
                }}
                showModal={showModal}
                setShowModal={(e) => {
                    setState({
                        edit: null
                    })
                    handleModal()
                }}
                noView
            />
            <Header icon={<Framer size='25' />} title={FM('category')}>
                <ButtonGroup color='dark'>
                    {/* <Show IF={isValid(state?.name)}>
            <CategoryModal<ButtonProps>
              response={(e: boolean) =>
                setState({
                  isAddingNewData: e                         
                })
              }
              size='sm'
              color='primary'
              parentId={state?.parent_id}
              Component={Button}
            >
              <Plus size='14' />
            </CategoryModal>
          </Show> */}
                    <Show IF={Can(Permissions.categoryAdd)}>
                        <CategoryAddForm<ButtonProps>
                            response={(e: boolean) => {
                                setState({
                                    page: 1,
                                    name: ''
                                })
                                reloadData()
                            }}
                            size='sm'
                            color='primary'
                            Component={Button}
                        >
                            <Plus size='14' />
                        </CategoryAddForm>

                        <CategoryImportModal<ButtonProps>
                            response={(e: boolean) => {
                                setState({
                                    page: 1,
                                    name: ''
                                })
                                reloadData()
                            }}
                            size='sm'
                            color='secondary'

                            Component={Button}
                        >
                            <Upload size='14' />
                        </CategoryImportModal>
                    </Show>


                    <UncontrolledTooltip target='reload'>{FM('refresh-data')}</UncontrolledTooltip>
                    <Button
                        loading={state.isAddingNewData}
                        onClick={() => {
                            setState({
                                page: 1,
                                name: '',
                                lastRefresh: new Date().getTime()
                            })
                            reloadData()
                        }}
                        size='sm'
                        color='dark'
                        id='reload'
                    >
                        <RefreshCcw size='14' />
                    </Button>
                </ButtonGroup>
            </Header>
            <CustomDataTable<CategoryParamsType>
                key={state.lastRefresh}
                options={options}
                initialPerPage={15}
                selectableRowDisabled={(row) => {
                    if (userType === UserType?.AdminEmployee) {
                        return true
                    } else if (userType === UserType?.GateGuard) {
                        return true
                    } else {
                        return false
                    }
                }}
                isLoading={resultCategory?.isLoading}
                selectableRows={userType !== UserType?.Admin}
                columns={columns}
                paginatedData={resultCategory?.data}
                handlePaginationAndSearch={handlePageChange}
            />
        </>
    )
}

export default Category
