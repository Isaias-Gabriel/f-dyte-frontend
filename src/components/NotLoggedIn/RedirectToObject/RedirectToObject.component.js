import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';

export default class RedirectToObject extends Component {
    render() {
        return (
            <Redirect to={"/object/" + this.props.match.params.nickname} />
        )
    }
}