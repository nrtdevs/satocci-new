/* eslint-disable prettier/prettier */
import { useEffect, useReducer, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useParams } from 'react-router-dom'

import { useLanguageListMutation } from '../../../redux/RTKQuery/LanguageRTK'
import { FM, isValid, isValidArray, log } from '../../../utility/helpers/common'
import Hide from '../../../utility/Hide'
import Show from '../../../utility/Show'
import { stateReducer } from '../../../utility/stateReducer'
import { createConstSelectOptions, getUserData } from '../../../utility/Utils'
import FormGroupCustom from '../../components/formGroupCustom/FormGroupCustom'
import SideModal from '../../components/sideModal/sideModal'
import { UserType, epmType, numberShouldBe, ratingType } from '../../../utility/Const'
import useUserType from '../../../utility/hooks/useUserType'
import ApiEndpoints from '../../../utility/http/ApiEndpoints'
import { loadDropdown } from '../../../utility/apis/dropdowns'
import { store } from '../../../redux/store'
// import { StoreParamsType } from '../../fragment/AddUpdateForm'

interface States {
    category?: any
    subcategory?: any
    language?: any
    loading?: boolean
    languageList?: any
    active?: any
    page?: any
    per_page_record?: any
    search?: any
    subscription_type?: any
}

interface propsType {
    userType?: any
    show?: boolean
    handleFilterModal?: any

