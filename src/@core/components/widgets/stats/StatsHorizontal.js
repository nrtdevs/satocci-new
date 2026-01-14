// ** Third Party Components
import classnames from 'classnames'
import PropTypes from 'prop-types'

// ** Reactstrap Imports
import { Card, CardBody } from 'reactstrap'
import { FM, isValid } from '../../../../utility/helpers/common'

const StatsHorizontal = ({
  icon,
  color,
  title1 = '',
  title2 = '',
  stats,
  data = null,
  isEnableFooter = false,
  renderStats,
  statTitle,
  className,
  statsMargin,
  cardProp = {},
  cardBodyProp = {},
  titleClass = '',
  statClass = ''
}) => {
  return (
    <Card {...cardProp}>
      {/* <CardHeader>
        <span className='d-flex flex-column align-items-end'>
          {isValid(data) ? (
            <>
              {' '}
              <p className={`card-text text-secondary mt-25 ${titleClass}`}>{statTitle}</p>{' '}
              <p className={`card-text text-secondary mt-25 ${titleClass}`}>{statTitle}</p>
            </>
          ) : (
            ''
          )}
        </span>
      </CardHeader> */}
      <CardBody className={className} {...cardBodyProp}>
        <div className='d-flex justify-content-between align-items-center'>
          <div>
            {renderStats ? (
              renderStats
            ) : (
              <h2
                className={classnames(`fw-bolder ${statClass}`, {
                  'mb-0': !statsMargin,
                  [statsMargin]: statsMargin
                })}
              >
                {stats}
              </h2>
            )}

            <p className={`card-text text-secondary mt-25 ${titleClass}`}>{statTitle}</p>
          </div>

          <div
            className={`avatar avatar-stats p-50 m-0 ${
              color ? `bg-light-${color}` : 'bg-light-primary'
            }`}
          >
            <div className='avatar-content'>{icon}</div>
          </div>
        </div>
        {isValid(data) ? (
          <>
            <div className='d-flex justify-content-between align-items-center border-top'>
              <div className='mt-1'>
                {renderStats ? (
                  renderStats
                ) : (
                  <>
                    <h5 className='fw-bolder text-status'>
                      {FM('admin-share')}: {` ${title1}`}
                    </h5>
                    <h5 className='fw-bolder  text-status'>
                      {FM('store-share')} :{` ${title2}`}
                    </h5>
                  </>
                )}
              </div>
            </div>
          </>
        ) : (
          ''
        )}
      </CardBody>
    </Card>
  )
}

export default StatsHorizontal

// ** PropTypes
StatsHorizontal.propTypes = {
  stats: PropTypes.string || PropTypes.number,
  renderStats: PropTypes.any,
  className: PropTypes.string,
  icon: PropTypes.element.isRequired,
  color: PropTypes.string.isRequired,
  statTitle: PropTypes.string.isRequired,
  statsMargin: PropTypes.oneOf([
    'mb-0',
    'mb-25',
    'mb-50',
    'mb-75',
    'mb-1',
    'mb-2',
    'mb-3',
    'mb-4',
    'mb-5'
  ])
}
