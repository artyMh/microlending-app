import React from 'react';
import PropTypes from 'prop-types';

import DatePicker from 'react-datepicker';
import moment from 'moment';

import Config from 'config';
import LoanService from 'services/loan';

export default class Calculator extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            inputLoanAmount: '',
            inputLoanDate: null,
            returnAmount: 0,
            returnDateDays: 0,
            validation: {
                inputLoanAmountNaN: false,
                inputLoanAmountTooBig: false,
                inputLoanDate: false
            }
        };

        this._onAmountChange = this._onAmountChange.bind(this);
        this._onDayChange = this._onDayChange.bind(this);
        this._onSubmit = this._onSubmit.bind(this);
    }

    _calculateLoan() {
        const { inputLoanAmount, inputLoanDate } = this.state;

        if ((!inputLoanAmount || !inputLoanDate) || !this._isInputsValid()) {
            this.setState({
                returnAmount: 0,
                returnDateDays: 0
            });
            return;
        }

        const { returnAmount, returnDateDays } = LoanService.calculateLoan(inputLoanAmount, inputLoanDate);

        this.setState({
            returnAmount,
            returnDateDays
        });
    }

    _onAmountChange(event) {
        const { maxAmount } = this.props;

        let inputLoanAmountNaN = false;
        let inputLoanAmountTooBig = false;

        if(!event.target.value.match(/^[0-9]+$/)) {
            inputLoanAmountNaN = true;
        }

        let amount = parseFloat(event.target.value);
        if (amount < 0 || amount > maxAmount) {
            inputLoanAmountTooBig = true;
        }

        this.setState({
            inputLoanAmount: event.target.value,
            validation: {
                inputLoanAmountNaN,
                inputLoanAmountTooBig
            }
        }, () => { this._calculateLoan(); });
    }

    _onDayChange(date) {
        this.setState({
            inputLoanDate: date
        }, () => { this._calculateLoan(); });
    }

    _onSubmit(event) {
        event.preventDefault();
        const { inputLoanAmount, inputLoanDate } = this.state;
        const { loanActions, maxAmount, disableApp, timerEnded } = this.props;
        
        if (parseFloat(inputLoanAmount) === maxAmount && !timerEnded) {
            console.log(`Disabling app due making max loan amout in less than ${Config.TIMER_HIGH_RISK}`);
            disableApp();
            return;
        }

        let createdLoan = LoanService.createLoan(inputLoanAmount, inputLoanDate);
        loanActions.addLoan(createdLoan);
        this.setState({
            inputLoanAmount: '',
            inputLoanDate: undefined,
            returnAmount: 0,
            returnDateDays: 0
        });
    }

    _isInputsValid() {
        const { validation } = this.state;  
        return !validation.inputLoanAmountNaN && !validation.inputLoanAmountTooBig && !validation.inputLoanDate;
    }

    render() {
        const { currencySymbol, amountPlaceholder, datePlaceholder, dateFormat, maxAmount } = this.props;
        const { inputLoanAmount, inputLoanDate, returnAmount, returnDateDays, validation } = this.state;
        let loanAmountInputErrorClass = '';
        let submitDisabled = true;

        if (this._isInputsValid() && (inputLoanDate && inputLoanAmount)) {
            submitDisabled = false;
        }

        if (validation.inputLoanAmountTooBig || validation.inputLoanAmountNaN) {
            loanAmountInputErrorClass = 'input-invalid';
        }
        
        return (
            <div className="row justify-content-center">
                <div className="col-md-12">
                    <h3 className="text-center">Calculator</h3>
                </div>
                <div className="col-md-8">
                    <form onSubmit={this._onSubmit}>
                        <div className="form-group row">
                            <label htmlFor="loanAmount" className="col-sm-3 col-form-label">Amount</label>
                            <div className="col-sm-9">
                                <div className="input-group">
                                    <div className="input-group-prepend">
                                        <span className="input-group-text">{currencySymbol}</span>
                                    </div>
                                    <input className={`form-control ${loanAmountInputErrorClass}`} id="loanAmount" onChange={this._onAmountChange} value={this.state.inputLoanAmount} placeholder={amountPlaceholder} type="text"/>
                                </div>
                                {validation.inputLoanAmountTooBig &&
                                    <div className="invalid-feedback">Amount range is from 0 to {maxAmount}!</div>
                                }
                                {validation.inputLoanAmountNaN &&
                                    <div className="invalid-feedback"> Amount should be numerical!</div>
                                }
                            </div>
                        </div>
                        <div className="form-group row">
                            <label htmlFor="loanDate" className="col-sm-3 col-form-label">Return date</label>
                            <div className="col-sm-9">
                                <DatePicker
                                    dateFormat={dateFormat}
                                    selected={inputLoanDate}
                                    onChange={this._onDayChange}
                                    minDate={moment()}
                                    maxDate={moment().add(30, "days")}
                                    readOnly={true}
                                    className="form-control"
                                    placeholderText={datePlaceholder}
                                />
                            </div>
                        </div>
                        <div className="form-group row">
                            <label htmlFor="loanReturnAmount" className="col-sm-3 col-form-label">Return amount</label>
                            <div className="col-sm-9">
                                <input className="form-control" id="loanReturnAmount" type="text" value={returnAmount.toFixed(2)} readOnly />
                            </div>
                        </div>
                        <div className="form-group row">
                            <label htmlFor="loanReturnDateDays" className="col-sm-3 col-form-label">Days for return</label>
                            <div className="col-sm-9">
                                <input className="form-control" id="loanReturnDateDays" type="text" value={returnDateDays} readOnly />
                            </div>
                        </div>
                        <div className="form-group row justify-content-center">
                            <button type="submit" className="btn btn-primary" disabled={submitDisabled}>Submit loan!</button>
                        </div>
                    </form>
                </div>
            </div>
        );
    }
}

Calculator.propTypes = {
    currencySymbol: PropTypes.string.isRequired,
    loanPercentRate: PropTypes.number.isRequired,
    maxAmount: PropTypes.number.isRequired,
    maxDays: PropTypes.number.isRequired,
    dateFormat: PropTypes.string.isRequired,
    amountPlaceholder:  PropTypes.string.isRequired,
    datePlaceholder:  PropTypes.string.isRequired,
    loanActions: PropTypes.shape({
        addLoan: PropTypes.func.isRequired,
        extendLoan: PropTypes.func.isRequired
    }),
    timerEnded: PropTypes.bool.isRequired,
    disableApp: PropTypes.func.isRequired
};
