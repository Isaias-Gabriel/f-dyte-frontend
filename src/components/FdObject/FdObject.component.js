import React, { Component } from 'react';
import ReactPlayer from 'react-player';
import { Link, Redirect } from 'react-router-dom';
import axios from 'axios';
import { w3cwebsocket as W3CWebSocket } from 'websocket';

import { FaRegCommentAlt } from 'react-icons/fa';
import { RiUserFollowLine } from 'react-icons/ri';
import { HiOutlineStar } from 'react-icons/hi';

import IsLogged from '../IsLogged/IsLogged.component';
import GoHome from '../GoHome/GoHome.component';
import LogOut from '../LogOut/LogOut.component';

import CommentOnObject from '../Comment/CommentOnObject.component';
import FollowObject from '../FollowObject/FollowObject.component';

import RatingSlider from '../RatingSlider/RatingSlider.component';

import './styles.css';

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

export default class FdObject extends Component {

    constructor(props) {
        super(props);

        this.handleChange = this.handleChange.bind(this);

        this.showRatingSlider = this.showRatingSlider.bind(this);

        this.showFollowButton = this.showFollowButton.bind(this);

        this.showComments = this.showComments.bind(this);

        this.submitRate = this.submitRate.bind(this);

        this.state = {
            objectFound: true,

            object: {
                _id: '',
                categories: [ [], [] ],
                description: [ [], [ [], [], [] ] ],
                rate: {},
                rateNumber: 0,
                urls: [ [], [] ],
            },

            canBeRated: false,

            rateToSubmit: 0,

            shareRate: false,

            commentOnComment: '',

            rateSubmitted: null,
        }
    }

    componentDidMount() {

        let objectNickname;

        if(this.props.data) {
            objectNickname = this.props.data[0][1].nickname;
        }

        else {
            objectNickname = this.props.match.params.nickname;
        }

        const client = new W3CWebSocket('ws://127.0.0.1:8000/');

        client.onopen = () => {
            client.send(JSON.stringify({
                type: 'objectConnection',
                sessionId: localStorage.getItem('e'),
                objectNickname: objectNickname,
            }))
            console.log('Websocket client - object connected');
        };

        client.onmessage = (message) => {
            const dataFromServer = JSON.parse(message.data);
            console.log(dataFromServer)
            this.setState({
                object: dataFromServer.object,
            })
        }

        if(this.props.data) {
            this.setState({
                object: this.props.data[0][1],
            }, () => {

                const formInfo = {
                    objectNickname: this.state.object.nickname,
                    sessionId: localStorage.getItem('e'),
                };

                //if the user can rate the object from the profile, it will return true, else, return false :v
                axios.post(process.env.REACT_APP_SERVER_ADDRESS + '/user_can_rate_or_follow_object', formInfo)
                    .then(res => {
                        this.setState({
                            followersNumber: this.state.object.followedBy.length,
                            canBeRated: res.data.canBeRated,
                            isFollowed: res.data.isFollowed,
                        })
                    })
                    .catch(err => console.log(err));

            })
        }

        else {
            axios.get(process.env.REACT_APP_SERVER_ADDRESS + '/complete_object_info/' + this.props.match.params.nickname)
            .then(response => {

                this.setState({
                    object: response.data.object,
                    followersNumber: response.data.followersNumber,
                }, () => {

                    const formInfo = {
                        objectNickname: this.props.match.params.nickname,
                        sessionId: localStorage.getItem('e'),
                    };

                    //if the user can rate the object from the profile, it will return true, else, return false :v
                    axios.post(process.env.REACT_APP_SERVER_ADDRESS + '/user_can_rate_or_follow_object', formInfo)
                        .then(res => {
                            this.setState({
                                canBeRated: res.data.canBeRated,
                                isFollowed: res.data.isFollowed,
                            })
                        })
                        .catch(err => console.log(err));

                })

            })
            .catch(err => {
                console.log(err);
                this.setState({
                    objectFound: false,
                })
            });
        }
    }

