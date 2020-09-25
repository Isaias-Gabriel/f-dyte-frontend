import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { w3cwebsocket as W3CWebSocket } from 'websocket';

import ReactPlayer from 'react-player';

import IsLogged from '../IsLogged/IsLogged.component';
import GoHome from '../GoHome/GoHome.component';

import './styles.css';

require('dotenv/config');

const ShowMedia = props => {
    const url = props.url;

    if(url) {
        if(url.includes(".mp4") || url.includes(".3gp") || url.includes(".webm")) {
            return(
                <div>
                    <ReactPlayer
                        url={url}
                        height={"30vh"}
                        controls
                    />
                </div>
            )
        }
    
        else {
            return(
                <div>
                    <img src={url} alt="comment"/>
                </div>
            )
        }
    }

    else {
        return null;
    }
}

export default class Notification extends Component {
    constructor(props) {
        super(props);

        this.state = {
            clicked: false,

            notifications: [],

            nonReadNumber: 0,
        }
    }

    componentDidMount() {

        const client = new W3CWebSocket('ws://127.0.0.1:8000/');

        client.onopen = () => {
            client.send(JSON.stringify({
                type: 'notificationConnection',
                sessionId: localStorage.getItem('e'),
            }))
            console.log('Websocket client - notifications connected');
        };

        client.onmessage = (message) => {
            const dataFromServer = JSON.parse(message.data);
            console.log(dataFromServer);

            let temp_notifications = this.state.notifications;

            temp_notifications.unshift(dataFromServer.notification);

            this.setState({
                notifications: temp_notifications,
            }, () => {
                if(!(this.state.clicked)) {
                    this.setState({
                        nonReadNumber: this.state.nonReadNumber + 1,
                    })
                }
            })
        }

        const formInfo = { sessionId: localStorage.getItem('e') };

        axios.post(process.env.REACT_APP_SERVER_ADDRESS + '/get_notifications', formInfo)
            .then(response => {
                let counter = 0;

                for(let notification of response.data) {
                    if(!(notification.notificationRead)) {
                        if(this.props.match) {
                            notification.notificationRead = true
                        }
                        counter += 1;
                    }

                    else {
                        break
                    }
                }

                if(this.props.match) {
                    counter = 0;
                    this.setState({
                        clicked: true,
                    }, () => {
                        axios.post(process.env.REACT_APP_SERVER_ADDRESS + '/set_notifications_as_read', {
                            sessionId: localStorage.getItem('e'),
                        })
                    })
                }

                this.setState({
                    notifications: response.data,
                    nonReadNumber: counter
                })
            })
            .catch(err => console.log(err));
    }
    
    render() {
        const { clicked, nonReadNumber } = this.state;

        if(!(clicked)) {
            if(nonReadNumber) {
                return(
                    <Link to="/notifications">
                        <button>
                            notifications ({nonReadNumber})
                        </button>
                    </Link>
                )
            }
    
            else {
                return(
                    <Link to="/notifications">
                        <button>
                            notifications
                        </button>
                    </Link>
                )
            }
        }

        else {
            const { notifications } = this.state;

            return(
                <div id="notifications-page-container">
                    <IsLogged/>
                    <GoHome/>
                    <div>
                        {
                            notifications.map(notification => {
                                return(
                                    <div key={ notification._id } className="ghsdjie">
                                        <Link to={ notification.link }>
                                            <div>
                                                <div>
                                                    <img
                                                        src={ notification.userProfilePictureUrl }
                                                        className="notification-profile-picture"
                                                        alt="profile"
                                                    />
                                                </div>

                                                <div>
                                                    { notification.content.caption }
                                                </div>

                                                <div>
                                                    <div>
                                                        <p>
                                                            { notification.content.text }
                                                        </p>
                                                    </div>

                                                    <div>
                                                        <ShowMedia
                                                            url={ notification.content.url }
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </Link>
                                    </div>
                                )
                            })
                        }
                    </div>
                </div>
            )
        }
        
    }
}