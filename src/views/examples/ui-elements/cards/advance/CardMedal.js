// ** Reactstrap Imports
import { Card, CardBody, CardText } from 'reactstrap'
// ** Images
import { Link } from 'react-router-dom'
import { getPath } from '../../../../../router/RouteHelper'
import { FM } from '../../../../../utility/helpers/common'
import TooltipLink from '../../../../components/tooltip/TooltipLink'
import { useAppSelector } from '../../../../../redux/store'
import Show from '../../../../../utility/Show'
import classNames from 'classnames'

const CardMedal = () => {
  const session = useAppSelector((a) => a.session?.data)
  return (
    <Card className='card-congratulations-medal'>
      <CardBody>
        <h5>{FM('active-session')}</h5>
        {/* <CardText className='font-small-3 mb-0'>{FM('current-active-session')} </CardText> */}
        <h3 className='mb-75 mt-0 mb-1 pt-50'>
          <TooltipLink
            title={FM('view')}
            to={getPath('store.active-session')}
            className={classNames('fw-bolder', {
              'text-primary': session?.length > 0,
              'text-dark pe-none': session?.length === 0
            })}
            color='primary'
          >
            {session?.length}
          </TooltipLink>
        </h3>

        {/* <div
          className='congratulation-medal text-primary mt-2'
          style={{ height: 120 }}
          alt='Medal Pic'
        > */}
        {/* <div>
          <YourSvg
            color='primary'
            className='congratulation-medal   mt-2'
            style={{ height: 120 }}
          />
        </div> */}
        {/* </div> */}
      </CardBody>
    </Card>
  )
}

export default CardMedal
