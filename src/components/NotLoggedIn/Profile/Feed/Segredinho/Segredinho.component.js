import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import axios from 'axios';
import Linkify from 'react-linkify';

import getUserUsername from '../../../../functions/getUserUsername';

import './styles.css';

require('dotenv/config');

export default class PostSegredinho extends Component {
    constructor(props) {
        super(props);
        
        

        this.state = {
            clicked: false,

            originalMessage: '',
            hiddenMessage: '',

            submitted: null,
        }
    }

    async componentDidMount() {
        this.setState({
            userUsername: await getUserUsername(),
        })
    }

    
    
    render() {

        if(this.state.submitted) {
            return <Redirect to={"/redirect_to_profile/" + this.state.userUsername} />
        }

        else {
            const { clicked,  } = this.state;

            //if the user is not being followed, it'll show the follow button
            if(!(clicked)) {
                return (
                    <button className="profile-posts-add-button profile-posts-add-segredinho">
                        Segredinho
                    </button>
                )
            }

            else {
                return (
                    <div>
                        <form onSubmit={this.submit} encType="multipart/form-data">
                            <Linkify>
                                <div
                                    id="segredinho-editable-div"
                                    contentEditable="true"
                                    name="comment"
                                    //onKeyDown={(e) => {console.log(e.keyCode)}}
                                    //placeholder="What do you think of this?"
                                    ref={ this.editableDiv }
                                >
                                    
                                </div>
                            </Linkify>

                            <button onClick={this.showText}>
                                show text
                            </button>

                            <p>
                                Choose how you want to hide the text:
                            </p>

                            <div id="segredinho-hide-message-buttons">
                                <button onClick={this.hideCompletely}>
                                    hide completely
                                </button>

                                <button onClick={this.hideSelection}>
                                    hide selection
                                </button>

                                <button onClick={this.hideRandomly}>
                                    hide randomly
                                </button>
                            </div>

                            <button type="submit" disabled ref={ this.submitButton }>
                                post segredinho
                            </button>
                        </form>
                    </div>
                )
            }
        }
    }
}