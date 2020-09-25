import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import axios from 'axios';

import ShowMediaAndContent from '../ShowMediaAndContent/ShowMediaAndContent.component';

import RatingSlider from '../RatingSlider/RatingSlider.component';
import ShowAndPostComments from '../ShowAndPostComments/ShowAndPostComments.component';

import './styles.css';

require('dotenv/config');

export default class ForYou extends Component {
    constructor(props) {
        super(props);

        this.redirectTo = this.redirectTo.bind(this);

        this.state = {
            recommendations: [],

            //each will be false only immediately after loading more recommendations
            canLoadRecOnTop: true,
            scrolledTooHighExecuted: false,

            canLoadRecOnBottom: true,
            scrolledTooLowExecuted: false,

            redirectTo: null,
        }
    }

    scrolledTooHigh() {
        console.log('function to be exectuted');

        const formInfo = {
            "sessionId": localStorage.getItem('e'),
            includeAsRated: {
                objects: [],
                posts: [],
                queimas: [],
                belles: [],
                comments: [],
            }
        }

        this.state.recommendations.map(rec => {
            formInfo.includeAsRated[rec.type + 's'].push(rec._id);
        })

        axios.post(process.env.REACT_APP_SERVER_ADDRESS + '/get_recommendations', formInfo)
            .then(response => {
                console.log({
                    respLen: response.data.rec.length,
                })

                const end = this.state.recommendations.length - Math.floor(this.state.recommendations.length / 5);
                let temp_recommendations = this.state.recommendations.slice(0, end);
                
                console.log({
                    end,
                    length: this.state.recommendations.length,

                })

                temp_recommendations = response.data.rec.concat(temp_recommendations);
                
                this.setState({
                    recommendations: temp_recommendations,
                    //canLoadRecOnTop: false,
                }, () => {

                    //scroll to where the div was before loading the new recommendations
                    // const nOffSet = document.getElementById(this.state.ancTopId).offsetTop;
                    // console.log(document.getElementById(this.state.ancTopId).offsetTop);

                    // const diff = nOffSet - orOffSet;

                    // console.log({
                    //     diff,
                    // })
                    console.log({
                        recLen: this.state.recommendations.length,
                    })
                    //console.log(document.getElementById('sc-co-div').scrollTop);
                    //document.getElementById('sc-co-div').scrollTop = document.getElementById('sc-co-div').scrollTop + diff;
                    //console.log(document.getElementById('sc-co-div').scrollTop);
                    this.setState({
                        scrolledTooHighExecuted: true,
                    })

                    console.log('function executed');
                })
            })
            .catch(err => console.log(err));

    }

    scrolledTooLow() {
        console.log('function to be exectuted');

        const formInfo = {
            "sessionId": localStorage.getItem('e'),
            includeAsRated: {
                objects: [],
                posts: [],
                queimas: [],
                belles: [],
                comments: [],
            }
        }

        this.state.recommendations.map(rec => {
            formInfo.includeAsRated[rec.type + 's'].push(rec._id);
        })

        axios.post(process.env.REACT_APP_SERVER_ADDRESS + '/get_recommendations', formInfo)
            .then(response => {
                console.log({
                    respLen: response.data.rec.length,
                })

                const beginning = Math.floor(this.state.recommendations.length / 5);
                let temp_recommendations = this.state.recommendations.slice(beginning);
                
                console.log({
                    beginning,
                    length: this.state.recommendations.length,

                })

                temp_recommendations = temp_recommendations.concat(response.data.rec);
                
                this.setState({
                    recommendations: temp_recommendations,
                    //canLoadRecOnTop: false,
                }, () => {

                    //scroll to where the div was before loading the new recommendations
                    // const nOffSet = document.getElementById(this.state.ancTopId).offsetTop;
                    // console.log(document.getElementById(this.state.ancTopId).offsetTop);

                    // const diff = nOffSet - orOffSet;

                    // console.log({
                    //     diff,
                    // })
                    console.log({
                        recLen: this.state.recommendations.length,
                    })
                    //console.log(document.getElementById('sc-co-div').scrollTop);
                    //document.getElementById('sc-co-div').scrollTop = document.getElementById('sc-co-div').scrollTop + diff;
                    //console.log(document.getElementById('sc-co-div').scrollTop);
                    this.setState({
                        scrolledTooLowExecuted: true,
                    })

                    console.log('function executed');
                })
            })
            .catch(err => console.log(err));

    }

