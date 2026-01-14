/* eslint-disable prettier/prettier */
import { CSSProperties, Fragment, useEffect, useId, useState } from 'react'
import { UploadCloud } from 'react-feather'
import { Label, Progress, Spinner } from 'reactstrap'
import { uploadFiles } from '../../../utility/apis/common'
import { FM, isValid } from '../../../utility/helpers/common'
import httpConfig from '../../../utility/http/httpConfig'
import Show from '../../../utility/Show'
import { ErrorToast } from '../../../utility/Utils'
import BsTooltip from '../tooltip'
type SimpleImageUploadProps = {
    style?: CSSProperties
    className?: string
    name: string
    height?: number
    borderRadius?: number
    width?: number
    setValue: any
    value?: any
    params: any
}
const SimpleImageUpload = (props: SimpleImageUploadProps) => {
    const { style, className, name, setValue, value, height = 100, width = 100, borderRadius = 3 } = props
    const val = isValid(value) ? httpConfig.baseUrl2 + value : undefined
    const [selectedFile, setSelectedFile] = useState()
    const id = useId()
    const [preview, setPreview] = useState<string | undefined>()
    const [controller, setController] = useState(new AbortController())
    const [progress, setProgress] = useState(0)
    const [loading, setLoading] = useState(false)
    const [uploaded, setUploaded] = useState(null)

    // create a preview as a side effect, whenever selected file is changed
    useEffect(() => {
        if (!selectedFile) {
            setPreview(undefined)
            return
        }

        const objectUrl: any = URL.createObjectURL(selectedFile)
        setPreview(objectUrl)
        setUploaded(null)
        // free memory when ever this component is unmounted
        return () => URL.revokeObjectURL(objectUrl)
    }, [selectedFile])

    useEffect(() => {
        setPreview(val)
    }, [val])

    const handleUpload = (file: any) => {
        if (file) {
            uploadFiles({
                params: props.params,
                success: (d) => {
                    setProgress(0)
                    setUploaded(d?.payload?.file_name)
                    setValue(name, d?.payload?.file_name)
                },
                loading: setLoading,
                progress: setProgress,
                controller,
                formData: { is_multiple: 0, file }
            })
        }
    }

    const onSelectFile = (e: any) => {
        if (!e.target.files || e.target.files.length === 0) {
            setSelectedFile(undefined)
            return
        }
        const fileSize = e.target.files[0].size / 1024 / 1024
        if (fileSize > 2) {
            ErrorToast(FM('please-upload-file-less-than-2-mb'))
        } else {
            setSelectedFile(e.target.files[0])
            handleUpload(e.target.files[0])
        }
    }

    return (
        <Fragment>
            <input
                accept='image/*'
                type='file'
                id={`m-image-upload-${id}`}
                className='d-none'

                onChange={onSelectFile}
            />
            <Label role={'button'} for={`m-image-upload-${id}`}>
                <div
                    className={className}
                    role={'button'}
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        textAlign: 'center',
                        //   padding: 10,
                        borderRadius,
                        height,
                        width,
                        background: '#e4e4e4',
                        ...style
                    }}
                >
                    {selectedFile || isValid(val) ? (
                        <>
                            {loading ? (
                                <Spinner animation='border' size={'sm'}>
                                    <span className='visually-hidden'>Loading...</span>
                                </Spinner>
                            ) : (
                                <>
                                    <BsTooltip title={FM('reupload')}>
                                        <img
                                            className='img-fluid'
                                            style={{ objectFit: 'cover', height, width }}
                                            src={preview}
                                        />
                                    </BsTooltip>
                                </>
                            )}
                        </>
                    ) : (
                        <div>
                            <UploadCloud className='text-secondary' />
                            <div className='text-secondary mt-50 text-small-12'>{FM('select-image')}</div>
                        </div>
                    )}
                    <Show IF={loading}>
                        <Progress animated striped className='progress-bar-success my-1' value={progress} />
                    </Show>
                </div>
            </Label>
        </Fragment>
    )
}

export default SimpleImageUpload
