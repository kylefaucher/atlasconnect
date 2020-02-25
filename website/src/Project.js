import React, { Component } from 'react';
import './App.css';
import "bootstrap/dist/css/bootstrap.min.css"

import Tag from './Tag.js';

import axios from 'axios';

import { Link } from 'react-router-dom';

import Loader from 'halogenium/lib/DotLoader';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft } from '@fortawesome/free-solid-svg-icons';

const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'June', 'July', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'];

export default class Project extends Component {
	constructor(props){
		super(props);
        this.state = {
            loading: true,
            projectDetails: '',
            imageURL:''
        };
	}

    componentDidMount(){
        console.log('componentDidMount');
        console.log(this.props.match.params);
        axios.get('http://localhost:4000/capstoneprototype/project/' + this.props.match.params.projectId)
            .then(response => {
                this.setState({ projectDetails: response.data[0]});
                console.log(response.data);
            })
            .catch(function (error){
                console.log(error);
        });
        let request = 'http://localhost:4000/capstoneprototype/images/' + this.props.match.params.projectId;
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
                <Link to = {this.props.location.state.prevPath}>
                <div className = 'back-link'>
                <FontAwesomeIcon style = {{fontSize:'1em', 'marginRight':'10px'}} icon={faChevronLeft} /> Back </div> </Link>
                {!this.state.loading ? <div>
                <h1> {this.state.projectDetails.title} </h1>
                <h5> {this.state.projectDetails.user_display_name} </h5>
                <img className = "project-image" src = {this.state.imageURL} alt = 'img' />
                <p></p>
                <p> {this.state.projectDetails.message} </p> </div> :
                <Loader color="#282c34" size="72px" margin="4px" /> }
            </div>
        )
    }
}