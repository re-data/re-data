import React, { FC, memo } from 'react';
import { Handle, NodeProps, Position } from 'react-flow-renderer';
import '../styles/custom-nodes.css';

const CustomNode: FC<NodeProps> = (props: NodeProps) => {
  const {
    data: {
      label, otherName, active,
      borderColor, anomalies, schemaChanges,
    },
  } = props;

  const containerStyle = {
    border: `2px solid ${borderColor}`,
  };
  return (
    <div
      style={active ? {} : containerStyle}
      className={active ? 'container-active' : 'container'}
    >
      <div className="node">
        <Handle type="target" position={Position.Left} />
        <div className="label">
          {label}
        </div>
        <div className="subtitles">
          {otherName}
        </div>
        <Handle type="source" position={Position.Right} />
      </div>
      {anomalies && <div className={active ? 'anomalies-dot-active' : 'anomalies-dot'} />}
      {schemaChanges && <div className={active ? 'schema-dot-active' : 'schema-dot'} />}
    </div>
  );
};

export default memo(CustomNode);
