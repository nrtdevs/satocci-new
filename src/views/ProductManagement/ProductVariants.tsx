/* eslint-disable prettier/prettier */
import {
    ForwardedRef,
    forwardRef,
    useContext,
    useEffect,
    useImperativeHandle,
    useReducer
} from 'react'

import { BarChart2, Download, Edit, File, MoreVertical, Plus, RefreshCcw, Sliders, Trash2 } from 'react-feather'
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom'
import { Badge, Button, ButtonGroup, ButtonProps } from 'reactstrap'
import { ThemeColors } from '../../utility/context/ThemeColors'

import { getPath } from '../../router/RouteHelper'
import { IconSizes, UserType } from '../../utility/Const'
import { FM, isValid, isValidUrl, log } from '../../utility/helpers/common'
import ConfirmAlert from '../../utility/helpers/ConfirmAlert'
import CustomDataTable, {
    TableDropDownOptions,
    TableFormData
} from '../components/CustomDataTable/CustomDataTable'
import DropDownMenu from '../components/dropdown'
import Header from '../components/header'

import { stateReducer } from '../../utility/stateReducer'

import { TableColumn } from 'react-data-table-component'
import BsTooltip from '../components/tooltip'
import TooltipLink from '../components/tooltip/TooltipLink'

import { QueryStatus } from '@reduxjs/toolkit/dist/query'
import { useDispatch } from 'react-redux'
import {
    useDeleteProductVariantByIdMutation,
    useLoadProductDetailsByIdMutation,
    useLoadProductVariantsMutation,
    usePrintProductBarcodeWithDetailsMutation
} from '../../redux/RTKQuery/ProductRTK'
import { useLoadCommonStoreDetailsMutation } from '../../redux/RTKQuery/SubStoreRTK'
import Emitter from '../../utility/Emitter'
import Hide from '../../utility/Hide'
import useUserType from '../../utility/hooks/useUserType'
import { Permissions } from '../../utility/Permissions'
import Show, { Can } from '../../utility/Show'
import { CF, emitAlertStatus, getUserData, truncateText } from '../../utility/Utils'
import LoadingButton from '../components/buttons/LoadingButton'
import { ProductVariantsType } from './fragment/ProductForm'
import ProductFilter from './ProductFilter'
import { json } from 'stream/consumers'
import httpConfig from '../../utility/http/httpConfig'

interface States {
    page?: any
    productFilter?: boolean
    per_page_record?: any
    search?: any
    reload?: any
    lastRefresh?: any
    isRemoving?: boolean
    isReloading?: boolean
    isAddingNewData?: boolean
    filterData?: any
}
export interface forRefType {
    reloadData: () => void
    filterData: (e: any) => void
}
export type forwardRefProps = ForwardedRef<forRefType>

