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
import WasteType from "../../entity/waste_type";
import { calculateDashboardInput } from "./dashboard";

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
            ])
            .where('ss.slug != :slug', { slug: 'pengajuan' });

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
            keyword,
            date
        } = req.query;

        limit = limit ? parseInt(limit) : 10;
        page = page ? parseInt(page) : 1;
        const from = page == 1 ? 0 : page * limit - limit;

        let query = connection.createQueryBuilder(Submission, 's')
            .select([
                `s.id AS id`,
                `s.period AS period`,
                `s.service_fee AS service_fee`,
                `s.travel_fee_status AS travel_fee`,
                `s.waste_cost AS waste_cost`,
                `s.status AS status`,
                `ss.name AS status_name`,
                `s.created_at AS created_at`,
                `s.updated_at AS updated_at`,
                `c.name AS client_name`,
                `d.name AS driver_name`,
                `t.name AS transportation_name`,
                `w.name AS waste_name`,
                `wt.name AS waste_type`,
            ])
            .leftJoin(Clients, 'c', 'c.id = s.client_id')
            .leftJoin(Waste, 'w', 'w.id = c.waste_id')
            .leftJoin(WasteType, 'wt', 'wt.id = w.waste_type_id')
            .leftJoin(Driver, 'd', 'd.id = s.driver_id')
            .leftJoin(Transportation, 't', 't.id = s.transportation_id')
            .leftJoin(SubmissionStatus, 'ss', 'ss.id = s.status')
            .where('s.deleted_at IS NULL')
            .andWhere('s.status = :status', { status: 1 });

        if (date) {
            query = query.andWhere(`TO_CHAR(s.created_at, 'YYYY-MM-DD') = '${moment(date).format('YYYY-MM-DD')}'`)
        }

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
                `s.travel_fee_status AS travel_fee`,
                `s.status AS status`,
                `s.waste_cost AS waste_cost`,
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
                `w.name AS waste_name`,
                `wt.id AS waste_type_id`,
                `wt.name AS waste_type`,
            ])
            .leftJoin(Clients, 'c', 'c.id = s.client_id')
            .leftJoin(Waste, 'w', 'w.id = c.waste_id')
            .leftJoin(WasteType, 'wt', 'wt.id = w.waste_type_id')
            .leftJoin(Driver, 'd', 'd.id = s.driver_id')
            .leftJoin(Transportation, 't', 't.id = s.transportation_id')
            .where('s.deleted_at IS NULL')
            .andWhere('s.id = :id', { id: id })
            .andWhere('s.status = :status', { status: 1 });

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
            waste_cost: body.waste_cost,
            // driver_id: body.driver_id,
            // transportation_id: body.transportation_id,
            // period: body.period,
            // service_fee: body.service_fee,
            // travel_fee_status: body.travel_fee,
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
        if (body.service_fee_file) {
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
        }

        // Invoice
        if (body.invoice_file) {
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
        }

        // Provider
        if (body.provider_file) {
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
        }

        // Transporter
        if (body.transporter_file) {
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
        }

        // Waste Receipt
        if (body.waste_receipt_file) {
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
        }

        // BAST
        if (body.bast_file) {
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
        }

        // Travel Document
        if (body.travel_document_file) {
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
        }

        if (submission_documents.length > 0) {
            let storeSubmissionDocuments = await queryRunner.manager
                .getRepository(SubmissionDocuments)
                .save(submission_documents);

            if (!storeSubmissionDocuments) {
                throw new Error('Fail to create data.');
            }
        }

        let calculateDashboard = await calculateDashboardInput(queryRunner, storeSubmission, 'create');

        if (!calculateDashboard) {
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
            updated_at: moment.utc()
        }

        if (body.client_id) {
            dataUpdated.client_id = body.client_id;
        }

        if (body.waste_cost) {
            dataUpdated.waste_cost = body.waste_cost;
        }

        if (body.driver_id) {
            dataUpdated.driver_id = body.driver_id;
        }

        if (body.transportation_id) {
            dataUpdated.transportation_id = body.transportation_id;
        }

        if (body.period) {
            dataUpdated.period = body.period;
        }

        if (body.service_fee) {
            dataUpdated.service_fee = body.service_fee;
        }

        if (body.travel_fee_status) {
            dataUpdated.travel_fee_status = body.travel_fee;
        }

        const updateSubmission = await queryRunner.manager.save(Submission, dataUpdated);

        if (!updateSubmission) {
            throw new Error('Gagal melakukan perubahan.');
        }

        // MAPPING DRIVER DOCUMENT
        let updated_docs = [];
        let submission_documents = [];
        let directory = `public/api/upload/attachments/submission/${submission.id}`;
        let directoryResult = `/api/upload/attachments/submission/${submission.id}`;

        checkAndCreateDirectory(directory);

        // Service Fee Document
        if (body.service_fee_file) {
            if (fs.existsSync('./tmp/' + body.service_fee_file)) {
                let service_fee_file = body.service_fee_file;
                let service_fee_file_name = service_fee_file.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
                fs.renameSync('./tmp/' + service_fee_file, directory + '/' + service_fee_file_name);

                submission_documents.push({
                    submission_id: submission.id,
                    type: 'service_fee',
                    doc_number: '-',
                    path: directoryResult + '/' + service_fee_file_name,
                    created_at: moment(),
                    updated_at: moment()
                });

                updated_docs.push('service_fee');
            } else {
                statusCode = 400;
                throw new Error(`File dengan nama ${body.service_fee_file} tidak tersedia.`);
            }
        }

        // Invoice
        if (body.invoice_file) {
            if (fs.existsSync('./tmp/' + body.invoice_file)) {
                let invoice_file = body.invoice_file;
                let invoice_file_name = invoice_file.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
                fs.renameSync('./tmp/' + invoice_file, directory + '/' + invoice_file_name);

                submission_documents.push({
                    submission_id: submission.id,
                    type: 'invoice',
                    doc_number: '-',
                    path: directoryResult + '/' + invoice_file_name,
                    created_at: moment(),
                    updated_at: moment()
                });

                updated_docs.push('invoice');
            } else {
                statusCode = 400;
                throw new Error(`File dengan nama ${body.invoice_file} tidak tersedia.`);
            }
        }

        // Provider
        if (body.provider_file) {
            if (fs.existsSync('./tmp/' + body.provider_file)) {
                let provider_file = body.provider_file;
                let provider_file_name = provider_file.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
                fs.renameSync('./tmp/' + provider_file, directory + '/' + provider_file_name);

                submission_documents.push({
                    submission_id: submission.id,
                    type: 'provider',
                    doc_number: '-',
                    path: directoryResult + '/' + provider_file_name,
                    created_at: moment(),
                    updated_at: moment()
                });

                updated_docs.push('provider');
            } else {
                statusCode = 400;
                throw new Error(`File dengan nama ${body.provider_file} tidak tersedia.`);
            }
        }

        // Transporter
        if (body.transporter_file) {
            if (fs.existsSync('./tmp/' + body.transporter_file)) {
                let transporter_file = body.transporter_file;
                let transporter_file_name = transporter_file.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
                fs.renameSync('./tmp/' + transporter_file, directory + '/' + transporter_file_name);

                submission_documents.push({
                    submission_id: submission.id,
                    type: 'transporter',
                    doc_number: '-',
                    path: directoryResult + '/' + transporter_file_name,
                    created_at: moment(),
                    updated_at: moment()
                });

                updated_docs.push('transporter');
            } else {
                statusCode = 400;
                throw new Error(`File dengan nama ${body.transporter_file} tidak tersedia.`);
            }
        }

        // Waste Receipt
        if (body.waste_receipt_file) {
            if (fs.existsSync('./tmp/' + body.waste_receipt_file)) {
                let waste_receipt_file = body.waste_receipt_file;
                let waste_receipt_file_name = waste_receipt_file.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
                fs.renameSync('./tmp/' + waste_receipt_file, directory + '/' + waste_receipt_file_name);

                submission_documents.push({
                    submission_id: submission.id,
                    type: 'waste_receipt',
                    doc_number: '-',
                    path: directoryResult + '/' + waste_receipt_file_name,
                    created_at: moment(),
                    updated_at: moment()
                });

                updated_docs.push('waste_receipt');
            } else {
                statusCode = 400;
                throw new Error(`File dengan nama ${body.waste_receipt_file} tidak tersedia.`);
            }
        }

        // BAST
        if (body.bast_file) {
            if (fs.existsSync('./tmp/' + body.bast_file)) {
                let bast_file = body.bast_file;
                let bast_file_name = bast_file.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
                fs.renameSync('./tmp/' + bast_file, directory + '/' + bast_file_name);

                submission_documents.push({
                    submission_id: submission.id,
                    type: 'bast',
                    doc_number: '-',
                    path: directoryResult + '/' + bast_file_name,
                    created_at: moment(),
                    updated_at: moment()
                });

                updated_docs.push('bast');
            } else {
                statusCode = 400;
                throw new Error(`File dengan nama ${body.bast_file} tidak tersedia.`);
            }
        }

        // Travel Document
        if (body.travel_document_file) {
            if (fs.existsSync('./tmp/' + body.travel_document_file)) {
                let travel_document_file = body.travel_document_file;
                let travel_document_file_name = travel_document_file.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
                fs.renameSync('./tmp/' + travel_document_file, directory + '/' + travel_document_file_name);

                submission_documents.push({
                    submission_id: submission.id,
                    type: 'travel_document',
                    doc_number: '-',
                    path: directoryResult + '/' + travel_document_file_name,
                    created_at: moment(),
                    updated_at: moment()
                });

                updated_docs.push('travel_document');
            } else {
                statusCode = 400;
                throw new Error(`File dengan nama ${body.travel_document_file} tidak tersedia.`);
            }
        }

        if (submission_documents.length > 0) {
            let dropExistingDocs = await queryRunner.manager
                .createQueryBuilder()
                .delete()
                .from(SubmissionDocuments)
                .where('submission_id = :id', { id: submission.id })
                .andWhere('type IN (:...type)', { type: updated_docs })
                .execute();

            if (!dropExistingDocs) {
                throw new Error('Fail to update data.');
            }

            let orderDocuments = await queryRunner.manager
                .getRepository(SubmissionDocuments)
                .save(submission_documents);

            if (!orderDocuments) {
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

export const approvalSubmission = async (req, res) => {
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
        // Request Body
        let { params } = req;

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
            status: 2,
            order_id: `PO-${moment.utc().unix()}`,
            updated_at: moment.utc()
        }

        const updateSubmissionStatus = await queryRunner.manager.save(Submission, dataUpdated);

        if (!updateSubmissionStatus) {
            throw new Error('Gagal melakukan perubahan.');
        }

        let calculateDashboard = await calculateDashboardInput(queryRunner, updateSubmissionStatus, 'create');

        if (!calculateDashboard) {
            throw new Error('Gagal melakukan perubahan.');
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

export const deleteSubmission = async (req, res) => {
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
        // Request Body
        let { params } = req;

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
            deleted_at: moment.utc()
        }

        const updateSubmissionStatus = await queryRunner.manager.save(Submission, dataUpdated);

        if (!updateSubmissionStatus) {
            throw new Error('Gagal menghapus data.');
        }

        let calculateDashboard = await calculateDashboardInput(queryRunner, updateSubmissionStatus, 'delete');

        if (!calculateDashboard) {
            throw new Error('Gagal menghapus data.');
        }

        // COMMIT TRANSACTION
        await queryRunner.commitTransaction();
        await queryRunner.release();

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

        res.status(response.meta.code).send(response);
        res.end();
    }
}