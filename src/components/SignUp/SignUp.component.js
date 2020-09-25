import React, { Component } from 'react';
import { Link, Redirect } from 'react-router-dom';
import axios from 'axios';
import { w3cwebsocket as W3CWebSocket } from 'websocket';

import './styles.css';

import logoImg from '../../assets/temp_logo.gif';

require('dotenv/config');

export default class SignUp extends Component {

    constructor(props) {
        super(props);

        this.handleChange = this.handleChange.bind(this);

        this.onChangeEmail = this.onChangeEmail.bind(this);
        this.onChangeUsername = this.onChangeUsername.bind(this);
        this.onChangePassword = this.onChangePassword.bind(this);

        this.onSubmit = this.onSubmit.bind(this);
        this.verify = this.verify.bind(this);

        this.verificationInput = React.createRef();
        this.messageDiv = React.createRef();

        this.state = {
            email: '',
            password: '',
            username: '',

            acceptableCharacters: [ 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 
                'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v',
                'w', 'x', 'y', 'z', '0', '1', '2', '3', '4', '5', '6', '7', '8',
                '9', '_' ],

            emailStatus: '',
            usernameStatus: '',

            usernameIsAcceptable: '',

            emailAvailable: false,
            usernameAvailable: false,

            userDataSubmitted: false,
            confirmationCode: null,

            rate: 0,
            logged: '/',
        }
    }

    componentDidMount() {
        document.getElementById("sgnp-submit-button").disabled = true;
    }

    handleChange = e => {
        this.setState({
            [ e.target.name ]: e.target.value
        })
    }

    onChangeEmail(e) {
        this.setState({
            [ e.target.name ]: e.target.value
        }, () => {
            const formInfo = { email: this.state.email }
            axios.post(process.env.REACT_APP_SERVER_ADDRESS + '/email_in_use', formInfo)
                .then(response => {
                    //if the email is not available
                    if(response.data) {
                        this.setState({
                            emailStatus: 'This email is not available',
                            emailAvailable: false,
                        }, () => {
                            document.getElementById("sgnp-submit-button").disabled = true;
                        })
                    }
                    //if the email and the username are available
                    else {
                        this.setState({
                            emailStatus: '',
                            emailAvailable: true,
                        }, () => {
                            if(this.state.usernameAvailable) {
                                document.getElementById("sgnp-submit-button").disabled = false;
                            }
                        })
                    }
                })
                .catch(err => console.log(err));
        });
    }

    onChangeUsername(e) {
        let hasUnacceptableValue = false;

        for(let character of e.target.value) {
            if(!(this.state.acceptableCharacters.includes(character))) {
                hasUnacceptableValue = true;
            }
        }
        
        if(hasUnacceptableValue) {
            this.setState({
                [ e.target.name ]: e.target.value,
                usernameIsAcceptable: 'The username should contain only lowercase english letters, numbers or underscores ( _ )'
            })
        }

        else {
            this.setState({
                [ e.target.name ]: e.target.value,
                usernameIsAcceptable: '',
            }, () => {
                const formInfo = { username: this.state.username }
                axios.post(process.env.REACT_APP_SERVER_ADDRESS + '/evaluator_username_in_use', formInfo)
                    .then(response => {
                        //if the username is not available
                        if(response.data) {
                            this.setState({
                                usernameStatus: 'This username is not available',
                                usernameAvailable: false,
                            }, () => {
                                document.getElementById("sgnp-submit-button").disabled = true;
                            })
                        }
                        //if the email and the username are available
                        else {
                            this.setState({
                                usernameStatus: '',
                                usernameAvailable: true,
                            }, () => {
                                if(this.state.emailAvailable) {
                                    document.getElementById("sgnp-submit-button").disabled = false;
                                }
                            })
                        }
                    })
                    .catch(err => console.log(err));
            });
        }
    }

    onChangePassword = e => {
        this.setState({
            [ e.target.name ]: e.target.value
        }, () => {
            if(this.state.password.length < 6) {
                this.setState({
                    passwordStatus: 'The password must have more than 5 characters'
                }, () => {
                    document.getElementById("sgnp-submit-button").disabled = true;
                })
            }

            else {
                this.setState({
                    passwordStatus: ''
                }, () => {
                    document.getElementById("sgnp-submit-button").disabled = false;
                })
            }
        });
    }

