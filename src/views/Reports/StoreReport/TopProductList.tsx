/* eslint-disable prettier/prettier */
/* eslint-disable no-mixed-operators */
// ** Custom Components

// ** Reactstrap Imports
import { Card, CardBody, CardHeader, Table } from 'reactstrap'

// ** Icons Imports
import { useEffect, useReducer } from 'react'
import { TrendingDown, TrendingUp } from 'react-feather'
import { Link } from 'react-router-dom'
import { useTopAndLeastSellingProductsMutation } from '../../../redux/RTKQuery/ProductRTK'
import { getPath } from '../../../router/RouteHelper'
import { FM, isValid } from '../../../utility/helpers/common'
import Hide from '../../../utility/Hide'
import { Permissions } from '../../../utility/Permissions'
import Show from '../../../utility/Show'
import { stateReducer } from '../../../utility/stateReducer'
import { CF, getUserData, JsonParseValidate } from '../../../utility/Utils'
import Shimmer from '../../components/shimmers/Shimmer'

// interface storeProps {
//   storeName?: any;
// }
interface States {
    page?: any
    topProducts?: any
    per_page_record?: any
    search?: any
    reload?: any
    isAddingNewData?: boolean
}
const TopProductList = ({
    least = 1,
    storeId = null,
    loading = new Date().getTime()
}: {
    least?: any
    storeId: any
    loading?: any
}) => {
    const initState: States = {
        page: 1,
        topProducts: [],
        per_page_record: 15,
        search: undefined,
        isAddingNewData: false
        // reload: reloadID
    }
    const reducers = stateReducer<States>
    const [state, setState] = useReducer(reducers, initState)
    // ** vars
    const user = getUserData()
    const [loadProducts, { data, isLoading, isSuccess }] = useTopAndLeastSellingProductsMutation()

    useEffect(() => {
        loadProducts({
            least,
            jsonData: {
                store_id: isValid(storeId) ? storeId : user?.store_id
            }
        })
    }, [storeId, loading])

    useEffect(() => {
        if (isSuccess) {
            setState({
                topProducts: data?.payload
            })
        }
    }, [isSuccess])

    const colorsArr = {
        Technology: 'light-primary',
        Grocery: 'light-success',
        Fashion: 'light-warning'
    }

    const renderData = () => {
        return (
            <>
                {state.topProducts?.map((col: any) => {
                    const variantInfo = JsonParseValidate(col?.variant_info)
                    const IconTag = col?.salesUp ? (
                        <TrendingUp size={15} className='text-success' />
                    ) : (
                        <TrendingDown size={15} className='text-danger' />
                    )

                    return (
                        <tr key={col?.ordered_quantity}>
                            <td className='text-primary'>
                                <Show IF={Permissions?.productRead}>
                                    <Link
                                        state={{ ...variantInfo?.product }}
                                        to={getPath('product.list.variants', { id: variantInfo?.product_id })}
                                        className='d-block'
                                        id='create-button'
                                    >
                                        <u role={'button'}>{variantInfo?.name}</u>
                                    </Link>
                                </Show>
                                <Hide IF={Permissions?.productRead}>
                                    <span>{variantInfo?.name}</span>
                                </Hide>
                            </td>
                            <td>
                                <span>
                                    {CF({ money: variantInfo?.max_retail_price, currency: user?.currency })}
                                </span>
                            </td>
                            <td>
                                <span role={'button'}>
                                    {CF({ money: variantInfo?.selling_price, currency: user?.currency })}
                                </span>
                            </td>
                            <td>
                                <span role={'button'}>{variantInfo?.sku}</span>
                            </td>
                            <td>
                                <span role={'button'}>{col?.ordered_quantity}</span>
                            </td>
                        </tr>
                    )
                })}
            </>
        )
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
                    <CardHeader>
                        {least === 1 ? FM('least-selling-products') : FM('top-selling-products')}
                    </CardHeader>
                    <Table responsive>
                        <thead>
                            <tr>
                                <th>{FM('name')}</th>
                                <th>{FM('max-retail-price')}</th>
                                <th>{FM('price')}</th>
                                {/* <th>Transaction Id</th> */}
                                <th>{FM('sku')}</th>
                                <th>{FM('total-orders')}</th>

                                {/* <th>Store Number</th> */}
                            </tr>
                        </thead>
                        <tbody>{renderData()}</tbody>
                    </Table>
                </Card>
            )}
        </>
    )
}

export default TopProductList
