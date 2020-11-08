import React, { Component } from 'react';
import { Link, Redirect } from 'react-router-dom';
import axios from 'axios';

import ReactPlayer from 'react-player';
import Linkify from 'react-linkify';

import getUserUsername from '../../../functions/getUserUsername';

import CommentOnPQBS from '../../Comment/CommentOnPQBS.component';

import './QueimaPostsStyles.css';

require('dotenv/config');

function maxLength() {
    const input = document.querySelector('#text-content-input-comment-on-object');

    const settings = {
      maxLen: 433,
    }

    const keys = {
      'backspace': 8,
      'shift': 16,
      'ctrl': 17,
      'alt': 18,
      'delete': 46,
      // 'cmd':
      'leftArrow': 37,
      'upArrow': 38,
      'rightArrow': 39,
      'downArrow': 40,
    }

    const utils = {
      special: {},
      navigational: {},
      isSpecial(e) {
        return typeof this.special[e.keyCode] !== 'undefined';
      },
      isNavigational(e) {
        return typeof this.navigational[e.keyCode] !== 'undefined';
      }
    }

    utils.special[keys['backspace']] = true;
    utils.special[keys['shift']] = true;
    utils.special[keys['ctrl']] = true;
    utils.special[keys['alt']] = true;
    utils.special[keys['delete']] = true;

    utils.navigational[keys['upArrow']] = true;
    utils.navigational[keys['downArrow']] = true;
    utils.navigational[keys['leftArrow']] = true;
    utils.navigational[keys['rightArrow']] = true;

    input.addEventListener('keydown', function(event) {
      let len = event.target.innerText.trim().length;
      let hasSelection = false;
      let selection = window.getSelection();
      let isSpecial = utils.isSpecial(event);
      let isNavigational = utils.isNavigational(event);
      
      if (selection) {
        hasSelection = !!selection.toString();
      }
      
      if (isSpecial || isNavigational) {
        return true;
      }
      
      if (len >= settings.maxLen && !hasSelection) {
        event.preventDefault();
        return false;
      }
      
    });
}

const ShowOptions = props => {
    function deletePost() {
        axios.post(process.env.REACT_APP_SERVER_ADDRESS + '/delete_queima', { id: props.id })
            .then(() => props.filterQueimas(props.id, props.singleQueima))
            .catch(err => console.log(err));

    }

    return(
        <div>
            <span onClick={deletePost}>
                delete post
            </span>
        </div>
    )
}

const Queima = props => {
    const url = props.url;

    if(url.includes(".mp4") || url.includes(".3gp") || url.includes(".webm")) {
        return(
            <div>
                <ReactPlayer
                    url={url}
                    height={"30vh"}
                    controls
                />
            </div>
        )
    }

    else {
        return(
            <div>
                <img src={url} alt="queima"/>
            </div>
        )
    }
}

export default class QueimaPost extends Component {
    constructor(props) {
        super(props);

        this.handleChange = this.handleChange.bind(this);
        this.handleChangeFile = this.handleChangeFile.bind(this);
        
        this.filterQueimas = this.filterQueimas.bind(this);

        this.showQueimas = this.showQueimas.bind(this);

        this.showForm = this.showForm.bind(this);
        this.hideForm = this.hideForm.bind(this);

        this.showQueimaRatingSlider = this.showQueimaRatingSlider.bind(this);

        this.submitQueimaRate = this.submitQueimaRate.bind(this);
        this.submitQueima = this.submitQueima.bind(this);

        this.state = {
            captionLength: 0,
            files: {},
            tempUrls: [],
            
            queimas: [],

            ratedQueimas: [],

            queima: {},
            showQueimaComments: false,

            userUsername: '',
        }
    }

    componentDidMount() {
        
        this.setState({
            userUsername: getUserUsername(),
        })

        document.getElementById("pst-qm-bttn").disabled = true;
        
        const formInfo = {
            username: this.props.username,
            sessionId: localStorage.getItem('e'),
        };

        axios.post(process.env.REACT_APP_SERVER_ADDRESS + '/get_all_queimas', formInfo)
            .then(response => {
                
                this.setState({
                    queimas: response.data.queimas,
                    ratedQueimas: response.data.ratedQueimas,
                }, () => {
                    this.state.queimas.map(queima => {

                        this.setState({
                            [ queima._id ]: 0,
                        });
                    })

                })

            })
    }

