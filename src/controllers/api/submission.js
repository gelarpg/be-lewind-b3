import { hashSync } from "bcrypt";
import { getConnection, getManager, getRepository } from "typeorm";
import Submission from "../../entity/submission";
import { responseError, responseSuccess } from "../../utils/response";
import { validate } from '../../middleware/validator';
import moment from "moment";
import Transportation from "../../entity/transportation";
import Waste from "../../entity/waste";
import Driver from "../../entity/driver";
import Clients from "../../entity/clients";
import SubmissionStatus from "../../entity/submission_status";
import SubmissionDocuments from "../../entity/submission_documents";
import { checkAndCreateDirectory } from "../../middleware/helper";
import fs from 'fs';

export const getListSubmissionStatus = async (req, res) => {
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

        let query = connection.createQueryBuilder(SubmissionStatus, 'ss')
            .select([
                `ss.id AS id`,
                `ss.name AS name`,
                `ss.slug AS slug`
            ]);

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

export const getListSubmission = async (req, res) => {
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

        let query = connection.createQueryBuilder(Submission, 's')
            .select([
                `s.id AS id`,
                `s.period AS period`,
                `s.service_fee AS service_fee`,
                `s.status AS status`,
                `ss.name AS status_name`,
                `s.created_at AS created_at`,
                `s.updated_at AS updated_at`,
                `c.name AS client_name`,
                `d.name AS driver_name`,
                `t.name AS transportation_name`,
                `w.name AS waste_name`
            ])
            .leftJoin(Clients, 'c', 'c.id = s.client_id')
            .leftJoin(Waste, 'w', 'w.id = c.waste_id')
            .leftJoin(Driver, 'd', 'd.id = s.driver_id')
            .leftJoin(Transportation, 't', 't.id = s.transportation_id')
            .leftJoin(SubmissionStatus, 'ss', 'ss.id = s.status')
            .where('s.deleted_at IS NULL');

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
            submission: report ? report : [],
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

export const getDetailSubmission = async (req, res) => {
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

        let query = connection.createQueryBuilder(Submission, 's')
            .select([
                `s.id AS id`,
                `s.period AS period`,
                `s.service_fee AS service_fee`,
                `s.status AS status`,
                `s.created_at AS created_at`,
                `s.updated_at AS updated_at`,
                `c.id AS client_id`,
                `c.name AS client_name`,
                `c.address AS client_address`,
                `d.id AS driver_id`,
                `d.name AS driver_name`,
                `t.id AS transportation_id`,
                `t.name AS transportation_name`,
                `w.id AS waste_id`,
                `w.name AS waste_name`
            ])
            .leftJoin(Clients, 'c', 'c.id = s.client_id')
            .leftJoin(Waste, 'w', 'w.id = c.waste_id')
            .leftJoin(Driver, 'd', 'd.id = s.driver_id')
            .leftJoin(Transportation, 't', 't.id = s.transportation_id')
            .where('s.deleted_at IS NULL')
            .andWhere('s.id = :id', { id: id });

        let report = await query
            .getRawOne();

        if (!report) {
            statusCode = 404;
            throw new Error("Data tidak ditemukan.");
        }

        let documents = await connection.createQueryBuilder(SubmissionDocuments, 'sd')
            .select([
                `sd.id AS id`,
                `sd.type AS type`,
                `sd.path AS path`,
                `sd.doc_number AS doc_number`,
                `sd.created_at AS created_at`,
                `sd.updated_at AS updated_at`
            ])
            .where('sd.deleted_at IS NULL')
            .andWhere('sd.submission_id = :sid', { sid: report.id })
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

export const createSubmission = async (req, res) => {
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
            client_id: body.client_id,
            driver_id: body.driver_id,
            transportation_id: body.transportation_id,
            period: body.period,
            service_fee: body.service_fee,
            status: 1,
            created_at: moment.utc(),
            updated_at: moment.utc()
        }

        let storeSubmission = await queryRunner.manager
            .getRepository(Submission)
            .save(data);

        if (!storeSubmission) {
            throw new Error('Fail to create data.');
        }

        // MAPPING DRIVER DOCUMENT
        let submission_documents = [];
        let directory = `public/api/upload/attachments/submission/${storeSubmission.id}`;
        let directoryResult = `/api/upload/attachments/submission/${storeSubmission.id}`;

        checkAndCreateDirectory(directory);

        // Service Fee Document
        let service_fee_file = body.service_fee_file;
        let service_fee_file_name = service_fee_file.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
        fs.renameSync('./tmp/' + service_fee_file, directory + '/' + service_fee_file_name);

        submission_documents.push({
            submission_id: storeSubmission.id,
            type: 'service_fee',
            doc_number: '-',
            path: directoryResult + '/' + service_fee_file_name,
            created_at: moment(),
            updated_at: moment()
        });

        // Invoice
        let invoice_file = body.invoice_file;
        let invoice_file_name = invoice_file.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
        fs.renameSync('./tmp/' + invoice_file, directory + '/' + invoice_file_name);

        submission_documents.push({
            submission_id: storeSubmission.id,
            type: 'invoice',
            doc_number: '-',
            path: directoryResult + '/' + invoice_file_name,
            created_at: moment(),
            updated_at: moment()
        });

        // Provider
        let provider_file = body.provider_file;
        let provider_file_name = provider_file.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
        fs.renameSync('./tmp/' + provider_file, directory + '/' + provider_file_name);

        submission_documents.push({
            submission_id: storeSubmission.id,
            type: 'provider',
            doc_number: '-',
            path: directoryResult + '/' + provider_file_name,
            created_at: moment(),
            updated_at: moment()
        });

        // Transporter
        let transporter_file = body.transporter_file;
        let transporter_file_name = transporter_file.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
        fs.renameSync('./tmp/' + transporter_file, directory + '/' + transporter_file_name);

        submission_documents.push({
            submission_id: storeSubmission.id,
            type: 'transporter',
            doc_number: '-',
            path: directoryResult + '/' + transporter_file_name,
            created_at: moment(),
            updated_at: moment()
        });

        // Waste Receipt
        let waste_receipt_file = body.waste_receipt_file;
        let waste_receipt_file_name = waste_receipt_file.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
        fs.renameSync('./tmp/' + waste_receipt_file, directory + '/' + waste_receipt_file_name);

        submission_documents.push({
            submission_id: storeSubmission.id,
            type: 'waste_receipt',
            doc_number: '-',
            path: directoryResult + '/' + waste_receipt_file_name,
            created_at: moment(),
            updated_at: moment()
        });

        // BAST
        let bast_file = body.bast_file;
        let bast_file_name = bast_file.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
        fs.renameSync('./tmp/' + bast_file, directory + '/' + bast_file_name);

        submission_documents.push({
            submission_id: storeSubmission.id,
            type: 'bast',
            doc_number: '-',
            path: directoryResult + '/' + bast_file_name,
            created_at: moment(),
            updated_at: moment()
        });

        // Travel Document
        let travel_document_file = body.travel_document_file;
        let travel_document_file_name = travel_document_file.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
        fs.renameSync('./tmp/' + travel_document_file, directory + '/' + travel_document_file_name);

        submission_documents.push({
            submission_id: storeSubmission.id,
            type: 'travel_document',
            doc_number: '-',
            path: directoryResult + '/' + travel_document_file_name,
            created_at: moment(),
            updated_at: moment()
        });

        let storeSubmissionDocuments = await queryRunner.manager
            .getRepository(SubmissionDocuments)
            .save(submission_documents);

        if (!storeSubmissionDocuments) {
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

export const updateSubmission = async (req, res) => {
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
        let submission = await queryRunner.manager
            .findOne(Submission, { id: params.id, deleted_at: null });

        if (!submission) {
            statusCode = 404;
            throw new Error('Data tidak ditemukan.');
        }

        // Create Data
        let dataUpdated = {
            ...submission,
            client_id: body.client_id,
            driver_id: body.driver_id,
            transportation_id: body.transportation_id,
            period: body.period,
            service_fee: body.service_fee,
            updated_at: moment.utc()
        }

        const updateSubmission = await queryRunner.manager.save(Submission, dataUpdated);

        if (!updateSubmission) {
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

export const deleteSubmission = async (req, res) => {
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
        let query = await connection.update(Submission, { id: params.id, deleted_at: null }, {
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