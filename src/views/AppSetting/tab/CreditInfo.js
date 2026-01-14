import { useEffect, useState } from 'react'
import DataTable from 'react-data-table-component'
import { ChevronDown, Plus } from 'react-feather'
import { useForm } from 'react-hook-form'
import ReactPaginate from 'react-paginate'
import { useDispatch } from 'react-redux'
import { Card, CardHeader, CardTitle, Col, Form, Row } from 'reactstrap'
import { addCreditLoad, userCreditLoad } from '../../../utility/apis/userCredit'
import { loadUser } from '../../../utility/apis/userManagement'
import { actionFor, creditType } from '../../../utility/Const'
import { log } from '../../../utility/helpers/common'
import { createConstSelectOptions, createSelectOptions } from '../../../utility/Utils'
import LoadingButton from '../../components/buttons/LoadingButton'
import FormGroupCustom from '../../components/formGroupCustom'
import Shimmer from '../../components/shimmers/Shimmer'

const CreditInfo = () => {
  const form = useForm()
  const [loading, setLoading] = useState(false)
  const dispatch = useDispatch()
  const [user, setUser] = useState(null)
  const {
    formState: { errors },
    handleSubmit,
    control,
    reset,
    setValue,
    watch,
    getValues
  } = form
  const [rowsSelected, setRowsSelected] = useState([])
  const [currentPage, setCurrentPage] = useState('1')
  const [rowsPerPage, setRowsPerPage] = useState('15')
  const [credit, setCredit] = useState(null)
  const [filterData, setFilterData] = useState({})
  // const user = useSelector(state => state.auth.userData)

  const listUser = () => {
    loadUser({
      perPage: 1000,
      loading: setLoading,
      dispatch,
      success: (e) => {
        setUser(createSelectOptions(e?.data?.data, 'name', 'id'))
      }
    })
  }

  useEffect(() => {
    listUser()
  }, [])

  // log(user, 'dfsfdsf')
  // log(credit, 'credit')

  const preload = () => {
    userCreditLoad({
      page: currentPage,
      perPage: rowsPerPage,
      dispatch,
      success: (e) => {
        setCredit(e)
      },
      loading: setLoading,
      jsonData: filterData
    })
  }

  useEffect(() => {
    preload()
  }, [filterData])
  const onSubmit = (data) => {
    addCreditLoad({
      jsonData: {
        ...data

        // user_id: user?.id
      },
      loading: setLoading,
      success: () => {
        preload()
      }
    })
  }

  const handlePagination = (page) => {
    userCreditLoad({
      page: page.selected + 1,
      perPage: rowsPerPage,
      jsonData: filterData,
      success: setCredit,
      loading: setLoading
    })
  }
  const creditColumn = [
    {
      name: '#',
      selector: (row, i) => (row.id ? i + 1 : null),
      maxWidth: '10px'
    },
    {
      name: 'Type',
      selector: (row) => {
        if (row?.credit_type === '1') {
          return 'Credit'
        }
        if (row?.credit_type === '2') {
          return 'Debit'
        }
      },
      sortable: true,
      minWidth: '170px'
    },
    {
      name: 'Route Type',
      selector: (row) => {
        if (row?.action_for === '1') {
          return 'Transaction'
        }
        if (row?.action_for === '2') {
          return 'Promotional'
        }
        if (row?.action_for === '3') {
          return 'Two Way Sms'
        }
        if (row?.action_for === '4') {
          return 'Voice'
        }
      },
      sortable: true,
      minWidth: '170px'
    },

    {
      name: 'Credit',
      selector: 'username',
      sortable: true,
      minWidth: '170px'
    },
    {
      name: 'Rate',
      selector: 'rate',
      sortable: true,
      minWidth: '170px'
    },
    {
      name: 'Expire',
      selector: 'mobile',
      sortable: true,
      minWidth: '170px'
    },
    {
      name: 'Credited By',
      selector: (row) => row.user?.name,
      sortable: true,
      minWidth: '170px'
    },
    {
      name: 'Credited',
      selector: 'mobile',
      sortable: true,
      minWidth: '170px'
    }
  ]

  const CustomPagination = () => {
    const count = Math.ceil(credit?.total / credit?.per_page)
    return (
      <ReactPaginate
        initialPage={credit?.current_page - 1}
        disableInitialCallback
        previousLabel={''}
        nextLabel={''}
        breakLabel='...'
        pageCount={count}
        activeClassName='active'
        onPageChange={(page) => handlePagination(page)}
        pageClassName={'page-item'}
        nextLinkClassName={'page-link'}
        nextClassName={'page-item next'}
        previousClassName={'page-item prev'}
        previousLinkClassName={'page-link'}
        pageLinkClassName={'page-link'}
        breakClassName='page-item'
        breakLinkClassName='page-link'
        containerClassName={
          'pagination react-paginate separated-pagination pagination-sm justify-content-end pr-1 mt-1'
        }
      />
    )
  }

  return (
    <>
      <Card className='p-2'>
        <Row>
          <CardHeader className=''>
            <h4 className='h2 text-dark fw-bolder'>Credit Balance</h4>
          </CardHeader>

          <Col md='6'>
            <Form onSubmit={handleSubmit(onSubmit)}>
              <Row>
                <Col md='6'>
                  <FormGroupCustom
                    // noLabel
                    // noGroup
                    type={'select'}
                    control={control}
                    name='user_id'
                    // value={edit?.userType}
                    isClearable
                    className='mb-1'
                    label='user '
                    errors={errors}
                    options={user}
                    rules={{ required: true }}
                  />
                </Col>
                <Col md='6'>
                  <FormGroupCustom
                    // noLabel
                    // noGroup
                    type={'select'}
                    control={control}
                    name='action_for'
                    // value={edit?.userType}
                    isClearable
                    className='mb-1'
                    label='Route Type '
                    errors={errors}
                    options={createConstSelectOptions(actionFor)}
                    rules={{ required: true }}
                  />
                </Col>
                <Col md='6'>
                  <FormGroupCustom
                    // noLabel
                    // noGroup
                    type={'select'}
                    control={control}
                    name='credit_type'
                    className='mb-1'
                    // value={edit?.userType}
                    isClearable
                    label='Credit Type '
                    errors={errors}
                    options={createConstSelectOptions(creditType)}
                    rules={{ required: true }}
                  />
                </Col>
                <Col md='6'>
                  <FormGroupCustom
                    // noLabel
                    // noGroup
                    type={'number'}
                    control={control}
                    className='mb-1'
                    name='balance'
                    // value={edit?.userType}
                    isClearable
                    label='Balance '
                    errors={errors}
                    rules={{ required: true }}
                  />
                </Col>
                <Col md='6'>
                  <FormGroupCustom
                    // noLabel
                    // noGroup
                    type={'number'}
                    control={control}
                    className='mb-1'
                    name='rate'
                    // value={edit?.userType}
                    isClearable
                    label='Rate '
                    errors={errors}
                    rules={{ required: true }}
                  />
                </Col>
              </Row>
              <Col md='3'>
                <LoadingButton
                  loading={loading}
                  type='submit'
                  className='btn-icon mt-2 round'
                  color='primary'
                  block
                >
                  <Plus size={14} />
                  <span className='align-middle ms-25'>Add Credit</span>
                </LoadingButton>
              </Col>
            </Form>
          </Col>
        </Row>
        <Card>
          <CardHeader className='border-bottom inline'>
            <CardTitle className='text-primary' tag='h4'>
              Credit List
            </CardTitle>
          </CardHeader>

          {loading ? (
            <>
              <Shimmer style={{ width: '100%', height: 50, marginBottom: 5, marginTop: 5 }} />
              <Shimmer style={{ width: '100%', height: 50, marginBottom: 5 }} />
              <Shimmer style={{ width: '100%', height: 50, marginBottom: 5 }} />
              <Shimmer style={{ width: '100%', height: 50, marginBottom: 5 }} />
              <Shimmer style={{ width: '100%', height: 50, marginBottom: 5 }} />
              <Shimmer style={{ width: '100%', height: 50, marginBottom: 5 }} />
              <Shimmer style={{ width: '100%', height: 50, marginBottom: 5 }} />
              <Shimmer style={{ width: '100%', height: 50, marginBottom: 5 }} />
              <Shimmer style={{ width: '100%', height: 50, marginBottom: 5 }} />
            </>
          ) : (
            <>
              <DataTable
                noHeader
                // selectableRows
                pagination
                paginationServer
                className='react-dataTable'
                columns={creditColumn}
                noDataComponent={<div className='nodata-class'>No Record Found</div>}
                sortIcon={<ChevronDown size={10} />}
                paginationComponent={CustomPagination}
                data={credit?.data?.data}
                // onSelectedRowsChange={handleReportChange}
              />
            </>
          )}
        </Card>
      </Card>
    </>
  )
}

export default CreditInfo
