import { getConnection, getManager } from "typeorm";
import { responseError, responseSuccess } from "../../utils/response";
import { validate } from '../../middleware/validator';
import moment from "moment";
import TransportationType from "../../entity/transportation_type";
import Transportation from "../../entity/transportation";
import TransportationDocuments from "../../entity/transportation_documents";
import { checkAndCreateDirectory } from "../../middleware/helper";
import fs from 'fs';
import TransportationLicense from "../../entity/transportation_license";

export const getListTransportationLicense = async (req, res) => {
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

        let query = connection.createQueryBuilder(TransportationLicense, 'l')
            .select([
                `l.id AS id`,
                `t.name AS name`,
                `t.no_police AS no_police`,
                `l.validity_period_stnk AS validity_period_stnk`,
                `l.validity_period_kir AS validity_period_kir`,
                `l.validity_period_rekom AS validity_period_rekom`,
                `l.validity_period_supervision_card AS validity_period_supervision_card`,
                `l.validity_period_departement_permit AS validity_period_departement_permit`
            ])
            .leftJoin(Transportation, 't', 't.id = l.transportation_id')
            .where('l.deleted_at IS NULL');

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
            transportation_license: report ? report : [],
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

export const getDetailTransportationLicense = async (req, res) => {
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

        let query = connection.createQueryBuilder(TransportationLicense, 'l')
            .select([
                `l.id AS id`,
                `t.id AS transportation_id`,
                `t.name AS name`,
                `t.no_police AS no_police`,
                `l.validity_period_stnk AS validity_period_stnk`,
                `l.validity_period_kir AS validity_period_kir`,
                `l.validity_period_rekom AS validity_period_rekom`,
                `l.validity_period_supervision_card AS validity_period_supervision_card`,
                `l.validity_period_departement_permit AS validity_period_departement_permit`,
                `l.attachment_kir AS attachment_kir`,
                `l.attachment_stnk AS attachment_stnk`,
                `l.attachment_rekom AS attachment_rekom`,
                `l.attachment_supervision_card AS attachment_supervision_card`,
                `l.attachment_departement_permit AS attachment_departement_permit`,
                `l.created_at AS created_at`,
                `l.updated_at AS updated_at`
            ])
            .leftJoin(Transportation, 't', 't.id = l.transportation_id')
            .where('l.deleted_at IS NULL')
            .andWhere('l.id = :id', { id: id });

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

export const createTransportationLicense = async (req, res) => {
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
            transportation_id: body.transportation_id,
            validity_period_stnk: moment(body.validity_period_kir),
            validity_period_kir: moment(body.validity_period_kir),
            validity_period_rekom: moment(body.validity_period_rekom),
            validity_period_supervision_card: moment(body.validity_period_supervision_card),
            validity_period_departement_permit: moment(body.validity_period_departement_permit),
            created_at: moment.utc(),
            updated_at: moment.utc()
        }

        // MAPPING TRANSPORTATION LICENSE DOCUMENT
        let directory = `public/api/upload/attachments/transportation/${body.transportation_id}`;
        let directoryResult = `/api/upload/attachments/transportation/${body.transportation_id}`;

        checkAndCreateDirectory(directory);

        // STNK
        if (body.attachment_stnk) {
            let attachment_stnk = body.attachment_stnk;
            let attachment_stnk_name = attachment_stnk.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
            fs.renameSync('./tmp/' + attachment_stnk, directory + '/' + attachment_stnk_name);

            data['attachment_stnk'] = directoryResult + '/' + attachment_stnk_name;
        }

        // KIR
        if (body.attachment_kir) {
            let attachment_kir = body.attachment_kir;
            let attachment_kir_name = attachment_kir.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
            fs.renameSync('./tmp/' + attachment_kir, directory + '/' + attachment_kir_name);

            data['attachment_kir'] = directoryResult + '/' + attachment_kir_name;
        }

        // REKOM
        if (body.attachment_rekom) {
            let attachment_rekom = body.attachment_rekom;
            let attachment_rekom_name = attachment_rekom.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
            fs.renameSync('./tmp/' + attachment_rekom, directory + '/' + attachment_rekom_name);

            data['attachment_rekom'] = directoryResult + '/' + attachment_rekom_name;
        }

        // SUPERVISON CARD
        if (body.attachment_supervision_card) {
            let attachment_supervision_card = body.attachment_supervision_card;
            let attachment_supervision_card_name = attachment_supervision_card.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
            fs.renameSync('./tmp/' + attachment_supervision_card, directory + '/' + attachment_supervision_card_name);

            data['attachment_supervision_card'] = directoryResult + '/' + attachment_supervision_card_name;
        }

        // DEPARTEMENT PERMIT
        if (body.attachment_departement_permit) {
            let attachment_departement_permit = body.attachment_departement_permit;
            let attachment_departement_permit_name = attachment_departement_permit.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
            fs.renameSync('./tmp/' + attachment_departement_permit, directory + '/' + attachment_departement_permit_name);

            data['attachment_departement_permit'] = directoryResult + '/' + attachment_departement_permit_name;
        }

        let storeTransportationLicense = await queryRunner.manager
            .getRepository(TransportationLicense)
            .save(data);

        if (!storeTransportationLicense) {
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

export const updateTransportationLicense = async (req, res) => {
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
        let transportationLicense = await queryRunner.manager
            .findOne(TransportationLicense, { id: params.id, deleted_at: null });

        if (!transportationLicense) {
            statusCode = 404;
            throw new Error('Data tidak ditemukan.');
        }

        // Create Data
        let dataUpdated = {
            ...transportationLicense,
            transportation_id: body.transportation_id,
            validity_period_stnk: moment(body.validity_period_stnk),
            validity_period_kir: moment(body.validity_period_kir),
            validity_period_rekom: moment(body.validity_period_rekom),
            validity_period_supervision_card: moment(body.validity_period_supervision_card),
            validity_period_departement_permit: moment(body.validity_period_departement_permit),
            updated_at: moment.utc()
        }

        // MAPPING TRANSPORTATION LICENSE DOCUMENT
        let directory = `public/api/upload/attachments/transportation/${body.transportation_id}`;
        let directoryResult = `/api/upload/attachments/transportation/${body.transportation_id}`;

        checkAndCreateDirectory(directory);

        // KIR
        if (body.attachment_kir) {
            let attachment_kir = body.attachment_kir;
            let attachment_kir_name = attachment_kir.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
            fs.renameSync('./tmp/' + attachment_kir, directory + '/' + attachment_kir_name);

            dataUpdated['attachment_kir'] = directoryResult + '/' + attachment_kir_name;
        }

        // REKOM
        if (body.attachment_rekom) {
            let attachment_rekom = body.attachment_rekom;
            let attachment_rekom_name = attachment_rekom.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
            fs.renameSync('./tmp/' + attachment_rekom, directory + '/' + attachment_rekom_name);

            dataUpdated['attachment_rekom'] = directoryResult + '/' + attachment_rekom_name;
        }

        // SUPERVISON CARD
        if (body.attachment_supervision_card) {
            let attachment_supervision_card = body.attachment_supervision_card;
            let attachment_supervision_card_name = attachment_supervision_card.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
            fs.renameSync('./tmp/' + attachment_supervision_card, directory + '/' + attachment_supervision_card_name);

            dataUpdated['attachment_supervision_card'] = directoryResult + '/' + attachment_supervision_card_name;
        }

        // DEPARTEMENT PERMIT
        if (body.attachment_departement_permit) {
            let attachment_departement_permit = body.attachment_departement_permit;
            let attachment_departement_permit_name = attachment_departement_permit.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
            fs.renameSync('./tmp/' + attachment_departement_permit, directory + '/' + attachment_departement_permit_name);

            dataUpdated['attachment_departement_permit'] = directoryResult + '/' + attachment_departement_permit_name;
        }

        const updateTransportationLicense = await queryRunner.manager.save(TransportationLicense, dataUpdated);

        if (!updateTransportationLicense) {
            throw new Error('Fail to update data.');
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

export const deleteTransportationLicense = async (req, res) => {
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
        let query = await connection.update(TransportationLicense, { id: params.id, deleted_at: null }, {
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