import React from 'react';
import { Alert, Heading, Pane, SelectField, Switch, TextInput, majorScale } from 'evergreen-ui';

import ajv from '../services/Ajv';

import { capitalize, spaceCamelCaseWord, stateSetter } from '../utils/javascriptUtils';

// TODO: display an error message when required as TextInputField does
// TODO: show required fields close to the label

export function genericForm({bodySchema, values, setValues, errors, setErrors}) {
  console.log(values)
  if (bodySchema === undefined)
    return <></>;

  if (bodySchema.type !== 'object')
    return <Alert intent="danger" title="Sorry, we are unable to support this operation." />

  const { required, properties } = bodySchema;

  return <Pane width="100%">
    {
      Object.entries(properties).map(([key, value]) =>
        <WithLabel label={key} key={key} required={required.includes(key)}>
          <SelectInput 
            schema={value}
            value={values[key]}
            error={errors[key]}
            setValue={stateSetter(setValues, key)}
            setError={stateSetter(setErrors, key)}
          />
        </WithLabel>)
    }
  </Pane>
}

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

function SelectInput({schema, value, setValue, error, setError}) {
  // TODO: resolve and use type from the semantic description

  const onChange = (val) => {
    const [value, error] = _validateValue(val, schema);
    setError(error);
    setValue(value);
  };

  if (schema.type === 'boolean') {
    return <Switch checked={value} onChange={(e) => onChange(e.target.checked)} height={majorScale(3)}/>
  } else if (schema.type === 'string' && schema.enum !== undefined) {
    return <SelectField
        isInvalid={error !== undefined}
        value={value}
        placeholder={'Please select an option...'}
        width="100%"
        onChange={(e) => onChange(e.target.value)}
      >
        { schema.enum.map(option => <option value="option" selected={schema.default === option} >{option}</option>) }
      </SelectField>
  } else {
    return <TextInput
        isInvalid={error !== undefined}
        value={value}
        placeholder={schema.format}
        width="100%"
        onChange={(e) => onChange(e.target.value)}
      />
  }
}

function _validateValue(value, schema) {
  console.log(value)
  const val = schema.type === 'number' ? parseFloat(value, 10)
    : schema.type === 'integer' ? parseInt(value, 10)
    : schema.type === 'boolean' ? value === true
    : value;
  const validate = ajv.compile(schema);
  const valid = validate(val);
  
  return [val, valid ? undefined : ajv.errorsText(validate.errors)];
}

export default genericForm
