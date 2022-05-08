import { combineReducers } from 'redux';
import { destroyConstants } from '../constants';


/* AUTH */
import { alert } from './alert.reducer';
import { web3 } from './web3.reducer';


import { contractVB } from './contractVB.reducer';
import { contractVET } from './contractVET.reducer';

import { accountOverview } from './accountOverview.reducer';
import { borrowReducer } from './borrow.reducer';
import { supplyReducer } from './supply.reducer';



const appReducer = combineReducers({

  alert,
  web3,
  contractVB,
  contractVET,
  accountOverview,

  borrowReducer,
  supplyReducer

});

const rootReducer = (state, action) => {

  if (action.type === destroyConstants.DESTROY_SESSION)
    state = undefined;

  return appReducer(state, action);

};

export default rootReducer;