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
            profile_img:''
        }
	}

    componentDidMount(){
        axios.get('/api/user/' + this.props.uid)
            .then(response => {
                this.setState({ public_profile: response.data[0]});
                console.log(response.data[0]);

                //get user's profile picture
                let profileImgRequest = '/api/profileimg/' + this.props.uid;
                axios.get(profileImgRequest)
                .then(response => {
                    if (response.data[0]){
                        let item = response.data[0];
                        let arrayBufferView = new Uint8Array( item.img.data.data );
                        let blob = new Blob( [ arrayBufferView ], { type: "image/jpeg" } );
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
            <div>

            <Link to={{pathname: "/user/" + this.state.public_profile.user_id, state: { prevPath: window.location.pathname }}}>
                <div style = {{display:'flex'}}>
                    {this.state.profile_img ? 
                        <div className = "profile-image-small" style = {{backgroundImage: 'url(' + this.state.profile_img + ')'}} ></div>
                        :
                        <FontAwesomeIcon style = {{fontSize:'1.5em', marginRight:'10px'}} icon={faUserCircle} />
                    }
                    <h6 className='post-user-name'> {this.state.public_profile.display_name} </h6>
                </div>
            </Link>

            </div>
        )
    }
}