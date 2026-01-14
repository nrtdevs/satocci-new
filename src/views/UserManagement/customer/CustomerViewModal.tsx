/* eslint-disable react/jsx-key */
/* eslint-disable prettier/prettier */
/* eslint-disable eqeqeq */
import { useEffect, useState } from 'react'

import { useSendPromotionTemplateMutation } from '../../../redux/RTKQuery/PromotionTemplateRTK'

import { FM, isValid, isValidUrl, log } from '../../../utility/helpers/common'

import CenteredModal from '../../components/modal/CenteredModal'

import useUserType from '../../../utility/hooks/useUserType'
import { useCustomerShoppingDataMutation } from '../../../redux/RTKQuery/CustomerRTK'
import { Card, CardBody, CardTitle, Col, Row } from 'reactstrap'
import StatsHorizontal from '../../../@core/components/widgets/stats/StatsHorizontal'
import { DollarSign, Truck } from 'react-feather'
import { CF, abbreviateNumber, formatDate } from '../../../utility/Utils'
import Ratings from '../../components/ratings'
import Shimmer from '../../components/shimmers/Shimmer'
import httpConfig from '../../../utility/http/httpConfig'
import useUser from '../../../utility/hooks/useUser'
interface dataType {
    edit?: any
    response?: (e: boolean) => void
    noView?: boolean
    showModal?: boolean
    setShowModal?: (e: boolean) => void
    Component?: any
    loading?: boolean
    children?: any
}

export default function CustomerViewModal<T>(props: T & dataType) {
    const userType = useUserType()
    const user = useUser()
    const [customerShopping, res] = useCustomerShoppingDataMutation()
    const resData = res?.data?.payload
    const tableData = resData?.top_3_bought
    const monthwiseData: any = resData?.months_wise_data ?? {}
    const {
        edit = null,
        noView = false,
        showModal = false,
        setShowModal = () => { },
        Component = 'span',
        response = () => { },
        children = null,
        ...rest
    } = props

    const [open, setOpen] = useState(false)

    const openModal = () => {
        setOpen(true)
    }
    const closeModal = (from = null) => {
        setOpen(false)
        setShowModal(false)
    }

    useEffect(() => {
        if (noView && showModal) {
            openModal()
        }
    }, [noView, showModal])

    useEffect(() => {
        if (isValid(edit?.id)) {
            customerShopping({ id: edit?.id })
        }
    }, [edit])

    const MonthWiseCard = (dataObj: any) => {
        const dates = Object.keys(dataObj).sort() // Sort dates in ascending order

        return (
            <>
                <Card>
                    <h3 className='p-1'>{FM('month-wise-data')}</h3>
                    <table className='table table-striped'>
                        <thead>
                            <tr>
                                <th scope='col'>{FM('month')}</th>
                                <th>{FM('total-spend')}</th>
                                <th>{FM('total-orders')}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {dates?.map((date, index) => (<tr>
                                <th scope='row'>{formatDate(date, "YYYY-MM")}</th>
                                <td>{
                                    (CF({
                                        money: Number(dataObj[date].total_spend) ?? 0,
                                        currency: isValid(user?.currency) ? user?.currency : 'SEK'
                                    }))}</td>
                                <td>{dataObj[date].total_orders}</td>
                            </tr>))}
                        </tbody>
                    </table>
                    <ul></ul>
                </Card >
            </>
        )
    }

    const onSubmit = (e: any) => {
        //   log('onSubmit', e)
    }

    return (
        <>
            {!noView ? (
                <Component role='button' onClick={openModal} {...rest}>
                    {children}
                </Component>
            ) : null}
            <CenteredModal
                scrollControl={true}
                modalClass='modal-xl'
                //  disableSave={res.isLoading}
                loading={res.isLoading}
                open={open}
                hideSave
                handleModal={closeModal}
                //    handleSave={handleSubmit(onSubmit)}
                title={
                    <>
                        <div style={{ overflowWrap: 'anywhere' }}>{FM('customer-details')}</div>
                    </>
                }
            >
                {res?.isLoading ? (
                    <>
                        <Row className='p-2'>
                            <Col md='6' className='mb-2'>
                                <Shimmer height={'200px'} />
                            </Col>
                            <Col md='6' className='mb-2'>
                                <Shimmer height={'200px'} />
                            </Col>
                            <Col md='4' className='mb-2'>
                                <Shimmer height={'200px'} />
                            </Col>
                            <Col md='4' className='mb-2'>
                                <Shimmer height={'200px'} />
                            </Col>
                            <Col md='4' className='mb-2'>
                                <Shimmer height={'200px'} />
                            </Col>
                            <Col md='12'>
                                <Shimmer height={'600px'} />
                            </Col>
                        </Row>
                    </>
                ) : (
                    <div className='p-2'>
                        <Row>
                            <Col md='6'>
                                <StatsHorizontal
                                    icon={<Truck />}
                                    color='success'
                                    stats={abbreviateNumber(resData?.average_monthly_orders)}
                                    statTitle={FM('average-monthly-orders')}
                                />
                            </Col>
                            <Col md='6'>
                                <StatsHorizontal
                                    icon={<DollarSign />}
                                    color='warning'
                                    stats={`${CF({
                                        money: Number(resData?.average_monthly_spend) ?? 0,
                                        currency: isValid(user?.currency) ? user?.currency : 'SEK'
                                    })}`
                                    }
                                    statTitle={FM('average-monthly-spend')}
                                />
                            </Col>
                        </Row>

                        <Row>
                            <Col md="4">
                                {MonthWiseCard(monthwiseData)}
                            </Col>
                            <Col md="8">
                                <Card>
                                    <h3 className='p-1'>{FM('top-3-bought-products')}</h3>
                                    <table className='table table-striped'>
                                        <thead>
                                            <tr>
                                                <th scope='col'>{FM('product-image')}</th>
                                                <th>{FM('product-name')}</th>
                                                <th>{FM('variant-name')}</th>

                                                <th scope='col'>{FM('total-quantity')}</th>
                                                <th scope='col'>{FM('customer-rating')}</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {tableData?.map((item: any, index: number) => (
                                                <tr>
                                                    <th scope='row'>
                                                        <img
                                                            src={isValidUrl(item?.product_image) ? item?.product_imag : `${httpConfig.baseUrl2}${item?.product_image}`}
                                                            height={50}
                                                            width={50}
                                                            alt={item.variant_name}
                                                        />
                                                    </th>
                                                    <td>{item.product_name}</td>
                                                    <td>{item.variant_name}</td>

                                                    <td>{item.total_quantity}</td>
                                                    <td>
                                                        {' '}
                                                        {item?.customer_rating > 0 ? (
                                                            <Ratings rating={item?.customer_rating} />
                                                        ) : (
                                                            FM('no-rating-available')
                                                        )}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                    <ul></ul>
                                </Card>
                            </Col>
                        </Row>
                    </div>
                )}
            </CenteredModal>
        </>
    )
}
