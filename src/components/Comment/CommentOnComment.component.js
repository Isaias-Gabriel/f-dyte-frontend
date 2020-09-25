import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { w3cwebsocket as W3CWebSocket } from 'websocket';

import ReactPlayer from 'react-player';
import Linkify from 'react-linkify';

import getUserUsername from '../../functions/getUserUsername';

import './CommentOnCommentStyles.css';

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
                        { `${props.comment.content.text}` }
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

            <Link to={"/redirect_to_comment/" + props.comment._id}>
                <p>
                    Comment rate: { Number(props.comment.rate.$numberDecimal).toFixed(2) }
                </p>

                <p>
                    Number of rates: { props.comment.rateNumber }
                </p>
            </Link>
        </div>
    )
}

export default class CommentOnComment extends Component {
    constructor(props) {
        super(props)

        this.handleChange = this.handleChange.bind(this);
        this.handleChangeFile = this.handleChangeFile.bind(this);
        this.onChangeCommentRate = this.onChangeCommentRate.bind(this);

        this.filterComments = this.filterComments.bind(this);

        this.howToShowComments = this.howToShowComments.bind(this);

        this.showButtons = this.showButtons.bind(this);
        
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

            showCommentComments: false,
            singleComment: {},

            comments: [],

            ratedComments: [],

            showAddCommentButton: true,
            
            userUsername: '',

            showShowCommentsButton: false,
        }

    }

    async componentDidMount() {

        console.log(this.props);

        const client = new W3CWebSocket('ws://127.0.0.1:8000/');

        this.setState({
            client: client,
        });

        client.onopen = () => {
            client.send(JSON.stringify({
                type: 'commentOnCommentConnection',
                sessionId: localStorage.getItem('e'),
                nickId: this.props.commentId,
            }))
            console.log('Websocket client - comment on comment connected');
        };

        client.onmessage = (message) => {
            const dataFromServer = JSON.parse(message.data);
            
            const comment = dataFromServer.comment;

            //console.log("comment from web socket", comment)
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
        })


        if(this.props.level === 4) {
            this.setState({
                showAddCommentButton: false,
            }, () => {
                
            })
        }

        const { data } = this.props;

        if(data) {
            if(data.length === 1) {
                this.setState({
                    showShowCommentsButton: true,
                })
            }

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
        }

        else {
            const formInfo = {
                commentId: this.props.commentId,
                sessionId: localStorage.getItem('e'),
            }
    
            axios.post(process.env.REACT_APP_SERVER_ADDRESS + '/get_comment_comments', formInfo)
                .then(response => {
    
                    this.setState({
                        comments: response.data.comments,
                        ratedComments: response.data.ratedComments,
                    }, () => {
                        this.state.comments.map(comment => {
                            this.setState({
                                [ comment._id ]: 0,
                            });
                        })
    
                    })
    
                })
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

        const preview = document.getElementById("media-preview-comment-on-comment");

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
            if(this.state.showShowCommentsButton) {
                if(this.state.clicked) {
                    return(
                        <CommentOnComment
                            commentId={id}
                            level={this.props.level + 1}
                        />
                    )
                }
                else {
                    return(
                        <button onClick={() => {
                            this.setState({
                                clicked: true,
                            })
                        }}>
                            Show comments
                        </button>
                    )
                }
            }

            else {
                const auxData = data.slice();
                auxData.shift();

                if(auxData.length) {
                    return(
                        <CommentOnComment
                            data={auxData}
        
                            commentId={id}
                            level={this.props.level + 1}
                        />
                    )
                }
            }
        }

        else {
            return(
                <CommentOnComment
                    commentId={id}
                    level={this.props.level + 1}
                />
            )
        }
    }

    showButtons() {
        if(!(this.props.data)) {
            return(
                <button onClick={() => {
                        this.setState({
                            showCommentComments: false,
                            singleComment: {},
                            showAddCommentButton: true,
                        })
                }}>
                    Go back
                </button>
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
                            
                            { this.showButtons() }

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
                            
                            { this.showButtons() }
    
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
                                id="text-content-input-comment-on-comment"
                                contentEditable="true"
                                name="comment"
                                //placeholder="What do you think of this?"
                            >
                                
                            </div>
                        </Linkify>
                        
                        <div>
                            <div id="media-preview-comment-on-comment">

                            </div>

                            <label htmlFor="comment-on-comments-files" id="comment-on-comments-files-label">
                                +
                            </label>

                            <input 
                                type="file"
                                id="comment-on-comments-files"
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

                            //id="myRange"
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
        document.getElementById("media-preview-comment-on-comment").innerHTML = "";
        document.getElementById('text-content-input-comment-on-comment').innerText = "";
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

                if(this.state.showCommentComments) {
                    const { singleComment } = this.state;

                    singleComment.rate = res.data;
                    singleComment.rateNumber = singleComment.rateNumber + 1;

                    this.setState({
                        singleComment: singleComment,
                    })
                }

                else {
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
                }
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
        fileData.append("content", document.getElementById('text-content-input-comment-on-comment').innerText);
        fileData.append("commentId", this.props.commentId);

        axios.post(process.env.REACT_APP_SERVER_ADDRESS + '/comment_on_comment', fileData, {
            headers: {
                'content-type': 'multipart/form-data'
            }
        })
            .then(response => {
                console.log(response.data)
                this.state.comments.unshift(response.data.comment);
                this.state.ratedComments.unshift(response.data.comment._id);

                client.send(JSON.stringify({
                    type: 'addedCommentOnComment',
                    comment: response.data.comment,
                    nickId: this.props.commentId,
                }));

                if(response.data.notification) {

                    client.send(JSON.stringify({
                        type: 'notificationCommentOnCommentAdded',
                        sessionId: localStorage.getItem('e'),
                        notification: response.data.notification,
                        for: response.data.for,
                    }))
                }

                this.hideForm();
            })
            .catch(err => console.log(err));
    }

    render() {

        return(
            <div className="cmmn-cmmn-container">
                
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