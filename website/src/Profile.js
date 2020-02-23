import React, { Component } from 'react';
import './App.css';
import "bootstrap/dist/css/bootstrap.min.css";

import Post from './Post.js';
import ProjectDetails from './ProjectDetails.js';

import axios from 'axios';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserCircle } from '@fortawesome/free-regular-svg-icons';

export default class Profile extends Component {
	constructor(props){
		super(props);
		this.state = {
            messages: [],
            modalIsOpen: false,
            currentOpenProject: ''
        };

        this.openModal = this.openModal.bind(this);
        this.closeModal = this.closeModal.bind(this);
	}

    componentDidMount() {
        let requestString = 'http://localhost:4000/capstoneprototype/userposts/' + this.props.currentUser.uid;
        axios.get(requestString)
            .then(response => {
                this.setState({ messages: response.data });
                console.log(response.data);
            })
            .catch(function (error){
                console.log(error);
            })
    }

    openModal(postJSON){
        this.setState({currentOpenProject:postJSON});
        this.setState({modalIsOpen:true});
    }

    closeModal(){
        this.setState({modalIsOpen:false});
    }

    render() {
        return (
            <div className = 'content-container profile-container'>
                <div>
                <FontAwesomeIcon style = {{fontSize:'10em', marginBottom:'50px'}} icon={faUserCircle} />
                <h1> {this.props.currentUser.displayName} </h1>
                <p> {this.props.currentUser.email} </p>
                </div>
                <div>
                <h2> all projects </h2>
                <div className = 'profile-posts-container'>
                    {this.state.messages.map(item => {if(item.message && item.include == true && item.title){
                        return <Post handleClick={() => this.openModal(item)} closeModal = {this.closeModal} key={item._id} postJSON = {item} />;
                     }})}
                </div>
                </div>
                <ProjectDetails 
                    open = {this.state.modalIsOpen}
                    closeModal = {this.closeModal}
                    postJSON = {this.state.currentOpenProject}
                />
            </div>
        )
    }
}