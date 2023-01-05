const { EntitySchema, Index, nullable } = require('typeorm');

const Users = new EntitySchema({
    name: "Users",
    columns: {
        id: {
            primary: true,
            type: "int",
            generated: true,
            Index
        },
        first_name: {
            type: "varchar",
            length: 50,
        },
        last_name: {
            type: "varchar",
            length: 50,
        },
        email: {
            type: "varchar",
            length: 50,
            Index
        },
        ip: {
            type: "varchar",
            length: 50,
            nullable: true
        },
        password: {
            type: "varchar",
            length: 250
        },
        phone: {
            type: "varchar",
            length: 50,
            nullable: true,
            default: null
        },
        token: {
            type: "varchar",
            length: 500,
            nullable: true
        },
        active: {
            type: "boolean",
            default: false
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
            default: null,
            nullable: true
        }
    },
    relations: {
        roles: {
            target: "Roles",
            name: "user_roles",
            type: "many-to-many",
            joinTable: {
                joinColumn: {
                    name: "user_id",
                    referencedColumnName: "id"
                },
                inverseJoinColumn: {
                    name: "role_id",
                    referencedColumnName: "id"
                }
            },
            cascade: true
        }
    }
});

module.exports = Users;