import React, { Component } from 'react';

import './css/button.css';

export default class Button extends Component {
    constructor(props) {
        super(props);

        this.handleClick = this.handleClick.bind(this);
    }

    handleClick(event) {
        event.preventDefault();
        this.props.handleClick(this.props.documentId, this.props.action);
    }

    render() {
        return (
            <button className={this.props.className} onClick={this.handleClick}>{this.props.children}</button>
        );
    }
}