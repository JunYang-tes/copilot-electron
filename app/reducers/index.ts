import { combineReducers } from 'redux';
import { routerReducer as router } from 'react-router-redux';
import counter from './counter';
import { appReducer } from './app'

const rootReducer = combineReducers({
  appReducer,
  counter,
  router,
});

export default rootReducer;
