import React from 'react'
import { Component } from 'react'
import { Provider } from 'react-redux';
import { ConnectedRouter, ConnectedRouterProps } from 'react-router-redux';
import Routes from '../routes';
type RootType = ConnectedRouterProps<any>;

interface IAutoNavProp {
  history: any
}

export default function Root({ store, history }: RootType) {
  let path = '/'
  if (store) {
    store.subscribe(() => {
      let state = store.getState() as any
      let newPath = state.appReducer.path
      if (newPath !== path) {
        path = newPath
        setTimeout(() => {
          window.location.hash = '#' + path
        }, 0)
        //        history && history.replace(path)
      }
    })
  }
  (window as any)._history = history

  return (
    <Provider store={store}>
      <ConnectedRouter history={history}>
        <Routes />
      </ConnectedRouter>
    </Provider>
  );
}
