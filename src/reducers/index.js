import { combineReducers } from 'redux';
import { destroyConstants } from '../constants';


/* AUTH */
import { alert } from './alert.reducer';
import { web3 } from './web3.reducer';

const appReducer = combineReducers({

  alert,
  web3,
  
});

const rootReducer = (state, action) => {

  if (action.type === destroyConstants.DESTROY_SESSION)
    state = undefined;

  return appReducer(state, action);

};

export default rootReducer;