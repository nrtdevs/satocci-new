/* eslint-disable prettier/prettier */
import { useCallback, useContext, useEffect, useReducer } from 'react'

import {
    CheckCircle,
    Download,
    Edit,
    MoreVertical,
    RefreshCcw,
    Sliders,
    Trash,
    Trash2,
    X
} from 'react-feather'
import { Badge, Button, ButtonGroup, ButtonProps } from 'reactstrap'
import { ThemeColors } from '../../utility/context/ThemeColors'

import { Link, useLocation, useNavigate, useParams } from 'react-router-dom'

import { QueryStatus } from '@reduxjs/toolkit/dist/query'
import { TableColumn } from 'react-data-table-component'
import {
    useDeleteStoreByIdMutation,
    useDownloadZipFileMutation,
    useLoadStoreSubStoreDetailsByParentIdMutation
} from '../../redux/RTKQuery/StoreRTK'
import { SubStoreRequestParams } from '../../redux/RTKQuery/SubStoreRTK'
import { useAppDispatch } from '../../redux/store'
import { getPath } from '../../router/RouteHelper'
import { IconSizes, UserType } from '../../utility/Const'
import Hide from '../../utility/Hide'
import { Permissions } from '../../utility/Permissions'
import { Can } from '../../utility/Show'
import { decrypt, emitAlertStatus, truncateText } from '../../utility/Utils'
import ConfirmAlert from '../../utility/helpers/ConfirmAlert'
import { FM, isValid, log } from '../../utility/helpers/common'
import useUserType from '../../utility/hooks/useUserType'
import httpConfig from '../../utility/http/httpConfig'
import { stateReducer } from '../../utility/stateReducer'
import CustomDataTable, {
    TableDropDownOptions,
    TableFormData
} from '../components/CustomDataTable/CustomDataTable'
import LoadingButton from '../components/buttons/LoadingButton'
import DropDownMenu from '../components/dropdown'
import Header from '../components/header'
import BsTooltip from '../components/tooltip'
import TooltipLink from '../components/tooltip/TooltipLink'
import StoreFilter from './StoreFilter'
import { StoreParamsType } from './fragment/AddUpdateForm'
interface States {
    lastRefresh?: any
    page?: any
    per_page_record?: any
    search?: any
    reload?: any
    storeFilter?: boolean
    filterData?: StoreParamsType | any
    isRemoving?: boolean
    isReloading?: boolean
    isAddingNewData?: boolean
}
function StoresByParentId() {
    const dispatch = useAppDispatch()
    const params = useParams()
    const navigate = useNavigate()
    const parentId = params?.id
    const userType = useUserType()
    const location: any = useLocation()
    log(location)
    const { colors } = useContext(ThemeColors)
    // Local States
    const initState: States = {
        lastRefresh: new Date().getTime(),
        page: 1,
        per_page_record: 15,
        storeFilter: false,
        filterData: {},
        search: undefined,
        isRemoving: false,
        isReloading: false,
        isAddingNewData: false
    }
    const reducers = stateReducer<States>
    const [state, setState] = useReducer(reducers, initState)

    // Load Store Data

    const [loadStoreByParent, resultData] = useLoadStoreSubStoreDetailsByParentIdMutation()
    const [downloadZip, result] = useDownloadZipFileMutation()
    const resData = resultData?.data
    //   log('isFetching', isFetching)
    //   log('isUninitialized', isUninitialized)
    //   log('isSuccess', isSuccess)
    //   log('isError', isError)
    // delete store
    const [deleteStore, resultDelete] = useDeleteStoreByIdMutation()
    useEffect(() => {
        if (isValid(parentId)) {
            //   log('filterData', state?.filterData)
            loadStoreByParent({
                id: parentId,
                jsonData: {
                    ...state?.filterData,
                    // city: state.filterData?.city,
                    // email: state.filterData?.email,
                    // store_email: state.filterData?.store_email,
                    subscription_type: state.filterData?.subscription_type,
                    search: isValid(state?.search) ? state?.search : state.filterData?.store_name
                },
                page: isValid(state?.search) ? 1 : state?.page,
                per_page_record: state?.per_page_record
            })
        }
    }, [
        parentId,
        isValid(state?.filterData),
        isValid(state?.search),
        state?.lastRefresh,
        state?.page,
        state.per_page_record
    ])

    // const deleteS = useCallback(
    //   (e: ViewParams) => {
    //     deleteStore(e)
    //   },
    //   [userType]
    // )
    useEffect(() => {
        setState({
            page: 1
        })
    }, [state.per_page_record])
    const handlePageChange = (e: TableFormData) => {
        // log('state change', e)
        setState({ ...e })
    }

    const reloadData = useCallback(() => {
        setState({
            lastRefresh: new Date().getTime(),
            page: 1
        })
    }, [parentId, resultDelete, state?.search, state?.filterData])

    const handleActions = (id?: any, ids?: any, action?: any, eventId?: any) => {
        // log('id', id)
        if (isValid(id)) {
            // delete single
            deleteStore({
                eventId,
                id,
                originalArgs: resultData?.originalArgs
            })
        } else {
            deleteStore({
                ids,
                eventId,
                originalArgs: resultData?.originalArgs,
                jsonData: {
                    ids,
                    action
                }
            })
        }
    }
    const donwloadQr = (d: any) => {
        if (isValid(d?.store_setting?.store_qr_code_image)) {
            window.open(d?.store_setting?.store_qr_code_image, '_blank')
        } else {
            window.open(httpConfig.baseUrl2 + d?.store_setting?.store_qr_code_image, '_blank')
        }
        //window.open(httpConfig.baseUrl2 + d?.store_setting?.store_qr_code_image, '_blank')
    }

    const downloadBarcode = (d: any) => {
        downloadZip({
            id: d?.store_setting?.store_id
        })
    }

    // delete item success
    useEffect(() => {
        if ((resultDelete.status = QueryStatus.fulfilled) && resultDelete?.isLoading === false) {
            if (resultDelete?.isSuccess) {
                emitAlertStatus('success', null, resultDelete?.originalArgs?.eventId)
            } else if (resultDelete?.error) {
                emitAlertStatus('failed', null, resultDelete?.originalArgs?.eventId)
            }
        }
    }, [resultDelete])

    const isLoading = resultData?.status === QueryStatus.pending
    const columns: TableColumn<StoreParamsType | SubStoreRequestParams>[] = [
        // {
        //   name: '#',
        //   maxWidth: '50px',
        //   cell: (row, index: any) => {
        //     // eslint-disable-next-line no-mixed-operators
        //     return parseInt(state?.per_page_record) * (state?.page - 1) + (index + 1)
        //   }
        // },
        {
            name: FM('admin-name'),

            //sortable: row => row.full_name,
            cell: (row) => (
                <div className='d-flex align-items-center'>
                    <div className='user-info text-truncate'>
                        <Link
                            state={{ ...row }}
                            to={getPath('admin.stores.details', { id: row?.id })}
                            className='d-block'
                            id='create-button'
                        >
                            <span className='d-block fw-bold text-wrap'>
                                {truncateText(decrypt(`${row?.name}`), 25)}
                            </span>
                        </Link>
                    </div>
                </div>
            )
        },
        {
            name: <>{FM('store-name')}</>,
            minWidth: '200px',
            //sortable: row => row.full_name,
            cell: (row) => (
                <div className='d-flex align-items-center'>
                    <div className='user-info'>
                        <Link
                            state={{ row }}
                            to={getPath('admin.stores.details', { id: row?.id })}
                            className='d-block'
                            id='create-button'
                        >
                            <span className='text-wrap'>{truncateText(row?.store_setting?.store_name, 35)}</span>
                        </Link>
                    </div>
                </div>
            )
        },
        {
            name: <>{FM('store-email')}</>,
            minWidth: '200px',
            //sortable: row => row.full_name,
            cell: (row) => (
                <div className='d-flex align-items-center'>
                    <div className='user-info'>
                        {/* <Link
              state={{ row }}
              to={getPath('admin.stores.details', { id: row?.id })}
              className='d-block'
              id='create-button'
            > */}
                        <span className='text-wrap'>{truncateText(row?.store_setting?.store_email, 28)}</span>
                        {/* </Link> */}
                    </div>
                </div>
            )
        },
        // {
        //   name: <>{FM('admin-name')}</>,
        //   minWidth: '150px',
        //   //sortable: row => row.full_name,
        //   cell: (row) => (
        //     <div className='d-flex align-items-center'>
        //       <div className='user-info text-truncate'>
        //         {/* <Link
        //           state={{ row }}
        //           to={getPath('admin.stores.details', { id: row?.id })}
        //           className='d-block'
        //           id='create-button'
        //         > */}
        //         <span className='text-wrap'>{row?.name}</span>
        //         {/* </Link> */}
        //       </div>
        //     </div>
        //   )
        // },
        {
            name: FM('admin-email'),
            //sortable: true,
            minWidth: '200px',
            //sortable: row => row.full_name,
            cell: (row) => (
                <div className='d-flex align-items-center'>
                    <div className='user-info text-truncate'>
                        <span className='d-block fw-bold  text-wrap'>
                            {/* <Badge color={'light-primary'} pill> */}
                            {truncateText(decrypt(`${row?.email}`), 25) ?? 'N/A'}
                            {/* </Badge> */}
                        </span>
                        {/* <small className='status-text'>
              <>
                {FM('phone')} : {row?.mobile_number}
              </>
            </small> */}
                    </div>
                </div>
            )
        },

        // {
        //   name: <>{FM('store-email')}</>,
        //   minWidth: '150px',
        //   // sortable: row => row.subscription_type,
        //   cell: (row) => {
        //     return (
        //       <Badge color={'light-primary'} pill>
        //         {row?.store_setting?.store_email ?? 'N/A'}
        //       </Badge>
        //     )
        //   }
        // },
        // {
        //   name: FM('country'),
        //   //sortable: true,

        //   //sortable: row => row.full_name,
        //   cell: (row) => (
        //     <div className='d-flex align-items-center'>
        //       <div className='user-info text-truncate'>
        //         <span className='d-block fw-bold text-truncate'>
        //           {/* <Badge color={'light-primary'} pill> */}
        //           {truncateText(row?.country, 10) ?? 'N/A'}
        //           {/* </Badge> */}
        //         </span>
        //         {/* <small className='status-text'>
        //           <>
        //             {FM('currency')} : {row?.currency}
        //           </>
        //         </small> */}
        //       </div>
        //     </div>
        //   )
        // },

        {
            name: <>{FM('state-city')}</>,
            //sortable: true,
            // minWidth: '250px',
            //sortable: row => row.full_name,
            cell: (row) => (
                <span className='text-wrap'>
                    {isValid(row?.city) && isValid(row?.state)
                        ? `${row?.city}/${row?.state}`
                        : isValid(row?.city)
                            ? row?.city
                            : isValid(row?.state)
                                ? row?.state
                                : ''}
                </span>
            )
        },
        {
            name: FM('currency'),
            //sortable: true,
            // minWidth: '50px',
            //sortable: row => row.full_name,
            cell: (row) => (
                <div className='d-flex align-items-center'>
                    <div className='user-info text-truncate'>
                        <span className='d-block fw-bold text-truncate'>
                            <Badge color={'light-primary'} pill>
                                {row?.currency ?? 'N/A'}
                            </Badge>
                        </span>
                        {/* <small className='status-text'>
                  <>
                    {FM('phone')} : {row?.mobile_number}
                  </>
                </small> */}
                    </div>
                </div>
            )
        },
        {
            name: <>{FM('Status')}</>,

            //   sortable: (row) => row.status,
            cell: (row) => {
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
            cell: (row) => {
                return (
                    <div className='d-flex '>
                        <DropDownMenu
                            direction='down'
                            component={<MoreVertical color={colors.primary.main} size={IconSizes.MenuVertical} />}
                            options={[
                                {
                                    IF: Can(Permissions.storeEdit) && userType === UserType.Store,
                                    icon: <Edit size={14} />,
                                    state: row,
                                    to: { pathname: getPath('admin.stores.update', { id: row?.id }) },
                                    name: FM('edit')
                                },
                                {
                                    icon: <Download size={14} />,
                                    state: row,
                                    onClick: () => donwloadQr(row),
                                    // to: { pathname: getPath('admin.stores.update', { id: row?.id }) },
                                    name: FM('download-qrcode')
                                },
                                // {
                                //   icon: <Download size={14} />,
                                //   state: row,
                                //   onClick: () => downloadBarcode(row),
                                //   // to: { pathname: getPath('admin.stores.update', { id: row?.id }) },
                                //   name: FM('download-barcode')
                                // },
                                {
                                    IF: row?.status === 2,
                                    noWrap: true,
                                    name: (
                                        <ConfirmAlert
                                            menuIcon={<Trash2 size={14} />}
                                            onDropdown
                                            eventId={`delete-item-${row?.id}`}
                                            item={row}
                                            title={decrypt(`${row?.name}`)}
                                            color='text-warning'
                                            onClickYes={() =>
                                                handleActions(row?.id, null, null, `delete-item-${row?.id}`)
                                            }
                                            //   onSuccessEvent={(e: any) => {
                                            //     refetch()
                                            //   }}
                                            className=''
                                            id={`grid-delete-${row?.id}`}
                                        >
                                            {FM('delete')}
                                        </ConfirmAlert>
                                    )
                                },

                                {
                                    IF: row?.status === 1 && Permissions.storeDelete && userType === UserType.Store,
                                    noWrap: true,
                                    name: (
                                        <ConfirmAlert
                                            menuIcon={<X size={14} />}
                                            onDropdown
                                            eventId={`item-inactive-${row?.id}`}
                                            text={FM('are-you-sure')}
                                            title={FM('inactive-item-name', {
                                                name: decrypt(row?.store_setting?.store_name)
                                            })}
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
                                    IF: row?.status === 2 && Permissions.storeDelete && userType === UserType.Store,
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
            IF: Permissions.storeDelete,
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
            <StoreFilter
                userType={userType}
                show={state?.storeFilter}
                filterData={state.filterData}
                setFilterData={(e: any) => setState({ filterData: e, page: 1 })}
                handleFilterModal={(e: boolean) => {
                    // setPatientFilter(false)
                    setState({
                        storeFilter: e
                    })
                }}
            />
            <Header onClickBack={() => navigate(-1)} goBackTo title={FM('stores')}>
                <Hide IF={userType === UserType.Admin}>
                    <TooltipLink
                        title={FM('trashed-store')}
                        to={getPath('store.sub-store.trashed', { store_id: parentId })}
                        className='btn btn-dark btn-sm me-1'
                    >
                        <Trash size='14' />
                    </TooltipLink>
                </Hide>

                <ButtonGroup color='dark'>
                    {/* <TooltipLink
            title={<>{FM('create-new')}</>}
            to={getPath('admin.stores.create')}
            className='btn btn-primary btn-sm'
          >
            <Plus size='14' />
          </TooltipLink> */}

                    <BsTooltip<ButtonProps>
                        Tag={Button}
                        onClick={() =>
                            setState({
                                storeFilter: true
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
                        size='sm'
                        color='dark'
                        onClick={reloadData}
                        tooltip={FM('reload')}
                    >
                        <RefreshCcw size='14' />
                    </LoadingButton>
                </ButtonGroup>
                {/* <ButtonGroup className='ms-1'>
          <TooltipLink
            title={FM('trashed-stores')}
            state={{ reload: true }}
            to={
              userType === 1 ? getPath('admin.stores.trashed') : getPath('store.sub-store.trashed')
            }
            className='btn btn-dark btn-sm'
            color='secondary'
          >
            <>
              <Trash size='14' />
              <span className='align-middle ms-25'>{FM('bin')}</span>
            </>
          </TooltipLink>
        </ButtonGroup> */}
            </Header>
            <CustomDataTable<StoreParamsType | SubStoreRequestParams>
                initialPerPage={15}
                isLoading={isLoading}
                isFetching={isLoading}
                options={options}
                selectableRows
                columns={columns}
                paginatedData={isValid(resData) ? resData : resData}
                handlePaginationAndSearch={handlePageChange}
            />
        </>
    )
}
export default StoresByParentId
