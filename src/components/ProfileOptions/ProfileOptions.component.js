import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import axios from 'axios';

import { MdClose } from 'react-icons/md';

import './styles.css';

require('dotenv/config');

export default class ProfileOptions extends Component {
    constructor(props) {
        super(props);

        this.deleteMessage = React.createRef();

        this.state = {

            staticText: {
                'pt-BR': {
                    yes: 'Sim',
                    no: 'Não',

                    optionsDelete: 'Deletar',
                },
                'en-US': {
                    yes: 'Yes',
                    no: 'No',

                    optionsDelete: 'Delete',
                },
            }
        }
    }

    componentDidMount() {
        //console.log(this.props);
    }
    
    render() {
        const { 
            staticText,
        } = this.state;

        const {
            id,
            type,
            visitorUsername,
            visitedUsername,
        } = this.props;

        return (
            <div className="profile-options-outter-container">
                <div
                    className="profile-options-aux-div"
                    onClick={() => {
                        this.props.setComponentToNull()
                    }}
                >
                </div>
                
                <div className="profile-options-inner-container">
                    <div
                        className="delete-message-outter-container"
                        ref={this.deleteMessage}
                    >
                        <div className="delete-message-inner-container">
                            {
                                (staticText[localStorage.getItem('language')]) ?
                                staticText[localStorage.getItem('language')].optionsDelete
                                :
                                staticText['en-US'].optionsDelete
                            }
                            ?
                        </div>

                        <div className="delete-message-buttons-outter-container">
                            <button
                                className="delete-message-button"
                                onClick={() => {
                                    this.props.deletePost(id, type, visitedUsername);
                                    this.props.setComponentToNull();
                                }}
                            >
                                {
                                    (staticText[localStorage.getItem('language')]) ?
                                    staticText[localStorage.getItem('language')].yes
                                    :
                                    staticText['en-US'].yes
                                }
                            </button>

                            <button
                                className="delete-message-button"
                                onClick={() => {
                                    this.deleteMessage.current.style.display = 'none';
                                }}
                            >
                                {
                                    (staticText[localStorage.getItem('language')]) ?
                                    staticText[localStorage.getItem('language')].no
                                    :
                                    staticText['en-US'].no
                                }
                            </button>
                        </div>
                    </div>

                    <div className="options-outter-container">
                        {
                            (visitorUsername === visitedUsername) &&
                            <div
                                className="option-outter-container"
                                onClick={() => {
                                    this.deleteMessage.current.style.display = 'flex';
                                    // document.getElementById(`delete-message-div-${index}`).style.display = 'flex';
                                }}
                            >
                                {
                                    (staticText[localStorage.getItem('language')]) ?
                                    staticText[localStorage.getItem('language')].optionsDelete
                                    :
                                    staticText['en-US'].optionsDelete
                                }
                            </div>
                        }
                    </div>
                </div>
            </div>
        )
    }
}