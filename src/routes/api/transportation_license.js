import express from 'express';
import { transportation_license } from '../../middleware/validator';
import { isSuper } from '../../middleware/guards';
import { createTransportationLicense, deleteTransportationLicense, getDetailTransportationLicense, getListTransportationLicense, updateTransportationLicense } from '../../controllers/api/tranportation_license';

const router = express.Router();

router.get('/', getListTransportationLicense);
router.get('/detail/:id', getDetailTransportationLicense);
router.post('/create', transportation_license.createTransportationLicenseValidation(), createTransportationLicense);
router.put('/edit/:id', transportation_license.updateTransportationLicenseValidation(), updateTransportationLicense);
router.delete('/delete/:id', deleteTransportationLicense);

module.exports = router;