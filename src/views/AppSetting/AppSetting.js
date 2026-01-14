import { useEffect, useState } from 'react'
import { Col, Row, TabContent, TabPane } from 'reactstrap'
// ** Styles
import '@styles/react/libs/flatpickr/flatpickr.scss'
import '@styles/react/pages/page-account-settings.scss'
import { useDispatch } from 'react-redux'
import { appSettingForAdmin } from '../../utility/apis/appSetting'
import Account from './tab/Account'
import AppInfo from './tab/AppInfo'
import CreditInfo from './tab/CreditInfo'
import Info from './tab/Info'
import Password from './tab/Password'
import Tabs from './tab/Tabs'

const AppSetting = () => {
  const [activeTab, setActiveTab] = useState('1')
  const [data, setData] = useState(null)
  const [info, setInfo] = useState(null)
  const [loading, setLoading] = useState(false)

  const dispatch = useDispatch()
  const getInfo = () => {
    appSettingForAdmin({
      // perPage: 1000,
      loading: setLoading,
      dispatch,
      success: (e) => {
        setInfo(e?.data)
      }
    })
  }

  useEffect(() => {
    getInfo()
  }, [])

  const toggleTab = (tab) => {
    setActiveTab(tab)
  }

  return (
    <>
      <Row>
        <Col xs={12}>
          <Tabs className='mb-2' activeTab={activeTab} toggleTab={toggleTab} />

          <TabContent activeTab={activeTab}>
            <TabPane tabId='1'>
              <Info info={info} />
            </TabPane>
            <TabPane tabId='2'>
              <Account info={info} />
            </TabPane>
            <TabPane tabId='3'>
              <Password />
            </TabPane>
            <TabPane tabId='4'>
              <AppInfo />
            </TabPane>
            <TabPane tabId='5'>
              <CreditInfo />
            </TabPane>
          </TabContent>
        </Col>
      </Row>
    </>
  )
}

export default AppSetting

// ** React Imports
//import { Fragment, useState, useEffect } from 'react'

// ** Reactstrap Imports
//import { Row, Col, TabContent, TabPane } from 'reactstrap'
// import React from 'react'
// import { Row, Card, Col } from 'reactstrap'
// import ChangePassword from './ChangePassword'

// const AppSetting = () => {
//   return (
//     <>
//    <Row>
//     <Col lg = "4">
//         <Card>
//     <ChangePassword />
//         </Card>
//     </Col>
//     <Col lg = "8">
// <Card>
//     sdafsfds
// </Card>
//     </Col>
//    </Row>
//     </>
//   )
// }

// export default AppSetting
