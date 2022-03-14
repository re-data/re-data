import React, {
  ReactElement, useCallback, useContext, useState,
} from 'react';
import { Elements } from 'react-flow-renderer';
import { FlowGraph, ModelDetails } from '../components';
import {
  DbtNode, DbtSource, OverviewData, ReDataModelDetails, RedataOverviewContext,
} from '../contexts/redataOverviewContext';
import {
  generateEdge, generateModelId, generateNode, supportedResTypes,
} from '../utils';

type AlertsType = 'anomaly' | 'schema_change' | 'failed_test' | null

type GenerateGraphProps = {
  overview: OverviewData;
  modelName?: string | null;
  modelType?: string | null;
  monitored?: boolean;
  alerts?: AlertsType;
}

const getAlertData = (modelId: string, aggregatedModels: Map<string, ReDataModelDetails>) => {
  const {
    anomalies,
    schemaChanges,
  } = aggregatedModels.get(modelId) as ReDataModelDetails;

  return { anomalies, schemaChanges };
};

const generateGraph = (
  {
    overview, modelName,
    modelType, monitored,
    alerts,
  }: GenerateGraphProps,
): Elements => {
  const elements: Elements = [];
  const elementObj: Record<string, string> = {};
  const edgesArr: Record<string, string>[] = [];

  if (!overview.graph || !overview.modelNodes) {
    return elements;
  }

  const {
    dbtMapping,
    modelNodes,
    aggregated_models: aggregatedModels,
    graph: { nodes: dbtNodes, sources: dbtSources },
    tests,
  } = overview;
  const allNodes = { ...dbtNodes, ...dbtSources };

  if (modelName) {
    const {
      parent_map: parentNodes,
      child_map: childNodes,
    } = overview.graph;
    const modelTitle = dbtMapping[modelName];

    // get all the parents and the child nodes of the model name;
    const modelParentNodes = parentNodes[modelTitle] || [];
    const modelChildNodes = childNodes[modelTitle] || [];

    const details = allNodes[modelTitle];
    const modelId = generateModelId(details);

    const { anomalies, schemaChanges } = getAlertData(modelId, aggregatedModels);

    const n = generateNode({
      index: '0',
      modelId,
      details,
      anomalies: anomalies.size > 0,
      schemaChanges: schemaChanges.length > 0,
    });
    elements.push(n);
    elementObj[modelId] = '0';

    const parentNodesLength = modelParentNodes.length;

    for (let index = 0; index < parentNodesLength; index++) {
      const parent = modelParentNodes[index];
      const parentDetails = allNodes[parent];
      const { resource_type: resourceType } = parentDetails;

      if (supportedResTypes.has(resourceType)) {
        const parentModelId = generateModelId(parentDetails);
        const {
          anomalies: parentAnomalies,
          schemaChanges: parentSchemaChanges,
        } = getAlertData(parentModelId, aggregatedModels);

        const key = index + 1;
        const parentNode = generateNode({
          modelId: parentModelId,
          index: key,
          details: parentDetails,
          anomalies: parentAnomalies.size > 0,
          schemaChanges: parentSchemaChanges.length > 0,
        });
        elements.push(parentNode);
        elementObj[parentModelId] = key?.toString();

        edgesArr.push({
          from: parentModelId,
          to: modelId,
        });
      }
    }

    for (let index = 0; index < modelChildNodes.length; index++) {
      const child = modelChildNodes[index];

      const childDetails = allNodes[child];
      const {
        database, schema, name,
        resource_type: resourceType,
      } = childDetails;
      if (supportedResTypes.has(resourceType)) {
        const childModelId = `${database}.${schema}.${name}`.toLowerCase();
        const {
          anomalies: childAnomalies,
          schemaChanges: childSchemaChanges,
        } = getAlertData(childModelId, aggregatedModels);

        const key = index + 1 + parentNodesLength;
        const childNode = generateNode({
          modelId: childModelId,
          index: key,
          details: childDetails,
          anomalies: childAnomalies.size > 0,
          schemaChanges: childSchemaChanges.length > 0,
        });
        elements.push(childNode);
        elementObj[childModelId] = key?.toString();

        edgesArr.push({
          from: modelId,
          to: childModelId,
        });
      }
    }
  } else {
    for (let index = 0; index < modelNodes.length; index++) {
      const currentNode = modelNodes[index];
      const modelTitle = dbtMapping[currentNode.label];
      const details = allNodes[modelTitle];
      const modelId = generateModelId(details);

      // console.log('tests ', tests);

      // for monitored nodes
      const config = details.config as Record<string, unknown>;
      const isNodeMonitored = config?.re_data_monitored || false;
      const { anomalies, schemaChanges } = getAlertData(modelId, aggregatedModels);

      if (alerts === 'anomaly' && anomalies.size < 1) {
        continue;
      } else if (alerts === 'schema_change' && schemaChanges.length < 1) {
        continue;
      } else if (alerts === 'failed_test' && schemaChanges.length < 1) {
        continue;
      }
      if (monitored && !isNodeMonitored) {
        continue;
      }
      // check if model type exists and this currentNode is of that type
      if (modelType && modelType !== details.resource_type) {
        continue;
      }

      const node = generateNode({
        index,
        modelId,
        details,
        anomalies: anomalies.size > 0,
        schemaChanges: schemaChanges.length > 0,
      });
      elementObj[modelId] = index?.toString();

      elements.push(node);

      if (details.resource_type !== 'source') {
        const d = details as DbtNode;
        const parentNodes = new Set(d.depends_on.nodes);
        parentNodes.forEach((parent) => {
          const parentNode: DbtNode | DbtSource = dbtNodes[parent]
            ? dbtNodes[parent]
            : dbtSources[parent];
          if (parentNode) {
            const parentModelId = generateModelId(parentNode);
            edgesArr.push({
              from: parentModelId,
              to: modelId,
            });
          }
        });
      }
    }
  }

  for (let index = 0; index < edgesArr.length; index++) {
    const { from, to } = edgesArr[index];
    const edge = generateEdge({ obj: elementObj, from, to });
    if (edge.source && edge.target) {
      elements.push(edge);
    }
  }

  return elements;
};

