const { EntitySchema, Index } = require('typeorm');

const Waste = new EntitySchema({
    name: "Waste",
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
        type: {
            type: "varchar"
        },
        weight_unit: {
            type: "varchar"
        },
        price_unit: {
            type: "double precision"
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

module.exports = Waste;