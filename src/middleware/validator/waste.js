import { check } from 'express-validator';

const createWasteValidation = () => {
    return [
        check('code', 'Kode Limbah harus diisi').notEmpty(),
        check('name', 'Nama harus diisi').notEmpty(),
        check('type', 'Jenis Limbah harus diisi').notEmpty(),
        check('weight_unit', 'Berat Satuan harus diisi').notEmpty(),
        // check('price_unit', 'Harga Satuan harus diisi').notEmpty(),
        // check('price_unit', 'Harga Satuan harus berupa number').isNumeric(),
    ]
}

const updateWasteValidation = () => {
    return [
        check('code', 'Kode Limbah harus diisi').notEmpty(),
        check('name', 'Nama harus diisi').notEmpty(),
        check('type', 'Jenis Limbah harus diisi').notEmpty(),
        check('weight_unit', 'Berat Satuan harus diisi').notEmpty(),
        // check('price_unit', 'Harga Satuan harus diisi').notEmpty(),
        // check('price_unit', 'Harga Satuan harus berupa number').isNumeric(),
    ]
}

module.exports = {
    createWasteValidation,
    updateWasteValidation
}