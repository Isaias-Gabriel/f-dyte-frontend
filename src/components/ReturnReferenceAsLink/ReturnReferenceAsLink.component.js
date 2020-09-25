import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import Linkify from 'react-linkify';

import './styles.css';

const ShowLink = props => {
    const { el } = props;

    if(el.asLink) {
        if(el.which) {
            return(
                <Link to={"/redirect_to_profile/" + el.text}>
                    @{`${el.text}`}
                </Link>
            )
        }

        else {
            return(
                <Link to={"/redirect_to_object/" + el.text}>
                    /{`${el.text}`}
                </Link>
            )
        }
    }

    else {
        return (
            <Linkify>
                { el.text }
            </Linkify>
        );
    }
}

const AuxComp = props => {
    let auxIndex, canContinue = true;
    let { text } = props;
    let auxString, auxNumber;
    let auxArray = [];
    //auxArray = [auxEl1, ..., auxEln];
    //auxEli = {asLink: 0 or 1, which: 0 or 1, text: string}, if asLink = 1 it means the string is a reference
    //if it's 0 it's just a non profile reference string
    //.which = 0 an object reference 
    //.which = 0 a profile reference

    while(canContinue) {
        if(text.indexOf('@') === -1 && text.indexOf('/') === -1) {
            canContinue = false;
            auxArray.push({
                asLink: 0,
                text: text,
            })
        }

        else {

            //if(text.includes('http'))

            auxString = ( text.indexOf('@') < text.indexOf('/') ? '@' : '/');
            auxNumber = ( text.indexOf('@') < text.indexOf('/') ? 1 : 0);
            if(text.indexOf('@') === -1) {
                auxString = '/';
                auxNumber = 0;
            }

            if(text.indexOf('/') === -1) {
                auxString = '@';
                auxNumber = 1;
            }

            auxIndex = text.indexOf(auxString);
            if(auxIndex > 1) {
                auxArray.push({
                    asLink: 0,
                    text: text.substring(1, auxIndex),
                });
            }
            text = text.substring(auxIndex);
            auxIndex = text.indexOf(' ');

            if(auxIndex === -1) {
                auxIndex = /\r|\n/.exec(text);

                console.log(auxIndex);

                if(auxIndex) {
                    auxArray.push({
                        asLink: 1,
                        which: auxNumber,
                        text: text.substring(1, auxIndex.index),
                    });
                    text = text.substring(auxIndex.index);
                }

                else {
                    auxArray.push({
                        asLink: 1,
                        which: auxNumber,
                        text: text.substring(1),
                    });
                    text = '';
                }
            }

            else {
                auxArray.push({
                    asLink: 1,
                    which: auxNumber,
                    text: text.substring(1, auxIndex),
                });
                text = text.substring(auxIndex);
            }
        }

    }

    return (
        <span>
            {   
                auxArray.map(auxEl => {
                    return (
                        <ShowLink key={Date.now() + auxEl.text + auxEl.asLink}
                            el={auxEl}
                        />
                    )
                })
            }
        </span>
    )
}

export default class ReturnReferenceAsLink extends Component {
    constructor(props) {
        super(props);

        this.state = {

        }
    }

    componentDidMount() {
        //console.log(this.props);
        //console.log(/\r|\n/.exec(this.props.text))
        //console.log(this.props.text.indexOf('\r\n'))
    }
    
    render() {
        
        return (
            <AuxComp
                text={ this.props.text }
            />
        )
    }
}