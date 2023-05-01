const { EntitySchema, Index } = require('typeorm');

const SubmissionDetails = new EntitySchema({
    name: "SubmissionDetails",
    columns: {
        id: {
            primary: true,
            type: "int",
            generated: true,
            Index
        },
        submission_id: {
            type: "integer",
            default: null,
            nullable: true,
            Index
        },
        waste_id: {
            type: "integer",
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
        qty: {
            type: "integer",
            Index
        },
        total: {
            type: "double precision",
            default: null,
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

module.exports = SubmissionDetails;