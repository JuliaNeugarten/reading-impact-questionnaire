
"use strict"

import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import LikertButton from './LikertButton.js';
import CategoryButton from './CategoryButton.js';
import FormActions from './formActions.js';
import AppFormStore from './formStore.js';
import questions from './questions.js';

class SentenceQuestions extends Component {
    constructor(props) {
        super(props);
        this.setResponse = this.setResponse.bind(this);
        this.state = {
            response: this.props.response,
            responseSaved: false
        }
    }

    componentDidMount() {
        AppFormStore.bind('save-response', this.setResponseStatus.bind(this));
    }

    setResponseStatus(sentence_id) {
        if (this.props.sentence.sentence_id == sentence_id) {
            this.setState({responseSaved: true});
        }
    }

    setResponse(questionResponse) {
        var sentenceResponse = this.state.response;
        if (!sentenceResponse) {
            sentenceResponse = {};
        }
        if (!sentenceResponse.annotator) {
            sentenceResponse.annotator = FormActions.getAnnotator();
        }
        if (!sentenceResponse.sentence_id) {
            sentenceResponse.sentence_id = this.props.sentence.sentence_id;
        }
        sentenceResponse[questionResponse.category] = questionResponse.value;
        //console.log(questionResponse);
        //console.log(sentenceResponse);
        if (FormActions.checkResponseDone(sentenceResponse)) {
            FormActions.saveResponse(sentenceResponse);
        }
        FormActions.setLocalResponse(sentenceResponse);
        this.setState({response: sentenceResponse});
    }

    makeRange() {
        var list = [];
        for (var i = 1; i <= 7; i++) {
            list.push(i);
        }
        return list;
    }

    makeQuestion(question, sentence_id) {
        let component = this;
        //console.log("rendering sentence", sentence_id);
        //console.log(this.state.response);
        var makeCategoryButton = (question, category) => {
            var selected = false;
            if (this.state.response) {
                if (this.state.response[question.impactType] === category.value) {
                    selected = true;
                }
            }
            return (
                <CategoryButton
                    key={category.value}
                    name={sentence_id + "-" + question.impactType}
                    impactType={question.impactType}
                    value={category.value}
                    label={category.label}
                    setResponse={this.setResponse.bind(this)}
                    selected={selected}
                />
            )
        }
        var makeLikertButton = (question, value)=> {
            var selected = false;
            if (this.state.response) {
                if (this.state.response[question.impactType] === value.toString()) {
                    selected = true;
                }
            }
            return (
                <LikertButton
                    key={value}
                    name={sentence_id + "-" + question.impactType}
                    impactType={question.impactType}
                    value={value}
                    setResponse={this.setResponse.bind(this)}
                    selected={selected}
                />
            );
        }
        var likertButtons = this.makeRange().map(value => {
            return makeLikertButton(question, value);
        });
        let categoryValues = [
            {value: "positive", label: "Prettig"},
            {value: "negative", label: "Onprettig"},
            {value: "neutral", label: "Neutraal"},
            {value: "unclear", label: "Onduidelijk"},
        ];
        var categoryButtons = categoryValues.map(value => {
            return makeCategoryButton(question, value);
        });
        var makeButtons = question => {
            if (question.answerType === "likert") {
                return (
                    <div key={question.key}>
                        <div>
                        <label>Geen of twijfelachtig</label>
                        {' '}
                        {likertButtons}
                        <label>Duidelijk of zeer sterk</label>
                        </div>
                    </div>
                )
            }
            else if (question.answerType === "category") {
                return (
                    <div key={question.key}>
                        {categoryButtons}
                    </div>
                )
            }
        }

        let buttons = makeButtons(question);
        return (
            <div className="sentence-question" key={question.key}>
                <div className="row">
                    <label key={question.key}>{question.label}</label>
                </div>
                <div>{buttons}</div>
            </div>
        )
    }

    render() {
        let responseStatus = (<div></div>);
        if (this.state.responseSaved) {
            responseStatus = (<div>Antwoord opgeslagen</div>);
        }
        return (
            <div key={this.props.sentence.sentence_id}>
                <div className="sentence">
                    <label>Zin {this.props.sentence.number}:</label>{'  '}
                    <span className="sentence-text">
                        <i>{this.props.sentence.text}</i>
                    </span>
                </div>
                <div className="sentence-questions">
                  {questions.map(question =>
                    this.makeQuestion(question, this.props.sentence.sentence_id)
                  )}
                </div>
            </div>
        )
    }
}

export default SentenceQuestions;
