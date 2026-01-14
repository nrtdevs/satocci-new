import { useEffect, useReducer, useState } from 'react'
import { ArrowLeftCircle, ArrowRightCircle, Star } from 'react-feather'
import { useForm } from 'react-hook-form'
import { CardBody, Col, Input, InputGroupText, Row, Spinner } from 'reactstrap'

import { languageLoad } from '../../../redux/reducers/Language'
import {
  LanguageRequestParams,
  useCreateOrUpdateLanguageMutation
} from '../../../redux/RTKQuery/LanguageRTK'
import { loadDropdown } from '../../../utility/apis/dropdowns'

import ReactCountryFlag from 'react-country-flag'
import { useCreateOrUpdateLabelsMutation } from '../../../redux/RTKQuery/LabelsRTK'
import { useAppDispatch } from '../../../redux/store'
import { ExportSample, loadLanguageList } from '../../../utility/apis/ExportLanguage'
import { modeType } from '../../../utility/Const'
import { FM, isValid, isValidArray, log } from '../../../utility/helpers/common'
import ApiEndpoints from '../../../utility/http/ApiEndpoints'
import Show from '../../../utility/Show'
import { stateReducer } from '../../../utility/stateReducer'
import { createConstSelectOptions, getUserData, setInputErrors } from '../../../utility/Utils'
import FormGroupCustom from '../../components/formGroupCustom/FormGroupCustom'
import CenteredModal from '../../components/modal/CenteredModal'

export type CategoryParamsType = {
  id?: string
  name: string
  status?: string
  patent_id?: string
}

interface dataType {
  edit?: any
  response?: (e: boolean) => void
  noView?: boolean
  showModal?: boolean
  setShowModal?: (e: boolean) => void
  Component?: any
  loading?: boolean
  formData?: any
  children?: any

  // rest?: any
}
interface States {
  formData?: LanguageRequestParams
}

