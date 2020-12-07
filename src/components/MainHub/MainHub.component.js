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

//components for not logged in users

import NotLoggedInHome from '../NotLoggedIn/Home/Home.component';
import NotLoggedInForYou from '../NotLoggedIn/ForYou/ForYou.component';

import NotLoggedInLogIn from '../NotLoggedIn/LogIn/LogIn.component';
import NotLoggedInSignUp from '../NotLoggedIn/SignUp/SignUp.component';

import NotLoggedInNotification from '../NotLoggedIn/Notification/Notification.component';

import NotLoggedInCreateObject from '../NotLoggedIn/CreateObject/CreateObject.component';
import NotLoggedInFdObject from '../NotLoggedIn/FdObject/FdObject.component';
import NotLoggedInRedirectToObject from '../NotLoggedIn/RedirectToObject/RedirectToObject.component';

import NotLoggedInFeed from '../NotLoggedIn/Profile/Feed/Feed.component';
import NotLoggedInPosts from '../NotLoggedIn/Profile/Feed/Posts.component';
import NotLoggedInRedirectToProfile from '../NotLoggedIn/RedirectToProfile/RedirectToProfile.component';

// import Posts from '../components/Profile/Posts.component';
// import RedirectToProfile from '../components/RedirectToProfile/RedirectToProfile.component';

import NotLoggedInQueima from '../NotLoggedIn/Profile/Queima/Queima.component';
import NotLoggedInBelle from '../NotLoggedIn/Profile/Belle/Belle.component'; 

import NotLoggedInEditProfile from '../NotLoggedIn/EditProfile/EditProfile.component';

import NotLoggedInComment from '../NotLoggedIn/Comment/Comment.component';
import NotLoggedInRedirectToComment from '../NotLoggedIn/RedirectToComment/RedirectToComment.component';

import NotLoggedInPromote from '../NotLoggedIn/Promote/Promote.component';

require('dotenv/config');

export default class MainHub extends Component {
    constructor(props) {
        super(props);

        this.state = {
            
        }
    }

    componentDidMount() {
        //console.log(this.props);
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

            else if(this.props.match.path === '/object/:nickname') {
                return(
                    <FdObject
                        match={this.props.match}
                    />
                )
            }
        }

        else {
            if(this.props.match.path === '/profile/:username') {
                return(
                    <NotLoggedInFeed
                        match={this.props.match}
                    />
                )
            }

            else if(this.props.match.path === '/object/:nickname') {
                return(
                    <NotLoggedInFdObject
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