import React, { Component } from 'react';
import './App.css';
import "bootstrap/dist/css/bootstrap.min.css";
import { Redirect } from 'react-router-dom';

import Post from './Post.js';

import axios from 'axios';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserCircle } from '@fortawesome/free-regular-svg-icons';
import { faPen } from '@fortawesome/free-solid-svg-icons';

import { faStar as solidStar } from '@fortawesome/free-solid-svg-icons';
import { faStar as outlineStar } from '@fortawesome/free-regular-svg-icons';

import Loader from 'halogenium/lib/DotLoader';

export default class SelfProfile extends Component {
	constructor(props){
		super(props);
		this.state = {
            messages: [],
            currentOpenProject: '',
            edit: false,
            public_profile:'',
            loading: false,
            featured_project: ''
        };

        this.updateProfile = this.updateProfile.bind(this);
        this.toggleEdit = this.toggleEdit.bind(this);
        this.saveProfileChanges = this.saveProfileChanges.bind(this);
        this.onBioChange = this.onBioChange.bind(this);
        this.onNameChange = this.onNameChange.bind(this);
        this.onEmailChange = this.onEmailChange.bind(this);
        this.onChooseFeatured = this.onChooseFeatured.bind(this);
	}

    updateProfile(){
         //get user public profile data
        axios.get('/api/user/' + this.props.currentUser.uid)
            .then(response => {
                this.setState({ public_profile: response.data[0]});
                console.log(response.data[0]);

                //get user posts
                let requestString = '/api/userposts/' + this.props.currentUser.uid;
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
            })
            .catch(function (error){
                console.log(error);
        });
    }

    componentDidMount() {
        this.props.updateCurrentTab('profile');
        this.updateProfile();
    }

    toggleEdit(){
        if (this.state.edit){
            console.log("turning off edit");
            this.setState({edit:!this.state.edit});
            this.updateProfile();
        }
        else{
            console.log("turning on edit");
            this.setState({edit:!this.state.edit});
        }
    }

    onBioChange(e){
        let profile_edit_copy = this.state.public_profile;
        profile_edit_copy.bio = e.target.value;
        this.setState({public_profile:profile_edit_copy});
    }

    onNameChange(e){
        let profile_edit_copy = this.state.public_profile;
        profile_edit_copy.display_name = e.target.value;
        this.setState({public_profile:profile_edit_copy});
    }

    onEmailChange(e){
        let profile_edit_copy = this.state.public_profile;
        profile_edit_copy.email = e.target.value;
        this.setState({public_profile:profile_edit_copy});
    }

    onChooseFeatured(featured_id){
        let profile_edit_copy = this.state.public_profile;
        profile_edit_copy.featured_project = featured_id;
        this.setState({public_profile:profile_edit_copy});
    }

    saveProfileChanges(){
        this.setState({loading:true});
        let thisObject = this;
        axios.put('/api/user/', this.state.public_profile)
            .then(function(res){
                console.log(res.data);
                thisObject.setState({loading:false});
                thisObject.toggleEdit();
            });
    }

    render() {
        return (
            <div>
            {this.props.isLoggedIn ? 
            <div className = 'content-container profile-container'>
                <div>
                    <FontAwesomeIcon style = {{fontSize:'10em', marginBottom:'50px'}} icon={faUserCircle} />
                    {this.state.edit ? 
                        <div>

                            <div class = "edit-profile-input">
                                <label> Name </label>
                                <input type = "text" name = 'display_name' value = {this.state.public_profile.display_name} onChange = {this.onNameChange} />
                            </div>

                            <div class = "edit-profile-input">
                                <label> Email </label>
                                <input type = "email" name = 'email' value = {this.state.public_profile.email} onChange = {this.onEmailChange} />
                            </div>

                            <div class = "edit-profile-input">
                                <label> Bio </label>
                                <textarea name = 'bio' value = {this.state.public_profile.bio} onChange = {this.onBioChange} />
                            </div>

                            <button type = "button" class = "profile-cancel" onClick= {this.toggleEdit}> Cancel </button>
                            <button type = "button" class = "profile-save" onClick= {this.saveProfileChanges}> Save Changes </button>
                            
                        </div> :
                        <div className = "user-profile-info">
                            <h1 className = "profile-user-display-name"> {this.state.public_profile.display_name} </h1>
                            <a href={"mailto:" + this.state.public_profile.email}> {this.state.public_profile.email} </a>
                            <p> {this.state.public_profile.bio} </p>
                            <div className = "profile-edit-button" onClick = {this.toggleEdit}> <FontAwesomeIcon icon={faPen} /> Edit Profile </div>
                        </div>
                    }
                    {this.state.loading && 
                       <div style = {{display:'flex', width:'100%', justifyContent:'center', marginTop:'25px'}}>  <Loader color="#212529" size="36px" margin="4px" />  </div>
                    }
                </div>
                <div>
                <h2> featured project </h2>
                {this.state.public_profile.featured_project ? 
                    <Post key={this.state.featured_project._id} postJSON = {this.state.featured_project} /> 
                    : 
                    <p> You have not chosen a featured project </p>
                }
                <h2 style = {{marginTop:'30px'}}> all projects </h2>
                <div className = 'profile-posts-container'>

                    {this.state.edit ? 

                        (this.state.messages.map(item => {
                            return <div onClick={() => this.onChooseFeatured(item._id)} className = {item._id == this.state.public_profile.featured_project ? "featured-wrapper featured" : "featured-wrapper"} > {item._id == this.state.public_profile.featured_project ? <FontAwesomeIcon icon={solidStar} /> : <FontAwesomeIcon icon={outlineStar} />}<Post key={item._id} postJSON = {item} /> </div>;
                         }))

                        : 

                        (this.state.messages.map(item => {
                            return <Post key={item._id} postJSON = {item} />;
                         }))
                    }

                </div>
                </div>
            </div> : 
               <Redirect
                    to={{
                      pathname: "/"
                    }}
                />
            }
            </div>
        )
    }
}