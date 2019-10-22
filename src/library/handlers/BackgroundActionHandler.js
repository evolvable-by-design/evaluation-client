import ReactDOM from 'react-dom'
import { toaster } from 'evergreen-ui';

import { ActionHandler, States } from './ActionHandler'

class BackgroundActionHandler extends ActionHandler {

  constructor(withNotifications, resolve, reject) {
    super(resolve, reject)
    this.withNotifications = withNotifications
    this.portal = document.getElementById('portal')
  }

  provideComponent(component) {
    this.componentBuilder = component
    return this
  }

  buildComponentAndStart() {
    this.component = this.componentBuilder()
  }

  init() {
    if (this.componentBuilder !== undefined) {
      if (this.portal && !this.portalEl) {
        const el = document.createElement('div')
        this.portal.appendChild(el)
        this.portalEl = el
      } else {
        console.warn('Background operation could not be achieved successfully, we tried to show the passed component in a portal but we could\'n find a <div id="portal"></div> in your app. Please add one in your index.html.')
      }

      this.buildComponentAndStart()
    }
  }

  inputComponent() {
    if (this.portalEl) {
      ReactDOM.createPortal(this.component, this.portalEl)
    } else {
      // Should find a strategy to obtain user input
    }
  }

  loading() {
    if (this.withNotifications === true) {
      const loadingMessage = this.options['loadingMessage'] || `Http operation ${this.options['actionKey']} is loading...`
      toaster.notify(loadingMessage)
    }
  }
  error(error) {
    if (this.withNotifications === true) {
      const errorMessage = this.options['errorMessage'] || `Sadly, an error occured while executing the Http operation ${this.options['actionKey']}.`
      toaster.success(errorMessage, { description: error });
    }
  }

  success(data) {
    if (this.withNotifications === true) {
      const successMessage = this.options['successMessage'] || `Http operation ${this.options['actionKey']} successfully executed :)`
      toaster.success(successMessage)
    }
    this.setState(States.CLOSE)
   }

  close() {
    if (this.portal && this.portalEl && this.portalEl.parentNode === this.portal) {
      this.portal.removeChild(this.portalEl)
    }
  }

}

export default BackgroundActionHandler