import express from 'express';
import { login } from '../../controllers/api/authentication';
import { loginValidation } from './../../middleware/validator/auth';
import userRoute from './users';
import authRoute from './auth';
import driverRoute from './driver';
import transportationRoute from './transportation';
import wasteRoute from './waste';
import clientsRoute from './clients';
import submissionRoute from './submission';
import verifyToken from '../../middleware/authenticate';

const router = express.Router();

router.post('/login', loginValidation(), login);
router.use('/auth', [verifyToken], authRoute);

/* Router */
router.use('/users', [verifyToken], userRoute);
router.use('/driver', [verifyToken], driverRoute);
router.use('/transportation', [verifyToken], transportationRoute);
router.use('/waste', [verifyToken], wasteRoute);
router.use('/clients', [verifyToken], clientsRoute);
router.use('/submission', [verifyToken], submissionRoute);

module.exports = router;
