/* eslint-disable comma-dangle */
/* eslint-disable no-continue */
/* eslint-disable no-nested-ternary */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, {
  ReactElement, useContext, useState
} from 'react';
import { NodeOptions } from 'vis';
import { FlowGraph, ModelDetails } from '../components';
import {
  DbtNode, DbtSource, OverviewData, ReDataModelDetails, RedataOverviewContext
} from '../contexts/redataOverviewContext';
import { generateModelId, supportedResTypes } from '../utils';

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

type ResourceTypeColorsProps = {
  [key: string]: string;
}

const resourceTypeColors: ResourceTypeColorsProps = {
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

  if (!overview.graph || !overview.modelNodes) {
    return graph;
  }

  const {
    aggregated_models: aggregatedModels,
    dbtMapping,
    modelNodes,
    graph: { nodes: dbtNodes, sources: dbtSources }
  } = overview;
  const allNodes = { ...dbtNodes, ...dbtSources };

  if (modelName) {
    const { parent_map: parentNodes, child_map: childNodes } = overview.graph;
    const modelTitle = dbtMapping[modelName];

    // get all the parents and the child nodes of the model name;
    const modelParentNodes = parentNodes[modelTitle] || [];
    const modelChildNodes = childNodes[modelTitle] || [];

    // draw the model node
    // draw the parent nodes and connect it to the node using an edge
    // draw the child nodes and connect it to the node using an edge

    const index = 0;
    const details = allNodes[modelTitle];
    const modelId = generateModelId(details);

    const n = {
      key: index + 1,
      id: modelId,
      label: details.name,
      shape: 'box',
      color: {
        background: resourceTypeColors[details.resource_type],
      },
    };
    graph.nodes.push(n);

    modelParentNodes.forEach((parent) => {
      const parentDetails = allNodes[parent];
      const { name, resource_type: resourceType } = parentDetails;
      if (supportedResTypes.has(resourceType)) {
        const parentModelId = generateModelId(parentDetails);
        graph.nodes.push({
          id: parentModelId,
          label: name,
          shape: 'box',
          color: {
            background: resourceTypeColors[details.resource_type],
          },
        });

        const edge: VisEdge = {
          from: parentModelId,
          to: modelId,
          arrows: 'to',
        };
        graph.edges.push(edge);
      }
    });
    modelChildNodes.forEach((child) => {
      const childDetails = allNodes[child];
      const {
        database, schema, name,
        resource_type: resourceType,
      } = childDetails;
      if (supportedResTypes.has(resourceType)) {
        const childModelId = `${database}.${schema}.${name}`.toLowerCase();
        graph.nodes.push({
          id: childModelId,
          label: name,
          shape: 'box',
          color: {
            background: resourceTypeColors[details.resource_type],
          },
        });

        const edge: VisEdge = {
          from: modelId,
          to: childModelId,
          arrows: 'to',
        };
        graph.edges.push(edge);
      }
    });
  } else {
    // const {  } = overview;
    for (let index = 0; index < modelNodes.length; index++) {
      const currentNode = modelNodes[index];
      const modelTitle = dbtMapping[currentNode.label];
      const details = allNodes[modelTitle];
      const modelId = generateModelId(details);

      // for monitored nodes
      const config = details.config as any;
      const isNodeMonitored = config?.re_data_monitored || false;
      const { anomalies, schemaChanges } = aggregatedModels.get(modelId) as ReDataModelDetails;

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

      const node = {
        // const node: VisNode = {
        key: index + 1,
        id: modelId,
        label: details.name,
        shape: 'box',
        anomalies: anomalies.size > 0,
        schemaChanges: schemaChanges.length > 0,
        isMonitored: config?.re_data_monitored || false,
        color: {
          background: resourceTypeColors[details.resource_type],
        },
      };
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

  return graph;
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

  const graph = generateGraph({
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

  // console.log('graph -> ', JSON.stringify(graph));

  return (
    <>
      <div className="flex justify-between items-center absolute mt-4 ml-4 mr-20 z-20 w-2/3">
        <div className="flex items-center">
          <button
            type="button"
            title="Toggle Source Nodes"
            onClick={() => toggleModelType('source')}
            className={`flex items-center ml-1 mr-4 ${modelType === 'source' && 'active-tab'}`}
          >
            <div className="w-3 h-3 bg-source rounded-tooltip" />
            <p className="text-sm font-medium ml-1">Source</p>
          </button>
          <button
            type="button"
            title="Toggle Seed Nodes"
            onClick={() => toggleModelType('seed')}
            className={`flex items-center ml-1 mr-4 ${modelType === 'seed' && 'active-tab'}`}
          >
            <div className="w-3 h-3 bg-seed rounded-tooltip" />
            <p className="text-sm font-medium ml-1">Seed</p>
          </button>
          <button
            type="button"
            title="Toggle Model Nodes"
            onClick={() => toggleModelType('model')}
            className={`flex items-center ml-1 mr-4 ${modelType === 'model' && 'active-tab'}`}
          >
            <div className="w-3 h-3 bg-model rounded-tooltip" />
            <p className="text-sm font-medium ml-1">Model</p>
          </button>
          <button
            type="button"
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
                    onChange={() => setMonitored(!monitored)}
                  />
                  <div className="block bg-gray-300 w-10 h-6 rounded-full" />
                  <div className="dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition" />
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
          {overviewDataLoaded && <FlowGraph data={graph} disableClick={!showModelDetails} />}
        </div>

        {showModelDetails && <ModelDetails />}
      </div>
    </>
  );
};

export default GraphView;
