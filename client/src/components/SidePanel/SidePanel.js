import React from 'react';
import './SidePanel.css'; // Import a CSS file for styling

const SidePanel = () => {
    return (
        <div className="side-panel">
            <div className="panel-block">
                <h3>Drag & Drop</h3>
                {/* Additional content for this block can go here */}
            </div>
            <div className="panel-block">
                <h3>Music Library</h3>
                {/* Additional content for this block can go here */}
            </div>
            <div className="panel-block">
                <h3>Volume</h3>
                {/* Additional content for this block can go here */}
            </div>
        </div>
    );
};

export default SidePanel;