    handleChange() {
        maxLength();
        this.setState({
            captionLength: document.getElementById('text-content-input-comment-on-object').innerText.length,
        })
    }

    handleChangeFile = e => {
        const file = e.target.files[0];

        if(file) {
            const reader = new FileReader();

            reader.readAsDataURL(e.target.files[0]);

            const preview = document.getElementById("media-preview-post");

            reader.addEventListener("load", function () {
                if(file.type.includes("image")) {
                    const image = new Image();
                    image.height = 100;
                    image.src = this.result;
                    preview.appendChild(image);
                }

                else if(file.type.includes("video")) {
                    const video = document.createElement('video');
                    const source = document.createElement('source');
                    source.src = this.result;

                    video.appendChild(source);
                    video.controls = "true";
                    preview.appendChild(video);
                }
            }, false);
            
            let files_temp = this.state.files;
            files_temp[Object.keys(files_temp).length] = file;

            this.setState({
                files: files_temp,
            }, () => {
                document.getElementById("pst-qm-bttn").disabled = false;
            })
        }
    }

    onChangeQueimaRate(e, queimaId) {
        this.setState({
            [ queimaId ]: e.target.value,
        })
    }

    filterQueimas(id, singleQueima) {
        this.setState({
            queimas: this.state.queimas.filter(queima => {
                if(!(queima._id === id)) {
                    return queima
                }
            })
        }, () => {
            if(singleQueima) {
                this.setState({
                    showQueimaComments: false,
                    queima: {},
                })
            }
        })

    }

