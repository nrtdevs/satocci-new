import { useContext, useEffect, useReducer } from 'react'

import { Activity, PieChart, RefreshCcw } from 'react-feather'
import { Button, ButtonGroup, ButtonProps, DropdownItem } from 'reactstrap'
import { ThemeColors } from '../../../utility/context/ThemeColors'

import { useLocation } from 'react-router-dom'

import { FM } from '../../../utility/helpers/common'
import { stateReducer } from '../../../utility/stateReducer'
import CustomDataTable, {
  TableDropDownOptions,
  TableFormData
} from '../../components/CustomDataTable/CustomDataTable'
import Header from '../../components/header'

import { TableColumn } from 'react-data-table-component'
import { feedbackRequestParams, useLoadFeedBackMutation } from '../../../redux/RTKQuery/FedbackRTK'
import { formatDate, truncateText } from '../../../utility/Utils'
import BsPopover from '../../components/popover'
import BsTooltip from '../../components/tooltip'
interface States {
  page?: any
  per_page_record?: any
  search?: any
  reload?: any
  isAddingNewData?: boolean
  lastRefresh?: any
}
function Feedback() {
  const reloadID = new Date().getTime()
  const location: any = useLocation()
  //const isAddingNewData = location?.state?.reload ?? false
  const { colors } = useContext(ThemeColors)
  // Local States
  const initState: States = {
    page: 1,
    per_page_record: 15,
    search: undefined,
    lastRefresh: new Date().getTime(),
    isAddingNewData: false
    // reload: reloadID
  }
  const reducers = stateReducer<States>
  const [state, setState] = useReducer(reducers, initState)
  // Load Store Data
  const [loadFeedback, { data, isLoading }] = useLoadFeedBackMutation()

  useEffect(() => {
    loadFeedback({
      jsonData: { email: state?.search },
      page: state?.page,
      per_page_record: state?.per_page_record
    })
  }, [state.page, state.per_page_record, state.search, state.lastRefresh])

  useEffect(() => {
    setState({
      page: 1
    })
  }, [state.per_page_record])
  const handlePageChange = (e: TableFormData) => {
    //  log('state change', e)
    setState({ ...e })
  }

  useEffect(() => {
    if (state.isAddingNewData) {
      //   refetch()
      window.history.replaceState({}, document.title)
    }
  }, [state.isAddingNewData])

  const columns: TableColumn<feedbackRequestParams>[] = [
    {
      name: '#',
      maxWidth: '50px',
      cell: (row, index: any) => {
        // eslint-disable-next-line no-mixed-operators
        return parseInt(state?.per_page_record) * (state?.page - 1) + (index + 1)
      }
    },

    {
      name: FM('email'),
      minWidth: '250px',
      //sortable: row => row.full_name,
      cell: (row) => (
        <div className='d-flex align-items-center'>
          <div className='user-info text-truncate'>
            <a href={`mailto:${row?.email}`}>
              <span className='d-block fw-bold text-wrap'>
                {/* <Badge color={'light-primary'} pill> */}
                {row?.email ?? 'N/A'}
                {/* </Badge> */}
              </span>
            </a>
            <small className='status-text'>
              <>
                {FM('created-at')} : {formatDate(row?.created_at, 'YYYY-MM-DD hh:mm') ?? 'N/A'}
              </>
            </small>
          </div>
        </div>
      )
    },
    {
      name: FM('message'),
      //sortable: true,
      minWidth: '250px',
      //sortable: row => row.full_name,
      cell: (row) => (
        <>
          {`${row?.message}`?.length > 30 ? (
            <BsPopover
              title={FM('message')}
              content={row?.message}
              // role='button'
              Tag={'p'}
              // className='mb-0 fw-bold text-secondary text-truncate mt-3px'
            >
              <span className='d-block fw-bold text-wrap'>{truncateText(row.message, 40)}</span>
              {/* <span className='d-block fw-bold text-wrap'>{row.message}</span> */}
            </BsPopover>
          ) : (
            <span className='d-block fw-bold text-wrap'>{truncateText(row.message, 40)}</span>
          )}
        </>
      )
    }
  ]

  const options: TableDropDownOptions = (selectedRows) => [
    {
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
      <Header icon={<PieChart size='25' />} title={FM('feedback')}>
        <ButtonGroup color='dark'>
          {/* <FeedbackModal<ButtonProps>
            response={(e) => setState({ isAddingNewData: e })}
            Component={Button}
            size='sm'
            color='primary'
          >
            <Plus size='14' />
          </FeedbackModal> */}
          {/* <BsTooltip<ButtonProps> Tag={Button} size='sm' color='dark' title={FM('filter')}>
            <Sliders size='14' />
          </BsTooltip> */}
          <BsTooltip<ButtonProps>
            Tag={Button}
            size='sm'
            color='dark'
            // onClick={reloadData}
            onClick={() =>
              setState({
                lastRefresh: new Date().getTime(),
                page: 1,
                search: ''
              })
            }
            title={FM('reload')}
          >
            <RefreshCcw size='14' />
          </BsTooltip>
        </ButtonGroup>
      </Header>
      <CustomDataTable<feedbackRequestParams>
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
export default Feedback
