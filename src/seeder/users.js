const { hashSync } = require('bcrypt');

const usersSeed = [
    {
        name: 'Super Admin',
        first_name: 'Administartor',
        last_name: '',
        email: 'superadmin@bareskrim.id',
        password: hashSync('@ssw0rd1234567', 13),
        phone: '',
        ip: null,
        active: true,
        roles: [1],
        created_at: new Date,
        updated_at: new Date
    },
    {
        name: 'Admin Perencanaan',
        first_name: 'Admin',
        last_name: 'Perencanaan',
        email: 'adminperencanaan@b3.id',
        password: hashSync('P@ssw0rd1234567', 13),
        phone: '',
        ip: null,
        active: true,
        roles: [2],
        created_at: new Date,
        updated_at: new Date
    },
    {
        name: 'Admin Operasional',
        first_name: 'Admin',
        last_name: 'Operasional',
        email: 'adminoperasional@b3.id',
        password: hashSync('P@ssw0rd1234567', 13),
        phone: '',
        ip: null,
        active: true,
        roles: [3],
        created_at: new Date,
        updated_at: new Date
    },
    {
        name: 'Admin Direksi',
        first_name: 'Admin',
        last_name: 'Direksi',
        email: 'admindireksi@b3.id',
        password: hashSync('P@ssw0rd1234567', 13),
        phone: '',
        ip: null,
        active: true,
        roles: [4],
        created_at: new Date,
        updated_at: new Date
    }
];

export default usersSeed;