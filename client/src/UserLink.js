import React, { Component } from 'react';
import './App.css';
import "bootstrap/dist/css/bootstrap.min.css";

import { BrowserRouter as Router, Route, NavLink } from "react-router-dom";

import { Link } from 'react-router-dom';

import axios from 'axios';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserCircle } from '@fortawesome/free-regular-svg-icons';

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
            <div>

            <Link to={{pathname: "/user/" + this.props.postJSON.user_id, state: { prevPath: window.location.pathname }}}>
                <FontAwesomeIcon style = {{fontSize:'1em', 'marginRight':'10px'}} icon={faUserCircle} />
                <h6 className='post-user-name'> {this.props.postJSON.user_display_name} </h6>
                <span className = "postTime"> {months[this.state.time.getMonth()]} {this.state.time.getDate()} {this.state.time.getFullYear()} </span>
                <div>
                </div>
            </Link>

            </div>
        )
    }
}