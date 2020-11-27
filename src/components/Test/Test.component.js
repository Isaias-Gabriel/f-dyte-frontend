import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import axios from 'axios';

require('dotenv/config');

export default class Test extends Component {
    constructor(props) {
        super(props);

        this.state = {
            loggedOut: null,
        }
    }

    componentDidMount() {
        this.setState({
            parentState: this.props.state,
        })
    }
    
    render() {
        console.log(this.state);
        return (
            <div>
                TEST
            </div>
        )
    }
}