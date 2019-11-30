import React from 'react'
import { Route } from 'react-router-dom'

import Home from './app/pages/Home'
import Login from './app/pages/Login'
import Logout from './app/pages/Logout'
import Project from './app/pages/Project' 
 
const AppRouter = () =>
  <>
    <Route path="/" exact component={Home} />
    <Route path="/home" exact component={Home} />
    <Route path="/project/:id" strict component={Project}/>
    <Route path="/login" exact component={Login} />
    <Route path="/logout" exact component={Logout} />
  </>

export default AppRouter