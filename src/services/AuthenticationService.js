import React from 'react'
import { Redirect } from 'react-router-dom'

import GenericActionInBackground from '../components/generic/GenericActionInBackground'
import Semantics from '../utils/semantics'

const tokenLocalStorageKey = 'Authorization'

class AuthenticationService {

  constructor(apiDocumentation) {
    this.apiDocumentation = apiDocumentation;
  }

  static isAuthenticated = () => this.getToken() !== undefined && this.getToken() !== null

  static getToken() {
    return window.localStorage.getItem(tokenLocalStorageKey)
  }

  static updateToken(token) {
    window.localStorage.setItem(tokenLocalStorageKey, token)
  }

  static removeToken() {
    window.localStorage.removeItem(tokenLocalStorageKey)
  }

  static currentTokenWasRefusedByApi() {
    this.removeToken();
  }

  static fetchCurrentUserDetails(callback) {
    if (AuthenticationService.isAuthenticated()) {
      return <GenericActionInBackground
        loadingMessage='We are retrieving your profile...'
        successMessage='All set :)'
        errorMessage='An error occured while trying to get your profile'
        actionKey={Semantics.vnd_jeera.actions.getCurrentUserDetails}
        onSuccessCallback={callback}
      />
    } else {
      return <Redirect to="/login" />
    }
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
