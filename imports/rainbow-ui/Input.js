import React, { Component } from 'react';

export default class Input extends Component {
    render() {

        const { type, name, placeholder } = this.props;

        return (
            <input type={input.type} name={input.name} placeholder={input.placeholder} value={state[input.name]} onChange={this.onChangeInput}/>
        );
    }
}