import { useEffect } from 'react';
import GenericOperationHandler from '../../library/services/GenericOperationHandler';

const useGenericOperationHandler = (apiDocumentation, setToRender, fct) =>
  useEffect(() => {
    fct(GenericOperationHandler(apiDocumentation, setToRender))
  }, [])

export default useGenericOperationHandler