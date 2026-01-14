/* eslint-disable eqeqeq */
import { useContext, useEffect, useReducer } from 'react'

import {
  ArrowDownCircle,
  ArrowUpCircle,
  RefreshCcw,
  Sliders,
  StopCircle,
  XCircle
} from 'react-feather'
import { Badge, ButtonGroup } from 'reactstrap'
import { ThemeColors } from '../../../utility/context/ThemeColors'

import { useLocation } from 'react-router-dom'

import { FM, isValid, log } from '../../../utility/helpers/common'
import { stateReducer } from '../../../utility/stateReducer'
import CustomDataTable, {
  TableDropDownOptions,
  TableFormData
} from '../../components/CustomDataTable/CustomDataTable'
import Header from '../../components/header'

import { QueryStatus } from '@reduxjs/toolkit/dist/query'
import { TableColumn } from 'react-data-table-component'
import { useForm } from 'react-hook-form'
import { useDispatch } from 'react-redux'
import {
  useActionCouponMutation,
  useUsageCouponListMutation
} from '../../../redux/RTKQuery/CouponRTK'
import { UserType } from '../../../utility/Const'
import { Permissions } from '../../../utility/Permissions'
import { CF, emitAlertStatus, formatDate } from '../../../utility/Utils'
import { loadDropdown } from '../../../utility/apis/dropdowns'
import ConfirmAlert from '../../../utility/helpers/ConfirmAlert'
import useUser from '../../../utility/hooks/useUser'
import useUserType from '../../../utility/hooks/useUserType'
import ApiEndpoints from '../../../utility/http/ApiEndpoints'
import LoadingButton from '../../components/buttons/LoadingButton'
import FormGroupCustom from '../../components/formGroupCustom/FormGroupCustom'
import { CouponParamType } from './AddUpdateCoupon'
import CouponFilter from './CouponFilter'
import ModalCouponDetails from './ModalCouponDetails'

