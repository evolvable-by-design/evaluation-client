const tokenLocalStorageKey = 'Authorization'

class AuthenticationService {

  constructor(apiDocumentation) {
    this.apiDocumentation = apiDocumentation;
  }

  static isAuthenticated = () => this.getToken() !== undefined

  logout() {
    this.updateToken(undefined)
    // call the API function when available
  }

  static getToken() {
    window.localStorage.getItem(tokenLocalStorageKey)
  }

  static updateToken(token) {
    window.localStorage.setItem(tokenLocalStorageKey, token)
  }

}

export default AuthenticationService;
/* 
  TODO: create one kind of auth service per kind of auth mecanism, 
  enable to extend this list and instantiate the proper service
  based on one of the mechanism that the API supports, which can be
  discovered in the documentation of the API that we retrieve when 
  this app initialize
*/
