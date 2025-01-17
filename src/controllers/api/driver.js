import { hashSync } from "bcrypt";
import { getConnection, getManager, getRepository } from "typeorm";
import Driver from "../../entity/driver";
import { responseError, responseSuccess } from "../../utils/response";
import { validate } from '../../middleware/validator';
import moment from "moment-timezone";
import DriverDocuments from "../../entity/driver_documents";
import fs from 'fs';
import { checkAndCreateDirectory } from "../../middleware/helper";
import { createActivityLog } from "./activity_log";

export const getListDriver = async (req, res) => {
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
            driver: report ? report : [],
            paginator: paginator,
        };

        // Activity Log
        const messageLog = `Driver berhasil diakses oleh ${username}.`;
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
        const messageLog = `Driver gagal diakses oleh ${username}.`;
        createActivityLog(req, messageLog);

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
        role,
        username
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

        let documents = await connection.createQueryBuilder(DriverDocuments, 'dd')
            .select([
                `dd.id AS id`,
                `dd.type AS type`,
                `dd.path AS path`,
                `dd.doc_number AS doc_number`,
                `dd.validity_period AS validity_period`,
                `dd.created_at AS created_at`,
                `dd.updated_at AS updated_at`
            ])
            .where('dd.deleted_at IS NULL')
            .andWhere('dd.driver_id = :tid', { tid: report.id })
            .getRawMany();

        report['documents'] = documents;

        // Activity Log
        const messageLog = `Detail Driver berhasil diakses oleh ${username}.`;
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
        const messageLog = `Detail Driver gagal diakses oleh ${username}.`;
        createActivityLog(req, messageLog);

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

        // MAPPING DRIVER DOCUMENT
        let driver_documents = [];
        let directory = `public/api/upload/attachments/driver/${storeDriver.id}`;
        let directoryResult = `/api/upload/attachments/driver/${storeDriver.id}`;

        checkAndCreateDirectory(directory);

        // KTP
        let ktp_file = body.ktp_file;
        let ktp_file_name = ktp_file.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
        fs.renameSync('./tmp/' + ktp_file, directory + '/' + ktp_file_name);

        driver_documents.push({
            driver_id: storeDriver.id,
            type: 'ktp',
            doc_number: body.ktp_number,
            path: directoryResult + '/' + ktp_file_name,
            created_at: moment(),
            updated_at: moment()
        });

        // SIM
        let sim_file = body.sim_file;
        let sim_file_name = sim_file.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
        fs.renameSync('./tmp/' + sim_file, directory + '/' + sim_file_name);

        driver_documents.push({
            driver_id: storeDriver.id,
            type: 'sim',
            doc_number: body.sim_number,
            validity_period: moment(body.sim_validity_period),
            path: directoryResult + '/' + sim_file_name,
            created_at: moment(),
            updated_at: moment()
        });

        let storeDriverDocuments = await queryRunner.manager
            .getRepository(DriverDocuments)
            .save(driver_documents);

        if (!storeDriverDocuments) {
            throw new Error('Fail to create data.');
        }

        // COMMIT TRANSACTION
        await queryRunner.commitTransaction();
        await queryRunner.release();

        // Activity Log
        const messageLog = `Berhasil menambahkan data driver oleh ${username}.`;
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
        
        // Activity Log
        const messageLog = `Gagal menambahkan data driver oleh ${username}.`;
        createActivityLog(req, messageLog);

        // COMMIT TRANSACTION
        await queryRunner.rollbackTransaction();
        await queryRunner.release();

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
        let driver = await queryRunner.manager
            .findOne(Driver, { where:{id: params.id, deleted_at: null} });

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

        // MAPPING DRIVER DOCUMENT
        let driver_documents = [];
        let updated_docs = [];
        let directory = `public/api/upload/attachments/driver/${driver.id}`;
        let directoryResult = `/api/upload/attachments/driver/${driver.id}`;

        checkAndCreateDirectory(directory);

        // KTP
        if (body.ktp_file || body.ktp_number) {
            let ktp_file_name = null;
            if (body.ktp_file) {
                if (fs.existsSync('./tmp/' + body.ktp_file)) {
                    let ktp_file = body.ktp_file;
                    ktp_file_name = ktp_file.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
                    fs.renameSync('./tmp/' + ktp_file, directory + '/' + ktp_file_name);
                } else {
                    statusCode = 400;
                    throw new Error(`File dengan nama ${body.ktp_file} tidak tersedia.`);
                }
            }

            // Get Existing Data
            let driverDocsKTP = await queryRunner.manager
                .findOne(DriverDocuments, {where:{ driver_id: driver.id, deleted_at: null, type: 'ktp'} });

            driver_documents.push({
                driver_id: driver.id,
                type: 'ktp',
                doc_number: body.ktp_number ? body.ktp_number : driverDocsKTP.doc_number,
                path: ktp_file_name ? directoryResult + '/' + ktp_file_name : driverDocsKTP.path,
                created_at: moment(),
                updated_at: moment()
            });

            updated_docs.push('ktp');
        }

        // SIM
        if (body.sim_file || body.sim_number || body.sim_validity_period) {
            let sim_file_name = null;
            if (body.sim_file) {
                if (fs.existsSync('./tmp/' + body.sim_file)) {
                    let sim_file = body.sim_file;
                    sim_file_name = sim_file.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
                    fs.renameSync('./tmp/' + sim_file, directory + '/' + sim_file_name);
                } else {
                    statusCode = 400;
                    throw new Error(`File dengan nama ${body.sim_file} tidak tersedia.`);
                }
            }

            // Get Existing Data
            let driverDocsSIM = await queryRunner.manager
                .findOne(DriverDocuments, { where:{driver_id: driver.id, deleted_at: null, type: 'sim'} });

            driver_documents.push({
                driver_id: driver.id,
                type: 'sim',
                doc_number: body.sim_number ? body.sim_number : driverDocsSIM.doc_number,
                validity_period: body.sim_validity_period ? moment(body.sim_validity_period) : driverDocsSIM.validity_period,
                path: sim_file_name ? directoryResult + '/' + sim_file_name : driverDocsSIM.path,
                created_at: moment(),
                updated_at: moment()
            });

            updated_docs.push('sim');
        }

        if (driver_documents.length > 0) {
            let dropExistingDocs = await queryRunner.manager
                .createQueryBuilder()
                .delete()
                .from(DriverDocuments)
                .where('driver_id = :id', { id: driver.id })
                .andWhere('type IN (:...type)', { type: updated_docs })
                .execute();

            if (!dropExistingDocs) {
                throw new Error('Fail to update data.');
            }

            let driverDocuments = await queryRunner.manager
                .getRepository(DriverDocuments)
                .save(driver_documents);

            if (!driverDocuments) {
                throw new Error('Fail to update data.');
            }
        }

        // COMMIT TRANSACTION
        await queryRunner.commitTransaction();
        await queryRunner.release();

        // Activity Log
        const messageLog = `Berhasil memperbaharui data driver oleh ${username}.`;
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

        // Activity Log
        const messageLog = `Gagal memperbaharui data driver oleh ${username}.`;
        createActivityLog(req, messageLog);

        // COMMIT TRANSACTION
        await queryRunner.rollbackTransaction();
        await queryRunner.release();

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
        role,
        username
    } = req.user;

    try {
        // Request Body
        let { params } = req;

        // Create Data
        let query = await connection.update(Driver, { id: params.id }, {
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
        const messageLog = `Berhasil menghapus data driver oleh ${username}.`;
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
        const messageLog = `Gagal menghapus data driver oleh ${username}.`;
        createActivityLog(req, messageLog);

        res.status(response.meta.code).send(response);
        res.end();
    }
}