/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { FC, memo } from 'react';
import { Handle, NodeProps, Position } from 'react-flow-renderer';

const labelStyle = {
  display: 'flex',
  alignItems: 'center',
  // border: '1px solid red',
  fontWeight: 'bold',
  fontSize: '13px',
};

const labelActiveStyle = {
  display: 'flex',
  alignItems: 'center',
  // border: '1px solid red',
  fontWeight: 'bold',
  fontSize: '13px',
};

const subTitleStyle = {
  fontSize: '9px',
  fontStyle: 'italic',
};

const subTitleActiveStyle = {
  fontSize: '9px',
  fontStyle: 'italic',
};

const schemaChangesDotStyle = {
  width: '8px',
  height: '8px',
  borderRadius: '8px',
  backgroundColor: 'rgba(252, 211, 77, 1)',
  position: 'absolute' as any,
  top: '-5px',
  marginLeft: '18px',
};

// TODO: set active and in-active styles for this
const anomaliesDotStyle = {
  width: '8px',
  height: '8px',
  borderRadius: '8px',
  backgroundColor: 'rgba(220, 38, 38, 1)',
  position: 'absolute' as any,
  top: '0px',
  marginLeft: '6px',
};

const nodeStyle = {
  padding: '4px 12px 7px',
  borderRadius: 4,
  overflow: 'hidden',
};

const CustomNode: FC<NodeProps> = (props: NodeProps) => {
  const {
    data: {
      label, otherName, active,
      borderColor, anomalies, schemaChanges,
    },
  } = props;

  const containerStyle = {
    border: `2px solid ${borderColor}`,
    cursor: 'pointer',
    position: 'relative' as any,
    backgroundColor: 'white',
    borderRadius: '4px',
    // overflow: 'hidden',
  };

  const containerActiveStyle = {
    backgroundColor: '#392396',
    border: '2px solid #392396',
    color: 'white',
    borderRadius: '4px',
    overflow: 'hidden',
  };

  // console.log('props io -> ', props);
  return (
    <div style={active ? containerActiveStyle : containerStyle}>
      {/* <div style={containerStyle}> */}
      <div style={nodeStyle}>
        <Handle type="target" position={Position.Left} />
        <div style={active ? labelActiveStyle : labelStyle}>
          {label}
        </div>
        <div style={active ? subTitleActiveStyle : subTitleStyle}>
          {otherName}
        </div>
        <Handle type="source" position={Position.Right} />
      </div>
      {anomalies && <div style={anomaliesDotStyle} />}
      {schemaChanges && <div style={schemaChangesDotStyle} />}
    </div>
  );
};

export default memo(CustomNode);
