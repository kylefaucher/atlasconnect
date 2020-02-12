import React, { Component } from 'react';
import './App.css';
import "bootstrap/dist/css/bootstrap.min.css";

import Post from './Post.js';
import ProjectDetails from './ProjectDetails.js';

import { Link } from 'react-router-dom';
import axios from 'axios';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';

export default class Feed extends Component {
	constructor(props){
		super(props);
		this.state = {
            messages: [],
            modalIsOpen: false,
            currentOpenProject: '',
            searchValue: ''
        };

        this.openModal = this.openModal.bind(this);
        this.closeModal = this.closeModal.bind(this);
        this.search = this.search.bind(this);
        this.handleSearchChange = this.handleSearchChange.bind(this);
        this.displayDefaultFeed = this.displayDefaultFeed.bind(this);
	}

    displayDefaultFeed(){
        axios.get('http://localhost:4000/capstoneprototype/')
            .then(response => {
                this.setState({ messages: response.data });
                console.log(response.data);
            })
            .catch(function (error){
                console.log(error);
         });
    }

	componentDidMount() {
        this.displayDefaultFeed();
    }

    openModal(postJSON){
        this.setState({currentOpenProject:postJSON});
        this.setState({modalIsOpen:true});
    }

    closeModal(){
        this.setState({modalIsOpen:false});
    }

    handleSearchChange(e){
        this.setState({searchValue:e.target.value});
    }

    search(){
        if (this.state.searchValue.length){
        axios.get('http://localhost:4000/capstoneprototype/search/'+this.state.searchValue)
            .then(response => {
                this.setState({ messages: response.data });
                console.log(response.data);
            })
            .catch(function (error){
                console.log(error);
            });
        }
        else{
            this.displayDefaultFeed();
        }
    }

    render() {
        return (
            <div className = 'content-container'>
                <div className = "form-group search-bar">
                    <div className = "searchIcon"> <FontAwesomeIcon icon={faSearch} /> </div>
                    <input onChange = {this.handleSearchChange}  value = {this.state.searchValue} type = "text" placeholder = "search" className="form-control" />
                    <button onClick = {this.search} className = "btn btn-primary form-control" type = "search"> Search </button>
                </div>
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