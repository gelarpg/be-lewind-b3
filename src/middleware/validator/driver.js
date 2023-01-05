import { check } from 'express-validator';

const createDriverValidation = () => {
    return [
        check('name', 'Nama harus diisi').notEmpty(),
        check('age', 'Umur harus diisi').notEmpty(),
        check('age', 'Umur harus berupa number').isNumeric(),
        check('phone_number', 'Nomor Telepon harus diisi').notEmpty(),
        check('address', 'Alamat harus dipilih').notEmpty(),
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