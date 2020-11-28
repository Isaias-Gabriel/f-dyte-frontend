import React, { Component } from 'react';
import { Redirect, Link } from 'react-router-dom';
import Linkify from 'react-linkify';
import axios from 'axios';

import { FaRegCommentAlt } from 'react-icons/fa';
import { MdClose } from 'react-icons/md';
import { IoMdSend } from 'react-icons/io';
import { RiDeleteBin6Line } from 'react-icons/ri';

import ReturnReferenceAsLink from 
    '../ReturnReferenceAsLink/ReturnReferenceAsLink.component';
    
import RateType1 from '../RatingSlider/RateType1.component';
import RatingSlider from '../RatingSlider/RatingSlider.component';

import ShowMediaAndContent from '../ShowMediaAndContent/ShowMediaAndContent.component';

import loadingIcon from '../../assets/loading-infinity-icon.svg';

import './styles.css';

require('dotenv/config');

export default class ShowAndPostComments extends Component {
    constructor(props) {
        super(props);

        this.handleChange = this.handleChange.bind(this);
        
        this.showDeleteDiv = this.showDeleteDiv.bind(this);
        this.hideDeleteDiv = this.hideDeleteDiv.bind(this);

        this.deleteComment = this.deleteComment.bind(this);

        this.loadComments = this.loadComments.bind(this);

        this.showEditableDiv = this.showEditableDiv.bind(this);

        this.sendComment = this.sendComment.bind(this);

        this.onClickCloseAddCommentButton = this.onClickCloseAddCommentButton.bind(this);

        this.onClickToShowReplies = this.onClickToShowReplies.bind(this);
        this.hideReplies = this.hideReplies.bind(this);

        this.editableDivCaption = React.createRef();
        this.editableDivContainer = React.createRef();

        this.deleteDiv = React.createRef();

        this.showCommentDivButton = React.createRef();

        this.formDiv = React.createRef();
        this.textarea = React.createRef();
        this.showFormDiv = React.createRef();
        
        this.state = {
            comment: '',

            comments: [],
            ratedComments: [],

            clicked: true,

            controlId: this.props.id,
            controlType: this.props.type,
            controlCaption: 'Add a comment',
            
            replyOnInnerComment: false,

            redirectTo: null,

            loaded: false,

            staticText: {
                'pt-BR': {
                    yes: 'Sim',
                    no: 'Não',
                    optionsDelete: 'Deletar',

                    noCommentsMessage: "Ninguém comentou ainda ' -'",

                    placeholder: 'Comente algo :D',
                    placeholderReply: 'Responda @',

                    showReply: 'mostrar respostas',
                    hideReply: 'esconder respostas',
                },
                'en-US': {
                    yes: 'Yes',
                    no: 'No',
                    optionsDelete: 'Delete',

                    noCommentsMessage: "Nobody has commented yet ' -'",

                    placeholder: 'Comment something :D',
                    placeholderReply: 'Reply to @',

                    showReply: 'show replies',
                    hideReply: 'hide replies',
                },
            }
        }
    }

