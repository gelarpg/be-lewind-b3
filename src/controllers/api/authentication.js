
import { getManager } from "typeorm";
import Users from '../../entity/users';
import { validate } from '../../middleware/validator';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { responseError, responseSuccess } from "../../utils/response";

export const login = async (req, res) => {
    // RESPONSE
    let response = {}
    let statusCode = 500;

    // CREATE TYPEORM CONNECTION
    const connection = getManager();

    try {
        const errors = await validate(req).array();
        if (errors.length > 0) {
            statusCode = 400;
            throw new Error(errors[0].msg)
        }

        // Request Body
        let {
            email,
            password,
            remember
        } = req.body;

        // Get Users
        let user = await connection.createQueryBuilder(Users, 'u')
            .select([
                `u.id AS id`,
                `u.email AS email`,
                `u.password AS password`,
                `u.first_name AS first_name`,
                `u.last_name AS last_name`,
                `u.active AS active`,
                `u.created_at AS created_at`,
                `u.updated_at AS updated_at`
            ])
            .leftJoinAndSelect('u.roles', 'roles')
            .where('u.email = :email', { email: email })
            .andWhere('u.deleted_at IS NULL')
            .getRawOne();

        if (!user) {
            statusCode = 400;
            throw new Error("Email atau password anda salah !")
        }

        if (!await bcrypt.compare(password, user.password)) {
            statusCode = 400;
            throw new Error("Email atau password anda salah !")
        }

        // Create token
        const jwtBody = {
            user_id: user.id,
            role: user.roles_slug,
            email
        }
        const token = jwt.sign(jwtBody, process.env.TOKEN_KEY, {
            expiresIn: remember ? "1d" : "2h",
        });

        let result = {
            token: token
        }

        response = responseSuccess(200, "Success!", result);

        res.status(response.meta.code).send(response);
        res.end();
    } catch (error) {
        if (statusCode != 500) {
            response = responseError(statusCode, error);
        } else {
            console.log(error);
            response = responseError(500, 'Internal server error.')
        }
        res.status(response.meta.code).send(response);
        res.end();
    }
}