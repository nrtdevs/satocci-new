// ** Redux Imports
import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { log } from '../../utility/helpers/common'

type DataType = {
  id: number
  employee_name: string
}
interface StateType {
  data: DataType[] & any
  par_page?: string | number
}

const initialState: StateType = {
  data: [
    {
      id: 1,
      full_name: 'Tony Stark',
      employee_email: 'tony@gmail.com',
      contact_number: 1245896523,
      role: 'employee',
      address: 'california new bie street',
      city: 'California',
      state: 'Loa Angeles',
      gender: 'male',
      zipcode: 12345,
      postal_code: '123cc',
      country: 'U.S',
      status: 1
    },
    {
      id: 2,
      full_name: 'twilight',
      employee_email: 'teilight@gmail.com',
      contact_number: 1245896523,
      role: 'store keeper',
      address: 'katol New Market',
      city: 'Nagpur',
      state: 'Maharastra',
      gender: 'male',
      zipcode: 12345,
      postal_code: '123cc',
      country: 'India',
      status: 0
    },
    {
      id: 3,
      full_name: 'Kichak',
      employee_email: 'kichak@gmail.com',
      contact_number: 1245896523,
      role: 'Destroyer',
      address: 'Banaras New Market',
      city: 'Varanasi',
      state: 'Uttar Pradesh',
      gender: 'male',
      zipcode: 12345,
      postal_code: '123cc',
      country: 'India',
      status: 1
    },
    {
      id: 4,
      full_name: 'Cendrella',
      employee_email: 'Cendrella@gmail.com',
      contact_number: 1245896523,
      role: 'employee',
      address: 'Raisen New Market',
      city: 'Raisen',
      state: 'Madhya Pradesh',
      gender: 'female',
      zipcode: 12345,
      postal_code: '123cc',
      country: 'India',
      status: 0
    }
  ]
}
export const employeeSlice = createSlice({
  name: 'employee',
  initialState,
  reducers: {
    employeeLoad: (state, action: PayloadAction<StateType>) => {
      state = action?.payload
    },
    employeeUpdate: (state, action: PayloadAction<DataType | any>) => {
      const index = state.data.findIndex((x: DataType) => x.id === action.payload.id)
      state.data[index] = action.payload
    },
    employeeSave: (state, action: PayloadAction<StateType | any>) => {
      const newData = [...action.payload, ...state.data]
      state.data = newData
    },
    employeeDelete: (state, action: PayloadAction<any>) => {
      const ids = action?.payload
      // const data = state.data?.filter((item: DataType & any) => !ids?.includes(item?.id))

      const res = state?.data.filter((el: any) => {
        return !ids.find((element: any) => {
          return element === el.id
        })
      })
      state.data = res
    }
  }
})

export const { employeeLoad, employeeUpdate, employeeSave, employeeDelete } = employeeSlice.actions

export default employeeSlice.reducer
