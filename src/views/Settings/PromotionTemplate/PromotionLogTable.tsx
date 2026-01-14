/* eslint-disable no-mixed-operators */
import classNames from 'classnames'
import createDOMPurify from 'dompurify'
import { useContext, useEffect, useReducer } from 'react'
import { TableColumn } from 'react-data-table-component'
import { AlignJustify, RefreshCcw } from 'react-feather'
import { useNavigate, useParams } from 'react-router-dom'
import { Badge, ButtonGroup } from 'reactstrap'
import { useLoadPromotionTemplateDetailsByIdMutation } from '../../../redux/RTKQuery/PromotionTemplateRTK'
import { sendType } from '../../../utility/Const'
import { decrypt, formatDate, getKeyByValue } from '../../../utility/Utils'
import { ThemeColors } from '../../../utility/context/ThemeColors'
import { FM, log } from '../../../utility/helpers/common'
import { stateReducer } from '../../../utility/stateReducer'
import CustomDataTable, { TableFormData } from '../../components/CustomDataTable/CustomDataTable'
import LoadingButton from '../../components/buttons/LoadingButton'
import Header from '../../components/header'
import { PromotionParamsType } from '../PromotionTemplate/PromotionTemplateForm'
import PromotionDetailModal from './PromotionDetailModal'
import PromotionSendModal from './PromotionSendModal'

interface States {
  page?: any
  per_page_record?: any
  showModal?: boolean
  rowData?: any
  search?: any
  reload?: any
  isAddingNewData?: boolean
  lastRefresh?: any
}
function PromotionLogTable() {
  const DOMPurify = createDOMPurify(window)
  const params = useParams()
  const nav = useNavigate()
  const { colors } = useContext(ThemeColors)
  // Local States
  const initState: States = {
    page: 1,
    per_page_record: 15,
    search: '',
    lastRefresh: new Date().getTime()
  }
  const reducers = stateReducer<States>
  const [state, setState] = useReducer(reducers, initState)
  // Load Store Data
  const [getContent, { data, isLoading, isSuccess }] = useLoadPromotionTemplateDetailsByIdMutation()

  const contentData: any = {
    ...data,
    payload: {
      ...data?.payload,
      data: data?.payload?.promotions
    }
  }
  useEffect(() => {
    setState({
      page: 1
    })
  }, [state.per_page_record])
  const handlePageChange = (e: TableFormData) => {
    setState({ ...e })
  }
  useEffect(() => {
    log(data?.payload?.promotions, 'cyc')
  })

  useEffect(() => {
    if (params?.id) {
      getContent({
        id: params?.id,
        per_page_record: state?.per_page_record,
        page: state?.page
      })
    }
  }, [params?.id, state.page, state.per_page_record, state.lastRefresh])

  const reloadData = () => {
    setState({
      lastRefresh: new Date().getTime()
    })
  }

  const columns: TableColumn<PromotionParamsType>[] = [
    {
      name: '#',
      maxWidth: '50px',
      cell: (row, index: any) => {
        return parseInt(state?.per_page_record) * (state?.page - 1) + (index + 1)
      }
    },
    {
      name: FM('customer-name'),

      cell: (row) => (
        <div className='d-flex align-items-center'>
          <div className='user-info'>
            <span className='d-block fw-bold text-capitalize'>{decrypt(row?.user?.name)}</span>
          </div>
        </div>
      )
    },
    {
      name: FM('customer-email'),

      cell: (row) => (
        <div className='d-flex align-items-center'>
          <div className='user-info'>
            <span className='d-block fw-bold text-capitalize'>{decrypt(row?.user?.email)}</span>
          </div>
        </div>
      )
    },
    {
      name: FM('send-type'),

      cell: (row) => (
        <PromotionDetailModal
          edit={row}
          allData={[data?.payload?.promotions?.find((a: any) => a.id === row?.id)]}
          isView={true}
        >
          <div className='d-flex align-items-center'>
            <div className='user-info'>
              <span className='d-block fw-bold text-primary text-capitalize'>
                {FM(getKeyByValue(sendType, Number(row?.type)))}
              </span>
            </div>
          </div>
        </PromotionDetailModal>
      )
    },
    {
      name: FM('created-at'),

      cell: (row) => (
        <div className='d-flex align-items-center'>
          <div className='user-info text-truncate'>
            <span className='d-block fw-bold text-truncate'>
              {formatDate(row?.created_at, 'YYYY-MM-DD')}
            </span>
          </div>
        </div>
      )
    },
    {
      name: FM('status'),

      cell: (row) => (
        <div className='d-flex align-items-center'>
          <div className='user-info text-truncate'>
            <span
              className={classNames('d-block fw-bold text-capitalize text-truncate', {
                'text-success': row?.status_code === 'success',
                'text-danger': row?.status_code === 'failed'
              })}
            >
              {row?.status_code === 'success' ? (
                <Badge color={'light-success'} pill>
                  <>{row?.status_code}</>
                </Badge>
              ) : (
                <Badge color={'light-danger'} pill>
                  <>{row?.status_code}</>
                </Badge>
              )}
            </span>
          </div>
        </div>
      )
    }
  ]

  return (
    <>
      <PromotionSendModal
        showModal={state.showModal}
        setShowModal={(e) =>
          setState({
            showModal: e,
            lastRefresh: new Date().getTime(),
            per_page_record: state.per_page_record,
            page: state.page
          })
        }
        edit={state.rowData}
        noView
      />
      <Header
        goBackTo
        onClickBack={() => nav(-1)}
        icon={<AlignJustify size='25' />}
        titleCol={'6'}
        childCol={'6'}
        title={FM('promotion-template-log')}
      >
        <ButtonGroup>
          <LoadingButton
            title={FM('reload')}
            loading={isLoading}
            size='sm'
            color='secondary'
            onClick={reloadData}
          >
            <RefreshCcw size='14' />
          </LoadingButton>
        </ButtonGroup>
      </Header>
      <CustomDataTable<PromotionParamsType>
        initialPerPage={10}
        isLoading={isLoading}
        hideHeader
        columns={columns}
        paginatedData={contentData}
        handlePaginationAndSearch={handlePageChange}
      />
    </>
  )
}
export default PromotionLogTable
