const { EntitySchema, Index } = require('typeorm');

const Transportation = new EntitySchema({
    name: "Transportation",
    columns: {
        id: {
            primary: true,
            type: "int",
            generated: true,
            Index
        },
        transportation_type_id: {
            type: "integer",
            Index
        },
        name: {
            type: "varchar",
            Index
        },
        no_police: {
            type: "varchar",
            Index
        },
        year: {
            type: "varchar"
        },
        capacity: {
            type: "int"
        },
        fuel_type: {
            type: "varchar"
        },
        active: {
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

module.exports = Transportation;