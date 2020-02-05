import React, { useState } from 'react'
import { Select } from 'evergreen-ui'

import { onlyWhen } from '../../utils/javascriptUtils'

function SelectInput({ options, defaultValue, value, error, onChange, required }) {
  const [ touched, setTouched ] = useState(false)
  
  return <Select
      isInvalid={error !== undefined && !(value === undefined && !required)}
      value={touched ? value : value || defaultValue}
      placeholder={'Please select an option...'}
      width="100%"
      onChange={(e) => { setTouched(true); onChange(e); }}
      required={required}
    >
      { onlyWhen(!required, () => <option></option>) }
      { options.map(option => <option key={option} value={option}>{option}</option>) }
    </Select>
}

export default SelectInput