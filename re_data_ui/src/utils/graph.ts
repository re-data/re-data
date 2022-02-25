/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-param-reassign */
/* eslint-disable @typescript-eslint/no-explicit-any */
import dagre from 'dagre';
import {
  ArrowHeadType, Elements, isNode, Position,
} from 'react-flow-renderer';

type formatDataProps = {
  nodes: { [s: string]: unknown; } | ArrayLike<unknown>;
  edges: { [s: string]: unknown; } | ArrayLike<unknown>;
}

type Dictionary = {
  [key: string]: string
}

function formatData(params: formatDataProps): Elements {
  const elements: Elements = [];
  const elementObj: Dictionary = {};
  // let index = 0;

  Object.entries(params.nodes).forEach(([key, value]: any) => {
    // console.log("key -> ", key);
    // console.log("value -> ", value);
    // index++;

    const {
      id,
      label,
      anomalies,
      schemaChanges,
      isMonitored,
      color: { background },
    } = value;
    elementObj[id] = key;
    // console.log('elementObj -> ', elementObj);
    const otherName = id.replace(`.${label}`, '');
    // console.log(id, label)
    const result = {
      id: key,
      key: id,
      type: 'custom-node',
      data: {
        id,
        label,
        otherName,
        anomalies,
        isMonitored,
        schemaChanges,
        borderColor: background,
      },
      position: {
        x: 100,
        y: 50 * +key,
      },
    };
    elements.push(result);
    // console.log("result -> ", result);
  });

  Object.entries(params.edges).forEach(([_, value]: any) => {
    // console.log("key -> ", key);
    // console.log("value -> ", value);
    // index++;

    const { from, to } = value;
    const source = elementObj[from];
    const target = elementObj[to];

    // console.log('source -> ', source);
    // console.log('target -> ', target);

    if (source && target) {
      const id = `e${source}-${target}`;

      elements.push({
        id,
        source,
        target,
        arrowHeadType: ArrowHeadType.ArrowClosed,
      // animated: true
      });
    }

    // console.log("elementObj -> ", elementObj);
  });

  return elements;
}

const DEFAULT_WIDTH = 172;
const DEFAULT_HEIGHT = 36;

const dagreGraph = new dagre.graphlib.Graph();
dagreGraph.setDefaultEdgeLabel(() => ({}));

const getLayoutElements = (elements: any[], direction = 'LR'): any => {
  const isHorizontal = direction === 'LR';
  dagreGraph.setGraph({ rankdir: direction });

  elements.forEach((el: any) => {
    if (isNode(el)) {
      dagreGraph.setNode(el.id, {
        width: DEFAULT_WIDTH,
        height: DEFAULT_HEIGHT,
      });
    } else {
      dagreGraph.setEdge(el.source, el.target);
    }
  });

  dagre.layout(dagreGraph);

  return elements.map((el: any) => {
    if (isNode(el)) {
      const nodeWithPosition = dagreGraph.node(el.id);
      el.targetPosition = isHorizontal ? Position.Left : Position.Top;
      el.sourcePosition = isHorizontal ? Position.Right : Position.Bottom;

      el.position = {
        x: nodeWithPosition.x - DEFAULT_WIDTH / 2 + Math.random() / 1000,
        y: nodeWithPosition.y - DEFAULT_HEIGHT / 2,
      };
    }

    return el;
  });
};

const resourceTypeColors: Dictionary = {
  source: 'hsl(97deg 66% 44%)',
  model: 'hsl(190deg 100% 35%)',
  seed: 'hsl(150deg 66% 44%)',
};

const generateNode = ({
  modelId, index, isMonitored,
  details, anomalies, schemaChanges,
}: any): any => ({
  // key: index.toString(),
  // id: modelId,
  key: modelId,
  id: index.toString(),
  type: 'custom-node',
  label: details.name,
  shape: 'box',
  anomalies,
  schemaChanges,
  color: {
    background: resourceTypeColors[details.resource_type],
  },
  data: {
    id: modelId,
    label: details.name,
    otherName: modelId.replace(`.${details.name}`, ''),
    anomalies,
    isMonitored,
    schemaChanges,
    borderColor: resourceTypeColors[details.resource_type],
  },
});

const generateEdge = ({ obj, from, to }: any) => {
  const source = obj?.[from];
  const target = obj?.[to];

  // console.log('source', source);
  // console.log('target', target);

  const id = `e${source}-${target}`;
  return ({
    id,
    source,
    target,
    arrowHeadType: ArrowHeadType.ArrowClosed,
  });
};

export {
  generateEdge,
  generateNode,
  formatData,
  getLayoutElements,
};
