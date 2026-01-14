import React, { useState } from 'react'

function HandleModal(): [boolean, () => void] {
  const [showModal, setShowModal] = useState(false)

  const handleModal = () => {
    setShowModal(!showModal)
  }
  return [showModal, handleModal]
}

export { HandleModal as useNoViewModal }
