/* eslint-disable prettier/prettier */
import '@styles/react/libs/editor/editor.scss'
import { AxiosResponse } from 'axios'
import classNames from 'classnames'
import Cleave from 'cleave.js/react'
import { ContentState, convertFromHTML, convertToRaw, EditorState } from 'draft-js'
import draftToHtml from 'draftjs-to-html'
import flatpickr from 'flatpickr'
import { english } from 'flatpickr/dist/l10n/default'
import { Swedish } from 'flatpickr/dist/l10n/sv'
import { useEffect, useId, useState } from 'react'
import { Editor } from 'react-draft-wysiwyg'
import { HelpCircle } from 'react-feather'
import Flatpickr from 'react-flatpickr'
import { RegisterOptions, useController } from 'react-hook-form'
import SelectReact, { GroupBase, Options, OptionsOrGroups } from 'react-select'
import { AsyncPaginate } from 'react-select-async-paginate'
import { FormFeedback, FormText, Input, InputGroup, Label } from 'reactstrap'
import { InputType } from 'reactstrap/types/lib/Input'
import { dataTypes } from '../../../utility/apis/dropdowns'
import { FM, isValid } from '../../../utility/helpers/common'
import { useSkin } from '../../../utility/hooks/useSkin'
import Show from '../../../utility/Show'
import {
    createSelectOptions,
    decryptAnythingArray,
    formatDate,
    getUniqId,
    selectThemeColors
} from '../../../utility/Utils'
import BsTooltip from '../tooltip'

declare type Checked = 0 | 1
export interface Option {
    label: string | any
    value: number | string | unknown
    extra?: any
}
export interface AsyncOptionProps {
    page: number
    options: OptionsOrGroups<Option, GroupBase<Option>>
    hasMore: boolean
}
interface FormGroupCustomProps {
    noGroup?: boolean
    noLabel?: boolean