    handleChange = e => {
        this.setState({
            [ e.target.name ]: e.target.value
        })
    }

    showRatingSlider() {
        //this.state.canBeRated
        if(this.state.canBeRated) {
            const { rateToSubmit } = this.state;

            return(
                <div className="slidecontainer">
                    <form id="rate-evaluator" onSubmit={this.submitRate}>
                        <input 
                            type="range"
                            name="rateToSubmit"

                            min="0"
                            max="5000000"
                            value={rateToSubmit}
                            onChange={this.handleChange}

                            id="myRange"
                            className="slider"
                        />

                        

                        <p>Value: <span>{ Number(Math.floor(this.state.rateToSubmit / 10000) / 100).toFixed(2) }</span></p>
                        
                        <button type="submit">
                            Rate { this.state.object.name }
                        </button>

                        <button type="submit" onClick={
                            () => {
                                this.setState({
                                    shareRate: true,
                                })
                            }
                        }>
                            Rate and share on your feed
                        </button>

                    </form>
                </div>
            )
        }
    }

    showFollowButton() {
        const { name, nickname } = this.state.object;
        const { followersNumber, isFollowed } = this.state;


        if(nickname && name && (typeof isFollowed !== typeof undefined) && 
            (typeof followersNumber !== typeof undefined)) {
            return(
                <FollowObject
                    nickname={nickname}
                    name={name}
                    isFollowed={isFollowed}
                    followersNumber={followersNumber}
                />
            )
        }
        
    }

    showComments() {
        const { object } = this.state;

        if(this.props.data) {
            const auxData = this.props.data.slice();
            auxData.shift();

            return(
                <CommentOnObject
                    data={ auxData }
                    
                    nickname={ this.props.data[0][1].nickname }
                    id={ this.state.object._id }
                    rateNumber={ this.state.object.rateNumber }
                    spot1Id={ object.description[1][0][2] }
                    spot2Id={ object.description[1][1][2] }
                    spot3Id={ object.description[1][2][2] }
                />
            )
        }

        else {
            return(
                <CommentOnObject
                    nickname={ this.props.match.params.nickname }
                    id={ this.state.object._id }
                    rateNumber={ this.state.object.rateNumber }
                    spot1Id={ object.description[1][0][2] }
                    spot2Id={ object.description[1][1][2] }
                    spot3Id={ object.description[1][2][2] }
                />
            )
        }
    }

    submitRate(e) {
        e.preventDefault();

        const formInfo = {
            rateToSubmit: this.state.rateToSubmit / 1000000,
            objectId: this.state.object._id,
            sessionId: localStorage.getItem('e'),
        }

        axios.post(process.env.REACT_APP_SERVER_ADDRESS + '/update_object_rate', formInfo)
            .then(res => {
                
                alert('Rated!')

                
                this.setState({
                    object: res.data,
                    canBeRated: false,
                    rateSubmitted: true,
                }, () => {
                    if(this.state.shareRate) {

                        const fileData = new FormData();
                        // Object.keys({}).map(index => {
                        //     fileData.append("files", ?);
                        // })
    
                        const content = "Rated " + this.state.object.name + " with a " + Number(formInfo.rateToSubmit).toFixed(2)
    
                        fileData.append("sessionId", localStorage.getItem('e'));
                        fileData.append("content", content);
    
                        axios.post(process.env.REACT_APP_SERVER_ADDRESS + '/post', fileData, {
                            headers: {
                                'content-type': 'multipart/form-data'
                            }
                        })
                            .then(response => {})
                            .catch(err => console.log(err));
                    }
                })

            })
            .catch(err => console.log(err));
    }

