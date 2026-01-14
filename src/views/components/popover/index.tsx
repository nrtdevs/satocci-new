import { useState } from 'react'
import { PopoverBody, PopoverHeader, UncontrolledPopover } from 'reactstrap'
import { isValid } from '../../../utility/helpers/common'
import Show from '../../../utility/Show'
import { getUniqId } from '../../../utility/Utils'

const BsPopover = ({
  title = null || '',
  Tag = 'span',
  content = null || '',
  children,
  placement = 'top'
}: {
  title?: any
  Tag?: any
  content?: any
  children?: any
  placement?: any
}) => {
  const [id, setId] = useState(getUniqId('popover'))

  if (isValid(content)) {
    return (
      <>
        <UncontrolledPopover trigger='hover' placement={placement} target={id}>
          <Show IF={isValid(title)}>
            <PopoverHeader>{title}</PopoverHeader>
          </Show>
          <PopoverBody>{content}</PopoverBody>
        </UncontrolledPopover>
        <Tag id={id}>{children}</Tag>
      </>
    )
  } else {
    return <Tag id={id}>{children}</Tag>
  }
}

export default BsPopover
