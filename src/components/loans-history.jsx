import React from 'react';
import PropTypes from 'prop-types';

import moment from 'moment';

import LoanService from '../services/loan';

export default class LoansHistory extends React.Component {

    constructor(props) {
        super(props);

        this._onExtendLoan = this._onExtendLoan.bind(this);
    }

    _onExtendLoan(loan) {
        const { loanActions } = this.props;
        let extendedLoan = LoanService.extendLoan(loan);
        loanActions.extendLoan(extendedLoan);
    }

    _renderLoan(loan, index) {
        const { currencySymbol, dateFormat } = this.props;

        return (
            <div className="col-xl-6 col-md-10 col-sm-12 col-12 loan-item" key={loan.id}>
                <div className="card">
                    <div className="card-body">
                        <h5 className="card-title qa-loan-title">Loan #{index + 1} {loan.extended && <span className="badge badge-warning">Extended</span>}</h5>
                        <h6 className="card-subtitle mb-2 text-muted qa-loan-id">ID: {loan.id}</h6>
                        <ul className="list-group">
                            <li className="list-group-item d-flex justify-content-between align-items-center">
                                Amount:
                                <span className="badge badge-light badge-pill qa-loan-amount">{`${loan.amount} ${currencySymbol}`}</span>
                                {loan.extended && <span className="badge badge-warning qa-extended-loan-amount">{`${loan.extendedLoan.amount} ${currencySymbol}`}</span>}
                            </li>
                            <li className="list-group-item d-flex justify-content-between align-items-center">
                                Return amount:
                                <span className="badge badge-light badge-pill qa-loan-return-amount">{`${loan.returnAmount.toFixed(2)} ${currencySymbol}`}</span>
                                {loan.extended && <span className="badge badge-warning qa-extended-loan-return-amount">{`${loan.extendedLoan.returnAmount.toFixed(2)} ${currencySymbol}`}</span>}
                            </li>
                            <li className="list-group-item d-flex justify-content-between align-items-center">
                                Deadline:
                                <span className="badge badge-light badge-pill qa-loan-deadline">{moment(loan.date).format(dateFormat)}</span>
                                {loan.extended && <span className="badge badge-warning qa-extended-loan-deadline">{moment(loan.extendedLoan.date).format(dateFormat)}</span>}
                            </li>
                            <li className="list-group-item d-flex justify-content-between align-items-center">
                                Days:
                                <span className="badge badge-light badge-pill qa-loan-return-days">{loan.returnDateDays}</span>
                                {loan.extended && <span className="badge badge-warning qa-extended-loan-return-days">{loan.extendedLoan.returnDateDays}</span>}
                            </li>
                        </ul>
                        <button type="button" className="btn btn-primary mt-3 qa-extend-loan-btn" disabled={loan.extended} onClick={() => { this._onExtendLoan(loan); }}>Extend loan</button>
                    </div>
                </div>
            </div>
        );
    }
    
    render() {
        const { loans: { items } } = this.props;

        return (
            <div className="row justify-content-left">
                <div className="col-md-12">
                    <h3 className="text-center">Loan history</h3>
                </div>
                {items.map((loan, index) => {
                    return this._renderLoan(loan, index);
                })}
            </div>
        );
    }
}

LoansHistory.propTypes = {
    loans: PropTypes.shape({
        items: PropTypes.array.isRequired
    }),
    loanActions: PropTypes.shape({
        addLoan: PropTypes.func.isRequired,
        extendLoan: PropTypes.func.isRequired
    }),
    currencySymbol: PropTypes.string.isRequired,
    dateFormat: PropTypes.string.isRequired,
};
