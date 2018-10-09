import React, { Component } from 'react';

import './css/modal.css';

export default class Modal extends Component {
    constructor(props) {
        super(props);

        this.handleClick = this.handleClick.bind(this);
    }

    componentWillMount() {
        document.body.style.overflow = "hidden";
    }
    
    componentWillUnmount() {
        document.body.style.overflow = "visible";
    }
    
    handleClick(event) {
        event.preventDefault();

        this.props.closeModal();
    }

    render() {
        return (
            <div className='modal-wrapper'>
                <div className='modal-overlay'>
                    <div className='modal'>
                        <div className='modal-close-btn' onClick={this.handleClick}>
                            <i className='far fa-times-circle'></i>
                        </div>
                        {this.props.children}
                    </div>
                </div>
            </div>
        );
    }
}