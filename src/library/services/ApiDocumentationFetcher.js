import Config from '../../config';
import DocumentationBrowser from './DocumentationBrowser';
import HttpCaller from './HttpCaller';

const fetchDocumentationOptions = { method: 'options', url: Config.serverUrl };

const fetchDocumentation = async (setDocumentation, setIsLoading, setError) => {
  setError(undefined);
  setIsLoading(true);
  
  try {
    const result = await HttpCaller.call(fetchDocumentationOptions);
    const documentation = toDocumentationBrowser(result);
    setDocumentation(documentation);
  } catch (error) {
    setError(error.message);
  } finally {
    setIsLoading(false);
  }
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
