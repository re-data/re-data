/* eslint-disable comma-dangle */
/* eslint-disable no-nested-ternary */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, {
  ReactElement, useCallback, useContext, useState
} from 'react';
import { Elements } from 'react-flow-renderer';
import { NodeOptions } from 'vis';
import { FlowGraph, ModelDetails } from '../components';
import {
  DbtNode, DbtSource, OverviewData, ReDataModelDetails, RedataOverviewContext
} from '../contexts/redataOverviewContext';
import {
  generateEdge, generateModelId, generateNode, supportedResTypes
} from '../utils';

export interface VisPointer {
  x: number,
  y: number
}

export interface VisNode extends NodeOptions {
  id: string | number,
  shape: string;
}

export interface VisEdge {
  from: string | number,
  to: string | number;
  arrows: string;
  color?: string;
}

export interface VisNetworkEventParams {
  edges?: Array<string>,
  nodes?: Array<string>,
  event?: Record<string, unknown>,
  pointer?: {
    DOM: VisPointer
    canvas: VisPointer
  }
}

export interface IGraph {
  nodes: Array<VisNode>;
  edges: Array<VisEdge>;
}

type Dictionary = {
  [key: string]: string
}

const resourceTypeColors: Dictionary = {
  source: 'hsl(97deg 66% 44%)',
  model: 'hsl(190deg 100% 35%)',
  seed: 'hsl(150deg 66% 44%)',
};

type AlertsType = 'anomaly' | 'schema_change' | null

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
    schemaChanges
  } = aggregatedModels.get(modelId) as ReDataModelDetails;

  return { anomalies, schemaChanges };
};

// TODO: refactor this function
const generateGraph = (
  {
    overview, modelName,
    modelType, monitored,
    alerts,
  }: GenerateGraphProps,
) => {
  const graph: IGraph = {
    nodes: [],
    edges: [],
  };

  const elements: Elements = [];
  const elementObj: Dictionary = {};
  const edgesArr: any = [];

  if (!overview.graph || !overview.modelNodes) {
    return graph;
  }

  const {
    dbtMapping,
    modelNodes,
    aggregated_models: aggregatedModels,
    graph: { nodes: dbtNodes, sources: dbtSources }
  } = overview;
  const allNodes = { ...dbtNodes, ...dbtSources };

  if (modelName) {
    const {
      parent_map: parentNodes,
      child_map: childNodes
    } = overview.graph;
    const modelTitle = dbtMapping[modelName];

    // get all the parents and the child nodes of the model name;
    const modelParentNodes = parentNodes[modelTitle] || [];
    const modelChildNodes = childNodes[modelTitle] || [];

    // console.log(' modelChildNodes -> ', modelChildNodes);
    // draw the model node
    // draw the parent nodes and connect it to the node using an edge
    // draw the child nodes and connect it to the node using an edge

    // const index = 0;
    const details = allNodes[modelTitle];
    const modelId = generateModelId(details);

    const { anomalies, schemaChanges } = getAlertData(modelId, aggregatedModels);

    const n = generateNode({
      index: '0',
      modelId,
      details,
      anomalies: anomalies.size > 0,
      schemaChanges: schemaChanges.length > 0
    });
    graph.nodes.push(n);
    elements.push(n);
    elementObj[modelId] = '0';

    const parentNodesLength = modelParentNodes.length;

    for (let index = 0; index < parentNodesLength; index++) {
      const parent = modelParentNodes[index];
      const parentDetails = allNodes[parent];
      const { name, resource_type: resourceType } = parentDetails;

      if (supportedResTypes.has(resourceType)) {
        const parentModelId = generateModelId(parentDetails);
        const {
          anomalies: parentAnomalies,
          schemaChanges: parentSchemaChanges
        } = getAlertData(parentModelId, aggregatedModels);

        const key = index + 1;
        const parentNode = generateNode({
          modelId: parentModelId,
          index: key,
          details: parentDetails,
          anomalies: parentAnomalies.size > 0,
          schemaChanges: parentSchemaChanges.length > 0
        });
        graph.nodes.push(parentNode);
        elements.push(parentNode);
        elementObj[parentModelId] = key?.toString();

        edgesArr.push({
          from: parentModelId,
          to: modelId,
        });
        const edge: VisEdge = {
          from: parentModelId,
          to: modelId,
          arrows: 'to',
        };
        graph.edges.push(edge);
      }
    }

    for (let index = 0; index < modelChildNodes.length; index++) {
      const child = modelChildNodes[index];
      // console.log('child', child);
      const childDetails = allNodes[child];
      const {
        database, schema, name,
        resource_type: resourceType,
      } = childDetails;
      if (supportedResTypes.has(resourceType)) {
        console.log(modelType, resourceType, !!(modelType && modelType !== resourceType));
        const childModelId = `${database}.${schema}.${name}`.toLowerCase();
        const {
          anomalies: childAnomalies,
          schemaChanges: childSchemaChanges
        } = getAlertData(childModelId, aggregatedModels);

        const key = index + 1 + parentNodesLength;
        const childNode = generateNode({
          modelId: childModelId,
          index: key,
          details: childDetails,
          anomalies: childAnomalies.size > 0,
          schemaChanges: childSchemaChanges.length > 0
        });

        graph.nodes.push(childNode);
        elements.push(childNode);
        elementObj[childModelId] = key?.toString();

        edgesArr.push({
          from: modelId,
          to: childModelId,
        });

        const edge: VisEdge = {
          from: modelId,
          to: childModelId,
          arrows: 'to',
        };
        graph.edges.push(edge);
      }
    }
  } else {
    for (let index = 0; index < modelNodes.length; index++) {
      const currentNode = modelNodes[index];
      const modelTitle = dbtMapping[currentNode.label];
      const details = allNodes[modelTitle];
      const modelId = generateModelId(details);

      // for monitored nodes
      const config = details.config as any;
      const isNodeMonitored = config?.re_data_monitored || false;
      const { anomalies, schemaChanges } = getAlertData(modelId, aggregatedModels);

      if (alerts === 'anomaly' && anomalies.size < 1) {
        continue;
      } else if (alerts === 'schema_change' && schemaChanges.length < 1) {
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
        schemaChanges: schemaChanges.length > 0
      });
      elementObj[modelId] = index?.toString();
      // console.log('elementObj -> ', elementObj);

      elements.push(node);
      graph.nodes.push(node);

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

            const edge: VisEdge = {
              from: parentModelId,
              to: modelId,
              arrows: 'to',
            };
            graph.edges.push(edge);
          }
        });
      }
    }
  }

  for (let index = 0; index < edgesArr.length; index++) {
    const { from, to } = edgesArr[index];
    // console.log('edgesArr -> ', edgesArr.length);
    // console.log('from , to ', from, to);
    // console.log('from , to ', elementObj);
    // console.log('from , to ', from, to, elementObj);
    const edge = generateEdge({ obj: elementObj, from, to });
    elements.push(edge);
  }

  console.log('elements -> ', elements);

  return { graph, elements };
};

