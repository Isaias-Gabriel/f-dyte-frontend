// rate for posts (posts, segredinhos, queimas, belles), comments and objects (only on the for you)import React, { Component } from 'react';
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

import LogOut from '../LogOut/LogOut.component';

import { AiOutlineMenu } from 'react-icons/ai';
import { AiFillHome } from 'react-icons/ai';
import { IoMdNotificationsOutline } from 'react-icons/io';
import { FiSearch } from 'react-icons/fi';
import { BsPerson } from 'react-icons/bs';
import { MdAdd } from 'react-icons/md';

import { MdClose } from 'react-icons/md';

import getUserUsername from '../../functions/getUserUsername';

import './styles.css';

require('dotenv/config');

export default class Menu extends Component {
    constructor(props) {
        super(props);

        this.onChange = this.onChange.bind(this);

        this.search = React.createRef();
        this.auxDiv = React.createRef();
        this.otherOptions = React.createRef();

        this.state = {
            userUsername: '',

            clicked: false,

            searchString: '',
            resultsFromSearch: [],
        }
    }

    async componentDidMount() {
        this.setState({
            userUsername: await getUserUsername(),
        })
    }

    onChange(e) {
        this.setState({
            searchString: e.target.value,
            resultsFromSearch: [],
        }, () => {
            axios.post(process.env.REACT_APP_SERVER_ADDRESS + '/search_for_object_or_evaluator', {
                searchFor: this.state.searchString
            })
            .then(response => {
                console.log(response.data);

                this.setState({
                    resultsFromSearch: response.data,
                })
            })
            .catch(err => console.log(err));
        })
        
        
    }

    render() {
        const {
            clicked,
            userUsername,
            searchString,
            resultsFromSearch
        } = this.state;

        if(!clicked) {
            return (
                <div className="menu-icon-not-clicked">
                    <AiOutlineMenu
                        onClick={() => {
                            this.setState({
                                clicked: true,
                            })
                        }}
                    />
                </div>
            )
        }

        else {
            return (
                <div className="menu-outter-container">
                    <div
                        className="search-auxiliary-div"
                        ref={this.auxDiv}
                        onClick={() => {
                            this.auxDiv.current.style.display = 'none';
                            this.search.current.style.display = 'none';
                        }}
                    >
                    </div>

                    <div className="search-outter-container" ref={this.search}>
                        <input
                            placeholder="search for objects or evaluators"

                            value={searchString}
                            onChange={this.onChange}
                        />

                        <div className="search-results-outter-container">
                            {
                                resultsFromSearch.map((result, index) => {
                                    if(result.type === 'evaluator') {
                                        return(
                                            <Link to={"/profile/" + result.username}>
                                                <div className="result-outter-container">
                                                    <div
                                                        className="result-image-outter-container"
                                                        style={{
                                                            backgroundImage: `url(${result.profilePictureUrl})`
                                                        }}    
                                                    >
                                                    </div>

                                                    <div className="result-name-and-nickname-username-outter-container">
                                                        <div className="result-name-outter-container">
                                                            { result.name }
                                                        </div>

                                                        <div className="result-nickname-username-outter-container">
                                                            @{ result.username }
                                                        </div>
                                                    </div>
                                                </div>
                                            </Link>
                                        )
                                    }

                                    else {
                                        return(
                                            <Link to={"/object/" + result.nickname}>
                                                <div className="result-outter-container">
                                                    <div
                                                        className="result-image-outter-container"
                                                        style={{
                                                            backgroundImage: `url(${result.urls[0][0]})`
                                                        }}    
                                                    >
                                                    </div>

                                                    <div className="result-name-and-nickname-username-outter-container">
                                                        <div className="result-name-outter-container">
                                                            { result.name }
                                                        </div>

                                                        <div className="result-nickname-username-outter-container">
                                                            /{ result.nickname }
                                                        </div>
                                                    </div>
                                                </div>
                                            </Link>
                                        )
                                    }
                                })
                            }
                        </div>
                    </div>

                    <div className="menu-other-options" ref={this.otherOptions}>
                        <div className="close-icon-outter-container">
                            <MdClose
                                onClick={() => {
                                    this.otherOptions.current.style.display = 'none';
                                }}
                            />
                        </div>

                        <Link to='/edit_profile'>
                            <div className="other-option-outter-container">
                                Edit profile
                            </div>
                        </Link>

                        <Link to='/create_object'>
                            <div className="other-option-outter-container">
                                Create object
                            </div>
                        </Link>

                        <div className="other-option-outter-container">
                            <LogOut />
                        </div>
                    </div>

                    <div className="menu-icons-outter-container">
                        <div className="icon-outter-container menu-icon">
                            <AiOutlineMenu
                                onClick={() => {
                                    this.setState({
                                        clicked: false,
                                    })
                                }}
                            />
                        </div>

                        <Link to="/">
                            <div className="icon-outter-container fy-icon">
                                <AiFillHome />
                            </div>
                        </Link>

                        {/* <IoMdNotificationsOutline  /> */}

                        <div className="icon-outter-container search-icon">
                            <FiSearch
                                onClick={() => {
                                    this.auxDiv.current.style.display = 'block';
                                    this.search.current.style.display = 'flex';
                                }}
                            />
                        </div>

                        {
                            (userUsername) &&
                            (
                                <Link to={"/profile/" + userUsername}>
                                    <div className="icon-outter-container profile-icon">
                                        <BsPerson />
                                    </div>
                                </Link>
                            )
                        }

                        <div className="icon-outter-container more-icon">
                            <MdAdd
                                onClick={() => {
                                    this.otherOptions.current.style.display = 'block';
                                }}
                            />
                        </div>
                    </div>
                </div>
            ) 
        }
    }
}