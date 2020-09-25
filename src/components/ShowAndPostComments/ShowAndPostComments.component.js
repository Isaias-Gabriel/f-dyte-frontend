import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import axios from 'axios';

import { FaRegCommentAlt } from 'react-icons/fa';
import { MdClose } from 'react-icons/md';
import { AiOutlineSend } from 'react-icons/ai';
import { RiDeleteBin6Line } from 'react-icons/ri';

import RatingSlider from '../RatingSlider/RatingSlider.component';

import ShowMediaAndContent from '../ShowMediaAndContent/ShowMediaAndContent.component';

import './styles.css';

require('dotenv/config');

export default class ShowAndPostComments extends Component {
    constructor(props) {
        super(props);
        
        this.showDeleteDiv = this.showDeleteDiv.bind(this);
        this.hideDeleteDiv = this.hideDeleteDiv.bind(this);

        this.deleteComment = this.deleteComment.bind(this);

        this.loadComments = this.loadComments.bind(this);

        this.showEditableDiv = this.showEditableDiv.bind(this);

        this.sendComment = this.sendComment.bind(this);

        this.onClickCloseAddCommentButton = this.onClickCloseAddCommentButton.bind(this);

        this.onClickToShowReplies = this.onClickToShowReplies.bind(this);
        this.hideReplies = this.hideReplies.bind(this);

        this.editableDiv = React.createRef();
        this.editableDivCaption = React.createRef();
        this.editableDivContainer = React.createRef();

        this.deleteDiv = React.createRef();

        this.rtstrBt = React.createRef();
        
        this.state = {
            comments: [],
            ratedComments: [],

            clicked: false,

            controlId: this.props.id,
            controlType: this.props.type,
            controlCaption: 'Add a comment',
            
            replyOnInnerComment: false,

            redirectTo: null,
        }
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
                                        [ comm._id ]: response.data.comments,
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
        this.editableDiv.current.focus();
        this.editableDivCaption.current.innerText = 'Add a comment';
        this.rtstrBt.current.style.display = "none";

        this.setState({
            controlId: this.props.id,
            controlType: this.props.type,
            controlCaption: 'Add a comment',
        })
    }

    showEditableDivForComment(id, username) {
        
        this.editableDivContainer.current.style.display = "block";
        this.editableDiv.current.focus();
        this.editableDivCaption.current.innerText = 'Reply to @' + username;
        this.rtstrBt.current.style.display = "none";

        this.setState({
            controlId: id,
            controlType: 'comment',
            controlCaption: 'Reply to @' + username,
        })
    }

    showEditableDivForComment(id, username) {
        
        this.editableDivContainer.current.style.display = "block";
        this.editableDiv.current.focus();
        this.editableDivCaption.current.innerText = 'Reply to @' + username;
        this.rtstrBt.current.style.display = "none";

        this.setState({
            controlId: id,
            controlType: 'comment',
            controlCaption: 'Reply to @' + username,
        })
    }

    sendComment() {

        if(this.state.replyOnInnerComment) {

            const formInfo = {
                sessionId: localStorage.getItem('e'),
                content: '@' + this.state.replyedUserUsername + ' ' + this.editableDiv.current.innerText,
                replyedUserUsername: this.state.replyedUserUsername,
                parentId: this.state.controlId,
            };

            this.editableDiv.current.innerText = "";
            this.editableDivContainer.current.style.display = "none";
            this.rtstrBt.current.style.display = "inline-block";

            this.setState({
                replyOnInnerComment: false
            })

            axios.post(process.env.REACT_APP_SERVER_ADDRESS + '/reply_on_for_you_inner_comment', formInfo)
                .then(response => {
                    console.log(response.data);

                    let tempComms = this.state[ this.state.controlId ] || [];
                    let tempRatedComms = this.state[ this.state.controlId + "RatedComments" ] || [];
                    let tempCommsLen = this.state[this.state.controlId + "Lenght"] || 0;

                    tempComms.unshift(response.data.comment);
                    tempRatedComms.unshift(response.data.comment._id);

                    this.setState({
                        replyOnInnerComment: false,

                        [ this.state.controlId ]: tempComms,
                        [ this.state.controlId + "RatedComments" ]: tempRatedComms,
                        [ this.state.controlId + "Lenght" ]: tempCommsLen + 1,
                    })
                })
                .catch(err => console.log(err));
        }

        else {
            
            const formInfo = {
                sessionId: localStorage.getItem('e'),
                content: this.editableDiv.current.innerText,
                id: this.state.controlId,
            };

            this.editableDiv.current.innerText = "";
            this.editableDivContainer.current.style.display = "none";
            this.rtstrBt.current.style.display = "inline-block";

            axios.post(process.env.REACT_APP_SERVER_ADDRESS + '/comment_on_' + this.state.controlType, formInfo)
                .then(response => {
                    console.log(response.data);

                    if((this.state.controlId === this.props.id) && (this.state.controlType === this.props.type)) {
                        let tempComms = this.state.comments;
                        tempComms.unshift(response.data);

                        console.log()
                        this.setState({
                            comments: tempComms,
                        });
                    }
        
                    else {
                        let tempComms = this.state[ this.state.controlId ] || [];
                        let tempRatedComms = this.state[ this.state.controlId + "RatedComments" ] || [];
                        let tempCommsLen = this.state[this.state.controlId + "Lenght"] || 0;

                        tempComms.unshift(response.data.comment);
                        tempRatedComms.unshift(response.data.comment._id);

                        this.setState({
                            [ this.state.controlId ]: tempComms,
                            [ this.state.controlId + "RatedComments" ]: tempRatedComms,
                            [ this.state.controlId + "Lenght" ]: tempCommsLen + 1,
                        })
                    }
                })
                .catch(err => console.log(err));
        }
    }

