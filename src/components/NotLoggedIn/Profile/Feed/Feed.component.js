import React, { Component } from 'react';
import { Link, Redirect } from 'react-router-dom';
import axios from 'axios';

import { FaRegCommentAlt } from 'react-icons/fa';
import { RiUserFollowLine } from 'react-icons/ri';
import { HiOutlineStar } from 'react-icons/hi';

import Menu from '../../Menu/Menu.component';

import Posts from './Posts.component';
import FollowUser from '../../FollowUser/FollowUser.component';

import RateType2 from '../../RatingSlider/RateType2.component';

import './FeedStyles.css';

require('dotenv/config');

export default class NotLoggedInFeed extends Component {

    constructor(props) {
        super(props);

        this.state = {
            evaluator: {
                rate: {}
            },

            rateIntegerPart: '0',
            rateFirst2Decimals: '00',

            rateToSubmit: 0,

            isRated: false,

            userFound: true,
        }
    }

    componentDidMount() {
        axios.get(process.env.REACT_APP_SERVER_ADDRESS + '/complete_evaluator_info/' + this.props.match.params.username)
            .then(response => {
                document.getElementsByTagName('title')[0].innerText = response.data.evaluator.name + ' - profile - f Dyte';
                
                this.setState({
                    evaluator: response.data.evaluator,
                    followersNumber: response.data.followersNumber,
                }, () => {

                    let temp_rate = parseFloat(this.state.evaluator.rate.$numberDecimal);
                    let rateIntegerPart, rateFirst2Decimals;
                    
                    if(typeof temp_rate === typeof 5) {
                        if(temp_rate === 0) {
                            rateIntegerPart = '0';
                            rateFirst2Decimals = '00';
                        }

                        else if(temp_rate > 0 && temp_rate < 1) {
                            temp_rate = (parseFloat(temp_rate) * 100).toString();
                        
                            rateIntegerPart = '0';
                            rateFirst2Decimals = temp_rate[0] + temp_rate[1];
                        }

                        else {
                            temp_rate = (parseFloat(temp_rate) * 100).toString();
                        
                            rateIntegerPart = temp_rate[0];
                            rateFirst2Decimals = temp_rate[1] + temp_rate[2];
                        }
                    }

                    this.setState({
                        rateIntegerPart,
                        rateFirst2Decimals,
                    })

                    const formInfo = {
                        profileUsername: this.props.match.params.username,
                        sessionId: localStorage.getItem('e'),
                    };
                })
            })
            .catch(err => {
                this.setState({
                    userFound: false,
                })
            });

    }

    render() {
        const { userFound } = this.state;

        if(userFound) {
            const { _id: id,
                    name,
                    username,
                    profilePictureUrl,
                    rateNumber,
                } = this.state.evaluator;
            const {
                followersNumber,
                rateIntegerPart,
                rateFirst2Decimals,

                isRated,
            } = this.state;

            // console.log(rateIntegerPart, rateFirst2Decimals);
            //console.log(this.state);

            // console.log({isRatedFeed: isRated});

            return(
                    <div id="profile-feed-outter-container">
                        <Menu />
                        
                        <div id="profile-feed-inner-container">
                            <div className="profile-feed-user-information-outter-container">
                                <div id="profile-feed-media-header-and-rate-outter-container">
                                    <section id="profile-feed-media-outter-container">
                                        <div
                                            className="profile-feed-media-inner-container"
                                            style={{
                                                backgroundImage: `url(${profilePictureUrl})`
                                            }}
                                        >
                                        </div>
                                    </section>

                                    <section id="profile-feed-header-outter-container">
                                        <div>
                                            <p id="profile-feed-header-name">
                                                <b>
                                                    { name }
                                                </b>
                                            </p>

                                            <p id="profile-feed-header-nickname">
                                                { `@${username}` }
                                            </p>
                                        </div>
                                    </section>

                                    <section id="profile-feed-rate-outter-container">
                                        <span>
                                            <span id="profile-feed-rate-integer-part">
                                                { `${rateIntegerPart}` }
                                            </span>

                                            <span id="profile-feed-rate-decimal-part">
                                                { `.${rateFirst2Decimals}` }
                                            </span>
                                        </span>

                                        <span>
                                            { rateNumber }
                                        </span>
                                    </section>
                                </div>

                                <div className="profile-feed-main-content-outter-container">
                                    <div className="profile-feed-rate-and-follow-outter-container">
                                        <RateType2
                                            isRated={isRated}

                                            updateRate={this.updateRate}

                                            type={'evaluator'}
                                            id={id}
                                        />

                                        {
                                            (username && name  && (typeof followersNumber !== typeof undefined)) &&
                                            (
                                                <FollowUser
                                                    username={username}
                                                    name={name}
                                                    followersNumber={followersNumber}
                                                />
                                            )
                                        }

                                        {/* <FollowUser /> */}
                                    </div>

                                    <div className="profile-feed-queima-and-belle-links-outter-container">
                                        <Link 
                                            className="profile-feed-queima-link-outter-container"
                                            to={"/profile/" + this.props.match.params.username + "/queima"}
                                        >
                                            Queima
                                        </Link>

                                        <Link 
                                            className="profile-feed-belle-link-outter-container"
                                            to={"/profile/" + this.props.match.params.username + "/belle"}
                                        >
                                            Belle
                                        </Link>
                                    </div>
                                </div>
                            </div>

                            <div id="profile-feed-posts-outter-container">
                                <Posts
                                    username={ this.props.match.params.username }
                                />
                            </div>
                        </div>
                    </div>
            );
        }

        else {
            return(
                <div>
                    USER NOT FOUND '-'
                </div>
            )
        }
    }
}
