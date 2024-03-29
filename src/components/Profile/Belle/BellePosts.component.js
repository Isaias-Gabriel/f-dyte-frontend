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

import ModalsHub from '../../ModalsHub/ModalsHub.component';

import './BellePostsStyles.css';

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

        this.updateRate = this.updateRate.bind(this);

        this.setComponentToNull = this.setComponentToNull.bind(this);

        this.addBelleAuxDiv = React.createRef();
        this.addBelle = React.createRef();
        this.addBelleFileInput = React.createRef();
        this.addBelleTextarea = React.createRef();
        this.addBelleSubmitButton = React.createRef();

        this.state = {
            caption: '',
            files: {},
            tempUrls: [],
            
            belles: [],
            belleGroups: [],

            ratedBelles: [],

            belle: {},
            showBelleComments: false,

            userUsername: '',

            uniqueImageIndex: 0,

            showAsGrid: true,

            whichComponent: null,

            staticText: {
                'pt-BR': {
                    postButton: 'Postar',
                    yes: 'Sim',
                    no: 'Não',

                    caption: 'Escreva uma legenda:',

                    noPostMessage: [
                        'Poste seus belles!',
                        'Poste apenas suas fotos mais incríveis, deslumbrantes, bonitas *** *******.',
                    ],
                },
                'en-US': {
                    postButton: 'Post',
                    yes: 'Yes',
                    no: 'No',

                    caption: 'Write a caption:',

                    noPostMessage: [
                        'Post your belles!',
                        'Post only your most amazing, astonishing, ******* beautiful photos.',
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

        axios.post(process.env.REACT_APP_SERVER_ADDRESS + '/get_all_belles', formInfo)
            .then(response => {

                let auxArray = [];

                if(response.data.belles.length) {

                    let tempBelles = [... response.data.belles];

                    while(tempBelles.length) {
                        auxArray.push(tempBelles.splice(0, 3));
                    }
                }
                
                this.setState({
                    belleGroups: auxArray,
                    belles: response.data.belles,
                    ratedBelles: response.data.ratedBelles,
                }, () => {
                    this.state.belles.map(belle => {

                        this.setState({
                            [ belle._id + 'uniqueImageIndex' ]: 0,
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
                    this.addBelleSubmitButton.current.disabled = true;
                }

                else {
                    this.addBelleSubmitButton.current.disabled = false;
                }
                
                if(len >= 7) {
                    this.addBelleFileInput.current.disabled = true;
                }
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
        fileData.append("caption", this.state.caption.trim());

        this.addBelle.current.style.display = "none";
        this.addBelleAuxDiv.current.style.display = "none";

        this.setState({
            caption: '',
            files: {},
            tempUrls: [],
            uniqueImageIndex: 0,
        })

        axios.post(process.env.REACT_APP_SERVER_ADDRESS + '/belle', fileData, {
            headers: {
                'content-type': 'multipart/form-data'
            }
        })
            .then(response => {

                const len1 = this.state.belleGroups.length;
                let auxArray1 = [], auxArray2 = [];

                for(let i = 0; i < len1; i++) {
                    auxArray1 = auxArray1.concat([... this.state.belleGroups[i]]);
                }

                auxArray1.unshift(response.data);

                while(auxArray1.length) {
                    auxArray2.push(auxArray1.splice(0, 3));
                }

                this.state.ratedBelles.unshift(response.data._id);
                this.state.belles.unshift(response.data);

                this.setState({
                    [ response.data._id + 'uniqueImageIndex' ]: 0,
                    belleGroups: auxArray2,
                })

                // if(this.props.username === response.data.userUsername) {
                //     this.state.belles.unshift(response.data)
                //     this.state.ratedBelles.unshift(response.data._id)
                // }
            })
            .catch(err => console.log(err));
        
    }

    updateRate(id, rate) {
        let tempBelles = [... this.state.belles];

        tempBelles = tempBelles.map(tempBelle => {
            if(tempBelle._id === id) {
                tempBelle.rate = rate;
                tempBelle.rateNumber = tempBelle.rateNumber + 1;
                return tempBelle;
            }

            return tempBelle;
        })

        this.setState({
            belles: tempBelles,
        })
    }

    setComponentToNull() {
        this.setState({
            whichComponent: null,
        })
    }

    render() {
        const {
            tempUrls,
            uniqueImageIndex,
            caption,
            belles,
            belleGroups,
            userUsername: visitorUsername,

            showAsGrid,

            staticText,
        } = this.state;

        const { username: visitedUsername } = this.props;

        // console.log(this.state);

        if(belleGroups.length) {
            if(showAsGrid) {
                return(
                    <div className="profile-belle-posts-outter-container">
                        <div
                            className="profile-belle-add-belle-aux-div" 
                            ref={this.addBelleAuxDiv}
                            onClick={() => {
                                this.addBelle.current.style.display = "none";
                                this.addBelleAuxDiv.current.style.display = "none";
                            }}
                        >
                        </div>
    
                        <div className="profile-belle-add-belle-div-outter-container" ref={this.addBelle}>
                            <div className="profile-belle-add-belle-div-inner-container">
                                <div
                                    className="profile-belle-add-belle-close-icon-outter-container"
                                    onClick={() => {
                                        this.addBelle.current.style.display = "none";
                                        this.addBelleAuxDiv.current.style.display = "none";
                                    }}
                                >
                                    <MdClose />
                                </div>
    
                                
                                <div className="profile-belle-add-belle-form-outter-container">
                                    <form
                                        onSubmit={this.submitBelle}
                                    >
                                        <div className="profile-belle-add-belle-media-preview">
                                            <div className="profile-belle-add-belle-media-preview-unique-image">
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
    
                                            <div className="profile-belle-add-belle-media-preview-all-images">
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
    
                                        <label htmlFor="files" className="profile-belle-add-belle-label">
                                            <RiImageAddLine />
                                        </label>
                                        
                                        <input 
                                            type="file"
                                            className="profile-belle-add-belle-file-input"
                                            id="files"
                                            name="files"
                                            
                                            //accept=".jpeg,.pjpeg,.png,.gif,.jpg,.mp4,.3gp,.webm"
                                            accept=".jpeg,.pjpeg,.png,.gif,.jpg"
                                            
                                            onChange={this.handleChangeFile}
    
                                            ref={this.addBelleFileInput}
                                        />
                                        
                                        <p className="profile-belle-add-belle-caption-message">
                                            {
                                                (staticText[localStorage.getItem('language')]) ?
                                                staticText[localStorage.getItem('language')].caption
                                                :
                                                staticText['en-US'].caption
                                            }
                                        </p>
    
                                        <Linkify>
                                            <textarea
                                                className="profile-belle-add-belle-textarea"
                                                name="content"
                                                onChange={this.handleChange}
                                                value={caption}
    
                                                maxLength="2000"
    
                                                ref={this.addBelleTextarea}
                                            />
                                        </Linkify>
    
                                        <button
                                            className="profile-belle-add-button profile-belle-add-belle profile-belle-add-belle-button-on-form"
                                            disabled
                                            ref={this.addBelleSubmitButton}
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
    
                        <div className="profile-belle-posts-inner-container">

                            {
                                (visitorUsername === visitedUsername) ?
                                (
                                    <div className="profile-belle-posts-add-belle-icon-outter-container">
                                        <span
                                            className="profile-belle-posts-add-belle"
                                            onClick={() => {
                                                this.addBelle.current.style.display = "block";
                                                this.addBelleAuxDiv.current.style.display = "block";
                                                this.addBelleFileInput.current.click();
                                            }}
                                        >
                                            <MdAdd />
                                        </span>
                                    </div>
                                )
                                :
                                (
                                    <div className="profile-belle-posts-filler-div">

                                    </div>
                                )
                            }
                            
    
                            <div className="profile-belle-posts-display-belle-posts-outter-container">
                                {
                                    belleGroups.map((group, index1) => {
                                        return(
                                            <div
                                                key={index1}
                                                className="profile-belle-posts-display-belle-group"
                                            >
                                                {
                                                    group.map((belle, index2) => {
                                                        return(
                                                            <div
                                                                key={`${index1}-${index2}`}
                                                                className="profile-belle-posts-display-single-belle-outter-container"
                                                                style={{
                                                                    backgroundImage: `url(${belle.content.urls[0]})`
                                                                }}
                                                                onClick={() => {
                                                                    this.setState({
                                                                        showAsGrid: false,
                                                                    }, () => {
                                                                        window.location.hash = 
                                                                            `#profile-belle-display-single-belle-${index1 * 3 + index2}`;
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
                    <div className="profile-belle-posts-outter-container">
                        <div
                            className="profile-belle-show-as-grid-icon-outter-container"
                            onClick={() => {
                                this.setState({
                                    showAsGrid: true,
                                })
                            }}
                        >
                            <MdKeyboardArrowLeft />
                        </div>
                        
                        <div
                            className="profile-belle-add-belle-aux-div" 
                            ref={this.addBelleAuxDiv}
                            onClick={() => {
                                this.addBelle.current.style.display = "none";
                                this.addBelleAuxDiv.current.style.display = "none";
                            }}
                        >
                        </div>
    
                        <div className="profile-belle-add-belle-div-outter-container" ref={this.addBelle}>
                            <div className="profile-belle-add-belle-div-inner-container">
                                <div
                                    className="profile-belle-add-belle-close-icon-outter-container"
                                    onClick={() => {
                                        this.addBelle.current.style.display = "none";
                                        this.addBelleAuxDiv.current.style.display = "none";
                                    }}
                                >
                                    <MdClose />
                                </div>
    
                                
                                <div className="profile-belle-add-belle-form-outter-container">
                                    <form
                                        onSubmit={this.submitBelle}
                                    >
                                        <div className="profile-belle-add-belle-media-preview">
                                            <div className="profile-belle-add-belle-media-preview-unique-image">
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
    
                                            <div className="profile-belle-add-belle-media-preview-all-images">
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
    
                                        <label htmlFor="files" className="profile-belle-add-belle-label">
                                            <RiImageAddLine />
                                        </label>
                                        
                                        <input 
                                            type="file"
                                            className="profile-belle-add-belle-file-input"
                                            id="files"
                                            name="files"
                                            
                                            //media-preview-unique-imaget=".jpeg,.pjpeg,.png,.gif,.jpg,.mp4,.3gp,.webm"
                                            accept=".jpeg,.pjpeg,.png,.gif,.jpg"
                                            
                                            onChange={this.handleChangeFile}
    
                                            ref={this.addBelleFileInput}
                                        />
                                        
                                        <p className="profile-belle-add-belle-caption-message">
                                            {
                                                (staticText[localStorage.getItem('language')]) ?
                                                staticText[localStorage.getItem('language')].caption
                                                :
                                                staticText['en-US'].caption
                                            }
                                        </p>
    
                                        <Linkify>
                                            <textarea
                                                className="profile-belle-add-belle-textarea"
                                                name="content"
                                                onChange={this.handleChange}
                                                value={caption}
    
                                                maxLength="2000"
    
                                                ref={this.addBelleTextarea}
                                            />
                                        </Linkify>
    
                                        <button
                                            className="profile-belle-add-button profile-belle-add-belle profile-belle-add-belle-button-on-form"
                                            disabled
                                            ref={this.addBelleSubmitButton}
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
                               <div className="profile-belle-posts-add-belle-icon-outter-container">
                                   <span
                                       className="profile-belle-posts-add-belle"
                                       onClick={() => {
                                           this.addBelle.current.style.display = "block";
                                           this.addBelleAuxDiv.current.style.display = "block";
                                           this.addBelleFileInput.current.click();
                                       }}
                                   >
                                       <MdAdd />
                                   </span>
                               </div>
                           )
                           :
                           (
                               <div className="profile-belle-posts-filler-div">

                               </div>
                           )
                        }

                        {
                            belles.map((belle, index) => {
                                return(
                                    <div
                                        key={index}
                                        id={`profile-belle-display-single-belle-${index}`}
                                        className="profile-belle-single-belle-outter-container"
                                    >
                                        <div className="profile-belle-single-belle-header-outter-container">
                                            <div
                                                className="profile-belle-single-belle-profile-picture-container"
                                                style={{
                                                    backgroundImage: `url(${belle.userProfilePictureUrl})`
                                                }}
                                            >
                                            </div>

                                            <div className="profile-belle-single-belle-name-and-username-outter-container">
                                                <div className="profile-belle-single-belle-name-outter-container">
                                                    { belle.userName }
                                                </div>

                                                <div className="profile-belle-single-belle-username-outter-container">
                                                    @{ belle.userUsername }
                                                </div>
                                            </div>
                                        </div>

                                        <div className="profile-belle-single-belle-media-outter-container">
                                            <div className="profile-belle-single-belle-media-preview-unique-image">
                                                <div
                                                    style={{
                                                        backgroundImage: `url(${belle.content.urls[ this.state[ belle._id + 'uniqueImageIndex' ] ]})`
                                                    }}
                                                    onClick={() => {
                                                        this.setState({
                                                            whichComponent: 'showMediaCompletely',
                                                            componentProps: {
                                                                url: belle.content.urls[ this.state[ belle._id + 'uniqueImageIndex' ] ]
                                                            }
                                                        });
                                                    }}
                                                >
                                                </div>
                                            </div>
                                            
                                            {
                                                belle.content.urls.length > 1 &&
                                                (
                                                    <div className="profile-belle-add-belle-media-preview-all-images">
                                                        {
                                                            belle.content.urls.map((url, index) => {
                                                                return(
                                                                    <div
                                                                        key={index}
                                                                        style={{
                                                                            backgroundImage: `url(${url})`
                                                                        }}
                                                                        onClick={() => {
                                                                            this.setState({
                                                                                [ belle._id + 'uniqueImageIndex' ]: index,
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

                                        <div className="profile-belle-rate-and-comment-outter-container">
                                            <RateType1
                                                rate={belle.rate.$numberDecimal}
                                                rateNumber={belle.rateNumber}
                                                isRated={this.state.ratedBelles.includes(belle._id) ? true: false}

                                                updateRate={this.updateRate}

                                                type={belle.type}
                                                id={belle._id}
                                            />

                                            <div className="profile-belle-main-icon">
                                                <FaRegCommentAlt />
                                            </div>
                                        </div>

                                        {
                                            (belle.content.caption) &&
                                            (
                                                <div className="profile-belle-single-belle-caption-outter-container">
                                                    <Linkify>
                                                        <div className="profile-belle-single-belle-caption">
                                                            { `${belle.content.caption}` }
                                                        </div>
                                                    </Linkify>
                                                </div>
                                            )
                                        }
                                    </div>
                                )
                            })
                        }

                        <ModalsHub 
                            whichComponent={this.state.whichComponent}
                            componentProps={this.state.componentProps}

                            setComponentToNull={this.setComponentToNull}
                        />
                    </div>

                    // <div className="profile-belle-posts-outter-container">
                    //     <div className="profile-belle-display-belle-posts-inner-container-1">
                    //         <div className="profile-belle-display-belle-posts-inner-container-2">
                    //             {
                    //                 belles.map((belle, index) => {
                    //                     return(
                    //                         <div
                    //                             key={index}
                    //                             className="profile-belle-single-belle-outter-container"
                    //                             id={`profile-belle-display-single-belle-${index}`}
                    //                         >
                    //                             <div className="profile-belle-display-single-belle-inner-container">
                    //                                 <div className="profile-belle-display-single-belle-header-outter-container">
                    //                                     <div
                    //                                         className="profile-belle-display-single-belle-profile-picture-container"
                    //                                         style={{
                    //                                             backgroundImage: `url(${belle.userProfilePictureUrl})`
                    //                                         }}
                    //                                     >
                    //                                     </div>

                    //                                     <div className="profile-belle-display-single-belle-name-and-username-outter-container">
                    //                                         <div className="profile-belle-display-single-belle-name-outter-container">
                    //                                             { belle.userName }
                    //                                         </div>

                    //                                         <div className="profile-belle-display-single-belle-username-outter-container">
                    //                                             /{ belle.userUsername }
                    //                                         </div>
                    //                                     </div>
                    //                                 </div>

                                                    
                    //                                 <div className="profile-belle-display-single-belle-media-outter-container">
                    //                                     <div className="profile-belle-display-single-belle-media-preview">
                    //                                         <div className="profile-belle--display-single-belle-media-preview-unique-image">
                    //                                             {
                    //                                                 belle.content.urls[ this.state[ belle._id + 'uniqueImageIndex' ] ] && (
                    //                                                     <div
                    //                                                         style={{
                    //                                                             backgroundImage: `url(${belle.content.urls[ this.state[ belle._id + 'uniqueImageIndex' ] ]})`
                    //                                                         }}
                    //                                                     >
                    //                                                     </div>
                    //                                                 )
                    //                                             }
                    //                                         </div>
                                                            
                    //                                         {
                    //                                             belle.content.urls.length > 1 &&
                    //                                             (
                    //                                                 <div className="profile-belle-add-belle-media-preview-all-images">
                    //                                                     {
                    //                                                         belle.content.urls.map((url, index) => {
                    //                                                             return(
                    //                                                                 <div
                    //                                                                     key={index}
                    //                                                                     style={{
                    //                                                                         backgroundImage: `url(${url})`
                    //                                                                     }}
                    //                                                                     onClick={() => {
                    //                                                                         this.setState({
                    //                                                                             [ belle._id + 'uniqueImageIndex' ]: index,
                    //                                                                         })
                    //                                                                     }}
                    //                                                                 >
                    //                                                                 </div>
                    //                                                             )
                    //                                                         })
                    //                                                     }
                    //                                                 </div>
                    //                                             )
                    //                                         }
                    //                                     </div>
                    //                                 </div>

                    //                                 {
                    //                                     belle.content.caption &&
                    //                                     (
                    //                                         <div className="profile-belle-display-single-belle-content-outter-container">
                    //                                             { `${belle.content.text}` }
                    //                                         </div>
                    //                                     )
                    //                                 }

                    //                                 <div className="profile-belle-rate-and-comment-outter-container">
                    //                                     <RateType1
                    //                                         rate={belle.rate.$numberDecimal}
                    //                                         rateNumber={belle.rateNumber}
                    //                                         isRated={this.state.ratedBelles.includes(belle._id) ? true: false}

                    //                                         type={belle.type}
                    //                                         id={belle._id}
                    //                                     />

                    //                                     <div className="profile-belle-main-icon">
                    //                                         <FaRegCommentAlt />
                    //                                     </div>
                    //                                 </div>
                    //                             </div>
                    //                         </div>
                    //                     )
                    //                 })
                    //             }
                    //         </div>
                    //     </div>
                    // </div>
                )
            }
        }

        else if(!belleGroups.length && (visitorUsername === visitedUsername)) {
            return(
                <div className="profile-belle-posts-no-posts-outter-container">
                    <div
                        className="profile-belle-add-belle-aux-div" 
                        ref={this.addBelleAuxDiv}
                        onClick={() => {
                            this.addBelle.current.style.display = "none";
                            this.addBelleAuxDiv.current.style.display = "none";
                        }}
                    >
                    </div>

                    <div className="profile-belle-add-belle-div-outter-container" ref={this.addBelle}>
                        <div className="profile-belle-add-belle-div-inner-container">
                            <div
                                className="profile-belle-add-belle-close-icon-outter-container"
                                onClick={() => {
                                    this.addBelle.current.style.display = "none";
                                    this.addBelleAuxDiv.current.style.display = "none";
                                }}
                            >
                                <MdClose />
                            </div>

                            
                            <div className="profile-belle-add-belle-form-outter-container">
                                <form
                                    onSubmit={this.submitBelle}
                                >
                                    <div className="profile-belle-add-belle-media-preview">
                                        <div className="profile-belle-add-belle-media-preview-unique-image">
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

                                        <div className="profile-belle-add-belle-media-preview-all-images">
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

                                    <label htmlFor="files" className="profile-belle-add-belle-label">
                                        <RiImageAddLine />
                                    </label>
                                    
                                    <input 
                                        type="file"
                                        className="profile-belle-add-belle-file-input"
                                        id="files"
                                        name="files"
                                        
                                        //accept=".jpeg,.pjpeg,.png,.gif,.jpg,.mp4,.3gp,.webm"
                                        accept=".jpeg,.pjpeg,.png,.gif,.jpg"
                                        
                                        onChange={this.handleChangeFile}

                                        ref={this.addBelleFileInput}
                                    />
                                    
                                    <p className="profile-belle-add-belle-caption-message">
                                        {
                                            (staticText[localStorage.getItem('language')]) ?
                                            staticText[localStorage.getItem('language')].caption
                                            :
                                            staticText['en-US'].caption
                                        }
                                    </p>

                                    <Linkify>
                                        <textarea
                                            className="profile-belle-add-belle-textarea"
                                            name="content"
                                            onChange={this.handleChange}
                                            value={caption}

                                            maxLength="2000"

                                            ref={this.addBelleTextarea}
                                        />
                                    </Linkify>

                                    <button
                                        className="profile-belle-add-button profile-belle-add-belle profile-belle-add-belle-button-on-form"
                                        disabled
                                        ref={this.addBelleSubmitButton}
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

                    <div className="profile-belle-posts-no-posts-message-for-user-outter-container">
                        <p className="profile-belle-posts-no-posts-message-for-user-1">
                            {
                                (staticText[localStorage.getItem('language')]) ?
                                staticText[localStorage.getItem('language')].noPostMessage[0]
                                :
                                staticText['en-US'].noPostMessage[0]
                            }
                        </p>

                        <p className="profile-belle-posts-no-posts-message-for-user-2">
                            {
                                (staticText[localStorage.getItem('language')]) ?
                                staticText[localStorage.getItem('language')].noPostMessage[1]
                                :
                                staticText['en-US'].noPostMessage[1]
                            }
                        </p>
                    </div>

                    <div className="profile-belle-posts-no-posts-icons-outter-container">
                        <span className="profile-belle-posts-no-posts-icon-star">
                            <HiOutlineStar />
                        </span>

                        <span
                            className="profile-belle-posts-no-posts-icon-add"
                            onClick={() => {
                                this.addBelle.current.style.display = "block";
                                this.addBelleAuxDiv.current.style.display = "block";
                                this.addBelleFileInput.current.click();
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

            //         <form onSubmit={this.submitBelle} encType="multipart/form-data">
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