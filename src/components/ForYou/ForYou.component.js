import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import axios from 'axios';

import Menu from '../Menu/Menu.component';
import ShowMediaAndContent from '../ShowMediaAndContent/ShowMediaAndContent.component';

import loadingIcon from '../../assets/loading-infinity-icon.svg';

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

            loaded: false,

            newRecommendationsLoaded: false,
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
                segredinhos: [],
            }
        }

        this.state.recommendations.map(rec => {
            formInfo.includeAsRated[rec.type + 's'].push(rec._id);
        })

        axios.post(process.env.REACT_APP_SERVER_ADDRESS + '/get_recommendations', formInfo)
            .then(response => {
                console.log({
                    responseLength: response.data.rec.length,
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
                    //console.log(document.getElementById('scrollable-outter-div').scrollTop);
                    //document.getElementById('scrollable-outter-div').scrollTop = document.getElementById('scrollable-outter-div').scrollTop + diff;
                    //console.log(document.getElementById('scrollable-outter-div').scrollTop);
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
                    responseLength: response.data.rec.length,
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
                    //console.log(document.getElementById('scrollable-outter-div').scrollTop);
                    //document.getElementById('scrollable-outter-div').scrollTop = document.getElementById('scrollable-outter-div').scrollTop + diff;
                    //console.log(document.getElementById('scrollable-outter-div').scrollTop);
                    this.setState({
                        scrolledTooLowExecuted: true,
                    })

                    console.log('function executed');
                })
            })
            .catch(err => console.log(err));

    }

    componentDidMount() {

        document.getElementsByTagName('title')[0].innerText = 'For you - f Dyte';
        
        document.getElementsByClassName('for-you-outter-container')[0].addEventListener("scroll", async (e) => {
            const { newRecommendationsLoaded } = this.state;
            const element = e.target;
            
            // console.log({
            //     scrollHeight: element.scrollHeight,
            //     scrollTop: element.scrollTop,
            //     scrollHeightTimes0Point8: (element.scrollHeight * 0.2),
            //     scrollBottom: element.scrollHeight - element.scrollTop ,
            // })

            if((element.scrollTop >= (element.scrollHeight * 0.8)) && !newRecommendationsLoaded) {
                console.log(newRecommendationsLoaded)
                console.log('nha')

                this.setState({
                    newRecommendationsLoaded: true,
                })

                const formInfo = {
                    "sessionId": localStorage.getItem('e'),
                    includeAsRated: {
                        objects: [],
                        posts: [],
                        queimas: [],
                        belles: [],
                        comments: [],
                        segredinhos: [],
                    }
                }
        
                this.state.recommendations.map(rec => {
                    formInfo.includeAsRated[rec.type + 's'].push(rec._id);
                })
        
                const response = await axios.post(process.env.REACT_APP_SERVER_ADDRESS + '/get_recommendations', formInfo);

                this.setState({
                    recommendations: this.state.recommendations.concat(response.data.recommendations),
                }, () => {
                    this.setState({
                        newRecommendationsLoaded: false,
                    })
                })
            }

            // if(!(this.state.canLoadRecOnTop) && this.state.scrolledTooHighExecuted) {
            //     this.setState({
            //         canLoadRecOnTop: true,
            //     })
            // }

            // if(!(this.state.canLoadRecOnBottom) && this.state.scrolledTooLowExecuted) {
            //     this.setState({
            //         canLoadRecOnBottom: true,
            //     })
            // }

            // if((element.scrollTop < (element.scrollHeight / 5)) && this.state.canLoadRecOnTop) {
            //     this.setState({
            //         canLoadRecOnTop: false,
            //         scrolledTooHighExecuted: false,
            //     }, () => {
            //         this.scrolledTooHigh();
            //     })
            // }

            // if(((element.scrollHeight - element.scrollTop) < (element.scrollHeight / 5)) && this.state.canLoadRecOnBottom) {
            //     this.setState({
            //         canLoadRecOnBottom: false,
            //         scrolledTooLowExecuted: false,
            //     }, () => {
            //         this.scrolledTooLow();
            //     })
            // }
            
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
                    recommendations: response.data.recommendations,
                    loaded: true,
                }, () => {

                    // if(this.state.recommendations.length) {
                    //     let aux = this.state.recommendations.length;
                    
                    //     if(aux % 2 === 0) {
                    //         aux = Math.floor(aux/2) - 1;
                    //     }
                        
                    //     else {
                    //         aux = Math.floor(aux/2);
                    //     }

                    //     window.location.hash = `#for-you-element-outter-container-${aux}`;
                    // }

                    // document.getElementById('scrollable-outter-div').scrollTop = document.getElementById('scrollable-outter-div').scrollHeight / 2;
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
        const { recommendations, loaded } = this.state;

        console.log(recommendations.length);

        if(!loaded) {
            return(
                <div className="for-you-outter-container">
                    <Menu />
                    <div className="loading-icon-outter-container">
                        <img
                            src={loadingIcon}
                            alt="Loading"
                        />
                    </div>
                </div>
            )
        }

        //console.log(this.state);
        console.log(this.props);

        if(this.state.redirectTo) {
            console.log(this.state.redirectTo);
            return <Redirect to={this.state.redirectTo} />
        }

        if(recommendations.length >= 100) {
            return(
                <div className="for-you-outter-container">
                    <Menu />
                    <div className="for-you-elements-outter-container">
                        {
                            recommendations.map((recommendation, index) => {
                                return(
                                    <ShowMediaAndContent
                                        key={index}
                                        resource={recommendation}
                                        type={recommendation.type}
                                        index={index}
                                    />
                                )
                            })
                        }
                    </div>
                </div>
            )
        }

        else if(recommendations.length < 100 && recommendations.length > 0) {
            return (
                <div className="for-you-outter-container">
                    <Menu />
                    <div className="for-you-end-of-content-outter-container">
                        There's nothing more for you to see '-'
                    </div>

                    <div className="for-you-elements-outter-container">
                        {
                            recommendations.map((recommendation, index) => {
                                return(
                                    <ShowMediaAndContent
                                        key={index}
                                        resource={recommendation}
                                        type={recommendation.type}
                                        index={index}
                                    />
                                )
                            })
                        }
                    </div>

                    <div className="for-you-end-of-content-outter-container">
                        There's nothing more for you to see '-'
                    </div>
                </div>
            )
        }

        else if(!recommendations.length) {
            return(
                <div className="for-you-outter-container">
                    <Menu />
                    <div className="for-you-end-of-content-outter-container">
                        There's nothing for you to see right now '-'
                    </div>
                </div>
            )
        }


            // <div id="for-you-container-outter-container">
            //     <div id="scrollable-outter-div">
            //         <div>
            //             <div>
            //                 <div id="sc-co-recs-c-div">
            //                     {   
            //                         recommendations.map(rec => {
            //                             //console.log(rec._id);
            //                             //if(rec.type === 'comment') {
            //                                 return (
            //                                     <div key={rec._id} className="for-you-recommendation-outter-container">
                                                    
            //                                         <b> {rec.type} </b>

            //                                         <div
            //                                             className="rc-rsrc-fy-div"
            //                                             onClick={() => {
            //                                                 this.redirectTo(rec.type, rec._id, rec.nickname);
            //                                             }}
            //                                         >
            //                                             <ShowMediaAndContent resource={rec} />
            //                                         </div>

            //                                         <div>
            //                                             <div>
            //                                                 <RatingSlider id={rec._id} type={rec.type} />

            //                                                 <ShowAndPostComments
            //                                                     id={rec.nickname || rec._id}
            //                                                     type={rec.type}
            //                                                 />
            //                                             </div>
            //                                         </div>

            //                                         {/* <CommentOnComment
            //                                             commentId={rec._id}
            //                                             level={0}
            //                                         /> */}
            //                                     </div>
            //                                 )
            //                             //}

            //                             // if(rec.type === 'post') {
            //                             //     return <Posts data={[["post", rec, true]]} key={rec._id} />
            //                             // }
            //                         })
            //                     }
            //                 </div>
            //             </div>
            //         </div>
            //     </div>
            // </div>
    }
}