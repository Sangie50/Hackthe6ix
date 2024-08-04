import { createServer } from 'node:http';
import next from 'next';
import { Server } from 'socket.io';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const dev = process.env.NODE_ENV !== 'production';
const hostname = 'localhost';
const port = 5001;

const app = next({ dev, hostname, port });
const handler = app.getRequestHandler();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.prepare().then(() => {
    const httpServer = createServer(handler);

    const io = new Server(httpServer);

    // Directory to save uploaded files
    const UPLOAD_DIR = path.join(__dirname, 'uploads');
    if (!fs.existsSync(UPLOAD_DIR)) {
        fs.mkdirSync(UPLOAD_DIR);
    }

    io.on('connection', (socket) => {
        console.log('Client connected');

        socket.on("hello", (receivedMsg) => {
            // console.log("recieved: ", receivedMsg)
            console.log("received a msg ")
            io.sockets.emit("hello", receivedMsg);
        });

        // Handle audio upload event
        socket.on('audio_upload', (data) => {
            const { filename, audio_data } = data;
            const filePath = path.join(UPLOAD_DIR, filename);

            // Decode the base64 string and write to file
            const audioBuffer = Buffer.from(audio_data.split(',')[1], 'base64');
            fs.writeFile(filePath, audioBuffer, (err) => {
                if (err) {
                    console.error('Error saving audio file:', err);
                    return;
                }
                console.log(`Audio file ${filename} saved successfully`);
                // Emit a confirmation event back to the client
                socket.emit('audio_received', { filename });
            });
        });

        socket.on('disconnect', () => {
            console.log('Client disconnected');
        });
    });

    httpServer.once('error', (err) => {
        console.error(err);
        process.exit(1);
    }).listen(port, () => {
        console.log(`> Ready on http://${hostname}:${port}`);
    });
});
