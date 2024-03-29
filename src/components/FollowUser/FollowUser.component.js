import React, { Component } from 'react';
import axios from 'axios';

import { BsPerson } from 'react-icons/bs';
import { BsPersonCheck } from 'react-icons/bs';

import './styles.css';

require('dotenv/config');

export default class FollowUser extends Component {
    constructor(props) {
        super(props);
        
        this.follow = this.follow.bind(this);
        this.unfollow = this.unfollow.bind(this);

        this.auxDiv = React.createRef();

        this.followMessageDiv = React.createRef();
        this.unfollowMessageDiv = React.createRef();

        this.state = {
            name: '',
            username: '',
            isFollowed: false,
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
        const { username, name, isFollowed, followersNumber } = this.props;

        this.setState({
            name: name,
            username: username,
            isFollowed: isFollowed,
            followersNumber: followersNumber,
        })
    }

    follow(e) {
        e.preventDefault();

        const formInfo = {
            username: this.props.username,
            sessionId: localStorage.getItem('e')
        };

        console.log('submitted');

        this.auxDiv.current.style.display = 'none';
        this.followMessageDiv.current.style.display = 'none';

        axios.post(process.env.REACT_APP_SERVER_ADDRESS + '/add_follower_to_evaluator', formInfo)
            .then(response => {
                if(response.data === this.props.username) {
                    const followersNumber = this.state.followersNumber + 1;
                    this.setState({
                        isFollowed: true,
                        followersNumber: followersNumber,
                    })
                }
            })
            .catch(err => console.log(err));
            
    }

    unfollow(e) {
        e.preventDefault();

        const formInfo = {
            username: this.props.username,
            sessionId: localStorage.getItem('e')
        };

        // console.log('submitted');

        this.auxDiv.current.style.display = 'none';
        this.followMessageDiv.current.style.display = 'none';

        axios.post(process.env.REACT_APP_SERVER_ADDRESS + '/remove_follower_from_evaluator', formInfo)
            .then(response => {
                if(response.data === this.props.username) {
                    const followersNumber = this.state.followersNumber - 1;
                    this.setState({
                        isFollowed: false,
                        followersNumber: followersNumber,
                    })
                }
            })
            .catch(err => console.log(err));
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
        if(!(isFollowed)) {
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

        else {
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
                                staticText[localStorage.getItem('language')].unfollow
                                :
                                staticText['en-US'].unfollow
                            }

                            <div>
                                { `${name}?` }
                            </div>
                        </div>

                        <div className="follow-user-follow-buttons-outter-container">
                            <button
                                className="follow-user-follow-button"
                                onClick={this.unfollow}
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
                        <BsPersonCheck
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
}