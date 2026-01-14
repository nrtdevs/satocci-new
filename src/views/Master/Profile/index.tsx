/* eslint-disable prettier/prettier */
import { useEffect } from 'react'
import { Download, Edit, Edit2, Edit3, PenTool } from 'react-feather'
import { useLocation, useParams } from 'react-router-dom'
import { Button, ButtonGroup, ButtonProps, Col, Row } from 'reactstrap'
import { useProfileDetailsMutation } from '../../../redux/RTKQuery/AppSettingsRTK'
import { getPath } from '../../../router/RouteHelper'
import { UserType, forDecryption } from '../../../utility/Const'
import Hide from '../../../utility/Hide'
import Show from '../../../utility/Show'
import { decryptObject, emitAlertStatus } from '../../../utility/Utils'
import { FM, isValidUrl, log } from '../../../utility/helpers/common'
import useUser from '../../../utility/hooks/useUser'
import useUserType from '../../../utility/hooks/useUserType'
import Header from '../../components/header'
import TooltipLink from '../../components/tooltip/TooltipLink'
import UpdateProfile from './UpdatePasswordWIthModal'
import DetailTab from './tabs/DetailTab'
import ProfileCard from './tabs/ProfileCard'
import ProfileTab from './tabs/ProfileTab'
import UpdateUsersPassword from './UpdateUsersPasswordModal'
import BsTooltip from '../../components/tooltip'
import { useAutoUpdatePasswordAllAcccountMutation, useDownloadPasswordFileMutation } from '../../../redux/RTKQuery/AdminEmployeeRTK'
import ConfirmAlert from '../../../utility/helpers/ConfirmAlert'
import httpConfig from '../../../utility/http/httpConfig'
import { QueryStatus } from '@reduxjs/toolkit/dist/query'

function Profile() {
    const params = useParams()
    const location = useLocation()
    const [loadProfile, { data, isSuccess, isLoading, isError }] = useProfileDetailsMutation()
    const [allPassword, res] = useAutoUpdatePasswordAllAcccountMutation()
    const [downloaDFile, resDownload] = useDownloadPasswordFileMutation()
    const userType = useUserType()
    const user = useUser()
    const isLog = () => {
        return (
            location?.pathname === '/admin/activity/log' || location?.pathname === '/store/gatekeeper/log'
        )
    }
    useEffect(() => {
        if (!isLog()) {
            loadProfile({
                id: params?.id
            })
        }
    }, [params])


    const isVisibleUsersPassword = () => {
        let re = false
        if (userType === UserType.Admin) {
            re = true
        } else if (user?.id === user?.store_id) {
            re = true
        }
        return re
    }

    useEffect(() => {
        if ((res.status = QueryStatus.fulfilled) && res?.isLoading === false) {
            if (res?.isSuccess) {
                emitAlertStatus('success', null, "item-update-password")
                // if (res.isSuccess) {
                //     if (isValidUrl(res.data?.payload)) {
                //         window.open(res.data?.payload, '_blank')
                //     } else {
                //         window.open(`${httpConfig.baseUrl3}${res.data?.payload}`, '_blank')
                //     }
                // }
            } else if (res?.error) {
                emitAlertStatus('failed', null, "item-update-password76t")
            }
        }
    }, [res])

    const handleEventUpdatePassword = () => {
        allPassword({})
    }

    const handleDownloadFile = () => {
        downloaDFile({})
    }

    useEffect(() => {
        if (resDownload.isSuccess) {
            window.open(`${httpConfig.baseUrl2}${resDownload?.data?.payload}`, '_blank')
        }

    }, [resDownload])
    //window.open(`${httpConfig.baseUrl2}export/users_password.csv`, '_blank')

    return (
        <>
            <Header
                title={
                    location?.pathname === '/admin/activity/log'
                        ? FM('activity-log')
                        : location?.pathname === '/store/gatekeeper/log'
                            ? FM('gatekeeper-rating')
                            : FM('profile')
                }
                childCol='8'
                titleCol='4'
            >

                <Show IF={userType === UserType.Admin}>
                    <BsTooltip<ButtonProps> className=" btn btn-primary btn-sm  me-1" title={FM("download-users-updated-password")} onClick={handleDownloadFile}>
                        <Download size='14' />
                    </BsTooltip>
                    <BsTooltip className="me-1" title={FM("update-users-password-except-customer")} >
                        <ConfirmAlert
                            //      menuIcon={<Download size={14} />}
                            // onDropdown
                            eventId={`item-update-password`}
                            text={FM('are-you-sure')}
                            title={FM('update-users-password-except-customer')}
                            color='text-warning'
                            onClickYes={handleEventUpdatePassword}
                            onSuccessEvent={(e: any) => {

                            }}
                            className='btn btn-info btn-sm '
                            id={`grid-expire-selected`}
                        >
                            <>
                                <Edit size='14' />
                                {/* <span className='align-middle ms-25'>{FM('update-users-password-except-customer')}</span> */}
                            </>
                        </ConfirmAlert>
                    </BsTooltip>
                </Show>

                <Hide IF={isLog()}>
                    <ButtonGroup>
                        <Show IF={isVisibleUsersPassword()}>
                            <UpdateUsersPassword<ButtonProps>
                                // response={(e) => setState({ isAddingNewData: e })}
                                Component={Button}
                                size='sm'
                                color='primary'
                            >
                                <Edit size='14' />
                                <span className='align-middle ms-25'>{FM('update-users-password')}</span>
                            </UpdateUsersPassword>
                        </Show>
                        {/* <UpdateProfile<ButtonProps>>Update</UpdateProfile> */}
                        <UpdateProfile<ButtonProps>
                            // response={(e) => setState({ isAddingNewData: e })}

                            Component={Button}
                            size='sm'
                            color='secondary'
                        >
                            <Edit size='14' />
                            <span className='align-middle ms-25'>{FM('update-password')}</span>
                        </UpdateProfile>
                        <TooltipLink
                            title={<>{FM('update')}</>}
                            to={getPath('admin.profile.update', { id: params?.id })}
                            className='btn btn-primary btn-sm'
                        >
                            <>
                                <Edit size='14' />
                                <span className='align-middle ms-25 '>{FM('update-profile')}</span>
                            </>
                        </TooltipLink>
                    </ButtonGroup>
                </Hide>
            </Header>

            <Row className='mb-2 g-1'>
                <Hide IF={isLog()}>
                    <Col xl='3' lg='3' xs={{ order: 0 }} md={{ order: 1, size: 4 }}>
                        {/* <ProductInfoCard loading={isLoading} details={data?.payload ?? tempData} /> */}
                        <ProfileCard user={decryptObject(forDecryption, data?.payload)} loading={isLoading} />
                    </Col>
                </Hide>

                <Col
                    xl={isLog() ? '12' : `9`}
                    lg={isLog() ? '12' : `9`}
                    xs={{ order: 1 }}
                    md={{ order: 0, size: 7 }}
                >
                    <Show
                        IF={
                            userType === UserType.Admin ||
                            userType === UserType.AdminEmployee ||
                            userType === UserType.Store
                        }
                    >
                        <ProfileTab />
                    </Show>

                    <Hide IF={isLog()}>
                        {/* <Hide IF={userType === UserType.Admin || user?.store_id === UserType.Admin}> */}
                        <DetailTab user={decryptObject(forDecryption, data?.payload)} loading={isLoading} />
                        {/* </Hide> */}
                    </Hide>

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

export default Profile