export interface GraphPartialProps {
  modelName?: string | null;
  showModelDetails?: boolean;
}

function GraphPartial(params: GraphPartialProps): ReactElement {
  const {
    modelName = null,
    showModelDetails = true,
  } = params;
  const [monitored, setMonitored] = useState(true);

  const overview: OverviewData = useContext(RedataOverviewContext);
  const overviewDataLoaded = !!overview.graph;
  const [modelType, setModelType] = useState<string | null>(null);
  const [alerts, setAlerts] = useState<AlertsType>(null);

  const elements: Elements = generateGraph({
    overview,
    modelName,
    modelType,
    monitored,
    alerts,
  });

  // console.log('overview test ', overview.tests);

  const toggleModelType = (type: string) => {
    setModelType((prevType: string | null) => {
      if (prevType === type) {
        return null;
      }
      return type;
    });
    setAlerts(null);
  };

  const toggleAlerts = (name: AlertsType) => {
    setAlerts((prevName: AlertsType) => {
      if (prevName === name) {
        return null;
      }
      return name;
    });
    setModelType(null);
  };

  const toggleMonitored = useCallback(() => {
    setMonitored(!monitored);
  }, [monitored]);

  return (
    <>
      <div className="flex justify-between items-center absolute mt-4 ml-4 mr-20 z-20 w-2/3">
        <div className="flex items-center">
          <button
            type="button"
            disabled={!showModelDetails}
            title="Toggle Source Nodes"
            onClick={() => toggleModelType('source')}
            className={`flex items-center mr-4 ${modelType === 'source' && 'active-tab'}`}
          >
            <div className="w-3 h-3 bg-source rounded-tooltip" />
            <p className="text-sm font-medium ml-1">Source</p>
          </button>
          <button
            type="button"
            disabled={!showModelDetails}
            title="Toggle Seed Nodes"
            onClick={() => toggleModelType('seed')}
            className={`flex items-center mr-4 ${modelType === 'seed' && 'active-tab'}`}
          >
            <div className="w-3 h-3 bg-seed rounded-tooltip" />
            <p className="text-sm font-medium ml-1">Seed</p>
          </button>
          <button
            type="button"
            disabled={!showModelDetails}
            title="Toggle Model Nodes"
            onClick={() => toggleModelType('model')}
            className={`flex items-center mr-4 ${modelType === 'model' && 'active-tab'}`}
          >
            <div className="w-3 h-3 bg-model rounded-tooltip" />
            <p className="text-sm font-medium ml-1">Model</p>
          </button>
          <button
            type="button"
            disabled={!showModelDetails}
            title="Toggle Failed Test"
            onClick={() => toggleAlerts('failed_test')}
            className={`flex items-center mr-4 ${alerts === 'failed_test' && 'active-tab'}`}
          >
            <div className="w-3 h-3 bg-red-600 rounded-full" />
            <p className="text-sm font-medium ml-1">Failed Test</p>
          </button>
          <button
            type="button"
            disabled={!showModelDetails}
            title="Toggle Model Nodes"
            onClick={() => toggleAlerts('anomaly')}
            className={`flex items-center mr-4 ${alerts === 'anomaly' && 'active-tab'}`}
          >
            <div className="w-3 h-3 bg-red-500 rounded-full" />
            <p className="text-sm font-medium ml-1">Anomaly</p>
          </button>
          <button
            type="button"
            disabled={!showModelDetails}
            title="Toggle Model Nodes"
            onClick={() => toggleAlerts('schema_change')}
            className={`flex items-center mr-4 ${alerts === 'schema_change' && 'active-tab'}`}
          >
            <div className="w-3 h-3 bg-yellow-300 rounded-full" />
            <p className="text-sm font-medium ml-1">Schema Change</p>
          </button>
        </div>
        {showModelDetails && (
          <div className="flex items-center mr-8">
            <div className="flex items-center justify-center w-full">
              <label htmlFor="toggleB" className="flex items-center cursor-pointer">
                <div className="mr-3 text-gray-700 text-sm font-medium">
                  Monitored
                </div>
                <div className="relative">
                  <input
                    type="checkbox"
                    id="toggleB"
                    className="sr-only sd"
                    onChange={toggleMonitored}
                  />
                  <div className="block bg-gray-300 w-10 h-6 rounded-full" />
                  <div className="dot absolute left-1 top-1 bg-primary w-4 h-4 rounded-full transition" />
                </div>
                <div className="ml-3 text-gray-700 text-sm font-medium">
                  All Nodes
                </div>
              </label>
            </div>
          </div>
        )}
      </div>
      <div
        className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-12
        gap-4 bg-white border-2 border-solid border-gray-200 rounded-lg h-full"
      >
        <div className={showModelDetails ? 'col-span-8' : 'col-span-12'}>
          {overviewDataLoaded && (
            <FlowGraph
              data={elements}
              disableClick={!showModelDetails}
              modelName={modelName}
            />
          )}
        </div>

        {showModelDetails && <ModelDetails />}
      </div>
    </>
  );
}

export default GraphPartial;
