/* eslint-disable prettier/prettier */
/* eslint-disable no-mixed-operators */
// ** Custom Components

// ** Reactstrap Imports
import { Badge, Button, Card, CardBody, CardHeader, Col, Form, Row, Table } from 'reactstrap'

// ** Icons Imports
import { useEffect, useReducer, useState } from 'react'
import { Copy, Eye, Info, TrendingDown, TrendingUp } from 'react-feather'
import { Link } from 'react-router-dom'
import { useTopAndLeastSellingProductsMutation } from '../../../redux/RTKQuery/ProductRTK'
import { getPath } from '../../../router/RouteHelper'
import { FM, isValid, log } from '../../../utility/helpers/common'
import Hide from '../../../utility/Hide'
import { Permissions } from '../../../utility/Permissions'
import Show from '../../../utility/Show'
import { stateReducer } from '../../../utility/stateReducer'
import {
  CF,
  decrypt,
  formatDate,
  getUserData,
  JsonParseValidate,
  SuccessToast,
  truncateText
} from '../../../utility/Utils'
import Shimmer from '../../components/shimmers/Shimmer'
import {
  useStripeAllPayoutsMutation,
  useAllAppFeesMutation,
  useAllTransferMutation,
  useAllStoreTransferMutation
} from '../../../redux/RTKQuery/EmailTemplateRTK'
import LoadingButton from '../../components/buttons/LoadingButton'
import { useForm } from 'react-hook-form'
import ApiEndpoints from '../../../utility/http/ApiEndpoints'
import FormGroupCustom from '../../components/formGroupCustom/FormGroupCustom'
import { loadDropdown } from '../../../utility/apis/dropdowns'
import BsPopover from '../../components/popover'
import { UserType } from '../../../utility/Const'
import useUserType from '../../../utility/hooks/useUserType'
import TooltipLink from '../../components/tooltip/TooltipLink'
// interface storeProps {
//   storeName?: any;
// }
interface States {
  page?: any
  topProducts?: any
  hasMore: boolean
  per_page_record?: any
  search?: any
  reload?: any
  isAddingNewData?: boolean
}

