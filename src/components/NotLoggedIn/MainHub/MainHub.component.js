import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import axios from 'axios';

import Home from '../Home/Home.component';
import ForYou from '../ForYou/ForYou.component';

import LogIn from '../LogIn/LogIn.component';
import SignUp from '../SignUp/SignUp.component';

import Notification from '../Notification/Notification.component';

import CreateObject from '../CreateObject/CreateObject.component';
import FdObject from '../FdObject/FdObject.component';
import RedirectToObject from '../RedirectToObject/RedirectToObject.component';

import Feed from '../Profile/Feed/Feed.component';
import Posts from '../Profile/Feed/Posts.component';
import RedirectToProfile from '../RedirectToProfile/RedirectToProfile.component';

// import Posts from './components/Profile/Posts.component';
// import RedirectToProfile from './components/RedirectToProfile/RedirectToProfile.component';

import Queima from '../Profile/Queima/Queima.component';
import Belle from '../Profile/Belle/Belle.component'; 

import EditProfile from '../EditProfile/EditProfile.component';

import Comment from '../Comment/Comment.component';
import RedirectToComment from '../RedirectToComment/RedirectToComment.component';

import Promote from '../Promote/Promote.component';

require('dotenv/config');

export default class MainHub extends Component {
    constructor(props) {
        super(props);

        this.state = {
            
        }
    }

    componentDidMount() {
        console.log(this.props);
    }
    
    render() {

        if(localStorage.getItem('e')) {
            if(this.props.match.path === '/profile/:username') {
                return(
                    <Feed
                        match={this.props.match}
                    />
                )
            }
        }

        return (
            <div>
                M A I N    H U B
            </div>
        )
    }
}