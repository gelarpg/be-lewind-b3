import { getManager } from "typeorm";
import Submission from "../../entity/submission";
import { responseError, responseSuccess } from "../../utils/response";
import Transportation from "../../entity/transportation";
import Waste from "../../entity/waste";
import Driver from "../../entity/driver";
import Clients from "../../entity/clients";
import WasteType from "../../entity/waste_type";
import SubmissionDetails from "../../entity/submission_details";
import ClientsWaste from "../../entity/clients_waste";

export const getListDailyCount = async (req, res) => {
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

        let query = connection.createQueryBuilder(SubmissionDetails, 'sd')
            .select([
                `sd.id AS id`,
                `sd.period AS period`,
                `sd.qty AS qty`,
                `sd.total AS total`,
                `sd.doc_number AS doc_number`,
                `sd.transport_target AS transport_target`,
                `c.name AS client_name`,
                `c.company_name AS client_company_name`,
                `w.id AS waste_id`,
                `w.name AS waste_name`,
                `w.waste_code AS waste_code`,
                `w.weight_unit AS waste_weight_unit`,
                `cw.waste_cost AS waste_cost`,
                `wt.id AS waste_type_id`,
                `wt.name AS waste_type`,
                `d.id AS driver_id`,
                `d.name AS driver_name`,
                `t.id AS transportation_id`,
                `t.name AS transportation_name`,
                `t.no_police AS transportation_no_police`,
                `s.transfer_amount AS submission_transfer_amount`,
            ])
            .leftJoin(Submission, 's', 's.id = sd.submission_id')
            .leftJoin(Clients, 'c', 'c.id = s.client_id')
            .leftJoin(Waste, 'w', 'w.id = sd.waste_id')
            .leftJoin(ClientsWaste, 'cw', 'cw.client_id = s.client_id AND cw.waste_id = w.id')
            .leftJoin(WasteType, 'wt', 'wt.id = w.waste_type_id')
            .leftJoin(Driver, 'd', 'd.id = sd.driver_id')
            .leftJoin(Transportation, 't', 't.id = sd.transportation_id')
            .where('sd.deleted_at IS NULL');

        if (keyword) {
            query = query.andWhere('c.company_name ilike :keyword', { keyword: `%${keyword}%` });
            // query = query.andWhere(`TO_CHAR(s.created_at, 'YYYY-MM-DD') = '${moment(date).format('YYYY-MM-DD')}'`)
        }

        let report = await query
            .orderBy('sd.submission_id', 'ASC')
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

export const generateInvoice = async (req, res) => {
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

        let query = connection.createQueryBuilder(SubmissionDetails, 'sd')
            .select([
                `sd.id AS id`,
                `sd.period AS period`,
                `sd.qty AS qty`,
                `sd.total AS total`,
                `sd.doc_number AS doc_number`,
                `sd.transport_target AS transport_target`,
                `c.name AS client_name`,
                `c.company_name AS client_company_name`,
                `w.id AS waste_id`,
                `w.name AS waste_name`,
                `w.waste_code AS waste_code`,
                `w.weight_unit AS waste_weight_unit`,
                `cw.waste_cost AS waste_cost`,
                `wt.id AS waste_type_id`,
                `wt.name AS waste_type`,
                `d.id AS driver_id`,
                `d.name AS driver_name`,
                `t.id AS transportation_id`,
                `t.name AS transportation_name`,
                `t.no_police AS transportation_no_police`,
                `s.transfer_amount AS submission_transfer_amount`,
            ])
            .leftJoin(Submission, 's', 's.id = sd.submission_id')
            .leftJoin(Clients, 'c', 'c.id = s.client_id')
            .leftJoin(Waste, 'w', 'w.id = sd.waste_id')
            .leftJoin(ClientsWaste, 'cw', 'cw.client_id = s.client_id AND cw.waste_id = w.id')
            .leftJoin(WasteType, 'wt', 'wt.id = w.waste_type_id')
            .leftJoin(Driver, 'd', 'd.id = sd.driver_id')
            .leftJoin(Transportation, 't', 't.id = sd.transportation_id')
            .where('sd.deleted_at IS NULL');

        if (keyword) {
            query = query.andWhere('c.company_name ilike :keyword', { keyword: `%${keyword}%` });
            // query = query.andWhere(`TO_CHAR(s.created_at, 'YYYY-MM-DD') = '${moment(date).format('YYYY-MM-DD')}'`)
        }

        let report = await query
            .orderBy('sd.submission_id', 'ASC')
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