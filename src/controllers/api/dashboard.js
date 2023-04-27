import moment from "moment";
import { getRepository, getManager, Not, getConnection } from "typeorm";
import DashboardOrders from "../../entity/dashboard_orders";
import Submission from "../../entity/submission";
import SubmissionStatus from "../../entity/submission_status";
import Waste from "../../entity/waste";
import WasteType from "../../entity/waste_type";
import { responseError, responseSuccess } from "../../utils/response";

export const getDashbaords = async (req, res) => {
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

        // Query Params (Pagination)
        let {
            start_date,
            end_date
        } = req.query;

        start_date = start_date ? moment(start_date).format('YYYY-MM-DD 00:00:00') : moment().subtract(14, 'day').format('YYYY-MM-DD 00:00:00');
        end_date = end_date ? moment(end_date).format('YYYY-MM-DD 23:59:59') : moment().format('YYYY-MM-DD 23:59:59');

        /**
         * DASHBOARD ORDER PAYMENT STATUS
         */
        let paymentStatus = await connection.createQueryBuilder(Submission, 's')
            .select([
                's.payment_status as payment_status',
                'COUNT(s.payment_status)::int as total'
            ])
            .where('s.status IN (:...id)', {
                id: [5]
            })
            .andWhere('s.deleted_at IS NULL')
            .andWhere(`s.created_at >= :start_date`, {
                start_date: start_date
            })
            .andWhere(`s.created_at <= :end_date`, {
                end_date: end_date
            })
            .groupBy('s.payment_status')
            .getRawMany();

        let totalOrderPaymentStaus = 0;
        paymentStatus.forEach(e => totalOrderPaymentStaus += e.total);

        let paidPaymenStatus = paymentStatus.find(e => e.payment_status == true);
        let unpaidPaymenStatus = paymentStatus.find(e => e.payment_status == false);

        let dashboardPaymenstStatus = [
            {
                status: true,
                name: 'Dibayar',
                total: paidPaymenStatus ? paidPaymenStatus.total : 0,
                percentage: paidPaymenStatus ? (paidPaymenStatus.total / totalOrderPaymentStaus) * 100 : 0,
            },
            {
                status: false,
                name: 'Menuggu Pembayaran',
                total: unpaidPaymenStatus ? unpaidPaymenStatus.total : 0,
                percentage: unpaidPaymenStatus ? (unpaidPaymenStatus.total / totalOrderPaymentStaus) * 100 : 0,
            }
        ];

        /**
         * DASHBOARD CANCELED AND FINISHED
         */
        let canceledAndFinished = await connection.createQueryBuilder(Submission, 's')
            .select([
                's.status as status',
                'COUNT(s.status)::int as total'
            ])
            .where('s.status IN (:...id)', {
                id: [6, 5]
            })
            .andWhere('s.deleted_at IS NULL')
            .andWhere(`s.created_at >= :start_date`, {
                start_date: start_date
            })
            .andWhere(`s.created_at <= :end_date`, {
                end_date: end_date
            })
            .groupBy('s.status')
            .getRawMany();

        let totalOrderCanceledAndFinished = 0;
        canceledAndFinished.forEach(e => totalOrderCanceledAndFinished += e.total);

        let canceledOrders = canceledAndFinished.find(e => e.status == 6);
        let finishedOrders = canceledAndFinished.find(e => e.status == 5);

        let dashboardCanceledAndFinishedOrders = [
            {
                status: 5,
                name: 'Selesai',
                total: finishedOrders ? finishedOrders.total : 0,
                percentage: finishedOrders ? (finishedOrders.total / totalOrderCanceledAndFinished) * 100 : 0,
            },
            {
                status: 6,
                name: 'Dibatalkan',
                total: canceledOrders ? canceledOrders.total : 0,
                percentage: canceledOrders ? (canceledOrders.total / totalOrderCanceledAndFinished) * 100 : 0,
            }
        ];

        /**
         * DASHBOARD SUBMISSION
         */
        let submissionTotal = await connection.createQueryBuilder(DashboardOrders, 'do')
            .select([
                'do.status as status',
                'do.date as date',
                'do.total as total'
            ])
            .where('do.status = 1')
            .andWhere(`do.date >= :start_date`, {
                start_date: moment(start_date).format('YYYY-MM-DD')
            })
            .andWhere(`do.date <= :end_date`, {
                end_date: moment(end_date).format('YYYY-MM-DD')
            })
            .getRawMany();

        /**
         * DASHBOARD PROCESS
         */
        let processTotal = await connection.createQueryBuilder(DashboardOrders, 'do')
            .select([
                'do.status as status',
                'do.date as date',
                'do.total as total'
            ])
            .where('do.status = 2')
            .andWhere(`do.date >= :start_date`, {
                start_date: moment(start_date).format('YYYY-MM-DD')
            })
            .andWhere(`do.date <= :end_date`, {
                end_date: moment(end_date).format('YYYY-MM-DD')
            })
            .getRawMany();

        /**
         * DASHBOARD FINISHED
         */
        let finishedTotal = await connection.createQueryBuilder(DashboardOrders, 'do')
            .select([
                'do.status as status',
                'do.date as date',
                'do.total as total'
            ])
            .where('do.status = 5')
            .andWhere(`do.date >= :start_date`, {
                start_date: moment(start_date).format('YYYY-MM-DD')
            })
            .andWhere(`do.date <= :end_date`, {
                end_date: moment(end_date).format('YYYY-MM-DD')
            })
            .getRawMany();

        /**
         * DASHBOARD WASTE TYPE
         */
        let wasteType = await connection.createQueryBuilder(WasteType, 'wt')
            .select([
                'wt.id as id',
                'wt.name as name',
                `(
                    SELECT COUNT(w.id) 
                    FROM submission_details sd 
                    LEFT JOIN waste w
                        ON sd.waste_id = w.id
                    LEFT JOIN waste_type wt2
                        ON wt2.id = w.waste_type_id
                    WHERE wt2.id = wt.id 
                        AND sd.deleted_at IS NULL
                        AND sd.created_at >= '${start_date}'
                        AND sd.created_at <= '${end_date}')::int as total`
            ])
            .getRawMany();

        let result = {
            payment_status: dashboardPaymenstStatus,
            canceled_and_finished: dashboardCanceledAndFinishedOrders,
            submissions: submissionTotal,
            process: processTotal,
            finished: finishedTotal,
            waste: wasteType
        };

        response = responseSuccess(200, "Success!", result);

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

export const calculateDashboardInput = async (connection, data, type) => {
    try {
        // DASHBOARD
        let existingDashboardItem = await connection.manager
            .findOne(DashboardOrders, { date: moment().format('YYYY-MM-DD'), status: data.status });

        if (existingDashboardItem) {
            let total = existingDashboardItem.total;
            if (type == 'create') {
                total = total + 1;
            } else {
                total = total - 1;
            }

            let dashboardItem = {
                ...existingDashboardItem,
                total: total,
                updated_at: moment()
            }

            await connection.manager.save(DashboardOrders, dashboardItem);
        } else {
            let dashboardItem = {
                date: moment().format('YYYY-MM-DD'),
                status: data.status,
                total: 1,
                updated_at: moment()
            }

            await connection.manager.getRepository(DashboardOrders).save(dashboardItem);
        }

        return true;
    } catch (error) {
        console.log('CalculateDashboardInput: ', error);
        return false;
    }
}

export const generateDashboardOrders = async () => {
    console.log("[DASHBOARD]: GENERATING DASHBOARD ORDERS");

    const connection = getManager();

    try {
        let status = await connection.createQueryBuilder(SubmissionStatus, 'ss')
            .select([
                'ss.id as id',
                'ss.name as name'
            ])
            .getRawMany();

        console.log(status);

        for (const item of status) {
            // DASHBOARD
            let existingDashboardItem = await connection
                .findOne(DashboardOrders, { date: moment().format('YYYY-MM-DD'), status: item.id });

            if (!existingDashboardItem) {
                let dashboardItem = {
                    date: moment().format('YYYY-MM-DD'),
                    status: item.id,
                    total: 0,
                    updated_at: moment()
                }

                await connection.getRepository(DashboardOrders).save(dashboardItem);
            }
        }

        console.log('[DASHBOARD] : SUCCESS GENERATING DASHBOARD ORDERS');
    } catch (error) {
        console.log('DASHBOARD: ', error);
        console.log('[DASHBOARD] : FAIL TO GENERATE DASHBOARD ORDERS');
    }

}