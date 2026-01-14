/* eslint-disable prettier/prettier */
// ** React Imports
import { Fragment, useEffect, useReducer, useState } from 'react'

// ** Custom Components

// ** Third Party Components
import classnames from 'classnames'
import { Bell, CheckSquare, Loader, RefreshCcw } from 'react-feather'
import PerfectScrollbar from 'react-perfect-scrollbar'

// ** Reactstrap Imports
import { useDispatch } from 'react-redux'
import { Link, useLocation } from 'react-router-dom'
import {
    Alert,
    Badge,
    DropdownItem,
    DropdownMenu,
    DropdownToggle,
    UncontrolledDropdown
} from 'reactstrap'
import { getPath } from '../../../router/RouteHelper'
import Hide from '../../../utility/Hide'
import Show from '../../../utility/Show'
import { countPlus, formatDate } from '../../../utility/Utils'
import {
    loadNotification,
    loadUnreadCount,
    readAllNotification
} from '../../../utility/apis/common'
import { FM, isValid, isValidArray, log } from '../../../utility/helpers/common'
import { useSkin } from '../../../utility/hooks/useSkin'
import { stateReducer } from '../../../utility/stateReducer'
import Shimmer from '../shimmers/Shimmer'
import BsTooltip from '../tooltip'
interface States {
    page?: any
    lastRefresh?: any
    per_page_record?: any
    search?: any
    reload?: any
    notificationData?: any
    loading?: boolean
    unreadCount?: any
    filterData?: any
}

