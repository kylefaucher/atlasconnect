import React, { Component } from 'react';
import './App.css';
import "bootstrap/dist/css/bootstrap.min.css";

import Post from './Post.js';
import UserCard from './UserCard.js';
import Tag from './Tag.js';

import { Link } from 'react-router-dom';
import axios from 'axios';

import Loader from 'halogenium/lib/DotLoader';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSearch } from '@fortawesome/free-solid-svg-icons';

export default class Feed extends Component {
	constructor(props){
		super(props);
		this.state = {
            messages: [],
            people: [],
            currentOpenProject: '',
            searchValue: '',
            loading: true,
            activeCategory: 'Featured',
            tag_suggestions: ''

        };

        this.search = this.search.bind(this);
        this.handleSearchChange = this.handleSearchChange.bind(this);
        this.displayDefaultFeed = this.displayDefaultFeed.bind(this);
        this.displayPeopleFeed = this.displayPeopleFeed.bind(this);
        this.handleCategoryChange = this.handleCategoryChange.bind(this);
        this.sendExistingTag = this.sendExistingTag.bind(this);

	}

    displayDefaultFeed(){
        axios.get('/api/featured')
            .then(response => {
                this.setState({ messages: response.data });
                this.setState({ people: [] });
                console.log(response.data);
                this.setState({loading:false});
            })
            .catch(function (error){
                console.log(error);
         });
    }

    displayAllFeed(){
        axios.get('/api')
            .then(response => {
                this.setState({ messages: response.data });
                this.setState({ people: [] });
                console.log(response.data);
                this.setState({loading:false});
            })
            .catch(function (error){
                console.log(error);
         });
    }

    displayPeopleFeed(){
        axios.get('/api/user')
            .then(response => {
                this.setState({ messages: [] });
                this.setState({ people: response.data });
                console.log(response.data);
                this.setState({loading:false});
            })
            .catch(function (error){
                console.log(error);
         });
    }

	componentDidMount() {
        this.displayDefaultFeed();
        this.props.updateCurrentTab('feed');
    }

    handleSearchChange(e){
        this.setState({searchValue:e.target.value});
        axios.get('/api/tag/search/' + e.target.value)
        .then( response => {
                this.setState({tag_suggestions:response.data});
                console.log(response);
            })
            .catch ( err => {
                console.log(err);
            })
    }

    search(){
        if (this.state.searchValue.length){
        axios.get('/api/search/'+this.state.searchValue)
            .then(response => {
                this.setState({ messages: response.data.posts });
                this.setState({ people: response.data.users });
                console.log(response.data);
            })
            .catch(function (error){
                console.log(error);
            });
        }
        else{
            this.displayAllFeed();
        }
        this.setState({tag_suggestions:''});
    }

    handleCategoryChange(e){
        this.setState({activeCategory:e.target.textContent});
        if (e.target.textContent == 'Search'){
            this.setState({ messages:'' });
            this.setState({ people: '' });
        }
        else if (e.target.textContent == 'All'){
            this.displayAllFeed();
        }
        else if (e.target.textContent == 'People'){
            this.displayPeopleFeed();
        }
        else{
            this.displayDefaultFeed();
        }
    }

    sendExistingTag(tagid, tagcolor){
        this.setState({searchValue:tagid},() => {
            this.search();
        });
        this.setState({tag_suggestions:''});
    }

    render() {
        return (
            <div className = 'content-container'>
            {this.state.loading? 
                <div className = "load-wrap"> <Loader color="#212529" size="72px" margin="4px" /> </div> :

                <div> 

                    <div className = "feed-nav"> <div className = "feed-nav-list"> <a onClick = {this.handleCategoryChange}>Featured</a> <a onClick = {this.handleCategoryChange}>All</a> <a onClick = {this.handleCategoryChange}>People</a> <a onClick = {this.handleCategoryChange}>Search</a> </div> 
                    <div className = {"feed-nav-underline feed-nav-underline-" + this.state.activeCategory}> </div> 
                    </div>
                { this.state.activeCategory == 'Search' && 
                    <div>
                    <div className = "form-group search-bar">
                        <div className = "searchIcon"> <FontAwesomeIcon icon={faSearch} /> </div>
                        <input id = "search-bar" onChange = {this.handleSearchChange}  value = {this.state.searchValue} type = "text" autocomplete = "off" placeholder = "search people or tags" />
                        <button onClick = {this.search} className = "btn form-control" type = "search"> Search </button>
                    </div>
                    {this.state.tag_suggestions.length>0 &&
                        <div style = {{"width":"100%"}} className = "tag-search-suggestions">
                            
                                {this.state.tag_suggestions.map(item => {
                                    return <Tag key={item.tag_id} tag_id = {item.tag_id} sendExistingTag = {this.sendExistingTag} />;
                                })}
                        </div>
                    }
                    </div>
                }

                {this.state.people.length > 0 && 
                    <span>
                    {this.state.activeCategory == 'Search' &&
                    <h3 className = "search-title"> People ({this.state.people.length})</h3>
                    }
                    <div className = 'peopleGrid'>
                         {this.state.people.map(item => {
                            return <UserCard key={item.user_id} uid = {item.user_id} />;
                         })}
                    </div>
                    </span>
                }

                {this.state.messages.length > 0 &&
                    <span>
                    {this.state.activeCategory == 'Search' && 
                    <h3 className = "search-title" > Projects ({this.state.messages.length})</h3>
                    }
                    <div className = 'postsGrid'>
                    	 {this.state.messages.map(item => {
                    	 	return <Post key={item._id} postJSON = {item} />;
                    	 })}
                    </div>
                    </span>
                       
                }

                </div> 
            }
            </div>
        )
    }
}