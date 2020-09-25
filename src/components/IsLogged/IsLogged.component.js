import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';

export default class IsLogged extends Component {
    render() {
        if (!(localStorage.getItem(localStorage.getItem('e')))) {
            return <Redirect to="/log_in" />
        }
        return(
            <span style={{display: "none",}}>
            </span>
        )
    }
}