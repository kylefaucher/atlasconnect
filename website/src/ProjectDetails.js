import React, { Component } from 'react';
import './App.css';
import "bootstrap/dist/css/bootstrap.min.css";

import Tag from './Tag.js';

import imgPlaceholder from './static/img/img-placeholder.png';

import Modal from 'react-modal';

const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'June', 'July', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'];

Modal.setAppElement('#root');

export default class ProjectDetails extends Component {
	constructor(props){
		super(props);

        this.state = {
            time: new Date(this.props.postJSON.time)
        };
	}

    render() {
        return (
            <div>
            <Modal
                isOpen = {this.props.open}
                onRequestClose = {this.props.closeModal}
            >
                <h5> {this.props.postJSON.title} </h5>
                <img src = {imgPlaceholder} alt = "placeholder" style = {{"width":"100%", "display":"block"}}/>
                {this.props.postJSON.message}
                <div>
                </div>
            </Modal>
            </div>
        )
    }
}