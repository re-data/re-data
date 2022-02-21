/* eslint-disable no-continue */
/* eslint-disable no-nested-ternary */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, {
  ReactElement, useContext, useState,
} from 'react';
import { NodeOptions } from 'vis';
import { FlowGraph, ModelDetails } from '../components';
// import LineageGraph from '../components/LineageGraph';
// import ModelDetails from '../components/ModelDetails';
import {
  DbtNode, DbtSource, OverviewData, RedataOverviewContext,
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

type GenerateGraphProps = {
  overview: OverviewData;
  modelName?: string | null;
  modelType?: string | null;
}

const generateGraph = ({ overview, modelName, modelType }:GenerateGraphProps) => {
  const graph: IGraph = {
    nodes: [],
    edges: [],
  };

  if (!overview.graph || !overview.modelNodes) {
    return graph;
  }

  const { dbtMapping } = overview;
  const dbtNodes = overview.graph.nodes;
  const dbtSources = overview.graph.sources;

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
    const { modelNodes } = overview;
    for (let index = 0; index < modelNodes.length; index++) {
      const currentNode = modelNodes[index];
      const modelTitle = dbtMapping[currentNode.label];
      const details = allNodes[modelTitle];
      const modelId = generateModelId(details);

      // for monitored nodes
      const config = details.config as any;

      // console.log('details in -> ', config?.re_data_monitored);

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

  const overview: OverviewData = useContext(RedataOverviewContext);
  const overviewDataLoaded = !!overview.graph;
  // const [modelType, setModelType] = useState<string | null>('model');
  const [modelType, setModelType] = useState<string | null>(null);

  const graph = generateGraph({ overview, modelName, modelType });

  // console.log('graph -> ', JSON.stringify(graph));

  return (
    <>
      <div className="flex items-center absolute mt-4 ml-4 z-20">
        <button type="button" onClick={() => setModelType('source')} className="flex items-center">
          <div className="w-3 h-3 bg-source rounded-tooltip" />
          <p className="text-sm font-medium ml-1 mr-4">Source nodes</p>
        </button>
        <button type="button" onClick={() => setModelType('seed')} className="flex items-center">
          <div className="w-3 h-3 bg-seed rounded-tooltip" />
          <p className="text-sm font-medium ml-1 mr-4">Seed nodes</p>
        </button>
        <button type="button" onClick={() => setModelType('model')} className="flex items-center">
          <div className="w-3 h-3 bg-model rounded-tooltip" />
          <p className="text-sm font-medium ml-1 mr-4">Model nodes</p>
        </button>
        {modelType !== null && (
          <button type="button" onClick={() => setModelType(null)} className="flex items-center">
            <div className="w-3 h-3 bg-model rounded-tooltip" />
            <p className="text-sm font-medium ml-1 mr-4">All nodes</p>
          </button>
        )}
      </div>
      <div
        className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-12
        gap-4 bg-white border-2 border-solid border-gray-200 rounded-lg h-full"
      >
        {/* <LineageGraph
          data={graph}
          events={events}
          networkOptions={networkOptions}
          overviewDataLoaded={overviewDataLoaded}
          showModelDetails={showModelDetails}
        /> */}

        <div className={showModelDetails ? 'col-span-8' : 'col-span-12'}>
          {overviewDataLoaded && <FlowGraph data={graph} />}
        </div>

        {showModelDetails && <ModelDetails />}
      </div>
    </>
  );
};

export default GraphView;
