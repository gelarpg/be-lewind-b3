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
        driver_id: {
            type: "integer",
            Index
        },
        client_id: {
            type: "integer",
            Index
        },
        transportation_id: {
            type: "integer",
            Index
        },
        period: {
            type: "date"
        },
        service_fee: {
            type: "double precision"
        },
        status: {
            type: "boolean"
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