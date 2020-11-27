// rate for evaluators
import React, { Component } from 'react';
import axios from 'axios';

import { HiOutlineStar } from 'react-icons/hi';

import loadingIcon from '../../assets/loading-infinity-icon.svg';

import './rateType2Styles.css';

require('dotenv/config');

export default class RateType2 extends Component {
    constructor(props) {
        super(props);

        this.handleChange = this.handleChange.bind(this);
        this.onSubmit = this.onSubmit.bind(this);

        this.showRateContainer = React.createRef();
        this.formContainer = React.createRef();

        this.loadingIcon = React.createRef();

        this.state = {
            rateIntegerPart: '0',
            rateFirst2Decimals: '00',

            rateNumber: 0,
            isRated: true,

            rateToSubmit: 0,

            clicked: false,
            rated: false,   

            rate: 0,
        }
    }

    componentDidMount() {
        //console.log(this.props);
    }

    handleChange = e => {
        this.setState({
            rateToSubmit: e.target.value
        })
    }

    async onSubmit(e) {
        e.preventDefault();

        this.formContainer.current.style.display = 'none';
        this.showRateContainer.current.style.display = 'none';
        this.loadingIcon.current.style.display = 'flex';

        const formInfo = {
            id: this.props.id,
            rate: this.state.rateToSubmit / 1000000,
            sessionId: localStorage.getItem('e'),
        };

        // console.log('submitted');

        const response = await axios.post(process.env.REACT_APP_SERVER_ADDRESS + '/update_'
        + ((this.props.type === 'evaluator') ? 'user' : 'object') + '_rate', formInfo);

        // console.log(response.data);
        
        this.setState({
            isRated: true,
        }, () => {
            this.showRateContainer.current.style.display = 'flex';
            this.loadingIcon.current.style.display = 'none';

            this.props.updateRate(response.data.rate);
        })
    }

    render() {
        const { isRated } = this.props;
        const { rateToSubmit } = this.state;

        // console.log(this.state);
        // console.log(this.props);

        // console.log({isRatedRate: isRated});

        return(<div>
            <div className="rate-type-2-outter-container">
                <div
                    className="rate-type-2-form-outter-container"
                    ref={this.formContainer}
                >
                    <form
                        className="rate-type-2-form"
                        onSubmit={this.onSubmit}
                    >
                        <div>
                            <input 
                                type="range"
                                name="rate"

                                min="0"
                                max="5000000"

                                value={rateToSubmit}
                                onChange={this.handleChange}

                                className="slider"
                            />

                            <span>
                                { Number(Math.floor(rateToSubmit / 10000) / 100).toFixed(2) }
                            </span>
                        </div>

                        <button
                            type="submit"
                            style={{
                                background: 'none',
                            }}
                        >
                            <HiOutlineStar />
                        </button>
                    </form>
                </div>

                <div
                    className="rate-type-2-rate-rate-number-and-rate-icon-outter-container"
                    ref={this.showRateContainer}
                >
                    <HiOutlineStar
                        onClick={() => {
                            if(!isRated) {
                                this.formContainer.current.style.display = 'block';
                                this.showRateContainer.current.style.display = 'none';
                            }
                        }}
                    />
                </div>

                <div className="rate-type-2-loading-icon" ref={this.loadingIcon}>
                    <img
                        src={loadingIcon}
                        alt="Loading"
                    />
                </div>
            </div>
            {/* <div className="rate-type-2-outter-container">
                <div className="rate-type-2-inner-container">
                    <div
                        className="rate-type-2-form-outter-container"
                        ref={this.formContainer}
                    >
                        <form
                            className="rate-type-2-form"
                            onSubmit={this.onSubmit}
                        >
                            <div>
                                <input 
                                    type="range"
                                    name="rate"

                                    min="0"
                                    max="5000000"

                                    value={rateToSubmit}
                                    onChange={this.handleChange}

                                    className="slider"
                                />

                                <span>
                                    { Number(Math.floor(rateToSubmit / 10000) / 100).toFixed(2) }
                                </span>
                            </div>

                            <button
                                type="submit"
                                style={{
                                    background: 'none',
                                }}
                            >
                                <HiOutlineStar />
                            </button>
                        </form>
                    </div>

                    <div
                        className="rate-type-2-rate-rate-number-and-rate-icon-outter-container"
                        ref={this.showRateContainer}
                    >
                        <div>
                            <span className="rate-type-2-rate-integer-part">
                                { `${rateIntegerPart}` }
                            </span>

                            <span className="rate-type-2-rate-decimal-part">
                                { `.${rateFirst2Decimals}` }
                            </span>
                        </div>

                        <HiOutlineStar
                            onClick={() => {
                                if(!isRated) {
                                    this.formContainer.current.style.display = 'block';
                                    this.showRateContainer.current.style.display = 'none';
                                }
                            }}
                        />

                        <div className="rate-type-2-rate-number-outter-container">
                            { rateNumber }
                        </div>
                    </div>

                    <div className="rate-type-2-loading-icon" ref={this.loadingIcon}>
                        <img
                            src={loadingIcon}
                            alt="Loading"
                        />
                    </div>
                </div>
            </div> */}
            </div>
        )
        
    }
}