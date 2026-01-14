import { Fragment, useContext, useEffect, useReducer } from 'react'
import { TableColumn } from 'react-data-table-component'
import { Send } from 'react-feather'
import { useForm } from 'react-hook-form'
import { useParams } from 'react-router-dom'
import { Col, DropdownItem, Form, Row } from 'reactstrap'
import { useProductWiseTransactionMutation } from '../../../../redux/RTKQuery/ProductRTK'
import { ThemeColors } from '../../../../utility/context/ThemeColors'
import { FM } from '../../../../utility/helpers/common'
import useUser from '../../../../utility/hooks/useUser'
import Show from '../../../../utility/Show'
import { stateReducer } from '../../../../utility/stateReducer'
import { CF, formatDate } from '../../../../utility/Utils'
import CustomDataTable, {
  TableDropDownOptions,
  TableFormData
} from '../../../components/CustomDataTable/CustomDataTable'
import FormGroupCustom from '../../../components/formGroupCustom/FormGroupCustom'
import BsPopover from '../../../components/popover'
import { ProductParamsNew, ProductVariantsType } from '../ProductForm'

type theProps = {
  details?: ProductParamsNew
  loading?: boolean
  filterTransaction?: boolean
  closeForm: () => void
}

export type TransactionProps = {
  id?: any
  transaction_id?: string
  created_at?: string
  updated_at?: string
  value?: string
  transaction_type?: string // 1: in / 2: out / 3: sell
  quantity?: string
  price?: number
  discounted_price?: any
  order_number?: any
  discount_value?: any
  subtotal?: any
  vat_percent?: any
  vat_amount?: any
  end_date?: any
  start_date?: any
}
interface States {
  page?: any
  per_page_record?: any
  search?: any
  reload?: any
  isRemoving?: boolean
  lastRefresh?: any
  isReloading?: boolean
  isAddingNewData?: boolean
  transactionFilter?: boolean
  filterData?: ProductParamsNew | ProductVariantsType
}
const TransactionsList = (props: theProps) => {
  const details = props?.details
  const { colors } = useContext(ThemeColors)
  const params = useParams()
  const user = useUser()
  const parentId = params?.id
  // Local States
  const initState: States = {
    page: 1,
    per_page_record: 15,
    transactionFilter: false,
    filterData: {},
    search: undefined,
    isRemoving: false,
    isReloading: false,
    isAddingNewData: false
  }
  const form = useForm<TransactionProps>()
  const { handleSubmit, control, reset, setValue, watch, clearErrors } = form
  const reducers = stateReducer<States>
  const [state, setState] = useReducer(reducers, initState)
  const [loadTransactionRTK, { isLoading, data }] = useProductWiseTransactionMutation()
  //   const [loadTransactionRTK, { isLoading, data }] = useTransactionWiseReportMutation()

  useEffect(() => {
    setState({
      page: 1
    })
  }, [state.per_page_record])
  const handlePageChange = (e: TableFormData) => {
    setState({
      page: e?.page,
      per_page_record: e?.per_page_record
    })
  }

  useEffect(() => {
    loadTransactionRTK({
      jsonData: {
        // search: state?.search,
        variant_id: parentId,
        start_date: watch('start_date'),
        end_date: watch('end_date')
      },
      page: props?.loading === true ? 1 : state?.page,
      per_page_record: state?.per_page_record
    })
  }, [
    state?.page,
    state?.per_page_record,
    watch('start_date'),
    watch('end_date'),
    props.loading,
    parentId
  ])

  const onSubmit = (d: any) => {
    setState({
      filterData: {
        ...d
      }
    })
    // setTimeout(() => {
    //   setOpen(show)
    //   reset()
    // }, 1000)
  }
  useEffect(() => {
    if (props?.filterTransaction === false) {
      //   props?.closeForm()
      reset()
      //   setState({ page: 1, lastRefresh: new Date().getTime() })
    }
  }, [props?.filterTransaction])

  const options: TableDropDownOptions = (selectedRows) => [
    {
      noWrap: true,
      name: (
        <DropdownItem
          onClick={() => {
            // handleSingleDelete(selectedRows?.ids)
          }}
          tag={'span'}
          className='dropdown-item d-flex align-items-center'
        >
          <>
            <Send size={16} className='me-1' />
            {FM('send')} ({selectedRows?.selectedCount})
          </>
        </DropdownItem>
      )
    }
  ]
  const columns: TableColumn<TransactionProps>[] = [
    {
      name: '#',
      maxWidth: '10px',
      cell: (row, index: any) => {
        // eslint-disable-next-line no-mixed-operators
        return parseInt(state?.per_page_record) * (state?.page - 1) + (index + 1)
      }
    },
    // {
    //   name: FM('transaction-type'),
    //   minWidth: '200px',
    //   cell: (row, index: any) => {
    //     if (index === 2) {
    //       return <>{FM('stock-in')}</>
    //     } else if (index === 7) {
    //       return <>{FM('stock-out')}</>
    //     } else {
    //       return <>{FM('sell')}</>
    //     }
    //   }
    // },
    {
      name: FM('order-number'),

      cell: (row) => (
        <div className='d-flex align-items-center'>
          <div className='user-info text-truncate'>
            <span className='d-block fw-bold text-truncate'>{row?.order_number ?? 'N/A'}</span>
          </div>
        </div>
      )
    },
    {
      name: FM('quantity'),

      cell: (row) => (
        <div className='d-flex align-items-center'>
          <div className='user-info text-truncate'>
            <span className='d-block fw-bold text-truncate'>{row?.quantity ?? 'N/A'}</span>
          </div>
        </div>
      )
    },
    {
      name: FM('price'),

      cell: (row) => (
        <>
          <BsPopover
            title={FM('price')}
            content={
              <>
                <Row>
                  <Col md='6'>
                    <ul className='list-unstyled'>
                      <li className='mb-75'>
                        <span className='fw-bolder text-dark me-25'>
                          <>{FM('subtotal')}:</>
                          {/* </span>
                        <span className='d-block'> */}
                          <span className='ms-1 text-primary'>
                            {CF({
                              money: Number(row?.subtotal),
                              currency: user?.store_setting?.currency
                            }) ?? 'N/A'}
                          </span>
                        </span>
                      </li>
                    </ul>
                  </Col>

                  <Col md='6'>
                    <ul className='list-unstyled'>
                      <li className='mb-75'>
                        <span className='fw-bolder text-dark me-25 '>
                          <>{FM('vat-amount')}:</>
                          {/* </span>
                        <span className='d-block'> */}
                          <span className='ms-1 text-primary'>
                            {CF({
                              money: Number(row?.vat_amount),
                              currency: user?.store_setting?.currency
                            }) ?? 'N/A'}
                          </span>
                        </span>
                      </li>
                    </ul>
                  </Col>
                  <Col md='6'>
                    <ul className='list-unstyled'>
                      <li className='mb-75'>
                        <span className='fw-bolder text-dark me-25'>
                          <>{FM('vat-percentage')}: </>
                          {/* </span>
                        <span className='d-block'> */}

                          <span className='ms-1 text-primary'>{row?.vat_percent ?? 'N/A'}</span>
                        </span>
                      </li>
                    </ul>
                  </Col>
                  <Col md='6'>
                    <ul className='list-unstyled'>
                      <li className='mb-75'>
                        <span className='fw-bolder text-dark me-25'>
                          <>{FM('price')}: </>
                          {/* </span>
                        <span className='d-block'> */}

                          <span className='ms-1 text-primary'>
                            {CF({
                              money: Number(row?.price),
                              currency: user?.store_setting?.currency
                            }) ?? 'N/A'}
                          </span>
                        </span>
                      </li>
                    </ul>
                  </Col>
                </Row>

                {/* <ul className='list-unstyled'>
                  <li className='mb-75'>
                    <span className='fw-bolder text-dark me-25'>
                      <>{FM('subtotal')}:</>
                    </span>
                    <span className='d-block'>
                      <>{row?.subtotal ?? 'N/A'}</>
                    </span>
                  </li>
                  <li className='mb-75'>
                    <span className='fw-bolder text-dark me-25'>
                      <>{FM('vat-amount')}:</>
                    </span>
                    <span className='d-block'>
                      <>{row?.vat_amount ?? 'N/A'}</>
                    </span>
                  </li>
                  <li className='mb-75'>
                    <span className='fw-bolder text-dark me-25'>
                      <>{FM('vat-percentage')}:</>
                    </span>
                    <span className='d-block'>
                      <>{row?.vat_percent ?? 'N/A'}</>
                    </span>
                  </li>
                </ul> */}
              </>
            }
            // role='button'
            Tag={'p'}
          >
            <span className='d-block fw-bolder text-dark'>
              {CF({
                money: Number(row?.price),
                currency: user?.store_setting?.currency
              })}
            </span>
          </BsPopover>
        </>
      )
    },

    // {
    //   name: FM('discounted-value'),

    //   cell: (row) => (
    //     <div className='d-flex align-items-center'>
    //       <div className='user-info text-truncate'>
    //         <span className='d-block fw-bold text-truncate'>{row?.discount_value ?? 'N/A'}</span>
    //       </div>
    //     </div>
    //   )
    // },
    {
      name: FM('date'),

      cell: (row, index: any) => {
        return formatDate(row?.created_at, 'YYYY-MM-DD')
      }
    }
    // {
    //   name: <>{FM('action')}</>,
    //   allowOverflow: true,
    //   maxWidth: '10px',
    //   cell: (row) => {
    //     return (
    //       <div className='d-flex '>
    //         <DropDownMenu
    //           direction='down'
    //           component={<MoreVertical color={colors.primary.main} size={IconSizes.MenuVertical} />}
    //           options={[
    //             {
    //               icon: <List size={14} />,
    //               state: row,
    //               //   to: { pathname: getPath('product.list', { id: row?.id }) },
    //               name: FM('view')
    //             }
    //             // {
    //             //   noWrap: true,
    //             //   name: (
    //             //     <ConfirmAlert
    //             //       menuIcon={<Trash2 size={14} />}
    //             //       onDropdown
    //             //       eventId={`delete-item-${row?.id}`}
    //             //       item={row}
    //             //       title={row?.name}
    //             //       color='text-warning'
    //             //       onClickYes={() => handleSingleDelete(row?.id)}
    //             //       onSuccessEvent={(e: any) => {
    //             //         refetch()
    //             //       }}
    //             //       className=''
    //             //       id={`grid-delete-${row?.id}`}
    //             //     >
    //             //       {FM('move-to-trash')}
    //             //     </ConfirmAlert>
    //             //   )
    //             // }
    //           ]}
    //         />
    //       </div>
    //     )
    //   }
    // }
  ]
  return (
    <Fragment>
      <Show IF={props?.filterTransaction ?? false}>
        <div className='p-2'>
          <Form onSubmit={handleSubmit(onSubmit)}>
            <Row>
              <Col md='6'>
                <FormGroupCustom
                  placeholder={FM('start-date')}
                  label={FM('start-date')}
                  //   noLabel
                  name={`start_date`}
                  type={'date'}
                  //   datePickerOptions={{ minDate: formatDate(new Date()) }}
                  className='mb-0'
                  control={control}
                  rules={{ required: false }}
                />
              </Col>
              <Col md='6'>
                <FormGroupCustom
                  placeholder={FM('end-date')}
                  label={FM('end-date')}
                  //   noLabel
                  name={`end_date`}
                  type={'date'}
                  datePickerOptions={{
                    minDate: formatDate(watch(`start_date`))
                  }}
                  className='mb-0'
                  control={control}
                  rules={{ required: false }}
                />
              </Col>
            </Row>
          </Form>
        </div>
      </Show>
      <CustomDataTable<TransactionProps>
        initialPerPage={15}
        isLoading={props?.loading || isLoading}
        options={options}
        // selectableRows
        columns={columns}
        paginatedData={data}
        hideHeader
        // onSearch={false}
        handlePaginationAndSearch={handlePageChange}
      />
    </Fragment>
  )
}

export default TransactionsList
