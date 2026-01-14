import { useContext, useEffect, useReducer } from 'react'
import {
  Activity,
  BarChart2,
  CheckCircle,
  Circle,
  Edit,
  MoreVertical,
  Plus,
  RefreshCcw,
  Sliders,
  Trash,
  Trash2
} from 'react-feather'
import { useLocation } from 'react-router-dom'
import { Badge, Button, ButtonGroup, ButtonProps, DropdownItem } from 'reactstrap'
import { getPath } from '../../../router/RouteHelper'
import { IconSizes } from '../../../utility/Const'
import { ThemeColors } from '../../../utility/context/ThemeColors'
import { FM, log } from '../../../utility/helpers/common'
import ConfirmAlert from '../../../utility/helpers/ConfirmAlert'
import { stateReducer } from '../../../utility/stateReducer'
import CustomDataTable, {
  TableDropDownOptions,
  TableFormData
} from '../../components/CustomDataTable/CustomDataTable'
import DropDownMenu from '../../components/dropdown'
import Header from '../../components/header'
// import { StoreParamsType } from '../fragment/AddUpdateForm'
import { QueryStatus } from '@reduxjs/toolkit/dist/query'
import { TableColumn } from 'react-data-table-component'
import { useDispatch } from 'react-redux'
import {
  adminEmpReqParams,
  useDeleteEmployeeAdminByIdMutation,
  useLoadEmployeeAdminQuery
} from '../../../redux/RTKQuery/AdminEmployeeRTK'
import { employeeManagement } from '../../../redux/RTKQuery/EmployeeRTK'
import { emitAlertStatus } from '../../../utility/Utils'
import BsTooltip from '../../components/tooltip'
import TooltipLink from '../../components/tooltip/TooltipLink'

