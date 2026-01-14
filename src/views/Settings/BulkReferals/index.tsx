/* eslint-disable react/jsx-key */
/* eslint-disable prettier/prettier */
import { useContext, useEffect, useReducer } from 'react'

import {
    Activity,
    ArrowLeftCircle,
    ArrowRightCircle,
    Gift,
    Globe,
    MoreVertical,
    Plus,
    RefreshCcw,
    Trash2
} from 'react-feather'
import { Badge, Button, ButtonGroup, ButtonProps, Card, Col, DropdownItem, Row } from 'reactstrap'
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
import BulkReferralsModal, { BulkReferralsParam } from './BulkReferralsModal'
import { useListBulkReferralsMutation } from '../../../redux/RTKQuery/PromotionTemplateRTK'
import Shimmer from '../../components/shimmers/Shimmer'
import PaginationIconsAndText from './Pagination'
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
function BulkReffarals() {
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
    const [loadBulkReferrals, { data, isLoading }] = useListBulkReferralsMutation()

    useEffect(() => {
        loadBulkReferrals({
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

    const columns: TableColumn<BulkReferralsParam>[] = [
        {
            name: FM('random-group-id'),
            minWidth: '200px',
            cell: (row, index: any) => (
                <>
                    <span className=''>{row?.random_group_id}</span>
                </>


            )
        },
        {
            name: FM('first-name'),
            // maxWidth: '250px',
            cell: (row, index: any) => (
                <>

                    <span className=''>{row?.first_name}</span>

                </>


            )
        },

        {
            name: FM('last-name'),

            cell: (row) => (
                <>

                    <span className=''>{row?.last_name}</span>

                </>
            )
        },
        {
            name: FM('email'),

            cell: (row) => (
                <>

                    <span className=''>{row?.email}</span>

                </>
            )
        },
        {
            name: FM('mobile-number'),

            cell: (row) => (
                <>

                    <span className=''>{row?.mobile}</span>

                </>
            )
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
            <Header icon={<Gift size='25' />} title={FM('bulk-referrals')}>
                <ButtonGroup color='dark'>
                    <BulkReferralsModal<ButtonProps>
                        response={(e) =>
                            setState({ isAddingNewData: e, lastRefresh: new Date().getTime(), page: 1 })
                        }
                        Component={Button}
                        title={FM('add')}
                        size='sm'
                        color='primary'
                    >
                        <Plus size='14' />
                    </BulkReferralsModal>
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
            {
                isLoading ? <>
                    <Card>
                        <Row>
                            <Col md="12">
                                <Shimmer height={400} />
                            </Col>
                            <Col md="12">
                                <Shimmer height={400} />
                            </Col>
                            <Col md="12">
                                <Shimmer height={400} />
                            </Col>
                            <Col md="12">
                                <Shimmer height={400} />
                            </Col>
                        </Row>
                    </Card>
                </> : <>
                    {/*  <CustomDataTable<BulkReferralsParam>
            initialPerPage={15}
            isLoading={isLoading}
            options={options}
            selectableRows={false}
            columns={columns}
            paginatedData={data}
            handlePaginationAndSearch={handlePageChange}
        />*/
                    }

                    {
                        data?.payload?.data?.map((d: any, i: any) => {

                            return (
                                <>
                                    <div className="card">

                                        <div className='card-header'>
                                            <h5 className='card-title fw-bolder'><span className='text-dark'>{FM("random-group-id")}</span> : <span className='text-primary'> {d?.random_group_id}</span></h5>

                                        </div>
                                        <div className='card-body'>
                                            <table className="table ">
                                                <thead className='table-primary'>
                                                    <tr>
                                                        <th scope="col">{FM("first-name")}</th>
                                                        <th scope="col">{FM("last-name")}</th>
                                                        <th scope="col">{FM("email")}</th>
                                                        <th scope="col">{FM("mobile-no")}</th>
                                                    </tr>
                                                </thead>
                                                {
                                                    d?.referrals?.map((r: any) => {
                                                        return (

                                                            <tbody>
                                                                <tr >
                                                                    <th >{r?.first_name}</th>
                                                                    <td >{r?.last_name}</td>
                                                                    <td >{r?.email}</td>
                                                                    <td >{r?.mobile}</td>
                                                                </tr>

                                                            </tbody>
                                                        )
                                                    })
                                                }

                                            </table>
                                        </div>
                                    </div>
                                </>
                            )

                        })
                    }

                    <div className='mb-1'>
                        <PaginationIconsAndText
                            total={data?.payload?.total}
                            last_page={data?.payload?.last_page}
                            per_page={data?.payload?.per_page}
                            resPerPage={(e: any) => setState({ page: 1, per_page_record: 15 })}
                            resCurrentPage={(e: any) => setState({ page: e, per_page_record: 15 })}
                        />
                    </div>

                    {
                        !isValid(data?.payload?.data) ? <div className='text-center'>{FM('no-data-found')}</div> : null
                    }
                </>
            }

        </>
    )
}
export default BulkReffarals
