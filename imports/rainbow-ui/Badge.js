import React, { Component } from 'react';

import './css/badge.css';

export default class Badge extends Component {
    render() {
        let className = 'badge';
        
        switch (this.props.type) {
            case 'success':
                className += ' badge-success';
                break;
            case 'alternative':
                className += ' badge-alternative';
                break;
            case 'danger':
                className += ' badge-danger';
                break;
        }

        return (
            <div className={className}>
                {this.props.children}
            </div>
        );
    }
}