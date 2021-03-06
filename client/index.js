import 'rxjs';
import Fetchr from 'fetchr';
import { createElement } from 'react';
import { render } from 'react-dom';
import { Router, browserHistory as history } from 'react-router';
import { Provider } from 'react-redux';

import createAppStore from '../common/create-store.js';
import routes from '../common/routes.jsx';

const fetchr = new Fetchr({
  xhrPath: '/services'
});
const win = typeof window !== 'undefined' ? window : {};
const preState = win.__ar__ && win.__ar__.prestate;
const devTools =
  typeof win.__REDUX_DEVTOOLS_EXTENSION__ === 'function' ?
  win.__REDUX_DEVTOOLS_EXTENSION__() :
  (f => f);

const { store } = createAppStore({
  preState,
  devTools,
  deps: {
    storage: win.localStorage,
    fetchr
  }
});

// <Provider store={ store }>
//   <Router routes={ routes } history={ history } />
// </Provider>
render(
  createElement(
    Provider,
    { store },
    createElement(Router, { routes, history }),
  ),
  window.document.getElementById('app')
);

// reducer(CurrentState, Action) => newState
