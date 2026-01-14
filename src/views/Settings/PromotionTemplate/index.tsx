/* eslint-disable no-mixed-operators */
import createDOMPurify from 'dompurify'
import { useContext, useEffect, useReducer } from 'react'
import {
  Activity,
  AlignJustify,
  Edit,
  MoreVertical,
  Plus,
  RefreshCcw,
  Rss,
  Send,
  Trash2
} from 'react-feather'
import { useLocation } from 'react-router-dom'
import { ButtonGroup, DropdownItem } from 'reactstrap'
import { ThemeColors } from '../../../utility/context/ThemeColors'

import { FM, isValid } from '../../../utility/helpers/common'
import { stateReducer } from '../../../utility/stateReducer'
import CustomDataTable, {
  TableDropDownOptions,
  TableFormData
} from '../../components/CustomDataTable/CustomDataTable'
import Header from '../../components/header'

import { QueryStatus } from '@reduxjs/toolkit/dist/query'
import { TableColumn } from 'react-data-table-component'
import {
  useDeletePromotionTemplateByIdMutation,
  useLoadPromotionTemplateMutation
} from '../../../redux/RTKQuery/PromotionTemplateRTK'
import { getPath } from '../../../router/RouteHelper'
import { IconSizes, sendType } from '../../../utility/Const'
import { Permissions } from '../../../utility/Permissions'
import Show from '../../../utility/Show'
import { emitAlertStatus, formatDate, getKeyByValue, truncateText } from '../../../utility/Utils'
import ConfirmAlert from '../../../utility/helpers/ConfirmAlert'
import LoadingButton from '../../components/buttons/LoadingButton'
import DropDownMenu from '../../components/dropdown'
import TooltipLink from '../../components/tooltip/TooltipLink'
import { PromotionParamsType } from '../PromotionTemplate/PromotionTemplateForm'
import PromotionDetailModal from './PromotionDetailModal'
import PromotionSendModal from './PromotionSendModal'

