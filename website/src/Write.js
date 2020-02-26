import React, { Component } from 'react';
import './App.css';
import "bootstrap/dist/css/bootstrap.min.css";

import { Redirect } from 'react-router-dom';

import { FilePond, registerPlugin } from "react-filepond";
import "filepond/dist/filepond.min.css";
import FilePondPluginImageExifOrientation from "filepond-plugin-image-exif-orientation";
import FilePondPluginImagePreview from "filepond-plugin-image-preview";
import "filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css";

import axios from 'axios';

import Tag from './Tag.js';

const colors = ['#CCEEEB', '#FEEFD8', '#FFDCDC', '#D5D6E9', '#ECCCDF'];

var curResponseId = "";

registerPlugin(FilePondPluginImageExifOrientation, FilePondPluginImagePreview);

const serverConfig = {
    timeout: 99999,
    revert: (uniqueFileId, load, error) => {
            
            console.log(uniqueFileId);
            
            axios.delete('http://localhost:4000/capstoneprototype/upload', { data: { filename: uniqueFileId } } );

            error('error');

            load();
    },
    process: (fieldName, file, metadata, load, error, progress, abort) => {

        const formData = new FormData();
        formData.append('file', file, file.name);

        // aborting the request
        const CancelToken = axios.CancelToken;
        const source = CancelToken.source();

        axios({
            method: 'POST',
            url: 'http://localhost:4000/capstoneprototype/upload',
            data: formData,
            cancelToken: source.token,
            onUploadProgress: (e) => {
                // updating progress indicator
                progress(e.lengthComputable, e.loaded, e.total)
            }
        }).then(response => {
            // passing the file id to FilePond
            console.log(response.data);
            curResponseId = response.data;
            load(response.data.filename);
        }).catch((thrown) => {
            if (axios.isCancel(thrown)) {
                console.log('Request canceled', thrown.message);
            } else {
                // handle error
            }
        })
        // Setup abort interface
        return {
            abort: () => {
                source.cancel('Operation canceled by the user.');
                abort();
            }
        }
    }

};                 
                   
export default class Write extends Component {
	constructor(props){
		super(props);

		this.state={
			message: '',
			title: '',
			tags: [],
			cur_tag_input: '',
			cur_color_index: 0,
			files: [
			],
			fileUniqueId:''
		};

		this.onSubmit = this.onSubmit.bind(this);
		this.onMessageChange = this.onMessageChange.bind(this);
		this.onTitleChange = this.onTitleChange.bind(this);
		this.onTagAdd = this.onTagAdd.bind(this);
		this.onTagInputChange = this.onTagInputChange.bind(this);
		this.handleInit = this.handleInit.bind(this);

	}

	onSubmit(e){
		e.preventDefault();
		let curTime = new Date();
		const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'June', 'July', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'];

		this.setState({fileUniqueId: 'curResponseId'});

		const newPost = {
			post_data:{
				message: this.state.message,
				title: this.state.title,
				time: curTime,
				public: true,
				tags: this.state.tags,
				user_display_name: this.props.currentUser.displayName,
				user_id: this.props.currentUser.uid
			},
			img_data:{
				fileID: this.state.fileUniqueId
			}
		};


		axios.post('http://localhost:4000/capstoneprototype/add', newPost)
            .then(res => console.log(res.data));

        // axios.post('http://localhost:4000/capstoneprototype/save', this.state.fileUniqueId)
        //     .then(res => console.log(res.data));

	}

	onMessageChange(e){
		this.setState({
			message: e.target.value
		});
	}

	onTitleChange(e){
		this.setState({
			title: e.target.value
		});
	}

	onTagInputChange(e){
		this.setState({
			cur_tag_input: e.target.value
		});
	}

	onTagAdd(e){
		e.preventDefault();
		let tagArray = this.state.tags;
		tagArray.push(
			{
				tag_id: this.state.cur_tag_input,
				tag_color: colors[this.state.cur_color_index]
			}
		);
		this.setState({ 
			tags: tagArray 
		});
		this.setState({cur_tag_input: ''});
		this.setState({cur_color_index: this.state.cur_color_index + 1});

		this.setState({
			              fileUniqueId: curResponseId
		});
	}

	handleInit() {
	    console.log("FilePond instance has initialised", this.pond);
	}

    render() {
        return (
        	<div> 
        	{this.props.isLoggedIn ?
            <div className = 'content-container'>
                <div >
                <h4>New Project</h4>
                <form onSubmit={this.onSubmit} style = {{"margin-bottom": "200px"}} enctype="multipart/form-data">
                	<label style = {{'margin-top':'20px'}}> Title </label>
                	<input type = "text" name = 'title' value = {this.state.title} onChange = {this.onTitleChange} className = "form-control" />
                	<label style = {{'margin-top':'20px'}}> Summary </label>
                	<textarea name = 'message' value = {this.state.message} onChange = {this.onMessageChange} className = 'form-control' />
                	<div style = {{'display':'flex', 'margin-bottom':'20px', 'margin-top':'20px'}}>
                		<input value = {this.state.cur_tag_input} placeholder = 'Add Tags' type = "text" onChange = {this.onTagInputChange} name = 'tag_input' className = 'form-control'/>
                		<button className = 'btn btn-secondary' type = 'button' onClick = {this.onTagAdd}> + </button>

                	</div>
                	<div style = {{'margin-bottom':'30px'}}>
	                	{this.state.tags.map(item => {
	                	 		return <Tag key={item.tag_id} tag_id = {item.tag_id} tag_color = {item.tag_color} />;
	                	})}
                	</div>

                	<FilePond
			          ref={ref => (this.pond = ref)}
			          files={this.state.files}
			          allowMultiple={true}
			          maxFiles={3}
			          server={serverConfig}
			          oninit={() => this.handleInit()}
			          onupdatefiles={fileItems => {
			          	console.log(fileItems);
			            // Set currently active file objects to this.state
                        this.setState({
                                files: fileItems.map(fileItem => fileItem.file)
                        });
			          }}
			        />

                	<button className = 'btn btn-primary' type = 'submit'>Post</button>
                </form>
                </div>
            </div> : 
                <Redirect
                    to={{
                      pathname: "/"
                    }}
                />
        	}
            </div>
        )
    }
}