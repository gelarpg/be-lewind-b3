import { createConnection, getRepository, getManager, Transaction, QueryBuilder } from "typeorm";
import { hashSync } from 'bcrypt';
import Roles from '../entity/roles';
import Users from '../entity/users';
import SubmissionStatus from "../entity/submission_status";
import TransportationType from "../entity/transportation_type";
import WasteType from "../entity/waste_type";

const seeder = async (req, res) => {
    try {
        const roleRepository = getRepository(Roles);
        const userRepository = getRepository(Users);
        const submissionStatusRepository = getRepository(SubmissionStatus);
        const transportationTypeRepository = getRepository(TransportationType);
        const wasteTypeRepository = getRepository(WasteType);

        const allRoles = await roleRepository.find();
        const allUsers = await userRepository.find();
        const allSubmissionStatus = await submissionStatusRepository.find();
        const allTransportationType = await transportationTypeRepository.find();
        const allWasteType = await wasteTypeRepository.find();

        if (allRoles.length <= 0 && allUsers.length <= 0) {
            let role1 = {
                id: 1,
                name: "Super Admin",
                slug: "super_admin",
                created_at: new Date(),
                updated_at: new Date()
            };

            let role2 = {
                id: 2,
                name: "Perencanaan",
                slug: "perencanaan",
                created_at: new Date(),
                updated_at: new Date()
            };

            let role3 = {
                id: 3,
                name: "Operasional",
                slug: "operasional",
                created_at: new Date(),
                updated_at: new Date()
            };

            let role4 = {
                id: 4,
                name: "Direksi",
                slug: "direksi",
                created_at: new Date(),
                updated_at: new Date()
            };

            let roles1 = await roleRepository.save(role1);
            let roles2 = await roleRepository.save(role2);
            let roles3 = await roleRepository.save(role3);
            let roles4 = await roleRepository.save(role4);

            console.log("SUCCESS CREATED DATA ROLES");

            let admin1 = {
                name: 'Super Admin',
                first_name: 'Administartor',
                last_name: '',
                email: 'superadmin@b3.id',
                password: hashSync('P@ssw0rd1234567', 13),
                phone: '',
                ip: null,
                active: true,
                roles: [roles1],
                created_at: new Date,
                updated_at: new Date
            };
            let admin2 = {
                name: 'Admin Perencanaan',
                first_name: 'Admin',
                last_name: 'Perencanaan',
                email: 'adminperencanaan@b3.id',
                password: hashSync('P@ssw0rd1234567', 13),
                phone: '',
                ip: null,
                active: true,
                roles: [roles2],
                created_at: new Date,
                updated_at: new Date
            };
            let admin3 = {
                name: 'Admin Operasional',
                first_name: 'Admin',
                last_name: 'Operasional',
                email: 'adminoperasional@b3.id',
                password: hashSync('P@ssw0rd1234567', 13),
                phone: '',
                ip: null,
                active: true,
                roles: [roles3],
                created_at: new Date,
                updated_at: new Date
            };
            let admin4 = {
                name: 'Admin Direksi',
                first_name: 'Admin',
                last_name: 'Direksi',
                email: 'admindireksi@b3.id',
                password: hashSync('P@ssw0rd1234567', 13),
                phone: '',
                ip: null,
                active: true,
                roles: [roles4],
                created_at: new Date,
                updated_at: new Date
            };

            await userRepository.save(admin1);
            await userRepository.save(admin2);
            await userRepository.save(admin3);
            await userRepository.save(admin4);

            console.log("SUCCESS CREATED DATA USERS ADMIN");

        }

        if (allSubmissionStatus.length <= 0) {
            let submission_status = [
                {
                    name: 'Pengajuan',
                    slug: 'pengajuan'
                },
                {
                    name: 'Prosess',
                    slug: 'prosess'
                },
                {
                    name: 'Waiting Pickup',
                    slug: 'waiting_pickup'
                },
                {
                    name: 'Pickup',
                    slug: 'pickup'
                },
                {
                    name: 'Selesai',
                    slug: 'selesai'
                },
                {
                    name: 'Dibatalkan',
                    slug: 'dibatalkan'
                }
            ];

            await submissionStatusRepository.save(submission_status);

            console.log("SUCCESS CREATED DATA SUBMISSION STATUS");
        }

        if (allTransportationType.length <= 0) {
            let transportation_type = [
                {
                    name: 'Dump Truck',
                    slug: 'dump_truck',
                    created_at: new Date(),
                    updated_at: new Date()
                }
            ];

            await transportationTypeRepository.save(transportation_type);

            console.log("SUCCESS CREATED DATA SUBMISSION STATUS");
        }

        if (allWasteType.length <= 0) {
            let waste_type = [
                {
                    name: 'Limbah Cair',
                    slug: 'limbah_cair',
                    created_at: new Date(),
                    updated_at: new Date()
                },
                {
                    name: 'Limbah Padat',
                    slug: 'limbah_padat',
                    created_at: new Date(),
                    updated_at: new Date()
                },
                {
                    name: 'Limbah Organik',
                    slug: 'limbah_organik',
                    created_at: new Date(),
                    updated_at: new Date()
                },
                {
                    name: 'Limbah Daur Ulang',
                    slug: 'limbah_daur_ulang',
                    created_at: new Date(),
                    updated_at: new Date()
                },
                {
                    name: 'Limbah Berbahaya',
                    slug: 'limbah_berbahaya',
                    created_at: new Date(),
                    updated_at: new Date()
                },
                {
                    name: 'Lainnya',
                    slug: 'lainnya',
                    created_at: new Date(),
                    updated_at: new Date()
                }
            ];

            await wasteTypeRepository.save(waste_type);

            console.log("SUCCESS CREATED DATA WASTE TYPE");
        }

        let findUserKeuangan = await userRepository.findOne({username: 'admin_keuangan'});
        if (!findUserKeuangan) {
            console.log("CREATE DATA USERS ADMIN KEUANGAN");

            let role5 = {
                id: 5,
                name: "Admin Keuangan",
                slug: "admin_keuangan",
                created_at: new Date(),
                updated_at: new Date()
            };

            let roles5 = await roleRepository.save(role5);

            let admin5 = {
                name: 'Admin Keuangan',
                first_name: 'Admin',
                last_name: 'Keuangan',
                email: 'adminkeuangan@b3.id',
                password: hashSync('P@ssw0rd1234567', 13),
                phone: '',
                ip: null,
                active: true,
                roles: [roles5],
                created_at: new Date,
                updated_at: new Date
            };

            await userRepository.save(admin5);

            console.log("SUCCESS CREATED DATA USERS ADMIN KEUANGAN");
        }

    } catch (error) {
        console.log("Error seed", error);
    }
}

export default seeder;