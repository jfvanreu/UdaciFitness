import { ADD_ENTRY, RECEIVE_ENTRIES} from '../actions'

// we define our reducers which take a state and an action as arguments and return a state
function entries(state={}, action) {
    switch (action.type) {
        case RECEIVE_ENTRIES:
            return {
                    ...state,
                    ...action.entries,
            }
        case ADD_ENTRY:
            return { ...state,
                     ...action.entry,
                    }    
        default:
            return state
    }
}

export default entries