interface States {
  couponData?: any
  lastRefresh?: any
  status?: any
  group_by?: any
  page?: any
  per_page_record?: any
  couponFilter?: boolean
  filterData?: any
  search?: any
  reload?: any
  isRemoving?: boolean
  isReloading?: boolean
  isAddingNewData?: boolean
  changeObject?: any
  show?: boolean
}
const Coupon = () => {
  const dispatch = useDispatch()
  const { colors } = useContext(ThemeColors)
  const form = useForm<any>()
  const { handleSubmit, control, reset, setValue, watch } = form
  const userType = useUserType()
  // Local States
  const initState: States = {
    lastRefresh: new Date().getTime(),
    page: 1,
    status: '1',
    group_by: 'no',
    per_page_record: 15,
    couponFilter: false,
    changeObject: null,
    filterData: null,
    couponData: {},
    search: undefined,
    isRemoving: false,
    isReloading: false,
    isAddingNewData: false,
    show: false
  }

  const location: any = useLocation()
  const user = useUser()
  const reducers = stateReducer<States>
  const [state, setState] = useReducer(reducers, initState)

  const [loadCoupon, { data, isLoading, isSuccess }] = useUsageCouponListMutation()
  const [actionCoupon, couponResult] = useActionCouponMutation()

  const loadCoupons = () => {
    loadCoupon({
      jsonData: {
        ...state?.filterData,
        coupon_code: isValid(state?.search) ? state.search : state?.filterData?.coupon_code,
        search: isValid(state?.search) ? state.search : null,
        store_id: watch('store_id')?.value,

        from_date: null,
        to_date: null,
        group_by: state?.group_by
      },
      page: isValid(state.search) ? 1 : state.page,
      per_page_record: state?.per_page_record
    })
  }

  useEffect(() => {
    loadCoupons()
  }, [
    isValid(state?.search),
    watch('store_id'),
    isValid(state?.filterData),
    state?.per_page_record,
    state?.page,
    state?.lastRefresh,
    state?.group_by
  ])

  // const handlePageChange = (e: TableFormData) => {
  //   setState({ ...e })
  // }
  useEffect(() => {
    setState({
      page: 1
    })
  }, [state.per_page_record])
  const handlePageChange = (e: TableFormData) => {
    setState({
      ...e
    })
  }

  log(state.search)
  const handleActions = (id?: any, ids?: any, action?: any, eventId?: any) => {
    if (isValid(id)) {
      // delete single
      // deleteStore({
      //   eventId,
      //   id,
      //   originalArgs: couponResult?.originalArgs
      // })
    } else {
      actionCoupon({
        ids,
        eventId,
        originalArgs: couponResult?.originalArgs,
        jsonData: {
          ids,
          action
        }
      })
    }
  }

  useEffect(() => {
    if ((couponResult.status = QueryStatus.fulfilled) && couponResult?.isLoading === false) {
      if (couponResult?.isSuccess) {
        emitAlertStatus('success', null, couponResult?.originalArgs?.eventId)
      } else if (couponResult?.error) {
        emitAlertStatus('failed', null, couponResult?.originalArgs?.eventId)
      }
    }
  }, [couponResult])

  const reloadData = () => {
    setState({
      lastRefresh: new Date().getTime(),
      page: 1
    })
  }

  let columns: TableColumn<CouponParamType>[] = []
  if (state?.group_by === 'no') {
    columns = [
      {
        name: <>{FM('coupon-code')}</>,
        cell: (row) => (
          // <ModalCouponDetails edit={row}>
          <div className='d-flex align-items-center'>
            <div className='user-info '>
              <u className='d-block fw-bold text-primary'>{row?.coupon_code}</u>
            </div>
          </div>
          // </ModalCouponDetails>
        )
      },
      {
        name: <>{FM('order-number')}</>,
        cell: (row) => (
          // <ModalCouponDetails edit={row}>
          <div className='d-flex align-items-center'>
            <div className='user-info '>
              <u className='d-block fw-bold text-primary'>{row?.order_number}</u>
            </div>
          </div>
          // </ModalCouponDetails>
        )
      },
      {
        name: <>{FM('coupon-discount')}</>,
        cell: (row) => (
          <div className='d-flex align-items-center'>
            <div>
              <div className='fw-bold'>
                {`${CF({
                  money: Number(row?.coupon_discount),
                  currency: row?.store_setting?.currency ?? user?.currency
                })}`}
              </div>
            </div>
          </div>
        )
      },

      {
        name: FM('usage-limit'),
        //sortable: true,
        // minWidth: '250px',
        //sortable: row => row.full_name,
        cell: (row) => (
          <div className='d-flex align-items-center'>
            <div className='user-info text-truncate'>
              <span className='d-block fw-bold text-truncate'>{`${row?.coupon?.usage_limit} (${FM(
                'coupons'
              )})`}</span>
              <small className='status-text'>
                <>
                  <Badge color={'light-success'} pill>
                    {' '}
                    {FM('used-coupon')} : {row?.coupon?.used}
                  </Badge>
                </>
              </small>
            </div>
          </div>
        )
      },

      {
        name: <>{FM('max-discount')}</>,

        cell: (row) => (
          <div className='d-flex align-items-center'>
            <div>
              <div className='fw-bold'>
                {CF({
                  money: row?.coupon?.max_discount,
                  currency: row?.store_setting?.currency ?? user?.currency
                })}
              </div>
            </div>
          </div>
        )
      },
      {
        name: <>{FM('created-at')}</>,

        cell: (row) => (
          <div className='d-flex align-items-center'>{formatDate(row?.coupon?.updated_at)}</div>
        )
      },
      {
        name: <>{FM('expiry-date')}</>,

        cell: (row) => (
          <div className='d-flex align-items-center'>
            {row?.coupon?.status === 1 ? (
              <Badge color='light-success'>{formatDate(row?.coupon?.expiry_date)}</Badge>
            ) : (
              <Badge color='light-danger'>{formatDate(row?.coupon?.expiry_date)}</Badge>
            )}
          </div>
        )
      },
      {
        name: <>{FM('status')}</>,

        cell: (row) => (
          <div className='d-flex align-items-center'>
            <div className='d-block user-info'>
              {`${row?.coupon?.status}` === `${1}` ? (
                <Badge color='light-success'>
                  <>{FM('active')}</>
                </Badge>
              ) : (
                <Badge color='light-danger'>
                  <> {FM('expired')}</>
                </Badge>
              )}
            </div>
          </div>
        )
      }
    ]
  } else {
    columns = [
      {
        name: <>{FM('coupon-code')}</>,
        cell: (row) => (
          // <ModalCouponDetails edit={row}>
          <div className='d-flex align-items-center'>
            <div className='user-info '>
              <u className='d-block fw-bold text-primary'>{row?.coupon_code}</u>
            </div>
          </div>
          // </ModalCouponDetails>
        )
      },
      {
        name: <>{FM('coupon-discount')}</>,
        cell: (row) => (
          <div className='d-flex align-items-center'>
            <div>
              <div className='fw-bold'>
                {`${CF({
                  money: Number(row?.total_coupon_discount),
                  currency: row?.store_setting?.currency ?? user?.currency
                })}`}
              </div>
            </div>
          </div>
        )
      },
      {
        name: <>{FM('total-coupon-usage')}</>,
        cell: (row) => (
          <div className='d-flex align-items-center'>
            <div>
              <div className='fw-bold'>{`${row?.total_coupon_usage} (${FM('coupon')})`}</div>
            </div>
          </div>
        )
      },

      {
        name: <>{FM('max-discount')}</>,

        cell: (row) => (
          <div className='d-flex align-items-center'>
            <div>
              <div className='fw-bold'>
                {CF({
                  money: row.coupon.max_discount,
                  currency: row?.store_setting?.currency ?? user?.currency
                })}
              </div>
            </div>
          </div>
        )
      },

      {
        name: <>{FM('expiry-date')}</>,

        cell: (row) => (
          <div className='d-flex align-items-center'>
            {row?.coupon?.status === 1 ? (
              <Badge color='light-success'>{formatDate(row?.coupon?.expiry_date)}</Badge>
            ) : (
              <Badge color='light-danger'>{formatDate(row?.coupon?.expiry_date)}</Badge>
            )}
          </div>
        )
      },
      {
        name: <>{FM('status')}</>,

        cell: (row) => (
          <div className='d-flex align-items-center'>
            <div className='d-block user-info'>
              {`${row?.coupon?.status}` === `${1}` ? (
                <Badge color='light-success'>
                  <>{FM('active')}</>
                </Badge>
              ) : (
                <Badge color='light-danger'>
                  <> {FM('expired')}</>
                </Badge>
              )}
            </div>
          </div>
        )
      }
    ]
  }

  const options: TableDropDownOptions = (selectedRows) => [
    {
      IF: Permissions.couponEdit,
      noWrap: true,
      name: (
        <ConfirmAlert
          menuIcon={<StopCircle size={14} />}
          onDropdown
          eventId={`item-expire`}
          text={FM('are-you-sure')}
          title={FM('expire-selected-count', { count: selectedRows?.selectedCount })}
          color='text-warning'
          onClickYes={() => handleActions(null, selectedRows?.ids, 'expire', 'item-expire')}
          onSuccessEvent={(e: any) => {
            reloadData()
          }}
          className=''
          id={`grid-expire-selected`}
        >
          {FM('expire')} ({selectedRows?.selectedCount})
        </ConfirmAlert>
      )
    }
  ]

  return (
    <>
      <CouponFilter
        show={state?.couponFilter}
        filterData={state.filterData}
        setFilterData={(e: any) => setState({ filterData: e, page: 1 })}
        handleFilterModal={(e: boolean) => {
          setState({
            couponFilter: e,
            search: null
          })
        }}
      />
      <ModalCouponDetails
        edit={state.couponData}
        response={(e) => {
          setState({
            status: '1',
            search: e
          })
        }}
        showModal={state.show}
        setShowModal={(e: boolean) =>
          setState({
            show: e
          })
        }
        noView
      />
      <Header
        icon={<XCircle size='25' />}
        title={FM('used-coupons')}
        subHeading={
          state?.group_by === 'no' ? FM('single-used-coupon') : FM('multiple-used-coupon')
        }
      >
        <FormGroupCustom
          key={`user-load-${user?.store_id}`}
          noGroup
          label={FM('store')}
          placeholder={FM('select-store')}
          noLabel
          async
          searchItem={'search'}
          path={
            (`${userType}` === `${UserType.Store}` && isValid(user?.store_id)) ||
            (`${userType}` === `${UserType?.Employee}` && isValid(user?.store_id)) ||
            (`${userType}` === `${UserType.GateGuard}` && isValid(user?.store_id))
              ? ApiEndpoints.store_substore_list + user?.store_id
              : ApiEndpoints.store_option
          }
          jsonData={{ with_substore: 'yes' }}
          selectLabel='name'
          modifyDropdownData={(d: any) => {
            return {
              ...d,
              name: `${d?.name} / (${d?.store_setting?.store_name ?? d?.store_setting?.store_name})`
            }
          }}
          selectValue={'id'}
          defaultOptions
          loadOptions={loadDropdown}
          name={`store_id`}
          type={'select'}
          className='me-1 flex-1'
          control={control}
          rules={{ required: false }}
          // prepend={<InputGroupText>{FM('get')}</InputGroupText>}
          // append={<InputGroupText>{FM('item')}</InputGroupText>}
        />

        <ButtonGroup>
          <LoadingButton
            loading={isLoading}
            onClick={() =>
              setState({
                group_by: state?.group_by === 'no' ? 'yes' : 'no',
                page: 1
              })
            }
            size='sm'
            className='me-1'
            color={state?.group_by === 'no' ? 'primary' : 'success'}
            tooltip={
              state?.group_by === 'no' ? FM('multiple-used-coupon') : FM('single-used-coupon')
            }
          >
            {state?.group_by === 'yes' ? (
              <ArrowUpCircle size='14' />
            ) : (
              <ArrowDownCircle size='14' />
            )}
          </LoadingButton>
        </ButtonGroup>
        <ButtonGroup color='dark'>
          {/* <TooltipLink
            title={<>{FM('create-new')}</>}
            to={getPath('store.coupon.create')}
            className='btn btn-primary btn-sm'
          >
            <Plus size='14' />
          </TooltipLink> */}
          <LoadingButton
            loading={false}
            onClick={() =>
              setState({
                couponFilter: true
              })
            }
            size='sm'
            color='secondary'
            tooltip={FM('filter')}
          >
            <Sliders size='14' />
          </LoadingButton>
          <LoadingButton
            loading={isLoading}
            tooltip={FM('reload')}
            size='sm'
            color='dark'
            onClick={() =>
              setState({
                lastRefresh: new Date().getTime(),
                page: 1,
                search: '',
                filterData: null
              })
            }
          >
            <RefreshCcw size='14' />
          </LoadingButton>
        </ButtonGroup>
      </Header>
      <CustomDataTable<CouponParamType>
        key={state.lastRefresh}
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

export default Coupon
