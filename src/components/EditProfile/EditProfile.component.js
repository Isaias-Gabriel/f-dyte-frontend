import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

import IsLogged from '../IsLogged/IsLogged.component';
import GoHome from '../GoHome/GoHome.component';
import LogOut from '../LogOut/LogOut.component';

import './EditProfileStyles.css';

require('dotenv/config');

export default class EditProfile extends Component {
    constructor(props) {
        super(props);

        this.canUpdateInfo = this.canUpdateInfo.bind(this);

        this.handleChange = this.handleChange.bind(this);
        this.handleChangeProfilePicture = this.handleChangeProfilePicture.bind(this);
        this.onChangeUsername = this.onChangeUsername.bind(this);

        this.submitProfile = this.submitProfile.bind(this);
        this.submitProfilePicture = this.submitProfilePicture.bind(this);

        this.state = {
            evaluator: {
                name: '',
                username: '',
                email: '',
            },

            profilePictureFile: {},

            originalName: '',
            originalUsername: '',
            originalEmail: '',

            usernameStatus: '',
        }
    }

    componentDidMount() {
        const formInfo = { sessionId: localStorage.getItem('e') }

        document.getElementById("dt-submit-button").disabled = true;

        axios.post(process.env.REACT_APP_SERVER_ADDRESS + '/complete_evaluator_info_by_session_id', formInfo)
            .then(response => {
                this.setState({
                    evaluator: response.data,

                    originalName: response.data.name,
                    originalUsername: response.data.username,
                    originalEmail: response.data.email,
                }, () => {
                    
                    let preview = document.getElementById("media-preview-post");
                        
                    let image = new Image();
                    image.height = 47.3;
                    image.src = response.data.profilePictureUrl;
                    preview.appendChild(image);
                });
            })
            .catch(err => console.log(err));

    }

    canUpdateInfo() {
        const { name, username, email } = this.state.evaluator;
        const { originalName, originalUsername, originalEmail } = this.state;

        if(name === originalName && username === originalUsername && email === originalEmail) {
            document.getElementById("dt-submit-button").disabled = true;
        }

        else {
            document.getElementById("dt-submit-button").disabled = false;
        }
    }

    handleChange(e) {
        const tempEvaluator = this.state.evaluator;
        tempEvaluator[e.target.name] = e.target.value;
        this.setState({
            evaluator: tempEvaluator
        }, () => {
            this.canUpdateInfo()
        })
    }

    handleChangeProfilePicture = e => {
        const file = e.target.files[0];

        if(file) {
            const reader = new FileReader();

            reader.readAsDataURL(file);

            const preview = document.getElementById("media-preview-post");
            preview.innerHTML = "";

            reader.addEventListener("load", function () {
                
                const image = new Image();
                image.height = 47.3;
                image.src = this.result;
                preview.appendChild(image);

            }, false);

            this.setState({
                profilePictureFile: file,
            })

            document.getElementById("chng-profile-picture-button").disabled = false;
        }
    }

    onChangeUsername(e) {
        const tempEvaluator = this.state.evaluator;
        tempEvaluator[e.target.name] = e.target.value;
        this.setState({
            evaluator: tempEvaluator
        }, () => {
            const username = this.state.evaluator.username;

            if(!(username === this.state.originalUsername)) {

                const formInfo = { username: username }
                axios.post(process.env.REACT_APP_SERVER_ADDRESS + '/evaluator_username_in_use', formInfo).
                    then(response => {
                        //if the username is not available
                        if(response.data) {
                            this.setState({
                                usernameStatus: 'This username is not available'
                            }, () => {
                                document.getElementById("dt-submit-button").disabled = true;
                            })
                        }
                        //if the username is available
                        else {
                            this.setState({
                                usernameStatus: ''
                            }, () => {
                                this.canUpdateInfo()
                                // document.getElementById("dt-submit-button").disabled = false;
                            })
                        }
                    })
                    .catch(err => console.log(err));
            }

            else{
                document.getElementById("dt-submit-button").disabled = true;
            }
                
        });
    }

    submitProfile(e) {
        e.preventDefault();

        let { name, username, email } = this.state.evaluator;
        const { originalName, originalUsername, originalEmail } = this.state;

        if(name === originalName) {
            name = undefined;
        }

        if(username === originalUsername) {
            username = undefined;
        }
        
        if(email === originalEmail) {
            email = undefined;
        }

        const formInfo = {
            originalUsername: this.state.originalUsername,
            name: name,
            username: username,
            email: email,
        }

        axios.post(process.env.REACT_APP_SERVER_ADDRESS + '/update_evaluator_info', formInfo)
            .then(response => {
                alert("updated")
                document.getElementById("dt-submit-button").disabled = true;

                this.setState({
                    evaluator: response.data,

                    originalProfilePictureFile: response.data.profilePictureFile,

                    originalName: response.data.name,
                    originalUsername: response.data.username,
                    originalEmail: response.data.email,
                })
            })
            .catch(err => console.log(err));

    }

    submitProfilePicture(e) {
        e.preventDefault();

        const fileData = new FormData();

        fileData.append("files", this.state.profilePictureFile);
        fileData.append("originalUsername", this.state.originalUsername);

        axios.post(process.env.REACT_APP_SERVER_ADDRESS + '/update_evaluator_profile_picture', fileData, {
            headers: {
                'content-type': 'multipart/form-data'
            }
        })
            .then(response => {
                alert("profile picture updated")
                document.getElementById("chng-profile-picture-button").disabled = true;

                const preview = document.getElementById("media-preview-post");
                preview.innerHTML = '';
                        
                const image = new Image();
                image.height = 47.3;
                image.src = response.data;
                preview.appendChild(image);
            })
            .catch(err => console.log(err));
    }

    render() {
        const { name, username, email } = this.state.evaluator;

        return(
            <div id="edit-profile-container">
                <IsLogged/>
                <GoHome/>

                <Link to={"/profile/" + this.state.originalUsername}>
                    <button>
                        My profile
                    </button>
                </Link>

                <LogOut/>

                <form onSubmit={this.submitProfilePicture} encType="multipart/form-data">
                    <div>
                        <label htmlFor="profile-picture">
                            Profile picture
                        </label>

                        <div id="media-preview-post">

                        </div>

                        <label htmlFor="profile-picture" id="profile-picture-label">
                            +
                        </label>

                        <input 
                            type="file"
                            id="profile-picture"
                            className="profile-input-file"
                            
                            accept=".jpeg,.pjpeg,.png,.gif,.jpg"
                            
                            onChange={this.handleChangeProfilePicture}
                        />
                    </div>

                    <button id="chng-profile-picture-button" disabled type="submit">
                        Change profile picture
                    </button>
                </form>

                <form onSubmit={this.submitProfile}>

                    <input
                        type="text"
                        name="name"

                        placeholder="name"
                        value={name}
                        onChange={this.handleChange}
                    />

                    <div>
                        <input 
                            type="text" 
                            name="username"
                            
                            placeholder="username"
                            value={username}
                            onChange={this.onChangeUsername}
                        />
                        <span>
                            { this.state.usernameStatus }
                        </span>
                    </div>

                    <input
                        type="email"
                        name="email"

                        placeholder="email"
                        value={email}
                        onChange={this.handleChange}
                    />

                    <button type="submit" id="dt-submit-button">
                        Save
                    </button>
                </form>
            </div>
        )
    }
}