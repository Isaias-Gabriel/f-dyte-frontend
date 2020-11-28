import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

import Menu from '../Menu/Menu.component';

import { RiImageAddLine } from 'react-icons/ri';

import './styles.css';

require('dotenv/config');

export default class EditProfile extends Component {
    constructor(props) {
        super(props);

        this.canSubmit = this.canSubmit.bind(this);

        this.onChangeName = this.onChangeName.bind(this);
        this.handleChangeProfilePicture = this.handleChangeProfilePicture.bind(this);
        this.onChangeUsername = this.onChangeUsername.bind(this);
        this.onChangeEmail = this.onChangeEmail.bind(this);

        this.submitProfile = this.submitProfile.bind(this);
        this.submitProfilePicture = this.submitProfilePicture.bind(this);

        this.auxDiv = React.createRef();
        this.messageDiv = React.createRef();

        this.submitPictureButton = React.createRef();
        this.submitButton = React.createRef();

        this.state = {
            evaluator: {
            },
            
            name: '',
            username: '',
            email: '',

            profilePictureFile: {},

            profilePicturePreviewUrl: '',
            originalName: '',
            originalUsername: '',
            originalEmail: '',

            emailStatus: '',
            usernameStatus: '',

            usernameIsAcceptable: '',

            emailAvailable: true,
            usernameAvailable: true,

            message: '',

            acceptableCharacters: [ 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 
                'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v',
                'w', 'x', 'y', 'z', '0', '1', '2', '3', '4', '5', '6', '7', '8',
                '9', '_' ],
            acceptablePasswordCharacters: [ 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 
                'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v',
                'w', 'x', 'y', 'z', '0', '1', '2', '3', '4', '5', '6', '7', '8',
                '9', '_', ],
            
            staticText: {
                'pt-BR': {
                    updateProfilePicture: 'Atualizar foto de perfil',

                    namePlaceholder: 'Nome',
                    usernamePlaceholder: 'Nome de usuário',

                    save: 'Salvar',

                    messageProfile: 'Perfil atualizado',
                    messageProfilePicture: 'Foto de perfil atualizada',

                    usernameIsAcceptable: 'O nome de usuário deve conter apenas letras sem acento minúsculas, números ou sublinhados ( _ )',
                    usernameStatus: 'Este nome de usuário não está disponível',

                    emailStatus: 'Este e-mail não está disponível',
                },
                'en-US': {
                    updateProfilePicture: 'Update profile picture',

                    namePlaceholder: 'Name',
                    usernamePlaceholder: 'Username',

                    save: 'Save',

                    messageProfile: 'Profile updated',
                    messageProfilePicture: 'Profile picture updated',

                    usernameIsAcceptable: 'The username should contain only lowercase english letters, numbers or underscores ( _ )',
                    usernameStatus: 'This username is not available',

                    emailStatus: 'This email is not available',
                },
            },
        }
    }

    componentDidMount() {
        document.getElementsByTagName('title')[0].innerText = 'Edit profile - f Dyte';

        const formInfo = { sessionId: localStorage.getItem('e') }

        axios.post(process.env.REACT_APP_SERVER_ADDRESS + '/complete_evaluator_info_by_session_id', formInfo)
            .then(response => {

                this.setState({
                    evaluator: response.data,
                    
                    name: response.data.name,
                    username: response.data.username,
                    email: response.data.email,

                    profilePicturePreviewUrl: response.data.profilePictureUrl,
                    originalName: response.data.name,
                    originalUsername: response.data.username,
                    originalEmail: response.data.email,
                });
            })
            .catch(err => console.log(err));

        if(!localStorage.getItem('language')) {
            localStorage.setItem('language', navigator.language);
        }

    }

    canSubmit() {
        const { name, username, email } = this.state.evaluator;
        const { originalName, originalUsername, originalEmail } = this.state;

        if(name === originalName && username === originalUsername && email === originalEmail) {
            // document.getElementById("dt-submit-button").disabled = true;
        }

        else {
            // document.getElementById("dt-submit-button").disabled = false;
        }
    }

