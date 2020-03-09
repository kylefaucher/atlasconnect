import React, { Component } from 'react';
import './App.css';
import "bootstrap/dist/css/bootstrap.min.css";

import './Tag.css'

export default class Tag extends Component {
	constructor(props){
		super(props);
	}

    render() {
        return (
            <div className = "tag" style = {{"background":this.props.tag_color}}>
                {this.props.tag_id}
            </div>
        )
    }
}