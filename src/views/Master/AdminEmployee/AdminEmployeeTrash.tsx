import { useContext, useEffect, useReducer } from 'react'

import { ArrowLeft, BarChart2, MoreVertical, RefreshCcw, Sliders, Trash2 } from 'react-feather'
import { Badge, Button, ButtonGroup, ButtonProps } from 'reactstrap'
import { ThemeColors } from '../../../utility/context/ThemeColors'

import { Link, useLocation, useNavigate } from 'react-router-dom'

import { getPath } from '../../../router/RouteHelper'
import { IconSizes } from '../../../utility/Const'
import { FM, isValidArray } from '../../../utility/helpers/common'
import CustomDataTable, {
  TableDropDownOptions,
  TableFormData
} from '../../components/CustomDataTable/CustomDataTable'
import DropDownMenu from '../../components/dropdown'
import Header from '../../components/header'

import { stateReducer } from '../../../utility/stateReducer'
// import { StoreParamsType } from '../fragment/AddUpdateForm'
import { TableColumn } from 'react-data-table-component'
import BsTooltip from '../../components/tooltip'
import TooltipLink from '../../components/tooltip/TooltipLink'

import { QueryStatus } from '@reduxjs/toolkit/dist/query'
import {
  adminEmpReqParams,
  useDeleteEmployeeAdminByIdMutation,
  useLoadAdminEmployeeTrashMutation,
  useRestoreEmployeeMutation
} from '../../../redux/RTKQuery/AdminEmployeeRTK'
import ConfirmAlert from '../../../utility/helpers/ConfirmAlert'
import { emitAlertStatus, truncateText } from '../../../utility/Utils'
import LoadingButton from '../../components/buttons/LoadingButton'

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
function AdminEmployeeTrash() {
  const { colors } = useContext(ThemeColors)
  const navigate = useNavigate()
  // Local States
  const initState: States = {
    lastRefresh: new Date().getTime(),
    page: 1,
    per_page_record: 15,
    search: undefined,
    isRemoving: false,
    isReloading: false,
    isAddingNewData: false
  }
  const location: any = useLocation()
  const isAddingNewData = location?.state?.reload ?? false
  const storeEmployee: boolean = location?.state?.storeEmp ?? false
  const reducers = stateReducer<States>
  const [state, setState] = useReducer(reducers, initState)
  // Load Store Data
  const [restoreData, result] = useRestoreEmployeeMutation()
  const [deleteEmployee, resultDelete] = useDeleteEmployeeAdminByIdMutation()
  const [loadTrashEmp, { data, originalArgs, isLoading }] = useLoadAdminEmployeeTrashMutation()

  useEffect(() => {
    loadTrashEmp({
      jsonData: { name: state?.search },
      page: state?.page,
      per_page_record: state?.per_page_record
    })
  }, [state.lastRefresh, state.page, state.per_page_record])
  const handlePageChange = (e: TableFormData) => {
    setState({ ...e })
  }
  const handleRestore = (row: any) => {
    restoreData({ ...row, eventId: row?.id })
  }

  const reloadData = () => {
    setState({
      page: 1,
      lastRefresh: new Date().getTime()
    })
  }
  useEffect(() => {
    setState({
      page: 1
    })
  }, [state.per_page_record])
  const handleDelete = (ids?: any) => {
    // log('id', id)
    if (isValidArray(ids)) {
      deleteEmployee({
        ids,
        eventId: 'selected',
        jsonData: {
          ids,
          action: 'permanent_delete'
        }
      })
    }
  }
  useEffect(() => {
    if ((resultDelete.status = QueryStatus.fulfilled) && resultDelete?.isLoading === false) {
      //   log('resultDelete', resultDelete)
      if (resultDelete?.isSuccess) {
        setState({ isRemoving: true })
        // refetch()
        emitAlertStatus('success', null, `delete-item-${resultDelete?.originalArgs?.eventId}`)
      } else if (resultDelete?.error) {
        emitAlertStatus('failed', null, `delete-item-${resultDelete?.originalArgs?.eventId}`)
      }
    }
  }, [resultDelete])

  useEffect(() => {
    if ((result.status = QueryStatus.fulfilled) && result?.isLoading === false) {
      //   log('result', result)
      if (result?.isSuccess) {
        setState({ isRemoving: true })
        // refetch()
        emitAlertStatus('success', null, `restore-item-${result?.originalArgs?.id}`)
      } else if (result?.error) {
        emitAlertStatus('failed', null, `restore-item-${result?.originalArgs?.id}`)
      }
    }
  }, [result])

  // useEffect(() => {
  //   if (result.isSuccess) {
  //     navigate(getPath('admin.employee'), { state: { reload: true } })
  //   }
  // }, [result])

  const columns: TableColumn<adminEmpReqParams>[] = [
    // {
    //   name: '#',
    //   maxWidth: '50px',
    //   cell: (row, index: any) => {
    //     // eslint-disable-next-line no-mixed-operators
    //     return parseInt(state?.per_page_record) * (state?.page - 1) + (index + 1)
    //   }
    // },
    {
      name: <>{FM('employee-name')}</>,

      //sortable: row => row.full_name,
      cell: (row) => (
        <div className='d-flex align-items-center'>
          <div className='user-info text-truncate'>
            <Link
              state={{ row }}
              to={getPath('admin.stores.details', { id: row?.id })}
              className='d-block'
              id='create-button'
            >
              <span className='d-block fw-bold text-truncate'>{row?.name}</span>
            </Link>
          </div>
        </div>
      )
    },
    // {
    //   name: <>{FM('mobile-number')}</>,
    //   //sortable: true,

    //   //sortable: row => row.full_name,
    //   cell: (row) => (
    //     <div className='d-flex align-items-center'>
    //       <div className='user-info text-truncate ms-1'>
    //         <span className='d-block fw-bold text-truncate'>{row.mobile_number}</span>
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
      name: <>{FM('email')}</>,

      // sortable: row => row.subscription_type,
      cell: (row) => {
        return (
          <Badge color='light-primary' pill>
            {row?.email}
          </Badge>
        )
      }
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
      name: <>{FM('actions')}</>,
      allowOverflow: true,
      maxWidth: '10px',
      cell: (row) => {
        return (
          <div className='d-flex '>
            <DropDownMenu
              direction='up'
              component={<MoreVertical color={colors.primary.main} size={IconSizes.MenuVertical} />}
              options={[
                // {
                //   icon: <RefreshCcw size={14} />,
                //   state: row,
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
                      title={truncateText(`${row?.name}`, 50)}
                      color='text-warning'
                      onClickYes={() => handleRestore(row)}
                      onSuccessEvent={(e: any) => {
                        navigate(-1)
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
      noWrap: true,
      name: (
        <ConfirmAlert
          menuIcon={<Trash2 size={14} />}
          onDropdown
          eventId={`delete-item-selected`}
          // text={FM('are-you-sure')}
          title={FM('delete-selected-count', { count: selectedRows?.selectedCount })}
          color='text-warning'
          onClickYes={() => handleDelete(selectedRows?.ids)}
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
      <Header
        onClickBack={() => navigate(-1)}
        goBackTo
        icon={<BarChart2 size='25' />}
        title={FM('employee-trash')}
      >
        <ButtonGroup color='dark'>
          {/* <TooltipLink
            title={<>{FM('create-new')}</>}
            to={getPath('admin.employee.create')}
            className='btn btn-primary btn-sm'
          >
            <Plus size='14' />
          </TooltipLink> */}
          <BsTooltip<ButtonProps> Tag={Button} size='sm' color='dark' title={FM('filter')}>
            <Sliders size='14' />
          </BsTooltip>
          <LoadingButton
            loading={isLoading}
            onClick={reloadData}
            size='sm'
            color='dark'
            tooltip={FM('reload')}
          >
            <RefreshCcw size='14' />
          </LoadingButton>
        </ButtonGroup>
        <ButtonGroup className='ms-1'>
          <TooltipLink
            title={FM('trashed-stores')}
            state={{ reload: true }}
            to={storeEmployee === true ? getPath('store.employee') : getPath('admin.employee')}
            className='btn btn-dark btn-sm'
            color='secondary'
          >
            <>
              <ArrowLeft size='14' />
              <span className='align-middle ms-25'>{FM('employees')}</span>
            </>
          </TooltipLink>
        </ButtonGroup>
      </Header>
      <CustomDataTable<adminEmpReqParams>
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

export default AdminEmployeeTrash
