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
            public_profile: ''
        }
	}

    componentDidMount(){
        axios.get('/api/user/' + this.props.uid)
            .then(response => {
                this.setState({ public_profile: response.data[0]});
                console.log(response.data[0]);
            })
            .catch(function (error){
                console.log(error);
        });
    }

    render() {
        return (
            <div>

            <Link to={{pathname: "/user/" + this.state.public_profile.user_id, state: { prevPath: window.location.pathname }}}>
                <FontAwesomeIcon style = {{fontSize:'1em', 'marginRight':'10px'}} icon={faUserCircle} />
                <h6 className='post-user-name'> {this.state.public_profile.display_name} </h6>
                <div>
                </div>
            </Link>

            </div>
        )
    }
}