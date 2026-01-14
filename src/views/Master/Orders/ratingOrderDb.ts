import { orderResParams } from '.'
import { ResponseParamsTypeWithPagination } from '../../../utility/http/httpConfig'

export const fakeData: ResponseParamsTypeWithPagination<orderResParams> = {
  payload: {
    current_page: '1',
    data: [
      {
        id: 1,
        status: 1,
        name: 'Finn',
        customer_name: 'Milley',
        customer_email: 'milley@yahoo.com',
        transaction_id: '23324678CB',
        employee_Id: 'ST345GK',
        total: '123',
        discount: 2,
        gatekeeper: 'rodes',
        rating: 4,
        description:
          'Lorem Ipsum is simply dummy text of ince the 1500s, when an unknown printer took a galley of type and scrambled it to make ',
        gaurd_description:
          'text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make '
      },
      {
        id: 2,
        name: 'Anderson',
        gatekeeper: 'Curren',
        rating: 2,
        status: '0',
        customer_name: 'rfdf',
        customer_email: 'dffg@yahoo.com',
        transaction_id: '2334678CB',
        employee_Id: 'ST34h445GK',
        total: '1223',
        discount: 2,
        description:
          'Lorem Ipsum is simply dummy text of ince the 1500s, when an unknown printer took a galley of type and scrambled it to make ',
        gaurd_description:
          'text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make '
      },
      {
        id: 3,
        name: 'Finch',
        gatekeeper: 'Watson',
        rating: null,
        status: 2,
        customer_name: 'fdghdfg',
        customer_email: 'midfgdflley@yahoo.com',
        transaction_id: '23fdgfd324678CB',
        employee_Id: 'ST34fgfd5GK',
        total: '16623',
        discount: 244,
        description:
          'Lorem Ipsum is simply dummy text of ince the 1500s, when an unknown printer took a galley of type and scrambled it to make ',
        gaurd_description:
          'text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make '
      },
      {
        id: 4,
        name: 'Pollard',
        gatekeeper: 'Mils',
        rating: 1,
        status: 1,
        customer_name: 'Hamrey',
        customer_email: 'hamrey@yahoo.com',
        transaction_id: '23324678CB',
        employee_Id: 'ST345GK',
        total: '5858',
        discount: 20,
        description:
          'Lorem Ipsum is simply dummy text of ince the 1500s, when an unknown printer took a galley of type and scrambled it to make ',
        gaurd_description:
          'text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make '
      },
      {
        id: 5,
        name: 'Stockes',
        gatekeeper: 'miler',
        customer_name: 'stark',
        customer_email: 'stark@yahoo.com',
        transaction_id: '233dr24678CB',
        employee_Id: 'ST345GK',
        total: 454554,
        discount: 2,
        status: 2,
        rating: 5,
        description:
          'Lorem Ipsum is simply dummy text of ince the 1500s, when an unknown printer took a galley of type and scrambled it to make ',
        gaurd_description:
          'text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make '
      },
      {
        id: 5,
        name: 'Rolaldo',
        gatekeeper: 'Chetri',
        rating: 4,
        status: '0',
        customer_name: 'Milley',
        customer_email: 'milley@yahoo.com',
        transaction_id: '23324678CB',
        employee_Id: 'ST345GK',
        total: '123',
        discount: 2,
        description:
          'Lorem Ipsum is simply dummy text of ince the 1500s, when an unknown printer took a galley of type and scrambled it to make ',
        gaurd_description:
          'text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make '
      },
      {
        id: 7,
        name: 'Piti usha',
        gatekeeper: 'Hima das',
        rating: 3,
        customer_name: 'Milley',
        customer_email: 'milley@yahoo.com',
        transaction_id: '23324678CB',
        employee_Id: 'ST345GK',
        total: '123',
        discount: 2,
        status: 1,
        description:
          'Lorem Ipsum is simply dummy text of ince the 1500s, when an unknown printer took a galley of type and scrambled it to make ',
        gaurd_description:
          'text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make '
      },
      {
        id: 8,
        name: 'Marry',
        gatekeeper: 'Lea',
        rating: 1,
        customer_name: 'Milley',
        customer_email: 'milley@yahoo.com',
        transaction_id: '23324678CB',
        employee_Id: 'ST345GK',
        total: '123',
        discount: 2,
        status: 1,
        description:
          'Lorem Ipsum is simply dummy text of ince the 1500s, when an unknown printer took a galley of type and scrambled it to make ',
        gaurd_description:
          'text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make '
      },
      {
        id: 9,
        name: 'Jamse Ray',
        gatekeeper: 'Arnold Rechardson',
        rating: 5,
        customer_name: 'Milley',
        customer_email: 'milley@yahoo.com',
        transaction_id: '23324678CB',
        employee_Id: 'ST345GK',
        total: '123',
        discount: 2,
        status: 1,
        description:
          'Lorem Ipsum is simply dummy text of ince the 1500s, when an unknown printer took a galley of type and scrambled it to make ',
        gaurd_description:
          'text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make '
      },
      {
        id: 10,
        name: 'James  007',
        gatekeeper: 'agent K',
        rating: null,
        customer_name: 'Milley',
        customer_email: 'milley@yahoo.com',
        transaction_id: '23324678CB',
        employee_Id: 'ST345GK',
        total: '123',
        discount: 2,
        status: 1,
        description:
          'Lorem Ipsum is simply dummy text of ince the 1500s, when an unknown printer took a galley of type and scrambled it to make ',
        gaurd_description:
          'text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make '
      }
    ],
    last_page: 1,
    per_page: '15',
    total: 1
  },
  code: 0,
  message: undefined,
  success: false
}
