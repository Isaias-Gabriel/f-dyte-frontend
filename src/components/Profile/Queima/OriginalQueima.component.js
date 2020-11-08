import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

import IsLogged from '../IsLogged/IsLogged.component';
import GoHome from '../GoHome/GoHome.component';
import LogOut from '../LogOut/LogOut.component';

import QueimaPosts from './QueimaPosts.component';
import FollowUser from '../FollowUser/FollowUser.component';

import './QueimaStyles.css';

require('dotenv/config');

export default class Queima extends Component {

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
        }
    }

    componentDidMount() {
        axios.get(process.env.REACT_APP_SERVER_ADDRESS + '/complete_evaluator_info/' + this.props.match.params.username)
            .then(response => {
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
        const { name, username, rate, rateNumber } = this.state.evaluator;
        
        return(
            <div id="profile-container">
                <IsLogged/>
                <GoHome/>
                <LogOut/>

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

                <Link to={"/profile/" + this.props.match.params.username}>
                    Feed
                </Link>

                <Link to={"/profile/" + this.props.match.params.username + "/belle"}>
                    Belle
                </Link>
                
                <section>
                    <div id="add-post">
                        <QueimaPosts
                            username={ this.props.match.params.username }
                        />  
                        
                    </div>
                </section>
            </div>
        );
    }
}