interface States {
  page?: any
  per_page_record?: any
  search?: any
  reload?: any
  isRemoving?: boolean
  isReloading?: boolean
  isAddingNewData?: boolean
}
function AdminEmployee() {
  const dispatch = useDispatch()
  const { colors } = useContext(ThemeColors)
  // Local States
  ///dasjifooooooortuyrtureuieuuiuuituiter
  const initState: States = {
    page: 1,
    per_page_record: 15,
    search: undefined,
    isRemoving: false,
    isReloading: false,
    isAddingNewData: false
  }
  const location: any = useLocation()
  const isAddingNewData = location?.state?.reload ?? false
  const reducers = stateReducer<States>
  const [state, setState] = useReducer(reducers, initState)
  // Load Store Data
  const [deleteEmployee, resultDelete] = useDeleteEmployeeAdminByIdMutation()
  const { data, originalArgs, isLoading, isFetching, refetch } = useLoadEmployeeAdminQuery({
    jsonData: { name: state?.search },
    page: state?.page,
    per_page_record: state?.per_page_record
  })

  const handlePageChange = (e: TableFormData) => {
    setState({ ...e })
  }

  const reloadData = () => {
    setState({ isAddingNewData: false })
    dispatch(
      employeeManagement.util.invalidateTags([
        { type: 'Employee', id: 'LIST' },
        { type: 'Employee', id: 'NEXT-LIST' }
      ])
    )
  }

  useEffect(() => {
    setState({
      page: 1
    })
  }, [state.per_page_record])
  const handleSingleDelete = (id: any) => {
    // log('id', id)
    deleteEmployee({ id, originalArgs })
  }
  useEffect(() => {
    if ((resultDelete.status = QueryStatus.fulfilled) && resultDelete?.isLoading === false) {
      //   log('resultDelete', resultDelete)
      if (resultDelete?.isSuccess) {
        setState({ isRemoving: true })
        // refetch()
        emitAlertStatus('success', null, `delete-item-${resultDelete?.originalArgs?.id}`)
      } else if (resultDelete?.error) {
        emitAlertStatus('failed', null, `delete-item-${resultDelete?.originalArgs?.id}`)
      }
    }
  }, [resultDelete])
  useEffect(() => {
    if (isAddingNewData) {
      refetch()
      window.history.replaceState({}, document.title)
    }
  }, [])

  const columns: TableColumn<adminEmpReqParams>[] = [
    {
      name: '#',
      maxWidth: '50px',
      cell: (row, index: any) => {
        // eslint-disable-next-line no-mixed-operators
        return parseInt(state?.per_page_record) * (state?.page - 1) + (index + 1)
      }
    },
    {
      name: <>{FM('employee-name')}</>,
      minWidth: '250px',
      //sortable: row => row.full_name,
      cell: (row) => (
        <div className='d-flex align-items-center'>
          <div className='user-info text-truncate'>
            {/* <Link
              state={{ row }}
              to={getPath('admin.stores.details', { id: row?.id })}
              className='d-block'
              id='create-button'
            > */}
            <span className='d-block fw-bold text-truncate'>{row?.name}</span>
            {/* </Link> */}
          </div>
        </div>
      )
    },
    {
      name: <>{FM('mobile-number')}</>,
      //sortable: true,
      minWidth: '250px',
      //sortable: row => row.full_name,
      cell: (row) => (
        <div className='d-flex align-items-center'>
          <div className='user-info text-truncate ms-1'>
            <span className='d-block fw-bold text-truncate'>{row.mobile_number}</span>
            {/* <small className='status-text'>
              <>
                {FM('phone')} : {row.contact_person_number}
              </>
            </small> */}
          </div>
        </div>
      )
    },

    {
      name: <>{FM('status')}</>,
      minWidth: '150px',
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
              direction='up'
              component={<MoreVertical color={colors.primary.main} size={IconSizes.MenuVertical} />}
              options={[
                {
                  icon: <Edit size={14} />,
                  state: row,
                  to: { pathname: getPath('admin.employee.update', { id: row?.id }) },
                  name: FM('edit')
                },
                {
                  noWrap: true,
                  name: (
                    <ConfirmAlert
                      menuIcon={<Trash2 size={14} />}
                      onDropdown
                      eventId={`delete-item-${row?.id}`}
                      item={row}
                      title={row?.name}
                      color='text-warning'
                      onClickYes={() => handleSingleDelete(row?.id)}
                      onSuccessEvent={(e: any) => {
                        refetch()
                      }}
                      className=''
                      id={`grid-delete-${row?.id}`}
                    >
                      {FM('move-to-trash')}
                    </ConfirmAlert>
                  )
                },

                {
                  icon: row?.status === '0' ? <CheckCircle size={14} /> : <Circle size={14} />,
                  // to: { pathname: getPath('followups.history', { ip: followup?.ip_id, parent: followup?.id ?? '' }) },
                  name: row?.status === '0' ? FM('active') : FM('inactive')
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
        <DropdownItem
          onClick={() => {
            log(selectedRows?.ids)
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
      <Header icon={<BarChart2 size='25' />} title={FM('admin-employee')}>
        <ButtonGroup color='dark'>
          <TooltipLink
            title={<>{FM('create-new')}</>}
            to={getPath('admin.employee.create')}
            className='btn btn-primary btn-sm'
          >
            <Plus size='14' />
          </TooltipLink>
          <BsTooltip<ButtonProps> Tag={Button} size='sm' color='secondary' title={FM('filter')}>
            <Sliders size='14' />
          </BsTooltip>
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
        <ButtonGroup className='ms-1'>
          <TooltipLink
            title={FM('trashed-stores')}
            state={{ reload: true, storeEmp: false }}
            to={getPath('admin.employee.trash')}
            className='btn btn-dark btn-sm'
            color='secondary'
          >
            <>
              <Trash size='14' />
              <span className='align-middle ms-25'>{FM('bin')}</span>
            </>
          </TooltipLink>
        </ButtonGroup>
      </Header>
      <CustomDataTable<adminEmpReqParams>
        initialPerPage={15}
        isLoading={isLoading}
        isFetching={isFetching && !isAddingNewData}
        isAddingNewData={isAddingNewData && isFetching}
        options={options}
        selectableRows
        columns={columns}
        paginatedData={data}
        handlePaginationAndSearch={handlePageChange}
      />
    </>
  )
}

export default AdminEmployee
