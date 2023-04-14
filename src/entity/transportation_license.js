const { EntitySchema, Index } = require('typeorm');

const TransportationLicense = new EntitySchema({
    name: "TransportationLicense",
    columns: {
        id: {
            primary: true,
            type: "int",
            generated: true,
            Index
        },
        transportation_id: {
            type: "integer",
            Index
        },
        validity_period_kir: {
            type: "timestamp",
            nullable: true,
            default: null,
        },
        validity_period_stnk: {
            type: "timestamp",
            nullable: true,
            default: null,
        },
        validity_period_rekom: {
            type: "timestamp",
            nullable: true,
            default: null,
        },
        validity_period_supervision_card: {
            type: "timestamp",
            nullable: true,
            default: null,
        },
        validity_period_departement_permit: {
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

module.exports = TransportationLicense;