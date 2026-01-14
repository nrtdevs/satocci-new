// ** React Imports
import { Fragment, useEffect, useState } from 'react'

// ** Shop Components
import Products from './Products'
import Sidebar from './Sidebar'

// ** Custom Components
import Breadcrumbs from '@components/breadcrumbs'

// ** Store & Actions
import { useDispatch, useSelector } from 'react-redux'
import {
  addToCart,
  addToWishlist,
  deleteCartItem,
  deleteWishlistItem,
  getCartItems,
  getProducts
} from '../store'

// ** Styles
import '@styles/react/apps/app-ecommerce.scss'

const Shop = () => {
  // ** States
  const [activeView, setActiveView] = useState('grid')
  const [sidebarOpen, setSidebarOpen] = useState(false)

  // ** Vars
  const dispatch = useDispatch()
  const store = useSelector((state) => state.ecommerce)

  // ** Get products
  useEffect(() => {
    dispatch(
      getProducts({
        q: '',
        sortBy: 'featured',
        perPage: 9,
        page: 1
      })
    )
  }, [dispatch])

  return (
    <Fragment>
      <Breadcrumbs title='Shop' data={[{ title: 'eCommerce' }, { title: 'Shop' }]} />
      <Products
        store={store}
        dispatch={dispatch}
        addToCart={addToCart}
        activeView={activeView}
        getProducts={getProducts}
        sidebarOpen={sidebarOpen}
        getCartItems={getCartItems}
        setActiveView={setActiveView}
        addToWishlist={addToWishlist}
        setSidebarOpen={setSidebarOpen}
        deleteCartItem={deleteCartItem}
        deleteWishlistItem={deleteWishlistItem}
      />
      <Sidebar sidebarOpen={sidebarOpen} />
    </Fragment>
  )
}
export default Shop
