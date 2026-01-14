import { useEffect, useState } from 'react'
import { useAppSelector } from '../../redux/store'
import { isValid } from '../helpers/common'
import { getUserData } from '../Utils'
const localData = getUserData()

const useUserType = () => {
  const user = useAppSelector((s) => s.auth?.userData)
  const [t, setT] = useState(localData?.user_type_id ?? 0)
  useEffect(() => {
    if (isValid(user)) {
      setT(user?.user_type_id)
    }
  }, [user])

  return t as number
}

export default useUserType
