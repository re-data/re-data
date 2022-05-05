import React, { ReactElement, useContext } from 'react';
import {
  BiCodeCurly,
  BiNetworkChart,
  BsGithub,
  BsSlack,
  ImNotification,
  SiReadthedocs,
  SiSpeedtest,
  VscTable,
} from 'react-icons/all';
import { NavLink } from 'react-router-dom';
import {
  OverviewData,
  RedataOverviewContext,
} from '../contexts/redataOverviewContext';

const Sidebar: React.FC = (): ReactElement => {
  const overview: OverviewData = useContext(RedataOverviewContext);

  const { metaData } = overview;
  const projectVersion = metaData?.version || '';
  const generatedAt = metaData?.generated_at || '';

  return (
    <aside
      id="sidebar"
      className="bg-gray-800 text-gray-100 md:w-32 w-3/4 min-w-min space-y-6 pt-6 px-0 absolute inset-y-0 left-0
                transform md:relative md:translate-x-0 transition duration-200 ease-in-out  md:flex
                 md:flex-col md:justify-between max-h-screen overflow-y-auto"
      data-dev-hint="sidebar; px-0 for frameless; px-2 for visually inset the navigation"
    >
      <div
        className="flex flex-col space-y-6"
        data-dev-hint="optional div for having an extra footer navigation"
      >
        <a
          href="#/alerts"
          className="text-white flex items-center space-x-2 px-8"
          title="Your App is cool"
        >
          <span className="text-2xl font-extrabold whitespace-nowrap truncate">
            <svg
              className="w-14"
              viewBox="0 0 1001 1001"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M500.334 0.078125H500.332C224.19 0.078125 0.332031 223.936 0.332031 500.078V500.08C0.332031 776.222 224.19 1000.08 500.332 1000.08H500.334C776.476 1000.08 1000.33 776.222 1000.33 500.08V500.078C1000.33 223.936 776.476 0.078125 500.334 0.078125Z"
                fill="#4A35A5"
              />
              <path
                d="M385.081 331.867C362.768 332.018 340.832 337.643 321.198 348.247V331.869H247.207V663.656H321.208V469.755L321.201 469.742C321.201 457.106 324.948 444.754 331.968 434.248C338.988 423.742 348.966 415.554 360.64 410.719C372.314 405.884 385.16 404.619 397.553 407.085C409.945 409.55 421.329 415.635 430.263 424.571L482.58 372.246C469.79 359.425 454.592 349.258 437.86 342.329C421.128 335.399 403.191 331.844 385.081 331.867V331.867Z"
                fill="white"
              />
              <path
                d="M801.181 496.964C801.056 484.543 799.569 472.174 796.749 460.078L796.735 459.968H796.714C788.267 423.153 767.817 390.192 738.582 366.275C709.347 342.358 672.989 328.842 635.23 327.855C597.471 326.868 560.457 338.467 530.013 360.824C499.569 383.182 477.425 415.029 467.066 451.353C456.708 487.676 458.723 526.413 472.795 561.466C486.867 596.518 512.197 625.896 544.797 644.973C577.396 664.051 615.415 671.745 652.867 666.845C690.32 661.945 725.079 644.729 751.674 617.907L698.183 564.423C683.911 578.885 665.375 588.385 645.301 591.525C625.227 594.665 604.675 591.279 586.669 581.866C568.663 572.453 554.154 557.509 545.276 539.233C536.397 520.958 533.619 500.315 537.349 480.343C541.079 460.37 551.121 442.122 565.997 428.283C580.874 414.444 599.799 405.744 619.988 403.465C640.178 401.185 660.567 405.446 678.154 415.62C695.741 425.793 709.599 441.343 717.689 459.982L588.459 534.595H797.027C799.78 522.505 801.202 510.15 801.267 497.751L801.17 496.964H801.181Z"
                fill="white"
              />
            </svg>
          </span>
        </a>

        <nav data-dev-hint="main navigation">
          <NavLink
            to="alerts"
            className={({ isActive }) => (isActive ? 'navlink active' : 'navlink')}
          >
            <ImNotification size="1.25em" />
            <span>Alerts</span>
          </NavLink>

          <NavLink
            to="graph"
            className={({ isActive }) => (isActive ? 'navlink active' : 'navlink')}
          >
            <BiNetworkChart size="1.25em" />
            <span>Lineage</span>
          </NavLink>

          <NavLink
            to="tests"
            className={({ isActive }) => (isActive ? 'navlink active' : 'navlink')}
          >
            <SiSpeedtest size="1.25em" />
            <span>Tests</span>
          </NavLink>

          <NavLink
            to="tables"
            className={({ isActive }) => (isActive ? 'navlink active disabled' : 'navlink')}
          >
            <VscTable size="1.25em" />
            <span>Tables</span>
          </NavLink>

          <NavLink
            to="macros"
            className={({ isActive }) => (isActive ? 'navlink active' : 'navlink')}
          >
            <BiCodeCurly size="1.25em" />
            <span>Macros</span>
          </NavLink>
        </nav>
      </div>

      <nav data-dev-hint="second-main-navigation or footer navigation">
        <a
          href="https://github.com/re-data/re-data"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center space-x-2 mb-3 py-2 px-4 transition duration-200 hover:bg-gray-700 hover:text-white"
        >
          <BsGithub size="1.25em" />
          <div>GitHub</div>
        </a>
        <a
          href="https://www.getre.io/slack"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center space-x-2 mb-3 py-2 px-4 transition duration-200 hover:bg-gray-700 hover:text-white"
        >
          <BsSlack size="1.25em" />
          <div>Join!</div>
        </a>
        <a
          href="https://docs.getre.io/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center space-x-2 mb-3 py-2 px-4 transition duration-200 hover:bg-gray-700 hover:text-white"
        >
          <SiReadthedocs size="1.25em" />
          <span>Docs</span>
        </a>

        <div className="flex flex-col py-2 px-4 transition duration-200 hover:bg-gray-700 hover:text-white">
          <span className="text-xs">
            version
            {' '}
            <span className="text-xs italic">{projectVersion}</span>
          </span>
          <span className="text-xs mt-2">
            generated at
            {' '}
            <span className="text-xs italic">
              {generatedAt}
              {' '}
              UTC
            </span>
          </span>
        </div>
      </nav>
    </aside>
  );
};

export default Sidebar;
