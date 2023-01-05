const { EntitySchema, Index } = require('typeorm');

const SubmissionStatus = new EntitySchema({
    name: "SubmissionStatus",
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
            type: "varchar",
            Index
        }
    }
});

module.exports = SubmissionStatus;