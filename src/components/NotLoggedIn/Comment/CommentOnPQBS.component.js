import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { w3cwebsocket as W3CWebSocket } from 'websocket';

import ReactPlayer from 'react-player';
import Linkify from 'react-linkify';

import ReturnReferenceAsLink from 
    '../ReturnReferenceAsLink/ReturnReferenceAsLink.component';

import getUserUsername from '../../functions/getUserUsername';

import CommentOnComment from './CommentOnComment.component';

import './CommentOnPQBSStyles.css';

require('dotenv/config');

const ShowMedia = props => {
    const url = props.url;

    if(url.includes(".mp4") || url.includes(".3gp") || url.includes(".webm")) {
        return(
            <div>
                <ReactPlayer
                    url={url}
                    height={"30vh"}
                    controls
                />
            </div>
        )
    }

    else {
        return(
            <div>
                <img src={url} alt="comment"/>
            </div>
        )
    }
}

const ShowOptions = props => {
    function deleteComment() {
        axios.post(process.env.REACT_APP_SERVER_ADDRESS + '/delete_comment', { id: props.id })
            .then(() => props.filterComments(props.id, props.singleComment))
            .catch(err => console.log(err));

    }

    return(
        <div>
            <span onClick={deleteComment}>
                delete comment
            </span>
        </div>
    )
}

const ShwComment = props => {
    return (
        <div>
            <div>
                <span>
                    <Link to={"/redirect_to_profile/" + props.comment.userUsername}>
                        { props.comment.userName + ` ` }
                    </Link>
                </span>

                <span>
                    <Link to={"/redirect_to_profile/" + props.comment.userUsername}>
                        @ { props.comment.userUsername }
                    </Link>
                </span>
            </div>

            <div>
                <Linkify>
                    <span>
                        <ReturnReferenceAsLink
                            text={props.comment.content.text}
                        />
                    </span>
                </Linkify>
            </div>

            {
                props.comment.content.urls.map(url => {
                    return <ShowMedia
                        key={url}
                        url={url}
                    />
                })
            }

            <p>
                Comment rate: { Number(props.comment.rate.$numberDecimal).toFixed(2) }
            </p>

            <p>
                Number of rates: { props.comment.rateNumber }
            </p>
        </div>
    )
}

export default class CommentOnPQBS extends Component {
    constructor(props) {
        super(props)

        this.handleChange = this.handleChange.bind(this);
        this.handleChangeFile = this.handleChangeFile.bind(this);
        this.onChangeCommentRate = this.onChangeCommentRate.bind(this);

        this.filterComments = this.filterComments.bind(this);

        this.howToShowComments = this.howToShowComments.bind(this);
        
        this.showComments = this.showComments.bind(this);

        this.showCommentRatingSlider = this.showCommentRatingSlider.bind(this);

        this.showForm = this.showForm.bind(this);
        this.hideForm = this.hideForm.bind(this);

        this.submitRate = this.submitRate.bind(this);

        this.submitComment = this.submitComment.bind(this);

        this.state = {
            comment: '',
            postCommentsFiles: {},
            tempUrls: [],

            comments: [],

            ratedComments: [],

            showCommentComments: false,
            singleComment: {},
            showAddCommentButton: true,

            userUsername: '',

            commentOn: '',
        }

    }

    async componentDidMount() {
        console.log(this.props);

        const client = new W3CWebSocket('ws://127.0.0.1:8000/');

        this.setState({
            client: client,
        });

        const whichOne = this.props.commentOn[0].toUpperCase() + this.props.commentOn.substring(1,10);

        client.onopen = () => {
            client.send(JSON.stringify({
                type: 'commentOn' + whichOne + 'Connection',
                sessionId: localStorage.getItem('e'),
                nickId: this.props.id,
            }))
            console.log('Websocket client - comment on ' + whichOne + ' connected');
        };

        client.onmessage = (message) => {
            const dataFromServer = JSON.parse(message.data);
            
            const comment = dataFromServer.comment;

            //if it's not a comment from the user itself 
            //(if it is, the comment is already being saved and showed)
            if(!(comment.userUsername === this.state.userUsername)) {
                this.state.comments.unshift(comment);
                
                this.setState({
                    [ comment._id ]: 0,
                })
            }
        }

        this.setState({
            userUsername: await getUserUsername(),
            commentOn: this.props.commentOn,
        }, () => {
            if(this.props.data) {

                const { data } = this.props;
                

                this.setState({
                    showCommentComments: true,

                    singleComment: data[0][0],
                    showAddCommentButton: false,
                })
                
                if(data[0][1]) {
                    this.state.ratedComments.unshift(data[0][0]._id);
                }

                else {
                    this.setState({
                        [ data[0][0]._id ]: 0,
                    })
                }
            
                // const formInfo = {
                //     id: this.props.id,
                //     sessionId: localStorage.getItem('e'),
                // }

                // axios.post(process.env.REACT_APP_SERVER_ADDRESS + '/get_' + this.state.commentOn + '_comments', formInfo)
                //     .then(response => {

                //         this.setState({
                //             comments: response.data.comments,
                //             ratedComments: response.data.ratedComments,
                //         }, () => {
                //             this.state.comments.map(comment => {
                //                 this.setState({
                //                     [ comment._id ]: 0,
                //                 });
                //                 return undefined;
                //             })
                //             return undefined;
                //         })

                //     })

                
            }

            else {
                
                const formInfo = {
                    id: this.props.id,
                    sessionId: localStorage.getItem('e'),
                }

                axios.post(process.env.REACT_APP_SERVER_ADDRESS + '/get_' + this.state.commentOn + '_comments', formInfo)
                    .then(response => {

                        this.setState({
                            comments: response.data.comments,
                            ratedComments: response.data.ratedComments,
                        }, () => {
                            this.state.comments.map(comment => {
                                this.setState({
                                    [ comment._id ]: 0,
                                });
                                return undefined;
                            })
                            return undefined;
                        })

                    })
        
                
            }
        })
               
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

        const preview = document.getElementById("media-preview-comment-on-post");

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
        
        let postCommentsFiles_temp = this.state.postCommentsFiles;
        postCommentsFiles_temp[Object.keys(postCommentsFiles_temp).length] = file;

        this.setState({
            postCommentsFiles: postCommentsFiles_temp,
        })
    }

