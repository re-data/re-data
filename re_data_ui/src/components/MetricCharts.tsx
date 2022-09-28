import dayjs from 'dayjs';
import EChartsReactCore from 'echarts-for-react/lib/core';
import { LineSeriesOption, ScatterSeriesOption } from 'echarts/charts';
import {
  GridComponentOption,
  MarkAreaComponentOption,
  SingleAxisComponentOption,
  TitleComponentOption,
  TooltipComponentOption,
  VisualMapComponentOption,
} from 'echarts/components';
import * as echarts from 'echarts/core';
import { MarkArea1DDataItemOption, MarkArea2DDataItemOption } from 'echarts/types/src/component/marker/MarkAreaModel';
import { VisualOptionPiecewise } from 'echarts/types/src/util/types';
import React, { ReactElement } from 'react';
import { FaRegSmileBeam, FaRegSmileWink } from 'react-icons/all';
import { useSearchParams } from 'react-router-dom';
import { Anomaly, Metric, ReDataModelDetails } from '../contexts/redataOverviewContext';
import {
  extractComponentFromIdentifier, generateAnomalyIdentifier,
  getFormatter,
  metricValue,
} from '../utils';
import colors from '../utils/colors.js';
import EmptyContent from './EmptyContent';

export interface MetricChartsProps {
  modelDetails: ReDataModelDetails;
  showAnomalies: boolean;
  showTitle?: boolean;
  fullWidth?: boolean;
}

interface VisualPiece extends VisualOptionPiecewise {
  min?: number;
  max?: number;
  lt?: number;
  gt?: number;
  lte?: number;
  gte?: number;
  value?: number;
  label?: string;
}

type ECOption = echarts.ComposeOption<| LineSeriesOption
  | TitleComponentOption
  | ScatterSeriesOption
  | MarkAreaComponentOption
  | VisualMapComponentOption
  | SingleAxisComponentOption
  | TooltipComponentOption
  | GridComponentOption>;

const formatTime = (timeWindowEnd: string, intervalLengthSec: number): string => {
  const xAxisTimestampFormat = 'YYYY-MM-DD HH:mm';
  const xAxisDateFormat = 'YYYY-MM-DD';
  if (intervalLengthSec < 86400) {
    return dayjs(timeWindowEnd).format(xAxisTimestampFormat);
  }
  return dayjs(timeWindowEnd).format(xAxisDateFormat);
};

const generateMarkAreas = (
  anomaliesMap: Map<string, Anomaly[]>,
  columnName: string,
  metricName: string): (MarkArea1DDataItemOption | MarkArea2DDataItemOption
)[] => {
  const arr: (MarkArea1DDataItemOption | MarkArea2DDataItemOption)[] = [];
  // '' empty string key contains anomalies for table level metrics.
  let anomalies: Array<Anomaly>;
  if (anomaliesMap.has(columnName)) {
    anomalies = anomaliesMap.get(columnName) as Array<Anomaly>;
  } else {
    anomalies = (anomaliesMap.has('') ? anomaliesMap.get('') : []) as Array<Anomaly>;
  }
  for (const anomaly of anomalies) {
    if (anomaly.metric === metricName) {
      const intervalLengthSec = Number(anomaly.interval_length_sec);
      const prevTimeWindowEnd = dayjs(anomaly.time_window_end)
        .subtract(intervalLengthSec, 's').format();
      const currTimeWindowEnd = anomaly.time_window_end;
      arr.push([
        {
          xAxis: formatTime(prevTimeWindowEnd, intervalLengthSec),
        },
        {
          xAxis: formatTime(currTimeWindowEnd, intervalLengthSec),
        },
      ]);
    }
  }
  return arr;
};

const generatePiecesForVisualMap = (
  metrics: Array<Metric>, anomalies: Map<string, Anomaly[]>, columnName: string,
): VisualPiece[] => {
  const pieces: VisualPiece[] = [];
  const anomaliesTimeWindow = (anomalies.has(columnName)
    ? anomalies.get(columnName)
    : []) as Array<Anomaly>;
  const set = new Set(anomaliesTimeWindow.map((a) => `${a.metric}_${a.time_window_end}`));
  for (let i = 0; i < metrics.length; i++) {
    const metric = metrics[i];
    const key = `${metric.metric}_${metric.time_window_end}`;
    if (set.has(key)) {
      pieces.push({
        gt: i - 1,
        lte: i,
      });
    }
  }
  return pieces;
};

