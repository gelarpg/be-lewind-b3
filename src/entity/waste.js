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
        waste_type_id: {
            type: "integer",
            nullable: true,
            default: null,
            Index
        },
        name: {
            type: "varchar",
            Index
        },
        weight_unit: {
            type: "varchar"
        },
        price_unit: {
            type: "double precision",
            default: 0,
            nullable: true,
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