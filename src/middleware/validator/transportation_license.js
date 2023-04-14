import { check } from 'express-validator';
import fs from 'fs';

const createTransportationLicenseValidation = () => {
    return [
        check('transportation_id', 'Nomor Polisi Kendaraan harus diisi').notEmpty(),
        check('validity_period_stnk', 'Masa berlaku STNK harus diisi').notEmpty(),
        check('validity_period_kir', 'Masa berlaku KIR harus diisi').notEmpty(),
        check('validity_period_rekom', 'Masa berlaku REKOM harus diisi').notEmpty(),
        check('validity_period_supervision_card', 'Masa berlaku Kartu Pengawasa harus diisi').notEmpty(),
        check('validity_period_departement_permit', 'Masa berlaku Izin Dinas Perhubungan harus diisi').notEmpty()
    ]
}

const updateTransportationLicenseValidation = () => {
    return [
        check('transportation_id', 'Nomor Polisi Kendaraan harus diisi').notEmpty(),
        check('validity_period_stnk', 'Masa berlaku STNK harus diisi').notEmpty(),
        check('validity_period_kir', 'Masa berlaku KIR harus diisi').notEmpty(),
        check('validity_period_rekom', 'Masa berlaku REKOM harus diisi').notEmpty(),
        check('validity_period_supervision_card', 'Masa berlaku Kartu Pengawasa harus diisi').notEmpty(),
        check('validity_period_departement_permit', 'Masa berlaku Izin Dinas Perhubungan harus diisi').notEmpty()
    ]
}

module.exports = {
    createTransportationLicenseValidation,
    updateTransportationLicenseValidation
}