import { check } from 'express-validator';

const createTransportationValidation = () => {
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