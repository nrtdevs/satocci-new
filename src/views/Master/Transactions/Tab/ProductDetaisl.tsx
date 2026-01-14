/* eslint-disable no-mixed-operators */
import { Link } from 'react-router-dom'
import { Card, CardBody, Table } from 'reactstrap'
import { getPath } from '../../../../router/RouteHelper'
import { FM } from '../../../../utility/helpers/common'
import useUser from '../../../../utility/hooks/useUser'

import { CF, fastLoop } from '../../../../utility/Utils'
import Shimmer from '../../../components/shimmers/Shimmer'
interface EmployeeInfoType {
  details?: any
  loading?: boolean
}
export default function ProductDetails({ details, loading = false }: EmployeeInfoType) {
  const user = useUser()
  const renderData = () => {
    return details?.order_details?.map((item: any, i: any) => {
      return (
        <tr key={item?.order_id}>
          <td className=''>#{i + 1}</td>
          <td>
            <Link
              state={{ ...item?.variant_info }}
              to={getPath('product.details', { id: item?.variant_info?.id })}
              className='d-block'
              id='create-button'
            >
              <u className='text-primary' role={'button'}>
                {item?.variant_info?.sku}
              </u>
            </Link>
          </td>
          <td>{item?.variant_info?.name}</td>

          <td>
            <div className=''>{item?.quantity}</div>
          </td>
          <td>
            <div className=''>{item?.variant_info?.unit_type}</div>
          </td>
          {/* <td className='text-nowrap'>
            <div className='d-flex flex-column'>
              <span className='fw-bolder mb-25'> {Math.floor(10 + Math.random() * 90)}</span>
              <span className='font-small-2 text-muted'>in {col.time}</span>
            </div>
          </td> */}
          {/* <td>{CF(col.revenue)}</td> */}
          <td>{CF({ money: item?.variant_info?.selling_price, currency: user?.currency })}</td>
          <td>{CF({ money: 0, currency: user?.currency })}</td>
          <td>
            {CF({
              money: Number(item?.quantity) * item?.variant_info?.selling_price,
              currency: user?.currency
            })}
          </td>
        </tr>
      )
    })
  }
  function sumSumPrice(array: Array<any>) {
    let re = 0
    fastLoop(array, (a: any, index: number) => {
      re += Number(a?.quantity) * a?.variant_info?.selling_price
    })
    return re
  }

  return (
    <>
      <div>
        {!loading ? (
          <Card className='p-0'>
            <Table>
              <thead>
                <tr>
                  <th>#</th>
                  <th>{FM('sku')}</th>
                  <th>{FM('product-name')}</th>
                  <th>{FM('quantity')}</th>
                  <th>{FM('unit')}</th>
                  <th>{FM('price')}</th>
                  <th>{FM('tax')}</th>
                  <th>{FM('total')}</th>
                </tr>
              </thead>
              <tbody>{renderData()}</tbody>
              <tfoot className=''>
                <tr className='border-top'>
                  <td colSpan={5}></td>
                  <td colSpan={3} className='p-1'>
                    <table className='table'>
                      <tr>
                        <td className=''>
                          <span className='fw-bold'>{FM('sub-total')}</span>
                        </td>
                        <td style={{ width: '1%' }}>:</td>

                        <td className='text-end' style={{ width: '50%' }}>
                          <span className='fw-bolder'>
                            {CF({
                              money: sumSumPrice(details?.order_details),
                              currency: user?.currency
                            })}
                          </span>
                        </td>
                      </tr>
                      <tr className=''>
                        <td className=''>
                          <span className='fw-bold'>{FM('discount')}</span>
                        </td>
                        <td>:</td>

                        <td className='text-end'>
                          <span className='fw-bolder'>
                            {CF({ money: 0, currency: user?.currency })}
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className=''>
                          <span className='fw-bold'>
                            {FM('tax')} ({details?.vat_percent}%)
                          </span>
                        </td>
                        <td>:</td>

                        <td className='text-end'>
                          <span className='fw-bolder'>
                            {CF({ money: details?.vat_amount, currency: user?.currency })}
                          </span>
                        </td>
                      </tr>
                      <tr className=''>
                        <td className=''>
                          <span className='fw-bolder'>{FM('total')}</span>
                        </td>
                        <td>:</td>

                        <td className='text-end'>
                          <span className='fw-bolder'>
                            {CF({ money: details?.paid_amount, currency: user?.currency })}
                          </span>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </tfoot>
            </Table>
          </Card>
        ) : (
          <>
            <Card>
              <CardBody className='p-25'>
                <Shimmer height={30} className='mb-50' />
                <Shimmer height={30} className='mb-50' />
                <Shimmer height={30} className='mb-50' />
                <Shimmer height={30} className='mb-50' />
                <Shimmer height={30} className='mb-50' />
                <Shimmer height={30} className='mb-50' />
              </CardBody>
            </Card>
          </>
        )}
      </div>
    </>
  )
}
