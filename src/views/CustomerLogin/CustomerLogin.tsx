/* eslint-disable prettier/prettier */
import { useContext, useEffect, useReducer } from 'react'
import { useForm } from 'react-hook-form'
import { Badge, ButtonGroup } from 'reactstrap'
import useUserType from '../../utility/hooks/useUserType'
import { stateReducer } from '../../utility/stateReducer'
import {
  useDisPlayLoginSettingsMutation,
  useGetDisplayLoginSettingsMutation
} from '../../redux/RTKQuery/countryListRTK'
import { FM, isValid } from '../../utility/helpers/common'
import { TableColumn } from 'react-data-table-component'
import DropDownMenu from '../components/dropdown'
import { Edit, MoreVertical, RefreshCcw } from 'react-feather'
import { ThemeColors } from '../../utility/context/ThemeColors'
import { IconSizes } from '../../utility/Const'
import AddCustomerLogin from './AddCustomerLogin'
import Header from '../components/header'
import LoadingButton from '../components/buttons/LoadingButton'
import CustomDataTable, { TableFormData } from '../components/CustomDataTable/CustomDataTable'
import { useNoViewModal } from '../components/modal/HandleModal'
import LockOpen from '@mui/icons-material/LockOpen'

interface States {
  page?: any
  per_page_record?: any
  search?: any
  edit?: any
  reload?: any
  lastRefresh?: any
  country_name?: any
  isRemoving?: boolean
  isReloading?: boolean
  filterData?: any
  isAddingNewData?: boolean
}
export type CustomerLoginParams = {
  id?: string
  show_login_bankid?: any
  show_login_freja?: any
  show_login_otp?: any
  show_crypto_wallet?: any
  show_stripe?: any
  show_tabby?: any
  country_name?: any
  country_id?: any
  updated_at?: any
  created_at?: any
}

