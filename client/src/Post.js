import React, { Component } from 'react';
import './App.css';
import "bootstrap/dist/css/bootstrap.min.css";

import { BrowserRouter as Router, Route, NavLink } from "react-router-dom";

import Tag from './Tag.js';

import Project from './Project.js';

import UserLink from './UserLink.js';

import { Link } from 'react-router-dom';

import axios from 'axios';

import Loader from 'halogenium/lib/DotLoader';

import imgPlaceholder from './static/img/img-placeholder.png';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserCircle } from '@fortawesome/free-regular-svg-icons';

const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'June', 'July', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'];

export default class Post extends Component {
	constructor(props){
		super(props);
        this.state = {
            time: new Date(this.props.postJSON.time),
            imageURL: '',
            loading: true,
            hovered: false
        }
        this.handleHover = this.handleHover.bind(this);
        this.handleUnhover = this.handleUnhover.bind(this);

	}

    componentDidMount(){
        let request = '/api/images/' + this.props.postJSON._id;
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
            })
    }

    handleHover(e){
        this.setState({'hovered':true});
    }

    handleUnhover(e){
        this.setState({'hovered':false});
    }

    render() {
        return (
            <div>
            { !this.state.loading ?
            <div>
            <Link className = {this.state.loading ? "post-loading" : "post-loaded"} to={{
                pathname: "/project/" + this.props.postJSON._id, 
                state: { 
                    prevPath: window.location.pathname 
                }
            }}>
            <div className = "post" onMouseEnter = {this.handleHover} onMouseLeave = {this.handleUnhover} onClick = {this.props.handleClick} style = {{backgroundImage:'url('+this.state.imageURL+')'}}>
            <div className = {this.state.hovered ? 'imgOverlay-hov' : 'imgOverlay'}>
            <div>
                <div className = "post-head">
                    <h5> {this.props.postJSON.title} </h5>
                </div>
                <div className = "post-foot">
                    {this.props.postJSON.message || this.props.postJSON.summary}
                </div> 
                <div className = "tags-list">
                {this.props.postJSON.tags.map(item => {
                        return <Tag key={item.tag_id} tag_id = {item.tag_id} tag_color = {item.tag_color} />;
                })}
                </div>
            </div>
            </div>
            </div>

            </Link> 

            <UserLink uid = {this.props.postJSON.user_id} />

            </div> : 
            <div className = "load-wrap"> <Loader color="#f2f2f2" size="72px" margin="4px" /> </div>}
            </div>
        )
    }
}