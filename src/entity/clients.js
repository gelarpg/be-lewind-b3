const { EntitySchema, Index } = require('typeorm');

const Clients = new EntitySchema({
    name: "Clients",
    columns: {
        id: {
            primary: true,
            type: "int",
            generated: true,
            Index
        },
        waste_id: {
            type: "integer",
            Index
        },
        name: {
            type: "varchar",
            Index
        },
        address: {
            type: "text"
        },
        offer_number: {
            type: "varchar"
        },
        transaction_fee: {
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

module.exports = Clients;