import { useEffect } from 'react'
import { useHtml5QrCodeScanner, useHtml5QrCode } from 'react-html5-qrcode-reader'
import { isValid, log } from '../../../utility/helpers/common'

export type ScanResultProps = {
  decodedText: any
  result: {
    text: any
    format: {
      format: any
      formatName: any
    }
    debugData: {
      decoderName: any
    }
  }
}
export type ScanProps = {
  onSuccess: (resultText: string, result: ScanResultProps) => void
}
export function ScanBarcode(props: ScanProps) {
  const { Html5Qrcode } = useHtml5QrCode('/assets/js/html5-qrcode.min.js')

  useEffect(() => {
    if (Html5Qrcode) {
      const html5QrCode = new Html5Qrcode('reader')
      Html5Qrcode.getCameras()
        .then((devices: any) => {
          /**
           * devices would be an array of objects of type:
           * { id: "id", label: "label" }
           */
          if (devices && devices.length) {
            const qrCodeSuccessCallback = (decodedText: any, decodedResult: any) => {
              /* handle success */
              if (isValid(decodedText)) {
                log(decodedText, JSON.stringify(decodedResult))
                props.onSuccess(decodedText, decodedResult)
                const audio = new Audio('/assets/notification.mpeg')
                audio.play()
              }
            }
            const config = { fps: 0, qrbox: { width: 200, height: 100 } }

            // If you want to prefer front camera
            // html5QrCode.start({ facingMode: 'user' }, config, qrCodeSuccessCallback)

            // If you want to prefer back camera
            html5QrCode.start({ facingMode: 'environment' }, config, qrCodeSuccessCallback)
          }
        })
        .catch((err: any) => {
          // handle err
          log(err)
        })

      return () => {
        html5QrCode
          .stop()
          .then((ignore: any) => {
            // QR Code scanning is stopped.
          })
          .catch((err: any) => {
            // Stop failed, handle it.
          })
      }
    }
  }, [Html5Qrcode])

  // beware: id must be the same as the first argument of Html5QrcodeScanner
  return <div id='reader'></div>
}
