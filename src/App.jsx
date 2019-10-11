import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import './App.css';

import AppProxy from './components/App';
import Home from './pages/Home';
import Login from './pages/Login';
import Logout from './pages/Logout';

function App() {
  return (
    <div className="App">
      <AppProxy>
        <Router>
          <Route path="/" exact component={Home} />
          <Route path="/login" exact component={Login} />
          <Route path="/logout" exact component={Logout} />
        </Router>
      </AppProxy>
    </div>
  );
};

export default App;
