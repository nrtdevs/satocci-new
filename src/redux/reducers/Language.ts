// ** Redux Imports
import { createSlice } from '@reduxjs/toolkit'

type DataType = {
  id: number
  employee_name: string
}
interface StateType {
  data: DataType[] & any
  par_page?: string | number
}

const initialState: StateType = {
  data: []
}
export const languageSlice = createSlice({
  name: 'language',
  initialState,
  reducers: {
    languageLoad: (state, action: any) => {
      state.data = action?.payload
    }
    // employeeUpdate: (state, action: PayloadAction<DataType | any>) => {
    //   const index = state.data.findIndex((x: DataType) => x.id === action.payload.id)
    //   state.data[index] = action.payload
    // },
    // employeeSave: (state, action: PayloadAction<StateType | any>) => {
    //   const newData = [...action.payload, ...state.data]
    //   state.data = newData
    // },
    // employeeDelete: (state, action: PayloadAction<any>) => {
    //   const ids = action?.payload
    //   // const data = state.data?.filter((item: DataType & any) => !ids?.includes(item?.id))

    //   const res = state?.data.filter((el: any) => {
    //     return !ids.find((element: any) => {
    //       return element === el.id
    //     })
    //   })
    //   state.data = res
    // }
  }
})

export const { languageLoad } = languageSlice.actions

export default languageSlice.reducer
