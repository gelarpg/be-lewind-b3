import { getConnection, getManager } from "typeorm";
import Submission from "../../entity/submission";
import { responseError, responseSuccess } from "../../utils/response";
import Transportation from "../../entity/transportation";
import Waste from "../../entity/waste";
import Driver from "../../entity/driver";
import Clients from "../../entity/clients";
import SubmissionStatus from "../../entity/submission_status";
import moment from "moment";
import SubmissionDocuments from "../../entity/submission_documents";
import WasteType from "../../entity/waste_type";

export const getListBills = async (req, res) => {
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
            status,
            payment_status,
            date
        } = req.query;

        limit = limit ? parseInt(limit) : 10;
        page = page ? parseInt(page) : 1;
        const from = page == 1 ? 0 : page * limit - limit;

        let query = connection.createQueryBuilder(Submission, 's')
            .select([
                `s.id AS id`,
                `s.order_id AS order_id`,
                `s.period AS period`,
                `s.service_fee AS service_fee`,
                `s.status AS status`,
                `s.payment_status AS payment_status`,
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
            .where('s.deleted_at IS NULL');


        if (status) {
            query = query.andWhere('s.status = :status', { status: status })
        } else {
            query = query.andWhere('s.status != :status', { status: 1 })
        }

        if (payment_status) {
            query = query.andWhere('s.payment_status = :payment_status', { payment_status: payment_status })
        }

        if (keyword) {
            query = query.andWhere('s.order_id ilike :keyword', { keyword: `%${keyword}%` });
        }

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

export const getDetailBills = async (req, res) => {
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
                `s.order_id AS order_id`,
                `s.period AS period`,
                `s.service_fee AS service_fee`,
                `s.status AS status`,
                `s.payment_status AS payment_status`,
                `ss.name AS status_name`,
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
            .leftJoin(SubmissionStatus, 'ss', 'ss.id = s.status')
            .where('s.deleted_at IS NULL')
            .andWhere('s.id = :id', { id: id })
            .andWhere('s.status != :status', { status: 1 });

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

export const updatePaymentStatus = async (req, res) => {
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
        let { params, body } = req;

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
            payment_status: submission.payment_status ? false : true,
            updated_at: moment.utc()
        }

        const updateSubmissionStatus = await queryRunner.manager.save(Submission, dataUpdated);

        if (!updateSubmissionStatus) {
            throw new Error('Gagal melakukan perubahan.');
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