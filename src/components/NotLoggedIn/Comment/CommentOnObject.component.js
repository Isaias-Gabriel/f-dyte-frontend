import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { w3cwebsocket as W3CWebSocket } from 'websocket';

import Linkify from 'react-linkify';

import getUserUsername from '../../../functions/getUserUsername';

import CommentOnComment from './CommentOnComment.component';

import './CommentOnObjectStyles.css';

import ShowMedia from '../ShowMedia/ShowMedia.component';

require('dotenv/config');

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
                <img 
                    className="profile-image"
                    src={props.comment.userProfilePictureUrl}
                    alt="profile"
                />
            </div>

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

export default class CommentOnObject extends Component {
    constructor(props) {
        super(props);
        
        this.handleChange = this.handleChange.bind(this);
        this.handleChangeFile = this.handleChangeFile.bind(this);
        this.onChangeCommentRate = this.onChangeCommentRate.bind(this);

        this.changeOfCommentSection = this.changeOfCommentSection.bind(this);

        this.onClickToShowComments = this.onClickToShowComments.bind(this);
        
        this.filterComments = this.filterComments.bind(this);

        this.showCommentatorLastPost = this.showCommentatorLastPost.bind(this);

        this.showComments = this.showComments.bind(this);

        this.showCommentRatingSlider = this.showCommentRatingSlider.bind(this);

        this.showForm = this.showForm.bind(this);
        this.hideForm = this.hideForm.bind(this);

        this.submitRate = this.submitRate.bind(this);

        this.submitComment = this.submitComment.bind(this);

        this.state = {
            comment: '',
            files: {},
            tempUrls: [],

            userCommentSection: '',

            comments: [],
            haterComments: [],
            commonComments: [],
            loverComments: [],
            commentId: '',

            commentsSection: undefined,

            haterLoaded: false,
            commonLoaded: false,
            loverLoaded: false,

            haterRatedComments: [],
            commonRatedComments: [],
            loverRatedComments: [],

            showCommentComments: false,
            singleComment: {},
            showAddCommentButton: true,

            userUsername: '',

            client: new W3CWebSocket('ws://127.0.0.1:8000/'),
        }

    }

