import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import axios from 'axios';

import GoHome from '../GoHome/GoHome.component';
import IsLogged from '../IsLogged/IsLogged.component';

import ShowMedia from '../ShowMedia/ShowMedia.component';

import './styles.css';

require('dotenv/config');

export default class CreateObject extends Component {

    constructor(props) {
        super(props);

        this.handleChange = this.handleChange.bind(this);
        this.onChangeNickname = this.onChangeNickname.bind(this);
        this.handleChangeCategory = this.handleChangeCategory.bind(this);
        this.handleChangeFile = this.handleChangeFile.bind(this);
        
        this.onSubmit = this.onSubmit.bind(this);

        this.messageOnSuccessDiv = React.createRef();
        this.submitButton = React.createRef();
        this.categoriesInput = React.createRef();

        this.state = {
            name: '',
            nickname: '',
            category: '',
            categoriesList: [],

            acceptableCharacters: [ 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 
                'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v',
                'w', 'x', 'y', 'z', '0', '1', '2', '3', '4', '5', '6', '7', '8',
                '9', '_' ],

            nicknameStatus: '',
            nicknameIsAcceptable: '',
            filesWarningMessage: '',

            description: '',
            rate: 0,

            files: {},
            tempUrls: [],
        }
    }

    componentDidMount() {
        document.getElementById("create-object-submit-button").disabled = true;
    }

    handleChange = e => {
        this.setState({
            [ e.target.name ]: e.target.value
        })
    }

    onChangeNickname = e => {
        let hasUnacceptableValue = false;

        for(let character of e.target.value) {
            if(!(this.state.acceptableCharacters.includes(character))) {
                hasUnacceptableValue = true;
            }
        }
        
        if(hasUnacceptableValue) {
            this.setState({
                [ e.target.name ]: e.target.value,
                nicknameIsAcceptable: 'The nickname should contain only lowercase english letters, numbers or underscores ( _ )'
            })
        }

        else {
            this.setState({
                [ e.target.name ]: e.target.value,
                nicknameIsAcceptable: '',
            }, () => {
                const formInfo = { nickname: this.state.nickname }
                axios.post(process.env.REACT_APP_SERVER_ADDRESS + '/object_nickname_in_use', formInfo)
                    .then(response => {
                        //if the nickname is not available
                        if(response.data) {
                            this.setState({
                                nicknameStatus: 'This nickname is not available',
                                //nicknameAvailable: false,
                            }, () => {
                                document.getElementById("create-object-submit-button").disabled = true;
                            })
                        }
                        else {
                            this.setState({
                                nicknameStatus: '',
                                //nicknameAvailable: true,
                            }, () => {
                                //if(this.state.emailAvailable) {
                                    document.getElementById("create-object-submit-button").disabled = false;
                                //}
                            })
                        }
                    })
                    .catch(err => console.log(err));
            });
        }
    }

    handleChangeCategory = e => {
        const typedCharacter = e.target.value[e.target.value.length - 1];

        if(typedCharacter === ',') {
            const category = e.target.value.replace('#', '').replace(',', '');
            if(category.trim().length) {
                this.state.categoriesList.push(category.trim());

                this.categoriesInput.current.required = false;

                this.setState({
                    category: '',
                })
            }
        }

        else {
            this.setState({
                category: e.target.value,
            })
        }
        
    }

    handleChangeFile = e => {
        const file = e.target.files[0];
        const reader = new FileReader();

        reader.readAsDataURL(e.target.files[0]);

        const preview = document.getElementById("media-preview");

        reader.addEventListener("load", (e) => {
            this.state.tempUrls.push(e.currentTarget.result);

            this.setState({});
        }, false);
        
        let files_temp = this.state.files;
        files_temp[Object.keys(files_temp).length] = file;

        this.setState({
            files: files_temp,
        }, () => {
            if(Object.keys(this.state.files).length >= 3) {
                this.submitButton.current.disabled = false;
                this.setState({
                    filesWarningMessage: '',
                })
            }
        })
    }

