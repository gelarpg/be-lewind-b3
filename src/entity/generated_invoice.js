const { EntitySchema, Index } = require('typeorm');

const GeneratedInvoice = new EntitySchema({
    name: "GeneratedInvoice",
    columns: {
        id: {
            primary: true,
            type: "int",
            generated: true,
            Index
        },
        company_name: {
            type: "varchar",
            Index
        },
        start_date: {
            type: "varchar"
        },
        end_date: {
            type: "varchar"
        },
        path: {
            type: "varchar"
        },
        created_at: {
            type: "timestamp",
            nullable: true,
            default: null,
        }
    }
});

module.exports = GeneratedInvoice;