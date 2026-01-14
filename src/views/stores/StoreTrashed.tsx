import { useContext, useEffect, useReducer } from 'react'

import { ArrowLeft, MoreVertical, RefreshCcw, Trash2 } from 'react-feather'
import { Badge, ButtonGroup } from 'reactstrap'
import { ThemeColors } from '../../utility/context/ThemeColors'

import { Link, useNavigate, useParams } from 'react-router-dom'

import { QueryStatus } from '@reduxjs/toolkit/dist/query'
import { TableColumn } from 'react-data-table-component'
import {
  useDeleteStoreByIdMutation,
  useLoadTrashedStoreMutation,
  useRestoreStoreMutation
} from '../../redux/RTKQuery/StoreRTK'
import {
  SubStoreRequestParams,
  useDeleteSubStoreByIdMutation,
  useLoadSubStoreTrashedMutation,
  useRestoreSubStoreMutation
} from '../../redux/RTKQuery/SubStoreRTK'
import { getPath } from '../../router/RouteHelper'
import { IconSizes, UserType } from '../../utility/Const'
import { Permissions } from '../../utility/Permissions'
import { decrypt, emitAlertStatus, truncateText } from '../../utility/Utils'
import ConfirmAlert from '../../utility/helpers/ConfirmAlert'
import { FM, isValidArray } from '../../utility/helpers/common'
import useUserType from '../../utility/hooks/useUserType'
import { stateReducer } from '../../utility/stateReducer'
import CustomDataTable, {
  TableDropDownOptions,
  TableFormData
} from '../components/CustomDataTable/CustomDataTable'
import LoadingButton from '../components/buttons/LoadingButton'
import DropDownMenu from '../components/dropdown'
import Header from '../components/header'
import BsTooltip from '../components/tooltip'
import { StoreParamsType } from './fragment/AddUpdateForm'

// const BootstrapCheckbox = forwardRef((props, ref) => (
//     <div className='form-check'>
//         <Input type='checkbox' ref={ref} {...props} />
//     </div>
// ))

interface dataType {
  selectedRows?: any
}

