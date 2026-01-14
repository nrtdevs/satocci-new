/* eslint-disable prettier/prettier */
import {
  ForwardedRef,
  forwardRef,
  Fragment,
  useContext,
  useEffect,
  useImperativeHandle,
  useReducer
} from 'react'

import {
  BarChart2,
  Download,
  Edit,
  File,
  MoreVertical,
  Plus,
  PlusSquare,
  RefreshCcw,
  Sliders,
  Trash2,
  Upload
} from 'react-feather'
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom'
import { Button, ButtonGroup, ButtonProps, Col, Row } from 'reactstrap'
import { ThemeColors } from '../../utility/context/ThemeColors'

import { getPath } from '../../router/RouteHelper'
import { IconSizes, status, UserType } from '../../utility/Const'
import { FM, isValid, isValidArray, isValidUrl, log } from '../../utility/helpers/common'
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
import { useForm } from 'react-hook-form'
import {
  useDeleteProductByIdMutation,
  useExportProductsMutation,
  useLoadProductByMutationMutation,
  usePrintProductBarcodeWithDetailsMutation
} from '../../redux/RTKQuery/ProductRTK'
import { loadDropdown } from '../../utility/apis/dropdowns'
import Emitter from '../../utility/Emitter'
import Hide from '../../utility/Hide'
import useUserType from '../../utility/hooks/useUserType'
import ApiEndpoints from '../../utility/http/ApiEndpoints'
import { Permissions } from '../../utility/Permissions'
import Show, { Can } from '../../utility/Show'
import { emitAlertStatus, formatDate, getUserData, truncateText } from '../../utility/Utils'
import LoadingButton from '../components/buttons/LoadingButton'
import FormGroupCustom from '../components/formGroupCustom/FormGroupCustom'
import { useNoViewModal } from '../components/modal/HandleModal'
import BsPopover from '../components/popover'
import BarcodeImportModal from './fragment/BarcodeImportModal'
import ProductEditModal from './fragment/ProductEditModal'
import { ProductParamType } from './fragment/ProductForm'
import ProductImportModal from './fragment/ProductImportModal'
import ProductOfferAddModal from './fragment/ProductOfferAddModal'
import ProductFilter from './ProductFilter'
import Ratings from '../components/ratings'
import httpConfig from '../../utility/http/httpConfig'

