// ** React Imports
import { Fragment, useEffect, useState } from 'react'

// ** Reactstrap Imports
import { Button, ButtonGroup, ListGroup, ListGroupItem, Progress } from 'reactstrap'

// ** Custom Components

// ** Third Party Imports
// import { toast } from 'react-toastify'
import { useDropzone } from 'react-dropzone'
import { Check, DownloadCloud, Eye, FileText, Trash2, UploadCloud, X } from 'react-feather'
import { uploadFiles } from '../../../utility/apis/common'
import { ErrorToast, getFIleBinaries, humanFileSize, truncateText } from '../../../utility/Utils'
// import { ErrorToast, getFIleBinaries, humanFileSize } from '../../../../utility/Utils'
// // ** Styles
import '@styles/react/libs/file-uploader/file-uploader.scss'
import Hide from '../../../utility/Hide'
import Show from '../../../utility/Show'
import BsTooltip from '../tooltip'
import { FM, log } from '../../../utility/helpers/common'
import { FMKeys } from '../../../configs/i18n/FMTypes'
import httpConfig from '../../../utility/http/httpConfig'
// import { FM, isValid, log } from '../../../../utility/helpers/common'
// import Show from '../../../../utility/Show'
// import Hide from '../../../../utility/Hide'
// import { uploadFiles } from '../../../../utility/apis/commons'
// import BsTooltip from '../../tooltip'
type responseFileType = {
  file_extension: string
  file_name: string
  uploading_file_name: string
}
type DropZoneTypes = {
  onSuccess: (e: Array<responseFileType>) => void
  accept?: any
  maxFileSize?: number
  minSize?: number
  maxFiles?: number
  title?: FMKeys
  desc?: FMKeys
}

