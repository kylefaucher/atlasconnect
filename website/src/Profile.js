import React, { Component } from 'react';
import './App.css';
import "bootstrap/dist/css/bootstrap.min.css";
import { Redirect } from 'react-router-dom';

import Post from './Post.js';
import ProjectDetails from './ProjectDetails.js';

import axios from 'axios';

import { Link } from 'react-router-dom';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserCircle } from '@fortawesome/free-regular-svg-icons';
import { faChevronLeft } from '@fortawesome/free-solid-svg-icons';


export default class Profile extends Component {
	constructor(props){
		super(props);
		this.state = {
            messages: [],
            userJSON:''
        };
	}

    componentDidMount() {
        console.log('componentDidMount');
        console.log(this.props);
        axios.get('http://localhost:4000/capstoneprototype/user/' + this.props.match.params.userId)
            .then(response => {
                this.setState({ userJSON: response.data[0]});
                console.log(response.data[0]);
            })
            .catch(function (error){
                console.log(error);
        });
        let requestString = 'http://localhost:4000/capstoneprototype/userposts/' + this.props.match.params.userId;
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
            <div className = 'content-container profile-container'>
                <div>
                    <Link to = {{pathname: this.props.location.state.prevPath, state: { prevPath: window.location.pathname }}}>
                        <div className = 'back-link'>
                        <FontAwesomeIcon style = {{fontSize:'1em', 'marginRight':'10px'}} icon={faChevronLeft} /> Back </div>
                    </Link>

                    <FontAwesomeIcon style = {{fontSize:'10em', marginBottom:'50px'}} icon={faUserCircle} />
                    <h1 className = "profile-user-display-name"> {this.state.userJSON.display_name} </h1>
                    <p> {this.state.userJSON.email} </p>
                    <p> Bio </p>
                    <p> Interests </p>
                </div>
                <div>
                <h2> featured project </h2>
                <p> You have not chosen a featured project </p>
                <h2> all projects </h2>
                <div className = 'profile-posts-container'>
                    {this.state.messages.map(item => {if(item.message && item.title){
                        return <Post handleClick={() => this.openModal(item)} closeModal = {this.closeModal} key={item._id} postJSON = {item} />;
                     }})}
                </div>
                </div>
            </div> 
            </div>
        )
    }
}