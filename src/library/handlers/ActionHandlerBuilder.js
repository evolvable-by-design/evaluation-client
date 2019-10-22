import { Strategies } from '../services/GenericOperationHandler'
import BackgroundActionHandler from './BackgroundActionHandler'
import InComponentActionHandler from './InComponentActionHandler'

export default {
  build: (strategy, options, setToRender, componentBuilder, resolve, reject) => {
    let actionHandler = resolveActionHandler(strategy, setToRender, options, resolve, reject)
    actionHandler = actionHandler.provideComponent(
      () => componentBuilder(actionHandler, resolve, reject)
    )

    return actionHandler
  }
}

function resolveActionHandler(strategy, setToRender, options, resolve, reject) {
  switch (strategy) {
    case Strategies.IN_BACKGROUND:
      return new BackgroundActionHandler(false, resolve, reject)
    case Strategies.IN_BACKGROUND_WITH_NOTIFICATIONS:
      return new BackgroundActionHandler(true, resolve, reject)
    case Strategies.IN_MODAL:
      return null;
    case Strategies.IN_MODAL_WITH_BUTTON:
      return null;
    case Strategies.IN_PORTAL:
      return null;
    case Strategies.IN_COMPONENT:
      return new InComponentActionHandler(resolve, reject, setToRender);
    default:
      return null;
  }
}