    onSubmit(e) {
        e.preventDefault();

        axios.post(process.env.REACT_APP_SERVER_ADDRESS + '/confirm_email', {
            email: this.state.email,
        })
            .then(response => {
                this.setState({
                    userDataSubmitted: true,
                    confirmationCode: response.data.confirmationCode,
                })
            })
            .catch(err => console.log(err));
    }

    verify(e) {
        e.preventDefault();

        const { confirmationCode } = this.state;
        const typedConfirmationCode = this.verificationInput.current.value;

        if(confirmationCode === typedConfirmationCode) {
            const evaluator = {
                email: this.state.email,
                password: this.state.password,
                username: this.state.username,
                rate: this.state.rate / 1000000,
            }
    
            axios.post(process.env.REACT_APP_SERVER_ADDRESS + '/sign_up', evaluator)
                .then(res => {
    
                    const client = new W3CWebSocket('ws://127.0.0.1:8000/');
    
                    client.onopen = () => {
                        client.send(JSON.stringify({
                            type: 'userConnection',
                            sessionId: res.data.sessionId,
                        }))
                        console.log('Websocket client - user connected');
                    };
    
                    //const cipher = crypto.createCipher('aes256', res.data.sessionId);
                    //cipher.update(this.state.username);
                    //const sst = cipher.final('hex').toString();
    
                    localStorage.setItem("e", res.data.sessionId);
                    localStorage.setItem(res.data.sessionId, res.data.sessionId);
                    //localStorage.setItem('sst', sst);
    
                    this.setState({
                        logged: '/',
                    }, () => {
                        return <Redirect to={this.state.logged} />;
                    })
                })
                .catch(err => console.log(err));
        }
        else {
            this.messageDiv.current.innerText = "The verification code you typed in is wrong. Check your email '-'."
        }
    }
    
    render() {
        if(localStorage.getItem(localStorage.getItem('e'))) {
            return <Redirect to={this.state.logged} />;
        }
        
        const { email, password, username, emailStatus,
            usernameStatus, passwordStatus, usernameIsAcceptable,
            rate, userDataSubmitted } = this.state;


        if(userDataSubmitted) {
            return(
                <div className="page-container">
                    <div className="sign-up-container">
                        <div>
                            <p>
                                A verification code was sent to your email account
                            </p>
                            
                            <p>
                                Type the verification code bellow:
                            </p>

                            <div ref={this.messageDiv}>
                            </div>

                            <form onSubmit={this.verify}>
                                <input
                                    type="text"
                                    ref={this.verificationInput}
                                />

                                <button type="submit">
                                    Verify
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            )
        }

        return (
            <div className="page-container">
                <div className="sign-up-container">
                    <section className="header">
                        <img src={logoImg} alt="logo" />

                        <h1>The ***** social network</h1>
                    </section>

                    <section className="sign-up-form">
                        <form id="user-password" onSubmit={this.onSubmit}> 

                            <p>Thought you were going to fill a bunch of forms?</p>

                            <div>
                                <input 
                                    type="email" 
                                    placeholder="Email or phone number"
                                    name="email"

                                    value={email}
                                    onChange={this.onChangeEmail}
                                />

                                <span>
                                    { emailStatus }
                                </span>
                            </div>

                            <div>
                                <input 
                                    type="text" 
                                    placeholder="username"
                                    name="username"

                                    value={username}
                                    onChange={this.onChangeUsername}
                                />

                                <span>
                                    { usernameIsAcceptable }
                                </span>

                                <span>
                                    { usernameStatus }
                                </span>
                            </div>
                            
                            <div>
                                <input 
                                    type="password" 
                                    placeholder="Password"
                                    name="password"

                                    value={password}
                                    onChange={this.onChangePassword}
                                />

                                <span>
                                    { passwordStatus }
                                </span>
                            </div>

                            <label htmlFor="rate">Rate yourself:</label>

                            <input
                                type="range"
                                name="rate"

                                min="0"
                                max="5000000"

                                value={rate}
                                onChange={this.handleChange}

                                className="slider"
                            />

                            <p>Value: <span>{ Number(this.state.rate / 1000000).toFixed(2) }</span></p>

                            <button type="submit" id="sgnp-submit-button">Sign Up</button>
                        </form>
                    </section>

                    <p>
                        By signing up, you agree with all of our
                        <span> </span>

                        <Link className="sign-up-link" to="/">
                            Policies.
                        </Link>
                    </p>
                </div>
            </div>
        );
    }
}

//notes think of a validation that delievers an session id if the login is validated, instead of the user id