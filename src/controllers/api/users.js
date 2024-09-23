import { hashSync } from "bcrypt";
import { getConnection, getManager, getRepository } from "typeorm";
import Users from "../../entity/users";
import { responseError, responseSuccess } from "../../utils/response";
import { validate } from '../../middleware/validator';
import Roles from "../../entity/roles";
import moment from "moment-timezone";
import { createActivityLog } from "./activity_log";

export const getListUsers = async (req, res) => {
    // RESPONSE
    let response = {}
    let statusCode = 500;

    // CREATE TYPEORM CONNECTION
    const connection = getManager();

    // USERS
    let {
        role,
        username
    } = req.user;

    try {
        // Query Params (Pagination)
        let {
            limit,
            page,
            keyword
        } = req.query;

        limit = limit ? parseInt(limit) : 10;
        page = page ? parseInt(page) : 1;
        const from = page == 1 ? 0 : page * limit - limit;

        let query = connection.createQueryBuilder(Users, 'u')
            .select([
                `u.id AS id`,
                `u.email AS email`,
                `u.first_name AS first_name`,
                `u.last_name AS last_name`,
                `u.active AS active`,
                `u.created_at AS created_at`,
                `u.updated_at AS updated_at`
            ])
            .leftJoinAndSelect('u.roles', 'roles')
            .where('u.deleted_at IS NULL');

        let report = await query
            .offset(from)
            .limit(limit)
            .getRawMany();

        // Create paginator
        let count = await query.getCount();
        let pageCount = Math.ceil(count / limit);
        let slNo = page == 1 ? 0 : page * limit - 1;

        let paginator = {
            itemCount: count,
            limit: limit,
            pageCount: pageCount,
            page: page,
            slNo: slNo + 1,
            hasPrevPage: page > 1 ? true : false,
            hasNextPage: page < pageCount ? true : false,
            prevPage: page > 1 && page != 1 ? page - 1 : null,
            nextPage: page < pageCount ? page + 1 : null,
        };

        let result = {
            users: report ? report : [],
            paginator: paginator,
        };

        // Activity Log
        const messageLog = `Users berhasil diakses oleh ${username}.`;
        createActivityLog(req, messageLog);

        response = responseSuccess(200, "Success!", result);

        res.status(response.meta.code).send(response);
        res.end();
    } catch (error) {
        if (statusCode != 500) {
            response = responseError(statusCode, error);
        } else {
            console.log('ERROR: ', error);
            response = responseError(500, 'Internal server error.')
        }

        // Activity Log
        const messageLog = `Users gagal diakses oleh ${username}.`;
        createActivityLog(req, messageLog);

        res.status(response.meta.code).send(response);
        res.end();
    }
}

export const getDetailUsers = async (req, res) => {
    // RESPONSE
    let response = {}
    let statusCode = 500;

    // CREATE TYPEORM CONNECTION
    const connection = getManager();

    // USERS
    let {
        role,
        username
    } = req.user;

    try {
        // Params
        let {
            id
        } = req.params;

        let query = connection.createQueryBuilder(Users, 'u')
            .select([
                `u.id AS id`,
                `u.email AS email`,
                `u.first_name AS first_name`,
                `u.last_name AS last_name`,
                `u.active AS active`,
                `u.created_at AS created_at`,
                `u.updated_at AS updated_at`
            ])
            .leftJoinAndSelect('u.roles', 'roles')
            .where('u.deleted_at IS NULL')
            .andWhere('u.id = :id', { id: id });

        let report = await query
            .getRawOne();

        if (!report) {
            statusCode = 404;
            throw new Error("Data tidak ditemukan.");
        }

        // Activity Log
        const messageLog = `Detail Users berhasil diakses oleh ${username}.`;
        createActivityLog(req, messageLog);

        response = responseSuccess(200, "Success!", report);

        res.status(response.meta.code).send(response);
        res.end();
    } catch (error) {
        if (statusCode != 500) {
            response = responseError(statusCode, error);
        } else {
            console.log('ERROR: ', error);
            response = responseError(500, 'Terjadi kesalahan pada server.')
        }

        // Activity Log
        const messageLog = `Detail Users gagal diakses oleh ${username}.`;
        createActivityLog(req, messageLog);

        res.status(response.meta.code).send(response);
        res.end();
    }
}

export const createUsers = async (req, res) => {
    // RESPONSE
    let response = {}
    let statusCode = 500;

    // CREATE TYPEORM CONNECTION
    const connection = getConnection();
    const queryRunner = connection.createQueryRunner();

    await queryRunner.startTransaction();

    // USERS
    let {
        id,
        role,
        username
    } = req.user;

    try {
        const errors = await validate(req).array();
        if (errors.length > 0) {
            statusCode = 400;
            throw new Error(errors[0].msg)
        }

        // Request Body
        let { body } = req;

        const dbRole = getRepository(Roles);
        const roleUser = await dbRole.findOne({ where:{id: body.roles} });

        // Query Params
        let {
            type
        } = req.params;

        // Create Data
        let data = {
            email: body.email,
            first_name: body.first_name,
            last_name: body.last_name,
            roles: [roleUser],
            active: true,
            password: hashSync(body.password, 13),
            created_at: moment.utc(),
            updated_at: moment.utc()
        }

        let storeUsers = await queryRunner.manager
            .getRepository(Users)
            .save(data);

        if (!storeUsers) {
            throw new Error('Fail to create data.');
        }

        // COMMIT TRANSACTION
        await queryRunner.commitTransaction();
        await queryRunner.release();

        // Activity Log
        const messageLog = `Berhasil menambahkan data user oleh ${username}.`;
        createActivityLog(req, messageLog);

        // RESPONSE
        response = responseSuccess(200, "Success!");

        res.status(response.meta.code).send(response);
        res.end();
    } catch (error) {
        if (statusCode != 500) {
            response = responseError(statusCode, error);
        } else {
            console.log(error);
            response = responseError(500, 'Terjadi kesalahan pada server.')
        }
        // COMMIT TRANSACTION
        await queryRunner.rollbackTransaction();
        await queryRunner.release();

        // Activity Log
        const messageLog = `Gagal menambahkan data user oleh ${username}.`;
        createActivityLog(req, messageLog);

        // RESPONSE
        res.status(response.meta.code).send(response);
        res.end();
    }

}

