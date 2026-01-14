/* eslint-disable prettier/prettier */
import { forwardRef, LegacyRef, useContext, useEffect } from 'react'

import { ThemeColors } from '../../../../../utility/context/ThemeColors'
import { Edit, Gift, MoreVertical, Plus, RefreshCcw, Sliders, Trash2 } from 'react-feather'
import { Badge, Button, ButtonGroup, Form, Input, UncontrolledTooltip } from 'reactstrap'

import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'

import '@styles/react/libs/tables/react-dataTable-component.scss'
import DropDownMenu from '../../../../components/dropdown'
import ConfirmAlert from '../../../../../utility/helpers/ConfirmAlert'
import Header from '../../../../components/header'
import CustomDataTable from '../../../../components/CustomDataTable/CustomDataTable'

import { FM, isValidUrl, log } from '../../../../../utility/helpers/common'
import { getPath } from '../../../../../router/RouteHelper'
import { IconSizes } from '../../../../../utility/Const'
import { useRedux } from '../../../../../redux/useRedux'

import { number } from 'prop-types'
import { emitAlertStatus } from '../../../../../utility/Utils'
import httpConfig from '../../../../../utility/http/httpConfig'

// const BootstrapCheckbox = forwardRef((props, ref: LegacyRef<Input>) => (
//   <div className='form-check'>
//     <Input type='checkbox' ref={ref} {...props} />
//   </div>
// ))
type FormData = {
    id: number | null
    product_name: string
    product_price: number
    product_image: string
    product_attributes: any
    expiry_details: string
    any_restrictions: any
    barcode_info: string
    status: number
}

const ProductManagement = ({ user = null, hours = null }) => {
    const { colors } = useContext(ThemeColors)

    const columns = [
        {
            name: FM('image'),
            minWidth: '100px',
            maxWidth: '70px',
            //sortable: row => row.full_name,
            cell: (row: any) => (
                <img width={30}
                    className='img-fluid rounded img-thumbnail'
                    src={isValidUrl(row?.product_image) ? row.product_image : `${httpConfig.baseUrl2}${row?.product_image}`}
                />
            )
        },
        {
            name: FM('product-name'),
            minWidth: '50px',
            //sortable: row => row.full_name,
            cell: (row: FormData) => (
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
                                <>
                                    {FM('expiry')} : {row?.expiry_details}
                                </>
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
            cell: (row: FormData) => (
                <span className='d-block fw-bold text-truncate'>{row.product_price}/Kr</span>
            )
        },
        {
            name: FM('product-attributes'),
            minWidth: '150px',
            // sortable: row => row.subscription_type,
            cell: (row: FormData) => {
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
            cell: (row: FormData) => {
                return (
                    <>
                        {row?.any_restrictions !== 1 ? (
                            <Badge color={'success'} pill>
                                <>{FM('no-restriction')}</>
                            </Badge>
                        ) : (
                            <Badge color={'danger'} pill>
                                <>{FM('restricted')}</>
                            </Badge>
                        )}
                    </>
                )
            }
        },

        {
            name: FM('actions'),
            allowOverflow: true,
            maxWidth: '10px',
            cell: (row: FormData) => {
                return (
                    <div className='d-flex '>
                        <DropDownMenu
                            direction={'up'}
                            // tooltip={FM(`menu`)}
                            component={<MoreVertical color={colors.primary.main} size={IconSizes.MenuVertical} />}
                            options={[
                                {
                                    icon: <Edit size={14} />,
                                    // to: { pathname: getPath('followups.history', { ip: followup?.ip_id, parent: followup?.id ?? '' }) },
                                    name: FM('edit')
                                },

                                {
                                    icon: <Trash2 size={14} />,
                                    name: (
                                        <ConfirmAlert
                                            item={row}
                                            title={row?.product_name}
                                            text={FM("are-you-sure")}
                                            color='text-warning'
                                            onClickYes={() => emitAlertStatus('success')}
                                            // onSuccessEvent={(e: any) => dispatch(productDelete(e?.id))}
                                            className=''
                                            id={`grid-delete-${row?.id}`}
                                        >
                                            {FM('delete')}
                                        </ConfirmAlert>
                                    )
                                }
                            ]}
                        />
                    </div>
                )
            }
        }
    ]

    return (
        <>
            <Header icon={<Gift size='25' />} title={FM('products')}>
                <ButtonGroup color='dark'>
                    <UncontrolledTooltip target='create-button'>
                        <>{FM('create-new')}</>
                    </UncontrolledTooltip>
                    <Link
                        to={getPath('product.create')}
                        className='btn btn-primary btn-sm'
                        id='create-button'
                    >
                        <Plus size='14' />
                    </Link>

                    <UncontrolledTooltip target='filter'>
                        <>{FM('filter')}</>
                    </UncontrolledTooltip>
                    <Button size='sm' color='secondary' id='filter'>
                        <Sliders size='14' />
                    </Button>

                    <UncontrolledTooltip target='reload'>
                        <>{FM('refresh-data')}</>
                    </UncontrolledTooltip>
                    <Button size='sm' color='dark' id='reload'>
                        <RefreshCcw size='14' />
                    </Button>
                </ButtonGroup>
            </Header>
            <CustomDataTable<any> columns={columns} />
        </>
    )
}

export default ProductManagement
