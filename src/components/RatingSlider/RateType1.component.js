// rate for posts (posts, segredinhos, queimas, belles), comments and objects (only on the for you)import React, { Component } from 'react';
import React, { Component } from 'react';
import axios from 'axios';

import { HiOutlineStar } from 'react-icons/hi';

import './rateType1Styles.css';

require('dotenv/config');

export default class RatingSlider extends Component {
    constructor(props) {
        super(props);

        this.handleChange = this.handleChange.bind(this);
        this.onSubmit = this.onSubmit.bind(this);

        this.showRateContainer = React.createRef();
        this.formContainer = React.createRef();

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
        let temp_rate = parseFloat(this.props.rate);
        let rateIntegerPart, rateFirst2Decimals;
        
        if(typeof temp_rate === typeof 5) {
            if(temp_rate === 0) {
                rateIntegerPart = '0';
                rateFirst2Decimals = '00';
            }

            else if(temp_rate > 0 && temp_rate < 1) {
                temp_rate = (parseFloat(temp_rate) * 100).toString();
            
                rateIntegerPart = '0';
                rateFirst2Decimals = temp_rate[0] + temp_rate[1];
            }

            else {
                temp_rate = (parseFloat(temp_rate) * 100).toString();
            
                rateIntegerPart = temp_rate[0];
                rateFirst2Decimals = temp_rate[1] + temp_rate[2];
            }
        }

        this.setState({
            rateToShow: this.props.rate,
            rateNumber: this.props.rateNumber,
            isRated: this.props.isRated,
            rateIntegerPart,
            rateFirst2Decimals,
        })
        //console.log(this.props);
    }

    handleChange = e => {
        this.setState({
            rateToSubmit: e.target.value
        })
    }

    async onSubmit(e) {
        e.preventDefault();

        const formInfo = {
            id: this.props.id,
            rate: this.state.rateToSubmit / 1000000,
            sessionId: localStorage.getItem('e'),
        };

        console.log('submitted');

        const res = await axios.post(process.env.REACT_APP_SERVER_ADDRESS + '/update_' + this.props.type + '_rate', formInfo);
        
        if(this.props.type === 'queima' || this.props.type === 'belle') {
            this.props.updateRate(this.props.id, res.data.rate);
        }

        let temp_rate = parseFloat(res.data.rate.$numberDecimal);
        let rateIntegerPart, rateFirst2Decimals;
        
        if(typeof temp_rate === typeof 5) {
            if(temp_rate === 0) {
                rateIntegerPart = '0';
                rateFirst2Decimals = '00';
            }

            else if(temp_rate > 0 && temp_rate < 1) {
                temp_rate = (parseFloat(temp_rate) * 100).toString();
            
                rateIntegerPart = '0';
                rateFirst2Decimals = temp_rate[0] + temp_rate[1];
            }

            else {
                temp_rate = (parseFloat(temp_rate) * 100).toString();
            
                rateIntegerPart = temp_rate[0];
                rateFirst2Decimals = temp_rate[1] + temp_rate[2];
            }
        }
        
        this.setState({
            rateIntegerPart,
            rateFirst2Decimals,
            rateNumber: this.state.rateNumber + 1,
            isRated: true,
        }, () => {
            this.formContainer.current.style.display = 'none';
            this.showRateContainer.current.style.display = 'flex';
        })
    }

    render() {
        const { rateIntegerPart, rateFirst2Decimals, rateNumber, rateToSubmit, isRated } = this.state;
        const { updateRate } = this.props;

        // console.log(this.state);
        // console.log(this.props);

        return(
            <div className="rate-type-1-outter-container">
                <div className="rate-type-1-inner-container">
                    <div
                        className="rate-type-1-form-outter-container"
                        ref={this.formContainer}
                    >
                        <form
                            className="rate-type-1-form"
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
                        className="rate-type-1-rate-rate-number-and-rate-icon-outter-container"
                        ref={this.showRateContainer}
                    >
                        <div>
                            <span className="rate-type-1-rate-integer-part">
                                { `${rateIntegerPart}` }
                            </span>

                            <span className="rate-type-1-rate-decimal-part">
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

                        <div className="rate-type-1-rate-number-outter-container">
                            { rateNumber }
                        </div>
                    </div>
                </div>
            </div>
        )



        //const { clicked, rated } = this.state;
        //console.log(this.state);

        // if(!(rated)) {
        //     if(!(clicked)) {
        //         return(
        //             <button className="rtstr-button" onClick={() => {
        //                 this.setState({
        //                     clicked: true,
        //                 })
        //             }}>
        //                 <HiOutlineStar className="rtstr-hstr" />
        //             </button>
        //         )
        //     }
    
        //     else {
        //         const { rate } = this.state;
    
        //         return(
        //             <div className="rating-slider-container-container">
        //                 
        //                     <div className="slidecontainer mdzdsld">
        //                         <input 
        //                             type="range"
        //                             name="rate"
    
        //                             min="0"
        //                             max="5000000"
    
        //                             value={rate}
        //                             onChange={this.handleChange}
    
        //                             className="slider"
        //                         />
    
        //                         <button type="submit" className="rtstr-button">
        //                             <HiOutlineStar className="rtstr-hstr" />
        //                         </button>
        //                     </div>
        //                 </form>
    
        //                 <div className="rtn-div">
        //                     <div>
        //                         <span>
        //                             {
        //                                 Number(Math.floor(rate / 10000) / 100).toFixed(2)
        //                             }
        //                         </span>
        //                     </div>
        //                 </div>
        //             </div>
        //         )
        //     }
        // }

        // else {
        //     return '';
        // }
        
    }
}