import React, { ReactElement, useContext } from 'react';
import './GraphView.css';
import { useSearchParams } from 'react-router-dom';
import { Options } from 'vis';
import LineageGraph from '../components/LineageGraph';
import ModelDetails from '../components/ModelDetails';
import {
  DbtNode, DbtSource, OverviewData, RedataOverviewContext,
} from '../contexts/redataOverviewContext';

interface VisPointer {
  x: number,
  y: number
}

interface VisNode {
  id: string | number,
  label: string | number;
  shape: string;
}

interface VisEdge {
  from: string | number,
  to: string | number;
  arrows: string;
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

  Object.entries(dbtNodes).forEach(([model, details]) => {
    const [resource, packageName, modelName] = model.split('.');
    if (resource !== 'test' && packageName !== 're_data') {
      const modelId = `${details.database}.${details.schema}.${details.name}`.toLowerCase();
      const node: VisNode = {
        id: modelId,
        label: modelName,
        shape: 'box',
      };
      graph.nodes.push(node);

      const parentNodes = new Set(details.depends_on.nodes);
      parentNodes.forEach((parent) => {
        const parentNode: DbtNode | DbtSource = dbtNodes[parent]
          ? dbtNodes[parent]
          : dbtSources[parent];
        if (parentNode) {
          // in coming edge only if parent node exists
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
        color: '#8884d8',
        highlight: '#8884d8',
        hover: '#8884d8',
        inherit: false,
      },
      dashes: false,
      smooth: true,
    },
    nodes: {
      color: {
        border: '#8884d8',
        background: '#8884d8',
        highlight: '#392396',
        hover: {
          border: '#392396',
          background: '#8884d8',
        },
      },
      // "color": "#8884d8",
      font: {
        color: '#ffffff',
      },
    },
    layout: {
      hierarchical: {
        enabled: true,
        levelSeparation: 485,
        nodeSpacing: 50,
        treeSpacing: 35,
        blockShifting: false,
        edgeMinimization: true,
        parentCentralization: false,
        direction: 'LR',
        sortMethod: 'directed',
      },
    },
    interaction: {
      hover: true, navigationButtons: false, multiselect: true, keyboard: { enabled: true },
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
      <div
        className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-12
             gap-4 border-2 border-solid border-gray-200
              rounded-lg h-full"
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
