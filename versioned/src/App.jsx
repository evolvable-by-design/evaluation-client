import React from 'react'
import { BrowserRouter as Router, withRouter } from 'react-router-dom'
import './App.css'

import AppRouter from './AppRouter'
import { AppContextProvider } from './app/context/AppContext'
import FullscreenError from './app/components/basis/FullscreenError'
import LoginRedirect from './app/components/basis/LoginRedirect'
import { AuthenticationRequiredError } from './app/utils/Errors'
import AuthenticationService from './app/services/AuthenticationService'

function App() {
  return (
    <div className="App">
        <Router>
          <AppProxyWithRouter />
        </Router>
    </div>
  );
}; 

class AppProxy extends React.Component {

  constructor(props) {
    super(props)
    this.state = { hasError: false, requiresAuth: false }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, errorMessage: error.message, errorStack: error.stack, requiresAuth: error instanceof AuthenticationRequiredError }
  }

  componentDidCatch(error, errorInfo) {
    console.error(error, errorInfo)
  }

  setError(error) {
    this.setState(state => { return { ...state, ...AppProxy.getDerivedStateFromError(error) }})
  }

  getDefaultAppContext() {
    return {
      ...this.state,
      authenticationService: new AuthenticationService()
    }
  }

  render() {
    if (this.state.hasError) {
      return <FullscreenError error={this.state.errorMessage} />
    } else if (this.state.requiresAuth) {
      return <LoginRedirect />
    } else {
      return <AppContextProvider defaultState={this.getDefaultAppContext()}>
        <AppRouter>{this.props.children}</AppRouter>
      </AppContextProvider>
    }
  }

}

const AppProxyWithRouter = withRouter(AppProxy)

export default App;
