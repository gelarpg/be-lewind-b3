const { EntitySchema, Index } = require('typeorm');

const Submission = new EntitySchema({
    name: "Submission",
    columns: {
        id: {
            primary: true,
            type: "int",
            generated: true,
            Index
        },
        order_id: {
            type: "varchar",
            default: null,
            nullable: true,
            Index
        },
        driver_id: {
            type: "integer",
            default: null,
            nullable: true,
            Index
        },
        client_id: {
            type: "integer",
            Index
        },
        transportation_id: {
            type: "integer",
            default: null,
            nullable: true,
            Index
        },
        period: {
            type: "date",
            default: null,
            nullable: true
        },
        service_fee: {
            type: "double precision",
            default: null,
            nullable: true
        },
        status: {
            type: "integer",
            default: null,
            nullable: true
        },
        payment_status: {
            type: "boolean",
            default: false,
            nullable: true
        },
        travel_fee_status: {
            type: "boolean",
            default: false,
            nullable: true
        },
        created_at: {
            type: "timestamp",
            nullable: true,
            default: null,
        },
        updated_at: {
            type: "timestamp",
            nullable: true,
            default: null,
        },
        deleted_at: {
            type: "timestamp",
            nullable: true,
            default: null,
        },
    }
});

module.exports = Submission;