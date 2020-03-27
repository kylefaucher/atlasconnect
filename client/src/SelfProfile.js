import React, { Component } from 'react';
import './App.css';
import "bootstrap/dist/css/bootstrap.min.css";
import { Redirect } from 'react-router-dom';

import Post from './Post.js';

import axios from 'axios';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserCircle } from '@fortawesome/free-regular-svg-icons';
import { faPen } from '@fortawesome/free-solid-svg-icons';

export default class SelfProfile extends Component {
	constructor(props){
		super(props);
		this.state = {
            messages: [],
            currentOpenProject: '',
            edit: false
        };
	}

    componentDidMount() {
        this.props.updateCurrentTab('profile');
        let requestString = '/api/userposts/' + this.props.currentUser.uid;
        axios.get(requestString)
            .then(response => {
                this.setState({ messages: response.data });
                console.log(response.data);
            })
            .catch(function (error){
                console.log(error);
            })
    }

    render() {
        return (
            <div>
            {this.props.isLoggedIn ? 
            <div className = 'content-container profile-container'>
                <div>
                    <FontAwesomeIcon icon={faPen} />
                    <FontAwesomeIcon style = {{fontSize:'10em', marginBottom:'50px'}} icon={faUserCircle} />
                    <h1 className = "profile-user-display-name"> {this.props.currentUser.displayName} </h1>
                    <p> {this.props.currentUser.email} </p>
                    <p> Bio </p>
                    <p> Interests </p>
                </div>
                <div>
                <h2> featured project </h2>
                <p> You have not chosen a featured project </p>
                <h2> all projects </h2>
                <div className = 'profile-posts-container'>
                    {this.state.messages.map(item => {
                        return <Post key={item._id} postJSON = {item} />;
                     })}
                </div>
                </div>
            </div> : 
               <Redirect
                    to={{
                      pathname: "/"
                    }}
                />
            }
            </div>
        )
    }
}