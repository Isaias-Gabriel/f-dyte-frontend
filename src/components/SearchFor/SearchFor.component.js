import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

require('dotenv/config');

export default class SearchFor extends Component {
    constructor(props) {
        super(props);
        
        this.onChange = this.onChange.bind(this);

        this.state = {
            searchString: '',

            resultsFromSearch: [],
        }
    }

    onChange(e) {
        this.setState({
            searchString: e.target.value,
            resultsFromSearch: [],
        }, () => {
            axios.post(process.env.REACT_APP_SERVER_ADDRESS + '/search_for_object_or_evaluator', {
                searchFor: this.state.searchString
            })
            .then(response => {
                this.setState({
                    resultsFromSearch: response.data,
                })
            })
            .catch(err => console.log(err));
        })
        
        
    }
    
    render() {
        const { searchString, resultsFromSearch } = this.state;

        return (
            <div id="search-for-container">
                <div>
                    <div>
                        <input
                            placeholder="search for objects or evaluators"

                            value={searchString}
                            onChange={this.onChange}
                        />
                    </div>

                    <div>
                        {
                            resultsFromSearch.map(resultFS => {
                                
                                if(resultFS.username) {
                                    return(
                                        <Link key={resultFS.username + resultFS._id} to={"/profile/" + resultFS.username}>
                                            <div>
                                                <p>
                                                { resultFS.name }
                                                </p>
                                            </div>
                                        </Link>
                                    )
                                }

                                else {
                                    return(
                                        <Link key={resultFS.nickname + resultFS._id} to={"/object/" + resultFS.nickname}>
                                            <div>
                                                <p>
                                                    { resultFS.name }
                                                </p>
                                            </div>
                                        </Link>
                                    )
                                }
                            })
                        }
                    </div>
                </div>
            </div>
        )
    }
}