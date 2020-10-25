import React, { Component } from 'react';
import { Link, Redirect } from 'react-router-dom';
import axios from 'axios';

import { FaRegCommentAlt } from 'react-icons/fa';
import { RiUserFollowLine } from 'react-icons/ri';
import { HiOutlineStar } from 'react-icons/hi';

import GoHome from '../../GoHome/GoHome.component';
import LogOut from '../../LogOut/LogOut.component';

import Posts from '../Posts.component';
import FollowUser from '../../FollowUser/FollowUser.component';

import NonSignedInPosts from '../../ProfileNonSignedIn/NonSignedInPosts.component';

import Notification from '../../Notification/Notification.component';

import './FeedStyles.css';

require('dotenv/config');

export default class Feed extends Component {

    constructor(props) {
        super(props);

        this.handleChange = this.handleChange.bind(this);

        this.showRatingSlider = this.showRatingSlider.bind(this);

        this.showFollowButton = this.showFollowButton.bind(this);

        this.submitRate = this.submitRate.bind(this);

        this.state = {
            evaluator: {
                rate: {}
            },
            rateToSubmit: 0,

            canBeRated: false,

            userFound: true,
        }
    }

    componentDidMount() {
        axios.get(process.env.REACT_APP_SERVER_ADDRESS + '/complete_evaluator_info/' + this.props.match.params.username)
            .then(response => {
                document.getElementsByTagName('title')[0].innerText = response.data.evaluator.name + ' - profile';
                
                this.setState({
                    evaluator: response.data.evaluator,
                    followersNumber: response.data.followersNumber,
                }, () => {
                    const formInfo = {
                        profileUsername: this.props.match.params.username,
                        sessionId: localStorage.getItem('e'),
                    };

                    //if the user can rate the evaluator from the profile, it will return true, else, return false :v
                    axios.post(process.env.REACT_APP_SERVER_ADDRESS + '/user_can_rate_or_follow_user', formInfo)
                        .then(res => {
                            this.setState({
                                canBeRated: res.data.canBeRated,
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
        if(this.state.canBeRated) {
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
                    canBeRated: false,
                })
            })
            .catch(err => console.log(err));
    }

    render() {
        const { userFound } = this.state;
        if(userFound) {
            const { _id: id, name, username, profilePictureUrl, rateNumber } = this.state.evaluator;
            const { followersNumber } = this.state;

            let temp_rate = parseFloat(this.state.evaluator.rate.$numberDecimal);
            let rateIntegerPart, rateFirst2Decimals;
            
            if(typeof temp_rate === typeof 5) {
                console.log(temp_rate);
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

            // console.log(rateIntegerPart, rateFirst2Decimals);
            console.log(this.state);

            return(
                    <div id="profile-feed-outter-container">
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
                                                { `/${username}` }
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
                                        <div className="profile-feed-main-icons">
                                            <HiOutlineStar />
                                        </div>

                                        <div className="profile-feed-main-icons">
                                            <RiUserFollowLine />

                                            <span>
                                                { `${followersNumber} followers` }
                                            </span>
                                        </div>
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

                            <div className="profile-feed-posts-outter-container">

                            </div>
                        </div>
                    </div>

                // <div id="profile-container">
                //     <GoHome/>
                //     <Notification />
                //     <LogOut/>

                //     <div>
                //         <h1>
                //             { name }
                //         </h1>
                        
                //         <p>
                //                 @{ username }
                //         </p>

                //         <span>
                //             Rate: { Number(rate.$numberDecimal).toFixed(2) }
                //         </span>
                        
                //         <p>
                //             Number of rates: { rateNumber }
                //         </p>
                //     </div>
                    
                //     {
                //         this.showRatingSlider()
                //     }

                //     {
                //         this.showFollowButton()
                //     }

                //     <Link to={"/profile/" + this.props.match.params.username + "/queima"}>
                //         Queima
                //     </Link>

                //     <Link to={"/profile/" + this.props.match.params.username + "/belle"}>
                //         Belle
                //     </Link>
                    
                //     <section>
                //         <div>
                //             <Posts
                //                 username={ this.props.match.params.username }
                //             />
                //         </div>
                //     </section>
                // </div>
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
