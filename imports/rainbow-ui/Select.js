import React, { Component } from 'react';
import { runInThisContext } from 'vm';

export default class Select extends Component {
    constructor(props) {
        super(props);

        this.onChangeSelect = this.onChangeSelect.bind(this);
    }

    onChangeSelect(event) {
        this.props.onChange(event);
    }

    renderOptions() {
        const { options, selectedOption } = this.props;

        return options.map((option, index) => {
            if(selectedOption == option.value) {
                return <option key={index} value={option.value} selected="selected">{option.label}</option>;
            } else {
                return <option key={index} value={option.value}>{option.label}</option>;
            }
        });
    }
    
    render() {
        const { name } = this.props;

        return (
            <select name={name} onChange={this.onChangeSelect}>
                {this.renderOptions()}
            </select>
        );
    }
}