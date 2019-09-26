import useFetch from './useFetch';
import DocumentationBrowser from '../services/DocumentationBrowser';

import Config from '../config';

const fetchDocumentationOptions = { method: 'options', url: Config.serverUrl };

function useApiDocumentation() {
  return useFetch(fetchDocumentationOptions, toDocumentationBrowser);
};

const toDocumentationBrowser = data => new DocumentationBrowser(data)

export default useApiDocumentation;
