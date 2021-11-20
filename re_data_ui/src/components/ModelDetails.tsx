import React, {ReactElement, useContext} from "react";
import {useSearchParams} from "react-router-dom"
import {AggregatedMetrics, OverviewData, RedataOverviewContext} from "../contexts/redataOverviewContext";
import {CartesianGrid, XAxis, YAxis, Tooltip, Bar, BarChart} from 'recharts'

const generateMetricCharts = (data: AggregatedMetrics): ReactElement => {
    const tableMetricCharts = (
        Array.from(data.tableMetrics).map(([key, metrics]) => (
            <div key={key}>
                <span className="text-sm text-gray-500">{key}</span>
                <BarChart width={400} height={200} data={metrics}>
                    <CartesianGrid strokeDasharray="3 3"/>
                    <Bar dataKey="value" fill="#8884d8"/>
                    <XAxis dataKey="time_window_end"/>
                    <YAxis/>
                    <Tooltip cursor={false}/>
                </BarChart>
            </div>
        )));
    const columnMetricCharts = (
        Array.from(data.columnMetrics).map(([key, metrics]) => (
            <div key={key}>
                <span className="text-sm">{key}</span>
                <BarChart width={400} height={200} data={metrics}>
                    <CartesianGrid strokeDasharray="3 3"/>
                    <Bar dataKey="value" fill="#8884d8"/>
                    <XAxis dataKey="time_window_end"/>
                    <YAxis/>
                    <Tooltip cursor={false}/>
                </BarChart>
            </div>
        )));
    return (
        <div>
            <span className="text-lg text--capitalize font-bold">Table Metrics</span>
            {tableMetricCharts}
            <span className="text-lg text--capitalize font-bold">Column Metrics</span>
            {columnMetricCharts}
        </div>
    );
}

const ModelDetails: React.FC = (): ReactElement => {
    const [searchParams] = useSearchParams();
    let modelExists = false;
    const fullTableName = searchParams.get('model');
    const overview: OverviewData = useContext(RedataOverviewContext);
    // @ts-ignore
    let data: AggregatedMetrics = [];
    if (typeof fullTableName === "string" && overview.aggregated_metrics.has(fullTableName)) {
        modelExists = true;
        // @ts-ignore
        data = overview.aggregated_metrics.get(fullTableName);
    }
    return (
        <div className='col-span-2 h-auto overflow-scroll' style={{height: '700px'}}>
            <div className="bg-white rounded shadow border p-3">
                {!modelExists ? (<span>No metrics</span>) : generateMetricCharts(data)}
            </div>
        </div>

    );
};

export default ModelDetails;
