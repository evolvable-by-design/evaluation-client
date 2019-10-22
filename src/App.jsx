import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import './App.css';

import AppProxy from './app/components/App';
import Home from './app/pages/Home';
import Login from './app/pages/Login';
import LoginBetter from './app/pages/LoginBetter';
import Logout from './app/pages/Logout';
import { AppContextProvider } from './app/context/AppContext';

function App() {
  return (
    <div className="App">
      <AppContextProvider>
        <Router>
          <AppProxy>
            <Route path="/" exact component={Home} />
            <Route path="/home" exact component={Home} />
            <Route path="/login" exact component={LoginBetter} />
            <Route path="/logout" exact component={Logout} />
          </AppProxy>
        </Router>
      </AppContextProvider>
    </div>
  );
};

export default App;
