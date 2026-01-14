import Echo from 'laravel-echo'
import { userProps } from '../Const'
import { isValid } from '../helpers/common'

import httpConfig from '../http/httpConfig'
declare global {
  interface Window {
    Pusher: any
  }
}

window.Pusher = require('pusher-js')

let e: any

const createConnection = () => {
  if (!isValid(e)) {
    if (isValid(httpConfig.socketNotificationUrl) && httpConfig.enableSocket) {
      e = new Echo({
        broadcaster: 'pusher',
        key: 'b3c8fc875e4efec7d95e',
        cluster: 'mt1',
        wsHost: `${httpConfig.socketNotificationUrl}`,
        wsPort: `${httpConfig.socketNotificationPort}`,
        wssPort: `${httpConfig.socketNotificationPort}`,
        disableStats: true,
        forceTLS: false,
        enabledTransports: ['ws', 'wss']
      })
    }
    return e
  }
}

export const echo = createConnection()

export const echoEvent = (callback = (x: any) => {}, user: userProps) => {
  echo
    ?.channel(`cartnotifications.${user?.id}-${user?.unique_id}`)
    .listen('.cartnotifications', callback)
  //   echo?.channel(`notifications`).listen('notifications', (xe: any) => {
  //     log(xe)
  //   })
}
const notificationPayload = {
  event: 'created',
  module: 'activity',
  notification: {
    resource: {},
    read_status: '',
    status_code: '',
    type: '',
    message: '',
    sub_title: '',
    title: '',
    created_at: ''
  }
}
