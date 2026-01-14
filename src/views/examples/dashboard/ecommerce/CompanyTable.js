/* eslint-disable no-mixed-operators */
// ** Custom Components

// ** Reactstrap Imports
import { Badge, Card, CardHeader, Table } from 'reactstrap'

// ** Icons Imports
import { Coffee, Monitor, TrendingDown, TrendingUp, Watch } from 'react-feather'
import { truncateText } from '../../../../utility/Utils'

// interface storeProps {
//   storeName?: any;
// }
const CompanyTable = () => {
  // ** vars

  const data = [
    {
      img: 'https://fakestoreapi.com/img/81fPKd-2AYL._AC_SL1500_.jpg',
      name: 'Fjallraven - Foldsack No. 1 Backpack, Fits 15 Laptops',
      email: "men's clothing",
      icon: <Monitor size={18} />,
      category: 'Technology',
      views: '23.4k',
      time: '24 hours',
      revenue: '8910.2',
      sales: '68'
    },
    {
      img: 'https://fakestoreapi.com/img/71-3HjGNDUL._AC_SY879._SX._UX._SY._UY_.jpg',
      name: 'Mens Casual Premium Slim Fit T-Shirts ',
      email: "men's clothing",
      icon: <Coffee size={18} />,
      category: 'Grocery',
      views: '78k',
      time: '2 days',
      revenue: '6680.51',
      sales: '97',
      salesUp: true
    },
    {
      img: 'https://fakestoreapi.com/img/71li-ujtlUL._AC_UX679_.jpg',
      name: 'Mens Cotton Jacket',
      email: "men's clothing",
      icon: <Watch size={18} />,
      category: 'Fashion',
      views: '162',
      time: '5 days',
      revenue: '5220.29',
      sales: '62',
      salesUp: true
    },
    {
      img: 'https://fakestoreapi.com/img/71YXzeOuslL._AC_UY879_.jpg',
      name: 'Mens Casual Slim Fit',
      email: "men's clothing",
      icon: <Monitor size={18} />,
      category: 'Technology',
      views: '214',
      time: '24 hour',
      revenue: '2091.01',
      sales: '88',
      salesUp: true
    },
    {
      img: 'https://fakestoreapi.com/img/71pWzhdJNwL._AC_UL640_QL65_ML3_.jpg',
      name: "John Hardy Women's Legends Naga Gold & Silver Dragon Station Chain Bracelet",
      email: "men's clothing",
      icon: <Coffee size={18} />,
      category: 'Grocery',
      views: '208',
      time: '1 week',
      revenue: '7803.93',
      sales: '16'
    },
    {
      img: 'https://fakestoreapi.com/img/61sbMiUnoGL._AC_UL640_QL65_ML3_.jpg',
      name: 'Solid Gold Petite Micropave ',
      email: "men's clothing",
      icon: <Watch size={18} />,
      category: 'Fashion',
      views: '990',
      time: '1 month',
      revenue: '7800.05',
      sales: '78',
      salesUp: true
    },
    {
      img: 'https://fakestoreapi.com/img/71YAIFU48IL._AC_UL640_QL65_ML3_.jpg',
      name: 'White Gold Plated Princess',
      email: "men's clothing",
      icon: <Watch size={18} />,
      category: 'Fashion',
      views: '12.9k',
      time: '12 hours',
      revenue: '5301.49',
      sales: '42',
      salesUp: true
    }
  ]
  const colorsArr = {
    Technology: 'light-primary',
    Grocery: 'light-success',
    Fashion: 'light-warning'
  }

  const renderData = () => {
    return data.map((col) => {
      const IconTag = col.salesUp ? (
        <TrendingUp size={15} className='text-success' />
      ) : (
        <TrendingDown size={15} className='text-danger' />
      )

      return (
        <tr key={col.name}>
          <td className='text-primary'>
            <u role={'button'}>#{Math.floor(1000000 + Math.random() * 900000)}</u>
          </td>

          <td style={{ maxWidth: 250 }}>
            <div className='d-flex align-items-center'>
              <div className='avatar rounded'>
                <div className='avatar-content'>
                  <img src={col.img} alt={col.name} className='img-fluid' />
                </div>
              </div>
              <div>
                <div className='fw-bolder'>
                  {truncateText(col.name, 25)}
                  <br />
                  <Badge pill color='light-danger' role={'button'}>
                    +{Math.floor(10 + Math.random() * 90)} Products
                  </Badge>
                </div>
                {/* <div className='font-small-2 text-muted'>{col.email}</div> */}
              </div>
            </div>
          </td>
          <td>
            <div className='d-flex align-items-center'>
              #{Math.floor(1000000 + Math.random() * 9000000)}
              {Math.floor(100000 + Math.random() * 900000)}
            </div>
          </td>
          {/* <td className='text-nowrap'>
            <div className='d-flex flex-column'>
              <span className='fw-bolder mb-25'> {Math.floor(10 + Math.random() * 90)}</span>
              <span className='font-small-2 text-muted'>in {col.time}</span>
            </div>
          </td> */}
          {/* <td>{CF(col.revenue)}</td> */}
          <td>{col.revenue}</td>
          <td>
            <div className='d-flex align-items-center'>
              <Badge color='light-success' pill>
                Paid
              </Badge>
            </div>
          </td>
          <td>
            <u className='text-primary' role={'button'}>
              #{Math.floor(100000 + Math.random() * 900000)}
            </u>
          </td>
        </tr>
      )
    })
  }

  return (
    <Card className='card-company-table'>
      <CardHeader>Last 30 Transactions</CardHeader>
      <Table responsive>
        <thead>
          <tr>
            <th>Sessions ID</th>
            <th>Cart Items</th>
            <th>Transaction Id</th>
            <th>Amount</th>
            <th>Payment Status</th>
            <th>Store Number</th>
          </tr>
        </thead>
        <tbody>{renderData()}</tbody>
      </Table>
    </Card>
  )
}

export default CompanyTable
