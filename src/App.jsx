import React from 'react'
import { BrowserRouter as Router, Route, Redirect } from 'react-router-dom'
import './App.css'

import AppProxy from './app/components/App'
import Home from './app/pages/Home'
import Login from './app/pages/Login'
import Logout from './app/pages/Logout'
import Project from './app/pages/Project'
import { AppContextProvider } from './app/context/AppContext'

function App() {
  return (
    <div className="App">
      <AppContextProvider>
        <Router>
          <AppProxy>
            <Route path="/" exact component={Home} />
            <Route path="/home" exact component={Home} />
            <Route path="/project/:id" strict component={Project}/>
            <Route path="/login" exact component={Login} />
            <Route path="/logout" exact component={Logout} />
          </AppProxy>
        </Router>
      </AppContextProvider>
    </div>
  );
};

export default App;
