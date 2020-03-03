import React, { Component } from 'react';
import './App.css';
import "bootstrap/dist/css/bootstrap.min.css";
import 'draft-js/dist/Draft.css';

import { Redirect } from 'react-router-dom';

import { FilePond, registerPlugin } from "react-filepond";
import "filepond/dist/filepond.min.css";
import FilePondPluginImageExifOrientation from "filepond-plugin-image-exif-orientation";
import FilePondPluginImagePreview from "filepond-plugin-image-preview";
import "filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css";

import {EditorState, convertToRaw} from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs';

import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';

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
			fileUniqueId:'',
			forClass:false,
			classnum: '',
			classdept: '',
			editorState: EditorState.createEmpty()
		};

		this.onSubmit = this.onSubmit.bind(this);
		this.onMessageChange = this.onMessageChange.bind(this);
		this.onTitleChange = this.onTitleChange.bind(this);
		this.onTagAdd = this.onTagAdd.bind(this);
		this.onTagInputChange = this.onTagInputChange.bind(this);
		this.handleInit = this.handleInit.bind(this);
		this.onForClassChange = this.onForClassChange.bind(this);
		this.onClassDeptChange = this.onClassDeptChange.bind(this);
		this.onClassNumChange = this.onClassNumChange.bind(this);
		this.onEditorChange = this.onEditorChange.bind(this);

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

	onForClassChange(e){
		console.log(e.target);
		this.setState({forClass:e.target.checked});
	}

	onClassDeptChange(e){
		console.log(e.target);
		this.setState({classdept:e.target.value});
	}
	onClassNumChange(e){
		console.log(e.target);
		this.setState({classnum:e.target.value});
	}

	onEditorChange(editorState){
		this.setState({editorState:editorState});
	}




    render() {
        return (
        	<div> 
        	{this.props.isLoggedIn ?
            <div className = 'content-container'>
                <div >
                <h4 className = "add-title">Add a Project</h4>
                <form onSubmit={this.onSubmit} id = "addProjectForm" style = {{"marginBottom": "200px"}} encType="multipart/form-data">
                	<div class = "form-group-one-line">
	                	<label> Title </label>
	                	<input type = "text" name = 'title' value = {this.state.title} onChange = {this.onTitleChange} className = "form-control" />
	                </div>
	                <div class = "form-group-one-line">
                		<label> Summary </label>
                		<textarea name = 'message' maxlength="100" value = {this.state.message} onChange = {this.onMessageChange} className = 'form-control' />
                	</div>
               		<div class = "form-group-one-line form-flex">
                		<input id = "forclass" type = "checkbox" name = 'forClass' checked = {this.state.forClass} onChange = {this.onForClassChange} />
                		<label for = "forclass"> This project was for a class </label>
                	</div>
                	{this.state.forClass && 
                		<div class = "form-group-one-line">
	                		<label> Class </label>
	                		<div style = {{"display": "flex", "width":"25%"}}>
	                			<input type = "text" placeholder = "atls" name = 'class-dept' value = {this.state.classdept} onChange = {this.onClassDeptChange} class = "form-control"/>
	                			<input type = "text" placeholder = "1000" name = 'class-number' value = {this.state.classnumber} onChange = {this.onClassNumChange} class = "form-control"/>
	                		</div>
	                	</div>
	                }
                	<div className = "form-group-one-line">
                		<label> Tags </label>
                		<div style = {{'display':'flex'}}>
                			<input value = {this.state.cur_tag_input} placeholder = 'Add Tags' type = "text" onChange = {this.onTagInputChange} name = 'tag_input' className = 'form-control'/>
                			<button className = 'btn add-tag-button' type = 'button' onClick = {this.onTagAdd}> + </button>
                		</div>
                	</div>
                	<div style = {{'marginBottom':'30px'}}>
	                	{this.state.tags.map(item => {
	                	 		return <Tag key={item.tag_id} tag_id = {item.tag_id} tag_color = {item.tag_color} />;
	                	})}
                	</div>
                	<label> Main Photo </label>
                	<FilePond
			          ref={ref => (this.pond = ref)}
			          files={this.state.files}
			          allowMultiple={false}
			          maxFiles={1}
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

			        <div class = "form-group-one-line">
	                	<label> Project Description </label>
	                </div>

	                <Editor
			          editorState={this.state.editorState}
			          wrapperClassName="demo-wrapper"
			          editorClassName="demo-editor"
			          onEditorStateChange={this.onEditorChange}
			        />

	                <div class = "form-group-one-line form-flex">
                		<input id = "forclass" type = "checkbox" name = 'forClass' checked = {this.state.forClass} onChange = {this.onForClassChange} />
                		<label for = "forclass"> Submit this project for Atlas Expo consideration </label>
                	</div>

                	<div class = "form-group-one-line form-flex">
                		<input id = "forclass" type = "checkbox" name = 'forClass' checked = {this.state.forClass} onChange = {this.onForClassChange} />
                		<label for = "forclass"> I would like space in Atlas to exhibit this project </label>
                	</div>

	                <div class = "form-group-one-line form-flex">
                		<input id = "forclass" type = "checkbox" name = 'forClass' checked = {this.state.forClass} onChange = {this.onForClassChange} />
                		<label for = "forclass"> Make this project private </label>
                	</div>

                	<button className = 'btn btn-primary' type = 'submit'>Save</button>
                	<button className = 'btn btn-primary' type = 'submit'>Save and Post</button>
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

// convert from editor content to html (will probably want to use later)
// <textarea disabled value={draftToHtml(convertToRaw(this.state.editorState.getCurrentContent()))}/>
