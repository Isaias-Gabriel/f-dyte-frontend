import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import axios from 'axios';

require('dotenv/config');

export default class LogOut extends Component {
    constructor(props) {
        super(props);
        
        this.logOut = this.logOut.bind(this);

        this.state = {
            loggedOut: null,

            staticText: {
                'pt-BR': {
                    logOut: 'Sair',
                },
                'en-US': {
                    logOut: 'Log out',
                },
            }
        }
    }

    componentDidMount() {
        if(!localStorage.getItem('language')) {
            localStorage.setItem('language', navigator.language);
        }
    }

    logOut() {
        const formInfo = { sessionId: localStorage.getItem('e') }
    
        axios.post(process.env.REACT_APP_SERVER_ADDRESS + "/log_out/", formInfo)
            .then(() => {
                
                localStorage.clear();
    
                this.setState({
                    loggedOut: '/log_in'
                })
            })
            .catch(err => alert(err));
    }
    
    render() {

        const { staticText } = this.state;

        if(this.state.loggedOut) {
            return <Redirect to="/log_in" />;
        }

        return (
            <span onClick={this.logOut}>
                {
                    (staticText[localStorage.getItem('language')]) ?
                    staticText[localStorage.getItem('language')].logOut
                    :
                    staticText['en-US'].logOut
                }
            </span>
        )
    }
}