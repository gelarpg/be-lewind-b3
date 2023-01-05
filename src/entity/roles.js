const { EntitySchema, Column, PrimaryGeneratedColumn, ManyToOne, OneToMany, BaseEntity, Index } = require('typeorm');

const Roles = new EntitySchema({
    name: "Roles",
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
        },
        created_at: {
            type: "timestamp"
        },
        updated_at: {
            type: "timestamp"
        },
    }
});

module.exports = Roles;