/* eslint-disable prettier/prettier */
/* eslint-disable no-mixed-operators */
// ** Custom Components

// ** Reactstrap Imports
import { Badge, Card, CardBody, CardHeader, Col, Form, Row, Table } from 'reactstrap'

// ** Icons Imports
import { useEffect, useReducer } from 'react'
import { Info, Square, TrendingDown, TrendingUp, X } from 'react-feather'
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
import { useStripeAllPayoutsMutation } from '../../../redux/RTKQuery/EmailTemplateRTK'
import { useForm } from 'react-hook-form'
import FormGroupCustom from '../../components/formGroupCustom/FormGroupCustom'
import ApiEndpoints from '../../../utility/http/ApiEndpoints'
import { loadDropdown } from '../../../utility/apis/dropdowns'
import LoadingButton from '../../components/buttons/LoadingButton'
import { dateFormatStringToUtc } from './AllTransfers'
import BsPopover from '../../components/popover'


// interface storeProps {
//   storeName?: any;
// }
interface States {
    page?: any

    topProducts?: any
    hasMore: boolean
    per_page_record?: any

    search?: any
    reload?: any
    isAddingNewData?: boolean
}
const StripeAllPayouts = ({
    filterBoth = false,
    loading = new Date().getTime()
}: {

    filterBoth: any
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
    const [loadStripePayouts, { data, isLoading, isSuccess }] = useStripeAllPayoutsMutation()

    useEffect(() => {
        loadStripePayouts({

            jsonData: {
                limit: 100
                //     store_id: isValid(storeId) ? storeId : user?.store_id
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
                                    {CF({ money: col?.application_fee, currency: user?.currency })}
                                </span>
                            </td>
                            {/* <td>

                                {decrypt(col?.balance_transaction)}

                            </td>
                            <td>
                                <span role={'button'}>{decrypt(col?.destination)}</span>
                            </td> */}
                            <td>
                                <span role={'button'}>{col?.source_type}</span>
                            </td>
                            {/* <td>
                                <span role={'button'}>{col?.source_type}</span>
                            </td>
                            <td>
                                <span role={'button'}>{col?.source_type}</span>
                            </td> */}

                            <td>
                                {/* {
                                    col?.status === "paid" ? <Badge pill color='light-success'>{col?.status}</Badge> : <Badge pill color='light-danger'>{col?.status}</Badge>
                                } */}

                                {/* <input
                                    type="checkbox"
                                    checked={col?.status === "paid"}
                                    readOnly
                                    disabled={col?.status !== "paid"}
                                    style={{
                                        accentColor: col?.status === "paid" ? "#28a745" : "#ccc", // Green when "paid", grey otherwise
                                        width: "18px",
                                        height: "18px",
                                        cursor: col?.status === "paid" ? "default" : "not-allowed"
                                    }}
                                /> */}


                                {col?.status === "paid" ? (
                                    <input
                                        type="checkbox"
                                        checked={col?.status === "paid"}
                                        readOnly
                                        disabled={col?.status !== "paid"}
                                        style={{
                                            accentColor: "#28a745", // Red when "paid"
                                            width: "18px",
                                            height: "18px",
                                            cursor: col?.status === "paid" ? "default" : "not-allowed"
                                        }}
                                    />
                                ) : (
                                    <span
                                        style={{
                                            display: 'flex',
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            width: "18px",
                                            height: "18px",
                                            background: "#ed100c",  // Red background
                                            color: 'white',
                                            borderRadius: '4px', // Optional, to make it look like a button
                                            cursor: 'not-allowed'
                                        }}
                                    >
                                        <X size={16} /> {/* Rendering a cross icon */}
                                    </span>
                                )}
                            </td>

                        </tr>
                    )
                })}
            </>
        )
    }

    const onSubmit = (d: any) => {
        loadStripePayouts({
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
                    {/* <CardHeader> */}
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
                                        <LoadingButton color='primary' className='btn btn-primary mt-2' type='submit' loading={false}>
                                            {FM('filter')}
                                        </LoadingButton>
                                        <LoadingButton
                                            className='btn  mt-2 ms-1'
                                            type='button'
                                            onClick={() => {
                                                reset({

                                                    created_gt: undefined,
                                                    created_lt: undefined
                                                })
                                                loadStripePayouts({
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
                    {/* </CardHeader> */}
                    <Table responsive>
                        <thead>
                            <tr>
                                <th>{FM('date')}</th>
                                <th>{FM('amount')}</th>
                                <th>{FM("application-fee")}</th>
                                <th>{FM('source-type')}</th>
                                {/* <th>{FM('users')}</th>
                                <th>{FM('store')}</th> */}
                                {/* <th>{FM('application-fee')}</th> */}

                                <th>{FM('status')}</th>

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
                                                    loadStripePayouts({
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
                </Card >
            )}
        </>
    )
}

export default StripeAllPayouts
