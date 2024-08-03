from flask import Flask, render_template
from flask_socketio import SocketIO, emit
import os
import base64

app = Flask(__name__)
app.config['SECRET_KEY'] = 'your_secret_key'
socketio = SocketIO(app)

# Directory to save uploaded audio files
UPLOAD_FOLDER = './uploads'
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

@app.route('/')
def index():
    return render_template('index.html')

@socketio.on('audio_upload')
def handle_audio_upload(data):
    try:
        print(f"Received data for file: {data['filename']}")  # Debug statement
        audio_data = data['audio_data']
        filename = data['filename']

        # Decode the base64-encoded audio data
        audio_binary = base64.b64decode(audio_data.split(',')[1])

        # Save the audio file to the server
        audio_file_path = os.path.join(UPLOAD_FOLDER, filename)
        with open(audio_file_path, 'wb') as audio_file:
            audio_file.write(audio_binary)

        print(f"Audio file {filename} saved successfully at {audio_file_path}")  # Debug statement

        # Notify all clients that a new audio file has been uploaded
        emit('audio_received', {'filename': filename, 'url': f"/uploads/{filename}"}, broadcast=True)
    except KeyError as e:
        print(f"KeyError: {e}")
