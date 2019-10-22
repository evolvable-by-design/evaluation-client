
import DocumentationBrowser from './DocumentationBrowser';
import HttpCaller from './HttpCaller';

const fetchDocumentation = async (serverUrl) => {
  const httpCaller = new HttpCaller(serverUrl)

  const result = await httpCaller.call({ method: 'options' })
  const documentation = toDocumentationBrowser(result)
  return documentation
}

const toDocumentationBrowser = result => new DocumentationBrowser(
  JSON.parse(
    JSON.stringify(result.data)
      .replace(new RegExp('x-@id', 'g'), '@id')
      .replace(new RegExp('x-@type', 'g'), '@type')
      .replace(new RegExp('x-@context', 'g'), '@context')
      .replace(new RegExp('x-@relation', 'g'), '@relation')
  )
)

export default {
  fetch: fetchDocumentation
}