    onChangeCommentRate(e, commentId) {
        this.setState({
            [ commentId ]: e.target.value,
        })
    }

    filterComments(id, singleComment) {
        this.setState({
            comments: this.state.comments.filter(comment => {
                if(!(comment._id === id)) {
                    return comment
                }
            })
        }, () => {
            if(singleComment) {
                this.setState({
                    showCommentComments: false,
                    singleComment: {},
                    showAddCommentButton: true,
                })
            }
        })

    }

    howToShowComments(id) {
        const { data } = this.props;
        
        if(data) {
            const auxData = data.slice();
            auxData.shift();
            
            if(auxData.length) {
                return(
                    <CommentOnComment
                        data={auxData}

                        commentId={id}
                        level={0}
                    />
                )
            }
        }

        else {
            return(
                <CommentOnComment
                    commentId={id}
                    level={0}
                />
            )
        }
    }

    showComments() {
        const { userUsername } = this.state;

        if(!(this.state.showCommentComments)) {
            return(
                <div className="cmmnts">
                    <div className="shw-cmmnt-cmmnts">
                        {
                            this.state.comments.map(comment => {
                                if(comment.userUsername === userUsername) {
                                    return (
                                            <div key={comment._id}>
                                                <ShowOptions 
                                                    id={comment._id}
                                                    filterComments={this.filterComments}
                                                    singleComment={false}
                                                />

                                                <ShwComment comment={comment} />
        
                                                {
                                                    this.showCommentRatingSlider(comment._id)
                                                }
        
                                                <button onClick={() => {
                                                    this.setState({
                                                        showCommentComments: true,
                                                        singleComment: comment,
                                                        showAddCommentButton: false,
                                                    })
                                                }}>
                                                    Show comments
                                                </button>
                                            
                                                <hr/>
                                            </div>
                                        )
                                }

                                else {
                                    return (
                                        <div key={comment._id}>
                                            <ShwComment comment={comment} />
    
                                            {
                                                this.showCommentRatingSlider(comment._id)
                                            }
    
                                            <button onClick={() => {
                                                this.setState({
                                                    showCommentComments: true,
                                                    singleComment: comment,
                                                    showAddCommentButton: false,
                                                })
                                            }}>
                                                Show comments
                                            </button>
                                        
                                            <hr/>
                                        </div>
                                    )
                                }
                            })
                        }
                    </div>
    
                    { this.showCommentForm() }
    
                </div>
            )
        }
        
        else {
            const { singleComment } = this.state;

            if(singleComment.userUsername === userUsername) {
                return(
                    <div className="cmmnts">
                        <div className="shw-cmmnt-cmmnts">
                            <button onClick={() => {
                                    this.setState({
                                        showCommentComments: false,
                                        singleComment: {},
                                        showAddCommentButton: true,
                                    })
                            }}>
                                Go back
                            </button>

                            <ShowOptions 
                                id={singleComment._id}
                                filterComments={this.filterComments}
                                singleComment={true}
                            />
    
                            <div>
                                <ShwComment comment={singleComment} />
    
                                {
                                    this.showCommentRatingSlider(singleComment._id)
                                }
                            
                                <hr/>
                            </div>
                        </div>
    
                        { this.howToShowComments(singleComment._id) }
        
                        { this.showCommentForm() }
        
                    </div>
                )
            }

            else {
                return(
                    <div className="cmmnts">
                        <div className="shw-cmmnt-cmmnts">
                            <button onClick={() => {
                                    this.setState({
                                        showCommentComments: false,
                                        singleComment: {},
                                        showAddCommentButton: true,
                                    })
                            }}>
                                Go back
                            </button>
    
                            <div>
                                <ShwComment comment={singleComment} />
    
                                {
                                    this.showCommentRatingSlider(singleComment._id)
                                }
                            
                                <hr/>
                            </div>
                        </div>
    
                        { this.howToShowComments(singleComment._id) }
        
                        { this.showCommentForm() }
        
                    </div>
                )
            }
            
        }
        
    }