    isMulti?: boolean
    isClearable?: boolean
    isDisabled?: boolean
    async?: boolean
    method?: string
    type: InputType | 'mask' | 'editor'
    defaultOptions?: boolean
    name: string
    placeholder?: string
    label?: any
    prepend?: any
    append?: any
    tooltip?: string
    message?: any
    maskOptions?: any
    errorMessage?: any
    className?: any
    pattern?: any
    control: any
    checked?: Checked
    rules?: Omit<RegisterOptions, 'valueAsNumber' | 'valueAsDate' | 'setValueAs' | 'disabled'>
    defaultValue?: any
    datePickerOptions?: flatpickr.Options.Options
    dateFormat?: string
    inputClassName?: any
    inputGroupClassName?: any
    selectOptions?: OptionsOrGroups<Option, GroupBase<Option>>
    //selectOptions?: any[]
    path?: string
    selectValue?: any
    autoFocus?: any
    selectLabel?: any
    jsonData?: any
    formData?: any
    searchItem?: any
    feedback?: any
    step?: any
    onChangeValue?: (e: any) => void
    onOptionData?: (e: any) => void
    modifyDropdownData?: (e: any) => any
    appendDropdownData?: (e: any[]) => any[]
    loadOptions?: (e: dataTypes) => Promise<void | AxiosResponse<any, any>>
    isOptionDisabled?: (option: Option, selectValue: Options<Option>) => boolean
}
const FormGroupCustom = (props: FormGroupCustomProps) => {
    // Input Props
    const {
        name,
        control,
        isMulti = false,
        isClearable = false,
        isDisabled = false,
        rules,
        formData = null,
        method,
        defaultValue,
        type,
        placeholder,
        checked,
        datePickerOptions,
        dateFormat,
        noGroup = false,
        noLabel = false,
        label,
        async = false,
        selectOptions,
        className,
        inputClassName,
        inputGroupClassName,
        loadOptions,
        defaultOptions,
        message,
        tooltip,
        prepend,
        append,
        pattern,
        autoFocus = false,
        errorMessage = null,
        path = null,
        selectValue = null,
        selectLabel = null,
        jsonData = null,
        searchItem = 'name',
        maskOptions,
        step,
        onChangeValue = () => { },
        onOptionData = () => { },
        modifyDropdownData = (e) => {
            return e
        },
        appendDropdownData = (e) => {
            return e
        }
    } = props

    const id = useId()
    const [key, setId] = useState(getUniqId('input-field'))
    // Skin
    const { skin } = useSkin()

    // Async Select Options
    const [selectData, setSelectData] = useState<Option[]>([])
    const [editorValue, setEditorValue] = useState<any>(null)

    // React Hook Form Controller
    const {
        field: { onChange, onBlur, value, ref },
        fieldState: { error }
    } = useController({
        name,
        control,
        rules: {
            ...rules,
            validate:
                typeof rules?.validate === 'function'
                    ? rules?.validate
                    : (val: string) => {
                        return type !== 'select'
                            ? isValid(val)
                                ? String(val)?.replace(/\s/g, '')?.length > 0
                                : true
                            : true
                    }
            // validate: (v) => {
            //   return isValid(v) ? !SpaceTrim(v) : true
            // }
        },
        defaultValue
    })
    // log('val', name, value, defaultValue)
    // Renderer
    let render: JSX.Element = <></>

    async function loadOptionsAsync(search: string, loadedOptions: any, additional: any) {
        const page = additional?.page ?? 1
        let options: OptionsOrGroups<Option, GroupBase<Option>> = []
        let hasMore = false
        if (typeof loadOptions === 'function' && isValid(path)) {
            const res = await loadOptions({
                async,
                path,
                method,
                jsonData: { ...jsonData, [searchItem]: search },
                formData: {
                    ...formData,
                    [searchItem]: search

                },
                page,
                perPage: 50
            })
            const response = res?.data?.payload
            onOptionData(decryptAnythingArray(response?.data))
            const myData = decryptAnythingArray(response?.data)?.map(modifyDropdownData)
            const appendData = appendDropdownData(myData)
            let results: any = {}
            if (response?.data?.length > 0) {
                results = {
                    ...response,
                    data: createSelectOptions(
                        appendData,
                        selectLabel,
                        selectValue
                    )
                }
                options = results?.data ?? []
                hasMore = parseInt(results?.last_page) !== parseInt(results?.current_page)
                additional = {
                    page: page + 1
                }
            }
        }
        return {
            options,
            hasMore,
            additional
        }
    }

    useEffect(() => {
        if (type === 'editor') {
            const a = convertFromHTML(defaultValue ? value : '<p></p>')
            setEditorValue(
                EditorState.createWithContent(
                    ContentState.createFromBlockArray(a.contentBlocks, a.entityMap)
                )
            )
        }
    }, [defaultValue])

    useEffect(() => {
        onChangeValue(value)
    }, [value])

    // Switch types
    switch (type) {
        case 'date':
            render = (
                <>
                    <Flatpickr
                        disabled={isDisabled}
                        className={classNames(`form-control flatpickr-input ${inputClassName}`, {
                            'bg-white': skin !== 'dark',
                            'is-invalid': isValid(error)
                        })}
                        options={{
                            locale: english ?? Swedish, // TODO: change by languages
                            time_24hr: false,
                            ...datePickerOptions
                        }}
                        value={value ?? defaultValue ?? null}
                        placeholder={placeholder ?? label ?? name}
                        name={name}
                        onChange={(e, v, s) => {
                            if (datePickerOptions?.mode === 'multiple' || datePickerOptions?.mode === 'range') {
                                if (dateFormat) {
                                    onChange(e?.map((data: any) => formatDate(data, dateFormat)))
                                } else {
                                    onChange(e)
                                }
                            } else {
                                if (dateFormat) {
                                    onChange(formatDate(v, dateFormat))
                                } else {
                                    onChange(v)
                                }
                            }
                        }}
                        // ref={ref}
                        // ref={ref}
                        id={`input-${id}-tooltip`}
                    />
                </>
            )
            break
        case 'time':
            render = (
                <>
                    <Flatpickr
                        className={classNames(`form-control flatpickr-input ${inputClassName}`, {
                            'bg-white': skin !== 'dark',
                            'is-invalid': isValid(error)
                        })}
                        options={{
                            locale: english ?? Swedish, // TODO: change by languages
                            time_24hr: false,
                            noCalendar: true,
                            enableTime: true,
                            ...datePickerOptions
                        }}
                        value={value ?? defaultValue ?? null}
                        placeholder={placeholder ?? label ?? name}
                        name={name}
                        onChange={(e, v, s) => {
                            if (dateFormat) {
                                onChange(formatDate(v, dateFormat))
                            } else {
                                onChange(v)
                            }
                        }}
                        ref={ref}
                        id={`input-${id}-tooltip`}
                    />
                </>
            )
            break
        case 'select':
            if (async) {
                render = (
                    <>
                        <div className='flex-1'>
                            <AsyncPaginate
                                loadOptions={loadOptionsAsync}
                                value={value ?? defaultValue ?? null}
                                // options={selectOptions}
                                isClearable={isClearable}
                                isMulti={isMulti}
                                name={name}

                                isDisabled={isDisabled}
                                theme={selectThemeColors}
                                selectRef={ref}
                                onMenuScrollToBottom={() => {
                                    //  log('touched')
                                }}
                                defaultOptions={defaultOptions}
                                className={classNames(`react-select ${inputClassName}`, {
                                    'is-invalid': isValid(error)
                                })}
                                isOptionDisabled={props?.isOptionDisabled}
                                placeholder={placeholder ?? label ?? name}
                                classNamePrefix='select'
                                onChange={(val) => {
                                    onChange(val)
                                }}
                                additional={{
                                    page: 1
                                }}
                                id={`input-${id}-tooltip`}
                            />
                        </div>
                    </>
                )
            } else {
                render = (
                    <>
                        <div className='flex-1'>
                            <SelectReact
                                value={value ?? defaultValue ?? null}
                                options={selectOptions}
                                isClearable={isClearable}
                                isDisabled={isDisabled}
                                isMulti={isMulti}
                                name={name}
                                theme={selectThemeColors}
                                ref={ref}
                                className={classNames(`react-select ${inputClassName}`, {
                                    'is-invalid': isValid(error)
                                })}
                                placeholder={placeholder ?? label ?? name}
                                classNamePrefix='select'
                                onChange={(val) => {
                                    onChange(val)
                                }}
                                id={`input-${id}-tooltip`}
                            />
                        </div>
                    </>
                )
            }
            break
        case 'checkbox':
            render = (
                <>
                    <Input
                        checked={value === 1 || defaultValue === 1}
                        placeholder={placeholder ?? label ?? name}
                        name={name}
                        disabled={isDisabled}
                        onChange={(e) => onChange(e?.target?.checked ? 1 : 0)}
                        className={`${inputClassName}`}
                        innerRef={ref}
                        invalid={isValid(error)}
                        type={type}
                        id={`input-${id}-tooltip`}
                    />
                </>
            )
            break
        case 'radio':
            render = (
                <>
                    <Input
                        value={defaultValue}
                        checked={defaultValue === value}
                        placeholder={placeholder ?? label ?? name}
                        name={name}
                        onChange={(e) => onChange(e?.target?.value)}
                        className={` ${inputClassName}`}
                        innerRef={ref}
                        invalid={isValid(error)}
                        type={type}
                        id={`input-${id}-tooltip`}
                    />
                </>
            )
            break
        case 'mask':
            render = (
                <>
                    <Cleave
                        value={value ?? defaultValue ?? null}
                        placeholder={placeholder ?? label ?? name}
                        disabled={isDisabled}
                        name={name}
                        onChange={(e) => onChange(e?.target?.value)}
                        onBlur={(e) => onChange(e?.target?.value)}
                        className={`form-control ${inputClassName} ${error ? 'is-invalid' : ''}`}
                        htmlRef={ref}
                        options={maskOptions}
                        id={`input-${id}-tooltip`}
                    />
                </>
            )
            break
        case 'editor':
            render = (
                <Editor
                    wrapperClassName={isValid(error) ? 'invalid' : ''}
                    editorState={editorValue}
                    onEditorStateChange={(data: any) => {
                        setEditorValue(data)
                        // onChangeValue(draftToHtml(convertToRaw(data?.getCurrentContent())))
                        onChange(draftToHtml(convertToRaw(data?.getCurrentContent())))
                    }}
                />
            )
            break
        default:
            render = (
                <>
                    <Input
                        value={value ?? defaultValue ?? null}
                        placeholder={placeholder ?? label ?? name}
                        disabled={isDisabled}
                        name={name}
                        autoFocus={autoFocus}
                        onChange={(e) => onChange(e?.target?.value)}
                        onBlur={(e) => onChange(e?.target?.value)}
                        className={`form-control ${inputClassName}`}
                        innerRef={ref}
                        invalid={isValid(error)}
                        pattern={type === 'email' ? pattern : null}
                        type={type}
                        step={step}
                        id={`input-${id}-tooltip`}
                    />
                </>
            )
            break
    }
    const renderDefaultMessages = () => {
        let re = null
        switch (error?.type) {
            case 'required':
                re = FM('this-field-is-required')
                break
            case 'min':
                re = FM('please-insert-min-value', { minValue: rules?.min })
                break
            case 'max':
                re = FM('input-reached-max-value', { maxValue: rules?.max })
                break
            case 'validate':
                re = `${FM('invalid-input-data')} ${errorMessage ? `: ${errorMessage}` : ''} ${error?.message ? `: ${error?.message}` : ''
                    }`
                break
            case 'pattern':
                re = `${FM('invalid-input-data')}${errorMessage ? `: ${errorMessage}` : ''}`
                break
            case 'maxLength':
                re = FM('input-max-length-reached', { maxLength: rules?.maxLength })
                break
            case 'minLength':
                re = FM('input-min-length-required', { minLength: rules?.minLength })
                break
            default:
                re = errorMessage ?? ''
                break
        }
        return re
    }
    const renderMessages = (
        <>
            <FormFeedback className={classNames({ 'd-block': isValid(error) })}>
                {renderDefaultMessages()}
            </FormFeedback>
            <Show IF={isValid(message)}>
                <FormText className='fw-bolder'>{message}</FormText>
            </Show>
        </>
    )
    const labelLocal = noLabel ? null : (
        <>
            <Label check={type === 'checkbox'} for={`input-${id}-tooltip`}>
                {label ?? name} {rules?.required ? <span className='text-danger fw-bolder'>*</span> : null}{' '}
                <Show IF={isValid(tooltip)}>
                    <BsTooltip title={tooltip}>
                        <HelpCircle style={{ marginTop: '-2px' }} size={13} className='text-dark' />
                    </BsTooltip>
                </Show>
            </Label>
        </>
    )

    const grouped =
        type === 'checkbox' || type === 'radio' ? (
            <>
                <div className={`form-check ${className}`}>
                    {render} {labelLocal}
                    {renderMessages}
                </div>
            </>
        ) : (
            <>
                <div className={className}>
                    {labelLocal}
                    <InputGroup className={inputGroupClassName}>
                        {prepend ?? null}
                        {render}
                        {append ?? null}
                    </InputGroup>
                    {renderMessages}
                </div>
            </>
        )

    const direct = (
        <>
            {labelLocal}
            {render}
            <p className='mb-0'>{renderMessages}</p>
        </>
    )

    if (noGroup) {
        return <div className={className}>{direct}</div>
    } else {
        return grouped
    }
}

export default FormGroupCustom
