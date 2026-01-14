import { useEffect, useReducer } from 'react'
import { Edit2, RefreshCcw } from 'react-feather'
import { useNavigate, useParams } from 'react-router-dom'
import { ButtonGroup, Col, Row } from 'reactstrap'
import { useLoadCategoryByIdMutation } from '../../../../redux/RTKQuery/CategoryRTK'
import { UserType } from '../../../../utility/Const'
import { FM, isValid, log } from '../../../../utility/helpers/common'
import Hide from '../../../../utility/Hide'
import useUser from '../../../../utility/hooks/useUser'
import useUserType from '../../../../utility/hooks/useUserType'
import { stateReducer } from '../../../../utility/stateReducer'
import { truncateText } from '../../../../utility/Utils'
import LoadingButton from '../../../components/buttons/LoadingButton'
import Header from '../../../components/header'
import { useNoViewModal } from '../../../components/modal/HandleModal'
import CategoryAddForm from '../CategoryAddForm'
import CategoryCard from './tabs/CategoryCard'
import OffersTab from './tabs/OffersTab'
interface States {
  category?: boolean
  subcategory?: boolean
  lastFetch?: any
  ip?: boolean
  patient?: boolean
  loading?: boolean
  text?: string
  loadingDetails?: boolean
  list?: any
  user?: any
  cat?: any
}
const CategoryDetails = () => {
  const params = useParams()
  const nav = useNavigate()
  const userType = useUserType()
  const user = useUser()
  const initState: States = {
    lastFetch: new Date().getTime()
  }
  const reducers = stateReducer<States>
  const [state, setState] = useReducer(reducers, initState)
  const [showModal, handleModal] = useNoViewModal()

  const [viewCat, { data, isError, isLoading, isSuccess }] = useLoadCategoryByIdMutation()
  useEffect(() => {
    if (isValid(params)) {
      viewCat({
        id: params?.id
      })
    }
  }, [params, state.loading, state.lastFetch])

  useEffect(() => {
    setState({
      list: { ...data?.payload, loading: isLoading }
    })
  }, [isSuccess, state.lastFetch])
  log(!isValid(userType === UserType.Store && `${state?.list?.store_id}` === `${UserType.Admin}`))
  return (
    <>
      <CategoryAddForm
        response={(e: boolean) =>
          setState({
            lastFetch: new Date().getTime()
          })
        }
        edit={state?.list}
        parentId={state?.list?.parent_id}
        showModal={showModal}
        setShowModal={() => handleModal()}
        noView
      />
      <Header onClickBack={() => nav(-1)} goBackTo title={truncateText(state?.list?.name, 50)}>
        <ButtonGroup className='me-1'>
          <Hide
            IF={
              !(
                (userType === UserType.Admin && state?.list?.store_id === UserType.Admin) ||
                (userType === UserType.Store && state?.list?.store_id !== UserType.Admin)
              )
            }
          >
            {state?.list?.store_id === user?.store_id && isLoading === false ? (
              <LoadingButton
                tooltip={FM('edit')}
                size='sm'
                color='primary'
                onClick={() => {
                  handleModal()
                }}
                loading={false}
              >
                <Edit2 size='14' />
              </LoadingButton>
            ) : (
              <></>
            )}
          </Hide>
          <LoadingButton
            tooltip={FM('reload')}
            size='sm'
            color='dark'
            onClick={() => {
              setState({
                lastFetch: new Date().getTime()
              })
            }}
            loading={isLoading}
          >
            <RefreshCcw size='14' />
          </LoadingButton>
        </ButtonGroup>
      </Header>
      <Row className='mb-2 g-1'>
        <Col xl='3' lg='3' xs={{ order: 0 }} md={{ order: 1, size: 4 }}>
          {/* <ProductInfoCard loading={isLoading} details={data?.payload ?? tempData} /> */}
          {/* <ProfileCard /> */}
          <CategoryCard {...state?.list} loading={isLoading} />
        </Col>
        <Col xl='9' lg='9' xs={{ order: 1 }} md={{ order: 0, size: 7 }}>
          <OffersTab
            loadRes={() => {
              setState({
                lastFetch: new Date().getTime()
              })
            }}
            cat={state.list}
            loading={isLoading}
            // viewCat={viewCat}
          />
          {/* <ProfileTab /> */}
          {/* <ProductDetailsTab
            loadProduct={loadProduct}
            details={data?.payload}
            loading={isLoading}
            step={'1'}
          /> */}
        </Col>
      </Row>
    </>
  )
}

export default CategoryDetails