const DropZone = ({
  onSuccess = (e) => {},
  accept = undefined,
  maxFileSize = 10.2,
  minSize = 0,
  maxFiles = 1,
  title = 'upload',
  desc = 'drop-your-file-here-or-click'
}: DropZoneTypes) => {
  // ** State
  const [files, setFiles] = useState<Array<any>>([])
  const [controller, setController] = useState(new AbortController())
  const [progress, setProgress] = useState(0)
  const [loading, setLoading] = useState<boolean>(false)
  const [uploaded, setUploaded] = useState<Array<any>>([])
  const [oldFiles, setOldFIles] = useState<Array<any>>([])
  const maxSize = maxFileSize * 1048576
  const multiple = maxFiles > 1
  useEffect(() => {
    onSuccess(uploaded)
  }, [uploaded])

  const { getRootProps, getInputProps } = useDropzone({
    multiple: maxFiles > 1 && files?.length === 0,
    accept,
    maxSize,
    minSize,
    maxFiles,
    onDrop: (acceptedFiles, rejectedFiles) => {
      if (rejectedFiles.length) {
        ErrorToast('invalid-file-selected')
      } else {
        setFiles([...files, ...acceptedFiles.map((file) => Object.assign(file))])
      }
    }
  })

  const handleRemoveFile = (file: any) => {
    const uploadedFiles = files
    const filtered = uploadedFiles.filter((i) => i.name !== file?.name)
    setFiles([...filtered])

    if (maxFiles === 1) {
      setUploaded([])
    } else {
      const uF = uploaded
      const f = uF.filter((i) => i.uploading_file_name !== file?.uploading_file_name)
      setUploaded([...f])
    }
  }

  const renderFileSize = (size: any) => {
    return humanFileSize(size)
  }

  const renderFilePreview = (file: any, large = false) => {
    if (file.type.startsWith('image')) {
      return (
        <img
          style={{ height: large ? 200 : 45, width: large ? '100%' : 45, objectFit: 'cover' }}
          className='rounded'
          alt={file?.name}
          src={URL.createObjectURL(file)}
        />
      )
    } else {
      return maxFiles > 1 ? <FileText size='45' /> : null
    }
  }
  function checkURL(url: any) {
    return String(url).match(/\.(jpeg|jpg|gif|png)$/) !== null
  }

  const renderOldFilePreview = (file: any) => {
    if (checkURL(file?.file_name)) {
      return (
        <img
          className='rounded'
          alt={file?.file_name}
          src={httpConfig.baseUrl2 + file?.file_name}
          height='28'
          width='28'
        />
      )
    } else {
      return <FileText size='28' />
    }
  }
  function baseName(str: any) {
    let base = new String(str)?.substring(str?.lastIndexOf('/') + 1)
    if (base?.lastIndexOf('.') !== -1) base = base?.substring(0, base?.lastIndexOf('.'))
    return base
  }
  const handleUpload = () => {
    uploadFiles({
      success: (d) => {
        setProgress(0)
        const f = d?.payload
        setUploaded([...uploaded, ...f])
        setFiles([])
      },
      loading: (e) => setLoading(e),
      progress: (e) => setProgress(e),
      controller,
      formData: { is_multiple: 1, ...getFIleBinaries(files) }
    })
  }
  const handleCancel = () => {
    controller?.abort()
    setController(new AbortController())
    setProgress(0)
  }

  // selected file list (not uploaded)
  const fileList = files?.map((file, index) => (
    <>
      <ListGroupItem
        key={`${file?.name}-${index}`}
        className='d-flex align-items-center justify-content-between'
      >
        <div className='file-details d-flex align-items-center'>
          <div className='file-preview me-1 '>{renderFilePreview(file)}</div>
          <div>
            <p className='file-name mb-0'>{truncateText(file?.name, 10)}</p>
            <p className='file-size mb-0'>{renderFileSize(file.size)}</p>
          </div>
        </div>
        <div>
          <BsTooltip
            Tag={Button}
            title='remove'
            color='danger'
            outline
            size='sm'
            className='btn-icon me-0'
            onClick={() => {
              handleRemoveFile(file)
            }}
          >
            <Trash2 size={14} />
          </BsTooltip>
        </div>
      </ListGroupItem>
    </>
  ))
  // single list to upload
  const fileListSingle = files?.map((file, index) => (
    <>
      <div key={`${file?.name}-${index}`} className='p-25 border shadow rounded'>
        <div className='file-preview'>{renderFilePreview(file, true)}</div>
        <div className='file-details p-1 d-flex align-items-center'>
          <div className='flex-1'>
            <p className='text-dark mb-0'>{truncateText(file?.name, 15)}</p>
            <p className='file-size  mb-0 text-small-12'>{renderFileSize(file.size)}</p>
          </div>
          <div>
            <Hide IF={loading || files?.length <= 0}>
              <BsTooltip
                Tag={Button}
                title='remove'
                color='danger'
                outline
                size='sm'
                className='btn-icon me-50'
                onClick={() => {
                  handleRemoveFile(file)
                }}
              >
                <Trash2 size={14} />
              </BsTooltip>
              <BsTooltip
                Tag={Button}
                title='upload'
                color='primary'
                outline
                size='sm'
                className='btn-icon me-0'
                onClick={handleUpload}
              >
                <UploadCloud size={14} />
              </BsTooltip>
            </Hide>
            <Show IF={loading}>
              <BsTooltip title={FM('cancel')}>
                <X role={'button'} onClick={handleCancel} className='ms-1 text-danger' size={22} />
              </BsTooltip>
            </Show>
          </div>
        </div>
      </div>
    </>
  ))
  // render uploaded files
  const uploadedFiles = uploaded?.map((file, index) => (
    <ListGroupItem
      key={`${file?.name}-${index}`}
      className='d-flex align-items-center justify-content-between'
    >
      <div className='file-details d-flex align-items-center'>
        <div className='file-preview me-1'>{renderOldFilePreview(file)}</div>
        <div>
          <p className='file-name mb-0'>{file?.uploading_file_name}</p>
          {/* <p className='file-size mb-0'>{(file.file_extension)}</p> */}
        </div>
      </div>
      <div>
        <BsTooltip
          Tag={Button}
          title='remove'
          color='danger'
          outline
          size='sm'
          className='btn-icon me-50'
          onClick={() => {
            handleRemoveFile(file)
          }}
        >
          <Trash2 size={14} />
        </BsTooltip>
        <BsTooltip
          Tag={Button}
          title='view'
          color='primary'
          outline
          size='sm'
          className='btn-icon'
          onClick={() => {
            window.open(httpConfig.baseUrl2 + file?.file_name, '_blank')
          }}
        >
          <Eye size={14} />
        </BsTooltip>
      </div>
    </ListGroupItem>
  ))

  const renderOldList = oldFiles?.map((file, index) => (
    <ListGroupItem
      key={`${file?.name}-${index}`}
      className='d-flex align-items-center justify-content-between'
    >
      <div className='file-details d-flex align-items-center'>
        <div className='file-preview me-1'>{renderOldFilePreview(file)}</div>
        <div>
          <p className='file-name mb-0'>{file?.name ?? baseName(file?.url)}</p>
        </div>
      </div>
      <div>
        <Button color='flat-success' size='sm' className='btn-icon'>
          <Check size={14} />
        </Button>
        <BsTooltip
          Tag={Button}
          title='view'
          color='primary'
          outline
          size='sm'
          className='btn-icon'
          onClick={() => {
            window.open(file?.url, '_blank')
          }}
        >
          <Eye size={14} />
        </BsTooltip>
      </div>
    </ListGroupItem>
  ))

  const handleRemoveAllFiles = () => {
    setFiles([])
    setUploaded([])
  }

  const handleReplace = () => {
    setOldFIles([])
  }

  return (
    <>
      <Hide
        IF={
          maxFiles === files?.length ||
          maxFiles === uploaded?.length ||
          maxFiles === files?.length + uploaded?.length ||
          maxFiles === 0 ||
          oldFiles?.length > 0
        }
      >
        <div {...getRootProps({ className: 'dropzone' })}>
          <input {...getInputProps()} />
          <div className='d-flex align-items-center justify-content-center flex-column'>
            <UploadCloud className='mt-1' size={55} />
            <h5 className='mt-1'>{FM(title)}</h5>
            <p className='text-secondary text-center text-size-12 mb-0 ps-2 pe-2'>
              <a href='/' onClick={(e) => e.preventDefault()}>
                {FM(desc)}
              </a>
            </p>
            {/* <p className='text-size-12 mb-0 text-dark fw-bold mt-0'> {`Please Upload File Less Than ${ size : renderFileSize(maxSize) }`}</p> */}
            <p className='text-size-12 mt-1 mb-0 text-dark fw-bold mt-0'>
              {FM('max-file-size')}: {renderFileSize(maxSize)}
            </p>
          </div>
        </div>
      </Hide>

      {files?.length || uploaded?.length ? (
        <Fragment>
          <ListGroup className={maxFiles === files?.length || maxFiles === 0 ? '' : 'my-2'}>
            {uploadedFiles}
            {maxFiles > 1 ? fileList : fileListSingle}
          </ListGroup>
          {/* <Show IF={maxFiles === files?.length + uploaded?.length && maxFiles > 1}>
            <div className='limit-reached text-danger text-size-12'>
              {FM('maximum-upload-limit-reached')}
            </div>
          </Show> */}
          <Show IF={loading}>
            <Progress animated striped className='progress-bar-success my-1' value={progress} />
          </Show>

          <div className='d-flex justify-content-end mt-2'>
            <Hide IF={loading || maxFiles === 1}>
              <Button className='me-1' color='danger' outline onClick={handleRemoveAllFiles}>
                Remove All
              </Button>
            </Hide>
            <Show IF={loading && multiple === true}>
              <Button className='me-1' color='danger' outline onClick={handleCancel}>
                Cancel
              </Button>
            </Show>
            <Hide IF={loading || files?.length <= 0 || multiple === false}>
              <Button onClick={handleUpload} color='primary'>
                {' '}
                Upload{' '}
              </Button>
            </Hide>
          </div>
        </Fragment>
      ) : null}
      {oldFiles?.length ? (
        <Fragment>
          <ListGroup className={'my-2'}>{renderOldList}</ListGroup>

          <div className='d-flex justify-content-end mt-2'>
            <Button className='me-1' color='danger' outline onClick={handleReplace}>
              Replace
            </Button>
          </div>
        </Fragment>
      ) : null}
    </>
  )
}

export default DropZone
