const { EntitySchema, Index } = require('typeorm');

const TransportationType = new EntitySchema({
    name: "TransportationType",
    columns: {
        id: {
            primary: true,
            type: "int",
            generated: true,
            Index
        },
        name: {
            type: "varchar",
            Index
        },
        slug: {
            type: "varchar"
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

module.exports = TransportationType;