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

export default class Feed extends Component {

    constructor(props) {
        super(props);

        this.handleChange = this.handleChange.bind(this);

        this.showRatingSlider = this.showRatingSlider.bind(this);

        this.showFollowButton = this.showFollowButton.bind(this);

        this.submitRate = this.submitRate.bind(this);

        this.updateRate = this.updateRate.bind(this);

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

                    // console.log(this.state.evaluator.rate.$numberDecimal);
                    // console.log(typeof this.state.evaluator.rate.$numberDecimal);

                    let temp_rate = this.state.evaluator.rate.$numberDecimal;
                    let rateIntegerPart, rateFirst2Decimals;

                    if(temp_rate.length === 1) {
                        rateIntegerPart = temp_rate;
                        rateFirst2Decimals = '00';
                    }
            
                    else if(temp_rate.length === 3) {
                        rateIntegerPart = temp_rate[0];
                        rateFirst2Decimals = temp_rate[2] + '0';
                    }
            
                    else if(temp_rate.length > 3) {
                        rateIntegerPart = temp_rate[0];
                        rateFirst2Decimals = temp_rate[2] + temp_rate[3];
                    }

                    this.setState({
                        rateIntegerPart,
                        rateFirst2Decimals,
                    })

                    const formInfo = {
                        profileUsername: this.props.match.params.username,
                        sessionId: localStorage.getItem('e'),
                    };

                    //if the user can rate the evaluator from the profile, it will return true, else, return false :v
                    axios.post(process.env.REACT_APP_SERVER_ADDRESS + '/user_can_rate_or_follow_user', formInfo)
                        .then(res => {
                            // console.log(res.data);

                            this.setState({
                                //if canBeRated is true then isRated is false '-' (yeah, confusing and clearly a mistake, I know)
                                isRated: !(res.data.canBeRated),
                                isFollowed: res.data.isFollowed,
                            })
                        })
                        .catch(err => console.log(err));

                })
            })
            .catch(err => {
                this.setState({
                    userFound: false,
                })
            });

    }

    componentWillUnmount() {
        document.getElementsByTagName('title')[0].innerText = 'f Dyte';
    }

    handleChange = e => {
        this.setState({
            [ e.target.name ]: e.target.value
        })
    }

    showRatingSlider() {
        if(this.state.isRated) {
            const { rateToSubmit } = this.state;

            return(
                <div className="slidecontainer">
                    <form id="rate-evaluator" onSubmit={this.submitRate}>
                        <input 
                            type="range"
                            name="rateToSubmit"

                            min="0"
                            max="5000000"
                            value={rateToSubmit}
                            onChange={this.handleChange}

                            id="myRange"
                            className="slider"
                        />

                        <p>Value: <span>{ Number(this.state.rateToSubmit / 1000000).toFixed(2) }</span></p>
                        <button type="submit">Rate { this.state.evaluator.name }</button>
                    </form>
                </div>
            )
        }
    }

    showFollowButton() {
        const { name, username } = this.state.evaluator;
        const { followersNumber, isFollowed } = this.state;


        if(username && name && (typeof isFollowed !== typeof undefined) && 
            (typeof followersNumber !== typeof undefined)) {
            return(
                <FollowUser
                    username={username}
                    name={name}
                    isFollowed={isFollowed}
                    followersNumber={followersNumber}
                />
            )
        }
        
    }
    
    submitRate(e) {
        e.preventDefault();

        let formInfo = {
            rateToSubmit: this.state.rateToSubmit / 1000000,
            evaluatedId: this.state.evaluator._id,
            sessionId: localStorage.getItem('e'),
        }

        axios.post(process.env.REACT_APP_SERVER_ADDRESS + '/update_user_rate', formInfo)
            .then(res => {
                alert('Rated!');
                
                this.setState({
                    evaluator: res.data,
                    isRated: false,
                })
            })
            .catch(err => console.log(err));
    }

    updateRate(rate) {

        let temp_rate = rate.$numberDecimal;
        let rateIntegerPart, rateFirst2Decimals;

        if(temp_rate.length === 1) {
            rateIntegerPart = temp_rate;
            rateFirst2Decimals = '00';
        }

        else if(temp_rate.length === 3) {
            rateIntegerPart = temp_rate[0];
            rateFirst2Decimals = temp_rate[2] + '0';
        }

        else if(temp_rate.length > 3) {
            rateIntegerPart = temp_rate[0];
            rateFirst2Decimals = temp_rate[2] + temp_rate[3];
        }

        const tempEvaluator = this.state.evaluator;
        tempEvaluator.rateNumber = tempEvaluator.rateNumber + 1;

        this.setState({
            rateIntegerPart,
            rateFirst2Decimals,
            evaluator: tempEvaluator,
            isRated: !(this.state.isRated),
        })
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
                isFollowed,
                rateIntegerPart,
                rateFirst2Decimals,

                isRated,
            } = this.state;

            // console.log(rateIntegerPart, rateFirst2Decimals);
            // console.log(this.state);

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
                                            (username && name && (typeof isFollowed !== typeof undefined) && 
                                                (typeof followersNumber !== typeof undefined)) &&
                                            (
                                                <FollowUser
                                                    username={username}
                                                    name={name}
                                                    isFollowed={isFollowed}
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
