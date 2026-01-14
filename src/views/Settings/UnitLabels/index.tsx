/* eslint-disable prettier/prettier */
import {
    ForwardedRef,
    forwardRef,
    useContext,
    useEffect,
    useImperativeHandle,
    useReducer
} from 'react'

import {
    BarChart2,
    Dribbble,
    Edit,
    Italic,
    MoreVertical,
    Plus,
    PlusSquare,
    RefreshCcw,
    Sliders,
    Trash2,
    Upload
} from 'react-feather'
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom'
import { Button, ButtonGroup, ButtonProps, Col, Row } from 'reactstrap'
import { ThemeColors } from '../../../utility/context/ThemeColors'

import { getPath } from '../../../router/RouteHelper'
import { IconSizes, UserType } from '../../../utility/Const'
import { FM, isValid, isValidArray, log } from '../../../utility/helpers/common'
import ConfirmAlert from '../../../utility/helpers/ConfirmAlert'
import CustomDataTable, {
    TableDropDownOptions,
    TableFormData
} from '../../components/CustomDataTable/CustomDataTable'
import DropDownMenu from '../../components/dropdown'
import Header from '../../components/header'

import { stateReducer } from '../../../utility/stateReducer'

import { TableColumn } from 'react-data-table-component'
import BsTooltip from '../../components/tooltip'
import TooltipLink from '../../components/tooltip/TooltipLink'

import { QueryStatus } from '@reduxjs/toolkit/dist/query'
import { useForm } from 'react-hook-form'
import {
    useDeleteProductByIdMutation,
    useLoadProductByMutationMutation
} from '../../../redux/RTKQuery/ProductRTK'
import { loadDropdown } from '../../../utility/apis/dropdowns'
import Emitter from '../../../utility/Emitter'
import Hide from '../../../utility/Hide'
import useUserType from '../../../utility/hooks/useUserType'
import ApiEndpoints from '../../../utility/http/ApiEndpoints'
import { Permissions } from '../../../utility/Permissions'
import Show, { Can } from '../../../utility/Show'
import { emitAlertStatus, formatDate, getUserData, loadLanguageId, truncateText } from '../../../utility/Utils'
import LoadingButton from '../../components/buttons/LoadingButton'
import LabelAddModal from './LabelAddModal'
import FormGroupCustom from '../../components/formGroupCustom/FormGroupCustom'
import httpConfig from '../../../utility/http/httpConfig'
import BsPopover from '../../components/popover'
import { useNoViewModal } from '../../components/modal/HandleModal'
import { useLoadLabelsMutation } from '../../../redux/RTKQuery/LabelsRTK'
import { group } from 'console'

interface States {
    lastRefresh?: any
    storeId?: any
    page?: any
    productFilter?: boolean
    per_page_record?: any
    search?: any
    name?: any
    reload?: any
    edit?: any
    isRemoving?: boolean
    isReloading?: boolean
    isAddingNewData?: boolean
    filterData?: any
}
export interface forRefType {
    reloadData: () => void
    filterData: (e: any) => void
}
export type forwardRefProps = ForwardedRef<forRefType>

