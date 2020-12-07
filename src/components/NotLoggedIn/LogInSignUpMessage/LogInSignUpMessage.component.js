import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

import { MdClose } from 'react-icons/md';

import './styles.css';

require('dotenv/config');

export default class LogInSignUpMessage extends Component {
    constructor(props) {
        super(props);

        this.deleteMessage = React.createRef();

        this.state = {

            staticText: {
                'pt-BR': {
                    logIn: 'Entrar',
                    signUp: 'Criar conta',

                    message: 'Você precisa entrar ou criar uma conta para fazer isso',
                },
                'en-US': {
                    logIn: 'Log in',
                    signUp: 'Sign up',

                    message: 'You need to log in ou sign up to do this',
                },
            }
        }
    }

    componentDidMount() {
        //console.log(this.props);
    }
    
    render() {
        const { 
            staticText,
        } = this.state;

        const {
            nickname
        } = this.props;

        return (
            <div className="log-in-sign-up-message-outter-container">
                <div
                    className="log-in-sign-up-message-aux-div"
                    onClick={() => {
                        this.props.setComponentToNull()
                    }}
                >
                </div>
                
                <div className="log-in-sign-up-message-inner-container">
                    <div className="log-in-sign-up-message-message">
                        {
                            (staticText[localStorage.getItem('language')]) ?
                            staticText[localStorage.getItem('language')].message
                            :
                            staticText['en-US'].message
                        }
                    </div>

                    <div className="log-in-sign-up-message-links-outter-container">
                        <Link to={`/log_in?redirect_to_=/object/${nickname}`}>
                            {
                                (staticText[localStorage.getItem('language')]) ?
                                staticText[localStorage.getItem('language')].logIn
                                :
                                staticText['en-US'].logIn
                            }
                        </Link>

                        <Link to={`/sign_up?redirect_to_=/object/${nickname}`}>
                            {
                                (staticText[localStorage.getItem('language')]) ?
                                staticText[localStorage.getItem('language')].signUp
                                :
                                staticText['en-US'].signUp
                            }
                        </Link>
                    </div>
                </div>
            </div>
        )
    }
}