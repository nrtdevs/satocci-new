import { useContext, useEffect, useReducer } from 'react'
import { TableColumn } from 'react-data-table-component'
import { Activity, BarChart2, RefreshCcw } from 'react-feather'
import { useLocation, useNavigate } from 'react-router-dom'
import { ButtonGroup, DropdownItem } from 'reactstrap'
import {
  NOtificationParams,
  useLoadNotificationMutation
} from '../../../redux/RTKQuery/NotificationRTK'
import { truncateText } from '../../../utility/Utils'
import { ThemeColors } from '../../../utility/context/ThemeColors'
import { FM, log } from '../../../utility/helpers/common'
import { stateReducer } from '../../../utility/stateReducer'
import CustomDataTable, {
  TableDropDownOptions,
  TableFormData
} from '../../components/CustomDataTable/CustomDataTable'
import LoadingButton from '../../components/buttons/LoadingButton'
import Header from '../../components/header'
import BsPopover from '../../components/popover'

interface States {
  page?: any
  per_page_record?: any
  search?: any
  reload?: any
  lastRefresh?: any
}

function Notification() {
  const { colors } = useContext(ThemeColors)
  const navigate = useNavigate()
  // Local States
  const initState: States = {
    lastRefresh: new Date().getTime(),
    page: 1,
    per_page_record: 15,
    search: undefined
  }
  const location: any = useLocation()
  log('df')
  const reducers = stateReducer<States>
  const [state, setState] = useReducer(reducers, initState)
  // Load Store Data

  const [loadNotification, { data, isLoading, isSuccess }] = useLoadNotificationMutation()

  useEffect(() => {
    loadNotification({
      jsonData: { search: state?.search, perPage: state.per_page_record, page: state.page },
      page: state.page,
      per_page_record: state.per_page_record
    })
  }, [state.per_page_record, state.page, state?.lastRefresh, state?.search])

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

  let columns: TableColumn<NOtificationParams>[] = []

  columns = [
    {
      name: '#',
      maxWidth: '100px',
      minWidth: '30px',
      cell: (row, index: any) => {
        // eslint-disable-next-line no-mixed-operators
        return `${parseInt(state?.per_page_record) * (state?.page - 1) + (index + 1)}`
      }
    },
    {
      name: <>{FM('title')}</>,
      minWidth: '100px',
      maxWidth: '250px',
      //sortable: row => row.full_name,
      cell: (row) => (
        <div className='d-flex align-items-center'>
          <div className='user-info text-truncate '>
            {/* <Link
                    state={{ row }}
                    to={getPath('admin.stores.details', { id: row?.i
                      
                      d })}
                    className='d-block'
                    id='create-button'
                  > */}
            <span className='d-block fw-bold text-truncate'>{row?.title}</span>
            {/* </Link> */}
          </div>
        </div>
      )
    },

    {
      name: FM('message'),

      cell: (row, index: any) => (
        <>
          {`${row?.message}`?.length > 30 ? (
            <BsPopover
              title={FM('message')}
              content={`${row?.message}`}
              // role='button'
              Tag={'p'}
              // className='mb-0 fw-bold text-secondary text-truncate mt-3px'
            >
              <span className='d-block fw-bold text-wrap'>
                {truncateText(`${row?.message}`, 70)}
              </span>
              {/* <span className='d-block fw-bold text-wrap'>{row.message}</span> */}
            </BsPopover>
          ) : (
            <span className='d-block fw-bold text-wrap '>{`${row?.message}`}</span>
          )}
        </>
      )
    },
    {
      name: FM('read-at'),
      minWidth: '10px',
      maxWidth: '250px',
      cell: (row, index: any) => (
        <div className='d-flex align-items-center'>
          <div className='user-info text-truncate'>
            <span className='d-block fw-bold text-truncate'>{row?.read_at}</span>
          </div>
        </div>
      )
    }
  ]

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
        title={FM('notification')}
      >
        <ButtonGroup color='dark'>
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
      </Header>
      <CustomDataTable<NOtificationParams>
        key={state?.lastRefresh}
        initialPerPage={15}
        options={options}
        // selectableRows
        hideHeader
        isLoading={isLoading}
        columns={columns}
        paginatedData={data}
        handlePaginationAndSearch={handlePageChange}
      />
    </>
  )
}

export default Notification
