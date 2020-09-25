import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

import ReactPlayer from 'react-player';
import Linkify from 'react-linkify';

import getUserUsername from '../../functions/getUserUsername';

//import CommentOnBelle from '../Comment/CommentOnBelle.component';
import CommentOnPQBS from '../Comment/CommentOnPQBS.component';

import './BellePostsStyles.css';

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
        axios.post(process.env.REACT_APP_SERVER_ADDRESS + '/delete_belle', { id: props.id })
            .then(() => props.filterBelles(props.id, props.singleBelle))
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

const Belle = props => {
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
                <img src={url} alt="belle"/>
            </div>
        )
    }
}

export default class BellePost extends Component {
    constructor(props) {
        super(props);

        this.handleChange = this.handleChange.bind(this);
        this.handleChangeFile = this.handleChangeFile.bind(this);
        
        this.filterBelles = this.filterBelles.bind(this);

        this.showBelles = this.showBelles.bind(this);

        this.showForm = this.showForm.bind(this);
        this.hideForm = this.hideForm.bind(this);

        this.showBelleRatingSlider = this.showBelleRatingSlider.bind(this);

        this.submitBelleRate = this.submitBelleRate.bind(this);
        this.submitBelle = this.submitBelle.bind(this);

        this.state = {
            caption: '',
            captionLength: 0,
            files: {},
            tempUrls: [],
            
            belles: [],

            ratedBelles: [],

            belle: {},
            showBelleComments: false,

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

        axios.post(process.env.REACT_APP_SERVER_ADDRESS + '/get_all_belles', formInfo)
            .then(response => {
                
                this.setState({
                    belles: response.data.belles,
                    ratedBelles: response.data.ratedBelles,
                }, () => {
                    this.state.belles.map(belle => {

                        this.setState({
                            [ belle._id ]: 0,
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

    onChangeBelleRate(e, belleId) {
        this.setState({
            [ belleId ]: e.target.value,
        })
    }

    filterBelles(id, singleBelle) {
        this.setState({
            belles: this.state.belles.filter(belle => {
                if(!(belle._id === id)) {
                    return belle
                }
            })
        }, () => {
            if(singleBelle) {
                this.setState({
                    showBelleComments: false,
                    belle: {},
                })
            }
        })

    }

    showBelles() {
        
        if(this.state.belles.length === 0) {
            
            return(
                <div id="show-belles">
                    <div id="user-has-no-belle">
                        <p>
                            Post your belles!
                        </p>

                        <p>
                            Post only your most amazing, astonishing, shining, as if painted by nymphs photos and short videos.
                        </p>
                    </div>
                </div>
            )
        }

        else {
            const { userUsername } = this.state;

            if(!(this.state.showBelleComments)) {
                if(this.state.belles.length) {
                    if(this.state.belles[0].userUsername === userUsername) {
                        return(
                            <div id="show-belles">
                                {
                                    this.state.belles.map(belle => {
                                        return(
                                            <div key={belle._id}>
                                                <ShowOptions 
                                                    id={belle._id}
                                                    filterBelles={this.filterBelles}
                                                    singleBelle={false}
                                                />

                                                <span>
                                                        { belle.userName + ` ` }
                                                </span>
                            
                                                <span>
                                                    <Link to={"/profile/" + belle.userUsername}>
                                                        @ { belle.userUsername }
                                                    </Link>
                                                </span>
                            
                                                {
                                                    belle.content.urls.map(url => {
                                                        return <Belle
                                                            key={url}
                                                            url={url}
                                                        />
                                                    })
                                                }

                                                <p>
                                                    { belle.content.caption }
                                                </p>
                            
                                                <p>
                                                    Belle rate: { Number(belle.rate.$numberDecimal).toFixed(2) }
                                                </p>
                            
                                                <p>
                                                    Number of rates: { belle.rateNumber }
                                                </p>
                            
                                                {
                                                    this.showBelleRatingSlider(belle._id)
                                                }
                            
                                                <button onClick={() => {
                                                    this.setState({
                                                        showBelleComments: true,
                                                        belle: belle,
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
                            <div id="show-belles">
                                {
                                    this.state.belles.map(belle => {
                                        return(
                                            <div key={belle._id}>
                                                <span>
                                                        { belle.userName + ` ` }
                                                </span>
                            
                                                <span>
                                                    <Link to={"/profile/" + belle.userUsername}>
                                                        @ { belle.userUsername }
                                                    </Link>
                                                </span>

                                                {
                                                    belle.content.urls.map(url => {
                                                        return <Belle
                                                            key={url}
                                                            url={url}
                                                        />
                                                    })
                                                }
                            
                                                <p>
                                                    { belle.content.caption }
                                                </p>
                            
                                                <p>
                                                    Belle rate: { Number(belle.rate.$numberDecimal).toFixed(2) }
                                                </p>
                            
                                                <p>
                                                    Number of rates: { belle.rateNumber }
                                                </p>
                            
                                                {
                                                    this.showBelleRatingSlider(belle._id)
                                                }
                            
                                                <button onClick={() => {
                                                    this.setState({
                                                        showBelleComments: true,
                                                        belle: belle,
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
                const { belle } = this.state;
                
                if(belle.userUsername === userUsername) {
                    return(
                        <div id="show-belle-and-comments">
                            <button onClick={() => {
                                    this.setState({
                                        showBelleComments: false,
                                        belle: {},
                                    })
                            }}>
                                Go back
                            </button>

                            <ShowOptions 
                                id={belle._id}
                                filterBelles={this.filterBelles}
                                singleBelle={true}
                            />
                            
                            <div>
                                <span>
                                        { belle.userName + ` ` }
                                </span>
            
                                <span>
                                    <Link to={"/profile/" + belle.userUsername}>
                                        @ { belle.userUsername }
                                    </Link>
                                </span>

                                {
                                    belle.content.urls.map(url => {
                                        return <Belle
                                            key={url}
                                            url={url}
                                        />
                                    })
                                }
            
                                <p>
                                    { belle.content.caption }
                                </p>
            
                                <p>
                                    Belle rate: { Number(belle.rate.$numberDecimal).toFixed(2) }
                                </p>
            
                                <p>
                                    Number of rates: { belle.rateNumber }
                                </p>
            
                                {
                                    this.showBelleRatingSlider(belle._id)
                                }
        
                                <hr/>
        
                                <CommentOnPQBS
                                        id={belle._id}
                                        commentOn={"belle"}
                                    />
                            </div> 
                        </div>
                    )
                }
                
                else {
                    return(
                        <div id="show-belle-and-comments">
                            <button onClick={() => {
                                    this.setState({
                                        showBelleComments: false,
                                        belle: {},
                                    })
                            }}>
                                Go back
                            </button>
                            
                            <div>
                                <span>
                                        { belle.userName + ` ` }
                                </span>
            
                                <span>
                                    <Link to={"/profile/" + belle.userUsername}>
                                        @ { belle.userUsername }
                                    </Link>
                                </span>
                                
                                {
                                    belle.content.urls.map(url => {
                                        return <Belle
                                            key={url}
                                            url={url}
                                        />
                                    })
                                }
            
                                <p>
                                    { belle.content.caption }
                                </p>
            
                                <p>
                                    Belle rate: { Number(belle.rate.$numberDecimal).toFixed(2) }
                                </p>
            
                                <p>
                                    Number of rates: { belle.rateNumber }
                                </p>
            
                                {
                                    this.showBelleRatingSlider(belle._id)
                                }
        
                                <hr/>
        
                                <CommentOnPQBS
                                        id={belle._id}
                                        commentOn={"belle"}
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

    showBelleRatingSlider(belleId) {

        //if the user haven't rated the comment yet, it can rate
        if(!(this.state.ratedBelles.includes(belleId))) {
            const postRate = this.state[belleId];

            return(
                <div className="slidecontainer">
                    <form className="rate-comment-on-object" onSubmit={(e) => this.submitBelleRate(e, belleId)}>
                        <input 
                            type="range"

                            min="0"
                            max="5000000"
                            value={postRate || 0}
                            onChange={(e) => this.onChangeBelleRate(e, belleId)}

                            id="myRange"
                            className="slider"
                        />

                        <p>Value: <span>{ Number(postRate / 1000000).toFixed(2) }</span></p>

                        <button type="submit">Rate this belle</button>
                    </form>
                </div>
            )
        }
    }

    submitBelleRate(e, belleId) {
        e.preventDefault();

        const formInfo = {
            belleId: belleId,
            belleRate: this.state[belleId] / 1000000,
            sessionId: localStorage.getItem('e'),
        };

        axios.post(process.env.REACT_APP_SERVER_ADDRESS + '/update_belle_rate', formInfo)
            .then(res => {
                this.state.ratedBelles.unshift(belleId);

                this.setState({
                    belles: this.state.belles.filter(belle => {
                        if(belle._id === belleId) {
                            belle.rate = res.data;
                            belle.rateNumber = belle.rateNumber + 1;
                            return belle
                        }
                        else {
                            return belle
                        }
                    })
                })
            })
            .catch(err => console.log(err));
    }

    submitBelle(e) {
        e.preventDefault();
        
        const fileData = new FormData();
        Object.keys(this.state.files).map(index => {
            fileData.append("files", this.state.files[index]);
        })

        fileData.append("sessionId", localStorage.getItem('e'));
        fileData.append("caption", document.getElementById('text-content-input-comment-on-object').innerText);

        axios.post(process.env.REACT_APP_SERVER_ADDRESS + '/belle', fileData, {
            headers: {
                'content-type': 'multipart/form-data'
            }
        })
            .then(response => {

                if(this.props.username === response.data.userUsername) {
                    this.state.belles.unshift(response.data)
                    this.state.ratedBelles.unshift(response.data._id)
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

                    <form onSubmit={this.submitBelle} encType="multipart/form-data">
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
                            post belle
                        </button>
                    </form>
                </div>

                <hr/>

                {
                    this.showBelles()
                }
            </div>
        )
    }
}