    async componentDidMount() {

        const { client } = this.state; 

        client.onopen = () => {
            client.send(JSON.stringify({
                type: 'commentOnObjectConnection',
                sessionId: localStorage.getItem('e'),
                nickId: this.props.nickname,
            }))
            console.log('Websocket client - comment connected');
        };

        client.onmessage = (message) => {
            const dataFromServer = JSON.parse(message.data);
            
            //console.log(dataFromServer);
            const comment = dataFromServer.comment;

            //if it's not a comment from the user itself 
            //(if it is, the comment is already being saved and showed)
            if(!(comment.userUsername === this.state.userUsername)) {

                const currentCommentSection = comment.commentSection;
                const currentSection = this.state.commentsSection;
                const { haterLoaded, commonLoaded, loverLoaded } = this.state;

                if((currentCommentSection === currentSection) || 
                    (commonLoaded && currentCommentSection === "common") ||
                    (loverLoaded && currentCommentSection === "lover") ||
                    (haterLoaded && currentCommentSection === "hater")) {
                    this.state[ currentCommentSection + "Comments" ].unshift(comment);
                    
                    this.setState({
                        [ comment._id ]: 0,
                    })
                }
            }
        }

        this.setState({
            userUsername: await getUserUsername(),
        });
        
        if(this.props.data) {

            const comment = this.props.data[0];

            this.setState({
                showCommentComments: true,
                singleComment: comment,
                showAddCommentButton: false,
            })

            // const formInfo = {
            //     objectNickname: this.props.nickname,
            //     sessionId: localStorage.getItem('e'),
            // };
            
            // axios.post(process.env.REACT_APP_SERVER_ADDRESS + '/get_object_comments', formInfo)
            //     .then(res => {
    
                    const section = comment.commentSection;
    
                    document.getElementById(section + "-span").style.color = "#3131d1";
                    document.getElementById(section + "-span").style.fontSize = "21px";
                    
                    const commentsSection = section + "Comments";
                    const ratedCommentsBySection = section + "RatedComments";

                    this.setState({
                        commentsSection: section,
                    })
    
                    //this.setState({
                        //[ commentsSection ]: res.data.comments,
                        //[ section + "Loaded" ]: true,
    
                        //userCommentSection: section,
                    //     commentsSection: section,
    
                    //     [ ratedCommentsBySection ]: res.data.ratedComments,
                    // }, () => {
                    //     this.state[commentsSection].map(comment => {
    
                    //         this.setState({
                    //             [ comment._id ]: 0,
                    //         });
                    //     })
                    //})
        }

        else {
            const formInfo = {
                objectNickname: this.props.nickname,
                sessionId: localStorage.getItem('e'),
            };
            
            axios.post(process.env.REACT_APP_SERVER_ADDRESS + '/get_object_comments', formInfo)
                .then(res => {
    
                    const section = res.data.commentsSection;
    
                    document.getElementById(section + "-span").style.color = "#3131d1";
                    document.getElementById(section + "-span").style.fontSize = "21px";
                    
                    const commentsSection = section + "Comments";
                    const ratedCommentsBySection = section + "RatedComments";
    
                    this.setState({
                        [ commentsSection ]: res.data.comments,
                        [ section + "Loaded" ]: true,
    
                        userCommentSection: section,
                        commentsSection: section,
    
                        [ ratedCommentsBySection ]: res.data.ratedComments,
                    }, () => {
                        this.state[commentsSection].map(comment => {
    
                            this.setState({
                                [ comment._id ]: 0,
                            });
                        })
                    })
                })
                .catch(err => console.log(err));
        }
               
    }

