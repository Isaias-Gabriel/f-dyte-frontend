import React, { Component } from 'react';
import { Link, Redirect } from 'react-router-dom';
import axios from 'axios';
import { w3cwebsocket as W3CWebSocket } from 'websocket';

import  dailyOrNightly from '../../../functions/dailyOrNightlyStyle';

import logoImg from '../../../assets/complete_daily_logo.svg';

import './styles.css';

require('dotenv/config');

export default class Home extends Component {
    constructor(props) {
        super(props);

        this.handleChange = this.handleChange.bind(this);
        this.onSubmit = this.onSubmit.bind(this);

        this.submitButton = React.createRef();

        this.state = {
            email: '',
            password: '',
            logged: null,
            currentStyle: null,

            staticText: {
                'pt-BR': {
                    fDyteLogo: 'A rede social *****',

                    emailOrUsernamePlaceholder: 'E-mail ou nome de usuário',
                    passwordPlaceholder: 'Senha',

                    logInButton: 'Entrar',

                    signUpMessage: [
                        'Não tem uma conta? Vamos resolver isso! ',
                        'Cadastre-se.'
                    ],

                    emailStatus: 'Este e-mail não está disponível',
                    usernameStatus: 'Este nome de usuário não está disponível',
                    passwordStatus: 'A senha deve ter ao menos 6 caracteres',
                },
                'en-US': {
                    fDyteLogo: 'The ***** social network',

                    emailOrUsernamePlaceholder: 'Email or username',
                    passwordPlaceholder: 'Password',

                    logInButton: 'Log in',

                    signUpMessage: [
                        'Don’t have an account? Let’s solve this! ',
                        'Sign up.'
                    ],

                    emailStatus: 'This email is not available',
                    usernameStatus: 'This username is not available',
                    passwordStatus: 'The password must have at least 6 characters',

                    usernameIsAcceptable: 'The username should contain only lowercase english letters, numbers or underscores ( _ )',
                    passwordIsAcceptable: 'The password should contain only lowercase english letters, numbers or underscores ( _ )',
                },
            },
        }
    }

    //'nightly'
    //'daily'

    componentDidMount() {
        // this.submitButton.current.disabled = true;
        // console.log(new Date().getHours().toString() + ':' + new Date().getMinutes().toString());

        this.setState({
            currentStyle: dailyOrNightly(),
        })

        if(!localStorage.getItem('language')) {
            localStorage.setItem('language', navigator.language);
        }
    }

    handleChange = e => {
        this.setState({
            [ e.target.name ]: e.target.value
        })
    }

    onSubmit(e) {
        e.preventDefault();

        const formInfo = {
            email: this.state.email.trim(),
            password: this.state.password.trim(),  
        }

        this.setState({
            email: this.state.email.trim(),
            password: this.state.password.trim(),
        })

        axios.post(process.env.REACT_APP_SERVER_ADDRESS + '/log_in', formInfo)
            .then(async res => {
                
                if(typeof res.data === typeof {}){

                    const client = new W3CWebSocket('ws://127.0.0.1:8000/');

                    client.onopen = () => {
                        client.send(JSON.stringify({
                            type: 'userConnection',
                            sessionId: res.data.sessionId,
                        }))
                        console.log('Websocket client - user connected');
                    };

                    localStorage.setItem(res.data.sessionId, res.data.sessionId);
                    localStorage.setItem('e', res.data.sessionId);
                    //localStorage.setItem('uu', res.data.username);

                    let url = '/';

                    if(this.props.url) {
                        const temp_url = this.props.url;
                        
                        if(temp_url.includes('/profile/')) {
                            url = '/redirect_to_profile/' + temp_url.substring(9, temp_url.length);
                        }
                        //url = this.props.url;
                    }

                    this.setState({
                        logged: url,
                    });
                }

                else{
                    alert(res.data)
                }
            })
            .catch(err => console.log(err));
    }

    render() {
        const { email, password, currentStyle, staticText } = this.state;

        if(localStorage.getItem(localStorage.getItem('e')) || this.state.logged) {
            return <Redirect to={this.state.logged} />
        }
        return(
            <div id={
                (currentStyle) ? currentStyle + "-log-in-outter-container" : "daily-log-in-outter-container"
            }>
                <div id={
                    (currentStyle) ? currentStyle + "-log-in-inner-container" : "daily-log-in-inner-container"
                }>
                    <div id="main-log-in-section">
                        <section className="logo-and-phrase-outter-container">
                            <div className="logo-outter-container">
                                <img src={logoImg} alt="logo"/>
                            </div>

                            <div>
                                <h1>
                                    {
                                        (staticText[localStorage.getItem('language')]) ?
                                        staticText[localStorage.getItem('language')].fDyteLogo
                                        :
                                        staticText['en-US'].fDyteLogo
                                    }
                                </h1>
                            </div>
                        </section>

                        <section className="login-form">
                            <form id="user-password" onSubmit={this.onSubmit}>
                                <div>
                                    <div className="log-in-input-outter-container">
                                        <input 
                                            type="text"
                                            name="email"

                                            minLength="1"
                                            maxLength="100"

                                            required

                                            placeholder={
                                                (staticText[localStorage.getItem('language')]) ?
                                                staticText[localStorage.getItem('language')].emailOrUsernamePlaceholder
                                                :
                                                staticText['en-US'].emailOrUsernamePlaceholder
                                            }

                                            value={email}
                                            onChange={this.handleChange}
                                        />
                                    </div>

                                    <div className="log-in-input-outter-container">
                                        <input
                                            type="password"
                                            name="password"

                                            minLength="6"
                                            maxLength="100"
                                            required

                                            placeholder={
                                                (staticText[localStorage.getItem('language')]) ?
                                                staticText[localStorage.getItem('language')].passwordPlaceholder
                                                :
                                                staticText['en-US'].passwordPlaceholder
                                            }

                                            value={password}
                                            onChange={this.handleChange}
                                        />
                                    </div>
                                </div>
                                
                                <div className="log-in-submit-button-outter-container">
                                    <button
                                        type="submit"
                                        ref={this.submitButton}
                                    >
                                        {
                                            (staticText[localStorage.getItem('language')]) ?
                                            staticText[localStorage.getItem('language')].logInButton
                                            :
                                            staticText['en-US'].logInButton
                                        }
                                    </button>
                                </div>
                            </form>
                        </section>

                        <div className="to-sign-up-paragraph-outter-container">
                            <Link className="sign-up-link" to="/sign_up">
                                <p>
                                    {
                                        (staticText[localStorage.getItem('language')]) ?
                                        staticText[localStorage.getItem('language')].signUpMessage[0]
                                        :
                                        staticText['en-US'].signUpMessage[0]
                                    }

                                    <span>
                                        {
                                            (staticText[localStorage.getItem('language')]) ?
                                            staticText[localStorage.getItem('language')].signUpMessage[1]
                                            :
                                            staticText['en-US'].signUpMessage[1]
                                        }
                                    </span>
                                </p>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}