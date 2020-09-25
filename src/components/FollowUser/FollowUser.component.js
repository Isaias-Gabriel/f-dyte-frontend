import React, { Component } from 'react';
import axios from 'axios';

require('dotenv/config');

export default class FollowUser extends Component {
    constructor(props) {
        super(props);
        
        this.submit = this.submit.bind(this);

        this.state = {
            name: '',
            username: '',
            isFollowed: false,
            followersNumber: 0,
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

    submit(e) {
        e.preventDefault();

        const formInfo = {
            username: this.props.username,
            sessionId: localStorage.getItem('e')
        };

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
    
    render() {
        const { followersNumber, isFollowed } = this.state;

        //if the user is not being followed, it'll show the follow button
        if(!(isFollowed)) {
            return (
                <div>
                    <button onClick={this.submit}>
                        Follow { this.props.name }
                    </button>
                    <p>
                        { followersNumber } followers
                    </p>
                </div>
                
            )
        }

        else {
            return (
                <div>
                    <p>
                        { followersNumber } followers
                    </p>
                </div>
            )
        }
    }
}