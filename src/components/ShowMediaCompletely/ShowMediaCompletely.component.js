import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import axios from 'axios';

import { MdClose } from 'react-icons/md';

import './styles.css';

require('dotenv/config');

export default class ShowMediaCompletely extends Component {
    constructor(props) {
        super(props);

        this.state = {
            

            staticText: {
                'pt-BR': {
                    logOut: 'Sair',
                },
                'en-US': {
                    logOut: 'Log out',
                },
            }
        }
    }

    componentDidMount() {
        console.log(this.props);
    }
    
    render() {

        const { 
            staticText,
        } = this.state;

        return (
            <div className="show-media-completely-outter-container">
                <button className="show-media-completely-close-button-outter-container"
                    onClick={() => {
                        this.props.setComponentToNull()
                    }}
                >
                    <MdClose />
                </button>

                <div className="show-media-completely-inner-container">
                    <span>
                        <img src={this.props.url} alt="complete"/>
                    </span>
                </div>
            </div>
        )
    }
}