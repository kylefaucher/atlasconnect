import React, { Component } from 'react';
import './App.css';
import "bootstrap/dist/css/bootstrap.min.css";
import axios from 'axios';

import UserLink from './UserLink.js';


export default class Comments extends Component {
	constructor(props){
		super(props);
        this.state = {
            comments: '',
            current_comment_input:''
        }
        this.onInputChange = this.onInputChange.bind(this);
        this.comment = this.comment.bind(this);
	}

    componentDidMount(){
        axios.get('/api/comments/'+ this.props.project_id)
            .then( response => {
                this.setState({comments:response.data});
                console.log(response);
            })
            .catch ( err => {
                console.log(err);
            })
    }

    onInputChange(e){
        this.setState({current_comment_input: e.target.value})
    }

    comment(){
        let requestJSON = {'project_id': this.props.project_id, "user_id": this.props.current_user, "textcontent": this.state.current_comment_input};
        axios.post('/api/comments/', requestJSON)
            .then( response => {
                console.log(response);
                this.setState({current_comment_input: ''});

                //re-get comments
                        axios.get('/api/comments/'+ this.props.project_id)
                        .then( response => {
                            this.setState({comments:response.data});
                            console.log(response);
                        })
                        .catch ( err => {
                            console.log(err);
                        })

            })
            .catch ( err => {
                console.log(err);
            })
    }

    render() {
        return (
        <div className= "comment-section">
            <div className = "form-group search-bar">
                 <input type = "text" onChange = {this.onInputChange} value = {this.state.current_comment_input} placeholder = "Comment"/> 
                 <button onClick = {this.comment} className = "btn form-control" > Post </button>
            </div>
            { this.state.comments.length>0 && 
            <div className = "comments-container"> 
            {this.state.comments.map(item => {
                return <div key={item._id}><UserLink uid = {item.user_id} /><p>{item.textcontent}</p> </div>;
            })}
            </div>
            }
        </div>
        )
    }
}