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
import pdf from "pdf-creator-node";
import fs from "fs";
import path from "path";
import moment from "moment-timezone";
import * as roman from "roman-numbers";
import ucwords from "ucwords";
import angkaTerbilangJs from "@develoka/angka-terbilang-js";
import { checkAndCreateDirectory } from "../../middleware/helper";
import GeneratedInvoice from "../../entity/generated_invoice";

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
            date,
            start_date,
            end_date
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
            .where('sd.deleted_at IS NULL')
            .andWhere('s.status = 5');

        if (keyword) {
            query = query.andWhere('c.company_name ilike :keyword', { keyword: `%${keyword}%` });
        }

        if (start_date) {
            query = query.andWhere(`sd.period >= '${moment(start_date).format('YYYY-MM-DD 00:00:00')}'`)
        }

        if (end_date) {
            query = query.andWhere(`sd.period <= '${moment(end_date).format('YYYY-MM-DD 23:59:59')}'`)
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
        let {
            id
        } = req.body;

        let query = connection.createQueryBuilder(SubmissionDetails, 'sd')
            .select([
                `sd.id AS id`,
                `sd.period AS period_default`,
                `TO_CHAR(sd.period, 'dd-mm-yyyy') AS period`,
                `sd.qty AS qty`,
                `sd.total AS total`,
                `sd.doc_number AS doc_number`,
                `sd.transport_target AS transport_target`,
                `c.name AS client_name`,
                `c.company_name AS client_company_name`,
                `c.address AS client_address`,
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
            .where('sd.deleted_at IS NULL')
            .andWhere('sd.id IN (:...id)', {id: id});

        let report = await query
            .orderBy('sd.period', 'ASC')
            .getRawMany();

        // Read HTML Template
        var html = fs.readFileSync(path.join(__dirname+'../../../pdf_template/invoice.html'), "utf8");

        var options = {
            format: "A4",
            orientation: "portrait",
            // border: "10mm",
            // header: {
            //     height: "5mm"
            // },
            // footer: {
            //     height: "5mm",
            // }
        };

        let docsPeriod = moment(report[0].period_default).format('DD MMM YYYY');
        let docsPeriodStart = moment(report[0].period_default).format('DD MMM YYYY');
        let docsPeriodEnd = moment(report[report.length - 1].period_default).format('DD MMM YYYY');
        if (docsPeriodStart != docsPeriodEnd) {
            docsPeriod = `${docsPeriodStart} - ${docsPeriodEnd}`;
        }

        const formatIDR = (num) => {
            return (+num).toLocaleString('id-ID');
        };

        // Grouped Waste
        let listInvoiceResult = [];
        let groupedInvoice = arrayGroup(report, 'waste_name');
        let wastePriceTotal = 0;
        let wasteQtyTotal = 0;
        let no = 1;
        for (const key in groupedInvoice) {
            let invoice = groupedInvoice[key];
            let wasteQty = 0;
            let wastePriceByItem = 0;
            let wasteWeightUnit = 0;
            for (const invoiceItem of invoice) {
                wasteQty += invoiceItem.qty;
                wastePriceByItem = invoiceItem.waste_cost;
                wasteWeightUnit = invoiceItem.waste_weight_unit;
            }
            
            let invoiceItemResult = {
                no: no,
                waste_name: key,
                waste_qty: wasteQty,
                waste_price_by_item: formatIDR(wastePriceByItem),
                waste_weight_unit: wasteWeightUnit,
                waste_price_total: formatIDR(wastePriceByItem * wasteQty)
            };
            
            wastePriceTotal += wastePriceByItem * wasteQty;
            wasteQtyTotal += wasteQty;
            no = no+1;
            
            listInvoiceResult.push(invoiceItemResult);
        }

        let wastePricePpn = wastePriceTotal * 0.11;
        let invoicePriceTotal = wastePriceTotal + wastePricePpn;
        let invoicePriceTotalFormat = formatIDR(invoicePriceTotal);
        let invoicePriceTotalString = ucwords(angkaTerbilangJs(invoicePriceTotal));

        let companyName = report[0].client_company_name;
        let directory = `public/api/export/invoice/${companyName}`;
        let directoryRes = `api/export/invoice/${companyName}`;
        let fileName = `${companyName.replace(/ /g, '_')}_${moment().unix()}.pdf`;
        checkAndCreateDirectory(directory);
        var document = {
            html: html,
            data: {
                doc_date: moment().format('DD MMMM YYYY'),
                doc_number: `${moment().format('DDMM')}/SPI-LWD/${roman.arabToRoman(parseInt(moment().format('MM')))}/${moment().format('YYYY')}`,
                invoice_number: `${moment().format('DDMM')}/INV-LWD/${roman.arabToRoman(parseInt(moment().format('MM')))}/${moment().format('YYYY')}`,
                company_name: companyName,
                company_address: report[0].client_address,
                period: docsPeriod,
                invoice: {
                    price_before_ppn: formatIDR(wastePriceTotal),
                    price_total: invoicePriceTotalFormat,
                    price_total_string: invoicePriceTotalString,
                    price_ppn: formatIDR(wastePricePpn),
                    list: listInvoiceResult
                },
                data: report,
                waste_qty_total: wasteQtyTotal,
                date: moment().format(),
                marginttdpage2: `${450 - (report.length * 10)}px`
            },
            path: `./${directory}/${fileName}`,
            type: "",
        };

        await pdf.create(document, options)
            .then((res) => {
                console.log(res);
            })
            .catch((error) => {
                console.error(error);
            });

        await connection
            .getRepository(GeneratedInvoice)
            .save({
                company_name: companyName,
                start_date: docsPeriodStart,
                end_date: docsPeriodEnd,
                path: `${directoryRes}/${fileName}`
            }); 

        let result = {
            path: `${directoryRes}/${fileName}`,
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

export const getListGeneratedInvoice = async (req, res) => {
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

        let query = connection.createQueryBuilder(GeneratedInvoice, 'gi')
            .select([
                `gi.id AS id`,
                `gi.company_name AS company_name`,
                `gi.start_date AS start_date`,
                `gi.end_date AS end_date`,
                `gi.path AS path`,
                `gi.created_at AS created_at`
            ]);

        if (keyword) {
            query = query.andWhere('gi.company_name ilike :keyword', { keyword: `%${keyword}%` });
        }

        let report = await query
            .orderBy('gi.created_at', 'DESC')
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
            invoice: report ? report : [],
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

const arrayGroup = function(xs, key) {
    return xs.reduce(function(rv, x) {
      (rv[x[key]] = rv[x[key]] || []).push(x);
      return rv;
    }, {});
};