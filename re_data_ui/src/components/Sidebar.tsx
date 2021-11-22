import React, {ReactElement} from "react";
import {Link} from 'react-router-dom';
import {BiNetworkChart, ImNotification, BsSlack, SiReadthedocs} from "react-icons/all";

const Sidebar: React.FC = (): ReactElement => {

    return (
        <aside id="sidebar"
               className="bg-gray-800 text-gray-100 md:w-32 w-3/4 min-w-min space-y-6 pt-6 px-0 absolute inset-y-0 left-0
                transform md:relative md:translate-x-0 transition duration-200 ease-in-out  md:flex
                 md:flex-col md:justify-between max-h-screen overflow-y-auto" data-dev-hint="sidebar; px-0 for frameless; px-2 for visually inset the navigation">
            <div className="flex flex-col space-y-6"
                 data-dev-hint="optional div for having an extra footer navigation">
                <a href="/" className="text-white flex items-center space-x-2 px-4" title="Your App is cool">
                    <span className="text-2xl font-extrabold whitespace-nowrap truncate">
                        <img alt="re_data" className="w-14" src="redata.svg" />
                    </span>
                </a>

                <nav data-dev-hint="main navigation">
                    <Link to='alerts'
                          className="flex items-center space-x-2 py-2 px-4 transition duration-200 hover:bg-gray-700 hover:text-white">
                        <ImNotification size="1.25em" />
                        <span>Alerts</span>
                    </Link>

                    <Link to='graph'
                       className="flex items-center space-x-2 py-2 px-4 transition duration-200 hover:bg-gray-700 hover:text-white">
                        <BiNetworkChart size="1.25em" />
                        <span>Graph</span>
                    </Link>
                </nav>
            </div>

            <nav data-dev-hint="second-main-navigation or footer navigation">
                <a href="https://www.getre.io/slack" className="flex items-center space-x-2 py-2 px-4 transition duration-200 hover:bg-gray-700 hover:text-white">
                    <BsSlack size="1.25em" />
                    <div>Slack</div>
                </a>
                <a href="https://re-data.github.io/re-data/" className="flex items-center space-x-2 py-2 px-4 transition duration-200 hover:bg-gray-700 hover:text-white">
                    <SiReadthedocs size="1.25em" />
                    <span>Docs</span>
                </a>

                <div className="flex items-center space-x-2 py-2 px-4 transition duration-200 hover:bg-gray-700 hover:text-white">
                    <span className="italic" >version 0.4.0</span>
                </div>
            </nav>
        </aside>
    );
};

export default Sidebar;