export default function LanguageAddModal<T>(props: T & dataType) {
  const {
    edit = null,
    noView = false,
    showModal = false,

    setShowModal = () => {},
    Component = 'span',
    response = () => {},
    children = null,
    ...rest
  } = props

  const initState: States = {
    formData: {
      country: '',
      file: {},
      title: '',
      id: ''
    }
  }
  const [open, setOpen] = useState(false)
  const [editData, setEditData] = useState(null)
  const [files, setFiles] = useState<any>([])
  const [loading, setLoading] = useState(false)
  const [loadingSample, setLoadingSample] = useState(false)
  const reducers = stateReducer<States>
  const [state, setState] = useReducer(reducers, initState)
  const dispatch = useAppDispatch()
  const form = useForm<LanguageRequestParams>()
  const user = getUserData()
  const {
    watch,
    formState: { errors },
    handleSubmit,
    control,
    setValue,
    setError,
    reset
  } = form
  const openModal = () => {
    setOpen(true)
    reset()
  }
  const closeModal = (from = null) => {
    setOpen(false)
    setFiles(null)
    setShowModal(false)
  }

  const [createLanguage, result] = useCreateOrUpdateLanguageMutation()

  const [createLabel, resultLabel] = useCreateOrUpdateLabelsMutation()

  const handleSave = (d: LanguageRequestParams) => {
    if (edit?.id) {
      createLanguage({
        ...edit,
        title: d?.title,
        mode: d?.mode?.value,
        lang_code: d?.lang_code,
        value: d?.country?.extra?.country_code,
        status: 1,
        file: files[0]
      })
    } else {
      createLanguage({
        title: d?.title,
        lang_code: d?.lang_code,
        mode: d?.mode?.value,
        value: d?.country?.extra?.country_code,
        status: 1,
        file: files[0]
      })
    }
  }

  const loadLanguageListData = () => {
    loadLanguageList({
      success: (e) => {
        dispatch(languageLoad(e?.payload?.data))
      }
    })
  }
  log('Check all', watch('check_all'))
  const sampleBooking = () => {
    ExportSample({
      jsonData: {
        all: watch('check_all') === 1 ? 'yes' : null
      },

      loading: setLoadingSample,
      success: (e: any) => {
        window.open(e?.payload?.url, '_blank')
      }
    })
  }
  useEffect(() => {
    if (result?.isSuccess) {
      closeModal()
      setFiles(null)
      response(result?.isSuccess)

      loadLanguageListData()
    }
  }, [result])

  useEffect(() => {
    if (result?.isError) {
      const e: any = result?.error
      setInputErrors(e?.data?.payload, setError)
    }
  }, [result?.isError])

  useEffect(() => {
    if (noView && showModal) {
      openModal()
    }
  }, [noView, showModal])

  log(watch('country'))
  return (
    <>
      {!noView ? (
        <Component role='button' onClick={openModal} {...rest}>
          {children}
        </Component>
      ) : null}
      <CenteredModal
        scrollControl={false}
        modalClass='modal-sm'
        disableSave={!isValidArray(files) || result.isLoading}
        loading={result.isLoading}
        open={open}
        handleModal={closeModal}
        handleSave={handleSubmit(handleSave)}
        title={FM('language')}
      >
        <form>
          <CardBody className=''>
            <Row>
              <FormGroupCustom
                label={FM('country')}
                placeholder={FM('country')}
                //   noLabel
                async
                isClearable
                path={ApiEndpoints.get_countries}
                selectLabel='name'
                selectValue={'id'}
                defaultOptions
                loadOptions={loadDropdown}
                name={'country'}
                type={'select'}
                className='mb-1'
                control={control}
                rules={{ required: true }}
                // prepend={<InputGroupText>{FM('get')}</InputGroupText>}
                prepend={
                  <Show IF={isValid(watch('country')?.extra?.country_code)}>
                    <InputGroupText className='p-25'>
                      <ReactCountryFlag
                        style={{ width: '25px', height: '25px' }}
                        className='country-flag p-0'
                        countryCode={
                          `${watch('country')?.extra?.country_code}` === 'en'
                            ? 'us'
                            : `${watch('country')?.extra?.country_code}`
                        }
                        svg
                      />
                    </InputGroupText>
                  </Show>
                }
              />
              <Col md='12'>
                <FormGroupCustom
                  name='mode'
                  type={'select'}
                  label={FM('mode')}
                  className='mb-1'
                  control={control}
                  // message={FM('select-discount-type-fixed-or-percentage')}
                  selectOptions={createConstSelectOptions(modeType, FM)}
                  rules={{ required: true }}
                  prepend={
                    <Show IF={isValid(watch('mode'))}>
                      <InputGroupText className='p-25'>
                        {watch('mode')?.value === modeType.ltr ? (
                          <ArrowRightCircle className='text-primary' />
                        ) : (
                          <ArrowLeftCircle className='text-primary' />
                        )}
                      </InputGroupText>
                    </Show>
                  }
                />
              </Col>
              <Col md='12' className=''>
                <FormGroupCustom
                  // noLabel
                  type={'text'}
                  control={control}
                  name='title'
                  // className='mt-1'
                  label={FM('language-name')}
                  rules={{ required: true, maxLength: 20 }}
                />
              </Col>
              <Col md='12' className=''>
                <FormGroupCustom
                  // noLabel
                  type={'text'}
                  control={control}
                  name='lang_code'
                  className='mt-1'
                  tooltip={FM('example-code')}
                  label={FM('lang-code')}
                  rules={{ required: true, maxLength: 2 }}
                />
              </Col>
              {/* <Col md='6'></Col> */}
              <Col md='12' className='mt-2'>
                <Input
                  type={'file'}
                  name='file'
                  accept='.csv,.xlsx'
                  placeholder={FM('choose-language-file')}
                  title={FM('choose-language-file')}
                  onChange={(e) => setFiles(e?.target?.files)}
                  label={FM('choose-language-file')}
                />
              </Col>
              <hr className='mt-1' />
            </Row>

            <Row className='pt-1'>
              <div className='text-center mt-1'>
                <Star size={20} />
                <p className='mt-1 text-small-12'>
                  {FM(
                    'Please-download-this-csv-file-and-fill-all-the-details-accordingly.-After-that-you-can-upload-the-file-to-import-your-items.'
                  )}
                </p>
              </div>
              <div className='text-center text-warning mb-1 text-bolder'>
                {loadingSample ? (
                  <div className='loader-top me-2 '>
                    <span className='spinner'>
                      <Spinner color='primary' animation='border' size={'xl'}>
                        <span className='visually-hidden'>
                          {FM('loading-dot', {
                            dot: '...'
                          })}
                        </span>
                      </Spinner>
                    </span>
                  </div>
                ) : (
                  <>
                    <Row>
                      <Col md='6'>
                        <FormGroupCustom
                          // noLabel
                          type={'checkbox'}
                          control={control}
                          name='check_all'
                          className=''
                          tooltip={FM('all-language')}
                          label={FM('all-language')}
                          rules={{ required: false }}
                        />
                      </Col>
                      <Col md='6'>
                        <u onClick={sampleBooking} style={{ cursor: 'pointer' }}>
                          {FM('download-sample-file')}{' '}
                        </u>
                      </Col>
                      <hr className='mt-1' />
                    </Row>
                    {/* <FormGroupCustom
                      // noLabel
                      type={'checkbox'}
                      control={control}
                      name='check_all'
                      className=''
                      tooltip={FM('all-language')}
                      label={FM('all-language')}
                      rules={{ required: false }}
                    />

                    <u onClick={sampleBooking} style={{ cursor: 'pointer' }}>
                      {FM('download-sample-file')}{' '}
                    </u> */}
                  </>
                )}
              </div>
            </Row>
            {/* <p className='mb-0 p-1 border-bottom fw-bolder text-dark' style={{ backgroundColor: "#f4f4f496" }}>OR(Add Manually)</p> */}
          </CardBody>
        </form>
      </CenteredModal>
    </>
  )
}
