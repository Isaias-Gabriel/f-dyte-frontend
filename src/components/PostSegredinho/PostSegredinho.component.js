import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import axios from 'axios';
import Linkify from 'react-linkify';

import getUserUsername from '../../functions/getUserUsername';

import './styles.css';

require('dotenv/config');

export default class PostSegredinho extends Component {
    constructor(props) {
        super(props);
        
        this.hideText = this.hideText.bind(this);

        this.showText = this.showText.bind(this);

        this.hideCompletely = this.hideCompletely.bind(this);
        this.hideSelection = this.hideSelection.bind(this);
        this.hideRandomly = this.hideRandomly.bind(this);

        this.submit = this.submit.bind(this);

        this.submitButton = React.createRef();
        this.editableDiv = React.createRef();

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

    hideText(text) {
        let toReturn = '';
        for(let letter of text) {
            if(letter === ' ') {
                toReturn = toReturn + ' ';
            }

            else {
                toReturn = toReturn + '*';
            }
        }

        return toReturn;
    }

    showText(e) {
        e.preventDefault();

        document.getElementById('segredinho-editable-div').innerText = this.state.originalMessage;
        this.submitButton.current.disabled = true;
    }

    hideCompletely(e) {
        e.preventDefault();

        if(this.editableDiv.current.innerText.length) {
            const originalText = document.getElementById('segredinho-editable-div').innerText;
            const hiddenText = this.hideText(originalText);
            document.getElementById('segredinho-editable-div').innerText = hiddenText;

            this.setState({
                originalMessage: originalText,
                hiddenMessage: hiddenText,
            }, () => {
                this.submitButton.current.disabled = false;
            })
        }
    }

    hideSelection(e) {
        e.preventDefault();

        const windowSelection = window.getSelection();

        const originalSelectedText = windowSelection.toString().replace('\n', ' ');

        if(this.editableDiv.current.innerText.length && originalSelectedText.length) {
            
            const start = windowSelection.getRangeAt(0).startOffset;
            const range = windowSelection.getRangeAt(0).endOffset - start;

            const hiddenSelectedText = this.hideText(originalSelectedText);
            const originalText = document.getElementById('segredinho-editable-div').innerText.replace('\n', ' ');

            const regex = new RegExp('(.{' + start + '}).{' + range + '}');

            const hiddenText = originalText.substring(0, start) +
                originalText.replace(regex, hiddenSelectedText);
            
            document.getElementById('segredinho-editable-div').innerText = hiddenText;

            this.setState({
                originalMessage: originalText,
                hiddenMessage: hiddenText,
            }, () => {
                this.submitButton.current.disabled = false;
            })
        }
    }

    hideRandomly(e) {
        e.preventDefault();

        if(this.editableDiv.current.innerText.length) {
            const originalText = document.getElementById('segredinho-editable-div').innerText;

            let hiddenText = '';

            for(let letter of originalText) {
                if(letter === ' ') {
                    hiddenText = hiddenText + ' ';
                }

                else {
                    const decider = Math.random();
                    if(decider < 0.5) {
                        hiddenText = hiddenText + '*';
                    }
                    else {
                        hiddenText = hiddenText + letter;
                    }
                }
            }
            
            document.getElementById('segredinho-editable-div').innerText = hiddenText;

            this.setState({
                originalMessage: originalText,
                hiddenMessage: hiddenText,
            }, () => {
                this.submitButton.current.disabled = false;
            })
        }
    }

    submit(e) {
        e.preventDefault();

        const formInfo = {
            sessionId: localStorage.getItem('e'),
            hiddenMessage: this.state.hiddenMessage,
            originalMessage: this.state.originalMessage,
        };

        axios.post(process.env.REACT_APP_SERVER_ADDRESS + '/post_segredinho', formInfo)
            .then(response => {
                
                document.getElementById('segredinho-editable-div').innerText = '';
                this.setState({
                    clicked: false,
                    originalMessage: '',
                    hiddenMessage: '',
                    submitted: true,
                });
            })
            .catch(err => console.log(err));
            
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
                    <div>
                        <button onClick={() => {this.setState({clicked: true})}}>
                            post segredinho
                        </button>
                    </div>
                    
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