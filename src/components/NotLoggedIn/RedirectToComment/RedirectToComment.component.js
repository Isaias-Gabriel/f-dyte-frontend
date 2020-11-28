import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';

export default class RedirectToComment extends Component {
    render() {
        return (
            <Redirect to={"/comment/" + this.props.match.params.id} />
        )
    }
}