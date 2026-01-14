// ** Redux Imports
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

type DataType = {
  id: number
  store_name: string
}
interface StateType {
  data: DataType[] & any
  par_page?: string | number
}
const initialState: StateType = {
  data: [
    {
      id: 1,
      store_name: 'Baba Bakery',
      email_address: 'bababakery@gmail.com',
      contact_person_number: 1245896523,
      contact_person_name: 'Mohan Dhimani',
      address: 'Bhopal New Market',
      helpline_no: '1800345678',
      status: 1,
      subscription_type: 'Transaction',
      amount: 20,
      lat: '27.2046° N',
      long: '77.4977° E',
      location:
        'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d7335.2908123788975!2d77.4474144081998!3d23.183138523613255!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x397c43ea13043381%3A0x622bb21d4a6806ee!2sDMart!5e0!3m2!1sen!2sin!4v1660884355839!5m2!1sen!2sin'
    },
    {
      id: 2,
      store_name: 'Chaudhary Super Bazar',
      contact_person_name: 'Chacha Chaudhary',
      email_address: 'chaudhary@gmail.com',
      contact_person_number: 1245896523,
      status: 0,
      address: 'Danish Nagar bhopal',
      helpline_no: '1800345678',
      subscription_type: 'month/year',
      payment_type: 'month',
      amount: 400,

      city: 'Bhpal',
      state: 'Madhya Pradesh',
      zipcode: '32342',
      lat: '27.2046° N',
      long: '77.4977° E',
      location:
        'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3667.5886580756155!2d77.4493533148238!3d23.185208516048448!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x397c42540447a0bd%3A0x7774b6e12b622290!2sNewrise%20Technosys%20Pvt%20Ltd!5e0!3m2!1sen!2sin!4v1660885871647!5m2!1sen!2sin'
    },
    {
      id: 3,
      store_name: 'DFC Super Mart',
      contact_person_name: 'Chotu Baghel',
      email_address: 'chotu@gmail.com',
      contact_person_number: 1245896523,
      address: 'Danish Nagar Nagpur',
      helpline_no: '1800345678',
      subscription_type: 'month/year',
      payment_type: 'year',
      status: 1,
      amount: 500,
      city: 'Nagpur',
      state: 'Maharastra',
      zipcode: '32342',
      lat: '27.2046° N',
      long: '77.4977° E',
      location:
        'https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d1833.9297510071183!2d77.45446273331297!3d23.17532740960017!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1sen!2sin!4v1660825998452!5m2!1sen!2sin'
    },
    {
      id: 4,
      store_name: 'Vishal Minerals',
      contact_person_name: 'Vishal Ke Papa',
      email_address: 'papaVishal@gmail.com',
      contact_person_number: 1245896523,
      address: 'Danish Nagar bhopal',
      helpline_no: '1800345678',
      subscription_type: 'month/year',
      payment_type: 'year',
      status: 0,
      amount: 500,
      city: 'Bhpal',
      state: 'Madhya Pradesh',
      zipcode: '32342',
      lat: '27.2046° N',
      long: '77.4977° E',
      location:
        'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d229.23002824832804!2d77.4557429387035!3d23.181860076587437!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x397c43781bab222d%3A0x2bcce7cb6cd622a4!2sComposite%20Madira%20Dukan%20(Alcohol%20Liquer%20Shop%20Misrod)!5e0!3m2!1sen!2sin!4v1660887730385!5m2!1sen!2sin'
    }
  ],
  par_page: 1
}
export const storeSlice = createSlice({
  name: 'stores',
  initialState,
  reducers: {
    storesLoad: (state, action: PayloadAction<StateType>) => {
      state = action?.payload
    },
    storesUpdate: (state, action: PayloadAction<DataType | any>) => {
      const index = state.data.findIndex((x: DataType) => x.id === action.payload.id)
      state.data[index] = action.payload
    },
    storesSave: (state, action: PayloadAction<StateType | any>) => {
      const newData = [...action.payload, ...state.data]
      state.data = newData
    },
    storesDelete: (state, action: PayloadAction<any>) => {
      // log('action', action)
      const ids = action?.payload
      // const data = state.data?.filter((item: DataType & any) => !ids?.includes(item?.id))

      const res = state?.data.filter((el: any) => {
        return !ids.find((element: any) => {
          return element === el.id
        })
      })
      state.data = res
      //   log('data', res)
    }
  }
})

export const { storesDelete, storesLoad, storesSave, storesUpdate } = storeSlice.actions

export default storeSlice.reducer
