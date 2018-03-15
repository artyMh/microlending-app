import React from 'react';
import { shallow } from 'enzyme';

import moment from 'moment';

import LoansHistory from '../../src/components/loans-history';

describe('LoansHistory component', () => {
    let loansHistoryComponent;
    const threeDaysInFutureDate = moment().add(3, 'day');
    const returnDays = moment(moment().add(3, 'day')).diff(moment(), 'days') + 1;
    const tenDaysInFutureDate = threeDaysInFutureDate.add(7, 'day');
    const defaultProps = {
        loans: {
            items: [
                { 
                    "id": "be2e25ec",
                    "rate": 12.3,
                    "amount": 123,
                    "date": threeDaysInFutureDate,
                    "returnAmount": 159.90000000000003,
                    "returnDateDays": returnDays,
                    "extended": true,
                    "extendedLoan": {
                        "rate": 18.45,
                        "amount": 123,
                        "date": tenDaysInFutureDate,
                        "returnAmount": 178.34999999999997,
                        "returnDateDays": 9
                    }
                }, 
                {
                    "id": "2b86b58d",
                    "rate": 32.1,
                    "amount": 321,
                    "date": threeDaysInFutureDate,
                    "returnAmount": 417.30000000000007,
                    "returnDateDays": returnDays,
                    "extended": false,
                    "extendedLoan": null
                }
            ]
        },
        loanActions: {
            addLoan: jest.fn(),
            extendLoan: jest.fn()
        },
        currencySymbol: '€',
        dateFormat: 'DD.MM.YYYY',
    };

    beforeEach(() => {
        loansHistoryComponent = shallow(<LoansHistory {...defaultProps} />);
    });

    describe('at initial load', () => {
        test('header must exist', () => {
            let header = loansHistoryComponent.find('h3');
            expect(header.text()).toBe('Loan history');
        });

        test('should have 0 action calls', () => {
            expect(defaultProps.loanActions.addLoan).toHaveBeenCalledTimes(0);
            expect(defaultProps.loanActions.extendLoan).toHaveBeenCalledTimes(0);
        });

        test('correct items count', () => {
            let items = loansHistoryComponent.find('.loan-item');
            expect(items.length).toBe(2);
        });
    });

    describe('render normal loan correct', () => {
        let loan;
        let expectedLoan;

        beforeAll(() => {
            loan = loansHistoryComponent.find('.loan-item').at(1);
            expectedLoan = defaultProps.loans.items[1];
        });

        test('title', () => {
            expect(loan.find('.qa-loan-title').text()).toBe('Loan #2 ');
        });

        test('id', () => {
            expect(loan.find('.qa-loan-id').text()).toBe(`ID: ${expectedLoan.id}`);
        });

        test('amount', () => {
            expect(loan.find('.qa-loan-amount').text()).toBe(`${expectedLoan.amount} ${defaultProps.currencySymbol}`);
        });

        test('return amount', () => {
            expect(loan.find('.qa-loan-return-amount').text()).toBe(`${expectedLoan.returnAmount.toFixed(2)} ${defaultProps.currencySymbol}`);
        });
        
        test('deadline', () => {
            expect(loan.find('.qa-loan-deadline').text()).toBe(moment(expectedLoan.date).format('DD.MM.YYYY'));
        });
        
        test('return days', () => {
            expect(loan.find('.qa-loan-return-days').text()).toBe(`${expectedLoan.returnDateDays}`);
        });
    });

    describe('render extended loan correct', () => {
        let loan;
        let expectedLoan;

        beforeAll(() => {
            loan = loansHistoryComponent.find('.loan-item').at(0);
            expectedLoan = defaultProps.loans.items[0];
        });

        test('title', () => {
            expect(loan.find('.qa-loan-title').text()).toBe('Loan #1 Extended');
        });

        test('id', () => {
            expect(loan.find('.qa-loan-id').text()).toBe(`ID: ${expectedLoan.id}`);
        });

        describe('previous loan data correct', () => {
    
            test('amount', () => {
                expect(loan.find('.qa-loan-amount').text()).toBe(`${expectedLoan.amount} ${defaultProps.currencySymbol}`);
            });
    
            test('return amount', () => {
                expect(loan.find('.qa-loan-return-amount').text()).toBe(`${expectedLoan.returnAmount.toFixed(2)} ${defaultProps.currencySymbol}`);
            });
            
            test('deadline', () => {
                expect(loan.find('.qa-loan-deadline').text()).toBe(moment(expectedLoan.date).format('DD.MM.YYYY'));
            });
            
            test('return days', () => {
                expect(loan.find('.qa-loan-return-days').text()).toBe(`${expectedLoan.returnDateDays}`);
            });
        });

        describe('extended loan data correct', () => {
            test('amount', () => {
                expect(loan.find('.qa-extended-loan-amount').text()).toBe(`${expectedLoan.extendedLoan.amount} ${defaultProps.currencySymbol}`);
            });
    
            test('return amount', () => {
                expect(loan.find('.qa-extended-loan-return-amount').text()).toBe(`${expectedLoan.extendedLoan.returnAmount.toFixed(2)} ${defaultProps.currencySymbol}`);
            });
            
            test('deadline', () => {
                expect(loan.find('.qa-extended-loan-deadline').text()).toBe(moment(expectedLoan.extendedLoan.date).format('DD.MM.YYYY'));
            });
            
            test('return days', () => {
                expect(loan.find('.qa-extended-loan-return-days').text()).toBe(`${expectedLoan.extendedLoan.returnDateDays}`);
            });
        });
    });

    describe('extend normal loan', () => {
        test('actions called after click', () => {
            loansHistoryComponent.find('.loan-item').at(1).find('.qa-extend-loan-btn').simulate('click');
            expect(defaultProps.loanActions.extendLoan).toHaveBeenCalledTimes(1);
        });
    });
});