import { hashSync } from "bcrypt";
import { getConnection, getManager, getRepository } from "typeorm";
import Waste from "../../entity/waste";
import { responseError, responseSuccess } from "../../utils/response";
import { validate } from '../../middleware/validator';
import moment from "moment-timezone";
import WasteType from "../../entity/waste_type";
import { createActivityLog } from "./activity_log";

export const getListWasteType = async (req, res) => {
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
            keyword
        } = req.query;

        let query = connection.createQueryBuilder(WasteType, 'wt')
            .select([
                `wt.id AS id`,
                `wt.name AS name`,
                `wt.slug AS slug`
            ])
            .where('wt.deleted_at IS NULL');

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

export const getListWaste = async (req, res) => {
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

        let query = connection.createQueryBuilder(Waste, 'w')
            .select([
                `w.id AS id`,
                `w.name AS name`,
                `w.waste_code AS waste_code`,
                `w.weight_unit AS weight_unit`,
                `w.price_unit AS price_unit`,
                `w.created_at AS created_at`,
                `w.updated_at AS updated_at`,
                `wt.name AS type`,
                `w.updated_at AS updated_at`
            ])
            .leftJoin(WasteType, 'wt', 'wt.id = w.waste_type_id')
            .where('w.deleted_at IS NULL');

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
            waste: report ? report : [],
            paginator: paginator,
        };

        // Activity Log
        const messageLog = `Limbah berhasil diakses oleh ${username}.`;
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
        const messageLog = `Limbah gagal diakses oleh ${username}.`;
        createActivityLog(req, messageLog);

        res.status(response.meta.code).send(response);
        res.end();
    }
}

export const getDetailWaste = async (req, res) => {
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

        let query = connection.createQueryBuilder(Waste, 'w')
            .select([
                `w.id AS id`,
                `w.name AS name`,
                `w.waste_code AS waste_code`,
                `w.weight_unit AS weight_unit`,
                `w.price_unit AS price_unit`,
                `w.created_at AS created_at`,
                `w.updated_at AS updated_at`,
                `wt.id AS waste_type_id`,
                `wt.name AS type`
            ])
            .leftJoin(WasteType, 'wt', 'wt.id = w.waste_type_id')
            .where('w.deleted_at IS NULL')
            .andWhere('w.id = :id', { id: id });

        let report = await query
            .getRawOne();

        if (!report) {
            statusCode = 404;
            throw new Error("Data tidak ditemukan.");
        }

        // Activity Log
        const messageLog = `Detail Limbah berhasil diakses oleh ${username}.`;
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
        const messageLog = `Detail Limbah gagal diakses oleh ${username}.`;
        createActivityLog(req, messageLog);

        res.status(response.meta.code).send(response);
        res.end();
    }
}

export const createWaste = async (req, res) => {
    let response = {};
    let statusCode = 500;

    const connection = getConnection();
    const queryRunner = connection.createQueryRunner();

    await queryRunner.startTransaction();

    const { id, role, username } = req.user;

    try {
        const errors = await validate(req).array();
        if (errors.length > 0) {
            statusCode = 400;
            throw new Error(errors[0].msg);
        }

        // Check if waste code exists
        console.log("Checking waste code:", req.body.code);
        const checkCode = await queryRunner.manager.findOne(Waste, {
            where: { waste_code: req.body.code, deleted_at: null }
        });

        if (checkCode) {
            statusCode = 400;
            throw new Error("Kode limbah sudah tersedia.");
        }

        // Create Data
        const data = {
            name: req.body.name,
            waste_code: req.body.code,
            waste_type_id: req.body.type,
            weight_unit: req.body.weight_unit,
            price_unit: req.body.price_unit,
            created_at: moment.utc(),
            updated_at: moment.utc()
        };

        const storeWaste = await queryRunner.manager.getRepository(Waste).save(data);
        if (!storeWaste) {
            throw new Error('Fail to create data.');
        }

        await queryRunner.commitTransaction();
        await queryRunner.release();

        // Activity Log
        const messageLog = `Berhasil menambahkan data limbah oleh ${username}.`;
        createActivityLog(req, messageLog);

        response = responseSuccess(200, "Success!");
        res.status(response.meta.code).send(response);

    } catch (error) {
        console.error("Error occurred:", error);
        await queryRunner.rollbackTransaction();
        await queryRunner.release();

        const messageLog = `Gagal menambahkan data limbah oleh ${username}.`;
        createActivityLog(req, messageLog);

        response = (statusCode !== 500) ? responseError(statusCode, error) : responseError(500, 'Terjadi kesalahan pada server.');
        res.status(response.meta.code).send(response);
    }
}


export const updateWaste = async (req, res) => {
    // RESPONSE
    let response = {};
    let statusCode = 500;

    // CREATE TYPEORM CONNECTION
    const connection = getConnection();
    const queryRunner = connection.createQueryRunner();

    await queryRunner.startTransaction();

    // USERS
    let { id, role, username } = req.user;

    try {
        const errors = await validate(req).array();
        if (errors.length > 0) {
            statusCode = 400;
            throw new Error(errors[0].msg);
        }

        // // Cek Kode Limbah
        // let checkCode = await queryRunner.manager.findOne(Waste, {
        //     where: {
        //         waste_code: req.body.code,
        //         deleted_at: null
        //     }
        // });

        // // Jika kode limbah sudah ada, kirimkan informasi kode limbah yang sudah ada
        // if (checkCode) {
        //     statusCode = 400;
        //     throw new Error(`Kode limbah sudah tersedia: ${checkCode.waste_code}`);
        // }

        // Request Body
        let { body, params } = req;

        // Get Existing Data
        let waste = await queryRunner.manager.findOne(Waste, { where: { id: params.id, deleted_at: null } });

        if (!waste) {
            statusCode = 404;
            throw new Error('Data tidak ditemukan.');
        }

        // Create Data
        let dataUpdated = {
            ...waste,
            name: body.name,
            waste_code: body.code,
            waste_type_id: body.type,
            weight_unit: body.weight_unit,
            price_unit: body.price_unit,
            updated_at: moment.utc()
        };

        const updateWaste = await queryRunner.manager.save(Waste, dataUpdated);

        if (!updateWaste) {
            throw new Error('Gagal memperbarui data.');
        }

        // COMMIT TRANSACTION
        await queryRunner.commitTransaction();
        await queryRunner.release();

        // Activity Log
        const messageLog = `Berhasil memperbaharui data limbah oleh ${username}.`;
        createActivityLog(req, messageLog);

        // RESPONSE
        response = responseSuccess(200, "Success!");

        res.status(response.meta.code).send(response);
        res.end();
    } catch (error) {
        if (statusCode !== 500) {
            response = responseError(statusCode, error.message);
        } else {
            console.log(error);
            response = responseError(500, 'Terjadi kesalahan pada server.');
        }

        // Activity Log
        const messageLog = `Gagal memperbaharui data limbah oleh ${username}.`;
        createActivityLog(req, messageLog);

        // ROLLBACK TRANSACTION
        await queryRunner.rollbackTransaction();
        await queryRunner.release();

        // RESPONSE
        res.status(response.meta.code).send(response);
        res.end();
    }
};


export const deleteWaste = async (req, res) => {
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
        let query = await connection.update(Waste, { id: params.id }, {
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
        const messageLog = `Berhasil menghapus data limbah oleh ${username}.`;
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
        const messageLog = `Gagal menghapus data limbah oleh ${username}.`;
        createActivityLog(req, messageLog);

        res.status(response.meta.code).send(response);
        res.end();
    }
}