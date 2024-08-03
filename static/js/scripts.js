document.addEventListener('DOMContentLoaded', () => {
    const socket = io();

    socket.on('connect', () => {
        console.log('Connected to server');
    });

    socket.on('audio_received', (data) => {
        addAudioPiece(data);
    });

    const fileInput = document.getElementById('fileInput');
    fileInput.addEventListener('change', (event) => {
        const files = event.target.files;
        for (let file of files) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const arrayBuffer = e.target.result;
                const audioBlob = new Blob([arrayBuffer], { type: 'audio/wav' });
                const audioUrl = URL.createObjectURL(audioBlob);
                socket.emit('audio_upload', { name: file.name, url: audioUrl });
            };
            reader.readAsArrayBuffer(file);
        }
    });

    function addAudioPiece(data) {
        const audioPieces = document.getElementById('audioPieces');

        // Create the puzzle piece container
        const puzzlePiece = document.createElement('div');
        puzzlePiece.className = 'puzzle-piece';
        puzzlePiece.draggable = true;
        puzzlePiece.id = `puzzle-${Date.now()}`;

        // Create the audio element
        const audioElement = document.createElement('audio');
        audioElement.src = data.url;
        audioElement.controls = true;
        audioElement.style.width = '80px'; // Fit within puzzle piece
        audioElement.style.height = '30px';
        audioElement.style.position = 'absolute';
        audioElement.style.top = '35px'; // Center vertically within puzzle piece
        audioElement.style.left = '10px'; // Center horizontally within puzzle piece

        // Append the audio element to the puzzle piece
        puzzlePiece.appendChild(audioElement);

        // Set drag and drop event handlers
        puzzlePiece.addEventListener('dragstart', handleDragStart);
        puzzlePiece.addEventListener('dragend', handleDragEnd);

        audioPieces.appendChild(puzzlePiece);
    }

    function handleDragStart(event) {
        event.dataTransfer.setData('text/plain', event.target.id);
        event.dataTransfer.effectAllowed = 'move';
        event.target.classList.add('dragging');

        // Create a custom drag image
        const ghostImage = document.createElement('div');
        ghostImage.style.width = '100px';
        ghostImage.style.height = '100px';
        ghostImage.style.backgroundColor = 'rgba(240, 240, 240, 0.8)';
        ghostImage.style.border = '1px solid #000';
        ghostImage.style.clipPath = "path('M10,10 h80 a10,10 0 0,1 10,10 v10 a10,10 0 0,1 -10,10 h-10 a10,10 0 0,0 -10,10 v10 a10,10 0 0,0 10,10 h10 a10,10 0 0,1 10,10 v10 a10,10 0 0,1 -10,10 h-80 a10,10 0 0,1 -10,-10 v-10 a10,10 0 0,1 10,-10 h10 a10,10 0 0,0 10,-10 v-10 a10,10 0 0,0 -10,-10 h-10 a10,10 0 0,1 -10,-10 v-10 a10,10 0 0,1 10,-10 Z')";
        document.body.appendChild(ghostImage);
        event.dataTransfer.setDragImage(ghostImage, 50, 50);

        // Remove the ghost image after the drag starts
        setTimeout(() => document.body.removeChild(ghostImage), 0);
    }

    function handleDragEnd(event) {
        event.target.classList.remove('dragging');
    }

    document.addEventListener('dragover', handleDragOver);
    document.addEventListener('drop', handleDrop);

    function handleDragOver(event) {
        event.preventDefault();
        event.dataTransfer.dropEffect = 'move';
    }

    function handleDrop(event) {
        event.preventDefault();
        const draggedElementId = event.dataTransfer.getData('text/plain');
        const draggedElement = document.getElementById(draggedElementId);

        // Ensure the drop is within the #audioPieces container
        const dropZone = document.getElementById('audioPieces');
        if (dropZone.contains(event.target) || event.target === dropZone) {
            const dropZoneRect = dropZone.getBoundingClientRect();
            draggedElement.style.left = `${event.clientX - dropZoneRect.left - draggedElement.offsetWidth / 2}px`;
            draggedElement.style.top = `${event.clientY - dropZoneRect.top - draggedElement.offsetHeight / 2}px`;
        }
    }
});
