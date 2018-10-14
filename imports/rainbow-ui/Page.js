import React, { Component } from 'react';

export default class Page extends Component {
    constructor(props) {
        super(props);

        this.onClick = this.onClick.bind(this);
    }

    onClick() {
        this.props.onClick(this.props.value);
    }
    
    render() {
        const { label } = this.props;
        
        return (
            <div className='page' onClick={this.onClick}>
                {label}
            </div>
        );
    }
}