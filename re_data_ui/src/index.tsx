import React from 'react';
import ReactDOM from 'react-dom';
import { HashRouter, Route, Routes } from 'react-router-dom';
import App from './App';
import './index.css';
import Alerts from './pages/Alerts';
import Tests from './pages/Tests/index';
import TestDetails from './pages/Tests/Details';
import Tables from './pages/Tables';
import Dashboard from './pages/Dashboard';
import GraphView from './pages/GraphView';
import reportWebVitals from './reportWebVitals';

ReactDOM.render(
  <HashRouter>
    <Routes>
      <Route path="/" element={<App />}>
        <Route path="/" element={<Dashboard />}>
          <Route path="/" element={<Alerts />} />
          <Route path="alerts" element={<Alerts />} />
          <Route path="graph" element={<GraphView />} />
          <Route path="tests" element={<Tests />} />
          <Route path="tests/:testName" element={<TestDetails />} />
          <Route path="tables" element={<Tables />} />
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
