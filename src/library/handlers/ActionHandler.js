export class ActionHandler {

  constructor(resolve, reject, setToRender, options) {
    this.resolve = resolve
    this.reject = reject
    this.setToRender = setToRender
    this.options = options
  }

  provideComponent(component) {
    this.component = component
    return this
  }

  start() {
    this.setState(States.INIT)
  }

  init() { 
    this.resolve()
  }
  inputComponent() { this.success() }
  loading() {}
  error() { this.reject() }
  success() { this.resolve() }
  close() {}

  complete(data) {
    this.setState(States.SUCCESS, data)
    this.setState(States.CLOSE, data)
  }

  setState(state, arg2) {
    switch (state) {
      case States.INIT:
        this.init(arg2)
        break
      case States.AWAIT_INPUT:
        this.inputComponent(arg2)
        break
      case States.LOADING:
        this.loading(arg2)
        break
      case States.ERROR:
        this.error(arg2)
        break
      case States.SUCCESS:
        this.success(arg2)
        break
      case States.CLOSE:
        this.resolve(arg2)
        this.close(arg2)
        break
      default:
        break
    }
  }

}

export const States = {
  INIT: 'initialize',
  CLOSE: 'close',
  LOADING: 'loading',
  ERROR: 'error',
  SUCCESS: 'success',
  AWAIT_INPUT: 'awaitUserInput'
}

export default ActionHandler
