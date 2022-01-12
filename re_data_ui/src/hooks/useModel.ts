import { LineChart, ScatterChart } from 'echarts/charts';
import {
  GridComponent, MarkAreaComponent, SingleAxisComponent, TitleComponent,
  TooltipComponent, VisualMapComponent,
} from 'echarts/components';
import * as echarts from 'echarts/core';
import { UniversalTransition } from 'echarts/features';
import { CanvasRenderer } from 'echarts/renderers';
import {
  Anomaly, Metric,
  OverviewData, ReDataModelDetails,
} from '../contexts/redataOverviewContext';

echarts.use(
  [
    LineChart,
    ScatterChart,
    TitleComponent,
    TooltipComponent,
    GridComponent,
    SingleAxisComponent,
    VisualMapComponent,
    UniversalTransition,
    MarkAreaComponent,
    CanvasRenderer,
  ],
);

/**
 * useModel hook
 * * This hook is used to manipulate the model in-order to generate a graph
 * @returns an init function that can be used to initialize the graph
 */
// eslint-disable-next-line
function useModel() {
  /**
   * init function
   * * This function is used to initialize the graph using the overview & table name
   * @param  {OverviewData} overview
   * @param  {string} fullTableName
   * @returns the model details
   */
  const init = (overview: OverviewData, fullTableName: string) => {
    let modelDetails: ReDataModelDetails = {
      anomalies: new Map<string, Array<Anomaly>>(),
      metrics: {
        tableMetrics: new Map<string, Array<Metric>>(),
        columnMetrics: new Map<string, Array<Metric>>(),
      },
      schemaChanges: [],
      tableSchema: [],
      testSchema: [],
    };

    if (overview.aggregated_models.has(fullTableName)) {
      modelDetails = overview.aggregated_models.get(fullTableName) as ReDataModelDetails;
    }

    return modelDetails;
  };

  return {
    init,
  };
}

export default useModel;