    onChangeName(e) {

        if(!(e.target.value.length)) {
            this.submitButton.current.disabled = true;
        }

        else {
            const {
                username,
                email,
    
                originalName,
                originalUsername,
                originalEmail,

                usernameAvailable,
                emailAvailable,
            } = this.state;
    
            if((e.target.value === originalName) &&
                (username === originalUsername) &&
                (email === originalEmail)) {
                this.submitButton.current.disabled = true;
            }
    
            else {
                if(usernameAvailable && emailAvailable) {
                    this.submitButton.current.disabled = false;
                }

                else {
                    this.submitButton.current.disabled = true;
                }
            }
        }

        this.setState({
            [ e.target.name ]: e.target.value
        })
    }

    handleChangeProfilePicture = e => {
        const file = e.target.files[0];

        if(file) {
            const reader = new FileReader();

            reader.readAsDataURL(file);

            reader.addEventListener("load", (e) => {
                this.setState({
                    profilePicturePreviewUrl: e.currentTarget.result,
                });
            }, false);

            this.setState({
                profilePictureFile: file,
            }, () => {
                this.submitPictureButton.current.disabled = false;
            })
            // document.getElementById("chng-profile-picture-button").disabled = false;
        }
    }

    onChangeUsername(e) {
        this.setState({
            [ e.target.name ]: e.target.value
        });

        if(!e.target.value.length) {
            this.submitButton.current.disabled = true;
        }

        else {
            const {
                name,
                email,
    
                originalName,
                originalUsername,
                originalEmail,

                usernameAvailable,
                emailAvailable,
            } = this.state;
    
            if((e.target.value === originalUsername) &&
                (name === originalName) &&
                (email === originalEmail)) {
                this.submitButton.current.disabled = true;
            }
    
            else {
                if(usernameAvailable && emailAvailable) {
                    this.submitButton.current.disabled = false;
                }

                else {
                    this.submitButton.current.disabled = true;
                }
            }
    
            let hasUnacceptableValue = false;
    
            for(let character of e.target.value) {
                if(!(this.state.acceptableCharacters.includes(character))) {
                    hasUnacceptableValue = true;
                }
            }
            
            if(hasUnacceptableValue) {
                const { staticText } = this.state;
                
                this.submitButton.current.disabled = true;
    
                this.setState({
                    usernameIsAcceptable: (
                        (staticText[localStorage.getItem('language')]) ?
                        staticText[localStorage.getItem('language')].usernameIsAcceptable
                        :
                        staticText['en-US'].usernameIsAcceptable
                    ),
                })
            }
    
            else {
                this.setState({
                    usernameIsAcceptable: '',
                });

                if(!(e.target.value === originalUsername)) {
                    const formInfo = { username: e.target.value };

                    axios.post(process.env.REACT_APP_SERVER_ADDRESS + '/evaluator_username_in_use', formInfo)
                        .then(response => {
                            //if the username is not available
                            if(response.data) {
                                const { staticText } = this.state;

                                this.setState({
                                    usernameStatus: (
                                        (staticText[localStorage.getItem('language')]) ?
                                        staticText[localStorage.getItem('language')].usernameStatus
                                        :
                                        staticText['en-US'].usernameStatus
                                    ),
                                    usernameAvailable: false,
                                }, () => {
                                    this.submitButton.current.disabled = true;
                                })
                            }
                            //if the email and the username are available
                            else {
                                this.setState({
                                    usernameStatus: '',
                                    usernameAvailable: true,
                                }, () => {
                                    if(this.state.emailAvailable) {
                                        this.submitButton.current.disabled = false;
                                    }
                                })
                            }
                        })
                        .catch(err => console.log(err));
                }
            }
        }
    }

