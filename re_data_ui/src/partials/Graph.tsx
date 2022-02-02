import React, { ReactElement, useContext } from 'react';
import { useSearchParams } from 'react-router-dom';
import { NodeOptions, Options } from 'vis';
import LineageGraph from '../components/LineageGraph';
import ModelDetails from '../components/ModelDetails';
import {
  DbtNode, DbtSource, OverviewData, RedataOverviewContext,
} from '../contexts/redataOverviewContext';
import { supportedResTypes, generateModelId } from '../utils';

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

const generateGraph = (overview: OverviewData, modelName?: string | null) => {
  const graph: IGraph = {
    nodes: [],
    edges: [],
  };
  if (!overview.graph) {
    return graph;
  }
  const { dbtNodeIdMapping } = overview;
  const dbtNodes = overview.graph.nodes;
  const dbtSources = overview.graph.sources;

  const allNodes = { ...dbtNodes, ...dbtSources };

  if (modelName) {
    const { parent_map: parentNodes, child_map: childNodes } = overview.graph;
    const modelTitle = dbtNodeIdMapping[modelName];

    // get all the parents and the child nodes of the model name;
    const modelParentNodes = parentNodes[modelTitle] || [];
    const modelChildNodes = childNodes[modelTitle] || [];

    // draw the model node
    // draw the parent nodes and connect it to the node using an edge
    // draw the child nodes and connect it to the node using an edge

    const details = allNodes[modelTitle];
    const modelId = generateModelId(details);
    graph.nodes.push({
      id: modelId,
      label: details.name,
      shape: 'box',
      color: resourceTypeColors[details.resource_type],
    });

    modelParentNodes.forEach((parent) => {
      const parentDetails = allNodes[parent];
      const { name, resource_type: resourceType } = parentDetails;
      if (supportedResTypes.has(resourceType)) {
        const parentModelId = generateModelId(parentDetails);
        graph.nodes.push({
          id: parentModelId,
          label: name,
          shape: 'box',
          color: resourceTypeColors[resourceType],
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
          color: resourceTypeColors[resourceType],
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
    Object.entries(allNodes).forEach(([, details]) => {
      if (supportedResTypes.has(details.resource_type) && details.package_name !== 're_data') {
        const modelId = generateModelId(details);
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
    });
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
  const [, setURLSearchParams] = useSearchParams();

  const graph = modelName
    ? generateGraph(overview, modelName)
    : generateGraph(overview);

  const events = {
    selectNode: (params: VisNetworkEventParams) => {
      if (showModelDetails) {
        if (!params.nodes || params.nodes.length !== 1) {
        // only select a single node
          return;
        }
        const modelIdentifier = params.nodes[0];
        setURLSearchParams({
          model: modelIdentifier,
        });
      }
    },
    deselectNode: () => {
      if (showModelDetails) {
        setURLSearchParams({});
      }
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
      multiselect: false,
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
    <>
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
          data={graph}
          events={events}
          networkOptions={networkOptions}
          overviewDataLoaded={overviewDataLoaded}
          showModelDetails={showModelDetails}
        />

        {showModelDetails && <ModelDetails />}
      </div>
    </>
  );
};

export default GraphView;
