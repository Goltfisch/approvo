import React, { Component } from 'react';

import './css/footer.css';

export default class Footer extends Component {
    render() {
        return (
            <div className='footer'>
                <div className='copyright-block'>
                    &copy; 2018 Goltfisch GmbH
                </div>
                <div className='version-block'>
                    Approvo version 1.1.0
                </div>
                <div className='message-block'>
                    Made with <i className="fas fa-heart"></i> in Paderborn
                </div>
            </div>
        );
    }
}