    onSubmit(e) {
        e.preventDefault();

        if(Object.keys(this.state.files).length < 3) {
            this.submitButton.current.disabled = true;
            this.setState({
                filesWarningMessage: 'You must choose at least three images for the object',
            })
        }

        else {
            this.submitButton.current.disabled = true;

            const fileData = new FormData();
            Object.keys(this.state.files).map(index => {
                fileData.append("files", this.state.files[index]);
            })

            const { name, nickname, categoriesList, description, rate } = this.state;

            fileData.append("sessionId", localStorage.getItem('e'));
            fileData.append("name", name.trim());
            fileData.append("nickname", nickname);
            fileData.append("categories", categoriesList);
            fileData.append("description", description.trim());
            fileData.append("rate", rate / 1000000);

            this.setState({
                "name": name.trim(),
                "description": description.trim(),
            })

            axios.post(process.env.REACT_APP_SERVER_ADDRESS + '/create_object', fileData, {
                headers: {
                    'content-type': 'multipart/form-data'
                }
            })
                .then(response => {
                    this.messageOnSuccessDiv.current.style.display = "block";

                    setTimeout(() => {
                        this.setState({
                            objectCreated: '/object/' + response.data,
                        })
                    }, 2700);
                })
                .catch(err => console.log(err));
        }
    }
    
    render() {
        const { name, nickname, category,
            categoriesList, nicknameStatus,
            nicknameIsAcceptable, description,
            rate, filesWarningMessage } = this.state;

        if(this.state.objectCreated) {
            return <Redirect to={this.state.objectCreated} />;
        }

        return (
            <div className="create-object-page-container">
                <IsLogged/>
                <GoHome/>

                <div className="create-object-sucess-message-outter-container" ref={this.messageOnSuccessDiv}>
                    <div className="create-object-sucess-message-div">
                        The object '{name}' was created :D
                    </div>
                    <div className="create-object-sucess-message-div-aux">

                    </div>
                </div>

                <div className="create-object-container">

                        <form id="create-object" onSubmit={this.onSubmit} encType="multipart/form-data">
                            <input 
                                type="text" 
                                name="name"

                                placeholder="Name"
                                value={name}

                                minLength="1"
                                maxLength="500"
                                required
                                
                                onChange={this.handleChange}
                            />

                            <div>
                                <input 
                                    type="text"
                                    name="nickname"

                                    placeholder="Choose a nickname for the object"
                                    value={nickname}

                                    minLength="1"
                                    maxLength="500"
                                    required

                                    onChange={this.onChangeNickname}
                                />

                                <span>
                                    { nicknameIsAcceptable }
                                </span>

                                <span>
                                    { nicknameStatus }
                                </span>
                            </div>
                            
                            <p>
                                Write the categories in the form: #category1, #category2, #category3 etc
                            </p>

                            {
                                categoriesList.map(category => {
                                    return(
                                        <span key={category} className="create-object-category">
                                            { category }
                                        </span>
                                    )
                                })
                            }

                            <input 
                                type="text" 
                                name="category"

                                placeholder="Category"
                                value={category}

                                minLength="1"
                                maxLength="300"

                                ref={this.categoriesInput}
                                required

                                onChange={this.handleChangeCategory}
                            />

                            <textarea 
                                type="text"
                                name="description"
                                
                                placeholder="Description"
                                value={description}

                                className="create-object-text-area"

                                minLength="3"
                                maxLength="500"
                                required

                                onChange={this.handleChange}
                            />

                            <div className="create-object-media-preview">
                                {
                                    this.state.tempUrls.map(url => {
                                        return <ShowMedia
                                                    key={url}
                                                    url={url}
                                                />
                                    })
                                    //console.log(this.state.files)
                                }
                            </div>

                            <label htmlFor="files" id="files-label">
                                +
                            </label>

                            <input
                                type="file"
                                id="files"
                                name="files"
                                
                                //accept=".jpeg,.pjpeg,.png,.gif,.jpg,.mp4,.3gp,.webm"
                                accept=".jpeg,.png,.jpg,"
                                
                                onChange={this.handleChangeFile}
                            />

                            <div>
                                <div>
                                    {
                                        filesWarningMessage
                                    }
                                </div>
                            </div>

                            <label>Rate</label>

                            <div className="slidecontainer">
                                <input 
                                    type="range"
                                    name="rate"

                                    min="0"
                                    max="5000000"

                                    value={rate}
                                    onChange={this.handleChange}

                                    id="myRange"
                                    className="slider"
                                />
                                <p>Value: <span>{ Number(Math.floor(rate / 10000) / 100).toFixed(2) }</span></p>
                            </div>

                            <button
                                type="submit"
                                id="create-object-submit-button"
                                ref={this.submitButton}
                            >
                                Create object
                            </button>
                        </form>
                </div>
            </div>
        );
    }
}