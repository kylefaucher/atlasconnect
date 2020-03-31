import React, { Component } from 'react';
import './App.css';
import "bootstrap/dist/css/bootstrap.min.css";

import { Redirect } from 'react-router-dom';

import randomcolor from 'randomcolor';

import axios from 'axios';

import Tag from './Tag.js';

export default class TagSearch extends Component {
	constructor(props){
		super(props);

		this.state={
			cur_tag_input: '',
            tag_suggestions: ''
		};
		this.onTagInputChange = this.onTagInputChange.bind(this);
        this.generateRandomColor = this.generateRandomColor.bind(this);
        this.sendTag = this.sendTag.bind(this);
        this.sendExistingTag = this.sendExistingTag.bind(this);
	}

	onTagInputChange(e){
		this.setState({
			cur_tag_input: e.target.value
		});

        axios.get('/api/tag/search/' + e.target.value)
            .then( response => {
                    this.setState({tag_suggestions:response.data});
                    console.log(response);
                })
                .catch ( err => {
                    console.log(err);
                })
	}

    generateRandomColor(){
        return randomcolor.randomColor({
            hue: 'random',
            luminosity: 'bright',
            format: 'rgba',
            alpha: 0.4
        });
    }

    sendTag(){
        this.props.onTagAdd(this.state.cur_tag_input, this.generateRandomColor());
        this.setState({cur_tag_input:''});
    }

    sendExistingTag(tagid, tagcolor){
        console.log('clicked');
        this.props.onTagAdd(tagid, tagcolor);
        this.setState({cur_tag_input:''});
        this.setState({tag_suggestions:''});
    }

    render() {
        return (
            <div>
            	<div className = "form-tags form-group-one-line">
            		<label className= "required"> Tags </label>
            		<div style = {{'display':'flex', 'position':'relative', 'zIndex':'500'}}>
            			<input value = {this.state.cur_tag_input} autocomplete = "off" placeholder = 'atls3100, vr, arduino' type = "text" onChange = {this.onTagInputChange} name = 'tag_input' className = 'form-control'/>
            			<button className = 'btn add-tag-button' type = 'button' onClick = {this.sendTag}> + </button>
            		</div>
                    {this.state.tag_suggestions.length>0 &&
                    <div className = "tag-search-suggestions">
                        
                            {this.state.tag_suggestions.map(item => {
                                return <Tag key={item.tag_id} tag_id = {item.tag_id} sendExistingTag = {this.sendExistingTag} />;
                            })}
                    </div>
                    }
            	</div>
            </div>
        )
    }
}