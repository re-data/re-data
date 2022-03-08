import React, { FC, memo } from 'react';
import { Handle, NodeProps, Position } from 'react-flow-renderer';
import '../styles/custom-nodes.css';
import { useNavigate, useLocation } from 'react-router-dom';

const CustomNode: FC<NodeProps> = (props: NodeProps) => {
  const { pathname } = useLocation();

  const navigate = useNavigate();
  const {
    data: {
      label, otherName, active, id,
      borderColor, anomalies, schemaChanges,
    },
  } = props;

  const containerStyle = {
    border: `2px solid ${borderColor}`,
  };

  const details = () => {
    console.log('Unable');
    navigate(`/tables?model=${id}`);
  };

  return (
    <div
      style={active ? {} : containerStyle}
      className={active ? 'container-active' : 'container'}
    >
      <div className="node">
        <Handle type="target" position={Position.Left} />
        <div className="border border-red-600">
          <div className="label">{label}</div>
          <div className="subtitles">
            {otherName}
          </div>
        </div>

        {active && (
          <>
            {pathname === '/tables' ? null : (
              <button
                type="button"
                onClick={() => console.log('here')}
                // onClick={details}
                className="border border-red-600 flex items-center"
                style={{ height: '35px' }}
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

      {anomalies && <div className={active ? 'anomalies-dot-active' : 'anomalies-dot'} />}
      {schemaChanges && <div className={active ? 'schema-dot-active' : 'schema-dot'} />}
    </div>
  );
};

export default memo(CustomNode);
