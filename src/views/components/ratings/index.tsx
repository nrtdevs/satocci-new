import { Rating } from '@mui/material'
import BsTooltip from '../tooltip'

const Ratings = ({ rating = 0, max = 5 }) => {
  return (
    <BsTooltip title={rating}>
      <Rating
        sx={{ color: rating > 2 && rating <= 3.5 ? '' : rating > 3 ? 'green' : 'red' }}
        readOnly
        name='half-rating'
        defaultValue={rating}
        precision={0.5}
      />
    </BsTooltip>
  )
}

export default Ratings
