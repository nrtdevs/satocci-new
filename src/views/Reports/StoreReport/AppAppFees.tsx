/* eslint-disable prettier/prettier */
/* eslint-disable no-mixed-operators */
// ** Custom Components

// ** Reactstrap Imports
import { Badge, Card, CardBody, CardHeader, Col, Form, Row, Table } from 'reactstrap'

// ** Icons Imports
import { useEffect, useReducer } from 'react'
import { Info, TrendingDown, TrendingUp } from 'react-feather'
import { Link } from 'react-router-dom'
import { useTopAndLeastSellingProductsMutation } from '../../../redux/RTKQuery/ProductRTK'
import { getPath } from '../../../router/RouteHelper'
import { FM, isValid, log } from '../../../utility/helpers/common'
import Hide from '../../../utility/Hide'
import { Permissions } from '../../../utility/Permissions'
import Show from '../../../utility/Show'
import { stateReducer } from '../../../utility/stateReducer'
import { CF, decrypt, formatDate, getUserData, JsonParseValidate } from '../../../utility/Utils'
import Shimmer from '../../components/shimmers/Shimmer'
import { useStripeAllPayoutsMutation, useAllAppFeesMutation } from '../../../redux/RTKQuery/EmailTemplateRTK'
import FormGroupCustom from '../../components/formGroupCustom/FormGroupCustom'
import ApiEndpoints from '../../../utility/http/ApiEndpoints'
import { loadDropdown } from '../../../utility/apis/dropdowns'
import LoadingButton from '../../components/buttons/LoadingButton'
import { useForm } from 'react-hook-form'
import { dateFormatStringToUtc } from './AllTransfers'
import BsPopover from '../../components/popover'


// interface storeProps {
//   storeName?: any;
// }
interface States {
    page?: any

    topProducts?: any

    per_page_record?: any
    hasMore: boolean
    search?: any
    reload?: any
    isAddingNewData?: boolean
}
const AppAppFees = ({

    filterBoth = false,
    loading = new Date().getTime()
}: {
    least?: any
    filterBoth?: any
    loading?: any
}) => {
    const initState: States = {
        page: 1,
        topProducts: [],
        hasMore: false,
        per_page_record: 15,
        search: undefined,
        isAddingNewData: false
        // reload: reloadID
    }
    const reducers = stateReducer<States>
    const [state, setState] = useReducer(reducers, initState)
    // ** vars
    const form = useForm<any>()
    const { handleSubmit, control, reset, setValue, watch, clearErrors } = form
    const user = getUserData()
    const [allAppFees, { data, isLoading, isSuccess }] = useAllAppFeesMutation()

    useEffect(() => {
        allAppFees({

            jsonData: {
                limit: 100
                // store_id: isValid(storeId) ? storeId : user?.store_id
            }
        })
    }, [loading])

    useEffect(() => {
        if (isSuccess) {
            const hasmoreData = data?.payload as any
            setState({
                topProducts: data?.payload?.data,
                hasMore: hasmoreData?.has_more
            })
        }
    }, [isSuccess])


    const renderData = () => {
        return (
            <>
                {state?.topProducts?.map((col: any) => {


                    return (
                        <tr key={col?.ordered_quantity}>
                            <td>
                                <span role={'button'}>{formatDate(dateFormatStringToUtc(col?.created))}</span>
                            </td>
                            <td className='text-primary'>

                                <span>{CF({ money: Number(col?.amount) / 100, currency: col?.currency })}</span>

                            </td>
                            <td>
                                <span>
                                    {CF({ money: Number(decrypt(col?.charge)), currency: user?.currency })}
                                </span>
                            </td>
                            <td>
                                <span>
                                    {CF({ money: Number(decrypt(col?.amount_refund)), currency: col?.currency })}
                                </span>
                            </td>
                            <td className='text-primary'>

                                <span>{col?.account}</span>

                            </td>

                            <td>
                                <BsPopover
                                    title={""}
                                    content={<>
                                        <div className='d-flex flex-column'>
                                            <span className='fw-bold'>{FM('amount')} :<span className='fw-bolder'> {CF({ money: Number(col?.amount) / 100, currency: user?.currency })}</span></span>

                                            <span className='fw-bold'>{FM('balance-transaction')} :<span className='fw-bolder'>{col?.balance_transaction}</span> </span>
                                            <span className='fw-bold'>{FM('date')} : <span className='fw-bolder'> {formatDate(dateFormatStringToUtc(col?.created))}</span></span>
                                            <span className='fw-bold'>{FM('currency')} : <span className='fw-bolder'>{col?.currency}</span></span>

                                            <span className='fw-bold'>{FM('account')} : <span className='fw-bolder'>{col?.account}</span></span>
                                            <span className='fw-bold'>{FM('amount-refunded')} : <span className='fw-bolder'>{col?.amount_refunded}</span></span>
                                            <span className='fw-bold'>{FM('application')} : <span className='fw-bolder'>{col?.application}</span></span>
                                            <span className='fw-bold'>{FM('charge')} : <span className='fw-bolder'>{col?.charge}</span></span>
                                            <span className='fw-bold'>{FM('fee-source')} : <span className='fw-bolder'>{col?.fee_source?.charge}</span></span>
                                            <span className='fw-bold'>{FM('object')} : <span className='fw-bolder'>{col?.object}</span></span>
                                            <span className='fw-bold'>{FM('originating-transaction')} : <span className='fw-bolder'>{col?.originating_transaction}</span></span>

                                        </div>


                                    </>}
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
        allAppFees({
            jsonData: {

                ...d,

                limit: 100
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
                                    <Col md='4' className='mt-25'>
                                        <LoadingButton color="primary" className='btn btn-primary mt-2' type='submit' loading={false}>
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
                                                allAppFees({
                                                    jsonData: {
                                                        limit: 100
                                                    }
                                                })
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
                                <th>{FM('charge')}</th>
                                <th>{FM('amount-refund')}</th>
                                <th>{FM('account')}</th>

                                <th>{FM('details')}</th>
                            </tr>
                        </thead>
                        <tbody>{renderData()}</tbody>
                        <tfoot>
                            {/* add next button */}
                            {
                                state.hasMore === true && (
                                    <tr>
                                        <td colSpan={10}>
                                            <div className='d-flex justify-content-end'>
                                                <LoadingButton color='primary' onClick={() => {
                                                    allAppFees({
                                                        jsonData: {

                                                            limit: 100,
                                                            cursor_object_id: state?.topProducts[state?.topProducts.length - 1]?.id
                                                        }
                                                    })
                                                }} className='d-flex align-items-end'>
                                                    {/* <span className='me-1'>1-15 of 100</span> */}
                                                    {FM("next")}
                                                </LoadingButton>

                                            </div>
                                        </td>
                                    </tr>
                                )
                            }


                        </tfoot>
                    </Table>
                </Card>
            )}
        </>
    )
}

export default AppAppFees
