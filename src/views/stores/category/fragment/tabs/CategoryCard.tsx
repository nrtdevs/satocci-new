import { Fragment, useEffect, useReducer } from 'react'
import { useParams } from 'react-router-dom'
import { Card, CardBody } from 'reactstrap'
import { FM, isValid, log } from '../../../../../utility/helpers/common'
import { useLoadCategoryByIdMutation } from '../../../../../redux/RTKQuery/CategoryRTK'
import { stateReducer } from '../../../../../utility/stateReducer'
import Shimmer from '../../../../components/shimmers/Shimmer'
interface States {
  category?: boolean
  subcategory?: boolean
  ip?: boolean
  patient?: boolean
  loading?: boolean
  text?: string
  loadingDetails?: boolean
  list?: any
  user?: any
  cat?: any
}
const CategoryCard = (cat: any, loading: boolean) => {
  const params = useParams()
  const initState: States = {}
  const reducers = stateReducer<States>
  const [state, setState] = useReducer(reducers, initState)
  const [viewCat, { data, isError, isLoading, isSuccess }] = useLoadCategoryByIdMutation()

  log(loading)
  return (
    <Fragment>
      <>
        {!cat?.loading ? (
          <Card className='mb-0 h-100'>
            <CardBody>
              <div className='info-container'>
                <>
                  <ul className='list-unstyled'>
                    <li className='mb-75'>
                      <span className='fw-bolder text-dark me-25'>
                        <>{FM('name')}:</>
                      </span>
                      <span className='d-block'>
                        <>{cat?.name ?? 'N/A'}</>
                      </span>
                    </li>
                    <li className='mb-75'>
                      <span className='fw-bolder text-dark me-25'>
                        <>{FM('total-subcategory')}:</>
                      </span>
                      <span className='d-block'>
                        <>{cat?.subcategories_count ?? 'N/A'}</>
                      </span>
                    </li>
                    <li className='mb-75'>
                      <span className='fw-bolder text-dark me-25'>
                        <>{FM('active-category-offers')}:</>
                      </span>
                      <span className='d-block'>
                        <>{cat?.active_category_offers_count ?? 'N/A'}</>
                      </span>
                    </li>
                    <li className='mb-75'>
                      <span className='fw-bolder text-dark me-25'>
                        <>{FM('total-category-offer')}:</>
                      </span>
                      <span className='d-block'>
                        <>{cat?.category_offers_count ?? 'N/A'}</>
                      </span>
                    </li>
                  </ul>
                </>
              </div>
            </CardBody>
          </Card>
        ) : (
          <Card className='mb-0 h-100'>
            {/* <Shimmer height={200} /> */}
            <CardBody className='mb-0'>
              <div className='info-container'>
                <>
                  <ul className='list-unstyled'>
                    <li className='mb-75'>
                      <Shimmer height={20} />
                    </li>
                    <li className='mb-75'>
                      <Shimmer height={20} />
                    </li>
                    <li className='mb-75'>
                      <Shimmer height={20} />
                    </li>
                    <li className='mb-75'>
                      <Shimmer height={20} />
                    </li>
                    <li className='mb-75'>
                      <Shimmer height={20} />
                    </li>
                    <li className='mb-75'>
                      <Shimmer height={20} />
                    </li>
                    <li className='mb-75'>
                      <Shimmer height={20} />
                    </li>
                    <li>
                      <Shimmer height={20} />
                    </li>
                  </ul>
                  <ul className='list-unstyled border-top mt-2'>
                    <li className='mb-75'>
                      <Shimmer height={20} />
                    </li>
                    <li className='mb-75'>
                      <Shimmer height={20} />
                    </li>

                    <li className='mb-75'>
                      <Shimmer height={20} />
                    </li>

                    <li className=' border-top mt-0'>
                      <Shimmer height={20} />

                      <span className='mt-25'>
                        <Shimmer height={20} />
                      </span>
                    </li>
                  </ul>
                </>
              </div>
            </CardBody>
          </Card>
        )}
      </>
    </Fragment>
  )
}

export default CategoryCard
