import React, { useState } from 'react';
import './SidePanel.css'; // Import CSS for styling

const SidePanel = () => {
    const [uploadedFiles, setUploadedFiles] = useState([]);

    // Handle file input change event
    const handleFileUpload = (event) => {
        const files = Array.from(event.target.files);
        setUploadedFiles((prevFiles) => [...prevFiles, ...files]);
    };

    // Handle drag start event
    const handleDragStart = (event, file) => {
        event.dataTransfer.setData('text/plain', file.name);
        event.dataTransfer.effectAllowed = 'move';
    };

    return (
        <div className="side-panel">
            <div className="panel-block">
                <h3>Upload Files</h3>
                <input
                    type="file"
                    multiple
                    onChange={handleFileUpload}
                    style={{ display: 'none' }} // Hidden file input
                    id="fileInput"
                />
                <button onClick={() => document.getElementById('fileInput').click()}>
                    Upload Audio File
                </button>
                <ul className="file-list">
                    {uploadedFiles.map((file, index) => (
                        <li
                            key={index}
                            className="file-item"
                            draggable
                            onDragStart={(e) => handleDragStart(e, file)}
                        >
                            {file.name}
                        </li>
                    ))}
                </ul>
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
