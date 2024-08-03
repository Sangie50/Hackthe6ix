"use client"
import React, { useState } from 'react';
import './MainBody.css'; // Ensure CSS is properly linked

const MainBody = () => {
    const [droppedFiles, setDroppedFiles] = useState([]);

    // Handle drop event
    const handleDrop = (event) => {
        event.preventDefault();
        const fileData = event.dataTransfer.getData('text/plain');
        const file = JSON.parse(fileData);
        if (file) {
            setDroppedFiles((prevFiles) => [...prevFiles, file]);
        }
    };

    // Handle drag over event to allow drop
    const handleDragOver = (event) => {
        event.preventDefault(); // Prevent default behavior to allow dropping
    };

    return (
        <div className="main-body" onDrop={handleDrop} onDragOver={handleDragOver}>
            <h2>Drag and Drop Audio Files Here</h2>
            <div className="audio-drop-zone" id="audioDropZone">
                {droppedFiles.map((file, index) => (
                    <div key={index} className="audio-container">
                        <audio controls src={URL.createObjectURL(file)}>
                            Your browser does not support the audio element.
                        </audio>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default MainBody;
