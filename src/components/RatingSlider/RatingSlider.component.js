import React, { Component } from 'react';
import axios from 'axios';

import { HiOutlineStar } from 'react-icons/hi';

import './styles.css';

require('dotenv/config');

export default class RatingSlider extends Component {
    constructor(props) {
        super(props);

        this.handleChange = this.handleChange.bind(this);
        this.onSubmit = this.onSubmit.bind(this);

        this.state = {
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
            [ e.target.name ]: e.target.value
        })
    }

    onSubmit(e) {
        e.preventDefault();

        const formInfo = {
            id: this.props.id,
            rate: this.state.rate / 1000000,
            sessionId: localStorage.getItem('e'),
        };

        console.log({
            formInfo,
        })

        axios.post(process.env.REACT_APP_SERVER_ADDRESS + '/update_' + this.props.type + '_rate', formInfo)
            .then(res => {
                console.log(res.data);
                
                this.setState({
                    rated: true,
                })
            })
            .catch(err => console.log(err));
    }

    render() {
        const { clicked, rated } = this.state;
        //console.log(this.state);

        if(!(rated)) {
            if(!(clicked)) {
                return(
                    <button className="rtstr-button" onClick={() => {
                        this.setState({
                            clicked: true,
                        })
                    }}>
                        <HiOutlineStar className="rtstr-hstr" />
                    </button>
                )
            }
    
            else {
                const { rate } = this.state;
    
                return(
                    <div className="rating-slider-container-container">
                        <form onSubmit={this.onSubmit}>
                            <div className="slidecontainer mdzdsld">
                                <input 
                                    type="range"
                                    name="rate"
    
                                    min="0"
                                    max="5000000"
    
                                    value={rate}
                                    onChange={this.handleChange}
    
                                    className="slider"
                                />
    
                                <button type="submit" className="rtstr-button">
                                    <HiOutlineStar className="rtstr-hstr" />
                                </button>
                            </div>
                        </form>
    
                        <div className="rtn-div">
                            <div>
                                <span>
                                    {
                                        Number(Math.floor(rate / 10000) / 100).toFixed(2)
                                    }
                                </span>
                            </div>
                        </div>
                    </div>
                )
            }
        }

        else {
            return '';
        }
        
    }
}