import ActionHandler from './ActionHandler'

class InComponentActionHandler extends ActionHandler {

  constructor(resolve, reject, setToRender) {
    super(resolve, reject)
    this.setToRender = setToRender
  }

  init() {
    this.setToRender(this.component)
  }

  error(error) {
    // is this used at anytime?
    console.error(error)
    this.reject(error)
    this.close()
  }

  success(data) {
    this.resolve(data)
   }

  close() {
    this.setToRender(null)
  }

}

export default InComponentActionHandler
