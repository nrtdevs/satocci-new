/* eslint-disable prettier/prettier */
import { Fragment, useEffect } from 'react'
import { Edit2, RefreshCcw } from 'react-feather'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { ButtonGroup, Col, Row } from 'reactstrap'
import { useLoadProductVariantDetailsByIdMutation } from '../../../redux/RTKQuery/ProductRTK'
import { getPath } from '../../../router/RouteHelper'
import { FM, isValid, log } from '../../../utility/helpers/common'
import { truncateText } from '../../../utility/Utils'
import LoadingButton from '../../components/buttons/LoadingButton'
import Header from '../../components/header'
import Shimmer from '../../components/shimmers/Shimmer'
import TooltipLink from '../../components/tooltip/TooltipLink'
import { ProductVariantsType } from './ProductForm'
import ProductDetailsTab from './Tabs/ProductDetailsTab'
import ProductInfoCard from './Tabs/ProductInfoCard'

function ProductDetails() {
    const nav = useNavigate()
    const params = useParams()
    const location = useLocation()
    const tempData: ProductVariantsType = location?.state
    const [loadData, { isLoading, isSuccess, isError, data }] =
        useLoadProductVariantDetailsByIdMutation()

    const loadProduct = () => {
        loadData({ id: params?.id, store_id: tempData?.store_id })
    }
    useEffect(() => {
        if (isValid(params?.id)) {
            log('asdsad', new Date(), 'temp', tempData)
            loadProduct()
        }
    }, [params?.id])

    return (
        <Fragment>
            <Header
                titleCol='10'
                childCol='2'
                goBackTo
                onClickBack={() => nav(-1)}
                // title={tempData?.name ?? data?.payload?.name}
                title={
                    <>
                        {isLoading ? (
                            <span style={{ display: 'inline-block' }}>
                                <Shimmer style={{ width: 500, height: 24 }} />
                            </span>
                        ) : (
                            truncateText(data?.payload?.name ?? tempData?.name, 50)
                        )}
                    </>
                }
            >
                <ButtonGroup className='me-1'>
                    <TooltipLink
                        state={{ ...data?.payload }}
                        title={<>{FM('edit')}</>}
                        to={getPath('product.edit', { id: params?.id })}
                        className='btn btn-primary btn-sm'
                    >
                        <>
                            <Edit2 size='14' />
                        </>
                    </TooltipLink>

                    <LoadingButton
                        tooltip={FM('reload')}
                        size='sm'
                        color='dark'
                        onClick={loadProduct}
                        loading={isLoading}
                    >
                        <RefreshCcw size='14' />
                    </LoadingButton>
                </ButtonGroup>
            </Header>
            <Row className='mb-2 g-1'>
                <Col xl='3' lg='3' xs={{ order: 0 }} md={{ order: 1, size: 4 }}>
                    <ProductInfoCard loading={isLoading} details={data?.payload ?? tempData} />
                </Col>
                <Col xl='9' lg='9' xs={{ order: 1 }} md={{ order: 0, size: 7 }}>
                    <ProductDetailsTab
                        key={`${params?.id}-details`}
                        loadProduct={loadProduct}
                        details={data?.payload}
                        loading={isLoading}
                        step={'1'}
                    />
                </Col>
            </Row>
        </Fragment>
    )
}

export default ProductDetails
