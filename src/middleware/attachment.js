const multer = require('multer');
const path = require('path');
import fs from 'fs';

const isValidMime = (mimeCheck) => {
    var mimeTypes = [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'image/jpeg',
        'image/png'
    ]
    return (mimeTypes.indexOf(mimeCheck.toLowerCase()) >= 0)
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const dir = 'tmp/';
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir);
        }
        cb(null, dir);
    },
    filename: (req, file, cb) => {
        if (isValidMime(file.mimetype)) {
            cb(null, Date.now() + '_' + file.originalname.replace(new RegExp('/', 'g'), ''), file)
        } else {
            cb("Format berkas tidak sesuai", "Berkas harus berupa PDF atau WORD")
        }
    }
});

const upload = multer({
    fileFilter: (req, file, cb) => {
        if (isValidMime(file.mimetype)) {
            return cb(null, true);
        } else {
            cb(null, false);
        }
    },
    storage: storage
});

module.exports = upload;