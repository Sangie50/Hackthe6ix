"use client";
import React, { useState, useEffect } from 'react';
import { Howl } from 'howler';
import './SidePanel.css';
import { io } from 'socket.io-client';

// Initialize the socket connection to the server
const socket = io('http://localhost:5001');  // Ensure this matches your server's address

const SidePanel = () => {
    const [uploadedFiles, setUploadedFiles] = useState([]);
    const [currentSound, setCurrentSound] = useState(null);
    const [currentSoundId, setCurrentSoundId] = useState(null);

    useEffect(() => {
        // Handle receiving the audio received event from the server
        socket.on('audio_received', (data) => {
            console.log(`Audio received: ${data.filename}`);  // Debug statement
            // Optionally add the file to the list if server returns confirmation
        });

        // Cleanup socket connection on component unmount
        return () => {
            socket.off('audio_received');
        };
    }, []);

    // Handle file input change event
    const handleFileUpload = (event) => {
        const files = Array.from(event.target.files);
        setUploadedFiles((prevFiles) => [...prevFiles, ...files]);

        // Emit the file data to the server using Socket.IO
        files.forEach(file => {
            const reader = new FileReader();
            reader.onload = (e) => {
                const audioDataUrl = e.target.result;
                console.log(`Uploading file: ${file.name}`);  // Debug statement
                socket.emit('audio_upload', { filename: file.name, audio_data: audioDataUrl });
            };
            reader.readAsDataURL(file);  // Convert file to a base64 URL
        });
    };

    // Handle drag start event
    const handleDragStart = (event, file) => {
        event.dataTransfer.setData('text/plain', file.name);
        event.dataTransfer.effectAllowed = 'move';
    };

    const playAudio = (file) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            const sound = new Howl({
                src: [e.target.result]
            });
            sound.play();
        };
        reader.readAsDataURL(file);
    };

    // Pause audio playback
    const pauseAudio = () => {
        if (currentSound && currentSoundId !== null) {
            currentSound.pause(currentSoundId);
        }
    };

    // Stop audio playback
    const stopAudio = () => {
        if (currentSound) {
            currentSound.stop();
            setCurrentSound(null);
            setCurrentSoundId(null);
        }
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
                <ul className="file-list">
                    {uploadedFiles.map((file, index) => (
                        <li key={index} className="file-item">
                            {file.name}
                            <button onClick={() => playAudio(file)}>Play</button>
                            <button onClick={pauseAudio}>Pause</button>
                            <button onClick={stopAudio}>Stop</button>
                        </li>
                    ))}
                </ul>
            </div>
            <div className="panel-block">
                <h3>Volume</h3>
                {/* Additional content for this block can go here */}
            </div>
        </div>
    );
};

export default SidePanel;
