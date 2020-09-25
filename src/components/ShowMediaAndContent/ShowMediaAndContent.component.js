import React from 'react';
import { Link } from 'react-router-dom';
import Linkify from 'react-linkify';
import ReactPlayer from 'react-player';

import ReturnReferenceAsLink from 
    '../ReturnReferenceAsLink/ReturnReferenceAsLink.component';

import './styles.css';

const Media = props => {
    const { url } = props;

    if(url) {
        if(url.includes(".mp4") || url.includes(".3gp") || url.includes(".webm")) {
            return(
                <div>
                    <ReactPlayer
                        className="sm-video"
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
                    <img className="sm-image" src={url} alt="sm"/>
                </div>
            )
        }
    }

    else {
        return '';
    }
}

const CreatorInfo = props => {

    const { type, userProfilePictureUrl, userName, userUsername, name, nickname } = props;

    if(!(type === 'object')) {
        return(
            <div>
                <div>
                    <img 
                        className="profile-image"
                        src={ userProfilePictureUrl }
                        alt="profile"
                    />
                </div>

                <div>
                    <Link to={"/profile/" + userUsername}>
                        { userName } @ { userUsername }
                    </Link>
                </div>
            </div>
        )
    }

    else {
        return (
            <div>
                <div>
                    <Link to={"/object/" + nickname}>
                        { name } / { nickname }
                    </Link>
                </div>
            </div>
        )
    }             
}

const ObjectMedia = props => {

    const { urls } = props;

    if(urls[1][0].length) {
        return(
            <div>
                <div>
                    {
                        urls[0].map(url => {
                            return <Media
                                key={url}
                                url={url}
                            />
                        })
                    }
                </div>

                <div>
                    {
                        urls[1].map(url => {
                            return <Media
                                key={url}
                                url={url}
                            />
                        })
                    }
                </div>
            </div>
        )
    }

    else {
        return(
            <div>
                <div>
                    {
                        urls[0].map(url => {
                            return <Media
                                key={url}
                                url={url}
                            />
                        })
                    }
                </div>
            </div>
        )
    }
}

const ObjectDescription = props => {

    const { description } = props;

    if(description[1][0].length) {
        return(
            <div>
                <Linkify>
                    <div>
                        <ReturnReferenceAsLink
                            text={ description[0][0] }
                        />
                    </div>
                    
                    <div>
                        <ReturnReferenceAsLink
                            text={ description[1][0][0] }
                        /> by

                        <span>
                            <Link to={"/profile/" + description[1][0][1]}>
                                { ` @${description[1][0][1]}` }
                            </Link>
                        </span>
                    </div>
                </Linkify>
            </div>
        )
    }

    else {
        return(
            <div>
                <Linkify>
                    <div>
                        { description[0][0] }
                    </div>
                </Linkify>
            </div>
        )
    }
}

const Content = props => {

    const { type, content, description, urls } = props;

    if(type === 'comment' || type === 'post') {
        return(
            <div>
                <div>
                    <ReturnReferenceAsLink
                        text={ content.text }
                    />
                </div>

                <div>
                    {
                        content.urls.map(url => {
                            return <Media
                                key={url}
                                url={url}
                            />
                        })
                    }
                </div>
            </div>
        )
    }

    else if(type === 'belle' || type === 'queima') {
        return(
            <div>
                <div>
                    {
                        content.urls.map(url => {
                            return <Media
                                key={url}
                                url={url}
                            />
                        })
                    }
                </div>

                <div>
                    <ReturnReferenceAsLink
                        text={ content.caption }
                    />
                </div>
            </div>
        )
    }

    else if(type === 'object') {
        //console.log({description, urls})
        return(
            <div>
                
                <ObjectMedia
                    urls={urls}
                />

                <ObjectDescription
                    description={description}
                />
            </div>
        )
    }

    else {
        return '';
    }

}

const ShowMediaAndContent = props => {

    return (
        <div className="urs-container">
            <div>
                <div>
                    <div>
                        <CreatorInfo
                            userProfilePictureUrl={ props.resource.userProfilePictureUrl }
                            userName={ props.resource.userName }
                            userUsername={ props.resource.userUsername }
                            name={ props.resource.name }
                            nickname={ props.resource.nickname }

                            type={ props.resource.type }
                        />

                        <div>
                            <div>
                                <Content
                                    content={ props.resource.content }
                                    type={ props.resource.type }
                                    description={ props.resource.description }
                                    urls={ props.resource.urls }
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ShowMediaAndContent;