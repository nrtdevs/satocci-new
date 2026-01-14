import { useContext, useReducer } from 'react'
import { TableColumn } from 'react-data-table-component'
import { Activity, BarChart2, MoreVertical, RefreshCcw, Sliders } from 'react-feather'
import { useLocation, useNavigate } from 'react-router-dom'
import { Badge, Button, ButtonGroup, ButtonProps, DropdownItem } from 'reactstrap'
import { IconSizes } from '../../../utility/Const'
import { decrypt, truncateText } from '../../../utility/Utils'
import { ThemeColors } from '../../../utility/context/ThemeColors'
import { FM } from '../../../utility/helpers/common'
import { stateReducer } from '../../../utility/stateReducer'
import CustomDataTable, {
  TableDropDownOptions,
  TableFormData
} from '../../components/CustomDataTable/CustomDataTable'
import DropDownMenu from '../../components/dropdown'
import Header from '../../components/header'
import Ratings from '../../components/ratings'
import BsTooltip from '../../components/tooltip'
import { fakeData } from './ratingOrderDb'

interface States {
  page?: any
  per_page_record?: any
  search?: any
  reload?: any
  isRemoving?: boolean
  isReloading?: boolean
  isAddingNewData?: boolean
}

export interface orderResParams {
  id?: any
  name?: any
  gatekeeper?: any
  rating?: any
  description?: any
  gaurd_description?: any
  status?: any
  customer_name?: any
  customer_email?: any
  transaction_id?: any
  employee_Id?: any
  payload?: any
  page?: any
  total?: any
  discount?: any
  last_page?: number
}

function Orders() {
  const data = fakeData
  const { colors } = useContext(ThemeColors)
  const navigate = useNavigate()
  // Local States
  const initState: States = {
    page: 1,
    per_page_record: 15,
    search: undefined,
    isRemoving: false,
    isReloading: false,
    isAddingNewData: false
  }
  const location: any = useLocation()

  const reducers = stateReducer<States>
  const [state, setState] = useReducer(reducers, initState)
  // Load Store Data

  const handlePageChange = (e: TableFormData) => {
    setState({ ...e })
  }

  const reloadData = () => {}

  let columns: TableColumn<orderResParams>[] = []
  if (location?.pathname === '/store/order/list') {
    columns = [
      {
        name: FM('transaction-id'),

        cell: (row, index: any) => (
          <div className='d-flex align-items-center'>
            <div className='user-info text-truncate'>
              <span className='d-block fw-bold text-truncate'>{row?.transaction_id}</span>
            </div>
          </div>
        )
      },
      {
        name: <>{FM('customer-name')}</>,

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
              <span className='d-block fw-bold text-truncate'>
                {decrypt(`${row?.customer_name}`)}
              </span>
              {/* </Link> */}
            </div>
          </div>
        )
      },
      {
        name: <>{FM('customer-email')}</>,
        //sortable: true,

        //sortable: row => row.full_name,
        cell: (row) => (
          <div className='d-flex align-items-center'>
            <div className='user-info text-truncate ms-1'>
              <span className='d-block fw-bold text-truncate'>{decrypt(row?.customer_email)}</span>
            </div>
          </div>
        )
      },

      // {
      //   name: <>{FM('gatekeeper-name')}</>,

      //   // sortable: row => row.subscription_type,
      //   cell: (row) => {
      //     return (
      //       <Badge color='light-primary' pill>
      //         {row?.gatekeeper}
      //       </Badge>
      //     )
      //   }
      // },

      {
        name: <>{FM('status')}</>,

        //   sortable: (row) => row.status,
        cell: (row) => {
          return (
            <>
              {row?.status === 1 ? (
                <Badge color={'light-success'} pill>
                  <>{FM('paid')}</>
                </Badge>
              ) : row?.status === 2 ? (
                <Badge color={'light-danger'} pill>
                  <>{FM('decline')}</>
                </Badge>
              ) : (
                <Badge color={'light-primary'} pill>
                  <>{FM('pending')}</>
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
                component={
                  <MoreVertical color={colors.primary.main} size={IconSizes.MenuVertical} />
                }
                options={[
                  {
                    icon: <RefreshCcw size={14} />,
                    state: row,
                    onClick: () => {},
                    name: FM('restore')
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
        name: FM('employee-id'),

        cell: (row, index: any) => (
          <div className='d-flex align-items-center'>
            <div className='user-info text-truncate'>
              <span className='d-block fw-bold text-truncate'>{row?.employee_Id}</span>
            </div>
          </div>
        )
      },
      {
        name: <>{FM('employee-name')}</>,

        //sortable: row => row.full_name,
        cell: (row) => (
          <div className='d-flex align-items-center'>
            <div className='user-info text-truncate'>
              <span className='d-block fw-bold text-truncate'>{decrypt(row?.name)}</span>
            </div>
          </div>
        )
      },
      {
        name: <>{FM('customer-name')}</>,
        //sortable: true,

        //sortable: row => row.full_name,
        cell: (row) => (
          <div className='d-flex align-items-center'>
            <div className='user-info text-truncate ms-1'>
              <span className='d-block fw-bold text-truncate'>{decrypt(row?.customer_name)}</span>
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
        name: <>{FM('rating')}</>,

        // sortable: row => row.subscription_type,
        cell: (row) => {
          return (
            <span>
              {row?.rating > 0 ? (
                <>
                  <Ratings rating={row?.rating} />
                </>
              ) : (
                'N/A'
              )}
            </span>
          )
        }
      },
      {
        name: <>{FM('description')}</>,

        //   sortable: (row) => row.status,
        cell: (row) => {
          return (
            <div className='d-flex align-items-center'>
              <div className='user-info text-truncate ms-1'>
                <span className='d-block fw-bold text-truncate'>
                  {truncateText(`${row?.description}`, 20)}
                </span>
                {/* <small className='status-text'>
                <>
                  {FM('phone')} : {row.contact_person_number}
                </>
              </small> */}
              </div>
            </div>
          )
        }
      }

      //   {
      //     name: <>{FM('actions')}</>,
      //     allowOverflow: true,
      //     maxWidth: '10px',
      //     cell: (row) => {
      //       return (
      //         <div className='d-flex '>
      //           <DropDownMenu
      //             direction='up'
      //             component={
      //               <MoreVertical color={colors.primary.main} size={IconSizes.MenuVertical} />
      //             }
      //             options={[
      //               {
      //                 icon: <RefreshCcw size={14} />,
      //                 state: row,
      //                 onClick: () => {},
      //                 name: FM('restore')
      //               }
      //             ]}
      //           />
      //         </div>
      //       )
      //     }
      //   }
    ]
  }

  const options: TableDropDownOptions = (selectedRows) => [
    {
      noWrap: true,
      name: (
        <DropdownItem
          onClick={() => {}}
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
      <Header
        onClickBack={() => navigate(-1)}
        goBackTo
        icon={<BarChart2 size='25' />}
        title={
          location?.pathname === '/store/gatekeeper/rating'
            ? FM('gatekeeper-rating')
            : location?.pathname === '/store/customers/rating'
            ? FM('customer-rating')
            : FM('orders')
        }
      >
        <ButtonGroup color='dark'>
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
      <CustomDataTable<orderResParams>
        initialPerPage={15}
        options={options}
        selectableRows
        columns={columns}
        paginatedData={data}
        handlePaginationAndSearch={handlePageChange}
      />
    </>
  )
}

export default Orders