const NotificationDropdown = () => {
    const initState: States = {
        page: 1,
        loading: false,
        lastRefresh: new Date().getTime(),
        per_page_record: 100,
        search: undefined,
        unreadCount: {},
        notificationData: []

        // reload: reloadID
    }
    const skin = useSkin()
    const location = useLocation()
    const reducers = stateReducer<States>
    const [state, setState] = useReducer(reducers, initState)
    const dispatch = useDispatch()
    const [loading, setLoading] = useState(false)
    const [loadingRead, setLoadingRead] = useState(null)
    const [open, setOpen] = useState<boolean>(false)

    // const loadNotificationList = () => {
    //   loadNotificationList({
    //     page: state.page,
    //     perPage: state.per_page_record,
    //     loading: () =>
    //       setState({
    //         loading: true
    //       }),
    //     dispatch,
    //     success: (data) => {
    //       dispatch(
    //         setUnreadNotification(data?.payload?.data?.filter((a) => a.read_status === 0)?.length)
    //       )
    //     }
    //   })
    // }

    const getUnreadCount = () => {
        loadUnreadCount({
            loading: (e: boolean) => {
                setState({
                    loading: e
                })
            },
            success: (e) => {
                setState({
                    unreadCount: e?.payload
                })
                // log('unread', e)
            }
        })
    }
    useEffect(() => {
        getUnreadCount()
    }, [state?.lastRefresh])

    const loadNotificationList = () => {
        loadNotification({
            jsonData: { perPage: state.per_page_record, page: state.page, read_status: '0' },
            page: state.page,
            perPage: state.per_page_record,
            loading: (e: boolean) =>
                setState({
                    loading: e
                }),

            dispatch,
            success: (e: any) => {
                log('notification', location)
                setState({
                    notificationData: e?.payload?.data?.filter((d: any) => `${d?.read_status}` !== '1')
                })
            }
            // per_page_ record: state.per_page_record
        })
    }
    useEffect(() => {
        loadNotificationList()
    }, [state.page, state.per_page_record, isValid(state.unreadCount)])

    // const read = (id) => {
    //   readNotification({
    //     id,
    //     loading: (e) => setLoadingRead(id),
    //     dispatch,
    //     success: () => {
    //       dispatch(decreaseUnreadNotification())
    //     }
    //   })
    // }

    // useEffect(() => {
    //   if (notifications?.data?.length > 0) {
    //     setOpen(false)
    //   }
    // }, [notifications])

    // const handleRead = (e, item) => {
    //   e.preventDefault()
    //   document.body.click()
    //   if (item?.read_status === 0) {
    //     read(item?.id)
    //     setOpen(false)
    //   }
    //   NotificationLocator(item, history)
    // }

    const renderNotificationItems = () => {
        return (
            <PerfectScrollbar
                component='li'
                className='media-list scrollable-container'
                options={{
                    wheelPropagation: false
                }}
            >
                {state?.notificationData?.map((item: any, index: any) => {
                    return (
                        //   onClick={(e) => handleRead(e, item)}
                        <>
                            <Link to={getPath('notifications')}>
                                <div
                                    className={classnames('list-item d-flex align-items-center', {
                                        read: item?.read_status
                                    })}
                                >
                                    <Fragment>
                                        <div className='me-1'>
                                            {/* <Avatar
                      // color={
                      //   item?.read_status === 0 ? `light-${item?.status_code}` : 'light-secondary'
                      // }

                      icon={<GetIcons type={item?.type} />}
                    /> */}
                                        </div>
                                        <div className='list-item-body flex-grow-1'>
                                            <p className='media-heading text-primary'>
                                                <span className={classnames('', { 'fw-bolder': item?.read_status === 0 })}>
                                                    {item?.title}
                                                </span>
                                            </p>
                                            <p className=' text-black text-small-12 mb-0 mt-5px'>{item.message}</p>
                                            <p className='text-small-12 text-black mb-0 mt-3px'>
                                                {formatDate(item?.created_at)}
                                            </p>
                                        </div>
                                    </Fragment>
                                </div>
                            </Link>
                        </>
                    )
                })}
            </PerfectScrollbar>
        )
    }

    const handleClick = (e: any) => {
        e.preventDefault()
        if (state?.unreadCount?.total_unread_count > 0) {
            setState({
                lastRefresh: new Date().getTime()
            })
        }

        // setOpen(true)
    }
    const toggleDropdown = () => {
        setOpen(!open)
    }

    const handleReadAll = () => {
        readAllNotification({
            loading: (e: boolean) =>
                setState({
                    loading: e
                }),
            dispatch,
            success: (e) => {
                setState({
                    notificationData: e?.payload,
                    lastRefresh: new Date().getTime()
                })
            }
        })
    }
    useEffect(() => {
        if (location?.pathname === '/notifications') {
            handleReadAll()
            setOpen(false)
        }
    }, [location])
    //iuoyyiukyuioiuuioioiyyuioyuiyiuyyiuyiuyiuiyuiuyiuy
    return (
        <UncontrolledDropdown
            isOpen={open}
            toggle={toggleDropdown}
            tag='li'
            className='dropdown-notification nav-item me-25'
        >
            <DropdownToggle tag='a' className='nav-link' onClick={handleClick}>
                <Bell size={21} />

                <Badge pill color='danger' className='badge-up'>
                    {countPlus({ number: state.unreadCount?.total_unread_count, max: 100 })}
                </Badge>
            </DropdownToggle>
            <DropdownMenu end tag='ul' className='dropdown-menu-media mt-0'>
                <li className='dropdown-menu-header'>
                    <DropdownItem className='d-flex' tag='div' header>
                        <h4 className='notification-title mb-0 me-auto'>{FM('notifications')}</h4>

                        <Hide IF={state.unreadCount?.total_unread_count <= 0}>
                            <BsTooltip
                                title={FM('mark-as-read-all')}
                                // onClick={handleReadAll}
                                onClick={handleReadAll}
                                role='button'
                            >
                                <CheckSquare size={20} />
                            </BsTooltip>
                        </Hide>
                        <BsTooltip
                            // loading={state?.loading === true}
                            className='ms-1'
                            onClick={loadNotificationList}
                            title={FM('reload')}
                            role='div'
                        >
                            {state?.loading === true ? <Loader /> : <RefreshCcw size={18} />}
                        </BsTooltip>
                    </DropdownItem>
                </li>
                <Show IF={state.loading === true}>
                    <Shimmer
                        style={{
                            height: 64
                            // borderBottom: skin === 'dark' ? '1px solid #3b4253' : '1px solid #ebe9f1'
                        }}
                    />
                    <Shimmer
                        style={{
                            height: 64
                            // borderBottom: skin === 'dark' ? '1px solid #3b4253' : '1px solid #ebe9f1'
                        }}
                    />
                    <Shimmer
                        style={{
                            height: 64
                            // borderBottom: skin === 'dark' ? '1px solid #3b4253' : '1px solid #ebe9f1'
                        }}
                    />
                    <Shimmer
                        style={{
                            height: 64
                            // borderBottom: skin === 'dark' ? '1px solid #3b4253' : '1px solid #ebe9f1'
                        }}
                    />
                    <Shimmer
                        style={{
                            height: 64
                            // borderBottom: skin === 'dark' ? '1px solid #3b4253' : '1px solid #ebe9f1'
                        }}
                    />
                </Show>

                <Hide IF={state.loading === true}>
                    {isValidArray(state?.notificationData) ? (
                        renderNotificationItems()
                    ) : (
                        // <Link to={getPath('notifications')}>
                        <Alert color='danger' className='p-1 m-1'>
                            <div className='alert-body fw-bolder'>{FM('no-unread-notification')}</div>
                        </Alert>
                        // </Link>
                    )}
                </Hide>

                <li className='dropdown-menu-footer'>
                    <Link to={getPath('notifications')} color={'primary'} className=''>
                        <Badge color='primary'> {FM('view-all')}</Badge>
                    </Link>
                </li>
            </DropdownMenu>
        </UncontrolledDropdown>
    )
}

export default NotificationDropdown
