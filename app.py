from flask import Flask, render_template, request
from flask_socketio import SocketIO, emit

app = Flask(__name__)
socketio = SocketIO(app) # testing git config

@app.route('/')
def index():
    return render_template('index.html')

@socketio.on('audio_upload')
def handle_audio_upload(data):
    emit('audio_received', data, broadcast=True)

if __name__ == '__main__':
    socketio.run(app, debug=True)
