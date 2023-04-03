const { EntitySchema, Index } = require('typeorm');

const DriverDocuments = new EntitySchema({
    name: "DriverDocuments",
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
        type: {
            type: "varchar",
            Index
        },
        doc_number: {
            type: "varchar",
            nullable: true,
            default: null,
            Index
        },
        path: {
            type: "text"
        },
        validity_period: {
            type: "timestamp",
            nullable: true,
            default: null,
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

module.exports = DriverDocuments;