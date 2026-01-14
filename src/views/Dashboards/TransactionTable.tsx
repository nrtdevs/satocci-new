/* eslint-disable prettier/prettier */
/* eslint-disable no-mixed-operators */
// ** Custom Components

// ** Reactstrap Imports
import { Badge, Card, CardHeader } from 'reactstrap'

// ** Icons Imports
import { useEffect, useReducer, useState } from 'react'
import { TableColumn } from 'react-data-table-component'
import { Printer } from 'react-feather'
import { Link } from 'react-router-dom'
import { OrdersParams, useLoadOrdersMutation } from '../../redux/RTKQuery/OrdersRTK'
import { getPath } from '../../router/RouteHelper'
import { downloadStoreInvoice } from '../../utility/apis/ExportLanguage'
import { FM, isValid, isValidUrl } from '../../utility/helpers/common'
import useUser from '../../utility/hooks/useUser'
import httpConfig from '../../utility/http/httpConfig'
import { stateReducer } from '../../utility/stateReducer'
import { CF, formatDate } from '../../utility/Utils'
import LoadingButton from '../components/buttons/LoadingButton'
import CustomDataTable from '../components/CustomDataTable/CustomDataTable'
import Show from '../../utility/Show'

// interface storeProps {
//   storeName?: any;
// }

interface States {
    lastRefresh?: any
    page?: any
    per_page_record?: any

    search?: any
    reload?: any
    isRemoving?: boolean
    isIndex?: any
    isAddingNewData?: boolean
    transactionFilter?: boolean
    filterData?: OrdersParams | any
}

type theProps = {
    loading?: any
}
const TransactionTable = ({ loading = false }: theProps) => {
    // ** vars
    const initState: States = {
        page: 1,
        isIndex: null,
        per_page_record: 15,
        lastRefresh: new Date().getTime(),
        transactionFilter: false,
        filterData: {
            name: null,
            email: null,
            subscription_terms_select_value: null,
            status: null
        },
        search: undefined,
        isRemoving: false,

        isAddingNewData: false
    }
    const user = useUser()
    const reducers = stateReducer<States>
    const [state, setState] = useReducer(reducers, initState)
    const [loadingInvoice, setLoadingInvoice] = useState<boolean>(false)
    const [loadOrders, { data, isLoading }] = useLoadOrdersMutation()
    // useEffect(() => {
    //   if (loading) {
    //     setState({
    //       lastRefresh: new Date().getTime()
    //     })
    //   }
    // }, [loading])
    useEffect(() => {
        setState({
            page: 1
        })
    }, [state.per_page_record])

    useEffect(() => {
        loadOrders({
            page: 1,
            per_page_record: 30
        })
    }, [state?.lastRefresh, loading])

    const downloadInvoice = (d?: any) => {
        setState({
            isIndex: d?.index
        })
        downloadStoreInvoice({
            id: d?.id,
            loading: setLoadingInvoice,
            success: (e: any) => {
                if (isValidUrl(e?.payload)) {
                    window.open(`${e?.payload}`, '_blank')
                } else {
                    window.open(`${httpConfig.baseUrl2}${e?.payload}`, '_blank')
                }
                //  window.open(`${httpConfig.baseUrl2}${e?.payload}`, '_blank')
            }
        })
    }

    let columns: TableColumn<OrdersParams>[] = []
    columns = [
        {
            name: '#',
            maxWidth: '40px',
            cell: (row: any, index: any) => {
                // eslint-disable-next-line no-mixed-operators
                return parseInt(state?.per_page_record) * (state?.page - 1) + (index + 1)
            }
        },

        {
            name: <>{FM('order-number')}</>,
            maxWidth: '150px',

            cell: (row) => (
                <Link
                    state={{ row }}
                    to={getPath('admin.orders.detail', { id: row?.id })}
                    className='d-block'
                    id='create-button'
                >
                    <span className='d-block fw-bold text-truncate'>
                        <u>#{row?.order_number}</u>
                    </span>
                </Link>
            )
        },
        {
            name: <>{FM('item-count')}</>,
            cell: (row) => (
                <span className='d-block fw-bold'>
                    {row?.order_details_count} {FM('items')}
                </span>
            )
        },
        {
            name: <>{FM('paid-amount')}</>,
            cell: (row) => (
                <div className='d-flex align-items-center'>
                    <div className='user-info text-truncate ms-1'>
                        <span className='d-block fw-bold'>
                            {CF({
                                money: row?.paid_amount,
                                currency: isValid(user?.currency) ? user?.currency : 'SEK'
                            })}
                        </span>
                    </div>
                </div>
            )
        },
        {
            name: <>{FM('order-date')}</>,
            cell: (row) => (
                <div className='d-flex align-items-center'>
                    <div className='user-info text-truncate ms-1'>
                        <span className='d-block fw-bold text-truncate'>{formatDate(row?.created_at)}</span>
                    </div>
                </div>
            )
        },
        {
            name: <>{FM('Status')}</>,
            cell: (row) => {
                return (
                    <>
                        {row?.status === 1 ? (
                            <Badge color={'light-success'} pill>
                                <>{FM('completed')}</>
                            </Badge>
                        ) : row?.status === 2 ? (
                            <Badge color={'light-danger'} pill>
                                <>{FM('cancelled')}</>
                            </Badge>
                        ) : (
                            <Badge color={'light-primary'} pill>
                                <>{FM('pending')}</>
                            </Badge>
                        )}
                    </>
                )
            }
        },

        {
            name: <>{FM('print')}</>,
            cell: (row, i) => (
                <Show IF={row?.payment_status === 1}>
                    <LoadingButton
                        loading={state.isIndex === i ? loadingInvoice : false}
                        tooltip={FM('print')}
                        onClick={() => downloadInvoice({ id: row?.id, index: i })}
                        className='btn btn-primary btn-sm d-flex align-items-center'
                    >
                        <Printer size='14' />
                    </LoadingButton>
                </Show>
            )
        }
    ]
    return (
        <Card className='card-company-table'>
            <CardHeader>
                {FM('last-count-transaction', {
                    count: 30
                })}
            </CardHeader>
            <CustomDataTable<OrdersParams>
                key={state.lastRefresh}
                initialPerPage={15}
                isLoading={isLoading}
                columns={columns}
                cardClass='mb-0'
                hideHeader
                // HidePerPage
                hideFooter
                paginatedData={data}
            />
        </Card>
    )
}

export default TransactionTable
