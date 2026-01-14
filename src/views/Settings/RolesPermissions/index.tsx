import { useContext, useEffect, useReducer } from 'react'

import { Activity, Edit, MoreVertical, Plus, RefreshCcw, Trash2, XOctagon } from 'react-feather'
import { Badge, Button, ButtonGroup, ButtonProps, DropdownItem } from 'reactstrap'
import { ThemeColors } from '../../../utility/context/ThemeColors'

import { IconSizes } from '../../../utility/Const'
import { FM, isValid, isValidArray } from '../../../utility/helpers/common'

import { stateReducer } from '../../../utility/stateReducer'
import { emitAlertStatus, formatDate, getUserData, truncateText } from '../../../utility/Utils'
import CustomDataTable, {
  TableDropDownOptions,
  TableFormData
} from '../../components/CustomDataTable/CustomDataTable'
import DropDownMenu from '../../components/dropdown'
import Header from '../../components/header'

import { TableColumn } from 'react-data-table-component'

import { QueryStatus } from '@reduxjs/toolkit/dist/query'
import {
  RolePermissionReqParams,
  useDeletePerRoleByIdMutation,
  useLoadPerRoleMutation
} from '../../../redux/RTKQuery/RolesPermissionsRTK'
import { getPath } from '../../../router/RouteHelper'
import ConfirmAlert from '../../../utility/helpers/ConfirmAlert'
import { Permissions } from '../../../utility/Permissions'
import Show from '../../../utility/Show'
import BsTooltip from '../../components/tooltip'
import TooltipLink from '../../components/tooltip/TooltipLink'
interface States {
  page?: any
  per_page_record?: any
  search?: any
  lastRefresh?: any
  reload?: any
  isAddingNewData?: boolean
  isRemoving?: boolean
}
function Stores() {
  const { colors } = useContext(ThemeColors)

  const initState: States = {
    page: 1,
    per_page_record: 15,
    lastRefresh: new Date().getTime(),
    search: undefined
  }
  const reducers = stateReducer<States>
  const [state, setState] = useReducer(reducers, initState)
  const user = getUserData()

  const [deleteRole, resultDelete] = useDeletePerRoleByIdMutation()
  const [loadRolePer, { data, isLoading, originalArgs }] = useLoadPerRoleMutation()

  useEffect(() => {
    loadRolePer({
      jsonData: { name: state?.search, store_id: user?.store_id, user_type_id: user?.user_type_id },
      page: isValid(state.search) ? 1 : state?.page,
      per_page_record: state?.per_page_record
    })
  }, [state.page, state.per_page_record, state.lastRefresh])
  useEffect(() => {
    setState({
      page: 1
    })
  }, [state.per_page_record])
  const handlePageChange = (e: TableFormData) => {
    setState({ ...e })
  }

  const reloadData = () => {
    setState({
      page: 1,
      lastRefresh: new Date().getTime()
    })
  }

  const handleSingleDelete = (id: any) => {
    // log('id', id)
    deleteRole({ id, originalArgs: resultDelete.originalArgs })
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
  const columns: TableColumn<RolePermissionReqParams>[] = [
    {
      name: '#',
      maxWidth: '50px',
      cell: (row, index: any) => {
        // eslint-disable-next-line no-mixed-operators
        return parseInt(state?.per_page_record) * (state?.page - 1) + (index + 1)
      }
    },
    {
      name: FM('name'),
      minWidth: '250px',

      cell: (row) => (
        <div className='d-flex align-items-center'>
          <div className='user-info text-truncate'>
            <span className='d-block fw-bold text-truncate'>{truncateText(row?.se_name, 30)}</span>
            {/* </Link> */}
          </div>
        </div>
      )
    },

    {
      name: FM('permissions'),

      minWidth: '250px',

      cell: (row) => (
        <div className='d-flex align-items-center'>
          <div className='user-info text-truncate ms-1'>
            <span className='d-block fw-bold text-truncate'>
              <Badge color='light-success'>
                {isValidArray(row.permissions) ? row.permissions.length : '0'} {FM('permissions')}
              </Badge>
            </span>
          </div>
        </div>
      )
    },

    {
      name: <>{FM('created-date')}</>,
      minWidth: '150px',

      cell: (row) => {
        return <div className='d-flex align-items-center'>{formatDate(row?.created_at)}</div>
      }
    },
    {
      name: <>{FM('created-by')}</>,
      minWidth: '150px',

      cell: (row) => {
        return (
          <Badge color='light-primary' pill>
            {row?.user_type_id === 2 ? 'store' : 'admin'}
          </Badge>
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
              direction='start'
              component={<MoreVertical color={colors.primary.main} size={IconSizes.MenuVertical} />}
              options={[
                {
                  IF: Permissions?.rolesEdit,
                  icon: <Edit size={14} />,
                  state: row,
                  to: { pathname: getPath('settings.roles.update', { id: row?.id }) },
                  name: FM('edit')
                },
                {
                  IF: row?.id !== 1 && Permissions?.rolesDelete,
                  noWrap: true,
                  name: (
                    <ConfirmAlert
                      menuIcon={<Trash2 size={14} />}
                      onDropdown
                      eventId={`delete-item-${row?.id}`}
                      item={row}
                      title={row?.se_name}
                      color='text-warning'
                      onClickYes={() => handleSingleDelete(row?.id)}
                      onSuccessEvent={(e: any) => {
                        setState({
                          page: 1,
                          lastRefresh: new Date().getTime()
                        })
                      }}
                      className=''
                      id={`grid-delete-${row?.id}`}
                    >
                      {FM('delete')}
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
        <DropdownItem
          onClick={() => {
            // log(selectedRows?.ids)
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
      <Header icon={<XOctagon size='25' />} title={FM('role-and-permission')}>
        <ButtonGroup color='dark'>
          <Show IF={Permissions?.rolesAdd}>
            <TooltipLink
              title={<>{FM('create-new')}</>}
              to={getPath('settings.roles.create')}
              className='btn btn-primary btn-sm'
            >
              <Plus size='14' />
            </TooltipLink>
          </Show>
          <BsTooltip<ButtonProps>
            Tag={Button}
            size='sm'
            color='dark'
            onClick={reloadData}
            title={FM('reload')}
          >
            <RefreshCcw size='14' />
          </BsTooltip>
        </ButtonGroup>
      </Header>
      <CustomDataTable<RolePermissionReqParams>
        key={state.lastRefresh}
        initialPerPage={15}
        isLoading={isLoading}
        hideHeader
        columns={columns}
        paginatedData={data}
        handlePaginationAndSearch={handlePageChange}
      />
    </>
  )
}
export default Stores
