import { useContext, useReducer } from 'react'

import {
  Activity,
  Award,
  BarChart2,
  CheckCircle,
  Circle,
  Edit,
  Key,
  MoreVertical,
  Plus,
  RefreshCcw,
  Sliders,
  Trash,
  Trash2,
  TrendingUp
} from 'react-feather'
import { Badge, Button, ButtonGroup, DropdownItem, UncontrolledTooltip } from 'reactstrap'
import { ThemeColors } from '../../../utility/context/ThemeColors'

import { Link } from 'react-router-dom'

import { getPath } from '../../../router/RouteHelper'
import { IconSizes } from '../../../utility/Const'
import { FM, log } from '../../../utility/helpers/common'
import ConfirmAlert from '../../../utility/helpers/ConfirmAlert'
import { stateReducer } from '../../../utility/stateReducer'
import { emitAlertStatus } from '../../../utility/Utils'
import CustomDataTable from '../../components/CustomDataTable/CustomDataTable'
import DropDownMenu from '../../components/dropdown'
import Header from '../../components/header'
import { LabelFormData } from './LabelsForm'
interface States {
  page?: any
  per_page_record?: any
  search: any
}
function Stores() {
  const { colors } = useContext(ThemeColors)
  // Local States
  const initState: States = {
    page: 1,
    per_page_record: 15,
    search: undefined
  }
  const reducers = stateReducer<States>
  const [state, setState] = useReducer(reducers, initState)

  // Load Store Data
  //   const { data, isLoading } = useLoadStoresQuery({
  //     jsonData: { search: state?.search },
  //     page: state?.page,
  //     per_page_record: state?.per_page_record
  //   })

  const handlePageChange = (e: any) => {
    setState(e)
  }

  const columns = [
    {
      name: '#',
      maxWidth: '50px',
      cell: (row: LabelFormData, index: any) => {
        // eslint-disable-next-line no-mixed-operators
        return parseInt(state?.per_page_record) * (state?.page - 1) + (index + 1)
      }
    },
    // {
    //   name: <>{FM('store-name')}</>,
    //   minWidth: '250px',
    //   //sortable: row => row.full_name,
    //   cell: (row: LabelFormData) => (
    //     <div className='d-flex align-items-center'>
    //       <div className='user-info text-truncate'>
    //         <Link
    //           state={{ row }}
    //           to={getPath('admin.stores.details', { id: row?.id })}
    //           className='d-block'
    //           id='create-button'
    //         >
    //           <span className='d-block fw-bold text-truncate'>{row?.name}</span>
    //           <small className='status-text'>
    //             <>
    //               {FM('location')} : {row.city} {row?.state}
    //             </>
    //           </small>
    //         </Link>
    //       </div>
    //     </div>
    //   )
    // },
    {
      name: <>{FM('contact-person')}</>,
      //sortable: true,
      minWidth: '250px',
      //sortable: row => row.full_name,
      cell: (row: any) => (
        <div className='d-flex align-items-center'>
          <div className='user-info text-truncate ms-1'>
            <span className='d-block fw-bold text-truncate'>{row.contact_person_name}</span>
            <small className='status-text'>
              {FM('phone')} : {row.contact_person_number}
            </small>
          </div>
        </div>
      )
    },

    {
      name: <>{FM('subscription-type')}</>,
      minWidth: '150px',
      // sortable: row => row.subscription_type,
      cell: (row: any) => {
        return (
          <Badge color='light-primary' pill>
            {row?.subscription_type}
          </Badge>
        )
      }
    },

    {
      name: <>{FM('Status')}</>,
      minWidth: '150px',
      //   sortable: (row) => row.status,
      cell: (row: any) => {
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
      name: <>{FM('actions')}</>,
      allowOverflow: true,
      maxWidth: '10px',
      cell: (row: any) => {
        return (
          <div className='d-flex '>
            <DropDownMenu
              direction='up'
              component={<MoreVertical color={colors.primary.main} size={IconSizes.MenuVertical} />}
              options={[
                {
                  icon: <Edit size={14} />,
                  // to: { pathname: getPath('followups.history', { ip: followup?.ip_id, parent: followup?.id ?? '' }) },
                  name: FM('edit')
                },
                {
                  icon: <Trash2 size={14} />,
                  name: (
                    <ConfirmAlert
                      item={row}
                      title={row?.store_name}
                      color='text-warning'
                      onClickYes={() => emitAlertStatus('success')}
                      //   onSuccessEvent={(e: any) => dispatch(storesDelete([row?.id]))}
                      className=''
                      id={`grid-delete-${row?.id}`}
                    >
                      {FM('move-to-trash')}
                    </ConfirmAlert>
                  )
                },
                {
                  icon: <Award size={14} />,
                  // to: { pathname: getPath('followups.history', { ip: followup?.ip_id, parent: followup?.id ?? '' }) },
                  name: FM('change-subscription')
                },
                {
                  icon: <TrendingUp size={14} />,
                  // to: { pathname: getPath('followups.history', { ip: followup?.ip_id, parent: followup?.id ?? '' }) },
                  name: FM('view-reports')
                },
                {
                  icon: <Key size={14} />,
                  // to: { pathname: getPath('followups.history', { ip: followup?.ip_id, parent: followup?.id ?? '' }) },
                  name: FM('change-password')
                },
                {
                  icon: row?.status === 0 ? <CheckCircle size={14} /> : <Circle size={14} />,
                  // to: { pathname: getPath('followups.history', { ip: followup?.ip_id, parent: followup?.id ?? '' }) },
                  name: row?.status === 0 ? FM('active') : FM('inactive')
                }
              ]}
            />
          </div>
        )
      }
    }
  ]

  return (
    <>
      <Header icon={<BarChart2 size='25' />} title={FM('stores')}>
        <ButtonGroup className='me-1'>
          <UncontrolledTooltip target='trash-store'>
            <>{FM('trashed-store')}</>
          </UncontrolledTooltip>
          <Link
            to={getPath('admin.stores.trashed')}
            className='btn btn-danger btn-sm'
            color='secondary'
            id='trash-store'
          >
            <Trash size='14' />
          </Link>
        </ButtonGroup>
        <ButtonGroup color='dark'>
          <UncontrolledTooltip target='create-button'>
            {' '}
            <>{FM('create-new')}</>
          </UncontrolledTooltip>
          <Link
            to={getPath('admin.stores.create')}
            className='btn btn-primary btn-sm'
            id='create-button'
          >
            <Plus size='14' />
          </Link>
          <UncontrolledTooltip target='filter'>
            <>{FM('filter')}</>
          </UncontrolledTooltip>
          <Button size='sm' color='secondary' id='filter'>
            <Sliders size='14' />
          </Button>

          <UncontrolledTooltip target='reload'>
            <>{FM('refresh-data')}</>
          </UncontrolledTooltip>
          <Button size='sm' color='dark' id='reload'>
            <RefreshCcw size='14' />
          </Button>
        </ButtonGroup>
      </Header>
      <CustomDataTable<LabelFormData>
        options={(selectedRows) => [
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
        ]}
        selectableRows
        columns={columns}
        //  paginatedData={data}
        handlePaginationAndSearch={handlePageChange}
      />
    </>
  )
}

export default Stores
