import React, { useState, useEffect } from 'react';
import './SidePanel.css';
import { io } from 'socket.io-client';
import {Howl, Howler} from 'howler';

const socket = io('http://localhost:3000'); // Ensure this matches your server URL and port

const SidePanel = () => {
    const [uploadedFiles, setUploadedFiles] = useState([]);
    const [currentSound, setCurrentSound] = useState(null);
    const [currentSoundId, setCurrentSoundId] = useState(null);
    const [volume, setVolume] = useState(1.0); // Initial volume set to 100%
    const [fadeDuration, setFadeDuration] = useState(1000); // Initial fade duration set to 1 second

    
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

    // Adjust volume
    const adjustVolume = (e) => {
        const newVolume = parseFloat(e.target.value);
        setVolume(newVolume);
        if (currentSound) {
            currentSound.volume(newVolume, currentSoundId);
        }
    };

    // Fade in audio
    const fadeInAudio = () => {
        if (currentSound && currentSoundId !== null) {
            currentSound.fade(0, volume, fadeDuration, currentSoundId);
        }
    };

    // Fade out audio
    const fadeOutAudio = () => {
        if (currentSound && currentSoundId !== null) {
            currentSound.fade(volume, 0, fadeDuration, currentSoundId);
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
                <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.01"
                    value={volume}
                    onChange={adjustVolume}
                />
                <h3>Fade Duration (ms)</h3>
                <input
                    type="number"
                    min="100"
                    step="100"
                    value={fadeDuration}
                    onChange={(e) => setFadeDuration(parseInt(e.target.value))}
                />
                <button onClick={fadeInAudio}>Fade In</button>
                <button onClick={fadeOutAudio}>Fade Out</button>
            </div>
        </div>
    );
};

export default SidePanel;
