import { forwardRef, useContext, useState } from 'react'

import { ThemeColors } from '@src/utility/context/ThemeColors'
import {
  ChevronDown,
  Edit,
  Eye,
  Gift,
  MoreVertical,
  Plus,
  RefreshCcw,
  Sliders,
  Trash
} from 'react-feather'
import {
  Badge,
  Button,
  ButtonGroup,
  Card,
  CardBody,
  CardHeader,
  Col,
  Input,
  Row,
  UncontrolledTooltip
} from 'reactstrap'

import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'

import DataTable from 'react-data-table-component'
import ReactPaginate from 'react-paginate'

import '@styles/react/libs/tables/react-dataTable-component.scss'

import { useForm } from 'react-hook-form'
import { getPath } from '../../../router/RouteHelper'
import { IconSizes } from '../../../utility/Const'
import { FM } from '../../../utility/helpers/common'
import DropDownMenu from '../../components/dropdown'
import FormGroupCustom from '../../components/formGroupCustom'
import Header from '../../components/header'

const BootstrapCheckbox = forwardRef((props, ref) => (
  <div className='form-check'>
    <Input type='checkbox' ref={ref} {...props} />
  </div>
))

function ActiveSessionDetails() {
  const { colors } = useContext(ThemeColors)
  const [reload, setReload] = useState(false)
  const [modal, setModal] = useState(false)
  const [currentPage, setCurrentPage] = useState(0)
  const [searchValue, setSearchValue] = useState('')
  const [filteredData, setFilteredData] = useState([])
  const storesData = useSelector((s) => s?.product?.product?.data)
  const { control } = useForm()

  const columns = [
    {
      name: FM('image'),
      minWidth: '100px',
      maxWidth: '70px',
      //sortable: row => row.full_name,
      cell: (row) => (
        <img width={30} className='img-fluid rounded img-thumbnail' src={row.product_image} />
      )
    },
    {
      name: FM('product-name'),
      minWidth: '50px',
      //sortable: row => row.full_name,
      cell: (row) => (
        <div className='d-flex align-items-center'>
          <div className='user-info text-truncate'>
            <Link
              state={{ row }}
              to={getPath('admin.stores.details', { id: row?.id })}
              className='d-block'
              id='create-button'
            >
              <span className='d-block fw-bold text-truncate'>{row.product_name}</span>
              <small className='status-text'>
                {FM('expiry')} : {row?.expiry_details}
              </small>
            </Link>
          </div>
        </div>
      )
    },
    {
      name: FM('price'),
      //sortable: true,
      minWidth: '250px',
      //sortable: row => row.full_name,
      cell: (row) => (
        <div className='d-flex align-items-center'>
          <div className='user-info text-truncate ms-1'>
            <span className='d-block fw-bold text-truncate'>{row.product_price}/INR</span>
            {/* <small className='status-text'>{FM("phone")} : {row.contact_person_number}</small> */}
          </div>
        </div>
      )
    },

    {
      name: FM('product-attributes'),
      minWidth: '150px',
      // sortable: row => row.subscription_type,
      cell: (row) => {
        return (
          <Badge color='primary' pill>
            {row?.product_attributes}
          </Badge>
        )
      }
    },

    {
      name: FM('restriction'),
      minWidth: '150px',
      sortable: (row) => row.status,
      cell: (row) => {
        return (
          <>
            {row?.any_restrictions !== 1 ? (
              <Badge color={'success'} pill>
                {FM('no-restriction')}
              </Badge>
            ) : (
              <Badge color={'danger'} pill>
                {FM('restricted')}
              </Badge>
            )}
          </>
        )
      }
    },

    {
      name: FM('Actions'),
      allowOverflow: true,
      maxWidth: '10px',
      cell: (row) => {
        return (
          <div className='d-flex '>
            <DropDownMenu
              direction='top'
              tooltip={FM(`menu`)}
              component={<MoreVertical color={colors.primary.main} size={IconSizes.MenuVertical} />}
              options={[
                {
                  icon: <Eye size={14} />,
                  // onClick: () => {
                  //   setViewModal(true)
                  //   setEdit(followup)
                  // },
                  name: FM('view')
                },

                {
                  icon: <Edit size={14} />,
                  // to: { pathname: getPath('followups.history', { ip: followup?.ip_id, parent: followup?.id ?? '' }) },
                  name: FM('edit')
                },
                {
                  icon: <Trash size={14} />,
                  // to: { pathname: getPath('followups.history', { ip: followup?.ip_id, parent: followup?.id ?? '' }) },
                  name: FM('move-to-trash')
                }
                // {
                //   IF: Permissions.ipFollowUpsSelfDelete,
                //   icon: <Trash2 size={14} />,
                //   name: <ConfirmAlert
                //     item={followup}
                //     title={FM("delete-this", { name: followup?.title })}
                //     color='text-warning'
                //     onClickYes={() => deleteFollowUp({ id: followup?.id })}
                //     onSuccessEvent={(item) => dispatch(followupDelete(item?.id))}
                //     className=""
                //     id={`grid-delete-${followup?.id}`}>
                //     {FM("delete")}
                //   </ConfirmAlert>
                // }
              ]}
            />
          </div>
        )
      }
    }
  ]

  const handleModal = () => setModal(!modal)

  // ** Function to handle filter
  const handleFilter = (e) => {
    const value = e.target.value
    let updatedData = []
    setSearchValue(value)

    const status = {
      1: { title: 'Current', color: 'light-primary' },
      2: { title: 'Professional', color: 'light-success' },
      3: { title: 'Rejected', color: 'light-danger' },
      4: { title: 'Resigned', color: 'light-warning' },
      5: { title: 'Applied', color: 'light-info' }
    }

    if (value.length) {
      updatedData = storesData.filter((item) => {
        const startsWith =
          item.full_name.toLowerCase().startsWith(value.toLowerCase()) ||
          item.post.toLowerCase().startsWith(value.toLowerCase()) ||
          item.email.toLowerCase().startsWith(value.toLowerCase()) ||
          item.age.toLowerCase().startsWith(value.toLowerCase()) ||
          item.salary.toLowerCase().startsWith(value.toLowerCase()) ||
          item.start_date.toLowerCase().startsWith(value.toLowerCase()) ||
          status[item.status].title.toLowerCase().startsWith(value.toLowerCase())

        const includes =
          item.full_name.toLowerCase().includes(value.toLowerCase()) ||
          item.post.toLowerCase().includes(value.toLowerCase()) ||
          item.email.toLowerCase().includes(value.toLowerCase()) ||
          item.age.toLowerCase().includes(value.toLowerCase()) ||
          item.salary.toLowerCase().includes(value.toLowerCase()) ||
          item.start_date.toLowerCase().includes(value.toLowerCase()) ||
          status[item.status].title.toLowerCase().includes(value.toLowerCase())

        if (startsWith) {
          return startsWith
        } else if (!startsWith && includes) {
          return includes
        } else return null
      })
      setFilteredData(updatedData)
      setSearchValue(value)
    }
  }

  // ** Function to handle Pagination
  const handlePagination = (page) => {
    setCurrentPage(page.selected)
  }

  // ** Custom Pagination
  const CustomPagination = () => (
    <div className='d-flex p-1 align-items-center border-top'>
      <div className='flex-1 d-flex align-items-center'>
        <div className='me-2'> Per Page </div>

        <FormGroupCustom
          noGroup
          noLabel
          type={'select'}
          control={control}
          name=''
          className='flex-1'
          value={4}
          options={[
            {
              label: 6,
              value: 6
            }
          ]}
        />
        <div className='ms-2'> Showing 6 of 400 Records </div>
      </div>
      <ReactPaginate
        previousLabel=''
        nextLabel=''
        forcePage={currentPage}
        onPageChange={(page) => handlePagination(page)}
        pageCount={
          searchValue.length
            ? Math.ceil(filteredData.length / 7)
            : Math.ceil(storesData.length / 7) || 1
        }
        breakLabel='...'
        pageRangeDisplayed={2}
        marginPagesDisplayed={2}
        activeClassName='active'
        pageClassName='page-item'
        breakClassName='page-item'
        nextLinkClassName='page-link'
        pageLinkClassName='page-link'
        breakLinkClassName='page-link'
        previousLinkClassName='page-link'
        nextClassName='page-item next-item'
        previousClassName='page-item prev-item'
        containerClassName='pagination react-paginate separated-pagination pagination-sm pe-2 m-0 p-0'
      />
    </div>
  )

  return (
    <>
      <Header icon={<Gift size='25' />} title={FM('products')}>
        <ButtonGroup color='dark'>
          <UncontrolledTooltip target='create-button'>{FM('create-new')}</UncontrolledTooltip>
          <Link
            to={getPath('product.create')}
            className='btn btn-primary btn-sm'
            id='create-button'
          >
            <Plus size='14' />
          </Link>

          <UncontrolledTooltip target='filter'>{FM('filter')}</UncontrolledTooltip>
          <Button.Ripple size='sm' color='secondary' id='filter'>
            <Sliders size='14' />
          </Button.Ripple>

          <UncontrolledTooltip target='reload'>{FM('refresh-data')}</UncontrolledTooltip>
          <Button.Ripple size='sm' color='dark' id='reload'>
            <RefreshCcw size='14' />
          </Button.Ripple>
        </ButtonGroup>
      </Header>
      <Card className='p-0'>
        <CardHeader className='p-1'>
          <div className='flex-1'>
            <Row>
              <Col md='9'>
                <Button.Ripple color='secondary' outline>
                  Actions
                </Button.Ripple>
              </Col>
              <Col md='3'>
                <Input type='text' placeholder='Search...' />
              </Col>
            </Row>
          </div>
        </CardHeader>
        <CardBody className='p-0'>
          <div className='react-dataTable react-dataTable-selectable-rows'>
            <DataTable
              noHeader
              pagination
              selectableRows
              columns={columns}
              paginationPerPage={7}
              className='react-dataTable'
              sortIcon={<ChevronDown size={10} />}
              paginationComponent={CustomPagination}
              paginationDefaultPage={currentPage + 1}
              selectableRowsComponent={BootstrapCheckbox}
              data={searchValue.length ? filteredData : storesData}
            />
          </div>
        </CardBody>
      </Card>
    </>
  )
}

export default ActiveSessionDetails
