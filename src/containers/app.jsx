import React from 'react';
import PropTypes from 'prop-types';

import { connect } from 'react-redux';
import LoanActionCreator from 'actions/loan-actions';

import Config from 'config';
import AppService from 'services/app';
import Calculator from 'components/calculator';
import LoansHistory from 'components/loans-history';

class App extends React.Component {

    constructor() {
        super();
        // error boundaries

        this.state = {
            timerEnded: false,
            sorryMessage: false
        };

        this.disableApplication = this.disableApplication.bind(this);
    }

    componentDidMount() {
        AppService.registerApp();a
        if (AppService.isAppCountExceeded()) {
            console.log(`Disabling app due max app instances exceeded(${Config.MAX_APP_INSTANCES})`);
            this.disableApplication();
        }
        setTimeout(() => {
            this.setState({ 
                timerEnded: true
            });
        }, Config.TIMER_HIGH_RISK);
    }

    disableApplication() {
        this.setState({
            sorryMessage: true
        });
    }

    _renderHeader() {
        return (
            <header className="navbar navbar-expand-lg navbar-light bg-light">
                <a className="navbar-brand">Micro-lending Calculator</a>
                <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarContent" aria-controls="navbarContent" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarContent">
                    <ul className="navbar-nav mr-auto">
                        <li className="nav-item">
                            <a className="nav-link disabled" href="#">Home</a>
                        </li>
                    </ul>
                </div>
            </header>
        );
    }

    _renderContent() {
        const { loans, loanActions } = this.props;
        const { timerEnded } = this.state;

        return (
            <div className="row">
                <div className="col-md-6">
                    <Calculator
                        currencySymbol="€"
                        loanPercentRate={10}
                        maxAmount={400}
                        maxDays={30}
                        dateFormat="DD.MM.YYYY"
                        amountPlaceholder="Enter loan amount, max 400€"
                        datePlaceholder="Select days, max 30"
                        loanActions={loanActions}
                        timerEnded={timerEnded}
                        disableApp={this.disableApplication}
                    />
                </div>
                <div className="col-md-6">
                    <LoansHistory
                        loans={loans}
                        loanActions={loanActions}
                        currencySymbol="€"
                        dateFormat="DD.MM.YYYY"
                    />
                </div>
            </div>
        );
    }

    _renderSorryMessage() {
        return (
            <div className="row justify-content-center">
                <div className="col-md-4">
                    <div className="alert alert-danger text-center" role="alert">
                        We are sorry!
                    </div>
                </div>
            </div>
        );
    }

    render() {
        const { sorryMessage } = this.state;

        return (
            <React.Fragment>
                {this._renderHeader()}
                <main className="container-fluid mt-3" role="main">
                    {sorryMessage ? this._renderSorryMessage() : this._renderContent()}
                </main>
            </React.Fragment>
        );
    }
}

App.propTypes = {
    loans: PropTypes.shape({
        items: PropTypes.array.isRequired
    }),
    loanActions: PropTypes.shape({
        addLoan: PropTypes.func.isRequired,
        extendLoan: PropTypes.func.isRequired
    })
};

function mapStateToProps (state) {
    return {
        loans: state.loans
    };
}

function mapDispatchToProps(dispatch) {
    return {
        loanActions: LoanActionCreator(dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