    componentWillUnmount() {
        const { client } = this.state; 

        client.send(JSON.stringify({
            type: 'closeConnectionCommentOnObject',
            sessionId: localStorage.getItem('e'),
            nickId: this.props.nickname,
        }));

        client.close();
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

        const preview = document.getElementById("media-preview-comment-on-object");

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
        })
    }

    onChangeCommentRate(e, commentId) {
        this.setState({
            [ commentId ]: e.target.value,
        })
    }

    changeOfCommentSection(section) {
        const sectionList = ["hater", "common", "lover"];

        document.getElementById(section + "-span").style.color = "#3131d1";
        document.getElementById(section + "-span").style.fontSize = "21px";

        delete sectionList[sectionList.indexOf(section)];

        sectionList.map(sectionOnList => {
            document.getElementById(sectionOnList + "-span").style.color = "#d7d7fd";
            document.getElementById(sectionOnList + "-span").style.fontSize = "18px";
        })

        if(!(this.state[ section + "Loaded" ])) {

            const formInfo = {
                sessionId: localStorage.getItem('e'),
            };
            
            axios.post(process.env.REACT_APP_SERVER_ADDRESS + '/get_object_comments_by_section/' + 
            this.props.nickname + 
            '&' + section, formInfo)
            .then(resp => {
                
                const commentsSection = section + "Comments";
                const ratedCommentsBySection = section + "RatedComments";
                
                this.setState({
                    commentsSection: section,
                    [ commentsSection ]: resp.data.comments,
                    [ section + "Loaded" ]: true,

                    [ ratedCommentsBySection ]: resp.data.ratedComments,
                }, () => {
                    this.state[commentsSection].map(comment => {

                        this.setState({
                            [ comment._id ]: 0,
                        });
                    })
                })
            })
            .catch(err => console.log(err));
        }
        else {
            
            this.setState({
                commentsSection: section,
            })
        }
        
    }

    onClickToShowComments(comment) {
        const formInfo = {
            id: comment.userId,
        }

        axios.post(process.env.REACT_APP_SERVER_ADDRESS + '/get_last_post_from_evaluator', formInfo)
            .then(response => {

                this.setState({
                    lastCommentatorPost: response.data,

                    showCommentComments: true,
                    singleComment: comment,
                    showAddCommentButton: false,
                })
            })
            .catch(err => console.log(err));
        
    }

    filterComments(id, singleComment) {
        const section = this.state.commentsSection;

        this.setState({
            [ section + "Comments" ]: this.state[ section + "Comments" ].filter(comment => {
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

    showCommentatorLastPost() {
        
        if(Object.keys(this.state.lastCommentatorPost).length) {
            
            const post = this.state.lastCommentatorPost;
            
            return(
                <Link to={"/post/" + post._id}>
                    <div>
                        <div>
                            <div>
                                {
                                    <img className="post-profile-image" src={post.userProfilePictureUrl} alt="profile" />
                                }
                            </div>

                            <div>
                                { post.content.text }
                            </div>

                            <ShowMedia
                                url={post.content.urls[0]}
                            />
                        </div>
                    </div>
                </Link>
            )
        }   
    }

    showComments() {
        const commentsSection = this.state.commentsSection;
        const { userUsername } = this.state;

        let commentsSectionName = "comments";
        
        if(commentsSection){
            commentsSectionName = commentsSection + "Comments";
        }

        if(!(this.state.showCommentComments)) {
            return(
                <div className="cmmnts">
                    <div id="shw-cmmnts">
                        {
                            this.state[commentsSectionName].map(comment => {
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

                                            <button onClick={() => {this.onClickToShowComments(comment)}}>
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

                                            <button onClick={() => {this.onClickToShowComments(comment)}}>
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

                        { this.showCommentatorLastPost(singleComment.userId) }

                        <div id="shw-cmmnts">
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

                        { this.showCommentatorLastPost(singleComment.userId) }

                        <div id="shw-cmmnts">
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
        
        if(this.state.commentsSection === "common" || this.state.commentsSection === this.state.userCommentSection) {
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
                                <div id="media-preview-comment-on-object">

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
                                comment
                            </button>
                        </form>
                    </div>
                </div>

                
            )
        }
    }
    
    showCommentRatingSlider(commentId) {
        const section = this.state.commentsSection;
        const ratedCommentsBySection = section + "RatedComments";

        //if the user haven't rated the comment yet, it can rate if:
        //the comment is on the comment section, or the comment is on the haters section and 
        //the user is a hater or the comment is on the lovers section and
        //the user is a lover
        //first () checks if the user is allowed to rate according with the section
        //second () checks if the comment is rated
        if((this.state.commentsSection === "common" || this.state.commentsSection === this.state.userCommentSection) &&
            !(this.state[ratedCommentsBySection].includes(commentId))) {
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
                        
                        <button type="submit">
                            Rate this comment
                        </button>
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
        document.getElementById("media-preview-comment-on-object").innerHTML = "";
        document.getElementById('text-content-input-comment-on-object').innerText = "";
        this.setState({
            files: {},
            tempUrls: [],
        })
    }

    showAddCommentButton() {
        if((this.state.commentsSection === "common" || this.state.commentsSection === this.state.userCommentSection) && 
            (this.state.showAddCommentButton)) {
            return(
                <div id="add-new-comment-button" onClick={this.showForm}>
                    +
                </div>
            )
        }
    }
    
    submitRate(e, commentId) {
        e.preventDefault();
        
        const section = this.state.commentsSection;
        const { spot1Id, spot2Id, spot3Id } = this.props;
        const { client } = this.state; 

        let formInfo = {
            id: commentId,
            rate: this.state[commentId] / 1000000,
            sessionId: localStorage.getItem('e'),
        };

        axios.post(process.env.REACT_APP_SERVER_ADDRESS + '/update_comment_rate', formInfo)
            .then(res => {
                this.state[ section + "RatedComments" ].unshift(commentId);

                this.setState({
                    [ section + "Comments" ]: this.state[ section + "Comments" ].filter(comment => {
                        if(comment._id === commentId) {
                            comment.rate = res.data;
                            comment.rateNumber = comment.rateNumber + 1;
                            return comment
                        }
                        else {
                            return comment
                        }
                    })
                }, () => {
                    
                    formInfo = {
                        objectId: this.props.id,
                        objectRateNumber: this.props.rateNumber,
                        commentId: commentId,
                        commentOnSpot1Id: spot1Id,
                        commentOnSpot2Id: spot2Id,
                        commentOnSpot3Id: spot3Id,
                        rateInfo: Date.now(), 
                    }

                    axios.post(process.env.REACT_APP_SERVER_ADDRESS + '/comment_can_become_description', formInfo)
                        .then(response => {
                            console.log(response.data);
                            const responseArray = response.data;

                            if(responseArray[0]) {
                                // update object description and media
                                // put some listener with socket io on the object
                                // when the event happen here, send a request to the server
                                // to update the object description and/or media
                                // then the object component will listen to this change and update on the frontend

                                const formInfo = {
                                    objectId: this.props.id,
                                    commentId: commentId,
                                    spot: responseArray[1],
                                }
    
                                axios.post(process.env.REACT_APP_SERVER_ADDRESS + '/update_object_with_comment_content', formInfo)
                                    .then(response => {
                                        console.log(response.data);
    
                                        client.send(JSON.stringify({
                                            type: 'messageFromComments',
                                            object: response.data.object,
                                            objectNickname: this.props.nickname,
                                        }))

                                        client.send(JSON.stringify({
                                            type: 'notificationObjectUpdatedByComment',
                                            notification1: response.data.notification1,
                                            notification2: response.data.notification2,
                                            for1: response.data.for1,
                                            for2: response.data.for2,
                                        }))
                                    })
                                    .catch(err => console.log(err));
                            }

                        })
                        .catch(err => console.log(err));

                })
            })
            .catch(err => console.log(err));
    }

    submitComment(e) {
        e.preventDefault();

        const section = this.state.commentsSection;
        const { client } = this.state; 

        const fileData = new FormData();
        Object.keys(this.state.files).map(index => {
            fileData.append("files", this.state.files[index]);
        })

        fileData.append("sessionId", localStorage.getItem('e'));
        fileData.append("content", document.getElementById('text-content-input-comment-on-object').innerText);
        fileData.append("objectId", this.props.id);
        fileData.append("commentSection", section);

        axios.post(process.env.REACT_APP_SERVER_ADDRESS + '/comment_on_object', fileData, {
            headers: {
                'content-type': 'multipart/form-data'
            }
        })
            .then(response => {
                console.log(response.data);
                this.state[ section + "Comments" ].unshift(response.data);
                this.state[ section + "RatedComments" ].unshift(response.data._id);

                if(client) {
                    client.send(JSON.stringify({
                        type: 'addedCommentOnObject',
                        comment: response.data,
                        nickId: this.props.nickname,
                    }));
                }

                this.hideForm();
            })
            .catch(err => console.log(err));

    }

    render() {
        
        return(
            <div id="bjct-cmmnts-container">
                
                
                    {/* <button onClick={
                        () => {
                            
                        }
                    }>
                        Send message
                    </button> */}
                
                { this.showAddCommentButton() }

                <section>
                    <section id="rcl-selection-section">
                        <span onClick={() => {this.changeOfCommentSection("hater")}} id="hater-span">
                            H A T E R S
                        </span>

                        <span onClick={() => {this.changeOfCommentSection("common")}} id="common-span">
                            C O M M O N
                        </span>

                        <span onClick={() => {this.changeOfCommentSection("lover")}} id="lover-span">
                            L O V E R S
                        </span>
                    </section>

                    <div id="common-comments-presentation-container">
                        <span>
                            C O M M O N
                        </span>
                    </div>

                    {
                        this.showComments()
                    }

                </section>
            </div>
        )
    }
}