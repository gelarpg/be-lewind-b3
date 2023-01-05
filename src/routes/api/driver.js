import express from 'express';
import { createDriver, deleteDriver, getDetailDriver, getListDriver, updateDriver } from '../../controllers/api/driver';
import { driver } from '../../middleware/validator';
import { isSuper } from '../../middleware/guards';

const router = express.Router();

router.get('/', getListDriver);
router.get('/detail/:id', getDetailDriver);
router.post('/create', driver.createDriverValidation(), createDriver);
router.put('/edit/:id', driver.updateDriverValidation(), updateDriver);
router.delete('/delete/:id', deleteDriver);

module.exports = router;