    componentDidMount() {
        
        document.getElementById('sc-co-div').addEventListener("scroll", (e) => {
            const el = e.target;
            // console.log(document.getElementById(this.state.ancTopId).offsetTop);
            // console.log({
            //     scrollHeight: el.scrollHeight,
            //     scrollTop: el.scrollTop,
            //     scrollHeightOverFive: (el.scrollHeight / 5),
            //     scrollBottom: el.scrollHeight - el.scrollTop ,
            // })

            if(!(this.state.canLoadRecOnTop) && this.state.scrolledTooHighExecuted) {
                this.setState({
                    canLoadRecOnTop: true,
                })
            }

            if(!(this.state.canLoadRecOnBottom) && this.state.scrolledTooLowExecuted) {
                this.setState({
                    canLoadRecOnBottom: true,
                })
            }

            if((el.scrollTop < (el.scrollHeight / 5)) && this.state.canLoadRecOnTop) {
                this.setState({
                    canLoadRecOnTop: false,
                    scrolledTooHighExecuted: false,
                }, () => {
                    this.scrolledTooHigh();
                })
            }

            if(((el.scrollHeight - el.scrollTop) < (el.scrollHeight / 5)) && this.state.canLoadRecOnBottom) {
                this.setState({
                    canLoadRecOnBottom: false,
                    scrolledTooLowExecuted: false,
                }, () => {
                    this.scrolledTooLow();
                })
            }
            
        })

        const formInfo = {
            "sessionId": localStorage.getItem('e'),
            includeAsRated: {
                objects: [],
                posts: [],
                queimas: [],
                belles: [],
                comments: [],
            }
        
        }

        axios.post(process.env.REACT_APP_SERVER_ADDRESS + '/get_recommendations', formInfo)
            .then(response => {
                console.log(response.data)

                this.setState({
                    recommendations: response.data.rec,
                }, () => {
                    document.getElementById('sc-co-div').scrollTop = document.getElementById('sc-co-div').scrollHeight / 2;
                })
            })
            .catch(err => console.log(err));

    }

    redirectTo(type, id, nickname) {
        if(type === 'object') {
            this.setState({
                redirectTo: '/' + type + '/' + nickname
            })
        }
        
        else {
            this.setState({
                redirectTo: '/' + type + '/' + id
            })
        }
    }

    render() {
        const { recommendations } = this.state;
        //console.log(this.state);
        if(this.state.redirectTo) {
            console.log(this.state.redirectTo);
            return <Redirect to={this.state.redirectTo} />
        }
        return(
            <div id="for-you-container">
                <div id="sc-co-div">
                    <div>
                        <div>
                            <div id="sc-co-recs-c-div">
                                {   
                                    recommendations.map(rec => {
                                        //console.log(rec._id);
                                        //if(rec.type === 'comment') {
                                            return (
                                                <div key={rec._id} className="for-you-recommendation-outter-container">
                                                    
                                                    <b> {rec.type} </b>

                                                    <div
                                                        className="rc-rsrc-fy-div"
                                                        onClick={() => {
                                                            this.redirectTo(rec.type, rec._id, rec.nickname);
                                                        }}
                                                    >
                                                        <ShowMediaAndContent resource={rec} />
                                                    </div>

                                                    <div>
                                                        <div>
                                                            <RatingSlider id={rec._id} type={rec.type} />

                                                            <ShowAndPostComments
                                                                id={rec.nickname || rec._id}
                                                                type={rec.type}
                                                            />
                                                        </div>
                                                    </div>

                                                    {/* <CommentOnComment
                                                        commentId={rec._id}
                                                        level={0}
                                                    /> */}
                                                </div>
                                            )
                                        //}

                                        // if(rec.type === 'post') {
                                        //     return <Posts data={[["post", rec, true]]} key={rec._id} />
                                        // }
                                    })
                                }
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}