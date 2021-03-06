import React, { useEffect } from 'react'
import { BrowserRouter as Router, withRouter } from 'react-router-dom'
import './App.css'

import AppRouter from './AppRouter'
import semanticComponents from './app/components/semanticComponents'
import { AppContextProvider, useAppContextDispatch, useAppContextState } from './app/context/AppContext'
import FullscreenLoader from './app/components/basis/FullscreenLoader'
import FullscreenError from './app/components/basis/FullscreenError'
import LoginRedirect from './app/components/basis/LoginRedirect'
import { AuthenticationRequiredError } from './app/utils/Errors'
import Semantics from './app/utils/semantics'

import AuthenticationService from './library/services/AuthenticationService'
import DocumentationBrowser from './library/services/DocumentationBrowser'
import { GenericOperationBuilder } from './library/services/GenericOperation'
import HttpCaller from './library/services/HttpCaller'
import { LibraryContextProvider } from './library/react/LibraryContext'

import Config from './config';

function App() {
  return (
    <div className="App">
      <LibraryContextProvider components={semanticComponents}>
        <Router>
          <AppProxyWithRouter />
        </Router>
      </LibraryContextProvider>
    </div>
  );
}; 

class AppProxy extends React.Component {

  constructor(props) {
    super(props)
    this.state = { hasError: false, requiresAuth: false, isLoading: false, apiDocumentation: undefined }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, errorMessage: error.message, errorStack: error.stack, requiresAuth: error instanceof AuthenticationRequiredError }
  }

  componentDidCatch(error, errorInfo) {
    console.error(error, errorInfo)
  }

  componentDidMount() {
    this.fetchDocumentation()
  }

  fetchDocumentation() {
    this.setIsLoading(true)

    new HttpCaller(Config.serverUrl)
      .call({ method: 'options' })
      .then(result => new DocumentationBrowser(result.data))
      .then(this.setDocumentation.bind(this))
      .catch(this.setError.bind(this))
      .finally(() => this.setIsLoading(false))
  }

  setIsLoading(value) {
    this.setState(state => { return { ...state, isLoading: value }})
  }

  setError(error) {
    this.setState(state => { return { ...state, ...AppProxy.getDerivedStateFromError(error) }})
  }

  setDocumentation(documentation) {
    this.setState(state => { return { ...state, apiDocumentation: documentation }})
  }

  getDefaultAppContext() {
    const documentation = this.state.apiDocumentation
    if (documentation === undefined) return {}

    const httpCaller = new HttpCaller(documentation.getServerUrl(), this.props.history, documentation)
    return {
      ...this.state,
      apiDocumentation: documentation,
      authenticationService: new AuthenticationService(documentation),
      httpCaller,
      genericOperationBuilder: new GenericOperationBuilder(documentation, httpCaller),
      history: this.props.history
    }
  }

  render() {
    if (this.state.requiresAuth) {
      this.setState({...this.state, hasError: false, requiresAuth: false, errorMessage: undefined, errorStack: undefined})
      return <LoginRedirect/>
    } else if (this.state.hasError) {
      return <FullscreenError error={this.state.errorMessage} />
    } else if (this.state.isLoading) {
      return <FullscreenLoader />
    } else if (this.state.apiDocumentation) {
      return <AppContextProvider defaultState={this.getDefaultAppContext()}>
        <AppRouter>{this.props.children}</AppRouter>
      </AppContextProvider>
    }
    
    return <FullscreenError error='Something unexpected happened. Please try again later.'/>
  }

}

const AppProxyWithRouter = withRouter(AppProxy)

export default App;
