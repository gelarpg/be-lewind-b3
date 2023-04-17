const { EntitySchema, Index } = require('typeorm');

const ClientsWaste = new EntitySchema({
    name: "ClientsWaste",
    columns: {
        id: {
            primary: true,
            type: "int",
            generated: true,
            Index
        },
        client_id: {
            type: "integer",
            Index
        },
        waste_id: {
            type: "integer",
            Index
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

module.exports = ClientsWaste;