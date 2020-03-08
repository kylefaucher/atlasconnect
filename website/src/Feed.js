import React, { Component } from 'react';
import './App.css';
import "bootstrap/dist/css/bootstrap.min.css";

import Post from './Post.js';

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
            currentOpenProject: '',
            searchValue: '',
            loading: true,
            activeCategory: 'Featured'
        };

        this.search = this.search.bind(this);
        this.handleSearchChange = this.handleSearchChange.bind(this);
        this.displayDefaultFeed = this.displayDefaultFeed.bind(this);
        this.handleCategoryChange = this.handleCategoryChange.bind(this);
	}

    displayDefaultFeed(){
        axios.get('http://localhost:4000/capstoneprototype/featured')
            .then(response => {
                this.setState({ messages: response.data });
                console.log(response.data);
                this.setState({loading:false});
            })
            .catch(function (error){
                console.log(error);
         });

        // axios.get('http://localhost:4000/capstoneprototype/images')
        //     .then(response => {
        //         this.setState({ images: response.data });
        //         console.log(response.data);
        //     })
        //     .catch(function (error){
        //         console.log(error);
        //  });
    }

    displayAllFeed(){
        axios.get('http://localhost:4000/capstoneprototype/')
            .then(response => {
                this.setState({ messages: response.data });
                console.log(response.data);
                this.setState({loading:false});
            })
            .catch(function (error){
                console.log(error);
         });
    }

	componentDidMount() {
        this.displayDefaultFeed();
    }

    handleSearchChange(e){
        this.setState({searchValue:e.target.value});
    }

    search(){
        if (this.state.searchValue.length){
        axios.get('http://localhost:4000/capstoneprototype/search/'+this.state.searchValue)
            .then(response => {
                this.setState({ messages: response.data });
                console.log(response.data);
            })
            .catch(function (error){
                console.log(error);
            });
        }
        else{
            this.displayAllFeed();
        }
    }

    handleCategoryChange(e){
        this.setState({activeCategory:e.target.textContent});
        if (e.target.textContent == 'Search'){
            this.setState({messages: ''});
        }
        else if (e.target.textContent == 'All'){
            this.displayAllFeed();
        }
        else{
            this.displayDefaultFeed();
        }
    }

    render() {
        return (
            <div className = 'content-container'>
            {this.state.loading? 
                <div className = "load-wrap"> <Loader color="#212529" size="72px" margin="4px" /> </div> :

                <div> 

                    <div className = "feed-nav"> <div className = "feed-nav-list"> <a onClick = {this.handleCategoryChange}>Featured</a> <a onClick = {this.handleCategoryChange}>All</a> <a onClick = {this.handleCategoryChange}>Search</a> </div> 
                    <div className = {"feed-nav-underline feed-nav-underline-" + this.state.activeCategory}> </div> 
                    </div>
                { this.state.activeCategory == 'Search' && 
                    <div className = "form-group search-bar">
                        <div className = "searchIcon"> <FontAwesomeIcon icon={faSearch} /> </div>
                        <input onChange = {this.handleSearchChange}  value = {this.state.searchValue} type = "text" placeholder = "search" className="form-control" />
                        <button onClick = {this.search} className = "btn btn-primary form-control" type = "search"> Search </button>
                    </div>
                }
                {this.state.messages.length ? 
                <div className = 'postsGrid'>
                	 {this.state.messages.map(item => {
                	 	return <Post key={item._id} postJSON = {item} />;
                	 })}
                </div>
                : <div> No projects match your search. </div> }

                </div> 
            }
            </div>
        )
    }
}