export const updateUsers = async (req, res) => {
    // RESPONSE
    let response = {}
    let statusCode = 500;

    // CREATE TYPEORM CONNECTION
    const connection = getConnection();
    const queryRunner = connection.createQueryRunner();

    await queryRunner.startTransaction();

    // USERS
    let {
        id,
        role,
        username
    } = req.user;

    try {
        const errors = await validate(req).array();
        if (errors.length > 0) {
            statusCode = 400;
            throw new Error(errors[0].msg)
        }

        // Request Body
        let { body, params } = req;

        // Get Existing Data
        let users = await queryRunner.manager
            .findOne(Users, { where:{id: params.id, deleted_at: null} });

        if (!users) {
            statusCode = 404;
            throw new Error('Data tidak ditemukan.');
        }

        const dbRole = getRepository(Roles);
        const roleUser = await dbRole.findOne({ where:{id: body.roles} });

        // Create Data
        let dataUpdated = {
            ...users,
            email: body.email,
            first_name: body.first_name,
            last_name: body.last_name,
            roles: [roleUser]
        }

        const updateUsers = await queryRunner.manager.save(Users, dataUpdated);

        if (!updateUsers) {
            throw new Error('Fail to create data.');
        }

        // COMMIT TRANSACTION
        await queryRunner.commitTransaction();
        await queryRunner.release();

        // Activity Log
        const messageLog = `Berhasil memperbaharui data user oleh ${username}.`;
        createActivityLog(req, messageLog);

        // RESPONSE
        response = responseSuccess(200, "Success!");

        res.status(response.meta.code).send(response);
        res.end();
    } catch (error) {
        if (statusCode != 500) {
            response = responseError(statusCode, error);
        } else {
            console.log(error);
            response = responseError(500, 'Terjadi kesalahan pada server.')
        }
        // COMMIT TRANSACTION
        await queryRunner.rollbackTransaction();
        await queryRunner.release();


        // Activity Log
        const messageLog = `Gagal memperbaharui data user oleh ${username}.`;
        createActivityLog(req, messageLog);

        // RESPONSE
        res.status(response.meta.code).send(response);
        res.end();
    }

}

export const deleteUsers = async (req, res) => {
    // RESPONSE
    let response = {}
    let statusCode = 500;

    // CREATE TYPEORM CONNECTION
    const connection = getManager();

    // USERS
    let {
        id,
        role,
        username
    } = req.user;

    try {
        // Request Body
        let { params } = req;

        // Create Data
        let query = await connection.update(Users, { id: params.id }, {
            deleted_at: moment()
        });

        if (!query) {
            throw new Error('Gagal menghapus data.');
        }

        if (query.affected === 0) {
            statusCode = 404;
            throw new Error('Data tidak ditemukan.');
        }

        // Activity Log
        const messageLog = `Berhasil menghapus data user oleh ${username}.`;
        createActivityLog(req, messageLog);

        response = responseSuccess(200, "Success!");

        res.status(response.meta.code).send(response);
        res.end();
    } catch (error) {
        if (statusCode != 500) {
            response = responseError(statusCode, error);
        } else {
            console.log(error);
            response = responseError(500, 'Terjadi kesalahan pada server.')
        }

        // Activity Log
        const messageLog = `Gagal menghapus data user oleh ${username}.`;
        createActivityLog(req, messageLog);

        res.status(response.meta.code).send(response);
        res.end();
    }
}

export const updateUsersPassword = async (req, res) => {
    // RESPONSE
    let response = {}
    let statusCode = 500;

    // CREATE TYPEORM CONNECTION
    const connection = getConnection();
    const queryRunner = connection.createQueryRunner();

    await queryRunner.startTransaction();

    // USERS
    let {
        id,
        role,
        username
    } = req.user;

    try {
        const errors = await validate(req).array();
        if (errors.length > 0) {
            statusCode = 400;
            throw new Error(errors[0].msg)
        }

        // Request Body
        let { body, params } = req;

        // Get Existing Data
        let users = await queryRunner.manager
            .findOne(Users, { id: params.id, deleted_at: null });

        if (!users) {
            statusCode = 404;
            throw new Error('Data tidak ditemukan.');
        }

        // Create Data
        let dataUpdated = {
            ...users,
            password: hashSync(body.password, 13),
        }

        const updateUsers = await queryRunner.manager.save(Users, dataUpdated);

        if (!updateUsers) {
            throw new Error('Fail to create data.');
        }

        // COMMIT TRANSACTION
        await queryRunner.commitTransaction();
        await queryRunner.release();

        // RESPONSE
        response = responseSuccess(200, "Success!");

        res.status(response.meta.code).send(response);
        res.end();
    } catch (error) {
        if (statusCode != 500) {
            response = responseError(statusCode, error);
        } else {
            console.log(error);
            response = responseError(500, 'Terjadi kesalahan pada server.')
        }
        // COMMIT TRANSACTION
        await queryRunner.rollbackTransaction();
        await queryRunner.release();

        // RESPONSE
        res.status(response.meta.code).send(response);
        res.end();
    }

}