const CustomerLogin = () => {
  const initState: States = {
    page: 1,
    per_page_record: 15,
    lastRefresh: new Date().getTime(),
    search: '',
    isRemoving: false,
    edit: undefined,
    isReloading: false,
    isAddingNewData: false,
    filterData: undefined
  }
  const { colors } = useContext(ThemeColors)

  const userType = useUserType()
  const reducers = stateReducer<States>
  const [showModal, handleModal] = useNoViewModal()
  const [state, setState] = useReducer(reducers, initState)
  const [loadList, { data, isLoading, isSuccess, isError }] = useGetDisplayLoginSettingsMutation()
  const [createLogin, result] = useDisPlayLoginSettingsMutation()

  useEffect(() => {
    loadList({
      jsonData: { country_name: state?.search },
      page: state.page,
      per_page_record: state.per_page_record
    })
  }, [state.lastRefresh, state.page, state?.search, state.per_page_record])

  let columns: TableColumn<CustomerLoginParams>[] = []

  columns = [
    {
      name: '#',
      maxWidth: '10px',
      cell: (row, index: any) => {
        // eslint-disable-next-line no-mixed-operators
        return parseInt(state?.per_page_record) * (state?.page - 1) + (index + 1)
      }
    },
    {
      name: FM('country'),
      minWidth: '50px',
      cell: (row, index: any) => (
        <div className='d-flex align-items-center'>
          <div className='user-info text-truncate'>
            <span className='d-block fw-bold text-truncate'>{row?.country_name}</span>
          </div>
        </div>
      )
    },
    {
      name: FM('show-login-otp'),
      minWidth: '50px',
      cell: (row, index: any) => (
        <div className='d-flex align-items-center'>
          <div className='user-info text-truncate'>
            <span className='d-block fw-bold text-truncate'>
              {parseInt(row?.show_login_otp) === 1 ? (
                <Badge color='success'>{FM('yes')}</Badge>
              ) : (
                <Badge color='danger'>{FM('no')}</Badge>
              )}
            </span>
          </div>
        </div>
      )
    },
    {
      name: FM('show-login-freja'),
      minWidth: '50px',
      cell: (row, index: any) => (
        <div className='d-flex align-items-center'>
          <div className='user-info text-truncate'>
            <span className='d-block fw-bold text-truncate'>
              {parseInt(row?.show_login_freja) === 1 ? (
                <Badge color='success'>{FM('yes')}</Badge>
              ) : (
                <Badge color='danger'>{FM('no')}</Badge>
              )}
            </span>
          </div>
        </div>
      )
    },
    {
      name: FM('show-login-bankid'),
      minWidth: '50px',
      cell: (row, index: any) => (
        <div className='d-flex align-items-center'>
          <div className='user-info text-truncate'>
            <span className='d-block fw-bold text-truncate'>
              {parseInt(row?.show_login_bankid) === 1 ? (
                <Badge color='success'>{FM('yes')}</Badge>
              ) : (
                <Badge color='danger'>{FM('no')}</Badge>
              )}
            </span>
          </div>
        </div>
      )
    },
    {
      name: FM('show_stripe'),
      minWidth: '50px',
      cell: (row, index: any) => (
        <div className='d-flex align-items-center'>
          <div className='user-info text-truncate'>
            <span className='d-block fw-bold text-truncate'>
              {parseInt(row?.show_stripe) === 1 ? (
                <Badge color='success'>{FM('yes')}</Badge>
              ) : (
                <Badge color='danger'>{FM('no')}</Badge>
              )}
            </span>
          </div>
        </div>
      )
    },
    {
      name: FM('show_crypto_wallet'),
      minWidth: '50px',
      cell: (row, index: any) => (
        <div className='d-flex align-items-center'>
          <div className='user-info text-truncate'>
            <span className='d-block fw-bold text-truncate'>
              {parseInt(row?.show_crypto_wallet) === 1 ? (
                <Badge color='success'>{FM('yes')}</Badge>
              ) : (
                <Badge color='danger'>{FM('no')}</Badge>
              )}
            </span>
          </div>
        </div>
      )
    },
    {
      name: FM('show_tabby'),
      minWidth: '50px',
      cell: (row, index: any) => (
        <div className='d-flex align-items-center'>
          <div className='user-info text-truncate'>
            <span className='d-block fw-bold text-truncate'>
              {parseInt(row?.show_tabby) === 1 ? (
                <Badge color='success'>{FM('yes')}</Badge>
              ) : (
                <Badge color='danger'>{FM('no')}</Badge>
              )}
            </span>
          </div>
        </div>
      )
    },

    {
      name: FM('action'),
      allowOverflow: true,
      maxWidth: '10px',
      cell: (row: any) => {
        return (
          <div className='d-flex '>
            <DropDownMenu
              direction='down'
              component={<MoreVertical color={colors.primary.main} size={IconSizes.MenuVertical} />}
              options={[
                {
                  icon: <Edit size={14} />,
                  onClick: () => {
                    handleModal()
                    setState({
                      edit: row
                    })
                  },
                  name: FM('edit')
                }
              ]}
            />
          </div>
        )
      }
    }
  ]
  const handlePageChange = (e: TableFormData) => {
    setState({ ...e })
  }

  return (
    <>
      <AddCustomerLogin
        edit={state?.edit}
        response={(e) => {
          setState({
            lastRefresh: new Date().getTime(),
            page: 1
          })
        }}
        showModal={showModal}
        setShowModal={(e) => handleModal()}
        noView
      />

      <Header
        // onClickBack={() => navigate(-1)}
        // goBackTo
        icon={<LockOpen fontSize='medium' />}
        title={FM('login-setting')}
      >
        <ButtonGroup color='dark'>
          {/* <BsTooltip<ButtonProps> Tag={Button} size='sm' color='secondary' title={FM('filter')}>
            <Sliders size='14' />
          </BsTooltip> */}
          <LoadingButton
            loading={isLoading}
            onClick={() => {
              setState({ lastRefresh: new Date().getTime() })
            }}
            size='sm'
            color='dark'
            tooltip={FM('reload')}
          >
            <RefreshCcw size='14' />
          </LoadingButton>
        </ButtonGroup>
      </Header>
      <CustomDataTable<CustomerLoginParams>
        initialPerPage={15}
        // options={options}
        //  selectableRows
        // hideSearch
        isLoading={isLoading}
        columns={columns}
        paginatedData={data}
        handlePaginationAndSearch={handlePageChange}
      />
    </>
  )
}

export default CustomerLogin
