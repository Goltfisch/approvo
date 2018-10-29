import React, { Component } from 'react';

export default class Input extends Component {
    constructor(props) {
        super(props);

        this.onChangeInput = this.onChangeInput.bind(this);
    }

    onChangeInput(event) {
        this.props.onChange(event);
    }
    
    render() {

        const { type, name, placeholder, value } = this.props;

        return (
            <input type={type} name={name} placeholder={placeholder} value={value} onChange={this.onChangeInput} />
        );
    }
}