/* eslint-disable prettier/prettier */
import { useEffect, useReducer, useState } from 'react'
import { set, useFieldArray, useForm } from 'react-hook-form'
import { Badge, Col, InputGroupText, Row } from 'reactstrap'
import {
  useActionReturnMutation,
  useCreateOrUpdateReturnMutation,
  useGetAmountReturnMutation
} from '../../../../redux/RTKQuery/ReturnOrderRTK'
import { Permissions } from '../../../../utility/Permissions'
import Show, { Can } from '../../../../utility/Show'
import { SuccessToast, amtFormat, fillObject, setValues } from '../../../../utility/Utils'

import { FM, isValid, isValidArray, log } from '../../../../utility/helpers/common'
import useUser from '../../../../utility/hooks/useUser'

import { stateReducer } from '../../../../utility/stateReducer'
import FormGroupCustom from '../../../components/formGroupCustom/FormGroupCustom'
import CenteredModal from '../../../components/modal/CenteredModal'

import BsTooltip from '../../../components/tooltip'
import { StoreParamsType } from '../../../stores/fragment/AddUpdateForm'

interface States {
  lastRefresh?: any
  category?: any
  subcategory?: any
  language?: any
  loading?: boolean
  languageList?: any
  active?: any
  page?: any
  per_page_record?: any
  search?: any
}

interface dataType {
  edit?: any
  response?: (e: boolean) => void
  noView?: boolean
  showModal?: boolean
  setShowModal?: (e: boolean) => void
  Component?: any
  loading?: boolean
  children?: any
  exportType?: any
  // rest?: any
}

