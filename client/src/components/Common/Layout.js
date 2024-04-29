import React from 'react';
import Navbar from './Navbar';
import './Layout.css';

const Layout = ({ children }) => {
  return (
    <div className='Layout'>
      <Navbar />
      <div className='Content'>
        {children}
      </div>
    </div>
  );
};

export default Layout;

