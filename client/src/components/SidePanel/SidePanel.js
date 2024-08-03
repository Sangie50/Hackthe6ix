<<<<<<< HEAD
import React, { useState, useEffect } from 'react';
import './SidePanel.css';
import { io } from 'socket.io-client';

const socket = io('http://localhost:3000'); // Ensure this matches your server URL and port
=======
import React, { useState } from 'react';
import {Howl, Howler} from 'howler';
import './SidePanel.css'; // Import CSS for styling
>>>>>>> 172b161f2884f32210c92a53020a8779a1f0d170

const SidePanel = () => {
    const [uploadedFiles, setUploadedFiles] = useState([]);
    const [currentSound, setCurrentSound] = useState(null);
    const [currentSoundId, setCurrentSoundId] = useState(null);
    
    // Handle file input change event
    const handleFileUpload = (event) => {
        const files = Array.from(event.target.files);
        files.forEach(file => {
            const reader = new FileReader();
            reader.onload = (e) => {
                const audioDataUrl = e.target.result;
                console.log(`Uploading file: ${file.name}`);  // Debug statement
                socket.emit('audio_upload', { filename: file.name, audio_data: audioDataUrl });
            };
            reader.readAsDataURL(file);
        });
    };

    // Set up socket listener for audio_received
    useEffect(() => {
        socket.on('audio_received', (data) => {
            console.log(`Audio received: ${data.filename}`);  // Debug statement
            setUploadedFiles((prevFiles) => [...prevFiles, data]);
        });

        return () => {
            socket.off('audio_received');
        };
    }, []);

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
                    style={{ display: 'none' }}
                    id="fileInput"
                />
                <button onClick={() => document.getElementById('fileInput').click()}>
                    Upload Audio File
                </button>
                <ul className="file-list">
                    {uploadedFiles.map((file, index) => (
                        <li key={index} className="file-item">
                            {file.filename}
                        </li>
                    ))}
                </ul>
            </div>
            <div className="panel-block">
                <h3>Music Library</h3>
<<<<<<< HEAD
=======
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
>>>>>>> 172b161f2884f32210c92a53020a8779a1f0d170
            </div>
            <div className="panel-block">
                <h3>Volume</h3>
            </div>
        </div>
    );
};

export default SidePanel;
