import React, { FC, memo } from 'react';
import { Handle, NodeProps, Position } from 'react-flow-renderer';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import '../styles/custom-nodes.css';

const CustomNode: FC<NodeProps> = (props: NodeProps) => {
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const [searchParams] = useSearchParams();
  const model = searchParams.get('model') as string;

  const {
    data: {
      label, otherName, active, id, failedTests,
      borderColor, anomalies, schemaChanges,
    },
  } = props;

  const containerStyle = {
    border: `2px solid ${borderColor}`,
  };

  const details = () => navigate(`/tables?model=${id}`);

  const isActive = active || (model === id);

  return (
    <div
      style={isActive ? {} : containerStyle}
      className={isActive ? 'container-active' : 'container'}
    >
      <div className="node">
        <Handle type="target" position={Position.Left} />
        <div>
          <div className="label">{label}</div>
          <div className="subtitles">
            {otherName}
          </div>
        </div>

        {isActive && (
          <>
            {pathname === '/tables' ? null : (
              <button
                type="button"
                onClick={details}
                style={{ height: '35px' }}
                aria-label="details"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-2 pointer" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 9l3 3m0 0l-3 3m3-3H8m13 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </button>
            )}
          </>
        )}

        <Handle type="source" position={Position.Right} />
      </div>

      <div className={isActive ? 'dot-active-container' : 'dot-container'}>
        {anomalies && <div className="anomalies-dot" />}
        {schemaChanges && <div className="schema-dot" />}
        {failedTests && <div className="failed-dot" />}
      </div>
    </div>
  );
};

export default memo(CustomNode);
