/* eslint-disable comma-dangle */
/* eslint-disable array-callback-return */
/* eslint-disable no-param-reassign */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, {
  FC, ReactElement, useCallback,
  useEffect, useRef, useState, MouseEvent as ReactMouseEvent
} from 'react';
import ReactFlow, {
  ConnectionLineType, Controls, getIncomers,
  getOutgoers, isEdge, Elements,
  isNode, OnLoadParams, ReactFlowProvider, removeElements
} from 'react-flow-renderer';
import { useSearchParams } from 'react-router-dom';
import '../graph.css';
import { formatData, getLayoutElements } from '../utils';
import CustomNode from './CustomNode';

export interface Props {
  // data: any;
  data: Elements;
  disableClick?: boolean;
}

const nodeTypes = {
  'custom-node': CustomNode,
};

const FlowGraph: FC<Props> = ({ data, disableClick }: Props): ReactElement => {
  // console.log('data -> ', data);
  const instanceRef = useRef<OnLoadParams | null>(null);
  const [, setURLSearchParams] = useSearchParams();

  // const result = formatData(data);
  // const layoutElements = getLayoutElements(result);
  const res = getLayoutElements(data);
  // const res = getLayoutElements(formatData(data));

  console.log('result', res);
  // console.log('result', result, layoutElements);

  const [elements, setElements] = useState<Elements>(res);
  // setElements(res);

  useEffect(() => {
    // console.log('init loading');
    setElements(res);
  }, [data]);

  // console.log('elements ', elements, data, res);

  const onElementsRemove = (elementsToRemove: Elements) => {
    setElements((els) => removeElements(elementsToRemove, els));
  };

  const getAllIncomer = (node: any, el: Elements): Node[] => getIncomers(node, el).reduce(
    (memo: any, incomer: any) => [
      ...memo,
      incomer,
      ...getAllIncomer(incomer, elements),
    ],
    [],
  );

  const getAllOutgoer = (node: any, el: Elements): Node[] => getOutgoers(node, el).reduce(
    (memo: any, outgoer: any) => [
      ...memo,
      outgoer,
      ...getAllOutgoer(outgoer, el),
    ],
    [],
  );

  const removeHighlightPath = (): void => {
    const values = elements?.map((elem) => {
      if (isNode(elem)) {
        elem.style = {
          ...elem.style,
          opacity: 1,
        };
      }
      if (isEdge(elem)) {
        elem.animated = false;
      }
      return elem;
    });

    setElements(values);
  };

  const highlightPath = (node: any, selection: boolean): void => {
    if (node && elements) {
      const allIncomer = getAllIncomer(node, elements);
      const allOutgoer = getAllOutgoer(node, elements);

      setElements((prevElements) => prevElements?.map((elem) => {
        const incomerIds = allIncomer.map((i: any) => i.id);
        const outgoerIds = allOutgoer.map((o: any) => o.id);

        if (isNode(elem)) {
          const highlight = elem.id === node.id
              || incomerIds.includes(elem.id)
            || outgoerIds.includes(elem.id);

          // console.log('selected node -> ', node.id, elem.id);

          if (node.id === elem.id) {
            elem.style = {
              ...elem.style,
            };
            elem.data = {
              ...elem.data,
              active: true,
            };
          } else {
            elem.style = {
              ...elem.style,
              opacity: highlight ? 1 : 0.25,
            };
            elem.data = {
              ...elem.data,
              active: false,
            };
          }

          // console.log("node -> ", elem.style);
        }

        if (isEdge(elem)) {
          const highlight = elem.source === node.id || elem.target === node.id;
          const animated = incomerIds.includes(elem.source)
              && (incomerIds.includes(elem.target) || node.id === elem.target);

          // console.log(`highlight => ${highlight} - animated => ${animated}`);

          if (selection && (animated || highlight)) {
            elem.animated = true;
          } else {
            elem.animated = false;
          }
        }

        return elem;
      }));
    }
  };

  const onLoad = (reactFlowInstance: OnLoadParams<any> | null) => {
    instanceRef.current = reactFlowInstance;
    reactFlowInstance?.fitView();
  };

  // useEffect(() => {
  //   if (instanceRef.current) {
  //     instanceRef.current.fitView();
  //   }
  // }, [instanceRef, elements]);

  const onLayout = useCallback(
    (direction) => {
      const el = getLayoutElements(elements, direction);
      setElements(el);
    },
    [elements],
  );

  const onPaneClick = useCallback(() => {
    removeHighlightPath();
    setURLSearchParams({});
    const values = elements?.map((elem) => {
      if (isNode(elem)) {
        elem.style = {
          ...elem.style,
          opacity: 1,
        };
        elem.data = {
          ...elem.data,
          active: false,
        };
      }
      if (isEdge(elem)) {
        elem.animated = false;
      }
      return elem;
    });

    setElements(values);
  }, []);

  return (
    <>
      <div
        className="layoutflow"
        style={{
          width: '100%',
          marginTop: '2.5rem',
        }}
      >
        <ReactFlowProvider>
          <ReactFlow
            elements={elements}
            onLoad={onLoad}
            snapToGrid
            snapGrid={[15, 15]}
            zoomOnScroll={false} // to disable zoom on scroll
            // onConnect={onConnect}
            onPaneClick={onPaneClick}
            onElementClick={(_: ReactMouseEvent, element: any): void => {
              if (!disableClick && isNode(element)) {
                // console.log('element clicked', element);
                removeHighlightPath();
                highlightPath(element, true);
                setURLSearchParams({ model: element.data.id });
              }
            }}
            onElementsRemove={onElementsRemove}
            connectionLineType={ConnectionLineType.SmoothStep}
            // onNodeMouseEnter={removeHighlightPath}
            // onNodeMouseEnter={(_, node) => highlightPath(node, true)}
            // onNodeMouseLeave={removeHighlightPath}
            nodeTypes={nodeTypes}
          >
            <Controls />
            {/* <Background />
            <MiniMap /> */}
          </ReactFlow>
          <div className="controls">
            <button type="button" onClick={() => onLayout('TB')}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"
                />
              </svg>
            </button>
            <button type="button" onClick={() => onLayout('LR')}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
                />
              </svg>
            </button>
          </div>
        </ReactFlowProvider>
      </div>
    </>
  );
};

export default FlowGraph;
