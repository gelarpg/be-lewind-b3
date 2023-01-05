import express from 'express';
import { createTransportation, deleteTransportation, getDetailTransportation, getListTransportation, getListTransportationType, updateTransportation } from '../../controllers/api/transportation';
import { transportation } from '../../middleware/validator';
import { isSuper } from '../../middleware/guards';

const router = express.Router();

router.get('/list/type', getListTransportationType);
router.get('/', getListTransportation);
router.get('/detail/:id', getDetailTransportation);
router.post('/create', transportation.createTransportationValidation(), createTransportation);
router.put('/edit/:id', transportation.updateTransportationValidation(), updateTransportation);
router.delete('/delete/:id', deleteTransportation);

module.exports = router;