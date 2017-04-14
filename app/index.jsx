import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route } from 'react-router-dom';

import App from './components/App';

require('./styles/app.scss');

ReactDOM.render(
  <Router basename="/">
    <div>
      <Route exact path="/" component={App} />
    </div>
  </Router>,
  document.getElementById('app')
);
