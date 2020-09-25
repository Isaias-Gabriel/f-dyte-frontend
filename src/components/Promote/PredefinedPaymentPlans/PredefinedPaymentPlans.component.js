import React, { Component } from 'react';
import PayPalPayment from '../../PayPalPayment/PayPalPayment.component';

import './styles.css';

require('dotenv/config');

export default class PredefinedPaymentPlans extends Component {
    constructor(props) {
        super(props);

        this.clickableDivA = React.createRef();
        this.clickableDivB = React.createRef();
        this.clickableDivC = React.createRef();
        this.clickableDivI = React.createRef();

        this.payButton = React.createRef();

        this.handleChange = this.handleChange.bind(this);

        this.onClickDiv = this.onClickDiv.bind(this);

        this.state = {
            isToPay: false,

            chosenPrice: null,

            numberOfFollowers: this.props.numberOfFollowers,
            nDays: 1,

            optionAClicked: false,
            optionBClicked: false,
            optionCClicked: false,
            optionIClicked: false,
        }
    }

    componentDidMount() {
        //f(x)=(x+2)^((10)/(30))-1
        //where x = number of followers

        //* 0.3 for unique posts, for promoting a user is * 1;
        const price = (Math.pow(this.state.numberOfFollowers + 2, (10/30)) - 1) * 0.5;

        this.payButton.current.style.display = "none";

        this.setState({
            price: price,
            priceA: Number(price * 1.02).toFixed(2), 
            priceB:  Number(price * 2.5 * 1.02).toFixed(2), 
            priceC:  Number(price * 6 * 1.02).toFixed(2), 
            priceI:  Number(price * 3.5 * 1.02).toFixed(2),
        })
    }

    handleChange = e => {
        const nDays = parseInt(e.target.value);
        const { price } = this.state;
        
        this.setState({
            nDays: e.target.value,
            
            priceA: Number(price * (1.02 * nDays)).toFixed(2), 
            priceB:  Number(price * 2.5 * (1.02 * nDays)).toFixed(2), 
            priceC:  Number(price * 6 * (1.02 * nDays)).toFixed(2), 
            priceI:  Number(price * 3.5 * (1.02 * nDays)).toFixed(2),
        })
    }

    onClickDiv(which) {

        let plansList = ["A", "B", "C", "I"];

        plansList = plansList.slice(0, plansList.indexOf(which))
            .concat(plansList.slice(plansList.indexOf(which) + 1));

        plansList.map(plan => {
            this["clickableDiv" + plan].current.style.backgroundColor = "#fffbfd";
        })
        
        const clicked = this.state["option" + which + "Clicked"];

        if(clicked) {
            this["clickableDiv" + which].current.style.backgroundColor = "#fffbfd";
            
            this.setState({
                isToPay: false,
            }, () => {
                if(this.payButton.current) {
                    this.payButton.current.style.display = "none";
                }
            })
        }

        else {
            this["clickableDiv" + which].current.style.backgroundColor = "#fcc8e0";

            if(this.payButton.current) {
                this.payButton.current.style.display = "inline-block";
            }
            if(this.state.isToPay) {
                this.setState({
                    isToPay: false,
                },() => {
                    this.setState({
                        isToPay: true,
                    })
                })
            }

            this.setState({
                chosenPrice: this.state["price" + which],
            })
        }

        this.setState({
            ["option" + which + "Clicked"]: !(clicked),
            ["option" + plansList[0] + "Clicked"]: false,
            ["option" + plansList[1] + "Clicked"]: false,
            ["option" + plansList[2] + "Clicked"]: false,
        })
    }
    
    render() {
        const { chosenPrice, isToPay, nDays, priceA, priceB, priceC, priceI } = this.state;

        return(
            <div className="predefined-plans-outter-container">
                <div>

                    <input
                        type="range"
                        name="days"

                        value={nDays}

                        min="1"
                        max="53"
                        onChange={this.handleChange}

                        className="slider"
                    />

                    <p>
                        { nDays } days
                    </p>

                    <div>
                        <div
                            className="plan-outter-container" 
                            ref={this.clickableDivA}
                            onClick={() => 
                                {
                                    this.onClickDiv("A")
                                }
                            }
                        >
                            plan a - random 
                            <p>
                                price: R$ { priceA }
                            </p>
                            show to random people, a lot of times
                        </div>

                        <div
                            className="plan-outter-container" 
                            ref={this.clickableDivB}
                            onClick={() => 
                                {
                                    this.onClickDiv("B")
                                }
                            }
                        >
                            plan b - focused
                            <p>
                                price: R$ { priceB }
                            </p>
                            show strictly to the public with high chance to like the content
                        </div>

                        <div
                            className="plan-outter-container" 
                            ref={this.clickableDivC}
                            onClick={() => 
                                {
                                    this.onClickDiv("C")
                                }
                            }
                        >
                            plan c - agressive
                            <p>
                                price: R$ { priceC }
                            </p>
                            show to basically everybody
                        </div>

                        <div
                            className="plan-outter-container" 
                            ref={this.clickableDivI}
                            onClick={() => 
                                {
                                    this.onClickDiv("I")
                                }
                            }
                        >
                            plan i - intelligent
                            <p>
                                price: R$ { priceI }
                            </p>
                            show to public that probably will like the most 
                            but also show to hesitant public as well as random public
                        </div>
                    </div>

                    {
                        ( isToPay )
                        ?
                            (
                                <div>
                                    <PayPalPayment
                                        price={chosenPrice}
                                    />
                                </div>
                            )
                        :
                        (
                            <button
                                onClick={() => {
                                        this.setState({
                                            isToPay: true,
                                        })
                                    }
                                }
                                ref={this.payButton}
                            >
                                Pay with PayPal
                            </button>
                        )
                    }
                </div>
            </div>
        )
    }
}