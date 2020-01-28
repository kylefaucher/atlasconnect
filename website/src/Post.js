import React, { Component } from 'react';
import './App.css';
import "bootstrap/dist/css/bootstrap.min.css";

import { Link } from 'react-router-dom';

import imgPlaceholder from './static/img/img-placeholder.png'

export default class Post extends Component {
	constructor(props){
		super(props);
	}

    render() {
        return (
            <div className = "post">
                <h5> {this.props.postJSON.title} </h5>
                <img src = {imgPlaceholder} alt = "placeholder" style = {{"width":"100%", "display":"block"}}/>
                {this.props.postJSON.message}
                <span className = "postTime"> {this.props.postJSON.time} </span>
            </div>
        )
    }
}