    onChangeEmail(e) {

        this.setState({
            [ e.target.name ]: e.target.value
        });

        if(!e.target.value.length) {
            this.submitButton.current.disabled = true;
        }

        else {
            const {
                name,
                username,
    
                originalName,
                originalUsername,
                originalEmail,

                usernameAvailable,
                emailAvailable,
            } = this.state;
    
            if((e.target.value === originalEmail) &&
                (name === originalName) &&
                (username === originalUsername)) {
                this.submitButton.current.disabled = true;
            }
    
            else {
                if(usernameAvailable && emailAvailable) {
                    this.submitButton.current.disabled = false;
                }

                else {
                    this.submitButton.current.disabled = true;
                }
            }

            if(!(e.target.value === originalEmail)) {
                const formInfo = { email: e.target.value };

                axios.post(process.env.REACT_APP_SERVER_ADDRESS + '/email_in_use', formInfo)
                    .then(response => {
                        //if the email is not available
                        if(response.data) {
                            const { staticText } = this.state;

                            this.setState({
                                emailStatus: (
                                    (staticText[localStorage.getItem('language')]) ?
                                    staticText[localStorage.getItem('language')].emailStatus
                                    :
                                    staticText['en-US'].emailStatus
                                ),
                                emailAvailable: false,
                            }, () => {
                                this.submitButton.current.disabled = true;
                            })
                        }
                        //if the email and the username are available
                        else {
                            this.setState({
                                emailStatus: '',
                                emailAvailable: true,
                            }, () => {
                                if(this.state.usernameAvailable) {
                                    this.submitButton.current.disabled = false;
                                }
                            })
                        }
                    })
                    .catch(err => console.log(err));
            }
        }
        
    }

    submitProfile(e) {
        e.preventDefault();

        let { name, username, email } = this.state;
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
            name,
            username,
            email,
        }

        //  console.log('submitted');

