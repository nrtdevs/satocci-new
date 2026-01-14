// ** React Imports
import { Fragment, useContext } from 'react'

// ** Reactstrap Imports
import { Col, Row } from 'reactstrap'

// ** Custom Hooks
import { useRTL } from '../../utility/hooks/useRTL'

// ** Custom Components
import { useForm } from 'react-hook-form'

// ** Context
import { ThemeColors } from '../../utility/context/ThemeColors'
// ** Styles
import '@styles/react/libs/charts/apex-charts.scss'
import '@styles/react/libs/flatpickr/flatpickr.scss'
import { BarChart2 } from 'react-feather'
import { FM } from '../../utility/helpers/common'
import Header from '../components/header'
import EarningCharts from './SingleReport/Charts/EarningCharts'
import TransactionChart from './SingleReport/Charts/TransactionChart'

const ApexCharts = () => {
  // ** Hooks
  const [isRtl] = useRTL()

  const { control } = useForm<any>()

  // ** Theme Colors
  const { colors } = useContext(ThemeColors)

  return (
    <Fragment>
      {/* <Breadcrumbs title='Apex Charts' data={[{ title: 'Charts' }, { title: 'Apex' }]} /> */}
      <Header icon={<BarChart2 />} title={FM('store-reports')}></Header>
      <Row className='match-height'>
        <Col sm='12'>
          <TransactionChart direction={isRtl ? 'rtl' : 'ltr'} />
        </Col>

        <Col sm='12'>
          <EarningCharts direction={isRtl ? 'rtl' : 'ltr'} warning={colors.warning.main} />
        </Col>
      </Row>
    </Fragment>
  )
}

export default ApexCharts
