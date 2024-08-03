import { IncomingForm } from 'formidable';
import { promises as fs } from 'fs';
import path from 'path';
import { NextApiRequest, NextApiResponse } from 'next';

// Define allowed MIME types for audio files
const ALLOWED_MIME_TYPES = ['audio/mpeg', 'audio/wav', 'audio/ogg'];

export const config = {
    api: {
        bodyParser: false,
    },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    const form = new IncomingForm({
        keepExtensions: true, // Keep file extensions
    });

    form.parse(req, async (err, fields, files) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ message: 'Something went wrong' });
        }

        const file = Array.isArray(files.file) ? files.file[0] : files.file;

        if (!file || Array.isArray(file)) {
            return res.status(400).json({ message: 'File not found or multiple files uploaded' });
        }

        // Check if the file's MIME type is allowed
        // if (!ALLOWED_MIME_TYPES.includes(file.mimetype)) {
        //     return res.status(400).json({ message: 'Invalid file type. Only audio files are allowed.' });
        // }

        // Define upload directory and ensure it exists
        const uploadDir = path.join(process.cwd(), 'uploads');
        await fs.mkdir(uploadDir, { recursive: true });

        // Define new file path and move the file
        const filePath = path.join(uploadDir, file.originalFilename || 'uploaded-file');
        try {
            await fs.rename(file.filepath, filePath); // Move the file to the desired location
            return res.status(200).json({ message: 'File uploaded successfully', filePath });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'File saving failed' });
        }
    });
}
