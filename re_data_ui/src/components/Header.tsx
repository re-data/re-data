import React, { ReactElement } from 'react';

const Header: React.FC = (): ReactElement => (
  <>
    <input type="checkbox" id="menu-open" className="hidden" />

    <label
      htmlFor="menu-open"
      className="absolute right-2 bottom-2 shadow-lg rounded-full p-2 bg-gray-100 text-gray-600 md:hidden"
      data-dev-hint="floating action button"
      aria-label="menu"
    >
      <svg
        className="h-6 w-6"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
      </svg>
    </label>
    <header
      className="bg-gray-600 text-gray-100 flex justify-between md:hidden"
      data-dev-hint="mobile menu bar"
    >
      <a href="/" className="block p-4 text-white font-bold whitespace-nowrap truncate">
        re_data
      </a>

      <label
        htmlFor="menu-open"
        id="mobile-menu-button"
        className="m-2 p-2 focus:outline-none hover:text-white hover:bg-gray-700 rounded-md"
        aria-label="mobile-menu"
      >
        <svg
          id="menu-open-icon"
          className="h-6 w-6 transition duration-200 ease-in-out"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M4 6h16M4 12h16M4 18h16"
          />
        </svg>
        <svg
          id="menu-close-icon"
          className="h-6 w-6 transition duration-200 ease-in-out"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </label>
    </header>
  </>
);

export default Header;
