import React, { Component } from 'react';
import './App.css';
import "bootstrap/dist/css/bootstrap.min.css";

import Post from './Post.js'

import { Link } from 'react-router-dom';
import axios from 'axios';

export default class Feed extends Component {
	constructor(props){
		super(props);
		this.state = {messages: []};
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

    render() {
        return (
            <div className = 'content-container'>
                <div className = 'postsGrid'>
                	 {this.state.messages.map(item => {if(item.message && item.include == true && item.title){
                	 	return <Post key={item._id} postJSON = {item} />;
                	 }})}
                </div>
            </div>
        )
    }
}