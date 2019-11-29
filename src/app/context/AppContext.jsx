import React from 'react'

import AuthenticationService from "../../library/services/AuthenticationService"
import HttpCaller from '../../library/services/HttpCaller'
import { GenericOperationBuilder } from '../../library/services/GenericOperation'

const AppStateContext = React.createContext()
const AppDispatchContext = React.createContext()

function appContextReducer(state, action) {
  switch (action.type) {
    case 'updateDocumentation': {
      const documentation = action.documentation
      const httpCaller = new HttpCaller(documentation.getServerUrl(), state.history, documentation)
      return {
        ...state,
        apiDocumentation: documentation,
        authenticationService: new AuthenticationService(documentation),
        httpCaller,
        genericOperationBuilder: new GenericOperationBuilder(documentation, httpCaller)
      }
    }
    case 'updateUserProfile': {
      return {
        ...state,
        userProfile: action.userProfile
      }
    }
    case 'setHistory': {
      return {
        ...state,
        history: action.history
      }
    }
    default: {
      throw new Error(`Unhandled action type: ${action.type}`)
    }
  }
}

function AppContextProvider({children}) {
  const [state, dispatch] = React.useReducer(appContextReducer, {})
  return (
    <AppStateContext.Provider value={state}>
      <AppDispatchContext.Provider value={dispatch}>
        {children}
      </AppDispatchContext.Provider>
    </AppStateContext.Provider>
  )
}

function useAppContextState() {
  const context = React.useContext(AppStateContext)
  if (context === undefined) {
    throw new Error('useAppContextState must be used within a AppContextProvider')
  }
  return context
}

function useAppContextDispatch() {
  const context = React.useContext(AppDispatchContext)
  if (context === undefined) {
    throw new Error('useAppContextDispatch must be used within a AppContextProvider')
  }
  return context
}

export {AppContextProvider, useAppContextState, useAppContextDispatch}
