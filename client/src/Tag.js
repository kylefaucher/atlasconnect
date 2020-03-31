import React, { Component } from 'react';
import './App.css';
import "bootstrap/dist/css/bootstrap.min.css";
import axios from 'axios';
import './Tag.css';


export default class Tag extends Component {
	constructor(props){
		super(props);
        this.state = {
            tag_object: '',
            loaded: false
        }
	}

    componentDidMount(){
        axios.get('/api/tag/'+ this.props.tag_id)
            .then( response => {
                this.setState({tag_object:response.data[0]});
                console.log(response);
                this.setState({loaded:true});
            })
            .catch ( err => {
                console.log(err);
            })
    }

    render() {
        return (
        <span>
            {this.props.sendExistingTag ? 

                <span onClick={() => this.props.sendExistingTag(this.state.tag_object.tag_id, this.state.tag_object.tag_color)}>
                    {this.state.tag_object &&
                    <div className = "tag" style = {this.props.removable ? {"background":this.state.tag_object.tag_color} : {"background":this.state.tag_object.tag_color, "paddingRight":"10px"}}>
                        <span>{this.state.tag_object.tag_id}</span> {this.props.removable && <div onClick = {() => this.props.onTagDelete(this.state.tag_object.tag_id)} className = 'tag-delete'>×</div>}
                    </div>
                    }
                </span>

            :

                <span>
                    {this.state.tag_object &&
                    <div className = "tag" style = {this.props.removable ? {"background":this.state.tag_object.tag_color} : {"background":this.state.tag_object.tag_color, "paddingRight":"10px"}}>
                        <span>{this.state.tag_object.tag_id}</span> {this.props.removable && <div onClick = {() => this.props.onTagDelete(this.state.tag_object.tag_id)} className = 'tag-delete'>×</div>}
                    </div>
                    }
                </span>
                    

            }
        </span>
        )
    }
}