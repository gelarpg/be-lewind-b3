import { getConnection, getManager } from "typeorm";
import { responseError, responseSuccess } from "../../utils/response";
import { validate } from '../../middleware/validator';
import moment from "moment";
import TransportationType from "../../entity/transportation_type";
import Transportation from "../../entity/transportation";
import TransportationDocuments from "../../entity/transportation_documents";
import { checkAndCreateDirectory } from "../../middleware/helper";
import fs from 'fs';

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
                `t.validity_period_kir AS validity_period_kir`,
                `t.validity_period_rekom AS validity_period_rekom`,
                `t.validity_period_supervision_card AS validity_period_supervision_card`,
                `t.validity_period_departement_permit AS validity_period_departement_permit`,
                `t.created_at AS created_at`,
                `t.updated_at AS updated_at`,
                `tp.name AS transportation_type`,
            ])
            .leftJoin(TransportationType, 'tp', 'tp.id = t.transportation_type_id')
            .where('t.deleted_at IS NULL');

        let report = await query
            .offset(from)
            .limit(limit)
            .getRawMany();

        console.log(from, limit);

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

        let query = connection.createQueryBuilder(Transportation, 't')
            .select([
                `t.id AS id`,
                `t.name AS name`,
                `t.no_police AS no_police`,
                `t.year AS year`,
                `t.capacity AS capacity`,
                `t.fuel_type AS fuel_type`,
                `t.active AS active`,
                `t.validity_period_kir AS validity_period_kir`,
                `t.validity_period_rekom AS validity_period_rekom`,
                `t.validity_period_supervision_card AS validity_period_supervision_card`,
                `t.validity_period_departement_permit AS validity_period_departement_permit`,
                `t.created_at AS created_at`,
                `t.updated_at AS updated_at`,
                `tp.name AS transportation_type`,
                `tp.id AS transportation_type_id`,
            ])
            .leftJoin(TransportationType, 'tp', 'tp.id = t.transportation_type_id')
            .where('t.deleted_at IS NULL')
            .andWhere('t.id = :id', { id: id });

        let report = await query
            .getRawOne();

        if (!report) {
            statusCode = 404;
            throw new Error("Data tidak ditemukan.");
        }

        let documents = await connection.createQueryBuilder(TransportationDocuments, 'td')
            .select([
                `td.id AS id`,
                `td.type AS type`,
                `td.path AS path`,
                `td.doc_number AS doc_number`,
                `td.validity_period AS validity_period`,
                `td.created_at AS created_at`,
                `td.updated_at AS updated_at`
            ])
            .where('td.deleted_at IS NULL')
            .andWhere('td.transportation_id = :tid', { tid: report.id })
            .getRawMany();

        report['documents'] = documents;

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
            validity_period_kir: moment(body.validity_period_kir),
            validity_period_rekom: moment(body.validity_period_rekom),
            validity_period_supervision_card: moment(body.validity_period_supervision_card),
            validity_period_departement_permit: moment(body.validity_period_departement_permit),
            created_at: moment.utc(),
            updated_at: moment.utc()
        }

        let storeTransportation = await queryRunner.manager
            .getRepository(Transportation)
            .save(data);

        if (!storeTransportation) {
            throw new Error('Fail to create data.');
        }

        // MAPPING TRANSPORTATION DOCUMENT
        let transaportation_documents = [];
        let directory = `public/api/upload/attachments/transportation/${storeTransportation.id}`;
        let directoryResult = `/api/upload/attachments/transportation/${storeTransportation.id}`;

        checkAndCreateDirectory(directory);

        // STNK
        let stnk_file = body.stnk_file;
        let stnk_file_name = stnk_file.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
        fs.renameSync('./tmp/' + stnk_file, directory + '/' + stnk_file_name);

        transaportation_documents.push({
            transportation_id: storeTransportation.id,
            type: 'stnk',
            doc_number: body.stnk_number,
            validity_period: moment(body.stnk_validity_period),
            path: directoryResult + '/' + stnk_file_name,
            created_at: moment(),
            updated_at: moment()
        });

        // Travel Document
        let travel_document_file = body.travel_document_file;
        let travel_document_file_name = travel_document_file.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
        fs.renameSync('./tmp/' + travel_document_file, directory + '/' + travel_document_file_name);

        transaportation_documents.push({
            transportation_id: storeTransportation.id,
            type: 'travel_document',
            doc_number: body.travel_document_number,
            path: directoryResult + '/' + travel_document_file_name,
            created_at: moment(),
            updated_at: moment()
        });

        let storeTransportationDocuments = await queryRunner.manager
            .getRepository(TransportationDocuments)
            .save(transaportation_documents);

        if (!storeTransportationDocuments) {
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
            validity_period_kir: moment(body.validity_period_kir),
            validity_period_rekom: moment(body.validity_period_rekom),
            validity_period_supervision_card: moment(body.validity_period_supervision_card),
            validity_period_departement_permit: moment(body.validity_period_departement_permit),
            updated_at: moment.utc()
        }

        const updateTransportation = await queryRunner.manager.save(Transportation, dataUpdated);

        if (!updateTransportation) {
            throw new Error('Fail to update data.');
        }

        // MAPPING TRANSPORTATION DOCUMENT
        let transaportation_documents = [];
        let updated_docs = [];
        let directory = `public/api/upload/attachments/transportation/${transportation.id}`;
        let directoryResult = `/api/upload/attachments/transportation/${transportation.id}`;

        checkAndCreateDirectory(directory);

        // STNK
        if (body.stnk_file || body.stnk_number || body.stnk_validity_period) {
            let stnk_file_name = null;
            if (body.stnk_file) {
                if (fs.existsSync('./tmp/' + body.stnk_file)) {
                    let stnk_file = body.stnk_file;
                    stnk_file_name = stnk_file.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
                    fs.renameSync('./tmp/' + stnk_file, directory + '/' + stnk_file_name);
                } else {
                    statusCode = 400;
                    throw new Error(`File dengan nama ${body.stnk_file} tidak tersedia.`);
                }
            }

            // Get Existing Data
            let transportationDocsSTNK = await queryRunner.manager
                .findOne(TransportationDocuments, { transportation_id: transportation.id, deleted_at: null, type: 'stnk' });

            transaportation_documents.push({
                transportation_id: transportation.id,
                type: 'stnk',
                doc_number: body.stnk_number ? body.stnk_number : transportationDocsSTNK.doc_number,
                validity_period: body.stnk_validity_period ? moment(body.stnk_validity_period) : transportationDocsSTNK.validity_period,
                path: stnk_file_name ? directoryResult + '/' + stnk_file_name : transportationDocsSTNK.path,
                created_at: moment(),
                updated_at: moment()
            });

            updated_docs.push('stnk');
        }

        // Travel Document
        if (body.travel_document_file || body.travel_document_number) {
            let travel_document_file_name = null;
            if (body.travel_document_file) {
                if (fs.existsSync('./tmp/' + body.travel_document_file)) {
                    let travel_document_file = body.travel_document_file;
                    travel_document_file_name = travel_document_file.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
                    fs.renameSync('./tmp/' + travel_document_file, directory + '/' + travel_document_file_name);
                } else {
                    statusCode = 400;
                    throw new Error(`File dengan nama ${body.travel_document_file} tidak tersedia.`);
                }
            }

            // Get Existing Data
            let transportationDocsTDocs = await queryRunner.manager
                .findOne(TransportationDocuments, { transportation_id: transportation.id, deleted_at: null, type: 'travel_document' });

            transaportation_documents.push({
                transportation_id: transportation.id,
                type: 'travel_document',
                doc_number: body.travel_document_number ? body.travel_document_number : transportationDocsTDocs.doc_number,
                path: travel_document_file_name ? directoryResult + '/' + travel_document_file_name : transportationDocsTDocs.path,
                created_at: moment(),
                updated_at: moment()
            });

            updated_docs.push('travel_document');
        }

        if (transaportation_documents.length > 0) {
            let dropExistingDocs = await queryRunner.manager
                .createQueryBuilder()
                .delete()
                .from(TransportationDocuments)
                .where('transportation_id = :id', { id: transportation.id })
                .andWhere('type IN (:...type)', { type: updated_docs })
                .execute();

            if (!dropExistingDocs) {
                throw new Error('Fail to update data.');
            }

            let transportationDocuments = await queryRunner.manager
                .getRepository(TransportationDocuments)
                .save(transaportation_documents);

            if (!transportationDocuments) {
                throw new Error('Fail to update data.');
            }
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