import React, { Component } from 'react';

import './css/switch-button.css';

export default class SwitchButton extends Component {
    constructor(props) {
        super(props);

        this.handleChange = this.handleChange.bind(this);

        const { isChecked } = this.props;

        this.state = {
            isChecked: isChecked ? isChecked : false
        }
    }

    handleChange(event) {
        const { handleChange, documentId } = this.props;

        this.setState((state) => {
            handleChange(documentId, !state.isChecked);
            return state.isChecked =  !state.isChecked;
        });
    }

    render() {
        const { isChecked } = this.state;

        return (
            <label className="switch">
                <input type="checkbox" checked={isChecked} onChange={this.handleChange}/>
                <span className="slider round"></span>
            </label>
        );
    }
}