import { hashSync } from "bcrypt";
import { getConnection, getManager, getRepository } from "typeorm";
import Driver from "../../entity/driver";
import { responseError, responseSuccess } from "../../utils/response";
import { validate } from '../../middleware/validator';
import moment from "moment";

export const getListDriver = async (req, res) => {
    // RESPONSE
    let response = {}
    let statusCode = 500;

    // CREATE TYPEORM CONNECTION
    const connection = getManager();

    // USERS
    let {
        role
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

        let query = connection.createQueryBuilder(Driver, 'd')
            .select([
                `d.id AS id`,
                `d.name AS name`,
                `d.age AS age`,
                `d.phone_number AS phone_number`,
                `d.address AS address`,
                `d.active AS active`,
                `d.created_at AS created_at`,
                `d.updated_at AS updated_at`
            ])
            .where('d.deleted_at IS NULL');

        let report = await query
            .skip(from)
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
            driver: report ? report : [],
            paginator: paginator,
        };

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
        res.status(response.meta.code).send(response);
        res.end();
    }
}

export const getDetailDriver = async (req, res) => {
    // RESPONSE
    let response = {}
    let statusCode = 500;

    // CREATE TYPEORM CONNECTION
    const connection = getManager();

    // USERS
    let {
        role
    } = req.user;

    try {
        // Params
        let {
            id
        } = req.params;

        let query = connection.createQueryBuilder(Driver, 'd')
            .select([
                `d.id AS id`,
                `d.name AS name`,
                `d.age AS age`,
                `d.phone_number AS phone_number`,
                `d.address AS address`,
                `d.active AS active`,
                `d.created_at AS created_at`,
                `d.updated_at AS updated_at`
            ])
            .where('d.deleted_at IS NULL')
            .andWhere('d.id = :id', { id: id });

        let report = await query
            .getRawOne();

        if (!report) {
            statusCode = 404;
            throw new Error("Data tidak ditemukan.");
        }

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
        res.status(response.meta.code).send(response);
        res.end();
    }
}

export const createDriver = async (req, res) => {
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
        role
    } = req.user;

    try {
        const errors = await validate(req).array();
        if (errors.length > 0) {
            statusCode = 400;
            throw new Error(errors[0].msg)
        }

        // Request Body
        let { body } = req;

        // Create Data
        let data = {
            name: body.name,
            age: body.age,
            phone_number: body.phone_number,
            address: body.address,
            active: false,
            created_at: moment.utc(),
            updated_at: moment.utc()
        }

        let storeDriver = await queryRunner.manager
            .getRepository(Driver)
            .save(data);

        if (!storeDriver) {
            throw new Error('Fail to create data.');
        }

        // COMMIT TRANSACTION
        await queryRunner.commitTransaction();

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

        // RESPONSE
        res.status(response.meta.code).send(response);
        res.end();
    }

}

export const updateDriver = async (req, res) => {
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
        role
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
        let driver = await queryRunner.manager
            .findOne(Driver, { id: params.id, deleted_at: null });

        if (!driver) {
            statusCode = 404;
            throw new Error('Data tidak ditemukan.');
        }

        // Create Data
        let dataUpdated = {
            ...driver,
            name: body.name,
            age: body.age,
            phone_number: body.phone_number,
            address: body.address,
            updated_at: moment.utc()
        }

        const updateDriver = await queryRunner.manager.save(Driver, dataUpdated);

        if (!updateDriver) {
            throw new Error('Fail to update data.');
        }

        // COMMIT TRANSACTION
        await queryRunner.commitTransaction();

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

        // RESPONSE
        res.status(response.meta.code).send(response);
        res.end();
    }

}

export const deleteDriver = async (req, res) => {
    // RESPONSE
    let response = {}
    let statusCode = 500;

    // CREATE TYPEORM CONNECTION
    const connection = getManager();

    // USERS
    let {
        id,
        role
    } = req.user;

    try {
        // Request Body
        let { params } = req;

        // Create Data
        let query = await connection.update(Driver, { id: params.id, deleted_at: null }, {
            deleted_at: moment()
        });

        if (!query) {
            throw new Error('Gagal menghapus data.');
        }

        if (query.affected === 0) {
            statusCode = 404;
            throw new Error('Data tidak ditemukan.');
        }

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
        res.status(response.meta.code).send(response);
        res.end();
    }
}