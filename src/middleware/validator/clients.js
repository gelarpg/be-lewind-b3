import { check } from 'express-validator';

const createClientsValidation = () => {
    return [
        check('name', 'Nama harus diisi').notEmpty(),
        check('company_name', 'Nama Perusahaan harus diisi').notEmpty(),
        check('waste_id', 'Jenis Limbah harus diisi').notEmpty(),
        check('address', 'Alamat harus diisi').notEmpty(),
        check('offer_number', 'Nomor Penawaran harus diisi').notEmpty(),
        check('transaction_fee', 'Biaya Transaksi harus diisi').notEmpty(),
        check('transaction_fee', 'Biaya Transaksi harus berupa number').isNumeric(),
    ]
}

const updateClientsValidation = () => {
    return [
        check('name', 'Nama harus diisi').notEmpty(),
        check('company_name', 'Nama Perusahaan harus diisi').notEmpty(),
        check('waste_id', 'Jenis Limbah harus diisi').notEmpty(),
        check('address', 'Alamat harus diisi').notEmpty(),
        check('offer_number', 'Nomor Penawaran harus diisi').notEmpty(),
        check('transaction_fee', 'Biaya Transaksi harus diisi').notEmpty(),
        check('transaction_fee', 'Biaya Transaksi harus berupa number').isNumeric(),
    ]
}

module.exports = {
    createClientsValidation,
    updateClientsValidation
}