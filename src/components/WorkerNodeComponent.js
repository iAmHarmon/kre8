import React from 'react';
import { Group } from '@vx/group';


const WorkerNodeComponent = ({ node, top, left, showNodeInfo }) => {
  const peach = '#fd9b93';
  const pink = '#fe6e9e';
  const blue = '#03c0dc';
  const green = '#26deb0';
  const plum = '#71248e';
  const lightpurple = '#374469';
  const white = '#ffffff';
  const bg = '#272b4d';
  const height = 75;
  const width = 60;
  return (
    <Group top={top} left={left}>
      <circle
        r={25}
        fill={lightpurple}
        stroke="#3B6F89"
        strokeWidth="2"
        onClick={() => {
          showNodeInfo(node);
          console.log('from circle', node);
        }}
      />
      <text
        dy={'.33em'}
        fontSize={11}
        fontFamily="Arial"
        textAnchor={'middle'}
        style={{ pointerEvents: 'none' }}
        fill={'#71248e'}
      >
        {node.data.name}
      </text>
    </Group>
  );
}

export default WorkerNodeComponent;