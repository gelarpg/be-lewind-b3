import express from 'express';
import { waste } from '../../middleware/validator';
import { isSuper } from '../../middleware/guards';
import { createWaste, deleteWaste, getDetailWaste, getListWaste, updateWaste } from '../../controllers/api/waste';

const router = express.Router();

router.get('/', getListWaste);
router.get('/detail/:id', getDetailWaste);
router.post('/create', waste.createWasteValidation(), createWaste);
router.put('/edit/:id', waste.updateWasteValidation(), updateWaste);
router.delete('/delete/:id', deleteWaste);

module.exports = router;