const Products = forwardRef(function (
    { hideHeader = false, subCatStoreID = null }: { hideHeader?: boolean; subCatStoreID?: any },
    ref: forwardRefProps
) {
    const { colors } = useContext(ThemeColors)
    const nav = useNavigate()
    // Local States
    const initState: States = {
        page: 1,
        per_page_record: 15,
        productFilter: false,
        edit: null,
        storeId: null,
        lastRefresh: new Date().getTime(),
        filterData: null,
        search: undefined,
        isRemoving: false,
        isReloading: false,
        isAddingNewData: false
    }
    const location: any = useLocation()
    const userType = useUserType()
    const params: any = useParams()

    const user = getUserData()
    const lang = loadLanguageId()
    const language = lang?.id

    const reducers = stateReducer<States>
    const [state, setState] = useReducer(reducers, initState)
    const [showModal, handleModal] = useNoViewModal()
    const [loadLabels, { data, originalArgs, isLoading }] = useLoadLabelsMutation()
    const canProductList = Can(Permissions?.productBrowse)
    const form = useForm<any>()
    const { handleSubmit, control, reset, setValue, watch } = form

    useEffect(() => {
        setValue('group_id', { value: 29, label: FM("unit") })
    }, [])

    log("languageId", language)

    const loadLabelsUnit = () => {
        if (canProductList) {
            loadLabels({
                jsonData: {

                    name: isValid(state?.search) ? state.search : state.filterData?.name,
                    language_id: language,
                    group_id: watch('group_id')?.value

                },
                page: state?.page,
                per_page_record: state?.per_page_record
            })
        }
    }

    useEffect(() => {
        loadLabelsUnit()
    }, [

        state?.page,
        state?.per_page_record,
        state?.lastRefresh,
        state?.search,
        watch("group_id")?.value
    ])


    useEffect(() => {
        setState({
            page: 1
        })
    }, [state.per_page_record])
    const handlePageChange = (e: TableFormData) => {
        log(e)
        setState({ ...e })
    }

    const columns: TableColumn<any>[] = [
        {
            name: '#',
            maxWidth: '50px',

            cell: (row, index: any) => {
                // eslint-disable-next-line no-mixed-operators
                return parseInt(state?.per_page_record) * (state?.page - 1) + (index + 1)
            }
        },

        {
            name: <>{FM('label-name')}</>,
            minWidth: '200px',
            cell: (row) => (
                <div className='d-flex align-items-center'>
                    <span className='d-block fw-bold text-wrap'>{row?.label_name}</span>
                </div>
            )
        },
        {
            name: <>{FM('label-value')}</>,
            minWidth: '200px',
            cell: (row) => (
                <>
                    <span className='d-block fw-bold text-wrap'>
                        {row?.label_value}
                    </span>
                </>
            )
        },

        {
            name: <>{FM('action')}</>,
            allowOverflow: true,
            maxWidth: '10px',
            cell: (row: any) => {
                return (
                    <div className='d-flex '>
                        <DropDownMenu
                            direction='down'
                            component={<MoreVertical color={colors.primary.main} size={IconSizes.MenuVertical} />}
                            options={[
                                {
                                    IF: Permissions?.productEdit,
                                    icon: <Edit size={14} />,
                                    onClick: () => {
                                        handleModal()
                                        setState({
                                            edit: row
                                        })
                                    },
                                    name: FM('edit')
                                }

                            ]}
                        />
                    </div>
                )
            }
        }
    ]

    // const options: TableDropDownOptions = (selectedRows) => [
    //     {
    //         //gfkhytjh
    //     }
    // ]

    return (
        <>
            <LabelAddModal
                edit={state?.edit}

                language_id={language}
                resData={(e: any) => {
                    setState({
                        lastRefresh: new Date().getTime(),
                        page: 1
                    })
                }}
                showModal={showModal}
                setShowModal={(e) => handleModal()}
                noView
            />
            <Hide IF={hideHeader}>
                <Show IF={Permissions?.storeBrowse}>
                    <Header
                        icon={<Italic size='25' />}
                        titleCol={'5'}
                        childCol={'7'}
                        title={FM('labels')}
                    >
                        <Show IF={userType === UserType.Admin || user?.store_id === UserType.Admin}>
                            <FormGroupCustom
                                noLabel
                                noGroup
                                label={FM('groups')}
                                isClearable
                                async
                                searchItem={'search'}
                                path={ApiEndpoints.load_group}
                                selectLabel='name'
                                selectValue={'id'}

                                defaultOptions
                                loadOptions={loadDropdown}
                                name={`group_id`}
                                type={'select'}
                                className='me-1 flex-1'
                                control={control}
                                rules={{ required: true }}

                            />
                        </Show>

                        <ButtonGroup className='me-1'>
                            <LabelAddModal<ButtonProps>
                                language_id={language}
                                resData={() => {
                                    setState({
                                        lastRefresh: new Date().getTime(),
                                        page: 1
                                    })
                                }}
                                Tag={Button}
                                className='btn btn-primary btn-sm d-flex align-items-center'
                                size='sm'
                            // color='success'
                            // title={FM('import')}
                            >
                                <div>
                                    <PlusSquare size='14' />
                                    <span className='align-middle ms-25'>{FM('create')}</span>
                                </div>
                            </LabelAddModal>


                        </ButtonGroup>


                        <ButtonGroup color='dark'>
                            <Show IF={isValid(state.storeId) && Can(Permissions?.productAdd)}>
                                <TooltipLink
                                    title={<>{FM('create-new')}</>}
                                    // state={state.storeId}
                                    to={
                                        `${userType}` === `${UserType.Admin}` || user?.store_id === UserType?.Admin
                                            ? getPath('admin.product.create', { storeId: state.storeId })
                                            : getPath('product.create', { parentId: '' })
                                    }
                                    className='btn btn-primary btn-sm d-flex align-items-center'
                                >
                                    <Plus size='14' />
                                </TooltipLink>
                            </Show>
                            <Show IF={isValid(state.storeId) && Can(Permissions?.productAdd)}>
                                <BsTooltip<ButtonProps>
                                    Tag={Button}
                                    onClick={() =>
                                        setState({
                                            productFilter: true
                                        })
                                    }
                                    size='sm'
                                    color='secondary'
                                    title={FM('filter')}
                                >
                                    <Sliders size='14' />
                                </BsTooltip>
                            </Show>

                            <LoadingButton
                                loading={isLoading}
                                onClick={() => {
                                    setState({
                                        lastRefresh: new Date().getTime()
                                    })
                                }}
                                size='sm'
                                color='dark'
                                title={FM('reload')}
                            >
                                <RefreshCcw size='14' />
                            </LoadingButton>
                        </ButtonGroup>

                    </Header>
                </Show>
            </Hide>

            <CustomDataTable<any>
                key={state?.lastRefresh}
                initialPerPage={15}
                isLoading={isLoading}
                // options={options}
                selectableRows
                columns={columns}
                paginatedData={data}
                handlePaginationAndSearch={handlePageChange}
            />

        </>
    )
})
export default Products
