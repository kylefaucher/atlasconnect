import React, { Component } from 'react';
import './App.css';
import "bootstrap/dist/css/bootstrap.min.css"

import Tag from './Tag.js';
import UserLink from './UserLink.js';

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
            projectDate:''
        };
	}

    componentDidMount(){
        console.log(this.props.match.params);
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
                let blob = new Blob( [ arrayBufferView ], { type: "image/png" } );
                let urlCreator = window.URL || window.webkitURL;
                let imageUrl = urlCreator.createObjectURL( blob );
                this.setState({imageURL:imageUrl});
                this.setState({loading:false});
            })
            .catch(function (error){
                console.log('there was error');
                console.log(error);
            });
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
                                return <Tag key={item.tag_id} tag_id = {item.tag_id} tag_color = {item.tag_color} />;
                        })}
                        </div>
                    </div>
                    <div className = "project-body">
                        <img className = "project-image" src = {this.state.imageURL} alt = 'img' />
                        <div className = "project-body-writeup" dangerouslySetInnerHTML={{__html: this.state.projectDetails.editor_html}}></div>
                    </div>
                </div> :
                <Loader color="#282c34" size="72px" margin="4px" /> }
            </div>
        )
    }
}