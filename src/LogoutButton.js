
"use strict"

import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import FormActions from './formActions.js';

class LogoutButton extends Component {

    constructor(props) {
        super(props);
    }

    logout() {
        //FormActions.logout();
        FormActions.removeAnnotator();
        FormActions.changeView("thankyou");
    }

    render() {
        return (
            <button
                className="btn btn-primary"
                onClick={this.logout.bind(this)}
            >
                Afmelden
            </button>
        )
    }
}

export default LogoutButton;
