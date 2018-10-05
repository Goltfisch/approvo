import React, { Component } from 'react';

import '/imports/ui/layout/footer.css';

export default class Footer extends Component {
    render() {
        return (
            <div className="footer">
                <div className="eightmylez">
                    <ul>
                        <li>
                            <font size="6">8Mylez</font>
                        </li>
                        <li>
                            <p>Husener Straße 6</p>
                        </li>
                        <li>
                            <p>33098 Paderborn</p>
                        </li>
                        <li>
                            <a href="https://8mylez.com/">Homepage</a>
                        </li>
                    </ul>
                </div>
                    
                <div className="copyright-footer">
                    <p>&copy; Copyright 2018 Goltfisch GmbH</p>
                </div>

                <div className="creator">
                    <ul>
                        <li>
                            <font size="6">Michael Moor</font>
                        </li>
                        <li>
                            <p>Saulsiek 11</p>
                        </li>
                        <li>
                            <p>32825 Blomberg</p>
                        </li>
                        <li>
                            <a href="https://github.com/E-MichaelM">Homepage</a>
                        </li>
                    </ul>
                </div>
            </div>
        )
    }
}