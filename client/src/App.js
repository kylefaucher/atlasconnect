import React, { Component }from 'react';
import { BrowserRouter as Router, Route, NavLink } from "react-router-dom";
import { Link } from 'react-router-dom';

import Feed from './Feed.js';
import Write from './Write.js';
import SelfProfile from './SelfProfile.js';
import Profile from './Profile.js';
import Project from './Project.js';

import logo from './static/img/logo-grey.png';

import * as firebase from 'firebase';
import firebaseConfig from './firebase.config';

import axios from 'axios';

import './App.css';
import "bootstrap/dist/css/bootstrap.min.css";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserCircle } from '@fortawesome/free-regular-svg-icons';
import { faHome } from '@fortawesome/free-solid-svg-icons';

firebase.initializeApp(firebaseConfig);

export const AuthContext = React.createContext(null);

class App extends Component{
  constructor(props){
    super(props);

    this.state={
      isLoggedIn:false,
      currentUser: '',
      lastSignIn: '',
      profile_img:''
    };

    this.handleGoogleSignIn = this.handleGoogleSignIn.bind(this);
    this.handleGoogleSignOut = this.handleGoogleSignOut.bind(this);
    this.updateCurrentTab = this.updateCurrentTab.bind(this);
  }

  componentDidMount(){
      let thisObject = this;
      firebase.auth().onAuthStateChanged(function(user) {
      if (user) {
        console.log('user is new?');
        console.log(user);
        thisObject.setState({isLoggedIn:true});
        thisObject.setState({currentUser:firebase.auth().currentUser});
        thisObject.setState({lastSignIn: user.metadata.lastSignInTime});

        let userJSON = {
          user_id: user.uid,
          user_display_name: user.displayName,
          user_email: user.email
        };

        axios.post('/api/user', userJSON)
            .then(res => console.log(res.data));

        //get user's profile picture
                let profileImgRequest = '/api/profileimg/' + user.uid;
                axios.get(profileImgRequest)
                .then(response => {
                    if (response.data[0]){
                        let item = response.data[0];
                        let arrayBufferView = new Uint8Array( item.img.data.data );
                        let blob = new Blob( [ arrayBufferView ], { type: "image/jpeg" } );
                        let urlCreator = window.URL || window.webkitURL;
                        let imageUrl = urlCreator.createObjectURL( blob );
                        thisObject.setState({profile_img:imageUrl});
                    }
                })
                .catch(function (error){
                    console.log('there was error');
                    console.log(error);
                })

      } else {
        thisObject.setState({isLoggedIn:false});
        thisObject.setState({currentUser:{}});
        
      }
      });
  }

  updateCurrentTab(tab){
    this.setState({currentTab:tab});
  }

