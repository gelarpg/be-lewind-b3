import express from 'express';
import { login } from '../../controllers/api/authentication';
import { loginValidation } from './../../middleware/validator/auth';
import userRoute from './users';
import authRoute from './auth';
import driverRoute from './driver';
import transportationRoute from './transportation';
import transportationLicenseRoute from './transportation_license';
import wasteRoute from './waste';
import clientsRoute from './clients';
import submissionRoute from './submission';
import ordersRoute from './orders';
import billsRoute from './bills';
import dashboardRoute from './dashboard';
import verifyToken from '../../middleware/authenticate';
import { uploadFile } from '../../controllers/api/attachment';
import upload from '../../middleware/attachment';

const router = express.Router();

router.post('/login', loginValidation(), login);
router.use('/auth', [verifyToken], authRoute);

// ATTACHMENT
router.post('/upload-attachment', verifyToken, upload.array('files'), uploadFile);

/* Router */
router.use('/dashboard', [verifyToken], dashboardRoute);
router.use('/users', [verifyToken], userRoute);
router.use('/driver', [verifyToken], driverRoute);
router.use('/transportation', [verifyToken], transportationRoute);
router.use('/transportation-license', [verifyToken], transportationLicenseRoute);
router.use('/waste', [verifyToken], wasteRoute);
router.use('/clients', [verifyToken], clientsRoute);
router.use('/submission', [verifyToken], submissionRoute);
router.use('/orders', [verifyToken], ordersRoute);
router.use('/bills', [verifyToken], billsRoute);

module.exports = router;