    showQueimas() {
        
        if(!(this.state.queimas.length)) {
            
            return(
                <div id="show-queimas">
                    <div id="user-has-no-queima">
                        <p>
                            Post your queimas!
                        </p>

                        <p>
                            Post only your most lousy, ugly, cringe, karenish photos and short videos.
                        </p>
                    </div>
                </div>
            )
        }

        else {
            const { userUsername } = this.state;
            
            if(!(this.state.showQueimaComments)) {
                if(this.state.queimas.length) {
                    if(this.state.queimas[0].userUsername === userUsername) {
                        return(
                            <div id="show-queimas">
                                {
                                    this.state.queimas.map(queima => {
                                        return(
                                            <div key={queima._id}>
    
                                                <ShowOptions 
                                                    id={queima._id}
                                                    filterQueimas={this.filterQueimas}
                                                    singleQueima={false}
                                                />
    
                                                <span>
                                                        { queima.userName + ` ` }
                                                </span>
                            
                                                <span>
                                                    <Link to={"/profile/" + queima.userUsername}>
                                                        @ { queima.userUsername }
                                                    </Link>
                                                </span>
    
                                                {
                                                    queima.content.urls.map(url => {
                                                        return <Queima
                                                            key={url}
                                                            url={url}
                                                        />
                                                    })
                                                }
    
                                                <Linkify>
                                                    <p>
                                                        { queima.content.caption }
                                                    </p>
                                                </Linkify>
                                                
                                                <p>
                                                    Queima rate: { Number(queima.rate.$numberDecimal).toFixed(2) }
                                                </p>
                            
                                                <p>
                                                    Number of rates: { queima.rateNumber }
                                                </p>
                            
                                                {
                                                    this.showQueimaRatingSlider(queima._id)
                                                }
                            
                                                <button onClick={() => {
                                                    this.setState({
                                                        showQueimaComments: true,
                                                        queima: queima,
                                                    })
                                                }}>
                                                    Show comments
                                                </button>
                            
                                                <hr/>
                                            </div>
                                        )
                                    })
                                }
                            </div>
                        )
                    }
    
                    else {
                        return(
                            <div id="show-queimas">
                                {
                                    this.state.queimas.map(queima => {
                                        return(
                                            <div key={queima._id}>
                                                <span>
                                                        { queima.userName + ` ` }
                                                </span>
                            
                                                <span>
                                                    <Link to={"/profile/" + queima.userUsername}>
                                                        @ { queima.userUsername }
                                                    </Link>
                                                </span>
    
                                                {
                                                    queima.content.urls.map(url => {
                                                        return <Queima
                                                            key={url}
                                                            url={url}
                                                        />
                                                    })
                                                }
    
                                                <Linkify>
                                                    <p>
                                                        { queima.content.caption }
                                                    </p>
                                                </Linkify>
                                                
                                                <p>
                                                    Queima rate: { Number(queima.rate.$numberDecimal).toFixed(2) }
                                                </p>
                            
                                                <p>
                                                    Number of rates: { queima.rateNumber }
                                                </p>
                            
                                                {
                                                    this.showQueimaRatingSlider(queima._id)
                                                }
                            
                                                <button onClick={() => {
                                                    this.setState({
                                                        showQueimaComments: true,
                                                        queima: queima,
                                                    })
                                                }}>
                                                    Show comments
                                                </button>
                            
                                                <hr/>
                                            </div>
                                        )
                                    })
                                }
                            </div>
                        )
                    }
                }
            }
    
            else {
                const { queima } = this.state;
                
                if(queima.userUsername === userUsername) {
                    return(
                        <div id="show-queima-and-comments">
                            <button onClick={() => {
                                    this.setState({
                                        showQueimaComments: false,
                                        queima: {},
                                    })
                            }}>
                                Go back
                            </button>

                            <ShowOptions 
                                id={queima._id}
                                filterQueimas={this.filterQueimas}
                                singleQueima={true}
                            />
                            
                            <div>
                                <span>
                                        { queima.userName + ` ` }
                                </span>
            
                                <span>
                                    <Link to={"/profile/" + queima.userUsername}>
                                        @ { queima.userUsername }
                                    </Link>
                                </span>
            
                                <Linkify>
                                    <p>
                                        { queima.content.caption }
                                    </p>
                                </Linkify>
            
                                {
                                    queima.content.urls.map(url => {
                                        return <Queima
                                            key={url}
                                            url={url}
                                        />
                                    })
                                }
            
                                <p>
                                    Queima rate: { Number(queima.rate.$numberDecimal).toFixed(2) }
                                </p>
            
                                <p>
                                    Number of rates: { queima.rateNumber }
                                </p>
            
                                {
                                    this.showQueimaRatingSlider(queima._id)
                                }
        
                                <hr/>
                                
                                <CommentOnPQBS
                                    id={queima._id}
                                    commentOn={"queima"}
                                />
                            </div> 
                        </div>
                    )
                }
                
                else {
                    return(
                        <div id="show-queima-and-comments">
                            <button onClick={() => {
                                    this.setState({
                                        showQueimaComments: false,
                                        queima: {},
                                    })
                            }}>
                                Go back
                            </button>
                            
                            <div>
                                <span>
                                        { queima.userName + ` ` }
                                </span>
            
                                <span>
                                    <Link to={"/profile/" + queima.userUsername}>
                                        @ { queima.userUsername }
                                    </Link>
                                </span>
            
                                <Linkify>
                                    <p>
                                        { queima.content.caption }
                                    </p>
                                </Linkify>
            
                                {
                                    queima.content.urls.map(url => {
                                        return <Queima
                                            key={url}
                                            url={url}
                                        />
                                    })
                                }
            
                                <p>
                                    Queima rate: { Number(queima.rate.$numberDecimal).toFixed(2) }
                                </p>
            
                                <p>
                                    Number of rates: { queima.rateNumber }
                                </p>
            
                                {
                                    this.showQueimaRatingSlider(queima._id)
                                }
        
                                <hr/>
                                
                                <CommentOnPQBS
                                    id={queima._id}
                                    commentOn={"queima"}
                                />
                            </div> 
                        </div>
                    )
                }
            }
        }
        
    }

    showForm() {
        document.getElementById("add-new-post-button").style.display = "none";
        document.getElementById("add-new-post-form-container").style.display = "block";
    }