  handleGoogleSignIn(){
    let thisObject = this;
    // Using a popup.
    var provider = new firebase.auth.GoogleAuthProvider();
    provider.addScope('profile');
    provider.addScope('email');
    firebase.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL)
      .then( function(){

         firebase.auth().signInWithPopup(provider).then(function(result) {
           var token = result.credential.accessToken;
           var user = result.user;
           console.log(user);
           if (result.user){
              thisObject.setState({isLoggedIn:true});
              thisObject.setState({currentUser:user});
              thisObject.setState({lastSignIn: user.metadata.lastSignInTime});
           }
         });

      })
  }

  handleGoogleSignOut(){
    let thisObject = this;
    firebase.auth().signOut().then(function() {
        thisObject.setState({isLoggedIn:false});
        thisObject.setState({currentUser:{}});
        thisObject.setState({profile_img:''});
    }).catch(function(error) {
       console.log(error);
    });
  }

  render(){
    return(
      <AuthContext.Provider value = {this.state.isLoggedIn}>

        <Router>
              <div className = "topbar">
          {!this.state.isLoggedIn && 
          <button onClick = {this.handleGoogleSignIn}> <img src = "data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxvbmU9Im5vIj8+Cjwh%0D%0ALS0gQ29weXJpZ2h0IChjKSAyMDE2IEdvb2dsZSBJbmMuIEFsbCByaWdodHMgcmVzZXJ2ZWQuIC0t%0D%0APgo8c3ZnIHdpZHRoPSIxMThweCIgaGVpZ2h0PSIxMjBweCIgdmlld0JveD0iMCAwIDExOCAxMjAi%0D%0AIHZlcnNpb249IjEuMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4%0D%0AbGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayI+CiAgICA8IS0tIEdlbmVyYXRvcjog%0D%0AU2tldGNoIDMuNiAoMjYzMDQpIC0gaHR0cDovL3d3dy5ib2hlbWlhbmNvZGluZy5jb20vc2tldGNo%0D%0AIC0tPgogICAgPHRpdGxlPmdvb2dsZV9idXR0bjwvdGl0bGU+CiAgICA8ZGVzYz5DcmVhdGVkIHdp%0D%0AdGggU2tldGNoLjwvZGVzYz4KICAgIDxkZWZzPjwvZGVmcz4KICAgIDxnIGlkPSJQYWdlLTEiIHN0%0D%0Acm9rZT0ibm9uZSIgc3Ryb2tlLXdpZHRoPSIxIiBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5v%0D%0AZGQiPgogICAgICAgIDxnIGlkPSJBcnRib2FyZC0xIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgtMzMy%0D%0ALjAwMDAwMCwgLTYzOS4wMDAwMDApIj4KICAgICAgICAgICAgPGcgaWQ9Imdvb2dsZV9idXR0biIg%0D%0AdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMzMyLjAwMDAwMCwgNjM5LjAwMDAwMCkiPgogICAgICAgICAg%0D%0AICAgICAgPGcgaWQ9ImxvZ29fZ29vZ2xlZ180OGRwIj4KICAgICAgICAgICAgICAgICAgICA8cGF0%0D%0AaCBkPSJNMTE3LjYsNjEuMzYzNjM2NCBDMTE3LjYsNTcuMTA5MDkwOSAxMTcuMjE4MTgyLDUzLjAx%0D%0AODE4MTggMTE2LjUwOTA5MSw0OS4wOTA5MDkxIEw2MCw0OS4wOTA5MDkxIEw2MCw3Mi4zIEw5Mi4y%0D%0AOTA5MDkxLDcyLjMgQzkwLjksNzkuOCA4Ni42NzI3MjczLDg2LjE1NDU0NTUgODAuMzE4MTgxOCw5%0D%0AMC40MDkwOTA5IEw4MC4zMTgxODE4LDEwNS40NjM2MzYgTDk5LjcwOTA5MDksMTA1LjQ2MzYzNiBD%0D%0AMTExLjA1NDU0NSw5NS4wMTgxODE4IDExNy42LDc5LjYzNjM2MzYgMTE3LjYsNjEuMzYzNjM2NCBM%0D%0AMTE3LjYsNjEuMzYzNjM2NCBaIiBpZD0iU2hhcGUiIGZpbGw9IiM0Mjg1RjQiPjwvcGF0aD4KICAg%0D%0AICAgICAgICAgICAgICAgICA8cGF0aCBkPSJNNjAsMTIwIEM3Ni4yLDEyMCA4OS43ODE4MTgyLDEx%0D%0ANC42MjcyNzMgOTkuNzA5MDkwOSwxMDUuNDYzNjM2IEw4MC4zMTgxODE4LDkwLjQwOTA5MDkgQzc0%0D%0ALjk0NTQ1NDUsOTQuMDA5MDkwOSA2OC4wNzI3MjczLDk2LjEzNjM2MzYgNjAsOTYuMTM2MzYzNiBD%0D%0ANDQuMzcyNzI3Myw5Ni4xMzYzNjM2IDMxLjE0NTQ1NDUsODUuNTgxODE4MiAyNi40MjcyNzI3LDcx%0D%0ALjQgTDYuMzgxODE4MTgsNzEuNCBMNi4zODE4MTgxOCw4Ni45NDU0NTQ1IEMxNi4yNTQ1NDU1LDEw%0D%0ANi41NTQ1NDUgMzYuNTQ1NDU0NSwxMjAgNjAsMTIwIEw2MCwxMjAgWiIgaWQ9IlNoYXBlIiBmaWxs%0D%0APSIjMzRBODUzIj48L3BhdGg+CiAgICAgICAgICAgICAgICAgICAgPHBhdGggZD0iTTI2LjQyNzI3%0D%0AMjcsNzEuNCBDMjUuMjI3MjcyNyw2Ny44IDI0LjU0NTQ1NDUsNjMuOTU0NTQ1NSAyNC41NDU0NTQ1%0D%0ALDYwIEMyNC41NDU0NTQ1LDU2LjA0NTQ1NDUgMjUuMjI3MjcyNyw1Mi4yIDI2LjQyNzI3MjcsNDgu%0D%0ANiBMMjYuNDI3MjcyNywzMy4wNTQ1NDU1IEw2LjM4MTgxODE4LDMzLjA1NDU0NTUgQzIuMzE4MTgx%0D%0AODIsNDEuMTU0NTQ1NSAwLDUwLjMxODE4MTggMCw2MCBDMCw2OS42ODE4MTgyIDIuMzE4MTgxODIs%0D%0ANzguODQ1NDU0NSA2LjM4MTgxODE4LDg2Ljk0NTQ1NDUgTDI2LjQyNzI3MjcsNzEuNCBMMjYuNDI3%0D%0AMjcyNyw3MS40IFoiIGlkPSJTaGFwZSIgZmlsbD0iI0ZCQkMwNSI+PC9wYXRoPgogICAgICAgICAg%0D%0AICAgICAgICAgIDxwYXRoIGQ9Ik02MCwyMy44NjM2MzY0IEM2OC44MDkwOTA5LDIzLjg2MzYzNjQg%0D%0ANzYuNzE4MTgxOCwyNi44OTA5MDkxIDgyLjkzNjM2MzYsMzIuODM2MzYzNiBMMTAwLjE0NTQ1NSwx%0D%0ANS42MjcyNzI3IEM4OS43NTQ1NDU1LDUuOTQ1NDU0NTUgNzYuMTcyNzI3MywwIDYwLDAgQzM2LjU0%0D%0ANTQ1NDUsMCAxNi4yNTQ1NDU1LDEzLjQ0NTQ1NDUgNi4zODE4MTgxOCwzMy4wNTQ1NDU1IEwyNi40%0D%0AMjcyNzI3LDQ4LjYgQzMxLjE0NTQ1NDUsMzQuNDE4MTgxOCA0NC4zNzI3MjczLDIzLjg2MzYzNjQg%0D%0ANjAsMjMuODYzNjM2NCBMNjAsMjMuODYzNjM2NCBaIiBpZD0iU2hhcGUiIGZpbGw9IiNFQTQzMzUi%0D%0APjwvcGF0aD4KICAgICAgICAgICAgICAgICAgICA8cGF0aCBkPSJNMCwwIEwxMjAsMCBMMTIwLDEy%0D%0AMCBMMCwxMjAgTDAsMCBaIiBpZD0iU2hhcGUiPjwvcGF0aD4KICAgICAgICAgICAgICAgIDwvZz4K%0D%0AICAgICAgICAgICAgPC9nPgogICAgICAgIDwvZz4KICAgIDwvZz4KPC9zdmc+Cg=="/>
           Login or Join with Google
           </button>
          }

          {this.state.isLoggedIn &&
            <div>
  
             <Link to = '/'> <button onClick = {this.handleGoogleSignOut} >
             Logout
             </button> </Link>
           </div>
          }
       </div>
          <div className="main-container">
            <nav className='main-nav'>
              <NavLink to="/" activeClassName='active' className="nav-link" exact><div className = "nav-spacer"><div className="nav-spacer2"></div> </div><div className = "center-link"><img src = {logo} style = {{'width': '9em', 'position':'relative','bottom':'-11px'}} alt = "atlas connect logo"/></div><div className = "nav-spacer"> <div className="nav-spacer2"></div> </div></NavLink> 
              {this.state.isLoggedIn &&
                 <NavLink to="/create" activeClassName='active' className="nav-link"><div className = "nav-spacer"><div className="nav-spacer2"></div> </div><div className = "center-link add" style = {{fontSize:'2em', paddingTop:'5px'}}>+</div><div className = "nav-spacer"><div className="nav-spacer2"></div> </div></NavLink> 
              }
             

              {this.state.isLoggedIn &&
                <NavLink to="/profile" activeClassName='active' className="nav-link"><div className = "nav-spacer"><div className="nav-spacer2"></div> </div><div className = "center-link">

                {this.state.profile_img ? 
                        <div className = "profile-image-nav" style = {{backgroundImage: 'url(' + this.state.profile_img + ')'}} ></div>
                        :
                        <FontAwesomeIcon style = {{fontSize:'1.5em', marginRight:'10px'}} icon={faUserCircle} />
                }

                </div><div className = "nav-spacer"><div className="nav-spacer2"></div> </div>
                </NavLink>
              }
              

             </nav>

            <Route path="/" exact render={(props)=> <Feed updateCurrentTab = {this.updateCurrentTab} />} />
            <Route path="/create" render={(props)=> <Write updateCurrentTab = {this.updateCurrentTab} currentUser = {this.state.currentUser} isLoggedIn = {this.state.isLoggedIn} />} />
            <Route path="/profile" 
                   render={(props)=> <SelfProfile updateCurrentTab = {this.updateCurrentTab} isLoggedIn = {this.state.isLoggedIn} currentUser = {this.state.currentUser} />}
            />
            <Route path="/project/:projectId" component={Project} />
            <Route path="/user/:userId" component={Profile} />

          </div>
        </Router>
      </AuthContext.Provider>
      );
  }
}

export default App;
