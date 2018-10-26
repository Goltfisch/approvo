import React, { Component } from 'react';

export default class Select extends Component {
    renderOptions() {
        const { options } = this.props;

        return options.map((option) => {
            return <option value={option.value}>{option.displayValue}</option>;
        });
    }
    
    render() {
        return (
            <select>
                {this.renderOptions()}
            </select>
        );
    }
}