import React, { Component } from 'react';

import Button from '/imports/rainbow-ui/Button.js';

import './css/form.css';

export default class Form extends Component {
    renderFormButtons() {
        const configuration = this.props.configuration;

        return configuration.buttons.map((button, index) => {
            const buttonTypeClass = 'btn ' + button.type + '-btn';
            return (
                <div key={index} className='button-wrapper'>
                    <Button className={buttonTypeClass} handleClick={button.onClick}>
                        {button.label}
                    </Button>
                </div>
            );
        });
    }
    
    renderForm() {
        const configuration = this.props.configuration;

        return configuration.inputs.map((input, index) => {
            return (
                <div key={index} className='input-group-wrapper'>
                    <div className='label-wrapper'>
                        <label>{input.label}</label>
                    </div>
                    <div className='input-wrapper'>
                        <input type={input.type} placeholder={input.placeholder} />
                    </div>
                </div>
            );
        });
    }
    
    render() {
        const { configuration } = this.props;

        return (
            <div className='form-wrapper'>
                <div className='form-headline'>
                    {configuration.headline}
                </div>
                <div className='form-description'>
                    {configuration.description}
                </div>
                <div className='form-inputs'>
                    {this.renderForm()}
                </div>
                <div className='form-buttons'>
                    {this.renderFormButtons()}
                </div>
            </div>
        );
    }
}