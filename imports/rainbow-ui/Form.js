import React, { Component } from 'react';

import Button from '/imports/rainbow-ui/Button.js';

import './css/form.css';

export default class Form extends Component {
    constructor(props) {
        super(props);
        
        let inputState = {};

        props.configuration.inputs.forEach((input) => {
            inputState[input.name] = input.defaultValue ? input.defaultValue : '';
        });

        this.state = inputState;

        this.onChangeInput = this.onChangeInput.bind(this);
        this.submitForm = this.submitForm.bind(this);
    }
    
    renderForm() {
        const configuration = this.props.configuration;
        const state = this.state;

        return configuration.inputs.map((input, index) => {
            return (
                <div key={index} className='input-group-wrapper'>
                    <div className='label-wrapper'>
                        <label>{input.label}</label>
                    </div>
                    <div className='input-wrapper'>
                        <input type={input.type} name={input.name} placeholder={input.placeholder} value={state[input.name]} onChange={this.onChangeInput}/>
                    </div>
                </div>
            );
        });
    }

    onChangeInput(event) {
        const name = event.target.name;
        const value = event.target.value;

        this.setState((state) => {
            state[name] = value;
            return state
        });
    }

    submitForm() {
        const buttons = this.props.configuration.buttons;
        const submitButton = buttons.find((button) => {
            return button.type === 'submit'
        });

        if(submitButton) {
            submitButton.onClick(this.state);
        }
    }
    
    renderFormButtons() {
        const configuration = this.props.configuration;

        return configuration.buttons.map((button, index) => {
            const buttonTypeClass = 'btn ' + button.className + '-btn';

            let handleButtonClick = () => {};

            if(button.type === 'submit') {
                handleButtonClick = this.submitForm;
            } else {
                handleButtonClick = button.onClick;
            }

            return (
                <div key={index} className='button-wrapper'>
                    <Button className={buttonTypeClass} handleClick={handleButtonClick}>
                        {button.label}
                    </Button>
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