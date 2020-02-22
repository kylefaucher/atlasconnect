import React, { Component } from 'react';
import './App.css';
import "bootstrap/dist/css/bootstrap.min.css";

import Tag from './Tag.js';

import { Link } from 'react-router-dom';

import axios from 'axios';

import imgPlaceholder from './static/img/img-placeholder.png';

const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'June', 'July', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'];

export default class Post extends Component {
	constructor(props){
		super(props);
        this.state = {
            time: new Date(this.props.postJSON.time),
            imageURL: ''
        }
	}

    componentDidMount(){
        let request = 'http://localhost:4000/capstoneprototype/images/' + this.props.postJSON._id;
        axios.get(request)
            .then(response => {
                let item = response.data[0];
                let arrayBufferView = new Uint8Array( item.img.data.data );
                let blob = new Blob( [ arrayBufferView ], { type: "image/png" } );
                let urlCreator = window.URL || window.webkitURL;
                let imageUrl = urlCreator.createObjectURL( blob );
                this.setState({imageURL:imageUrl});
            })
            .catch(function (error){
                console.log('there was error');
                console.log(error);
            })
    }

    render() {
        return (
            <div className = "post" onClick = {this.props.handleClick}>
                <div className = "post-head">
                    <h5> {this.props.postJSON.title} </h5>
                    <h6 className='post-user-name'> {this.props.postJSON.user_display_name} </h6>
                </div>
                <div className ="uploadedImages">
                    <img src= {this.state.imageURL} alt = "image"/>
                </div>
                <div className = "post-foot">
                    {this.props.postJSON.message}
                    <span className = "postTime"> {months[this.state.time.getMonth()]} {this.state.time.getDate()} {this.state.time.getFullYear()} </span>
                    {this.props.postJSON.tags.map(item => {
                        return <Tag key={item.tag_id} tag_id = {item.tag_id} tag_color = {item.tag_color} />;
                    })}
                </div>
            </div>
        )
    }
}