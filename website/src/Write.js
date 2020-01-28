import React, { Component } from 'react';
import './App.css';
import "bootstrap/dist/css/bootstrap.min.css";

import axios from 'axios';

import Tag from './Tag.js';

const colors = ['#CCEEEB', '#FEEFD8', '#FFDCDC', '#D5D6E9', '#ECCCDF'];

export default class Write extends Component {
	constructor(props){
		super(props);

		this.state={
			message: '',
			title: '',
			tags: [],
			cur_tag_input: '',
			cur_color_index: 0
		};

		this.onSubmit = this.onSubmit.bind(this);
		this.onMessageChange = this.onMessageChange.bind(this);
		this.onTitleChange = this.onTitleChange.bind(this);
		this.onTagAdd = this.onTagAdd.bind(this);
		this.onTagInputChange = this.onTagInputChange.bind(this);
	}

	onSubmit(e){
		e.preventDefault();
		let curTime = new Date();
		const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'June', 'July', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'];

		const newPost = {
			message: this.state.message,
			title: this.state.title,
			time: curTime,
			include: true,
			tags: this.state.tags
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

	onTagInputChange(e){
		this.setState({
			cur_tag_input: e.target.value
		});
	}

	onTagAdd(e){
		e.preventDefault();
		let tagArray = this.state.tags;
		tagArray.push(
			{
				tag_id: this.state.cur_tag_input,
				tag_color: colors[this.state.cur_color_index]
			}
		);
		this.setState({ 
			tags: tagArray 
		});
		this.setState({cur_tag_input: ''});
		this.setState({cur_color_index: this.state.cur_color_index + 1});
	}

    render() {
        return (
            <div className = 'content-container'>
                <div >
                <h4>New Project</h4>
                <form onSubmit={this.onSubmit} style = {{"margin-bottom": "200px"}}>
                	<label style = {{'margin-top':'20px'}}> Title </label>
                	<input type = "text" name = 'title' value = {this.state.title} onChange = {this.onTitleChange} className = "form-control" />
                	<label style = {{'margin-top':'20px'}}> Description </label>
                	<textarea name = 'message' value = {this.state.message} onChange = {this.onMessageChange} className = 'form-control' />
                	<div style = {{'display':'flex', 'margin-bottom':'20px', 'margin-top':'20px'}}>
                		<input value = {this.state.cur_tag_input} placeholder = 'Add Tags' type = "text" onChange = {this.onTagInputChange} name = 'tag_input' className = 'form-control'/>
                		<button className = 'btn btn-secondary' type = 'button' onClick = {this.onTagAdd}> + </button>

                	</div>
                	<div style = {{'margin-bottom':'30px'}}>
	                	{this.state.tags.map(item => {
	                	 		return <Tag key={item.tag_id} tag_id = {item.tag_id} tag_color = {item.tag_color} />;
	                	})}
                	</div>

                	<button className = 'btn btn-primary' type = 'submit'>Post</button>
                </form>
                </div>
            </div>
        )
    }
}