import React, { Component }from 'react';
import { BrowserRouter as Router, Route, NavLink } from "react-router-dom";

import Feed from './Feed.js'
import Write from './Write.js'

import logo from './static/img/logo.png'

import './App.css';
import "bootstrap/dist/css/bootstrap.min.css";

class App extends Component{
  constructor(props){
    super(props);
  }

  render(){

    return(
      <Router>
        <div className="main-container">
          <nav className='main-nav'>
            <h2><img src = {logo} style = {{'width': '100%'}} alt = "atlas connect logo"/></h2>
            <NavLink to="/" activeClassName='active' className="nav-link" exact>Feed</NavLink>
            <NavLink to="/create" activeClassName='active' className="nav-link">+</NavLink>
          </nav>

          <Route path="/" exact component={Feed} />
          <Route path="/create" component={Write} />

        </div>
      </Router>
      );
  }
}

export default App;
