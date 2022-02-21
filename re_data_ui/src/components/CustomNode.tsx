/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { FC, memo } from 'react';
import { Handle, NodeProps, Position } from 'react-flow-renderer';

const labelStyle = {
  display: 'flex',
  alignItems: 'center',
  // border: '1px solid red',
  fontWeight: 'bold',
  fontSize: '14px',
};

const subTitleStyle = {
  fontSize: '10px',
  fontStyle: 'italic',
};

const dotStyle = {
  width: '8px',
  height: '8px',
  borderRadius: '8px',
  backgroundColor: 'red',
  position: 'absolute' as any,
  top: '-4px',
  marginLeft: '5px',
};

const nodeStyle = {
  // border: '1px solid red',
  padding: '4px 12px',
  borderRadius: 4,
  overflow: 'hidden',
};

const containerStyle = {
  // border: '1px solid red',
  position: 'relative' as any,
};

const CustomNode: FC<NodeProps> = (props: NodeProps) => {
  console.log('props -> ', props);
  const {
    data: {
      label, otherName, isMonitored,
    },
  } = props;
  return (
    <div style={containerStyle}>
      <div style={nodeStyle}>
        <Handle type="target" position={Position.Left} />
        <div style={labelStyle}>
          {label}
        </div>
        <div style={subTitleStyle}>
          {otherName}
        </div>
        <Handle type="source" position={Position.Right} />
      </div>
      {isMonitored && <div style={dotStyle} />}
    </div>
  );
};

export default memo(CustomNode);
