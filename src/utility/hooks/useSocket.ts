import { useCallback, useContext } from 'react'
import { useAppSelector } from '../../redux/store'
import { JsonParseValidate } from '../Utils'
import { Socket } from '../context/Socket'
import useUser from './useUser'

const useWebSockets = () => {
  const user = useUser()
  const token = useAppSelector((s) => s.auth?.access_token)
  const { sendJsonMessage, sendMessage, lastMessage, readyState } = useContext(Socket)

  const send = useCallback(
    (params: any) =>
      sendJsonMessage({
        ...params,
        token
      }),
    [user]
  )

  return {
    readyState,
    lastMessage: JsonParseValidate(lastMessage?.data),
    lastMessageOriginal: lastMessage,
    send,
    sendMessage
  }
}

export default useWebSockets
