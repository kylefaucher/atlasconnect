import React, { Component } from 'react';
import './App.css';
import "bootstrap/dist/css/bootstrap.min.css";

import Post from './Post.js'
import ProjectDetails from './ProjectDetails.js';

import { Link } from 'react-router-dom';
import axios from 'axios';

export default class Feed extends Component {
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
        axios.get('http://localhost:4000/capstoneprototype/')
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
            <div className = 'content-container'>
                <div className = 'postsGrid'>
                	 {this.state.messages.map(item => {if(item.message && item.include == true && item.title){
                	 	return <Post handleClick={() => this.openModal(item)} closeModal = {this.closeModal} key={item._id} postJSON = {item} />;
                	 }})}
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