const generateMetricChartOption = (
  key: string, metrics: Metric[], anomaliesMap: Map<string, Anomaly[]>, isTableMetric: boolean,
): ECOption => {
  const metricName = extractComponentFromIdentifier(key, 'metricName');
  const columnName = extractComponentFromIdentifier(key, 'columnName');
  const title = isTableMetric
    ? `${extractComponentFromIdentifier(key, 'metricName')}`
    : `${extractComponentFromIdentifier(key, 'metricName')}(${extractComponentFromIdentifier(key, 'columnName')})`;
  const pieces = generatePiecesForVisualMap(metrics, anomaliesMap, columnName);
  return {
    title: {
      text: title,
    },
    grid: {
      top: '20%', right: '5%', bottom: '12%', left: '15%',
    },
    xAxis: {
      type: 'category',
      data: metrics.map((m) => formatTime(m.time_window_end, Number(m.interval_length_sec))),
    },
    yAxis: {
      type: 'value',
      axisLabel: {
        formatter: getFormatter(metricName),
      },
    },
    series: [
      {
        name: title,
        data: metrics.map(metricValue),
        type: 'line',
        color: colors.chat_line,
        smooth: true,
        markArea: {
          itemStyle: {
            color: 'rgba(255, 173, 177, 0.4)',
          },
          data: generateMarkAreas(anomaliesMap, columnName, metricName),
        },
      },
    ],
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'line',
      },
    },
    visualMap: {
      show: false,
      dimension: 0,
      pieces,
      inRange: {
        // if no anomaly exists, everything is in range hence don't color red
        color: pieces.length ? colors.secondary : colors.chat_line,
      },
      outOfRange: {
        color: colors.chat_line,
      },
    },
  };
};

function MetricCharts(params: MetricChartsProps): ReactElement {
  const {
    modelDetails, showAnomalies,
    showTitle = true, fullWidth = true,
  } = params;
  const [searchParams] = useSearchParams();
  const model = searchParams.get('model') as string;
  const anomaliesMap = modelDetails.anomalies;
  const metricsObj = modelDetails.metrics;
  const anomaliesChartOptions: Array<[string, ECOption]> = [];
  const tableMetricChartsMap: Map<string, ECOption> = new Map<string, ECOption>();
  const columnMetricChartsMap: Map<string, ECOption> = new Map<string, ECOption>();
  metricsObj.tableMetrics.forEach((metrics, key) => {
    const option = generateMetricChartOption(key, metrics, anomaliesMap, true);
    tableMetricChartsMap.set(key, option);
  });
  metricsObj.columnMetrics.forEach((metrics, key) => {
    const option = generateMetricChartOption(key, metrics, anomaliesMap, false);
    columnMetricChartsMap.set(key, option);
  });
  anomaliesMap.forEach((anomalies) => {
    for (const anomaly of anomalies) {
      const key = generateAnomalyIdentifier(model, anomaly);
      if (tableMetricChartsMap.has(key)) {
        const val = tableMetricChartsMap.get(key) as ECOption;
        anomaliesChartOptions.push([key, { ...val }]);
      }
      if (columnMetricChartsMap.has(key)) {
        const val = columnMetricChartsMap.get(key) as ECOption;
        anomaliesChartOptions.push([key, { ...val }]);
      }
    }
  });
  const tableMetricCharts = Array.from(tableMetricChartsMap).map(([key, option]) => (
    <EChartsReactCore key={key} echarts={echarts} option={option} />
  ));
  const columnMetricCharts = Array.from(columnMetricChartsMap).map(([key, option]) => (
    <EChartsReactCore key={key} echarts={echarts} option={option} />
  ));
  const alertMetricCharts = anomaliesChartOptions.map(([key, option]) => (
    <EChartsReactCore key={`alert_${key}`} echarts={echarts} option={option} />
  ));

  return (
    <>
      {showAnomalies
        ? (
          <>
            <div
              className={`${(!fullWidth && alertMetricCharts.length) && 'grid grid-cols-2 gap-4'} overflow-hidden sm:rounded-lg p-4 mt-3 mb-3`}
            >
              {alertMetricCharts.length ? alertMetricCharts : (
                <EmptyContent text="No Anomalies!">
                  <FaRegSmileBeam size={50} color={colors.primary} />
                </EmptyContent>
              )}
            </div>
          </>
        )
        : (
          <>
            {showTitle && (
              <span className="text-lg text-capitalize">Table Metrics</span>
            )}
            <div
              className={`${(!fullWidth && tableMetricCharts.length) && 'grid grid-cols-2 gap-4'} overflow-hidden border-b border-gray-200 sm:rounded-lg p-4 mt-3 mb-3`}
            >
              {tableMetricCharts.length ? tableMetricCharts : (
                <EmptyContent text="Add this table to re_data config, to generate metrics">
                  <FaRegSmileWink size={50} color={colors.primary} />
                </EmptyContent>
              )}
            </div>
            {showTitle && (
              <span className="text-lg">Column Metrics</span>
            )}
            <div
              className={`${(!fullWidth && columnMetricCharts.length) && 'grid grid-cols-2 gap-4'} overflow-hidden border-b border-gray-200 sm:rounded-lg p-4 mt-3 mb-3`}
            >
              {columnMetricCharts.length ? columnMetricCharts : (
                <EmptyContent text="Add this table to re_data config, to generate metrics">
                  <FaRegSmileWink size={50} color={colors.primary} />
                </EmptyContent>
              )}
            </div>
          </>
        )}
    </>
  );
}

export default MetricCharts;
