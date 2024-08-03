document.addEventListener('DOMContentLoaded', () => {
    const socket = io();

    socket.on('connect', () => {
        console.log('Connected to server');
    });

    socket.on('audio_received', (data) => {
        // Handle received audio data
        const audioPieces = document.getElementById('audioPieces');
        const audioElement = document.createElement('audio');
        audioElement.src = data.url;
        audioElement.controls = true;
        audioElement.className = 'audio-piece';
        audioPieces.appendChild(audioElement);
    });

    const fileInput = document.getElementById('fileInput');
    fileInput.addEventListener('change', (event) => {
        const files = event.target.files;
        for (let file of files) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const arrayBuffer = e.target.result;
                socket.emit('audio_upload', { name: file.name, buffer: arrayBuffer });
            };
            reader.readAsArrayBuffer(file);
        }
    });
});