export interface GraphViewProps {
  modelName?: string | null;
  showModelDetails?: boolean
}

const GraphView: React.FC<GraphViewProps> = (props: GraphViewProps): ReactElement => {
  const {
    modelName = null,
    showModelDetails = true,
  } = props;
  const [monitored, setMonitored] = useState(true);

  const overview: OverviewData = useContext(RedataOverviewContext);
  const overviewDataLoaded = !!overview.graph;
  const [modelType, setModelType] = useState<string | null>(null);
  const [alerts, setAlerts] = useState<AlertsType>(null);

  const { graph, elements }: any = generateGraph({
    overview,
    modelName,
    modelType,
    monitored,
    alerts,
  });

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

  // console.log('graph -> ', JSON.stringify(graph));

  return (
    <>
      <div className="flex justify-between items-center absolute mt-4 ml-4 mr-20 z-20 w-2/3">
        <div className="flex items-center">
          <button
            type="button"
            disabled={!showModelDetails}
            title="Toggle Source Nodes"
            onClick={() => toggleModelType('source')}
            className={`flex items-center ml-1 mr-4 ${modelType === 'source' && 'active-tab'}`}
          >
            <div className="w-3 h-3 bg-source rounded-tooltip" />
            <p className="text-sm font-medium ml-1">Source</p>
          </button>
          <button
            type="button"
            disabled={!showModelDetails}
            title="Toggle Seed Nodes"
            onClick={() => toggleModelType('seed')}
            className={`flex items-center ml-1 mr-4 ${modelType === 'seed' && 'active-tab'}`}
          >
            <div className="w-3 h-3 bg-seed rounded-tooltip" />
            <p className="text-sm font-medium ml-1">Seed</p>
          </button>
          <button
            type="button"
            disabled={!showModelDetails}
            title="Toggle Model Nodes"
            onClick={() => toggleModelType('model')}
            className={`flex items-center ml-1 mr-4 ${modelType === 'model' && 'active-tab'}`}
          >
            <div className="w-3 h-3 bg-model rounded-tooltip" />
            <p className="text-sm font-medium ml-1">Model</p>
          </button>
          <button
            type="button"
            disabled={!showModelDetails}
            title="Toggle Model Nodes"
            onClick={() => toggleAlerts('anomaly')}
            className={`flex items-center ml-1 mr-4 ${alerts === 'anomaly' && 'active-tab'}`}
          >
            <div className="w-3 h-3 bg-red-600 rounded-full" />
            <p className="text-sm font-medium ml-1">Anomaly</p>
          </button>
          <button
            type="button"
            title="Toggle Model Nodes"
            onClick={() => toggleAlerts('schema_change')}
            className={`flex items-center ml-1 mr-4 ${alerts === 'schema_change' && 'active-tab'}`}
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
          {overviewDataLoaded && <FlowGraph data={elements} disableClick={!showModelDetails} />}
        </div>

        {showModelDetails && <ModelDetails />}
      </div>
    </>
  );
};

export default GraphView;
