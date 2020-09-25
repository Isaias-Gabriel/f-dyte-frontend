import React, { Component } from 'react';
import { Link, Redirect } from 'react-router-dom';
import axios from 'axios';
import { w3cwebsocket as W3CWebSocket } from 'websocket';

import logoImg from '../../assets/temp_logo.gif';

import './styles.css';

require('dotenv/config');

export default class Home extends Component {
    constructor(props) {
        super(props);

        this.handleChange = this.handleChange.bind(this);
        this.onSubmit = this.onSubmit.bind(this);

        this.state = {
            email: '',
            password: '',
            logged: null,
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
            email: this.state.email,
            password: this.state.password   
        }

        axios.post(process.env.REACT_APP_SERVER_ADDRESS + '/log_in', formInfo)
            .then(async res => {
                console.log(res.data);
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

                    this.setState({
                        logged: '/'
                    });
                }

                else{
                    alert(res.data)
                }
            })
            .catch(err => console.log(err));
    }

    render() {
        const { email, password } = this.state;

        if(localStorage.getItem(localStorage.getItem('e')) || this.state.logged) {
            return <Redirect to="/" />
        }
        return(
            <div id="log-in-container">
                <div id="main-log-in-section">
                    <section className="header">
                        <img src={logoImg} alt="logo"/>
                        <h1>The ***** social network</h1>
                    </section>

                    <section className="login-form">
                        <form id="user-password" onSubmit={this.onSubmit}>

                            <input 
                                type="text"
                                name="email"

                                placeholder="Email, phone number or user name"
                                value={email}
                                onChange={this.handleChange}
                            />
                            <input 
                                type="password"
                                name="password"

                                placeholder="Password"
                                value={password}
                                onChange={this.handleChange}
                            />

                            <button type="submit">Log in</button>
                        </form>
                    </section>

                    <p>
                        Don’t have an account? Let’s solve this!
                        <span> </span>

                        <Link className="sign-up-link" to="/sign_up">
                            Sign up
                        </Link>
                    </p>
                </div>
            </div>
        )
    }
}