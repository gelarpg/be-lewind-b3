import { hashSync } from "bcrypt";
import { getConnection, getManager, getRepository } from "typeorm";
import Clients from "../../entity/clients";
import { responseError, responseSuccess } from "../../utils/response";
import { validate } from '../../middleware/validator';
import moment from "moment";
import Waste from "../../entity/waste";
import WasteType from "../../entity/waste_type";
import ClientsWaste from "../../entity/clients_waste";

export const getListClients = async (req, res) => {
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

        let query = connection.createQueryBuilder(Clients, 'c')
            .select([
                `c.id AS id`,
                `c.name AS name`,
                `c.company_name AS company_name`,
                `c.address AS address`,
                `c.offer_number AS offer_number`,
                `c.transaction_fee AS transaction_fee`,
                `c.created_at AS created_at`,
                `c.updated_at AS updated_at`
            ])
            .where('c.deleted_at IS NULL');

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
            clients: report ? report : [],
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

export const getDetailClients = async (req, res) => {
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

        let query = connection.createQueryBuilder(Clients, 'c')
            .select([
                `c.id AS id`,
                `c.name AS name`,
                `c.company_name AS company_name`,
                `c.address AS address`,
                `c.offer_number AS offer_number`,
                `c.transaction_fee AS transaction_fee`,
                `c.created_at AS created_at`,
                `c.updated_at AS updated_at`
            ])
            .where('c.deleted_at IS NULL')
            .andWhere('c.id = :id', { id: id });

        let report = await query
            .getRawOne();

        if (!report) {
            statusCode = 404;
            throw new Error("Data tidak ditemukan.");
        }

        let wasteList = await connection.createQueryBuilder(ClientsWaste, 'cw')
            .select([
                `cw.id AS id`,
                `cw.client_id AS client_id`,
                `cw.waste_id AS waste_id`,
                `cw.waste_cost AS waste_cost`,
                `w.name AS waste_name`,
                `wt.id AS waste_type_id`,
                `wt.name AS waste_type`,
                `w.weight_unit AS waste_weight_unit`
            ])
            .leftJoin(Waste, 'w', 'w.id = cw.waste_id')
            .leftJoin(WasteType, 'wt', 'wt.id = w.waste_type_id')
            .where('cw.deleted_at IS NULL')
            .andWhere('cw.client_id = :client_id', { client_id: report.id })
            .getRawMany();

        report['waste'] = wasteList;

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

export const createClients = async (req, res) => {
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
            company_name: body.company_name,
            // waste_id: body.waste_id,
            address: body.address,
            offer_number: body.offer_number,
            transaction_fee: body.transaction_fee,
            created_at: moment.utc(),
            updated_at: moment.utc()
        }

        let storeClients = await queryRunner.manager
            .getRepository(Clients)
            .save(data);

        if (!storeClients) {
            throw new Error('Fail to create data.');
        }

        let clients_waste = [];

        let wasteList = body.waste ? body.waste : [];
        if (wasteList.length > 0) {
            for (const item of wasteList) {
                clients_waste.push({
                    client_id: storeClients.id,
                    waste_id: item.id,
                    waste_cost: item.waste_cost,
                    created_at: moment().utc(),
                    updated_at: moment().utc()
                });
            }

            let storeClientsWaste = await queryRunner.manager
                .getRepository(ClientsWaste)
                .save(clients_waste);

            if (!storeClientsWaste) {
                throw new Error('Fail to create data.');
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

export const updateClients = async (req, res) => {
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
        let clients = await queryRunner.manager
            .findOne(Clients, { id: params.id, deleted_at: null });

        if (!clients) {
            statusCode = 404;
            throw new Error('Data tidak ditemukan.');
        }

        // Create Data
        let dataUpdated = {
            ...clients,
            name: body.name,
            company_name: body.company_name,
            waste_id: body.waste_id,
            address: body.address,
            offer_number: body.offer_number,
            transaction_fee: body.transaction_fee,
            updated_at: moment.utc()
        }

        const updateClients = await queryRunner.manager.save(Clients, dataUpdated);

        if (!updateClients) {
            throw new Error('Fail to update data.');
        }

        let clients_waste = [];

        let wasteList = body.waste ? body.waste : [];
        if (wasteList.length > 0) {
            for (const item of wasteList) {
                clients_waste.push({
                    client_id: clients.id,
                    waste_id: item.id,
                    waste_cost: item.waste_cost,
                    created_at: moment().utc(),
                    updated_at: moment().utc()
                });
            }

            let dropExistingClientWaste = await queryRunner.manager
                .createQueryBuilder()
                .delete()
                .from(ClientsWaste)
                .where('client_id = :id', { id: clients.id })
                .execute();

            if (!dropExistingClientWaste) {
                throw new Error('Fail to create data.');
            }

            let storeClientsWaste = await queryRunner.manager
                .getRepository(ClientsWaste)
                .save(clients_waste);

            if (!storeClientsWaste) {
                throw new Error('Fail to create data.');
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

export const deleteClients = async (req, res) => {
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
        let query = await connection.update(Clients, { id: params.id, deleted_at: null }, {
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