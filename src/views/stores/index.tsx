/* eslint-disable prettier/prettier */
import QrCode2Icon from '@mui/icons-material/QrCode2'
import { QueryStatus } from '@reduxjs/toolkit/dist/query'
import { useCallback, useContext, useEffect, useReducer } from 'react'
import { TableColumn } from 'react-data-table-component'
import {
  BarChart2,
  CheckCircle,
  Download,
  Edit,
  File,
  MoreVertical,
  Plus,
  RefreshCcw,
  Sliders,
  Trash,
  Trash2,
  Upload,
  X
} from 'react-feather'
import { Link, useLocation, useParams } from 'react-router-dom'
import { Badge, Button, ButtonGroup, ButtonProps } from 'reactstrap'
import {
  StoreResponseParams,
  useDeleteStoreByIdMutation,
  useDownloadZipFileMutation,
  useLoadParentStoresMutation,
  useLoadStoreSubStoreDetailsByParentIdMutation
} from '../../redux/RTKQuery/StoreRTK'
import {
  SubStoreRequestParams,
  useDeleteSubStoreByIdMutation
} from '../../redux/RTKQuery/SubStoreRTK'
import { getPath } from '../../router/RouteHelper'
import { IconSizes, UserType, subscriptionStoreType } from '../../utility/Const'
import Hide from '../../utility/Hide'
import { Permissions } from '../../utility/Permissions'
import Show, { Can } from '../../utility/Show'
import {
  ErrorToast,
  SuccessToast,
  decrypt,
  emitAlertStatus,
  formatDate,
  getKeyByValue,
  getUserData,
  truncateText
} from '../../utility/Utils'
import { ThemeColors } from '../../utility/context/ThemeColors'
import ConfirmAlert from '../../utility/helpers/ConfirmAlert'
import { FM, isValid, isValidUrl, log } from '../../utility/helpers/common'
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
import { usePrintProductBarcodeWithDetailsMutation } from '../../redux/RTKQuery/ProductRTK'
import StoreImportModal from './StoreImportModal'
interface States {
  lastRefresh?: any
  page?: any
  per_page_record?: any
  search?: any
  storeFilter?: boolean
  filterData?: StoreParamsType | any
  reload?: any
  isRemoving?: boolean
  isReloading?: boolean
  isAddingNewData?: boolean
  stores?: StoreResponseParams | any
}

