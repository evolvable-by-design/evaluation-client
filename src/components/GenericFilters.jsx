import React, { useState } from 'react';
import { Button, Icon, Pane, Paragraph, SelectField, TextInputField, Tooltip, majorScale } from 'evergreen-ui';

import ajv from '../services/Ajv';
import SwitchInputField from './SwitchInputField';

export function genericFilters({parameters, values, setValues}) {
  return parameters.length === 0
    ? <></>
    : <Pane width="100%" display="flex" flexDirection="row" flexWrap="wrap" alignItems="flex-start" justifyContent="flex-start">
        {
          parameters.map(param =>
            <Pane display="flex" height="100%" key={param.name} marginRight={majorScale(3)} >
              <SelectInput
                parameter={param}
                value={values[param.name]}
                setValue={value => setValues(state => {
                  state[param.name] = value;
                  return state;
                })}
              />
            </Pane>)
        }
        <Button appearance="primary" onClick={() => alert('Will fetch the API very soon.')}>Update</Button>
      </Pane>;
};

function SelectInput({parameter, value, setValue}) {
  // TODO: resolve and use type from the semantic description
  const [error, setError] = useState(undefined);

  const labelText = parameter.name.charAt(0).toUpperCase() + parameter.name.slice(1);
  const label = <Tooltip content={parameter.description}><Paragraph width="100%"><Icon size={11} icon="info-sign" /> {labelText}</Paragraph></Tooltip>;
  const onChange = (e) => {
    const [value, error] = _validateValue(e.target.value, parameter);
    setError(error);
    setValue(value);
  };

  if (parameter.schema.type === 'boolean') {
    return <SwitchInputField label={label} checked={value} onChange={onChange}/>
  } else if (parameter.schema.type === 'string' && parameter.schema.enum !== undefined) {
    return <Pane width={majorScale(24)}>
      <SelectField 
        label={label}
        isInvalid={error !== undefined}
        value={value}
        required={parameter.required}
        placeholder={'Please select an option...'}
        validationMessage={error}
        width="100%"
        onChange={onChange}
      >
        { parameter.schema.enum.map(option => <option value="option" selected={parameter.schema.default === option} >{option}</option>) }
      </SelectField>
    </Pane>
  } else {
    return <Pane width={majorScale(24)}>
      <TextInputField 
        label={label}
        isInvalid={error !== undefined}
        value={value}
        required={parameter.required}
        placeholder={parameter.schema.format}
        validationMessage={error}
        width="100%"
        onChange={onChange}
      />
    </Pane>
  }
}

function _validateValue(value, parameter) {
  const val = parameter.schema.type === 'number' ? parseFloat(value, 10)
    : parameter.schema.type === 'integer' ? parseInt(value, 10)
    : value;
  const validate = ajv.compile(parameter.schema);
  const valid = validate(val);
  
  return [val, valid ? undefined : ajv.errorsText(validate.errors)];
}

export default genericFilters