export const dateFormatStringToUtc = (num: number) => {
  const timestamp: any = num ?? new Date().getTime()
  const date = new Date(timestamp * 1000) // multiply by 1000 to convert seconds to milliseconds
  return date.toUTCString()
}
const AllTransfers = ({
  least = 1,
  filterBoth = false,
  storeId = null,
  loading = new Date().getTime()
}: {
  least?: any
  storeId: any
  filterBoth?: any
  loading?: any
}) => {
  const initState: States = {
    page: 1,
    topProducts: [],
    per_page_record: 15,
    hasMore: false,
    search: undefined,
    isAddingNewData: false
    // reload: reloadID
  }
  const reducers = stateReducer<States>
  const [state, setState] = useReducer(reducers, initState)
  const userType = useUserType()
  const form = useForm<any>()
  const { handleSubmit, control, reset, setValue, watch, clearErrors } = form
  const [destinationCopyIndex, setDestinationCopyIndex] = useState(undefined)
  const [copyIndex, setCopyIndex] = useState(undefined)
  const user = getUserData()
  const [allTransfers, { data, isLoading, isSuccess }] = useAllTransferMutation()

  useEffect(() => {
    if (userType === UserType.Store) {
      allTransfers({
        jsonData: {
          store_id: watch('store_id')?.value ?? user?.store_id,
          limit: 100
        }
      })
    } else {
      allTransfers({
        jsonData: {
          store_id: watch('store_id')?.value,
          limit: 100
        }
      })
    }
  }, [loading])

  useEffect(() => {
    if (isSuccess) {
      const hasmoreData = data?.payload as any
      setState({
        topProducts: data?.payload?.data,
        hasMore: hasmoreData?.has_more
      })
      reset({
        store_id: undefined,
        created_gt: undefined,
        created_lt: undefined
      })
    }
  }, [isSuccess])

  const copyToClipboard = (text: any) => {
    navigator.clipboard.writeText(text)
  }
  const renderData = () => {
    return (
      <>
        {state?.topProducts?.map((col: any, index: any) => {
          return (
            <tr key={col?.ordered_quantity}>
              <td>
                <span role={'button'}>{formatDate(dateFormatStringToUtc(col?.created))}</span>
              </td>
              <td className='text-primary'>
                {/* <span>{col?.id}</span> */}
                <span>{CF({ money: Number(col?.amount) / 100, currency: col?.currency })}</span>
              </td>
              <td>
                <span>{col?.source_type}</span>
              </td>
              <td className='text-center'>
                {' '}
                {/* Use a utility class or custom CSS class */}
                <Link
                  state={{ col }}
                  to={getPath('admin.report.order.detail', { id: col?.transfer_group })}
                  className='d-block'
                  id='create-button'
                >
                  <span>
                    <TooltipLink
                      title={FM('details')}
                      to={getPath('admin.report.order.detail', { id: col?.transfer_group })}
                    >
                      <Eye size='14' className='' />
                    </TooltipLink>
                  </span>
                </Link>
              </td>

              <td>
                <span>
                  {col?.destination}
                  <Copy
                    size={16}
                    className={`cursor-pointer ms-1 ${
                      destinationCopyIndex === index ? 'text-success' : 'text-primary'
                    }`}
                    onClick={() => {
                      SuccessToast('Copied')
                      setDestinationCopyIndex(index)
                      copyToClipboard(col?.destination_payment)
                    }}
                  />
                </span>
              </td>

              <td>
                <span>
                  {col?.destination_payment}
                  <Copy
                    size={16}
                    className={`cursor-pointer ms-1 ${
                      copyIndex === index ? 'text-success' : 'text-primary'
                    }`}
                    onClick={() => {
                      SuccessToast('Copied')
                      setCopyIndex(index)
                      copyToClipboard(col?.destination_payment)
                    }}
                  />
                </span>
              </td>

              <td>
                <BsPopover
                  title={''}
                  content={
                    <>
                      <div className='d-flex flex-column'>
                        <span className='fw-bold'>
                          {FM('amount')} :
                          <span className='fw-bolder'>
                            {' '}
                            {CF({ money: Number(col?.amount) / 100, currency: user?.currency })}
                          </span>
                        </span>
                        <span className='fw-bold'>
                          {FM('amount-reversed')} :
                          <span className='fw-bolder'> {col?.amount_reversed}</span>
                        </span>
                        <span className='fw-bold'>
                          {FM('balance-transaction')} :
                          <span className='fw-bolder'>{col?.balance_transaction}</span>{' '}
                        </span>
                        <span className='fw-bold'>
                          {FM('date')} :{' '}
                          <span className='fw-bolder'>
                            {' '}
                            {formatDate(dateFormatStringToUtc(col?.created))}
                          </span>
                        </span>
                        <span className='fw-bold'>
                          {FM('currency')} : <span className='fw-bolder'>{col?.currency}</span>
                        </span>
                        <span className='fw-bold'>
                          {FM('description')} :
                          <span className='fw-bolder'> {col?.description}</span>
                        </span>
                        <span className='fw-bold'>
                          {FM('destination')} :{' '}
                          <span className='fw-bolder'>{col?.destination}</span>
                        </span>
                        <span className='fw-bold'>
                          {FM('destination-payment')} :
                          <span className='fw-bolder'> {col?.destination_payment}</span>
                        </span>

                        <span className='fw-bold'>
                          {FM('object')} : <span className='fw-bolder'>{col?.object}</span>
                        </span>

                        <span className='fw-bold'>
                          {FM('source-transaction')} :
                          <span className='fw-bolder'>{col?.source_transaction}</span>{' '}
                        </span>
                        <span className='fw-bold'>
                          {FM('source-type')} :{' '}
                          <span className='fw-bolder'>{col?.source_type}</span>
                        </span>
                      </div>
                    </>
                  }
                  // role='button'
                  Tag={'p'}
                  // className='mb-0 fw-bold text-secondary text-truncate mt-3px'
                >
                  <span className='d-block fw-bold text-wrap'>
                    {/* {truncateText(`${col?.message}`, 70)} */}
                    <Info size={16} className='cursor-pointer ms-1' />
                  </span>
                  {/* <span className='d-block fw-bold text-wrap'>{row.message}</span> */}
                </BsPopover>
              </td>
            </tr>
          )
        })}
      </>
    )
  }

  const onSubmit = (d: any) => {
    allTransfers({
      jsonData: {
        ...d,
        limit: 100,
        store_id: user?.user_type_id !== 1 ? user?.store_id : d?.store_id?.value
      }
    })
  }

  return (
    <>
      {isLoading ? (
        <Card className='card-company-table'>
          <CardHeader>
            <Shimmer height={'80px'} width={'100%'} />
          </CardHeader>
          <CardBody>
            <Shimmer height={'400px'} width={'100%'} />
          </CardBody>
        </Card>
      ) : (
        <Card className='card-company-table'>
          <Show IF={filterBoth ?? false}>
            <div className='p-2'>
              <Form onSubmit={handleSubmit(onSubmit)}>
                <Row>
                  <Hide IF={user?.user_type_id === UserType.Store}>
                    <Col md='3'>
                      <FormGroupCustom
                        label={FM('store')}
                        placeholder={FM('select-store')}
                        //   noLabel

                        async
                        searchItem={'search'}
                        path={ApiEndpoints.load_stores}
                        selectLabel='name'
                        selectValue={'id'}
                        modifyDropdownData={(d: any) => {
                          return {
                            ...d,
                            name: `${d?.name} / (${
                              d?.store_setting?.store_name ?? d?.store_setting?.store_name
                            })`
                          }
                        }}
                        defaultOptions
                        loadOptions={loadDropdown}
                        name={`store_id`}
                        type={'select'}
                        className='me-1 flex-1'
                        control={control}
                        rules={{ required: true }}
                        // prepend={<InputGroupText>{FM('get')}</InputGroupText>}
                        // append={<InputGroupText>{FM('item')}</InputGroupText>}
                      />
                    </Col>
                  </Hide>

                  {/* "amount_received_month": null,
    "amount_received" */}
                  <Col md='3'>
                    <FormGroupCustom
                      placeholder={FM('created-gte')}
                      label={FM('created-gte')}
                      //   noLabel
                      name={'created_gt'}
                      type={'date'}
                      className='mb-0'
                      control={control}
                      rules={{ required: false }}
                    />
                  </Col>
                  <Col md='3'>
                    <FormGroupCustom
                      placeholder={FM('created-less-than')}
                      label={FM('created-less-than')}
                      //   noLabel
                      name={'created_lt'}
                      type={'date'}
                      className='mb-0'
                      control={control}
                      rules={{ required: false }}
                    />
                  </Col>
                  <Col md='2' className='mt-25'>
                    <LoadingButton
                      color='primary'
                      className='btn btn-primary mt-2'
                      type='submit'
                      loading={false}
                    >
                      {FM('filter')}
                    </LoadingButton>
                    <LoadingButton
                      className='btn  mt-2 ms-1'
                      type='button'
                      onClick={() => {
                        reset({
                          store_id: undefined,
                          created_gt: undefined,
                          created_lt: undefined
                        })
                        if (userType === UserType.Store) {
                          allTransfers({
                            jsonData: {
                              store_id: user?.store_id,
                              limit: 100,
                              cursor_object_id:
                                state?.topProducts[state?.topProducts.length - 1]?.id
                            }
                          })
                        } else {
                          allTransfers({
                            jsonData: {
                              store_id: '',
                              limit: 100,
                              cursor_object_id:
                                state?.topProducts[state?.topProducts.length - 1]?.id
                            }
                          })
                        }
                      }}
                      loading={false}
                    >
                      {FM('clear')}
                    </LoadingButton>
                  </Col>
                </Row>
              </Form>
            </div>
          </Show>

          <Table responsive>
            <thead>
              <tr>
                <th>{FM('date')}</th>
                <th>{FM('amount')}</th>
                <th>{FM('source-type')}</th>
                <th>{FM('transfer-group')}</th>
                <th>{FM('destination')}</th>
                <th>{FM('destination-payment')}</th>

                <th>{FM('details')}</th>
              </tr>
            </thead>
            <tbody>{renderData()}</tbody>

            <tfoot>
              {/* add next button */}
              {state.hasMore === true && (
                <tr>
                  <td colSpan={10}>
                    <div className='d-flex justify-content-end'>
                      <LoadingButton
                        color='primary'
                        onClick={() => {
                          if (userType === UserType.Store) {
                            allTransfers({
                              jsonData: {
                                store_id: user?.store_id,
                                limit: 100,
                                cursor_object_id:
                                  state?.topProducts[state?.topProducts.length - 1]?.id
                              }
                            })
                          } else {
                            allTransfers({
                              jsonData: {
                                store_id: '',
                                limit: 100,
                                cursor_object_id:
                                  state?.topProducts[state?.topProducts.length - 1]?.id
                              }
                            })
                          }
                        }}
                        className='d-flex align-items-end'
                      >
                        {/* <span className='me-1'>1-15 of 100</span> */}
                        {FM('next')}
                      </LoadingButton>
                    </div>
                  </td>
                </tr>
              )}
            </tfoot>
          </Table>
        </Card>
      )}
    </>
  )
}

export default AllTransfers
