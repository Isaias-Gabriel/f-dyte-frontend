import React, { Component } from 'react';

import ShowAndPostComments from '../ShowAndPostComments/ShowAndPostComments.component';

require('dotenv/config');

export default class Test extends Component {
    constructor(props) {
        super(props);

        this.state = {
            parentState: {
                whichComponent: null,
            },
        }
    }

    componentDidMount() {
        //console.log(this.props)

        // this.setState({
        //     parentState: this.props.state,
        // })
    }

    componentDidUpdate() {
        // console.log(this.props);
    }
    
    render() {

        const { whichComponent } = this.props;

        if(whichComponent) {
            if(whichComponent === 'comment') {
                const { id, type } = this.props.componentProps;

                return <ShowAndPostComments
                        id={id}
                        type={type}
                        setComponentToNull={this.props.setComponentToNull}
                    />;
            }

            return '';
        }

        else {
            return '';
        }
    }
}