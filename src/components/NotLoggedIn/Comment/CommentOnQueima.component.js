import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

import ReactPlayer from 'react-player';
import Linkify from 'react-linkify';

import getUserUsername from '../../../functions/getUserUsername';

import CommentOnComment from './CommentOnComment.component';

import './CommentOnQueimaStyles.css';

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
        axios.post('http://localhost:5000/delete_comment', { id: props.id })
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

            <p>
                Comment rate: { Number(props.comment.rate.$numberDecimal).toFixed(2) }
            </p>

            <p>
                Number of rates: { props.comment.rateNumber }
            </p>
        </div>
    )
}

export default class CommentOnQueima extends Component {
    constructor(props) {
        super(props)

        this.handleChange = this.handleChange.bind(this);
        this.handleChangeFile = this.handleChangeFile.bind(this);
        this.onChangeCommentRate = this.onChangeCommentRate.bind(this);
        
        this.filterComments = this.filterComments.bind(this);

        this.showComments = this.showComments.bind(this);

        this.showCommentRatingSlider = this.showCommentRatingSlider.bind(this);

        this.showForm = this.showForm.bind(this);
        this.hideForm = this.hideForm.bind(this);

        this.submitRate = this.submitRate.bind(this);

        this.submitComment = this.submitComment.bind(this);

        this.state = {
            comment: '',
            queimaCommentsFiles: {},
            tempUrls: [],

            comments: [],

            ratedComments: [],

            showCommentComments: false,
            singleComment: {},
            showAddCommentButton: true,

            userUsername: '',
        }

    }

    componentDidMount() {

        this.setState({
            userUsername: getUserUsername(),
        })

        const formInfo = {
            queimaId: this.props.queimaId,
            sessionId: localStorage.getItem('e'),
        }

        axios.post('http://localhost:5000/get_queima_comments', formInfo)
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
        
        let queimaCommentsFiles_temp = this.state.queimaCommentsFiles;
        queimaCommentsFiles_temp[Object.keys(queimaCommentsFiles_temp).length] = file;

        this.setState({
            queimaCommentsFiles: queimaCommentsFiles_temp,
        }, () => {
            console.log(this.state.queimaCommentsFiles)
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
    
                        <CommentOnComment
                            commentId={singleComment._id}
                            level={0}
                        />
        
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
    
                        <CommentOnComment
                            commentId={singleComment._id}
                            level={0}
                        />
        
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
                                id="text-content-input-comment-on-object"
                                contentEditable="true"
                                name="comment"
                                //placeholder="What do you think of this?"
                            >
                                
                            </div>
                        </Linkify>
                        
                        <div>
                            <div id="media-preview-comment-on-post">

                            </div>

                            <label htmlFor="post-comments-files" id="post-comments-files-label">
                                +
                            </label>

                            <input 
                                type="file"
                                id="post-comments-files"
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
        document.getElementById('text-content-input-comment-on-object').innerText = "";
        this.setState({
            comment: '',
            queimaCommentsFiles: {},
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
            commentId: commentId,
            commentRate: this.state[commentId] / 1000000,
            sessionId: localStorage.getItem('e'),
        };

        axios.post('http://localhost:5000/update_comment_rate', formInfo)
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

        const fileData = new FormData();
        Object.keys(this.state.queimaCommentsFiles).map(index => {
            fileData.append("files", this.state.queimaCommentsFiles[index]);
        })

        fileData.append("sessionId", localStorage.getItem('e'));
        fileData.append("content", document.getElementById('text-content-input-comment-on-object').innerText);
        fileData.append("queimaId", this.props.queimaId);

        axios.post('http://localhost:5000/comment_on_queima', fileData, {
            headers: {
                'content-type': 'multipart/form-data'
            }
        })
            .then(response => {
                this.state.comments.unshift(response.data);
                this.state.ratedComments.unshift(response.data._id);

                this.hideForm();

                this.setState({});
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