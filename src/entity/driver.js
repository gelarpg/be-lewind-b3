const { EntitySchema, Index } = require('typeorm');

const Driver = new EntitySchema({
    name: "Driver",
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
        age: {
            type: "int"
        },
        phone_number: {
            type: "varchar"
        },
        address: {
            type: "text"
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

module.exports = Driver;