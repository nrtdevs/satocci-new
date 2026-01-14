/* eslint-disable prettier/prettier */
import { useContext, useEffect, useReducer } from 'react'

import {
    Activity,
    ArrowLeftCircle,
    ArrowRightCircle,
    Dribbble,
    Edit,
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
    useLoadCountryMutation,
    useUpdateCountryMutation

} from '../../../redux/RTKQuery/CountryRTK'
import { useAppDispatch } from '../../../redux/store'
import { getPath } from '../../../router/RouteHelper'

import { Permissions } from '../../../utility/Permissions'

import LoadingButton from '../../components/buttons/LoadingButton'
import DropDownMenu from '../../components/dropdown'
import UpdateModal from './UpdateModal'


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
function Countries() {
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
    const [loadCountry, { data, isLoading }] = useLoadCountryMutation()

    useEffect(() => {
        loadCountry({
            jsonData: { name: state?.search },
            page: state?.page,
            per_page_record: state?.per_page_record
        })
    }, [state.page, state.per_page_record, state.search, state.lastRefresh])


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


    const reloadData = () => {
        setState({
            page: 1,
            lastRefresh: new Date().getTime(),
            search: ''
        })
    }


    const columns: TableColumn<any>[] = [

        {
            name: FM('country'),
            // maxWidth: '250px',
            cell: (row, index: any) => (
                <>
                    <ReactCountryFlag
                        style={{ width: '25px', height: '25px' }}
                        className='country-flag'
                        countryCode={row.country_code === 'eng' ? 'us' : row.country_code ?? 'us'}
                        svg
                    />
                </>

                // eslint-disable-next-line no-mixed-operators
                // return parseInt(state?.per_page_record) * (state?.page - 1) + (index + 1)
            )
        },

        {
            name: FM('name'),

            cell: (row) => (
                <>
                    {/* <Link to={getPath('admin.language.labels', { name: row?.title, languageId: row?.id })}> */}
                    <span className='text-capitalize'>{row?.name}</span>
                    {/* </Link> */}
                </>
            )
        },
        {
            name: FM('currency'),

            cell: (row) => (
                <>
                    {/* <Link to={getPath('admin.language.labels', { name: row?.title, languageId: row?.id })}> */}
                    <span className='text-capitalize'>{row?.currency}</span>
                    {/* </Link> */}
                </>
            )
        },
        {
            name: FM('currency-symbol'),

            cell: (row) => (
                <>
                    {/* <Link to={getPath('admin.language.labels', { name: row?.title, languageId: row?.id })}> */}
                    <span className='text-capitalize'>{row?.currency_symbol}</span>
                    {/* </Link> */}
                </>
            )
        },
        {
            name: FM('currency-code'),

            cell: (row) => (
                <>
                    {/* <Link to={getPath('admin.language.labels', { name: row?.title, languageId: row?.id })}> */}
                    <span className='text-capitalize'>{row?.currency_code}</span>
                    {/* </Link> */}
                </>
            )
        },

        {
            name: FM('minimum-cart-value'),

            cell: (row) => (
                <>
                    {/* <Link to={getPath('admin.language.labels', { name: row?.title, languageId: row?.id })}> */}
                    <Badge color='light-danger'>{Number(row?.min_cart_value).toFixed(2)}</Badge>
                    {/* </Link> */}
                </>
            )
        },
        {
            name: <>{FM('action')}</>,
            allowOverflow: true,
            maxWidth: '10px',
            cell: (row) => {
                return (
                    <div className='d-flex '>
                        {
                            <>
                                <DropDownMenu
                                    direction='up'
                                    component={
                                        <MoreVertical color={colors.primary.main} size={IconSizes.MenuVertical} />
                                    }
                                    options={[
                                        {

                                            icon: <Edit size={14} />,

                                            onClick: () => {
                                                setState({
                                                    showModal: true,
                                                    editData: row
                                                })
                                            },
                                            name: FM('update-min-cart-value')
                                        }

                                    ]}
                                />
                            </>
                        }
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
            <UpdateModal
                response={(e) =>
                    setState({ showModal: false, lastRefresh: new Date().getTime(), page: 1 })
                }
                setShowModal={(e) => setState({ showModal: e })}
                //data={state?.editData}
                edit={state?.editData}
                showModal={state?.showModal}

                noView
            />

            <Header icon={<Globe size='25' />} title={FM('country')}>
                <ButtonGroup color='dark'>
                    {/* <LanguageAddModal<ButtonProps>
                        response={(e) =>
                            setState({ isAddingNewData: e, lastRefresh: new Date().getTime(), page: 1 })
                        }
                        Component={Button}
                        title={FM('add')}
                        size='sm'
                        color='primary'
                    >
                        <Plus size='14' />
                    </LanguageAddModal> */}
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
            <CustomDataTable<any>
                initialPerPage={15}
                isLoading={isLoading}
                // options={options}
                selectableRows={false}
                columns={columns}
                paginatedData={data}
                handlePaginationAndSearch={handlePageChange}
            />
        </>
    )
}
export default Countries
