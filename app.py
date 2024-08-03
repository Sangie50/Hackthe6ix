from flask import Flask, render_template, request
from flask_socketio import SocketIO, emit
import os
import shutil

app = Flask(__name__)
socketio = SocketIO(app)

# Directory to organize
BASE_DIRECTORY = './project-root'  # Adjust to your specific project root

def list_files(directory):
    """List all files in the given directory and its subdirectories."""
    print("\nListing files:")
    for root, dirs, files in os.walk(directory):
        for file in files:
            print(os.path.join(root, file))

def organize_files_by_type(directory):
    """Organize files into folders by their file type."""
    for root, dirs, files in os.walk(directory):
        for file in files:
            file_type = file.split('.')[-1]
            type_directory = os.path.join(root, file_type)

            # Create directory if it doesn't exist
            if not os.path.exists(type_directory):
                os.makedirs(type_directory)

            # Move file to the appropriate directory
            file_path = os.path.join(root, file)
            new_file_path = os.path.join(type_directory, file)
            shutil.move(file_path, new_file_path)
            print(f'Moved {file} to {type_directory}')

def rename_files(directory, rename_dict):
    """
    Rename files based on a dictionary of {old_name: new_name}.
    The dictionary keys are filenames without extensions.
    """
    for root, dirs, files in os.walk(directory):
        for file in files:
            file_name, file_ext = os.path.splitext(file)
            if file_name in rename_dict:
                old_file_path = os.path.join(root, file)
                new_file_name = rename_dict[file_name] + file_ext
                new_file_path = os.path.join(root, new_file_name)

                # Rename the file
                os.rename(old_file_path, new_file_path)
                print(f'Renamed {file} to {new_file_name}')

@app.route('/')
def index():
    return render_template('index.html')

@socketio.on('audio_upload')
def handle_audio_upload(data):
    emit('audio_received', data, broadcast=True)

# Route to trigger file organization
@app.route('/organize')
def organize():
    list_files(BASE_DIRECTORY)
    organize_files_by_type(BASE_DIRECTORY)
    list_files(BASE_DIRECTORY)
    return "Files organized by type."

# Route to trigger file renaming
@app.route('/rename')
def rename():
    rename_dict = {
        'scripts': 'main_script',
        'styles': 'main_styles',
        'index': 'home_page'
    }
    rename_files(BASE_DIRECTORY, rename_dict)
    list_files(BASE_DIRECTORY)
    return "Files renamed."

if __name__ == '__main__':
    socketio.run(app, debug=True)
