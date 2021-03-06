/* eslint-disable no-undefined */
import { createElement } from 'react';
import { Provider } from 'react-redux';
import { wrapRootEpic, renderToString } from 'react-redux-epic';
import { RouterContext, match } from 'react-router';
import Fetchr from 'fetchr';

import createAppStore from '../../common/create-store.js';
import routes from '../../common/routes.jsx';

const reactRoutes = [
  '/',
  '/cart',
  '/sign-up',
  '/log-in'
];

export default function rootScript(app) {
  const router = app.loopback.Router();
  reactRoutes.forEach(route => {
    router.get(route, renderHome);
  });

  function renderHome(req, res, next) {
    const fetchr = new Fetchr({ req });
    const location = req.path;
    match({ routes, location }, (err, _, renderProps) => {
      if (err) { return next(err); }
      const { store, rootEpic } = createAppStore({
        wrapEpic: wrapRootEpic,
        deps: { fetchr }
      });
      const element = createElement(
        Provider,
        { store },
        createElement(
          RouterContext,
          renderProps
        )
      );
      return renderToString(element, rootEpic)
        .map(({ markup: html }) => {
          const state = store.getState();
          res.expose(state, 'prestate');
          return res.render(
            'index',
            {
              title: 'react-shoppe',
              html: html
            }
          );
        })
        // don't forget, something needs to subscribe to the observable.
        // In an express request handler, that needs to be you...
        .subscribe(() => {}, next);
    });
  }

  app.use(router);
}
