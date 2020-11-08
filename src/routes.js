import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';

import Home from './components/Home/Home.component';

import LogIn from './components/LogIn/LogIn.component';
import SignUp from './components/SignUp/SignUp.component';

import Notification from './components/Notification/Notification.component';

import CreateObject from './components/CreateObject/CreateObject.component';
import FdObject from './components/FdObject/FdObject.component';
import RedirectToObject from './components/RedirectToObject/RedirectToObject.component';

import Feed from './components/Profile/Feed/Feed.component';
import Posts from './components/Profile/Feed/Posts.component';
import RedirectToProfile from './components/RedirectToProfile/RedirectToProfile.component';


import NonSignInFeed from './components/ProfileNonSignedIn/NonSignedInFeed.component';
// import Posts from './components/Profile/Posts.component';
// import RedirectToProfile from './components/RedirectToProfile/RedirectToProfile.component';

import Queima from './components/Profile/Queima/Queima.component';
import Belle from './components/Profile/Belle/Belle.component'; 

import EditProfile from './components/EditProfile/EditProfile.component';

import Comment from './components/Comment/Comment.component';
import RedirectToComment from './components/RedirectToComment/RedirectToComment.component';

import Promote from './components/Promote/Promote.component';

export default function Routes() {
    return(
        <Router basename="/">
            <Route path="/" exact component={Home} />
            <Route path="/log_in" component={LogIn} />
            <Route path="/sign_up" component={SignUp} />

            <Route path="/notifications" component={Notification} />

            <Route path="/create_object" component={CreateObject} />
            <Route path="/object/:nickname" component={FdObject} />
            <Route path="/redirect_to_object/:nickname" component={RedirectToObject} />

            {
                (localStorage.getItem('e'))
                ?
                (
                    <Route path="/profile/:username" exact component={Feed} />
                )
                :
                (
                    <Route path="/profile/:username" exact component={NonSignInFeed} />
                )
            }

            <Route path="/post/:id" exact component={Posts} />
            <Route path="/redirect_to_profile/:nickname" component={RedirectToProfile} />

            <Route path="/profile/:username/queima" component={Queima} />
            <Route path="/profile/:username/belle" component={Belle} />

            <Route path="/edit_profile" component={EditProfile} />

            <Route path="/comment/:id" component={Comment} />
            <Route path="/redirect_to_comment/:id" component={RedirectToComment} />

            <Route path="/promote_post/:id" component={Promote} />
        </Router>
    );
}
