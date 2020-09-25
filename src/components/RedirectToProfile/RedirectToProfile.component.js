import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';

export default class RedirectToProfile extends Component {
    render() {
        return (
            <Redirect to={"/profile/" + this.props.match.params.nickname} />
        )
    }
}