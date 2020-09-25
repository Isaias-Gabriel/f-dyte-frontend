import React, { Component } from 'react';
import axios from 'axios';

import UserSayThePrice from './UserSayThePrice/UserSayThePrice.component';
import PredefinedPaymentPlans from './PredefinedPaymentPlans/PredefinedPaymentPlans.component';

import './styles.css';

require('dotenv/config');

export default class Promote extends Component {
    constructor(props) {
        super(props);

        this.divClicked = this.divClicked.bind(this);

        this.state = {
            option1Clicked: false,
            option2Clicked: false,
            option3Clicked: false,
        }
    }

    divClicked(which) {
        this.setState({
            [ "option" + which + "Clicked" ]: !(this.state[ "option" + which + "Clicked" ]),
        })
    }
    
    render() {
        const { option1Clicked, option2Clicked, option3Clicked } = this.state;
        
        return (
            <div className="promote-outter-most-container">
                <div className="options-container">
                    <div className="promote-option">
                        <p
                            className="promote-option-clickable-paragraph"
                            onClick={() => {
                                this.divClicked("1");
                            }}
                        >
                            I wanna say how much I wanna pay
                        </p>

                        {
                            ( option1Clicked )
                            ?
                                <UserSayThePrice
                                    numberOfFollowers={ 100000 }
                                />
                            :
                                ''
                        }
                    </div>

                    {/* <div className="promote-option">
                        <p
                            className="promote-option-clickable-paragraph"
                            onClick={() => {
                                this.divClicked("2");
                            }}
                        >
                            I want f Dyte to help me calculate how much I need to pay
                        </p>

                        {
                            ( option2Clicked )
                            ?
                                <UserSayThePrice
                                    numberOfFollowers={ 100000 }
                                />
                            :
                                ''
                        }
                    </div> */}

                    <div className="promote-option">
                        <p
                            className="promote-option-clickable-paragraph"
                            onClick={() => {
                                this.divClicked("3");
                            }}
                        >
                            I wanna see what predefined payment plans f Dyte has to offer me
                        </p>

                        {
                            ( option3Clicked )
                            ?
                                <PredefinedPaymentPlans
                                    numberOfFollowers={ 2000 }
                                />
                            :
                                ''
                        }
                    </div>
                </div>
            </div>
        )
    }
}