import React, { Component, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { w3cwebsocket as W3CWebSocket } from 'websocket';

import { BsThreeDots } from 'react-icons/bs';
import { HiOutlineDotsHorizontal } from 'react-icons/hi';
import { RiDeleteBin6Line } from 'react-icons/ri';

import { BsFillStarFill } from 'react-icons/bs';
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

import getUserUsername from '../../../../functions/getUserUsername';

import './PostsStyles.css';

require('dotenv/config');

export default class Posts extends Component {
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


        this.hideText = this.hideText.bind(this);

        this.showText = this.showText.bind(this);

        this.hideCompletely = this.hideCompletely.bind(this);
        this.hideSelection = this.hideSelection.bind(this);
        this.hideRandomly = this.hideRandomly.bind(this);

        this.submitSegredinho = this.submitSegredinho.bind(this);

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
        //console.log(this.props)
        // let sp = undefined;
        
        // if(this.props.match) {
        //     sp = ( this.props.match.params.sp === "true" ? true : false);
        // }
        //console.log(this.props);

        this.addPostSubmitButton.current.disabled = true;
        
        this.setState({
            userUsername: await getUserUsername(),
        })

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

                    const fInfo = {
                        id: this.props.match.params.id,
                        sessionId: localStorage.getItem('e'),
                    };
    
                    axios.post(process.env.REACT_APP_SERVER_ADDRESS + '/get_post', fInfo)
                        .then(response => {
                            
                            if(response.data.postIsRated) {
                                this.state.ratedPosts.push(response.data.post._id);
                            }

                            else {
                                this.setState({
                                    [ response.data.post._id ]: 0,
                                })
                            }

                            this.setState({
                                post: response.data.post,
                                showPostComments: true,
                            })
    
                        })
                        .catch(err => console.log(err));
                    
                }
    
                else {
                    const formInfo = {
                        username: this.props.username,
                        sessionId: localStorage.getItem('e'),
                    };
            
                    axios.post(process.env.REACT_APP_SERVER_ADDRESS + '/get_all_posts', formInfo)
                        .then(response => {
                            
                            this.setState({
                                posts: response.data.posts,
                                ratedPosts: response.data.ratedPosts,
                            }, () => {
                                this.state.posts.map(post => {

                                    if(post.content.urls) {
                                        this.setState({
                                            [ post._id + 'uniqueImageIndex' ]: 0,
                                        })
                                    }
            
                                    // this.setState({
                                    //     [ post._id ]: 0,
                                    // });
                                })
            
                            })
            
                        })
                        .catch(err => console.log(err));
                }
            
        }

        if(!localStorage.getItem('language')) {
            localStorage.setItem('language', navigator.language);
        }
        
    }

    handleChange = e => {
        this.setState({
            [ e.target.name ]: e.target.value
        }, () => {
            if(this.state.content.trim() === '' && this.state.tempUrls.length === 0) {
                this.addPostSubmitButton.current.disabled = true;
            }

            else {
                this.addPostSubmitButton.current.disabled = false;
            }
        })
    }

    handleChangeFile = e => {
        const file = e.target.files[0];

        if(file) {
            const reader = new FileReader();

            reader.readAsDataURL(e.target.files[0]);

            reader.addEventListener("load", (e) => {
                const len = this.state.tempUrls.push(e.currentTarget.result);

                this.setState({
                    uniqueImageIndex: (len - 1),
                })

                if(len === 0 && this.state.content === '') {
                    this.addPostSubmitButton.current.disabled = true;
                }

                else {
                    this.addPostSubmitButton.current.disabled = false;
                }
                
                if(len >= 4) {
                    this.addPostFileInput.current.disabled = true;
                }

                this.setState({});
            }, false);
            
            let files_temp = this.state.files;
            files_temp[Object.keys(files_temp).length] = file;

            this.setState({
                files: files_temp,
            })
        }
    }

    onChangePostRate(e, postId) {
        this.setState({
            [ postId ]: e.target.value,
        })
    }

    deletePost() {
        const { idToDelete: id, typeToDelete } = this.state;

        const formInfo = {
            username: this.props.username,
            id,
        }

        axios.post(process.env.REACT_APP_SERVER_ADDRESS + '/delete_' + typeToDelete, formInfo)
            .then(() => this.filterPosts(id))
            .catch(err => console.log(err));
    }

    filterPosts(id) {

        this.setState({
            posts: this.state.posts.filter(post => post._id.toString() !== id.toString()),
        })

        // this.setState({
        //     posts: this.state.posts.filter(post => {
        //         if(!(post._id === id)) {
        //             return post
        //         }
        //     })
        // }, () => {
        //     if(singlePost) {
        //         this.setState({
        //             showPostComments: false,
        //             post: {},
        //         })
        //     }
        // })
    }

    showButtons() {
        if((this.props.match) || (this.props.data)) {
            return(
                <div>
                    <GoHome />
                    <Notification />
                    <LogOut />
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

                            className="slider"
                        />

                        <p>Value: <span>{ Number(postRate / 1000000).toFixed(2) }</span></p>

                        <button type="submit">Rate this post</button>
                    </form>
                </div>
            )
        }
    }

    submitRate(e, id, isSegredinho) {
        e.preventDefault();

        const formInfo = {
            id: id,
            rate: this.state[id] / 1000000,
            sessionId: localStorage.getItem('e'),
        };

        let onWhich;
        //if isSegredinho is defined, then is a segredinho post k '-'
        if(isSegredinho) {
            onWhich = 'segredinho';
        }
        else {
            onWhich = 'post';
        }
        
        axios.post(process.env.REACT_APP_SERVER_ADDRESS + '/update_' + onWhich + '_rate', formInfo)
            .then(res => {
                
                this.state.ratedPosts.unshift(id);

                if(this.state.showPostComments) {
                    const { post } = this.state;

                    post.rate = res.data;
                    post.rateNumber = post.rateNumber + 1;

                    this.setState({
                        post: post,
                    })
                }

                else {
                    this.setState({
                        posts: this.state.posts.filter(post => {
                            if(post._id === id) {
                                post.rate = res.data;
                                post.rateNumber = post.rateNumber + 1;
                                return post
                            }
                            else {
                                return post
                            }
                        })
                    })
                }
            })
            .catch(err => console.log(err));
    }

    submitPost(e) {
        e.preventDefault();
        
        const fileData = new FormData();
        Object.keys(this.state.files).map(index => {
            fileData.append("files", this.state.files[index]);
        })

        fileData.append("sessionId", localStorage.getItem('e'));
        fileData.append("content", this.state.content.trim());

        this.addPost.current.style.display = "none";
        this.addPostAuxDiv.current.style.display = "none";
        this.addPostSubmitButton.current.disabled = true;

        this.setState({
            content: '',
            files: {},
            tempUrls: [],

        })

        //console.log('submitted');

        axios.post(process.env.REACT_APP_SERVER_ADDRESS + '/post', fileData)
            .then(response => {

                this.state.posts.unshift(response.data.post);
                this.state.ratedPosts.unshift(response.data.post._id);

                this.setState({
                    [ response.data.post._id + 'uniqueImageIndex' ]: 0,
                });

                // if(this.props.username === response.data.post.userUsername) {
                //     this.state.posts.unshift(response.data.post)
                //     this.state.ratedPosts.unshift(response.data.post._id)
                // }
                // //redirect to the profile of the user who's posting
                // // else {
                    
                // // }

                // const client = new W3CWebSocket('ws://127.0.0.1:8000/');

                // client.onopen = () => {
                //     client.send(JSON.stringify({
                //         type: 'notificationPostAdded',
                //         sessionId: localStorage.getItem('e'),
                //         notification: response.data.notification,
                //     }))
                //     console.log('Websocket client - object connected');
                // };
                
                // this.setState({}, () => {
                //     this.hideForm();
                // })
            })
            .catch(err => {
                console.log(err);
            });
        
    }

    hideText(text) {
        let toReturn = '';
        for(let letter of text) {
            if(letter === ' ') {
                toReturn = toReturn + ' ';
            }

            else if(letter === '\n') {
                toReturn = toReturn + '\n';
            }

            else {
                toReturn = toReturn + '*';
            }
        }

        return toReturn;
    }

    showText(e) {
        e.preventDefault();

        this.setState({
            content: this.state.originalMessage,
        })

        this.addSegredinhoSubmitButton.current.disabled = true;
    }

    hideCompletely(e) {
        e.preventDefault();

        const { content } = this.state;

        if(content.trim()) {
            const originalText = content.trim();
            const hiddenText = this.hideText(originalText);

            this.setState({
                content: hiddenText,
                originalMessage: originalText,
                hiddenMessage: hiddenText,
            }, () => {
                this.addSegredinhoSubmitButton.current.disabled = false;
            })
        }
    }

    hideSelection(e) {
        e.preventDefault();

        let { content } = this.state;

        const start = this.addSegredinhoTextarea.current.selectionStart;
        const end = this.addSegredinhoTextarea.current.selectionEnd;

        const originalSelectedText = content.substring(start, end);

        if(originalSelectedText) {
            const hiddenSelectedText = this.hideText(originalSelectedText);

            const hiddenText = content.substring(0, start) +
                hiddenSelectedText +
                content.substring(end);

            this.setState({
                content: hiddenText,
                originalMessage: content,
                hiddenMessage: hiddenText,
            }, () => {
                this.addSegredinhoSubmitButton.current.disabled = false;
            })
        }
    }

    hideRandomly(e) {
        e.preventDefault();

        let { content } = this.state;

        content = content.trim();

        if(content) {
            const originalText = content;

            let hiddenText = '';

            for(let letter of originalText) {
                if(letter === ' ') {
                    hiddenText = hiddenText + ' ';
                }

                else {
                    const decider = Math.random();
                    if(decider < 0.5) {
                        hiddenText = hiddenText + '*';
                    }
                    else {
                        hiddenText = hiddenText + letter;
                    }
                }
            }

            this.setState({
                content: hiddenText,
                originalMessage: originalText,
                hiddenMessage: hiddenText,
            }, () => {
                this.addSegredinhoSubmitButton.current.disabled = false;
            })
        }
    }

    submitSegredinho(e) {
        e.preventDefault();

        const formInfo = {
            sessionId: localStorage.getItem('e'),
            hiddenMessage: this.state.hiddenMessage.trim(),
            originalMessage: this.state.originalMessage.trim(),
        };

        this.addSegredinho.current.style.display = "none";
        this.addPostAuxDiv.current.style.display = "none";
        this.addSegredinhoSubmitButton.current.disabled = true;

        this.setState({
            content: '',
            originalMessage: '',
            hiddenMessage: '',
        });

        //console.log('submitted');

        axios.post(process.env.REACT_APP_SERVER_ADDRESS + '/post_segredinho', formInfo)
            .then(response => {
                this.state.posts.unshift(response.data.segredinho);
                this.state.ratedPosts.unshift(response.data.segredinho._id);

                this.setState({});
            })
            .catch(err => console.log(err));
            
    }

    setComponentToNull() {
        this.setState({
            whichComponent: null,
        })
    }

    render() {
        const {
            userUsername: visitorUsername,
            content,
            tempUrls,
            uniqueImageIndex,
            posts,
            staticText,
        } = this.state;
        const { username: visitedUsername } = this.props;

        // console.log(this.state);

        return(
            <div id="profile-posts-outter-container">
                <div id="profile-posts-inner-container">
                    <div
                        className="profile-posts-add-post-aux-div" 
                        ref={this.addPostAuxDiv}
                        onClick={() => {
                            this.addPost.current.style.display = "none";
                            this.addSegredinho.current.style.display = "none";
                            this.addPostAuxDiv.current.style.display = "none";
                        }}
                    >
                    </div>

                    <div className="profile-posts-add-post-div-outter-container" ref={this.addPost}>
                        <div className="profile-posts-add-post-div-inner-container">
                            <div
                                className="profile-posts-add-post-close-icon-outter-container"
                                onClick={() => {
                                    this.addPost.current.style.display = "none";
                                    this.addPostAuxDiv.current.style.display = "none";
                                }}
                            >
                                <MdClose />
                            </div>

                            
                            <div className="profile-posts-add-post-form-outter-container">
                                <form
                                    onSubmit={this.submitPost}
                                >
                                    <Linkify>
                                        <textarea
                                            className="profile-posts-add-post-textarea"
                                            name="content"
                                            onChange={this.handleChange}
                                            value={content}

                                            maxLength="2000"

                                            ref={this.addPostTextarea}
                                        />
                                    </Linkify>

                                    <div className="profile-posts-add-post-media-preview">
                                        <div className="profile-posts-add-post-media-preview-unique-image">
                                            {
                                                tempUrls[uniqueImageIndex] && (
                                                    <div
                                                        style={{
                                                            backgroundImage: `url(${tempUrls[uniqueImageIndex]})`
                                                        }}
                                                    >
                                                    </div>
                                                )
                                            }
                                        </div>

                                        <div className="profile-posts-add-post-media-preview-all-images">
                                            {
                                                tempUrls.map((url, index) => {
                                                    return(
                                                        <div
                                                            key={index}
                                                            style={{
                                                                backgroundImage: `url(${url})`
                                                            }}
                                                            onClick={() => {
                                                                this.setState({
                                                                    uniqueImageIndex: index,
                                                                })
                                                            }}
                                                        >
                                                        </div>
                                                    )
                                                })
                                            }
                                        </div>
                                    </div>

                                    <label htmlFor="files" className="profile-posts-add-post-label">
                                        <RiImageAddLine />
                                    </label>
                                    
                                    <input 
                                        type="file"
                                        className="profile-posts-add-post-file-input"
                                        id="files"
                                        name="files"
                                        
                                        //accept=".jpeg,.pjpeg,.png,.gif,.jpg,.mp4,.3gp,.webm"
                                        accept=".jpeg,.pjpeg,.png,.gif,.jpg"
                                        
                                        onChange={this.handleChangeFile}

                                        ref={this.addPostFileInput}
                                    />

                                    <button
                                        className="profile-posts-add-button profile-posts-add-post profile-posts-add-post-button-on-form"
                                        ref={this.addPostSubmitButton}
                                    >
                                        {
                                            (staticText[localStorage.getItem('language')]) ?
                                            staticText[localStorage.getItem('language')].postButton
                                            :
                                            staticText['en-US'].postButton
                                        }
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>

                    <div className="profile-posts-add-segredinho-div-outter-container" ref={this.addSegredinho}>
                        <div className="profile-posts-add-segredinho-div-inner-container">
                            <div
                                className="profile-posts-add-segredinho-close-icon-outter-container"
                                onClick={() => {
                                    this.addSegredinho.current.style.display = "none";
                                    this.addPostAuxDiv.current.style.display = "none";
                                }}
                            >
                                <MdClose />
                            </div>

                            
                            <div className="profile-posts-add-segredinho-form-outter-container">
                                <form
                                    onSubmit={this.submitSegredinho}
                                >
                                    <div className="profile-posts-add-segredinho-show-and-hide-buttons-outter-container">
                                        <div>
                                            <button onClick={this.showText}>
                                                { 
                                                    (staticText[localStorage.getItem('language')]) ?
                                                    staticText[localStorage.getItem('language')].segredinhoShow
                                                    :
                                                    staticText['en-US'].segredinhoShow
                                                }
                                            </button>

                                            <button onClick={this.hideCompletely}>
                                                { 
                                                    (staticText[localStorage.getItem('language')]) ?
                                                    staticText[localStorage.getItem('language')].segredinhoHideCompletely
                                                    :
                                                    staticText['en-US'].segredinhoHideCompletely
                                                }
                                            </button>
                                        </div>

                                        <div>
                                            <button onClick={this.hideSelection}>
                                                {
                                                    (staticText[localStorage.getItem('language')]) ?
                                                    staticText[localStorage.getItem('language')].segredinhoHideSelection
                                                    :
                                                    staticText['en-US'].segredinhoHideSelection
                                                }
                                            </button>

                                            <button onClick={this.hideRandomly}>
                                                {
                                                    (staticText[localStorage.getItem('language')]) ?
                                                    staticText[localStorage.getItem('language')].segredinhoHideRandomly
                                                    :
                                                    staticText['en-US'].segredinhoHideRandomly
                                                }
                                            </button>
                                        </div>
                                    </div>

                                    <textarea
                                        className="profile-posts-add-segredinho-textarea"
                                        name="content"
                                        onChange={this.handleChange}
                                        value={content}

                                        maxLength="2000"

                                        ref={this.addSegredinhoTextarea}
                                    />

                                    <button
                                        className="profile-posts-add-button profile-posts-add-post profile-posts-add-post-button-on-form"
                                        disabled
                                        ref={this.addSegredinhoSubmitButton}
                                    >
                                        {
                                            (staticText[localStorage.getItem('language')]) ?
                                            staticText[localStorage.getItem('language')].postButton
                                            :
                                            staticText['en-US'].postButton
                                        }
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>


                    {
                        (visitorUsername === visitedUsername) &&
                        (
                            <div className="profile-posts-add-post-and-segredinho-outter-container">
                                <button
                                    name="post-button"
                                    className="profile-posts-add-button profile-posts-add-post"
                                    onClick={() => {
                                        this.addPost.current.style.display = "block";
                                        this.addPostAuxDiv.current.style.display = "block";
                                        this.addPostTextarea.current.focus();
                                    }}
                                >
                                    {
                                        (staticText[localStorage.getItem('language')]) ?
                                        staticText[localStorage.getItem('language')].postButton
                                        :
                                        staticText['en-US'].postButton
                                    }
                                </button>

                                <button
                                    className="profile-posts-add-button profile-posts-add-segredinho"
                                    onClick={() => {
                                        this.addSegredinho.current.style.display = "block";
                                        this.addPostAuxDiv.current.style.display = "block";
                                        this.addSegredinhoTextarea.current.focus();
                                    }}
                                >
                                    Segredinho
                                </button>
                            </div>
                        )
                    }

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
                                                <div
                                                    className="user-options-aux-div"
                                                    id={"user-options-aux-div-" + index}
                                                    onClick={() => {
                                                        document.getElementById(`delete-message-div-${index}`).style.display = 'none';
                                                        document.getElementById(`user-options-aux-div-${index}`).style.display = 'none';
                                                        document.getElementById(`user-options-div-${index}`).style.display = 'none';
                                                        document.getElementById(`user-options-icon-${index}`).style.display = 'block';
                                                    }}
                                                >
                                                </div>

                                                <div className="user-options-icon-outter-container" id={"user-options-icon-" + index}>
                                                    <BsThreeDots
                                                        onClick={() => {
                                                            document.getElementById(`user-options-aux-div-${index}`).style.display = 'block';
                                                            document.getElementById(`user-options-div-${index}`).style.display = 'block';
                                                            document.getElementById(`user-options-icon-${index}`).style.display = 'none';

                                                            this.setState({
                                                                idToDelete: post._id,
                                                                typeToDelete: post.type,
                                                            })
                                                        }}
                                                    />
                                                </div>

                                                <div
                                                    className="delete-message-outter-container"
                                                    id={"delete-message-div-" + index}
                                                >
                                                    <div className="delete-message-inner-container">
                                                        {
                                                            (staticText[localStorage.getItem('language')]) ?
                                                            staticText[localStorage.getItem('language')].optionsDelete
                                                            :
                                                            staticText['en-US'].optionsDelete
                                                        }
                                                        ?
                                                    </div>

                                                    <div className="delete-message-buttons-outter-container">
                                                        <button
                                                            className="delete-message-button"
                                                            onClick={() => {
                                                                document.getElementById(`delete-message-div-${index}`).style.display = 'none';
                                                                document.getElementById(`user-options-aux-div-${index}`).style.display = 'none';
                                                                document.getElementById(`user-options-div-${index}`).style.display = 'none';
                                                                document.getElementById(`user-options-icon-${index}`).style.display = 'block';

                                                                this.deletePost();
                                                            }}
                                                        >
                                                            {
                                                                (staticText[localStorage.getItem('language')]) ?
                                                                staticText[localStorage.getItem('language')].yes
                                                                :
                                                                staticText['en-US'].yes
                                                            }
                                                        </button>

                                                        <button
                                                            className="delete-message-button"
                                                            onClick={() => {
                                                                document.getElementById(`delete-message-div-${index}`).style.display = 'none';
                                                                document.getElementById(`user-options-aux-div-${index}`).style.display = 'none';
                                                                document.getElementById(`user-options-div-${index}`).style.display = 'none';
                                                                document.getElementById(`user-options-icon-${index}`).style.display = 'block';
                                                            }}
                                                        >
                                                            {
                                                                (staticText[localStorage.getItem('language')]) ?
                                                                staticText[localStorage.getItem('language')].no
                                                                :
                                                                staticText['en-US'].no
                                                            }
                                                        </button>
                                                    </div>
                                                </div>

                                                <div className="user-options-outter-container" id={"user-options-div-" + index}>
                                                    {
                                                        (visitorUsername === visitedUsername) &&
                                                        <div
                                                            className="user-option"
                                                            onClick={() => {
                                                                document.getElementById(`delete-message-div-${index}`).style.display = 'flex';
                                                            }}
                                                        >
                                                            {
                                                                (staticText[localStorage.getItem('language')]) ?
                                                                staticText[localStorage.getItem('language')].optionsDelete
                                                                :
                                                                staticText['en-US'].optionsDelete
                                                            }
                                                        </div>
                                                    }
                                                </div>

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
                                                            isRated={this.state.ratedPosts.includes(post._id) ? true: false}

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

                {/* <div>
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
                } */}
            </div>
        )
    }
}