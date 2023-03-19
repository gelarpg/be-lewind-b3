import { getManager } from "typeorm";
import Submission from "../../entity/submission";
import { responseError, responseSuccess } from "../../utils/response";
import Transportation from "../../entity/transportation";
import Waste from "../../entity/waste";
import Driver from "../../entity/driver";
import Clients from "../../entity/clients";
import SubmissionStatus from "../../entity/submission_status";

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
                `s.payment_status AS payment_status`,
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
                `w.name AS waste_name`
            ])
            .leftJoin(Clients, 'c', 'c.id = s.client_id')
            .leftJoin(Waste, 'w', 'w.id = c.waste_id')
            .leftJoin(Driver, 'd', 'd.id = s.driver_id')
            .leftJoin(Transportation, 't', 't.id = s.transportation_id')
            .leftJoin(SubmissionStatus, 'ss', 'ss.id = s.status')
            .where('s.deleted_at IS NULL')
            .andWhere('s.id = :id', { id: id });

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