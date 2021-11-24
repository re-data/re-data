import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import {Routes, Route, HashRouter} from "react-router-dom";
import reportWebVitals from './reportWebVitals';
import Alerts from "./pages/Alerts";
import Dashboard from "./pages/Dashboard";
import GraphView from "./pages/GraphView";
import GraphViewEcharts from "./pages/GraphViewEcharts";

ReactDOM.render(
    <HashRouter>
        <Routes>
            <Route path="/" element={<App/>}>
                <Route path="/" element={<Dashboard/>}>
                    <Route path="alerts" element={<Alerts/>}/>
                    <Route path="graph" element={<GraphView/>}/>
                    <Route path="graph_echarts" element={<GraphViewEcharts/>}/>
                </Route>
            </Route>
        </Routes>
    </HashRouter>,
    document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
