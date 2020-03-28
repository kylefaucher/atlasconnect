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
            public_profile: '',
            profile_img:'',
            loaded: false
        }
	}

    componentDidMount(){
        axios.get('/api/user/' + this.props.uid)
            .then(response => {
                this.setState({ public_profile: response.data[0]});
                this.setState({ loaded: true});
                console.log(response.data[0]);

                //get user's profile picture
                let profileImgRequest = '/api/profileimg/' + this.props.uid;
                axios.get(profileImgRequest)
                .then(response => {
                    if (response.data[0]){
                        let item = response.data[0];
                        let arrayBufferView = new Uint8Array( item.img.data.data );
                        let blob = new Blob( [ arrayBufferView ], { type: "image/png" } );
                        let urlCreator = window.URL || window.webkitURL;
                        let imageUrl = urlCreator.createObjectURL( blob );
                        this.setState({profile_img:imageUrl});
                    }
                })
                .catch(function (error){
                    console.log('there was error');
                    console.log(error);
                })
            })
            .catch(function (error){
                console.log(error);
        });
    }

    render() {
        return (
            <div className = "user-card-wrapper">

            <Link to={{pathname: "/user/" + this.state.public_profile.user_id, state: { prevPath: window.location.pathname }}}>
                <div style = {this.state.loaded? {transform:'scale(1)'} : {}} className = "user-card">
                    {this.state.profile_img ? 
                        <div className = "profile-image-medium" style = {{backgroundImage: 'url(' + this.state.profile_img + ')'}} ></div>
                        :
                        <FontAwesomeIcon style = {{fontSize:'7em', display:'block', margin: 'auto', marginBottom:'25px'}} icon={faUserCircle} />
                    }
                    <h6 className='post-user-name'> {this.state.public_profile.display_name} </h6>
                    <p> {this.state.public_profile.bio} </p>
                </div>
            </Link>

            </div>
        )
    }
}