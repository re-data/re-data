import React, { ReactElement } from 'react';
import { GraphPartial } from '../partials';

const GraphView: React.FC = (): ReactElement => (
  <div className="h-full relative">
    <h1 className="mb-3 text-2xl font-semibold">Lineage</h1>

    <GraphPartial />
  </div>
);

export default GraphView;
