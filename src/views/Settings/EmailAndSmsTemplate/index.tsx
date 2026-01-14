/* eslint-disable no-mixed-operators */
import { useContext, useEffect, useReducer } from 'react'

import { Activity, Edit, MoreVertical, PieChart, Plus, RefreshCcw } from 'react-feather'
import { Badge, ButtonGroup, DropdownItem } from 'reactstrap'
import { ThemeColors } from '../../../utility/context/ThemeColors'

import { useLocation } from 'react-router-dom'

import { FM, isValid } from '../../../utility/helpers/common'
import { stateReducer } from '../../../utility/stateReducer'
import CustomDataTable, {
  TableDropDownOptions,
  TableFormData
} from '../../components/CustomDataTable/CustomDataTable'
import Header from '../../components/header'

import { TableColumn } from 'react-data-table-component'
import { useLoadEmailTemplateMutation } from '../../../redux/RTKQuery/EmailTemplateRTK'
import { getPath } from '../../../router/RouteHelper'
import { IconSizes, statusCode } from '../../../utility/Const'
import { Permissions } from '../../../utility/Permissions'
import Show from '../../../utility/Show'
import { truncateText } from '../../../utility/Utils'
import LoadingButton from '../../components/buttons/LoadingButton'
import DropDownMenu from '../../components/dropdown'
import TooltipLink from '../../components/tooltip/TooltipLink'
import { EmailSmsParamsType } from './EmailTemplateForm'
import NotificationDetailModal from './NotificationDetailModal'
interface States {
  page?: any
  lastRefresh?: any
  per_page_record?: any
  search?: any
  reload?: any
  filterData?: any
}
function EmailTemplate() {
  const reloadID = new Date().getTime()
  const location: any = useLocation()
  //const isAddingNewData = location?.state?.reload ?? false
  const { colors } = useContext(ThemeColors)
  // Local States
  const initState: States = {
    page: 1,
    lastRefresh: new Date().getTime(),
    per_page_record: 15,
    search: undefined

    // reload: reloadID
  }
  const reducers = stateReducer<States>
  const [state, setState] = useReducer(reducers, initState)
  // Load Store Data
  const [loadNotification, { data, isLoading }] = useLoadEmailTemplateMutation()

  useEffect(() => {
    loadNotification({
      jsonData: { notification_for: state.search ?? state.filterData?.notification_for },
      page: isValid(state.search) ? 1 : state?.page,
      per_page_record: state?.per_page_record
    })
  }, [
    state.page,
    state.per_page_record,
    isValid(state.filterData),
    state?.lastRefresh,
    isValid(state.search)
  ])

  useEffect(() => {
    setState({
      page: 1
    })
  }, [state.per_page_record])
  // useEffect(() => {
  //   if (isValid(state.search)) {
  //     setState({
  //       filterData: {
  //         notification_for: state.search
  //       },
  //       page: 1,
  //       per_page_record: state.per_page_record
  //     })
  //   }
  // }, [state.search])

  //log('fdtierkg', data)
  const handlePageChange = (e: TableFormData) => {
    //  log('state change', e)
    setState({ ...e })
  }

  const reloadData = () => {
    setState({
      filterData: null,
      page: 1,
      per_page_record: state.per_page_record,

      lastRefresh: new Date().getTime()
    })
  }

  // useEffect(() => {
  //   if (state.isAddingNewData) {
  //     refetch()
  //     window.history.replaceState({}, document.title)
  //   }
  // }, [state.isAddingNewData])

  const columns: TableColumn<EmailSmsParamsType>[] = [
    {
      name: '#',
      maxWidth: '50px',
      cell: (row, index: any) => {
        return parseInt(state?.per_page_record) * (state?.page - 1) + (index + 1)
      }
    },
    {
      name: FM('notification-for'),

      cell: (row) => (
        <NotificationDetailModal edit={row}>
          <div className='d-flex align-items-center'>
            <div className='user-info'>
              <span className='d-block fw-bold text-truncate text-primary'>
                {truncateText(row?.notification_for, 30)}
              </span>
            </div>
          </div>
        </NotificationDetailModal>
      )
    },
    {
      name: FM('mail-subject'),

      cell: (row) => (
        <div className='d-flex align-items-center'>
          <div className='user-info text-truncate ms-1'>
            <span className='d-block fw-bold text-truncate'>
              {truncateText(row?.mail_subject, 20)}
            </span>
          </div>
        </div>
      )
    },
    // {
    //   name: FM('mail-body'),

    //   cell: (row) => (
    //     <div className='d-flex align-items-center'>
    //       <div className='user-info text-truncate ms-1'>
    //         <span className='d-block fw-bold text-truncate'>
    //           {truncateText(row?.mail_body, 30)}
    //         </span>
    //       </div>
    //     </div>
    //   )
    // },
    {
      name: FM('notification-subject'),
      cell: (row) => (
        <span className='d-block fw-bold text-truncate'>
          {truncateText(row?.notification_subject, 20)}
        </span>
      )
    },
    // {
    //   name: FM('notification-body'),
    //   cell: (row) => (
    //     <span className='d-block fw-bold text-truncate'>
    //       {truncateText(row?.notification_body, 30)}
    //     </span>
    //   )
    // },
    // {
    //   name: FM('custom-attributes'),
    //   cell: (row) => (
    //     <span className='d-block fw-bold text-truncate'>
    //       {truncateText(row?.custom_attributes, 30)}
    //     </span>
    //   )
    // },
    {
      name: <>{FM('Status')}</>,
      cell: (row) => {
        return (
          <>
            {row?.status_code === statusCode.success ? (
              <Badge color={statusCode.success} pill>
                <>{FM('success')}</>
              </Badge>
            ) : row?.status_code === statusCode.danger ? (
              <Badge color={statusCode.danger} pill>
                <>{FM('danger')}</>
              </Badge>
            ) : row?.status_code === statusCode.info ? (
              <Badge color={statusCode.info} pill>
                <>{FM('info')}</>
              </Badge>
            ) : row?.status_code === statusCode.warning ? (
              <Badge color={statusCode.warning} pill>
                <>{FM('warning')}</>
              </Badge>
            ) : (
              <Badge color={'secondary'} pill>
                <>{FM('error')}</>
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
                {
                  IF: Permissions?.notificationTemplateEdit,
                  icon: <Edit size={14} />,
                  state: row,
                  to: {
                    pathname: getPath('admin.settings.notification.update', { id: row?.id })
                  },
                  name: FM('edit')
                }
                // {
                //   icon: <Trash2 size={14} />,
                //   name: (
                //     <ConfirmAlert
                //       item={row}
                //       title={row?.email}
                //       color='text-warning'
                //       onClickYes={() => emitAlertStatus('success')}
                //       //   onSuccessEvent={(e: any) => dispatch(storesDelete([row?.id]))}
                //       className=''
                //       id={`grid-delete-${row?.id}`}
                //     >
                //       {FM('move-to-trash')}
                //     </ConfirmAlert>
                //   )
                // }
              ]}
            />
          </div>
        )
      }
    }
  ]

  const options: TableDropDownOptions = (selectedRows) => [
    {
      IF: Permissions?.notificationTemplateDelete,
      noWrap: true,
      name: (
        <DropdownItem
          onClick={() => {
            //   log(selectedRows?.ids)
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
      <Header icon={<PieChart size='25' />} title={FM('notification-template')}>
        <ButtonGroup color='dark'>
          {/* <FeedbackModal<ButtonProps>
            response={(e) => setState({ isAddingNewData: e })}
            Component={Button}
            size='sm'
            color='primary'
          >
            <Plus size='14' />
          </FeedbackModal> */}
          <Show IF={Permissions?.notificationTemplateAdd}>
            <TooltipLink
              title={<>{FM('create-new')}</>}
              to={getPath('admin.settings.notification.create')}
              className='btn btn-primary btn-sm'
            >
              <Plus size='14' />
            </TooltipLink>
          </Show>
          {/* <BsTooltip<ButtonProps> Tag={Button} size='sm' color='dark' title={FM('filter')}>
            <Sliders size='14' />
          </BsTooltip> */}
          <LoadingButton
            loading={isLoading}
            size='sm'
            color='secondary'
            onClick={reloadData}
            tooltip={FM('reload')}
          >
            <RefreshCcw size='14' />
          </LoadingButton>
        </ButtonGroup>
        {/* <ButtonGroup className='ms-1'>
          <TooltipLink
            title={FM('trashed-stores')}
            to={getPath('admin.stores.trashed')}
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
      <CustomDataTable<EmailSmsParamsType>
        key={state?.lastRefresh}
        initialPerPage={15}
        isLoading={isLoading}
        options={options}
        // selectableRows
        columns={columns}
        paginatedData={data}
        handlePaginationAndSearch={handlePageChange}
      />
    </>
  )
}
export default EmailTemplate
