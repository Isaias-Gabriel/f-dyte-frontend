import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Linkify from 'react-linkify';
import ReactPlayer from 'react-player';

import { FaRegCommentAlt } from 'react-icons/fa';

import ReturnReferenceAsLink from 
    '../ReturnReferenceAsLink/ReturnReferenceAsLink.component';
    
import RateType1 from '../RatingSlider/RateType1.component';

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

    const { type, resource, index } = props;

    const [ uniqueImageIndex, setUniqueImageIndex ] = useState(0);

    if(type === 'belle' || type === 'queima') {
        return(
            <div
                id={`for-you-element-outter-container-${index}`}
                className="for-you-element-outter-container"
            >
                <div
                    className="show-media-and-content-outter-container"
                >
                    <div className="show-media-and-content-header-outter-container">
                        <div
                            className="show-media-and-content-profile-picture-container"
                            style={{
                                backgroundImage: `url(${resource.userProfilePictureUrl})`
                            }}
                        >
                        </div>

                        <div className="show-media-and-content-name-and-username-outter-container">
                            <div className="show-media-and-content-name-outter-container">
                                { resource.userName }
                            </div>

                            <div className="show-media-and-content-username-outter-container">
                                @{ resource.userUsername }
                            </div>
                        </div>
                    </div>

                    <div className="show-media-and-content-media-outter-container">
                        <div
                            className={
                                'show-media-and-content-media-preview-unique-image' + ' belle-or-queima-unique-image'
                            }
                        >
                            <div
                                style={{
                                    backgroundImage: `url(${resource.content.urls[ uniqueImageIndex ]})`
                                }}
                            >
                            </div>
                        </div>
                        
                        {
                            resource.content.urls.length > 1 &&
                            (
                                <div className="show-media-and-content-media-preview-all-images">
                                    {
                                        resource.content.urls.map((url, index) => {
                                            return(
                                                <div
                                                    key={index}
                                                    style={{
                                                        backgroundImage: `url(${url})`
                                                    }}
                                                    onClick={() => {
                                                        setUniqueImageIndex(index);
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

                    <div className="show-media-and-content-rate-and-comment-outter-container">
                        <RateType1
                            rate={resource.rate.$numberDecimal}
                            rateNumber={resource.rateNumber}
                            isRated={false}

                            type={resource.type}
                            id={resource._id}
                        />

                        <div className="show-media-and-content-main-icon">
                            <FaRegCommentAlt />
                        </div>
                    </div>

                    {
                        (resource.content.caption) &&
                        (
                            <div className="show-media-and-content-caption-outter-container">
                                <Linkify>
                                    <div className="show-media-and-content-caption">
                                        { `${resource.content.caption}` }
                                    </div>
                                </Linkify>
                            </div>
                        )
                    }
                </div>
            </div>
            
        )
    }

    else if(type === 'post' || type === 'segredinho' || type === 'comment' ) {
        return(
            <div
                id={`for-you-element-outter-container-${index}`}
                className="for-you-element-outter-container"
            >
                <div
                    className="show-media-and-content-outter-container"
                >
                    <div className="show-media-and-content-inner-container">
                        <div className="show-media-and-content-header-outter-container">
                            <div
                                className="show-media-and-content-profile-picture-container"
                                style={{
                                    backgroundImage: `url(${resource.userProfilePictureUrl})`
                                }}
                            >
                            </div>

                            <div className="show-media-and-content-name-and-username-outter-container">
                                <div className="show-media-and-content-name-outter-container">
                                    { resource.userName }
                                </div>

                                <div className="show-media-and-content-username-outter-container">
                                    @{ resource.userUsername }
                                </div>
                            </div>
                        </div>
                        
                        {
                            resource.content.text &&
                            (
                                <div className="show-media-and-content-content-outter-container">
                                    { `${resource.content.text}` }
                                </div>
                            )
                        }

                        {
                            resource.content.urls.length ?
                            (
                                <div className="show-media-and-content-media-outter-container">
                                    <div className="show-media-and-content-media-preview">
                                        <div
                                            className={
                                                'show-media-and-content-media-preview-unique-image' + ' post-or-comment-unique-image'
                                            }
                                        >
                                            {
                                                resource.content.urls[ uniqueImageIndex ] && (
                                                    <div
                                                        style={{
                                                            backgroundImage: `url(${resource.content.urls[ uniqueImageIndex ]})`
                                                        }}
                                                    >
                                                    </div>
                                                )
                                            }
                                        </div>
                                        
                                        {
                                            resource.content.urls.length > 1 &&
                                            (
                                                <div className="profile-posts-add-post-media-preview-all-images">
                                                    {
                                                        resource.content.urls.map((url, index) => {
                                                            return(
                                                                <div
                                                                    key={index}
                                                                    style={{
                                                                        backgroundImage: `url(${url})`
                                                                    }}
                                                                    onClick={() => {
                                                                        setUniqueImageIndex(index);
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
                                </div>
                            )
                            :
                            ''
                        }

                        <div className="show-media-and-content-rate-and-comment-outter-container ">
                            <RateType1
                                rate={resource.rate.$numberDecimal}
                                rateNumber={resource.rateNumber}
                                isRated={false}

                                type={resource.type}
                                id={resource._id}
                            />

                            <div className="show-media-and-content-main-icon">
                                <FaRegCommentAlt />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    else if(type === 'object') {
        return(
            <div
                id={`for-you-element-outter-container-${index}`}
                className="for-you-element-outter-container"
            >
                <div
                    className="show-media-and-content-object-outter-container"
                >
                    <div className="object-media-outter-container">
                        <div
                            className="object-media object-media-1"
                            style={{
                                backgroundImage: `url(${resource.urls[0][0]})`
                            }}
                        >
                        </div>

                        <div className="object-media-2-and-3-outter-container">
                            <div
                                className="object-media object-media-2"
                                style={{
                                    backgroundImage: `url(${resource.urls[0][1]})`
                                }}
                            >
                            </div>

                            <div
                                className="object-media object-media-3"
                                style={{
                                    backgroundImage: `url(${resource.urls[0][2]})`
                                }}
                            >
                            </div>
                        </div>
                    </div>

                    <div className="object-name-and-nickname-outter-container">
                        <div className="object-name-outter-container">
                            { resource.name }
                        </div>

                        <div className="object-nickname-outter-container">
                            /{ resource.nickname }
                        </div>
                    </div>

                    <div className="show-media-and-content-rate-and-comment-outter-container ">
                        <RateType1
                            rate={resource.rate.$numberDecimal}
                            rateNumber={resource.rateNumber}
                            isRated={false}

                            type={resource.type}
                            id={resource._id}
                        />

                        <div className="show-media-and-content-main-icon">
                            <FaRegCommentAlt />
                        </div>
                    </div>

                    <div className="object-categories-outter-container">
                        {
                            resource.categories[0].map((category, index) => {
                                return(
                                    <div key={index} className="object-category-outter-container">
                                        { `#${category}` }
                                    </div>
                                )
                            })
                        }
                    </div>

                    <div className="show-media-and-content-object-descriptions-outter-container">
                        <div>
                            <div className="show-media-and-content-object-default-description-outter-container">
                                { resource.description[0][0].substring(0, 57) }...
                            </div>

                            {
                                (resource.description[1][0].length)
                                ?
                                (
                                    <div className="show-media-and-content-object-volatile-descriptions-outter-container">
                                        {
                                            resource.description[1].map(description => {
                                                return(
                                                    <div className="show-media-and-content-object-volatile-description-outter-container">
                                                        { description[0].substring(0, 57) }...

                                                        <p>
                                                            {`by `}
                                                            
                                                            <Link to={`/profile/${description[1]}`}>
                                                                {`@${description[1]}`}
                                                            </Link>
                                                        </p>
                                                    </div>
                                                )
                                            })
                                        }
                                    </div>
                                )
                                :
                                ''
                            }
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    return '';
}

export default ShowMediaAndContent;