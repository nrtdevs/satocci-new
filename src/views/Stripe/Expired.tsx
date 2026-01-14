/* eslint-disable prettier/prettier */
import defaultAvatar1 from '@src/assets/images/pages/cross.png'
import { FM } from '../../utility/helpers/common'
const Expired = () => {
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
                <h2 className='text-center'> {FM('stripe-connect-expired')} </h2>
            </div>
        </div>
    )
}

export default Expired
