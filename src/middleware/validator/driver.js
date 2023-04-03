import { check } from 'express-validator';
import fs from 'fs';

const createDriverValidation = () => {
    return [
        check('name', 'Nama harus diisi').notEmpty(),
        check('age', 'Umur harus diisi').notEmpty(),
        check('age', 'Umur harus berupa number').isNumeric(),
        check('phone_number', 'Nomor Telepon harus diisi').notEmpty(),
        check('address', 'Alamat harus dipilih').notEmpty(),
        check('ktp_number', 'NIK harus diisi').notEmpty(),
        check('ktp_file').custom((value, { req }) => {
            // Validate file value
            if (!value) {
                return Promise.reject('File KTP harus diisi');
            }

            // Validate file exist
            if (!fs.existsSync('./tmp/' + value)) {
                return Promise.reject(`File KTP tidak tersedia.`);
            }

            return true;
        }),
        check('sim_number', 'Nomor SIM harus diisi').notEmpty(),
        check('sim_validity_period', 'Masa Berlaku SIM harus diisi').notEmpty(),
        check('sim_file').custom((value, { req }) => {
            // Validate file value
            if (!value) {
                return Promise.reject('File SIM harus diisi');
            }

            // Validate file exist
            if (!fs.existsSync('./tmp/' + value)) {
                return Promise.reject(`File SIM tidak tersedia.`);
            }

            return true;
        }),
    ]
}

const updateDriverValidation = () => {
    return [
        check('name', 'Nama harus diisi').notEmpty(),
        check('age', 'Umur harus diisi').notEmpty(),
        check('age', 'Umur harus berupa number').isNumeric(),
        check('phone_number', 'Nomor Telepon harus diisi').notEmpty(),
        check('address', 'Alamat harus dipilih').notEmpty(),
    ]
}

module.exports = {
    createDriverValidation,
    updateDriverValidation
}