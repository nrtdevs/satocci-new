/* eslint-disable prettier/prettier */
import { useContext, useEffect, useReducer } from 'react'
import { TableColumn } from 'react-data-table-component'
import { Activity, Award, BarChart2, MoreVertical, RefreshCcw, Sliders } from 'react-feather'
import { useLocation, useNavigate } from 'react-router-dom'
import { Badge, Button, ButtonGroup, ButtonProps, DropdownItem } from 'reactstrap'
import { IconSizes } from '../../../utility/Const'
import { decrypt, formatDate, truncateText } from '../../../utility/Utils'
import { ThemeColors } from '../../../utility/context/ThemeColors'
import { FM } from '../../../utility/helpers/common'
import { stateReducer } from '../../../utility/stateReducer'
import CustomDataTable, {
    TableDropDownOptions,
    TableFormData
} from '../../components/CustomDataTable/CustomDataTable'
import DropDownMenu from '../../components/dropdown'
import Header from '../../components/header'
import Ratings from '../../components/ratings'
import BsTooltip from '../../components/tooltip'
import {
    ReferralsRequestParams,
    useLoadReferralsMutation
} from '../../../redux/RTKQuery/FedbackRTK'

interface States {
    page?: any
    per_page_record?: any
    search?: any
    reload?: any
    lastRefresh?: any
    isRemoving?: boolean
    isReloading?: boolean
    isAddingNewData?: boolean
}

