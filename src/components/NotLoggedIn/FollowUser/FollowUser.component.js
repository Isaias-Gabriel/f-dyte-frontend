import React, { Component } from 'react';
import axios from 'axios';

import { BsPerson } from 'react-icons/bs';
import { BsPersonCheck } from 'react-icons/bs';

import './styles.css';

require('dotenv/config');

export default class FollowUser extends Component {
    constructor(props) {
        super(props);

        this.auxDiv = React.createRef();

        this.followMessageDiv = React.createRef();
        this.unfollowMessageDiv = React.createRef();

        this.state = {
            name: '',
            username: '',
            followersNumber: 0,

            staticText: {
                'pt-BR': {
                    follow: 'Seguir ',
                    unfollow: 'Deixar de seguir ',
    
                    yes: 'Sim',
                    no: 'Não',

                    followers: [
                        'seguidor',
                        'seguidores',
                    ]
                },
                'en-US': {
                    follow: 'Follow ',
                    unfollow: 'Unfollow ',

                    yes: 'Yes',
                    no: 'No',

                    followers: [
                        'follower',
                        'followers',
                    ]
                },
            },
        }
    }

    componentDidMount() {
        const { username, name, followersNumber } = this.props;

        // console.log(this.props);

        this.setState({
            name: name,
            username: username,
            followersNumber: followersNumber,
        })
    }
    
    render() {
        const {
            followersNumber,
            isFollowed,

            name,

            staticText,
        } = this.state;

        // console.log(this.props);

        //if the user is not being followed, it'll show the follow button
        
        return (
            <div className="follow-user-outter-container">
                <div 
                    className="follow-user-aux-div"
                    ref={this.auxDiv}

                    onClick={() => {
                        this.auxDiv.current.style.display = 'none';
                        this.followMessageDiv.current.style.display = 'none';
                    }}
                >
                </div>

                <div
                    className="follow-user-follow-message-outter-container"
                    ref={this.followMessageDiv}
                >
                    <div className="follow-user-follow-inner-container">
                        {
                            (staticText[localStorage.getItem('language')]) ?
                            staticText[localStorage.getItem('language')].follow
                            :
                            staticText['en-US'].follow
                        }

                        <div>
                            { `${name}?` }
                        </div>
                    </div>

                    <div className="follow-user-follow-buttons-outter-container">
                        <button
                            className="follow-user-follow-button"
                            onClick={this.follow}
                        >
                            {
                                (staticText[localStorage.getItem('language')]) ?
                                staticText[localStorage.getItem('language')].yes
                                :
                                staticText['en-US'].yes
                            }
                        </button>

                        <button
                            className="follow-user-follow-button"
                            onClick={() => {
                                this.auxDiv.current.style.display = 'none';
                                this.followMessageDiv.current.style.display = 'none';
                            }}
                        >
                            {
                                (staticText[localStorage.getItem('language')]) ?
                                staticText[localStorage.getItem('language')].no
                                :
                                staticText['en-US'].no
                            }
                        </button>
                    </div>
                </div>

                <div className="follow-user-inner-container">
                    <BsPerson 
                        onClick={() => {
                            this.auxDiv.current.style.display = 'block';
                            this.followMessageDiv.current.style.display = 'flex';
                        }}
                    />

                    <span>
                        { 
                            `${followersNumber} ${
                                (followersNumber === 1)
                                ?
                                (
                                    (staticText[localStorage.getItem('language')]) ?
                                    staticText[localStorage.getItem('language')].followers[0]
                                    :
                                    staticText['en-US'].followers[0]
                                )
                                :
                                (
                                    (staticText[localStorage.getItem('language')]) ?
                                    staticText[localStorage.getItem('language')].followers[1]
                                    :
                                    staticText['en-US'].followers[1]
                                )
                            }`
                        }
                    </span>
                </div>
            </div>
        )
    }
}