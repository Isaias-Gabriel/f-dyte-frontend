import React, { Component } from 'react';
import { Link, Redirect } from 'react-router-dom';
import axios from 'axios';
import { w3cwebsocket as W3CWebSocket } from 'websocket';

import  dailyOrNightly from '../../functions/dailyOrNightlyStyle';

import './styles.css';

import logoImg from '../../assets/complete_daily_logo.svg';

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

        this.showPassword = this.showPassword.bind(this);

        this.verificationInput = React.createRef();
        this.messageDiv = React.createRef();

        this.passwordInput = React.createRef();
        this.passwordMessageDiv = React.createRef();

        this.state = {
            email: '',
            password: '',
            username: '',

            acceptableCharacters: [ 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 
                'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v',
                'w', 'x', 'y', 'z', '0', '1', '2', '3', '4', '5', '6', '7', '8',
                '9', '_' ],
            acceptablePasswordCharacters: [ 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 
                'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v',
                'w', 'x', 'y', 'z', '0', '1', '2', '3', '4', '5', '6', '7', '8',
                '9', '_', ],

            emailStatus: '',
            usernameStatus: '',

            usernameIsAcceptable: '',

            emailAvailable: false,
            usernameAvailable: false,

            userDataSubmitted: false,
            confirmationCode: null,

            rate: 0,
            logged: '/',

            currentStyle: 'daily',
        }
    }

    //'nightly'
    //'daily'

    componentDidMount() {
        document.getElementById("sgnp-submit-button").disabled = true;

        // this.setState({
        //     currentStyle: dailyOrNightly(),
        // })
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
            document.getElementById("sgnp-submit-button").disabled = true;

            this.setState({
                [ e.target.name ]: e.target.value,
                usernameIsAcceptable: 'The username should contain only lowercase english letters, numbers or underscores ( _ )'
            })
        }

        else {
            document.getElementById("sgnp-submit-button").disabled = false;
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
        let hasUnacceptableValue = false;

        for(let character of e.target.value) {
            if(!(this.state.acceptableCharacters.includes(character))) {
                hasUnacceptableValue = true;
            }
        }
        
        if(hasUnacceptableValue) {
            this.passwordMessageDiv.current.innerText = 'The password should contain' + 
                ' only lowercase english letters, numbers or underscores ( _ )';

            document.getElementById("sgnp-submit-button").disabled = true;

            this.setState({
                [ e.target.name ]: e.target.value,
            })
        }

        else {
            this.passwordMessageDiv.current.innerText = '';
            document.getElementById("sgnp-submit-button").disabled = false;

            this.setState({
                [ e.target.name ]: e.target.value
            }, () => {
                if(this.state.password.length < 6) {
                    this.setState({
                        passwordStatus: 'The password must have at least 6 characters'
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

        
    }

    onSubmit(e) {
        e.preventDefault();

        this.setState({
            email: this.state.email.trim(),
            password: this.state.password.trim(),
        })

        axios.post(process.env.REACT_APP_SERVER_ADDRESS + '/confirm_email', {
            email: this.state.email.trim(),
        })
            .then(response => {
                this.setState({
                    userDataSubmitted: true,
                    confirmationCode: response.data.confirmationCode,
                })
            })
            .catch(err => console.log(err));
    }

    showPassword() {
        if(this.passwordInput.current.type === "password") {
            this.passwordInput.current.type = "text";
        }

        else {
            this.passwordInput.current.type = "password";
        }
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
            rate, userDataSubmitted, currentStyle } = this.state;


        if(userDataSubmitted) {
            return(
                <div id={
                    (currentStyle) ? currentStyle + "-sign-up-outter-container" : "daily-sign-up-outter-container"
                }>
                    <div id={
                        (currentStyle) ? currentStyle + "-sign-up-inner-container" : "daily-sign-up-inner-container"
                    }>
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
            <div id={
                (currentStyle) ? currentStyle + "-sign-up-outter-container" : "daily-sign-up-outter-container"
            }>
                <div id={
                    (currentStyle) ? currentStyle + "-sign-up-inner-container" : "daily-sign-up-inner-container"
                }>
                    <div id="main-sign-up-section">
                        <section className="logo-and-phrase-outter-container">
                            <div className="logo-outter-container">
                                <img src={logoImg} alt="logo"/>
                            </div>

                            <div>
                                <h1>The ***** social network</h1>
                            </div>
                        </section>

                        <section className="sign-up-form">
                            <form id="user-password" onSubmit={this.onSubmit}> 

                                <p>Thought you were going to fill a bunch of forms?</p>

                                <div className="sign-up-input-outter-container">
                                    <input 
                                        type="email" 
                                        placeholder="Email"
                                        name="email"

                                        maxLength="1000"

                                        required

                                        value={email}
                                        onChange={this.onChangeEmail}
                                    />

                                    <span>
                                        { emailStatus }
                                    </span>
                                </div>

                                <div className="sign-up-input-outter-container">
                                    <input 
                                        type="text" 
                                        placeholder="username"
                                        name="username"

                                        minLength="1"
                                        maxLength="100"

                                        required

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
                                
                                <div className="sign-up-input-outter-container">
                                    <input 
                                        type="password" 
                                        placeholder="Password"
                                        name="password"

                                        minLength="6"
                                        maxLength="100"

                                        required

                                        ref={this.passwordInput}

                                        value={password}
                                        onChange={this.onChangePassword}
                                    /> 
                                    
                                    <span
                                        onClick={this.showPassword}
                                        className="show-password"
                                    >
                                        show password
                                    </span>

                                    <div ref={this.passwordMessageDiv}>

                                    </div>

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

                                    required

                                    value={rate}
                                    onChange={this.handleChange}

                                    className="slider"
                                />

                                <p>Value: <span>{ Number(this.state.rate / 1000000).toFixed(2) }</span></p>

                                <div className="sign-up-submit-button-outter-container">
                                    <button
                                        type="submit"
                                        id="sgnp-submit-button"
                                    >
                                        Sign Up
                                    </button>
                                </div>
                                
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
            </div>
        );
    }
}

//notes think of a validation that delievers an session id if the login is validated, instead of the user id