function StoreReferrals() {
    const { colors } = useContext(ThemeColors)
    const navigate = useNavigate()
    // Local States
    const initState: States = {
        page: 1,
        per_page_record: 15,
        lastRefresh: new Date().getTime(),
        search: undefined,
        isRemoving: false,
        isReloading: false,
        isAddingNewData: false
    }

    const reducers = stateReducer<States>
    const [state, setState] = useReducer(reducers, initState)
    // Load Store Data
    const [loadData, { data, isSuccess, isLoading, isError }] = useLoadReferralsMutation()
    const handlePageChange = (e: TableFormData) => {
        setState({ ...e })
    }

    useEffect(() => {
        loadData({
            jsonData: {
                search: state.search
            },
            page: state.page,
            per_page_record: state.per_page_record
        })
    }, [state.page, state.per_page_record, state.search, state.lastRefresh])

    const reloadData = () => {
        setState({ lastRefresh: new Date().getTime(), page: 1 })
    }

    let columns: TableColumn<ReferralsRequestParams>[] = []

    columns = [
        {
            name: FM('store-name'),
            cell: (row, index: any) => (
                <div className='d-flex align-items-center'>
                    <div className='user-info text-truncate'>
                        <span className='d-block fw-bold text-truncate'>{row?.store_name}</span>
                    </div>
                </div>
            )
        },
        {
            name: FM('store-number'),

            cell: (row, index: any) => (
                <div className='d-flex align-items-center'>
                    <div className='user-info text-truncate'>
                        <span className='d-block fw-bold text-truncate'>{row?.store_contact_number}</span>
                    </div>
                </div>
            )
        },
        {
            name: FM('store-email'),

            cell: (row, index: any) => (
                <div className='d-flex align-items-center'>
                    <div className='user-info text-truncate'>
                        <span className='d-block fw-bold text-truncate'>{row?.store_contact_email}</span>
                    </div>
                </div>
            )
        },
        {
            name: FM('created-by'),
            cell: (row, index: any) => (
                <div className='d-flex align-items-center'>
                    <div className='user-info text-truncate'>
                        <span className='d-block fw-bold text-truncate'>{decrypt(row?.customer?.name)}</span>
                    </div>
                </div>
            )
        },

        {
            name: FM('url-links'),
            minWidth: '250px',
            cell: (row, index: any) => (
                <div className='d-flex align-items-center'>
                    <div className='user-info'>
                        <a
                            href={`${row?.url_address}`}
                            target='_blank'
                            className='d-block fw-bold '
                            rel='noreferrer'
                        >
                            {truncateText(row?.url_address, 30) ?? ''}
                        </a>
                        {row?.url_address ? '' : 'N/A'}
                    </div>
                </div>
            )
        },
        {
            name: FM('url-web'),
            minWidth: '250px',
            cell: (row, index: any) => (
                <div className='d-flex align-items-center'>
                    <div className='user-info text-truncate'>
                        <a
                            href={`${row?.url_web}`}
                            target='_blank'
                            rel='noreferrer'
                            className='d-block fw-bold text-truncate'
                        >
                            {truncateText(row?.url_web, 30) ?? ''}
                        </a>
                        {row?.url_web ? '' : 'N/A'}
                    </div>
                </div>
            )
        },
        {
            name: FM('created-at'),
            cell: (row, index: any) => (
                <div className='d-flex align-items-center'>
                    <div className='user-info text-truncate'>
                        <span className='d-block fw-bold text-truncate'>{formatDate(row?.created_at)}</span>
                    </div>
                </div>
            )
        }

        // {
        //   name: <>{FM('customer-name')}</>,

        //   //sortable: row => row.full_name,
        //   cell: (row) => (
        //     <div className='d-flex align-items-center'>
        //       <div className='user-info text-truncate'>
        //         {/* <Link
        //             state={{ row }}
        //             to={getPath('admin.stores.details', { id: row?.id })}
        //             className='d-block'
        //             id='create-button'
        //           > */}
        //         <span className='d-block fw-bold text-truncate'>
        //           {decrypt(`${row?.customer_name}`)}
        //         </span>
        //         {/* </Link> */}
        //       </div>
        //     </div>
        //   )
        // },
        // {
        //   name: <>{FM('customer-email')}</>,
        //   //sortable: true,

        //   //sortable: row => row.full_name,
        //   cell: (row) => (
        //     <div className='d-flex align-items-center'>
        //       <div className='user-info text-truncate ms-1'>
        //         <span className='d-block fw-bold text-truncate'>{decrypt(row?.customer_email)}</span>
        //       </div>
        //     </div>
        //   )
        // },

        // {
        //   name: <>{FM('gatekeeper-name')}</>,

        //   // sortable: row => row.subscription_type,
        //   cell: (row) => {
        //     return (
        //       <Badge color='light-primary' pill>
        //         {row?.gatekeeper}
        //       </Badge>
        //     )
        //   }
        // },

        // {
        //   name: <>{FM('status')}</>,

        //   //   sortable: (row) => row.status,
        //   cell: (row) => {
        //     return (
        //       <>
        //         {row?.status === 1 ? (
        //           <Badge color={'light-success'} pill>
        //             <>{FM('paid')}</>
        //           </Badge>
        //         ) : row?.status === 2 ? (
        //           <Badge color={'light-danger'} pill>
        //             <>{FM('decline')}</>
        //           </Badge>
        //         ) : (
        //           <Badge color={'light-primary'} pill>
        //             <>{FM('pending')}</>
        //           </Badge>
        //         )}
        //       </>
        //     )
        //   }
        // },
    ]

    return (
        <>
            <Header
                onClickBack={() => navigate(-1)}
                goBackTo
                icon={<Award size='25' />}
                title={FM('referral_store')}
            >
                <ButtonGroup color='dark'>
                    <BsTooltip<ButtonProps>
                        Tag={Button}
                        onClick={reloadData}
                        size='sm'
                        color='dark'
                        title={FM('reload')}
                    >
                        <RefreshCcw size='14' />
                    </BsTooltip>
                </ButtonGroup>
            </Header>
            <CustomDataTable<ReferralsRequestParams>
                initialPerPage={15}
                isLoading={isLoading}
                columns={columns}
                paginatedData={data}
                handlePaginationAndSearch={handlePageChange}
            />
        </>
    )
}

export default StoreReferrals