interface States {
  lastRefresh?: any
  storeId?: any
  page?: any
  productFilter?: boolean
  per_page_record?: any
  search?: any
  name?: any
  reload?: any
  edit?: any
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

const Products = forwardRef(function (
  { hideHeader = false, subCatStoreID = null }: { hideHeader?: boolean; subCatStoreID?: any },
  ref: forwardRefProps
) {
  const { colors } = useContext(ThemeColors)
  const nav = useNavigate()
  // Local States
  const initState: States = {
    page: 1,
    per_page_record: 15,
    productFilter: false,
    edit: null,
    storeId: null,
    lastRefresh: new Date().getTime(),
    filterData: {
      name: '',
      category_id: null,
      subcategory_id: null
    },
    search: undefined,
    isRemoving: false,
    isReloading: false,
    isAddingNewData: false
  }
  const location: any = useLocation()
  const userType = useUserType()
  const params: any = useParams()
  const [showModal, handleModal] = useNoViewModal()
  const storeId = params?.id
  const user = getUserData()
  const isAddingNewData = location?.state?.reload ?? false
  const selected = location?.state
  const reducers = stateReducer<States>
  const [state, setState] = useReducer(reducers, initState)
  // Load Store Data
  const [deleteProduct, resultDelete] = useDeleteProductByIdMutation()
  const [loadProduct, { data, originalArgs, isLoading }] = useLoadProductByMutationMutation()
  const [downloadBarcodeDetails, resultDownloadBarcode] =
    usePrintProductBarcodeWithDetailsMutation()
  const [exportProduct, res] = useExportProductsMutation()
  const canProductList = Can(Permissions?.productBrowse)
  const form = useForm<any>()
  const { handleSubmit, control, reset, setValue, watch } = form

  const loadProducts = () => {
    if (canProductList) {
      loadProduct({
        jsonData: {
          ...state?.filterData,
          name: isValid(state?.search) ? state.search : state.filterData?.name,
          store_id: storeId ?? user?.store_id
        },
        page: state?.page,
        per_page_record: state?.per_page_record
      })
    }
  }

  useEffect(() => {
    loadProducts()
  }, [
    storeId,
    resultDelete,
    state?.name,
    state?.filterData,
    state?.page,
    state?.per_page_record,
    state?.lastRefresh,
    state?.search
  ])

  log(Permissions?.productRead, 'per')
  useEffect(() => {
    setState({
      page: 1
    })
  }, [state.per_page_record])
  const handlePageChange = (e: TableFormData) => {
    log(e)
    setState({ ...e })
  }

  const reloadData = () => {
    setState({ filterData: undefined, page: 1, lastRefresh: new Date().getTime() })
  }

  const handleDelete = (id?: any, ids?: any) => {
    // log('id', id)
    if (isValid(id)) {
      deleteProduct({ id, eventId: id, originalArgs })
    } else {
      deleteProduct({
        ids,
        eventId: 'single',
        jsonData: {
          ids,
          action: 'delete'
        }
      })
    }
  }

  const handleActions = (id?: any, ids?: any, action?: any, eventId?: any) => {
    // log('id', id)
    if (isValid(id)) {
      // delete single
      deleteProduct({
        eventId,
        id,
        originalArgs: resultDelete?.originalArgs
      })
    } else {
      deleteProduct({
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

  const handleDownloadSelectedBarcode = (ids: any, eventId?: any) => {
    downloadBarcodeDetails({
      eventId,
      jsonData: {
        // product_id: ids,
        product_ids: ids,
        store_id: state?.storeId
      }
    })
  }
  //opikoooopopoppoipoiopoppopopoopopop
  useImperativeHandle(ref, () => ({
    reloadData() {
      // alert('hi')
      //   loadProducts()
      //   reloadData()
    },
    filterData(e: any) {
      setState({ filterData: e, page: 1 })
    }
  }))

  const downloadProductBarcodes = (d: any) => {
    downloadBarcodeDetails({
      jsonData: {
        // ...d,
        // variant_id: d?.id,
        product_id: d?.id,
        store_id: d?.store_id
      }
    })
  }

  const downloadSelectedProductBarcodes = (d: any) => {
    downloadBarcodeDetails({
      jsonData: {
        product_ids: d,
        store_id: d?.store_id ?? watch('store_id')?.value
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
    Emitter.on('testingEmitter', (e: any) => {
      setState({ filterData: e })
    })
  }, [])

  ////Conditional Product Import And Add
  useEffect(() => {
    if (
      isValid(watch('store_id')?.value) &&
      (`${userType}` === `${UserType.Admin}` || user?.store_id === UserType.Admin)
    ) {
      setState({
        storeId: watch('store_id')?.value
      })
    } else if (`${userType}` === `${UserType.Store}`) {
      setState({
        storeId: user?.store_id
      })
    }
  }, [watch('store_id')?.value, userType])

  useEffect(() => {
    if (isValid(watch('store_id')) && selected?.value !== watch('store_id')?.value) {
      nav(getPath('product.store.list', { id: watch('store_id')?.value }), {
        state: watch('store_id')
      })
    }
  }, [watch('store_id'), selected])

  useEffect(() => {
    if (isValid(selected)) {
      setValue('store_id', selected)
    }
  }, [selected])

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
    if (isAddingNewData) {
      reloadData()
      window.history.replaceState({}, document.title)
    }
  }, [])

  useEffect(() => {
    if (res.isSuccess) {
      if (isValidUrl(`${res.data?.payload?.url}`)) {
        window.open(`${res.data?.payload}`, '_blank')
      } else {
        window.open(`${httpConfig.baseUrl2 + res.data?.payload?.url}`, '_blank')
      }
    }
  }, [res])

  const columns: TableColumn<ProductParamType>[] = [
    {
      name: '#',
      maxWidth: '50px',

      cell: (row, index: any) => {
        // eslint-disable-next-line no-mixed-operators
        return parseInt(state?.per_page_record) * (state?.page - 1) + (index + 1)
      }
    },
    {
      name: <>{FM('product-image')}</>,
      cell: (row) => (
        <div className='d-flex align-items-center'>
          <div className='user-info text-truncate'>
            <img
              src={
                row?.product_image.startsWith('https')
                  ? row?.product_image
                  : httpConfig.baseUrl2 + row?.product_image
              }
              className='rounded me-1'
              width='20'
              height='20'
            />
          </div>
        </div>
      )
    },
    // {
    //     name: <>{FM('product-name')}</>,
    //     //sortable: row => row.full_name,
    //     cell: (row) => (
    //         <div className='d-flex align-items-center'>
    //             <div className='user-info'>
    //                 {/* <Show IF={Permissions?.productRead}> */}
    //                 <Link
    //                     state={{ ...row }}
    //                     to={getPath('product.list.variants', { id: row?.id })}
    //                     className='d-block'
    //                     id='create-button'
    //                 >
    //                     <span className='d-block fw-bold text-wrap'>{truncateText(row?.name, 20)}</span>
    //                 </Link>
    //                 {/* </Show> */}
    //                 {/* <Hide IF={Permissions?.productRead}>
    //       <span className='d-block fw-bold text-wrap'>{truncateText(row?.name, 20)}</span>
    //     </Hide> */}
    //             </div>
    //         </div>
    //     )
    // },
    {
      name: <>{FM('product-name')}</>,

      cell: (row) => (
        <div className='d-flex align-items-center'>
          <div className='user-info'>
            <Link
              state={{ ...row }}
              to={getPath('product.list.variants', { id: row?.id })}
              className='d-block'
              id='create-button'
            >
              <span className='d-block fw-bold text-truncate' style={{ maxWidth: '180px' }}>
                {truncateText(row?.name, 20)}
              </span>
            </Link>
          </div>
        </div>
      ),
      minWidth: '200px' // 👈 important
    },

    // {
    //   name: <>{FM('categories')}</>,

    //   cell: (row) => (
    //     <>
    //       <Show IF={isValidArray(row?.selected_categories)}>
    //         {row?.selected_categories?.length > 1 ? (
    //           <>
    //             <BsPopover
    //               title={FM('categories')}
    //               content={
    //                 <>
    //                   <Row
    //                     className='mb-0'
    //                     style={
    //                       row?.selected_categories?.length > 3
    //                         ? { height: '200px', overflow: 'scroll' }
    //                         : {}
    //                     }
    //                   >
    //                     {row?.selected_categories?.map((item: any, index: number) => {
    //                       return (
    //                         <>
    //                           <Show IF={Permissions?.categoryBrowse}>
    //                             <Col md='3' sm='3' lg='3'>
    //                               <span className=''>{`#${index + 1} : `}</span>
    //                             </Col>

    //                             <Col md='9' sm='9' lg='9'>
    //                               <Link
    //                                 className=''
    //                                 state={{ ...item }}
    //                                 to={getPath('admin.category.view', {
    //                                   id: item?.id
    //                                 })}
    //                               >
    //                                 <span className=''>{`${item?.name}`}</span>
    //                               </Link>
    //                             </Col>
    //                             <hr />
    //                           </Show>
    //                         </>
    //                       )
    //                     })}
    //                   </Row>
    //                 </>
    //               }
    //               // role='button'
    //               Tag={'p'}
    //               // className='mb-0 fw-bold text-secondary text-truncate mt-3px'
    //             >
    //               <span className='d-block fw-bold text-wrap'>
    //                 <Link
    //                   className=''
    //                   state={{ ...row?.category }}
    //                   to={getPath('admin.category.view', {
    //                     id: row?.category?.id
    //                   })}
    //                 >
    //                   {truncateText(row?.category?.name, 40)}
    //                 </Link>
    //               </span>
    //             </BsPopover>
    //           </>
    //         ) : (
    //           <span className='d-block fw-bold text-wrap'>
    //             <Link
    //               className=''
    //               state={{ ...row?.category }}
    //               to={getPath('admin.category.view', {
    //                 id: row?.category?.id
    //               })}
    //             >
    //               {truncateText(row?.category?.name, 40)}
    //             </Link>
    //           </span>
    //         )}
    //       </Show>
    //     </>
    //   )
    // },
    {
      name: <>{FM('categories')}</>,
      cell: (row) => (
        <>
          <Show IF={isValidArray(row?.selected_categories)}>
            {row?.selected_categories?.length > 1 ? (
              <BsPopover
                title={FM('categories')}
                content={
                  <Row
                    className='mb-0'
                    style={
                      row?.selected_categories?.length > 3
                        ? { height: '200px', overflowY: 'auto' }
                        : {}
                    }
                  >
                    {row?.selected_categories?.map((item: any, index: any) => (
                      <Fragment key={item?.id || index}>
                        <Show IF={Permissions?.categoryBrowse}>
                          <Col xs='12' sm='4' md='3' lg='3'>
                            <span>{`#${index + 1}:`}</span>
                          </Col>
                          <Col xs='12' sm='8' md='9' lg='9'>
                            <Link
                              className='d-inline-block text-truncate fw-semibold'
                              state={{ ...item }}
                              to={getPath('admin.category.view', { id: item?.id })}
                              style={{
                                maxWidth: '15vw', // ✅ responsive width
                                whiteSpace: 'nowrap',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis'
                              }}
                            >
                              {item?.name}
                            </Link>
                          </Col>
                          <hr className='my-1' />
                        </Show>
                      </Fragment>
                    ))}
                  </Row>
                }
                Tag='p'
              >
                <span
                  className='d-block fw-bold text-truncate'
                  style={{
                    maxWidth: '18vw', // ✅ responsive width
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis'
                  }}
                >
                  <Link
                    className='text-decoration-none'
                    state={{ ...row?.category }}
                    to={getPath('admin.category.view', { id: row?.category?.id })}
                  >
                    {truncateText(row?.category?.name, 40)}
                  </Link>
                </span>
              </BsPopover>
            ) : (
              <span
                className='d-block fw-bold text-truncate'
                style={{
                  maxWidth: '18vw', // ✅ responsive width
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis'
                }}
              >
                <Link
                  className='text-decoration-none'
                  state={{ ...row?.category }}
                  to={getPath('admin.category.view', { id: row?.category?.id })}
                >
                  {truncateText(row?.category?.name, 40)}
                </Link>
              </span>
            )}
          </Show>
        </>
      )
    },

    {
      name: <>{FM('variants')}</>,

      cell: (row) => (
        <>
          <span>
            <span className='fw-bolder'> {row?.product_variants?.length}</span>
            <span className='ms-1'>{`${FM('variants')}`}</span>
          </span>
        </>
      )
    },

    {
      name: <>{FM('created-at')}</>,

      cell: (row) => <>{formatDate(row?.created_at)}</>
    },

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
                  IF: Permissions?.productEdit,
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
                  icon: <File size={14} />,
                  onClick: () => {
                    downloadProductBarcodes(row)
                  },
                  name: FM('download-barcode-pdf')
                },
                {
                  IF: Permissions?.productDelete,
                  noWrap: true,
                  name: (
                    <ConfirmAlert
                      menuIcon={<Trash2 size={14} />}
                      onDropdown
                      eventId={`delete-item-${row?.id}`}
                      item={row}
                      //   title={row?.name}
                      title={FM('delete-item-name', { name: row?.name })}
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
          eventId={`item-delete`}
          text={FM('are-you-sure')}
          title={FM('delete-selected-count', { count: selectedRows?.selectedCount })}
          color='text-warning'
          onClickYes={() =>
            handleActions(null, selectedRows?.ids, 'permanent_delete', 'item-delete')
          }
          onSuccessEvent={(e: any) => {
            reloadData()
          }}
          className=''
          id={`grid-delete-selected`}
        >
          {FM('move-to-trash')}
        </ConfirmAlert>
      )
    },
    {
      IF: userType !== UserType.Admin,
      icon: <File size={14} />,
      onClick: () => {
        downloadSelectedProductBarcodes(selectedRows?.ids)
      },
      name: FM('download-barcode-pdf')
    }
  ]

  return (
    <>
      <ProductEditModal
        edit={state?.edit}
        response={(e: boolean) => {
          reloadData()
        }}
        showModal={showModal}
        setShowModal={(e) => handleModal()}
        noView
      />
      <ProductFilter
        show={state?.productFilter}
        filterData={state.filterData}
        setFilterData={(e: any) => setState({ filterData: e, page: 1 })}
        handleFilterModal={(e: boolean) => {
          // setPatientFilter(false)
          setState({
            productFilter: e
          })
        }}
      />
      <Hide IF={hideHeader}>
        <Show IF={Permissions?.storeBrowse}>
          <Header
            icon={<BarChart2 size='25' />}
            titleCol={'5'}
            childCol={'7'}
            title={FM('products')}
          >
            <Show IF={userType === UserType.Admin || userType === UserType.AdminEmployee}>
              <FormGroupCustom
                noLabel
                noGroup
                label={FM('store')}
                placeholder={FM('select-store')}
                //   noLabel
                async
                searchItem={'search'}
                path={ApiEndpoints.load_stores}
                selectLabel='name'
                selectValue={'id'}
                modifyDropdownData={(d: any) => {
                  return {
                    ...d,
                    name: `${d?.name} / (${
                      d?.store_setting?.store_name ?? d?.store_setting?.store_name
                    })`
                  }
                }}
                jsonData={{
                  with_substore: 'yes',
                  status: '1'
                }}
                defaultOptions
                loadOptions={loadDropdown}
                name={`store_id`}
                type={'select'}
                className='me-1 flex-1'
                control={control}
                rules={{ required: true }}
                // prepend={<InputGroupText>{FM('get')}</InputGroupText>}
                // append={<InputGroupText>{FM('item')}</InputGroupText>}
              />
            </Show>
            <Show IF={isValid(state.storeId) && Can(Permissions?.productAdd)}>
              <ButtonGroup className='me-1'>
                <ProductOfferAddModal<ButtonProps>
                  resData={() => {
                    setState({
                      lastRefresh: new Date().getTime(),
                      page: 1
                    })
                  }}
                  Tag={Button}
                  className='btn btn-dark btn-sm d-flex align-items-center'
                  size='sm'
                  // color='success'
                  // title={FM('import')}
                >
                  <div>
                    <PlusSquare size='14' />
                    <span className='align-middle ms-25'>{FM('offers')}</span>
                  </div>
                </ProductOfferAddModal>

                <BarcodeImportModal<ButtonProps>
                  resData={() => {
                    setState({
                      lastRefresh: new Date().getTime(),
                      page: 1
                    })
                  }}
                  Tag={Button}
                  className='btn btn-secondary btn-sm d-flex align-items-center'
                  size='sm'
                  // color='secondary'
                  // title={FM('import')}
                >
                  <div>
                    <Upload size='14' />
                    <span className='align-middle ms-25'>{FM('barcode')}</span>
                  </div>
                </BarcodeImportModal>

                <ProductImportModal<ButtonProps>
                  Tag={Button}
                  responseData={() => {
                    setState({
                      lastRefresh: new Date().getTime(),
                      page: 1
                    })
                  }}
                  className='btn btn-primary btn-sm d-flex align-items-center'
                  size='sm'
                  color='primary'
                  // title={FM('import')}
                >
                  <div>
                    <Upload size='14' />
                    <span className='align-middle ms-25'>{FM('import')}</span>
                  </div>
                </ProductImportModal>
              </ButtonGroup>
            </Show>

            <ButtonGroup color='dark'>
              <Show IF={isValid(state.storeId) && Can(Permissions?.productAdd)}>
                <TooltipLink
                  title={<>{FM('create-new')}</>}
                  // state={state.storeId}
                  to={
                    `${userType}` === `${UserType.Admin}` || user?.store_id === UserType?.Admin
                      ? getPath('admin.product.create', { storeId: state.storeId })
                      : getPath('product.create', { parentId: '' })
                  }
                  className='btn btn-primary btn-sm d-flex align-items-center'
                >
                  <Plus size='14' />
                </TooltipLink>
              </Show>
              {/* <Show IF={isValid(state.storeId) && Can(Permissions?.productAdd)}> */}
              <BsTooltip<ButtonProps>
                Tag={Button}
                onClick={() =>
                  exportProduct({
                    jsonData: {
                      store_id: state.storeId ?? watch('store_id')?.value
                    }
                  })
                }
                size='sm'
                color='info'
                title={FM('export-products')}
              >
                <Download size='14' />
              </BsTooltip>
              {/* </Show> */}
              <Show IF={isValid(state.storeId) && Can(Permissions?.productAdd)}>
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
              </Show>

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
        </Show>
      </Hide>

      <CustomDataTable<ProductParamType>
        key={state?.lastRefresh}
        initialPerPage={15}
        isLoading={isLoading}
        options={options}
        selectableRows
        columns={columns}
        paginatedData={data}
        handlePaginationAndSearch={handlePageChange}
      />
    </>
  )
})
export default Products