interface States {
  lastRefresh?: any
  page?: any
  per_page_record?: any
  search?: any
  reload?: any
  isRemoving?: boolean
  isReloading?: boolean
  isAddingNewData?: boolean
}
function TrashedStores() {
  const { colors } = useContext(ThemeColors)
  const params = useParams()
  const navigate = useNavigate()
  const userType = useUserType()
  const initState: States = {
    lastRefresh: new Date().getTime(),
    page: 1,
    per_page_record: 15,
    search: undefined,
    isRemoving: false,
    isReloading: false,
    isAddingNewData: false
  }
  const reducers = stateReducer<States>
  const [state, setState] = useReducer(reducers, initState)

  ////trash store load
  const [loadTrashStore, { data, isSuccess, isError, isUninitialized, originalArgs, isLoading }] =
    userType === UserType.Admin ? useLoadTrashedStoreMutation() : useLoadSubStoreTrashedMutation()
  const [restoreData, result] =
    userType === UserType.Admin ? useRestoreStoreMutation() : useRestoreSubStoreMutation()

  const [deleteStore, resultDelete] =
    userType === UserType.Admin ? useDeleteStoreByIdMutation() : useDeleteSubStoreByIdMutation()

  ///call trash store
  useEffect(() => {
    loadTrashStore({
      userType,
      jsonData: { name: state?.search, store_id: params?.store_id },
      page: state?.page,
      per_page_record: state?.per_page_record
    })
  }, [state?.lastRefresh, state?.search, state?.page, state?.per_page_record, params])

  useEffect(() => {
    setState({
      page: 1
    })
  }, [state.per_page_record])
  const handlePageChange = (e: TableFormData) => {
    // log('state change', e)
    setState({ ...e })
  }
  const handleDelete = (ids?: any) => {
    if (isValidArray(ids)) {
      deleteStore({
        ids,
        eventId: 'selected',
        jsonData: {
          ids,
          action: 'permanent_delete'
        }
      })
    }
  }

  const handleActions = (ids?: any, action?: any, eventId?: any) => {
    // log('id', id)
    deleteStore({
      ids,
      eventId,
      originalArgs: resultDelete?.originalArgs,
      jsonData: {
        ids,
        action
      }
    })
  }

  const handleRestore = (row: any) => {
    restoreData({ ...row, eventId: row?.id })
  }

  // useEffect(() => {
  //   if (result.isSuccess) {
  //     navigate(getPath('admin.stores'), { state: { reload: true } })
  //   }
  // }, [result])

  const reloadData = () => {
    setState({
      page: 1,
      lastRefresh: new Date().getTime()
    })
  }

  ////For Delete
  // useEffect(() => {
  //   if ((resultDelete.status = QueryStatus.fulfilled) && resultDelete?.isLoading === false) {
  //     if (resultDelete?.isSuccess) {
  //       emitAlertStatus('success', null, `delete-item-${resultDelete?.originalArgs?.eventId}`)
  //     } else if (resultDelete?.error) {
  //       emitAlertStatus('failed', null, `delete-item-${resultDelete?.originalArgs?.eventId}`)
  //     }
  //   }
  // }, [resultDelete])

  useEffect(() => {
    if ((resultDelete.status = QueryStatus.fulfilled) && resultDelete?.isLoading === false) {
      if (resultDelete?.isSuccess) {
        emitAlertStatus('success', null, resultDelete?.originalArgs?.eventId)
      } else if (resultDelete?.error) {
        emitAlertStatus('failed', null, resultDelete?.originalArgs?.eventId)
      }
    }
  }, [resultDelete])
  ////For Restore
  useEffect(() => {
    if ((result.status = QueryStatus.fulfilled) && result?.isLoading === false) {
      if (result?.isSuccess) {
        emitAlertStatus('success', null, `restore-item-${result?.originalArgs?.eventId}`)
      } else if (result?.error) {
        emitAlertStatus('failed', null, `restore-item-${result?.originalArgs?.eventId}`)
      }
    }
  }, [result])

  const columns: TableColumn<StoreParamsType | SubStoreRequestParams>[] = [
    {
      name: '#',
      maxWidth: '50px',
      cell: (row, index: any) => {
        // eslint-disable-next-line no-mixed-operators
        return parseInt(state?.per_page_record) * (state?.page - 1) + (index + 1)
      }
    },
    {
      name: <>{FM('store-name')}</>,
      minWidth: '250px',
      //sortable: row => row.full_name,
      cell: (row) => (
        <div className='d-flex align-items-center'>
          <div className='user-info text-truncate'>
            <span className='d-block fw-bold text-truncate'>
              {truncateText(decrypt(`${row?.name}`), 50)}
            </span>
          </div>
        </div>
      )
    },
    // {
    //   name: <>{FM('contact-person')}</>,
    //   //sortable: true,
    //   minWidth: '250px',
    //   //sortable: row => row.full_name,
    //   cell: (row) => (
    //     <div className='d-flex align-items-center'>
    //       <div className='user-info text-truncate ms-1'>
    //         <span className='d-block fw-bold text-truncate'>
    //           {row?.contact_person_name ?? (
    //             <Badge color={'light-primary'} pill>
    //               {'N/A'}
    //             </Badge>
    //           )}
    //         </span>
    //         {/* <small className='status-text'>
    //           <>
    //             {FM('phone')} : {row.contact_person_number}
    //           </>
    //         </small> */}
    //       </div>
    //     </div>
    //   )
    // },
    {
      name: FM('email'),
      //sortable: true,
      minWidth: '250px',
      //sortable: row => row.full_name,
      cell: (row) => (
        <div className='d-flex align-items-center'>
          <div className='user-info text-truncate'>
            <span className='d-block fw-bold text-truncate'>
              <Badge color={'light-primary'} pill>
                {truncateText(decrypt(`${row?.email}`), 20) ?? 'N/A'}
              </Badge>
            </span>
            <small className='status-text'>
              <>
                {FM('phone')} : {decrypt(`${row?.mobile_number}`)}
              </>
            </small>
          </div>
        </div>
      )
    },

    {
      name: FM('country'),
      //sortable: true,

      //sortable: row => row.full_name,
      cell: (row) => (
        <div className='d-flex align-items-center'>
          <div className='user-info text-truncate'>
            <span className='d-block fw-bold text-truncate'>
              {/* <Badge color={'light-primary'} pill> */}
              {row?.country ?? 'N/A'}
              {/* </Badge> */}
            </span>
            <small className='status-text'>
              <>
                {FM('currency')} : {row?.currency}
              </>
            </small>
          </div>
        </div>
      )
    },
    {
      name: <>{FM('state-city')}</>,
      //sortable: true,

      //sortable: row => row.full_name,
      cell: (row) => (
        <div className='d-flex align-items-center'>
          <div className='user-info text-truncate ms-1'>
            <small className='status-text'>
              <>
                {FM('city')} : {row?.city ?? 'N/A'}
              </>
            </small>
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
            {row?.status === '1' ? (
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
                // {
                //   icon: <RefreshCcw size={14} />,
                //   // to: { pathname: getPath('followups.history', { ip: followup?.ip_id, parent: followup?.id ?? '' }) },
                //   onClick: () => handleRestore(row),
                //   name: FM('restore')
                // },
                {
                  noWrap: true,
                  name: (
                    <ConfirmAlert
                      menuIcon={<RefreshCcw size={14} />}
                      onDropdown
                      eventId={`restore-item-${row?.id}`}
                      item={row}
                      text={FM('restore')}
                      title={truncateText(decrypt(`${row?.name}`), 50)}
                      color='text-warning'
                      onClickYes={() => handleRestore(row)}
                      onSuccessEvent={(e: any) => {
                        navigate(getPath('admin.stores'), { state: { reload: true } })
                      }}
                      className=''
                      id={`grid-delete-${row?.id}`}
                    >
                      {FM('restore')}
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
          // onClickYes={() => log('selectedROws', selectedRows)}
          onClickYes={() => handleActions(selectedRows?.ids, 'permanent_delete', 'item-delete')}
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
      <Header onClickBack={() => navigate(-1)} goBackTo title={FM('trashed-stores')}>
        <ButtonGroup color='dark'>
          {/* <BsTooltip<ButtonProps> Tag={Button} size='sm' color='secondary' title={FM('filter')}>
            <Sliders size='14' />
          </BsTooltip> */}
          <LoadingButton loading={isLoading} onClick={reloadData} size='sm' color='primary'>
            <RefreshCcw size='14' />
          </LoadingButton>
        </ButtonGroup>
        <ButtonGroup className='ms-1'>
          <BsTooltip title={FM('stores')}>
            <Link
              state={{ reload: true }}
              to={getPath('admin.stores')}
              className='btn btn-dark btn-sm'
              color='secondary'
            >
              <ArrowLeft size='14' />
              <span className='align-middle ms-25'>
                <>{FM('stores')}</>
              </span>
            </Link>
          </BsTooltip>
        </ButtonGroup>
      </Header>
      <CustomDataTable
        key={state.lastRefresh}
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
}

export default TrashedStores