function Stores() {
  const params = useParams()
  const user = getUserData()
  log('user', user)
  const parentId = params?.id
  const userType = useUserType()
  const location: any = useLocation()
  const isAddingNewData = location?.state?.reload ?? false
  const canStoreAdd = Can(Permissions.storeAdd)
  const canEdit = Can(Permissions.storeEdit)
  const canDelete = Can(Permissions.storeDelete)
  const canList = Can(Permissions.storeBrowse)
  const { colors } = useContext(ThemeColors)
  // Local States
  const initState: States = {
    lastRefresh: new Date().getTime(),
    page: 1,
    per_page_record: 15,
    stores: [],
    storeFilter: false,
    filterData: undefined,
    search: '',
    isRemoving: false,
    isReloading: false,
    isAddingNewData: false
  }
  const reducers = stateReducer<States>
  const [state, setState] = useReducer(reducers, initState)
  // load store
  const [loadParentStores, res] = useLoadParentStoresMutation()
  const [loadStoreByParent, resultData] = useLoadStoreSubStoreDetailsByParentIdMutation()
  const [downloadZip, result] = useDownloadZipFileMutation()
  const [downloadBarcodeDetails, resultDownloadBarcode] =
    usePrintProductBarcodeWithDetailsMutation()

  const isLoading =
    resultData?.status === QueryStatus.pending || res?.status === QueryStatus.pending

  useEffect(() => {
    setState({
      stores:
        userType === UserType.Admin || user?.store_id === UserType.Admin
          ? res?.data
          : resultData?.data
    })
  }, [res, resultData, userType])

  // if store
  const loadStores = () => {
    loadStoreByParent({
      id: user?.id,
      jsonData: {
        ...state.filterData,

        // city: state.filterData?.city,
        // email: state.filterData?.email,
        // language_id: state.filterData?.email,
        subscription_type: state.filterData?.subscription_type,
        search: isValid(state?.search) ? state?.search : state.filterData?.name
      },
      page: isValid(state?.search) ? 1 : state?.page,
      per_page_record: state?.per_page_record
    })
  }
  const downloadBarcode = (d: any) => {
    downloadZip({
      id: d?.store_setting?.store_id
    })
    // downloadBarcodeDetails({
    //     jsonData: {
    //         store_id: d?.store_setting?.store_id
    //     }
    // })
  }
  //Error Message
  useEffect(() => {
    if (result?.isError) {
      ErrorToast(FM('product-barcode-not-exist'))
    }
  }, [result])

  useEffect(() => {
    if (result?.isSuccess) {
      SuccessToast(result?.data?.message)
      if (isValidUrl(`${result?.data?.payload}`)) {
        window.open(`${result?.data?.payload}`, '_blank')
      } else {
        window.open(`${httpConfig.baseUrl2 + result?.data?.payload}`, '_blank')
      }
    }
  }, [result])
  // if SU
  const loadParentStore = () => {
    if (canList) {
      loadParentStores({
        userType,
        jsonData: {
          ...state.filterData,
          with_substore: 'yes',
          // city: state.filterData?.city,
          // email: state.filterData?.email,
          // email: state.filterData?.email,
          subscription_type: state.filterData?.subscription_type,
          search: isValid(state?.search) ? state?.search : state.filterData?.name
        },
        page: isValid(state?.search) ? 1 : state?.page,
        per_page_record: state?.per_page_record
      })
    }
  }

  // s

  const [deleteStore, resultDelete] =
    userType === 1 ? useDeleteStoreByIdMutation() : useDeleteSubStoreByIdMutation()

  useEffect(() => {
    if (userType === UserType.Admin || user?.store_id === UserType.Admin) {
      loadParentStore()
    } else {
      loadStores()
    }
  }, [
    userType,
    isValid(state?.search),
    state?.filterData,
    state?.lastRefresh,
    state?.page,
    state?.per_page_record
  ])
  useEffect(() => {
    setState({
      page: 1
    })
  }, [state.per_page_record])
  const handlePageChange = (e: TableFormData) => {
    // log('state change', e)
    setState({ ...e, search: e?.search, filterData: { ...state?.filterData } })
  }

  const reloadData = useCallback(() => {
    setState({
      page: 1,
      lastRefresh: new Date().getTime()
    })
  }, [userType, user?.id, resultDelete, isValid(state?.search)])

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

  useEffect(() => {
    if (isAddingNewData) {
      // refetch()
      setState({ isAddingNewData })
      window.history.replaceState({}, document.title)
    }
  }, [isAddingNewData])

  const donwloadQr = (d: any) => {
    if (isValidUrl(d?.store_setting?.store_qr_code_image)) {
      window.open(d?.store_setting?.store_qr_code_image, '_blank')
    } else {
      window.open(httpConfig.baseUrl2 + d?.store_setting?.store_qr_code_image, '_blank')
    }
  }
  const donwloadAllProductBarcode = (d: any) => {
    downloadBarcodeDetails({
      jsonData: {
        store_id: d?.store_setting?.store_id
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

  const isVisibleAdd = () => {
    let re = false
    if (canStoreAdd) {
      re = true
    }
    return re
  }

  let columns: TableColumn<StoreParamsType | SubStoreRequestParams>[]
  if (userType === UserType.Admin || userType === UserType.AdminEmployee) {
    columns = [
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
                to={getPath('admin.stores.parent', { id: row?.id })}
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
        name: FM('store-name'),
        // minWidth: '150px',
         minWidth: "200px",
        //sortable: row => row.full_name,
        cell: (row) => (
          <div className='d-flex align-items-center'>
            <div className='user-info text-truncate'>
              <Link
                state={{ ...row }}
                to={getPath('admin.stores.parent', { id: row?.id })}
                className='d-block'
                id='create-button'
              >
                <span className='d-block fw-bold text-wrap'>
                  {truncateText(row?.store_setting?.store_name, 500)}
                </span>
              </Link>
            </div>
          </div>
        )
      },
      //   {
      //     name: FM('stores'),
      //     minWidth: '50px',
      //     //sortable: row => row.full_name,
      //     cell: (row) => <></>
      //   },
      {
        name: FM('admin-email'),
        minWidth: "250px",
        cell: (row) => (
          <div
            className='d-flex align-items-center'
            style={{
              maxWidth: '250px', // 🧱 keep column width controlled
              overflow: 'hidden'
            }}
          >
            <div
              className='user-info'
              style={{
                flex: '1',
                overflow: 'hidden'
              }}
            >
              {/* EMAIL */}
              <span
                // className='d-block fw-bold text-truncate'
                style={{
                  // display: 'block',
                  // width: '100%',
                  // whiteSpace: 'nowrap',
                  // overflow: 'hidden',
                  // textOverflow: 'ellipsis'
                }}
              >
                {truncateText(decrypt(`${row?.email}`), 500) ?? 'N/A'}
              </span>

              {/* CREATED BY */}
              <small
                className='status-text d-block mt-1'
                style={{
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis'
                }}
              >
                <Badge color='light-danger' pill>
                  {FM('created-by')} : {decrypt(row?.created_by?.name)}
                </Badge>
              </small>
            </div>
          </div>
        )
      },

      {
        name: <>{FM('subscription-type')}</>,
        // minWidth: '150px',
        // sortable: row => row.subscription_type,
        cell: (row) => {
          return (
            <>
              {FM(
                getKeyByValue(subscriptionStoreType, `${row.store_subscription?.subscription_type}`)
              )}
            </>
          )
        }
      },

      {
        name: <>{FM('city')}</>,
        //sortable: true,
        // minWidth: '250px',
        //sortable: row => row.full_name,
        cell: (row) => <span className='text-wrap'>{isValid(row?.city) ? row?.city : 'N/A'}</span>
      },
      {
        name: FM('free-trial'),
        //sortable: true,
        // minWidth: '50px',
        //sortable: row => row.full_name,
        cell: (row) => (
          <div className='d-flex align-items-center'>
            <div className='user-info text-truncate'>
              <span className='d-block fw-bold text-truncate'>
                {
                  // formatDate(row?.store_subscription?.applied_from) < formatDate(new Date()) ? (
                  //     <Badge color={'light-danger'} pill>
                  //         {row?.store_subscription?.applied_from ?? 'N/A'}
                  //     </Badge>
                  // )

                  <Badge color={'light-success'} pill>
                    {row?.store_setting?.free_trial_days ?? 'N/A'}
                  </Badge>
                }
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
        name: FM('display_loose_product'),
        //sortable: true,
        // minWidth: '250px',
        //sortable: row => row.full_name,
        cell: (row) => (
          <>
            {row?.store_setting?.display_loose_product === 1 ? (
              <Badge color={'light-success'} pill>
                <>{'true'}</>
              </Badge>
            ) : (
              <Badge color={'light-danger'} pill>
                <>{'false'}</>
              </Badge>
            )}
          </>
        )
      },
      {
        name: <>{FM('status')}</>,
        // minWidth: '150px',
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
                component={
                  <MoreVertical color={colors.primary.main} size={IconSizes.MenuVertical} />
                }
                options={[
                  {
                    IF: canEdit,
                    icon: <Edit size={14} />,
                    state: row,
                    to: { pathname: getPath('admin.stores.update', { id: row?.id }) },
                    name: FM('edit')
                  },
                  {
                    icon: <File size={14} />,

                    onClick: () => donwloadAllProductBarcode(row),

                    name: FM('download-barcode-pdf')
                  },
                  {
                    icon: <Download size={14} />,
                    state: row,
                    onClick: () => donwloadQr(row),
                    // to: {pathname: getPath('admin.stores.update', {id: row?.id }) },
                    name: FM('download-qrcode')
                  },
                  {
                    icon: <QrCode2Icon />,
                    state: row,
                    onClick: () => downloadBarcode(row),
                    // to: {pathname: getPath('admin.stores.update', {id: row?.id }) },
                    name: FM('download-barcode-zip')
                  },
                  {
                    IF: `${row?.status}` === `${2}` && Permissions.storeDelete,
                    noWrap: true,
                    name: (
                      <ConfirmAlert
                        menuIcon={<Trash2 size={14} />}
                        onDropdown
                        eventId={`delete-item-${row?.id}`}
                        item={row}
                        title={truncateText(decrypt(`${row?.name}`), 50)}
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
                        {FM('move-to-trash')}
                      </ConfirmAlert>
                    )
                  },
                  {
                    IF: row?.status === 1 && Permissions.storeDelete,
                    noWrap: true,
                    name: (
                      <ConfirmAlert
                        menuIcon={<X size={14} />}
                        onDropdown
                        eventId={`item-inactive-${row?.id}`}
                        text={FM('are-you-sure')}
                        title={FM('inactive-selected-count', {
                          count: 1
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
                        {FM('deactivate')}
                      </ConfirmAlert>
                    )
                  },
                  {
                    IF: row?.status === 2 && Permissions.storeDelete,
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
                        {FM('activate')}
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
  } else {
    columns = [
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
        name: FM('store-name'),
        minWidth: '250px',
        //sortable: row => row.full_name,
        cell: (row, index) => (
          <div className='d-flex align-items-center'>
            <div className='user-info text-truncate'>
              <Link
                state={{ ...row }}
                to={getPath('admin.stores.details', { id: row?.id })}
                className='d-block'
                id='create-button'
              >
                <span className='d-block fw-bold text-wrap'>
                  {truncateText(row?.store_setting?.store_name, 25)}
                  {!isValid(row?.parent_id) ? (
                    <Badge className='ms-1' color={'light-danger'} pill>{`${FM('primary')}`}</Badge>
                  ) : null}
                </span>
              </Link>
            </div>
          </div>
        )
      },
      {
        name: FM('currency'),
        //sortable: true,
        minWidth: '50px',
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
      // {
      //   name: FM('country'),
      //   //sortable: true,
      //   // minWidth: '100px',
      //   //sortable: row => row.full_name,
      //   cell: (row) => (
      //     <div className='d-flex align-items-center'>
      //       <div className='user-info text-truncate'>
      //         <span className='d-block fw-bold text-wrap'>
      //           {/* <Badge color={'light-primary'} pill> */}
      //           {row?.country ?? 'N/A'}
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
        name: <>{FM('status')}</>,
        // minWidth: '150px',
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
        cell: (row, index) => {
          return (
            <div className='d-flex '>
              <Hide IF={isValid(user?.parent_id)}>
                <DropDownMenu
                  direction='down'
                  component={
                    <MoreVertical color={colors.primary.main} size={IconSizes.MenuVertical} />
                  }
                  options={[
                    {
                      IF: row?.parent_id === user?.store_id && Can(Permissions.storeEdit),
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
                    {
                      icon: <QrCode2Icon />,
                      state: row,
                      onClick: () => downloadBarcode(row),
                      // to: { pathname: getPath('admin.stores.update', { id: row?.id }) },
                      name: FM('download-barcode-zip')
                    },
                    {
                      icon: <File size={14} />,

                      onClick: () => donwloadAllProductBarcode(row),

                      name: FM('download-barcode-pdf')
                    },
                    {
                      IF: `${row?.status}` === '2' && Permissions.storeDelete,
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
                          onSuccessEvent={(e: any) => {
                            // refetch()
                            reloadData()
                          }}
                          className=''
                          id={`grid-delete-${row?.id}`}
                        >
                          {FM('delete')}
                        </ConfirmAlert>
                      )
                    },

                    {
                      IF: row?.status === 1 && isValid(row.parent_id) && Permissions.storeDelete,
                      noWrap: true,
                      name: (
                        <ConfirmAlert
                          menuIcon={<X size={14} />}
                          onDropdown
                          eventId={`item-inactive-${row?.id}`}
                          text={FM('are-you-sure')}
                          title={FM('inactive-selected-count', {
                            count: 1
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
                      IF: row?.status === 2 && Permissions.storeDelete,
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
              </Hide>
              <Show IF={isValid(user?.parent_id)}>
                <span className='fw-bolder'>{FM('no-action')}</span>
              </Show>
            </div>
          )
        }
      }
    ]
  }
  const options: TableDropDownOptions = (selectedRows) => [
    {
      IF: Permissions.storeDelete,
      noWrap: true,
      name: (
        <ConfirmAlert
          menuIcon={<CheckCircle size={14} />}
          onDropdown
          eventId={`item-active`}
          text={FM('are-you-sure')}
          title={FM('active-selected-count', { count: selectedRows?.selectedCount })}
          color='text-warning'
          onClickYes={() => handleActions(null, selectedRows?.ids, 'active', 'item-active')}
          onSuccessEvent={(e: any) => {
            reloadData()
          }}
          className=''
          id={`grid-active-selected`}
        >
          {FM('active')}
        </ConfirmAlert>
      )
    },
    // {
    //   noWrap: true,
    //   name: (
    //     <DropdownItem
    //       onClick={() => {
    //         handleDelete(null, selectedRows?.ids, 'inactive')
    //       }}
    //       tag={'span'}
    //       className='dropdown-item d-flex align-items-center'
    //     >
    //       <>
    //         <Activity size={16} className='me-1' />
    //         {FM('inactive')} ({selectedRows?.selectedCount})
    //       </>
    //     </DropdownItem>
    //   )
    // },
    {
      IF: Permissions.storeDelete,
      noWrap: true,
      name: (
        <ConfirmAlert
          menuIcon={<X size={14} />}
          onDropdown
          eventId={`item-inactive`}
          text={FM('are-you-sure')}
          title={FM('inactive-selected-count', { count: selectedRows?.selectedCount })}
          color='text-warning'
          onClickYes={() => handleActions(null, selectedRows?.ids, 'inactive', 'item-inactive')}
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
          // onClickYes={() => log('selectedROws', selectedRows)}
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
      <Header icon={<BarChart2 size='25' />} title={FM('stores')}>
        <Show IF={isValid(user?.user_type_id === 1)}>
          <ButtonGroup className='me-1'>
            <StoreImportModal<ButtonProps>
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
            </StoreImportModal>
          </ButtonGroup>
        </Show>
        <TooltipLink
          title={FM('trashed-store')}
          to={getPath('admin.stores.trashed')}
          className='btn btn-dark btn-sm me-1'
        >
          <Trash size='14' />
        </TooltipLink>
        <ButtonGroup color='dark'>
          <Show IF={isVisibleAdd()}>
            <TooltipLink
              title={<>{FM('create-new')}</>}
              to={getPath('admin.stores.create')}
              className='btn btn-primary btn-sm'
            >
              <Plus size='14' />
            </TooltipLink>
          </Show>

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
            // onClick={reloadData}
            onClick={() =>
              setState({
                lastRefresh: new Date().getTime(),
                page: 1,
                filterData: null
              })
            }
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

      {/* <Show IF={isValid(state.storeId) && Can(Permissions?.productAdd)}> */}

      {/* </Show> */}
      <CustomDataTable<StoreParamsType | SubStoreRequestParams>
        key={state.lastRefresh}
        initialPerPage={15}
        isLoading={isLoading}
        // isFetching={isLoading}
        options={options}
        selectableRows
        selectableRowDisabled={(row) => {
          if (row?.parent_id === null && userType === UserType?.Store) {
            return true
          } else {
            return false
          }
        }}
        columns={columns}
        paginatedData={state?.stores}
        handlePaginationAndSearch={handlePageChange}
      />
    </>
  )
}
export default Stores
