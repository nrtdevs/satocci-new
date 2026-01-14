/* eslint-disable prettier/prettier */
import { QueryStatus } from '@reduxjs/toolkit/dist/query'
import { useContext, useEffect, useReducer } from 'react'
import { TableColumn } from 'react-data-table-component'
import {
    Activity,
    CheckCircle,
    Edit,
    MoreVertical,
    Plus,
    RefreshCcw,
    Trash2,
    X
} from 'react-feather'
import { useDispatch } from 'react-redux'
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom'
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
    useLoadSubCategoryMutationMutation
} from '../../../redux/RTKQuery/CategoryRTK'
import { getPath } from '../../../router/RouteHelper'
import { IconSizes, UserType } from '../../../utility/Const'
import { Permissions } from '../../../utility/Permissions'
import Show, { Can } from '../../../utility/Show'
import { emitAlertStatus, truncateText } from '../../../utility/Utils'
import { ThemeColors } from '../../../utility/context/ThemeColors'
import ConfirmAlert from '../../../utility/helpers/ConfirmAlert'
import { FM, isValid, isValidArray, log } from '../../../utility/helpers/common'
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
import Shimmer from '../../components/shimmers/Shimmer'
import CategoryAddForm, { CategoryParamsType } from './CategoryAddForm'
import CategoryOffer from './CategoryOffer'

interface States {
    ids?: any
    paramsId?: any
    page?: any
    search?: any
    catArr?: any
    per_page_record?: any
    category?: any
    subcategory?: any
    parent_id?: any
    parent_add_id?: any
    edit?: any
    filterData?: any
    isAddingNewData?: boolean
    selectedRowsChange?: any
    lastFetched?: any
    isRemoving?: boolean
    isReloading?: boolean
}

