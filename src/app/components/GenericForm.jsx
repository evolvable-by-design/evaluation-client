import React, { useState } from 'react'
import { Heading, IconButton, Pane, Select, Switch, TextInput, majorScale } from 'evergreen-ui';

import ajv from '../../library/services/Ajv';

import { capitalize, spaceCamelCaseWord, stateSetter, onlyWhen, arrayWithoutElAtIndex, setInArray } from '../utils/javascriptUtils';

// TODO: display an error message when required as TextInputField does

const GenericForm = ({values, setter, documentation}) => {
  const [ errors, setErrors ] = useState({}) 
  
  if (documentation === undefined || documentation === [])
    return null

  return <Pane width="100%">
    { documentation.map(parameter =>
      <GenericFormInput
        key={parameter.name}
        parameter={parameter}
        value={values[parameter.name]}
        setValue={stateSetter(setter, parameter.name)}
        error={errors[parameter.name]}
        setError={stateSetter(setErrors, parameter.name)}  
      /> )
    }
  </Pane>
}

const GenericFormInput = ({parameter, value, setValue, error, setError}) =>
  <WithLabel label={parameter.name} key={parameter.name} required={parameter.required}>
    <InputSelector schema={parameter.schema} value={value} error={error} setValue={setValue} setError={setError} required={parameter.required} />
  </WithLabel>

const FormLabel = ({label, required}) => 
  <Pane width={majorScale(15)} marginRight={majorScale(3)}>
    <Heading size={400}>{spaceCamelCaseWord(capitalize(label))}{required ? '*' : ''}</Heading>
  </Pane>

const WithLabel = ({label, required, children}) => 
  <Pane width="100%" display="flex" flexDirection="row" marginBottom={majorScale(3)} alignItems="baseline">
    <FormLabel label={label} required={required} />
    <Pane width="100%" >
      {children}
    </Pane>
  </Pane>

function InputSelector({schema, value, setValue, error, setError, required}) {
  // TODO: resolve and use type from the semantic description

  const onChange = (val) => {
    if (val === '' && !required) {
      setValue(undefined)
    } else {
      const [value, error] = _validateValue(val, schema);
      setError(error)
      setValue(value)
    }
  };

  if (schema.type === 'boolean') {
    return <Switch checked={value} onChange={(e) => onChange(e.target.checked)} height={majorScale(3)}/>
  } else if (schema.type === 'string' && schema.enum !== undefined) {
    return <SelectInput schema={schema} value={value} error={error} onChange={onChange} required={required} />
  } else if (schema.type === 'array') {
    return <ArrayInput schema={schema} values={value || []} setValues={setValue} errors={error || []} setErrors={setError} required={required} />
  } else {
    return <TextInput
        isInvalid={error !== undefined}
        value={value || ''}
        type={schema.format}
        width="100%"
        onChange={(e) => onChange(e.target.value)}
      />
  }
}

function ArrayInput({schema, values, setValues, errors, setErrors, required}) {
  return <div>
    { values.map((v, index) => 
      <Pane display="flex" flexDirection="row" flexWrap="noWrap" marginBottom='8px' key={index}>
        <InputSelector
          schema={schema.items} 
          value={v} 
          error={errors[index]} 
          setValue={newValue => setValues(setInArray(values, newValue, index))} 
          setError={newErr => setErrors(setInArray(errors, newErr, index))}
          required={required && values.length <= schema.minItems}
        />
        <IconButton icon="minus" height={32}  marginLeft={8}
          onClick={() => { setValues(arrayWithoutElAtIndex(values, index)); setErrors(arrayWithoutElAtIndex(errors, index)) }}
        />
      </Pane>
    )}
    <Pane>
      { onlyWhen(values.length < schema.maxItems, () => <IconButton icon="plus" height={32} onClick={() => setValues((values || []).concat(_defaultValue(schema.items)))} />) }
    </Pane>
  </div>
}

function SelectInput({schema, value, error, onChange, required}) {
  const [ touched, setTouched ] = useState(false)

  let options = new Set(schema.enum)
  if (schema.default !== undefined && schema.default !== '')
    options.add(schema.default)
  options = Array.from(options)
  
  return <Select
      isInvalid={error !== undefined && !(value === undefined && !required)}
      value={touched ? value : value || schema.default}
      placeholder={'Please select an option...'}
      width="100%"
      onChange={(e) => { setTouched(true); onChange(e.target.value); }}
      required={required}
    >
      { onlyWhen(!required, () => <option></option>) }
      { options.map(option => <option key={option} value={option}>{option}</option>) }
    </Select>
}

function _validateValue(value, schema) {
  const val = schema.type === 'number' ? parseFloat(value, 10)
    : schema.type === 'integer' ? parseInt(value, 10)
    : schema.type === 'boolean' ? value === true
    : value;
  const validate = ajv.compile(schema);
  const valid = validate(val);
  
  return [val, valid ? undefined : ajv.errorsText(validate.errors)];
}

function _defaultValue(schema) {
  if (schema.default) {
    return schema.default
  } else if (schema.type === 'boolean') {
    return false
  } else if (schema.type === 'number') {
    return 0
  } else if (schema.type === 'array') {
    return []
  } else if (schema.type === 'object') {
    return {}
  } else {
    return ''
  }
}

export default GenericForm
