import { getConnection, getManager } from "typeorm";
import { responseError, responseSuccess } from "../../utils/response";
import { validate } from '../../middleware/validator';
import moment from "moment";
import TransportationType from "../../entity/transportation_type";
import Transportation from "../../entity/transportation";
import TransportationDocuments from "../../entity/transportation_documents";

export const getListTransportationType = async (req, res) => {
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
            keyword
        } = req.query;

        let query = connection.createQueryBuilder(TransportationType, 'tp')
            .select([
                `tp.id AS id`,
                `tp.name AS name`,
                `tp.slug AS slug`
            ])
            .where('tp.deleted_at IS NULL');

        let report = await query
            .getRawMany();

        response = responseSuccess(200, "Success!", report);

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

export const getListTransportation = async (req, res) => {
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

        let query = connection.createQueryBuilder(Transportation, 't')
            .select([
                `t.id AS id`,
                `t.name AS name`,
                `t.no_police AS no_police`,
                `t.year AS year`,
                `t.capacity AS capacity`,
                `t.fuel_type AS fuel_type`,
                `t.active AS active`,
                `t.created_at AS created_at`,
                `t.updated_at AS updated_at`,
                `tp.name AS transportation_type`,
            ])
            .leftJoin(TransportationType, 'tp', 'tp.id = t.transportation_type_id')
            .where('t.deleted_at IS NULL');

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
            transportation: report ? report : [],
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

export const getDetailTransportation = async (req, res) => {
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

        let query = connection.createQueryBuilder(Transportation, 'd')
            .select([
                `t.id AS id`,
                `t.name AS name`,
                `t.no_police AS no_police`,
                `t.year AS year`,
                `t.capacity AS capacity`,
                `t.fuel_type AS fuel_type`,
                `t.active AS active`,
                `t.created_at AS created_at`,
                `t.updated_at AS updated_at`,
                `tp.name AS transportation_type`,
            ])
            .leftJoin(TransportationType, 'tp', 'tp.id = t.transportation_type_id')
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

export const createTransportation = async (req, res) => {
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
            transportation_type_id: body.transportation_type_id,
            no_police: body.no_police,
            year: body.year,
            capacity: body.capacity,
            fuel_type: body.fuel_type,
            active: false,
            created_at: moment.utc(),
            updated_at: moment.utc()
        }

        let storeTransportation = await queryRunner.manager
            .getRepository(Transportation)
            .save(data);

        if (!storeTransportation) {
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

export const updateTransportation = async (req, res) => {
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
        let transportation = await queryRunner.manager
            .findOne(Transportation, { id: params.id, deleted_at: null });

        if (!transportation) {
            statusCode = 404;
            throw new Error('Data tidak ditemukan.');
        }

        // Create Data
        let dataUpdated = {
            ...transportation,
            name: body.name,
            transportation_type_id: body.transportation_type_id,
            no_police: body.no_police,
            year: body.year,
            capacity: body.capacity,
            fuel_type: body.fuel_type,
            updated_at: moment.utc()
        }

        const updateTransportation = await queryRunner.manager.save(Transportation, dataUpdated);

        if (!updateTransportation) {
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

export const deleteTransportation = async (req, res) => {
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
        let query = await connection.update(Transportation, { id: params.id, deleted_at: null }, {
            deleted_at: moment()
        });

        if (!query) {
            throw new Error('Gagal menghapus data.');
        }

        if (query.affected === 0) {
            statusCode = 404;
            throw new Error('Data tidak ditemukan.');
        }

        await connection.update(TransportationDocuments, { transportation_id: params.id, deleted_at: null }, {
            deleted_at: moment()
        });

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