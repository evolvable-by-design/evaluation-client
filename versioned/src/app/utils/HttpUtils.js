export function extractLinkHeaderValues(linkHeader) {
  // Link header values are formatted like: '<link; rel="relation">, <otherLink; rel="relation">'
  return linkHeader.split(',')
    .map(entry => entry.trim())
    .map(entry => entry.slice(1, -1))
    .map(entry => entry.split(';')
      .map(s => s.trim())
      .reduce((accumulator, value, i) => {
        if (i === 0) {
          accumulator['value'] = value
        } else {
          const [key, val] = value.split('=')
          accumulator[key] = val.slice(1, -1)
        }
        return accumulator
      }, {})
    )
}