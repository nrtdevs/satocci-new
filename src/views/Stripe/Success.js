import defaultAvatar1 from '@src/assets/images/pages/succ.png'
import { FM } from '../../utility/helpers/common'
const Success = () => {
  return (
    <div className='example-container example-content-main '>
      <h2
        className='text-success'
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          marginTop: '200px'
        }}
      >
        <img src={defaultAvatar1} width='260px' height={'260px'} className='text-light m-0  fs-5' />
      </h2>
      <div className='mt-3'>
        <h2 className='text-center'> {FM('stripe-connect-successfully')} </h2>
      </div>
    </div>
  )
}

export default Success
