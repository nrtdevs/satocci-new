/* eslint-disable prettier/prettier */
// ** React Imports
// ** Styles
import '@styles/react/libs/flatpickr/flatpickr.scss'
import { Button, ButtonGroup, Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap'
import { FM } from '../../../utility/helpers/common'
import Hide from '../../../utility/Hide'
import LoadingButton from '../buttons/LoadingButton'

interface dataType {
    id?: string | any
    hideSave?: boolean
    footerComponent?: any
    display?: boolean
    scrollControl?: boolean
    disableHeader?: boolean
    disableFooter?: boolean
    loading?: boolean
    modalClass?: any
    open?: boolean
    disableSave?: boolean
    handleModal?: any
    children?: any
    btnColor?: any
    handleSave?: any
    handleSign?: any
    fullscreen?: any
    title?: any
    sign?: any
    done?: any
    close?: any
    extraButtons?: any
}

const CenteredModal = ({
    id,
    hideSave = false,
    footerComponent = null,
    display = true,
    scrollControl = true,
    disableHeader = false,
    disableFooter = false,
    loading = false,
    modalClass,
    open,
    disableSave = false,
    handleModal,
    children,
    handleSave,
    handleSign,
    fullscreen,
    btnColor = 'primary',
    title = 'modal-title',
    sign = 'sign',
    done = 'save',
    close = 'close',
    extraButtons = null
}: dataType) => {
    // log(open)
    return (
        <>
            <Modal
                isOpen={open}
                toggle={(e: any) => handleModal(null)}
                backdrop='static'
                scrollable={scrollControl}
                disableSave={loading}
                keyboard={false}
                isVisible={open}
                className={`modal-dialog-centered ${modalClass} ${open ? 'visible' : ''}`}
                fullscreen={fullscreen}
            >
                <Hide IF={disableHeader}>
                    <ModalHeader className='' toggle={(e) => handleModal(null)}>
                        {title}
                    </ModalHeader>
                </Hide>
                <ModalBody className='flex-grow-1 p-0' id={id}>
                    {children}
                </ModalBody>
                <Hide IF={disableFooter}>
                    <ModalFooter>
                        <Hide IF={footerComponent}>
                            <div className=''>
                                <ButtonGroup className='btn-block'>
                                    <Button color='secondary' onClick={(e) => handleModal('from-button')} outline>
                                        <>{FM(`close`)}</>
                                    </Button>
                                    <Hide IF={hideSave}>
                                        <LoadingButton
                                            disabled={disableSave}
                                            loading={loading}
                                            color={btnColor}
                                            outline={extraButtons !== null}
                                            onClick={handleSave}
                                        >
                                            <>{FM(done)}</>
                                        </LoadingButton>
                                    </Hide>

                                    {extraButtons}
                                </ButtonGroup>
                            </div>
                        </Hide>
                        {footerComponent}
                    </ModalFooter>
                </Hide>
            </Modal>
        </>
    )
}

export default CenteredModal
