import useFetch from './useFetch';
import DocumentationBrowser from '../services/DocumentationBrowser';

import Config from '../config';

const fetchDocumentationOptions = { method: 'options', url: Config.serverUrl };

function useApiDocumentation() {
  return useFetch(fetchDocumentationOptions, toDocumentationBrowser);
};

const toDocumentationBrowser = result => new DocumentationBrowser(
  JSON.parse(
    JSON.stringify(result.data)
      .replace(new RegExp('x-@id', 'g'), '@id')
      .replace(new RegExp('x-@type', 'g'), '@type')
      .replace(new RegExp('x-@context', 'g'), '@context')
  )
)

export default useApiDocumentation;
