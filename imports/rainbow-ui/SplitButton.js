import React, { Component } from 'react';

import Button from '/imports/rainbow-ui/Button.js';

import './css/split-button.css';

export default class SplitButton extends Component {
    constructor(props) {
        super(props);

        this.handleClick = this.handleClick.bind(this);
    }
    
    handleClick(documentId, action) {
        this.props.handleClick(documentId, action);
    }

    renderMainButton() {
        const props = this.props;
        const self = this;
        let mainButton;

        props.actions.forEach(function(action) {
            if(action && action.isMain) {
                mainButton = <Button key={action.key} className='btn primary-btn' documentId={props.documentId} handleClick={self.handleClick} action={action.key}>{action.label}</Button>;
            }
        });

        return mainButton;
    }

    renderDropdown() {
        const props = this.props;
        let buttons = [];

        props.actions.forEach(function(action) {
            if(action && !action.isMain) {
                buttons.push(action);
            }
        });

        return (
            <div className="dropdown">
                <button className="btn primary-btn">
                    <i className="fa fa-caret-down"></i>
                </button>
                <div className="dropdown-content">
                    {this.renderDropdownButtons(buttons)}
                </div>
            </div>
        );
    }

    renderDropdownButtons(buttons) {
        const props = this.props;
        const self = this;

        return buttons.map(function(button) {
            return <Button key={button.key} className='btn primary-btn' documentId={props.documentId} handleClick={self.handleClick} action={button.key}>{button.label}</Button>
        });
    }

    render() {
        return (
            <div>
                {this.renderMainButton()}
                {this.renderDropdown()}
            </div>
        );
    }
}