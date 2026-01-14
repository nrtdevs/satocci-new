import Products from '../../../ProductManagement'

const ProductsView = ({
  reloadProduct = false,
  storeId,
  ref
}: {
  reloadProduct: boolean
  storeId?: any
  ref?: any
}) => {
  return (
    <div>
      <Products ref={ref} hideHeader />
    </div>
  )
}

export default ProductsView
