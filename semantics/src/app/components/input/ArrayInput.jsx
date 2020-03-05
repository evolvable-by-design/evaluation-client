import React from 'react'
import { IconButton, Pane } from 'evergreen-ui';

import { onlyWhen, arrayWithoutElAtIndex, setInArray } from '../../utils/javascriptUtils';

function ArrayInput({ values, setValues, required, minItems, maxItems, input }) {
  return <div>
    { values.map((v, index) => 
      <Pane display="flex" flexDirection="row" flexWrap="noWrap" marginBottom='8px' key={index}>
        {
          input({
            value: v,
            setValue: (newValue) => setValues(setInArray(values, newValue, index)),
            required: (required && values.length <= (minItems || 0))
          })
        }
        <IconButton icon="minus" height={32}  marginLeft={8}
          onClick={() => setValues(arrayWithoutElAtIndex(values, index))}
        />
      </Pane>
    )}
    <Pane>
      { onlyWhen(maxItems === undefined || values.length < maxItems, () => <IconButton icon="plus" height={32} onClick={() => setValues(values.concat([''])) } />)}
    </Pane>
  </div>
}

export default ArrayInput