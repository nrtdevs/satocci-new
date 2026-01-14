import { useEffect, useReducer, useState } from 'react'
import { useForm } from 'react-hook-form'
import { LanguageRequestParams } from '../../../redux/RTKQuery/LanguageRTK'
import { useAppDispatch } from '../../../redux/store'
import { FM } from '../../../utility/helpers/common'
import { stateReducer } from '../../../utility/stateReducer'
import { getUserData } from '../../../utility/Utils'
import CenteredModal from '../../components/modal/CenteredModal'
import ProductForm from './ProductForm'

interface dataType {
  edit?: any
  response?: (e: boolean) => void
  noView?: boolean
  showModal?: boolean
  setShowModal?: (e: boolean) => void
  Component?: any
  loading?: boolean
  children?: any

  // rest?: any
}

interface States {
  id?: any
}

export default function ProductEditModal<T>(props: T & dataType) {
  const {
    edit = null,
    noView = false,
    showModal = false,
    setShowModal = () => {},
    Component = 'span',
    response = () => {},
    children = null,
    ...rest
  } = props

  const initState: States = {}

  const reducers = stateReducer<States>
  const [state, setState] = useReducer(reducers, initState)
  const [open, setOpen] = useState(false)

  const dispatch = useAppDispatch()
  const form = useForm<LanguageRequestParams>()
  const user = getUserData()
  const {
    watch,
    formState: { errors },
    handleSubmit,
    control,
    reset
  } = form

  // log('modal', edit)
  const openModal = () => {
    setOpen(true)
  }
  const closeModal = (from = false) => {
    setOpen(false)
    setShowModal(false)
  }
  useEffect(() => {
    if (noView && showModal) {
      openModal()
    }
  }, [noView, showModal])
  return (
    <>
      {!noView ? (
        <Component role='button' onClick={openModal} {...rest}>
          {children}
        </Component>
      ) : null}
      <CenteredModal
        scrollControl={false}
        modalClass='modal-lg'
        disableFooter
        // loading={result.isLoading}
        open={open}
        handleModal={closeModal}
        // handleSave={handleSubmit(handleSave)}
        title={FM('update-product')}
      >
        <div className='p-1'>
          <ProductForm
            noView={noView}
            response={(e) => {
              closeModal()
              response(false)
            }}
            edit={edit}
          />
        </div>
      </CenteredModal>
    </>
  )
}
