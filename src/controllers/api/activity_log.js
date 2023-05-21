import moment from 'moment-timezone';
import { getManager, getRepository } from "typeorm";
import ActivityLog from "../../entity/activity_log";
import { responseError, responseSuccess } from "../../utils/response";

export const createActivityLog = async (req, message, error_detail = null) => {
    try {
        // Create Data
        await getRepository(ActivityLog).save({
            description: message,
            ip: req.headers['x-forwarded-for'],
            user_agent: req.headers['user-agent'],
            status: error_detail ? false : true,
            error_detail: error_detail,
            created_at: moment(),
            updated_at: moment()
        });

        console.log('Success Create Activity Log.')
    } catch (error) {
        console.log('Fail to create Activity Log : ', error);
    }
}

export const getListActivityLog = async (req, res) => {
    // RESPONSE
    let response = {}
    let statusCode = 500;

    // CREATE TYPEORM CONNECTION
    const connection = getManager();

    try {
        // Query Params (Pagination)
        let {
            limit,
            page
        } = req.query;

        limit = limit ? parseInt(limit) : 10;
        page = page ? parseInt(page) : 1;
        const from = page == 1 ? 0 : page * limit - limit;

        let query = connection.createQueryBuilder(ActivityLog, 'al')
            .select([
                `al.id AS id`,
                `al.description AS description`,
                `al.user_agent AS user_agent`,
                `al.ip AS ip`,
                `al.status AS status`,
                `al.error_detail AS error_detail`,
                `al.created_at AS created_at`
            ]);

        let report = await query
            .orderBy('al.created_at', 'DESC')
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
            activity_log: report ? report : [],
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