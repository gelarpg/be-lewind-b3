import { check } from 'express-validator';
import fs from 'fs';

const createTransportationValidation = () => {
    return [
        check('name', 'Nama Kendaraan harus diisi').notEmpty(),
        check('transportation_type_id', 'Jenis Kendaraan harus diisi').notEmpty(),
        check('no_police', 'Nomor Polisi harus diisi').notEmpty(),
        check('year', 'Tahun Kendaraan harus diisi').notEmpty(),
        check('year', 'Tahun Kendaraan harus berupa number').isNumeric(),
        check('capacity', 'Kapasitas harus diisi').notEmpty(),
        check('fuel_type', 'Jenis Bahan Bakar harus dipilih').notEmpty(),
        check('stnk_number', 'No STNK Kendaraan harus diisi').notEmpty(),
        check('stnk_file').custom((value, { req }) => {
            // Validate file value
            if (!value) {
                return Promise.reject('File STNK harus diisi');
            }

            // Validate file exist
            if (!fs.existsSync('./tmp/' + value)) {
                return Promise.reject(`File STNK tidak tersedia.`);
            }

            return true;
        }),
        check('travel_document_number', 'Surat Jalan harus diisi').notEmpty(),
        check('travel_document_file').custom((value, { req }) => {
            // Validate file value
            if (!value) {
                return Promise.reject('File Surat Jalan harus diisi');
            }

            // Validate file exist
            if (!fs.existsSync('./tmp/' + value)) {
                return Promise.reject(`File Surat Jalan tidak tersedia.`);
            }

            return true;
        }),
    ]
}

const updateTransportationValidation = () => {
    return [
        check('name', 'Nama Kendaraan harus diisi').notEmpty(),
        check('transportation_type_id', 'Jenis Kendaraan harus diisi').notEmpty(),
        check('no_police', 'Nomor Polisi harus diisi').notEmpty(),
        check('year', 'Tahun Kendaraan harus diisi').notEmpty(),
        check('year', 'Tahun Kendaraan harus berupa number').isNumeric(),
        check('capacity', 'Kapasitas harus diisi').notEmpty(),
        check('fuel_type', 'Jenis Bahan Bakar harus dipilih').notEmpty(),
    ]
}

module.exports = {
    createTransportationValidation,
    updateTransportationValidation
}