import { check } from 'express-validator';
import fs from 'fs';

const createSubmissionValidation = () => {
    return [
        // check('driver_id', 'Driver harus diisi').notEmpty(),
        check('client_id', 'Client harus diisi').notEmpty(),
        // check('transportation_id', 'Transportasi harus diisi').notEmpty(),
        // check('period', 'Periode harus diisi').notEmpty(),
        // check('service_fee', 'Biaya Layanan harus diisi').notEmpty(),
        // check('service_fee', 'Biaya Layanan harus berupa angka').isNumeric(),
        // check('service_fee_file').custom((value, { req }) => {
        //     // Validate file value
        //     if (!value) {
        //         return Promise.reject('Dokumen Biaya Layanan harus diisi');
        //     }

        //     // Validate file exist
        //     if (!fs.existsSync('./tmp/' + value)) {
        //         return Promise.reject(`Dokumen Biaya Layanan tidak tersedia.`);
        //     }

        //     return true;
        // }),
        // check('invoice_file').custom((value, { req }) => {
        //     // Validate file value
        //     if (!value) {
        //         return Promise.reject('Dokumen Invoice harus diisi');
        //     }

        //     // Validate file exist
        //     if (!fs.existsSync('./tmp/' + value)) {
        //         return Promise.reject(`Dokumen Invoice tidak tersedia.`);
        //     }

        //     return true;
        // }),
        // check('provider_file').custom((value, { req }) => {
        //     // Validate file value
        //     if (!value) {
        //         return Promise.reject('Dokumen Penyedia harus diisi');
        //     }

        //     // Validate file exist
        //     if (!fs.existsSync('./tmp/' + value)) {
        //         return Promise.reject(`Dokumen Penyedia tidak tersedia.`);
        //     }

        //     return true;
        // }),
        // check('transporter_file').custom((value, { req }) => {
        //     // Validate file value
        //     if (!value) {
        //         return Promise.reject('Dokumen Transporter harus diisi');
        //     }

        //     // Validate file exist
        //     if (!fs.existsSync('./tmp/' + value)) {
        //         return Promise.reject(`Dokumen Transporter tidak tersedia.`);
        //     }

        //     return true;
        // }),
        // check('waste_receipt_file').custom((value, { req }) => {
        //     // Validate file value
        //     if (!value) {
        //         return Promise.reject('Dokumen Penerima Limbah harus diisi');
        //     }

        //     // Validate file exist
        //     if (!fs.existsSync('./tmp/' + value)) {
        //         return Promise.reject(`Dokumen Penerima Limbah tidak tersedia.`);
        //     }

        //     return true;
        // }),
        // check('bast_file').custom((value, { req }) => {
        //     // Validate file value
        //     if (!value) {
        //         return Promise.reject('Dokumen BAST harus diisi');
        //     }

        //     // Validate file exist
        //     if (!fs.existsSync('./tmp/' + value)) {
        //         return Promise.reject(`Dokumen BAST tidak tersedia.`);
        //     }

        //     return true;
        // }),
        // check('travel_document_file').custom((value, { req }) => {
        //     // Validate file value
        //     if (!value) {
        //         return Promise.reject('Dokumen Surat Jalan harus diisi');
        //     }

        //     // Validate file exist
        //     if (!fs.existsSync('./tmp/' + value)) {
        //         return Promise.reject(`Dokumen Surat Jalan tidak tersedia.`);
        //     }

        //     return true;
        // }),
    ]
}

const updateSubmissionValidation = () => {
    return [
        // check('client_id').custom((value, { req }) => {
        //     // Validate file value
        //     if (req.user.role == 'perencanaan') {
        //         if (!value) {
        //             return Promise.reject('Client harus diisi');
        //         }
        //     }

        //     return true;
        // }),
        // check('driver_id').custom((value, { req }) => {
        //     // Validate file value
        //     if (req.user.role == 'operasional') {
        //         if (!value) {
        //             return Promise.reject('Driver harus diisi');
        //         }
        //     }

        //     return true;
        // }),
        // check('transportation_id').custom((value, { req }) => {
        //     // Validate file value
        //     if (req.user.role == 'operasional') {
        //         if (!value) {
        //             return Promise.reject('Transportasi harus diisi');
        //         }
        //     }

        //     return true;
        // }),
        // check('period').custom((value, { req }) => {
        //     // Validate file value
        //     if (req.user.role == 'operasional') {
        //         if (!value) {
        //             return Promise.reject('Periode harus diisi');
        //         }
        //     }

        //     return true;
        // }),
        // check('service_fee').custom((value, { req }) => {
        //     // Validate file value
        //     if (req.user.role == 'operasional') {
        //         if (!value) {
        //             return Promise.reject('Biaya Layanan harus diisi');
        //         }
        //     }

        //     return true;
        // }),
        // check('service_fee').custom((value, { req }) => {
        //     // Validate file value
        //     if (req.user.role == 'operasional') {
        //         if (!value) {
        //             return Promise.reject('Biaya Layanan harus diisi');
        //         }
        //     }

        //     return true;
        // }),
        // check('travel_fee').custom((value, { req }) => {
        //     // Validate file value
        //     if (req.user.role == 'operasional') {
        //         if (!value) {
        //             return Promise.reject('Status Biaya Perjalanan harus diisi');
        //         }
        //     }

        //     return true;
        // }),
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