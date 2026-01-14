// ** Redux Imports
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export type SessionDataType = {
  id?: any
  unique_id?: any
  store_id?: any
  user_id?: any
  ip_address?: any
  user_agent?: any
  payload?: any
  last_activity?: any
  created_at?: any
  updated_at?: any
  carts?: Array<any>
  coupon_code?: string
  coupon_amount?: number
  total_quantity?: any
  total_amount?: number
  last_activity_tz?: any
  coupon_obj?: {
    id: any
    store_id: any
    coupon_code: any
    discount_type: any
    discount_value: any
    description: any
    min_applicable_amount: any
    max_discount: any
    expiry_date: any
    usage_limit: any
    used: any
    usage_limit_per_user: any
    image: any
    entry_mode: any
    created_at: any
    updated_at: any
    deleted_at: any
  }
  store?: {
    id?: any
    name?: any
    address?: any
    city?: any
    country?: any
    currency?: any
    postal_area?: any
    zip_code?: any
  }
  customer?: {
    id?: any
    name?: any
    email?: any
    personal_number?: any
    mobile_number?: any
    unique_id?: any
    rating?: any
  }
}
interface StateType {
  lastMessageTimeStamp?: any
  addOffer?: boolean
  totalSession?: number
  selected?: number
  selectedProduct?: any
  sessionSelected?: SessionDataType
  activeSession?: number
  lowRatings?: number
  data: SessionDataType[]
  par_page?: string | number
  selectedOffer?: any
}

const initialState: StateType = {
  selected: 0,
  addOffer: false,
  selectedOffer: null,
  sessionSelected: undefined,
  selectedProduct: null,
  lastMessageTimeStamp: null,
  activeSession: 0,
  lowRatings: 0,
  totalSession: 0,
  data: []
}
export const sessionSlice = createSlice({
  name: 'session',
  initialState,
  reducers: {
    sessionLoad: (state, action: PayloadAction<SessionDataType[]>) => {
      state.data = action?.payload
    },
    setSessionSelected: (state, action: PayloadAction<{ index: number; session: any }>) => {
      state.selected = action?.payload?.index
      state.sessionSelected = action?.payload?.session
    },
    setProductSelected: (state, action: PayloadAction<{ product: any }>) => {
      state.selectedProduct = action?.payload?.product
    },
    setOffer: (state, action: PayloadAction<any>) => {
      state.addOffer = action?.payload
    },
    setSelectedOffer: (state, action: PayloadAction<any>) => {
      state.selectedOffer = action?.payload
    },
    updateTimestamp: (state, action: PayloadAction<any>) => {
      state.lastMessageTimeStamp = action?.payload
    },
    sessionUpdate: (state, action: PayloadAction<SessionDataType>) => {
      const index = state.data.findIndex((x: SessionDataType) => x.id === action.payload.id)
      state.data[index] = action.payload
    },
    sessionSave: (state, action: PayloadAction<StateType | any>) => {
      const newData = [...action.payload, ...state.data]
      state.data = newData
    },
    sessionDelete: (state, action: PayloadAction<any>) => {
      const ids = action?.payload
      const res = state?.data.filter((el: any) => {
        return !ids.find((element: any) => {
          return element === el.id
        })
      })
      state.data = res
    }
  }
})

export const {
  setSessionSelected,
  sessionDelete,
  updateTimestamp,
  sessionLoad,
  sessionSave,
  sessionUpdate,
  setProductSelected,
  setOffer,
  setSelectedOffer
} = sessionSlice.actions

export default sessionSlice.reducer
