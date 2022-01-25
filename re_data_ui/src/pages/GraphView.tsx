import React, { ReactElement, useContext } from 'react';
import { useSearchParams } from 'react-router-dom';
import { NodeOptions, Options } from 'vis';
import LineageGraph from '../components/LineageGraph';
import ModelDetails from '../components/ModelDetails';
import {
  DbtNode, DbtSource, OverviewData, RedataOverviewContext,
} from '../contexts/redataOverviewContext';
import './GraphView.css';

interface VisPointer {
  x: number,
  y: number
}

interface VisNode extends NodeOptions {
  id: string | number,
  shape: string;
}

interface VisEdge {
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

const supportedResourcesTypes = new Set(['source', 'model', 'seed']);

const generateGraph = (overview: OverviewData) => {
  const graph: IGraph = {
    nodes: [],
    edges: [],
  };
  if (!overview.graph) {
    return graph;
  }
  const dbtNodes = overview.graph.nodes;
  const dbtSources = overview.graph.sources;

  const allNodes = { ...dbtNodes, ...dbtSources };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  Object.entries(allNodes).forEach(([_, details]) => {
    if (supportedResourcesTypes.has(details.resource_type) && details.package_name !== 're_data') {
      const modelId = `${details.database}.${details.schema}.${details.name}`.toLowerCase();
      const node: VisNode = {
        id: modelId,
        label: details.name,
        shape: 'box',
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
            const parentModelId = `${parentNode.database}.${parentNode.schema}.${parentNode.name}`.toLowerCase();
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
  });

  return graph;
};

const GraphView: React.FC = (): ReactElement => {
  const overview: OverviewData = useContext(RedataOverviewContext);
  // if graph is not null, then we have fetched the overview json file
  const overviewDataLoaded = !!overview.graph;
  const graph = generateGraph(overview);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_, setURLSearchParams] = useSearchParams();
  const data: IGraph = {
    nodes: graph.nodes,
    edges: graph.edges,
  };
  const events = {
    selectNode: (params: VisNetworkEventParams) => {
      if (!params.nodes || params.nodes.length !== 1) {
        // only select a single node
        return;
      }
      const modelIdentifier = params.nodes[0];
      setURLSearchParams({
        model: modelIdentifier,
      });
    },
    deselectNode: () => {
      setURLSearchParams({});
    },
  };
  const networkOptions: Options = {
    height: '100%',
    width: '100%',
    edges: {
      color: {
        color: '#6F798B70',
        highlight: '#6F798B70',
        hover: '#6F798B70',
        inherit: true,
      },
      dashes: false,
      smooth: true,
    },
    nodes: {
      color: {
        border: 'transparent',
        highlight: '#392396',
        hover: {
          border: 'transparent',
          background: '#503d9d',
        },
      },
      font: {
        color: '#ffffff',
        size: 22,
      },
      margin: {
        top: 7,
        left: 14,
        right: 14,
        bottom: 7,
      },
    },
    layout: {
      hierarchical: {
        enabled: true,
        levelSeparation: 485,
        nodeSpacing: 50,
        treeSpacing: 50,
        blockShifting: false,
        edgeMinimization: true,
        parentCentralization: false,
        direction: 'LR',
        sortMethod: 'directed',
      },
    },
    interaction: {
      hover: true,
      navigationButtons: false,
      multiselect: true,
      keyboard: {
        enabled: true,
      },
    },
    physics: {
      enabled: false,
      hierarchicalRepulsion: { centralGravity: 0 },
      minVelocity: 0.75,
      solver: 'hierarchicalRepulsion',
    },
  };

  return (
    <div className="h-full">
      <h1 className="mb-3 text-2xl font-semibold">Graph</h1>

      <div className="flex items-center absolute mt-4 ml-4">
        <>
          <div className="w-3 h-3 bg-source rounded-tooltip" />
          <p className="text-sm font-medium ml-1 mr-4">Source node</p>
        </>
        <>
          <div className="w-3 h-3 bg-seed rounded-tooltip" />
          <p className="text-sm font-medium ml-1 mr-4">Seed node</p>
        </>
        <>
          <div className="w-3 h-3 bg-model rounded-tooltip" />
          <p className="text-sm font-medium ml-1 mr-4">Model node</p>
        </>
      </div>
      <div
        className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-12
        gap-4 bg-white border-2 border-solid border-gray-200 rounded-lg h-full"
      >
        <LineageGraph
          data={data}
          events={events}
          networkOptions={networkOptions}
          overviewDataLoaded={overviewDataLoaded}
        />
        <ModelDetails />
      </div>
    </div>
  );
};

export default GraphView;