    setFilterData?: any
    filterData?: any
}
const CustomerFilter = ({
    userType = null,

    show = false,
    handleFilterModal = () => { },
    setFilterData = () => { },
    filterData = {}
}: propsType) => {
    const {
        register,
        formState: { errors },
        handleSubmit,
        control,
        getValues,
        watch,
        reset
    } = useForm<any>()
    const initState: States = {
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
    const [open, setOpen] = useState(show)
    const params = useParams()
    const parentId = params?.id
    const userTypse = useUserType()
    const user = getUserData()

    log(parentId, 'paremrte')
    /////lANGUAGE
    const [loadLanguage, languageResult] = useLanguageListMutation()

    useEffect(() => {
        if (userType === 1) {
            loadLanguage({ jsonData: { name: state?.search } })
        }
    }, [userType === 1])
    useEffect(() => {
        if (languageResult?.isSuccess && userType === 1) {
            setState({
                languageList: languageResult?.data?.payload
            })
        }
        if (user?.user_type_id === 2) {
            setState({
                languageList: user?.languages
            })
        }
    }, [languageResult?.data, isValidArray(user?.languages)])
    /////lANGUAGE

    const submitFilter = (d: any) => {
        log(d, 'd')
        setFilterData({
            ...d,
            store_id: d?.store_id?.value,
            product_id: d?.product_id?.value,
            product_variant_id: d?.product_variant_id?.value,
            amount_should_be: d?.amount_should_be?.value,
            rating_should_be: d?.rating_should_be?.value,
            quantity_should_be: d?.quantity_should_be?.value,
            quantity: d?.quantity,
            rating: d?.rating?.value,
            amount: d?.amount
        })
        // setTimeout(() => {
        //   setOpen(show)
        //   reset()
        // }, 1000)
    }

    // Show/Hide Modal
    useEffect(() => {
        if (show) setOpen(true)
        if (!show) reset()
    }, [show])

    return (
        <SideModal
            loading={state?.loading}
            handleSave={handleSubmit(submitFilter)}
            open={open}
            handleModal={() => {
                setOpen(false)
                handleFilterModal(false)
            }}
            title={FM('customer-filter')}
            done='filter'
        >
            {/* <Form> */}
            <Show IF={userTypse === UserType.Admin}>
                <FormGroupCustom
                    placeholder={FM('name')}
                    type='text'
                    name='name'
                    label={FM('name')}
                    className='mb-1'
                    control={control}
                    rules={{ required: false }}
                />
                <FormGroupCustom
                    placeholder={FM('email')}
                    type='email'
                    name='email'
                    label={FM('email')}
                    className='mb-1'
                    control={control}
                    rules={{ required: false }}
                />


                <FormGroupCustom
                    placeholder={FM('mobile-number')}
                    type='number'
                    name='mobile_number'
                    label={FM('mobile-number')}
                    className='mb-1'
                    control={control}
                    rules={{ required: false }}
                />

                <FormGroupCustom
                    noLabel
                    noGroup
                    label={FM('store')}
                    placeholder={FM('select-store')}
                    //   noLabel
                    async
                    searchItem={'search'}
                    path={ApiEndpoints.load_stores}
                    selectLabel='name'
                    selectValue={'id'}
                    modifyDropdownData={(d: any) => {
                        return {
                            ...d,
                            name: `${d?.name} / (${d?.store_setting?.store_name ?? d?.store_setting?.store_name
                                })`
                        }
                    }}
                    defaultOptions
                    loadOptions={loadDropdown}
                    name={`store_id`}
                    type={'select'}
                    className='mb-1'
                    control={control}
                    rules={{ required: false }}
                // prepend={<InputGroupText>{FM('get')}</InputGroupText>}
                // append={<InputGroupText>{FM('item')}</InputGroupText>}
                />
            </Show>


            <FormGroupCustom
                key={`${watch('store_id')?.value}-fjffj`}
                label={FM('product')}
                placeholder={FM('product')}
                //   noLabel
                async
                isClearable
                path={ApiEndpoints.load_product}
                selectLabel='name'
                selectValue={'id'}
                defaultOptions
                jsonData={{
                    store_id: userTypse === UserType.Admin ? watch("store_id")?.value : user?.store_id
                }}
                loadOptions={loadDropdown}
                name={`product_id`}
                type={'select'}
                className='mb-1'
                control={control}
                rules={{ required: false }}
            />


            <FormGroupCustom
                key={`${watch('product_id')?.value}-fjffj-${userTypse === UserType.Admin ? watch("store_id")?.value : user?.store_id}`}
                label={FM('product-variant')}
                placeholder={FM('product-variant')}
                //   noLabel
                async
                isDisabled={!isValid(watch('product_id'))}
                isClearable
                path={`${ApiEndpoints.load_product_variant}${watch('product_id')?.value}`}
                selectLabel='name'
                selectValue={'id'}
                jsonData={{
                    store_id: userTypse === UserType.Admin ? watch("store_id")?.value : user?.store_id,
                    product_id: watch('product_id')?.value
                    // product_type: 1
                }}
                defaultOptions
                loadOptions={loadDropdown}
                name={`product_variant_id`}
                type={'select'}
                className='mb-1'
                control={control}
                rules={{ required: false }}
            //   prepend={<InputGroupText>{FM('get')}</InputGroupText>}
            //   append={<InputGroupText>{FM('item')}</InputGroupText>}
            />

            <FormGroupCustom
                placeholder={FM('from-date')}
                type='date'
                name='from_date'
                label={FM('from-date')}
                className='mb-1'
                control={control}
                rules={{ required: false }}
            />
            <FormGroupCustom
                placeholder={FM('to-date')}
                type='date'
                name='to_date'
                label={FM('to-date')}
                className='mb-1'
                control={control}
                rules={{ required: false }}
            />

            <FormGroupCustom
                placeholder={FM('amount')}
                type='number'
                name='amount'
                label={FM('amount')}
                className='mb-1'
                control={control}
                rules={{ required: false }}
            />

            <FormGroupCustom
                name='amount_should_be'
                type={'select'}
                label={FM('amount-should-be')}
                className='mb-1'
                control={control}
                // message={FM('select-discount-type-fixed-or-percentage')}
                selectOptions={createConstSelectOptions(numberShouldBe, FM)}
                rules={{ required: false }}
            />
            <FormGroupCustom
                placeholder={FM('rating')}
                type='select'
                name='rating'
                label={FM('rating')}
                className='mb-1'
                control={control}
                selectOptions={createConstSelectOptions(ratingType, FM)}
                rules={{ required: false }}
            />


            <FormGroupCustom
                name='rating_should_be'
                type={'select'}
                label={FM('rating-should-be')}
                className='mb-1'
                control={control}
                // message={FM('select-discount-type-fixed-or-percentage')}
                selectOptions={createConstSelectOptions(numberShouldBe, FM)}
                rules={{ required: false }}
            />

            <FormGroupCustom
                placeholder={FM('quantity')}
                type='number'
                name='quantity'
                label={FM('quantity')}
                className='mb-1'
                control={control}
                rules={{ required: false, max: 5, min: 1 }}
            />


            <FormGroupCustom
                name='quantity'
                type={'select'}
                label={FM('quantity-should-be')}
                className='mb-1'
                control={control}
                // message={FM('select-discount-type-fixed-or-percentage')}
                selectOptions={createConstSelectOptions(numberShouldBe, FM)}
                rules={{ required: false }}
            />
            {/* </Form> */}
        </SideModal>
    )
}

export default CustomerFilter
