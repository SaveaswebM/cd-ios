// app/redux/store.js
import { createStore } from 'redux';

// Initial state
const initialState = {
    isLogin: false, // Default value for isLogin
};

// Action types
const SET_LOGIN = 'SET_LOGIN';

// Reducer function
const reducer = (state = initialState, action) => {
    switch (action.type) {
        case SET_LOGIN:
            return {
                ...state,
                isLogin: action.payload,
            };
        default:
            return state;
    }
};

// Create store
const store = createStore(reducer);

export default store;
