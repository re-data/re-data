import React, {
  MouseEvent as ReactMouseEvent, ReactElement, useCallback,
  useEffect, useRef, useState,
} from 'react';
import ReactFlow, {
  ConnectionLineType, Controls, Edge, Elements, getIncomers, getOutgoers,
  isEdge, isNode, Node, OnLoadParams, ReactFlowProvider,
  removeElements,
} from 'react-flow-renderer';
import { useSearchParams } from 'react-router-dom';
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

  const res = getLayoutElements(data);
  const [elements, setElements] = useState<Elements>(res);

  const [searchParams] = useSearchParams();
  const model = searchParams.get('model') as string;

  useEffect(() => {
    setElements(res);
  }, [data]);

  const onElementsRemove = (elementsToRemove: Elements) => {
    setElements((els) => removeElements(elementsToRemove, els));
  };

  const resetHighlight = (): void => {
    const instanceElement = instanceRef?.current?.getElements();
    if (instanceElement) {
      const values = instanceElement.map((elem) => {
        const element = elem;
        if (isNode(element)) {
          element.style = {
            ...element.style,
            opacity: 1,
          };
          element.data = {
            ...element.data,
            active: false,
          };
        }
        if (isEdge(element)) {
          element.animated = false;
        }
        return element;
      });

      setElements(values);
    }
  };

  const highlightPath = (node: Node, selection: boolean): void => {
    const instanceElement = instanceRef?.current?.getElements();

    if (node && instanceElement) {
      const incomerIds = new Set([...getIncomers(node, instanceElement).map((i) => i.id)]);
      const outgoerIds = new Set([...getOutgoers(node, instanceElement).map((o) => o.id)]);

      const values = instanceElement?.map((elem) => {
        const element = elem;

        if (isNode(element)) {
          const highlight = element.id === node.id
              || incomerIds.has(element.id)
            || outgoerIds.has(element.id);

          if (node.id === element.id) {
            element.style = {
              ...element.style,
              opacity: highlight ? 1 : 0.25,
            };
            element.data = {
              ...element.data,
              active: true,
            };
          } else {
            element.style = {
              ...element.style,
              opacity: highlight ? 1 : 0.25,
            };
            element.data = {
              ...element.data,
              active: false,
            };
          }
        }

        if (isEdge(element)) {
          const highlight = element.source === node.id || element.target === node.id;
          const animated = incomerIds.has(element.source)
              && (incomerIds.has(element.target) || node.id === element.target);

          if (selection && (animated || highlight)) {
            element.animated = true;
          } else {
            element.animated = false;
          }
        }

        return element;
      });
      setElements(values);
    }
  };

  const onLoad = (reactFlowInstance: OnLoadParams<unknown> | null) => {
    instanceRef.current = reactFlowInstance;
    reactFlowInstance?.fitView();

    if (model) {
      const node = findNodeInElement(model, elements);
      if (node) {
        resetHighlight();
        highlightPath(node, true);
      }
    }
  };

  useEffect(() => {
    if (instanceRef.current && modelName) {
      instanceRef.current.fitView();
    }
  }, [instanceRef, modelName]);

  // useEffect(() => {
  //   if (instanceRef.current) {
  //     instanceRef.current.fitView();
  //   }
  // }, [instanceRef, elements]);

  const onPaneClick = useCallback(() => {
    if (!disableClick) {
      resetHighlight();
      setURLSearchParams({});

      resetHighlight();
    }
  }, []);

  return (
    <div className="layoutFlow">
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
              highlightPath(element, true);
              setURLSearchParams({ model: element.data.id });
            }
          }}
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
