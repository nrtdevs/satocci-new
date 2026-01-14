import { useEffect, useState } from 'react'
import { useAppSelector } from '../../redux/store'
import { isValid } from '../helpers/common'

interface UserProps {
  id: number
  store_id: number
  currency?: string
  store_setting: any
  is_connected_to_stripe?: boolean
  top_most_store_id?: number
  allow_return_and_refunds?: any
}
const useUser = () => {
  const user = useAppSelector((s) => s.auth?.userData)
  const [t, setT] = useState<UserProps | null>(null)

  useEffect(() => {
    if (isValid(user)) {
      setT(user)
    }
  }, [user])

  return t
}

export default useUser
