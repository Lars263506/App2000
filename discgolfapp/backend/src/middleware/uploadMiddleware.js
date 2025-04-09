import multer from 'multer';

/**
 * @author Andreas Nilsen and Lars Andreas Strand
 * @description This middleware handles file uploads using multer.
 * It uses memory storage to store the uploaded files in memory.
 * It is used to handle file uploads in the application.
 */

const storage = multer.memoryStorage();
const upload = multer({ storage });

export default upload;
