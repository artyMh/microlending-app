import moment from 'moment';

import Config from '../config';
import { generateGuid } from '../helpers';

export default class LoanService {

    static calculateLoan(loanAmount, loanDate, loanPercentRate = Config.LOAN_RATE_PERCENT) {
        let amount = parseFloat(loanAmount);
        let returnAmount = amount;
        let ratePerDay = parseFloat((loanPercentRate / 100) * amount);
        let returnDateDays = moment(loanDate).diff(moment(), 'days') + 1;

        for(let i = 0; i <= returnDateDays; i++) {
            returnAmount += ratePerDay;
        }

        return {
            ratePerDay,
            amount,
            returnAmount,
            returnDateDays
        };
    }

    static createLoan(loanAmount, loanDate) {
        const {
            ratePerDay,
            amount,
            returnAmount,
            returnDateDays
        } = this.calculateLoan(loanAmount, loanDate);

        return {
            id: generateGuid(),
            rate: ratePerDay,
            amount,
            date: loanDate,
            returnAmount,
            returnDateDays,
            extended: false,
            extendedLoan: null
        };
    }

    static extendLoan(loan) {
        const {
            ratePerDay,
            amount,
            returnAmount
        } = this.calculateLoan(loan.amount, loan.date, (Config.LOAN_RATE_PERCENT * Config.LOAN_EXTENDED_RATE));

        let extendedDate = moment(loan.date).add(Config.LOAN_EXTENDED_DAYS, "days").valueOf();
        let extendedDateDays = moment(extendedDate).diff(moment(), 'days') + 1;

        loan.extended = true;
        loan.extendedLoan = {
            rate: ratePerDay,
            amount,
            date: extendedDate,
            returnAmount,
            returnDateDays: extendedDateDays
        };

        return loan;
    }
}