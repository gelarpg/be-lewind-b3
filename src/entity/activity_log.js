const { EntitySchema, Column, PrimaryGeneratedColumn, ManyToOne, OneToMany, BaseEntity, Index } = require('typeorm');

const ActivityLog = new EntitySchema({
    name: "ActivityLog",
    columns: {
        id: {
            primary: true,
            type: "int",
            generated: true
        },
        description: {
            type: "text"
        },
        ip: {
            type: "varchar",
            default: null,
            Index
        },
        user_agent: {
            type: "varchar",
            Index
        },
        status: {
            type: "boolean",
            Index
        },
        error_detail: {
            type: "text",
            default: null
        },
        created_at: {
            type: "timestamp"
        },
        updated_at: {
            type: "timestamp"
        },
    }
});

module.exports = ActivityLog;