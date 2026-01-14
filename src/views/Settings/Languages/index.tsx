/* eslint-disable prettier/prettier */
import { useContext, useEffect, useReducer } from 'react'

import {
    Activity,
    ArrowLeftCircle,
    ArrowRightCircle,
    Dribbble,
    Globe,
    MoreVertical,
    Plus,
    RefreshCcw,
    Trash2
} from 'react-feather'
import { Badge, Button, ButtonGroup, ButtonProps, DropdownItem } from 'reactstrap'
import { ThemeColors } from '../../../utility/context/ThemeColors'

import { IconSizes, modeType } from '../../../utility/Const'
import { FM, isValid, log } from '../../../utility/helpers/common'
import { stateReducer } from '../../../utility/stateReducer'
import { emitAlertStatus, formatDate, truncateText } from '../../../utility/Utils'
import CustomDataTable, {
    TableDropDownOptions,
    TableFormData
} from '../../components/CustomDataTable/CustomDataTable'
import Header from '../../components/header'

import { TableColumn } from 'react-data-table-component'

import { QueryStatus } from '@reduxjs/toolkit/dist/query'
import ReactCountryFlag from 'react-country-flag'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { languageLoad } from '../../../redux/reducers/Language'
import {
    LanguageRequestParams,
    useDeleteLanguageByIdMutation,
    useLoadLanguageMutation
} from '../../../redux/RTKQuery/LanguageRTK'
import { useAppDispatch } from '../../../redux/store'
import { getPath } from '../../../router/RouteHelper'
import { loadLanguageList } from '../../../utility/apis/ExportLanguage'
import ConfirmAlert from '../../../utility/helpers/ConfirmAlert'
import { Permissions } from '../../../utility/Permissions'
import { Can } from '../../../utility/Show'
import LoadingButton from '../../components/buttons/LoadingButton'
import DropDownMenu from '../../components/dropdown'
import LanguageAddModal from './LanguageAddModal'
import UnknownLabelModal from './labels/UnknownLabelsModal'
interface States {
    page?: any
    per_page_record?: any
    search?: any
    reload?: any
    editData?: any
    showModal?: any
    isAddingNewData?: boolean
    isReloading?: boolean
    isRemoving?: boolean
    lastRefresh?: any

}
function Languages() {
    const { colors } = useContext(ThemeColors)
    // Local States
    const { i18n } = useTranslation()
    const initState: States = {
        page: 1,
        lastRefresh: new Date().getTime(),
        per_page_record: 15,
        search: undefined,
        isRemoving: false,
        isReloading: false,
        isAddingNewData: false
    }
    const reducers = stateReducer<States>
    const [state, setState] = useReducer(reducers, initState)
    const dispatch = useAppDispatch()

    // Load Store Data
    const [loadLanguage, { data, isLoading }] = useLoadLanguageMutation()

    useEffect(() => {
        loadLanguage({
            jsonData: { name: state?.search },
            page: state?.page,
            per_page_record: state?.per_page_record
        })
    }, [state.page, state.per_page_record, state.search, state.lastRefresh])
    const [deleteLanguage, resultDelete] = useDeleteLanguageByIdMutation()

    //log('fdtierkg', data)
    useEffect(() => {
        setState({
            page: 1
        })
    }, [state.per_page_record])
    const handlePageChange = (e: TableFormData) => {
        //log('state change', e)
        setState({ ...e })
    }
    const handleActions = (id?: any, ids?: any, action?: any, eventId?: any) => {
        // log('id', id)
        if (isValid(id)) {
            // delete single
            deleteLanguage({
                eventId,
                id,
                originalArgs: resultDelete?.originalArgs
            })
        } else {
            deleteLanguage({
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
    const loadLanguageListData = () => {
        loadLanguageList({
            success: (e) => {
                dispatch(languageLoad(e?.payload?.data))
                const lastIndexArray = e?.payload?.data?.filter((d: any) => `${d?.id}` === '1')
                localStorage.setItem('lang', JSON.stringify(lastIndexArray[0]))
                i18n.changeLanguage(String(lastIndexArray[0]?.id))
            }
        })
    }

    log('case', Can(Permissions.languageDelete))
    ///Delete Language
    useEffect(() => {
        if ((resultDelete.status = QueryStatus.fulfilled) && resultDelete?.isLoading === false) {
            if (resultDelete?.isSuccess) {
                // setState({ isRemoving: true })
                loadLanguageListData()
                dispatch(languageLoad(data?.payload?.data))
                emitAlertStatus('success', null, `delete-item-${resultDelete?.originalArgs?.id}`)
            } else if (resultDelete?.error) {
                emitAlertStatus('failed', null, `delete-item-${resultDelete?.originalArgs?.id}`)
            }
        }
    }, [resultDelete])

    const reloadData = () => {
        setState({
            page: 1,
            lastRefresh: new Date().getTime(),
            search: ''
        })
    }

    // useEffect(() => {
    //   if (resultDelete?.isSuccess) {
    //     setState({
    //       page: 1,
    //       lastRefresh: new Date().getTime()
    //     })
    //   }
    // }, [resultDelete?.isSuccess])

    const columns: TableColumn<LanguageRequestParams>[] = [
        {
            name: FM('mode'),
            maxWidth: '100px',
            cell: (row, index: any) => (
                <>
                    {row?.mode === modeType.ltr ? (
                        <ArrowRightCircle className='text-primary' />
                    ) : (
                        <ArrowLeftCircle className='text-primary' />
                    )}
                </>

                // eslint-disable-next-line no-mixed-operators
                // return parseInt(state?.per_page_record) * (state?.page - 1) + (index + 1)
            )
        },
        {
            name: FM('country'),
            // maxWidth: '250px',
            cell: (row, index: any) => (
                <>
                    <ReactCountryFlag
                        style={{ width: '25px', height: '25px' }}
                        className='country-flag'
                        countryCode={row.value === 'eng' ? 'us' : row.value ?? 'us'}
                        svg
                    />
                </>

                // eslint-disable-next-line no-mixed-operators
                // return parseInt(state?.per_page_record) * (state?.page - 1) + (index + 1)
            )
        },

        {
            name: FM('name'),
            // maxWidth: '250px',
            //sortable: row => row.full_name,
            cell: (row) => (
                <>
                    <Link to={getPath('admin.language.labels', { name: row?.title, languageId: row?.id })}>
                        <span className='text-capitalize'>{row?.title}</span>
                    </Link>
                </>
            )
        },
        // {
        //   name: FM('value'),
        //   //sortable: true,
        //   minWidth: '250px',
        //   //sortable: row => row.full_name,
        //   cell: (row) => (
        //     <div className='d-flex align-items-center'>
        //       <div className='user-info text-truncate ms-1'>
        //         <span className='d-block fw-bold text-truncate'>{row.value}</span>
        //       </div>
        //     </div>
        //   )
        // },

        {
            name: <>{FM('created-date')}</>,
            // maxWidth: '250px',
            // sortable: row => row.subscription_type,
            cell: (row) => {
                return (
                    <Badge color='light-primary' pill>
                        {formatDate(row?.created_at)}
                    </Badge>
                )
            }
        },

        {
            name: <>{FM('Status')}</>,
            // maxWidth: '250px',
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
                        {row?.id !== 1 ? (
                            <>
                                <DropDownMenu
                                    direction='up'
                                    component={
                                        <MoreVertical color={colors.primary.main} size={IconSizes.MenuVertical} />
                                    }
                                    options={[
                                        {

                                            icon: <Dribbble size={14} />,
                                            // state: row,
                                            // to: {
                                            //   pathname: getPath('admin.settings.notification.update', { id: row?.id })
                                            // },
                                            onClick: () => {
                                                setState({
                                                    showModal: true,
                                                    editData: row
                                                })
                                            },
                                            name: FM('add-missing-labels')
                                        },
                                        {
                                            IF: Can(Permissions.languageDelete),
                                            noWrap: true,
                                            name: (
                                                <ConfirmAlert
                                                    menuIcon={<Trash2 size={14} />}
                                                    onDropdown
                                                    eventId={`delete-item-${row?.id}`}
                                                    item={row}
                                                    title={truncateText(`${row?.title}`, 50)}
                                                    color='text-warning'
                                                    onClickYes={() =>
                                                        handleActions(row?.id, null, null, `delete-item-${row?.id}`)
                                                    }
                                                    onSuccessEvent={(e: any) => {
                                                        reloadData()
                                                    }}
                                                    className=''
                                                    id={`grid-delete-${row?.id}`}
                                                >
                                                    {FM('delete')}
                                                </ConfirmAlert>
                                            )
                                        }
                                    ]}
                                />
                            </>
                        ) : (
                            ''
                        )}
                    </div>
                )
            }
        }
    ]

    const options: TableDropDownOptions = (selectedRows) => [
        {
            IF: Permissions.languageDelete,
            noWrap: true,
            name: (
                <DropdownItem
                    onClick={() => {
                        //log('selectedRowws', selectedRows?.ids)
                    }}
                    tag={'span'}
                    className='dropdown-item d-flex align-items-center'
                >
                    <>
                        <Activity size={16} className='me-1' />
                        {FM('delete')} ({selectedRows?.selectedCount})
                    </>
                </DropdownItem>
            )
        }
    ]

    return (
        <>
            <UnknownLabelModal languageId={state.editData?.id} showModal={state.showModal} setShowModal={() => {
                setState({ showModal: false })
            }} response={(e) =>
                setState({ isAddingNewData: e, lastRefresh: new Date().getTime(), page: 1 })
            } noView />
            <Header icon={<Globe size='25' />} title={FM('languages')}>
                <ButtonGroup color='dark'>
                    <LanguageAddModal<ButtonProps>
                        response={(e) =>
                            setState({ isAddingNewData: e, lastRefresh: new Date().getTime(), page: 1 })
                        }
                        Component={Button}
                        title={FM('add')}
                        size='sm'
                        color='primary'
                    >
                        <Plus size='14' />
                    </LanguageAddModal>
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
            <CustomDataTable<LanguageRequestParams>
                initialPerPage={15}
                isLoading={isLoading}
                options={options}
                selectableRows={false}
                columns={columns}
                paginatedData={data}
                handlePaginationAndSearch={handlePageChange}
            />
        </>
    )
}
export default Languages
