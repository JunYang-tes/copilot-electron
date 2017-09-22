import * as React from 'react'
import react from 'react'
import { HashRouter as Router } from 'react-router-dom'
import { Switch, Route } from 'react-router'
import App from './containers/App'
import { HomePage } from './containers/HomePage'
import CounterPage from './containers/CounterPage'
import { Splash } from './components/Splash'


export default () => (
  <Router>
    <App>
      <Switch>
        <Route exact path="/" component={Splash as any} />
        <Route path="/counter" component={CounterPage} />
        <Route path="/app" component={HomePage} />
      </Switch>
    </App>
  </Router>
);
