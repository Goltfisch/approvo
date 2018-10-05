import React, { Component } from 'react';
import { withTracker } from 'meteor/react-meteor-data';

class NewApprovalForm extends Component {
    constructor(props) {
        super(props);

        this.state = {
            name: '',
            amount: 0,
            reason: '',
            link: 'http://',
            date: new Date(),
            owner: props.currentUser._id,
        }

        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);       
    }

    handleInputChange(event) {
        const target = event.target;
        const value = target.value;
        const name = target.name;

        this.setState({
            [name]: value
        });
    }

    handleSubmit(event) {
        event.preventDefault();

        console.log('save', this.state);
    }
    
    // addNewApproval(event) {
    //     event.preventDefault();

    //     const name = this.refs.newApprovalName.value;
    //     const amount = this.refs.newApprovalAmount.value;
    //     const reason = this.refs.newApprovalReason.value;
    //     const link = this.refs.newApprovalLink.value;
    //     const owner = this.props.currentUser.name;
    //     const date = moment(new Date()).format('DD.MM.YYYY');

    //     if(!name || !amount || !reason || !link) {
    //         this.refs.newApprovalName.value = '';
    //         this.refs.newApprovalAmount.value = '';
    //         this.refs.newApprovalReason.value = '';
    //         this.refs.newApprovalLink.value = '';
            
    //         return alert('Es müssen alle Felder ausgefüllt werden!');
    //     }

    //     const approval = {
    //         name,
    //         amount,
    //         reason,
    //         link,
    //         date,
    //         owner
    //     };

    //     Meteor.call('Approvals.insert', approval);
        
    //     this.refs.newApprovalName.value = '';
    //     this.refs.newApprovalAmount.value = '';
    //     this.refs.newApprovalReason.value = '';
    //     this.refs.newApprovalLink.value = '';
    // }
    
    render() {
        return (
            <div className="content-approval-form">
                <form className="new-approval">

                    <label className="form-new-approval-name-label"> Name </label>
                    <input type="text" name="name" value={this.state.name} onChange={this.handleInputChange} />

                    <label className="form-new-approval-amount-label"> Betrag </label>
                    <input type="text" name="amount" value={this.state.amount} onChange={this.handleInputChange} />

                    <label className="form-new-approval-reason-label"> Grund </label>
                    <input type="text" name="reason" value={this.state.reason} onChange={this.handleInputChange} />

                    <label className="form-new-approval-link-label"> Link </label>
                    <input type="text" name="link" value={this.state.link} onChange={this.handleInputChange} />

                    <button className="add-approval-button" onClick={this.handleSubmit}></button>
                </form>
            </div>
        )
    }
}

export default withTracker(() => {
    return {
        currentUser: Meteor.user()
    };
})(NewApprovalForm);