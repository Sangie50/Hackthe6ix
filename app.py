from flask import Flask, render_template
from flask_socketio import SocketIO, emit

app = Flask(__name__)
socketio = SocketIO(app)

@app.route('/')
def index():
    return render_template('index.html')

@socketio.on('connect')
def handle_connect():
    print('Client connected')

@socketio.on('disconnect')
def handle_disconnect():
    print('Client disconnected')

@socketio.on('audio_upload')
def handle_audio_upload(data):
    # Handle audio file upload (e.g., save to server)
    emit('audio_received', data, broadcast=True)

if __name__ == '__main__':
    socketio.run(app, debug=True)
