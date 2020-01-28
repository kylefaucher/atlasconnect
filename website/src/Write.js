import React, { Component } from 'react';
import './App.css';
import "bootstrap/dist/css/bootstrap.min.css";

import axios from 'axios';

// months[parseInt(curTime.getMonth())] + ' ' + curTime.getDate()

export default class Write extends Component {
	constructor(props){
		super(props);

		this.state={
			message: '',
			title: '',
			tags: []
		};

		this.onSubmit = this.onSubmit.bind(this);
		this.onMessageChange = this.onMessageChange.bind(this);
		this.onTitleChange = this.onTitleChange.bind(this);
	}

	onSubmit(e){
		e.preventDefault();
		let curTime = new Date();
		const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'June', 'July', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'];

		const newPost = {
			message: this.state.message,
			title: this.state.title,
			time: curTime,
			include: true
		};

		axios.post('http://localhost:4000/capstoneprototype/add', newPost)
            .then(res => console.log(res.data));

	}

	onMessageChange(e){
		this.setState({
			message: e.target.value
		});
	}

	onTitleChange(e){
		this.setState({
			title: e.target.value
		});
	}

    render() {
        return (
            <div className = 'content-container'>
                <div className = 'jumbotron' >
                <h4>New Project</h4>
                <form onSubmit={this.onSubmit} style = {{"margin-bottom": "200px"}}>
                	<label> Title </label>
                	<input type = "text" name = 'title' value = {this.state.title} onChange = {this.onTitleChange} className = "form-control" />
                	<label> Description </label>
                	<textarea name = 'message' value = {this.state.message} onChange = {this.onMessageChange} className = 'form-control' />
                	<button className = 'btn btn-primary' type = 'submit'>Post</button>
                </form>
                </div>
            </div>
        )
    }
}