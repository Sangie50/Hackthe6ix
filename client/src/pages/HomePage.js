import React from 'react';
import Header from '../components/Header/Header.js';
import MainBody from '../components/MainBody/MainBody.js';
import Footer from '../components/Footer/Footer.js';
import SidePanel from '../components/SidePanel/SidePanel.js'; // Import the SidePanel

const HomePage = () => {
    return (
        <div style={{ display: 'flex' }}> {/* Use flexbox to align side panel and main content */}
            <SidePanel /> {/* Add the SidePanel component */}
            <div style={{ marginLeft: '200px', flex: 1 }}> {/* Offset main content by panel width */}
                <Header />
                <MainBody />
                <Footer />
            </div>
        </div>
    );
};

export default HomePage;
