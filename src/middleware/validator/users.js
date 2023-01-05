import { check } from 'express-validator';

const createUserValidation = () => {
    return [
        check('email', 'Email harus diisi').notEmpty(),
        check('email', 'Format email tidak sesuai').isEmail(),
        check('first_name', 'Nama depan harus diisi').notEmpty(),
        check('roles', 'Hak akses harus dipilih').notEmpty(),
        check('password', 'Kata sandi harus diisi').optional({ checkFalsy: true }),
        check('password', 'Kata sandi Anda harus setidaknya 10 karakter serta mengandung setidaknya satu huruf besar, satu huruf kecil, satu angka, dan satu karakter khusus.')
            .isLength({ min: 12, max: 32 })
            .matches(/^(?=.*[a-z]).{10,50}$/, "i")
            .matches(/^(?=.*[0-9]).{10,50}$/, "i")
            .matches(/^(?=.*[!@#$&*]).{10,50}$/, "i")
            .matches(/^(?=.*[A-Z]).{10,50}$/, "i"),
        check('area_polda').custom((value, { req }) => {
            // Check role value
            if (req.body.roles == 4 || (req.body.roles == 5 && (req.body.role_input == 'super_admin' || req.body.role_input == 'admin_pusat'))) {
                if (!value) {
                    return Promise.reject('Wilayah harus Diisi');
                }
            }

            return true;
        }),
        check('area_polres').custom((value, { req }) => {
            // Check role value
            if (req.body.roles == 7) {
                if (!value) {
                    return Promise.reject('Wilayah harus Diisi');
                }
            }

            return true;
        }),
    ]
}

const updateUserValidation = () => {
    return [
        check('email', 'Email harus diisi').notEmpty(),
        check('email', 'Format email tidak sesuai').isEmail(),
        check('first_name', 'Nama depan harus diisi').notEmpty(),
        check('roles', 'Hak akses harus dipilih').notEmpty(),
    ]
}
const updateUserPasswordValidation = () => {
    return [
        check('password', 'Kata sandi harus diisi').notEmpty(),
        check('password', 'Kata sandi Anda harus setidaknya 10 karakter serta mengandung setidaknya satu huruf besar, satu huruf kecil, satu angka, dan satu karakter khusus.')
            .isLength({ min: 12, max: 32 })
            .matches(/^(?=.*[a-z]).{10,50}$/, "i")
            .matches(/^(?=.*[0-9]).{10,50}$/, "i")
            .matches(/^(?=.*[!@#$&*]).{10,50}$/, "i")
            .matches(/^(?=.*[A-Z]).{10,50}$/, "i")
    ]
}

module.exports = {
    createUserValidation,
    updateUserValidation,
    updateUserPasswordValidation
}