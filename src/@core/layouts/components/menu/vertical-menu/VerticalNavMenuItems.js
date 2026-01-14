// ** Vertical Menu Components
import VerticalNavMenuGroup from './VerticalNavMenuGroup'
import VerticalNavMenuLink from './VerticalNavMenuLink'
import VerticalNavMenuSectionHeader from './VerticalNavMenuSectionHeader'

// ** Utils
import {
  canViewMenuGroup,
  canViewMenuItem,
  resolveVerticalNavMenuItemComponent as resolveNavItemComponent
} from '@layouts/utils'
import useUserTypeParent from '../../../../../utility/hooks/useUserTypeParent'

const VerticalMenuNavItems = (props) => {
  const userType = useUserTypeParent()
  // ** Components Object
  const Components = {
    VerticalNavMenuLink,
    VerticalNavMenuGroup,
    VerticalNavMenuSectionHeader
  }

  // ** Render Nav Menu Items
  const RenderNavItems = props.items.map((item, index) => {
    const TagName = Components[resolveNavItemComponent(item)]
    if (item.children) {
      return (
        canViewMenuGroup(item) && <TagName item={item} index={index} key={item.id} {...props} />
      )
    }
    return canViewMenuItem(item) && <TagName key={item.id || item.header} item={item} {...props} />
  })

  return RenderNavItems
}

export default VerticalMenuNavItems
