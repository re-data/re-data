import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import { Routes, Route, HashRouter } from 'react-router-dom';
import App from './App';
import reportWebVitals from './reportWebVitals';
import Alerts from './pages/Alerts';
import Dashboard from './pages/Dashboard';
import GraphView from './pages/GraphView';

ReactDOM.render(
  <HashRouter>
    <Routes>
      <Route path="/" element={<App />}>
        <Route path="/" element={<Dashboard />}>
          <Route path="alerts" element={<Alerts />} />
          <Route path="graph" element={<GraphView />} />
        </Route>
      </Route>
    </Routes>
  </HashRouter>,
  document.getElementById('root'),
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
