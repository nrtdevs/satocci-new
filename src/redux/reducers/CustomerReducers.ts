// ** Redux Imports
import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { log } from '../../utility/helpers/common'
import { AsyncOptionProps } from '../../views/components/formGroupCustom/FormGroupCustom'

interface StateType {
  productDropdown: AsyncOptionProps
  storeEmployeeDropdown: AsyncOptionProps
}

const initialState: StateType = {
  productDropdown: {
    options: [],
    hasMore: false,
    page: 1
  },
  storeEmployeeDropdown: {
    options: [],
    hasMore: false,
    page: 1
  }
}
export const dropdownSlice = createSlice({
  name: 'dropdown',
  initialState,
  reducers: {}
})

// export const {} = dropdownSlice.actions

export default dropdownSlice.reducer
