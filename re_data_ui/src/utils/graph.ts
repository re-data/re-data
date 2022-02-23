/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-param-reassign */
/* eslint-disable @typescript-eslint/no-explicit-any */
import dagre from 'dagre';
import { isNode, Position } from 'react-flow-renderer';

type formatDataProps = {
  nodes: { [s: string]: unknown; } | ArrayLike<unknown>;
  edges: { [s: string]: unknown; } | ArrayLike<unknown>;
}

function formatData(params: formatDataProps): any {
  const elements: any = [];
  const elementObj: any = {};
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

    if (source && target) {
      const id = `e${source}-${target}`;

      elements.push({
        id,
        source,
        target,
        arrowHeadType: 'arrowclosed',
      // animated: true
      });
    }

    // console.log("elementObj -> ", elementObj);
  });

  return elements;
}

const nodeWidth = 172;
const nodeHeight = 36;

const dagreGraph = new dagre.graphlib.Graph();
dagreGraph.setDefaultEdgeLabel(() => ({}));

const getLayoutElements = (elements: any[], direction = 'LR'): any => {
  const isHorizontal = direction === 'LR';
  dagreGraph.setGraph({ rankdir: direction });

  elements.forEach((el: any) => {
    if (isNode(el)) {
      dagreGraph.setNode(el.id, { width: nodeWidth, height: nodeHeight });
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

      // unfortunately we need this little hack to pass a slightly different position
      // to notify react flow about the change. Moreover we are shifting the dagre node position
      // (anchor=center center) to the top left so it matches the react
      //    flow node anchor point(top left).
      // width: el.__rf?.width ?? DEFAULT_WIDTH,
      // height: el.__rf?.height ?? DEFAULT_HEIGHT

      el.position = {
        x: nodeWithPosition.x - nodeWidth / 2 + Math.random() / 1000,
        y: nodeWithPosition.y - nodeHeight / 2,
      };
    }

    return el;
  });
};

export { formatData, getLayoutElements };
