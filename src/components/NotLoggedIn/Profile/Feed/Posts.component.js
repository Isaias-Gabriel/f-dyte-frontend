import React, { Component, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { w3cwebsocket as W3CWebSocket } from 'websocket';

import { BsThreeDots } from 'react-icons/bs';
import { HiOutlineDotsHorizontal } from 'react-icons/hi';
import { RiDeleteBin6Line } from 'react-icons/ri';

import { BsArrowUpShort } from 'react-icons/bs';

import { RiImageAddLine } from 'react-icons/ri';
import { MdClose } from 'react-icons/md';

import { FaRegCommentAlt } from 'react-icons/fa';
import { HiOutlineStar } from 'react-icons/hi';

import Linkify from 'react-linkify';

import ReturnReferenceAsLink from 
    '../../ReturnReferenceAsLink/ReturnReferenceAsLink.component';

import LogOut from '../../LogOut/LogOut.component';

import ModalsHub from '../../ModalsHub/ModalsHub.component';

import GoHome from '../../GoHome/GoHome.component';
import Notification from '../../Notification/Notification.component';

import ShowMedia from '../../ShowMedia/ShowMedia.component';

import RateType1 from '../../RatingSlider/RateType1.component';

import CommentOnPQBS from '../../Comment/CommentOnPQBS.component';

import loadingIcon from '../../../../assets/loading-infinity-icon.svg';

import './PostsStyles.css';

require('dotenv/config');

export default class NotLoggedInPosts extends Component {
    constructor(props) {
        super(props);

        this.setComponentToNull = this.setComponentToNull.bind(this);

        this.threeDotsButton = React.createRef();
        this.optionsDiv = React.createRef();
        this.auxBackgroundDiv = React.createRef();

        this.addPost = React.createRef();
        this.addPostAuxDiv = React.createRef();
        this.addPostTextarea = React.createRef();
        this.addPostFileInput = React.createRef();
        this.addPostSubmitButton = React.createRef();

        this.addSegredinho = React.createRef();
        this.addSegredinhoTextarea = React.createRef();
        this.addSegredinhoSubmitButton = React.createRef();

        this.state = {
            content: '',
            files: {},
            tempUrls: [],

            posts: [],
            postsLoaded: false,

            ratedPosts: [],

            post: {
                content: {
                    text: '',
                    urls: [],
                }
            },
            showPostComments: false,

            userUsername: '',

            uniqueImageIndex: 0,

            canSubmit: false,

            originalMessage: '',
            hiddenMessage: '',

            whichComponent: null,

            loaded: false,

            staticText: {
                'pt-BR': {
                    postButton: 'Postar',
                    yes: 'Sim',
                    no: 'Não',
                    segredinhoShow: 'mostrar texto',
                    segredinhoHideCompletely: 'esconder completamente',
                    segredinhoHideSelection: 'esconder seleção',
                    segredinhoHideRandomly: 'esconder aleatoriamente',
                    optionsDelete: 'Deletar',
                },
                'en-US': {
                    postButton: 'Post',
                    yes: 'Yes',
                    no: 'No',
                    segredinhoShow: 'show text',
                    segredinhoHideCompletely: 'hide completely',
                    segredinhoHideSelection: 'hide selection',
                    segredinhoHideRandomly: 'hide randomly',
                    optionsDelete: 'Delete',
                },
            },
        }
    }

    async componentDidMount() {

    const formInfo = {
        username: this.props.username,
    };

    axios.post(process.env.REACT_APP_SERVER_ADDRESS + '/get_all_posts', formInfo)
        .then(response => {
            this.setState({
                posts: response.data.posts,
                loaded: true,
            }, () => {
                this.state.posts.map(post => {
                    if(post.content.urls) {
                        this.setState({
                            [ post._id + 'uniqueImageIndex' ]: 0,
                        })
                    }
                })

            })

        })
        .catch(err => console.log(err));

        if(!localStorage.getItem('language')) {
            localStorage.setItem('language', navigator.language);
        }
        
    }

    setComponentToNull() {
        this.setState({
            whichComponent: null,
        })
    }

    render() {
        const {
            posts,
            loaded,
            staticText,
        } = this.state;
        const { username: visitedUsername } = this.props;

        // console.log(this.state);

        if(!loaded) {
            return(
                <div className="profile-posts-outter-container">
                    <div className="loading-icon-outter-container">
                        <img
                            src={loadingIcon}
                            alt="Loading"
                        />
                    </div>
                </div>
            )
        }

        return(
            <div id="profile-posts-outter-container">
                <div id="profile-posts-inner-container">
                    <div className="profile-posts-display-posts-outter-container">
                        <div className="profile-posts-display-posts-inner-container-1">
                            <div className="profile-posts-display-posts-inner-container-2">
                                {
                                    posts.map((post, index) => {
                                        return(
                                            <div
                                                key={index}
                                                className="profile-posts-display-single-post-outter-container"
                                            >
                                                <div className="profile-posts-display-single-post-inner-container">
                                                    <div className="profile-posts-display-single-post-header-outter-container">
                                                        <div
                                                            className="profile-posts-display-single-post-profile-picture-container"
                                                            style={{
                                                                backgroundImage: `url(${post.userProfilePictureUrl})`
                                                            }}
                                                        >
                                                        </div>

                                                        <div className="profile-posts-display-single-post-name-and-username-outter-container">
                                                            <div className="profile-posts-display-single-post-name-outter-container">
                                                                { post.userName }
                                                            </div>

                                                            <div className="profile-posts-display-single-post-username-outter-container">
                                                                @{ post.userUsername }
                                                            </div>
                                                        </div>
                                                    </div>
                                                    
                                                    {
                                                        post.content.text &&
                                                        (
                                                            <div className="profile-posts-display-single-post-content-outter-container">
                                                                { `${post.content.text}` }
                                                            </div>
                                                        )
                                                    }

                                                    {
                                                        post.content.urls.length ?
                                                        (
                                                            <div className="profile-posts-display-single-post-media-outter-container">
                                                                <div className="profile-posts-display-single-post-media-preview">
                                                                    <div className="profile-posts--display-single-post-media-preview-unique-image">
                                                                        {
                                                                            post.content.urls[ this.state[ post._id + 'uniqueImageIndex' ] ] && (
                                                                                <div
                                                                                    style={{
                                                                                        backgroundImage: `url(${post.content.urls[ this.state[ post._id + 'uniqueImageIndex' ] ]})`
                                                                                    }}
                                                                                >
                                                                                </div>
                                                                            )
                                                                        }
                                                                    </div>
                                                                    
                                                                    {
                                                                        post.content.urls.length > 1 &&
                                                                        (
                                                                            <div className="profile-posts-add-post-media-preview-all-images">
                                                                                {
                                                                                    post.content.urls.map((url, index) => {
                                                                                        return(
                                                                                            <div
                                                                                                key={index}
                                                                                                style={{
                                                                                                    backgroundImage: `url(${url})`
                                                                                                }}
                                                                                                onClick={() => {
                                                                                                    this.setState({
                                                                                                        [ post._id + 'uniqueImageIndex' ]: index,
                                                                                                    })
                                                                                                }}
                                                                                            >
                                                                                            </div>
                                                                                        )
                                                                                    })
                                                                                }
                                                                            </div>
                                                                        )
                                                                    }
                                                                </div>
                                                            </div>
                                                        )
                                                        :
                                                        ''
                                                    }

                                                    <div className="profile-posts-rate-and-comment-outter-container">
                                                        <RateType1
                                                            rate={post.rate.$numberDecimal}
                                                            rateNumber={post.rateNumber}
                                                            isRated={true}

                                                            type={post.type}
                                                            id={post._id}
                                                        />

                                                        <div className="profile-posts-main-icon">
                                                            <FaRegCommentAlt
                                                                onClick={() => {
                                                                    this.setState({
                                                                        whichComponent: 'comment',
                                                                        componentProps: {
                                                                            id: post._id,
                                                                            type: post.type,
                                                                        }
                                                                    });
                                                                }}
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        )
                                    })
                                }
                            </div>
                        </div>
                    </div>
                </div>

                <ModalsHub 
                    whichComponent={this.state.whichComponent}
                    componentProps={this.state.componentProps}

                    setComponentToNull={this.setComponentToNull}
                />
            </div>
        )
    }
}