    render() {
        const { objectFound } = this.state;

        if(objectFound) {
            const { rateSubmitted } = this.state;

            if(rateSubmitted) {
                return <Redirect to={"/redirect_to_object/" + this.props.match.params.nickname} />;
            }

            const { _id: id, urls, name, nickname, description, rateNumber } = this.state.object;
            const categories = this.state.object.categories[0];

            let temp_rate = this.state.object.rate.$numberDecimal;
            let rateIntegerPart, rateFirst2Decimals;
            
            if(temp_rate) {
                temp_rate = (parseFloat(temp_rate) * 100).toString();
               
                rateIntegerPart = temp_rate[0];
                rateFirst2Decimals = temp_rate[1] + temp_rate[2];
            }

            return(
                
                <div id="object-outter-container">
                    <div id="object-inner-container">
                        <div id="object-media-header-and-rate-outter-container">
                            <section id="object-media-outter-container">
                                {
                                    urls[0][0] && (
                                        <div
                                            className="object-media-inner-container"
                                            style={{
                                                backgroundImage: `url(${urls[0][0]})`
                                            }}
                                        >
                                        </div>
                                    )
                                }
                            </section>

                            <section id="object-header-outter-container">
                                <div>
                                    <p id="object-header-name">
                                        <b>
                                            { name }
                                        </b>
                                    </p>

                                    <p id="object-header-nickname">
                                        { `/${nickname}` }
                                    </p>
                                </div>
                            </section>

                            <section id="object-rate-outter-container">
                                <span>
                                    <span id="object-rate-integer-part">
                                        { `${rateIntegerPart}` }
                                    </span>

                                    <span id="object-rate-decimal-part">
                                        { `.${rateFirst2Decimals}` }
                                    </span>
                                </span>

                                <span>
                                    { rateNumber }
                                </span>
                            </section>
                        </div>

                        <div className="object-main-content-outter-container">
                            <div className="object-rate-comment-and-follow-outter-container">
                                <div className="object-main-icons">
                                    <FaRegCommentAlt />
                                </div>

                                <div className="object-main-icons">
                                    <HiOutlineStar />
                                </div>

                                <div className="object-main-icons">
                                    <RiUserFollowLine />
                                </div>
                            </div>

                            <section className="object-categories-and-descriptions-outter-container">
                                <div className="object-categories-outter-container">
                                    {
                                        categories.map((category, index) => {
                                            return(
                                                <div key={index} className="object-category-outter-container">
                                                    { `#${category}` }
                                                </div>
                                            )
                                        })
                                    }
                                </div>

                                <div className="object-descriptions-outter-container">
                                    { description[0] }
                                </div>
                            </section>
                        </div>
                    </div>
                </div>
                
                
                

                //             <p>
                //                 { object.description[0] }
                //             </p>
                            
                //             {   
                //                 object.description[1].map(description => {
                //                     if(description.length) {
                //                         return (
                //                             <div key={description}>
                //                                 <p>
                //                                     { description[0] }
                //                                 </p>
                                                
                //                                 <span>
                //                                     {`by `}
                //                                     <Link to={ "/profile/" + description[1] }>
                //                                         { description[1] }
                //                                     </Link>
                //                                 </span>
                //                             </div>
                //                         )
                //                     }
                //                 })
                //             }

                //             <p>
                //                 <strong>
                //                     {
                //                         object.categories[0].map(category => {
                //                             return(
                //                                 <span key={category} className="object-category-span">
                //                                     {
                //                                         category
                //                                     }
                //                                 </span>
                //                             )
                //                         })
                //                     }
                //                 </strong>
                //             </p>

                //             <p>
                //                 { Number(object.rate.$numberDecimal).toFixed(2) }
                //             </p>

                //             <p>
                //                 Number of rates: { object.rateNumber }
                //             </p>
                //         </div>
                //     </div>
                    
                //     {
                //         this.showRatingSlider()
                //     }

                //     {
                //         this.showFollowButton()
                //     }
                    
                //     <hr/>
                    
                //     {
                //         this.showComments()
                //     }
                    
                // </div>
            );
        }

        else {
            return(
                <div id="object-not-found-container">
                    <div>
                        <div>
                            OBJECT  NOT    FOUND
                        </div>
                    </div>
                </div>
            )
        }
        
    }
}
