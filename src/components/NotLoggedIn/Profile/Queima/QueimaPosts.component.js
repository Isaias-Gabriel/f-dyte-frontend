import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

import ReactPlayer from 'react-player';
import Linkify from 'react-linkify';

import { FaRegCommentAlt } from 'react-icons/fa';
import { HiOutlineStar } from 'react-icons/hi';
import { MdAdd } from 'react-icons/md';

import { MdKeyboardArrowLeft } from 'react-icons/md';

import { RiImageAddLine } from 'react-icons/ri';
import { MdClose } from 'react-icons/md';

import getUserUsername from '../../../functions/getUserUsername';

import RateType1 from '../../RatingSlider/RateType1.component';

//import CommentOnBelle from '../Comment/CommentOnBelle.component';
import CommentOnPQBS from '../../Comment/CommentOnPQBS.component';

import './QueimaPostsStyles.css';

require('dotenv/config');

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

export default class QueimaPost extends Component {
    constructor(props) {
        super(props);

        this.handleChange = this.handleChange.bind(this);
        this.handleChangeFile = this.handleChangeFile.bind(this);
        
        this.filterBelles = this.filterBelles.bind(this);

        this.showBelles = this.showBelles.bind(this);

        this.showForm = this.showForm.bind(this);
        this.hideForm = this.hideForm.bind(this);

        this.showBelleRatingSlider = this.showBelleRatingSlider.bind(this);

        this.submitQueimaRate = this.submitQueimaRate.bind(this);
        this.submitQueima = this.submitQueima.bind(this);

        this.updateRate = this.updateRate.bind(this);

        this.addQueimaAuxDiv = React.createRef();
        this.addQueima = React.createRef();
        this.addQueimaFileInput = React.createRef();
        this.addQueimaTextarea = React.createRef();
        this.addQueimaSubmitButton = React.createRef();

        this.state = {
            caption: '',
            files: {},
            tempUrls: [],
            
            queimas: [],
            queimaGroups: [],

            ratedQueimas: [],

            belle: {},
            showBelleComments: false,

            userUsername: '',

            uniqueImageIndex: 0,

            showAsGrid: true,

            staticText: {
                'pt-BR': {
                    postButton: 'Postar',
                    yes: 'Sim',
                    no: 'Não',

                    caption: 'Escreva uma legenda:',

                    noPostMessage: [
                        'Poste seus queimas!',
                        'Poste apenas sua fotos mais feias, sebosas e lixosas.',
                    ],
                },
                'en-US': {
                    postButton: 'Post',
                    yes: 'Yes',
                    no: 'No',

                    caption: 'Write a caption:',

                    noPostMessage: [
                        'Post your queimas!',
                        'Post only your most lousy, ugly, cringe, karen-ish photos.',
                    ],
                },
            },
        }
    }

    async componentDidMount() {
        this.setState({
            userUsername: await getUserUsername(),
        })

        // document.getElementById("pst-qm-bttn").disabled = true;
        
        const formInfo = {
            username: this.props.username,
            sessionId: localStorage.getItem('e'),
        };

        axios.post(process.env.REACT_APP_SERVER_ADDRESS + '/get_all_queimas', formInfo)
            .then(response => {

                let auxArray = [];

                if(response.data.queimas.length) {

                    let tempBelles = [... response.data.queimas];

                    while(tempBelles.length) {
                        auxArray.push(tempBelles.splice(0, 3));
                    }
                }
                
                this.setState({
                    queimaGroups: auxArray,
                    queimas: response.data.queimas,
                    ratedQueimas: response.data.ratedQueimas,
                }, () => {
                    this.state.queimas.map(queima => {

                        this.setState({
                            [ queima._id + 'uniqueImageIndex' ]: 0,
                        })

                        // this.setState({
                        //     [ post._id ]: 0,
                        // });
                    })
                })

            })

        if(!localStorage.getItem('language')) {
            localStorage.setItem('language', navigator.language);
        }
    }

