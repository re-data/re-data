import React, { ReactElement } from 'react';
import './App.css';
import { Outlet } from 'react-router-dom';

const App: React.FC = (): ReactElement => (
  <Outlet />
);

export default App;
