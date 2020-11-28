import React, { Component } from 'react';
import PayPalPayment from '../../PayPalPayment/PayPalPayment.component';

import './styles.css';

require('dotenv/config');

export default class UserSayThePrice extends Component {
    constructor(props) {
        super(props);

        this.onChange = this.onChange.bind(this);

        this.input = React.createRef();

        this.state = {
            numberOfFollowers: this.props.numberOfFollowers,
            numberOfTimes: 101,
        }
    }

    componentDidMount() {
        const { numberOfFollowers } = this.state || this.props.numberOfFollowers;
        const price = 1;

        let p1 = Math.pow(price * 100, (11/10)), p2 = - 0.01 * (Math.pow((0.021 * numberOfFollowers), 2));

        let nOT = p1 + p2;

        if(nOT <= 0) {
            nOT = p1;
        }

        this.input.current.value = 1;

        this.setState({
            numberOfTimes: nOT,
        })
    }

    onChange(e) {
        const { numberOfFollowers } = this.state;
        const price = e.target.value;

        //f(x)=(x*100)^((11)/(10))-0.01 x^(2)

        let p1 = Math.pow(price * 100, (11/10)), p2 = - 0.01 * (Math.pow((0.021 * numberOfFollowers), 2));

        let nOT = p1 + p2;

        if(nOT <= 0) {
            nOT = p1;
        }

        this.setState({
            numberOfTimes: nOT,
            isToPay: false,
        })
    }
    
    render() {
        const { numberOfTimes, isToPay } = this.state

        return(
            <div className="user-say-the-price-outter-container">
                <div>
                    <p className="user-say-the-price-paragraph">
                        Type how much you wanna pay:
                    </p>
                    <input
                        ref={ this.input }
                        onChange={ this.onChange }
                        type="number"
                        min="1"
                        max="21000"
                    /> <span> reais </span>

                    <p>
                        your post will be shown
                        {` `}
                        <span>
                            { Number(numberOfTimes).toFixed() }
                        </span>
                        {` `}
                        times as a promoted post ^^
                    </p>

                    {
                        ( isToPay )
                        ?
                            (
                                <div>
                                    <PayPalPayment
                                        price={this.input.current.value}
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