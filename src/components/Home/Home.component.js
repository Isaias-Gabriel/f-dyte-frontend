import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

import IsLogged from '../IsLogged/IsLogged.component';
import LogOut from '../LogOut/LogOut.component';

import Notification from '../Notification/Notification.component';

import SearchFor from '../SearchFor/SearchFor.component';

import ForYou from '../ForYou/ForYou.component';

import getUserUsername from '../../functions/getUserUsername';

import './styles.css';

require('dotenv/config');

export default class Home extends Component {
    constructor(props) {
        super(props);

        this.state = {
            bestRated: [],
            worstRated: [],
            latest: [],
            username: '',
        }
    }

    async componentDidMount() {

        this.setState({
            username: await getUserUsername(),
        })

        document.getElementsByTagName('title')[0].innerText = 'Home';

        axios.get(process.env.REACT_APP_SERVER_ADDRESS + '/five_best')
            .then(response => {
                this.setState({
                    bestRated: response.data
                }, () => {
                    axios.get(process.env.REACT_APP_SERVER_ADDRESS + '/five_worst')
                        .then(resp => {
                            this.setState({
                                worstRated: resp.data
                            }, () => {
                                axios.get(process.env.REACT_APP_SERVER_ADDRESS + '/latest')
                                    .then(respo => {
                                        this.setState({
                                            latest: respo.data
                                        }, () => {
                                            const formInfo = { sessionId: localStorage.getItem('e') };
                                            axios.post(process.env.REACT_APP_SERVER_ADDRESS + '/evaluator_username', formInfo )
                                                .then(res => {
                                                    this.setState({
                                                        username: res.data,
                                                    })
                                                })
                                                .catch(err => console.log(err));

                                        })
                                    })
                                    .catch(err => console.log(err));
                                    
                            })
                        })
                        .catch(err => console.log(err));

                })
            })
            .catch(err => console.log(err));

    }

    componentWillUnmount() {
        document.getElementsByTagName('title')[0].innerText = 'f Dyte';
    }

    render() {
        return(
            <div id="home-container">
                <IsLogged/>

                <Notification />
                
                <Link to="/create_object">
                    <button>
                        Create object
                    </button>
                </Link>

                <Link to={"/edit_profile"}>
                    <button>
                        Edit profile
                    </button>
                </Link>

                <Link to={"/profile/" + this.state.username}>
                    <button>
                        My profile
                    </button>
                </Link>

                <LogOut/>
                
                <p>Home</p>

                <SearchFor />

                <div id="home-show-objects-a">
                    <div id="best-and-worst-rated">
                        <div id="hm-best-rated-objects">
                            <h1>
                                Higher
                            </h1>

                            {
                                this.state.bestRated.map(object => {
                                    return(
                                        <div id={object._id} key={object._id}>
                                            <Link to={"/object/" + object.nickname}>
                                                <h2>
                                                    { object.name }
                                                </h2>

                                                <p>
                                                    { Number(object.rate.$numberDecimal).toFixed(2) }
                                                </p>    
                                            </Link>
                                        </div>
                                    )
                                })
                            }
                        </div>

                        <div id="hm-worst-rated-objects">
                            <h1>
                                Lower
                            </h1>

                            
                            {
                                this.state.worstRated.map(object => {
                                    return(
                                        <div id={object._id} key={object._id}>
                                            <Link to={"/object/" + object.nickname}>
                                                <h2>
                                                    { object.name }
                                                </h2>

                                                <p>
                                                    { Number(object.rate.$numberDecimal).toFixed(2) }
                                                </p>    
                                            </Link>
                                        </div>
                                    )
                                })
                            }
                        </div>
                    </div>

                    <div id="latest">
                        <div id="hm-worst-rated-objects">
                            <h1>
                                Latest
                            </h1>

                            
                            {
                                this.state.latest.map(object => {
                                    return(
                                        <div id={object._id} key={object._id}>
                                            <Link to={"/object/" + object.nickname}>
                                                <h2>
                                                    { object.name }
                                                </h2>

                                                <p>
                                                    { Number(object.rate.$numberDecimal).toFixed(2) }
                                                </p>    
                                            </Link>
                                        </div>
                                    )
                                })
                            }
                        </div>
                    </div>
                </div>

                <div>
                    <div>
                        <h1>
                            For You
                        </h1>

                        <ForYou />
                    </div>
                </div>
            </div>
        )
    }
}