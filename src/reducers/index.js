import { combineReducers } from 'redux';
import { destroyConstants } from '../constants';


/* AUTH */
import { alert } from './alert.reducer';
import { web3 } from './web3.reducer';
import { borrowReducer } from './borrow.reducer';


const appReducer = combineReducers({

  alert,
  web3,
  borrowReducer,

});

const rootReducer = (state, action) => {

  if (action.type === destroyConstants.DESTROY_SESSION)
    state = undefined;

  return appReducer(state, action);

};

export default rootReducer;