    showCommentForm() {
        return(
            <div id="sbmt-comment">
                <div id="add-new-comment-form-container">
                    <span onClick={this.hideForm}>
                        x
                    </span>

                    <form onSubmit={this.submitComment} encType="multipart/form-data">
                        <Linkify>
                            <div
                                id="text-content-input-comment-on-pqb"
                                contentEditable="true"
                                name="comment"
                                //placeholder="What do you think of this?"
                            >
                                
                            </div>
                        </Linkify>
                        
                        <div>
                            <div id="media-preview-comment-on-post">

                            </div>

                            <label htmlFor="pqb-comments-files" id="post-comments-files-label">
                                +
                            </label>

                            <input 
                                type="file"
                                id="pqb-comments-files"
                                name="postCommentsFiles"
                                
                                accept=".jpeg,.pjpeg,.png,.gif,.jpg,.mp4,.3gp,.webm"
                                
                                onChange={this.handleChangeFile}
                            />
                        </div>

                        <button type="submit">
                            comment
                        </button>
                    </form>
                </div>
            </div>

            
        )
        
    }
    
    showCommentRatingSlider(commentId) {

        //if the user haven't rated the comment yet, it can rate if:
        //the comment is on the comment section, or the comment is on the haters section and 
        //the user is a hater or the comment is on the lovers section and
        //the user is a lover
        //first () checks if the user is allowed to rate according with the section
        //second () checks if the comment is rated
        if(!(this.state.ratedComments.includes(commentId))) {
            const commentRate = this.state[commentId];

            return(
                <div className="slidecontainer">
                    <form className="rate-comment-on-object" onSubmit={(e) => this.submitRate(e, commentId)}>
                        <input 
                            type="range"

                            min="0"
                            max="5000000"
                            value={commentRate || 0}
                            onChange={(e) => this.onChangeCommentRate(e, commentId)}

                            id="myRange"
                            className="slider"
                        />

                        <p>Value: <span>{ Number(commentRate / 1000000).toFixed(2) }</span></p>
                        
                        <button type="submit">Rate this comment</button>
                    </form>
                </div>
            )
        }
    }

    showForm() {
        document.getElementById("add-new-comment-button").style.display = "none";
        document.getElementById("add-new-comment-form-container").style.display = "block";
    }

    hideForm() {
        document.getElementById("add-new-comment-form-container").style.display = "none";
        document.getElementById("add-new-comment-button").style.display = "block";
        document.getElementById("media-preview-comment-on-post").innerHTML = "";
        document.getElementById('text-content-input-comment-on-pqb').innerText = "";
        this.setState({
            postCommentsFiles: {},
            tempUrls: [],
        })
    }

    showAddCommentButton() {
        if(this.state.showAddCommentButton) {
            return(
                <div id="add-new-comment-button" onClick={this.showForm}>
                    +
                </div>
            )
        }
    }
    
    submitRate(e, commentId) {
        e.preventDefault();

        const formInfo = {
            id: commentId,
            rate: this.state[commentId] / 1000000,
            sessionId: localStorage.getItem('e'),
        };

        axios.post(process.env.REACT_APP_SERVER_ADDRESS + '/update_comment_rate', formInfo)
            .then(res => {
                this.state.ratedComments.unshift(commentId);

                this.setState({
                    comments: this.state.comments.filter(comment => {
                        if(comment._id === commentId) {
                            comment.rate = res.data;
                            comment.rateNumber = comment.rateNumber + 1;
                            return comment
                        }
                        else {
                            return comment
                        }
                    })
                })
            })
            .catch(err => console.log(err));
    }

    submitComment(e) {
        e.preventDefault();

        const { client } = this.state;

        const fileData = new FormData();
        Object.keys(this.state.postCommentsFiles).map(index => {
            fileData.append("files", this.state.postCommentsFiles[index]);
        })

        fileData.append("sessionId", localStorage.getItem('e'));
        fileData.append("content", document.getElementById('text-content-input-comment-on-pqb').innerText);
        fileData.append("id", this.props.id);

        axios.post(process.env.REACT_APP_SERVER_ADDRESS + '/comment_on_' + this.state.commentOn, fileData, {
            headers: {
                'content-type': 'multipart/form-data'
            }
        })
            .then(response => {
                console.log(response.data);

                this.state.comments.unshift(response.data);
                this.state.ratedComments.unshift(response.data._id);

                const whichOne = this.props.commentOn[0].toUpperCase() + this.props.commentOn.substring(1,10);

                client.send(JSON.stringify({
                    type: 'addedCommentOn' + whichOne,
                    comment: response.data,
                    nickId: this.props.id,
                }));

                this.hideForm();
            })
            .catch(err => console.log(err));
    }

    render() {

        return(
            <div id="bjct-cmmnts-container">
                
                { this.showAddCommentButton() }

                <section>

                    {
                        this.showComments()
                    }

                </section>
            </div>
        )
    }
}