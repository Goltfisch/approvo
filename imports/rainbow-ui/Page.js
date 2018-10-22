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
        const { label, isActive } = this.props;
        let classNames = 'page';
        classNames += isActive ? ' active' : '';
        
        return (
            <div className={classNames} onClick={this.onClick}>
                {label}
            </div>
        );
    }
}