const { EntitySchema, Column, PrimaryGeneratedColumn, ManyToOne, OneToMany, BaseEntity, Index } = require('typeorm');

const DashboardOrders = new EntitySchema({
    name: "Dashboard_Orders",
    columns: {
        id: {
            primary: true,
            type: "int",
            generated: true,
        },
        status: {
            type: "int",
        },
        date: {
            type: "varchar"
        },
        total: {
            type: "int",
        },
        updated_at: {
            type: "timestamp"
        }
    }
});

module.exports = DashboardOrders;
