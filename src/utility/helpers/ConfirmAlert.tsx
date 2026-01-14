/* eslint-disable prettier/prettier */
import { useEffect, useState } from 'react'
import { Spinner } from 'reactstrap'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import { Events } from '../Const'
import Emitter from '../Emitter'
import { FM, isValid, log } from './common'

const MySwal = withReactContent(Swal)
/**
 * Show Alert with confirm
 */

interface PropsTypes {
    item?: any | null
    title?: string | null | any
    text?: string | null | any
    enableNo?: boolean
    icon?: any
    confirmButtonText?: any
    showCancelButton?: boolean
    successIcon?: any
    successTitle?: string | null | any
    successText?: string | null | any
    failedIcon?: any
    failedTitle?: string | null | any
    failedText?: string | null | any
    onClickYes?: any | null | undefined
    onClickNo?: any | null | undefined
    children?: any
    id?: string
    style?: any
    className?: any
    onFailedEvent?: any | null | undefined
    onSuccessEvent?: any | null | undefined
    color?: any
    input?: boolean | any | null
    eventId?: string
    onDropdown?: boolean
    menuIcon?: any
}
const ConfirmAlert = ({
    onDropdown = false,
    eventId = Events.confirmAlert,
    item = null,
    title = null,
    text = null,
    enableNo = false,
    menuIcon = null,
    icon = 'warning',
    confirmButtonText,
    showCancelButton = true,
    successIcon = 'success',
    successTitle = null,
    successText = null,
    failedIcon = 'error',
    failedTitle = null,
    failedText = null,
    onClickYes = () => { },
    onClickNo = () => { },
    children,
    id = 't',
    style = {},
    className = {},
    onFailedEvent = () => { },
    onSuccessEvent = () => { },
    color = 'text-success',
    input = false
}: PropsTypes) => {
    const [isOpen, setOpen] = useState(true)
    const [reason, setReason] = useState('')
    const [payload, setPayload] = useState(null)

    const [onSuccess, setOnsuccess] = useState(false)
    const [onFailed, setOnFailed] = useState(false)

    title = title ? FM(title) : ""
    text = text ? FM(text) : FM('are-you-sure')
    confirmButtonText = confirmButtonText ? FM(confirmButtonText) : FM('yes')
    // Success
    successTitle = successTitle ? FM(successTitle) : FM('success')
    successText = successText ? FM(successText) : FM('executed-successfully')
    // Failed
    failedTitle = failedTitle ? FM(failedTitle) : FM('failed')
    failedText = failedText ? FM(failedText) : FM('execution-failed')

    useEffect(() => {
        if (isValid(item)) {
            setPayload((i: any) => ({ ...i, ...item }))
        }
    }, [item])

    useEffect(() => {
        if (isOpen) {
            Emitter.on(eventId, (e: any) => {
                setPayload((i: any) => ({ ...i, ...e?.payload }))
                if (e?.type === 'success') {
                    log(eventId, 'success rec', e)
                    MySwal.fire({
                        icon: successIcon,
                        title: successTitle,
                        text: successText,
                        showConfirmButton: false,
                        timer: 1500
                    }).then(() => {
                        onSuccessEvent(payload)
                        setOpen(false)
                    })
                } else if (e?.type === 'failed') {
                    log(eventId, 'failed rec', e)
                    MySwal.fire({
                        icon: failedIcon,
                        title: failedTitle,
                        text: failedText,
                        showConfirmButton: false,
                        timer: 1500
                    }).then(() => {
                        onFailedEvent(payload)
                        setOpen(false)
                    })
                } else {
                    log(eventId, 'no match')
                }
            })
        }
    }, [isOpen])

    const popup = () => {
        setOpen(true)
        return MySwal.fire({
            title,
            text,
            icon,
            inputValidator: (value) => {
                if (!value) {
                    setReason(value)
                    return 'You need to write a valid reason!'
                } else {
                    return null
                }
            },
            inputLabel: 'Reason for expiry',
            input: input ? 'textarea' : undefined,
            showDenyButton: enableNo,
            showCancelButton,
            confirmButtonText,
            allowOutsideClick: false,
            customClass: {
                input: 'form-control mx-3',
                confirmButton: 'btn btn-primary',
                cancelButton: 'btn btn-outline-danger ms-1',
                denyButton: 'btn btn-warning ms-1'
            },
            inputAttributes: {
                autocapitalize: 'off'
            },
            buttonsStyling: false
        }).then(function (result) {
            if (result.value === true || isValid(result.value)) {
                onClickYes(result.value)
                setOpen(true)
                MySwal.fire({
                    title: (
                        <>
                            <div className=''>
                                <Spinner animation='border' color='danger' size={'lg'}>
                                    <span className='visually-hidden'>Loading...</span>
                                </Spinner>
                            </div>
                        </>
                    ),
                    text: 'Please Wait',
                    showConfirmButton: false,
                    showCancelButton: false,
                    allowOutsideClick: false
                })
            } else if (result.value === false) {
                onClickNo(result.value)
                setOpen(true)
                MySwal.fire({
                    title: (
                        <>
                            <div className=''>
                                <Spinner animation='border' color='danger' size={'lg'}>
                                    <span className='visually-hidden'>Loading...</span>
                                </Spinner>
                            </div>
                        </>
                    ),

                    text: 'Please Wait',
                    showConfirmButton: false,
                    showCancelButton: false,
                    allowOutsideClick: false
                })
            }
        })
    }

    return (
        <>
            <span
                role='button'
                onClick={popup}
                className={onDropdown ? 'dropdown-item d-flex align-items-center' : className}
                style={style}
                id={id ?? 'delete-button'}
            >
                {onDropdown && menuIcon ? (
                    <>
                        <span className='me-1' style={{ marginTop: '-3px' }}>
                            {menuIcon}
                        </span>
                        {children}
                    </>
                ) : (
                    children
                )}
            </span>
        </>
    )
}

export default ConfirmAlert
