import React, { ReactElement } from 'react';
import { TestsPartial } from '../partials';

const Tests: React.FC = (): ReactElement => (
  <>
    <h1 className="mb-3 text-2xl font-semibold">Tests</h1>
    <TestsPartial
      showRunAt={false}
      showModel
    />
  </>
);

export default Tests;
