import multer from 'multer';
import fs from 'fs';

const isValidMime = (mimeCheck) =>
{
    var mimeTypes = [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ]
    return (mimeTypes.indexOf(mimeCheck.toLowerCase()) >= 0)
}


const uploadDoc = multer({
    fileFilter: (req, file, cb) => {
        if (isValidMime(file.mimetype)) {
            return cb(null, true);
        } else {
            cb(null, false);
        }
    },
    storage: multer.diskStorage({
        destination: (req, file, cb) => {
            const dir = 'tmp/';
            if (!fs.existsSync(dir)) {
                fs.mkdirSync(dir);
            }
            cb(null, dir);
        },
        filename: (req, file, cb) => {
            if (isValidMime(file.mimetype)) {
                let ext = file.mimetype.split('/')[1]
                if (ext == 'pdf') {
                    ext = 'pdf'
                } else if ((ext == 'msword')) {
                    ext = 'doc'
                } else if ((ext == 'vnd.openxmlformats-officedocument.wordprocessingml.document')) {
                    ext = 'docx'
                }

                // cb(null, makeRandomString(50) + '.' + ext, file)
                cb(null, file.originalname.replace(new RegExp('/', 'g'), ''), file)
            } else {
                cb("Format berkas tidak sesuai", "Berkas harus berupa PDF atau WORD")
            }
        }
    })
}).any();

module.exports = {
    uploadDoc
};