        axios.post(process.env.REACT_APP_SERVER_ADDRESS + '/update_evaluator_info', formInfo)
            .then(response => {
                const { staticText } = this.state;

                this.setState({
                    evaluator: response.data,

                    originalName: response.data.name,
                    originalUsername: response.data.username,
                    originalEmail: response.data.email,

                    message: (
                        (staticText[localStorage.getItem('language')]) ?
                        staticText[localStorage.getItem('language')].messageProfile
                        :
                        staticText['en-US'].messageProfile
                    ),
                }, () => {
                    this.auxDiv.current.style.display = 'block';
                    this.messageDiv.current.style.display = 'flex';

                    setTimeout(() => {
                        this.auxDiv.current.style.display = 'none';
                        this.messageDiv.current.style.display = 'none';
                    }, 1700)
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
                const { staticText } = this.state;
                
                this.setState({
                    message: (
                        (staticText[localStorage.getItem('language')]) ?
                        staticText[localStorage.getItem('language')].messageProfilePicture
                        :
                        staticText['en-US'].messageProfilePicture
                    ),
                }, () => {
                    this.auxDiv.current.style.display = 'block';
                    this.messageDiv.current.style.display = 'flex';

                    setTimeout(() => {
                        this.auxDiv.current.style.display = 'none';
                        this.messageDiv.current.style.display = 'none';
                    }, 1700)
                })
            })
            .catch(err => console.log(err));
    }

    render() {
        const {
            name,
            username,
            email,

            usernameIsAcceptable,
            usernameStatus,

            emailStatus,

            profilePicturePreviewUrl,
            message,

            staticText,
        } = this.state;

        // console.log(this.state);

        return(
            <div className="edit-profile-outter-container">
                <Menu />

                <div className="edit-profile-inner-container">
                    <div
                        className="edit-profile-aux-div"
                        ref={this.auxDiv}
                    >

                    </div>

                    <div
                        className="edit-profile-success-message-outter-container"
                        ref={this.messageDiv}
                    >
                        { message }
                    </div>

                    <div className="edit-profile-profile-information-outter-container">
                        <div className="edit-profile-profile-picture-outter-container">
                            <div
                                className="edit-profile-profile-picture-container"
                                style={{
                                    backgroundImage: `url(${profilePicturePreviewUrl})`
                                }}
                            >
                            </div>

                            <div className="edit-profile-profile-picture-form-outter-container">
                                <form onSubmit={this.submitProfilePicture} encType="multipart/form-data">
                                    <label
                                        htmlFor="profile-picture-input"
                                        className="edit-profile-profile-picture-label"
                                    >
                                        <RiImageAddLine />
                                    </label>

                                    <input 
                                        type="file"
                                        id="profile-picture-input"
                                        className="edit-profile-profile-picture-input"
                                        
                                        //accept=".jpeg,.pjpeg,.png,.gif,.jpg"
                                        accept=".jpeg,.pjpeg,.png,.gif,.jpg"
                                        
                                        onChange={this.handleChangeProfilePicture}
                                    />

                                    <button
                                        className="edit-profile-submit-button"
                                        disabled
                                        type="submit"
                                        ref={this.submitPictureButton}
                                    >
                                        {
                                            (staticText[localStorage.getItem('language')]) ?
                                            staticText[localStorage.getItem('language')].updateProfilePicture
                                            :
                                            staticText['en-US'].updateProfilePicture
                                        }
                                    </button>
                                </form>
                            </div>
                        </div>
                            
                        <div className="edit-profile-textual-information-outter-container">
                            <form onSubmit={this.submitProfile}>
                                <div className="edit-profile-input-outter-container">
                                    <input
                                        type="text"
                                        name="name"

                                        minLength="1"
                                        maxLength="120"

                                        placeholder={
                                            (staticText[localStorage.getItem('language')]) ?
                                            staticText[localStorage.getItem('language')].namePlaceholder
                                            :
                                            staticText['en-US'].namePlaceholder
                                        }
                                        value={name}
                                        onChange={this.onChangeName}
                                    />
                                </div>

                                <div className="edit-profile-input-message-outter-container">
                                    <div>
                                    </div>
                                </div>

                                <div className="edit-profile-input-outter-container">
                                    <input 
                                        type="text" 
                                        name="username"

                                        minLength="1"
                                        maxLength="120"
                                        
                                        placeholder={
                                            (staticText[localStorage.getItem('language')]) ?
                                            staticText[localStorage.getItem('language')].usernamePlaceholder
                                            :
                                            staticText['en-US'].usernamePlaceholder
                                        }

                                        value={username}
                                        onChange={this.onChangeUsername}
                                    />
                                </div>

                                <div className="edit-profile-input-message-outter-container">
                                    <div>
                                        { usernameIsAcceptable }
                                    </div>

                                    <div>
                                        { usernameStatus }
                                    </div>
                                </div>

                                {/* <div className="edit-profile-input-outter-container">
                                    <input
                                        type="email"
                                        name="email"

                                        maxLength="300"

                                        placeholder="email"
                                        value={email}
                                        onChange={this.onChangeEmail}
                                    />
                                </div>

                                <div className="edit-profile-input-message-outter-container">
                                    <div>
                                        { emailStatus }
                                    </div>
                                </div> */}

                                <button
                                    className="edit-profile-submit-button"
                                    disabled
                                    type="submit"
                                    ref={this.submitButton}
                                >
                                    {
                                        (staticText[localStorage.getItem('language')]) ?
                                        staticText[localStorage.getItem('language')].save
                                        :
                                        staticText['en-US'].save
                                    }
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
            // <div id="edit-profile-container">
            //     <IsLogged/>
            //     <GoHome/>

            //     <Link to={"/profile/" + this.state.originalUsername}>
            //         <button>
            //             My profile
            //         </button>
            //     </Link>

            //     <LogOut/>

            //     <form onSubmit={this.submitProfilePicture} encType="multipart/form-data">
            //         <div>
            //             <label htmlFor="profile-picture">
            //                 Profile picture
            //             </label>

            //             <div id="media-preview-post">

            //             </div>

            //             <label htmlFor="profile-picture" id="profile-picture-label">
            //                 +
            //             </label>

            //             <input 
            //                 type="file"
            //                 id="profile-picture"
            //                 className="profile-input-file"
                            
            //                 accept=".jpeg,.pjpeg,.png,.gif,.jpg"
                            
            //                 onChange={this.handleChangeProfilePicture}
            //             />
            //         </div>

            //         <button id="chng-profile-picture-button" disabled type="submit">
            //             Change profile picture
            //         </button>
            //     </form>

            //     <form onSubmit={this.submitProfile}>

            //         <input
            //             type="text"
            //             name="name"

            //             placeholder="name"
            //             value={name}
            //             onChange={this.handleChange}
            //         />

            //         <div>
            //             <input 
            //                 type="text" 
            //                 name="username"
                            
            //                 placeholder="username"
            //                 value={username}
            //                 onChange={this.onChangeUsername}
            //             />
            //             <span>
            //                 { this.state.usernameStatus }
            //             </span>
            //         </div>

            //         <input
            //             type="email"
            //             name="email"

            //             placeholder="email"
            //             value={email}
            //             onChange={this.handleChange}
            //         />

            //         <button type="submit" id="dt-submit-button">
            //             Save
            //         </button>
            //     </form>
            // </div>
        )
    }
}