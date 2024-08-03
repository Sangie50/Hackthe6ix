import React from 'react';
import Header from '../components/Header/Header.js';
import MainBody from '../components/MainBody/MainBody.js';
import Footer from '../components/Footer/Footer.js';
import SidePanel from '../components/SidePanel/SidePanel.js'; // Import the SidePanel

const HomePage = () => {
    return (
        <div>
            <Header /> {/* Header across the top */}
            <div style={{ display: 'flex', height: 'calc(100vh - 60px)' }}> {/* Adjust height dynamically based on header size */}
                <SidePanel /> {/* Side panel */}
                <div style={{ flex: 1, padding: '20px' }}> {/* Main content area */}
                    <MainBody />
                    <Footer />
                </div>
            </div>
        </div>
    );
};

export default HomePage;