const ProductVariants = forwardRef(function (
    { hideHeader = false }: { hideHeader?: boolean },
    ref: forwardRefProps
) {
    const dispatch = useDispatch()
    const { colors } = useContext(ThemeColors)
    // Local States
    const initState: States = {
        page: 1,
        per_page_record: 15,
        lastRefresh: new Date().getTime(),
        productFilter: false,
        filterData: undefined,
        search: undefined,
        isRemoving: false,
        isReloading: false,
        isAddingNewData: false
    }
    const location: any = useLocation()
    const params: any = useParams()
    const nav = useNavigate()
    const productId = params?.id
    const user = getUserData()
    const userType = useUserType()
    const isAddingNewData = location?.state?.reload ?? false
    const reducers = stateReducer<States>
    const [state, setState] = useReducer(reducers, initState)
    const [loadProduct, { data, originalArgs, isLoading, isSuccess }] =
        useLoadProductVariantsMutation()
    const [showProduct, details] = useLoadProductDetailsByIdMutation()
    const [storeLoad, res] = useLoadCommonStoreDetailsMutation()
    const [deleteProduct, resultDelete] = useDeleteProductVariantByIdMutation()
    const [downloadBarcodeDetails, resultDownloadBarcode] = usePrintProductBarcodeWithDetailsMutation()
    const viewProrducts = details?.data?.payload as any
    const storeData = res?.data?.payload
    const currency =
        userType === UserType.Admin || userType === UserType.AdminEmployee
            ? viewProrducts?.store?.currency
            : user?.currency
    useEffect(() => {
        if (
            isValid(viewProrducts?.store_id) &&
            (userType === UserType.Admin || userType === UserType.AdminEmployee)
        ) {
            storeLoad({
                id: viewProrducts?.store_id
            })
        }
    }, [details])

    log('storeDtaa', viewProrducts)
    useEffect(() => {
        showProduct({
            id: productId
        })
    }, [productId])

    const loadProducts = () => {
        loadProduct({
            id: viewProrducts?.id,
            jsonData: {
                ...state?.filterData,
                id: viewProrducts?.id,
                store_id: viewProrducts?.store_id,
                name: isValid(state?.search) ? state.search : state.filterData?.name
            },
            page: state?.page,
            per_page_record: state?.per_page_record
        })
    }

    const downloadProductBarcodes = (d: any) => {
        downloadBarcodeDetails({
            jsonData: {
                // ...d,
                variant_id: d?.id,
                product_id: viewProrducts?.id,
                store_id: viewProrducts?.store_id
            }
        })
    }

    useEffect(() => {

        if (resultDownloadBarcode?.isSuccess) {
            if (isValidUrl(`${resultDownloadBarcode?.data?.payload}`)) {
                window.open(`${resultDownloadBarcode?.data?.payload}`, '_blank')
            } else {
                window.open(`${httpConfig.baseUrl2 + resultDownloadBarcode?.data?.payload}`, '_blank')

            }
        }
    }, [resultDownloadBarcode])

    useEffect(() => {
        if (details?.isSuccess) {
            loadProducts()
        }
    }, [
        state.filterData,
        state?.page,
        state?.per_page_record,
        state?.lastRefresh,
        state.search,
        details.isSuccess
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
        setState({ filterData: undefined, page: 1, lastRefresh: new Date().getTime() })
    }
    const handleDelete = (id?: any, ids?: any) => {
        // log('id', id)
        if (isValid(id)) {
            deleteProduct({ eventId: id, id, originalArgs })
        } else {
            deleteProduct({
                ids,
                eventId: 'selected',
                jsonData: {
                    ids,
                    action: 'delete'
                }
            })
        }
    }

    useImperativeHandle(ref, () => ({
        reloadData() {
            // alert('hi')
            reloadData()
        },
        filterData(e: any) {
            setState({ filterData: e, lastRefresh: new Date().getTime() })
        }
    }))

    useEffect(() => {
        Emitter.on('testingEmitter', (e: any) => {
            setState({ filterData: e })
        })
    }, [])

    useEffect(() => {
        if ((resultDelete.status = QueryStatus.fulfilled) && resultDelete?.isLoading === false) {
            if (resultDelete?.isSuccess) {
                emitAlertStatus('success', null, `delete-item-${resultDelete?.originalArgs?.eventId}`)
            } else if (resultDelete?.isError) {
                emitAlertStatus('failed', null, `delete-item-${resultDelete?.originalArgs?.eventId}`)
            }
        }
    }, [resultDelete])

    useEffect(() => {
        if (isAddingNewData) {
            reloadData()
            window.history.replaceState({}, document.title)
        }
    }, [])

    const columns: TableColumn<ProductVariantsType>[] = [
        // {
        //   name: '#',
        //   maxWidth: '10px',

        //   cell: (row, index: any) => {
        //     // eslint-disable-next-line no-mixed-operators
        //     return `${parseInt(state?.per_page_record) * (state?.page - 1) + (index + 1)}`
        //   }
        // },

        {
            name: <>{FM('variant-name')}</>,

            //sortable: row => row.full_name,
            cell: (row) => (
                <div className='d-flex align-items-center'>
                    <div className='user-info'>
                        <Show IF={Permissions?.productRead}>
                            <Link
                                state={{ ...row }}
                                to={getPath('product.details', { id: row?.id })}
                                className='d-block'
                                id='create-button'
                            >
                                <span className='d-block fw-bold text-wrap'>{truncateText(row?.name, 20)}</span>
                                {/* <span className='d-block mt-25 text-muted text-small-12'>
                {FM('sku')}: {row?.sku}
              </span> */}
                            </Link>
                        </Show>
                        <Hide IF={Permissions?.productRead}>
                            <span className='d-block fw-bold text-wrap'>{truncateText(row?.name, 20)}</span>
                        </Hide>
                    </div>
                </div>
            )
        },
        {
            name: <>{FM('quantity')}</>,

            cell: (row) => row?.quantity
        },
        {
            name: <>{FM('max-retail-price')}</>,

            cell: (row) => <>{CF({ money: row?.max_retail_price ?? 0, currency })}</>
        },
        {
            name: <>{FM('purchase-price')}</>,

            cell: (row) => <>{CF({ money: row?.purchase_price ?? 0, currency })}</>
        },
        {
            name: <>{FM('selling-price')}</>,

            cell: (row) => <>{CF({ money: row?.selling_price ?? 0, currency })}</>
        },
        // {
        //   name: <>{FM('payment-method')}</>,
        //   cell: (row) => {
        //     return (
        //       <>
        //         {row?.payment_method === 1 ? (
        //           <Badge color={'light-success'} pill>
        //             <>{FM('enfuse')}</>
        //           </Badge>
        //         ) : row?.payment_method === 2 ? (
        //           <Badge color={'light-danger'} pill>
        //             <>{FM('stripe')}</>
        //           </Badge>
        //         ) : row?.payment_method === 3 ? (
        //           <Badge color={'light-primary'} pill>
        //             <>{FM('tabby')}</>
        //           </Badge>
        //         ) : (
        //           <Badge color={'light-primary'} pill>
        //             <>{FM('crypto-wallet')}</>
        //           </Badge>
        //         )}
        //       </>
        //     )
        //   }
        // },
        {
            name: <>{FM('offers')}</>,

            cell: (row) => <>{row?.active_offers_count}</>
        },
        {
            name: <>{FM('product-type')}</>,

            cell: (row) => <>{`${row?.product_type}` === '1' ? FM('packed') : FM('open-product')}</>
        },

        {
            name: <>{FM('expiry')}</>,
            cell: (row) => {
                return (
                    <Badge color='light-primary' pill>
                        {row?.expiry ?? 'N/A'}
                    </Badge>
                )
            }
        },
        // {
        //   name: <>{FM('Status')}</>,
        //   minWidth: '150px',
        //   //   sortable: (row) => row.status,
        //   cell: (row) => {
        //     return (
        //       <>
        //         {row?.status === '1' ? (
        //           <Badge color={'success'} pill>
        //             <>{FM('active')}</>
        //           </Badge>
        //         ) : (
        //           <Badge color={'danger'} pill>
        //             <>{FM('inactive')}</>
        //           </Badge>
        //         )}
        //       </>
        //     )
        //   }
        // },
        {
            name: <>{FM('action')}</>,
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
                                    IF: Can(Permissions?.productEdit),
                                    icon: <Edit size={14} />,
                                    state: row,
                                    to: {
                                        pathname: getPath('product.edit', {
                                            id: row?.id
                                        })
                                    },
                                    name: FM('edit')
                                },
                                {

                                    icon: <File size={14} />,
                                    onClick: () => downloadProductBarcodes(row),
                                    name: FM('download-barcode-pdf')
                                },

                                {
                                    IF: userType === UserType.Store && Can(Permissions?.productDelete),
                                    noWrap: true,
                                    name: (
                                        <ConfirmAlert
                                            menuIcon={<Trash2 size={14} />}
                                            onDropdown
                                            eventId={`delete-item-${row?.id}`}
                                            item={row}
                                            title={row?.name}
                                            color='text-warning'
                                            text={FM('are-you-sure')}
                                            onClickYes={() => handleDelete(row?.id, null)}
                                            onSuccessEvent={(e: any) => {
                                                loadProducts()
                                            }}
                                            className=''
                                            id={`grid-delete-${row?.id}`}
                                        >
                                            {FM('move-to-trash')}
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
            IF: Permissions?.productDelete,
            noWrap: true,
            name: (
                <ConfirmAlert
                    menuIcon={<Trash2 size={14} />}
                    onDropdown
                    eventId={`delete-item-selected`}
                    text={FM('are-you-sure')}
                    title={FM('delete-selected-count', { count: selectedRows?.selectedCount })}
                    color='text-warning'
                    onClickYes={() => handleDelete(null, selectedRows?.ids)}
                    onSuccessEvent={(e: any) => {
                        reloadData()
                    }}
                    className=''
                    id={`grid-delete-selected`}
                >
                    {FM('move-to-trash')}
                </ConfirmAlert>
            )
        }
    ]

    return (
        <>
            <ProductFilter
                forVariant={true}
                show={state?.productFilter}
                filterData={state.filterData}
                setFilterData={(e: any) => setState({ filterData: e, page: 1 })}
                handleFilterModal={() => {
                    setState({
                        productFilter: false
                    })
                }}
            />
            <Hide IF={hideHeader}>
                <Header
                    goBackTo
                    onClickBack={() => nav(-1)}
                    icon={<BarChart2 size='25' />}
                    titleCol={'6'}
                    childCol={'6'}
                    title={FM('product-variant')}
                >
                    {/* <ButtonGroup className='me-1'>
            <ProductImportModal<ButtonProps>
              Tag={Button}
              className='btn btn-primary btn-sm'
              size='sm'
              color='primary'
              // title={FM('import')}
            >
              <Upload size='14' />
              <span className='align-middle ms-25'>{FM('import')}</span>
            </ProductImportModal>
          </ButtonGroup> */}
                    <ButtonGroup color='dark'>
                        <Show IF={Permissions?.productAdd}>
                            <TooltipLink
                                title={<>{FM('create-new')}</>}
                                to={getPath('product.create.variant', { productId })}
                                className='btn btn-primary btn-sm'
                            >
                                <Plus size='14' />
                            </TooltipLink>
                        </Show>
                        <BsTooltip<ButtonProps>
                            Tag={Button}
                            onClick={() =>
                                setState({
                                    productFilter: true
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
                            title={FM('reload')}
                        >
                            <RefreshCcw size='14' />
                        </LoadingButton>
                    </ButtonGroup>
                    {/* <ButtonGroup className='ms-1'>
            <TooltipLink
              title={FM('trashed-stores')}
              to={getPath('product.trashed.list')}
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
            </Hide>
            <Show IF={Permissions.productBrowse}>
                <CustomDataTable<ProductVariantsType>
                    key={state?.lastRefresh}
                    initialPerPage={15}
                    isLoading={!isSuccess}
                    options={options}
                    selectableRows
                    columns={columns}
                    paginatedData={data}
                    handlePaginationAndSearch={handlePageChange}
                />
            </Show>
        </>
    )
})

export default ProductVariants
