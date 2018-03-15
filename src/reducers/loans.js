import { LoanActions } from 'constants/actions';

const initialState = {
    items: []
};

export default function loansState(state = initialState, action) {

    switch(action.type) {
        case LoanActions.ADD_LOAN:
            return Object.assign({}, state, {
                items: [
                    ...(state.items), 
                    action.payload
                ]
            });
            
        case LoanActions.EXTEND_LOAN:
            return Object.assign({}, state, {
                    items: state.items.map(loan => loan.id === action.payload.id ?
                        // transform the one with a matching id
                        { ...loan, ...action.payload } : 
                        // otherwise return original
                        loan
                ) 
            });
        
        default:
            return state;
    }
}

