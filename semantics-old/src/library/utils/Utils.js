export function matchUrlPattern(url, pattern) {
  const urlSplit = removeQueryAndTrailingSlash(url).split('/')
  const patternSplit = removeQueryAndTrailingSlash(pattern).split('/')

  if (patternSplit.length < urlSplit.length)
    return false;

  return patternSplit.map((fragment, index) => {
    if (fragment.startsWith('{') && fragment.endsWith('}')) {
      return urlSplit[index] !== undefined
    } else {
      return fragment === urlSplit[index]
    }
  }).reduce((match, el) => match && el, true)
}

export function removeQueryAndTrailingSlash(url) {
  const urlWithoutQuery = url.indexOf('?') === -1 ? url : url.slice(0, url.indexOf('?'))
  return urlWithoutQuery.endsWith('/')
    ? urlWithoutQuery.slice(0, urlWithoutQuery.length - 1)
    : urlWithoutQuery
}

export function extractPathParameters(resourceUrl, path) {
  const firstPathPart = path.substring(0, path.indexOf('/', 1))
  const pathname = resourceUrl.startsWith('http') ? new URL(resourceUrl).pathname : resourceUrl
  const url = pathname.substring(firstPathPart)
  const urlSplit = url.substring(1).split('/')
  const match = matchUrlPattern(resourceUrl, path)

  if (!match) { return {}; }

  return path.substring(1).split('/')
    .reduce((acc, el, i) => {
      if (acc === undefined) {
        return undefined
      } else if (el.startsWith('{') && el.endsWith('}')) {
        acc[el.substring(1, el.indexOf('}'))] = urlSplit[i]
        return acc
      } else if (el ===  urlSplit[i]) {
        return acc
      } else {
        return undefined
      }
    }, {})
}