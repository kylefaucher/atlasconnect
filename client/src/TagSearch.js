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
			cur_tag_input: ''
		};
		this.onTagInputChange = this.onTagInputChange.bind(this);
        this.generateRandomColor = this.generateRandomColor.bind(this);
        this.sendTag = this.sendTag.bind(this);
	}

	onTagInputChange(e){
		this.setState({
			cur_tag_input: e.target.value
		});
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

    render() {
        return (
            <div>
            	<div className = "form-tags form-group-one-line">
            		<label className= "required"> Tags </label>
            		<div style = {{'display':'flex'}}>
            			<input value = {this.state.cur_tag_input} placeholder = 'Add Tags' type = "text" onChange = {this.onTagInputChange} name = 'tag_input' className = 'form-control'/>
            			<button className = 'btn add-tag-button' type = 'button' onClick = {this.sendTag}> + </button>
            		</div>
            	</div>
            </div>
        )
    }
}