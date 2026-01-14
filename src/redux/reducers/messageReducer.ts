import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface Message {
  data: any
  par_page?: string | number
}
const initialState: Message = {
  data: [],
  par_page: 1
}

const messageSlice = createSlice({
  name: 'message',
  initialState,
  reducers: {
    setMessage(state, action: PayloadAction<Message>) {
      state.data = action.payload.data
    }
  }
})

export const { setMessage } = messageSlice.actions
export default messageSlice.reducer