    onClickCloseAddCommentButton() {
        this.editableDivContainer.current.style.display = "none";
        this.rtstrBt.current.style.display = "inline-block";
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
        const { clicked } = this.state;
        //console.log(this.state);

        if(!(clicked)) {
            return(
                <button className="rtstr-button" onClick={this.loadComments}>
                    <FaRegCommentAlt className="ccn-spcts" />
                </button>
            )
        }

        else {
            const { comments } = this.state;

            if(this.state.redirectTo) {
                return <Redirect to={this.state.redirectTo} />
            }

            if(comments.length) {
                return(
                    <div className="mdzcmnt-container">
                        <div className="delete-warning-container" ref={this.deleteDiv}>
                            <div>
                                Delete comment?
                            </div>

                            <div>
                                You can't retrieve this comment after it is deleted.
                            </div>

                            <div>
                                <button onClick={this.deleteComment}>
                                    Yes
                                </button>

                                <button onClick={this.hideDeleteDiv}>
                                    No
                                </button>
                            </div>
                        </div>

                        <div>
                            <div>

                                <button className="rtstr-button cl" onClick={() => {
                                    this.setState({
                                        clicked: false,
                                    }, () => {
                                        this.state = {};
                                    })
                                }}>
                                    <MdClose className="ccn-spcts" />
                                </button>

                                <div className="tbspcd-container">
                                    <div>
                                        {
                                            comments.map(comm => {
                                            //console.log(comm._id);
                                            //if(comm.type === 'comment') {
                                                return (
                                                    <div key={comm._id} className="fy-cmmnt-container" >
                                                        <button className="dlt-cmmnt-bt-fy" onClick={() => {
                                                            this.showDeleteDiv(comm._id)
                                                        }}>
                                                            <RiDeleteBin6Line className="dlt-cmmnt-ico-fy" />
                                                        </button>

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
                                                                    this.showRatingSlider(comm._id)
                                                                }

                                                                <button className="rtstr-button" onClick={() => {
                                                                    this.showEditableDivForComment(comm._id, comm.userUsername);
                                                                }}>
                                                                    <FaRegCommentAlt className="ccn-spcts" />
                                                                </button>
                                                            </div>
                                                        </div>

                                                        {
                                                            //id, comms, clicked, commsLength, ratedComments
                                                            this.innerComments(
                                                                comm._id, this.state[comm._id] || [],
                                                                this.state[comm._id + "Clicked"] || false, this.state[comm._id + "Lenght"]
                                                                || comm.comments.length,
                                                                this.state[comm._id + "RatedComments"] || [])
                                                        }
                                                        
                                                        {/* <InnerComments
                                                            id={comm._id}
                                                            comms={this.state[comm._id] || []}
                                                            
                                                            clicked={this.state[comm._id + "Clicked"] || false}
                                                            commsLength={comm.comments.length}
                                                            
                                                            ratedComments={this.state[comm._id + "RatedComments"] || []}

                                                            showEditableDivForComment={this.showEditableDivForComment}

                                                            onClick={this.onClickToShowReplies}
                                                            hideReplies={this.hideReplies}
                                                        /> */}

                                                    </div>
                                                )
                                            })
                                        }
                                    </div>
                                </div>

                                <div className="editbl-ccfmdu-div-container"  ref={ this.editableDivContainer }>
                                    <button className="rtstr-button cl" onClick={this.onClickCloseAddCommentButton}>
                                        <MdClose className="ccn-spcts" />
                                    </button>

                                    <div className="editbl-ccfmdu-div-caption" ref={ this.editableDivCaption }>
                                        
                                    </div>

                                    <div className="editbl-ccfmdu-div" ref={ this.editableDiv } contentEditable>
                                    
                                    </div>

                                    <button className="send-cm-button" onClick={this.sendComment}>
                                        <AiOutlineSend className="send-cm-icon" />
                                    </button>
                                </div>
                            
                                <button  ref={ this.rtstrBt } className="rtstr-button" onClick={this.showEditableDiv}>
                                    <FaRegCommentAlt className="ddccmm" />
                                </button>
                            </div>
                        </div>
                    </div>
                )
            }

            else {
                return(
                    <div className="mdzcmnt-container">
                        <div>
                            <div>

                                <button className="rtstr-button cl" onClick={() => {
                                    this.setState({
                                        clicked: false,
                                    })
                                }}>
                                    <MdClose className="ccn-spcts" />
                                </button>

                                <div className="tbspcd-container">
                                    <div>
                                        Nobody has commented yet ' -'
                                    </div>
                                </div>

                                <div className="editbl-ccfmdu-div-container"  ref={ this.editableDivContainer }>
                                    <button className="rtstr-button cl" onClick={this.onClickCloseAddCommentButton}>
                                        <MdClose className="ccn-spcts" />
                                    </button>

                                    <div className="editbl-ccfmdu-div-caption" ref={ this.editableDivCaption }>
                                        
                                    </div>

                                    <div className="editbl-ccfmdu-div" ref={ this.editableDiv } contentEditable>
                                    
                                    </div>

                                    <button className="send-cm-button" onClick={this.sendComment}>
                                        <AiOutlineSend className="send-cm-icon" />
                                    </button>
                                </div>
                            
                                <button  ref={ this.rtstrBt } className="rtstr-button" onClick={this.showEditableDiv}>
                                    <FaRegCommentAlt className="ddccmm" />
                                </button>
                            </div>
                        </div>
                    </div>
                )
            }
                
        }
    }
}