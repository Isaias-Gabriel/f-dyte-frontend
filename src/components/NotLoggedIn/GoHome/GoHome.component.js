import React, { Component } from 'react';
import { Link } from 'react-router-dom';

export default class GoHome extends Component {
    render() {
        return (
            <Link to="/">
                <button>
                    HOME
                </button>
            </Link>
        )
    }
}