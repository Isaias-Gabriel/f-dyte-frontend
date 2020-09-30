import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

import LogIn from '../LogIn/LogIn.component';

import GoHome from '../GoHome/GoHome.component';

import FollowUser from '../FollowUser/FollowUser.component';

import NonSignedInPosts from './NonSignedInPosts.component';

import './NonSignedInStyles.css';

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

            showLogInModal: false,
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
            const { name, username, rate, rateNumber } = this.state.evaluator;
            const { showLogInModal } = this.state;
            
            return(
                <div id="profile-container">
                    <GoHome/>
                    <button onClick={
                        () => {
                            this.setState({
                                showLogInModal: true,
                            })
                        }
                    }>
                        Log in
                    </button>

                    {
                        (showLogInModal)
                        ?
                        (
                            <div className="log-in-modal-outter-container">
                                <div className="log-in-modal-message">
                                    <p>
                                        Log in or sign up 
                                        so you can rate, comment, post, 
                                        create objects ^^ and more °-°
                                    </p>
                                </div>
                                <div className="log-in-modal">
                                    <iframe src="/log_in">
                                    </iframe>
                                </div>

                                <div
                                    className="log-in-modal-aux-background-div"
                                    onClick={
                                        () => {
                                            this.setState({
                                                showLogInModal: false,
                                            })
                                        }
                                    }
                                >
                                </div>
                            </div>
                        )
                        :
                        (
                            ''
                        )
                    }

                    <div>
                        <h1>
                            { name }
                        </h1>
                        
                        <p>
                                @{ username }
                        </p>

                        <span>
                            Rate: { Number(rate.$numberDecimal).toFixed(2) }
                        </span>
                        
                        <p>
                            Number of rates: { rateNumber }
                        </p>
                    </div>
                    
                    {
                        this.showRatingSlider()
                    }

                    {
                        this.showFollowButton()
                    }

                    <Link to={"/profile/" + this.props.match.params.username + "/queima"}>
                        Queima
                    </Link>

                    <Link to={"/profile/" + this.props.match.params.username + "/belle"}>
                        Belle
                    </Link>
                    
                    <section>
                        <div>
                            <NonSignedInPosts
                                username={ this.props.match.params.username }
                            />
                        </div>
                    </section>
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
