import React, {
  MouseEvent as ReactMouseEvent, ReactElement, useCallback,
  useEffect, useRef, useState,
} from 'react';
import ReactFlow, {
  ConnectionLineType, Controls, Edge, Elements, getIncomers, getOutgoers,
  isEdge, isNode, Node, OnLoadParams, ReactFlowProvider,
  removeElements,
} from 'react-flow-renderer';
import { useLocation, useSearchParams } from 'react-router-dom';
import '../graph.css';
import { getLayoutElements } from '../utils';
import CustomNode from './CustomNode';

export interface FlowGraphProps {
  data: Elements;
  disableClick?: boolean;
  modelName?: string | null;
}

const nodeTypes = {
  'custom-node': CustomNode,
};

const findNodeInElement = (modelName: string | null, elements: Elements): Node | null => {
  if (modelName) {
    const node = elements.find((element) => isNode(element) && element.data.id === modelName);
    return node as Node;
  }
  return null;
};

function FlowGraph(params: FlowGraphProps): ReactElement {
  const { data, disableClick = false, modelName = null } = params;
  const instanceRef = useRef<OnLoadParams | null>(null);
  const [, setURLSearchParams] = useSearchParams();
  const { pathname } = useLocation();

  const { res, elementMapping } = getLayoutElements(data);
  const [elements, setElements] = useState<Elements>(res);

  const [searchParams] = useSearchParams();
  const model = searchParams.get('model') as string;
  const tab = searchParams.get('tab') as string;

  console.log('tab => ', tab);

  useEffect(() => {
    setElements(res);
  }, [data]);

  const onElementsRemove = (elementsToRemove: Elements) => {
    setElements((els) => removeElements(elementsToRemove, els));
  };

  const resetHighlight = (): void => {
    const values: Elements = [];

    for (let index = 0; index < elements.length; index++) {
      const element = elements[index];

      if (isNode(element)) {
        values.push({
          ...element,
          style: {
            ...element.style,
            opacity: 1,
          },
          // data: {
          //   ...element.data,
          //   active: false,
          // },
        });
      }
      if (isEdge(element)) {
        values.push({
          ...element,
          animated: false,
        });
      }
    }

    setElements(values);
  };

  const highlightPath = (node: Node, check: boolean): void => {
    const checkElements = check ? res : elements;

    const incomerIds = new Set([...getIncomers(node, checkElements).map((i) => i.id)]);
    const outgoerIds = new Set([...getOutgoers(node, checkElements).map((o) => o.id)]);

    const values: Elements = [];
    for (let index = 0; index < checkElements.length; index++) {
      const element = checkElements[index];
      let highlight = false;
      if (isNode(element)) {
        highlight = element.id === node.id
          || incomerIds.has(element.id)
          || outgoerIds.has(element.id);
      } else {
        highlight = element.source === node.id || element.target === node.id;
        const animated = incomerIds.has(element.source)
        && (incomerIds.has(element.target) || node.id === element.target);

        highlight = highlight || animated;
      }

      if (isNode(element)) {
        values.push({
          ...element,
          style: {
            ...element.style,
            opacity: highlight ? 1 : 0.25,
          },
          data: {
            ...element.data,
            active: element.id === node.id,
          },
        });
      }
      if (isEdge(element)) {
        values.push({
          ...element,
          animated: highlight,
        });
      }
    }

    setElements(values);
  };

  const fitElements = (): void => {
    setTimeout(() => {
      instanceRef?.current?.fitView();
    }, 1);
  };

  const onLoad = (reactFlowInstance: OnLoadParams<unknown> | null) => {
    instanceRef.current = reactFlowInstance;
    fitElements();
  };

  useEffect(() => {
    if (model) {
      const node = findNodeInElement(model, res);
      if (node) {
        resetHighlight(); // new changes to the graph
        highlightPath(node, !!modelName);
      }
    }
  }, [model, modelName, tab]);

  useEffect(() => {
    if (instanceRef.current && modelName) {
      // instanceRef.current.fitView();
      fitElements();
    }
  }, [instanceRef, modelName]);

  // useEffect(() => {
  //   if (instanceRef.current) {
  //     fitElements();
  //   }
  // }, [instanceRef, elements]);

  const onPaneClick = useCallback(() => {
    if (!disableClick) {
      resetHighlight();
      setURLSearchParams({});
    }
  }, []);

  const onNodeDragStop = (_: ReactMouseEvent, node: Node) => {
    const nodePosition = elementMapping[node.data?.id];
    const values: Elements = [
      ...elements,
    ];
    values[nodePosition] = node;

    setElements(values);
  };

  if (pathname === '/tables' && !modelName) {
    return <div className="layoutFlow" />;
  }

  return (
    <div className="layoutFlow">
      {console.log('elements => ', elements)}
      <ReactFlowProvider>
        <ReactFlow
          elements={elements}
          onLoad={onLoad}
          snapToGrid
          snapGrid={[15, 15]}
          zoomOnScroll={false}
          onPaneClick={onPaneClick}
          onElementClick={(_: ReactMouseEvent, element: Node | Edge): void => {
            if (!disableClick && isNode(element)) {
              resetHighlight();
              highlightPath(element, false);
              setURLSearchParams({ model: element.data.id });
            }
          }}
          onNodeDragStop={onNodeDragStop}
          onElementsRemove={onElementsRemove}
          connectionLineType={ConnectionLineType.SmoothStep}
          nodeTypes={nodeTypes}
        >
          <Controls />
        </ReactFlow>
      </ReactFlowProvider>
    </div>
  );
}

export default FlowGraph;
