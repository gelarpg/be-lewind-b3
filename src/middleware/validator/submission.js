import { check } from 'express-validator';
import fs from 'fs';

const createSubmissionValidation = () => {
    return [
        check('driver_id', 'Driver harus diisi').notEmpty(),
        check('client_id', 'Client harus diisi').notEmpty(),
        check('transportation_id', 'Transportasi harus diisi').notEmpty(),
        check('period', 'Periode harus diisi').notEmpty(),
        check('service_fee', 'Biaya Layanan harus diisi').notEmpty(),
        check('service_fee', 'Biaya Layanan harus berupa angka').isNumeric(),
        check('service_fee_file').custom((value, { req }) => {
            // Validate file value
            if (!value) {
                return Promise.reject('Dokumen Biaya Layanan harus diisi');
            }

            // Validate file exist
            if (!fs.existsSync('./tmp/' + value)) {
                return Promise.reject(`Dokumen Biaya Layanan tidak tersedia.`);
            }

            return true;
        }),
        check('invoice_file').custom((value, { req }) => {
            // Validate file value
            if (!value) {
                return Promise.reject('Dokumen Invoice harus diisi');
            }

            // Validate file exist
            if (!fs.existsSync('./tmp/' + value)) {
                return Promise.reject(`Dokumen Invoice tidak tersedia.`);
            }

            return true;
        }),
        check('provider_file').custom((value, { req }) => {
            // Validate file value
            if (!value) {
                return Promise.reject('Dokumen Penyedia harus diisi');
            }

            // Validate file exist
            if (!fs.existsSync('./tmp/' + value)) {
                return Promise.reject(`Dokumen Penyedia tidak tersedia.`);
            }

            return true;
        }),
        check('transporter_file').custom((value, { req }) => {
            // Validate file value
            if (!value) {
                return Promise.reject('Dokumen Transporter harus diisi');
            }

            // Validate file exist
            if (!fs.existsSync('./tmp/' + value)) {
                return Promise.reject(`Dokumen Transporter tidak tersedia.`);
            }

            return true;
        }),
        check('waste_receipt_file').custom((value, { req }) => {
            // Validate file value
            if (!value) {
                return Promise.reject('Dokumen Penerima Limbah harus diisi');
            }

            // Validate file exist
            if (!fs.existsSync('./tmp/' + value)) {
                return Promise.reject(`Dokumen Penerima Limbah tidak tersedia.`);
            }

            return true;
        }),
        check('bast_file').custom((value, { req }) => {
            // Validate file value
            if (!value) {
                return Promise.reject('Dokumen BAST harus diisi');
            }

            // Validate file exist
            if (!fs.existsSync('./tmp/' + value)) {
                return Promise.reject(`Dokumen BAST tidak tersedia.`);
            }

            return true;
        }),
        check('travel_document_file').custom((value, { req }) => {
            // Validate file value
            if (!value) {
                return Promise.reject('Dokumen Surat Jalan harus diisi');
            }

            // Validate file exist
            if (!fs.existsSync('./tmp/' + value)) {
                return Promise.reject(`Dokumen Surat Jalan tidak tersedia.`);
            }

            return true;
        }),
    ]
}

const updateSubmissionValidation = () => {
    return [
        check('driver_id', 'Driver harus diisi').notEmpty(),
        check('client_id', 'Client harus diisi').notEmpty(),
        check('transportation_id', 'Transportasi harus diisi').notEmpty(),
        check('period', 'Periode harus diisi').notEmpty(),
        check('service_fee', 'Biaya Layanan harus diisi').notEmpty(),
        check('service_fee', 'Biaya Layanan harus berupa angka').isNumeric(),
        check('service_fee_file', 'Dokumen Biaya Layanan harus diisi').notEmpty(),
        check('invoice_file', 'Dokumen Invoice harus diisi').notEmpty(),
        check('provider_file', 'Dokumen Penyedia harus diisi').notEmpty(),
        check('transporter_file', 'Dokumen Transporter harus diisi').notEmpty(),
        check('waste_receipt_file', 'Dokumen Penerima Limbah harus diisi').notEmpty(),
        check('bast_file', 'Dokumen BAST harus diisi').notEmpty(),
        check('travel_document_file', 'Dokumen Surat Jalan harus diisi').notEmpty(),
    ]
}

const updateSubmissionStatusValidation = () => {
    return [
        check('status', 'Status harus diisi').notEmpty()
    ]
}

module.exports = {
    createSubmissionValidation,
    updateSubmissionValidation,
    updateSubmissionStatusValidation
}