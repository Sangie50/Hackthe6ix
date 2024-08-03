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

        const puzzlePiece = document.createElement('div');
        puzzlePiece.className = 'puzzle-piece';
        puzzlePiece.draggable = true;
        puzzlePiece.id = `puzzle-${Date.now()}`;

        const audioElement = document.createElement('audio');
        audioElement.src = data.url;
        audioElement.controls = true;
        audioElement.style.width = '80px'; 
        audioElement.style.height = '30px';
        audioElement.style.position = 'absolute';
        audioElement.style.top = '35px'; 
        audioElement.style.left = '10px'; 

        puzzlePiece.appendChild(audioElement);

        puzzlePiece.addEventListener('dragstart', handleDragStart);
        puzzlePiece.addEventListener('dragend', handleDragEnd);
        puzzlePiece.addEventListener('dragover', handleDragOver);
        puzzlePiece.addEventListener('drop', handleDrop);

        audioPieces.appendChild(puzzlePiece);
    }

    function handleDragStart(event) {
        event.dataTransfer.setData('text/plain', event.target.id);
        event.dataTransfer.effectAllowed = 'move';
        event.target.classList.add('dragging');
    }

    function handleDragEnd(event) {
        event.target.classList.remove('dragging');
    }

    function handleDragOver(event) {
        event.preventDefault();
        event.dataTransfer.dropEffect = 'move';
    }

    function handleDrop(event) {
        event.preventDefault();
        const draggedElementId = event.dataTransfer.getData('text/plain');
        const draggedElement = document.getElementById(draggedElementId);
        const dropTarget = event.target;

        if (dropTarget.className === 'puzzle-piece') {
        }
    }
});
