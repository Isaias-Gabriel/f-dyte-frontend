import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

import { RiUserFollowLine } from 'react-icons/ri';
import { HiOutlineStar } from 'react-icons/hi';

import Menu from '../../Menu/Menu.component';

import BellePosts from './BellePosts.component';
import FollowUser from '../../FollowUser/FollowUser.component';

import './BelleStyles.css';

require('dotenv/config');

export default class Belle extends Component {

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

            rateIntegerPart: '0',
            rateFirst2Decimals: '00',
        }
    }

    componentDidMount() {
        axios.get(process.env.REACT_APP_SERVER_ADDRESS + '/complete_evaluator_info/' + this.props.match.params.username)
            .then(response => {
                document.getElementsByTagName('title')[0].innerText = response.data.evaluator.name + ' - belle - f Dyte';

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
            .catch(err => console.log(err));

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
        const {
            name,
            username,
            rateNumber,
            profilePictureUrl
        } = this.state.evaluator;
        const { followersNumber, rateIntegerPart, rateFirst2Decimals, } = this.state;

        //console.log(this.state);

        return(
            <div className="profile-belle-outter-container">
                <Menu />
                <div className="profile-belle-inner-container">
                    <div className="profile-belle-header-and-icons-outter-container">
                        <div className="profile-belle-header">
                            <div
                                className="profile-belle-profile-picture-outter-container"
                                style={{
                                    backgroundImage: `url(${profilePictureUrl})`,
                                }}
                            >
                            </div>

                            <div className="profile-belle-name-username-rate-and-rate-number-outter-container">
                                <div className="profile-belle-name-and-rate-outter-container">
                                    <div className="profile-belle-name">
                                        <div>
                                            { name }
                                        </div>
                                    </div>

                                    <div className="profile-belle-rate">
                                        <span className="profile-belle-rate-integer-part">
                                            { `${rateIntegerPart}` }
                                        </span>

                                        <span className="profile-belle-rate-decimal-part">
                                            { `.${rateFirst2Decimals}` }
                                        </span>
                                    </div>
                                </div>

                                <div className="profile-belle-divisory-div">
                                </div>

                                <div className="profile-belle-username-and-rate-number-outter-container">
                                    <div className="profile-belle-username">
                                        {`@${username}`}
                                    </div>

                                    <div className="profile-belle-rate-number">
                                        { rateNumber }
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="profile-belle-icons-and-links-outter-container">
                            <div className="profile-belle-rate-and-follow-outter-container">
                                <div className="profile-belle-main-icons">
                                    <HiOutlineStar />
                                </div>

                                <div className="profile-belle-main-icons">
                                    <RiUserFollowLine />

                                    <span>
                                        { `${followersNumber} followers` }
                                    </span>
                                </div>
                            </div>

                            <div className="profile-belle-queima-and-belle-links-outter-container">
                                <Link 
                                    className="profile-belle-belle-link-outter-container"
                                    to={"/profile/" + this.props.match.params.username + "/queima"}
                                >
                                    Queima
                                </Link>

                                <Link 
                                    className="profile-belle-queima-link-outter-container"
                                    to={"/profile/" + this.props.match.params.username}
                                >
                                    Feed
                                </Link>
                            </div>
                        </div>
                    </div>
                    

                    <div className="profile-belle-display-belles-outter-container">
                        <div className="profile-belle-display-belles-inner-container">
                            <BellePosts
                                username={ this.props.match.params.username }
                            />
                        </div>
                    </div>
                </div>
            </div>

            // <div id="profile-container">
            //     <IsLogged/>
            //     <GoHome/>
            //     <LogOut/>

            //     <div>
            //         <h1>
            //             { name }
            //         </h1>
                    
            //         <p>
            //             @{ username }
            //         </p>

            //         <span>
            //             Rate: { Number( rate.$numberDecimal).toFixed(2) }
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

            //     <Link to={"/profile/" + this.props.match.params.username}>
            //         Feed
            //     </Link>

            //     <Link to={"/profile/" + this.props.match.params.username + "/queima"}>
            //         Queima
            //     </Link>
                
            //     <section>
            //         <div id="add-post">
            //             <BellePosts
            //                 username={ this.props.match.params.username }
            //             />  
                        
            //         </div>
            //     </section>
            // </div>
        );
    }
}
