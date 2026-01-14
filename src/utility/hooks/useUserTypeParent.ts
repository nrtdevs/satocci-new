import { useEffect, useState } from 'react'
import { useAppSelector } from '../../redux/store'
import { isValid } from '../helpers/common'
// import { getUserData } from '../Utils'
// const localData = getUserData()

const useUserTypeParent = () => {
  const user = useAppSelector((s) => s.auth?.userData)
  const [t, setT] = useState(0)
  useEffect(() => {
    if (isValid(user)) {
      setT(user?.user_type_id)
    }
  }, [user])

  return t as number
}

export default useUserTypeParent
