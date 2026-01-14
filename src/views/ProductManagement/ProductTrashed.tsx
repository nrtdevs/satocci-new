import { useContext, useEffect, useReducer } from 'react'

import {
  Activity,
  ArrowLeft,
  BarChart2,
  MoreVertical,
  Plus,
  RefreshCcw,
  Sliders
} from 'react-feather'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Badge, Button, ButtonGroup, ButtonProps, DropdownItem } from 'reactstrap'
import { ThemeColors } from '../../utility/context/ThemeColors'

import { getPath } from '../../router/RouteHelper'
import { IconSizes } from '../../utility/Const'
import { FM, isValidArray } from '../../utility/helpers/common'
import CustomDataTable, {
  TableDropDownOptions,
  TableFormData
} from '../components/CustomDataTable/CustomDataTable'
import DropDownMenu from '../components/dropdown'
import Header from '../components/header'

import { stateReducer } from '../../utility/stateReducer'

import { TableColumn } from 'react-data-table-component'
import BsTooltip from '../components/tooltip'
import TooltipLink from '../components/tooltip/TooltipLink'

import { QueryStatus } from '@reduxjs/toolkit/dist/query'
import { useDispatch } from 'react-redux'
import {
  ProductManagement,
  useDeleteProductByIdMutation,
  useLoadProductTrashedQuery,
  useRestoreProductMutation
} from '../../redux/RTKQuery/ProductRTK'
import { emitAlertStatus } from '../../utility/Utils'
import { ProductParamType } from './fragment/ProductForm'
// import { EmployeeParamType } from './fragment/AddUpdateEmployee'
interface States {
  page?: any
  per_page_record?: any
  search?: any
  reload?: any
  isRemoving?: boolean
  isReloading?: boolean
  isAddingNewData?: boolean
}
function ProductTrashed() {
  const dispatch = useDispatch()
  const { colors } = useContext(ThemeColors)
  // Local States
  const navigate = useNavigate()
  const initState: States = {
    page: 1,
    per_page_record: 15,
    search: undefined,
    isRemoving: false,
    isReloading: false,
    isAddingNewData: false
  }
  const location: any = useLocation()
  const isAddingNewData = location?.state?.reload ?? false
  const reducers = stateReducer<States>
  const [state, setState] = useReducer(reducers, initState)
  // Load Store Data
  const [deleteProduct, resultDelete] = useDeleteProductByIdMutation()
  const { data, originalArgs, isLoading, isFetching, refetch } = useLoadProductTrashedQuery({
    jsonData: { name: state?.search },
    page: state?.page,
    per_page_record: state?.per_page_record
  })
  const [restoreData, result] = useRestoreProductMutation()
  useEffect(() => {
    setState({
      page: 1
    })
  }, [state.per_page_record])
  const handlePageChange = (e: TableFormData) => {
    setState({ ...e })
  }

  const reloadData = () => {
    setState({ isAddingNewData: false })
    dispatch(
      ProductManagement.util.invalidateTags([
        { type: 'Product', id: 'LIST' },
        { type: 'Product', id: 'NEXT-LIST' }
      ])
    )
  }
  const handleDelete = (ids?: any) => {
    // log('id', id)
    if (isValidArray(ids)) {
      deleteProduct({
        ids,
        jsonData: {
          ids,
          action: ' permanent_delete'
        }
      })
    }
  }
  useEffect(() => {
    if ((resultDelete.status = QueryStatus.fulfilled) && resultDelete?.isLoading === false) {
      //   log('resultDelete', resultDelete)
      if (resultDelete?.isSuccess) {
        setState({ isRemoving: true })
        // refetch()
        emitAlertStatus('success', null, `delete-item-${resultDelete?.originalArgs?.id}`)
      } else if (resultDelete?.error) {
        emitAlertStatus('failed', null, `delete-item-${resultDelete?.originalArgs?.id}`)
      }
    }
  }, [resultDelete])
  useEffect(() => {
    if (isAddingNewData) {
      refetch()
      window.history.replaceState({}, document.title)
    }
  }, [])

  const handleRestore = (row: any) => {
    restoreData(row)
  }

  useEffect(() => {
    if (result.isSuccess) {
      navigate(getPath('product.list'), { state: { reload: true } })
    }
  }, [result])
  const columns: TableColumn<ProductParamType>[] = [
    {
      name: '#',
      maxWidth: '50px',
      cell: (row, index: any) => {
        // eslint-disable-next-line no-mixed-operators
        return parseInt(state?.per_page_record) * (state?.page - 1) + (index + 1)
      }
    },
    {
      name: <>{FM('product-name')}</>,
      minWidth: '250px',
      //sortable: row => row.full_name,
      cell: (row) => (
        <div className='d-flex align-items-center'>
          <div className='user-info text-truncate'>
            <Link
              state={{ row }}
              to={getPath('product.details', { id: row?.id })}
              className='d-block'
              id='create-button'
            >
              <span className='d-block fw-bold text-truncate'>{row?.name}</span>
            </Link>
          </div>
        </div>
      )
    },
    {
      name: <>{FM('quantity')}</>,
      //sortable: true,
      minWidth: '250px',
      //sortable: row => row.full_name,
      cell: (row) => (
        <div className='d-flex align-items-center'>
          <div className='user-info text-truncate ms-1'>
            <span className='d-block fw-bold text-truncate'>{row?.quantity}</span>
            <small className='status-text'>
              <>
                {FM('price')} : {row.price}
              </>
            </small>
          </div>
        </div>
      )
    },
    {
      name: <>{FM('discount')}</>,
      //sortable: true,
      minWidth: '250px',
      //sortable: row => row.full_name,
      cell: (row) => (
        <div className='d-flex align-items-center'>
          <div className='user-info text-truncate ms-1'>
            <span className='d-block fw-bold text-truncate'>
              {row.discount_type === '2' ? FM('percent') : FM('fixed')}
            </span>
            <small className='status-text'>
              <>
                {FM('value')} : {row.discount_value}
              </>
            </small>
          </div>
        </div>
      )
    },

    {
      name: <>{FM('expiry')}</>,
      minWidth: '150px',
      // sortable: row => row.subscription_type,
      cell: (row) => {
        return (
          <Badge color='light-primary' pill>
            {row?.expiry_details}
          </Badge>
        )
      }
    },

    {
      name: <>{FM('action')}</>,
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
                  icon: <RefreshCcw size={14} />,
                  state: row,
                  onClick: () => handleRestore(row),
                  name: FM('restore')
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
      noWrap: true,
      name: (
        <DropdownItem
          onClick={() => {
            handleDelete(selectedRows?.ids)
          }}
          tag={'span'}
          className='dropdown-item d-flex align-items-center'
        >
          <>
            <Activity size={16} className='me-1' />
            {FM('permanent-delete')} ({selectedRows?.selectedCount})
          </>
        </DropdownItem>
      )
    }
  ]

  return (
    <>
      <Header icon={<BarChart2 size='25' />} title={FM('products')}>
        <ButtonGroup color='dark'>
          <TooltipLink
            title={<>{FM('create-new')}</>}
            to={getPath('product.create')}
            className='btn btn-primary btn-sm'
          >
            <Plus size='14' />
          </TooltipLink>
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
        <ButtonGroup className='ms-1'>
          <TooltipLink
            title={FM('trashed-stores')}
            to={getPath('product.list')}
            className='btn btn-dark btn-sm'
            color='secondary'
          >
            <>
              <ArrowLeft size='14' />
              <span className='align-middle ms-25'>{FM('products')}</span>
            </>
          </TooltipLink>
        </ButtonGroup>
      </Header>
      <CustomDataTable<ProductParamType>
        initialPerPage={15}
        isLoading={isLoading}
        isFetching={isFetching && !isAddingNewData}
        isAddingNewData={isAddingNewData && isFetching}
        options={options}
        selectableRows
        columns={columns}
        paginatedData={data}
        handlePaginationAndSearch={handlePageChange}
      />
    </>
  )
}

export default ProductTrashed
