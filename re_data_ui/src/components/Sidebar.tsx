import React, {ReactElement} from "react";
import {Link} from 'react-router-dom';
import {BiNetworkChart, ImNotification} from "react-icons/all";

const Sidebar: React.FC = (): ReactElement => {

    return (
        <aside id="sidebar"
               className="bg-gray-800 text-gray-100 md:w-60 w-3/4 min-w-min space-y-6 pt-6 px-0 absolute inset-y-0 left-0
                transform md:relative md:translate-x-0 transition duration-200 ease-in-out  md:flex
                 md:flex-col md:justify-between max-h-screen overflow-y-auto" data-dev-hint="sidebar; px-0 for frameless; px-2 for visually inset the navigation">
            <div className="flex flex-col space-y-6"
                 data-dev-hint="optional div for having an extra footer navigation">
                <a href="/" className="text-white flex items-center space-x-2 px-4" title="Your App is cool">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 flex-0" fill="none"
                         viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                              d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"/>
                    </svg>
                    <span className="text-2xl font-extrabold whitespace-nowrap truncate">re data</span>
                </a>

                <nav data-dev-hint="main navigation">
                    <Link to='alerts'
                          className="flex items-center space-x-2 py-2 px-4 transition duration-200 hover:bg-gray-700 hover:text-white">
                        <ImNotification/>
                        <span>Alerts</span>
                    </Link>

                    <Link to='graph'
                       className="flex items-center space-x-2 py-2 px-4 transition duration-200 hover:bg-gray-700 hover:text-white">
                        <BiNetworkChart/>
                        <span>Graph</span>
                    </Link>
                </nav>
            </div>

            <nav data-dev-hint="second-main-navigation or footer navigation">
                <a href="/" className="block py-2 px-4 transition duration-200 hover:bg-gray-700 hover:text-white">
                    Slack
                </a>
                <a href="/" className="block py-2 px-4 transition duration-200 hover:bg-gray-700 hover:text-white">
                    Docs
                </a>
            </nav>
        </aside>
    );
};

export default Sidebar;
