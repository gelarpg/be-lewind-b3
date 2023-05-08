import { check } from 'express-validator';

export const loginValidation = () => {
    return [
        check('username', 'Username harus diisi').notEmpty(),

        check('password', 'Kata sandi harus diisi').notEmpty(),
        check('password', 'Kata sandi Anda harus setidaknya 10 karakter serta mengandung setidaknya satu huruf besar, satu huruf kecil, satu angka, dan satu karakter khusus.')
            .isLength({ min: 12, max: 32 })
            .matches(/^(?=.*[a-z]).{10,50}$/, "i")
            .matches(/^(?=.*[0-9]).{10,50}$/, "i")
            .matches(/^(?=.*[!@#$&*]).{10,50}$/, "i")
            .matches(/^(?=.*[A-Z]).{10,50}$/, "i")
    ]
}