const AcceptRejectOrderModal = ({
  edit = null,
  response = () => {},
  noView = false,
  showModal = false,
  setShowModal = () => {},
  Component = 'span',
  loading = false,
  children = null,
  exportType = 'returnOrder',
  ...rest
}: dataType) => {
  const {
    register,
    formState: { errors },
    handleSubmit,
    setValue,
    control,
    getValues,
    watch,
    reset
  } = useForm<StoreParamsType>()

  const initState: States = {
    lastRefresh: new Date().getTime(),
    category: [],
    subcategory: [],
    language: null,
    loading: false,
    languageList: [],
    active: '1',
    page: 1,
    per_page_record: 100,
    search: undefined
  }
  const reducers = stateReducer<States>
  const [state, setState] = useReducer(reducers, initState)
  const [open, setOpen] = useState(showModal)

  const [loadingSample, setLoadingSample] = useState(false)
  const [orderDataRes, setOrderDataRes] = useState<any>()
  const user = useUser()

  // const [createReturn, result] = useCreateOrUpdateReturnMutation()
  const [getAmount, res] = useGetAmountReturnMutation()
  const [returnAction, returnResult] = useActionReturnMutation()

  const openModal = () => {
    setOpen(true)
  }

  const [formData, setFormData] = useState({
    order_id: '',
    reason_for_return: '',
    return_items: [] as any[]
  })

  const submitReturn = (d: any) => {
    let returnItems: any[] = []
    if (exportType === 'returnApprove') {
      returnItems = d?.order?.map((item: any) => {
        if (item?.allows_return === 1) {
          return {
            order_item_return_id: item?.id,
            verified_quantity: item?.return_quantity,
            rejected_quantity: item?.total_return_quantity - item?.return_quantity,
            reason_for_return_rejection: item?.reason_for_return_rejection ?? ''
          }
        } else if (item?.isChild > 0) {
          const rejected_quantity =
            Number(item?.total_return_quantity - item?.return_quantity) > 0
              ? item?.total_return_quantity - item?.return_quantity
              : 0
          return {
            order_item_return_id: item?.id,
            verified_quantity: item?.isChild,
            rejected_quantity,
            reason_for_return_rejection: item?.reason_for_return_rejection ?? ''
          }
        }
      })
    } else if (exportType === 'returnReject') {
      // log('returnPayload', d, exportType)
      returnItems = d?.order?.map((item: any) => {
        if (item?.allows_return === 1) {
          return {
            order_item_return_id: item?.id,
            verified_quantity: item?.total_return_quantity - item?.return_quantity,
            rejected_quantity: item?.return_quantity,
            reason_for_return_rejection: item?.reason_for_return_rejection ?? ''
          }
        } else if (item?.isChild > 0) {
          const verified_quantity =
            Number(item?.total_return_quantity - item?.return_quantity) > 0
              ? item?.total_return_quantity - item?.return_quantity
              : 0
          return {
            order_item_return_id: item?.id,
            verified_quantity,
            rejected_quantity: item?.isChild,
            reason_for_return_rejection: item?.reason_for_return_rejection ?? ''
          }
        }
      })
    }
    if (isValidArray(returnItems)) {
      //if return item include null index then remove it
      returnItems = returnItems.filter((item) => item !== undefined)

      log('returnItems', returnItems)
      returnAction({
        jsonData: {
          order_return_id: edit?.id,
          return_items: returnItems
        }
      })
    }
  }

  useEffect(() => {
    setOrderDataRes(edit)
  }, [edit, watch('order')])

  // Show/Hide Modal
  useEffect(() => {
    if (showModal) setOpen(true)
    if (!showModal) reset()
  }, [showModal])

  const closeModal = (from = false) => {
    setOpen(false)
    setShowModal(false)
  }
  useEffect(() => {
    if (returnResult.isSuccess) {
      SuccessToast(returnResult?.data?.message)
      reset() // Reset form
      response(returnResult.isSuccess)
      closeModal()
    }
  }, [returnResult])

  useEffect(() => {
    orderDataRes?.order_item_returns?.forEach((item: any) => {
      if (item?.return_subtotal === 0) {
        const childIndex = orderDataRes?.order_item_returns?.findIndex(
          (od: any) => od.id === item.id
        )
        const parentIndex = orderDataRes?.order_item_returns?.findIndex(
          (od: any) => od.id === item?.free_with?.id
        )
        const parentAllowsReturn = watch(`order.${parentIndex}.allows_return`)
        log(watch(`order.${parentIndex}.allows_return`), 'parentAllowsReturn')
        if (watch(`order.${parentIndex}.allows_return`)) {
          setValue(`order.${childIndex}.allows_return`, parentAllowsReturn)
          // setValue(`order.${childIndex}.return_quantity`, item?.return_quantity);
        }
      }
    })
  }, [orderDataRes, watch('order'), setValue])
  log('editData', orderDataRes)

  const renderData = () => {
    return orderDataRes?.order_details?.map((item: any, i: any) => {
      // State variables for subtotal, VAT amount, and returned amount
      const subtotal = Number(item?.max_retail_price)
      // Original total price
      const quantity = item?.quantity // Quantity of the item

      // Function to calculate final returned price
      const calculateFinalReturnedPrice = () => {
        const unitPrice = subtotal / quantity // Price per unit
        let finalReturnedPrice = 0
        if (isValid(watch(`order.${i}.allows_return`), 0)) {
          finalReturnedPrice = subtotal * Number(watch(`order.${i}.return_quantity`)) // Final returned price
        }
        return finalReturnedPrice.toFixed(2) // Rounding to 2 decimal places
      }

      // Call the calculateFinalReturnedPrice function to get the calculated value
      const finalReturnedPrice: any = calculateFinalReturnedPrice()
      const isDisableTrue = () => {
        let re = false
        if (isValid(item?.parent_id)) {
          re = true
        } else if (orderDataRes?.order_details?.some((od: any) => od.parent_id === item.id)) {
          re = true
        } else if (!isValid(watch(`order.${i}.allows_return`), 0) && finalReturnedPrice === 0.0) {
          re = true
        }
        return re
      }

      const itemQuantity = Number(item?.quantity) ?? 0 // Quantity of the item
      const returnQuantity = Number(item?.returned_quantity) ?? 0
      const retQuantity = () => {
        if (itemQuantity === returnQuantity) {
          return 0
        } else if (itemQuantity > returnQuantity) {
          return itemQuantity - returnQuantity
        } else {
          return returnQuantity
        }
      }
      //   log("finalReturnedPrice", finalReturnedPrice, watch(`order.${i}.allows_return`))
      const childIndex = orderDataRes?.order_details?.findIndex((od: any) => od.id === item.id)
      const parentIndex = orderDataRes?.order_details?.findIndex(
        (od: any) => od.id === item.parent_id
      )
      return (
        <div key={i}>
          <FormGroupCustom
            noLabel
            noGroup
            key={`allows_return-${i}`}
            tooltip={FM('allows-return')}
            name={`order.${i}.id`}
            label={FM('allows-return')}
            type={'hidden'}
            defaultValue={item?.id}
            control={control}
            rules={{ required: false }}
          />
          <Row>
            <Col md='8'>
              <FormGroupCustom
                label={FM('return-item-with-name', {
                  name: item?.product_info?.name
                })}
                defaultValue={
                  //   item?.quantity === item?.return_quantity
                  //     ? item?.quantity
                  //     : item?.quantity - item?.return_quantity
                  retQuantity()
                }
                key={`order.${i}.return_quantity`}
                name={`order.${i}.return_quantity`}
                isDisabled={isDisableTrue()}
                type={'number'}
                placeholder={FM('return-quantity')}
                className='mb-1'
                control={control}
                rules={{
                  required: watch(`order.${i}.allows_return`) === 1
                }}
                prepend={
                  <InputGroupText className='p-25'>
                    <BsTooltip title={FM('allows-return')}>
                      <FormGroupCustom
                        key={`order.${i}.allows_return-${watch(
                          `order.${parentIndex}.allows_return`
                        )}`}
                        noLabel
                        label={FM('return-item-with-name', {
                          name: item?.product_info?.name
                        })}
                        // defaultValue={isParentChecked()}

                        isDisabled={isValid(item?.parent_id)}
                        name={`order.${i}.allows_return`}
                        type={'checkbox'}
                        control={control}
                        className={'ms-1 me-25'}
                        rules={{
                          required: false
                        }}
                      />
                    </BsTooltip>
                  </InputGroupText>
                }
              />
              <p className='fw-bold'>
                {FM('max-return-with-quantity', {
                  quantity: retQuantity()
                })}
              </p>
            </Col>
            <Col md='4'>
              <Show IF={isValid(watch(`order.${i}.allows_return`), 0)}>
                <p className='fw-bold'>{FM('purchased-price')} </p>
                <code className='fw-bolder'>{finalReturnedPrice}</code>
              </Show>
            </Col>
            <Show IF={exportType === 'reject'}>
              <Col md='12'>
                <FormGroupCustom
                  key={`order.${i}.reason_for_return_rejection`}
                  placeholder={FM('reason-for-return')}
                  type='text'
                  name={`order.${i}.reason_for_return_rejection`}
                  label={FM('reason-for-return')}
                  className='mb-2'
                  control={control}
                  rules={{ required: isValid(watch(`order.${i}.allows_return`), 0) }}
                />
              </Col>
            </Show>

            <hr />
          </Row>
        </div>
      )
    })
  }

  // {
  //     "order_return_id":282,
  //     "return_items":[
  //         {
  //             "order_item_return_id":300,
  //             "verified_quantity":"1",
  //             "rejected_quantity":"0",
  //             "reason_for_return_rejection":""
  //         }
  //     ]
  // }

  const renderActionData = () => {
    return edit?.order_item_returns?.map((item: any, i: any) => {
      log('itemReturn', item)
      // State variables for subtotal, VAT amount, and returned amount
      const subtotal = Number(item?.return_subtotal)
      // Original total price
      const quantity = Number(item?.return_quantity) // Quantity of the item

      // Function to calculate final returned price
      const calculateFinalReturnedPrice = () => {
        const finalReturnedPrice = subtotal * Number(watch(`order.${i}.return_quantity`)) // Final returned price
        return finalReturnedPrice.toFixed(2) // Rounding to 2 decimal places
      }

      // Call the calculateFinalReturnedPrice function to get the calculated value
      const finalReturnedPrice: any = calculateFinalReturnedPrice()

      log('finalReturnedPrice', finalReturnedPrice)

      //  setValue(`order.${i}.return_quantity`, Number(finalReturnedPrice))\

      // Function to check how much quantity can be returned
      const returnQuantity = Number(item?.return_quantity) ?? 0
      const retQuantity = () => {
        return returnQuantity
      }
      const remainingQuantity =
        Number(watch(`order.${i}.total_return_quantity`)) -
        Number(watch(`order.${i}.return_quantity`))
      const parentIndex = edit?.order_item_returns?.findIndex(
        (od: any) => od?.id === item?.free_with?.id
      )
      const childIndex = edit?.order_item_returns?.findIndex((od: any) => od.id === item.id)
      const isTrueResonforReturn = () => {
        let re = false
        if (exportType === 'returnApprove' && remainingQuantity > 0) {
          re = true
        } else if (isValid(watch(`order.${i}.allows_return`), 0) && exportType === 'returnReject') {
          re = true
        }
        return re
      }

      const isCheckedChild = () => {
        if (isValid(watch(`order.${parentIndex}.allows_return`), 0)) {
          return 1
        }
      }

      return (
        <div key={i}>
          <FormGroupCustom
            noLabel
            noGroup
            // key={`allows_return-${i}`}
            key={`allows_return-${i}`}
            tooltip={FM('allows-return')}
            name={`order.${i}.isChild`}
            label={FM('allows-return')}
            type={'hidden'}
            defaultValue={isValid(item?.free_with?.id) ? item?.return_quantity : 0}
            control={control}
            rules={{ required: false }}
          />

          <FormGroupCustom
            noLabel
            noGroup
            // key={`allows_return-${i}`}
            key={`allows_return-${i}`}
            tooltip={FM('allows-return')}
            name={`order.${i}.id`}
            label={FM('allows-return')}
            type={'hidden'}
            defaultValue={item?.id}
            control={control}
            rules={{ required: false }}
          />
          <FormGroupCustom
            noLabel
            noGroup
            // key={`allows_return-${i}`}
            key={`allows_return-${i}`}
            tooltip={FM('allows-return')}
            name={`order.${i}.total_return_quantity`}
            label={FM('allows-return')}
            type={'hidden'}
            defaultValue={retQuantity()}
            control={control}
            rules={{ required: false }}
          />
          <Row>
            <Col md='8'>
              <FormGroupCustom
                key={`order.${i}.allows_return-${watch(`order.${parentIndex}.allows_return`)}`}
                label={FM('return-item-with-name', {
                  name: item?.product_variant?.name
                })}
                defaultValue={retQuantity()}
                name={`order.${i}.return_quantity`}
                isDisabled={item?.return_subtotal === 0}
                type={'number'}
                placeholder={FM('return-quantity')}
                className='mb-1'
                control={control}
                rules={{
                  required: true
                }}
                prepend={
                  <InputGroupText className='p-25'>
                    <BsTooltip title={FM('allows-return')}>
                      <FormGroupCustom
                        key={`order.${i}.allows_return`}
                        noLabel
                        label={FM('return-item-with-name', {
                          name: item?.product_info?.name
                        })}
                        defaultValue={isCheckedChild()}
                        isDisabled={item?.return_subtotal === 0}
                        name={`order.${i}.allows_return`}
                        type={'checkbox'}
                        control={control}
                        className={'ms-1 me-25'}
                        rules={{
                          required: false
                        }}
                      />
                    </BsTooltip>
                  </InputGroupText>
                }
              />
            </Col>

            <Col md='4'>
              <Show IF={isValid(watch(`order.${i}.allows_return`), 0)}>
                <p className='fw-bolder text-dark'>{FM('refund-amount')} </p>
                <code className='fw-bolder'>{finalReturnedPrice}</code>
              </Show>
            </Col>

            <Show IF={item?.return_subtotal !== 0}>
              <Col md='8'>
                {' '}
                <FormGroupCustom
                  key={`order.${i}.reason_for_return_rejection`}
                  placeholder={
                    exportType === 'returnReject'
                      ? FM('reason-for-rejection')
                      : FM('reason-for-remaing-quantity-rejection')
                  }
                  type='text'
                  name={`order.${i}.reason_for_return_rejection`}
                  label={
                    exportType === 'returnReject'
                      ? FM('reason-for-rejection')
                      : FM('reason-for-remaing-quantity-rejection')
                  }
                  className='mb-1'
                  control={control}
                  rules={{
                    required: isTrueResonforReturn()
                  }}
                />
              </Col>
            </Show>
            <Col md='4'>
              <Show
                IF={isValid(watch(`order.${i}.allows_return`), 0) && exportType === 'returnReject'}
              >
                <p className='fw-bolder text-dark'>{FM('remaining-verify-quantity')} </p>
                <Badge color='light-success' className='fw-bolder'>
                  {remainingQuantity}
                </Badge>
              </Show>
              <Show
                IF={isValid(watch(`order.${i}.allows_return`), 0) && exportType === 'returnApprove'}
              >
                <p className='fw-bolder text-dark'>{FM('remaining-reject-quantity')} </p>
                <Badge color='light-danger' className='fw-bolder'>
                  {remainingQuantity}
                </Badge>
              </Show>
            </Col>
            <Show IF={isValid(item?.reason_for_return)}>
              <Col md='12'>
                <p className='fw-bolder mb-0 text-dark'>{`${FM('reason-for-return')}   :`} </p>
                <Badge color='light-danger' className='d-block mb-1'>
                  {' '}
                  {item?.reason_for_return}
                </Badge>
              </Col>
            </Show>
            <hr />
          </Row>
        </div>
      )
    })
  }

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
        // disableFooter
        // loading={result.isLoading}
        open={open}
        handleModal={closeModal}
        handleSave={handleSubmit(submitReturn)}
        done={
          exportType === 'returnApprove'
            ? FM('approve')
            : exportType === 'returnReject'
            ? FM('reject')
            : exportType === 'approve'
            ? FM('approve')
            : FM('reject')
        }
        title={
          exportType === 'returnApprove'
            ? FM('approve-return-order')
            : exportType === 'returnReject'
            ? FM('reject-return-order')
            : exportType === 'approve'
            ? FM('approve-return-order')
            : FM('reject-return-order')
        }
      >
        <div className='p-2'>
          <Show IF={exportType === 'returnApprove'}>
            <Badge color='light-primary' className='d-block mb-2'>
              {FM('if-you-select-quantity-to-verify-then-remaining-quantity-will-be-rejected')}
            </Badge>
            <>{renderActionData()}</>
          </Show>
          <Show IF={exportType === 'returnReject'}>
            <Badge color='light-warning' className='d-block mb-2'>
              {FM('if-you-select-quantity-to-reject-then-remaining-quantity-will-be-verified')}
            </Badge>
            <>{renderActionData()}</>
          </Show>
          <Show IF={exportType === 'approve'}>
            <>{renderData()}</>
          </Show>
          <Show IF={exportType === 'reject'}>
            <>{renderData()}</>
          </Show>
        </div>
      </CenteredModal>
    </>
  )
}

export default AcceptRejectOrderModal