function SubCategory() {
    const params = useParams()
    const parentId: any = params?.parentId
    const navigate = useNavigate()
    const location = useLocation()
    const catData: any = location?.state
    const { colors } = useContext(ThemeColors)
    const dispatch = useDispatch()
    const [showModal, handleModal] = useNoViewModal()
    // Local state
    const initState: States = {
        ids: null,
        search: '',
        paramsId: undefined,
        page: 1,
        per_page_record: 15,
        parent_id: '',
        parent_add_id: '',
        catArr: [],
        category: [],
        edit: null,
        isRemoving: false,
        isReloading: false,
        isAddingNewData: false,
        filterData: undefined,
        lastFetched: new Date().getTime(),
        selectedRowsChange: {
            selectedCount: 0
        }
    }

    const reducers = stateReducer<States>
    const [state, setState] = useReducer(reducers, initState)
    const [showOfferModal, handleOfferModal] = useNoViewModal()
    const userInfo = useUser()
    const locations = useLocation()
    const userType = useUserType()
    // Load Category Data
    const [loadSubcategory, { data, isLoading }] = useLoadSubCategoryMutationMutation()
    //   const { data, error, originalArgs, isLoading, refetch, isFetching, isSuccess } =
    //     useLoadSubcategoriesByIdQuery({
    //       jsonData: { name: state?.edit?.name },
    //       id: parentId,
    //       page: state?.page,
    //       per_page_record: state?.per_page_record
    //     })

    log('location', locations)

    const refetch = () => {
        loadSubcategory({
            jsonData: { name: state.search },
            id: parentId,
            page: isValid(state.search) ? 1 : state?.page,
            per_page_record: state?.per_page_record
        })
    }
    useEffect(() => {
        if (parentId) {
            refetch()
        }
    }, [state?.page, state?.per_page_record, state.lastFetched, isValid(state.search)])

    useEffect(() => {
        if (isValidArray(data?.payload?.data)) {
            setState({
                catArr: data?.payload?.data
            })
        }
    }, [data])

    const [deleteStore, resultDelete] = useDeleteCategoryByIdMutation()

    useEffect(() => {
        setState({
            page: 1
        })
    }, [state.per_page_record])
    const handlePageChange = (e: TableFormData) => {
        setState({ ...e })
    }

    // const handleActions = (id?: any, ids?: any, action?: any, eventId?: any) => {
    //   // log('id', id)
    //   if (isValid(id)) {
    //     // delete single
    //     deleteStore({
    //       eventId,
    //       id,
    //       originalArgs: resultDelete?.originalArgs
    //     })
    //   } else {
    //     deleteStore({
    //       ids,
    //       eventId,
    //       originalArgs: resultDelete?.originalArgs,
    //       jsonData: {
    //         ids,
    //         action
    //       }
    //     })
    //   }
    // }

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

    useEffect(() => {
        if (isValid(state.edit)) {
            handleModal()
        }
    }, [state.edit])
    const reloadData = () => {
        setState({
            lastFetched: new Date().getTime(),
            page: 1
        })
    }

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
                                {row?.store_id === UserType.Admin ? `${FM('from-admin')}` : ''}
                            </small>
                        ) : (
                            ''
                        )}
                    </div>
                    {/* </Hide> */}
                    {/* <Show IF={userType === UserType.Admin}>
            <span className='d-block fw-bold text-truncate'>{truncateText(row?.name, 20)}</span>
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
            name: <>{FM('status')}</>,
            minWidth: '150px',
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
            name: <>{FM('action')}</>,
            allowOverflow: true,
            maxWidth: '10px',
            cell: (row: any) => {
                return (
                    <div className='d-flex '>
                        {/* <Show
              IF={
                (userType === UserType.Admin && row?.store_id === UserType.Admin) ||
                (userType === UserType.Store && row?.store_id !== UserType.Admin)
              }
            > */}
                        <DropDownMenu
                            direction='down'
                            component={<MoreVertical color={colors.primary.main} size={IconSizes.MenuVertical} />}
                            options={[
                                {
                                    IF: userInfo?.store_id === row?.store_id && Can(Permissions.categoryEdit),
                                    icon: <Edit size={14} />,
                                    onClick: () => {
                                        setState({
                                            edit: row
                                        })
                                    },
                                    name: FM('edit')
                                },
                                {
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
                                                    lastFetched: new Date().getTime(),
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
                                    IF:
                                        ((row?.status === 1 &&
                                            userType === UserType.Admin &&
                                            row?.store_id === UserType.Admin) ||
                                            (userType === UserType.Store &&
                                                row?.store_id !== UserType.Admin &&
                                                row?.status === 1)) &&
                                        Permissions.categoryDelete,
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
                                    IF:
                                        ((row?.status === 0 &&
                                            userType === UserType.Admin &&
                                            row?.store_id === UserType.Admin) ||
                                            (userType === UserType.Store &&
                                                row?.store_id !== UserType.Admin &&
                                                row?.status === 0)) &&
                                        Permissions.categoryDelete,
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
                        {/* </Show> */}
                    </div>
                )
            }
        }
    ]

    const options: TableDropDownOptions = (selectedRows) => [
        {
            IF: Permissions.categoryDelete,
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
                        lastFetched: new Date().getTime()
                    })
                }}
                showModal={showOfferModal}
                setShowModal={(e) => {
                    handleOfferModal()
                    setState({
                        page: 1,
                        lastFetched: new Date().getTime()
                    })
                }}
                noView
            />
            <CategoryAddForm
                response={(e: boolean) =>
                    setState({
                        page: 1,
                        lastFetched: new Date().getTime()
                    })
                }
                edit={state?.edit}
                parentId={parentId}
                showModal={showModal}
                setShowModal={(e) => {
                    // eslint-disable-next-line no-unused-expressions
                    handleModal()
                    setState({
                        edit: null
                    })
                }}
                noView
            />
            <Header
                onClickBack={() => navigate(-1)}
                goBackTo
                //    title={truncateText(`${catData?.name}`, 50)}
                title={
                    <>
                        {isLoading ? (
                            <span style={{ display: 'inline-block' }}>
                                <Shimmer style={{ width: 500, height: 24 }} />
                            </span>
                        ) : (
                            truncateText(state?.catArr[0]?.parent?.name, 40) ?? location?.state?.name
                        )}
                    </>
                }
            >
                <ButtonGroup color='dark'>
                    <Show IF={Permissions.categoryAdd}>
                        <CategoryAddForm<ButtonProps>
                            loading={isLoading}
                            response={(e: boolean) =>
                                setState({
                                    page: 1,
                                    lastFetched: new Date().getTime()
                                })
                            }
                            size='sm'
                            color='primary'
                            parentId={parentId}
                            Component={Button}
                        >
                            <Plus size='14' />
                        </CategoryAddForm>
                    </Show>

                    {/* <UncontrolledTooltip target='filter'>
            <>{FM('filter')}</>
          </UncontrolledTooltip>
          <Button size='sm' color='secondary' id='filter'>
            <Sliders size='14' />
          </Button> */}

                    <UncontrolledTooltip target='reload'>
                        <>{FM('refresh-data')}</>
                    </UncontrolledTooltip>
                    <Button
                        loading={isLoading}
                        onClick={() => {
                            setState({
                                page: 1,
                                lastFetched: new Date().getTime()
                            })
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
                key={state.lastFetched}
                options={options}
                initialPerPage={15}
                isLoading={isLoading}
                selectableRowDisabled={(row) => {
                    if (row?.store_id === UserType.Admin && userType === UserType?.Store) {
                        return true
                    } else if (row?.store_id === UserType.Admin && userType === UserType?.Employee) {
                        return true
                    } else if (row?.store_id === UserType.Admin && userType === UserType?.GateGuard) {
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

export default SubCategory
