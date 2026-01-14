import { useContext, useEffect, useReducer } from 'react'

import { Activity, List, MoreVertical, Plus, RefreshCcw, Sliders, Trash2 } from 'react-feather'
import { Badge, Button, ButtonGroup, ButtonProps, DropdownItem } from 'reactstrap'
import { ThemeColors } from '../../../utility/context/ThemeColors'

import { IconSizes } from '../../../utility/Const'
import { FM, log } from '../../../utility/helpers/common'
import ConfirmAlert from '../../../utility/helpers/ConfirmAlert'
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

import { QueryStatus } from '@reduxjs/toolkit/dist/query'
import { useDispatch } from 'react-redux'
import {
  PermissionsReqParams,
  useDeletePermissionByIdMutation,
  useLoadPermissionMutation
} from '../../../redux/RTKQuery/PermissionRTK'
import useUserType from '../../../utility/hooks/useUserType'
import { emitAlertStatus } from '../../../utility/Utils'
import PermissionFormModal from './PermissionFormModal'

interface States {
  page?: any
  per_page_record?: any
  lastRefresh?: any
  search?: any
  reload?: any
  isRemoving?: boolean
  isReloading?: boolean
  isAddingNewData?: boolean
}
function AdminEmployee() {
  const dispatch = useDispatch()
  const { colors } = useContext(ThemeColors)
  const userType = useUserType()
  // Local States
  const initState: States = {
    page: 1,
    per_page_record: 15,
    lastRefresh: new Date().getTime(),
    search: undefined
  }

  const reducers = stateReducer<States>
  const [state, setState] = useReducer(reducers, initState)
  // Load Store Data
  const [deleteEmployee, resultDelete] = useDeletePermissionByIdMutation()

  const [loadPermision, { data, error, isLoading }] = useLoadPermissionMutation()

  useEffect(() => {
    loadPermision({
      jsonData: { name: state?.search },
      page: state?.page,
      per_page_record: state?.per_page_record
    })
  }, [state.search, state.page, state.per_page_record, state.lastRefresh])

  const handlePageChange = (e: TableFormData) => {
    setState({ ...e })
  }

  const reloadData = () => {
    setState({ page: 1, lastRefresh: new Date().getTime() })
  }
  const handleSingleDelete = (id: any) => {
    // log('id', id)
    deleteEmployee({ id, originalArgs: resultDelete.originalArgs })
  }
  useEffect(() => {
    if ((resultDelete.status = QueryStatus.fulfilled) && resultDelete?.isLoading === false) {
      if (resultDelete?.isSuccess) {
        emitAlertStatus('success', null, `delete-item-${resultDelete?.originalArgs?.id}`)
      } else if (resultDelete?.error) {
        emitAlertStatus('failed', null, `delete-item-${resultDelete?.originalArgs?.id}`)
      }
    }
  }, [resultDelete])

  const columns: TableColumn<PermissionsReqParams>[] = [
    {
      name: '#',
      maxWidth: '50px',
      cell: (row, index: any) => {
        // eslint-disable-next-line no-mixed-operators
        return parseInt(state?.per_page_record) * (state?.page - 1) + (index + 1)
      }
    },
    {
      name: <>{FM('name')}</>,
      minWidth: '250px',
      //sortable: row => row.full_name,
      cell: (row) => (
        <div className='d-flex align-items-center'>
          <div className='user-info text-truncate'>
            <span className='d-block fw-bold text-truncate'>{row?.name}</span>
            {/* </Link> */}
          </div>
        </div>
      )
    },
    {
      name: <>{FM('se-name')}</>,
      minWidth: '250px',
      cell: (row) => (
        <div className='d-flex align-items-center'>
          <div className='user-info text-truncate ms-1'>
            <span className='d-block fw-bold text-truncate'>{row.se_name}</span>
          </div>
        </div>
      )
    },

    {
      name: <>{FM('group-name')}</>,
      minWidth: '150px',
      cell: (row) => {
        return (
          <Badge color='light-primary' pill>
            {row?.group_name}
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
              direction='up'
              component={<MoreVertical color={colors.primary.main} size={IconSizes.MenuVertical} />}
              options={[
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
            log(selectedRows?.ids)
          }}
          tag={'span'}
          className='dropdown-item d-flex align-items-center'
        >
          <>
            <Activity size={16} className='me-1' />
            {FM('activate')} ({selectedRows?.selectedCount})
          </>
        </DropdownItem>
      )
    }
  ]

  return (
    <>
      <Header icon={<List size='25' />} title={FM('permissions')}>
        <ButtonGroup color='dark'>
          <PermissionFormModal<ButtonProps>
            response={(e: boolean) =>
              setState({
                isAddingNewData: e
              })
            }
            size='sm'
            color='primary'
            Component={Button}
          >
            <Plus size='14' />
          </PermissionFormModal>
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
      </Header>
      <CustomDataTable<PermissionsReqParams>
        key={state.lastRefresh}
        isLoading={isLoading}
        options={options}
        columns={columns}
        tableData={data?.payload}
        handlePaginationAndSearch={handlePageChange}
      />
    </>
  )
}

export default AdminEmployee
