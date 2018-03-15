import { LoanActions } from 'constants/actions';

const LoanActionCreator = (dispatch) => {
    return {
        addLoan(loan) {
            dispatch({
                type: LoanActions.ADD_LOAN,
                payload: loan
            });
        },

        extendLoan(loan) {
            dispatch({
                type: LoanActions.EXTEND_LOAN,
                payload: loan
            });
        },
    };
};

export default LoanActionCreator
;