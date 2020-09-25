import React from 'react';
import ReactPlayer from 'react-player';

import './styles.css';

const ShowMedia = props => {
    const url = props.url;

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

export default ShowMedia;