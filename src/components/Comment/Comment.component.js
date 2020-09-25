import React, { Component } from 'react';
import axios from 'axios';

import FdObject from '../FdObject/FdObject.component';

import Posts from '../Profile/Posts.component';
import Queima from '../Profile/Queima.component';
import Belle from '../Profile/Belle.component';

require('dotenv/config');

export default class Comment extends Component {
    constructor(props) {
        super(props);

        this.show = this.show.bind(this);
        
        this.state = {
            comFound: true,

            data: [],
        }
    }

    componentDidMount() {
        const formInfo = {
            id: this.props.match.params.id,
            sessionId: localStorage.getItem('e'),
        }

        axios.post(process.env.REACT_APP_SERVER_ADDRESS + "/get_comment_complete_info", formInfo)
            .then(response => {
                console.log(response.data);
                this.setState({
                    data: response.data,
                })
            })
            .catch(err => {
                console.log(err);
                this.setState({
                    comFound: false,
                })
            });

    }

    show() {
        const { data } = this.state;

        if(data.length) {
            if(data[0][0] === "object") {
                return(
                    <FdObject
                        data={data}
                    />
                )
            }

            if(data[0][0] === "post") {
                return(
                    <Posts
                        data={data}
                    />
                )
            }
        }
    }
    
    render() {
        const { comFound } = this.state;

        if(comFound) {
            return(
                <div>
                    { this.show() }
                </div>
            )
        }
        
        else {
            return(
                <div>
                    <div>
                        <div>
                            <p>
                                Comment not found '-'
                            </p>
                        </div>
                    </div>
                </div>
            )
        }
    }
}