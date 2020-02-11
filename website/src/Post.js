import React, { Component } from 'react';
import './App.css';
import "bootstrap/dist/css/bootstrap.min.css";

import Tag from './Tag.js';

import { Link } from 'react-router-dom';

import imgPlaceholder from './static/img/img-placeholder.png';

const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'June', 'July', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'];

export default class Post extends Component {
	constructor(props){
		super(props);
        this.state = {
            time: new Date(this.props.postJSON.time)
        }
	}

    render() {
        return (
            <div className = "post" onClick = {this.props.handleClick}>
                <h5> {this.props.postJSON.title} </h5>
                <h6 className='post-user-name'> {this.props.postJSON.user_display_name} </h6>
                <img src = {imgPlaceholder} alt = "placeholder" style = {{"width":"100%", "display":"block"}}/>
                {this.props.postJSON.message}
                <span className = "postTime"> {months[this.state.time.getMonth()]} {this.state.time.getDate()} {this.state.time.getFullYear()} </span>
                {this.props.postJSON.tags.map(item => {
                    return <Tag key={item.tag_id} tag_id = {item.tag_id} tag_color = {item.tag_color} />;
                })}
            </div>
        )
    }
}