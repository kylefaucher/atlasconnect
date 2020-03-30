import React, { Component } from 'react';
import './App.css';
import "bootstrap/dist/css/bootstrap.min.css";
import { Redirect } from 'react-router-dom';

import Post from './Post.js';

import axios from 'axios';

import { Link } from 'react-router-dom';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserCircle } from '@fortawesome/free-regular-svg-icons';
import { faChevronLeft } from '@fortawesome/free-solid-svg-icons';


export default class Profile extends Component {
	constructor(props){
		super(props);
		this.state = {
            messages: [],
            public_profile:'',
            featured_project:'',
            profile_img:''
        };
	}

    componentDidMount() {
        //get user public profile data
        axios.get('/api/user/' + this.props.match.params.userId)
            .then(response => {
                this.setState({ public_profile: response.data[0]});
                console.log(response.data[0]);

                //get user posts
                let requestString = '/api/userposts/' + this.props.match.params.userId;
                axios.get(requestString)
                    .then(response => {
                        this.setState({ messages: response.data });
                        console.log(response.data);
                        if (this.state.public_profile.featured_project){
                        //get featured project
                        axios.get('/api/project/'+this.state.public_profile.featured_project)
                            .then(response => {
                                this.setState({featured_project:response.data[0]});
                            })
                            .catch(function(error){
                                console.log(error);
                            })
                        }
                    })
                    .catch(function (error){
                        console.log(error);
                    })

                //get user's profile picture
                let profileImgRequest = '/api/profileimg/' + this.props.match.params.userId;
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
            <div className = 'content-container profile-container'>
                <div>
                {this.props.location.state && 
                    <Link to = {{pathname: this.props.location.state.prevPath, state: { prevPath: window.location.pathname }}}>
                        <div className = 'back-link'>
                        <FontAwesomeIcon style = {{fontSize:'1em', 'marginRight':'10px'}} icon={faChevronLeft} /> Back </div>
                    </Link>
                }

                    <div className = "user-profile-info">
                        {this.state.profile_img ? 
                            <div className = "profile-image" style = {{backgroundImage: 'url(' + this.state.profile_img + ')'}} ></div>
                            :
                            <FontAwesomeIcon style = {{fontSize:'250px', marginBottom:'50px'}} icon={faUserCircle} />
                        }
                        <h1 className = "profile-user-display-name"> {this.state.public_profile.display_name} </h1>
                        <a href={"mailto:" + this.state.public_profile.email}> {this.state.public_profile.email} </a>
                        <p> {this.state.public_profile.bio} </p>
                    </div>
                </div>
                <div>
                {this.state.featured_project && 
                    <div style = {{marginBottom:'30px'}}>
                        <h2> featured project </h2>
                        <Post key={this.state.featured_project._id} postJSON = {this.state.featured_project} /> 
                    </div>
                }
                <h2> all projects </h2>
                <div className = 'profile-posts-container'>
                    {this.state.messages.map(item => {
                        return <Post key={item._id} postJSON = {item} />;
                     })}
                </div>
                </div>
            </div> 
            </div>
        )
    }
}