import { check } from 'express-validator';

const createSubmissionValidation = () => {
    return [
        check('driver_id', 'Driver harus diisi').notEmpty(),
        check('client_id', 'Client harus diisi').notEmpty(),
        check('transportation_id', 'Transportasi harus diisi').notEmpty(),
        check('period', 'Periode harus diisi').notEmpty(),
        check('service_fee', 'Biaya Layanan harus diisi').notEmpty(),
        check('service_fee', 'Biaya Layanan harus berupa angka').isNumeric(),
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
    ]
}

module.exports = {
    createSubmissionValidation,
    updateSubmissionValidation
}