import React, { Component } from 'react';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
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

import FilePondPluginImageCrop from 'filepond-plugin-image-crop';
import FilePondPluginImageResize from 'filepond-plugin-image-resize';
import FilePondPluginImageTransform from 'filepond-plugin-image-transform';

import axios from 'axios';

import Tag from './Tag.js';
import TagSearch from './TagSearch.js';

var curResponseId = "";

var reactObject = "";

registerPlugin(FilePondPluginImageExifOrientation, FilePondPluginImagePreview, FilePondPluginImageTransform, FilePondPluginImageCrop, FilePondPluginImageResize);

const serverConfig = {
    timeout: 99999,
    revert: (uniqueFileId, load, error) => {
            
            console.log(uniqueFileId);
            
            axios.delete('/api/upload', { data: { filename: uniqueFileId } } );

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
            url: '/api/upload',
            data: formData,
            cancelToken: source.token,
            onUploadProgress: (e) => {
                // updating progress indicator
                progress(e.lengthComputable, e.loaded, e.total)
            }
        }).then(response => {
            // passing the file id to FilePond
            console.log(response.data);
            reactObject.setState({fileUniqueId: response.data});
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

const serverConfig_2 = {
    timeout: 99999,
    revert: (uniqueFileId, load, error) => {
            
            console.log(uniqueFileId);
            
            axios.delete('/api/upload', { data: { filename: uniqueFileId } } );

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
            url: '/api/upload',
            data: formData,
            cancelToken: source.token,
            onUploadProgress: (e) => {
                // updating progress indicator
                progress(e.lengthComputable, e.loaded, e.total)
            }
        }).then(response => {
            // passing the file id to FilePond
            console.log(response.data);
            reactObject.setState({fileUniqueId2: response.data});
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

const serverConfig_3 = {
    timeout: 99999,
    revert: (uniqueFileId, load, error) => {
            
            console.log(uniqueFileId);
            
            axios.delete('/api/upload', { data: { filename: uniqueFileId } } );

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
            url: '/api/upload',
            data: formData,
            cancelToken: source.token,
            onUploadProgress: (e) => {
                // updating progress indicator
                progress(e.lengthComputable, e.loaded, e.total)
            }
        }).then(response => {
            // passing the file id to FilePond
            console.log(response.data);
            reactObject.setState({fileUniqueId3: response.data});
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

const toolbar = {
  options: ['embedded','inline', 'blockType', 'list', 'textAlign', 'link', 'emoji', 'history'],
  inline: {
    inDropdown: false,
    className: undefined,
    component: undefined,
    dropdownClassName: undefined,
    options: ['bold', 'italic', 'underline', 'superscript', 'subscript'],
    bold: { className: undefined },
    italic: { className: undefined },
    underline: { className: undefined },
    strikethrough: { className: undefined },
    monospace: { className: undefined },
    superscript: { className: undefined },
    subscript: { className: undefined },
  },
  blockType: {
    inDropdown: true,
    options: ['Normal', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'Blockquote', 'Code'],
    className: undefined,
    component: undefined,
    dropdownClassName: undefined,
  },
  list: {
    inDropdown: false,
    className: undefined,
    component: undefined,
    dropdownClassName: undefined,
    options: ['unordered', 'ordered'],
    unordered: { className: undefined },
    ordered: { className: undefined }
  },
  textAlign: {
    inDropdown: false,
    className: undefined,
    component: undefined,
    dropdownClassName: undefined,
    options: ['left', 'center', 'right', 'justify'],
    left: {className: undefined },
    center: { className: undefined },
    right: { className: undefined },
    justify: { className: undefined },
  },
  colorPicker: {
    className: undefined,
    component: undefined,
    popupClassName: undefined,
    colors: ['rgb(97,189,109)', 'rgb(26,188,156)', 'rgb(84,172,210)', 'rgb(44,130,201)',
      'rgb(147,101,184)', 'rgb(71,85,119)', 'rgb(204,204,204)', 'rgb(65,168,95)', 'rgb(0,168,133)',
      'rgb(61,142,185)', 'rgb(41,105,176)', 'rgb(85,57,130)', 'rgb(40,50,78)', 'rgb(0,0,0)',
      'rgb(247,218,100)', 'rgb(251,160,38)', 'rgb(235,107,86)', 'rgb(226,80,65)', 'rgb(163,143,132)',
      'rgb(239,239,239)', 'rgb(255,255,255)', 'rgb(250,197,28)', 'rgb(243,121,52)', 'rgb(209,72,65)',
      'rgb(184,49,47)', 'rgb(124,112,107)', 'rgb(209,213,216)'],
  },
  link: {
    inDropdown: false,
    className: undefined,
    component: undefined,
    popupClassName: undefined,
    dropdownClassName: undefined,
    showOpenOptionOnHover: true,
    defaultTargetOption: '_self',
    options: ['link', 'unlink'],
    link: { className: undefined },
    unlink: { className: undefined },
    linkCallback: undefined
  },
  emoji: {
    className: undefined,
    component: undefined,
    popupClassName: undefined,
    emojis: [
      '😀', '😁', '😂', '😃', '😉', '😋', '😎', '😍', '😗', '🤗', '🤔', '😣', '😫', '😴', '😌', '🤓',
      '😛', '😜', '😠', '😇', '😷', '😈', '👻', '😺', '😸', '😹', '😻', '😼', '😽', '🙀', '🙈',
      '🙉', '🙊', '👼', '👮', '🕵', '💂', '👳', '🎅', '👸', '👰', '👲', '🙍', '🙇', '🚶', '🏃', '💃',
      '⛷', '🏂', '🏌', '🏄', '🚣', '🏊', '⛹', '🏋', '🚴', '👫', '💪', '👈', '👉', '👉', '👆', '🖕',
      '👇', '🖖', '🤘', '🖐', '👌', '👍', '👎', '✊', '👊', '👏', '🙌', '🙏', '🐵', '🐶', '🐇', '🐥',
      '🐸', '🐌', '🐛', '🐜', '🐝', '🍉', '🍄', '🍔', '🍤', '🍨', '🍪', '🎂', '🍰', '🍾', '🍷', '🍸',
      '🍺', '🌍', '🚑', '⏰', '🌙', '🌝', '🌞', '⭐', '🌟', '🌠', '🌨', '🌩', '⛄', '🔥', '🎄', '🎈',
      '🎉', '🎊', '🎁', '🎗', '🏀', '🏈', '🎲', '🔇', '🔈', '📣', '🔔', '🎵', '🎷', '💰', '🖊', '📅',
      '✅', '❎', '💯',
    ],
  },
  embedded: {
    className: undefined,
    component: undefined,
    popupClassName: undefined,
    embedCallback: undefined,
    defaultSize: {
      height: '315',
      width: '560',
    },
  },
  image: {
    className: undefined,
    component: undefined,
    popupClassName: undefined,
    urlEnabled: true,
    uploadEnabled: true,
    alignmentEnabled: true,
    uploadCallback: undefined,
    previewImage: false,
    inputAccept: 'image/gif,image/jpeg,image/jpg,image/png,image/svg',
    alt: { present: false, mandatory: false },
    defaultSize: {
      height: 'auto',
      width: 'auto',
    },
  },
  remove: { className: undefined, component: undefined },
  history: {
    inDropdown: false,
    className: undefined,
    component: undefined,
    dropdownClassName: undefined,
    options: ['undo', 'redo'],
    undo: { className: undefined },
    redo: { className: undefined },
  }
};                
                   
export default class Write extends Component {
	constructor(props){
		super(props);

		this.state={
			summary: '',
			title: '',
			tags: [],
			files: [],
      files2: [],
      files3: [],
			fileUniqueId:'',
      fileUniqueId2:'',
      fileUniqueId3:'',
			forClass:false,
			forExpo:false,
			forSpace:false,
			public: true,
			classnum: '',
			classdept: '',
			editorState: EditorState.createEmpty(),
			editorHTML:'',
            validForm: true,
			publish: true
		};

		this.onSubmit = this.onSubmit.bind(this);
		this.onSummaryChange = this.onSummaryChange.bind(this);
		this.onTitleChange = this.onTitleChange.bind(this);
		this.onTagAdd = this.onTagAdd.bind(this);
        this.onTagDelete = this.onTagDelete.bind(this);
		this.onTagInputChange = this.onTagInputChange.bind(this);
		this.handleInit = this.handleInit.bind(this);
		this.onForClassChange = this.onForClassChange.bind(this);
		this.onForExpoChange = this.onForExpoChange.bind(this);
		this.onForSpaceChange = this.onForSpaceChange.bind(this);
		this.onPrivateChange = this.onPrivateChange.bind(this);
		this.onClassDeptChange = this.onClassDeptChange.bind(this);
		this.onClassNumChange = this.onClassNumChange.bind(this);
		this.onEditorChange = this.onEditorChange.bind(this);

	}

	componentDidMount(){
		reactObject = this;
        this.props.updateCurrentTab('write');
	}

	onSubmit(e){
        //** add step to check if user has filled out required fields (ie title state, etc are not null)**
		e.preventDefault();

        if (this.state.summary && this.state.title && this.state.tags.length > 0 && this.state.fileUniqueId){

        		let curTime = new Date();
        		const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'June', 'July', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'];

        		const newPost = {
        			post_data:{
        				summary: this.state.summary,
        				title: this.state.title,
        				time: curTime,
        				public: this.state.public,
        				publish:this.state.publish,
        				tags: this.state.tags,
        				user_display_name: this.props.currentUser.displayName,
        				user_id: this.props.currentUser.uid,
        				for_class:this.state.forClass,
        				for_expo:this.state.forExpo,
        				for_space:this.state.forSpace,
        				classnum: this.state.classnum,
        				classdept: this.state.classdept,
        				editor_html:this.state.editorHTML
        			},
        			img_data:{
        				fileID: this.state.fileUniqueId,
                fileID2: this.state.fileUniqueId2,
                fileID3: this.state.fileUniqueId3
        			}
        		};


        		axios.post('/api/add', newPost)
                    .then(res =>{ 
                        console.log(res.data);
                        window.location.replace("/project/"+res.data.project_id);
                    });

                // axios.post('http://localhost:4000/capstoneprototype/save', this.state.fileUniqueId)
                //     .then(res => console.log(res.data));

        }

        else{
            this.setState({validForm:false});
        }

	}

	onSummaryChange(e){
		this.setState({
			summary: e.target.value
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

	onTagAdd(tagid,tagcolor){
        let tagJSON = {
            tag_id: tagid,
            tag_color: tagcolor
        };
        axios.post('/api/tag', tagJSON)
            .then( response => {
                console.log(response);
                let tagArray = this.state.tags;
                tagArray.push( tagid );
                this.setState({ 
                    tags: tagArray 
                });
            });
	}

    onTagDelete(tagid){
        let tagIndex = this.state.tags.indexOf(tagid);
        let tags_copy = this.state.tags;
        tags_copy.splice(tagIndex, 1);
        this.setState({tags:tags_copy});
    }

	handleInit() {
	    console.log("FilePond instance has initialised", this.pond);
	}

	onForClassChange(e){
		console.log(e.target);
		this.setState({forClass:e.target.checked});
		if (!e.target.checked){
			this.setState({classdept:''});
			this.setState({classnum:''});
		}
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
		this.setState({editorHTML:draftToHtml(convertToRaw(this.state.editorState.getCurrentContent()))});
	}

	onForExpoChange(e){
		console.log(e.target);
		this.setState({forExpo:e.target.checked});
	}

	onForSpaceChange(e){
		console.log(e.target);
		this.setState({forSpace:e.target.checked});
	}

	onPrivateChange(e){
		console.log(e.target);
		this.setState({public:!e.target.checked});
	}




    render() {
        return (
        	<div> 
        	{this.props.isLoggedIn ?
            <div className = 'content-container'>
                <div >
                <h4 className = "add-title">Add a Project</h4>
                <form onSubmit={this.onSubmit} id = "addProjectForm" style = {{"marginBottom": "200px"}} encType="multipart/form-data">
                	<div class = "form-title form-group-one-line">
	                	<label className= "required"> Title </label>
	                	<input type = "text" name = 'title' value = {this.state.title} onChange = {this.onTitleChange} className = "form-control" />
	                </div>
	                <div class = "form-summary form-group-one-line">
                		<label className= "required"> Summary </label>
                		<textarea name = 'summary' maxlength="100" value = {this.state.summary} onChange = {this.onSummaryChange} className = 'form-control' />
                	</div>
                  <div class = "form-main-photo">
                    <label className= "required"> Main Photo </label>
                    <FilePond
                        ref={ref => (this.pond = ref)}
                        files={this.state.files}
                        allowMultiple={false}
                        allowImageCrop={true}
                        allowImageTransform={true}
                        allowImageResize={true}
                        imageResizeTargetWidth= {1000}
                        imageResizeMode= {'contain'}
                        imageTransformOutputMimeType = {'image/jpeg'}
                        imageTransformOutputQuality= {80}
                        imageResizeUpscale={false}
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
                    <label> Additional Photos (Max 2) </label>
                    <div style = {{display:'grid', gridTemplateColumns: '1fr 1fr', gridColumnGap:'15px'}}>
                      <FilePond
                          ref={ref => (this.pond = ref)}
                          files={this.state.files2}
                          allowMultiple={false}
                          allowImageCrop={true}
                          allowImageTransform={true}
                          allowImageResize={true}
                          imageResizeTargetWidth= {1000}
                          imageResizeMode= {'contain'}
                          imageTransformOutputMimeType = {'image/jpeg'}
                          imageTransformOutputQuality= {80}
                          imageResizeUpscale={false}
                          maxFiles={1}
                          server={serverConfig_2}
                          oninit={() => this.handleInit()}
                          onupdatefiles={fileItems => {
                            console.log(fileItems);
                            // Set currently active file objects to this.state
                                  this.setState({
                                          files2: fileItems.map(fileItem => fileItem.file)
                                  });
                          }}
                        />
                      <FilePond
                          ref={ref => (this.pond = ref)}
                          files={this.state.files3}
                          allowMultiple={false}
                          allowImageCrop={true}
                          allowImageTransform={true}
                          allowImageResize={true}
                          imageResizeTargetWidth= {1000}
                          imageResizeMode= {'contain'}
                          imageTransformOutputMimeType = {'image/jpeg'}
                          imageTransformOutputQuality= {80}
                          imageResizeUpscale={false}
                          maxFiles={1}
                          server={serverConfig_3}
                          oninit={() => this.handleInit()}
                          onupdatefiles={fileItems => {
                            console.log(fileItems);
                            // Set currently active file objects to this.state
                                  this.setState({
                                          files3: fileItems.map(fileItem => fileItem.file)
                                  });
                          }}
                        />
                      </div>
                  </div>

                  

                	<TagSearch onTagAdd = {this.onTagAdd} />

                	<div class = "form-tags-list" style = {{'marginBottom':'30px'}}>
	                	{this.state.tags.map(item => {
	                	 		return <Tag key={item} tag_id = {item} removable = {true} onTagDelete = {this.onTagDelete} />;
	                	})}
                	</div>
                  
                	

			        <div class = "form-description form-group-one-line">
	                <label> Project Description </label>
	             
	                <Editor
	                  toolbar = {toolbar}
    			          editorState={this.state.editorState}
    			          wrapperClassName="demo-wrapper"
    			          editorClassName="demo-editor"
    			          onEditorStateChange={this.onEditorChange}
    			        />

              </div>

              <div style = {{'display':'none'}} class = "form-class" >
                <div class = "form-group-one-line form-flex">
                      <input id = "forclass" type = "checkbox" name = 'forClass' checked = {this.state.forClass} onChange = {this.onForClassChange} />
                      <label for = "forclass"> This project was for a class </label>
                </div>
                    {this.state.forClass && 
                      <div class = "form-chooseclass form-group-one-line">
                        <label> Class </label>
                        <div style = {{"display": "flex", "width":"100%"}}>
                          <input type = "text" placeholder = "atls" name = 'class-dept' value = {this.state.classdept} onChange = {this.onClassDeptChange} class = "form-control"/>
                          <input type = "text" placeholder = "1000" name = 'class-number' value = {this.state.classnumber} onChange = {this.onClassNumChange} class = "form-control"/>
                        </div>
                      </div>
                    }
              </div>

              <div style = {{'display':'none'}} className = 'form-checkboxes'>
	                <div class = "form-forexpo form-group-one-line form-flex">
                		<input id = "forexpo" type = "checkbox" name = 'forExpo' checked = {this.state.forExpo} onChange = {this.onForExpoChange} />
                		<label for = "forexpo"> Submit this project for Atlas Expo consideration </label>
                	</div>

                	<div class = "form-forspace form-group-one-line form-flex">
                		<input id = "forspace" type = "checkbox" name = 'forSpace' checked = {this.state.forSpace} onChange = {this.onForSpaceChange} />
                		<label for = "forspace"> I would like space in Atlas to exhibit this project </label>
                	</div>

	                <div class = "form-private form-group-one-line form-flex">
                		<input id = "private" type = "checkbox" name = 'private' checked = {!this.state.public} onChange = {this.onPrivateChange} />
                		<label for = "private"> Make this project private </label>
                	</div>

              </div>

              {!this.state.validForm && <div className = "form-error">Please fill out required fields.</div>}

                	<button style = {{'visibility':'hidden'}} className = 'btn form-save' type = 'submit'>Save</button>
                	<button className = 'btn form-post' type = 'submit'>Post</button>
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