    componentDidMount() {
        const formInfo = {
            id: this.props.id,
            sessionId: localStorage.getItem('e'),
        }

        axios.post(process.env.REACT_APP_SERVER_ADDRESS + '/get_' + this.props.type + '_comments', formInfo)
            .then(response => {

                this.setState({
                    comments: response.data.comments,
                    ratedComments: response.data.ratedComments,

                    clicked: true,
                    loaded: true,
                }, () => {
                    let formInfo

                    this.state.comments.map(comm => {
                        if(1 <= comm.comments.length <= 3) {
                            formInfo = {
                                id: comm._id,
                                sessionId: localStorage.getItem('e'),
                            }
                    
                            axios.post(process.env.REACT_APP_SERVER_ADDRESS + '/get_comment_comments', formInfo)
                                .then(response => {
                                    this.setState({
                                        [ comm._id + "Comments" ]: response.data.comments,
                                        [ comm._id + "RatedComments" ]: response.data.ratedComments,
                                        [ comm._id + "Length" ]: comm.comments.length,
                                    })
                                })
                                .catch(err => console.log(err));
                        }

                        else {
                            this.setState({
                                [ comm._id + "Length" ]: comm.comments.length,
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

    handleChange = e => {
        this.setState({
            [ e.target.name ]: e.target.value
        })
    }

    showDeleteDiv(id) {
        this.deleteDiv.current.style.display = "block";

        this.setState({
            commentToDeleteId: id,
        })
    }

    hideDeleteDiv() {
        this.deleteDiv.current.style.display = "none";
    }
    
    deleteComment() {
        axios.post(process.env.REACT_APP_SERVER_ADDRESS + '/delete_comment', { id: this.state.commentToDeleteId })
            .then(() => {
                const id = this.state.commentToDeleteId;
                
                this.setState({
                    comments: this.state.comments.filter(comment => {
                        if(!(comment._id === id)) {
                            return comment
                        }
                    })
                }, () => {
                    this.hideDeleteDiv();
                })
            })
            .catch(err => console.log(err));
    }

    loadComments() {

        const formInfo = {
            id: this.props.id,
            sessionId: localStorage.getItem('e'),
        }

        axios.post(process.env.REACT_APP_SERVER_ADDRESS + '/get_' + this.props.type + '_comments', formInfo)
            .then(response => {

                this.setState({
                    comments: response.data.comments,
                    ratedComments: response.data.ratedComments,

                    clicked: true,
                }, () => {
                    let formInfo

                    this.state.comments.map(comm => {
                        if(1 <= comm.comments.length <= 3) {
                            formInfo = {
                                id: comm._id,
                                sessionId: localStorage.getItem('e'),
                            }
                    
                            axios.post(process.env.REACT_APP_SERVER_ADDRESS + '/get_comment_comments', formInfo)
                                .then(response => {
                                    this.setState({
                                        [ comm._id + "Comments" ]: response.data.comments,
                                        [ comm._id + "RatedComments" ]: response.data.ratedComments,
                                        [ comm._id + "Length" ]: comm.comments.length,
                                    })
                                })
                                .catch(err => console.log(err));
                        }

                        else {
                            this.setState({
                                [ comm._id + "Length" ]: comm.comments.length,
                            })
                        }
                    })
                })
            })
            .catch(err => console.log(err));
        
    }

    showRatingSlider(id) {
        if(!(this.state.ratedComments.includes(id))) {
            return <RatingSlider id={id} type={'comment'} />;
        }
    }

    showEditableDiv() {
        
        this.editableDivContainer.current.style.display = "block";
        this.textarea.current.focus();
        this.editableDivCaption.current.innerText = 'Add a comment';
        this.showCommentDivButton.current.style.display = "none";

        this.setState({
            controlId: this.props.id,
            controlType: this.props.type,
            controlCaption: 'Add a comment',
        })
    }

    showEditableDivForComment(id, username) {
        
        this.editableDivContainer.current.style.display = "block";
        this.textarea.current.focus();
        this.editableDivCaption.current.innerText = 'Reply to @' + username;
        this.showCommentDivButton.current.style.display = "none";

        this.setState({
            controlId: id,
            controlType: 'comment',
            controlCaption: 'Reply to @' + username,
        })
    }

    showEditableDivForComment(id, username) {
        
        this.editableDivContainer.current.style.display = "block";
        this.textarea.current.focus();
        this.editableDivCaption.current.innerText = 'Reply to @' + username;
        this.showCommentDivButton.current.style.display = "none";

        this.setState({
            controlId: id,
            controlType: 'comment',
            controlCaption: 'Reply to @' + username,
        })
    }

    sendComment(e) {
        e.preventDefault();

        const { comment } = this.state;

        console.log('submitted');

        if(!comment.trim().length) {
            this.setState({
                comment: comment.trim(),
            })
        }

        else {

            if(this.showFormDiv.current) {
                this.showFormDiv.current.style.display = 'block';
                this.textarea.current.placeholder = "Comment something :D";
                this.formDiv.current.style.display = 'none';
            }

            //if the user is commenting on another comment
            if(this.state.replyOnInnerComment) {
                const formInfo = {
                    sessionId: localStorage.getItem('e'),
                    content: '@' + this.state.replyedUserUsername + ' ' + comment,
                    replyedUserUsername: this.state.replyedUserUsername,
                    parentId: this.state.controlId,
                };
                
                this.editableDivContainer.current.style.display = "none";
                this.showCommentDivButton.current.style.display = "inline-block";

                this.setState({
                    replyOnInnerComment: false,
                    comment: '',
                })

                console.log(formInfo);

                axios.post(process.env.REACT_APP_SERVER_ADDRESS + '/reply_on_for_you_inner_comment', formInfo)
                    .then(response => {
                        console.log(response.data);

                        let tempComms = this.state[ this.state.controlId ] || [];
                        let tempRatedComms = this.state[ this.state.controlId + "RatedComments" ] || [];
                        let tempCommsLen = this.state[this.state.controlId + "Length"] || 0;

                        tempComms.unshift(response.data.comment);
                        tempRatedComms.unshift(response.data.comment._id);
                        
                        this.setState({
                            replyOnInnerComment: false,

                            [ this.state.controlId ]: tempComms,
                            [ this.state.controlId + "RatedComments" ]: tempRatedComms,
                            [ this.state.controlId + "Length" ]: tempCommsLen + 1,
                        })
                    })
                    .catch(err => console.log(err));
            }

            //if the user is commenting on a post/queima/belle/object/outter comment
            else {
                const formInfo = {
                    sessionId: localStorage.getItem('e'),
                    content: comment,
                    id: this.state.controlId,
                };

                this.setState({
                    comment: '',
                })

                axios.post(process.env.REACT_APP_SERVER_ADDRESS + '/comment_on_' + this.state.controlType, formInfo)
                    .then(response => {
                        console.log(response.data);

                        //if the user is commenting on the post/queima/belle/object
                        if((this.state.controlId === this.props.id) && (this.state.controlType === this.props.type)) {
                            this.state.comments.unshift(response.data);

                            this.setState({});
                        }
                        
                        //if the user is commenting on an outter comment
                        else {
                            let tempComments = this.state[ this.state.controlId + "Comments" ] || [];
                            let tempRatedComments = this.state[ this.state.controlId + "RatedComments" ] || [];
                            let tempCommentsLen = this.state[this.state.controlId + "Length"] || 0;

                            tempComments.unshift(response.data.comment);
                            tempRatedComments.unshift(response.data.comment._id);

                            this.setState({
                                [ this.state.controlId + "Comments" ]: tempComments,
                                [ this.state.controlId + "RatedComments" ]: tempRatedComments,
                                [ this.state.controlId + "Length" ]: tempCommentsLen + 1,
                            })
                        }
                    })
                    .catch(err => console.log(err));
            }
        }
    }

    onClickCloseAddCommentButton() {
        this.editableDivContainer.current.style.display = "none";
        this.showCommentDivButton.current.style.display = "inline-block";
    }

    onClickToShowReplies(id) {
        const formInfo = {
            id: id,
            sessionId: localStorage.getItem('e'),
        }
        
        axios.post(process.env.REACT_APP_SERVER_ADDRESS + '/get_comment_comments', formInfo)
            .then(response => {
                this.setState({
                    [ id ]: response.data.comments,
                    [ id + "RatedComments" ]: response.data.ratedComments,
                    [ id + "Clicked" ]: true,
                })
            })
            .catch(err => console.log(err));
    }

    hideReplies(id) {
        this.setState({
            [ id + "Clicked" ]: false,
        })
    }

    redirectTo(id) {
        this.setState({
            redirectTo: '/comment/' + id
        })
    }

    innerComments(id, comms, clicked, commsLength, ratedComments) {
        function showRatingSlider(id) {
            if(!(ratedComments.includes(id))) {
                return <RatingSlider id={id} type={'comment'} />;
            }
        }

        if(commsLength) {
            if((1 <= comms.length) && (comms.length <= 3)) {
                return(
                    <div className="cmm-n-cmm-shwandpst-container">
                        <div>
                            {
                                comms.map(comm => {
                                    return(
                                        <div key={comm._id}>
                                            <div
                                                className="cmmwprgnrspc-fy"
                                                onClick={() => {
                                                    this.redirectTo(comm._id);
                                                }}
                                            >
                                                <ShowMediaAndContent resource={comm} />
                                            </div>
    
                                            <div>
                                                <div>
                                                    {
                                                        showRatingSlider(comm._id)
                                                    }
    
                                                    <button className="rtstr-button" onClick={() => {
                                                        this.setState({
                                                            replyOnInnerComment: true,
                                                            replyedId: comm._id,
                                                            replyedUserUsername: comm.userUsername,
                                                        }, () => {
                                                            this.showEditableDivForComment(id, comm.userUsername);
                                                        })
                                                    }}>
                                                        <FaRegCommentAlt className="ccn-spcts" />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    )
                                })
                            }
                        </div>
                    </div>
                )
            }
    
            else {
                if(clicked) {
                    return(
                        <div>
                            <button onClick={() => {
                                this.hideReplies(id)
                            }}>
                                hide replies
                            </button>
    
                            <div className="cmm-n-cmm-shwandpst-container">
                                <div>
                                    {
                                        comms.map(comm => {
                                            return(
                                                <div key={comm._id}>
                                                    <div
                                                        className="cmmwprgnrspc-fy"
                                                        onClick={() => {
                                                            this.redirectTo(comm._id);
                                                        }}
                                                    >
                                                        <ShowMediaAndContent resource={comm} />
                                                    </div>
            
                                                    <div>
                                                        <div>
                                                            {
                                                                showRatingSlider(comm._id)
                                                            }
            
                                                            <button className="rtstr-button" onClick={() => {
                                                                this.setState({
                                                                    replyOnInnerComment: true,
                                                                    replyedId: comm._id,
                                                                    replyedUserUsername: comm.userUsername,
                                                                }, () => {
                                                                    this.showEditableDivForComment(id, comm.userUsername);
                                                                })
                                                            }}>
                                                                <FaRegCommentAlt className="ccn-spcts" />
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            )
                                        })
                                    }
                                </div>
                            </div>
                        </div>
                    )
                }
    
                else {
                    return (
                        <button onClick={() => {
                            this.onClickToShowReplies(id)
                        }}>
                            show replies ({ commsLength })
                        </button>
                    );
                }
            }
        }
    
        else {
            return '';
        }
    }

    render() {
        
        const {
            comments,
            comment,
            loaded,

            staticText,
        } = this.state;

        // console.log(this.state);

        if(this.state.redirectTo) {
            return <Redirect to={this.state.redirectTo} />
        }

        if(!loaded) {
            return(
                <div className="comment-outter-container">
                    <div className="comment-inner-container">
                        <div className="loading-icon-outter-container">
                            <img
                                src={loadingIcon}
                                alt="Loading"
                            />
                        </div>
                    </div>
                </div>
            )
        }

        if(comments.length) {
            return(
                <div className="comment-outter-container">
                    <button className="comment-close-button-outter-container"
                        onClick={() => {
                            this.props.setComponentToNull()
                        }}
                    >
                        <MdClose />
                    </button>

                    <div className="comment-inner-container">
                        <div className="comment-comments-outter-container">
                            {
                                comments.map((comment, index) => {

                                    // console.log(comment._id);
                                    // console.log((this.state[ comment._id + "Length" ]) ? true : false);

                                    return (
                                        <div className="comment-single-comment-outter-container" key={index}>
                                            <div className="show-media-and-content-header-outter-container">
                                                <div
                                                    className="comment-single-comment-profile-picture-container"
                                                    style={{
                                                        backgroundImage: `url(${comment.userProfilePictureUrl})`
                                                    }}
                                                >
                                                </div>

                                                <div className="comment-single-comment-name-and-username-outter-container">
                                                    <div className="comment-single-comment-name-outter-container">
                                                        <Link to={"/profile/" + comment.userUsername}>
                                                            { comment.userName }
                                                        </Link>
                                                    </div>

                                                    <div className="comment-single-comment-username-outter-container">
                                                        <Link to={"/profile/" + comment.userUsername}>
                                                            @{ comment.userUsername }
                                                        </Link>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="comment-single-comment-content-outter-container">
                                                <Linkify>
                                                    { `${comment.content.text}` }
                                                </Linkify>
                                            </div>

                                            <div className="comment-single-comment-rate-and-comment-outter-container ">
                                                <RateType1
                                                    rate={comment.rate.$numberDecimal}
                                                    rateNumber={comment.rateNumber}
                                                    isRated={this.state.ratedComments.includes(comment._id) ? true: false}

                                                    type={comment.type}
                                                    id={comment._id}
                                                />

                                                <div className="comment-single-comment-main-icon">
                                                    <FaRegCommentAlt
                                                        onClick={() => {
                                                            this.showFormDiv.current.style.display = 'none';
                                                            this.textarea.current.placeholder = (
                                                                (staticText[localStorage.getItem('language')]) ?
                                                                staticText[localStorage.getItem('language')].placeholderReply
                                                                :
                                                                staticText['en-US'].placeholderReply
                                                            ) + comment.userUsername;
                                                            this.formDiv.current.style.display = 'flex';

                                                            this.setState({
                                                                controlId: comment._id,
                                                                controlType: 'comment',
                                                            })
                                                        }}
                                                    />
                                                </div>
                                            </div>

                                            {
                                                (this.state[ comment._id + "Length" ]) ?
                                                (
                                                    <div className="comment-replies-outter-container">
                                                        <div
                                                            className="comment-replies-number-outter-container"
                                                            id={'comment-replies-number-outter-container-' + index}
                                                            onClick={() => {

                                                                console.log((!document.getElementById('comment-replies-inner-container-1-' + index) ||
                                                                (document.getElementById('comment-replies-inner-container-1-' + index).style.display === 'none' || 
                                                                document.getElementById('comment-replies-inner-container-1-' + index).style.display === '')))

                                                                if(document.getElementById('comment-replies-inner-container-1-' + index).style.display === 'none' || 
                                                                    document.getElementById('comment-replies-inner-container-1-' + index).style.display === '') {
                                                                    document.getElementById('comment-replies-inner-container-1-' + index).style.display = 'flex';
                                                                    document.getElementById('comment-replies-number-outter-container-' + index).innerText = 
                                                                    (
                                                                        (staticText[localStorage.getItem('language')]) ?
                                                                        staticText[localStorage.getItem('language')].hideReply
                                                                        :
                                                                        staticText['en-US'].hideReply
                                                                    );
                                                                }

                                                                else {
                                                                    document.getElementById('comment-replies-inner-container-1-' + index).style.display = 'none';
                                                                    document.getElementById('comment-replies-number-outter-container-' + index).innerText = 
                                                                        (
                                                                            (staticText[localStorage.getItem('language')]) ?
                                                                            staticText[localStorage.getItem('language')].showReply + ` (${this.state[ comment._id + "Length" ]})`
                                                                            :
                                                                            staticText['en-US'].showReply + ` (${this.state[ comment._id + "Length" ]})`
                                                                        )
                                                                }
                                                            }}
                                                        >
                                                            {
                                                                (!document.getElementById('comment-replies-inner-container-1-' + index) ||
                                                                (document.getElementById('comment-replies-inner-container-1-' + index).style.display === 'none' || 
                                                                document.getElementById('comment-replies-inner-container-1-' + index).style.display === ''))
                                                                ?
                                                                (
                                                                    (staticText[localStorage.getItem('language')]) ?
                                                                    staticText[localStorage.getItem('language')].showReply + ` (${this.state[ comment._id + "Length" ]})`
                                                                    :
                                                                    staticText['en-US'].showReply + ` (${this.state[ comment._id + "Length" ]})`
                                                                )
                                                                :
                                                                (
                                                                    (staticText[localStorage.getItem('language')]) ?
                                                                    staticText[localStorage.getItem('language')].hideReply
                                                                    :
                                                                    staticText['en-US'].hideReply
                                                                )
                                                            }
                                                        </div>

                                                        <div
                                                            className="comment-replies-inner-container-1"
                                                            id={'comment-replies-inner-container-1-' + index}
                                                        >
                                                            <div className="comment-replies-vertical-rectangle-outter-container">
                                                                <div></div>
                                                            </div>
                                                            <div className="comment-replies-inner-container-2">
                                                                {
                                                                    this.state[ comment._id + "Comments" ].map((reply, index1) => {
                                                                        return (
                                                                            <div className="comment-reply-outter-container" key={`${index}-${index1}`}>
                                                                                <div className="show-media-and-content-header-outter-container">
                                                                                    <div
                                                                                        className="comment-reply-profile-picture-container"
                                                                                        style={{
                                                                                            backgroundImage: `url(${reply.userProfilePictureUrl})`
                                                                                        }}
                                                                                    >
                                                                                    </div>

                                                                                    <div className="comment-reply-name-and-username-outter-container">
                                                                                        <div className="comment-reply-name-outter-container">
                                                                                            <Link to={"/profile/" + reply.userUsername}>
                                                                                                { reply.userName }
                                                                                            </Link>
                                                                                        </div>

                                                                                        <div className="comment-reply-username-outter-container">
                                                                                            <Link to={"/profile/" + reply.userUsername}>
                                                                                                @{ reply.userUsername }
                                                                                            </Link>
                                                                                        </div>
                                                                                    </div>
                                                                                </div>

                                                                                <div className="comment-reply-content-outter-container">
                                                                                    <Linkify>
                                                                                        { `${reply.content.text}` }
                                                                                    </Linkify>
                                                                                </div>

                                                                                <div className="comment-reply-rate-and-comment-outter-container ">
                                                                                    <RateType1
                                                                                        rate={reply.rate.$numberDecimal}
                                                                                        rateNumber={reply.rateNumber}
                                                                                        isRated={this.state[comment._id + "RatedComments"].includes(reply._id) ? true: false}

                                                                                        type={reply.type}
                                                                                        id={reply._id}
                                                                                    />

                                                                                    <div className="comment-reply-main-icon">
                                                                                        <FaRegCommentAlt
                                                                                            // onClick={() => {
                                                                                            //     this.showFormDiv.current.style.display = 'none';
                                                                                            //     this.textarea.current.placeholder = 'Reply to @' + reply.userUsername;
                                                                                            //     this.formDiv.current.style.display = 'flex';

                                                                                            //     this.setState({
                                                                                            //         controlId: reply._id,
                                                                                            //         controlType: 'comment',
                                                                                            //     })
                                                                                            // }}
                                                                                        />
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                        )
                                                                    })
                                                                }
                                                            </div>
                                                        </div>
                                                    </div>
                                                )
                                                :
                                                ''
                                            }
                                        </div>
                                    )
                                })
                            }
                        </div>
                    </div>

                    <div className="comment-form-outter-container" ref={this.formDiv}>
                        <button className="comment-form-close-button-outter-container">
                            <MdClose
                                onClick={() => {
                                    this.showFormDiv.current.style.display = 'block';
                                    this.formDiv.current.style.display = 'none';
                                    this.textarea.current.placeholder = (
                                        (staticText[localStorage.getItem('language')]) ?
                                        staticText[localStorage.getItem('language')].placeholder
                                        :
                                        staticText['en-US'].placeholder
                                    );
                                }}
                            />
                        </button>

                        <form onSubmit={this.sendComment}>
                            <textarea
                                type="text"
                                name="comment"

                                placeholder={
                                    (staticText[localStorage.getItem('language')]) ?
                                    staticText[localStorage.getItem('language')].placeholder
                                    :
                                    staticText['en-US'].placeholder
                                }

                                ref={ this.textarea }
                                
                                required
                                minLength="3"
                                maxLength="547"

                                value={comment}
                                onChange={this.handleChange}
                            />

                            <button
                                type="submit"
                            >
                                <IoMdSend />
                            </button>
                        </form>
                    </div>

                    <div className="comment-add-comment-icon-outter-container" ref={this.showFormDiv}>
                        <FaRegCommentAlt
                            onClick={() => {
                                this.showFormDiv.current.style.display = 'none';
                                this.formDiv.current.style.display = 'flex';
                            }}
                        />
                    </div>
                </div>
                // <div className="comment-outter-container">
                //     <div className="delete-warning-container" ref={this.deleteDiv}>
                //         <div>
                //             Delete comment?
                //         </div>

                //         <div>
                //             You can't retrieve this comment after it is deleted.
                //         </div>

                //         <div>
                //             <button onClick={this.deleteComment}>
                //                 Yes
                //             </button>

                //             <button onClick={this.hideDeleteDiv}>
                //                 No
                //             </button>
                //         </div>
                //     </div>

                //     <div>
                //         <div>

                //             <button className="rtstr-button cl" onClick={() => {
                //                 this.setState({
                //                     clicked: false,
                //                 }, () => {
                //                     this.state = {};
                //                 })
                //             }}>
                //                 <MdClose className="ccn-spcts" />
                //             </button>

                //             <div className="message-outter-container">
                //                 <div>
                //                     {
                //                         comments.map((comm, index) => {
                //                         //console.log(comm._id);
                //                         //if(comm.type === 'comment') {
                //                             return (
                //                                 <div key={comm._id} className="fy-cmmnt-container" >
                //                                     <button className="dlt-cmmnt-bt-fy" onClick={() => {
                //                                         this.showDeleteDiv(comm._id)
                //                                     }}>
                //                                         <RiDeleteBin6Line className="dlt-cmmnt-ico-fy" />
                //                                     </button>

                //                                     <div
                //                                         className="cmmwprgnrspc-fy"
                //                                         onClick={() => {
                //                                             this.redirectTo(comm._id);
                //                                         }}
                //                                     >
                //                                         <ShowMediaAndContent
                //                                             resource={comm}
                //                                             type={comm.type}
                //                                             index={index}
                //                                         />
                //                                     </div>

                //                                     <div>
                //                                         <div>
                //                                             {
                //                                                 this.showRatingSlider(comm._id)
                //                                             }

                //                                             <button className="rtstr-button" onClick={() => {
                //                                                 this.showEditableDivForComment(comm._id, comm.userUsername);
                //                                             }}>
                //                                                 <FaRegCommentAlt className="ccn-spcts" />
                //                                             </button>
                //                                         </div>
                //                                     </div>

                //                                     {
                //                                         //id, comms, clicked, commsLength, ratedComments
                //                                         this.innerComments(
                //                                             comm._id, this.state[comm._id] || [],
                //                                             this.state[comm._id + "Clicked"] || false, this.state[comm._id + "Length"]
                //                                             || comm.comments.length,
                //                                             this.state[comm._id + "RatedComments"] || [])
                //                                     }
                                                    
                //                                     {/* <InnerComments
                //                                         id={comm._id}
                //                                         comms={this.state[comm._id] || []}
                                                        
                //                                         clicked={this.state[comm._id + "Clicked"] || false}
                //                                         commsLength={comm.comments.length}
                                                        
                //                                         ratedComments={this.state[comm._id + "RatedComments"] || []}

                //                                         showEditableDivForComment={this.showEditableDivForComment}

                //                                         onClick={this.onClickToShowReplies}
                //                                         hideReplies={this.hideReplies}
                //                                     /> */}

                //                                 </div>
                //                             )
                //                         })
                //                     }
                //                 </div>
                //             </div>

                //             <div className="comment-on-for-you-editable-container"  ref={ this.editableDivContainer }>
                //                 <button className="rtstr-button cl" onClick={this.onClickCloseAddCommentButton}>
                //                     <MdClose className="ccn-spcts" />
                //                 </button>

                //                 <div className="comment-on-for-you-editable-caption" ref={ this.editableDivCaption }>
                                    
                //                 </div>

                //                 <form
                //                     id="comment-on-for-you-form"
                //                 >
                //                     <textarea
                //                         type="text"
                //                         name="comment"
                //                         className="comment-on-for-you-textarea"

                //                         ref={ this.textarea }
                //                         required
                //                         maxLength="319"

                //                         value={comment}
                //                         onChange={this.handleChange}
                //                     />
                                    
                //                 </form>

                //                 <button
                //                     type="submit"
                //                     form="comment-on-for-you-form"

                //                     className="send-cm-button"
                //                     onClick={this.sendComment}
                //                 >
                //                     <IoMdSend className="send-cm-icon" />
                //                 </button>
                //             </div>
                        
                //             <button  ref={ this.showCommentDivButton } className="rtstr-button" onClick={this.showEditableDiv}>
                //                 <FaRegCommentAlt className="ddccmm" />
                //             </button>
                //         </div>
                //     </div>
                // </div>
            )
        }

        else {
            return(
                <div className="comment-outter-container">
                    <button className="comment-close-button-outter-container"
                        onClick={() => {
                            this.props.setComponentToNull()
                        }}
                    >
                        <MdClose />
                    </button>

                    <div className="comment-inner-container">
                        <div className="comment-message-outter-container">
                            {
                                (staticText[localStorage.getItem('language')]) ?
                                staticText[localStorage.getItem('language')].noCommentsMessage
                                :
                                staticText['en-US'].noCommentsMessage
                            }
                        </div>
                    </div>

                    <div className="comment-no-comments-form-outter-container">
                        <form onSubmit={this.sendComment}>
                            <textarea
                                type="text"
                                name="comment"

                                placeholder={
                                    (staticText[localStorage.getItem('language')]) ?
                                    staticText[localStorage.getItem('language')].placeholder
                                    :
                                    staticText['en-US'].placeholder
                                }

                                ref={this.textarea}
                                
                                required
                                minLength="3"
                                maxLength="547"

                                value={comment}
                                onChange={this.handleChange}
                            />

                            <button
                                type="submit"
                            >
                                <IoMdSend />
                            </button>
                        </form>
                    </div>
                </div>
            )
        }
    }
}