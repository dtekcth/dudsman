// import { createStore, applyMiddleware, compose } from 'redux';
// import { createLogger } from 'redux-logger';
// import ReduxThunk from 'redux-thunk';

// import rootReducer from './reducers';

// const logger = createLogger();

// const middleware = [ReduxThunk];

// const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
// let enhancers = composeEnhancers(applyMiddleware(...middleware));

// const store = createStore(rootReducer, {}, enhancers);

// export default store;

import { createStore } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import rootReducer, { AppAction, AppState } from './reducers';
import { MakeStore, createWrapper } from 'next-redux-wrapper';

export const makeStore: MakeStore<AppState, AppAction> = () => {
  return createStore(rootReducer, composeWithDevTools());
};

export const wrapper = createWrapper(makeStore, { debug: false });