interface States {
  page?: any
  per_page_record?: any
  search?: any
  reload?: any
  showModal?: boolean
  rowData?: any
  isAddingNewData?: boolean
  lastRefresh?: any
}
function PromotionTemplate() {
  const DOMPurify = createDOMPurify(window)
  const reloadID = new Date().getTime()
  const location: any = useLocation()
  //const isAddingNewData = location?.state?.reload ?? false
  const { colors } = useContext(ThemeColors)
  // Local States
  const initState: States = {
    page: 1,
    showModal: false,
    rowData: {},
    per_page_record: 15,
    search: '',
    lastRefresh: new Date().getTime()
  }
  const reducers = stateReducer<States>
  const [state, setState] = useReducer(reducers, initState)
  // Load Store Data
  const [loadPromotion, { data, isLoading, isSuccess }] = useLoadPromotionTemplateMutation()
  const [deleteTemplate, resultDelete] = useDeletePromotionTemplateByIdMutation()
  useEffect(() => {
    setState({
      page: 1
    })
  }, [state.per_page_record])
  const handlePageChange = (e: TableFormData) => {
    setState({ ...e })
  }
  useEffect(() => {
    loadPromotion({
      jsonData: { name: isValid(state?.search) ? state.search : '' },
      page: state?.per_page_record !== 15 ? 1 : state?.page,
      per_page_record: state?.per_page_record
    })
  }, [isValid(state?.search), state?.page, state?.per_page_record, state.lastRefresh])

  const reloadData = () => {
    setState({
      lastRefresh: new Date().getTime(),
      page: 1
    })
  }

  const handleDelete = (id?: any, eventId?: any) => {
    if (isValid(id)) {
      deleteTemplate({
        id,
        eventId,
        originalArgs: resultDelete?.originalArgs
      })
    }
  }

  // delete item success
  useEffect(() => {
    if ((resultDelete.status = QueryStatus.fulfilled) && resultDelete?.isLoading === false) {
      if (resultDelete?.isSuccess) {
        emitAlertStatus('success', null, resultDelete?.originalArgs?.eventId)
      } else if (resultDelete?.error) {
        emitAlertStatus('failed', null, resultDelete?.originalArgs?.eventId)
      }
    }
  }, [resultDelete])

  const columns: TableColumn<PromotionParamsType>[] = [
    {
      name: '#',
      maxWidth: '50px',
      cell: (row, index: any) => {
        return parseInt(state?.per_page_record) * (state?.page - 1) + (index + 1)
      }
    },
    {
      name: FM('send-type'),

      cell: (row) => (
        <PromotionDetailModal edit={row}>
          <div className='d-flex align-items-center'>
            <div className='user-info'>
              <span className='d-block fw-bold text-primary text-capitalize'>
                {FM(getKeyByValue(sendType, row?.content_type))}
              </span>
            </div>
          </div>
        </PromotionDetailModal>
      )
    },
    {
      name: FM('content-header'),

      cell: (row) => (
        <div className='d-flex align-items-center'>
          <div className='user-info text-truncate'>
            <span className='d-block fw-bold text-truncate'>
              {truncateText(row?.content_header, 25)}
            </span>
          </div>
        </div>
      )
    },
    // {
    //   name: FM('content-body'),
    //   cell: (row) => {
    //     return (
    //       <Col xs='1' className='p-0'>
    //         <BsTooltip role='button' className='me-1' title={null}>
    //           <BsPopover
    //             trigger='hover'
    //             title={FM('content-body')}
    //             content={
    //               <>
    //                 <p
    //                   className='m-0 p-0 fw-bold text-secondary'
    //                   style={{ maxHeight: 200, overflowY: 'scroll' }}
    //                 >
    //                   {
    //                     <div
    //                       dangerouslySetInnerHTML={{
    //                         __html: DOMPurify.sanitize(row?.content_body)
    //                       }}
    //                     />
    //                   }
    //                 </p>
    //               </>
    //             }
    //           >
    //             <MessageSquare />
    //           </BsPopover>
    //         </BsTooltip>
    //       </Col>
    //     )
    //   }
    // },
    // {
    //   name: FM('content-body'),

    //   cell: (row) => (
    //     <PromotionDetailModal edit={row} isView={true}>
    //       <div className='d-flex align-items-center'>
    //         <div className='user-info text-truncate ms-2'>
    //           <span className='d-block fw-bold text-truncate'>
    //             <MessageSquare size={20} />
    //           </span>
    //         </div>
    //       </div>
    //     </PromotionDetailModal>
    //   )
    // },
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
                  IF: Permissions.contentEdit,
                  icon: <Edit size={14} />,
                  state: row,
                  to: {
                    pathname: getPath('admin.promotion.update', { id: row?.id })
                  },
                  name: FM('edit')
                },
                {
                  IF: Permissions.contentDelete,
                  noWrap: true,
                  name: (
                    <ConfirmAlert
                      menuIcon={<Trash2 size={14} />}
                      onDropdown
                      eventId={`delete-item-${row?.id}`}
                      item={row}
                      title={truncateText(`${row?.content_header}`, 50)}
                      color='text-warning'
                      onClickYes={() => handleDelete(row?.id, `delete-item-${row?.id}`)}
                      onSuccessEvent={(e: any) => {
                        reloadData()
                      }}
                      className=''
                      id={`grid-delete-${row?.id}`}
                    >
                      {FM('delete')}
                    </ConfirmAlert>
                  )
                },
                {
                  IF: Permissions.contentSend,
                  icon: <Send size={14} />,
                  onClick: () =>
                    setState({
                      showModal: true,
                      rowData: row
                    }),
                  name: FM('send')
                },
                {
                  IF: Permissions.contentLog,
                  icon: <AlignJustify size={14} />,
                  state: row,
                  to: {
                    pathname: getPath('admin.promotion.log', { id: row?.id })
                  },
                  name: FM('log')
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
      IF: Permissions.contentDelete,
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
      <PromotionSendModal
        response={() => {
          setState({
            lastRefresh: new Date().getTime(),
            page: 1
          })
        }}
        showModal={state.showModal}
        setShowModal={(e) =>
          setState({
            showModal: e
          })
        }
        edit={state.rowData}
        noView
      />
      <Header icon={<Rss size='25' />} title={FM('promotion-template')}>
        <ButtonGroup color='dark'>
          <Show IF={Permissions.contentAdd}>
            <TooltipLink
              title={<>{FM('create-new')}</>}
              to={getPath('admin.promotion.create')}
              className='btn btn-primary btn-sm'
            >
              <Plus size='14' />
            </TooltipLink>
          </Show>
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
        key={state.lastRefresh}
        initialPerPage={15}
        isLoading={isLoading}
        options={options}
        hideHeader
        columns={columns}
        paginatedData={data}
        handlePaginationAndSearch={handlePageChange}
      />
    </>
  )
}
export default PromotionTemplate
