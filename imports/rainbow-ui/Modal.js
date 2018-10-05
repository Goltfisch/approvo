import React, { Component } from 'react';

import './css/modal.css';

export default class Modal extends Component {
    render() {
        return (
            <div className='modal-wrapper'>
                <div className='modal-overlay'>
                    <div className='modal'>
                        {this.props.children}
                    </div>
                </div>
            </div>
        );
    }
}