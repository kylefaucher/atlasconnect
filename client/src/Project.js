import React, { Component } from 'react';
import './App.css';
import "bootstrap/dist/css/bootstrap.min.css"

import Tag from './Tag.js';
import UserLink from './UserLink.js';

import Comments from './Comments.js';


import axios from 'axios';

import { Link } from 'react-router-dom';

import Loader from 'halogenium/lib/DotLoader';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft } from '@fortawesome/free-solid-svg-icons';
import { faUserCircle } from '@fortawesome/free-regular-svg-icons';


const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'June', 'July', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'];


export default class Project extends Component {
	constructor(props){
		super(props);
        this.state = {
            loading: true,
            projectDetails: '',
            imageURL:'',
            imageURL2:'',
            imageURL3:'',
            largeImageURL:'',
            projectDate:'',
            currentUserId: this.props.currentUser,
            currentUser:''
        };

        this.enlargeImage = this.enlargeImage.bind(this);
        this.featureToggle = this.featureToggle.bind(this);
	}

    componentDidMount(){
        axios.get('/api/project/' + this.props.match.params.projectId)
            .then(response => {
                this.setState({ projectDetails: response.data[0]});
                this.setState({ projectDate: new Date(response.data[0].time)})
                console.log(response.data);
            })
            .catch(function (error){
                console.log(error);
        });
        let request = '/api/images/' + this.props.match.params.projectId;
        axios.get(request)
            .then(response => {
                let item = response.data[0];
                let arrayBufferView = new Uint8Array( item.img.data.data );
                let blob = new Blob( [ arrayBufferView ], { type: "image/jpeg" } );
                let urlCreator = window.URL || window.webkitURL;
                let imageUrl = urlCreator.createObjectURL( blob );
                this.setState({imageURL:imageUrl});
                this.setState({largeImageURL:imageUrl});
                this.setState({loading:false});
            })
            .catch(function (error){
                console.log('there was error');
                console.log(error);
            });
        let request2 = '/api/additionalimages/' + this.props.match.params.projectId;
        axios.get(request2)
            .then(response => {
                if (response.data[0]){
                    let item = response.data[0];
                    let arrayBufferView = new Uint8Array( item.img.data.data );
                    let blob = new Blob( [ arrayBufferView ], { type: "image/jpeg" } );
                    let urlCreator = window.URL || window.webkitURL;
                    let imageUrl = urlCreator.createObjectURL( blob );
                    this.setState({imageURL2:imageUrl});
                    this.setState({loading:false});

                }

                if (response.data[1]){
                    let item = response.data[1];
                    let arrayBufferView = new Uint8Array( item.img.data.data );
                    let blob = new Blob( [ arrayBufferView ], { type: "image/jpeg" } );
                    let urlCreator = window.URL || window.webkitURL;
                    let imageUrl = urlCreator.createObjectURL( blob );
                    this.setState({imageURL3:imageUrl});
                    this.setState({loading:false});
                }
            })
            .catch(function (error){
                console.log('there was error');
                console.log(error);
            });

            axios.get('/api/user/' + this.state.currentUserId)
            .then(response => {
                this.setState({ currentUser: response.data});
                 })
                .catch(error => {
                    console.log(error);
                 });
    }

    enlargeImage(imgURL){
        this.setState({largeImageURL:imgURL});

    }

    componentDidUpdate(prevProps) {
      if (this.props.currentUser !== prevProps.currentUser) {
        this.setState({
            currentUserId:this.props.currentUser
        }, () => {
            axios.get('/api/user/' + this.state.currentUserId)
            .then(response => {
                this.setState({ currentUser: response.data});
                 })
                .catch(error => {
                    console.log(error);
                 });
            
        });
      }
    }

    featureToggle(){
        let requestJSON = {
            project_id: this.state.projectDetails._id,
            featured: !this.state.projectDetails.featured
        }
        axios.put('/api/project/', requestJSON)
            .then(response => {
                console.log(response);
                //update project data
                    axios.get('/api/project/' + this.props.match.params.projectId)
                        .then(response => {
                            this.setState({ projectDetails: response.data[0]});
                            this.setState({ projectDate: new Date(response.data[0].time)})
                            console.log(response.data);
                        })
                        .catch(function (error){
                            console.log(error);
                    });
            })
            .catch(error => {
                console.log(error);
            })
    }

    render() {
        return (
            <div className = 'content-container project-container'>
            {this.props.location.state && 
                <Link to = {{pathname: this.props.location.state.prevPath, state: { prevPath: window.location.pathname }}}>
                <div className = 'back-link'>
                <FontAwesomeIcon style = {{fontSize:'1em', 'marginRight':'10px'}} icon={faChevronLeft} /> Back </div> </Link>
            }
                {!this.state.loading ? 
                <div className = "project-grid-container">
                    <div className = "project-sidebar">
                        <h1 className = "project-title"> {this.state.projectDetails.title} </h1>
                        <UserLink uid = {this.state.projectDetails.user_id} />
                        { this.state.projectDate ? 
                        <span className = "project-time"> {months[this.state.projectDate.getMonth()]} {this.state.projectDate.getDate()} {this.state.projectDate.getFullYear()} </span> : '' }
                        <p className = "project-summary"> {this.state.projectDetails.summary} </p> 
                        <div className = "tags-list">
                        {this.state.projectDetails.tags.map(item => {
                                return <Tag key={item} tag_id = {item} />;
                        })}
                        </div>
                        {this.state.currentUser.length>0 &&
                            <div>
                                <div>
                                {this.state.currentUser[0].faculty && this.state.projectDetails.featured && 
                                    <button className = "unfeature-project-button" onClick = {this.featureToggle}> Unfeature </button>
                                }
                                </div>

                                <div>
                                {this.state.currentUser[0].faculty && !this.state.projectDetails.featured && 
                                    <button className = "feature-project-button" onClick = {this.featureToggle}> Feature </button>
                                }
                                </div>
                            </div>
                        }
                        <Comments project_id = {this.state.projectDetails._id} current_user = {this.state.currentUserId} />
                    </div>
                    <div className = "project-body">
                        <div class = "img-gallery">
                            <img className = "project-image" src = {this.state.largeImageURL} alt = 'img' />
                            <div className = "thumbnails">
                                <img onClick={() => this.enlargeImage(this.state.imageURL)} className = "project-image-thumbnail" src = {this.state.imageURL} alt = 'img' />
                                {this.state.imageURL2 && <img onClick={() => this.enlargeImage(this.state.imageURL2)} className = "project-image-thumbnail" src = {this.state.imageURL2} alt = 'img' />}
                                {this.state.imageURL3 && <img onClick={() => this.enlargeImage(this.state.imageURL3)} className = "project-image-thumbnail" src = {this.state.imageURL3} alt = 'img' />}
                            </div>
                        </div>
                        <div className = "project-body-writeup" dangerouslySetInnerHTML={{__html: this.state.projectDetails.editor_html}}></div>
                    </div>
                </div> :
                <Loader color="#282c34" size="72px" margin="4px" /> }
            </div>
        )
    }
}