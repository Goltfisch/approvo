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

    handleChange() {
        const { handleChange, documentId, name } = this.props;

        this.setState((state) => {
            handleChange(documentId, !state.isChecked, name);
            return state.isChecked =  !state.isChecked;
        });
    }

    render() {
        const { isChecked } = this.state;
        const { name } = this.props;

        return (
            <label className="switch">
                <input type="checkbox" checked={isChecked} name={name} onChange={this.handleChange}/>
                <span className="slider round"></span>
            </label>
        );
    }
}