const { EntitySchema, Index } = require('typeorm');

const SubmissionDocuments = new EntitySchema({
    name: "SubmissionDocuments",
    columns: {
        id: {
            primary: true,
            type: "int",
            generated: true,
            Index
        },
        submission_id: {
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

module.exports = SubmissionDocuments;