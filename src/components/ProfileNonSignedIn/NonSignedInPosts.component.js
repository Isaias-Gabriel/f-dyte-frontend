import React, { Component, useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { w3cwebsocket as W3CWebSocket } from 'websocket';

import { HiOutlineDotsHorizontal } from 'react-icons/hi';
import { RiDeleteBin6Line } from 'react-icons/ri';
import { BsFillStarFill } from 'react-icons/bs';
import { BsArrowUpShort } from 'react-icons/bs';

import Linkify from 'react-linkify';

import ReturnReferenceAsLink from 
    '../ReturnReferenceAsLink/ReturnReferenceAsLink.component';

import LogIn from '../LogIn/LogIn.component';

import GoHome from '../GoHome/GoHome.component';

import ShowMedia from '../ShowMedia/ShowMedia.component';
import PostSegredinho from '../PostSegredinho/PostSegredinho.component';

import CommentOnPQBS from '../Comment/CommentOnPQBS.component';

import './NonSignedInStyles.css';

require('dotenv/config');

export default class NonSignedInPosts extends Component {
    constructor(props) {
        super(props);

        this.handleChange = this.handleChange.bind(this);
        this.handleChangeFile = this.handleChangeFile.bind(this);
        
        this.deletePost = this.deletePost.bind(this);
        this.filterPosts = this.filterPosts.bind(this);

        this.showButtons = this.showButtons.bind(this);
        this.showComments = this.showComments.bind(this);

        this.showOptions = this.showOptions.bind(this);
        this.hideOptions = this.hideOptions.bind(this);

        this.showFeed = this.showFeed.bind(this);

        this.showForm = this.showForm.bind(this);
        this.hideForm = this.hideForm.bind(this);

        this.showPostRatingSlider = this.showPostRatingSlider.bind(this);

        this.submitRate = this.submitRate.bind(this, );
        this.submitPost = this.submitPost.bind(this);

        this.threeDotsButton = React.createRef();
        this.optionsDiv = React.createRef();
        this.auxBackgroundDiv = React.createRef();

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
        }
    }

    async componentDidMount() {       
        //console.log(this.props)
        // let sp = undefined;
        
        // if(this.props.match) {
        //     sp = ( this.props.match.params.sp === "true" ? true : false);
        // }
        //console.log(this.props);

        //if the post is shown within a 'comment' page
        if(this.props.data) {

            document.getElementsByTagName("hr")[0].style.display = "none";
            document.getElementById("add-new-post-button").style.display = "none";

            const { data } = this.props;

            //if the post has already been rated
            if(data[0][2]) {
                this.state.ratedPosts.unshift(data[0][1]._id);
            }

            else {
                this.setState({
                    [ data[0][1]._id ]: 0,
                })
            }
                    
            this.setState({
                post: data[0][1],
                showPostComments: true,
                //ratedPosts: response.data.ratedPosts,
            })
    
                
        }

        else {
                if(this.props.match) {
                    document.getElementsByTagName("hr")[0].style.display = "none";
                    document.getElementById("add-new-post-button").style.display = "none";

                    const formInfo = {
                        id: this.props.match.params.id,
                        sessionId: localStorage.getItem('e'),
                    };
    
                    axios.post(process.env.REACT_APP_SERVER_ADDRESS + '/get_post_no_user', formInfo)
                        .then(response => {
                        
                            this.setState({
                                [ response.data.post._id ]: 0,
                                post: response.data.post,
                                showPostComments: true,
                            })
    
                        })
                        .catch(err => console.log(err));
                    
                }
    
                else {
                    const formInfo = {
                        username: this.props.username,
                    };
            
                    axios.post(process.env.REACT_APP_SERVER_ADDRESS + '/get_all_posts_no_user', formInfo)
                        .then(response => {
                            console.log(response.data);
                            this.setState({
                                posts: response.data.posts,
                            }, () => {
                                this.state.posts.map(post => {
                                    this.setState({
                                        [ post._id ]: 0,
                                    });
                                })
            
                            })
            
                        })
                        .catch(err => console.log(err));
                }
            
        }
        
    }

    handleChange = e => {
        this.setState({
            [ e.target.name ]: e.target.value
        })
    }

    handleChangeFile = e => {
        const file = e.target.files[0];
        const reader = new FileReader();

        reader.readAsDataURL(e.target.files[0]);

        const preview = document.getElementById("media-preview-post");

        reader.addEventListener("load", function () {
            if(file.type.includes("image")) {
                const image = new Image();
                image.height = 100;
                image.src = this.result;
                preview.appendChild(image);
            }

            else if(file.type.includes("video")) {
                const video = document.createElement('video');
                const source = document.createElement('source');
                source.src = this.result;

                video.appendChild(source);
                video.controls = "true";
                preview.appendChild(video);
            }
        }, false);
        
        let files_temp = this.state.files;
        files_temp[Object.keys(files_temp).length] = file;

        this.setState({
            files: files_temp,
        }, () => {
            console.log(this.state.files);
        })
    }

    onChangePostRate(e, postId) {
        this.setState({
            [ postId ]: e.target.value,
        })
    }

    deletePost(id, singlePost) {
        console.log({
            id,
            singlePost,
        })
        // axios.post(process.env.REACT_APP_SERVER_ADDRESS + '/delete_post', { id: id })
        //     .then(() => this.filterPosts(id, singlePost))
        //     .catch(err => console.log(err));
    }

    filterPosts(id, singlePost) {
        this.setState({
            posts: this.state.posts.filter(post => {
                if(!(post._id === id)) {
                    return post
                }
            })
        }, () => {
            if(singlePost) {
                this.setState({
                    showPostComments: false,
                    post: {},
                })
            }
        })

    }

    showButtons() {
        if((this.props.match) || (this.props.data)) {
            return(
                <div>
                    <GoHome />
                    <button onClick={
                        () => {
                            this.setState({
                                showLogInModal: true,
                            })
                        }
                    }>
                        Log in
                    </button>
                </div>
            )
        }

        else {
            return(
                <button onClick={() => {
                    if(!(this.props.match)) {
                        this.setState({
                            showPostComments: false,
                            post: {},
                        })
                    }
                }}>
                    Go back
                </button>
            )
        }
    }

    showComments(id, isSegredinho) {
        const { data } = this.props;

        let onWhich;
        //if isSegredinho is defined, then is a segredinho post k '-'
        if(isSegredinho) {
            onWhich = 'segredinho';
        }
        else {
            onWhich = 'post';
        }
        
        if(data) {
            const auxData = data.slice();
            auxData.shift();

            if(auxData.length) {
                return(
                    <CommentOnPQBS
                        data={auxData}

                        id={id}
                        commentOn={onWhich}
                    />
                )
            }
        }

        else {
            return(
                <CommentOnPQBS
                    id={id}
                    commentOn={onWhich}
                />
            )
        }
    }

    showOptions(id) {
        this.setState({
            idForTheOptions: id,
        })

        this.threeDotsButton.current.style.display = "none";
        this.optionsDiv.current.style.display = "block";
        this.auxBackgroundDiv.current.style.display = "block";
    }

    hideOptions() {
        this.threeDotsButton.current.style.display = "inline-block";
        this.optionsDiv.current.style.display = "none";
        this.auxBackgroundDiv.current.style.display = "none";
    }

    showFeed() {
        const { userUsername } = this.state;

        if(!(this.state.showPostComments)) {
            if(this.state.posts.length) {
                if(this.state.posts[0].userUsername === userUsername) {
                    return(
                        <div className="show-posts">
                            {
                                this.state.posts.map(post => {
                                    return(
                                        <div key={post._id} className="post-on-feed-container">
                                            <div>
                                                <div 
                                                    className="aux-background-div"
                                                    ref={this.auxBackgroundDiv}
                                                    onClick={() => {
                                                        this.hideOptions()
                                                    }}
                                                >
                                                </div>

                                                <button
                                                    className="button-post-options"
                                                    ref={this.threeDotsButton}
                                                    onClick={() => {
                                                        this.showOptions(post._id)
                                                    }}
                                                >
                                                    <HiOutlineDotsHorizontal className="icon-post-options"/>
                                                </button>

                                                <div className="post-options" ref={this.optionsDiv}>
                                                    <div
                                                        className="single-option-div"
                                                        onClick={() => {
                                                            this.deletePost(this.state.idForTheOptions, false)
                                                        }}
                                                    >
                                                        <RiDeleteBin6Line className="dlt-cmmnt-ico-fy" />
                                                        delete post
                                                    </div>

                                                    <div className="single-option-div">
                                                        <Link to={"/promote_post/" + this.state.idForTheOptions}>
                                                            <div className="star-and-arrow-div">
                                                                <BsFillStarFill />
                                                                <BsArrowUpShort className="arrow" />
                                                            </div>
                                                            promote this post
                                                        </Link>
                                                    </div>
                                                </div>
                                            </div>
                                            
                                            <img className="post-profile-image" src={post.userProfilePictureUrl} alt="profile" />
    
                                            <span>
                                                { post.userName + ` ` }
                                            </span>
                        
                                            <span>
                                                <Link to={"/redirect_to_profile/" + post.userUsername}>
                                                    @ { post.userUsername }
                                                </Link>
                                            </span>
    
                                            <Linkify>
                                                <div>
                                                    <span>
                                                        <ReturnReferenceAsLink
                                                            text={post.content.text}
                                                        />
                                                    </span>
                                                </div>
                                            </Linkify>
                        
                                            {
                                                post.content.urls.map(url => {
                                                    return <ShowMedia
                                                        key={url}
                                                        url={url}
                                                    />
                                                })
                                            }
                        
                                            <p>
                                                Post rate: { Number(post.rate.$numberDecimal).toFixed(2) }
                                            </p>
                        
                                            <p>
                                                Number of rates: { post.rateNumber }
                                            </p>
                        
                                            {
                                                this.showPostRatingSlider(post._id, post.originalText)
                                            }
                        
                                            <button onClick={() => {
                                                this.setState({
                                                    showPostComments: true,
                                                    post: post,
                                                })
                                            }}>
                                                Show comments
                                            </button>
                                        </div>
                                    )
                                })
                            }
                        </div>
                    )
                }

                else {
                    return(
                        <div className="show-posts">
                            {
                                this.state.posts.map(post => {
                                    return(
                                        <div key={post._id} className="post-on-feed-container">
                                            
                                            <img className="post-profile-image" src={post.userProfilePictureUrl} alt="profile" />
    
                                            <span>
                                                { post.userName + ` ` }
                                            </span>
                        
                                            <span>
                                                <Link to={"/redirect_to_profile/" + post.userUsername}>
                                                    @ { post.userUsername }
                                                </Link>
                                            </span>
    
                                            <Linkify>
                                                <div>
                                                    <span>
                                                        <ReturnReferenceAsLink
                                                            text={post.content.text}
                                                        />
                                                    </span>
                                                </div>
                                            </Linkify>
                        
                                            {
                                                post.content.urls.map(url => {
                                                    return <ShowMedia
                                                        key={url}
                                                        url={url}
                                                    />
                                                })
                                            }
                        
                                            <p>
                                                Post rate: { Number(post.rate.$numberDecimal).toFixed(2) }
                                            </p>
                        
                                            <p>
                                                Number of rates: { post.rateNumber }
                                            </p>
                        
                                            {
                                                this.showPostRatingSlider(post._id, post.originalText)
                                            }
                        
                                            <button onClick={() => {
                                                this.setState({
                                                    showPostComments: true,
                                                    post: post,
                                                })
                                            }}>
                                                Show comments
                                            </button>
                                        </div>
                                    )
                                })
                            }
                        </div>
                    )
                }
            }
        }

        else {
            const { post } = this.state;

            if(post.userUsername === userUsername) {
                return(
                    <div id="show-post-and-comments">
                        {
                            this.showButtons()
                        }

                        {/* <ShowOptions 
                            id={post._id}
                            filterPosts={this.filterPosts}
                            singlePost={true}
                        /> */}
                        
                        <div>
                            <img className="post-profile-image" src={post.userProfilePictureUrl} alt="profile" />
    
                            <span>
                                    { post.userName + ` ` }
                            </span>
        
                            <span>
                                <Link to={"/redirect_to_profile/" + post.userUsername}>
                                    @ { post.userUsername }
                                </Link>
                            </span>
        
                            <Linkify>
                                <div>
                                    <span>
                                        <ReturnReferenceAsLink
                                            text={post.content.text}
                                        />
                                    </span>
                                </div>
                            </Linkify>
        
                            {
                                post.content.urls.map(url => {
                                    return <ShowMedia
                                        key={url}
                                        url={url}
                                    />
                                })
                            }
        
                            <p>
                                Comment rate: { Number(post.rate.$numberDecimal).toFixed(2) }
                            </p>
        
                            <p>
                                Number of rates: { post.rateNumber }
                            </p>
        
                            {
                                this.showPostRatingSlider(post._id, post.originalText)
                            }
    
                            <hr/>
    
                            { this.showComments(post._id, post.originalText) }

                        </div> 
                    </div>
                )
            }
            
            else {
                return(
                    <div id="show-post-and-comments">
                        {
                            this.showButtons()
                        }
                        
                        <div>
                            <img className="post-profile-image" src={post.userProfilePictureUrl} alt="profile" />
    
                            <span>
                                    { post.userName + ` ` }
                            </span>
        
                            <span>
                                <Link to={"/redirect_to_profile/" + post.userUsername}>
                                    @ { post.userUsername }
                                </Link>
                            </span>
        
                            <Linkify>
                                <div>
                                    <span>
                                        <ReturnReferenceAsLink
                                            text={post.content.text}
                                        />
                                    </span>
                                </div>
                            </Linkify>
        
                            {
                                post.content.urls.map(url => {
                                    return <ShowMedia
                                        key={url}
                                        url={url}
                                    />
                                })
                            }
        
                            <p>
                                Comment rate: { Number(post.rate.$numberDecimal).toFixed(2) }
                            </p>
        
                            <p>
                                Number of rates: { post.rateNumber }
                            </p>
        
                            {
                                this.showPostRatingSlider(post._id, post.originalText)
                            }
    
                            <hr/>
    
                            { this.showComments(post._id, post.originalText) }
                            
                        </div> 
                    </div>
                )
            }
        }
        
    }

    showForm() {
        document.getElementById("add-new-post-button").style.display = "none";
        document.getElementById("add-new-post-form-container").style.display = "block";
    }

    hideForm() {
        document.getElementById("add-new-post-form-container").style.display = "none";
        document.getElementById("add-new-post-button").style.display = "block";
        document.getElementById("media-preview-post").innerHTML = "";
        document.getElementById('text-content-input-comment-on-object').innerText = "";

        this.setState({
            content: '',
            files: {},
            tempUrls: [],
        })
    }

    showPostRatingSlider(id, isSegredinho) {

        //if the user haven't rated the comment yet, it can rate
        if(!(this.state.ratedPosts.includes(id))) {
            const postRate = this.state[id];
            
            return(
                <div className="slidecontainer">
                    <form className="rate-comment-on-object" onSubmit={(e) => this.submitRate(e, id, isSegredinho)}>
                        <input 
                            type="range"

                            min="0"
                            max="5000000"
                            value={postRate || 0}
                            onChange={(e) => this.onChangePostRate(e, id)}

                            id="myRange"
                            className="slider"
                        />

                        <p>Value: <span>{ Number(postRate / 1000000).toFixed(2) }</span></p>

                        <button type="submit">
                            Rate this post
                        </button>
                    </form>
                </div>
            )
        }
    }

    submitRate(e, id, isSegredinho) {
        e.preventDefault();

        this.setState({
            showLogInModal: true,
        })
    }

    submitPost(e) {
        e.preventDefault();
        
        const fileData = new FormData();
        Object.keys(this.state.files).map(index => {
            fileData.append("files", this.state.files[index]);
        })

        fileData.append("sessionId", localStorage.getItem('e'));
        fileData.append("content", document.getElementById('text-content-input-comment-on-object').innerText);
        // const formInfo = {
        //     "sessionId": localStorage.getItem('e'),
        //     "content": document.getElementById('text-content-input-comment-on-object').innerText,
        // }

        console.log(fileData);

        axios.post(process.env.REACT_APP_SERVER_ADDRESS + '/post', fileData)
            .then(response => {
                console.log('a');

                if(this.props.username === response.data.post.userUsername) {
                    this.state.posts.unshift(response.data.post)
                    this.state.ratedPosts.unshift(response.data.post._id)
                }
                //redirect to the profile of the user who's posting
                // else {
                    
                // }

                const client = new W3CWebSocket('ws://127.0.0.1:8000/');

                client.onopen = () => {
                    client.send(JSON.stringify({
                        type: 'notificationPostAdded',
                        sessionId: localStorage.getItem('e'),
                        notification: response.data.notification,
                    }))
                    console.log('Websocket client - object connected');
                };
                
                this.setState({}, () => {
                    this.hideForm();
                })
            })
            .catch(err => {
                console.log('b');
                console.log(err);
            });
        
    }

    render() {
        const { showLogInModal } = this.state;

        return(
            <div id="profile-post-container">

                    {
                        (showLogInModal)
                        ?
                        (
                            <div class="log-in-modal-outter-container">
                                <div className="log-in-modal-message">
                                    <p>
                                        Log in or sign up 
                                        so you can rate, comment, post, 
                                        create objects ^^ and more °-°
                                    </p>
                                </div>
                                <div className="log-in-modal">
                                    <LogIn />
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
                    <div id="add-new-post-button" onClick={this.showForm}>
                        +
                    </div>

                    <div>
                        <PostSegredinho />
                    </div>
                </div>

                <div id="add-new-post-form-container">
                    <span onClick={this.hideForm}>
                        x
                    </span>
                    
                    <form onSubmit={this.submitPost}>
                        <Linkify>
                            <div
                                id="text-content-input-comment-on-object"
                                contentEditable="true"
                                name="comment"
                                //placeholder="What do you think of this?"
                            >
                                
                            </div>
                        </Linkify>
                        
                        <div>
                            <div id="media-preview-post">

                            </div>

                            <label htmlFor="files" id="files-label">
                                +
                            </label>

                            <input 
                                type="file"
                                id="files"
                                name="files"
                                
                                accept=".jpeg,.pjpeg,.png,.gif,.jpg,.mp4,.3gp,.webm"
                                
                                onChange={this.handleChangeFile}
                            />
                        </div>

                        <button type="submit">
                            post
                        </button>
                    </form>
                </div>

                <hr/>

                {
                    this.showFeed()
                }
            </div>
        )
    }
}