    handleChange(e) {
        this.setState({
            caption: e.target.value,
        })
    }

    handleChangeFile = e => {
        const file = e.target.files[0];

        if(file) {
            const reader = new FileReader();

            reader.readAsDataURL(e.target.files[0]);

            reader.addEventListener("load", (e) => {
                const len = this.state.tempUrls.push(e.currentTarget.result);

                this.setState({
                    uniqueImageIndex: (len - 1),
                })

                if(len === 0) {
                    this.addQueimaSubmitButton.current.disabled = true;
                }

                else {
                    this.addQueimaSubmitButton.current.disabled = false;
                }
                
                if(len >= 7) {
                    this.addQueimaFileInput.current.disabled = true;
                }

                this.setState({});
            }, false);
            
            let files_temp = this.state.files;
            files_temp[Object.keys(files_temp).length] = file;

            this.setState({
                files: files_temp,
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
        // document.getElementById("add-new-post-button").style.display = "none";
        // document.getElementById("add-new-post-form-container").style.display = "block";
    }

    hideForm() {
        // document.getElementById("add-new-post-form-container").style.display = "none";
        // document.getElementById("add-new-post-button").style.display = "block";
        // document.getElementById("media-preview-post").innerHTML = "";
        // document.getElementById("pst-qm-bttn").disabled = true;
        // document.getElementById('text-content-input-comment-on-object').innerText = "";

        this.setState({
            caption: '',
            files: {},
            tempUrls: [],
        })
    }

    showBelleRatingSlider(belleId) {

        //if the user haven't rated the comment yet, it can rate
        if(!(this.state.ratedQueimas.includes(belleId))) {
            const postRate = this.state[belleId];

            return(
                <div className="slidecontainer">
                    <form className="rate-comment-on-object" onSubmit={(e) => this.submitQueimaRate(e, belleId)}>
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

    submitQueimaRate(e, belleId) {
        e.preventDefault();

        const formInfo = {
            belleId: belleId,
            belleRate: this.state[belleId] / 1000000,
            sessionId: localStorage.getItem('e'),
        };

        axios.post(process.env.REACT_APP_SERVER_ADDRESS + '/update_belle_rate', formInfo)
            .then(res => {
                this.state.ratedQueimas.unshift(belleId);

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

    submitQueima(e) {
        e.preventDefault();
        
        const fileData = new FormData();
        Object.keys(this.state.files).map(index => {
            fileData.append("files", this.state.files[index]);
        })

        fileData.append("sessionId", localStorage.getItem('e'));
        fileData.append("caption", this.state.caption.trim());

        this.addQueima.current.style.display = "none";
        this.addQueimaAuxDiv.current.style.display = "none";

        this.setState({
            caption: '',
            files: {},
            tempUrls: [],
            uniqueImageIndex: 0,
        })

        axios.post(process.env.REACT_APP_SERVER_ADDRESS + '/queima', fileData, {
            headers: {
                'content-type': 'multipart/form-data'
            }
        })
            .then(response => {

                const len1 = this.state.queimaGroups.length;
                let auxArray1 = [], auxArray2 = [];

                for(let i = 0; i < len1; i++) {
                    auxArray1 = auxArray1.concat([... this.state.queimaGroups[i]]);
                }

                auxArray1.unshift(response.data);

                while(auxArray1.length) {
                    auxArray2.push(auxArray1.splice(0, 3));
                }

                this.state.ratedQueimas.unshift(response.data._id);
                this.state.queimas.unshift(response.data);

                this.setState({
                    [ response.data._id + 'uniqueImageIndex' ]: 0,
                    queimaGroups: auxArray2,
                })

                // if(this.props.username === response.data.userUsername) {
                //     this.state.belles.unshift(response.data)
                //     this.state.ratedQueimas.unshift(response.data._id)
                // }
            })
            .catch(err => console.log(err));
        
    }

    updateRate(id, rate) {
        let tempQueimas = [... this.state.queimas];

        tempQueimas = tempQueimas.map(tempQueima => {
            if(tempQueima._id === id) {
                tempQueima.rate = rate;
                tempQueima.rateNumber = tempQueima.rateNumber + 1;
                return tempQueima;
            }

            return tempQueima;
        })

        this.setState({
            queimas: tempQueimas,
        })
    }

    render() {
        const {
            tempUrls,
            uniqueImageIndex,
            caption,
            queimas,
            queimaGroups,
            userUsername: visitorUsername,

            showAsGrid,

            staticText,
        } = this.state;

        const { username: visitedUsername } = this.props;

        // console.log(this.state);

        if(queimaGroups.length) {
            if(showAsGrid) {
                return(
                    <div className="profile-queima-posts-outter-container">
                        <div
                            className="profile-queima-add-queima-aux-div" 
                            ref={this.addQueimaAuxDiv}
                            onClick={() => {
                                this.addQueima.current.style.display = "none";
                                this.addQueimaAuxDiv.current.style.display = "none";
                            }}
                        >
                        </div>
    
                        <div className="profile-queima-add-queima-div-outter-container" ref={this.addQueima}>
                            <div className="profile-queima-add-queima-div-inner-container">
                                <div
                                    className="profile-queima-add-queima-close-icon-outter-container"
                                    onClick={() => {
                                        this.addQueima.current.style.display = "none";
                                        this.addQueimaAuxDiv.current.style.display = "none";
                                    }}
                                >
                                    <MdClose />
                                </div>
    
                                
                                <div className="profile-queima-add-queima-form-outter-container">
                                    <form
                                        onSubmit={this.submitQueima}
                                    >
                                        <div className="profile-queima-add-queima-media-preview">
                                            <div className="profile-queima-add-queima-media-preview-unique-image">
                                                {
                                                    tempUrls[uniqueImageIndex] && (
                                                        <div
                                                            style={{
                                                                backgroundImage: `url(${tempUrls[uniqueImageIndex]})`
                                                            }}
                                                        >
                                                        </div>
                                                    )
                                                }
                                            </div>
    
                                            <div className="profile-queima-add-queima-media-preview-all-images">
                                                {
                                                    tempUrls.map((url, index) => {
                                                        return(
                                                            <div
                                                                key={index}
                                                                style={{
                                                                    backgroundImage: `url(${url})`
                                                                }}
                                                                onClick={() => {
                                                                    this.setState({
                                                                        uniqueImageIndex: index,
                                                                    })
                                                                }}
                                                            >
                                                            </div>
                                                        )
                                                    })
                                                }
                                            </div>
                                        </div>
    
                                        <label htmlFor="files" className="profile-queima-add-queima-label">
                                            <RiImageAddLine />
                                        </label>
                                        
                                        <input 
                                            type="file"
                                            className="profile-queima-add-queima-file-input"
                                            id="files"
                                            name="files"
                                            
                                            //accept=".jpeg,.pjpeg,.png,.gif,.jpg,.mp4,.3gp,.webm"
                                            accept=".jpeg,.pjpeg,.png,.gif,.jpg"
                                            
                                            onChange={this.handleChangeFile}
    
                                            ref={this.addQueimaFileInput}
                                        />
                                        
                                        <p className="profile-queima-add-queima-caption-message">
                                            {
                                                (staticText[localStorage.getItem('language')]) ?
                                                staticText[localStorage.getItem('language')].caption
                                                :
                                                staticText['en-US'].caption
                                            }
                                        </p>
    
                                        <Linkify>
                                            <textarea
                                                className="profile-queima-add-queima-textarea"
                                                name="content"
                                                onChange={this.handleChange}
                                                value={caption}
    
                                                maxLength="2000"
    
                                                ref={this.addQueimaTextarea}
                                            />
                                        </Linkify>
    
                                        <button
                                            className="profile-queima-add-button profile-queima-add-queima profile-queima-add-queima-button-on-form"
                                            disabled
                                            ref={this.addQueimaSubmitButton}
                                        >
                                            {
                                                (staticText[localStorage.getItem('language')]) ?
                                                staticText[localStorage.getItem('language')].postButton
                                                :
                                                staticText['en-US'].postButton
                                            }
                                        </button>
                                    </form>
                                </div>
                            </div>
                        </div>
    
                        <div className="profile-queima-posts-inner-container">
                            {
                                (visitorUsername === visitedUsername) ?
                                (
                                    <div className="profile-queima-posts-add-queima-icon-outter-container">
                                        <span
                                            className="profile-queima-posts-add-queima"
                                            onClick={() => {
                                                this.addQueima.current.style.display = "block";
                                                this.addQueimaAuxDiv.current.style.display = "block";
                                                this.addQueimaFileInput.current.click();
                                            }}
                                        >
                                            <MdAdd />
                                        </span>
                                    </div>
                                )
                                :
                                (
                                    <div className="profile-queima-posts-filler-div">
    
                                    </div>
                                )
                            }
    
                            <div className="profile-queima-posts-display-queima-posts-outter-container">
                                {
                                    queimaGroups.map((group, index1) => {
                                        return(
                                            <div
                                                key={index1}
                                                className="profile-queima-posts-display-queima-group"
                                            >
                                                {
                                                    group.map((queima, index2) => {
                                                        return(
                                                            <div
                                                                key={`${index1}-${index2}`}
                                                                className="profile-queima-posts-display-single-queima-outter-container"
                                                                style={{
                                                                    backgroundImage: `url(${queima.content.urls[0]})`
                                                                }}
                                                                onClick={() => {
                                                                    this.setState({
                                                                        showAsGrid: false,
                                                                    }, () => {
                                                                        window.location.hash = 
                                                                            `#profile-queima-display-single-queima-${index1 * 3 + index2}`;
                                                                    })
                                                                }}
                                                            >
                                                            </div>
                                                        )
                                                    })
                                                }
                                            </div>
                                        )
                                    })
                                }
                            </div>
                        </div>
                    </div>
                )
            }

            else {
                return(
                    <div className="profile-queima-posts-outter-container">
                        <div
                            className="profile-queima-show-as-grid-icon-outter-container"
                            onClick={() => {
                                this.setState({
                                    showAsGrid: true,
                                })
                            }}
                        >
                            <MdKeyboardArrowLeft />
                        </div>
                        
                        <div
                            className="profile-queima-add-queima-aux-div" 
                            ref={this.addQueimaAuxDiv}
                            onClick={() => {
                                this.addQueima.current.style.display = "none";
                                this.addQueimaAuxDiv.current.style.display = "none";
                            }}
                        >
                        </div>
    
                        <div className="profile-queima-add-queima-div-outter-container" ref={this.addQueima}>
                            <div className="profile-queima-add-queima-div-inner-container">
                                <div
                                    className="profile-queima-add-queima-close-icon-outter-container"
                                    onClick={() => {
                                        this.addQueima.current.style.display = "none";
                                        this.addQueimaAuxDiv.current.style.display = "none";
                                    }}
                                >
                                    <MdClose />
                                </div>
    
                                
                                <div className="profile-queima-add-queima-form-outter-container">
                                    <form
                                        onSubmit={this.submitQueima}
                                    >
                                        <div className="profile-queima-add-queima-media-preview">
                                            <div className="profile-queima-add-queima-media-preview-unique-image">
                                                {
                                                    tempUrls[uniqueImageIndex] && (
                                                        <div
                                                            style={{
                                                                backgroundImage: `url(${tempUrls[uniqueImageIndex]})`
                                                            }}
                                                        >
                                                        </div>
                                                    )
                                                }
                                            </div>
    
                                            <div className="profile-queima-add-queima-media-preview-all-images">
                                                {
                                                    tempUrls.map((url, index) => {
                                                        return(
                                                            <div
                                                                key={index}
                                                                style={{
                                                                    backgroundImage: `url(${url})`
                                                                }}
                                                                onClick={() => {
                                                                    this.setState({
                                                                        uniqueImageIndex: index,
                                                                    })
                                                                }}
                                                            >
                                                            </div>
                                                        )
                                                    })
                                                }
                                            </div>
                                        </div>
    
                                        <label htmlFor="files" className="profile-queima-add-queima-label">
                                            <RiImageAddLine />
                                        </label>
                                        
                                        <input 
                                            type="file"
                                            className="profile-queima-add-queima-file-input"
                                            id="files"
                                            name="files"
                                            
                                            //accept=".jpeg,.pjpeg,.png,.gif,.jpg,.mp4,.3gp,.webm"
                                            accept=".jpeg,.pjpeg,.png,.gif,.jpg"
                                            
                                            onChange={this.handleChangeFile}
    
                                            ref={this.addQueimaFileInput}
                                        />
                                        
                                        <p className="profile-queima-add-queima-caption-message">
                                            {
                                                (staticText[localStorage.getItem('language')]) ?
                                                staticText[localStorage.getItem('language')].caption
                                                :
                                                staticText['en-US'].caption
                                            }
                                        </p>
    
                                        <Linkify>
                                            <textarea
                                                className="profile-queima-add-queima-textarea"
                                                name="content"
                                                onChange={this.handleChange}
                                                value={caption}
    
                                                maxLength="2000"
    
                                                ref={this.addQueimaTextarea}
                                            />
                                        </Linkify>
    
                                        <button
                                            className="profile-queima-add-button profile-queima-add-queima profile-queima-add-queima-button-on-form"
                                            disabled
                                            ref={this.addQueimaSubmitButton}
                                        >
                                            {
                                                (staticText[localStorage.getItem('language')]) ?
                                                staticText[localStorage.getItem('language')].postButton
                                                :
                                                staticText['en-US'].postButton
                                            }
                                        </button>
                                    </form>
                                </div>
                            </div>
                        </div>

                        {
                            (visitorUsername === visitedUsername) ?
                            (
                                <div className="profile-queima-posts-add-queima-icon-outter-container">
                                    <span
                                        className="profile-queima-posts-add-queima"
                                        onClick={() => {
                                            this.addQueima.current.style.display = "block";
                                            this.addQueimaAuxDiv.current.style.display = "block";
                                            this.addQueimaFileInput.current.click();
                                        }}
                                    >
                                        <MdAdd />
                                    </span>
                                </div>
                            )
                            :
                            (
                                <div className="profile-queima-posts-filler-div">
 
                                </div>
                            )
                        }

                        {
                            queimas.map((queima, index) => {
                                return(
                                    <div
                                        key={index}
                                        id={`profile-queima-display-single-queima-${index}`}
                                        className="profile-queima-single-queima-outter-container"
                                    >
                                        <div className="profile-queima-single-queima-header-outter-container">
                                            <div
                                                className="profile-queima-single-queima-profile-picture-container"
                                                style={{
                                                    backgroundImage: `url(${queima.userProfilePictureUrl})`
                                                }}
                                            >
                                            </div>

                                            <div className="profile-queima-single-queima-name-and-username-outter-container">
                                                <div className="profile-queima-single-queima-name-outter-container">
                                                    { queima.userName }
                                                </div>

                                                <div className="profile-queima-single-queima-username-outter-container">
                                                    @{ queima.userUsername }
                                                </div>
                                            </div>
                                        </div>

                                        <div className="profile-queima-single-queima-media-outter-container">
                                            <div className="profile-queima-single-queima-media-preview-unique-image">
                                                <div
                                                    style={{
                                                        backgroundImage: `url(${queima.content.urls[ this.state[ queima._id + 'uniqueImageIndex' ] ]})`
                                                    }}
                                                >
                                                </div>
                                            </div>
                                            
                                            {
                                                queima.content.urls.length > 1 &&
                                                (
                                                    <div className="profile-queima-add-queima-media-preview-all-images">
                                                        {
                                                            queima.content.urls.map((url, index) => {
                                                                return(
                                                                    <div
                                                                        key={index}
                                                                        style={{
                                                                            backgroundImage: `url(${url})`
                                                                        }}
                                                                        onClick={() => {
                                                                            this.setState({
                                                                                [ queima._id + 'uniqueImageIndex' ]: index,
                                                                            })
                                                                        }}
                                                                    >
                                                                    </div>
                                                                )
                                                            })
                                                        }
                                                    </div>
                                                )
                                            }
                                        </div>

                                        <div className="profile-queima-rate-and-comment-outter-container">
                                            <RateType1
                                                rate={queima.rate.$numberDecimal}
                                                rateNumber={queima.rateNumber}
                                                isRated={this.state.ratedQueimas.includes(queima._id) ? true: false}

                                                updateRate={this.updateRate}

                                                type={queima.type}
                                                id={queima._id}
                                            />

                                            <div className="profile-queima-main-icon">
                                                <FaRegCommentAlt />
                                            </div>
                                        </div>

                                        {
                                            (queima.content.caption) &&
                                            (
                                                <div className="profile-queima-single-queima-caption-outter-container">
                                                    <Linkify>
                                                        <div className="profile-queima-single-queima-caption">
                                                            { `${queima.content.caption}` }
                                                        </div>
                                                    </Linkify>
                                                </div>
                                            )
                                        }
                                    </div>
                                )
                            })
                        }
                    </div>
                )
            }
        }

        else if(!queimaGroups.length && (visitorUsername === visitedUsername)) {
            return(
                <div className="profile-queima-posts-no-posts-outter-container">
                    <div
                        className="profile-queima-add-queima-aux-div" 
                        ref={this.addQueimaAuxDiv}
                        onClick={() => {
                            this.addQueima.current.style.display = "none";
                            this.addQueimaAuxDiv.current.style.display = "none";
                        }}
                    >
                    </div>

                    <div className="profile-queima-add-queima-div-outter-container" ref={this.addQueima}>
                        <div className="profile-queima-add-queima-div-inner-container">
                            <div
                                className="profile-queima-add-queima-close-icon-outter-container"
                                onClick={() => {
                                    this.addQueima.current.style.display = "none";
                                    this.addQueimaAuxDiv.current.style.display = "none";
                                }}
                            >
                                <MdClose />
                            </div>

                            
                            <div className="profile-queima-add-queima-form-outter-container">
                                <form
                                    onSubmit={this.submitQueima}
                                >
                                    <div className="profile-queima-add-queima-media-preview">
                                        <div className="profile-queima-add-queima-media-preview-unique-image">
                                            {
                                                tempUrls[uniqueImageIndex] && (
                                                    <div
                                                        style={{
                                                            backgroundImage: `url(${tempUrls[uniqueImageIndex]})`
                                                        }}
                                                    >
                                                    </div>
                                                )
                                            }
                                        </div>

                                        <div className="profile-queima-add-queima-media-preview-all-images">
                                            {
                                                tempUrls.map((url, index) => {
                                                    return(
                                                        <div
                                                            key={index}
                                                            style={{
                                                                backgroundImage: `url(${url})`
                                                            }}
                                                            onClick={() => {
                                                                this.setState({
                                                                    uniqueImageIndex: index,
                                                                })
                                                            }}
                                                        >
                                                        </div>
                                                    )
                                                })
                                            }
                                        </div>
                                    </div>

                                    <label htmlFor="files" className="profile-queima-add-queima-label">
                                        <RiImageAddLine />
                                    </label>
                                    
                                    <input 
                                        type="file"
                                        className="profile-queima-add-queima-file-input"
                                        id="files"
                                        name="files"
                                        
                                        //accept=".jpeg,.pjpeg,.png,.gif,.jpg,.mp4,.3gp,.webm"
                                        accept=".jpeg,.pjpeg,.png,.gif,.jpg"
                                        
                                        onChange={this.handleChangeFile}

                                        ref={this.addQueimaFileInput}
                                    />
                                    
                                    <p className="profile-queima-add-queima-caption-message">
                                        {
                                            (staticText[localStorage.getItem('language')]) ?
                                            staticText[localStorage.getItem('language')].caption
                                            :
                                            staticText['en-US'].caption
                                        }
                                    </p>

                                    <Linkify>
                                        <textarea
                                            className="profile-queima-add-queima-textarea"
                                            name="content"
                                            onChange={this.handleChange}
                                            value={caption}

                                            maxLength="2000"

                                            ref={this.addQueimaTextarea}
                                        />
                                    </Linkify>

                                    <button
                                        className="profile-queima-add-button profile-queima-add-queima profile-queima-add-queima-button-on-form"
                                        disabled
                                        ref={this.addQueimaSubmitButton}
                                    >
                                        {
                                            (staticText[localStorage.getItem('language')]) ?
                                            staticText[localStorage.getItem('language')].postButton
                                            :
                                            staticText['en-US'].postButton
                                        }
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>

                    <div className="profile-queima-posts-no-posts-message-for-user-outter-container">
                        <p className="profile-queima-posts-no-posts-message-for-user-1">
                            {
                                (staticText[localStorage.getItem('language')]) ?
                                staticText[localStorage.getItem('language')].noPostMessage[0]
                                :
                                staticText['en-US'].noPostMessage[0]
                            }
                        </p>

                        <p className="profile-queima-posts-no-posts-message-for-user-2">
                            {
                                (staticText[localStorage.getItem('language')]) ?
                                staticText[localStorage.getItem('language')].noPostMessage[1]
                                :
                                staticText['en-US'].noPostMessage[1]
                            }
                        </p>
                    </div>

                    <div className="profile-queima-posts-no-posts-icons-outter-container">
                        <span className="profile-queima-posts-no-posts-icon-star">
                            <HiOutlineStar />
                        </span>

                        <span
                            className="profile-queima-posts-no-posts-icon-add"
                            onClick={() => {
                                this.addQueima.current.style.display = "block";
                                this.addQueimaAuxDiv.current.style.display = "block";
                                this.addQueimaFileInput.current.click();
                            }}
                        >
                            <MdAdd />
                        </span>
                    </div>
                </div>
            )
        }

        else return '';
                
            // <div id="profile-post-container">
            //     <div id="add-new-post-button" onClick={this.showForm}>
            //         +
            //     </div>

            //     <div id="add-new-post-form-container">
            //         <span onClick={this.hideForm}>
            //             x
            //         </span>

            //         <form onSubmit={this.submitQueima} encType="multipart/form-data">
            //             <div>
            //                 <div id="media-preview-post">

            //                 </div>

            //                 <label htmlFor="files" id="files-label">
            //                     +
            //                 </label>

            //                 <input 
            //                     type="file"
            //                     id="files"
            //                     name="files"
                                
            //                     accept=".jpeg,.pjpeg,.png,.gif,.jpg,.mp4,.3gp,.webm"
                                
            //                     onChange={this.handleChangeFile}
            //                 />
            //             </div>

                        
            //             <Linkify>
            //                 <div
            //                     id="text-content-input-comment-on-object"
            //                     contentEditable="true"
            //                     name="caption"
            //                     onInput={this.handleChange}
            //                     //placeholder="What do you think of this?"
            //                 >
                                
            //                 </div>
            //             </Linkify>

            //             <p>
            //                 { captionLength } / 433
            //             </p>

            //             {/* Show how much characters the text area have written in / the max characters it can have */}

            //             <button type="submit" id="pst-qm-bttn">
            //                 post belle
            //             </button>
            //         </form>
            //     </div>

            //     <hr/>

            //     {
            //         this.showBelles()
            //     }
            // </div>
        
    }
}