    hideForm() {
        document.getElementById("add-new-post-form-container").style.display = "none";
        document.getElementById("add-new-post-button").style.display = "block";
        document.getElementById("media-preview-post").innerHTML = "";
        document.getElementById("pst-qm-bttn").disabled = true;
        document.getElementById('text-content-input-comment-on-object').innerText = "";

        this.setState({
            caption: '',
            files: {},
            tempUrls: [],
        })
    }

    showQueimaRatingSlider(queimaId) {

        //if the user haven't rated the comment yet, it can rate
        if(!(this.state.ratedQueimas.includes(queimaId))) {
            const postRate = this.state[queimaId];

            return(
                <div className="slidecontainer">
                    <form className="rate-comment-on-object" onSubmit={(e) => this.submitQueimaRate(e, queimaId)}>
                        <input 
                            type="range"

                            min="0"
                            max="5000000"
                            value={postRate || 0}
                            onChange={(e) => this.onChangeQueimaRate(e, queimaId)}

                            id="myRange"
                            className="slider"
                        />

                        <p>Value: <span>{ Number(postRate / 1000000).toFixed(2) }</span></p>

                        <button type="submit">Rate this queima</button>
                    </form>
                </div>
            )
        }
    }

    submitQueimaRate(e, queimaId) {
        e.preventDefault();

        const formInfo = {
            queimaId: queimaId,
            queimaRate: this.state[queimaId] / 1000000,
            sessionId: localStorage.getItem('e'),
        };

        axios.post(process.env.REACT_APP_SERVER_ADDRESS + '/update_queima_rate', formInfo)
            .then(res => {
                this.state.ratedQueimas.unshift(queimaId);

                this.setState({
                    queimas: this.state.queimas.filter(queima => {
                        if(queima._id === queimaId) {
                            queima.rate = res.data;
                            queima.rateNumber = queima.rateNumber + 1;
                            return queima
                        }
                        else {
                            return queima
                        }
                    })
                })
            })
            .catch(err => console.log(err));
    }

    submitQueima(e) {
        e.preventDefault();
        
        const fileData = new FormData();
        Object.keys(this.state.files).map(index => {
            fileData.append("files", this.state.files[index]);
        })

        fileData.append("sessionId", localStorage.getItem('e'));
        fileData.append("caption", document.getElementById('text-content-input-comment-on-object').innerText);

        axios.post(process.env.REACT_APP_SERVER_ADDRESS + '/queima', fileData, {
            headers: {
                'content-type': 'multipart/form-data'
            }
        })
            .then(response => {

                if(this.props.username === response.data.userUsername) {
                    this.state.queimas.unshift(response.data)
                    this.state.ratedQueimas.unshift(response.data._id)
                }
                //redirect to the profile of the user who's posting
                // else {
                    
                // }
                
                this.setState({}, () => {
                    this.hideForm();
                })
            })
            .catch(err => console.log(err));
        
    }

    render() {
        const { captionLength } = this.state;

        return(
            <div id="profile-post-container">
                <div id="add-new-post-button" onClick={this.showForm}>
                    +
                </div>

                <div id="add-new-post-form-container">
                    <span onClick={this.hideForm}>
                        x
                    </span>

                    <form onSubmit={this.submitQueima} encType="multipart/form-data">
                        <div>
                            <div id="media-preview-post">

                            </div>

                            <label htmlFor="files" id="files-label">
                                +
                            </label>

                            <input 
                                type="file"
                                id="files"
                                name="files"
                                
                                accept=".jpeg,.pjpeg,.png,.gif,.jpg,.mp4,.3gp,.webm"
                                
                                onChange={this.handleChangeFile}
                            />
                        </div>

                        
                        <Linkify>
                            <div
                                id="text-content-input-comment-on-object"
                                contentEditable="true"
                                name="caption"
                                onInput={this.handleChange}
                                //placeholder="What do you think of this?"
                            >
                                
                            </div>
                        </Linkify>

                        <p>
                            { captionLength } / 433
                        </p>

                        {/* Show how much characters the text area have written in / the max characters it can have */}

                        <button type="submit" id="pst-qm-bttn">
                            post queima
                        </button>
                    </form>
                </div>

                <hr/>

                {
                    this.showQueimas()
                }
            </div>
        )
    }
}