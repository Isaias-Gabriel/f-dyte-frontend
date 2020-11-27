// rate for posts (posts, segredinhos, queimas, belles), comments and objects (only on the for you)import React, { Component } from 'react';
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

import { AiOutlineMenu } from 'react-icons/ai';
import { AiFillHome } from 'react-icons/ai';
import { FiSearch } from 'react-icons/fi';
import { BsPerson } from 'react-icons/bs';
import { MdAdd } from 'react-icons/md';

import { MdClose } from 'react-icons/md';

import LogOut from '../LogOut/LogOut.component';
import Notification from '../Notification/Notification.component';

import getUserUsername from '../../functions/getUserUsername';

import './styles.css';

require('dotenv/config');

export default class Menu extends Component {
    constructor(props) {
        super(props);

        this.onChange = this.onChange.bind(this);
        this.onSelect = this.onSelect.bind(this);

        this.notClickedMenu = React.createRef();
        this.clickedMenu = React.createRef();

        this.search = React.createRef();
        this.searchInput = React.createRef();
        this.auxDiv = React.createRef();
        this.otherOptions = React.createRef();

        this.select = React.createRef();

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

        for(let option of document.getElementsByTagName('option')) {
            console.log();

            if(option.value === localStorage.getItem('language')) {
                option.selected = true;
            }
        }
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

    onSelect(e) {
        localStorage.setItem('language', e.target.value);

        this.select.current.disabled = true;
    }

    render() {
        const {
            userUsername,
            searchString,
            resultsFromSearch
        } = this.state;

        return(
            <div className="menu-outter-container">
                <div className="menu-icon-not-clicked" ref={this.notClickedMenu}>
                    <AiOutlineMenu
                        onClick={() => {
                            this.notClickedMenu.current.style.display = 'none';
                            this.clickedMenu.current.style.display = 'flex';
                        }}
                    />
                </div>

                <div
                    className="menu-clicked-outter-container"
                    ref={this.clickedMenu}
                >
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

                            ref={this.searchInput}
                        />

                        <div className="search-results-outter-container">
                            {
                                resultsFromSearch.map((result, index) => {
                                    if(result.type === 'evaluator') {
                                        return(
                                            <Link
                                                to={"/redirect_to_profile/" + result.username}
                                                key={index}
                                            >
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
                                            <Link
                                                to={"/redirect_to_object/" + result.nickname}
                                                key={index}
                                            >
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

                        <div className="other-option-outter-container language-option">
                            Language: 

                            <select onChange={this.onSelect} ref={this.select}>
                                <option value="en-US">
                                    english - english
                                </option>

                                <option value="pt-BR">
                                    portuguese - português
                                </option>
                            </select>
                        </div>

                        <div className="other-option-outter-container">
                            <LogOut />
                        </div>
                    </div>

                    <div className="menu-icons-outter-container">
                        <div className="icon-outter-container menu-icon">
                            <AiOutlineMenu
                                onClick={() => {
                                    this.notClickedMenu.current.style.display = 'flex';
                                    this.clickedMenu.current.style.display = 'none';
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
                                    this.searchInput.current.focus();
                                }}
                            />
                        </div>

                        {
                            (userUsername) &&
                            (
                                <Link to={"/redirect_to_profile/" + userUsername}>
                                    <div className="icon-outter-container profile-icon">
                                        <BsPerson />
                                    </div>
                                </Link>
                            )
                        }

                        <Notification />

                        <div className="icon-outter-container more-icon">
                            <MdAdd
                                onClick={() => {
                                    this.otherOptions.current.style.display = 'block';
                                }}
                            />
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}